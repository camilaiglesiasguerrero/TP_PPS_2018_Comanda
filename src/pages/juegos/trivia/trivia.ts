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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public messageH:MessageHandler,
              public spinner: SpinnerHandler,
              public database:DatabaseService,
              public params: ParamsService,
              private alertCtrl: AlertController) {

    let juego : Juego = new Juego();
    this.usuario = this.params.user;
    this.database.db.list<any>(diccionario.apis.juegos).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
        for (let index = 0; index < this.aux.length; index++) {
          if(this.aux[index].cliente == this.usuario.dni
            //&& this.aux[index].fecha == datetime.getToday()
            && this.aux[index].nombreJuego == 'Trivia'){
            if(this.empiezaElJuego){
            }else{
              messageH.mostrarErrorLiteral('Ya jugaste Trivia hoy');
              navCtrl.remove(1,1);
            }
          }
        }
      });
    this.cronometro = '00:10.';
    this.cronoMili = '00';
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
        item == this.trivia.preguntaSecreta
      });
      if(existe){
        this.yaSeMostro = true;
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
            //var x = document.getElementById("timer");
            clearInterval(this.repetidor);
            // this.Verificar();
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
        let spinner = this.spinner.getAllPageSpinner();
        spinner.present();
        clearInterval(this.repetidor);
        var correcta = _.find(this.pregunta.respuestas, item =>{
          return item.correcta == true;

        });
        this.perdiste(spinner, correcta.description);
      }
    }
  }

  private perdiste(spinner, correcta){
    this.database.jsonPackData = new Juego('Trivia',this.usuario.dni,false,this.database.ObtenerKey(diccionario.apis.juegos));
    this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
      spinner.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Perdiste....',
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
    let alert = this.alertCtrl.create({
      title: 'Ganaste!!',
      buttons: [
        {
          text: 'Felicitaciones!',
          handler: data => {
            this.database.jsonPackData = new Juego('Trivia',this.usuario.dni,true,this.database.ObtenerKey(diccionario.apis.juegos));
            this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
              this.navCtrl.setRoot(PrincipalClientePage);
            });
          }
        }
      ]
    });
    alert.present();

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
