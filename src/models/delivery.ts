export class Delivery {

  key: string;
  idPedido: number;
  cliente: string;
  estado: string;
  direccion: string;
  lat:any;
  long:any;
  infoDireccion:string;
  fecha:string;



  constructor(key?,idPedido?,cliente?, estado?, direccion?, lat?, long?, infoDireccion?, fecha?){
    this.key = key;
    this.idPedido = idPedido;
    this.cliente = cliente;
    this.direccion = direccion;
    this.lat = lat;
    this.long = long;
    this.estado = estado;
    this.infoDireccion = infoDireccion;
    this.fecha = fecha;
  }

}
