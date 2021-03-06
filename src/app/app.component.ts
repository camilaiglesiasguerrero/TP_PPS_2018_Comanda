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
import { EmpeladosPage } from '../pages/empleados/empleados';
import { EncuestaClientePage } from "../pages/encuesta-cliente/encuesta-cliente";
import { DueñosPage } from '../pages/dueños/dueños';
import { PrincipalClientePage } from '../pages/principal-cliente/principal-cliente';
import {ReservasAgendadasPage} from "../pages/reservas-agendadas/reservas-agendadas";
import {ReservasAgendadasSupervisorPage} from "../pages/reservas-agendadas-supervisor/reservas-agendadas-supervisor";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {PrincipalMozoPage} from "../pages/principal-mozo/principal-mozo";
import {DeliveryPedidosPage} from "../pages/delivery-pedidos/delivery-pedidos";
import {EncuestaClienteResultadosPage} from "../pages/encuesta-cliente-resultados/encuesta-cliente-resultados";
import { ListadoPedidosPage } from '../pages/listado-pedidos/listado-pedidos';
import { AltaMesaPage } from '../pages/alta-mesa/alta-mesa';
import { AltaEmpleadoPage } from '../pages/alta-empleado/alta-empleado';


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
  deliveryPages: Array<{ title: string, component: any }>;
  adminPages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private paramsService: ParamsService, private messageHandler: MessageHandler, private authenticationService: AuthenticationService) {
    this.initializeApp();
    this.loginPages = [
      { title: 'Iniciar Sesión', component: IniciarsesionPage },
      { title: 'Registrarse', component: RegistrarsePage }
    ];
    this.clientePages = [
      { title: "Inicio", component: PrincipalClientePage},
      { title: "Hacer una reserva", component: ReservasAgendadasPage},
      { title: "Encuesta de satisfacción", component: EncuestaClienteResultadosPage}

    ];
    this.clienteAnonimoPages = [
      { title: "Inicio", component: PrincipalClientePage},
      { title: "Encuesta de satisfacción", component: EncuestaClientePage}
    ];
    this.supervisorPages = [
      { title: "Inicio", component: DashboardPage},
      { title: 'Empleados', component: EmpeladosPage },
      { title: 'Dueños', component: DueñosPage },
      { title: 'Reservas Agendadas', component: ReservasAgendadasSupervisorPage }

    ];
    this.mozoPages = [
      { title: "Inicio", component: PrincipalMozoPage},
      { title: 'Agregar cliente', component: RegistrarsePage },
      { title: 'Mesas', component: MesasPage }
    ];
    this.metrePages = [
      { title: "Inicio", component: MesasPage},
      { title: 'Agregar cliente', component: RegistrarsePage },
      { title: 'Nueva Mesa', component: AltaMesaPage }
    ];
    this.bartenerPages = [
      { title: 'Inicio', component: ListadoPedidosPage }
    ];
    this.cocineroPages = [
      { title: 'Inicio', component: ListadoPedidosPage },
    ];
    this.commonPages = [
      { title: 'Cerrar Sesión', component:IniciarsesionPage }
    ];
    this.deliveryPages = [
      { title: 'Pedidos Delivery', component:DeliveryPedidosPage }
    ];
    this.adminPages = [
      { title: 'Inicio', component:AltaEmpleadoPage }
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
      case "Agregar cliente":
        this.nav.setRoot(page.component, { 'empleado': true });
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
