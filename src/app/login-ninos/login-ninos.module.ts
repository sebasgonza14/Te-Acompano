import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginNinosPageRoutingModule } from './login-ninos-routing.module';

import { LoginNinosPage } from './login-ninos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginNinosPageRoutingModule
  ],
  declarations: [LoginNinosPage]
})
export class LoginNinosPageModule {}
