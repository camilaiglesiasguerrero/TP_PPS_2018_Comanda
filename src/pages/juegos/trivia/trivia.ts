import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { Anagrama } from '../../../models/Juegos/anagrama';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { MessageHandler } from '../../../services/messageHandler.service';
import { DatabaseService } from '../../../services/database.service';
import { Juego } from '../../../models/Juegos/juego';
import { ParamsService } from '../../../services/params.service';
import {Trivia} from "../../../models/Juegos/trivia";
import {SpinnerHandler} from "../../../services/spinnerHandler.service";
import {PrincipalClientePage} from "../../principal-cliente/principal-cliente";
import * as _ from 'lodash';
import {diccionario} from "../../../models/diccionario";
import {ParserTypesService} from "../../../services/parserTypesService";
import {NotificationsPushService} from "../../../services/notificationsPush.service";

@Component({
  selector: 'page-trivia',
  templateUrl: 'trivia.html',
})
export class TriviaPage {

  display : boolean = false;
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
  trivia = new Trivia();
  usuario:any;
  aux:any;
  pregunta:any;
  respuesta:boolean;
  cantPreg=0;
  preguntasMostradas = [];
  yaSeMostro = true;
  subsPedido : any;
  pedido:any;
  watchJuegos:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public messageH:MessageHandler,
              public spinnerH: SpinnerHandler,
              public database:DatabaseService,
              public params: ParamsService,
              private alertCtrl: AlertController,
              private parser: ParserTypesService,
              private notificationsPushService: NotificationsPushService) {
    this.display = false;
    this.empiezaElJuego = false;
    this.usuario = this.params.user;
    this.pedido = this.navParams.get('pedido');
    let spinner = spinnerH.getAllPageSpinner();
    spinner.present();
    this.watchJuegos = this.database.db.list<any>(diccionario.apis.juegos).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].cliente == this.usuario.uid && this.aux[index].nombreJuego == diccionario.juegos.trivia && this.parser.compararFechayHoraMayorAHoy(this.aux[index].fecha)
          ){
            if(this.empiezaElJuego){
            }else{
              messageH.mostrarErrorLiteral('Ya jugaste Trivia hoy');
              spinner.dismiss();
              navCtrl.remove(1,1);
              return;
            }
          }
        }
        spinner.dismiss();
        this.display = true;
      });
    this.cronometro = '00:10.';
    this.cronoMili = '00';
  }


  ionViewWillLeave(){
    this.watchJuegos.unsubscribe();
  }


  comenzar(){
    this.verifica = false;
    this.seRindio = false;
    this.empiezaElJuego = true;
    this.segundos = 9;
    this.milisegundos = 100;
    this.cantPreg++;
    this.trivia.generarPregunta();
    this.yaSeMostro = true;
    while(this.yaSeMostro){
      var existe =_.find(this.preguntasMostradas, item => {
        return item == this.trivia.preguntaSecreta
      });
      if(existe){
        this.yaSeMostro = true;
        this.trivia.generarPregunta();
      }else{
        this.yaSeMostro = false;
      }
    }
    clearInterval(this.repetidor);
    this.preguntasMostradas.push(this.trivia.preguntaSecreta);
    this.pregunta = this.trivia.arrayOrdenado[this.trivia.preguntaSecreta];
    // this.respuesta = null;
    var x = document.getElementById("timer");
    x.className = "timer";
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
            clearInterval(this.repetidor);
            this.sinTiempo();
          }
        }
      }
      , 10);
  }

  respuestaClick(respuesta){
    if(respuesta){
      if(respuesta.correcta){
        clearInterval(this.repetidor);
        if(this.cantPreg >= 5){
          this.ganaste();
        }else{
          this.esCorrecta();
        }
      }else{
        clearInterval(this.repetidor);
        var correcta = _.find(this.pregunta.respuestas, item =>{
          return item.correcta == true;
        });
        this.perdiste(correcta.description);
      }
    }
  }

  private perdiste(correcta){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    this.database.jsonPackData = new Juego(diccionario.juegos.trivia,this.usuario.uid,false,this.database.ObtenerKey(diccionario.apis.juegos), this.parser.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      spinner.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Perdiste...',
        subTitle: "La respuesta correcta era: " + correcta,
        buttons: [
          {
            text: 'Intenta otro día...',
            handler: data => {
              this.navCtrl.remove(1,1);
            }
          }
        ]
      });
      alert.present();
    });
  }

  private ganaste(){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    this.database.jsonPackData = new Juego(diccionario.juegos.trivia,this.usuario.uid,true,this.database.ObtenerKey(diccionario.apis.juegos), this.parser.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      this.subsPedido = this.database.db.list<any>(diccionario.apis.pedidos, ref => ref.orderByChild('key').equalTo(this.pedido))
        .valueChanges()
        .subscribe(snapshots => {
          let productoGanado = {
            key : this.database.ObtenerKey(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos),
            nombre: '¡Tiramisu ganado!',
            precio: 0,
            cantidad: 1,
            estado: diccionario.estados_productos.en_preparacion,
            tipo: 'Comida',
            pedido: this.pedido
          };
          //guardo el producto
          this.database.jsonPackData = productoGanado;
          this.database.SubirDataBase(diccionario.apis.pedidos+this.pedido+'/'+diccionario.apis.productos).then(r=>{
            spinner.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Ganaste!!',
              subTitle: "Tenés un postre Tiramisú gratis",
              buttons: [
                {
                  text: 'Felicitaciones!',
                  handler: data => {
                    this.notificationsPushService.notificarPedidoCocinero();
                    this.navCtrl.setRoot(PrincipalClientePage);
                  }
                }
              ]
            });
            alert.present();
            this.subsPedido.unsubscribe();
          });
        });
    });
  }

  private sinTiempo(){
    let spinner = this.spinnerH.getAllPageSpinner();
    spinner.present();
    this.database.jsonPackData = new Juego(diccionario.juegos.trivia, this.usuario.uid,false,this.database.ObtenerKey(diccionario.apis.juegos), this.parser.parseDateTimeToStringDateTime(new Date()));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      let alert = this.alertCtrl.create({
        title: 'Perdiste!!',
        subTitle: "Te quedaste sin tiempo",
        buttons: [
          {
            text: 'Intenta otro día...',
            handler: data => {
              spinner.dismiss();
              this.navCtrl.setRoot(PrincipalClientePage);
            }
          }
        ]
      });
      alert.present();
    });
  }

  private esCorrecta(){
    let alert = this.alertCtrl.create({
      title: 'Es correcta!',
      buttons: [
        {
          text: 'Preparate para la siguiente...',
          handler: data => {
            this.comenzar();
          }
        }
      ]
    });
    alert.present();
  }

}
