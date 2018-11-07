import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';
import { ProductoPedido } from '../../models/productoPedido';
import { MessageHandler } from '../../services/messageHandler.service';
import { isRightSide } from 'ionic-angular/umd/util/util';

/**
 * Generated class for the AltaPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

bebidas:any;
bebidasTotal:any;
comidas:any;
comidasTotal:any;
platos:0;
botellas:0;
suma:0;
elPedido:Pedido;
spinner:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseService,
              private spinnerH:SpinnerHandler,
              private messageHandler:MessageHandler) {
    
    this.spinner = spinnerH.getAllPageSpinner();
    this.elPedido = new Pedido();
    

    this.database.db.list<any>('productos/bebidas/').valueChanges()
      .subscribe(snapshots => {
          this.bebidasTotal = snapshots;  
          this.bebidas = this.bebidasTotal.filter(f => f.estado == 'Habilitado' );
          this.bebidas = this.bebidasTotal.filter(f => f.cantidad > 0 );          
      });     

    this.database.db.list<any>('productos/platos/').valueChanges()
      .subscribe(snapshots => {
          this.comidasTotal = snapshots;  
          this.comidas = this.comidasTotal.filter(f => f.estado == 'Habilitado' );
          this.comidas = this.comidasTotal.filter(f => f.cantidad > 0 );
          
      });     
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaPedidoPage');
  }

  tapEvent(event,producto){    
    for (let i = 0; i < this.elPedido.productoPedido.length; i++) {
      if(this.elPedido.productoPedido[i].idProducto == producto.key){
        this.elPedido.productoPedido[i].cantidad ++;
        if(producto.tipo == 'Bebida'){
          for (let index = 0; index < this.bebidasTotal.length; index++) {
            if(this.bebidasTotal.key == producto.key && this.bebidasTotal.cantidad < this.elPedido.productoPedido[i].cantidad){
              this.messageHandler.mostrarError('No hay stock suficiente de '+this.bebidasTotal[index].nombre);
              this.elPedido.productoPedido[i].cantidad --;
            }
          }
        }else{
          for (let index = 0; index < this.comidasTotal.length; index++) {
            if(this.comidasTotal.key == producto.key && this.comidasTotal.cantidad < this.elPedido.productoPedido[i].cantidad){
              this.messageHandler.mostrarError('No hay stock suficiente de '+this.comidasTotal[index].nombre);
              this.elPedido.productoPedido[i].cantidad --;
            }
          }
        }
      }
      else
        this.elPedido.productoPedido.push(producto);
    }
    console.log(this.elPedido);
  }

  Confirmar(){
    this.spinner.present();
    let pedidoASubir; 

    pedidoASubir.key = this.database.ObtenerKey('pedidos/');
    pedidoASubir.estado = 'Solicitado';
    this.database.jsonPackData = pedidoASubir;
    this.database.SubirDataBase('pedidos/');

    for (let i = 0; i < this.elPedido.productoPedido.length; i++) {
      this.restarProducto(this.elPedido.productoPedido[i]);
      this.database.jsonPackData = this.elPedido.productoPedido[i];
      this.database.SubirDataBase('pedidos/'+pedidoASubir.key+'/productos/');
    }      

    this.messageHandler.mostrarMensaje('Su pedido fue encargado');
  }



 
  restarProducto(tmpProd){
    let prod = new Producto();
    
    //campo que cambia
    prod.cantidad = tmpProd.cantidad;
    //
    prod.descripcion = tmpProd.descripcion;
    prod.estado = tmpProd.estado;
    prod.foto1 = tmpProd.foto1;
    prod.foto2 = tmpProd.foto2;
    prod.foto3 = tmpProd.foto3;
    prod.key = tmpProd.key;
    prod.nombre = tmpProd.nombre;
    prod.precio = tmpProd.precio;
    prod.tiempoElaboracion = tmpProd.tiempoElaboracion;
    prod.tipo = tmpProd.tipo;

    this.database.jsonPackData = prod;
    this.database.SubirDataBase('productos/'+prod.tipo);
  }
}
