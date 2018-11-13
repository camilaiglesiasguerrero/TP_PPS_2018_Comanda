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
  selector: 'page-reservar-agendadas-supervisor',
  templateUrl: 'reservas-agendadas-supervisor.html',
})
export class ReservasAgendadasSupervisorPage {

  watchReservasList:any;
  reservasAgendadas = [];
  reservas = [];
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
    this.dic = diccionario;
  }

  ionViewDidLoad(){
    var spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.watchReservasList = this.database.db.list<any>(diccionario.apis.reservas_agendadas).valueChanges()
      .subscribe(snapshots => {
        this.reservasAgendadas = snapshots;
        this.reservasAgendadas = this.reservasAgendadas.filter(f => {
          return  this.parserTypesService.compararFechayHoraMayorAHoy(f.fecha)
        });
        spinner.dismiss();
      });
  }

  ionViewCanLeave(){
    //  this.watchReservasList.unsubscribe();
  }

  asignarMesa(reserva){
    this.options = { prompt : "Escaneá el código QR de la mesa" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        this.mesa = barcodeData.text;
        this.navCtrl.push(ReservarMesaPage,{ mesa:this.mesa, reserva:reserva });
      }, (err) => {
        //datos hardcodeados para testear
        //  this.mesa = "Mesa:1";
        // this.navCtrl.push(ReservarMesaPage,{ mesa:this.mesa, reserva:reserva });
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }

  cancelarReserva(){

  }


}
