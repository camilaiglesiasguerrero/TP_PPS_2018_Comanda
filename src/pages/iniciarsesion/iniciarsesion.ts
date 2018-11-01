import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { RegistrarsePage } from '../registrarse/registrarse';
import { ParamsService } from './../../services/params.service';
import { UsuariosService } from './../../services/usuarios.service';
import { EncuestaEmpleadoPage } from '../encuesta-empleado/encuesta-empleado';
import { DashboardPage } from '../dashboard/dashboard';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';
import { IniciarsesionmenuPage } from '../iniciarsesionmenu/iniciarsesionmenu';


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
    public paramsService: ParamsService,
    public popoverCtrl:PopoverController) {
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
    this.user.name = this.paramsService.name;
    this.user.pass = this.paramsService.pass;
    console.log(this.user.name);
    if (this.validForm()) {
      this.spiner = this.spinnerHandler.getAllPageSpinner();
      this.spiner.present();
      this.autenticationService.singIn(this.user.name, this.user.pass)
        .then(response => {
          if(this.user.name != 'administrador@gmail.com'){
            this.allUsersData = this.usuariosService.getByUserId();
            if(this.allUsersData == null){
              this.allUsersData = this.usuariosService.getEmpleados();
            }
            this.userData = this.allUsersData.snapshotChanges();
            this.userData.subscribe(response => {
              this.onLogged(response[0].payload.val());
            })
          }else{
            this.onLogged({email: this.user.name, rol:'admin'});
            this.paramsService.email = this.user.name;
            this.paramsService.password = this.user.pass;
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
    
    switch(this.paramsService.rol){
      case 'empleado':
        this.navCtrl.setRoot(EncuestaEmpleadoPage);    
        break;
      case 'cliente':
        this.navCtrl.setRoot(PrincipalClientePage);
        break;
      case 'dueño':
        this.navCtrl.setRoot(DashboardPage);
        break;
      
    }
    
    //console.log("Se logueo correctamente");
  }

  registerUser() {
    this.navCtrl.setRoot(RegistrarsePage, {page:'login'});
  }

  elegirUser(){
      let popover = this.popoverCtrl.create(IniciarsesionmenuPage);
      popover.present({
      }).then(r=>{
      });
  }

  private validForm() {
    if (this.user.pass && this.user.pass) {
      return true;
    }
    this.messageHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
    return false;
  }



}
