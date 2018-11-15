import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParserTypesService } from '../../services/parserTypesService';
import { diccionario } from '../../models/diccionario';

/**
 * Generated class for the ListadoEsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-espera',
  templateUrl: 'listado-espera.html',
})
export class ListadoEsperaPage {

  mesa:any;
  
  comensalesMax:number;
  clientesEspera:Array<any>;
  noHayMesasLibres:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public database:DatabaseService,
              private spinnerH: SpinnerHandler,
              private parserTypesService: ParserTypesService) {
    
    
    this.database.db.list<any>(diccionario.apis.mesas).valueChanges()
      .subscribe(snp => {
        let aux:Array<any>;
        aux = snp;
        aux = aux.filter(a => a.estado == diccionario.estados_mesas.libre);
        if(aux.length == 0)
          this.noHayMesasLibres = true;
        else
          this.noHayMesasLibres = false;
        for(let i=0;i<aux.length;i++){
          if(i==0)
            this.comensalesMax = aux[i].comensales;
          else
            this.comensalesMax < aux[i].comensales ? this.comensalesMax = aux[i].comensales : null ;
        }

        this.database.db.list<any>(diccionario.apis.lista_espera).valueChanges()
          .subscribe(snapshots => {
            this.clientesEspera = snapshots;
            this.clientesEspera = this.clientesEspera.filter(f =>{
              return f.estado == diccionario.estados_reservas_agendadas.sin_mesa && this.parserTypesService.compararFechayHoraMayorAHoy(f.fecha)
            });
            this.clientesEspera.sort((a,b) => a.fecha.localeCompare(b.fecha));
    
          });
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoEsperaPage');
  }

}
