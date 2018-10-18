import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ClientesService {

    private serviceRef = this.afDB.list<any>('clientes');

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

}