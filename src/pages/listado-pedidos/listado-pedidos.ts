import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';
import {diccionario} from "../../models/diccionario";
import { DatabaseService } from '../../services/database.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { NotificationsPushService } from '../../services/notificationsPush.service';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-listado-pedidos',
  templateUrl: 'listado-pedidos.html',
})
export class ListadoPedidosPage {

  //suscripciones
  subsProducto:any;
  subsPedido:any;
  subsUnPedido:any;
  subsReserva:any;
  subsMesa:any;

  //pedidosObs: Observable<Pedido[]>;
  pedidosList:Array<any>;
  productos:Array<any>;
  pedidosMozo:Array<any>;
  tipo:any;
  cambiarEstadoPedido = false;
  esMozo:boolean;
  dic:any;
  esCocineroBartender:boolean;
  watchProductos:any;

  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public params:ParamsService,
              private database:DatabaseService,
              public messageHandler:MessageHandler,
              private notificationPushService: NotificationsPushService) {
    this.dic = diccionario;
    this.pedidosMozo = new Array<any>();
    this.productos = new Array<any>();
    this.pedidosList = new Array<any>();

    this.mostrarSpinner = true;

    switch(this.params.rol){
      case 'bartender':
        this.esCocineroBartender = true;
        this.tipo = 'Bebida';
        this.esMozo = false;
        this.getProductos();
        break;
      case 'cocinero':
        this.esCocineroBartender = true;
        this.tipo = 'Comida';
        this.esMozo = false;
        this.getProductos();
        break;
      case 'mozo':
        this.esCocineroBartender = false;
        this.esMozo = true;
        this.getPedidoMozo();
        break;
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoPedidosPage');
  }

  ionViewDidLeave(){
    alert("entro al ionviewdidleave");
    if(this.watchProductos){
      this.watchProductos.unsubscribe();
    }
    if(this.subsPedido){
      this.subsPedido.unsubscribe()
    }
  }

  irA(donde: string){
    switch(donde){
      case 'Nuevo':
        this.navCtrl.push(AltaMenuPage);
        break;
      case 'Todos':
        this.navCtrl.push(ListadoMenuPage);
        break;
    }
  }

  /**
   * Levanta los productos para cocinero o bartender.
   * Chequea y si están todos los productos listos marca el pedido completo como Listo
   */
  getProductos(){
    this.watchProductos = this.subsProducto = this.database.db.list<any>(this.dic.apis.pedidos,ref => ref.orderByChild('estado').equalTo(this.dic.estados_pedidos.en_preparacion))
      .valueChanges()
      .subscribe(snapshots => {

        this.productos = [];
        this.pedidosList = snapshots;
        this.cambiarEstadoPedido = false;
        for (let i = 0; i < this.pedidosList.length; i++) {
          for(let keyProducto in this.pedidosList[i].productos){
            if((!this.pedidosList[i].productos[keyProducto].estado) && this.pedidosList[i].productos[keyProducto].tipo == this.tipo){
              let aux = this.pedidosList[i].productos[keyProducto];
              this.productos.push(aux);
            }
          }
          this.chequearEstadoDeProductos();
          this.mostrarSpinner = false;

        }
        if(this.pedidosList.length == 0){
          if(this.esCocineroBartender){
            this.messageHandler.mostrarMensaje('No hay pedidos pendientes');
          }
          this.mostrarSpinner = false;
        }
      });
  }

  /**
   * Levanta el listado de pedidos listos para el mozo
   */
  getPedidoMozo(){
    this.subsPedido = this.database.db.list<any>(this.dic.apis.pedidos)
      .valueChanges()
      .subscribe(snapshots => {
        this.pedidosList = snapshots;
        this.pedidosList = this.pedidosList.filter(e =>  e.isDelivery == false && (e.estado == this.dic.estados_pedidos.listo || e.estado == this.dic.estados_pedidos.pagado || e.estado == this.dic.estados_pedidos.solicitado));
        this.database.db.list<any>(this.dic.apis.reservas, ref => ref.orderByChild('estado').equalTo(this.dic.estados_reservas.en_curso))
          .valueChanges()
          .subscribe(snapshots => {
            let auxMozo = snapshots;
            while(this.pedidosMozo.length > 0){
              this.pedidosMozo.pop();
            }
            for (let index = 0; index < this.pedidosList.length; index++) {
              for (let j = 0; j < auxMozo.length; j++) {
                if(auxMozo[j]['idPedido'] == this.pedidosList[index].key){
                  this.pedidosMozo.push({ idMesa:auxMozo[j]['idMesa'],
                    estado:this.pedidosList[index].estado,
                    pedido:this.pedidosList[index].key })
                }
              }
            }

            if(this.pedidosMozo.length == 0 || this.pedidosList.length == 0){
              this.mostrarSpinner = false;
              this.messageHandler.mostrarMensaje("No hay pedidos pendientes");
              this.navCtrl.remove(1,1);
            }else{
              this.mostrarSpinner = false;
            }

          });
      });
  }

  /**
   * Cambia el estado del producto dentro del pedido: true o false. Lo toma el ngModel
   * @param pr producto
   */
  cambiarEstado(pr){

    let aux = {
      key : pr.key,
      cantidad : pr.cantidad,
      tipo : pr.tipo,
      estado: pr.estado,//cambia con el ngModel
      nombre: pr.nombre,
      precio: pr.precio,
      pedido: pr.pedido,
      tiempoElaboracion: pr.tiempoElaboracion,
      entrega: pr.estado ? 0 : pr.entrega
    }

    console.log("pedido a subir", aux);

    this.database.jsonPackData = aux;
    this.database.SubirDataBase(this.dic.apis.pedidos+aux.pedido+'/'+this.dic.apis.productos)
      .then(response =>{
        console.log("aux ",aux);
        console.log("response ",response);
      }).catch(error =>{
      alert("error al subir el producto");
      console.log(aux);
    })
  }

  cambiarTiempo(pr){
    this.mostrarSpinner = true;
    let fecha = Date.now();

    let aux = {
      key : pr.key,
      cantidad : pr.cantidad,
      tipo : pr.tipo,
      estado: pr.estado,
      nombre: pr.nombre,
      precio: pr.precio,
      pedido: pr.pedido,
      tiempoElaboracion: pr.tiempoElaboracion,
      entrega: (fecha + (pr.tiempoElaboracion * 60000))
    }

    this.database.jsonPackData = aux;
    this.database.SubirDataBase(this.dic.apis.pedidos+aux.pedido+'/'+this.dic.apis.productos)
      .then(response =>{
        this.mostrarSpinner = false;
      });

  }
  /**Cambia el estado del pedido a Entregado/Cerrado */
  AprobarEntregar(p){
    this.mostrarSpinner = true;
    let auxPedido;
    this.subsUnPedido = this.database.db.list<any>(this.dic.apis.pedidos, ref => ref.orderByChild('key').equalTo(p.pedido))
      .valueChanges()
      .subscribe(snapshots => {
        auxPedido = snapshots;
        if(p.estado == 'Solicitado')
          auxPedido[0].estado = this.dic.estados_pedidos.en_preparacion;
        else if(p.estado == 'Listo')
          auxPedido[0].estado = this.dic.estados_pedidos.entregado;

        this.database.jsonPackData = auxPedido[0];
        this.database.SubirDataBase(this.dic.apis.pedidos).then(e=>{
          this.mostrarSpinner = false;
        });
      });
  }

  cerrarMesa(p){
    this.mostrarSpinner = true;
    //traigo y actualizo los datos de la mesa
    this.subsMesa = this.database.db.list<any>(this.dic.apis.mesas, ref => ref.orderByChild('id').equalTo(p.idMesa))
      .valueChanges()
      .subscribe(snapshots => {
        let auxMesa = snapshots;
        auxMesa[0]['estado'] = this.dic.estados_mesas.libre;
        this.database.jsonPackData = auxMesa[0];
        this.database.SubirDataBase(this.dic.apis.mesas).then(e=>{

          //traigo y finalizo la reserva
          this.subsReserva = this.database.db.list<any>(this.dic.apis.reservas, ref => ref.orderByChild('idPedido').equalTo(p.pedido))
            .valueChanges()
            .subscribe(snapshots => {
              let auxReserva = snapshots;
              auxReserva[0]['estado'] = this.dic.estados_reservas.finalizada;
              this.database.jsonPackData = auxReserva[0];
              this.database.SubirDataBase(this.dic.apis.reservas).then(e=>{
                this.mostrarSpinner = false;
              });
            });
        });
      });
  }

  confirmarProducto(pr){
    this.mostrarSpinner = true;
    let fecha = Date.now();

    let aux = {
      key : pr.key,
      cantidad : pr.cantidad,
      tipo : pr.tipo,
      estado: pr.estado,
      nombre: pr.nombre,
      precio: pr.precio,
      pedido: pr.pedido,
      tiempoElaboracion: pr.tiempoElaboracion,
      entrega: pr.estado ? 0 : (fecha + (pr.tiempoElaboracion * 60000))
    };

    this.database.jsonPackData = aux;
    this.database.SubirDataBase(this.dic.apis.pedidos+aux.pedido+'/'+this.dic.apis.productos)
      .then(response =>{
        this.mostrarSpinner = false;
      });

  }

  private chequearEstadoDeProductos(){
    var todosListos:boolean = true;
    for (let i = 0; i < this.pedidosList.length; i++) {
      if(this.pedidosList[i].estado == diccionario.estados_pedidos.en_preparacion){
        todosListos = true;
        for(let keyProducto in this.pedidosList[i].productos){
          if((!this.pedidosList[i].productos[keyProducto].estado)){
            todosListos = false;
          }
        }
        if(todosListos){
          this.actualizarPedido(this.pedidosList[i]);
        }
      }
    }
  }

  private actualizarPedido(pedidoAActualizar){
    this.mostrarSpinner = true;
    // var pedidoAActualizar = _.find(this.pedidosList, pedido =>{
    //   if(pedido.key == pedidoId && pedido.estado == diccionario.estados_pedidos.en_preparacion){
    //     return pedido;
    //   }
    // });
    pedidoAActualizar.estado = diccionario.estados_pedidos.listo;
    this.database.jsonPackData = pedidoAActualizar;
    this.database.SubirDataBase(this.dic.apis.pedidos).then(e=>{
      this.notificationPushService.notificarMozoPedidoOk();
      this.mostrarSpinner = false;
    });

  }

}

