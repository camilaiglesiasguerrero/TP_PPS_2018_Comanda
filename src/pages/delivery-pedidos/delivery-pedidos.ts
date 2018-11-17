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


@Component({
  selector: 'page-delivery-pedidos',
  templateUrl: 'delivery-pedidos.html',
})
export class DeliveryPedidosPage {

  watchPedidosDelivery:any;
  watchDelivery:any;
  pedidosDelivery = [];
  pedidosFinalizados = [];
  deliverys = []
  options:any;
  mesa:any;
  dic:any;
  mostrarDelivery = false;
  deliveryTomado:any;
  direccion = {value: '', lat: '', long: ''};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private parserTypesService: ParserTypesService,
              public barcodeScanner: BarcodeScanner,
  ) {
  }

  ionViewDidLoad(){
    var spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.watchPedidosDelivery = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('isDelivery').equalTo(true)).valueChanges()
      .subscribe(snapshots => {
        this.pedidosDelivery = snapshots;
        this.pedidosFinalizados = this.pedidosDelivery.filter(pedidoFirebase => {
          return  pedidoFirebase.estado == diccionario.estados_pedidos.listo
        });
        if(this.pedidosFinalizados.length){

        }
        spinner.dismiss();
      });
  }


  tomarEntrega(pedido){
    var spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.watchDelivery = this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('idPedido').equalTo(pedido.key)).valueChanges()
      .subscribe(snapshots => {
        this.mostrarDelivery = true;
        this.deliverys = snapshots;
        this.deliveryTomado = this.deliverys[0];
        this.direccion['value'] = this.deliveryTomado.direccion;
        this.direccion['lat'] = this.deliveryTomado.lat;
        this.direccion['long'] = this.deliveryTomado.long;
        spinner.dismiss();
      });
  }

  confirmar(){
    this.deliveryTomado.estado = diccionario.estados_delivery.en_camino;
    this.database.jsonPackData = this.deliveryTomado;
    this.database.SubirDataBase(diccionario.apis.delivery).then(r=>{

    });
  }



}
