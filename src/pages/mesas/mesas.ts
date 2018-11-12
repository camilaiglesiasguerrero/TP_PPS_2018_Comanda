import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AltaMesaPage } from '../alta-mesa/alta-mesa';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import {diccionario} from "../../models/diccionario";


@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html'
})
export class MesasPage {

  mesas : any;
  ultimoId : number = 0;
  dic:any;

  constructor(public navCtrl: NavController,
              private database: DatabaseService) {
    this.dic = diccionario;
    this.database.db.list<any>(diccionario.apis.mesas).valueChanges()
      .subscribe(snapshots => {
          this.mesas = snapshots;
          if(this.mesas != undefined && this.mesas != null && this.mesas.length != 0){
            this.ultimoId = this.mesas[this.mesas.length-1].id;
          }
      });     
  }

  irA(donde:string,mesa?:Mesa){
    switch(donde){
      case 'A':
        this.navCtrl.push(AltaMesaPage, {ultimoId:this.ultimoId});
        break;
      case 'M':
        this.navCtrl.push(AltaMesaPage,{mesa:mesa});
        break;
      case 'B':
        mesa.estado == diccionario.estados_mesas.libre ? mesa.estado = diccionario.estados_mesas.deshabilitada : mesa.estado = diccionario.estados_mesas.libre;
        this.database.jsonPackData = mesa;
        this.database.SubirDataBase(diccionario.apis.mesas);
        break;
    }
  }

  
}
