import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { VideoPlayer } from '@ionic-native/video-player';

import { configs } from './globalConfigs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//LectorQR
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//GeneradorQR
import { NgxQRCodeModule } from 'ngx-qrcode2';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
    //Autenticación
import { IniciarsesionPage } from './../pages/iniciarsesion/iniciarsesion';
import { RegistrarsePage } from './../pages/registrarse/registrarse';
    //Listados
import { MesasPage } from '../pages/mesas/mesas';
import { BebidasPage } from '../pages/bebidas/bebidas';
import { ComidasPage } from '../pages/comidas/comidas';
import { EmpeladosPage } from '../pages/empleados/empleados';
import { ListadoPedidosPage } from '../pages/listado-pedidos/listado-pedidos';
import { ListadoMenuPage } from '../pages/listado-menu/listado-menu';
    //ABM
import { AltaMenuPage } from '../pages/alta-menu/alta-menu';
import { AltaPedidoPage } from '../pages/alta-pedido/alta-pedido';
import { AltaMesaPage } from '../pages/alta-mesa/alta-mesa';
    //Juegos
import { AnagramaPage } from '../pages/juegos/anagrama/anagrama'; 
    //Otros
import { EncuestaEmpleadoPage } from '../pages/encuesta-empleado/encuesta-empleado';
import { EncuestaClientePage } from '../pages/encuesta-cliente/encuesta-cliente';
import { DashboardPage } from '../pages/dashboard/dashboard';

//Services
import { AuthenticationService } from '../services/authentication.service';
import { MessageHandler } from '../services/messageHandler.service';
import { SpinnerHandler } from '../services/spinnerHandler.service';
import { ParamsService } from '../services/params.service';
import { UsuariosService } from './../services/usuarios.service';



@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        IniciarsesionPage,
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
        EncuestaClientePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(configs.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        NgxQRCodeModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        IniciarsesionPage,
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
        EncuestaClientePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Camera,
        BarcodeScanner,
        ParamsService,
        MediaCapture,
        VideoPlayer,
        AuthenticationService,
        MessageHandler,
        SpinnerHandler,
        UsuariosService,

    ]
})
export class AppModule {}
