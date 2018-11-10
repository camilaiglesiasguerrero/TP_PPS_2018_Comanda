import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { DatabaseService } from '../../services/database.service';
import { Producto } from '../../models/producto';
import { MessageHandler } from '../../services/messageHandler.service';
import {diccionario} from "../../models/diccionario";


@IonicPage()
@Component({
  selector: 'page-listado-menu',
  templateUrl: 'listado-menu.html',
})
export class ListadoMenuPage {


  menu:string;
  listado : any;
  producto:Producto;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public params: ParamsService,
              private database: DatabaseService,
              private messageHandler:MessageHandler) {

    this.producto = new Producto();
    if(this.params.rol == 'bartender'){
      this.menu = 'bebidas';
      this.producto.tipo = 'Bebida';
    }else{
      this.menu = 'platos';
      this.producto.tipo = 'Comida';
    }
    this.navParams.get('alta') ? this.navCtrl.remove(1,1) : null;

    this.database.db.list<any>(diccionario.apis.productos + this.menu).valueChanges()
      .subscribe(snapshots => {
          this.listado = snapshots;  

      });     
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoMenuPage');
  }

  irA(donde: string,p?:any){
    switch(donde){
      case 'Nuevo':
        this.navCtrl.push(AltaMenuPage,{listado:true});
        break;
      case 'Editar':
        this.navCtrl.push(AltaMenuPage,{listado:true,producto:p});
        break;
    }
  }
}
