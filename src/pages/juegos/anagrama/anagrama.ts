import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Anagrama } from '../../../models/Juegos/anagrama';
import {TimerObservable} from "rxjs/observable/TimerObservable";

/**
 * Generated class for the AnagramaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-anagrama',
  templateUrl: 'anagrama.html',
})
export class AnagramaPage {

  display : boolean = false;
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
      
      this.anagrama = new Anagrama();
      this.cronometro = '01:00.';
      this.cronoMili = '00';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AnagramaPage');
  }

  generarPalabra(){
    this.anagrama.palabraResultado = null;
    this.verifica = false;
    this.seRindio = false;
    this.anagrama.GenerarPalabra();    
    this.empiezaElJuego = true;
    this.segundos = 60;
    this.milisegundos = 100;
    this.laPalabra = this.anagrama.arrayOrdenado[this.anagrama.palabraSecreta].palabra;
      
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
        this.Rendirse();
      }
      else
      {
        //
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

}


