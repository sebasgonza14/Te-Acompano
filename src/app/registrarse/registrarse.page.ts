import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController // Añadir AlertController al constructor
  ) {}

  register() {
    this.firebaseService.register(this.email, this.password)
      .then(() => {
        this.presentAlert('Éxito', 'Usuario creado con éxito.');
        this.router.navigate(['/iniciar-sesion']); // Redirigir al usuario después del registro exitoso
      })
      .catch(error => {
        this.presentAlert('Error', 'No se pudo registrar. Por favor intente nuevamente.');
        console.error('Error en registrarse:', error);
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

  ngOnInit() {}
}
