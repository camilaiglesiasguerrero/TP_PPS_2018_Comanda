import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';
import { ListadoPedidosPage } from '../listado-pedidos/listado-pedidos';
import { MesasPage } from '../mesas/mesas';
import { PrincipalMozoPage } from '../principal-mozo/principal-mozo';
import { CameraService } from '../../services/camera.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { DatabaseService } from '../../services/database.service';

/**
 * Generated class for the EncuestaEmpleadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-empleado',
  templateUrl: 'encuesta-empleado.html',
})
export class EncuestaEmpleadoPage {

  preguntas:Array<any>;
  sino:string='si';
  calificacion:string;
  alegria:number;
  elementos = {limpios:false, ordenados:false,estado:false,listos:false};
  txtLibre:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public paramsService: ParamsService,
              public camara:CameraService,
              public messageHandler:MessageHandler,
              public database:DatabaseService) {

    this.preguntas = new Array<any>();
    this.camara.fotoSubir = '';
    this.alegria = 10;
    this.calificacion = '10';
    this.preguntas.push({pregunta:'¿Cómo calificarías la limpieza con la que te entregaron el espacio de trabajo?',control:'select'});
    this.preguntas.push({pregunta:'¿Pudiste comenzar tu jornada a tiempo?',control:'sino'});
    this.preguntas.push({pregunta:'¿Los elementos que necesitás para trabajar estaban en condiciones? (ej mesas armadas, comidas preparadas, bebidas en la heladera)',control:'check'});    
    this.preguntas.push({pregunta:'¿El ambiente de trabajo te resulta agradable?',control:'range'});
    this.preguntas.push({pregunta:'Nota importante o aclaración:',control:'input'});


  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EncuestaEmpleadoPage');
  }

  Elegir(){
    this.camara.fotoSubir = '';
    this.camara.ElegirUnaFoto();
  }

  Sacar(){
    this.camara.fotoSubir = '';
    this.camara.SacarFoto();
  }

  Confirmar(){
  //  if(this.camara.fotoSubir != ''){
      let paraSubir = {
        limpieza: this.calificacion,
        enHorario: this.sino,
        elemLimpio: this.elementos.limpios,
        elemListos: this.elementos.listos,
        elemOrdenados: this.elementos.ordenados,
        elemEstado: this.elementos.estado,
        gradoFelicidad: this.alegria,
        notas: this.txtLibre == undefined ? this.txtLibre = '' : this.txtLibre,
        foto:this.camara.fotoSubir,
        key : this.database.ObtenerKey('encuesta-empleado/')
      }

      this.database.jsonPackData = paraSubir;
      this.database.SubirDataBase('encuesta-empleado/').then(e =>{
        this.irA();
      });


    /*
    }else
      this.messageHandler.mostrarError('Falta vincular la foto.');
    */
  }


  irA(){
    switch(this.paramsService.rol){
      case 'bartender':
      case 'cocinero':
        this.navCtrl.setRoot(ListadoPedidosPage);
        break;
      case 'mozo':
        this.navCtrl.setRoot(PrincipalMozoPage);
        break;
      case 'metre':
        this.navCtrl.setRoot(MesasPage);
        break;
    }
    
  }
}
