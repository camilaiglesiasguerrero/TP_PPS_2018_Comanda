import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';

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
  suma = 0;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseService) {

    this.aux = new Array<any>();
    this.detalleCuenta = new Array<any>();
    
    this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.navParams.get('pedido')))
      .valueChanges()
      .subscribe(snapshots => {
          this.aux = snapshots;
          for (let i = 0; i < this.aux[0].producto.length; i++) {
            this.detalleCuenta.push({ item:this.aux[0].producto.nombre, cantidad:this.aux[0].producto.cantidad, valor:this.aux[0].producto.precio * this.aux[0].producto.cantidad }); 
            this.suma += this.aux[0].producto.precio * this.aux[0].producto.cantidad;  
          }
     }).unsubscribe(); 
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CuentaPage');
  }

}
