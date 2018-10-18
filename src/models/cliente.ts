export class Cliente {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    mail:string;
    foto:string;
    rol:string = "cliente";

    constructor(nombre, apellido, dni, foto){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
    }

}