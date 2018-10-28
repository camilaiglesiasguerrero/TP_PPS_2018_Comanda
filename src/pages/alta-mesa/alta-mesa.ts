import { Component, ViewChild , trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QrService } from '../../services/qr.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import { CameraService } from '../../services/camera.service';
import { MessageHandler } from '../../services/messageHandler.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';
/**
 * Generated class for the AltaMesaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-mesa',
  templateUrl: 'alta-mesa.html',
  animations:[
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})

export class AltaMesaPage {
  @ViewChild('Html2Pdf') Html2Pdf ;

  mesa : Mesa = new Mesa();
  mesas : any;
  
  qrData = null;
  createdCode = null;
  scannedCode = null;
  ultimoId : number =0;

  numero = new FormControl('',[
    Validators.required,
  ]);

  comensales = new FormControl('',[
    Validators.required,
    Validators.min(2),
  ]);

  tipoOpc = new FormControl('',[
    Validators.required
  ]);

  frm = this.formBuilder.group({
    numero: this.numero,
    comensales: this.comensales,
    tipoOpc: this.tipoOpc
  });

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private qr: QrService,
              private formBuilder: FormBuilder,
              private database:DatabaseService,
              private camara:CameraService,
              private messageHandler:MessageHandler,
              private file:File ) {
    
    this.tipoOpc.setValue("Estándar");
    this.comensales.setValue("2");
    
    this.camara.storageFirebase = 'mesas/';

    this.database.db.list<any>('mesas/').valueChanges()
      .subscribe(snapshots => {
        this.mesas = snapshots;
            
        if(this.mesas != undefined && this.mesas != null && this.mesas.length != 0){
          this.ultimoId = this.mesas[this.mesas.length-1].uid;
        }
        this.numero.setValue(this.ultimoId+1);
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaMesaPage');
  }

  Elegir(){
    this.camara.ElegirUnaFoto();
    //this.foto.setValue(this.camara.fotoSubir);
  }

  Sacar(){
    this.camara.SacarFoto();
    //this.foto.setValue(this.camara.fotoSubir);
  }

  newMesa(){
    //if(this.camara.fotoSubir != ''){
      this.mesa.uid = this.frm.get('numero').value;
      this.mesa.comensales = this.frm.get('comensales').value;
      this.mesa.tipo = this.frm.get('tipoOpc').value;
      this.mesa.estado = 'Libre';
      this.mesa.foto = '';
      //this.mesa.foto = this.camara.fotoMostrar;
      
        this.database.jsonPackData = this.mesa;
          this.database.SubirDataBase('mesas/').then(r => {
            
          this.messageHandler.mostrarMensajeConfimación("Mesa creada con éxito");
          this.createdCode = this.qr.createCode(this.mesa.uid.toString());
          //this.qr.descargarQRPDF(this.mesa.uid);
          
        });/*
      this.camara.SubirFotoStorage().then(respuesta => {  
          this.messageHandler.mostrarError(respuesta);
          this.mesa.foto = this.camara.fotoMostrar;
          this.database.jsonPackData = this.mesa;
          this.database.SubirDataBase('mesas/').then(r => {
            
          this.messageHandler.mostrarMensajeConfimación("Mesa creada con éxito");
          this.createdCode = this.qr.createCode(this.mesa.uid.toString());
          //this.qr.descargarQRPDF(this.mesa.uid);
        });
      }).catch(e =>{
        this.messageHandler.mostrarError(e,"Se produjo el siguiente error");
      });*/
      
    /*}
    else
      this.messageHandler.mostrarErrorLiteral("Falta vincular la foto.");*/
   // }
  }
  
}
