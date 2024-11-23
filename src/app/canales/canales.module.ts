import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanalesPageRoutingModule } from './canales-routing.module';

import { CanalesPage } from './canales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanalesPageRoutingModule
  ],
  declarations: [CanalesPage]
})
export class CanalesPageModule {}
