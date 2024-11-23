import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {
  messages: Array<{ user: string; text: string }> = []; // Lista de mensajes
  newMessage: string = ''; // Nuevo mensaje a enviar

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadMessages(); // Cargar mensajes en tiempo real
  }

  // Cargar mensajes desde Firebase
  loadMessages() {
    const messagesRef = collection(this.firestore, 'preguntas-frecuentes'); // Colección en Firestore
    const q = query(messagesRef, orderBy('timestamp', 'asc')); // Ordenar por fecha ascendente
    onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => doc.data() as { user: string; text: string });
    });
  }

  // Enviar un mensaje
  async sendMessage() {
    if (this.newMessage.trim() !== '') {
      const messagesRef = collection(this.firestore, 'preguntas-frecuentes'); // Colección en Firestore
      await addDoc(messagesRef, {
        user: 'Usuario', // Puedes personalizar esto con nombres reales
        text: this.newMessage.trim(),
        timestamp: new Date(), // Registrar la hora del mensaje
      });

      this.newMessage = ''; // Limpiar el campo de entrada
    } else {
      alert('El mensaje no puede estar vacío.');
    }
  }
}
