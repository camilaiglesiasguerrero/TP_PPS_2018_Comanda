import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

  bebidas:any;
  comidas:any;
  reservas:any;
  reservaKey : string;
  reservaCliente:string;
  reservaMesa:any;
  productoPedido : Array<ProductoPedido>;
  user:any;
  clienteTieneReserva:boolean;
  direccion:any = {value:""};
  options:any;
  listadoAPedir:Array<any>;
  mostrarParcial:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              public spinnerH:SpinnerHandler,
              private params:ParamsService,
              private barcodeScanner:BarcodeScanner) {

    this.navParams.get("reserva") ? this.reservaKey = this.navParams.get("reserva") : null;
    this.navParams.get("clienteUid") ? this.reservaCliente = this.navParams.get("clienteUid") : null;
    this.navParams.get("mesa") ? this.reservaMesa = this.navParams.get("mesa") : null;
    this.productoPedido = new Array<ProductoPedido>();
    this.listadoAPedir = new Array<any>();
    this.user = this.params.user;

    this.database.db.list<any>(diccionario.apis.reservas).valueChanges()
      .subscribe(snapshots => {
        this.reservas = snapshots;
        this.reservas = this.reservas.filter(f => f.estado == 'Reserva');
        if(this.params.rol == 'cliente'){
          this.reservas = this.reservas.filter(f=> f.cliente == this.params.user.clienteUid )
        }
      });

    this.database.db.list<any>(diccionario.apis.productos_platos).valueChanges()
      .subscribe(snapshots => {
        this.comidas = snapshots;
        this.comidas = this.comidas.filter(f => f.cantidad > 0 );

      });

    this.database.db.list<any>(diccionario.apis.productos_bebidas).valueChanges()
      .subscribe(snapshots => {
        this.bebidas = snapshots;
        this.bebidas = this.bebidas.filter(f => f.cantidad > 0 );

      });
  }

  ionViewDidLoad() {
  }

  escanearQR(){
    let auxProducto;
    this.options = { prompt : "Escaneá el código QR del producto" }
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        auxProducto  = barcodeData.text;
        if(auxProducto.split(':')[0] == 'Comida'){
          for (let index = 0; index < this.comidas.length; index++) {
            if(this.comidas[index].nombre == auxProducto)
              this.listadoAPedir.push(this.comidas[index]);
          }
        }else if(auxProducto.split(':')[0] == 'Bebida'){
          for (let index = 0; index < this.bebidas.length; index++) {
            if(this.bebidas[index].nombre == auxProducto)
              this.listadoAPedir.push(this.bebidas[index]);
          }
        }
      }, (err) => {
        //console.log('Error: ', err);
        this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
  }

  tapEvent(event,producto){
    this.listadoAPedir.push(producto);
  }

  verParcial(){
    //vacío el array
    while(this.productoPedido.length > 0)
      this.productoPedido.pop();

    let flag = false;
    let cnt;
    let stock = true;

    for (let index = 0; index < this.listadoAPedir.length; index++) {
      if(this.productoPedido.length == 0)
        this.productoPedido.push(new ProductoPedido(this.listadoAPedir[index].key,1,this.listadoAPedir[index].tipo));
      else{
        for (let i  = 0; i  < this.productoPedido.length; i ++) {
          cnt = 0;
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
          cnt ++;
          if(!flag && cnt == this.productoPedido.length)                             //nunca pedi este producto
            this.productoPedido.push(new ProductoPedido(this.listadoAPedir[index].key,1,this.listadoAPedir[index].tipo));
        }
      }
    }
    this.mostrarParcial = true;
  }

  seguirPidiendo(){
    this.mostrarParcial = false;
  }

  Confirmar(){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    let pedidoASubir : Pedido = new Pedido();
    let aux;
    pedidoASubir.key = this.database.ObtenerKey(diccionario.apis.pedidos);
    pedidoASubir.estado = diccionario.estados_pedidos.solicitado;
    pedidoASubir.productoPedido = null;
    this.database.jsonPackData = pedidoASubir;
    this.database.SubirDataBase(diccionario.apis.pedidos).then(r=>{
      this.restarProducto();

      for (let i = 0; i < this.productoPedido.length; i++) {
        aux = {
          key : this.productoPedido[i].idProducto,
          cantidad : this.productoPedido[i].cantidad,
          tipo : this.productoPedido[i].tipo
        }

        this.database.jsonPackData = aux;

        this.database.SubirDataBase(diccionario.apis.pedidos + pedidoASubir.key + "/" +diccionario.apis.productos).then(e=>{
          spinner.dismiss();
          this.messageHandler.mostrarMensaje('El pedido fue encargado');
          if(this.params.user.rol == 'cliente')
            this.navCtrl.setRoot(PrincipalClientePage);
          else
            this.navCtrl.setRoot(PrincipalMozoPage);
        });
      }
    });
  }

  restarProducto(){
    let prod = new Producto();
    for (let i = 0; i < this.listadoAPedir.length; i++) {
      //campo que cambia
      prod.cantidad = this.listadoAPedir[i].cantidad--;
      //
      prod.descripcion = this.listadoAPedir[i].descripcion;
      prod.foto1 = this.listadoAPedir[i].foto1;
      prod.foto2 = this.listadoAPedir[i].foto2;
      prod.foto3 = this.listadoAPedir[i].foto3;
      prod.key = this.listadoAPedir[i].key;
      prod.nombre = this.listadoAPedir[i].nombre;
      prod.precio = this.listadoAPedir[i].precio;
      prod.tiempoElaboracion = this.listadoAPedir[i].tiempoElaboracion;
      prod.tipo = this.listadoAPedir[i].tipo;

      this.database.jsonPackData = prod;
      if(prod.tipo == 'Bebida')
        this.database.SubirDataBase(diccionario.apis.productos_bebidas);
      else
        this.database.SubirDataBase(diccionario.apis.productos_platos);
    }
  }






}
