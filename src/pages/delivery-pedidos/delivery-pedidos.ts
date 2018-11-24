import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import { PrincipalClientePage } from "../principal-cliente/principal-cliente";
import { diccionario } from "../../models/diccionario";
import {ParserTypesService} from "../../services/parserTypesService";
import {OcuparMesaPage} from "../ocupar-mesa/ocupar-mesa";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {ReservarMesaPage} from "../reservar-mesa/reservar-mesa";
import {ChatPage} from "../chat/chat";


@Component({
  selector: 'page-delivery-pedidos',
  templateUrl: 'delivery-pedidos.html',
})
export class DeliveryPedidosPage {

  watchPedidosDelivery:any;
  watchDelivery:any;
  pedidosDelivery = [];
  pedidosFinalizados = [];
  misDeliverys = [];
  deliverys = [];
  options:any;
  mesa:any;
  dic:any;
  mostrarDelivery = false;
  deliveryTomado:any;
  direccion = {value: '', lat: '', long: ''};
  mostrarSpinner : boolean= false;
  pedidoSeleccionado:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private parserTypesService: ParserTypesService,
              public barcodeScanner: BarcodeScanner,
  ) {
  }

  ionViewDidLoad(){
    this.mostrarSpinner = true;
    this.getPedidosParaEntregar();
    this.getMisPedidos();

  }

  tomarEntrega(pedido){
    this.pedidoSeleccionado = pedido;
    this.mostrarSpinner = true;
    this.watchDelivery = this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('idPedido').equalTo(pedido.key)).valueChanges()
      .subscribe(snapshots => {
        this.deliverys = snapshots;
        this.deliveryTomado = this.deliverys[0];
        this.direccion['value'] = this.deliveryTomado.direccion;
        this.direccion['lat'] = this.deliveryTomado.lat;
        this.direccion['long'] = this.deliveryTomado.long;
        this.mostrarSpinner = false;
        this.mostrarDelivery = true;
      });
  }

  confirmar(){
    this.mostrarSpinner = true;
    this.deliveryTomado.estado = diccionario.estados_delivery.en_camino;
    this.deliveryTomado['idEmpleado'] = this.params.user.uid;
    this.database.jsonPackData = this.deliveryTomado;
    this.database.SubirDataBase(diccionario.apis.delivery).then(r=>{
      this.pedidoSeleccionado.estado = diccionario.estados_pedidos.en_camino;
      this.database.jsonPackData = this.pedidoSeleccionado;
      this.database.SubirDataBase(diccionario.apis.pedidos).then(r=>{
      });
      var chat = {
        key: this.database.ObtenerKey(diccionario.apis.chats),
        idDelivery: this.deliveryTomado.key
      };
      this.database.jsonPackData = chat;
      this.database.SubirDataBase(diccionario.apis.chats).then(r=>{
        this.mostrarDelivery = false;
        this.mostrarSpinner = false;
        this.deliveryTomado = {};
        this.messageHandler.mostrarMensaje("Datos guardados, puedes comunicarte con el cliente por chat");
      });
    });
  }

  confirmarEntrega(delivery){
    this.mostrarSpinner = true;
    delivery.estado = diccionario.estados_delivery.entregado;
    this.database.jsonPackData = delivery;
    this.database.SubirDataBase(diccionario.apis.delivery).then(r=>{
      this.mostrarDelivery = false;
      this.mostrarSpinner = false;
      this.deliveryTomado = {};
      this.messageHandler.mostrarMensaje("Datos guardados, pedido cerrado");

    });
  }

  chatearCliente(delivery){
    this.navCtrl.push(ChatPage,{idDelivery: delivery.key});
  }

  private getPedidosParaEntregar(){
    this.watchPedidosDelivery = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('isDelivery').equalTo(true)).valueChanges()
      .subscribe(snapshots => {
        this.pedidosDelivery = snapshots;
        this.pedidosFinalizados = this.pedidosDelivery.filter(pedidoFirebase => {
          return  pedidoFirebase.estado == diccionario.estados_pedidos.listo
        });
        this.mostrarSpinner = false;
      });
  }

  private getMisPedidos(){
    this.watchPedidosDelivery = this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('idEmpleado').equalTo(this.params.user.uid)).valueChanges()
      .subscribe(snapshots => {
        this.misDeliverys= snapshots.filter(pedidoFirebase => {
          return  pedidoFirebase['estado'] == diccionario.estados_delivery.en_camino
        });
      });
  }


}
