import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { MessageHandler } from '../../services/messageHandler.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the AltaPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

  esMozo:boolean;

  options:any;
  mesa:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public params: ParamsService,
              private messageHandler: MessageHandler) {
    
      params.emplPuesto == 'mozo' ? this.esMozo = true : this.esMozo = false;
      //console.log(this.esMozo);
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaPedidoPage');
  }

  escanearQR() {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
           this.mesa = barcodeData.text;
           this.irA('mesa');
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
      case 'mesa':
        this.navCtrl.push(OcuparMesaPage,{mesa:this.mesa});
        break;
    }
  }


}
