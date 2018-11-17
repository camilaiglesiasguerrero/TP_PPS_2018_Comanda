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
  pedidosDelivery = [];
  pedidosFinalizados = [];
  options:any;
  mesa:any;
  dic:any;

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
    this.watchPedidosDelivery = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('isDelivery').equalTo('true')).valueChanges()
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

  }



}
