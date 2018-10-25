import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaMenuPage } from './alta-menu';

@NgModule({
  declarations: [
    AltaMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaMenuPage),
  ],
})
export class AltaMenuPageModule {}
