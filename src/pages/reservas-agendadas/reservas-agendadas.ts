import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from "../../services/database.service";
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

  mostrarSpinner :boolean= false;

  watchReservasList:any;
  miReserva:any;
  miEstado:string  = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private parserTypesService: ParserTypesService,
              private notificationPushService: NotificationsPushService
  ) {
    var hoy = new Date();
    this.minDate = hoy.getFullYear() + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate();
    this.maxDate = '2020' + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate();
    this.obtenerReservasDeUsuario();
  }

  ionViewDidLeave(){
    if(this.watchReservasList){
      this.watchReservasList.unsubscribe();
    }
  }

  confirmarReserva(){
    var concatFecha = this.fecha + "T" + this.hora;
    var dateaux = new Date(concatFecha);
    var fechaReserva = this.parserTypesService.parseDateTimeToStringDateTime(dateaux);
    if(this.parserTypesService.compararFechayHoraMayorAHoy(fechaReserva)){
      this.mostrarSpinner = true;
      var reservaAgendada = {
        estado: diccionario.estados_reservas_agendadas.sin_mesa,
        fecha: fechaReserva,
        clienteId: this.params.user.uid,
        comensales: this.comensales,
        nombre: this.params.user.nombre,
        mesa: '' };
      this.database.jsonPackData = reservaAgendada;
      this.database.jsonPackData['key'] = this.database.ObtenerKey(diccionario.apis.reservas_agendadas);
      this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(response => {
        this.messageHandler.mostrarMensaje("Su reserva ha sido agendada");
        this.mostrarSpinner = false;
        this.notificationPushService.altaReservaAgendada(this.params.user.nombre);
        //TODO: ENVIAR NOTIFICACION PUSH A SUPERVISORES DE QUE HAY UN CLIENTE CON RESERVA
        this.navCtrl.setRoot(PrincipalClientePage);
      });
    }else{
      this.messageHandler.mostrarErrorLiteral("La fecha no puede ser menor a la actual");
    }
  }

  private obtenerReservasDeUsuario(){
    this.mostrarSpinner = true;

    this.watchReservasList = this.database.db.list<any>(diccionario.apis.reservas_agendadas, ref => ref.orderByChild('clienteId').equalTo(this.params.user.uid)).valueChanges()
      .subscribe(snapshots => {
        let reservasAgendadas = snapshots;
        reservasAgendadas = reservasAgendadas.filter(f => {
          return  f['estado'] != diccionario.estados_reservas_agendadas.confirmada
        });
        if(reservasAgendadas.length > 0){
          this.miReserva = reservasAgendadas[0];
          this.miEstado = this.miReserva['estado'] == diccionario.estados_reservas_agendadas.sin_mesa ? 'Sin mesa asignada'
            : this.miReserva['estado'] == diccionario.estados_reservas_agendadas.con_mesa ? 'Con mesa Nro: ' + this.miReserva.mesa + ' asignada'
              : 'Ya te encuentras en la mesa'
        }
        this.mostrarSpinner = false;
      });
  }
}
