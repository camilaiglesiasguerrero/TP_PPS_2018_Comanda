import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { PrincipalClientePage } from '../../principal-cliente/principal-cliente';
import {MessageHandler} from "../../../services/messageHandler.service";
import {DatabaseService} from "../../../services/database.service";
import {ParamsService} from "../../../services/params.service";
import {ParserTypesService} from "../../../services/parserTypesService";
import {diccionario} from "../../../models/diccionario";
import {Juego} from "../../../models/Juegos/juego";


@IonicPage()
@Component({
  selector: 'page-adivinar-numero',
  templateUrl: 'adivinar-numero.html',
})
export class AdivinarNumeroPage {

  display:boolean;
  num:number;
  mayorMenor: string = '...';
  intentos:number;
  yaJugo:boolean;
  aux:any;
  usuario:any;
  empiezaElJuego : boolean = false;
  watchJuegos:any;
  subsPedido : any;
  pedido:any;

  mostrarSpinner:boolean = false;

  // Definimos la variable numSecret de tipo number
  numSecret: number = this.numAleatorio(0,100);

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public messageH:MessageHandler,
              public database:DatabaseService,
              public params: ParamsService,
              private alertCtrl: AlertController,
              private parser: ParserTypesService) {
    this.display = false;
    this.intentos = 5;
    this.usuario = this.params.user;
    this.yaJugo = false;
    this.empiezaElJuego = false;
    this.pedido = this.navParams.get('pedido');
    this.mostrarSpinner = true;
    
    this.watchJuegos =  this.database.db.list<any>(diccionario.apis.juegos).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].cliente == this.usuario.uid && this.aux[index].nombreJuego == diccionario.juegos.adivinar && this.parser.compararFechayHoraMayorAHoy(this.aux[index].fecha)
          ){
            if(this.empiezaElJuego){
            }else{
              messageH.mostrarErrorLiteral('Ya jugaste a adivinar el número hoy');
              this.mostrarSpinner = false;
              navCtrl.remove(1,1);
              return;
            }
          }
        }
        this.mostrarSpinner = false;
        this.display = true;
      });
  }

  ionViewWillLeave(){
    this.watchJuegos.unsubscribe();
  }

  // Creamos la función numAleatorio que nos devolverá un número aleatorio
  numAleatorio(a,b){
    return Math.round(Math.random()*(b-a)+parseInt(a));
  }

  // Comprobamos si el número indicado es el correcto
  compruebaNumero(){
    this.empiezaElJuego = true;
    if(this.num)
    {
      // Sumamos 1 intento al contador por cada acción realizada.
      this.intentos = this.intentos-1;
      if(this.numSecret == this.num){
        this.gano();
        return;
      }
      if(this.numSecret < this.num)
      {
        this.mayorMenor = 'menor';
      }
      else if(this.numSecret > this.num)
      {
        this.mayorMenor = 'mayor';
      }else{
        // En caso de acertar el número, no aplicamos la suma del intento.
        this.intentos = this.intentos+1;
        this.mayorMenor = 'igual';
      }
      if(this.intentos == 0){
        this.perdio();
      }
    }
  }

  gano(){
    this.mostrarSpinner = true;
    this.database.jsonPackData = new Juego(diccionario.juegos.adivinar, this.usuario.uid,true,this.database.ObtenerKey(diccionario.apis.juegos), this.parser.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      this.subsPedido = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.pedido))
        .valueChanges()
        .subscribe(snapshots => {
          let productoGanado = {
            key : this.database.ObtenerKey(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos),
            nombre: '¡Descuento 10%!',
            precio: 0,
            cantidad: 1,
            estado: diccionario.estados_productos.listo,
            tipo: 'Descuento',
            pedido: this.pedido
          };
          //guardo el producto
          this.database.jsonPackData = productoGanado;
          this.database.SubirDataBase(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos).then(r=>{
            this.mostrarSpinner = false;
            let alert = this.alertCtrl.create({
              title: 'Ganaste!!',
              subTitle: "Tienes un 10% de descuento",
              buttons: [
                {
                  text: 'Felicitaciones!',
                  handler: data => {
                    this.subsPedido.unsubscribe();
                    this.navCtrl.setRoot(PrincipalClientePage);
                  }
                }
              ]
            });
            alert.present();
          });
        });
    });
  }

  perdio(){
    this.mostrarSpinner = true;
    this.database.jsonPackData = new Juego(diccionario.juegos.adivinar, this.usuario.uid,false,this.database.ObtenerKey(diccionario.apis.juegos), this.parser.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      this.mostrarSpinner = false;
      let alert = this.alertCtrl.create({
        title: 'Perdiste...',
        subTitle: "El número secreto era: " + this.numSecret,
        buttons: [
          {
            text: 'volver',
            handler: data => {
              this.navCtrl.remove(1,1);
            }
          }
        ]
      });
      alert.present();
    });
  }


}
