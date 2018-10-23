import { Producto } from "./producto";

export class Pedido {

    uid: string;
    idCliente: string;
    productos: Array<Producto>;
    estado: string;

    constructor(uid,idCliente, productos, estado){
        this.uid = uid;
        this.idCliente = idCliente;
        this.productos = productos;
        this.estado = estado;
    }

}