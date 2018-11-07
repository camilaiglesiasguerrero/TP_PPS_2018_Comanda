export class Cliente {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    mail:string;
    foto:string;
    rol:string = "cliente";
    anonimo:boolean;

    constructor(nombre, apellido, dni, foto, anonimo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
        this.anonimo = anonimo;
    }

}