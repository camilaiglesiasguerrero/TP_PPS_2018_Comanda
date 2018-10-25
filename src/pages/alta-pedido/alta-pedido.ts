import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';

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

  miScan = {};
  options : any;
  esMozo:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private params: ParamsService) {
    
      params.emplPuesto == 'mozo' ? this.esMozo = true : this.esMozo = false;
      console.log(this.esMozo);
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaPedidoPage');
  }

  escanearQR() {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.miScan = barcodeData.text;

    }, (error) => {
        //this.errorHandler.mostrarErrorLiteral(error);
    });
  }

  irA(donde:string){
    switch(donde){
      case 'bebida':
        this.navCtrl.push(AnagramaPage);
        break;
    }
  }


}
