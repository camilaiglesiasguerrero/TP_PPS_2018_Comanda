import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AltaMesaPage } from '../alta-mesa/alta-mesa';

@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html'
})
export class MesasPage {

  constructor(public navCtrl: NavController) {

  }

  irA(donde:string){
    switch(donde){
      case 'Nueva':
        this.navCtrl.push(AltaMesaPage);
        break;
    }
  }
}