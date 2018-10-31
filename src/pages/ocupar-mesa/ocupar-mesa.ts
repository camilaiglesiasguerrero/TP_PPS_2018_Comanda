import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Reserva } from '../../models/reserva';

/**
 * Generated class for the OcuparMesaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ocupar-mesa',
  templateUrl: 'ocupar-mesa.html',
})
export class OcuparMesaPage {
  
  id:string;
  mesa: Mesa;
  aux : Array<any>;
  clientes:Array<any>;
  clientesFiltro:Array<any>;
  searchText:string; 
  display : boolean;
  estadoInicial:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public database:DatabaseService,
              private messageHandler:MessageHandler,
              public params: ParamsService,
              public usuariosS: UsuariosService) {
    
    this.estadoInicial = true;
    this.id = this.navParams.get('mesa').split(':')[1];
    this.mesa = new Mesa();
    this.display = false;
            
    this.database.db.list<any>('mesas/').valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].idString == this.id){
              this.mesa = new Mesa(this.id,
                                  this.aux[index].comensales,
                                  this.aux[index].tipo,
                                  this.aux[index].foto,
                                  this.aux[index].estado);
        }      
      }
      if(this.mesa.estado != 'Libre' && this.estadoInicial){
        this.messageHandler.mostrarErrorLiteral("Mesa "+this.mesa.estado);
        setTimeout(function(){
          navCtrl.remove(1,1);
        },3000);
      }
    });
    
    this.clientes = new Array<any>();
    this.clientesFiltro = new Array<any>();
    
    this.database.db.list<any>('usuarios/').valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        console.log(this.aux)
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].rol == 'cliente'){
              this.clientes.push(this.aux[index].apellido + ', '+ this.aux[index].nombre + ' (' + this.aux[index].dni + ')');
            }
        }       
    });  
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad OcuparMesaPage');
  }

 
  search(ev:any){
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
  }

  Cancelar(){
    this.searchText = '';
    this.navCtrl.remove(1,1);
    this.mesa = new Mesa();
  }

  Confirmar(){
    this.estadoInicial = false;
    let flag = false;

    for (let index = 0; index < this.clientes.length; index++) {
      if(this.clientes[index] == this.searchText){
        flag = true;
        break;
      }
    }
    if(flag){
      //Genero pedido pendiente para la mesa-cliente
      let reserva = new Reserva();
      reserva.key = this.database.ObtenerKey('reservas/');
      reserva.idPedido = null;
      reserva.dniCliente = this.searchText.split('(')[1].split(')')[0];
      reserva.idMesa = this.mesa.id;
      reserva.estado = 'Reserva';
      this.database.jsonPackData = reserva;
      this.database.SubirDataBase('reservas/');
      
      //Actualizo estado de la mesa
      this.mesa.estado = 'Reservada';
      this.database.jsonPackData = this.mesa;
      this.database.SubirDataBase('mesas/');

      this.messageHandler.mostrarMensaje('Mesa reservada con éxito');
      
      setTimeout(function(){
        this.navCtrl.remove(1,1);
      },3000);
    }
    else{
      this.messageHandler.mostrarErrorLiteral("Seleccione un cliente válido");
    }
  }
}
