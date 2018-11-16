import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AltaMesaPage } from '../alta-mesa/alta-mesa';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import {diccionario} from "../../models/diccionario";
import { SpinnerHandler } from '../../services/spinnerHandler.service';


@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html'
})
export class MesasPage {

  mesas : any;
  ultimoId : number = 0;

  constructor(public navCtrl: NavController,
              private database: DatabaseService,
              private spinnerH:SpinnerHandler) {

    let spinner = spinnerH.getAllPageSpinner();
    spinner.present();

    this.database.db.list<any>(diccionario.apis.mesas).valueChanges()
      .subscribe(snapshots => {
          this.mesas = snapshots;
          if(this.mesas != undefined && this.mesas != null && this.mesas.length != 0){
            this.ultimoId = parseInt(this.mesas[this.mesas.length-1].id);
          }
          spinner.dismiss();
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
    }
  }

  
}
