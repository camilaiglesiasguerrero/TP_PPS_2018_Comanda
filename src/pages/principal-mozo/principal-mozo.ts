import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from '../../services/database.service';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';
import {diccionario} from "../../models/diccionario";


@IonicPage()
@Component({
  selector: 'page-principal-mozo',
  templateUrl: 'principal-mozo.html',
})
export class PrincipalMozoPage {

  options:any;
  mesa:any;
  listaMesas: Array<any>;
  comensalesMax:number;
  clientesEspera:Array<any>;
  noHayMesasLibres:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController,
              public database:DatabaseService) {
    
    let hoy = (new Date().toLocaleString()).split(' ')[0];
    
       

    this.database.db.list<any>(diccionario.apis.mesas).valueChanges()
      .subscribe(snp => {
        let aux:Array<any>;
        aux = snp;
        aux = aux.filter(a => a.estado == 'Libre');
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
            this.clientesEspera = this.clientesEspera.filter(f => f.estado == 'sin_mesa' && f.fecha.split(' ')[0] == hoy);
            this.clientesEspera.sort((a,b) => a.fecha.localeCompare(b.fecha));
        });  
      });
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PrincipalMozoPage');
  }

  escanearQR(caso:string,cliente?:any) {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
           this.mesa = barcodeData.text;
           switch(caso){
              case 'Reservar':
                this.irA('reserva',cliente);
                break;
              case 'verPedido':
                this.irA('verPedido');
                break;
              case 'hacerPedido':
                this.irA('hacerPedido');
                break;
           }
      }, (err) => {
          //console.log('Error: ', err);
          this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }
  

  irA(donde:string,cliente?:any){
    switch(donde){
      case 'reserva':
        this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa,cliente:cliente});
        break;
      case 'verPedido':
        this.navCtrl.push(EstadoPedidoPage,{mesa:this.mesa});
        break;
      case 'hacerPedido':
        this.navCtrl.push(AltaPedidoPage,{mesa:this.mesa});
        break;
    }
  }
}
