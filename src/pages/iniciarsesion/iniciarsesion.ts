import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { RegistrarsePage } from '../registrarse/registrarse';
import { ParamsService } from './../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';
import { EncuestaEmpleadoPage } from '../encuesta-empleado/encuesta-empleado';
import { DashboardPage } from '../dashboard/dashboard';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';
import { IniciarsesionmenuPage } from '../iniciarsesionmenu/iniciarsesionmenu';
import {FcmProvider} from "../../providers/fcm";
import {AltaEmpleadoPage} from '../alta-empleado/alta-empleado';


@Component({
  selector: 'page-iniciarsesion',
  templateUrl: 'iniciarsesion.html',
})
export class IniciarsesionPage {

  splash = true;
  loading: boolean = false;
  userSelect: string = "";
  selectUserOptions = { title: '' };
  allUsersData: any;
  userData: Observable<any[]>;
  formGroup: FormGroup;
  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private autenticationService: AuthenticationService,
              private messageHandler: MessageHandler,
              private usuariosService: UsuariosService,
              public paramsService: ParamsService,
              public popoverCtrl:PopoverController,
              private formBuilder: FormBuilder,
              public fcmProvider: FcmProvider) {
    this.selectUserOptions.title = "Usuarios disponibles";
    this.formGroup = formBuilder.group({
      emailValidator: ['', Validators.compose([Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'), Validators.required])],
      passValidator: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.paramsService.isLogged = false;
    if (this.navParams.get('fromApp')) {
      this.splash = false;
    } else {
      setTimeout(() => {
        this.splash = false;
      }, 6000);
    }
  }

  singIn() {
    if (this.validForm()) {
      this.mostrarSpinner = true;
      this.autenticationService.singIn(this.paramsService.email, this.paramsService.pass)
        .then(response => {
          this.autenticationService.logInFromDataBase();
          if(this.paramsService.email != 'administrador@gmail.com'){
            this.allUsersData = this.usuariosService.getByUserId();
            if(this.allUsersData == null){
              this.allUsersData = this.usuariosService.getEmpleados();
            }
            this.userData = this.allUsersData.snapshotChanges();
            this.userData.subscribe(response => {
              this.onLogged(response[0].payload.val());
            })
          }else{
            this.onLogged({email: this.paramsService.email, rol:'admin'});
          }
        })
        .catch(error => {
          //this.spiner.dismiss();
          this.mostrarSpinner = false;
          this.messageHandler.mostrarError(error, "Error al iniciar sesión");
        })
    }
  }

  onLogged(user:any){
    this.paramsService.user = user;
    this.paramsService.rol = user.rol;
    //this.spiner.dismiss();
    this.mostrarSpinner = false;
    this.paramsService.isLogged = true;

    this.autenticationService.logInFromDataBase();
    if((!this.autenticationService.getVerification()) && this.paramsService.rol == "cliente" && this.paramsService.email !== "cliente1@gmail.com" && this.paramsService.email !== "cliente2@gmail.com" )
    {
      this.messageHandler.mostrarErrorLiteral("Debe verificar su cuenta");
      this.paramsService.isLogged = false;
      this.navCtrl.setRoot(IniciarsesionPage, { 'fromApp': true });
    }
    else{
      switch(this.paramsService.rol){
        case 'mozo':
        case 'cocinero':
        case 'bartender':
        case 'delivery':
        case 'metre':
        case '':
          this.navCtrl.setRoot(EncuestaEmpleadoPage);
          break;
        case 'cliente':
          this.navCtrl.setRoot(PrincipalClientePage);
          break;
        case 'dueño':
          this.navCtrl.setRoot(DashboardPage);
          break;
        case 'supervisor':
          this.navCtrl.setRoot(DashboardPage);
          break;
        case 'admin':
          this.navCtrl.setRoot(AltaEmpleadoPage, {tipoAlta:'dueño'});
          break;
      }
      this.fcmProvider.getToken(this.paramsService.user.uid, this.paramsService.user.rol);
    }

    //console.log("Se logueo correctamente");
  }

  registerUser() {
    this.navCtrl.setRoot(RegistrarsePage, {page:'login'});
  }

  elegirUser(){
    let popover = this.popoverCtrl.create(IniciarsesionmenuPage);
    popover.present({
    }).then(r=>{});
    popover.onDidDismiss(response => {
      this.formGroup.controls.emailValidator.setValue(this.paramsService.email);
      this.formGroup.controls.passValidator.setValue(this.paramsService.pass);
    })
  }

  private validForm() {
    if (this.formGroup.controls.emailValidator.value && this.formGroup.controls.passValidator.value) {
      if(this.formGroup.controls.emailValidator.valid){
        if(this.formGroup.controls.passValidator.valid){
          this.paramsService.email = this.formGroup.controls.emailValidator.value;
          this.paramsService.pass = this.formGroup.controls.passValidator.value;
          return true;
        }
        this.messageHandler.mostrarErrorLiteral("La contraseña debe tener mínimo 6 caracteres", "Error al registrarse");
      }else{
        this.messageHandler.mostrarErrorLiteral("Email inválido", "Error al registrarse");
      }
    }else{
      this.messageHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
    }
    return false;
  }



}
