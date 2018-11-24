import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ParamsService } from '../../services/params.service';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';

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

  chats: Observable<any[]>;
  usuario:string;
  mensaje:string;
  idDelivery:string;
  userActual:string
  fecha:string;
  auxUser:any;

  constructor(
    public navCtrl: NavController,
    public navPav: NavParams, 
    public navParams: NavParams,
    public database: DatabaseService,
    public params: ParamsService){
      this.userActual == this.params.name;
      this.idDelivery=this.navParams.get('idDelivery');
      this.chats = this.database.db.list<any>(this.idDelivery.toString()+'/conversasiones').valueChanges();
    }

  horaNow(){
    var hoy = new Date();
    var fecha:string = hoy.getHours() + ':' + hoy.getMinutes() + ":" + hoy.getSeconds();
    return fecha;
  }

  Push()
  {
    this.database.db.list(this.idDelivery.toString()+'/conversaciones').push({
    usuario:this.params.name,
    mensaje:this.mensaje,
    hora: this.horaNow()
  });
    this.mensaje="";
  }

}
