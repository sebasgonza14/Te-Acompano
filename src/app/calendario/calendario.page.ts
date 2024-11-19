import { Component } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage {
  selectedDate: string | null = null; // Fecha seleccionada
  task: string = ''; // Tarea a asignar
  tasks: Array<{ fecha: string; tarea: string }> = []; // Lista de tareas

  constructor(private firestore: Firestore) {
    this.loadTasks();
  }

  // Detectar cambios en la fecha seleccionada
  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  // Guardar tarea en Firebase
  async saveTask() {
    if (this.selectedDate && this.task) {
      const docRef = collection(this.firestore, 'Calendario');
      await addDoc(docRef, {
        fecha: this.selectedDate,
        tarea: this.task,
      });

      alert('Tarea guardada exitosamente!');
      this.task = ''; // Limpiar el campo de tarea
      this.loadTasks(); // Recargar las tareas
    } else {
      alert('Por favor selecciona una fecha y escribe una tarea.');
    }
  }

  // Cargar tareas desde Firebase
  async loadTasks() {
    const docRef = collection(this.firestore, 'Calendario');
    const querySnapshot = await getDocs(docRef);
    this.tasks = querySnapshot.docs.map((doc) => doc.data() as { fecha: string; tarea: string });
  }
}
