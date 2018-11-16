import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

// importa los codigos
import { CodesPropina } from '../../data/codes-propina';

//interfaz
import { QRPropina } from '../../models/qr-propina';

//servicios
import { MessageHandler } from '../../services/messageHandler.service';
import { CuentaPage } from '../cuenta/cuenta';
import { ParamsService } from '../../services/params.service';

/**
 * Generated class for the PropinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-propina',
  templateUrl: 'propina.html',
})
export class PropinaPage {

  options: BarcodeScannerOptions;
  codigosBD:QRPropina[] = [];
  codigoComprobado:QRPropina;
  totalCuenta:number;
  totalPropina:number;
  codigo:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public scanner: BarcodeScanner, 
    public mensajes: MessageHandler,
    private params:ParamsService
    ) {
      this.codigosBD = CodesPropina.slice(0);
      this.totalCuenta = this.navParams.get('cuenta');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropinaPage');
  }

  scan(){
    this.options= {
      prompt: 'Escaneando codigo'
    };
    this.scanner.scan(this.options).then((data) =>{
      this.codigoComprobado=this.validarCodigo(data.text);
      if (this.codigoComprobado != null) {
        this.calcularPropina();
      }
      else {
        this.mensajes.mostrarErrorLiteral("Codigo invalido! Reintente por favor")
      };
    }, (err) => {
      console.log('Error:', err)
    })
    
  }  

  validarCodigo(codigo:string){
    for (let index = 0; index < this.codigosBD.length; index++) {
        if (codigo.toString() == this.codigosBD[index].codigo.toString()) {
            return this.codigosBD[index];
        }
    }
    return null;
  }

  calcularPropina(){
    let alertConfirm = this.mensajes.mostrarMensajeConfimación("Su propina sera de " + this.codigoComprobado.id + "%", "¿Esta seguro?");
          alertConfirm.present();
          alertConfirm.onDidDismiss((confirm) => {
            if (confirm) {
              this.totalPropina = this.totalCuenta * this.codigoComprobado.porcentaje;
            }
          });
  }

  confirmarPropina(){
    this.params.propinaAux = this.codigoComprobado.id;
    this.navCtrl.remove(2,1);
  }
}
