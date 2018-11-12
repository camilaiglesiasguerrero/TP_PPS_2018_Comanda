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
  selector: 'page-reservar-agendadas-supervisor',
  templateUrl: 'reservas-agendadas-supervisor.html',
})
export class ReservasAgendadasSupervisorPage {

  reservasAgendadas = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private parserTypesService: ParserTypesService
  ) {
    debugger;
    this.database.db.list<any>(diccionario.apis.reservas_agendadas).valueChanges()
      .subscribe(snapshots => {
        this.reservasAgendadas = snapshots;
        this.reservasAgendadas = this.reservasAgendadas.filter(f => {
         return  f.estado == diccionario.estados_reservas_agendadas.sin_mesa && f.estado != diccionario.estados_reservas_agendadas.cancelada && this.parserTypesService.compararFechayHoraMayorAHoy(f.fecha)
        });
      });
  }

  asignarMesa(reserva){

  }

  cancelarReserva(){

  }


}
