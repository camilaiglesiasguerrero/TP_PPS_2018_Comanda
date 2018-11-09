import { Producto } from './producto';
import { ProductoPedido } from './productoPedido';

export class Pedido {
    
    key:string
    estado:string;
    productoPedido: Array<ProductoPedido>;

    constructor(key?,productos?, estado?){
        this.key = key;
        this.productoPedido = productos;
        this.estado = estado;
    }


}