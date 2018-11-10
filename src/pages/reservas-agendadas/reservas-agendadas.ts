import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from "../../services/database.service";
import { SpinnerHandler } from "../../services/spinnerHandler.service";
import {PrincipalClientePage} from "../principal-cliente/principal-cliente";

@Component({
  selector: 'page-reservar-agendadas',
  templateUrl: 'reservas-agendadas.html',
})
export class ReservasAgendadasPage {

  comensales:number;
  fecha:any;
  hora:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              ) {
  }

  confirmarReserva(){
    let elSpinner = this.spinnerHandler.getAllPageSpinner();
    elSpinner.present();
    var concatFecha = this.fecha + "T" + this.hora;
    var dateaux = new Date(concatFecha);
    var listaEspera = { estado: "sin_mesa", fecha: dateaux.toLocaleString(), clienteId: this.params.user.uid, comensales: this.comensales, nombre: this.params.user.nombre };
    this.database.jsonPackData = listaEspera;
    this.database.jsonPackData['key'] = this.database.ObtenerKey('lista-espera/');
    this.database.SubirDataBase('reservas-agendadas/').then(response => {
      this.messageHandler.mostrarMensaje("Su reserva ha sido agendada");
      elSpinner.dismiss();
      //TODO: ENVIAR NOTIFICACION PUSH A SUPERVISORES DE QUE HAY UN CLIENTE CON RESERVA
      this.navCtrl.setRoot(PrincipalClientePage);
    });

  }
}
