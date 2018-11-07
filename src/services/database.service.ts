import { Injectable } from "@angular/core";
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class DatabaseService{
 
    jsonPackData: any;

    constructor(private messageHandler: MessageHandler,
        public params: ParamsService,
        public db:AngularFireDatabase){
    }

    ObtenerKey(ruta:string){
        return this.db.database.ref().child(ruta).push().key;
    }
        
    SubirDataBase(ruta:string){
        return this.db.database.ref().child(ruta + this.jsonPackData.key)
            .update(this.jsonPackData);
    }

}