import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db:AngularFireDatabase,
              public params:ParamsService) {

    this.params.emplPuesto == 'bartender' ? this.esCocina = false : this.esCocina = true;

    db.list<any>('pedidos/').valueChanges()
      .subscribe(snapshotPedidos=>{
        console.log(snapshotPedidos);
    })
    
    

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
