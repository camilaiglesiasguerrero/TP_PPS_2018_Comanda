import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ParamsService } from '../../services/params.service';
import { DatabaseService } from '../../services/database.service';
import { diccionario } from '../../models/diccionario';
import { analyzeAndValidateNgModules } from '@angular/compiler';



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
  idCliente:string;
  idUser:string;
  userActual:string
  fecha:string;
  auxUser:any;

  constructor(
    public navCtrl: NavController,
    public navPav: NavParams, 
    public navParams: NavParams,
    public database: DatabaseService,
    public params: ParamsService){
      this.userActual == this.params.email;
      this.idCliente="";
      this.idUser="";
      this.chats = this.database.db.list<any>('chats-'+this.idCliente+'conversasiones').valueChanges();

      this.database.db.list<any>("usuarios/", ref => ref.orderByChild('uid').equalTo(this.idUser))
      .valueChanges()
      .subscribe(snapshots => {
        this.auxUser = snapshots;
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }
  


  horaNow(){
    var hoy = new Date();
    var fecha:string = hoy.getHours() + ':' + hoy.getMinutes() + ":" + hoy.getSeconds();
    return fecha;
  }

  Push()
  {
    this.database.db.list('chats-'+this.idCliente+'/conversaciones').push({
    usuario:this.auxUser.nombre,
    mensaje:this.mensaje,
    hora: this.horaNow()
  });
    this.mensaje="";
  }

}
