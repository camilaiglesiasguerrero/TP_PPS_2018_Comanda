import { DateTime } from "ionic-angular";

export class Producto {

    uid: string;
    nombre:string;
    descripcion:string;
    tiempoElaboracion:DateTime;
    precio:number;
    cantidad:number;
    foto1:string;
    foto2:string;
    foto3:string;
    esComida: boolean;

    constructor(nombre, descripcion, tiempoElaboracion, precio, cantidad, foto1, foto2, foto3, esComida){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tiempoElaboracion = tiempoElaboracion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.foto1 = foto1;
        this.foto2 = foto2;
        this.foto3= foto3;
        this.esComida = esComida;
    }

}