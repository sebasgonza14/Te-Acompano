import { Component } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private navCtrl: NavController , private popoverController: PopoverController) {}

  logout() {
    this.popoverController.dismiss(); // Cierra el popover
    this.navCtrl.navigateRoot('/login'); // Redirige a la página de login
  }

  goToFeedback() {
    this.navCtrl.navigateForward('/tabs/feedback');
  }

  goTocalendario() {
    this.navCtrl.navigateForward('/calendario'); // Navega a la página de Citas
  }

}
