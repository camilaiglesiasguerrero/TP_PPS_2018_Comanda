import { Pipe, PipeTransform } from '@angular/core';
import {diccionario} from "../../models/diccionario";

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
    if(value === diccionario.estados_mesas.deshabilitada)
      return value;
    else
      return diccionario.estados_mesas.habilitada;
  }
}
