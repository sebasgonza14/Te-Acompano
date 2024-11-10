import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  navigateToInicio() {
    this.navCtrl.navigateForward('/inicio');
  }

  ngOnInit() {
  }

}
