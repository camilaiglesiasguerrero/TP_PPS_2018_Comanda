import { Component, ViewChild , trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QrService } from '../../services/qr.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Mesa } from '../../models/mesa';
import { CameraService } from '../../services/camera.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
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

  mesa : Mesa = new Mesa();
  mesas : any;
  titulo : string;

  qrData = null;
  createdCode = null;
  scannedCode = null;
  ultimoId : number = 0;

  elSpinner = null;

  numero = new FormControl('',[
    Validators.required,
  ]);

  comensales = new FormControl('',[
    Validators.required,
    Validators.min(2),
  ]);

  tipoOpc = new FormControl('',[
    Validators.required,
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
              public params: ParamsService,
              private spinner: SpinnerHandler) {

    if(this.navParams.get('mesa') != undefined)//Implica que estoy editando
    {
      this.titulo = "Detalles de la mesa";
      this.mesa = this.navParams.get('mesa');
      this.tipoOpc.setValue(this.mesa.tipo);
      this.comensales.setValue(this.mesa.comensales);
      this.numero.setValue(this.mesa.id);
      this.createdCode = this.qr.createCode(this.mesa.idString);
      this.camara.fotoMostrar = this.mesa.foto;
    }else{
      this.titulo = "Ingresar nueva mesa";
      this.ultimoId = this.navParams.get('ultimoId');
      this.camara.fotoMostrar = '';
      this.tipoOpc.setValue("");
      this.comensales.setValue("2");
      this.numero.setValue(this.ultimoId+1);
    }
  }

  ionViewDidLoad() {
  }

  Elegir(){
    this.camara.fotoSubir = '';
    this.camara.ElegirUnaFoto();
  }

  Sacar(){
    this.camara.fotoSubir = '';
    this.camara.SacarFoto();
  }

  newUpdateMesa(){
    if(this.camara.fotoSubir != ''){
      if(this.mesa.tipo != ''){
        this.mesa.id = this.frm.get('numero').value;
        this.mesa.idString = this.frm.get('numero').value.toString();
        this.mesa.comensales = this.frm.get('comensales').value;
        this.mesa.tipo = this.frm.get('tipoOpc').value;
        this.mesa.estado = 'Libre';
        this.mesa.foto = this.camara.fotoMostrar;
        this.navParams.get("mesa") == undefined ? this.mesa.key = this.database.ObtenerKey('mesas/') : null;

        this.database.jsonPackData = this.mesa;
        
        this.elSpinner = this.spinner.getAllPageSpinner();
        this.elSpinner.present();

        this.database.SubirDataBase('mesas/').then(r => {          
          //this.messageHandler.mostrarMensaje("Mesa creada con éxito");
          this.createdCode = this.qr.createCode(this.mesa.idString);
          this.elSpinner.dismiss();
          this.navCtrl.pop();
          });
        
      }
      else
        this.messageHandler.mostrarErrorLiteral("Falta tipo de mesa.");
    }
    else
      this.messageHandler.mostrarErrorLiteral("Falta vincular la foto.");
  }
}
