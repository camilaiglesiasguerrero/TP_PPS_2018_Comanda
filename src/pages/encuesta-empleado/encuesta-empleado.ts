import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { ListadoPedidosPage } from '../listado-pedidos/listado-pedidos';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';

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
    switch(this.paramsService.emplPuesto){
      case 'bartender':
      case 'cocinero':
        this.navCtrl.setRoot(ListadoPedidosPage);
        break;
      case 'mozo':
        this.navCtrl.setRoot(AltaPedidoPage);
        break;
    }
    
  }
}
