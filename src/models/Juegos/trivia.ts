export class Trivia {

  arrayOrdenado: Array<any>;
  preguntaSecreta: number;
  palabraAMostrar:Array<any>;
  palabraResultado: string;
  display: boolean = false;
  gano : boolean;

  constructor() {
    this.arrayOrdenado = new Array<any>();
    this.arrayOrdenado.push({'pregunta':'¿Quién escribió el Martín Fierro?', respuestas:[
        { description: "José Fernández", correcta: false},
        { description: "Jose Hernández", correcta: true},
        { description: "José Echeverría", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cómo se llama la novela que hizo famoso a J.R.Tolkien?', respuestas:[
        { description: "El señor de las moscas", correcta: false},
        { description: "El señor del futuro", correcta: false},
        { description: "El señor de los anillos", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cómo se llama el primer álbum solista de Gustavo Cerati?', respuestas:[
        { description: "Amor amarillo", correcta: true},
        { description: "El rayo verde", correcta: false},
        { description: "Azul profundo", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Quién era el cantante de LED ZEPPELIN?', respuestas:[
        { description: "Robert Palmer", correcta: false},
        { description: "Robert Plant", correcta: true},
        { description: "John Anderson", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿En qué deporte se corre el tour de france?', respuestas:[
        { description: "Automovilismo", correcta: false},
        { description: "Motociclismo", correcta: false},
        { description: "Ciclismo", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿De qué nacionalidad es el relator deportivo Victor Hugo Morales?', respuestas:[
        { description: "Argentino", correcta: false},
        { description: "Uruguayo", correcta: true},
        { description: "Colombiano", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cuántos jugadores hay en un equipo de cricket?', respuestas:[
        { description: "7", correcta: false},
        { description: "9", correcta: false},
        { description: "11", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Qué edad tenía Gabriela Sabatini cuando ganó el sudamericano infantil de tenis?', respuestas:[
        { description: "8", correcta: false},
        { description: "10", correcta: false},
        { description: "12", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'Edipo Rey,¿De dónde era Rey?', respuestas:[
        { description: "Esparta", correcta: false},
        { description: "Troya", correcta: false},
        { description: "Tebas", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cuántos viajes realizó Cristobal Colón a América?', respuestas:[
        { description: "Uno", correcta: false},
        { description: "Cuatro", correcta: true},
        { description: "Dos", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿El himno de qué país dice "Se remueven del Inca las tumbas y en sus huesos revive el ardor"?', respuestas:[
        { description: "Perú", correcta: false},
        { description: "Bolivia", correcta: false},
        { description: "Agentina", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Qué profesión tenía Mahatma Gandhi?', respuestas:[
        { description: "Abogado", correcta: true},
        { description: "Médico", correcta: false},
        { description: "Antropologo", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cómo se llamó el primer periódico de humor Argentino?', respuestas:[
        { description: "El Tábano", correcta: false},
        { description: "El Mosquito", correcta: true},
        { description: "El Abejorro", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cuál es la mayor ciudad de América con mayor población?', respuestas:[
        { description: "Bogotá", correcta: false},
        { description: "Santiago de Chile", correcta: false},
        { description: "San Pablo", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Qué marcha indica la letra N en un auto con caja automática?', respuestas:[
        { description: "Neutro", correcta: true},
        { description: "Primera", correcta: false},
        { description: "Quinta", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cuál es el pájaro más numeroso del mundo?', respuestas:[
        { description: "El gorrión", correcta: true},
        { description: "El canario", correcta: false},
        { description: "La paloma", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cuál es la raza de perros más chica?', respuestas:[
        { description: "Pinscher enano", correcta: false},
        { description: "Chihuahua", correcta: true},
        { description: "Pekines", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿Cómo se llama el brujo de los pitufos?', respuestas:[
        { description: "Asmal", correcta: false},
        { description: "Asrael", correcta: false},
        { description: "Gargamel", correcta: true}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿En qué barrio porteño se inspiró Quino para el barrio de Mafalda?', respuestas:[
        { description: "San Telmo", correcta: true},
        { description: "Palermo", correcta: false},
        { description: "Constitución", correcta: false}
      ]});
    this.arrayOrdenado.push({'pregunta':'¿El apellido de Pedro es "Picapiedra", y el de Pablo?', respuestas:[
        { description: "Granito", correcta: false},
        { description: "Garrote", correcta: false},
        { description: "Marmol", correcta: true}
      ]});

  }

  generarPregunta(){
    this.preguntaSecreta = Math.floor(Math.random()*20);
  }



}

