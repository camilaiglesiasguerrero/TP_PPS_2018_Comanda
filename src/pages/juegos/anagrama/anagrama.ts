import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Anagrama } from '../../../models/Juegos/anagrama';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { MessageHandler } from '../../../services/messageHandler.service';
import { DatabaseService } from '../../../services/database.service';
import { Juego } from '../../../models/Juegos/juego';
import { ParamsService } from '../../../services/params.service';
import { diccionario } from "../../../models/diccionario";


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

  usuario:any;
  aux:any;
 
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public messageH:MessageHandler,
              public database:DatabaseService,
              public params: ParamsService) {
    
    let juego : Juego = new Juego();
    this.usuario = this.params.user;
    this.database.db.list<any>(diccionario.apis.juegos).valueChanges()
      .subscribe(snapshots => {
        this.aux = snapshots;
       
        for (let index = 0; index < this.aux.length; index++) {
            if(this.aux[index].cliente == this.usuario.dni 
              && this.aux[index].fecha == juego.obtenerFecha() 
              && this.aux[index].nombreJuego == 'Anagrama'){
                setTimeout(function(){
                  messageH.mostrarErrorLiteral('Ya jugaste Anagrama hoy');
                  navCtrl.remove(1,1);
                },2000);
            }

        }
    });

      this.anagrama = new Anagrama(); 
      this.cronometro = '00:30.';
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
    this.segundos = 29;
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
        this.database.jsonPackData = new Juego('Anagrama',this.usuario.dni,false,this.database.ObtenerKey(diccionario.apis.juegos));
        this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
          setTimeout(function(){
            this.messageHandler.mostrarErrorLiteral('¡Perdiste!');
            this.navCtrl.remove(1,1);
          },2000);
      })
      }
      else
      {
        this.database.jsonPackData = new Juego('Anagrama',this.usuario.dni,true,this.database.ObtenerKey(diccionario.apis.juegos));
        this.database.SubirDataBase(diccionario.apis.juegos).then(e=>{
          setTimeout(function(){
            this.messageHandler.mostrarMensaje('¡Ganaste!');
            this.navCtrl.remove(1,1);
          },2000);        
        });
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


