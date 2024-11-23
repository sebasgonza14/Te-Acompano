import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcompanamientoPage } from './acompanamiento.page';

const routes: Routes = [
  {
    path: '',
    component: AcompanamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcompanamientoPageRoutingModule {}
