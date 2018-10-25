import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AltaMenuPage } from '../alta-menu/alta-menu';

/**
 * Generated class for the ListadoMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-menu',
  templateUrl: 'listado-menu.html',
})
export class ListadoMenuPage {

  menu:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public params: ParamsService) {

    this.params.rol == 'bartender' ? this.menu = 'Bebidas' : this.menu = 'Platos';
    this.navParams.get('alta') ? this.navCtrl.remove(1,1) : null;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoMenuPage');
  }

  irA(donde: string){
    switch(donde){
      case 'Nuevo':
        this.navCtrl.push(AltaMenuPage,{listado:true});
        break;
    }
  }


}
