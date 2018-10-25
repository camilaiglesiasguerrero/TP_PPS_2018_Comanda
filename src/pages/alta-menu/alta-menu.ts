import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';

/**
 * Generated class for the AltaMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-menu',
  templateUrl: 'alta-menu.html',
})
export class AltaMenuPage {

  menu:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public params: ParamsService) {

    this.navParams.get('listado') ? this.navCtrl.remove(1,1) : null;
    this.params.rol == 'bartender' ? this.menu = 'Bebidas' : this.menu = 'Platos';

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaMenuPage');
  }

  irA(donde: string){
    switch(donde){
      case 'Todos':
        this.navCtrl.push(ListadoMenuPage,{alta:true});
        break;
    }
  }

}
