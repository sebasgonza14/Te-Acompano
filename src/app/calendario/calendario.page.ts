import { Component } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage {
  selectedDate: string | null = null; // Fecha seleccionada
  task: string = ''; // Tarea a asignar
  tasks: Array<{ fecha: string; tarea: string }> = []; // Lista de tareas
  userUID: string = ''; // UID del usuario autenticado

  constructor(private firestore: Firestore, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.userUID = currentUser.uid; // Obtener UID del usuario
      this.loadTasks(); // Cargar tareas del usuario
    } else {
      console.error('No se encontró un usuario autenticado.');
    }
  }

  // Detectar cambios en la fecha seleccionada
  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  // Guardar tarea en Firebase
  async saveTask() {
    if (this.selectedDate && this.task) {
      if (!this.userUID) {
        alert('No se pudo identificar al usuario. Intenta iniciar sesión nuevamente.');
        return;
      }

      // Referencia al documento del usuario
      const docRef = doc(this.firestore, `Calendario/${this.userUID}`);
      const userDoc = await getDoc(docRef);

      let existingTasks: Array<{ fecha: string; tarea: string }> = [];
      if (userDoc.exists()) {
        // Si el documento existe, obtenemos las tareas actuales
        existingTasks = userDoc.data()['tasks'] || []; // Usar notación de corchetes
      }

      // Agregar la nueva tarea a las existentes
      const updatedTasks = [
        ...existingTasks,
        { fecha: this.selectedDate, tarea: this.task },
      ];

      // Actualizar el documento
      await setDoc(docRef, { tasks: updatedTasks }, { merge: true });

      alert('Tarea guardada exitosamente!');
      this.task = ''; // Limpiar el campo de tarea
      this.loadTasks(); // Recargar las tareas
    } else {
      alert('Por favor selecciona una fecha y escribe una tarea.');
    }
  }

  // Cargar tareas desde Firebase
  async loadTasks() {
    if (!this.userUID) return;

    const docRef = doc(this.firestore, `Calendario/${this.userUID}`);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      this.tasks = userDoc.data()['tasks'] || []; // Usar notación de corchetes
    } else {
      this.tasks = [];
    }
  }
}
