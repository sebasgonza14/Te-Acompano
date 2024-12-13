import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-consejos',
  templateUrl: './consejos.page.html',
  styleUrls: ['./consejos.page.scss'],
})
export class ConsejosPage implements OnInit {
  messages: Array<{ user: string; text: string }> = []; // Lista de consejos
  newMessage: string = ''; // Nuevo consejo a enviar
  currentUser: { nombre: string; apellido: string } | null = null; // Usuario actual

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    await this.loadCurrentUser(); // Cargar el usuario actual
    this.loadMessages(); // Cargar los consejos en tiempo real
  }

  // Cargar los datos del usuario actual desde Firebase
  async loadCurrentUser() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const userDoc = doc(this.firestore, 'users', user.uid); // Asume que el UID del usuario es la clave del documento
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          this.currentUser = {
            nombre: data?.['parent']?.['nombre'] || 'Usuario',
            apellido: data?.['parent']?.['apellido'] || '',
          };
          console.log('Usuario actual cargado:', this.currentUser);
        } else {
          console.warn('El documento del usuario no existe en Firebase.');
        }
      } else {
        console.warn('No hay usuario autenticado actualmente.');
      }
    } catch (error) {
      console.error('Error al cargar el usuario actual:', error);
    }
  }

  // Cargar mensajes desde Firebase
  loadMessages() {
    try {
      const messagesRef = collection(this.firestore, 'consejos'); // Colección en Firestore
      const q = query(messagesRef, orderBy('timestamp', 'asc')); // Ordenar por fecha ascendente
      onSnapshot(q, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => doc.data() as { user: string; text: string });
        console.log('Consejos cargados:', this.messages);
      });
    } catch (error) {
      console.error('Error al cargar consejos:', error);
    }
  }

  // Enviar un mensaje
  async sendMessage() {
    try {
      if (this.newMessage.trim() !== '' && this.currentUser) {
        const messagesRef = collection(this.firestore, 'consejos'); // Colección en Firestore
        await addDoc(messagesRef, {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`, // Nombre y apellido del usuario actual
          text: this.newMessage.trim(),
          timestamp: new Date(), // Registrar la hora del mensaje
        });
        console.log('Consejo enviado:', {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`,
          text: this.newMessage.trim(),
        });

        this.newMessage = ''; // Limpiar el campo de entrada
      } else {
        console.warn('El mensaje está vacío o el usuario no está autenticado.');
        alert('No se pudo enviar el mensaje. Verifica que estás autenticado.');
      }
    } catch (error) {
      console.error('Error al enviar el consejo:', error);
    }
  }
}
