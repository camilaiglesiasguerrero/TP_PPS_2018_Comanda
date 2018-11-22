import { Injectable } from '@angular/core';
declare var moment;

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

  compararFechaIgualAHoy(fecha:string){
    var retorno = false;
    var hoy = new Date();
    var fechaAux = this.parseStringDateToDateTime(fecha);
    if(hoy.getFullYear() == fechaAux.getFullYear()){
      if(hoy.getMonth() == fechaAux.getMonth()){
        if(hoy.getDate() == fechaAux.getDate()){
          retorno = true;
        }
      }
    }
    return retorno;
  }

  hayDiferenciaDe40Minutos(fecha1:string, fecha2:string){
    var fecha1Date = this.parseStringDateToDateTime(fecha1);
    var fecha2Date = this.parseStringDateToDateTime(fecha2)
    if(fecha1Date.getFullYear() == fecha2Date.getFullYear()){
      if(fecha1Date.getMonth() == fecha2Date.getMonth()){
        if(fecha1Date.getDate() == fecha2Date.getDate()){
          var fecha1Aux = moment(fecha1Date);
          var fecha2Aux = moment(fecha2Date);
          var diferencia =  fecha1Aux.diff(fecha2Aux, 'minutes');
          if(diferencia <= 40){
            return false;
          }
        }
      }
    }
    return true;
  }

  compararFechaMayorAHoy(fecha:string){
    var hoy = new Date();
    hoy.setHours(0,0,1);
    var parserHoy = Date.parse(hoy.toString());
    var parserReserva = Date.parse(fecha);
    return parserReserva > parserHoy;
  }

}
