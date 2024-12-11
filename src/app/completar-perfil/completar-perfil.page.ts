import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.page.html',
  styleUrls: ['./completar-perfil.page.scss'],
})
export class CompletarPerfilPage {
  parent = {
    nombre: '',
    apellido: '',
    parentesco: '',
  };

  child = {
    nombre: '',
    apellido: '',
  };

  constructor(
    private firestore: Firestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async submitForm() {
    const childCode = this.generateCode(); // Generar el código del niño

    // Preparar los datos para guardar en Firestore
    const userData = {
      parent: this.parent,
      child: {
        ...this.child,
        code: childCode, // Código único del niño
      },
    };

    try {
      // Referencia a la colección 'users' en Firestore
      const usersCollection = collection(this.firestore, 'users');
      // Agregar el documento
      await addDoc(usersCollection, userData);

      // Mostrar el código en un alert
      const alert = await this.alertCtrl.create({
        header: 'Código Generado',
        message: `El código para iniciar sesión del niño es: <strong>${childCode}</strong>`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // Redirigir al home de padres después de guardar
              this.navCtrl.navigateRoot('/tabs');
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar la información. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  // Método para generar un código único de 4 dígitos
  generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

