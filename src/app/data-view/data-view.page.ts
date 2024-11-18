import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.page.html',
  styleUrls: ['./data-view.page.scss'],
})
export class DataViewPage implements OnInit {
  familiares: any[] = []; // Declara esta propiedad

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Obtén los datos de Firebase y suscríbete
    this.firebaseService.getFamiliares().subscribe(data => {
      this.familiares = data;
    });
  }
}
