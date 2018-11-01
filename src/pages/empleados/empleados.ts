import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';
import { AltaEmpleadoPage } from '../alta-empleado/alta-empleado';

@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html'
})
export class EmpeladosPage {

  allEmpleados: any;
  empleadosLista: Observable<any[]>
  totalItems:number;
  tipoAlta:string

  constructor(public navCtrl: NavController,
    private usuariosService: UsuariosService) {
    this.tipoAlta='empleado';
    this.allEmpleados = this.usuariosService.obtenerLista();
    this.empleadosLista = this.allEmpleados.snapshotChanges();
  }

  ionViewDidLoad() {
    this.obtenerEmpleados();
  }

  agregarEmpleado(){
    this.navCtrl.setRoot(AltaEmpleadoPage,{
      tipoAlta:'empleado'
    });
  }

  private obtenerEmpleados() {
    this.empleadosLista.subscribe(data => {
      this.totalItems = data.length - 1;
      data.forEach(jugador => {
      })
    })
  }
}