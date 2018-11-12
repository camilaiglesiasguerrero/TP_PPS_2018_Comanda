import { Producto } from './producto';
import { ProductoPedido } from './productoPedido';

export class Pedido {
    
    key:string
    estado:string;
    productoPedido: Array<ProductoPedido>;
    isDelivery:boolean

    constructor(key?,productos?, estado?, isDelivery?){
        this.key = key;
        this.productoPedido = productos;
        this.estado = estado;
        this.isDelivery = isDelivery;
    }


}
