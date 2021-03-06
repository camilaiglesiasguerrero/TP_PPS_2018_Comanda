import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { Anagrama } from '../../../models/Juegos/anagrama';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { MessageHandler } from '../../../services/messageHandler.service';
import { DatabaseService } from '../../../services/database.service';
import { Juego } from '../../../models/Juegos/juego';
import { ParamsService } from '../../../services/params.service';
import { diccionario } from "../../../models/diccionario";
import { ParserTypesService } from '../../../services/parserTypesService';
import {NotificationsPushService} from "../../../services/notificationsPush.service";


@IonicPage()
@Component({
  selector: 'page-anagrama',
  templateUrl: 'anagrama.html',
})
export class AnagramaPage {

  anagrama : Anagrama;
  empiezaElJuego : boolean = false;
  repetidor: any;
  segundos: number = 0;
  milisegundos: number = 0;
  cronometro: string;
  cronoMili: string;
  verifica: boolean = false;
  resultado: string;
  val:number;
  seRindio: boolean = false;
  laPalabra: string;
  letras: Array<any>;
  display:boolean;
  watchJuegos:any;
  sinTiempo:boolean;

  usuario:any;
  aux:any;
  pedido:any;

  subsPedido : any;

  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public messageH:MessageHandler,
              public database:DatabaseService,
              public params: ParamsService,
              public parserType: ParserTypesService,
              private alertCtrl: AlertController,
              private notificationsPushService: NotificationsPushService) {
    this.pedido = this.navParams.get('pedido');
    this.display = false;
    this.usuario = this.params.user;
    this.empiezaElJuego = false;
    this.mostrarSpinner = true;
    this.watchJuegos = this.database.db.list<any>(diccionario.apis.juegos).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].cliente == this.usuario.uid  && this.parserType.compararFechayHoraMayorAHoy(this.aux[index].fecha) && this.aux[index].nombreJuego == diccionario.juegos.anagrama){
            if(!this.empiezaElJuego){
              messageH.mostrarErrorLiteral('Ya jugaste Anagrama hoy');
              this.mostrarSpinner = false;
              navCtrl.remove(1,1);
              return;
            }
          }
        }
        this.mostrarSpinner = false;
        this.display = true;
      });

    this.anagrama = new Anagrama();
    this.cronometro = '00:30.';
    this.cronoMili = '00';

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AnagramaPage');
  }

  ionViewWillLeave(){
    this.watchJuegos.unsubscribe();
  }

  generarPalabra(){
    this.empiezaElJuego = true;
    this.anagrama.palabraResultado = null;
    this.verifica = false;
    this.seRindio = false;
    this.anagrama.GenerarPalabra();
    this.segundos = 29;
    this.milisegundos = 100;
    this.laPalabra = this.anagrama.arrayOrdenado[this.anagrama.palabraSecreta].palabra;
    this.sinTiempo = false;
    clearInterval(this.repetidor);

    this.repetidor = setInterval( ()=> {
        this.cronometro = '00:' + (this.segundos <= 9 ? '0' + this.segundos.toString() : this.segundos.toString()) + '.';
        this.cronoMili = this.milisegundos <= 9 ? '0' + this.milisegundos.toString() : this.milisegundos.toString();
        this.milisegundos-=1;
        if( this.milisegundos == 0)
        {
          this.milisegundos = 99;
          if(this.segundos != 0)
          {
            this.segundos -=1;
            if(this.segundos == 5)
            {
              var x = document.getElementById("timer");
              x.className = "pocoTiempo";
            }
          }
          else
          {
            this.cronoMili = '00';
            var x = document.getElementById("timer");
            this.sinTiempo = true;
            clearInterval(this.repetidor);
            this.Verificar();
          }
        }
      }
      , 10);



  }

  Verificar(){
    if(this.anagrama.palabraResultado != '' && this.anagrama.palabraResultado != null)
    {
      clearInterval(this.repetidor);
      if(!this.anagrama.Verificar())
      {
        this.perdio();
      }
      else
      {
        this.database.jsonPackData = new Juego(diccionario.juegos.anagrama,this.usuario.uid,true,this.database.ObtenerKey(diccionario.apis.juegos), this.parserType.parseDateTimeToStringDateTime(new Date()));
        this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
          //levanto el pedido
          this.subsPedido = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.pedido))
            .valueChanges()
            .subscribe(snapshots => {

              let productoGanado = {
                key : this.database.ObtenerKey(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos),
                nombre: '¡Daikiri ganado!',
                precio: 0,
                cantidad: 1,
                estado: diccionario.estados_productos.en_preparacion,
                tipo: 'Bebida',
                pedido: this.pedido,
                tiempoElaboracion: 20,
                entrega: (Date.now() + (20 * 60000))
              }
              //guardo el producto
              this.database.jsonPackData = productoGanado;
              this.database.SubirDataBase(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos).then(r=>{
                this.notificationsPushService.notificarPedidoBartender();
                this.subsPedido.unsubscribe();
              });
            });
        });
        let alert = this.alertCtrl.create({
          title: '¡Ganaste!',
          subTitle: "Tenés una bebida gratis.",
          buttons: [
            {
              text: 'Felicitaciones',
              handler: data => {
                this.navCtrl.remove(1,1);
              }
            }
          ]
        });
        alert.present();
      }
    }else{
      if(this.sinTiempo){
        this.perdio();
      }
    }
  }

  Rendirse(){
    clearInterval(this.repetidor);
    this.seRindio = true;
  }

  Mezclar(){
    this.anagrama.Mezclar(this.anagrama.arrayOrdenado, this.anagrama.palabraSecreta);
  }

  private perdio(){
    this.Rendirse();
    this.database.jsonPackData = new Juego('Anagrama',this.usuario.uid,false,this.database.ObtenerKey(diccionario.apis.juegos), this.parserType.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      let alert = this.alertCtrl.create({
        title: 'Perdiste...',
        subTitle: "Volvé a intentar otro día.",
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
    })
  }

}


