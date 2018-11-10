import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { AltaMenuPage } from '../alta-menu/alta-menu';
import { DatabaseService } from '../../services/database.service';
import { Producto } from '../../models/producto';
import { MessageHandler } from '../../services/messageHandler.service';
import {diccionario} from "../../models/diccionario";


@IonicPage()
@Component({
  selector: 'page-listado-menu',
  templateUrl: 'listado-menu.html',
})
export class ListadoMenuPage {


  menu:string;
  listado : any;
  producto:Producto;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public params: ParamsService,
              private database: DatabaseService,
              private messageHandler:MessageHandler) {

    this.producto = new Producto();
    if(this.params.rol == 'bartender'){
      this.menu = 'bebidas';
      this.producto.tipo = 'Bebida';
    }else{
      this.menu = 'platos';
      this.producto.tipo = 'Comida';
    }
    this.navParams.get('alta') ? this.navCtrl.remove(1,1) : null;

    this.database.db.list<any>(diccionario.apis.productos + this.menu).valueChanges()
      .subscribe(snapshots => {
          this.listado = snapshots;  
          for (let index = 0; index < this.listado.length; index++) {
            if(this.listado[index].cantidad == 0)
              this.inhabilitarProducto(this.listado[index]);
            
          }

      });     
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListadoMenuPage');
  }

  cambiarEstado(p: any){
    this.producto.nombre = p.nombre;
    this.producto.descripcion = p.descripcion;
    this.producto.tiempoElaboracion = p.tiempoElaboracion;
    this.producto.precio = p.precio;
    this.producto.cantidad = p.cantidad;
    this.producto.foto1 = p.foto1;
    this.producto.foto2 = p.foto2;
    this.producto.foto3 = p.foto3; 
    this.producto.key = p.key;

    this.producto.estado == 'Habilitado' ? this.producto.estado = 'Deshabilitado' : this.producto.estado = 'Habilitado' ;

    this.database.jsonPackData = this.producto;
        
    this.database.SubirDataBase('productos/'+this.menu+'/').then(r => {          
      
      });
  }

  irA(donde: string,p?:any){
    switch(donde){
      case 'Nuevo':
        this.navCtrl.push(AltaMenuPage,{listado:true});
        break;
      case 'Editar':
        this.navCtrl.push(AltaMenuPage,{listado:true,producto:p});
        break;
    }
  }

  inhabilitarProducto(producto){
    this.producto = producto;
    this.producto.estado = 'Sin stock';
    
    this.database.jsonPackData = this.producto;
    this.database.SubirDataBase('productos/'+this.menu);
  }
}
