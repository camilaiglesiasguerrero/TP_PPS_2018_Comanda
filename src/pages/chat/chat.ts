import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ParamsService } from '../../services/params.service';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';
import {ParserTypesService} from "../../services/parserTypesService";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  chat:any = {'conversaciones': [] };
  usuario:string;
  mensaje:string;
  idDelivery:string;
  userActual:string;
  fecha:string;
  auxUser:any;
  watcherChat:any;
  chatKey:any;

  constructor(
    public navCtrl: NavController,
    public navPav: NavParams,
    public navParams: NavParams,
    public database: DatabaseService,
    public params: ParamsService,
    private parser: ParserTypesService){
    this.userActual = this.params.user.nombre;
    this.idDelivery=this.navParams.get('idDelivery');
    this.watcherChat = this.database.db.list<any>(diccionario.apis.chats, ref => ref.orderByChild('idDelivery').equalTo(this.idDelivery)).valueChanges()
      .subscribe(snp=>{
        if(snp.length){
          this.chat = snp[0];
        }
      });
  }

  Push() {
    var chat ={
      usuario:this.params.user.nombre,
      mensaje:this.mensaje,
      fecha: this.parser.parseDateTimeToStringDateTime(new Date())
    };
    if(this.chat.conversaciones){
      this.chat['conversaciones'].push(chat);
    }else{
      this.chat['conversaciones'] = [];
      this.chat['conversaciones'].push(chat);
    }
    this.database.jsonPackData = this.chat;
    this.database.SubirDataBase(diccionario.apis.chats).then(r=>{
      var lala = r;
      this.mensaje="";
    });


  }

}
