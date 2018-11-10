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
    reservas_agendadas: "reservas-agendadas/"


  },
  estados_mesas:{
    libre: "Libre",
    reservada: "Reservada",
    ocupada: "Ocupada",
    deshabilitada: "Deshabilitada",
    habilitada: "Habilitada"
  },
  estados_pedidos:{
    solicitado: "Solicitado",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregado: "Entregado",
    cuenta: "Cuenta",
    pagado: "pagado"
  },
  estados_productos:{
    en_preparacion: "En preparación",
    listo: "Listo"
  },
  estados_reservas_agendadas:{
    sin_mesa: "sin_mesa",
    con_mesa: "con_mesa"
  },
  estados_platos_bebidas:{
    habilitado: "Habilitado",
    deshabilitado: "Deshabilitado",
    sin_stock: "Sin stock"
  },
  qr:{
    ingreso_local: "IngresoLocal"
  }
};
