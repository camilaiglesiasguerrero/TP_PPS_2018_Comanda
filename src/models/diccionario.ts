//para utilizarlo agregar este import donde se tenga que usar: import {diccionario} from "../../models/diccionario";
export const diccionario = {
  apis:{
    reservas: "reservas/",
    productos: "productos/",
    productos_platos: "productos/platos/",
    productos_bebidas: "productos/bebidas/",
    mesas: "mesas/",
    juegos: "juegos/",
    pedidos: "pedidos/",
    lista_espera: "lista-espera/",
    reservas_agendadas: "reservas-agendadas/",
    encuesta_cliente: "encuesta-cliente/",
    encuesta_empleado: "encuesta-empleado/",
    cuentas: "cuentas/",
    delivery: "delivery/"


  },
  estados_mesas:{
    libre: "Libre",
    reservada: "Reservada",
    ocupada: "Ocupada"
  },
  estados_pedidos:{
    solicitado: "Solicitado",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregado: "Entregado",
    cuenta: "Cuenta",
    pagado: "Pagado"
  },
  estados_productos:{
    en_preparacion: false,
    listo: true
  },
  estados_reservas_agendadas:{
    sin_mesa: "sin_mesa",
    con_mesa: "con_mesa",
    cancelada: "cancelada"
  },
  estados_platos_bebidas:{
    habilitado: "Habilitado",
    deshabilitado: "Deshabilitado",
    sin_stock: "Sin stock"
  },
  estados_reservas:{
    en_curso: "En curso",
    finalizada: "Finalizada"
  },
  qr:{
    ingreso_local: "IngresoLocal"
  },
  errores:{
    QR_invalido: "Código QR inválido",
    sin_reserva: "No existe reserva",
    sin_pedido: "No existe pedido"
  },
  direccion_local: {
    direccion: "Moreno 850, C1091AAR CABA, Argentina",
    lat: -34.6119042,
    long: -58.37844980000001
  },
  juegos:{
    trivia: 'Trivia',
    adivinar: 'Adivinar',
    anagrama: 'Anagrama'
  }
  
};
