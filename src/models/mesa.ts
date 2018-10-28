export class Mesa {

    uid: number;
    comensales: string;
    tipo: string;
    foto:string;
    estado:string;

    constructor(uid?,comensales?, tipo?, foto?, estado?){
        this.uid = uid;
        this.comensales = comensales;
        this.tipo = tipo;
        this.foto = foto;
        this.estado = estado;
    }

}