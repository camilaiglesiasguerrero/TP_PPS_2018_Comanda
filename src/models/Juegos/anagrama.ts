export class Anagrama {
    arrayOrdenado: Array<any>;
    palabraSecreta: number;
    palabraAMostrar:Array<any>;
    palabraResultado: string;
    display: boolean = false;
    gano : boolean;

    constructor() {
        this.arrayOrdenado = new Array<any>();
        this.arrayOrdenado.push({'palabra':'ESCEPTICO','letras':['E','S','C','E','P','T','I','C','O']});
        this.arrayOrdenado.push({'palabra':'DRAMATURGIA','letras':['D','R','A','M','A','T','U','R','G','I','A']});
        this.arrayOrdenado.push({'palabra':'BICICLETA','letras':['B','I','C','I','C','L','E','T','A']});
        this.arrayOrdenado.push({'palabra':'DETONACION','letras':['D','E','T','O','N','A','C','I','O','N']});
        this.arrayOrdenado.push({'palabra':'PROGRAMADOR','letras':['P','R','O','G','R','A','M','A','D','O','R']});
        this.arrayOrdenado.push({'palabra':'DISEÑO','letras':['D','I','S','E','Ñ','O']});
        this.arrayOrdenado.push({'palabra':'LIBERTINAJE','letras':['L','I','B','E','R','T','I','N','A','J','E']});
        this.arrayOrdenado.push({'palabra':'DOMADOR','letras':['D','O','M','A','D','O','R']});
        this.arrayOrdenado.push({'palabra':'PEREGRINO','letras':['P','E','R','E','G','R','I','N','O']});
        this.arrayOrdenado.push({'palabra':'ESPIONAJE','letras':['E','S','P','I','O','N','A','J','E']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
        this.arrayOrdenado.push({'palabra':'COMIDA','letras':['C','O','M','I','D','A']});
      }

    Verificar() {
        if(this.arrayOrdenado[this.palabraSecreta].palabra == this.palabraResultado.toUpperCase())
           this.gano = true;
        else 
            this.gano = false;

        return this.gano;
    }

    GenerarPalabra(){    
        this.palabraSecreta = Math.floor(Math.random()*20);
        this.palabraAMostrar = this.Mezclar(this.arrayOrdenado,this.palabraSecreta);
    }
    
    Mezclar(array,num){
        let miarray: Array<string>;
        miarray = new Array<string>();
        miarray = array[num].letras;

        var currentIndex = miarray.length, temporaryValue, randomIndex;
        
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = miarray[currentIndex];
          miarray[currentIndex] = miarray[randomIndex];
          miarray[randomIndex] = temporaryValue;
        }
        
        return miarray;
    }

}
