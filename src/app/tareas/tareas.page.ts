import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {
  tasks: Array<{ horario: string; tarea: string }> = []; // Lista de tareas
  currentDate: string = ''; // Fecha actual formateada

  constructor(private firestore: Firestore , private router: Router) {}

  ngOnInit() {
    this.getCurrentDate(); // Obtener la fecha actual
    this.loadTasks(); // Cargar las tareas desde Firebase
  }

  // Obtener y formatear la fecha actual
  getCurrentDate() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    this.currentDate = today.toLocaleDateString('es-ES', options);
  }

  // Cargar las tareas desde Firebase
  async loadTasks() {
    const today = new Date(); // Fecha actual
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(); // Inicio del día actual
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(); // Inicio del siguiente día
  
    const tasksRef = collection(this.firestore, 'Calendario');
    const q = query(tasksRef, where('fecha', '>=', startOfDay), where('fecha', '<', endOfDay)); // Filtrar por rango de fecha
    const querySnapshot = await getDocs(q);
  
    // Mapear las tareas desde Firebase a nuestra estructura
    this.tasks = querySnapshot.docs.map((doc) => ({
      horario: doc.data()['horario'] || 'Horario no definido', // Asignar un horario si existe
      tarea: doc.data()['tarea'],
    }));
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
  navigateToInicio() {
    this.router.navigate(['/inicio']); // Redirige a la página de inicio
    console.log('Redirigiendo a /inicio');
  }
}
