import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import {EncuestaClienteResultadosPage} from "../encuesta-cliente-resultados/encuesta-cliente-resultados";
import {TriviaPage} from "../juegos/trivia/trivia";
import {diccionario} from "../../models/diccionario";

@IonicPage()
@Component({
  selector: 'page-principal-cliente',
  templateUrl: 'principal-cliente.html',
})
export class PrincipalClientePage {

  user:any;
  options:any;
  mesa:any;
  ingresoLocal = "";
  elSpinner = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private alertCtrl: AlertController) {
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
      case 'postre':
        this.navCtrl.push(TriviaPage);
        break;
      case 'verPedido':
        let popover = this.popoverCtrl.create(EstadoPedidoPage,{mesa:this.mesa});
        popover.present({
        });
    }
  }

  solicitarMesa(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.ingresoLocal = barcodeData.text;
      if(this.ingresoLocal == diccionario.qr.ingreso_local){
        this.infoReserva();
      }else{
        this.messageHandler.mostrarErrorLiteral("Error al ingresar al local");
      }
    }, (error) => {
      this.messageHandler.mostrarErrorLiteral(error);
    });
  }

  private infoReserva(){
    let alert = this.alertCtrl.create({
      title: 'Reservar mesa',
      inputs: [
        {
          name: 'comensales',
          placeholder: 'Cantidad de comensales',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reservar',
          handler: data => {
            this.guardarEnListaDeEspera(data.comensales);
          }
        }
      ]
    });
    alert.present();

  }

  private guardarEnListaDeEspera(comensales){
    this.elSpinner = this.spinnerHandler.getAllPageSpinner();
    this.elSpinner.present();
    var fecha = new Date();
    var listaEspera = { estado: diccionario.estados_reservas_agendadas.sin_mesa, fecha: fecha.toLocaleString(), clienteId: this.params.user.uid, comensales: comensales, nombre: this.params.user.nombre };
    this.database.jsonPackData = listaEspera;
    this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.lista_espera);
    this.database.SubirDataBase(diccionario.apis.lista_espera).then(response => {
      this.messageHandler.mostrarMensaje("Enseguida se le asignará una mesa");
      this.elSpinner.dismiss();
      //TODO: ENVIAR NOTIFICACION PUSH A LOS MOZOS Y SUPERVISORES DE QUE HAY UN CLIENTE ESPERANDO MESA
      this.navCtrl.push(EncuestaClienteResultadosPage);
    });



  }

}
