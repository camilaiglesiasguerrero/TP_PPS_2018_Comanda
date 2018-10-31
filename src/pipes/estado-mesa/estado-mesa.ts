import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the EstadoMesaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'estadoMesa',
})
export class EstadoMesaPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if(value === 'Deshabilitada')
      return value
    else
      return 'Habilitada';
  }
}
