import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcompanamientoPageRoutingModule } from './acompanamiento-routing.module';

import { AcompanamientoPage } from './acompanamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcompanamientoPageRoutingModule
  ],
  declarations: [AcompanamientoPage]
})
export class AcompanamientoPageModule {}
