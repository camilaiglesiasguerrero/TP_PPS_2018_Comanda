import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';
import { AltaEmpleadoPage } from '../alta-empleado/alta-empleado';
import { Usuario } from '../../models/usuario';
import { map } from 'rxjs/operators';


@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html'
})
export class EmpeladosPage {

  empleadosObs: Observable<Usuario[]>;
  empleadosList:Usuario[];
  totalItems:number;
  tipoAlta:string;

  constructor(public navCtrl: NavController,
    private usuariosService: UsuariosService,
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
    let modEmpleado = new Usuario(empleado.nombre,empleado.apellido,empleado.dni,empleado.cuil,empleado.foto,empleado.rol);
    this.usuariosService.obtenerLista().update(key,modEmpleado);
  }

}