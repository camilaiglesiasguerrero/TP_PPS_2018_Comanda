import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { RegistrarsePage } from '../registrarse/registrarse';
import { ParamsService } from './../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';

import { HomePage } from './../home/home';


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
  allUsersData: any;
  userData: Observable<any[]>

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private autenticationService: AuthenticationService,
    private messageHandler: MessageHandler,
    private spinnerHandler: SpinnerHandler,
    private usuariosService: UsuariosService,
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
          if(this.user.name != 'administrador@gmail.com'){
            this.allUsersData = this.usuariosService.getByUserId();
            this.userData = this.allUsersData.snapshotChanges();
            console.log(this.allUsersData + '-' + this.userData)
            this.userData.subscribe(response => {
              this.onLogged(response[0].payload.val());
              
            })
          }else{
            this.onLogged({email: this.user.name, rol:'admin'});
          }    
        })
        .catch(error => {
          this.spiner.dismiss();
          this.messageHandler.mostrarError(error, "Error al iniciar sesión");
        })
    }
  }

  onLogged(user:any){
    this.paramsService.user = user;
    this.paramsService.rol = user.rol;
    this.spiner.dismiss();
    this.paramsService.isLogged = true;
    this.autenticationService.logInFromDataBase();
    this.navCtrl.setRoot(HomePage)
    console.log("Se logueo correctamente");
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
        this.user.pass = "123456";
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
    this.messageHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
    return false;
  }


}
