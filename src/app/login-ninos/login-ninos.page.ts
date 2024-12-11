import { Component } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-ninos',
  templateUrl: './login-ninos.page.html',
  styleUrls: ['./login-ninos.page.scss'],
})
export class LoginNinosPage {
  code = '';

  constructor(private firestore: Firestore, private navCtrl: NavController, private alertCtrl: AlertController) {}

  async loginWithCode() {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('child.code', '==', this.code));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Código no válido.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.navCtrl.navigateRoot('/inicio'); // Redirige al portal de niños
    }
  }
}
