import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaIngresosPage } from './vista-ingresos.page';

const routes: Routes = [
  {
    path: '',
    component: VistaIngresosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaIngresosPageRoutingModule {}
