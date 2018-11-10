import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ParamsService } from '../../services/params.service';

/**
 * Generated class for the IniciarsesionmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iniciarsesionmenu',
  templateUrl: 'iniciarsesionmenu.html',
})
export class IniciarsesionmenuPage {

  user: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public viewCtrl: ViewController,public params:ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IniciarsesionmenuPage');
  }

  seleccionar(){

    switch (this.user) {
        case "admin": {
          this.params.email = "administrador@gmail.com";
          break;
        }
        case "bartender": {
          this.params.email = "bartender@gmail.com";
          break;
        }
        case "cocinero": {
          this.params.email = "cocinero@gmail.com";
          break;
        }
        case "metre": {
          this.params.email = "metre@gmail.com";
          break;
        }
        case "mozo": {
          this.params.email = "mozo@gmail.com";
          break;
        }
        case "cliente1": {
          this.params.email = "cliente1@gmail.com";
          break;
        }
        case "cliente2": {
          this.params.email = "cliente2@gmail.com";
          break;
        }
        case "dueño": {
          this.params.email = "duenio@gmail.com";
          break;
        }
        case "supervisor": {
          this.params.email = "supervisor@gmail.com";
          break;
      }
      case "delivery": {
        this.params.email = "delivery@gmail.com";
        break;
      }
    }
    this.params.pass = "123456";
    this.viewCtrl.dismiss(this.params);
  }


}
