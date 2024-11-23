import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanalesPage } from './canales.page';

const routes: Routes = [
  {
    path: '',
    component: CanalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanalesPageRoutingModule {}
