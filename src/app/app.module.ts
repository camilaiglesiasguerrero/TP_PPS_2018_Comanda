import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { VideoPlayer } from '@ionic-native/video-player';
import { IonicMultiCameraModule, IonicMultiCamera } from 'ionic-multi-camera';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { configs } from './globalConfigs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PUSH NOTIFICATIONS
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from  '@ionic-native/firebase';
import { FcmProvider } from "../providers/fcm";
import {NotificationsPushService} from "../services/notificationsPush.service";


//LectorQR
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//GeneradorQR
import { NgxQRCodeModule } from 'ngx-qrcode2';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//GPS, GEOLOCATION
import { GeocodingProvider } from '../providers/geocoding';
import { Geolocation } from '@ionic-native/geolocation';
import { UbicacionPage } from '../pages/ubicacion/ubicacion';

//Pages
import { MyApp } from './app.component';

//Autenticación
import { IniciarsesionPage } from './../pages/iniciarsesion/iniciarsesion';
import { RegistrarsePage } from './../pages/registrarse/registrarse';

//Page Principal por user
import { PrincipalClientePage } from '../pages/principal-cliente/principal-cliente';
import { PrincipalMozoPage } from '../pages/principal-mozo/principal-mozo';

//Listados
import { MesasPage } from '../pages/mesas/mesas';
import { BebidasPage } from '../pages/bebidas/bebidas';
import { ComidasPage } from '../pages/comidas/comidas';
import { EmpeladosPage } from '../pages/empleados/empleados';
import { ListadoPedidosPage } from '../pages/listado-pedidos/listado-pedidos';
import { ListadoMenuPage } from '../pages/listado-menu/listado-menu';
import { DueñosPage } from '../pages/dueños/dueños';
import { ProfilePage } from '../pages/profile/profile';
import { PropinaPage } from '../pages/propina/propina';

//ABM
import { AltaMenuPage } from '../pages/alta-menu/alta-menu';
import { AltaPedidoPage } from '../pages/alta-pedido/alta-pedido';
import { AltaMesaPage } from '../pages/alta-mesa/alta-mesa';
import { AltaEmpleadoPage } from '../pages/alta-empleado/alta-empleado';

//Juegos
import { AnagramaPage } from '../pages/juegos/anagrama/anagrama';
import { AdivinarNumeroPage } from '../pages/juegos/adivinar-numero/adivinar-numero';
import { TriviaPage } from '../pages/juegos/trivia/trivia';


//Encuestas
import { EncuestaEmpleadoPage } from '../pages/encuesta-empleado/encuesta-empleado';
import { EncuestaClientePage } from '../pages/encuesta-cliente/encuesta-cliente';
import { EncuestaClienteResultadosPage } from '../pages/encuesta-cliente-resultados/encuesta-cliente-resultados';
import { EncuestaEmpleadoResultadosPage } from '../pages/encuesta-empleado-resultados/encuesta-empleado-resultados';
import { ChartModule } from 'primeng/chart';

//Otros
import { DashboardPage } from '../pages/dashboard/dashboard';
import { OcuparMesaPage } from '../pages/ocupar-mesa/ocupar-mesa';
import { ReservasAgendadasPage } from '../pages/reservas-agendadas/reservas-agendadas'
import { CuentaPage } from '../pages/cuenta/cuenta';
import {ReservasAgendadasSupervisorPage} from "../pages/reservas-agendadas-supervisor/reservas-agendadas-supervisor";
import {ReservarMesaPage} from "../pages/reservar-mesa/reservar-mesa";
import {DeliveryPedidosPage} from "../pages/delivery-pedidos/delivery-pedidos";


//Pedido
import { EstadoPedidoPage } from '../pages/estado-pedido/estado-pedido';

//Services
import { AuthenticationService } from '../services/authentication.service';
import { MessageHandler } from '../services/messageHandler.service';
import { SpinnerHandler } from '../services/spinnerHandler.service';
import { ParamsService } from '../services/params.service';
import { UsuariosService } from './../services/usuarios.service';
import { QrService } from './../services/qr.service';
import { CameraService } from '../services/camera.service';
import { DatabaseService } from '../services/database.service';
import { EncuestaClienteService } from '../services/encuestasCliente.service';
import { ParserTypesService } from "../services/parserTypesService";


//Pipes
import { PipesModule } from '../pipes/pipes.module';
import { from } from 'rxjs/observable/from';
import { IniciarsesionmenuPage } from '../pages/iniciarsesionmenu/iniciarsesionmenu';

import { ListadoEsperaPage } from '../pages/listado-espera/listado-espera';


@NgModule({
  declarations: [
    MyApp,
    IniciarsesionPage,
    IniciarsesionmenuPage,
    RegistrarsePage,
    MesasPage,
    BebidasPage,
    ComidasPage,
    EmpeladosPage,
    EncuestaEmpleadoPage,
    ListadoPedidosPage,
    AltaMenuPage,
    ListadoMenuPage,
    AltaPedidoPage,
    AnagramaPage,
    DashboardPage,
    AltaMesaPage,
    AltaEmpleadoPage,
    DueñosPage,
    OcuparMesaPage,
    EstadoPedidoPage,
    EncuestaClientePage,
    PrincipalClientePage,
    PrincipalMozoPage,
    ProfilePage,
    PropinaPage,
    EncuestaClienteResultadosPage,
    AdivinarNumeroPage,
    UbicacionPage,
    ReservasAgendadasPage,
    TriviaPage,
    EncuestaEmpleadoResultadosPage,
    ReservasAgendadasPage,
    CuentaPage,
    ReservasAgendadasSupervisorPage,
    ReservarMesaPage,
    ListadoEsperaPage,
    DeliveryPedidosPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicMultiCameraModule.forRoot(),
    AngularFireModule.initializeApp(configs.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    NgxQRCodeModule,
    PipesModule,
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IniciarsesionPage,
    IniciarsesionmenuPage,
    RegistrarsePage,
    MesasPage,
    BebidasPage,
    ComidasPage,
    EmpeladosPage,
    EncuestaEmpleadoPage,
    ListadoPedidosPage,
    AltaMenuPage,
    ListadoMenuPage,
    AltaPedidoPage,
    AnagramaPage,
    DashboardPage,
    AltaMesaPage,
    AltaEmpleadoPage,
    DueñosPage,
    OcuparMesaPage,
    EstadoPedidoPage,
    EncuestaClientePage,
    PrincipalClientePage,
    PrincipalMozoPage,
    ProfilePage,
    PropinaPage,
    EncuestaClienteResultadosPage,
    AdivinarNumeroPage,
    UbicacionPage,
    ReservasAgendadasPage,
    TriviaPage,
    EncuestaEmpleadoResultadosPage,
    ReservasAgendadasPage,
    CuentaPage,
    ReservasAgendadasPage,
    ReservasAgendadasSupervisorPage,
    ReservarMesaPage,
    ListadoEsperaPage,
    DeliveryPedidosPage,
    PropinaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    IonicMultiCamera,
    File,
    BarcodeScanner,
    ParamsService,
    MediaCapture,
    VideoPlayer,
    ImagePicker,
    AuthenticationService,
    MessageHandler,
    SpinnerHandler,
    UsuariosService,
    QrService,
    CameraService,
    DatabaseService,
    EncuestaClienteService,
    AdivinarNumeroPage,
    GeocodingProvider,
    Geolocation,
    ParserTypesService,
    Firebase,
    FcmProvider,
    NotificationsPushService
  ]
})
export class AppModule {}
