export class Mesa {
    
    key:string;
    id:number;
    comensales: string;
    tipo: string;
    foto:string;
    estado:string;

    constructor(id?,comensales?, tipo?, foto?, estado?){
        this.id = id;
        this.comensales = comensales;
        this.tipo = tipo;
        this.foto = foto;
        this.estado = estado;
    }
}