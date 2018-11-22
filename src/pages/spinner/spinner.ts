import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-spinner',
  templateUrl: 'spinner.html',
})

export class SpinnerPage {
//@Input('mostrarSpinner') mostrarSpinner:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpinnerPage');
  }

}
