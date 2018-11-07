export class Anagrama {
    arrayOrdenado: Array<any>;
    palabraSecreta: number;
    palabraAMostrar:Array<any>;
    palabraResultado: string;
    display: boolean = false;
    gano : boolean;

    constructor() {
        this.arrayOrdenado = new Array<any>();
        this.arrayOrdenado.push({'palabra':'CERVEZA','letras':['C','E','R','V','E','Z','A']});
        this.arrayOrdenado.push({'palabra':'GRANADINA','letras':['G','R','A','N','A','D','I','N','A']});
        this.arrayOrdenado.push({'palabra':'GASEOSA','letras':['G','A','S','E','O','S','A']});
        this.arrayOrdenado.push({'palabra':'CAIPIRINHA','letras':['C','A','I','P','I','R','I','N','H','A']});
        this.arrayOrdenado.push({'palabra':'WHISKY','letras':['W','H','I','S','K','Y']});
        this.arrayOrdenado.push({'palabra':'CLERICO','letras':['C','L','E','R','I','C','O']});
        this.arrayOrdenado.push({'palabra':'DAIQUIRI','letras':['D','A','I','Q','U','I','R','I']});
        this.arrayOrdenado.push({'palabra':'MARGARITA','letras':['M','A','R','G','A','R','I','T','A']});
        this.arrayOrdenado.push({'palabra':'COCTELERA','letras':['C','O','C','T','E','L','E','R','A']});
        this.arrayOrdenado.push({'palabra':'HIELO','letras':['H','I','E','L','O']});
        this.arrayOrdenado.push({'palabra':'BARTENDER','letras':['B','A','R','T','E','N','D','E','R']});
        this.arrayOrdenado.push({'palabra':'BRINDIS','letras':['B','R','I','N','D','I','S']});
        this.arrayOrdenado.push({'palabra':'LICOR','letras':['L','I','C','O','R']});
        this.arrayOrdenado.push({'palabra':'MARTINI','letras':['M','A','R','T','I','N','I']});
        this.arrayOrdenado.push({'palabra':'COPAS','letras':['C','O','P','A','S']});
        this.arrayOrdenado.push({'palabra':'TRAGO','letras':['T','R','A','G','O']});
        this.arrayOrdenado.push({'palabra':'DESTAPADOR','letras':['D','E','S','T','A','P','A','D','O','R']});
        this.arrayOrdenado.push({'palabra':'BOTELLA','letras':['B','O','T','E','L','L','A']});
        this.arrayOrdenado.push({'palabra':'CORCHO','letras':['C','O','R','C','H','O']});
        this.arrayOrdenado.push({'palabra':'POSAVASOS','letras':['P','O','S','A','V','A','S','O','S']});
        this.arrayOrdenado.push({'palabra':'BARRA','letras':['B','A','R','R','A']});
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
