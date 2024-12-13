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
  userName: string = ''; // Nuevo: Almacena el nombre del usuario
  userVersion: string = 'free'; // Versión predeterminada

  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      console.log('Usuario actual UID:', currentUser.uid);
      this.userEmail = currentUser.email || '';
      await this.loadUserData(currentUser.uid); // Ahora también carga el nombre del usuario
    } else {
      console.error('No se encontró un usuario autenticado.');
    }
  }

  async loadUserData(uid: string) {
    try {
      console.log('Cargando datos del usuario para UID:', uid); // Verifica el UID
      const userData = await this.firebaseService.getUserData(uid);
  
      if (userData) {
        this.userName = userData.parent?.nombre || 'Usuario'; // Obtiene el nombre del usuario
        this.userVersion = userData.version || 'free'; // Obtiene la versión o asigna 'free' por defecto
        console.log('Nombre del usuario:', this.userName);
        console.log('Versión del usuario:', this.userVersion); // Verifica la versión en la consola
      } else {
        console.warn('No se encontraron datos del usuario. Usando valores predeterminados.');
        this.userName = 'Usuario';
        this.userVersion = 'free';
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      this.userName = 'Usuario';
      this.userVersion = 'free'; // Fallback a valores predeterminados
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

  goToEditarPerfil() {
    this.navCtrl.navigateForward('/editar-perfil'); // Navegar a la página de editar perfil
  }
  
}
