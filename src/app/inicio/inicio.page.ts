import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  navigateToTareas() {
    this.navCtrl.navigateForward('/tareas');
  }

  navigateToChat() {
    this.navCtrl.navigateForward('/chat');
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login'); // Redirige a la página de login
  }

  ngOnInit() {
  }

}
