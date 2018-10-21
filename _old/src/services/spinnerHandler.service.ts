import { Injectable } from "@angular/core";
import { LoadingController } from 'ionic-angular';

@Injectable()
export class SpinnerHandler{

    constructor(public loadingCtrl: LoadingController){
    }

    getAllPageSpinner(){
        let loader = this.loadingCtrl.create({
            spinner:'circles',
            showBackdrop:false,
            cssClass: 'small-spinner'
          });
        return loader;
    }

}