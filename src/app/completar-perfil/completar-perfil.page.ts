import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

declare var paypal: any;

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
  isPaymentCompleted: boolean = false; // Controla si el botón "Continuar" está habilitado

  versionPrices: { [key: string]: string } = {
    premium: '7.99',
    gold: '11.99',
  };

  constructor(
    private firestore: Firestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadPayPalButton();
    this.onVersionChange(); // Evalúa la versión inicial seleccionada
  }

  onVersionChange() {
    if (this.selectedVersion === 'free') {
      this.isPaymentCompleted = true;
    } else {
      this.isPaymentCompleted = false;
    }
  }

  async submitForm() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (!currentUser) {
      alert('Error: No se encontró un usuario autenticado.');
      return;
    }

    const uid = currentUser.uid;
    const childCode = this.generateCode();

    const userData = {
      parent: this.parent,
      child: {
        ...this.child,
        code: childCode,
      },
      version: this.selectedVersion,
    };

    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, userData);

      const alert = await this.alertCtrl.create({
        header: 'Registro Exitoso',
        message: `Guarda este código: ${childCode}`,
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
        message: 'No se pudo guardar la información.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

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
            return null;
          }

          const price = this.versionPrices[this.selectedVersion as keyof typeof this.versionPrices];
          if (!price) {
            alert('Ocurrió un problema al procesar el pago.');
            return null;
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
        onApprove: async (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Pago completado con éxito por ' + details.payer.name.given_name);
            this.isPaymentCompleted = true; // Activa el botón al completar el pago
          });
        },
        onCancel: () => {
          alert('El pago fue cancelado.');
        },
        onError: (err: any) => {
          alert('Hubo un problema con el pago.');
        },
      }).render('#paypal-button-container');
    };

    document.body.appendChild(script);
  }
}
