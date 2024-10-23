import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaGastosPage } from './vista-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: VistaGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaGastosPageRoutingModule {}
