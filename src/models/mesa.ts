export class Mesa {

    uid: string;
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

    armarJson(){
        
        return JSON.parse('{"uid":this.uid,"comensales":this.comensales,"tipo":this.tipo,"estado":this.estado}');           
    }
}