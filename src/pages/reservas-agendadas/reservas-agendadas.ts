import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import { PrincipalClientePage } from "../principal-cliente/principal-cliente";
import { diccionario } from "../../models/diccionario";
import {ParserTypesService} from "../../services/parserTypesService";
import {NotificationsPushService} from "../../services/notificationsPush.service";

declare var moment;


@Component({
  selector: 'page-reservar-agendadas',
  templateUrl: 'reservas-agendadas.html',
})
export class ReservasAgendadasPage {

  comensales:number;
  fecha:any;
  hora:any;
  direccion:any = { value: ""};
  minDate:string;
  maxDate:string;
  minTime:string;
  maxTime:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private parserTypesService: ParserTypesService,
              private notificationPushService: NotificationsPushService
  ) {
    var hoy = new Date();
    this.minDate = hoy.getFullYear() + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate();
    this.maxDate = '2020' + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate();
    this.minTime = '18:00';
    this.maxTime = '23:59';

  }

  confirmarReserva(){
    var concatFecha = this.fecha + "T" + this.hora;
    var dateaux = new Date(concatFecha);
    var fechaReserva = this.parserTypesService.parseDateTimeToStringDateTime(dateaux);
    if(this.parserTypesService.compararFechayHoraMayorAHoy(fechaReserva)){
      let elSpinner = this.spinnerHandler.getAllPageSpinner();
      elSpinner.present();
      var reservaAgendada = { estado: diccionario.estados_reservas_agendadas.sin_mesa, fecha: fechaReserva,
        clienteId: this.params.user.uid, comensales: this.comensales, nombre: this.params.user.nombre };
      this.database.jsonPackData = reservaAgendada;
      this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.reservas_agendadas);
      this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(response => {
        this.messageHandler.mostrarMensaje("Su reserva ha sido agendada");
        elSpinner.dismiss();
        this.notificationPushService.altaReservaAgendada(this.params.user.nombre);
        //TODO: ENVIAR NOTIFICACION PUSH A SUPERVISORES DE QUE HAY UN CLIENTE CON RESERVA
        this.navCtrl.setRoot(PrincipalClientePage);
      });
    }else{
      this.messageHandler.mostrarErrorLiteral("La fecha no puede ser menor a la actual");
    }
  }
}
