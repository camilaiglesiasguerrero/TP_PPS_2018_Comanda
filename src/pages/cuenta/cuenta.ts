import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Spinner } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';
import { PropinaPage } from '../propina/propina';
import { ParamsService } from '../../services/params.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { EncuestaClientePage } from '../encuesta-cliente/encuesta-cliente';


/**
 * Generated class for the CuentaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cuenta',
  templateUrl: 'cuenta.html',
})
export class CuentaPage {

  detalleCuenta : Array<any>;
  aux : Array<any>;
  suma:number;
  propina:any;
  pedidoSubs:any;
  tieneDescuento = false;
  pedido:any;

  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseService,
              private params:ParamsService,
              private messageHandler: MessageHandler) {
    this.suma = 0;
    this.aux = new Array<any>();
    this.detalleCuenta = new Array<any>();
    this.propina = false;
    this.mostrarSpinner = true;
    this.pedido =this.navParams.get('pedido');
    this.pedidoSubs = this.database.db.list<any>(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos)
      .valueChanges()
      .subscribe(snapshots => {
        
        
        this.aux = snapshots;
        for (let i = 0; i < this.aux.length; i++) {
          if(this.aux[i].tipo == 'Descuento'){
            this.tieneDescuento = true;
          }else{
            this.detalleCuenta.push({ item:this.aux[i].nombre, cantidad:this.aux[i].cantidad, valor:this.aux[i].precio * this.aux[i].cantidad });
            this.suma += this.aux[i].precio * this.aux[i].cantidad;
          }
        }
        if(this.tieneDescuento){
          this.detalleCuenta.push({ item:'¡Descuento del 10%!',cantidad:1,valor: this.suma * 0.1});
          this.suma -= this.suma * 0.1;
        }
        if(this.params.propinaAux != 0){
          this.propina = true;

        }
        this.mostrarSpinner = false;
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CuentaPage');
  }

  dejarPropina(){
    this.params.propinaAux = 0;
    this.propina = true;
    this.navCtrl.setRoot(PropinaPage,{cuenta:this.suma, pedido: this.pedido});
  }

  confirmar(){
    this.pedidoSubs.unsubscribe();
    this.mostrarSpinner = true;

    //cargo cuenta
    let cuenta = {
      key: this.database.ObtenerKey(diccionario.apis.cuentas),
      cliente: this.params.user.uid,
      propinaPje: this.params.propinaAux,
      cuenta: this.suma
    };
    this.database.jsonPackData = cuenta;
    this.database.SubirDataBase(diccionario.apis.cuentas).then(r=>{
      //leo y actualizo estado pedido
      let subsTmp = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.navParams.get('pedido')))
        .valueChanges()
        .subscribe(snapshots => {
          let auxPedido = snapshots;
          auxPedido[0]['estado'] = diccionario.estados_pedidos.pagado;
          this.database.jsonPackData = auxPedido[0];
          this.database.SubirDataBase(diccionario.apis.pedidos).then(e=>{
            this.mostrarSpinner = false;
            this.messageHandler.mostrarMensaje("¡Te esperamos la próxima!");
            this.navCtrl.setRoot(EncuestaClientePage);
          });
        });
    });
  }

}
