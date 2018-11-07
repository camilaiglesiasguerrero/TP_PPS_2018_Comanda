import { Producto } from './producto';

export class Pedido {
    
    key:string;
    id:number;
    productos: Array<Producto>;
    estado:string;

    constructor(id?,productos?, estado?){
        this.id = id;
        this.productos = productos;
        this.estado = estado;
    }
}