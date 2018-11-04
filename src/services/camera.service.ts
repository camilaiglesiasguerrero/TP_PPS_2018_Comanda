import { Injectable } from "@angular/core";
import { Camera } from '@ionic-native/camera';
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";
import 'rxjs/add/observable/forkJoin';
//import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
//import { ImagePicker } from '@ionic-native/image-picker';
import { IonicMultiCamera, Picture, CameraTranslations } from 'ionic-multi-camera';
import { CameraPreviewPictureOptions } from "@ionic-native/camera-preview";

@Injectable()
export class CameraService{

    fotoSubir : any;
    fotoMostrar: any = '';

    storageFirebase: any;
    databaseFirebase: string;
    jsonPackData: JSON;

    arrayDeFotos:Array<any>;
    saveError: boolean = false;

    constructor(public Camera: Camera,
                private messageHandler: MessageHandler,
                public multiCamara: IonicMultiCamera,
                public params: ParamsService,
                public db:AngularFireDatabase,
                //private mediaCapture: MediaCapture,
                //private imagePicker: ImagePicker){
                private multiCamera: IonicMultiCamera){
    }

    SacarFoto(){
        this.Camera.getPicture({
            quality: 100,
            destinationType: this.Camera.DestinationType.DATA_URL,
            sourceType: this.Camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: true
          }).then(imageData => {
            this.fotoSubir = imageData;
            this.fotoMostrar = 'data:image/jpeg;base64,' + imageData;
          }, error => {
            this.messageHandler.mostrarError(error, 'Ocurrió un error');
          });
    }

    ElegirUnaFoto(){
        this.Camera.getPicture({
            quality: 100,
            destinationType: this.Camera.DestinationType.DATA_URL,
            sourceType: this.Camera.PictureSourceType.PHOTOLIBRARY
          }).then(imageData => {
            this.fotoSubir = imageData;
            this.fotoMostrar = 'data:image/jpeg;base64,' + imageData;
          }, error => {
            this.messageHandler.mostrarError(error, 'Ocurrió un error');
          });
    }

    sacarMultiples(navCtrl){
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
      debugger;
      this.multiCamera.getPicture(navCtrl, pictureOptions, translations)
        .then((pictures: Array<Picture>) => {
          for (var i = 0; i < pictures.length; i++) {
            var foto = `data:image/jpeg;base64,${pictures[i].base64Data}`;
            this.arrayDeFotos.push(foto);      
          }
        })
        .catch(err => {
          this.messageHandler.mostrarErrorLiteral(err);
        });
  
    }

/*nofunciona
    elegirMultiples(){
      let options = { maximumImagesCount : 3 }
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          //this.arrayDeFotos.push('data:image/jpeg;base64,' + results[i]);
          alert(results[i]);
        }
      }, (err) => { });
    }
*/
    
}