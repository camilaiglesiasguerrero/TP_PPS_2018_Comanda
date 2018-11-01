export class Juego {
    nombreJuego:string;
    cliente:string;
    fecha:string;
    gano:boolean;
    key:string;

    constructor(nombreJuego?,cliente?,gano?,key?) {
        this.nombreJuego = nombreJuego;
        this.cliente = cliente;
        this.gano = gano;      
        this.key = key;    
        this.fecha = this.obtenerFecha();
    }

    public obtenerFecha(){
        var hoy = new Date();
        return this.addZero(hoy.getDate()) + '/' + this.addZero(hoy.getMonth()+1) + '/' + hoy.getFullYear();
    }

    private addZero(i) {
        return i < 10 ? i = '0' + i : i;
    }
}