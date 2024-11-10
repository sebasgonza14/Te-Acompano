import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPadresPage } from './login-padres.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPadresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPadresPageRoutingModule {}
