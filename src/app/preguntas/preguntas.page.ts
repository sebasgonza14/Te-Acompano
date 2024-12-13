import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {
  messages: Array<{ user: string; text: string }> = [];
  newMessage: string = '';
  currentUser: { nombre: string; apellido: string } | null = null; // Datos del usuario actual

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    await this.loadCurrentUser(); // Cargar los datos del usuario actual
    this.loadMessages(); // Cargar mensajes en tiempo real
  }

  // Obtener los datos del usuario actual desde Firebase
  async loadCurrentUser() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        console.log('UID del usuario autenticado:', user.uid);
        const userDoc = doc(this.firestore, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          this.currentUser = {
            nombre: data?.['parent']?.['nombre'] || 'Usuario', // Acceso con corchetes
            apellido: data?.['parent']?.['apellido'] || '' // Acceso con corchetes
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
      const messagesRef = collection(this.firestore, 'preguntas-frecuentes');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      onSnapshot(q, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => doc.data() as { user: string; text: string });
      });
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }

  // Enviar un mensaje
  async sendMessage() {
    try {
      if (this.newMessage.trim() !== '' && this.currentUser && this.currentUser.nombre) {
        const messagesRef = collection(this.firestore, 'preguntas-frecuentes');
        await addDoc(messagesRef, {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`, // Usar el nombre y apellido
          text: this.newMessage.trim(),
          timestamp: new Date(),
        });
        console.log('Mensaje enviado:', {
          user: `${this.currentUser.nombre} ${this.currentUser.apellido}`,
          text: this.newMessage.trim()
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
