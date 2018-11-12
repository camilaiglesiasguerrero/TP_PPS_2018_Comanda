export class Producto {

    key: any;
    nombre:string;
    descripcion:string;
    tiempoElaboracion:number;
    precio:number;
    cantidad:number;
    foto1:string;
    foto2:string;
    foto3:string;
    tipo: string;

    constructor(key?,nombre?, descripcion?, tiempoElaboracion?, precio?, cantidad?, foto1?, foto2?, foto3?, tipo?){
        this.key = key;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tiempoElaboracion = tiempoElaboracion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.foto1 = foto1;
        this.foto2 = foto2;
        this.foto3= foto3;
        this.tipo = tipo;
    }
}