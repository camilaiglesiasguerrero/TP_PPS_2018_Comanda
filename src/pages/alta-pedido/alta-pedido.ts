import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';
import { ProductoPedido } from '../../models/productoPedido';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';
import { PrincipalMozoPage } from '../principal-mozo/principal-mozo';
import { diccionario } from '../../models/diccionario';
import { Reserva } from '../../models/reserva';
import { Delivery } from '../../models/delivery';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import {ParserTypesService} from "../../services/parserTypesService";


@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

  watcherReservas:any;
  watcherDelivery:any;
  watcherPlatos:any;
  watcherBebidas:any;

  bebidasTotal:any;
  comidasTotal:any;
  bebidas:any;
  comidas:any;
  reserva: Reserva = new Reserva();
  delivery: Delivery = new Delivery();
  productoPedido : Array<ProductoPedido>;
  clienteTieneReserva:boolean;
  direccion:any = {value:""};
  options:any;
  listadoAPedir:Array<any>;
  mostrarParcial:boolean = false;
  mostrarDireccion:boolean = false;
  user:any;
  isDelivery:boolean;
  total:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              private spinnerH:SpinnerHandler,
              private params:ParamsService,
              private barcodeScanner:BarcodeScanner,
              private parse: ParserTypesService) {
    //Entra por escaneo de QR desde cliente o desde mozo
    if(this.navParams.get("mesa")){
      if(this.navParams.get("mesa").split(':')[0]=='Mesa')
        this.reserva.idMesa = this.navParams.get("mesa").split(':')[1];
      else
        this.messageHandler.mostrarErrorLiteral(diccionario.errores.QR_invalido);
    }
    if(this.navParams.get('delivery')){
      this.isDelivery = true;
    }

    //entra por estado del pedido
    this.navParams.get("reserva") ? this.reserva.key = this.navParams.get("reserva") : null;
    this.navParams.get("clienteUid") ? this.reserva.cliente = this.navParams.get("clienteUid") : null;

    //entra por cliente
    if(this.params.rol == 'cliente'){
      if(this.isDelivery){
        this.delivery.cliente = this.params.user.uid;
      }else{
        this.reserva.cliente = this.params.user.uid;
      }
    }


    this.productoPedido = new Array<ProductoPedido>();
    this.listadoAPedir = new Array<any>();


    this.isDelivery ? this.getDelivery() : this.getReservas();
    this.getPlatos();
    this.getBebidas();
  }


  escanearQR(){
    let auxProducto;
    let flag = false;
    this.options = { prompt : "Escaneá el código QR del producto" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        auxProducto  = barcodeData.text;
        for (let index = 0; index < this.comidasTotal.length; index++) {
          if(this.comidasTotal[index].nombre == auxProducto && this.comidasTotal[index].cantidad > 0){
            this.listadoAPedir.push(this.comidas[index]);
            flag = true;
          }
          else if(this.comidasTotal[index].nombre == auxProducto && this.comidasTotal[index].cantidad == 0){
            this.messageHandler.mostrarErrorLiteral('No alcanza el stock');
            flag = true;
          }
        }
        for (let index = 0; index < this.bebidasTotal.length; index++) {
          if(this.bebidasTotal[index].nombre == auxProducto && this.bebidasTotal[index].cantidad > 0){
            this.listadoAPedir.push(this.bebidas[index]);
            flag = true;
          }
          else if(this.bebidas[index].nombre == auxProducto && this.bebidas[index].cantidad == 0){
            this.messageHandler.mostrarErrorLiteral('No alcanza el stock');
            flag = true;
          }
        }
        if(!flag)
          this.messageHandler.mostrarErrorLiteral(diccionario.errores.QR_invalido);
      }, (err) => {
        //console.log('Error: ', err);
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }

  addClick(event,producto){
    this.listadoAPedir.push(producto);
  }

  removeCLick(event, producto){
    var encontrado = _.remove(this.listadoAPedir, item =>{
      return item == producto;
    })

  }

  verParcial(){
    this.armarPedidoProducto();
    this.mostrarParcial = true;
    this.mostrarDireccion = false;
  }

  seguirPidiendo(){
    this.mostrarParcial = false;
    this.mostrarDireccion = false;
  }

  armarPedidoProducto():boolean{
    //vacío el array
    while(this.productoPedido.length > 0)
      this.productoPedido.pop();

    let flag = false;
    let cnt;
    let stock = true;
    if(this.listadoAPedir.length == 0){
      this.messageHandler.mostrarErrorLiteral("Seleccione al menos un producto");
      return false;
    }
    else{
      var total = 0;
      for (let index = 0; index < this.listadoAPedir.length; index++) {
        flag = false;
        total += parseInt(this.listadoAPedir[index].precio);
        if(this.productoPedido.length == 0){
          this.productoPedido.push(new ProductoPedido(this.listadoAPedir[index].key,
            1,
            this.listadoAPedir[index].tipo,
            diccionario.estados_pedidos.solicitado,
            this.listadoAPedir[index].nombre,
            this.listadoAPedir[index].precio));
        }else{
          for (let i  = 0; i  < this.productoPedido.length; i ++) {
            if(this.productoPedido[i].idProducto == this.listadoAPedir[index].key){//si ya pedi este producto le agrego uno
              this.productoPedido[i].cantidad ++;
              flag = true;
              if(this.listadoAPedir[index].tipo == 'Bebida'){                         //si el producto es bebida, verifico q me de el stock
                for (let index = 0; index < this.bebidas.length; index++) {
                  if(this.bebidas.key == this.listadoAPedir[index].key && this.bebidas.cantidad < this.productoPedido[i].cantidad){
                    this.messageHandler.mostrarError('No hay stock suficiente de '+this.bebidas[index].nombre);
                    this.productoPedido[i].cantidad --;
                    stock = false;
                  }
                }
              }else{                                                                  //idem si es comida
                for (let index = 0; index < this.comidas.length; index++) {
                  if(this.comidas.key == this.listadoAPedir[index].key && this.comidas.cantidad < this.productoPedido[i].cantidad){
                    this.messageHandler.mostrarError('No hay stock suficiente de '+this.comidas[index].nombre);
                    this.productoPedido[i].cantidad --;
                    stock = false;
                  }
                }
              }
              break;
            }

            if(!flag && i == this.productoPedido.length - 1){                            //nunca pedi este producto
              this.productoPedido.push(new ProductoPedido(this.listadoAPedir[index].key,
                1,
                this.listadoAPedir[index].tipo,
                diccionario.estados_pedidos.solicitado,
                this.listadoAPedir[index].nombre,
                this.listadoAPedir[index].precio));
              break;
            }
          }
        }
      }
      this.total = total.toString();
    }
    return true;
  }

  Confirmar(){
    if(this.isDelivery){
      this.guardarDelivery();
    }else{
      this.guardarReserva();
    }
  }

  restarProducto(obj){
    let prod = new Producto();

    //campo que cambia
    prod.cantidad = obj.cantidad--;
    //
    prod.descripcion = obj.descripcion;
    prod.foto1 = obj.foto1;
    prod.foto2 = obj.foto2;
    prod.foto3 = obj.foto3;
    prod.key = obj.key;
    prod.nombre = obj.nombre;
    prod.precio = obj.precio;
    prod.tiempoElaboracion = obj.tiempoElaboracion;
    prod.tipo = obj.tipo;

    this.database.jsonPackData = prod;
    if(prod.tipo == 'Bebida')
      this.database.SubirDataBase(diccionario.apis.productos_bebidas).then(a=>{
        return;
      });
    else
      this.database.SubirDataBase(diccionario.apis.productos_platos).then(b=> {
        return;
      });
  }

  obtenerDireccion(){
    this.mostrarDireccion = true;
    this.mostrarParcial = false;
  }

  private getReservas(){
    this.watcherReservas = this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('idMesa').equalTo(this.reserva.idMesa)).valueChanges()
      .subscribe(snapshots => {
        let reservas = new Array<any>();
        reservas = snapshots;
        reservas = reservas.filter(f => f.estado == diccionario.estados_reservas.en_curso);
        if(reservas.length == 1){
          this.reserva.key = reservas[0].key;
          this.reserva.idMesa = reservas[0].idMesa;
          this.reserva.estado = reservas[0].estado;
          this.reserva.cliente = reservas[0].cliente;
          reservas[0].idPedido ? this.reserva.idPedido = reservas[0].idPedido : null;
        }
        if(this.params.rol == 'cliente' && this.reserva.cliente != this.params.user.uid){
          this.messageHandler.mostrarErrorLiteral(diccionario.errores.sin_reserva + ' para vos en esta mesa');
          this.watcherReservas.unsubscribe();
          this.navCtrl.remove(1,1);
        }else if(this.reserva.idPedido != undefined){
          this.messageHandler.mostrarErrorLiteral('Ya hay un pedido hecho para esta mesa.');
          this.watcherReservas.unsubscribe();
          this.navCtrl.remove(1,1);
        }
      });
  }

  private getPlatos(){
    this.watcherPlatos = this.database.db.list<any>(diccionario.apis.productos_platos).valueChanges()
      .subscribe(snapshots => {
        this.comidasTotal = snapshots;
        this.comidas = this.comidasTotal.filter(f => f.cantidad > 0 );
      });
  }

  private getBebidas(){
    this.watcherBebidas = this.database.db.list<any>(diccionario.apis.productos_bebidas).valueChanges()
      .subscribe(snapshots => {
        this.bebidasTotal = snapshots;
        this.bebidas = this.bebidasTotal.filter(f => f.cantidad > 0 );
      });
  }

  private getDelivery(){
    debugger;
    this.watcherDelivery = this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid)).valueChanges()
      .subscribe(snapshots =>{
        var deliverys:any = snapshots;
        for(var i=0; i < deliverys.length; i++){
          if(this.parse.compararFechayHoraMayorAHoy(deliverys[i].fecha)){
            this.delivery.key = deliverys[i].key;
            this.delivery.idPedido = deliverys[i].idPedido;
            this.delivery.cliente = deliverys[i].cliente;
            this.direccion.value = deliverys[i].direccion;
            this.delivery.lat = deliverys[i].lat;
            this.delivery.long = deliverys[i].long;
            this.delivery.estado = deliverys[i].estado;
            this.delivery.infoDireccion = deliverys[i].infoDireccion;
            this.delivery.fecha = deliverys[i].fecha;
            this.getPedidoDelivery();
          }
        }
      })


  }

  private getPedidoDelivery(){
    this.watcherDelivery = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.delivery.idPedido)).valueChanges()
    .subscribe(snapshots => {
      this.listadoAPedir = [];
      var pedidos:any = snapshots;
      for(var i=0; i < pedidos.length; i++){
        for(let key in pedidos[i].productos){
          var bebida = _.find(this.bebidas, bebida =>{
            return bebida.key == pedidos[i].productos[key].key
          })
          if(bebida){
            var cantidad = pedidos[i].productos[key].cantidad;
            for(var j=0; j< cantidad ; j++){
              this.listadoAPedir.push(bebida)
            }
          }
          var plato =_.find(this.comidas, plato =>{
            return plato.key == pedidos[i].productos[key].key
          })
          if(plato){
            var cantidad = pedidos[i].productos[key].cantidad;
            for(var j=0; j< cantidad ; j++){
              this.listadoAPedir.push(plato)
            }
          }
        }
      }
    })

  }

  private guardarReserva(){
    this.watcherReservas.unsubscribe();
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();

    if(this.armarPedidoProducto()){
      let pedidoASubir : Pedido = new Pedido();
      pedidoASubir.isDelivery = false;
      let aux;
      let keyPedido;

      keyPedido = this.database.ObtenerKey(diccionario.apis.pedidos);

      //actualizo la reserva
      this.reserva.idPedido = keyPedido;
      this.database.jsonPackData = this.reserva;
      this.database.SubirDataBase(diccionario.apis.reservas).then(p =>{

        //Creo el pedido
        pedidoASubir.key = keyPedido;
        pedidoASubir.estado = diccionario.estados_pedidos.solicitado;
        pedidoASubir.productoPedido = null;
        this.database.jsonPackData = pedidoASubir;
        this.database.SubirDataBase(diccionario.apis.pedidos).then(r=>{

          //cargo los productos en el pedido
          for (let i = 0; i < this.productoPedido.length; i++) {
            aux = {
              key : this.productoPedido[i].idProducto,
              cantidad : this.productoPedido[i].cantidad,
              tipo : this.productoPedido[i].tipo,
              estado: this.productoPedido[i].estado,
              nombre: this.productoPedido[i].nombre,
              precio: this.productoPedido[i].precio
            }

            this.database.jsonPackData = aux;

            this.database.SubirDataBase(diccionario.apis.pedidos + pedidoASubir.key + "/" +diccionario.apis.productos).then(e=>{
              //resto producto
              for (let p = 0; p < this.listadoAPedir.length; p++) {
                this.restarProducto(this.listadoAPedir[p]);
              }

              if(i==this.productoPedido.length-1){
                spinner.dismiss();
                this.messageHandler.mostrarMensaje('El pedido fue encargado');
                if(this.params.user.rol == 'cliente')
                  this.navCtrl.setRoot(PrincipalClientePage);
                else
                  this.navCtrl.setRoot(PrincipalMozoPage);
              }
            });
          }
        });
      });
    }
  }

  private guardarDelivery(){
    if(this.direccion.value){
      if(this.listadoAPedir.length){
        let spinner = this.spinnerH.getAllPageSpinner();
        spinner.present();
        if(this.armarPedidoProducto()){
          let pedidoASubir : Pedido = new Pedido();
          pedidoASubir.isDelivery = true;
          let aux;
          let keyPedido;
          keyPedido = this.database.ObtenerKey(diccionario.apis.pedidos);
          //actualizo el delivery

          //TODO: chequear esto en edicion:
          this.delivery.key = this.database.ObtenerKey(diccionario.apis.delivery);
          this.delivery.idPedido = keyPedido;
          this.delivery.estado = diccionario.estados_reservas.en_curso;
          this.delivery.direccion = this.direccion.value;
          this.delivery.lat = this.direccion['lat'];
          this.delivery.long = this.direccion['long'];
          this.delivery.infoDireccion = this.direccion['infoDireccion'];
          this.delivery.fecha = this.parse.parseDateToStringDate(new Date());

          this.database.jsonPackData = this.delivery;
          this.database.SubirDataBase(diccionario.apis.delivery).then(p =>{
            //Creo el pedido
            pedidoASubir.key = keyPedido;
            pedidoASubir.estado = diccionario.estados_pedidos.solicitado;
            pedidoASubir.productoPedido = null;

            this.database.jsonPackData = pedidoASubir;
            this.database.SubirDataBase(diccionario.apis.pedidos).then(r=>{
              //cargo los productos en el pedido
              for (let i = 0; i < this.productoPedido.length; i++) {
                aux = {
                  key : this.productoPedido[i].idProducto,
                  cantidad : this.productoPedido[i].cantidad,
                  tipo : this.productoPedido[i].tipo,
                  estado: this.productoPedido[i].estado,
                  nombre: this.productoPedido[i].nombre,
                  precio: this.productoPedido[i].precio
                };

                this.database.jsonPackData = aux;

                this.database.SubirDataBase(diccionario.apis.pedidos + pedidoASubir.key + "/" +diccionario.apis.productos).then(e=>{
                  //resto producto
                  for (let p = 0; p < this.listadoAPedir.length; p++) {
                    this.restarProducto(this.listadoAPedir[p]);
                  }

                  if(i==this.productoPedido.length-1){
                    spinner.dismiss();
                    this.messageHandler.mostrarMensaje('El pedido fue encargado');
                    if(this.params.user.rol == 'cliente')
                      this.navCtrl.setRoot(PrincipalClientePage);
                    else
                      this.navCtrl.setRoot(PrincipalMozoPage);
                  }
                });
              }
            });
          });
        }
      }else{
        this.messageHandler.mostrarErrorLiteral("Debe seleccionar al menos un producto");
      }
    }else{
      this.messageHandler.mostrarErrorLiteral("Debe ingresar una dirección de envío");
    }
  }




}
