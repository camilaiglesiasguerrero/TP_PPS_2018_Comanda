import { Component, OnInit, Input } from '@angular/core';
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

  @Input('from-dashboard') fromDashboard:boolean;

  display: boolean = false;
  encuestas=[];

  atencionOptions = {
    title: {
      display: true,
      text: 'Atención recibida',
      fontSize: 16,
      fontColor: '#fff'
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: 'white'
      }
    }
  };
  limpiezaOptions = {
    title: {
      display: true,
      text: 'Limpieza del lugar',
      fontSize: 16,
      fontColor: '#fff'
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: 'white'
      }
    }
  };
  saborOptions = {
    title: {
      display: true,
      text: 'Calidad de la comida',
      fontSize: 16,
      fontColor: '#fff'
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: 'white'
      }
    }
  };
  velocidadOptions = {
    title: {
      display: true,
      fontSize: 16,
      fontColor: '#fff',
      text: 'Velocidad de entrega'
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
      }],
      xAxes: [{
        ticks: {
          fontColor: 'white'
        },
      }]
    }
  };
  recomendarOptions = {
    title: {
      display: true,
      fontSize: 16,
      fontColor: '#fff',
      text: 'Recomendarían el lugar'
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
      }],
      xAxes: [{
        ticks: {
          fontColor: 'white'
        },
      }]
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
  dataLimpieza = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };
  dataSabor = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };
  dataVelocidad = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };
  dataRecomendar = {
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
  countLimpiezaMalo:number;

  countSaborMuyRica:number;
  countSaborRica:number;
  countSaborRegular:number;
  countSaborMala:number;

  countVelocidadRapida:number;
  countVelocidadDemoro:number;
  countVelocidadTardo:number;

  countRecomendarSi:number;
  countRecomendarNo:number;

  constructor(public navParams: NavParams,
              private spinnerHandler: SpinnerHandler,
              public database:DatabaseService,) {
  }

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados(){
    this.initLabels();
    let spinner = this.spinnerHandler.getAllPageSpinner();
    spinner.present();
    this.database.db.list<any>(diccionario.apis.encuesta_cliente).valueChanges()
      .subscribe(snapshots => {
        this.display = false;
        this.encuestas = snapshots;
        this.initCounts()
        for(var i=0; i < this.encuestas .length; i++){
          for(let key in this.encuestas [i]){
            if(key == 'atencion'){
              this.agregarAtencion(this.encuestas [i][key]);
            }
            if(key == 'limpieza'){
              this.agregarLimpieza(this.encuestas [i][key]);
            }
            if(key == 'sabor'){
              this.agregarSabor(this.encuestas [i][key]);
            }
            if(key == 'velocidad'){
              this.agregarVelocidad(this.encuestas [i][key]);

            }
            if(key == 'recomendar'){
              this.agregarRecomendacion(this.encuestas [i][key]);
            }
          }
        }
        this.setAtencion();
        this.setLimpieza();
        this.setSabor();
        this.setVelocidad();
        this.setRecomendar();
        this.display = true;
        spinner.dismiss();
      });
  }

  private initLabels(){
    this.dataAtencion.labels.push("Muy Buena");
    this.dataAtencion.labels.push("Buena");
    this.dataAtencion.labels.push("Regular");
    this.dataAtencion.labels.push("Mala");

    this.dataLimpieza.labels.push("Muy Buena");
    this.dataLimpieza.labels.push("Buena");
    this.dataLimpieza.labels.push("Regular");
    this.dataLimpieza.labels.push("Mala");

    this.dataSabor.labels.push("Muy Rica");
    this.dataSabor.labels.push("Rica");
    this.dataSabor.labels.push("Regular");
    this.dataSabor.labels.push("Mala");

    this.dataVelocidad.labels.push("Rápida");
    this.dataVelocidad.labels.push("Demoró");
    this.dataVelocidad.labels.push("Tardó");

    this.dataRecomendar.labels.push("Si");
    this.dataRecomendar.labels.push("No");
  }

  private initCounts(){
    this.countAtencionMuyBien = 0;
    this.countAtencionBien = 0;
    this.countAtencionRegular = 0;
    this.counAtencionMala = 0;

    this.countLimpiezaMuyBien = 0;
    this.countLimpiezaBien = 0;
    this.countLimpiezaRegular = 0;
    this.countLimpiezaMalo = 0;

    this.countSaborMuyRica = 0;
    this.countSaborRica = 0;
    this.countSaborRegular = 0;
    this.countSaborMala = 0;

    this.countVelocidadRapida = 0;
    this.countVelocidadDemoro= 0;
    this.countVelocidadTardo= 0;

    this.countRecomendarSi = 0;
    this.countRecomendarNo = 0;

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
        this.countLimpiezaMalo++;
        break;
    }
  }

  private agregarSabor(resultado){
    switch (resultado) {
      case "muyRica":
        this.countSaborMuyRica++;
        break;
      case "rica":
        this.countSaborRica++;
        break;
      case "regular":
        this.countSaborRegular++;
        break;
      case "mala":
        this.countSaborMala++;
        break;
    }
  }

  private agregarRecomendacion(resultado){
    switch (resultado) {
      case "si":
        this.countRecomendarSi++;
        break;
      case "no":
        this.countRecomendarNo++;
        break;
    }
  }

  private agregarVelocidad(resultado){
    switch (resultado) {
      case "rapida":
        this.countVelocidadRapida++;
        break;
      case "demoro":
        this.countVelocidadDemoro++;
        break;
      case "tardo":
        this.countVelocidadTardo++;
        break;
    }
  }

  private setAtencion(){
    this.dataAtencion.datasets[0].data.push(this.countAtencionMuyBien);
    this.dataAtencion.datasets[0].backgroundColor.push(this.getColor());
    this.dataAtencion.datasets[0].data.push(this.countAtencionBien);
    this.dataAtencion.datasets[0].backgroundColor.push(this.getColor());
    this.dataAtencion.datasets[0].data.push(this.countAtencionRegular);
    this.dataAtencion.datasets[0].backgroundColor.push(this.getColor());
    this.dataAtencion.datasets[0].data.push(this.countAtencionRegular);
    this.dataAtencion.datasets[0].backgroundColor.push(this.getColor());
  }

  private setLimpieza(){
    this.dataLimpieza.datasets[0].data.push(this.countLimpiezaMuyBien);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpiezaBien);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpiezaRegular);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpiezaMalo);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
  }

  private setSabor(){
    this.dataSabor.datasets[0].data.push(this.countSaborMuyRica);
    this.dataSabor.datasets[0].backgroundColor.push(this.getColor());
    this.dataSabor.datasets[0].data.push(this.countSaborRica);
    this.dataSabor.datasets[0].backgroundColor.push(this.getColor());
    this.dataSabor.datasets[0].data.push(this.countSaborRegular);
    this.dataSabor.datasets[0].backgroundColor.push(this.getColor());
    this.dataSabor.datasets[0].data.push(this.countSaborMala);
    this.dataSabor.datasets[0].backgroundColor.push(this.getColor());
  }

  private setVelocidad(){
    this.dataVelocidad.datasets[0].data.push(this.countVelocidadRapida);
    this.dataVelocidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataVelocidad.datasets[0].data.push(this.countVelocidadDemoro);
    this.dataVelocidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataVelocidad.datasets[0].data.push(this.countVelocidadTardo);
    this.dataVelocidad.datasets[0].backgroundColor.push(this.getColor());
  }

  private setRecomendar(){
    this.dataRecomendar.datasets[0].data.push(this.countRecomendarSi);
    this.dataRecomendar.datasets[0].backgroundColor.push(this.getColor());
    this.dataRecomendar.datasets[0].data.push(this.countRecomendarNo);
    this.dataRecomendar.datasets[0].backgroundColor.push(this.getColor());
  }

  private getColor() {
    var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
      + Math.floor(Math.random() * 255) + ")";
    return color;
  }


}
