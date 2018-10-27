import { Injectable } from "@angular/core";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MessageHandler } from "./messageHandler.service";
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';

@Injectable()
export class QrService{

    createdCode = null;
    scannedCode : string;
    
    constructor(private barcodeScanner: BarcodeScanner,
                private messageHandler: MessageHandler,
                private file:File){
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
    

    //no funciona porque el document.getElemtnById devuelve null, acá y haciendo la funcion en la page q corresponda
    descargarQRPDF(nombre: string){ 
      const div = document.getElementById("Html2Pdf");
      const options = {background:"white",height : div.clientHeight , width : div.clientWidth  };
      html2canvas(div,options).then((canvas)=>{
        //Initialize JSPDF
        var doc = new jsPDF("p","mm","a4");
        //Converting canvas to Image
        let imgData = canvas.toDataURL("image/PNG");
        //Add image Canvas to PDF
        doc.addImage(imgData, 'PNG', 20,20 );
        
        let pdfOutput = doc.output();
        // using ArrayBuffer will allow you to put image inside PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (var i = 0; i < pdfOutput.length; i++) {
            array[i] = pdfOutput.charCodeAt(i);
        }

        //This is where the PDF file will stored , you can change it as you like
        // for more information please visit https://ionicframework.com/docs/native/file/
        const directory = this.file.externalApplicationStorageDirectory ;
  
        //Name of pdf
        nombre = nombre.trim();
        const fileName = nombre + ".pdf";
        
        //Writing File to Device
        this.file.writeFile(directory,fileName,buffer)
        .then((success)=> console.log("File created Succesfully" + JSON.stringify(success)))
        .catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));
    
    
      });
  }

}

