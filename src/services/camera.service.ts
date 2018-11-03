import { Injectable } from "@angular/core";
import { Camera } from '@ionic-native/camera';
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";
import { IonicMultiCamera } from 'ionic-multi-camera';
import 'rxjs/add/observable/forkJoin';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { ImagePicker } from '@ionic-native/image-picker';

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
                private mediaCapture: MediaCapture,
                private imagePicker: ImagePicker){
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

    sacarMultiples(){
      let options: CaptureImageOptions = { limit: 3 };
      this.mediaCapture.captureImage(options)
        .then(
          (data: MediaFile[]) => this.arrayDeFotos = data,
          (err: CaptureError) => this.messageHandler.mostrarError(err)
        );
    }

    elegirMultiples(){
      let options = { maximumImagesCount : 3 }
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          //this.arrayDeFotos.push('data:image/jpeg;base64,' + results[i]);
          alert(results[i]);
        }
      }, (err) => { });
    }

    
}