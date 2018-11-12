export class ProductoPedido {
    
    idProducto:string;
    cantidad:number;
    tipo:string;
    estado:string;

    constructor(idProducto?,cantidad?,tipo?,estado?){
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.estado = estado;
    }
}