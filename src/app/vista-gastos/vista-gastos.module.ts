import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaGastosPageRoutingModule } from './vista-gastos-routing.module';

import { VistaGastosPage } from './vista-gastos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaGastosPageRoutingModule
  ],
  declarations: [VistaGastosPage]
})
export class VistaGastosPageModule {}
