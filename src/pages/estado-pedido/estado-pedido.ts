import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { Pedido } from '../../models/pedido';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { EncuestaClientePage } from '../encuesta-cliente/encuesta-cliente';

/**
 * Generated class for the EstadoPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  spinner:any;
  encuesta:boolean;
  user:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database:DatabaseService,
              private messageHandler: MessageHandler,
              public viewCtrl: ViewController,
              private spinnerHandler:SpinnerHandler,
              public params: ParamsService) {
    
    this.user = this.params.user;
    this.encuesta = false;
    if(this.navParams.get('mesa').split(':')[0] != 'Mesa'){
      this.messageHandler.mostrarError('Ese QR no es de una mesa');
      this.irA('cerrar');
    }
    else
      this.mesa = this.navParams.get('mesa').split(':')[1];
    this.pedido = new Pedido();
    this.pedido.id = -1;
    this.mostrar = false;
    this.spinner = spinnerHandler.getAllPageSpinner();
    this.spinner.present();

    this.database.db.list<any>('reservas/').valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        if(this.params.rol == 'cliente')
          this.aux = this.aux.filter(a => a.idCliente == this.user.dni);
        for (let index = 0; index < this.aux.length; index++) {
          //tengo la mesa con pedido => busco el pedido
          if(this.aux[index].idMesa == this.mesa.toString() && this.aux[index].estado == 'Con pedido'){
            this.pedido.id = this.aux[index].idPedido;
            
            this.database.db.list<any>('pedidos/').valueChanges()
              .subscribe(snp => {
                  this.aux = snp;
                  for (let i = 0; i < this.aux.length; i++) {
                    if(this.aux[i].idPedido == this.pedido.id){
                      this.pedido.estado = this.aux[i].estado;
                      this.mostrar = true;
                      this.spinner.dismiss();    
                      //console.log(this.pedido);                  
                      break;
                    }
                  }
                  if(this.pedido.estado == 'Finalizado' && this.params.rol == 'cliente')
                    this.encuesta = true;
              });
            break;
          }
        }
        //si no tengo pedido es porque la mesa está libre o deshabilitada o porque aun no hice pedido
        if(this.pedido.id == -1 && this.params.rol == 'empleado' ){
          this.spinner.dismiss();
          setTimeout(function(){
              messageHandler.mostrarErrorLiteral('No se registra pedido para la mesa.');
              viewCtrl.dismiss();
            },2000);
          }else if(this.pedido.id == -1 && this.params.rol == 'cliente'){
            this.spinner.dismiss();
          setTimeout(function(){
              messageHandler.mostrarErrorLiteral('No se registra pedido para usted en esa mesa.');
              viewCtrl.dismiss();
            },2000);
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
    }
  }



}
