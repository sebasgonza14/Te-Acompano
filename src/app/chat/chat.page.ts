import { Component, OnInit } from '@angular/core';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messages: Message[] = [];
  newMessage = '';

  ngOnInit() {
    this.startChat();
  }

  startChat() {
    // Mensaje de bienvenida al iniciar la conversación
    this.messages.push({
      content: '¡Hola! Soy Lala, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot'
    });

    // Mensaje de introducción adicional
    setTimeout(() => {
      this.messages.push({
        content: 'Puedes preguntarme sobre tus actividades, tareas o cualquier otra cosa.',
        sender: 'bot'
      });
    }, 2000);
  }

  sendMessage() {
    if (this.newMessage.trim().length === 0) return;

    // Agrega el mensaje del usuario
    this.messages.push({ content: this.newMessage, sender: 'user' });
    const userMessage = this.newMessage.toLowerCase();
    this.newMessage = '';

    // Respuesta automática del bot
    setTimeout(() => {
      this.respondToMessage(userMessage);
    }, 1000);
  }

  respondToMessage(userMessage: string) {
    // Lógica básica de respuestas automáticas
    let botResponse = 'Lo siento, no entiendo esa pregunta. ¿Puedes reformularla?';

    if (userMessage.includes('tareas')) {
      botResponse = 'Hoy tienes las siguientes tareas: Despertar, vestirse y comer.';
    } else if (userMessage.includes('hola')) {
      botResponse = '¡Hola de nuevo! ¿En qué más te puedo ayudar?';
    } else if (userMessage.includes('gracias')) {
      botResponse = '¡De nada! Estoy aquí para ayudarte.';
    }

    this.messages.push({ content: botResponse, sender: 'bot' });
  }
}
