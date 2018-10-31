import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrincipalClientePage } from './principal-cliente';

@NgModule({
  declarations: [
    PrincipalClientePage,
  ],
  imports: [
    IonicPageModule.forChild(PrincipalClientePage),
  ],
})
export class PrincipalClientePageModule {}
