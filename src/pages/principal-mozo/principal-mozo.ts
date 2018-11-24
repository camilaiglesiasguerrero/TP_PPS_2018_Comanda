import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from '../../services/messageHandler.service';
import { OcuparMesaPage } from '../ocupar-mesa/ocupar-mesa';
import { EstadoPedidoPage } from '../estado-pedido/estado-pedido';
import { DatabaseService } from '../../services/database.service';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';
import { ListadoPedidosPage } from '../listado-pedidos/listado-pedidos';
import {diccionario} from "../../models/diccionario";
import {ParserTypesService} from "../../services/parserTypesService";
import {Reserva} from "../../models/reserva";
import {Mesa} from "../../models/mesa";


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
  mostrarSpinner:boolean;
  reservasAgendadas = [];
  cargaListaEspera:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public barcodeScanner: BarcodeScanner,
              public popoverCtrl: PopoverController,
              public database:DatabaseService,
              private messageHandler: MessageHandler,
              private parser: ParserTypesService) {
  }

  ionViewDidLoad() {
    this.obtenerReservasAgendadas();
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

  confirmarReserva(reservaAgendada){
    this.mostrarSpinner = true;
    var suscripcion: any;
    let reserva = new Reserva();
    reserva.key = this.database.ObtenerKey(diccionario.apis.reservas);
    reserva.cliente = reservaAgendada.clienteId;
    reserva.estado = diccionario.estados_reservas.en_curso;
    reserva.fecha = reservaAgendada.fecha;
    reserva.idMesa = reservaAgendada.mesa;
    reserva.idPedido = null;
    this.database.jsonPackData = reserva;
    this.database.SubirDataBase(diccionario.apis.reservas).then(r=>{
      //Actualizo estado de la mesa
      suscripcion = this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(reservaAgendada.mesa))
        .valueChanges()
        .subscribe(snapshots => {
          var mesa = snapshots[0];
          mesa['estado'] = diccionario.estados_mesas.ocupada;
          this.database.jsonPackData = mesa;
          this.database.SubirDataBase(diccionario.apis.mesas).then(m=>{
            this.mostrarSpinner = false;
            this.obtenerReservasAgendadas();
            suscripcion.unsubscribe();
          });
        });
    });
    reservaAgendada.estado = diccionario.estados_reservas_agendadas.confirmada;
    this.database.jsonPackData = reservaAgendada;
    this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(r=>{
    });
  }

  private obtenerReservasAgendadas(){
    this.mostrarSpinner = true;
    this.database.db.list<any>(diccionario.apis.reservas_agendadas, ref => ref.orderByChild('estado').equalTo(diccionario.estados_reservas_agendadas.con_mesa)).valueChanges()
      .subscribe(snp => {
        this.reservasAgendadas = [];
        var reservas = snp;
        for(var i=0; i < reservas.length; i++){
          if(this.parser.compararFechaIgualAHoy(snp[i]['fecha'])){
            this.reservasAgendadas.push(snp[i]);
          }
        }
        this.mostrarSpinner = false;
      });
  }


}
