import { Cliente } from './../../models/cliente';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { IniciarsesionPage } from './../iniciarsesion/iniciarsesion';
import { ParamsService } from '../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';
import { HomePage } from './../home/home';

@Component({
    selector: 'page-registrarse',
    templateUrl: 'registrarse.html',
})

export class RegistrarsePage {

    user = { email: '', pass: '', secondPass: '', dni: '', nombre: '', apellido: '', foto: '' };
    title = "Registrarse";
    miScan = {};
    fromLogin = false;

    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private autenticationService: AuthenticationService,
        private messageHandler: MessageHandler,
        private spinnerHandler: SpinnerHandler,
        private barcodeScanner: BarcodeScanner,
        private clientesService: UsuariosService,
        public paramsService: ParamsService,
    ) {
        if (this.navParams.data.page == 'login') {
            this.fromLogin = true;
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
                this.crearUsuario();
            }
        }
    }

    cancel() {
        this.navCtrl.setRoot(IniciarsesionPage, { 'fromApp': true })
    }

    tomarFoto() {

    }

    escanearDni() {
        /*    this.qrScanner.prepare()
                .then((status: QRScannerStatus) => {
                    if (status.authorized) {
                        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                            console.log('Scanned something', text);
    
                            this.qrScanner.hide(); // hide camera preview
                            scanSub.unsubscribe(); // stop scanning
                        });
    
                    } else if (status.denied) {
                        this.messageHandler.mostrarErrorLiteral("No se puede continuar si no se habilita el permiso");
                    } else {
                        // permission was denied, but not permanently. You can ask for permission again at a later time.
                        this.messageHandler.mostrarErrorLiteral("No se puede continuar si no se habilita el permiso");
                        
                    }
                })
                .catch((e: any) => console.log('Error is', e));
            /* try {
                 this.barcodeScanner.scan().then((barcodeData) => {
                   this.miScan = barcodeData;
                   alert(this.miScan);
                 }, (error) => {
                   this.errorHandler.mostrarErrorLiteral(error);
                 });
               } catch (error) {
                 this.errorHandler.mostrarErrorLiteral("catch" + error);
               }*/

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

    private crearUsuario() {

    }

    private registrarYLoguear() {
        let spiner = this.spinnerHandler.getAllPageSpinner();
        spiner.present();
        this.autenticationService.registerUserAndLogin(this.user.email, this.user.pass)
            .then(response => {
                let cliente = new Cliente(this.user.nombre, this.user.apellido, this.user.dni, this.user.foto);
                cliente.uid = this.autenticationService.getUID();
                this.clientesService.guardar(cliente)            
                    .then(response => {
                        spiner.dismiss();
                        this.messageHandler.mostrarMensaje("Bienvenido!!");
                        this.paramsService.isLogged = true;
                        if (this.fromLogin) {
                            this.navCtrl.setRoot(HomePage)
                        }
                    }, error => {
                        this.autenticationService.deleteUserLogged()
                            .then(response => {
                                spiner.dismiss();
                                this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
                                this.paramsService.isLogged = true;
                                if (this.fromLogin) {
                                    this.navCtrl.setRoot(HomePage)
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

