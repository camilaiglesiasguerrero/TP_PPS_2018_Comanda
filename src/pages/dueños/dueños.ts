import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AltaEmpleadoPage } from '../alta-empleado/alta-empleado';

/**
 * Generated class for the DueñosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-duenos',
  templateUrl: 'dueños.html',
})
export class DueñosPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DueñosPage');
  }

  agregar(){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'dueño'
    });
  }

}
