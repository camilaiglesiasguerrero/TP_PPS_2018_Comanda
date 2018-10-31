import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Usuario } from './../../models/usuario';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';
import { EmpeladosPage } from '../empleados/empleados';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DueñosPage } from '../dueños/dueños';


/**
 * Generated class for the AltaEmpleadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-empleado',
  templateUrl: 'alta-empleado.html',
})
export class AltaEmpleadoPage {

  user = { email: '', pass: '', secondPass: '', dni: '', cuil: '', nombre: '', apellido: '', foto: '', rol: '' };
  miScan = {};
  titulo:string;
  options : any;
  imagen:string;
  hayFoto:string;
  tipoAlta:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private autenticationService: AuthenticationService,
    private messageHandler: MessageHandler,
    private spinnerHandler: SpinnerHandler,
    private barcodeScanner: BarcodeScanner,
    private usuarioService: UsuariosService,
    public paramsService: ParamsService,
    private camera: Camera
    ) {
        this.hayFoto="no";
        this.tipoAlta=this.navParams.get('tipoAlta');
        console.log(this.tipoAlta);
  }

  ionViewDidLoad() {
    console.log('Page Alta-Empleados | ' + this.autenticationService.getEmail());
  }

  escanearDni() {
    this.options = { prompt : "Escaneá el DNI", formats: "PDF_417" }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.miScan = (barcodeData.text).split('@');
        this.user.apellido = this.miScan[1];
        this.user.nombre = this.miScan[2];
        this.user.dni = this.miScan[4];
    }, (error) => {
        //this.errorHandler.mostrarErrorLiteral(error);
    });
  }

  tomarFoto(){
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.hayFoto="si"; 
      this.imagen = "data:image/jpeg;base64," + imageData;
      this.user.foto = this.imagen;
    }, (err) => {
      console.log(err);
    });
  }

  private validForm() {
    if (this.user.email && this.user.pass && this.user.secondPass) {
        if (this.user.pass == this.user.secondPass) {
            if (this.user.pass.length > 5) {
                return true;
            }
            this.messageHandler.mostrarErrorLiteral("La contraseña debe tener 6 caracteres mínimo", "Error al registrarse");
        } else {
            this.messageHandler.mostrarErrorLiteral("Las contraseñas no coinciden", "Error al registrarse");
        }
    } else {
        this.messageHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
    }
    return false;
  }

  registerUser() {
    if (this.validForm()) {
        if(this.tipoAlta=='dueño'){
            this.user.rol='dueño';
        }
        this.crearUsuario();
      }
  }

  private crearUsuario() {
    let spiner = this.spinnerHandler.getAllPageSpinner();
    spiner.present();
    this.autenticationService.registerUserAndLogin(this.user.email, this.user.pass)
        .then(response => {
            let usuario = new Usuario(this.user.nombre, this.user.apellido, this.user.dni, this.user.cuil, this.user.foto, this.user.rol)
            usuario.uid = this.autenticationService.getUID();
            this.usuarioService.guardar(usuario)
                .then(response => {
                    spiner.dismiss();
                    this.messageHandler.mostrarMensaje("Carga Exitosa!!");
                    this.autenticationService.singIn(this.paramsService.email, this.paramsService.password);
                    if(this.tipoAlta==='dueño'){
                        this.navCtrl.setRoot(DueñosPage);
                    }
                    else{
                    this.navCtrl.setRoot(EmpeladosPage);
                }
                }, error => {
                    this.autenticationService.deleteUserLogged()
                        .then(response => {
                            spiner.dismiss();
                            this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
                            this.paramsService.isLogged = true;
                        }, error => {
                            console.log("no se puedo eliminar el usuario logueado");
                            spiner.dismiss();
                            this.messageHandler.mostrarErrorLiteral("Hubo un error en el registro");
                        });
                });
        })
        .catch(error => {
            spiner.dismiss();
            this.messageHandler.mostrarError(error, "Error al registrarse");
        })
      }

}
