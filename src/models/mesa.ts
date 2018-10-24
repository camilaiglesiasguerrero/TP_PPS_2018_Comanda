export class Mesa {

    uid: string;
    comensales: number;
    tipo: string;
    foto:string;
    estado:boolean;

    constructor(uid,comensales, tipo, foto, estado){
        this.uid = uid;
        this.comensales = comensales;
        this.tipo = tipo;
        this.foto = foto;
        this.estado = estado;
    }

}