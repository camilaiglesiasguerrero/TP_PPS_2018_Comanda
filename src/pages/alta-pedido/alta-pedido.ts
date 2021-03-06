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
import { NotificationsPushService } from '../../services/notificationsPush.service';
import {ChatPage} from "../chat/chat";


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
  direccion:any = {value:"", lat: "", long: "", infoDireccion: ""};
  options:any;
  listadoAPedir:Array<any>;
  mostrarParcial:boolean = false;
  mostrarDireccion:boolean = false;
  user:any;
  isDelivery:boolean;
  total:string = "";
  pedidoYaHecho:boolean;
  promesaPlatos:any;
  promesaBebidas:any;
  arrayPromesas = [];
  display:boolean;
  tiempoEntrega = { hora: 0, minutos: 0};
  estadoPedido:string = "";
  tieneBebidas:boolean = false;
  tieneComidas:boolean = false;
  mostrarSpinner:boolean = false;
  dic:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              private params:ParamsService,
              private barcodeScanner:BarcodeScanner,
              private parse: ParserTypesService,
              private notificationPushService: NotificationsPushService) {
    //Entra por escaneo de QR desde cliente o desde mozo
    this.dic = diccionario;
    this.display = false;
    if(this.navParams.get("mesa")){
      if(this.navParams.get("mesa").split(':')[0]=='Mesa')
        this.reserva.idMesa = this.navParams.get("mesa").split(':')[1];
      else{
        this.messageHandler.mostrarErrorLiteral(diccionario.errores.QR_invalido);
        this.navCtrl.remove(1,1);
      }
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
    this.mostrarSpinner = true;

    this.getPlatos();
    this.getBebidas();
    this.arrayPromesas.push(this.promesaBebidas);
    this.arrayPromesas.push(this.promesaPlatos);
    Observable.forkJoin(this.arrayPromesas).subscribe(() => {
      this.isDelivery ? this.getDelivery() : this.getReservas();
    });
  }


  escanearQR(){
    let auxProducto;
    let flag = false;
    this.options = { prompt : "Escaneá el código QR del producto" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        auxProducto  = barcodeData.text;
        for (let index = 0; index < this.comidas.length; index++) {
          if(this.comidas[index].nombre == auxProducto && this.comidas[index].cantidad > 0){
            this.comidas.cantidadPedida++;
            this.listadoAPedir.push(this.comidas[index]);
            flag = true;
            this.messageHandler.mostrarMensajeCortoAbajo("Se agregó: "+this.comidas[index].nombre);
          }
          else if(this.comidas[index].nombre == auxProducto && this.comidas[index].cantidad == 0){
            this.messageHandler.mostrarErrorLiteral('No alcanza el stock');
            flag = true;
          }
        }
        for (let index = 0; index < this.bebidas.length; index++) {
          if(this.bebidas[index].nombre == auxProducto && this.bebidas[index].cantidad > 0){
            this.bebidas.cantidadPedida++;
            this.listadoAPedir.push(this.bebidas[index]);
            flag = true;
            this.messageHandler.mostrarMensajeCortoAbajo("Se agregó: "+this.bebidas[index].nombre);
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
    if(producto.tipo == 'Comida'){
      for (let i = 0; i < this.comidas.length; i++) {
        if(this.comidas[i].nombre == producto.nombre && this.comidas[i].cantidadPedida <= this.comidas[i].cantidad){
          this.comidas[i].cantidadPedida++;
          break;
        }
      }
    }else{
      for (let i = 0; i < this.bebidas.length; i++) {
        if(this.bebidas[i].nombre == producto.nombre && this.bebidas[i].cantidadPedida <= this.bebidas[i].cantidad){
          this.bebidas[i].cantidadPedida++;
          break;
        }
      }
    }
    this.listadoAPedir.push(producto);
    this.messageHandler.mostrarMensajeCortoAbajo("Se agrego: " + producto.descripcion);
  }

  removeCLick(event, producto){
    var eliminado = false;
    if(producto.tipo == 'Comida'){
      for (let i = 0; i < this.comidas.length; i++) {
        if(this.comidas[i].nombre == producto.nombre && this.comidas[i].cantidadPedida > 0)
          this.comidas[i].cantidadPedida--;
      }
    }else{
      for (let i = 0; i < this.bebidas.length; i++) {
        if(this.bebidas[i].nombre == producto.nombre && this.bebidas[i].cantidadPedida > 0)
          this.bebidas[i].cantidadPedida--;
      }
    }
    _.remove(this.listadoAPedir, item =>{
      if(item == producto){
        if(!eliminado){
          eliminado = true;
          this.messageHandler.mostrarMensajeCortoAbajo("Se quitó: " + producto.descripcion);
          return item == producto
        }
      }
    });
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
    this.tieneBebidas = false;
    this.tieneComidas = false;
    while(this.productoPedido.length > 0)
      this.productoPedido.pop();

    let flag = false;
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
            diccionario.estados_productos.en_preparacion,
            this.listadoAPedir[index].nombre,
            this.listadoAPedir[index].precio,
            this.listadoAPedir[index].tiempoElaboracion,
            (Date.now() + (this.listadoAPedir[index].tiempoElaboracion * 60000))
          ));
          if(this.listadoAPedir[index].tipo == 'Bebida'){
            this.tieneBebidas = true;
          }
          if(this.listadoAPedir[index].tipo == 'Comida'){
            this.tieneComidas = true;
          }
        }else{
          for (let i  = 0; i  < this.productoPedido.length; i ++) {
            if(this.productoPedido[i].idProducto == this.listadoAPedir[index].key){//si ya pedi este producto le agrego uno
              this.productoPedido[i].cantidad ++;
              flag = true;
              if(this.listadoAPedir[index].tipo == 'Bebida'){
                //si el producto es bebida, verifico q me de el stock
                this.tieneBebidas = true;
                for (let j = 0; j < this.bebidas.length; j++) {
                  if(this.bebidas[j].key == this.listadoAPedir[index].key && this.bebidas[j].cantidad < this.productoPedido[i].cantidad){
                    this.messageHandler.mostrarErrorLiteral('No hay stock suficiente de '+this.bebidas[j].nombre);
                    this.productoPedido[i].cantidad --;
                    stock = false;
                  }
                }
              }else{
                //idem si es comida
                this.tieneComidas = true;
                for (let k = 0; k < this.comidas.length; k++) {
                  if(this.comidas[k].key == this.listadoAPedir[index].key && this.comidas[k].cantidad < this.productoPedido[i].cantidad){
                    this.messageHandler.mostrarErrorLiteral('No hay stock suficiente de '+this.comidas[k].nombre);
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
                diccionario.estados_productos.en_preparacion,
                this.listadoAPedir[index].nombre,
                this.listadoAPedir[index].precio,
                this.listadoAPedir[index].tiempoElaboracion,
                (Date.now() + (this.listadoAPedir[index].tiempoElaboracion * 60000))
                )
              );
              if(this.listadoAPedir[index].tipo == 'Bebida'){
                this.tieneBebidas = true;
              }
              if(this.listadoAPedir[index].tipo == 'Comida'){
                this.tieneComidas = true;
              }
              break;
            }
          }
        }
      }
      this.total = total.toString();
    }
    this.calcularTiempoDemora();
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

  chatear(){
    this.navCtrl.push(ChatPage,{idDelivery: this.delivery.key});
  }

  private getReservas(){
    
    this.watcherReservas = this.database.db.list<any>(diccionario.apis.reservas, ref => ref.orderByChild('idMesa').equalTo(this.reserva.idMesa))
      .valueChanges()
      .subscribe(snapshots => {
        let reservas = new Array<any>();
        reservas = snapshots;
        reservas = reservas.filter(f => f.estado == diccionario.estados_reservas.en_curso);

        if(reservas.length == 0){
          this.messageHandler.mostrarErrorLiteral("Esta mesa no está ocupada.");
          this.watcherReservas.unsubscribe();
          this.mostrarSpinner = false;
          this.navCtrl.remove(1,1);
        }

        if(this.params.rol == 'cliente' && this.reserva.cliente != this.params.user.uid){
          this.messageHandler.mostrarErrorLiteral("Esta no es tu mesa asignada.");
          this.watcherReservas.unsubscribe();
          this.mostrarSpinner = false;
          this.navCtrl.remove(1,1);
        }else if(this.reserva.idPedido != undefined){
          this.messageHandler.mostrarErrorLiteral('Ya hay un pedido hecho para esta mesa.');
          this.watcherReservas.unsubscribe();
          this.mostrarSpinner = false;
          this.navCtrl.remove(1,1);
        }

        for(var i=0; i < reservas.length; i++){
          if(this.reserva.idMesa == reservas[i].idMesa && reservas[i].estado == diccionario.estados_reservas.en_curso){
            this.reserva.key = reservas[i].key;
            this.reserva.idMesa = reservas[i].idMesa;
            this.reserva.estado = reservas[i].estado;
            this.reserva.cliente = reservas[i].cliente;
            reservas[0].idPedido ? this.reserva.idPedido = reservas[i].idPedido : null;
            this.reserva.fecha = reservas[i].fecha;
          }
        }
        this.mostrarSpinner = false;
        this.display = true;
      });
  }

  private getPlatos(){
    
    this.promesaPlatos = new Promise(resolve =>{
      setTimeout(() => {
        this.watcherPlatos = this.database.db.list<any>(diccionario.apis.productos_platos).valueChanges()
          .subscribe(snapshots => {
            this.comidasTotal = snapshots;
            let aux = this.comidasTotal.filter(f => f.cantidad > 0 );
            
            this.comidas = new Array<any>();

            for (let i = 0; i < aux.length; i++) {
              this.comidas.push({ foto1:aux[i].foto1,
                foto2:aux[i].foto2,
                foto3:aux[i].foto3,
                precio:aux[i].precio,
                nombre:aux[i].nombre,
                descripcion:aux[i].descripcion,
                cantidad:aux[i].cantidad,
                tipo:aux[i].tipo,
                key:aux[i].key,
                tiempoElaboracion:aux[i].tiempoElaboracion,
                cantidadPedida:0});
            }
            resolve();
          });
      }, 0)
    })
  }

  private getBebidas(){
    
    this.promesaBebidas = new Promise(resolve =>{
      setTimeout(() => {
        this.watcherBebidas = this.database.db.list<any>(diccionario.apis.productos_bebidas).valueChanges()
          .subscribe(snapshots => {
            this.bebidasTotal = snapshots;
            let aux = this.bebidasTotal.filter(f => f.cantidad > 0 );
            
            this.bebidas = new Array<any>();

            for (let i = 0; i < aux.length; i++) {
              this.bebidas.push({ foto1:aux[i].foto1,
                foto2:aux[i].foto2,
                foto3:aux[i].foto3,
                precio:aux[i].precio,
                nombre:aux[i].nombre,
                descripcion:aux[i].descripcion,
                cantidad:aux[i].cantidad,
                tipo:aux[i].tipo,
                key:aux[i].key,
                tiempoElaboracion:aux[i].tiempoElaboracion,
                cantidadPedida:0});
            }
            resolve();
          });
      }, 0)
    });
  }

  private getDelivery(){
    this.watcherDelivery = this.database.db.list<any>(diccionario.apis.delivery, ref => ref.orderByChild('cliente').equalTo(this.params.user.uid)).valueChanges()
      .subscribe(snapshots =>{
        var deliverys:any = snapshots;
        this.pedidoYaHecho = false;
        for(var i=0; i < deliverys.length; i++){
          // if(this.parse.compararFechayHoraMayorAHoy(deliverys[i].fecha)){
          if(deliverys[i].estado == diccionario.estados_delivery.en_curso || deliverys[i].estado == diccionario.estados_delivery.en_camino){
            this.pedidoYaHecho = true;
            this.delivery.key = deliverys[i].key;
            this.delivery.idPedido = deliverys[i].idPedido;
            this.delivery.cliente = deliverys[i].cliente;
            this.direccion.value = deliverys[i].direccion;
            this.delivery.lat = deliverys[i].lat;
            this.delivery.long = deliverys[i].long;
            this.delivery.estado = deliverys[i].estado;
            this.delivery.infoDireccion = deliverys[i].infoDireccion;
            this.delivery.fecha = deliverys[i].fecha;
            this.delivery.tiempoDemoraHora = deliverys[i].tiempoDemoraHora;
            this.delivery.tiempoDemoraMinutos = deliverys[i].tiempoDemoraMinutos;
            this.getPedidoDelivery();
          }
        }
        if(!this.pedidoYaHecho){
          this.mostrarSpinner = false;
          this.display = true;
        }
      })
  }

  private getPedidoDelivery(){
    //TODO: FALTA TIEMPO DE DEMORA!!!!!
    this.watcherDelivery = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.delivery.idPedido)).valueChanges()
      .subscribe(snapshots => {
        this.listadoAPedir = [];
        var tiempoARestar = 0;
        var pedidos:any = snapshots;
        var total = 0;
        for(var i=0; i < pedidos.length; i++){
          this.estadoPedido = pedidos[i].estado;
          for(let key in pedidos[i].productos){
            var bebida = _.find(this.bebidas, bebida =>{
              return bebida.key == pedidos[i].productos[key].key
            });
            if(bebida){
              var cantidadBebida = pedidos[i].productos[key].cantidad;
              for(var j=0; j< cantidadBebida ; j++){
                if(pedidos[i].productos[key].estado == diccionario.estados_productos.listo){
                  tiempoARestar += parseInt(bebida.tiempoElaboracion);
                }
                total += parseInt(bebida.precio);
                this.listadoAPedir.push(bebida)
              }
            }
            var plato =_.find(this.comidas, plato =>{
              return plato.key == pedidos[i].productos[key].key
            });
            if(plato){
              let cantidadPlatos = pedidos[i].productos[key].cantidad;
              for(var k=0; k < cantidadPlatos ; k++){
                if(pedidos[i].productos[key].estado == diccionario.estados_productos.listo){
                  tiempoARestar += parseInt(plato.tiempoElaboracion);
                }
                total += parseInt(plato.precio);
                this.listadoAPedir.push(plato)
              }
            }

          }
        }
        this.calcularTiempoDemoraFaltante(tiempoARestar);
        this.total = total.toString();
        this.display = true;
        this.mostrarSpinner = false;
      })

  }

  private guardarReserva(){
    this.watcherReservas.unsubscribe();
    this.mostrarSpinner = true;

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
        console.log('pedido a subir' + pedidoASubir.key);
        if(this.params.rol == 'cliente')
          pedidoASubir.estado = diccionario.estados_pedidos.solicitado;
        else{
          pedidoASubir.estado = diccionario.estados_pedidos.en_preparacion;
        }
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
              precio: this.productoPedido[i].precio,
              pedido: pedidoASubir.key,
              tiempoElaboracion: this.productoPedido[i].tiempoElaboracion,
              entrega: (Date.now() + (parseFloat(this.productoPedido[i].tiempoElaboracion) * 60000))
            };

            this.database.jsonPackData = aux;

            this.database.SubirDataBase(diccionario.apis.pedidos + pedidoASubir.key + "/" +diccionario.apis.productos).then(e=>{
              //resto producto
              for (let p = 0; p < this.listadoAPedir.length; p++) {
                this.restarProducto(this.listadoAPedir[p]);
              }

              if(i==this.productoPedido.length-1){
                this.mostrarSpinner = false;
                this.messageHandler.mostrarMensaje('El pedido fue encargado');

                //mando push notification
                if(pedidoASubir.estado == diccionario.estados_pedidos.solicitado){ //pedido hecho x cliente
                  this.notificationPushService.notificarPedidoMozo();
                }else{
                  if(pedidoASubir.estado == diccionario.estados_pedidos.en_preparacion){ //pedido hecho x mozo
                    if(this.tieneBebidas)
                      this.notificationPushService.notificarPedidoBartender();
                    if(this.tieneComidas)
                      this.notificationPushService.notificarPedidoCocinero();
                  }
                }

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
        this.mostrarSpinner = true;
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
          this.delivery.estado = diccionario.estados_delivery.en_curso;
          this.delivery.direccion = this.direccion.value;
          this.delivery.lat = this.direccion['lat'];
          this.delivery.long = this.direccion['long'];
          this.delivery.infoDireccion = this.direccion['infoDireccion'];
          this.delivery.fecha = this.parse.parseDateTimeToStringDateTime(new Date());
          this.delivery.tiempoDemoraHora = this.tiempoEntrega.hora;
          this.delivery.tiempoDemoraMinutos = this.tiempoEntrega.minutos;


          this.database.jsonPackData = this.delivery;
          this.database.SubirDataBase(diccionario.apis.delivery).then(p =>{
            //Creo el pedido
            pedidoASubir.key = keyPedido;
            pedidoASubir.estado = diccionario.estados_pedidos.en_preparacion;
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
                  precio: this.productoPedido[i].precio,
                  pedido: pedidoASubir.key,
                  tiempoElaboracion: this.productoPedido[i].tiempoElaboracion
                };

                this.database.jsonPackData = aux;

                this.database.SubirDataBase(diccionario.apis.pedidos + pedidoASubir.key + "/" +diccionario.apis.productos).then(e=>{
                  //resto producto
                  for (let p = 0; p < this.listadoAPedir.length; p++) {
                    this.restarProducto(this.listadoAPedir[p]);
                  }
                  if(i==this.productoPedido.length-1){
                    this.mostrarSpinner = false;
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
          this.enviarNotificaciones();
        }
      }else{
        this.messageHandler.mostrarErrorLiteral("Debe seleccionar al menos un producto");
      }
    }else{
      this.messageHandler.mostrarErrorLiteral("Debe ingresar una dirección de envío");
    }
  }

  private calcularTiempoDemora(){
    this.tiempoEntrega = { hora: 0, minutos: 0};
    var tiempoDemora = 0;
    for(var i = 0; i< this.productoPedido.length; i++){
      var cantidadProductos = this.productoPedido[i].cantidad;
      for(var j = 0; j < cantidadProductos; j++){
        tiempoDemora += parseInt(this.productoPedido[i].tiempoElaboracion)
      }
    }
    if(tiempoDemora > 0){
      if(this.direccion['tiempoArribo']){
        tiempoDemora +=  Math.floor(this.direccion['tiempoArribo']);
        var hora = 0;
        var minutos = 0;
        if(tiempoDemora > 60){
          minutos = tiempoDemora - 60;
          hora++;
        }else{
          minutos = tiempoDemora;
        }
        while(minutos > 60){
          minutos = minutos - 60;
          hora++;
        }
        this.tiempoEntrega.hora = hora;
        this.tiempoEntrega.minutos = minutos;
      }
    }
  }

  private enviarNotificaciones(){
    if(this.tieneComidas){
      this.notificationPushService.notificarPedidoCocinero();
    }
    if(this.tieneBebidas){
      this.notificationPushService.notificarPedidoBartender();
    }
  }

  private calcularTiempoDemoraFaltante(tiempoRestar){
    var minutosTotales = 0
    for(var i=0; i < this.delivery.tiempoDemoraHora; i++){
      minutosTotales = minutosTotales + 60;
    }
    minutosTotales = minutosTotales + this.delivery.tiempoDemoraMinutos;
    var tiempoResante = minutosTotales - tiempoRestar;
    var minutos = 0;
    var hora = 0;
    if(tiempoResante > 60){
      minutos = tiempoResante - 60;
      hora++;
    }else{
      minutos = tiempoResante;
    }
    while(minutos > 60){
      minutos = minutos - 60;
      hora++;
    }
    this.tiempoEntrega.hora = hora;
    this.tiempoEntrega.minutos = minutos;
  }
}
