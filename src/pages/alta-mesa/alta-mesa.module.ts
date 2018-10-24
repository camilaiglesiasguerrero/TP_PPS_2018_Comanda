import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaMesaPage } from './alta-mesa';

@NgModule({
  declarations: [
    AltaMesaPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaMesaPage),
  ],
})
export class AltaMesaPageModule {}
