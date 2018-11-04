import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListadoMenuPage } from '../listado-menu/listado-menu';
import { ParamsService } from '../../services/params.service';
import { Producto } from '../../models/producto';
import { QrService } from '../../services/qr.service';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { CameraService } from '../../services/camera.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { ImagePicker } from '@ionic-native/image-picker';
/**
 * Generated class for the AltaMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-menu',
  templateUrl: 'alta-menu.html',
  
})
export class AltaMenuPage {

  menu:string;

  producto : Producto = new Producto();
  productos : any;
  titulo : string;

  qrData = null;
  createdCode = false;
  scannedCode = null;


  elSpinner = null;

  nombre = new FormControl('',[
    Validators.required,
    Validators.maxLength(60),
    Validators.minLength(4)
  ]);

  descripcion = new FormControl('',[
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(100)
  ]);

  tiempoElaboracion = new FormControl('',[
    Validators.required,
    Validators.min(0),
  ]);

  precio = new FormControl('',[
    Validators.required,
    Validators.min(0)
  ]);

  cantidad = new FormControl('',[
    Validators.required,
    Validators.min(0)
  ]);
  
  frm = this.formBuilder.group({
    nombre: this.nombre,
    descripcion: this.descripcion,
    tiempoElaboracion: this.tiempoElaboracion,
    precio: this.precio,
    cantidad: this.cantidad,
  });

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public params: ParamsService,
              public camara: CameraService,
              public spinner:SpinnerHandler,
              public database:DatabaseService,
              public qr:QrService,
              public messageHandler:MessageHandler,
              private formBuilder: FormBuilder,
              private imagePicker: ImagePicker) {

    this.navParams.get('listado') ? this.navCtrl.remove(1,1) : null;
    if(this.params.rol == 'bartender'){
      this.menu = 'bebidas';
      this.producto.tipo = 'Bebida';
    }else{
      this.menu = 'platos';
      this.producto.tipo = 'Comida';
    }
  
    this.camara.arrayDeFotos = new Array<any>();
    //Editando
    this.navParams.get("producto") ? this.bindearDatos() : this.titulo = 'Alta de ' + this.menu;    
  }

    bindearDatos(){
      this.titulo = "Detalles del producto";
      this.producto = this.navParams.get('producto');
      this.nombre.setValue(this.producto.nombre);
      this.descripcion.setValue(this.producto.descripcion);
      this.cantidad.setValue(this.producto.cantidad);
      this.precio.setValue(this.producto.precio);
      this.tiempoElaboracion.setValue(this.producto.tiempoElaboracion);
      this.camara.arrayDeFotos.push(this.producto.foto1);
      this.camara.arrayDeFotos.push(this.producto.foto2);
      this.camara.arrayDeFotos.push(this.producto.foto3);
    }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaMenuPage');
  }

  irA(donde: string){
    switch(donde){
      case 'Todos':
        this.navCtrl.push(ListadoMenuPage,{alta:true});
        break;
    }
  }

  Elegir(){
    //this.camara.elegirMultiples();
    let options = { maximumImagesCount : 3 }
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          //this.arrayDeFotos.push('data:image/jpeg;base64,' + results[i]);
          this.messageHandler.mostrarError(results[i]);
        }
      }, (err) => { this.messageHandler.mostrarError(err); });
  }

  Sacar(){ 
    this.camara.arrayDeFotos = new Array<any>();
    this.camara.sacarMultiples(this.navCtrl);
  }

  newUpdateProducto(){
  if(this.camara.arrayDeFotos.length == 3){
    this.producto.nombre = this.frm.get('nombre').value;
    this.producto.descripcion = this.frm.get('descripcion').value.toString();
    this.producto.tiempoElaboracion = this.frm.get('tiempoElaboracion').value;
    this.producto.precio = this.frm.get('precio').value;
    this.producto.cantidad = this.frm.get('cantidad').value;;
    this.producto.foto1 = this.camara.arrayDeFotos[0];
    this.producto.foto2 = this.camara.arrayDeFotos[1];
    this.producto.foto3 = this.camara.arrayDeFotos[2]; 
    this.producto.estado = 'Habilitado';
    this.navParams.get("producto") == undefined ? this.producto.key = this.database.ObtenerKey('productos/'+this.producto.tipo) : null;

    this.database.jsonPackData = this.producto;
        
    this.elSpinner = this.spinner.getAllPageSpinner();
    this.elSpinner.present();
      this.database.SubirDataBase('productos/'+this.menu+'/').then(r => {          
        this.messageHandler.mostrarMensaje("Operación exitosa");
        this.createdCode = this.qr.createCode(this.producto.tipo+this.producto.nombre);
          this.elSpinner.dismiss();
          this.navCtrl.pop();
        });
  }
  else
    this.messageHandler.mostrarErrorLiteral("Falta vincular las 3 fotos");
  }
}

