import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoPedidosPage } from './listado-pedidos';

@NgModule({
  declarations: [
    ListadoPedidosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoPedidosPage),
  ],
})
export class ListadoPedidosPageModule {}
