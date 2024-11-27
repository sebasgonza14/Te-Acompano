import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController // Añadir AlertController aquí
  ) { }

  login() {
    this.firebaseService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/tabs/tab1']); // Redirigir al usuario después del login exitoso
      })
      .catch(error => {
        this.presentAlert('Error', 'No se pudo iniciar sesión. Por favor verifica tus credenciales.');
        console.error('Error en iniciar sesión:', error);
      });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
  }
}
