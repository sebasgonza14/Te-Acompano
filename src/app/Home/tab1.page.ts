import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  userEmail: string = '';

  constructor(private navCtrl: NavController, private popoverController: PopoverController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.userEmail = currentUser.email || '';
    }
  }

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

  goTocanales() {
    this.navCtrl.navigateForward('/canales'); // Navega a la página de Citas
  }
}