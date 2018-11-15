import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoEsperaPage } from './listado-espera';

@NgModule({
  declarations: [
    ListadoEsperaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoEsperaPage),
  ],
})
export class ListadoEsperaPageModule {}
