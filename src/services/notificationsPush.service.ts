import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { diccionario } from "../models/diccionario";


@Injectable()
export class NotificationsPushService {

  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  private notificationsCollections: AngularFirestoreCollection<any>;
  notifications: Observable<any[]>;
  notification = {
    title: "",
    body: "",
    devices: []
  };
  dispositivos = [];

  constructor( private afs: AngularFirestore){
    debugger;
    this.itemsCollection = afs.collection<any>(diccionario.firestore.devices);
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe(snapshots =>{
      this.dispositivos = [];
      this.notification.devices = [];
      for(var i=0; i< snapshots.length; i++){
        this.dispositivos.push({token: snapshots[i].token, rol: snapshots[i].rol, userId: snapshots[i].userId});
      }
    })
  }


  solicitudDeMesa(clienteName){
    this.notification.title = "Cliente en lista de espera";
    this.notification.body = "El cliente " + clienteName + " solicito una mesa";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'mozo' || this.dispositivos[i].rol == 'metre' || this.dispositivos[i].rol == 'supervisor'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  altaReservaAgendada(clienteName){
    this.notification.title = "Pedido de reserva";
    this.notification.body = "El cliente " + clienteName + " hizo una reserva";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'supervisor'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  asignacionMesaReservaAgendad(clienteId){
    this.notification.title = "Confirmación de reserva";
    this.notification.body = "Se confirmó tu reserva. Ya tenés una mesa asignada.";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].userId == clienteId){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  private guardarNotificacion(){
    this.notificationsCollections = this.afs.collection<any>(diccionario.firestore.notifications);
    var id = this.afs.createId();
    return this.notificationsCollections.doc(id).set(this.notification).then(response =>{
      alert("se mando la notificacion");
    })
  }

  notificarPedidoCocinero(){
    this.notification.title = "Pedido";
    this.notification.body = "Hay pedidos pendientes de armar.";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'cocinero'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  notificarPedidoBartender(){
    this.notification.title = "Pedido";
    this.notification.body = "Hay pedidos pendientes de armar.";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'bartender'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  notificarPedidoMozo(){
    this.notification.title = "Pedido";
    this.notification.body = "Hay pedidos pendientes de aprobar.";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'mozo'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }

  notificarMozoPedidoOk(){
    this.notification.title = "Pedido";
    this.notification.body = "Hay pedidos pendientes de entrega.";
    this.notification.devices = [];
    if(this.dispositivos.length){
      for(var i=0; i < this.dispositivos.length; i++){
        if(this.dispositivos[i].rol == 'mozo'){
          this.notification.devices.push(this.dispositivos[i].token)
        }
      }
    }
    if(this.notification.devices.length){
      this.guardarNotificacion();
    }
  }
}
