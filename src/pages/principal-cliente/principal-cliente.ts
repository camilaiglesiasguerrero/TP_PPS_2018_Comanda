import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import { EncuestaClienteResultadosPage } from "../encuesta-cliente-resultados/encuesta-cliente-resultados";
import { TriviaPage } from "../juegos/trivia/trivia";
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';
import {diccionario} from "../../models/diccionario";
import {ParserTypesService} from "../../services/parserTypesService";
import {AdivinarNumeroPage} from "../juegos/adivinar-numero/adivinar-numero";
import {NotificationsPushService} from "../../services/notificationsPush.service";


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
  puedeJugar = false;
  puedeHacerPedido = false;
  puedeVerPedido = false;
  puedePedirDelivery = true;
  puedeSolicitarMesa = true;
  auxPedido:any;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private alertCtrl: AlertController,
              private parserTypesService: ParserTypesService,
              private notificationPushService: NotificationsPushService) {
    this.user = this.params.user;

    this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid))
      .valueChanges()
      .subscribe(snapshots => {
        let auxReserva = new Array<any>();
        auxReserva = snapshots;
        let flag = false;
        for (let index = 0; index < auxReserva.length; index++) {
          if(auxReserva[index].estado == diccionario.estados_reservas.en_curso){
            if(auxReserva[index].idPedido != undefined){
              this.auxPedido = auxReserva[index].idPedido;
              this.puedeJugar = true;
              this.puedeVerPedido = true;
              this.puedeHacerPedido = false;
              this.puedePedirDelivery = false;
              this.puedeSolicitarMesa = false;
              flag = true;
            }

            if(!flag && index == auxReserva.length-1){
              this.puedeJugar = false;
              this.puedeVerPedido = false;
              this.puedeHacerPedido = true;
              this.puedePedirDelivery = false;
              this.puedeSolicitarMesa = false;
            }
          }else{
            this.database.db.list<any>(diccionario.apis.lista_espera, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid))
              .valueChanges()
              .subscribe(snapshots => {
                let auxListaEspera = snapshots;
                auxListaEspera = auxListaEspera.filter(le => le['estado'] == diccionario.estados_reservas_agendadas.sin_mesa)
                if(auxListaEspera.length == 1){
                  this.puedePedirDelivery = false;
                  this.puedeSolicitarMesa = false;
                  this.puedeJugar = true;
                  this.puedeVerPedido = false;
                  this.puedeHacerPedido = false;      
                }else if(auxListaEspera.length == 0){
                  this.puedePedirDelivery = true;
                  this.puedeSolicitarMesa = true;
                  this.puedeJugar = false;
                  this.puedeVerPedido = false;
                  this.puedeHacerPedido = false;
                }
              });
          }
        }
        //Verifico estado del pedido
        if(this.auxPedido != undefined){
          this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.auxPedido))
            .valueChanges()
            .subscribe(snp => {
              let auxPedido:any = snp;
              if(auxPedido[0].estado == diccionario.estados_pedidos.cuenta ||
                auxPedido[0].estado == diccionario.estados_pedidos.pagado ||
                auxPedido[0].estado == diccionario.estados_pedidos.entregado){
                this.puedeJugar = false;
                this.puedeVerPedido = true;
                this.puedeHacerPedido = false;
                this.puedePedirDelivery = false;
                this.puedeSolicitarMesa = false;
              }
            });
        }
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PrincipalClientePage');
  }

  escanearQR(donde:string) {
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        this.mesa = barcodeData.text;
        donde == 'hacerPedido' ? this.irA('hacerPedido') : this.irA('verPedido');

      }, (err) => {
        //console.log('Error: ', err);
        this.mesa = 'Mesa:2';
        this.navCtrl.push(AltaPedidoPage,{mesa:this.mesa});
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }

  irA(donde:string){
    switch(donde){
      case 'bebida':
        this.navCtrl.push(AnagramaPage,{pedido:this.auxPedido});
        break;
      case 'postre':
        this.navCtrl.push(TriviaPage,{pedido:this.auxPedido});
        break;
      case 'descuento':
        this.navCtrl.push(AdivinarNumeroPage,{pedido:this.auxPedido});
        break;
      case 'verPedido':
        this.navCtrl.push(EstadoPedidoPage,{mesa:this.mesa});
        break;
      case 'hacerPedido':
        this.navCtrl.push(AltaPedidoPage,{mesa:this.mesa});
        break;
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

  perdirDelivery(){
    this.navCtrl.push(AltaPedidoPage,{delivery:true});
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
    var listaEspera = { estado: diccionario.estados_reservas_agendadas.sin_mesa, fecha: this.parserTypesService.parseDateTimeToStringDateTime(fecha), clienteId: this.params.user.uid, comensales: comensales, nombre: this.params.user.nombre };
    this.database.jsonPackData = listaEspera;
    this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.lista_espera);
    this.database.SubirDataBase(diccionario.apis.lista_espera).then(response => {
      this.messageHandler.mostrarMensaje("Enseguida se le asignará una mesa");
      this.elSpinner.dismiss();
      this.notificationPushService.solicitudDeMesa(this.params.user.nombre);
      //TODO: ENVIAR NOTIFICACION PUSH A LOS MOZOS Y SUPERVISORES DE QUE HAY UN CLIENTE ESPERANDO MESA
      this.navCtrl.push(EncuestaClienteResultadosPage);
    });



  }

}
