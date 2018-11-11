import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { Reserva } from '../../models/reserva';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import {diccionario} from "../../models/diccionario";


@IonicPage()
@Component({
  selector: 'page-ocupar-mesa',
  templateUrl: 'ocupar-mesa.html',
})
export class OcuparMesaPage {
  
  id:string;
  mesa: Mesa;
  aux : Array<any>;
  //clientes:Array<any>;
  //clientesFiltro:Array<any>;
  //searchText:string; 
  display : boolean;
  estadoInicial:boolean;
  spinner:any;
  mostrar:boolean=false;
  cliente:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public database:DatabaseService,
              public messageHandler:MessageHandler,
              public params: ParamsService,
              private spinnerHandler: SpinnerHandler) {
    
    this.estadoInicial = true;
    if(this.navParams.get('mesa').split(':')[0] != 'Mesa' ||this.navParams.get('mesa').split(':')[1] == undefined ){
      this.messageHandler.mostrarError('Ese QR no es de una mesa');
      this.navCtrl.remove(1,1);
    }
    else{
      this.id = this.navParams.get('mesa').split(':')[1];
      this.cliente = this.navParams.get('cliente');
    }
    this.mesa = new Mesa();
    
    //this.display = false;

    this.database.db.list<any>(diccionario.apis.mesas).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].idString == this.id){
              this.mesa = new Mesa(this.id,
                                  this.aux[index].comensales,
                                  this.aux[index].tipo,
                                  this.aux[index].foto,
                                  this.aux[index].estado);
              this.mesa.key = this.aux[index].key;
              this.mostrar = true;
              
        }      
      }
      this.spinner.dismiss();
      if(this.mesa.estado != 'Libre' && this.estadoInicial){
        this.messageHandler.mostrarErrorLiteral("Mesa "+this.mesa.estado);
        setTimeout(function(){
          navCtrl.remove(1,1);
        },2000);
      }else if(this.mesa.estado != 'Libre' && !this.estadoInicial){
        this.messageHandler.mostrarMensaje("Mesa "+this.mesa.estado);
        setTimeout(function(){
          navCtrl.remove(1,1);
        },2000);
      }
    });
    
    //this.clientes = new Array<any>();
    //this.clientesFiltro = new Array<any>();
    /*
    this.database.db.list<any>('usuarios/').valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        console.log(this.aux)
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].rol == 'cliente'){
              this.clientes.push(this.aux[index].apellido + ', '+ this.aux[index].nombre + ' (' + this.aux[index].dni + ')');
            }
        }       
    });  */
  }

  ionViewDidLoad() {
    this.spinner = this.spinnerHandler.getAllPageSpinner();
    this.spinner.present();
  }

 
  /*search(ev:any){
    this.display = true;
    const val = ev.target.value;
    this.clientesFiltro = this.clientes;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clientesFiltro = this.clientes.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }else{
      this.clientesFiltro = this.clientes;
    }
    
  }

  VincularCliente(cli:any){
    this.searchText = cli;
    this.clientesFiltro = this.clientes;
    this.display = false;
  }*/

  Cancelar(){
    //this.searchText = '';
    this.navCtrl.remove(1,1);
    this.mesa = new Mesa();
  }

  Confirmar(){
    //Genero pedido pendiente para la mesa-cliente
    let reserva = new Reserva();
    reserva.key = this.database.ObtenerKey(diccionario.apis.reservas);
    reserva.idPedido = null;
    //reserva.dniCliente = this.searchText.split('(')[1].split(')')[0];
    reserva.cliente = this.cliente.clienteId;
    reserva.idMesa = this.mesa.id;
    //TODO: CAMI: CHEQUEATE ESTE ESTADO QUE CREO QUE RESERVAS NO LLEVA MAS ESTADO
    reserva.estado = 'Reserva';
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
          estado: 'en_mesa_'+this.mesa.id,
          fecha: this.cliente.fecha,
          key: this.cliente.key,
          nombre: this.cliente.nombre
        };
        this.database.jsonPackData = le;
        this.database.SubirDataBase(diccionario.apis.lista_espera).then(le=>{
        });
      });      
    });
  }
}
