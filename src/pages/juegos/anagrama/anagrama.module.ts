import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnagramaPage } from './anagrama';

@NgModule({
  declarations: [
    AnagramaPage,
  ],
  imports: [
    IonicPageModule.forChild(AnagramaPage),
  ],
})
export class AnagramaPageModule {}
