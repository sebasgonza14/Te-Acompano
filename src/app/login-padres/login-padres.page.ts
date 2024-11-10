import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login-padres',
  templateUrl: './login-padres.page.html',
  styleUrls: ['./login-padres.page.scss'],
})
export class LoginPadresPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  navigateToHome() {
    this.navCtrl.navigateRoot('/tabs/tab1');  // Redirige al usuario a la pestaña 'tab1'
  }

  ngOnInit() {
  }

}
