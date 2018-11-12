import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-encuesta-empleado-resultados',
  templateUrl: 'encuesta-empleado-resultados.html',
})
export class EncuestaEmpleadoResultadosPage {

  @Input('from-dashboard') fromDashboard:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaEmpleadoResultadosPage');
  }

}
