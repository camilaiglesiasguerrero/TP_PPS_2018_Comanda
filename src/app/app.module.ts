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

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { IniciarsesionPage } from './../pages/iniciarsesion/iniciarsesion';
import { RegistrarsePage } from './../pages/registrarse/registrarse';
import { MesasPage } from '../pages/mesas/mesas';
import { BebidasPage } from '../pages/bebidas/bebidas';
import { ComidasPage } from '../pages/comidas/comidas';
import { EmpeladosPage } from '../pages/empleados/empleados';
import { EncuestaEmpleadoPage } from '../pages/encuesta-empleado/encuesta-empleado';
import { ListadoPedidosPage } from '../pages/listado-pedidos/listado-pedidos';
import { AltaMenuPage } from '../pages/alta-menu/alta-menu';
import { ListadoMenuPage } from '../pages/listado-menu/listado-menu';
import { AltaPedidoPage } from '../pages/alta-pedido/alta-pedido';
import { AnagramaPage } from '../pages/juegos/anagrama/anagrama'; 
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
        DashboardPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(configs.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
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
        DashboardPage
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
