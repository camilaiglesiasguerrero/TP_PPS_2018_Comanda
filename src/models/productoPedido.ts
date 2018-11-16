export class ProductoPedido {
    
    idProducto:string;
    cantidad:number;
    tipo:string;
    estado:string;
    nombre:string;
    precio:number;
    tiempoElaboracion:string;


    constructor(idProducto?,cantidad?,tipo?,estado?,nombre?,precio?, tiempo?){
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.estado = estado;
        this.nombre = nombre;
        this.precio = precio;
        this.tiempoElaboracion = tiempo;
    }
}
