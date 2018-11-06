import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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
    //Encuestas
import { EncuestaEmpleadoPage } from '../pages/encuesta-empleado/encuesta-empleado';
import { EncuestaClientePage } from '../pages/encuesta-cliente/encuesta-cliente';
    //Otros
import { DashboardPage } from '../pages/dashboard/dashboard';
import { OcuparMesaPage } from '../pages/ocupar-mesa/ocupar-mesa';
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

//Pipes
import { PipesModule } from '../pipes/pipes.module';
import { from } from 'rxjs/observable/from';
import { IniciarsesionmenuPage } from '../pages/iniciarsesionmenu/iniciarsesionmenu';

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
        PropinaPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicMultiCameraModule.forRoot(),
        AngularFireModule.initializeApp(configs.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        NgxQRCodeModule,
        PipesModule
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
        EncuestaClienteService
    ]
})
export class AppModule {}
