import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'; // Importa doc y setDoc
import { NavController, AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service'; // Importa el servicio de Firebase

declare var paypal: any; // Declaramos PayPal para integrarlo con su SDK

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.page.html',
  styleUrls: ['./completar-perfil.page.scss'],
})
export class CompletarPerfilPage implements OnInit {
  parent = {
    nombre: '',
    apellido: '',
    parentesco: '',
  };

  child = {
    nombre: '',
    apellido: '',
  };

  selectedVersion: string = 'free'; // Versión seleccionada por defecto

  versionPrices: { [key: string]: string } = {
    premium: '7.99',
    gold: '11.99',
  };

  constructor(
    private firestore: Firestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService // Inyecta el servicio de Firebase
  ) {}

  ngOnInit() {
    this.loadPayPalButton();
  }

  async submitForm() {
    const currentUser = this.firebaseService.getCurrentUser(); // Obtén el usuario autenticado
    if (!currentUser) {
      alert('Error: No se encontró un usuario autenticado.');
      return;
    }

    const uid = currentUser.uid; // Obtén el UID del usuario autenticado
    const childCode = this.generateCode(); // Generar el código del niño

    // Preparar los datos para guardar en Firestore
    const userData = {
      parent: this.parent,
      child: {
        ...this.child,
        code: childCode, // Código único del niño
      },
      version: this.selectedVersion, // Guardar la versión seleccionada
    };

    try {
      // Guarda el documento en Firestore con el UID como identificador
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, userData);

      // Mostrar el código en un alert
      const alert = await this.alertCtrl.create({
        header: 'Registro Exitoso',
        message: `Guarda este código ya que les servira para iniciar sesión del niño, CODIGO: ${childCode}`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
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

  loadPayPalButton() {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AZXE4b4Ov1ALlcTr3hWiE-urbPfq_RU1KtUFD8GmlnFfVw4pLCzN9hFgtrBBypf6rWhSNX9mC9fJwMZO&currency=USD';

    script.onload = () => {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          if (this.selectedVersion === 'free') {
            alert('La versión gratuita no requiere pago.');
            return false;
          }

          const price = this.versionPrices[this.selectedVersion as keyof typeof this.versionPrices];
          if (!price) {
            console.error('Versión seleccionada no válida.');
            alert('Ocurrió un problema al procesar el pago. Intenta de nuevo.');
            return false;
          }

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: price,
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Pago completado con éxito por ' + details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error('Error con el pago: ', err);
          alert('Hubo un problema con el pago. Intenta de nuevo.');
        },
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }
}
