import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PrecioPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'precio',
})
export class PrecioPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    value = value.toString();
    if(!value.includes('.') && !value.includes(','))
      return '$' + value + ',00.-'
    else if(value.includes('.')){
      let aux = value.split('.');
      aux[1] = aux[1].substr(0,2);
      return '$' + aux[0] + ',' + this.fillData(aux[1]) + '.-';
    }
    else{
      let aux = value.split(',');
      aux[1] = aux[1].substr(0,2);
      return '$' + aux[0] + ',' + this.fillData(aux[1]) + '.-';
    }
  }


  fillData(valor){
    if(valor.length != 2)
      return valor + '0';
    else
      return valor;
  }
}
