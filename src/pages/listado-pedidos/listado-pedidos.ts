import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';
import {diccionario} from "../../models/diccionario";
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { MessageHandler } from '../../services/messageHandler.service';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              //public db:AngularFireDatabase,
              public params:ParamsService,
              private database:DatabaseService,
              private spinnerH:SpinnerHandler,
              public messageHandler:MessageHandler) {
    
    //this.tipoEmpleado=this.navParams.get("tipoEmpleado");           
    /*this.pedidosList = new Array<any>();
    this.pedidosObs= db.list<any>(diccionario.apis.pedidos).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.pedidosObs.subscribe( res =>{
      this.pedidosList = res;
      console.log(this.pedidosList);
      for (let index = 0; index < this.pedidosList.length; index++) {
        console.log(this.pedidosList[index].productos);
        
      }
    });*/
    this.pedidosMozo = new Array<any>();
    this.productos = new Array<any>();
    this.pedidosList = new Array<any>();
    let spinner = spinnerH.getAllPageSpinner();
    spinner.present();
    switch(this.params.rol){
      case 'bartender':
        this.tipo = 'Bebida';
        this.esMozo = false;
        this.getProductos(spinner);
        break;
      case 'cocinero':
        this.tipo = 'Comida';
        this.esMozo = false;
        this.getProductos(spinner);
        break;
      case 'mozo':
        this.esMozo = true;
        this.getPedidoMozo(spinner);
        break;
    }
  }
  

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoPedidosPage');
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
  getProductos(spinner){
    this.subsProducto = this.database.db.list<any>(diccionario.apis.pedidos,ref => ref.orderByChild('estado').equalTo(diccionario.estados_pedidos.en_preparacion))
    .valueChanges()
    .subscribe(snapshots => {
      this.pedidosList = snapshots;
      this.cambiarEstadoPedido = false;
      for (let i = 0; i < this.pedidosList.length; i++) {
        this.database.db.list<any>(diccionario.apis.pedidos+this.pedidosList[i].key+'/'+diccionario.apis.productos)
        .valueChanges()
        .subscribe(snp => {
          let cont = 0;
          let aux = snp;
          this.productos[i] = aux;
          for (let j = 0; j < this.productos[i].length; j++) {
            if(this.productos[i][j].estado)
              cont++;
            if(cont == this.productos[i].length){
                this.pedidosList[i].estado = diccionario.estados_pedidos.listo;
                this.database.jsonPackData = this.pedidosList[i];
                this.database.SubirDataBase(diccionario.apis.pedidos);
              }
            }
            spinner.dismiss();
        });
      }
      if(this.pedidosList.length == 0){
        this.messageHandler.mostrarMensaje('No hay pedidos pendientes');
        spinner.dismiss();
      }
    });
  }

  /**
   * Levanta el listado de pedidos listos para el mozo
   */
  getPedidoMozo(spinner){
    this.subsPedido = this.database.db.list<any>(diccionario.apis.pedidos)
    .valueChanges()
    .subscribe(snapshots => {
      this.pedidosList = snapshots;
      this.pedidosList = this.pedidosList.filter(e =>  e.isDelivery == false && (e.estado == diccionario.estados_pedidos.listo || e.estado == diccionario.estados_pedidos.pagado || e.estado == diccionario.estados_pedidos.solicitado));
      this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('estado').equalTo(diccionario.estados_reservas.en_curso))
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
          spinner.dismiss();
          this.messageHandler.mostrarMensaje("No hay pedidos pendientes");
          this.navCtrl.remove(1,1);
        }else{
          spinner.dismiss();
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
        pedido: pr.pedido
      }
    
    this.database.jsonPackData = aux;
    this.database.SubirDataBase(diccionario.apis.pedidos+aux.pedido+'/'+diccionario.apis.productos);
  }

  /**Cambia el estado del pedido a Entregado/Cerrado */
  AprobarEntregar(p){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    let auxPedido;
    this.subsUnPedido = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(p.pedido))
      .valueChanges()
      .subscribe(snapshots => {
        auxPedido = snapshots;
        if(p.estado == 'Solicitado') 
          auxPedido[0].estado = diccionario.estados_pedidos.en_preparacion;
        else if(p.estado == 'Listo')
          auxPedido[0].estado = diccionario.estados_pedidos.entregado;

        this.database.jsonPackData = auxPedido[0];
        this.database.SubirDataBase(diccionario.apis.pedidos).then(e=>{
        spinner.dismiss();
      });
    });
  }

  cerrarMesa(p){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    //traigo y actualizo los datos de la mesa
    this.subsMesa = this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(p.idMesa))
    .valueChanges()
    .subscribe(snapshots => {
      let auxMesa = snapshots;
      auxMesa[0]['estado'] = diccionario.estados_mesas.libre;
      this.database.jsonPackData = auxMesa[0]; 
      this.database.SubirDataBase(diccionario.apis.mesas).then(e=>{
        
        //traigo y finalizo la reserva
        this.subsReserva = this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('idPedido').equalTo(p.pedido))
          .valueChanges()
          .subscribe(snapshots => {
            let auxReserva = snapshots;
            auxReserva[0]['estado'] = diccionario.estados_reservas.finalizada;
            this.database.jsonPackData = auxReserva[0]; 
            this.database.SubirDataBase(diccionario.apis.reservas).then(e=>{
            spinner.dismiss();
        });
      });    
    });
  });
  }
}

