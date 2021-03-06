import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class EncuestaClienteService {

    private serviceRef = this.afDB.list<any>('encuesta-cliente');

    constructor(private MiAuth: AngularFireAuth,
        public afDB: AngularFireDatabase, ) {
    }

    public guardar(model) {
        return this.serviceRef.push(model);
    }

    public obtenerLista() {
        return this.serviceRef;
    }

}