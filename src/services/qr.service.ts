import { Injectable } from "@angular/core";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from "./messageHandler.service";

@Injectable()
export class QrService{

    createdCode = null;
    scannedCode : string;
    
    constructor(private barcodeScanner: BarcodeScanner,
                private messageHandler: MessageHandler){
    }

    createCode(qrData : any) {
       return this.createdCode = qrData;
    }
            // implementación en html 
            // <ion-card *ngIf="createdCode">
            //   <ngx-qrcode [qrc-value]="createdCode"></ngx-qrcode>
            //   <ion-card-content>
            //     <p>Value: {{ createdCode }}</p>
            //   </ion-card-content>
            // </ion-card>
     
    scanCode() {
      this.barcodeScanner.scan().then(barcodeData => {
        this.scannedCode = barcodeData.text;
      }, (err) => {
          //console.log('Error: ', err);
          this.messageHandler.mostrarError(err, 'Ocurrió un error');
      });
    }
}

