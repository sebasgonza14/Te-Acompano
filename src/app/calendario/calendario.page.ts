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
  childCode: string | null = null; // Código del niño asociado

  constructor(private firestore: Firestore, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.userUID = currentUser.uid; // Obtener UID del usuario

      // Obtener el childCode del usuario actual
      try {
        this.childCode = await this.firebaseService.getChildCode(this.userUID);
        if (this.childCode) {
          console.log('ChildCode encontrado:', this.childCode);
          await this.loadTasks();
        } else {
          console.log('No se encontró un ChildCode.');
        }
      } catch (error) {
        console.error('Error al obtener el ChildCode:', error);
      }
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
      if (!this.childCode) {
        alert('No se encontró un ChildCode válido. Intenta iniciar sesión nuevamente.');
        return;
      }

      try {
        // Referencia al documento del childCode
        const docRef = doc(this.firestore, `Calendario/${this.childCode}`);
        const userDoc = await getDoc(docRef);

        let existingTasks: Array<{ fecha: string; tarea: string }> = [];
        if (userDoc.exists()) {
          // Si el documento existe, obtenemos las tareas actuales
          existingTasks = userDoc.data()['tasks'] || [];
        }

        // Verificar si la tarea ya existe para la fecha seleccionada
        const taskExists = existingTasks.some(task => task.fecha === this.selectedDate && task.tarea === this.task);
        if (taskExists) {
          alert('La tarea ya existe para la fecha seleccionada.');
          return;
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
      } catch (error) {
        console.error('Error al guardar la tarea:', error);
        alert('Hubo un error al guardar la tarea. Intenta nuevamente.');
      }
    } else {
      alert('Por favor selecciona una fecha y escribe una tarea.');
    }
  }

  // Cargar tareas desde Firebase
  async loadTasks() {
    if (!this.childCode) {
      console.error('No se puede cargar tareas sin un ChildCode válido.');
      return;
    }

    try {
      const docRef = doc(this.firestore, `Calendario/${this.childCode}`);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        this.tasks = userDoc.data()['tasks'] || [];
      } else {
        this.tasks = [];
      }
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      alert('No se pudieron cargar las tareas. Intenta nuevamente.');
    }
  }
}
