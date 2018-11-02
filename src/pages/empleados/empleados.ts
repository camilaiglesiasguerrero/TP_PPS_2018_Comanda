import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';
import { AltaEmpleadoPage } from '../alta-empleado/alta-empleado';
import { Usuario } from '../../models/usuario';
import { map } from 'rxjs/operators';
import { MessageHandler } from '../../services/messageHandler.service';


@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html'
})
export class EmpeladosPage {

  empleadosObs: Observable<Usuario[]>;
  empleadosList:Usuario[];
  totalItems:number;

  constructor(public navCtrl: NavController,
    private usuariosService: UsuariosService,
    public mensajes: MessageHandler,
    ) {
      this.empleadosObs= this.usuariosService.obtenerLista().snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
      this.empleadosObs.subscribe( res =>{
        this.empleadosList = res;
      });
  }

  ionViewDidLoad() {
  }

  agregarEmpleado(){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'empleado'
    });
  }

  modificar(key:string,empleado:Usuario){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'modEmp',
      key:key,
      userMod:empleado
    });
  }

  borrar(key:string){
    let alertConfirm = this.mensajes.mostrarMensajeConfimación("¿Esta seguro?", "Eliminar Empleado");
        alertConfirm.present();
        alertConfirm.onDidDismiss((confirm) => {
          if (confirm) {
            this.usuariosService.obtenerLista().remove(key);
            this.mensajes.mostrarMensaje("Eliminacion Exitosa");
          }
        });
  }

}