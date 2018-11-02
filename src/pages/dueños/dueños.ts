import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';
import { AltaEmpleadoPage } from '../alta-empleado/alta-empleado';
import { Usuario } from '../../models/usuario';
import { map } from 'rxjs/operators';
import { MessageHandler } from '../../services/messageHandler.service';

/**
 * Generated class for the DueñosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-duenos',
  templateUrl: 'dueños.html',
})
export class DueñosPage {

  empleadosObs: Observable<Usuario[]>;
  empleadosList:Usuario[];
  totalItems:number;
  tipoAlta:string;
  
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
    console.log('ionViewDidLoad DueñosPage');
  }

  agregar(){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'dueño'
    });
  }

  modificar(key:string,empleado:Usuario){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'modDueño',
      key:key,
      userMod:empleado
    });
  }

  borrar(key:string){
    let alertConfirm = this.mensajes.mostrarMensajeConfimación("¿Esta seguro?", "Eliminar Dueño");
        alertConfirm.present();
        alertConfirm.onDidDismiss((confirm) => {
          if (confirm) {
            this.usuariosService.obtenerLista().remove(key);
            this.mensajes.mostrarMensaje("Eliminacion Exitosa");
          }
        });
  }

}
