import { Component } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-ninos',
  templateUrl: './login-ninos.page.html',
  styleUrls: ['./login-ninos.page.scss'],
})
export class LoginNinosPage {
  code = ''; // Código ingresado por el usuario

  constructor(private firestore: Firestore, private navCtrl: NavController, private alertCtrl: AlertController) {}

  async loginWithCode() {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('child.code', '==', this.code)); // Buscar por código del niño

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Mostrar alerta si el código no es válido
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Código no válido.',
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        // Obtener datos del primer documento encontrado
        const childData = querySnapshot.docs[0].data()['child']; // Accede al campo 'child' del documento usando corchetes
        localStorage.setItem('childName', childData.nombre); // Guarda el nombre del niño en localStorage

        console.log('Nombre del niño guardado:', childData.nombre);

        // Redirigir a la página de inicio
        this.navCtrl.navigateRoot('/inicio');
      }
    } catch (error) {
      console.error('Error al buscar el código:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Ocurrió un error al procesar el código.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login'); // Redirige a la pestaña 
  }
}
