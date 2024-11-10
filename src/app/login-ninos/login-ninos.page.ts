import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login-ninos',
  templateUrl: './login-ninos.page.html',
  styleUrls: ['./login-ninos.page.scss'],
})
export class LoginNinosPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  navigateToInicio() {
    this.navCtrl.navigateForward('/inicio');
  }

  ngOnInit() {
  }

}
