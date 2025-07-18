import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {
  tasks: Array<{ fecha: string; tarea: string }> = []; // Lista de tareas
  currentDate: string = ''; // Fecha actual formateada
  childCode: string = ''; // Código del niño

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.childCode = localStorage.getItem('childCode') || ''; // Recuperar el código del niño desde el localStorage
    this.getCurrentDate(); // Obtener la fecha actual
    this.loadTasks(); // Cargar las tareas asignadas al niño
  }

  // Obtener y formatear la fecha actual
  getCurrentDate() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    this.currentDate = today.toLocaleDateString('es-ES', options);
  }

  // Cargar las tareas asignadas al niño desde Firebase
  async loadTasks() {
    if (!this.childCode) {
      alert('No se encontró el código del niño. Verifique el acceso.');
      return;
    }

    try {
      // Obtener el documento asociado al `childCode`
      const docRef = doc(this.firestore, `Calendario/${this.childCode}`);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        this.tasks = data['tasks'] || []; // Cargar las tareas asociadas al `childCode`
      } else {
        console.warn('No se encontró un documento con este childCode.');
        this.tasks = [];
      }
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      alert('Hubo un problema al cargar las tareas. Intenta nuevamente.');
    }
  }

  // Obtener el ícono dinámico basado en la tarea
  getTaskIcon(task: { tarea: string }) {
    if (task.tarea.toLowerCase().includes('despertar')) {
      return 'assets/img/despertar.png';
    } else if (task.tarea.toLowerCase().includes('vestirse')) {
      return 'assets/img/vestirse.png';
    } else if (task.tarea.toLowerCase().includes('comer')) {
      return 'assets/img/comer.png';
    }
    return 'assets/img/default.png'; // Ícono por defecto
  }

  // Navegar a la página de inicio
  navigateToInicio() {
    this.router.navigate(['/inicio']);
    console.log('Redirigiendo a /inicio');
  }
}
