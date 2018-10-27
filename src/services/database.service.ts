import { Injectable } from "@angular/core";
import { MessageHandler } from "./messageHandler.service";
import { ParamsService } from "./params.service";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class DatabaseService{
 
    databaseFirebase: string;
    jsonPackData: any;

    constructor(private messageHandler: MessageHandler,
        public params: ParamsService,
        public db:AngularFireDatabase){
    }

    SubirDataBase(ruta:string){
        return this.db.database.ref().child(ruta)
            .push(this.jsonPackData);
    }
}