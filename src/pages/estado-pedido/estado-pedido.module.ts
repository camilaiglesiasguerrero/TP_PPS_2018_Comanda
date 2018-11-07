import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstadoPedidoPage } from './estado-pedido';

@NgModule({
  declarations: [
    EstadoPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(EstadoPedidoPage),
  ],
})
export class EstadoPedidoPageModule {}
