import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-acompanamiento',
  templateUrl: './acompanamiento.page.html',
  styleUrls: ['./acompanamiento.page.scss'],
})
export class AcompanamientoPage implements OnInit {
  messages: Array<{ user: string; text: string }> = []; // Lista de mensajes
  newMessage: string = ''; // Nuevo mensaje a enviar
  currentUser: { nombre: string; apellido: string } | null = null; // Usuario actual

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    await this.loadCurrentUser(); // Cargar el usuario actual
    this.loadMessages(); // Cargar los mensajes en tiempo real
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
      const messagesRef = collection(this.firestore, 'acompanamiento'); // Colección en Firestore
      const q = query(messagesRef, orderBy('timestamp', 'asc')); // Ordenar por fecha ascendente
      onSnapshot(q, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => doc.data() as { user: string; text: string });
        console.log('Mensajes cargados:', this.messages);
      });
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }

  // Enviar un mensaje
  async sendMessage() {
    try {
      if (this.newMessage.trim() !== '' && this.currentUser) {
        const messagesRef = collection(this.firestore, 'acompanamiento'); // Colección en Firestore
        await addDoc(messagesRef, {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`, // Nombre y apellido del usuario actual
          text: this.newMessage.trim(),
          timestamp: new Date(), // Registrar la hora del mensaje
        });
        console.log('Mensaje enviado:', {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`,
          text: this.newMessage.trim(),
        });

        this.newMessage = ''; // Limpiar el campo de entrada
      } else {
        console.warn('El mensaje está vacío o el usuario no está autenticado.');
        alert('No se pudo enviar el mensaje. Verifica que estás autenticado.');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}
