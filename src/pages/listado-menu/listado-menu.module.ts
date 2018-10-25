import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoMenuPage } from './listado-menu';

@NgModule({
  declarations: [
    ListadoMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoMenuPage),
  ],
})
export class ListadoMenuPageModule {}
