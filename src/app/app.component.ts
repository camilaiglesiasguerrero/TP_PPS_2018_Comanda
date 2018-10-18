import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ParamsService } from './../services/params.service';
import { MessageHandler } from './../services/messageHandler.service';
import { AuthenticationService } from './../services/authentication.service';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { IniciarsesionPage } from './../pages/iniciarsesion/iniciarsesion';
import { RegistrarsePage } from './../pages/registrarse/registrarse';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = IniciarsesionPage;
  pages: Array<{ title: string, component: any }>;
  loginPages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private paramsService: ParamsService, private messageHandler: MessageHandler, private authenticationService: AuthenticationService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.loginPages = [
      { title: 'Iniciar Sesión', component: IniciarsesionPage },
      { title: 'Registrarse', component: RegistrarsePage }
    ];
    this.pages = [
      { title: 'Cerrar Sesión', component: IniciarsesionPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.title == 'Cerrar Sesión') {
      let alertConfirm = this.messageHandler.mostrarMensajeConfimación("¿Quieres cerrar sesión?", "Cerrar sesión");
      alertConfirm.present();
      alertConfirm.onDidDismiss((confirm) => {
        if (confirm) {
          this.cerrarSesion();
        }
      });
      this.nav.setRoot(page.component, { 'fromApp': true });
    }
  }

  private cerrarSesion() {
    this.paramsService.isLogged = false;
    this.authenticationService.logOut();
    this.nav.setRoot(IniciarsesionPage, { 'fromApp': true });
  }

}
