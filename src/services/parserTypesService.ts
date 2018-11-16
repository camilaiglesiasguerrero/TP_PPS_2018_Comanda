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
    var mes = date.getMonth() + 1;
    var anio = date.getFullYear();
    var hora = date.getHours();
    var minutos = date.getMinutes();
    var stringFecha = dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos;
    return stringFecha;
  }

  parseStringDateToDateTime(stringDate:string){
    var fecha = stringDate.split('/', stringDate.length)
    var dia = parseInt(fecha[0]);
    var mes = parseInt(fecha[1]);
    var aniooHora = fecha[2].split(' ', fecha[2].length);
    var anio = parseInt(aniooHora[0]);
    var horario = aniooHora[1].split(':', aniooHora[1].length);
    var hora = parseInt(horario[0]);
    var minutos = parseInt(horario[1]);
    var date = new Date();
    date.setDate(dia);
    date.setMonth(mes - 1);
    date.setFullYear(anio);
    date.setHours(hora, minutos);
    return date;
  }

  compararFechayHoraMayorAHoy(fecha:string){
    var hoy = new Date();
    hoy.setHours(0,0,0);
    //var parserHoy = Date.parse(hoy.toString());
    var parserReserva = this.parseStringDateToDateTime(fecha);
    return parserReserva > hoy;
  }

  compararFechaMayorAHoy(fecha:string){
    var hoy = new Date();
    hoy.setHours(0,0,1);
    var parserHoy = Date.parse(hoy.toString());
    var parserReserva = Date.parse(fecha);
    return parserReserva > parserHoy;
  }

}
