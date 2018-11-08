import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';
import { ProductoPedido } from '../../models/productoPedido';
import { MessageHandler } from '../../services/messageHandler.service';

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
productoPedido : Array<ProductoPedido>;
producto : Array<Producto>;
spinner:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              private spinnerH:SpinnerHandler) {
    

    this.elPedido = new Pedido();
    this.productoPedido = new Array<ProductoPedido>();
    this.producto = new Array<Producto>();

    
    this.database.db.list<any>('productos/platos/').valueChanges()
      .subscribe(snapshots => {
          this.comidasTotal = snapshots;  
          this.comidas = this.comidasTotal.filter(f => f.estado == 'Habilitado' );
          this.comidas = this.comidasTotal.filter(f => f.cantidad > 0 );   
          
      });    

    this.database.db.list<any>('productos/bebidas/').valueChanges()
      .subscribe(snapshots => {
          this.bebidasTotal = snapshots;  
          this.bebidas = this.bebidasTotal.filter(f => f.estado == 'Habilitado' );
          this.bebidas = this.bebidasTotal.filter(f => f.cantidad > 0 );  
          
      });     
 
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaPedidoPage');
  }

  tapEvent(event,producto){    
    let flag = false;
    let stock = true;
    if(this.productoPedido.length > 0){//tengo algún producto en la lista de pedidos
      for (let i = 0; i < this.productoPedido.length; i++) {
        if(this.productoPedido[i].idProducto == producto.key){//si ya pedi este producto
          this.productoPedido[i].cantidad ++;                 //le agrego uno
          flag = true;
          if(producto.tipo == 'Bebida'){                      //si el producto es bebida, verifico q me de el stock
            for (let index = 0; index < this.bebidasTotal.length; index++) {
              if(this.bebidasTotal.key == producto.key && this.bebidasTotal.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.bebidasTotal[index].nombre);
                this.productoPedido[i].cantidad --;
                stock = false;
              }
            }
          }else{                                            //idem si es comida
            for (let index = 0; index < this.comidasTotal.length; index++) {
              if(this.comidasTotal.key == producto.key && this.comidasTotal.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.comidasTotal[index].nombre);
                this.productoPedido[i].cantidad --;
                stock = false;
              }
            }
          }
          
          break;
        }
      }
      if(!flag){//si no pedí el producto lo agrego
        let prod = new ProductoPedido();
        prod.idProducto = producto.key;
        prod.cantidad = 1;
        prod.tipo = producto.tipo;
        this.productoPedido.push(new ProductoPedido(producto.key,1,producto.tipo));
    }
  }else
      this.productoPedido.push(new ProductoPedido(producto.key,1,producto.tipo));
  
    if(stock){
      producto.cantidad--;
      this.producto.push(producto);
    }
    console.log(this.productoPedido);
  }

  Confirmar(){ 
    
    let pedidoASubir : Pedido = new Pedido();

    pedidoASubir.key = this.database.ObtenerKey('pedidos/');
    pedidoASubir.estado = 'Solicitado';
    pedidoASubir.productoPedido = null;
    this.database.jsonPackData = pedidoASubir;
    this.database.SubirDataBase('pedidos/').then(r=>{
      this.restarProducto();

      for (let i = 0; i < this.productoPedido.length; i++) {
        this.database.jsonPackData.key = this.productoPedido[i].idProducto;
        this.database.jsonPackData.cantidad = this.productoPedido[i].cantidad;
        this.database.jsonPackData.tipo = this.productoPedido[i].tipo; 
        
        this.database.SubirDataBase('pedidos/'+pedidoASubir.key+'/productos/').then(e=>{
          this.messageHandler.mostrarMensaje('Su pedido fue encargado');
          
        })
      } 
    });
    
  }

  restarProducto(){
    let prod = new Producto();
    for (let i = 0; i < this.producto.length; i++) {
      //campo que cambia
      prod.cantidad = this.producto[i].cantidad;
      //
      prod.descripcion = this.producto[i].descripcion;
      prod.estado = this.producto[i].estado;
      prod.foto1 = this.producto[i].foto1;
      prod.foto2 = this.producto[i].foto2;
      prod.foto3 = this.producto[i].foto3;
      prod.key = this.producto[i].key;
      prod.nombre = this.producto[i].nombre;
      prod.precio = this.producto[i].precio;
      prod.tiempoElaboracion = this.producto[i].tiempoElaboracion;
      prod.tipo = this.producto[i].tipo;

      this.database.jsonPackData = prod;
      if(prod.tipo == 'Bebida')
        this.database.SubirDataBase('productos/bebidas/');
      else 
        this.database.SubirDataBase('productos/comidas/');
    }
  }
}
