import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AltaMesaPage } from '../alta-mesa/alta-mesa';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html'
})
export class MesasPage {

  mesas : any;
  
  constructor(public navCtrl: NavController,
              private database: DatabaseService) {
    
    this.database.db.list<any>('mesas/').valueChanges()
      .subscribe(snapshots => {
          this.mesas = snapshots;  
      });     

  }

  irA(donde:string){
    switch(donde){
      case 'Nueva':
        this.navCtrl.push(AltaMesaPage);
        break;
    }
  }
}