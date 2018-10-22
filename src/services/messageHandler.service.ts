import { Injectable } from "@angular/core";
import { ToastController, AlertController } from 'ionic-angular';
@Injectable()
export class MessageHandler{

    static knownErrors:any = [
        {
            code:'auth/email-already-in-use',
            message:"El email ya existe"        
        },
        {
            code:'auth/user-not-found',
            message:"El email no se encuentra registrado"        
        },
        {
            code:'auth/wrong-password',
            message:"Contraseña Incorrecta"        
        },
        {
            code: "auth/network-request-failed", 
            message: "No hay conexión a internet"
        },
        {
            code: "auth/invalid-email", 
            message: "Email inválido"
        },
    ];

    constructor(public alertCtrl: ToastController,
        private alert: AlertController){
    }

    private getErrorMessage(error){
        var mensaje = "Error desconocido";
        for(var i=0; i< MessageHandler.knownErrors.length; i++){
           if(error.code == MessageHandler.knownErrors[i].code){
                mensaje = MessageHandler.knownErrors[i].message;
                break;
           }     
        }
        return mensaje;
    }

    public mostrarError(error, title?, message?){
        console.log("ocurrio un error", error);
        var errorMessage = this.getErrorMessage(error);
        let alert = this.alertCtrl.create({
            message: message ? message + errorMessage : errorMessage,
            duration: 4000,
            position: "top",
            cssClass: 'error-alert'
        });
        alert.present();
    }
    
    public mostrarErrorLiteral(error, title?) {
        let alert = this.alertCtrl.create({
            message: error,
            duration: 4000,
            position: "top",
            cssClass: 'error-alert'
        });
        alert.present();
    }

    public mostrarMensaje(mesagge){
        let alert = this.alertCtrl.create({
            message: mesagge,
            duration: 4000,
            position: "top",
            cssClass: 'success-alert',
        });
        alert.present();
    }

    public mostrarMensajeConfimación(mensaje, title?) {
        let alert = this.alert.create({
            title: title,
            message: mensaje,
            cssClass: 'confirm-alert',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        alert.dismiss(false);
                        return false;
                    }
                },
                {
                    text: 'Si',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        }
        );
        return alert;
    }
    
}
