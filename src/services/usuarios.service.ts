import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class UsuariosService {

    private serviceRef = this.afDB.list<any>('usuarios');

    constructor(private MiAuth: AngularFireAuth,
        public afDB: AngularFireDatabase, ) {
    }

    public guardar(model) {
        return this.serviceRef.push(model);
    }

    public editar(model, key){
        return this.serviceRef.update(key, model);
    }

    public obtenerLista() {
        return this.serviceRef;
    }

    public getByUserId(){
       return this.afDB.list('/usuarios', ref => ref.orderByChild('uid').equalTo(this.MiAuth.auth.currentUser.uid))        
    }

    public getEmpleados(){
        return this.afDB.list('/usuarios', ref => ref.orderByChild('rol').equalTo('empleado'));
    }

    public getClientes(){
        return this.afDB.list('/usuarios', ref => ref.orderByChild('rol').equalTo('cliente'));
    }
}