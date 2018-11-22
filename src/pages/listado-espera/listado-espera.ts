import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParserTypesService } from '../../services/parserTypesService';
import { diccionario } from '../../models/diccionario';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';

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
  options:any;
  comensalesMax:number;
  clientesEspera:Array<any>;
  noHayMesasLibres:boolean;
  @Input ('mostrar-spinner') mostrarSpinner:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public database:DatabaseService,
              private parserTypesService: ParserTypesService,
              private barcodeScanner: BarcodeScanner,
              private messageHandler:MessageHandler) {
    
    this.mostrarSpinner = true;
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
            this.mostrarSpinner = false;
          });
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoEsperaPage');
  }

  escanearQR(caso:string,cliente?:any) {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        this.mesa = barcodeData.text;
        this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa, cliente:cliente});
      }, (err) => {
        //datos hardcodeados
        //this.mesa = 'Mesa:1';
       // this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa, cliente:cliente});
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }
}
