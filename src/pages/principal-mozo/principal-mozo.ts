import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';

/**
 * Generated class for the PrincipalMozoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principal-mozo',
  templateUrl: 'principal-mozo.html',
})
export class PrincipalMozoPage {

  options:any;
  mesa:any;
  listaMesas: Array<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PrincipalMozoPage');
  }

  escanearQR(caso:string) {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
           this.mesa = barcodeData.text;
           switch(caso){
              case 'Reservar':
                this.irA('reserva');
                break;
              case 'verPedido':
                this.irA('verPedido');
                break;
           }
      }, (err) => {
          //console.log('Error: ', err);
          this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }
  

  irA(donde:string){
    switch(donde){
      case 'reserva':
        this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa});
        break;
      case 'verPedido':
        let popover = this.popoverCtrl.create(EstadoPedidoPage,{mesa:this.mesa});
        popover.present({
        
        });
    }
  }

}
