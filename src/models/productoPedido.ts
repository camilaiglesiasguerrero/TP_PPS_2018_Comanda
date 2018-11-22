export class ProductoPedido {
    
    idProducto:string;
    cantidad:number;
    tipo:string;
    estado:string;
    nombre:string;
    precio:number;
    tiempoElaboracion:string;
    entrega:any;

    constructor(idProducto?,cantidad?,tipo?,estado?,nombre?,precio?, tiempo?,entrega?){
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.estado = estado;
        this.nombre = nombre;
        this.precio = precio;
        this.tiempoElaboracion = tiempo;
        this.entrega = entrega;
        
    }
}
