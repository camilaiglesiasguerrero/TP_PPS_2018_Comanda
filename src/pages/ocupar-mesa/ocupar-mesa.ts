import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { Reserva } from '../../models/reserva';
import {diccionario} from "../../models/diccionario";
import { ParserTypesService } from '../../services/parserTypesService';


@IonicPage()
@Component({
  selector: 'page-ocupar-mesa',
  templateUrl: 'ocupar-mesa.html',
})
export class OcuparMesaPage {

  suscripcion:any;
  id:string;
  mesa: Mesa;
  aux : Array<any>;
  display : boolean;
  mostrar:boolean=false;
  cliente:any;
  
  mostrarSpinner:boolean=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public database:DatabaseService,
              public messageHandler:MessageHandler,
              public params: ParamsService,
              private parserTypesService: ParserTypesService) {
    
    this.mostrarSpinner = true;
    
    if(!this.navParams.get('mesa').includes('Mesa') || this.navParams.get('mesa').split(':')[1] == undefined ){
      this.messageHandler.mostrarErrorLiteral(diccionario.errores.QR_invalido);
      this.mostrarSpinner = false;
      this.navCtrl.remove(1,1);
    }
    else{
      this.id = this.navParams.get('mesa').split(':')[1];
      this.cliente = this.navParams.get('cliente');
    }
    this.mesa = new Mesa();
    
    this.suscripcion = this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(this.id))
              .valueChanges()
              .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].id.toString() == this.id.toString()){
              this.mesa = new Mesa(this.id,
                                  this.aux[index].comensales,
                                  this.aux[index].tipo,
                                  this.aux[index].foto,
                                  this.aux[index].estado);
              
              this.mesa.key = this.aux[index].key;
              this.mostrar = true;
        }      
      }
      this.mostrarSpinner = false;
      if(this.mesa.estado != 'Libre'){
        this.messageHandler.mostrarErrorLiteral("Mesa "+this.mesa.estado);
        this.Cancelar();
      }
    });
  }

  ionViewDidLoad() {
    
  }

  Cancelar(){
    this.suscripcion.unsubscribe();
    this.navCtrl.remove(1,1);
  }

  Confirmar(){
    this.suscripcion.unsubscribe();
    this.mostrarSpinner = true;
    //Genero pedido pendiente para la mesa-cliente
    let reserva = new Reserva();
    reserva.key = this.database.ObtenerKey(diccionario.apis.reservas);
    reserva.idPedido = null;
    reserva.cliente = this.cliente.clienteId;
    reserva.idMesa = this.mesa.id;
    //TODO: CAMI: CHEQUEATE ESTE ESTADO QUE CREO QUE RESERVAS NO LLEVA MAS ESTADO
    reserva.estado = diccionario.estados_reservas.en_curso;
    reserva.fecha = this.parserTypesService.parseDateTimeToStringDateTime(new Date());
    this.database.jsonPackData = reserva;
    this.database.SubirDataBase(diccionario.apis.reservas).then(r=>{
    
      //Actualizo estado de la mesa
      let aux = new Mesa(this.mesa.id,
                          this.mesa.comensales,
                          this.mesa.tipo,
                          this.mesa.foto,
                          diccionario.estados_mesas.reservada);
      aux.key = this.mesa.key;
      this.database.jsonPackData = aux;
      this.database.SubirDataBase(diccionario.apis.mesas).then(m=>{
        this.mesa.estado = diccionario.estados_mesas.reservada;
        //Actualizo lista-espera
        let le = {
          clienteId: this.cliente.clienteId,
          comensales: this.cliente.comensales,
          estado: diccionario.estados_reservas_agendadas.con_mesa,
          fecha: this.cliente.fecha,
          key: this.cliente.key,
          nombre: this.cliente.nombre
        };
        this.database.jsonPackData = le;
        this.database.SubirDataBase(diccionario.apis.lista_espera).then(le=>{
          this.mostrarSpinner = false;
          this.messageHandler.mostrarMensaje('Mesa asignada');
          this.navCtrl.remove(1,1);
        });
      });      
    });
  }
}
