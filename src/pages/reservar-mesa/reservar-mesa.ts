import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import {diccionario} from "../../models/diccionario";
import {Mesa} from "../../models/mesa";
import {NotificationsPushService} from "../../services/notificationsPush.service";
import {Reserva} from "../../models/reserva";
import {ParserTypesService} from "../../services/parserTypesService";

@Component({
  selector: 'page-reservar-mesa',
  templateUrl: 'reservar-mesa.html',
})
export class ReservarMesaPage {

  reservas = [];
  idMesa = "";
  reservaAgendada:any;
  mesa:any;
  mostrar:boolean;
  watchMesasList:any;
  watchReservasList:any;
  watchReservasIdMesaList:any;

  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private notificationPushService: NotificationsPushService,
              private parser: ParserTypesService
  ) {
  }

  ionViewDidLoad(){
    this.mostrarSpinner = true;
    this.idMesa = this.navParams.get('mesa').split(':')[1];
    this.reservaAgendada = this.navParams.get('reserva');
    this.watchReservasList = this.database.db.list<any>(diccionario.apis.reservas_agendadas, ref => ref.orderByChild('estado').equalTo(diccionario.estados_reservas_agendadas.con_mesa)).valueChanges()
      .subscribe(snapshots => {
        var reservasAgendadas = snapshots;
        for(var i=0; i < reservasAgendadas.length; i++){
          if(reservasAgendadas[i]['mesa'] == this.idMesa){
            if(!this.parser.hayDiferenciaDe40Minutos(this.reservaAgendada.fecha, reservasAgendadas[i]['fecha'])){
              this.mostrarSpinner = false;
              this.messageHandler.mostrarErrorLiteral("Mesa ocupada");
              this.salir();
              return;
            }
          }
        }
        this.watchReservasIdMesaList = this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('idMesa').equalTo(this.idMesa)).valueChanges()
          .subscribe(snapshots => {
            var aux:any = snapshots;
            for(var i=0; i < snapshots.length; i++){
              if(snapshots[i]['estado'] == diccionario.estados_reservas.en_curso){
                if(!this.parser.hayDiferenciaDe40Minutos(this.reservaAgendada.fecha, snapshots[i]['fecha'])){
                  this.mostrarSpinner = false;
                  this.messageHandler.mostrarErrorLiteral("Mesa ocupada");
                  this.salir();
                  return;
                }
              }
            }
            this.mostrar = true;
            this.mostrarSpinner = false;
          });
      });
    this.watchMesasList = this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(this.idMesa)).valueChanges()
      .subscribe(snapshots => {
        var aux:any = snapshots;
        this.mesa = new Mesa(aux[0].id, aux[0].comensales, aux[0].tipo, aux[0].foto, aux[0].estado);
      });
  }

  salir(){
    this.watchMesasList ? this.watchMesasList.unsubscribe(): '';
    this.watchReservasList ? this.watchReservasList.unsubscribe() : '';
    this.watchReservasIdMesaList ? this.watchReservasIdMesaList.unsubscribe() : '';
    this.navCtrl.remove(1,1);
  }

  Confirmar(){
    this.mostrarSpinner = true;
    var reservaAgendada = { estado: diccionario.estados_reservas_agendadas.con_mesa, fecha: this.reservaAgendada.fecha,
      clienteId: this.reservaAgendada.clienteId, comensales: this.reservaAgendada.comensales, nombre: this.reservaAgendada.nombre, key: this.reservaAgendada.key, mesa: this.mesa.id };
    this.database.jsonPackData = reservaAgendada;
    //dar de alta una reserva y modificar el estado de la reserva;
    this.watchReservasList ? this.watchReservasList.unsubscribe() : '';
    this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(e=>{
      this.notificationPushService.asignacionMesaReservaAgendad(reservaAgendada.clienteId, this.mesa.id);
      this.messageHandler.mostrarMensaje("Mesa asignada con éxito");
      this.mostrarSpinner = false;
      this.salir();
    }, error =>{
      this.mostrarSpinner = false;
      this.messageHandler.mostrarErrorLiteral("Ocurrio un error al agregar la mesa");
    });
  }





}
