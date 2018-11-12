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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-registrarse',
  templateUrl: 'registrarse.html',
})

export class RegistrarsePage {

  user = { email: '', pass: '', secondPass: '', dni: '', nombre: '', apellido: '', foto: '', rol: '' };
  title = "Registrarse";
  miScan = {};
  fromLogin = false;
  options: any;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private autenticationService: AuthenticationService,
              private messageHandler: MessageHandler,
              private spinnerHandler: SpinnerHandler,
              private barcodeScanner: BarcodeScanner,
              private usuarioService: UsuariosService,
              public paramsService: ParamsService,
              private camera: Camera,
              private formBuilder: FormBuilder
  ) {
    if (this.navParams.data.page == 'login') {
      this.fromLogin = true;
    }
    this.initValidator();
  }

  ionViewDidLoad() {
    this.paramsService.isLogged = false;
  }

  registerUser() {
    if (this.validatorCliente()) {
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
      this.messageHandler.mostrarErrorLiteral(error);
    });
  }

  ingresarAnonimo() {
    if (this.formGroup.controls.nombreValidator.value && this.user.foto) {
      if(this.formGroup.controls.nombreValidator.valid){
        this.user.nombre = this.formGroup.controls.nombreValidator.value;
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
            this.messageHandler.mostrarMensaje("Se envio un correo para validar su cuenta!!");
            if (this.fromLogin) {
              this.navCtrl.setRoot(PrincipalClientePage)
            }
          })
          .catch(error => {
            console.log(error);
            spiner.dismiss();
            this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
          })
      }else{
        this.messageHandler.mostrarErrorLiteral("Nombre inválido", "Error al registrarse");
      }
    } else {
      this.messageHandler.mostrarErrorLiteral("El nombre y la foto deben ser completados", "Error al registrarse");
    }
  }

  private initValidator(){
    this.formGroup = this.formBuilder.group({
      emailValidator: ['', Validators.compose([Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'), Validators.required])],
      passValidator: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      secondPassValidator: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      dniValidator: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      nombreValidator: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      apellidoValidator: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });

  }

  private validatorCliente(){
    if (this.formGroup.controls.emailValidator.value && this.formGroup.controls.passValidator.value &&
      this.formGroup.controls.secondPassValidator.value && this.formGroup.controls.dniValidator.value &&
      this.formGroup.controls.nombreValidator.value && this.formGroup.controls.apellidoValidator.value) {
      if(this.formGroup.controls.emailValidator.valid){
        if(this.formGroup.controls.passValidator.valid && this.formGroup.controls.secondPassValidator.valid){
          if(this.formGroup.controls.passValidator.value == this.formGroup.controls.secondPassValidator.value){
            if(this.formGroup.controls.dniValidator.valid){
              if(this.formGroup.controls.nombreValidator.valid){
                if(this.formGroup.controls.apellidoValidator.valid){
                  this.user.email = this.formGroup.controls.emailValidator.value;
                  this.user.pass = this.formGroup.controls.passValidator.value;
                  this.user.dni = this.formGroup.controls.dniValidator.value;
                  this.user.nombre = this.formGroup.controls.nombreValidator.value;
                  this.user.apellido = this.formGroup.controls.apellidoValidator.value;
                  return true;
                }else{
                  this.messageHandler.mostrarErrorLiteral("Apellido inválido", "Error al registrarse");
                }
              }else{
                this.messageHandler.mostrarErrorLiteral("Nombre inválido", "Error al registrarse");
              }
            }else{
              this.messageHandler.mostrarErrorLiteral("Dni inválido", "Error al registrarse");
            }
          }else{
            this.messageHandler.mostrarErrorLiteral("Las contraseñas no coinciden", "Error al registrarse");
          }
        }else{
          this.messageHandler.mostrarErrorLiteral("Las contraseñas deben tener mínimo 6 caracteres", "Error al registrarse");
        }
      }else{
        this.messageHandler.mostrarErrorLiteral("Email inválido", "Error al registrarse");
      }
    }else{
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
                this.autenticationService.sendVerification();
                this.usuarioService.guardar(cliente)
                    .then(response => {
                        spiner.dismiss();
                        this.messageHandler.mostrarMensaje("Cuenta creada con exito. Debe verificar su correo electronico!");
                        this.autenticationService.logOut();
                        if (this.fromLogin) {
                            this.navCtrl.setRoot(IniciarsesionPage)
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

