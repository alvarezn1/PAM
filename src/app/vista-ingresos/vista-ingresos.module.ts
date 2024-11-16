import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaIngresosPageRoutingModule } from './vista-ingresos-routing.module';

import { VistaIngresosPage } from './vista-ingresos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaIngresosPageRoutingModule
  ],
  declarations: [VistaIngresosPage]
})
export class VistaIngresosPageModule {}
