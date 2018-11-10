import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ParamsService } from './../services/params.service';
import { MessageHandler } from './../services/messageHandler.service';
import { AuthenticationService } from './../services/authentication.service';

import { IniciarsesionPage } from './../pages/iniciarsesion/iniciarsesion';
import { RegistrarsePage } from './../pages/registrarse/registrarse';
import { AltaPedidoPage } from './../pages/alta-pedido/alta-pedido';
import { MesasPage } from '../pages/mesas/mesas';
import { BebidasPage } from '../pages/bebidas/bebidas';
import { ComidasPage } from '../pages/comidas/comidas';
import { EmpeladosPage } from '../pages/empleados/empleados';
import { EncuestaClientePage } from "../pages/encuesta-cliente/encuesta-cliente";
import { DueñosPage } from '../pages/dueños/dueños';
import { ProfilePage } from '../pages/profile/profile';
import { PropinaPage } from '../pages/propina/propina';
import { PrincipalClientePage } from '../pages/principal-cliente/principal-cliente';
import {ReservasAgendadasPage} from "../pages/reservas-agendadas/reservas-agendadas";


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = IniciarsesionPage;
  loginPages: Array<{ title: string, component: any }>;
  clientePages: Array<{ title: string, component: any }>;
  clienteAnonimoPages: Array<{ title: string, component: any }>;
  mozoPages: Array<{ title: string, component: any }>;
  metrePages: Array<{ title: string, component: any }>;
  supervisorPages: Array<{ title: string, component: any }>;
  cocineroPages: Array<{ title: string, component: any }>;
  bartenerPages: Array<{ title: string, component: any }>;
  commonPages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private paramsService: ParamsService, private messageHandler: MessageHandler, private authenticationService: AuthenticationService) {
    this.initializeApp();
    this.loginPages = [
      { title: 'Iniciar Sesión', component: IniciarsesionPage },
      { title: 'Registrarse', component: RegistrarsePage }
    ];
    this.clientePages = [
      { title: "Inicio", component: PrincipalClientePage},
      { title: "Hacer Pedido", component: AltaPedidoPage },
      { title: "Encuesta de satisfacción", component: EncuestaClientePage},
      { title: "Hacer una reserva", component: ReservasAgendadasPage}

    ];
    this.clienteAnonimoPages = [
      { title: "Inicio", component: PrincipalClientePage},
      { title: "Hacer Pedido", component: AltaPedidoPage },
      { title: "Encuesta de satisfacción", component: EncuestaClientePage}
    ];
    this.supervisorPages = [
      { title: 'Empleados', component: EmpeladosPage }
    ];
    this.mozoPages = [
      { title: 'Alta Clientes', component: IniciarsesionPage },
      { title: 'Mesas', component: MesasPage }
    ];
    this.metrePages = [
      { title: 'Alta Clientes', component: IniciarsesionPage },
      { title: 'Mesas', component: MesasPage }
    ];
    this.bartenerPages = [
      { title: 'Bebidas', component: BebidasPage }
    ];
    this.cocineroPages = [
      { title: 'Comidas', component: ComidasPage },
    ];
    this.commonPages = [
      { title: 'Cerrar Sesión', component:IniciarsesionPage }
    ];


    }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    switch (page.title) {
      case 'Cerrar Sesión':
        let alertConfirm = this.messageHandler.mostrarMensajeConfimación("¿Quieres cerrar sesión?", "Cerrar sesión");
        alertConfirm.present();
        alertConfirm.onDidDismiss((confirm) => {
          if (confirm) {
            this.cerrarSesion();
          }
        });
        break;
      case 'Iniciar Sesión':
        this.nav.setRoot(page.component, { 'fromApp': true });
        break;
      case 'Empleados':
        this.nav.setRoot(page.component, { 'empleado': true });
        break;
      case 'Dueños':
        this.nav.setRoot(page.component, { 'empleado': true });
        break;
      case 'Hacer Pedido':
        if(this.paramsService.user.rol == 'cliente'){
            this.nav.setRoot(page.component, { 'empleado': false });
        }
        if(this.paramsService.user.rol == 'mozo'){
          this.nav.setRoot(page.component, {'empleado': true});
      }

        break;
      default:
        this.nav.setRoot(page.component);
        break;
    }
  }

  private cerrarSesion() {
    this.paramsService.isLogged = false;
    this.authenticationService.logOut();
    this.nav.setRoot(IniciarsesionPage, { 'fromApp': true });
  }

}
