import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from '../../services/database.service';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';
import { ListadoPedidosPage } from '../listado-pedidos/listado-pedidos';


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
              public popoverCtrl: PopoverController,
              public database:DatabaseService,
              private messageHandler: MessageHandler) {
  }

  ionViewDidLoad() {

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
        //this.mesa = 'Mesa:2';
        //this.irA('reserva');
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }


  irA(donde:string,cliente?:any){
    switch(donde){
      case 'reserva':
        this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa, cliente:cliente});
        break;
      case 'verPedido':
        this.navCtrl.push(EstadoPedidoPage,{mesa:this.mesa});
        break;
      case 'hacerPedido':
        this.navCtrl.push(AltaPedidoPage,{mesa:this.mesa});
        break;
      case 'verPedidosEntrega':
        this.navCtrl.push(ListadoPedidosPage);
        break;
    }
  }
}
