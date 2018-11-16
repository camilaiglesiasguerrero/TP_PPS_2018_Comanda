import { Injectable } from '@angular/core';
import { Firebase } from "@ionic-native/firebase";
import { Platform } from "ionic-angular";
import { AngularFirestore } from 'angularfire2/firestore';
import {diccionario} from "../models/diccionario";


@Injectable()
export class FcmProvider {

  constructor(public firebaseNative: Firebase,
              public afs: AngularFirestore,
              private platform: Platform
  ) {
  }

  async getToken(userId, rol){
    let token;
    if(this.platform.is('android')){
      alert("is android");
      token = await this.firebaseNative.getToken();
      alert("token " + token);
    }
    if(!this.platform.is('cordova')){

    }
    return this.saveTokenToFireStore(token, userId, rol);
  }


  saveTokenToFireStore(token, userId, rol){
    if(!token) return;
    const devicesRef = this.afs.collection(diccionario.firestore.devices);
    const docData = {
      token,
      userId: userId,
      rol: rol
    };

    return devicesRef.doc(token).set(docData).then(response =>{
      alert("volvio del save divice");
    })


  }

  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen();
  }


}
