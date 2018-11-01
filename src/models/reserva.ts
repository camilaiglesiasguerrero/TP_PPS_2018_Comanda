export class Reserva {

    key: string;
    idPedido: number;
    dniCliente: string;
    idMesa: number;
    estado: string;

    constructor(key?,idPedido?,dniCliente?,idMesa?, estado?){
        this.key = key;
        this.idPedido = idPedido;
        this.dniCliente = dniCliente;
        this.idMesa = idMesa;
        this.estado = estado;
    }

}