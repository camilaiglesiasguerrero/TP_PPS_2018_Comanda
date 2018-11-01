import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthenticationService } from './../../services/authentication.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { ParamsService } from '../../services/params.service';
import { EncuestaClienteService } from '../../services/encuestasCliente.service';
import { PrincipalClientePage } from '../principal-cliente/principal-cliente';

@IonicPage()
@Component({
  selector: 'page-encuesta-cliente',
  templateUrl: 'encuesta-cliente.html',
})

export class EncuestaClientePage {

  resultados: any = { limpieza: "", atencion: "", sabor: "", velocidad: "", recomendar: "", usuarioId: "" };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private encuestaClienteService: EncuestaClienteService, 
    private authenticationService: AuthenticationService,
    private messageHandler: MessageHandler) {
      this.resultados.usuarioId = this.authenticationService.getUID();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaClientePage');
  }

  finalizar() {
    this.encuestaClienteService.guardar(this.resultados)
      .then(response => {
        this.messageHandler.mostrarMensaje("Gracias por completar la encuesta!");
        this.navCtrl.setRoot(PrincipalClientePage);
      })
      .catch(error => {
        this.messageHandler.mostrarErrorLiteral("Hubo un error a completar la encuesta");
      })
  }

}
