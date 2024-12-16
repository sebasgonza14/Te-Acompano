import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router'; // Importa el Router


@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  userData: any = {}; // Almacenará los datos del usuario
  userId: string = ''; // UID del usuario actual

  constructor(private firebaseService: FirebaseService, private firestore: Firestore, private router: Router ) {}

  async ngOnInit() {
    // Obtener el usuario actual
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.uid; // Guardar el UID del usuario
      await this.loadUserData(); // Cargar datos del usuario
    } else {
      console.error('No se encontró un usuario autenticado.');
    }
  }

  async loadUserData() {
    try {
      // Obtener referencia al documento del usuario en Firestore
      const userDocRef = doc(this.firestore, `users/${this.userId}`);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        this.userData = userSnap.data(); // Guardar los datos del usuario
        console.log('Datos del usuario:', this.userData);
      } else {
        console.warn('No se encontraron datos para este usuario.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  logout() {
    localStorage.clear(); // Borra el almacenamiento local
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
