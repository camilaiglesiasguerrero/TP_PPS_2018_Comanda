import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdivinarNumeroPage } from './adivinar-numero';

@NgModule({
  declarations: [
    AdivinarNumeroPage,
  ],
  imports: [
    IonicPageModule.forChild(AdivinarNumeroPage),
  ],
})
export class AdivinarNumeroPageModule {}
