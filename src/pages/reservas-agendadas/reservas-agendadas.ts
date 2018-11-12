import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import { PrincipalClientePage } from "../principal-cliente/principal-cliente";
import { diccionario } from "../../models/diccionario";
import {ParserTypesService} from "../../services/parserTypesService";


@Component({
  selector: 'page-reservar-agendadas',
  templateUrl: 'reservas-agendadas.html',
})
export class ReservasAgendadasPage {

  comensales:number;
  fecha:any;
  hora:any;
  direccion:any = { value: ""};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private parserTypesService: ParserTypesService
              ) {
  }

  confirmarReserva(){
    let elSpinner = this.spinnerHandler.getAllPageSpinner();
    elSpinner.present();
    var concatFecha = this.fecha + "T" + this.hora;
    var dateaux = new Date(concatFecha);
    var listaEspera = { estado: diccionario.estados_reservas_agendadas.sin_mesa, fecha: this.parserTypesService.parseDateTimeToStringDateTime(dateaux), clienteId: this.params.user.uid, comensales: this.comensales, nombre: this.params.user.nombre };
    this.database.jsonPackData = listaEspera;
    //TENIA ESTA, CHEQUEAR Q NO SEA UN BUG'lista-espera/'
    this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.lista_espera);
    this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(response => {
      this.messageHandler.mostrarMensaje("Su reserva ha sido agendada");
      elSpinner.dismiss();
      //TODO: ENVIAR NOTIFICACION PUSH A SUPERVISORES DE QUE HAY UN CLIENTE CON RESERVA
      this.navCtrl.setRoot(PrincipalClientePage);
    });
  }
}
