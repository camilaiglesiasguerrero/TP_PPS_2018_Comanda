import { Injectable } from '@angular/core';

@Injectable()
export class ParserTypesService {

  parseDateToStringDate(date:Date){
    var dia = date.getDate();
    var mes = date.getMonth();
    var anio = date.getFullYear();
    var stringFecha = dia + '/' + mes + '/' + anio;
    return stringFecha;
  }

  parseDateTimeToStringDateTime(date:Date){
    var dia = date.getDate();
    var mes = date.getMonth();
    var anio = date.getFullYear();
    var hora = date.getHours();
    var minutos = date.getMinutes();
    var stringFecha = dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos;
    return stringFecha;

  }

}
