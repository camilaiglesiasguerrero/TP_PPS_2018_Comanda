import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import {diccionario} from "../../models/diccionario";
import {Mesa} from "../../models/mesa";
import {PrincipalClientePage} from "../principal-cliente/principal-cliente";
import {PrincipalMozoPage} from "../principal-mozo/principal-mozo";
import {NotificationsPushService} from "../../services/notificationsPush.service";
declare var moment;

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
  watchReservasList:any

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params: ParamsService,
              private messageHandler: MessageHandler,
              private database: DatabaseService,
              private spinnerHandler: SpinnerHandler,
              private notificationPushService: NotificationsPushService
  ) {
  }

  ionViewDidLoad(){
    var spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.idMesa = this.navParams.get('mesa').split(':')[1];
    this.reservaAgendada = this.navParams.get('reserva');

    this.watchReservasList = this.database.db.list<any>(diccionario.apis.reservas).valueChanges()
      .subscribe(snapshots => {
        this.reservas = snapshots;
        for(var i=0; i < this.reservas.length; i++){
          if(this.reservas[i].idMesa == this.idMesa){
            var fecha1 = moment(this.reservaAgendada.fecha);
            var fecha2 = moment(this.reservas[i].fecha);
            var diferencia =  fecha1.diff(fecha2, 'minutes');
            if(diferencia <= 40){
              spinner.dismiss();
              this.messageHandler.mostrarErrorLiteral("Mesa ocupada");
              this.navCtrl.remove(1,1);
            }
          }
        }
        this.watchMesasList = this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(this.idMesa)).valueChanges()
          .subscribe(snapshots => {
            var aux:any = snapshots;
            this.mesa = new Mesa(aux[0].id, aux[0].comensales, aux[0].tipo, aux[0].foto, aux[0].estado);
            if(this.mesa.estado == diccionario.estados_mesas.libre){
              this.mesa.key = aux[0].key;
              this.mostrar = true;
              spinner.dismiss();
            }else{
              spinner.dismiss();
              this.messageHandler.mostrarErrorLiteral("Mesa ocupada");
              this.navCtrl.remove(1,1);
            }

          });
      })
  }

  ionViewCanLeave(){
    this.watchMesasList.unsubscribe();
    this.watchReservasList.unsubscribe();
  }


  salir(){
    this.navCtrl.remove(1,1);
  }

  Confirmar(){
    var spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    var reservaAgendada = { estado: diccionario.estados_reservas_agendadas.con_mesa, fecha: this.reservaAgendada.fecha,
      clienteId: this.reservaAgendada.clienteId, comensales: this.reservaAgendada.comensales, nombre: this.reservaAgendada.nombre, key: this.reservaAgendada.key };
    this.database.jsonPackData = reservaAgendada;
    //dar de alta una reserva y modificar el estado de la reserva;
    this.database.SubirDataBase(diccionario.apis.reservas_agendadas).then(e=>{
      //resto producto
      this.notificationPushService.asignacionMesaReservaAgendad(reservaAgendada.clienteId);
      this.messageHandler.mostrarMensaje("Mesa asignada con éxito");
      spinner.dismiss();
      this.salir();
    }, error =>{
      spinner.dismiss();
      this.messageHandler.mostrarErrorLiteral("Ocurrio un error al agregar la mesa");
    });
  }





}
