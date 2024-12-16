import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  childName = ''; // Nombre del niño
  childCode = ''; // Código del niño ingresado por el usuario

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Recuperar el nombre y código del niño almacenado en localStorage
    this.childName = localStorage.getItem('childName') || 'Usuario';
    this.childCode = localStorage.getItem('childCode') || '';
  }

  // Guardar el childCode ingresado por el niño
  saveChildCode() {
    if (this.childCode.trim()) {
      localStorage.setItem('childCode', this.childCode.trim());
      alert('Código registrado correctamente.');
    } else {
      alert('Por favor, ingresa un código válido.');
    }
  }

  // Navegar a la página de tareas
  navigateToTareas() {
    if (!localStorage.getItem('childCode')) {
      alert('Por favor registra un código antes de continuar.');
      return;
    }
    this.navCtrl.navigateForward('/tareas');
  }

  // Navegar a la página de chat
  navigateToChat() {
    this.navCtrl.navigateForward('/chat');
  }

  // Navegar a la página de login
  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }
}
