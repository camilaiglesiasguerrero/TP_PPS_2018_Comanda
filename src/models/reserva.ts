export class Reserva {

    key: string;
    idPedido: number;
    cliente: string;
    idMesa: number;
    estado: string;
    fecha:string;

    constructor(key?,idPedido?,cliente?,idMesa?, estado?,fecha?){
        this.key = key;
        this.idPedido = idPedido;
        this.cliente = cliente;
        this.idMesa = idMesa;
        this.estado = estado;
        this.fecha = fecha;
    }

}
