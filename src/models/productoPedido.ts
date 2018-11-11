export class ProductoPedido {
    
    idProducto:string;
    cantidad:number;
    tipo:string;
    estado:string;

    nombre:string;
    precio:number;

    constructor(idProducto?,cantidad?,tipo?,estado?,nombre?,precio?){
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.estado = estado;
        this.nombre = nombre;
        this.precio = precio;

    }
}