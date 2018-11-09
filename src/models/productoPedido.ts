export class ProductoPedido {
    
    idProducto:string;
    cantidad:number;
    tipo:string;

    constructor(idProducto?,cantidad?,tipo?){
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
    }
}