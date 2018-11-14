import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrincipalClientePage } from '../../principal-cliente/principal-cliente';

/**
 * Generated class for the AdivinarNumeroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adivinar-numero',
  templateUrl: 'adivinar-numero.html',
})
export class AdivinarNumeroPage {

  num:number;
  mayorMenor: string = '...';
  intentos:number;
  yaJugo:boolean;
  display:boolean;

  // Definimos la variable numSecret de tipo number
  numSecret: number = this.numAleatorio(0,100);

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.intentos=5;
    this.yaJugo=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdivinarNumeroPage');
  }

  // Creamos la función numAleatorio que nos devolverá un número aleatorio
  numAleatorio(a,b) 
  {
      return Math.round(Math.random()*(b-a)+parseInt(a));
  }

  // Comprobamos si el número indicado es el correcto
  compruebaNumero(){
    if(this.num)
    {
      // Sumamos 1 intento al contador por cada acción realizada.
      this.intentos = this.intentos-1;

      if(this.numSecret < this.num)
      {
        this.mayorMenor = 'menor';
      }
      else if(this.numSecret > this.num)
      {
        this.mayorMenor = 'mayor';
      }
      else{

        // En caso de acertar el número, no aplicamos la suma del intento.
        this.intentos = this.intentos+1;

        this.mayorMenor = 'igual';
      }
    }  
  }

  regresar(){
    this.navCtrl.setRoot(PrincipalClientePage);
  }


}
