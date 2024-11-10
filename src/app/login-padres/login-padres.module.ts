import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPadresPageRoutingModule } from './login-padres-routing.module';

import { LoginPadresPage } from './login-padres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPadresPageRoutingModule
  ],
  declarations: [LoginPadresPage]
})
export class LoginPadresPageModule {}
