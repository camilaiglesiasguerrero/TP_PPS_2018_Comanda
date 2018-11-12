import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { EncuestaClienteService } from '../../services/encuestasCliente.service';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';
import {DatabaseService} from "../../services/database.service";
import {diccionario} from "../../models/diccionario";

@Component({
  selector: 'page-encuesta-cliente-resultados',
  templateUrl: 'encuesta-cliente-resultados.html'
})

export class EncuestaClienteResultadosPage implements OnInit{

  display: boolean = false;
  barOptions = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{ id: 'y-axis-1', type: 'linear', position: 'left', ticks: { min: 0 } }]
    }
  };
  dataAtencion = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };
  countAtencionMuyBien:number;
  countAtencionBien:number;
  countAtencionRegular:number;
  counAtencionMala:number;

  countLimpiezaMuyBien:number;
  countLimpiezaBien:number;
  countLimpiezaRegular:number;
  counLimpiezaMalo:number;

  constructor(public navParams: NavParams,
              private spinnerHandler: SpinnerHandler,
              public database:DatabaseService,) {
  }

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados(){
    this.dataAtencion.labels.push("Muy Buena");
    this.dataAtencion.labels.push("Buena");
    this.dataAtencion.labels.push("Regular");
    this.dataAtencion.labels.push("Mala");
    let spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.database.db.list<any>(diccionario.apis.encuesta_cliente).valueChanges()
      .subscribe(snapshots => {
        debugger;
        var lala = snapshots;
        this.initCounts()
        for(var i=0; i < lala.length; i++){
          for(let key in lala[i]){
            if(key == 'atencion'){
              this.agregarAtencion(lala[i][key]);
            }
            if(key == 'limpieza'){
              this.agregarLimpieza(lala[i][key]);
            }
            if(key == 'sabor'){
              this.agregarSabor(lala[i][key]);
            }
            if(key == 'velocidad'){
              this.agregarVelocidad(lala[i][key]);

            }
            if(key == 'recomendar'){
              this.agregarRecomendacion(lala[i][key]);
            }
          }
        }
        this.dataAtencion.datasets[0].data.push(this.countAtencionMuyBien);
        this.dataAtencion.datasets[0].data.push(this.countAtencionBien);
        this.dataAtencion.datasets[0].data.push(this.countAtencionRegular);
        this.dataAtencion.datasets[0].data.push(this.countAtencionRegular);

      });
  }


  private initCounts(){
    this.countAtencionMuyBien = 0;
    this.countAtencionBien = 0;
    this.countAtencionRegular = 0;
    this.counAtencionMala = 0;
    this.countLimpiezaMuyBien = 0;
    this.countLimpiezaBien = 0;
    this.countLimpiezaRegular = 0;
    this.counLimpiezaMalo = 0;
  }

  private agregarAtencion(resultado){
    switch (resultado) {
      case "muyBuena":
        this.countAtencionMuyBien++;
        break;
      case "buena":
        this.countAtencionBien++;
        break;
      case "regular":
        this.countAtencionRegular++;
        break;
      case "mala":
        this.counAtencionMala++;
        break;
    }
  }

  private agregarLimpieza(resultado){
    switch (resultado) {
      case "muyBien":
        this.countLimpiezaMuyBien++;
        break;
      case "bien":
        this.countLimpiezaBien++;
        break;
      case "regular":
        this.countLimpiezaRegular++;
        break;
      case "malo":
        this.counLimpiezaMalo++;
        break;
    }
  }

  private agregarSabor(resultado){
    switch (resultado) {
      case "muyRica":
        break;
      case "rica":
        break;
      case "regular":
        break;
      case "mala":
        break;
    }
  }

  private agregarRecomendacion(resultado){
    switch (resultado) {
      case "si":
        break;
      case "no":
        break;
    }
  }

  private agregarVelocidad(resultado){
    switch (resultado) {
      case "rapida":
        break;
      case "demoro":
        break;
      case "tardo":
        break;
    }
  }



}
