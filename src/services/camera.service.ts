import { Injectable } from "@angular/core";
import { Camera } from '@ionic-native/camera';
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";
import { IonicMultiCamera } from 'ionic-multi-camera';
import 'rxjs/add/observable/forkJoin';

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
                public db:AngularFireDatabase){
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
}