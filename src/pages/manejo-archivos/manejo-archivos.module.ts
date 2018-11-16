import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManejoArchivosPage } from './manejo-archivos';

@NgModule({
  declarations: [
    ManejoArchivosPage,
  ],
  imports: [
    IonicPageModule.forChild(ManejoArchivosPage),
  ],
})
export class ManejoArchivosPageModule {}
