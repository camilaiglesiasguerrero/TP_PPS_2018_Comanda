import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AnagramaPage } from '../juegos/anagrama/anagrama';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from "../../services/database.service";
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

  puedeJugar = false;
  puedeHacerPedido = false;
  puedeVerPedido = false;
  puedePedirDelivery = true;
  puedeSolicitarMesa = true;
  esperandoAsignacion = false;
  auxPedido:any;
  flagEstaActivo = false;
  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              public popoverCtrl: PopoverController,
              private database: DatabaseService,
              private alertCtrl: AlertController,
              private parserTypesService: ParserTypesService,
              private notificationPushService: NotificationsPushService) {
    this.user = this.params.user;

    this.mostrarSpinner = true;

    this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid))
      .valueChanges()
      .subscribe(snpDelivery => {
        //veo la lista de delivery con este cliente
        //si no esta en delivery se pone el estado inicial, puede solicitar mesa o delivery
        if(snpDelivery.length != 0){
          let auxDelivery = snpDelivery;
          auxDelivery = auxDelivery.filter(ad => ad['estado'] != diccionario.estados_delivery.entregado)
          if(auxDelivery.length > 0 ){
            this.puedePedirDelivery = false;
            this.puedeSolicitarMesa = false;
            this.puedeJugar = false;
            this.puedeVerPedido = false;
            this.puedeHacerPedido = false;
            this.esperandoAsignacion = false;
            this.mostrarSpinner = false;
            this.puedePedirDelivery = true;
            this.flagEstaActivo = true;
            return;
          }
        }

        this.database.db.list<any>(diccionario.apis.lista_espera, ref => ref.orderByChild('clienteId').equalTo(this.params.user.uid))
          .valueChanges()
          .subscribe(snapshots => {
            //veo la lista de espera con este cliente
            //si no esta en lista de espera se pone el estado inicial, puede solicitar mesa o delivery
            if(snapshots.length == 0){
              this.puedePedirDelivery = true;
              this.puedeSolicitarMesa = true;
              this.puedeJugar = false;
              this.puedeVerPedido = false;
              this.puedeHacerPedido = false;
              this.esperandoAsignacion = false;
              this.mostrarSpinner = false;
            }
            //el cliente esta en lista de espera
            let auxListaEspera = snapshots;
            auxListaEspera = auxListaEspera.filter(le => le['estado'] == diccionario.estados_reservas_agendadas.sin_mesa);
            //esta lista de espera sin mesa: se le muestra que ya se le va a asignar mesa
            if (auxListaEspera.length == 1) {
              this.puedePedirDelivery = false;
              this.puedeSolicitarMesa = false;
              this.puedeJugar = false;
              this.puedeVerPedido = false;
              this.puedeHacerPedido = false;
              this.esperandoAsignacion = true;
              this.mostrarSpinner = false;
              this.flagEstaActivo = true;
            }
            //esta en lista de espera con mesa asignada, se consulta la reserva
            else {
              this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid))
                .valueChanges()
                .subscribe(snapshots => {
                  let auxReserva = new Array<any>();
                  auxReserva = snapshots;
                  let flag = false;
                  for (let index = 0; index < auxReserva.length; index++) {
                    if (auxReserva[index].estado == diccionario.estados_reservas.en_curso) {
                      //tiene una reserva en curso
                      if (auxReserva[index].idPedido != undefined) {
                        //tiene un pedido hecho la reserva
                        this.auxPedido = auxReserva[index].idPedido;
                        this.puedeJugar = true;
                        this.puedeVerPedido = true;
                        this.puedeHacerPedido = false;
                        this.puedePedirDelivery = false;
                        this.puedeSolicitarMesa = false;
                        this.esperandoAsignacion = false;
                        this.flagEstaActivo = true;
                        flag = true;
                        break;
                      }
                      //no tiene un pedido hecho
                      if (!flag && index == auxReserva.length - 1) {
                        this.puedeJugar = false;
                        this.puedeVerPedido = false;
                        this.puedeHacerPedido = true;
                        this.puedePedirDelivery = false;
                        this.puedeSolicitarMesa = false;
                        this.esperandoAsignacion = false;
                        this.flagEstaActivo = true;
                      }
                    }
                  }
                  //Verifico estado del pedido
                  if (this.auxPedido != undefined) {
                    this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.auxPedido))
                      .valueChanges()
                      .subscribe(snp => {
                        let auxPedido: any = snp;
                        if (auxPedido[0].estado == diccionario.estados_pedidos.cuenta ||
                          auxPedido[0].estado == diccionario.estados_pedidos.pagado ||
                          auxPedido[0].estado == diccionario.estados_pedidos.entregado) {
                          this.puedeJugar = false;
                          this.puedeVerPedido = true;
                          this.puedeHacerPedido = false;
                          this.puedePedirDelivery = false;
                          this.puedeSolicitarMesa = false;
                          this.esperandoAsignacion = false;
                          this.flagEstaActivo = true;
                        }
                        if(auxPedido[0].estado == diccionario.estados_pedidos.listo){
                          this.puedeJugar = false;
                        }
                        this.mostrarSpinner = false;
                      });
                  }else{
                    this.mostrarSpinner = false;
                  }

                  if(!this.flagEstaActivo){
                    this.puedeJugar = false;
                    this.puedeVerPedido = false;
                    this.puedeHacerPedido = false;
                    this.puedePedirDelivery = true;
                    this.puedeSolicitarMesa = true;
                    this.esperandoAsignacion = false;
                  }
                });
            }
          });
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PrincipalClientePage');
  }

  escanearQR(donde:string) {
    this.options = { prompt : "Escaneá el código QR de la mesa" };
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        this.mesa = barcodeData.text;
        donde == 'hacerPedido' ? this.irA('hacerPedido') : this.irA('verPedido');

      }, (err) => {
        //datos hardcodeados
        //this.mesa = 'Mesa:1';
       // this.irA('verPedido');
        //donde == 'hacerPedido' ? this.irA('hacerPedido') : this.irA('verPedido');
        //this.navCtrl.push(AltaPedidoPage,{mesa:this.mesa});
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
    this.mostrarSpinner = true;
    var fecha = new Date();
    var listaEspera = { estado: diccionario.estados_reservas_agendadas.sin_mesa, fecha: this.parserTypesService.parseDateTimeToStringDateTime(fecha), clienteId: this.params.user.uid, comensales: comensales, nombre: this.params.user.nombre };
    this.database.jsonPackData = listaEspera;
    this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.lista_espera);
    this.database.SubirDataBase(diccionario.apis.lista_espera).then(response => {
      this.messageHandler.mostrarMensaje("Enseguida se te asignará una mesa");
      this.mostrarSpinner = false;
      this.notificationPushService.solicitudDeMesa(this.params.user.nombre);
      //TODO: ENVIAR NOTIFICACION PUSH A LOS MOZOS Y SUPERVISORES DE QUE HAY UN CLIENTE ESPERANDO MESA
      this.navCtrl.push(EncuestaClienteResultadosPage);
    });



  }

}
