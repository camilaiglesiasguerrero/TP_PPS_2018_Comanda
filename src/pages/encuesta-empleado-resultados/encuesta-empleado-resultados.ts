import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';


@IonicPage()
@Component({
  selector: 'page-encuesta-empleado-resultados',
  templateUrl: 'encuesta-empleado-resultados.html',
})
export class EncuestaEmpleadoResultadosPage {

  @Input('from-dashboard') fromDashboard:boolean;

  verLimpieza = false;
  verTiempo = false;
  verCondiciones = false;
  verFelicidad = false;
  verNotas = false;

  display: boolean = false;
  encuestas=[];

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
  dataLimpieza = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };

  tiempoOptions = {
    title: {
      display: true,
      text: 'Jornada en horario',
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
  dataTiempo = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };

  felicidadOptions = {
    title: {
      display: true,
      text: 'Satisfacción con el trabajo',
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
  dataFelicidad = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };

  condicionesOptions ={
    title: {
      display: true,
      text: 'Condiciones generales',
      fontSize: 16,
      fontColor: '#fff'
    }
  };
  dataCondiciones ={
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
        ]
      }]
  };

  countLimpieza1 : number;
  countLimpieza2 : number;
  countLimpieza3 : number;
  countLimpieza4 : number;
  countLimpieza5 : number;
  countLimpieza6 : number;
  countLimpieza7 : number;
  countLimpieza8 : number;
  countLimpieza9 : number;
  countLimpieza10 : number;

  countJornadaATiempoSi:number;
  countJornadaATiempoNo:number;

  countFelicidadBartender : number;
  countFelicidadCocinero : number;
  countFelicidadMozo : number;
  countFelicidadMetre : number;
  countFelicidadDelivery : number;
  
  countCondicionesLimpio : number;
  countCondicionesOrden : number;
  countCondicionesListo : number;
  countCondicionesEstado : number;

  notas : Array<any>;

  mostrarSpinner:boolean = false;

  constructor(public navParams: NavParams,
              public database:DatabaseService) {
  }

  //OK
  ver(que){
    switch (que) {
      case 'verLimpieza':
        this.verLimpieza = true;
        this.verTiempo = false;
        this.verCondiciones = false;
        this.verFelicidad = false;
        this.verNotas = false;  
        break;
      case 'verTiempo':
        this.verLimpieza = false;
        this.verTiempo = true;
        this.verCondiciones = false;
        this.verFelicidad = false;
        this.verNotas = false;  
        break;
      case 'verCondiciones':
        this.verLimpieza = false;
        this.verTiempo = false;
        this.verCondiciones = true;
        this.verFelicidad = false;
        this.verNotas = false;  
        break;
      case 'verFelicidad':
        this.verLimpieza = false;
        this.verTiempo = false;
        this.verCondiciones = false;
        this.verFelicidad = true;
        this.verNotas = false;  
        break;
      case 'verNotas':
        this.verLimpieza = false;
        this.verTiempo = false;
        this.verCondiciones = false;
        this.verFelicidad = false;
        this.verNotas = true;  
        break;
    }
  }

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados(){
    this.initLabels();
    this.mostrarSpinner = true;
    this.database.db.list<any>(diccionario.apis.encuesta_empleado).valueChanges()
      .subscribe(snapshots => {
        this.display = false;
        this.encuestas = snapshots;
        this.initCounts()
        for(var i=0; i < this.encuestas .length; i++){
          this.agregarTiempo(this.encuestas[i].enHorario);
          this.agregarNota(this.encuestas[i].notas, this.encuestas[i].rol);
          this.agregarFelicidad(this.encuestas[i].gradoFelicidad, this.encuestas[i].rol) ;
          this.agregarLimpieza(this.encuestas[i].limpieza);
          this.agregarElementosLaborales('estado',this.encuestas[i].elemEstado);
          this.agregarElementosLaborales('limpio',this.encuestas[i].elemLimpio);
          this.agregarElementosLaborales('listo',this.encuestas[i].elemListos);
          this.agregarElementosLaborales('ordenado',this.encuestas[i].elemOrdenados);
        }
        this.setTiempo();
        this.setFelicidad();
        this.setLimpieza();
        this.setCondiciones();

        this.display = true;
        this.mostrarSpinner = false;
      });
  }

  private initLabels(){
    this.dataLimpieza.labels.push("1");
    this.dataLimpieza.labels.push("2");
    this.dataLimpieza.labels.push("3");
    this.dataLimpieza.labels.push("4");
    this.dataLimpieza.labels.push("5");
    this.dataLimpieza.labels.push("6");
    this.dataLimpieza.labels.push("7");
    this.dataLimpieza.labels.push("8");
    this.dataLimpieza.labels.push("9");
    this.dataLimpieza.labels.push("10");

    this.dataFelicidad.labels.push("Bartender");
    this.dataFelicidad.labels.push("Cocinero");
    this.dataFelicidad.labels.push("Delivery");
    this.dataFelicidad.labels.push("Metre");
    this.dataFelicidad.labels.push("Mozo");

    this.dataTiempo.labels.push("Sí");
    this.dataTiempo.labels.push("No");
    
    this.dataCondiciones.labels.push("En correcto estado");
    this.dataCondiciones.labels.push("Limpios");
    this.dataCondiciones.labels.push("Listos para su uso");
    this.dataCondiciones.labels.push("Ordenados");
    
  }

  //OK
  private initCounts(){
    this.countLimpieza1 = 0;
    this.countLimpieza2 = 0;
    this.countLimpieza3 = 0;
    this.countLimpieza4 = 0;
    this.countLimpieza5 = 0;
    this.countLimpieza6 = 0;
    this.countLimpieza7 = 0;
    this.countLimpieza8 = 0;
    this.countLimpieza9 = 0;
    this.countLimpieza10 = 0;

    this.countJornadaATiempoSi = 0;
    this.countJornadaATiempoNo = 0;
    
    this.countFelicidadBartender = 0;
    this.countFelicidadCocinero = 0;
    this.countFelicidadDelivery = 0;
    this.countFelicidadMetre = 0;
    this.countFelicidadMozo = 0;

    this.countCondicionesLimpio = 0;
    this.countCondicionesOrden = 0;
    this.countCondicionesListo = 0;
    this.countCondicionesEstado = 0;

    this.notas = new Array<any>();
  }

  //Ok
  private agregarElementosLaborales(que,resultado){
    switch (que) {
      case "estado":
        resultado ? this.countCondicionesEstado++ : this.countCondicionesEstado;
        break;
      case "limpio":
        resultado ? this.countCondicionesLimpio++ : this.countCondicionesLimpio;
        break;
      case "listo":
        resultado ? this.countCondicionesListo++ : this.countCondicionesListo;
        break;
      case "ordenado":
        resultado ? this.countCondicionesOrden++ : this.countCondicionesOrden;
        break;
    }
  }
  //oK
  private agregarLimpieza(resultado){
    switch (resultado) {
      case "1":
        this.countLimpieza1++;
        break;
      case "2":
        this.countLimpieza2++;
        break;
      case "3":
        this.countLimpieza3++;
        break;
      case "4":
        this.countLimpieza4++;
        break;
      case "5":
        this.countLimpieza5++;
        break;
      case "6":
        this.countLimpieza6++;
        break;
      case "7":
        this.countLimpieza7++;
        break;
      case "8":
        this.countLimpieza8++;
        break;
      case "9":
        this.countLimpieza9++;
        break;
      case "10":
        this.countLimpieza10++;
        break;
    }
  }
  //OK
  private agregarTiempo(resultado){
    switch (resultado) {
      case "si":
        this.countJornadaATiempoSi++;
        break;
      case "no":
        this.countJornadaATiempoNo++;
        break; 
    }
  }
  //ok
  private agregarNota(nota, rol){
    this.notas.push({nota:nota,rol:rol});
  }
  //Ok
  private agregarFelicidad(resultado,rol){
    switch (rol) {
      case "bartender":
        this.countFelicidadBartender+=resultado;
        break;
      case "cocinero":
        this.countFelicidadCocinero+=resultado;
        break;
      case "mozo":
        this.countFelicidadMozo+=resultado;
        break;
      case "metre":
        this.countFelicidadMetre+=resultado;
        break;
      case "delivery":
        this.countFelicidadDelivery+=resultado;
        break;
    }
  }

  //Ok
  private setFelicidad(){
    this.dataFelicidad.datasets[0].data.push(this.countFelicidadBartender);
    this.dataFelicidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataFelicidad.datasets[0].data.push(this.countFelicidadCocinero);
    this.dataFelicidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataFelicidad.datasets[0].data.push(this.countFelicidadDelivery);
    this.dataFelicidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataFelicidad.datasets[0].data.push(this.countFelicidadMetre);
    this.dataFelicidad.datasets[0].backgroundColor.push(this.getColor());
    this.dataFelicidad.datasets[0].data.push(this.countFelicidadMozo);
    this.dataFelicidad.datasets[0].backgroundColor.push(this.getColor());
    
  }
  
  //OK
  private setLimpieza(){
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza1);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza2);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza3);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza4);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza5);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza6);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza7);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza8);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza9);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
    this.dataLimpieza.datasets[0].data.push(this.countLimpieza10);
    this.dataLimpieza.datasets[0].backgroundColor.push(this.getColor());
  }
  
  //ok
  private setCondiciones(){
    this.dataCondiciones.datasets[0].data.push(this.countCondicionesEstado);
    this.dataCondiciones.datasets[0].backgroundColor.push(this.getColor());
    this.dataCondiciones.datasets[0].data.push(this.countCondicionesLimpio);
    this.dataCondiciones.datasets[0].backgroundColor.push(this.getColor());
    this.dataCondiciones.datasets[0].data.push(this.countCondicionesListo);
    this.dataCondiciones.datasets[0].backgroundColor.push(this.getColor());
    this.dataCondiciones.datasets[0].data.push(this.countCondicionesOrden);
    this.dataCondiciones.datasets[0].backgroundColor.push(this.getColor());
  }
  //OK|
  private setTiempo(){
    this.dataTiempo.datasets[0].data.push(this.countJornadaATiempoSi);
    this.dataTiempo.datasets[0].backgroundColor.push(this.getColor());
    this.dataTiempo.datasets[0].data.push(this.countJornadaATiempoNo);
    this.dataTiempo.datasets[0].backgroundColor.push(this.getColor());
  }


  private getColor() {
    var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
      + Math.floor(Math.random() * 255) + ")";
    return color;
  }

}
