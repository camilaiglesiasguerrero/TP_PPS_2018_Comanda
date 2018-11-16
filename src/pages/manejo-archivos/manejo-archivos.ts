import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { MessageHandler } from '../../services/messageHandler.service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ParserTypesService } from '../../services/parserTypesService';
 
/**
 * Generated class for the ManejoArchivosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manejo-archivos',
  templateUrl: 'manejo-archivos.html',
})
export class ManejoArchivosPage {

  csvData: any[] = [];
  headerRow: any[] = [];
  archivo:string = 'PedidoProveedores.csv';
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private http: Http, 
              private messageHandler: MessageHandler,
              private fileTransfer: FileTransfer, 
              private file: File,
              private ParserTypesS: ParserTypesService) {
    this.readCsvData();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ManejoArchivosPage');
  }
 
  private readCsvData() {
    this.http.get('assets/archivos/'+this.archivo)
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }
 
  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.headerRow = parsedData[0];
 
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
 
  

  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });
    //let csv = papa.unparse(this.csvData);
    // Dummy implementation for Desktop download purpose
    /*var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);*/

    var pathFile = this.file.externalRootDirectory + 'Download/';
      this.archivo = this.archivo.split('.')[0] + '_' + this.ParserTypesS.parseDateToStringDate(new Date()) + this.archivo.split('.')[1];
      const fileTransfer = this.fileTransfer.create();
      const imageLocation = `${this.file.applicationDirectory}www/assets/archivos/${this.archivo}`;

      fileTransfer.download(imageLocation, pathFile + this.archivo).then((entry) => {
        let ruta = entry.toNativeURL();
        this.messageHandler.mostrarMensaje('Archivo descargado en la carpeta Download.');
        //this.messageHandler.mostrarMensajeConfimación(`Fue descargado con éxito en ${entry.toNativeURL()}`);
      }, (error) => {
        this.messageHandler.mostrarErrorLiteral('Error: '+error.code);
        
      });

  }

  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }
 
}
