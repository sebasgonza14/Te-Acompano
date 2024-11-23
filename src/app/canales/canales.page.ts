import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-canales',
  templateUrl: './canales.page.html',
  styleUrls: ['./canales.page.scss'],
})
export class CanalesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  // Navegar a la página de Preguntas
  navigateToPreguntas() {
    this.navCtrl.navigateForward(['/preguntas']);
  }

  // Navegar a la página de Consejos
  navigateToConsejos() {
    this.navCtrl.navigateForward(['/consejos']);
  }

  navigateToAcompanamiento() {
    this.navCtrl.navigateForward(['/acompanamiento']);
  }
  

  ngOnInit() {
  }
}

