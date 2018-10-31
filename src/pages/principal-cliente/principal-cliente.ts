import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';

/**
 * Generated class for the PrincipalClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principal-cliente',
  templateUrl: 'principal-cliente.html',
})
export class PrincipalClientePage {

  user:any;
  options:any;
  mesa:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController) {
    
    this.user = this.params.user;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PrincipalClientePage');
  }

  escanearQR() {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
           this.mesa = barcodeData.text;
           this.irA('verPedido');
      }, (err) => {
          //console.log('Error: ', err);
          this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }

  irA(donde:string){
    switch(donde){
      case 'bebida':
        this.navCtrl.push(AnagramaPage);
        break;
      case 'verPedido':
        let popover = this.popoverCtrl.create(EstadoPedidoPage,{mesa:this.mesa});
        popover.present({
        
        });
    }
  }

  solicitarMesa(){
    //push a mozo
  }

}
