import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { IonicMultiCamera, Picture, CameraTranslations } from 'ionic-multi-camera';
//import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, ConfigurationData } from '@ionic-native/media-capture';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { EncuestaClienteService } from '../../services/encuestasCliente.service';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';
import {EncuestaClienteResultadosPage} from "../encuesta-cliente-resultados/encuesta-cliente-resultados";

@IonicPage()
@Component({
  selector: 'page-encuesta-cliente',
  templateUrl: 'encuesta-cliente.html',
})

export class EncuestaClientePage {

  /**
   * Para hacer andar el multicamara seguir los pasos de este tutorial, probablemente no sea necesario
   * reinstalar las librerias porque ya se instalan con el npm install, pero por las dudas lo dejo.
   * https://github.com/Surnet/ionic-multi-camera/blob/master/README.md
   * Codigo a cambiar:
   * Paso 1: ir a la carpeta donde se instala en node_modules ionic-multi-camara
   * Dentro de la carpeta dist/providers editar el archivo: ionic-multi-camara.d.ts
   * y agregar el parametro navbarControler en getPicture:
   * getPicture(navCtrl:NavController, pictureOptions?: CameraPreviewPictureOptions, translations?: CameraTranslations)
   * Paso 2: Ir al archivo ionic-multi-camara.js y en la función getPictures agregar el parametro navCtrl
   * y pisar el navCtrl declarado en el método:
   * IonicMultiCamera.prototype.getPicture = function (navCtrl, pictureOptions, translations) {
   * var _this = this;
   *   _this.navCtrl = navCtrl; //esta linea es la que hay que agregar
   *   .....
   * Paso 3: Ir a la carpeta ionic-multi-camera/dist/pages/camera y editar el archivo camera.js
   * En ese archivo buscar todos los estilos que estén color="light" y poner color="fourth"
   * Paso 4: En ese mismo archivo, camera.js, buscar el método: CameraComponent.prototype.takePicture
   * y poner el límite en 3 fotos:
   *  CameraComponent.prototype.takePicture = function () {
        var _this = this;
        //este if es el que hay que agregar
        if(_this.pictures.length == 3){
            return;
        }
        var imageOrientation = this.getImageOrientation();
        ......
      }
   * Paso 5: Importar la libreria en la páginca, ponerla en el constructor y al consumir la libreria 
   pasar el parametro del NavCtrl de la pagina al metodo de la libreria, más las opciones de la cámara 
   y los textos, como está implemantado en esta pagina:
   this.multiCamera.getPicture(this.navCtrl, pictureOptions, translations)
   Paso 6: quizás éste no sea necesario, depende de cómo armen el estilo de la página, pero el body tiene 
      background-color en transparent con lo cual quizás deban agregar en el estilo de la página 
      que use ésta librería ésta clase, no puede estar global porque sino tapa la cámara y se ve el color 
      del fondo en vez de la imagen de la cámara.
    page-encuesta-cliente{  
      .scroll-content{
        background-color: $first-detail-color !important;
      }
    }
   */

  resultados: any = {
    limpieza: "", atencion: "", sabor: "", velocidad: "", recomendar: "", usuarioId: "", fotos: []
  };
  sabores = [
    {
      selected:false,
      label: "Muy Rica",
      value: 'muyRica'
    },
    {
      selected:false,
      label: "Rica",
      value: 'rica'
    },
    {
      selected:false,
      label: "Regular",
      value: 'regular'
    },
    {
      selected:false,
      label: "Mala",
      value: 'mala'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private encuestaClienteService: EncuestaClienteService,
              private authenticationService: AuthenticationService,
              private messageHandler: MessageHandler,
              private multiCamera: IonicMultiCamera
              //private mediaCapture: MediaCapture
  ) {
    this.resultados.usuarioId = this.authenticationService.getUID();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaClientePage');
  }

  saborClick(sabor){
    for(var i=0; i< this.sabores.length; i++){
        this.sabores[i].selected = false;
    }
    sabor.selected = true;
    this.resultados.sabor = sabor.value;
  }

  tomarFotos() {
    const pictureOptions: CameraPreviewPictureOptions = {
      quality: 100,
      width: 600,
      height: 600
    };
    const translations: CameraTranslations = {
      cancel: 'Cancelar',
      finish: 'Listo',
      auto: 'AUTO',
      on: 'On',
      off: 'Off'
    };
    this.multiCamera.getPicture(this.navCtrl, pictureOptions, translations)
      .then((pictures: Array<Picture>) => {
        for (var i = 0; i < pictures.length; i++) {
          var foto = `data:image/jpeg;base64,${pictures[i].base64Data}`;
          this.resultados.fotos.push(foto);
        }
      })
      .catch(err => {
        this.messageHandler.mostrarErrorLiteral(err);
      });

    /* 
    let options: CaptureImageOptions = { 
      limit: 3,
    };
    this.mediaCapture.captureImage(options)
      .then((data: MediaFile[]) => {
        alert("NAME " + data[0].name);

        alert("fullpath " + data[0].fullPath);
        alert("type " + data[0].type);
        data[0].getFormatData(data => {
          alert("format data " + JSON.stringify(data));
        });
      }, (err: CaptureError) => {
        this.messageHandler.mostrarErrorLiteral(err);
      }
      );
      */
  }

  finalizar() {
    var model = this.resultados;
    model.velocidad = this.resultados.velocidad == '1' ? 'tardo' : this.resultados.velocidad == '2' ? 'demoro' : 'rapida'
    this.encuestaClienteService.guardar(this.resultados)
      .then(response => {
        this.messageHandler.mostrarMensaje("Gracias por completar la encuesta!");
        this.navCtrl.setRoot(EncuestaClienteResultadosPage);
      }, error => {
        this.messageHandler.mostrarErrorLiteral("Hubo un error a completar la encuesta");
      })
  }

}
