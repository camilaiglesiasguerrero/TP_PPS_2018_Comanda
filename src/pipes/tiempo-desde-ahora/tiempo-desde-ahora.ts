import { Pipe, PipeTransform } from '@angular/core';
/**
 * Generated class for the TiempoDesdeAhoraPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'tiempoDesdeAhora',
})
export class TiempoDesdeAhoraPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  

  transform(value: any, ...args) {
    let dif = value - Date.now();
    console.log(value);
    if(value == 0){
      return 'Ya está listo';
    }
    else if(isNaN(dif) || dif < 0)
      return 'Ya debería estar listo';
    else{
      let difMin = Math.round(dif/60000);
      return 'Faltan ' + difMin + ' minutos';
    }
  }
}
