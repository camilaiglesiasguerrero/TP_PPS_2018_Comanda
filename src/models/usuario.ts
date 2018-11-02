export class Usuario {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    cuil:number;
    mail:string;
    foto:string;
    rol:string;

    constructor(nombre:string, apellido:string, dni:number, cuil:number, foto:string, rol:string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.foto = foto;
        this.rol = rol;
    }

}