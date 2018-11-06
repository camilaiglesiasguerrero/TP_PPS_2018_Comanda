export class Usuario {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    cuil:number;
    mail:string;
    foto:string;
    rol:string;

    constructor(nombre, apellido, dni, cuil, foto, mail, rol){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.foto = foto;
        this.mail = mail;
        this.rol = rol;
    }

}