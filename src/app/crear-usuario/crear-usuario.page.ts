import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage {
  usuario = {
    nombre: '',
    edad: null,
    celular: '',
    parentesco: '',
    usuario: '', // Nuevo campo para nombre de usuario
    contrasena: '' // Nuevo campo para contraseña
  };

  constructor(private firestore: Firestore, private toastController: ToastController) {}

  async crearUsuario() {
    try {
      // Transformar los campos para coincidir con los esperados en `data-view`
      const usuarioData = {
        Nombre: this.usuario.nombre,
        Edad: this.usuario.edad,
        Celular: this.usuario.celular,
        Parentesco: this.usuario.parentesco,
        Usuario: this.usuario.usuario, // Guardar el nombre de usuario
        Contraseña: this.usuario.contrasena, // Guardar la contraseña
        ID: this.generarID(),
      };

      // Referencia a la colección "Familiares"
      const familiaresRef = collection(this.firestore, 'Familiares');
      
      // Agregar usuario a la colección
      await addDoc(familiaresRef, usuarioData);

      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: 'Usuario creado con éxito',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      // Limpiar formulario
      this.usuario = {
        nombre: '',
        edad: null,
        celular: '',
        parentesco: '',
        usuario: '',
        contrasena: ''
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);

      // Mostrar mensaje de error
      const toast = await this.toastController.create({
        message: 'Error al crear usuario',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  generarID() {
    // Genera un ID único para el usuario
    return Math.random().toString(36).substr(2, 9);
  }
}
