import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';
import { Pedido } from '../../models/pedido';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductoPedido } from '../../models/productoPedido';

/**
 * Generated class for the ListadoPedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-pedidos',
  templateUrl: 'listado-pedidos.html',
})
export class ListadoPedidosPage {

  esCocina : boolean;
  tipoEmpleado:string;
  pedidosObs: Observable<Pedido[]>;
  pedidosList:Pedido[];
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db:AngularFireDatabase,
              public params:ParamsService) {
    this.tipoEmpleado=this.navParams.get("tipoEmpleado");           
    this.pedidosObs= db.list<any>('pedidos').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.pedidosObs.subscribe( res =>{
      this.pedidosList = res;
    });
  }
  

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoPedidosPage');
  }

  irA(donde: string){
    switch(donde){
      case 'Nuevo':
        this.navCtrl.push(AltaMenuPage);
        break;
      case 'Todos':
        this.navCtrl.push(ListadoMenuPage);
        break;
    }
  }

}
