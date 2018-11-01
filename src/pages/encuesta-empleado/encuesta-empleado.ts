import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { ListadoPedidosPage } from '../listado-pedidos/listado-pedidos';
import { MesasPage } from '../mesas/mesas';
import { PrincipalMozoPage } from '../principal-mozo/principal-mozo';

/**
 * Generated class for the EncuestaEmpleadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-empleado',
  templateUrl: 'encuesta-empleado.html',
})
export class EncuestaEmpleadoPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EncuestaEmpleadoPage');
  }

  irA(){
    switch(this.paramsService.rol){
      case 'bartender':
      case 'cocinero':
        this.navCtrl.setRoot(ListadoPedidosPage);
        break;
      case 'mozo':
        this.navCtrl.setRoot(PrincipalMozoPage);
        break;
      case 'metre':
        this.navCtrl.setRoot(MesasPage);
        break;
    }
    
  }
}
