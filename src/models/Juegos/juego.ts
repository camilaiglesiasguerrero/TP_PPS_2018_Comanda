export class Juego {

    nombreJuego:string;
    cliente:string;
    fecha:string;
    gano:boolean;
    key:string;

    

    constructor(nombreJuego?,cliente?,gano?,key?, fecha?) {
        this.nombreJuego = nombreJuego;
        this.cliente = cliente;
        this.gano = gano;      
        this.key = key;
        this.fecha = fecha;

    }

}
