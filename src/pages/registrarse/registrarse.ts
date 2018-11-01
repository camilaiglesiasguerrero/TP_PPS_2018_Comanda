import { Cliente } from './../../models/cliente';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { IniciarsesionPage } from './../iniciarsesion/iniciarsesion';
import { ParamsService } from '../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';


@Component({
    selector: 'page-registrarse',
    templateUrl: 'registrarse.html',
})

export class RegistrarsePage {

    user = { email: '', pass: '', secondPass: '', dni: '', cuil: '', nombre: '', apellido: '', foto: '', rol: '' };
    title = "Registrarse";
    miScan = {};
    fromLogin = false;
    isEmpleado: boolean;
    options: any;

    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private autenticationService: AuthenticationService,
        private messageHandler: MessageHandler,
        private spinnerHandler: SpinnerHandler,
        private barcodeScanner: BarcodeScanner,
        private usuarioService: UsuariosService,
        public paramsService: ParamsService,
        private camera: Camera
    ) {
        if (this.navParams.data.page == 'login') {
            this.fromLogin = true;
        }
        if (this.navParams.data.rol == 'empleado') {
            this.title = "Empleado";
            this.isEmpleado = true;
            this.user['cuil'] = "";
            this.user['subRol'] = "";
        }
    }

    ionViewDidLoad() {
        this.paramsService.isLogged = false;
    }

    registerUser() {
        if (this.validForm()) {
            if (this.fromLogin) {
                this.registrarYLoguear();
            } else {
            }
        }
    }

    cancel() {
        this.navCtrl.setRoot(IniciarsesionPage, { 'fromApp': true })
    }

    tomarFoto() {
        let options: CameraOptions = {
            quality: 50,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 400,
            targetHeight: 200,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true
          }
          this.camera.getPicture(options)
            .then(imageData => {
              this.user.foto = `data:image/jpeg;base64,${imageData}`;
            }, error => {
              if (error == "No Image Selected") {
                this.messageHandler.mostrarErrorLiteral("No se sacó ninguna foto");
              } else {
                this.messageHandler.mostrarErrorLiteral(error);
              }
            })
    }

    escanearDni() {
        this.options = { prompt: "Escaneá el DNI", formats: "PDF_417" }
        this.barcodeScanner.scan(this.options).then((barcodeData) => {
            this.miScan = (barcodeData.text).split('@');
            this.user.apellido = this.miScan[1];
            this.user.nombre = this.miScan[2];
            this.user.dni = this.miScan[4];

        }, (error) => {
            //this.errorHandler.mostrarErrorLiteral(error);
        });
    }

    ingresarAnonimo() {
        if (this.user.nombre && this.user.foto) {
            let spiner = this.spinnerHandler.getAllPageSpinner();
            spiner.present();
            this.autenticationService.registerAnonymous()
                .then(response => {
                    let cliente = new Cliente(this.user.nombre, this.user.apellido, this.user.dni, this.user.foto, true);
                    cliente.uid = this.autenticationService.getUID();
                    this.paramsService.user = cliente;
                    this.paramsService.rol = cliente.rol;
                    this.paramsService.isLogged = true;
                    spiner.dismiss();
                    this.messageHandler.mostrarMensaje("Bienvenido!!");
                    if (this.fromLogin) {
                        this.navCtrl.setRoot(PrincipalClientePage)
                    }
                })
                .catch(error => {
                    console.log(error);
                    spiner.dismiss();
                    this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
                })
        } else {
            this.messageHandler.mostrarErrorLiteral("El nombre y la foto deben ser completados", "Error al registrarse");
        }
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

    private registrarYLoguear() {
        let spiner = this.spinnerHandler.getAllPageSpinner();
        spiner.present();
        this.autenticationService.registerUserAndLogin(this.user.email, this.user.pass)
            .then(response => {
                let cliente = new Cliente(this.user.nombre, this.user.apellido, this.user.dni, this.user.foto, false);
                cliente.uid = this.autenticationService.getUID();
                this.usuarioService.guardar(cliente)
                    .then(response => {
                        spiner.dismiss();
                        this.messageHandler.mostrarMensaje("Bienvenido!!");
                        this.paramsService.isLogged = true;
                        if (this.fromLogin) {
                            this.navCtrl.setRoot(PrincipalClientePage)
                        }
                    }, error => {
                        this.autenticationService.deleteUserLogged()
                            .then(response => {
                                spiner.dismiss();
                                this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
                                this.paramsService.isLogged = true;
                                if (this.fromLogin) {
                                    this.navCtrl.setRoot(IniciarsesionPage)
                                }
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

