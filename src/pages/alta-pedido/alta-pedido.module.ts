import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaPedidoPage } from './alta-pedido';

@NgModule({
  declarations: [
    AltaPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaPedidoPage),
  ],
})
export class AltaPedidoPageModule {}
