export class Mesa {
    
    key:string;
    id:number;
    idString: string;
    comensales: string;
    tipo: string;
    foto:string;
    estado:string;

    constructor(id?,comensales?, tipo?, foto?, estado?){
        this.id = id;
        id != undefined ? this.idString = id.toString() : null;
        this.comensales = comensales;
        this.tipo = tipo;
        this.foto = foto;
        this.estado = estado;
    }
}