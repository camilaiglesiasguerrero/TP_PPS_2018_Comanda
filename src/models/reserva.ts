export class Reserva {

    key: string;
    idPedido: number;
    cliente: string;
    idMesa: number;
    estado: string;

    constructor(key?,idPedido?,cliente?,idMesa?, estado?){
        this.key = key;
        this.idPedido = idPedido;
        this.cliente = cliente;
        this.idMesa = idMesa;
        this.estado = estado;
    }

}