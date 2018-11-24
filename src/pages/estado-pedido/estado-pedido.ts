import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { Pedido } from '../../models/pedido';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { EncuestaClientePage } from '../encuesta-cliente/encuesta-cliente';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';
import {diccionario} from "../../models/diccionario";
import { CuentaPage } from '../cuenta/cuenta';


@IonicPage()
@Component({
  selector: 'page-estado-pedido',
  templateUrl: 'estado-pedido.html',
})
export class EstadoPedidoPage {

  mesa:string;
  aux:any;
  pedido:Pedido;
  mostrar:boolean;
  mostrarDetallePedido:boolean;
  encuesta:boolean;
  cuenta:boolean;
  user:any;
  hacerPedido:boolean;
  reservaKey:string;
  clienteUid:string;
  cerrar:boolean;
  subsReserva:any;
  subsPedido:any;
  mostrarSpinner : boolean = false;
  productosPedidos:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database:DatabaseService,
              private messageHandler: MessageHandler,
              public viewCtrl: ViewController,
              public params: ParamsService) {
    
    this.user = this.params.user;
    this.encuesta = false;
    this.cuenta = false;
    this.hacerPedido = false;
    this.cerrar = false;

    if(this.navParams.get('mesa').split(':')[0] != 'Mesa'){
      this.messageHandler.mostrarErrorLiteral(diccionario.errores.QR_invalido);
      this.irA('cerrar');
    }
    else
      this.mesa = this.navParams.get('mesa').split(':')[1];

    this.pedido = new Pedido();
    this.pedido.key = '-1';
    this.mostrar = false;
    this.mostrarSpinner = true;
                                                                                                            
    this.subsReserva = this.database.db.list<any>(diccionario.apis.reservas,ref => ref.orderByChild('idMesa').equalTo(this.mesa))
    .valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        if(this.params.rol == 'cliente')
          this.aux = this.aux.filter(a => a.cliente == this.user.uid);
        for (let index = 0; index < this.aux.length; index++) {
          //tengo la mesa con pedido => busco el pedido
          if(this.aux[index].idMesa == this.mesa.toString() && this.aux[index].estado == diccionario.estados_reservas.en_curso){
            this.pedido.key = this.aux[index].idPedido;
            this.reservaKey = this.aux[index].key;
            this.subsPedido = this.database.db.list<any>(diccionario.apis.pedidos,ref => ref.orderByChild('key').equalTo(this.pedido.key))
              .valueChanges()
              .subscribe(snp => {
                  this.aux = snp;
                  this.pedido.estado = this.aux[0].estado;
                  this.mostrar = true;
                  if(this.pedido.estado == diccionario.estados_pedidos.en_preparacion 
                    || this.pedido.estado == diccionario.estados_pedidos.listo ){
                      this.productosPedidos = [];
                      
                      for (let i = 0; i < this.aux.length; i++) {
                        for(let keyProducto in this.aux[i].productos){
                          //console.log(keyProducto);
                          //console.log(this.aux[i])
                          let pr = this.aux[i].productos[keyProducto];
                          this.productosPedidos.push(pr);
                          this.mostrarDetallePedido  =true;
                        }
                      }
                    }
                
                  if(this.pedido.estado == diccionario.estados_pedidos.entregado && this.params.rol == 'cliente'){
                    this.cuenta = true;
                  }else if(this.pedido.estado == diccionario.estados_pedidos.pagado && this.params.rol == 'mozo'){
                    this.cerrar = true;
                  }
                  this.mostrarSpinner = false;     
              });
            break;
          }else if(this.aux[index].idMesa == this.mesa.toString() && this.aux[index].estado == diccionario.estados_reservas.en_curso){
            this.reservaKey = this.aux[index].key;
            this.clienteUid = this.aux[index].cliente;
            
          }
        }
        //si no tengo pedido es porque la mesa está libre o deshabilitada o porque aun no hice pedido
        if(this.pedido.key == '-1' && this.params.rol == 'mozo' ){
          this.mostrarSpinner = false;
          messageHandler.mostrarErrorLiteral(diccionario.errores.sin_pedido);
          this.hacerPedido = true;
          }else if(this.pedido.key == '-1' && this.params.rol == 'cliente'){
            this.mostrarSpinner = false;
            messageHandler.mostrarErrorLiteral(diccionario.errores.sin_pedido);
            this.navCtrl.remove(1,1);
          }
      });       
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EstadoPedidoPage');
  }

  irA(donde:string){
    switch(donde){
      case 'encuestaCliente':
        this.navCtrl.push(EncuestaClientePage);
        break;
      case 'cerrar':
        this.viewCtrl.dismiss();
        break;
      case 'hacerPedido':
        this.navCtrl.push(AltaPedidoPage, { reserva: this.reservaKey, clienteUid: this.clienteUid, mesa: this.mesa});
        break;
      case 'solicitarCuenta':
        this.navCtrl.push(CuentaPage, { pedido: this.pedido.key});
        break;
    }
  }

  cerrarMesa(){
    this.mostrarSpinner = true;
    this.subsPedido.unsubscribe();
    this.subsReserva.unsubscribe();
    //traigo y actualizo los datos de la mesa
    this.database.db.list<any>(diccionario.apis.mesas, ref => ref.orderByChild('id').equalTo(this.mesa))
    .valueChanges()
    .subscribe(snapshots => {
      let auxMesa = snapshots;
      auxMesa[0]['estado'] = diccionario.estados_mesas.libre;
      this.database.jsonPackData = auxMesa[0]; 
      this.database.SubirDataBase(diccionario.apis.mesas).then(e=>{
        
        //traigo y finalizo la reseva
        this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('key').equalTo(this.reservaKey))
          .valueChanges()
          .subscribe(snapshots => {
            let auxReserva = snapshots;
            auxReserva[0]['estado'] = diccionario.estados_reservas.finalizada;
            this.database.jsonPackData = auxReserva[0]; 
            this.database.SubirDataBase(diccionario.apis.reservas).then(e=>{
            
              this.mostrarSpinner = false;
            this.navCtrl.remove(1,1);
        });
      });    
    });
  });
  }



}
