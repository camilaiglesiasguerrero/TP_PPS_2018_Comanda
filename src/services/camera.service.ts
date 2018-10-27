import { Injectable } from "@angular/core";
import { Camera, CameraOptions} from '@ionic-native/camera';
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';
import { IonicMultiCamera, Picture, CameraTranslations } from 'ionic-multi-camera';
import { CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class CameraService{

    fotoSubir : string = '';
    fotoMostrar: string ='';

    storageFirebase: string;
    databaseFirebase: string;
    jsonPackData: JSON;

    arrayDeFotos:Array<any>;
    saveError: boolean = false;

    constructor(private Camera: Camera,
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

    ElegirMuchasFotos(){
        const pictureOptions: CameraPreviewPictureOptions = {
            quality: 80,
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
          this.multiCamara.getPicture(pictureOptions,translations)
            .then((pictures: Array<Picture>) => {
              if (pictures.length == 1) {
                this.fotoSubir = `data:image/jpeg;base64,${pictures[0].base64Data}`;
                this.SubirFotoStorage();
              } else if (pictures.length > 0) {
                this.SubirVariasFotosFirebase(pictures);
              }
            })
            .catch(err => {
              this.messageHandler.mostrarErrorLiteral(err);
            });
    }

    SubirFotoStorage() : Promise<string>{
        let dbstorage = firebase.storage().ref(this.storageFirebase);
        var metadata = {
          contentType: 'image/jpeg',
          customMetadata: {
            usuario: this.params.user,
            fecha: Date.now().toString()
          }
        }; 

        dbstorage.putString(this.fotoSubir, 'base64', metadata)
        .then(resultado => {
            dbstorage.getDownloadURL()
            .then(urlResultado =>{
                this.fotoMostrar = urlResultado;
            }).catch(error =>{
                this.messageHandler.mostrarError(error, 'Ocurrió un error');
            });
        });
        return;
    }

    private SubirVariasFotosFirebase(fotos){
        var arrayDePromises = [];
        this.saveError = false;
        for (var i = 0; i < fotos.length; i++) {
          this.fotoSubir = `data:image/jpeg;base64,${fotos[i].base64Data}`;
          var promesa = this.SubirFotoStorage()
            .then(response => {
                this.arrayDeFotos[i].push(this.fotoSubir, this.fotoMostrar);
            }, error => {
              this.saveError = true;
              //this.messageHandler.mostrarErrorLiteral("Error al agregar la foto", "Error!");
            });
          arrayDePromises.push(promesa);
          
        }
        this.arrayPromises(arrayDePromises);
      }
    
    private arrayPromises(promises) {
    Observable.forkJoin(promises).subscribe(() => {
        if (this.saveError) {
        this.messageHandler.mostrarErrorLiteral("Ocurrió un error al agregar algunas fotos");
        } else {
        //this.messageHandler.mostrarMensaje("Se agregaron las fotos");
        }
    });
    }
}