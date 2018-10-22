import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncuestaEmpleadoPage } from './encuesta-empleado';

@NgModule({
  declarations: [
    EncuestaEmpleadoPage,
  ],
  imports: [
    IonicPageModule.forChild(EncuestaEmpleadoPage),
  ],
})
export class EncuestaEmpleadoPageModule {}
