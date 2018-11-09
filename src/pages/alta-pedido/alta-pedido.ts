import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';
import { ProductoPedido } from '../../models/productoPedido';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';

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
comidas:any;
reservas:any;
reservaKey : string;
reservadniCliente:string;
reservaMesa:any;
productoPedido : Array<ProductoPedido>;
producto : Array<Producto>;
spinner:any;
user:any;
beb = 0;
pla = 0;
clienteTieneReserva:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              private spinnerH:SpinnerHandler,
              private params:ParamsService) {
    
    this.navParams.get("reserva") ? this.reservaKey = this.navParams.get("reserva") : null;
    this.navParams.get("dniCliente") ? this.reservadniCliente = this.navParams.get("dniCliente") : null;
    this.navParams.get("mesa") ? this.reservaMesa = this.navParams.get("mesa") : null;

    this.productoPedido = new Array<ProductoPedido>();
    this.producto = new Array<Producto>();
    this.user = this.params.user;
                
    this.database.db.list<any>('reservas/').valueChanges()
      .subscribe(snapshots => {
          this.reservas = snapshots;
          this.reservas = this.reservas.filter(f => f.estado == 'Reserva');
          if(this.params.rol == 'cliente'){
            this.reservas = this.reservas.filter(f=> f.cliente == this.params.user.dni )
          }
     }); 

    this.database.db.list<any>('productos/platos/').valueChanges()
      .subscribe(snapshots => {
          this.comidas = snapshots;  
          this.comidas = this.comidas.filter(f => f.estado == 'Habilitado' );
          this.comidas = this.comidas.filter(f => f.cantidad > 0 );   
          
      });    

    this.database.db.list<any>('productos/bebidas/').valueChanges()
      .subscribe(snapshots => {
          this.bebidas = snapshots;  
          this.bebidas = this.bebidas.filter(f => f.estado == 'Habilitado' );
          this.bebidas = this.bebidas.filter(f => f.cantidad > 0 );  
          
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
            for (let index = 0; index < this.bebidas.length; index++) {
              if(this.bebidas.key == producto.key && this.bebidas.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.bebidas[index].nombre);
                this.productoPedido[i].cantidad --;
                stock = false;
              }
            }
          }else{                                            //idem si es comida
            for (let index = 0; index < this.comidas.length; index++) {
              if(this.comidas.key == producto.key && this.comidas.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.comidas[index].nombre);
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
      if(producto.tipo == 'Bebida')
        this.beb ++;
      else
        this.pla++;
    }
    
  }

  Confirmar(){ 
    /*let spinner = this.spinnerH;
    spinner.getAllPageSpinner();
    spinner.present();*/
    let pedidoASubir : Pedido = new Pedido();
    let aux; 
    pedidoASubir.key = this.database.ObtenerKey('pedidos/');
    pedidoASubir.estado = 'Solicitado';
    pedidoASubir.productoPedido = null;
    this.database.jsonPackData = pedidoASubir;
    this.database.SubirDataBase('pedidos/').then(r=>{
      this.restarProducto();

      for (let i = 0; i < this.productoPedido.length; i++) {
         aux = {
          key : this.productoPedido[i].idProducto,
          cantidad : this.productoPedido[i].cantidad,
          tipo : this.productoPedido[i].tipo
        }
        
        this.database.jsonPackData = aux;
        
        this.database.SubirDataBase('pedidos/'+pedidoASubir.key+'/productos/').then(e=>{
          this.messageHandler.mostrarMensaje('El pedido fue encargado');
        });    
      }
    });       
      
      if(this.params.rol == 'cliente'){
        for (let j = 0; j < this.reservas.length; j++) {
          if(this.reservas[j].dniCliente == this.user.dni){          
            let res = {
              key: this.reservas[j].key,
              dniCliente: this.reservas[j].dniCliente,
              idMesa: this.reservas[j].idMesa,
              idPedido: pedidoASubir.key,
              estado:'Con pedido'
            } 
            this.database.jsonPackData = res;
            this.database.SubirDataBase('reservas/');
          }
        }
      }else{
        let res = {
          key: this.reservaKey,
          dniCliente: this.reservadniCliente,
          idMesa: this.reservaMesa,
          idPedido: pedidoASubir.key,
          estado:'Con pedido'
        } 
        this.database.jsonPackData = res;
        this.database.SubirDataBase('reservas/');
      }
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
        this.database.SubirDataBase('productos/platos/');
    }
  }
}
