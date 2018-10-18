import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { NgForm } from '@angular/forms';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { RegistrarsePage } from '../registrarse/registrarse';
import { ParamsService } from './../../services/params.service';


@Component({
  selector: 'page-iniciarsesion',
  templateUrl: 'iniciarsesion.html',
})
export class IniciarsesionPage {

  splash = true;
  user = { name: '', pass: '' }
  loading: boolean = false;
  spiner: any = null;
  userSelect: string = "";
  selectUserOptions = { title: '' };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private autenticationService: AuthenticationService,
    private errorHandler: MessageHandler,
    private spinnerHandler: SpinnerHandler,
    public paramsService: ParamsService) {
    this.selectUserOptions.title = "Usuarios disponibles";
  }

  ionViewDidLoad() {
    this.paramsService.isLogged = false;
    if (this.navParams.get('fromApp')) {
      this.splash = false;
    } else {
      setTimeout(() => {
        this.splash = false;
      }, 1000);
    }
  }

  singIn() {
    if (this.validForm()) {
      this.spiner = this.spinnerHandler.getAllPageSpinner();
      this.spiner.present();
      this.autenticationService.singIn(this.user.name, this.user.pass)
        .then(response => {
          this.spiner.dismiss();
          this.paramsService.isLogged = true;
          if(response.email == "admin@gmail.com"){
            this.paramsService.usuarioAdmin = true;
          }else{
            this.paramsService.usuarioAdmin = false;
          }
          this.autenticationService.logInFromDataBase();  
         // this.navCtrl.setRoot(PartidosPage);
          console.log("Se logueo correctamente");
        })
        .catch(error => {
          this.spiner.dismiss();
          this.errorHandler.mostrarError(error, "Error al iniciar sesión");
        })
    }
  }

  registerUser() {
    this.navCtrl.setRoot(RegistrarsePage, {page:'login'});
  }

  userSelectChange() {
    switch (this.userSelect) {
      case "admin": {
        this.user.name = "administrador@gmail.com";
        this.user.pass = "111111";
        break;
      }
      case "invitado": {
        this.user.name = "invitado@gmail.com";
        this.user.pass = "222222";
        break;
      }
      case "usuario": {
        this.user.name = "usuario@gmail.com";
        this.user.pass = "333333";
        break;
      }
      case "anonimo": {
        this.user.name = "anonimo@gmail.com";
        this.user.pass = "44";
        break;
      }
      case "tester" : {
        this.user.name = "tester@gmail.com";
        this.user.pass = "55";
        break;
      }
    }
  }

  private validForm() {
    if (this.user.pass && this.user.pass) {
      return true;
    }
    this.errorHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
    return false;
  }


}
