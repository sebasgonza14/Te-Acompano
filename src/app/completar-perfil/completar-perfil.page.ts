import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';

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
    premium: '10.00',
    gold: '20.00',
  };

  constructor(
    private firestore: Firestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadPayPalButton();
  }

  async submitForm() {
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

  loadPayPalButton() {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AZXE4b4Ov1ALlcTr3hWiE-urbPfq_RU1KtUFD8GmlnFfVw4pLCzN9hFgtrBBypf6rWhSNX9mC9fJwMZO&currency=USD';
    
    script.onload = () => {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          // Solo mostrar pagos si es premium o gold
          if (this.selectedVersion === 'free') {
            alert('La versión gratuita no requiere pago.');
            return false;
          }
  
          // Verificar que la versión seleccionada existe en versionPrices
          const price = this.versionPrices[this.selectedVersion as keyof typeof this.versionPrices];
          if (!price) {
            console.error('Versión seleccionada no válida.');
            alert('Ocurrió un problema al procesar el pago. Intenta de nuevo.');
            return false;
          }
  
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: price, // Monto según la versión seleccionada
              },
            }],
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
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }
}
