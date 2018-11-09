import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeocodingProvider } from '../../providers/geocoding';
import { Platform } from 'ionic-angular';
declare var google;
import { DatabaseService } from '../../services/database.service';
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';
import { ProductoPedido } from '../../models/productoPedido';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';

@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

  //Google map tutorial: https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
  //Navigation geolocation: https://www.joshmorony.com/implementing-turn-by-turn-navigation-with-google-maps-in-ionic/
  //Apikey name: appcomandapps / AIzaSyBJffx9HcTzjsw4mBAEMti_BUuXA9VTIaA
  //Cloud de servicios de google apis (mail de ger) https://console.cloud.google.com/google/maps-apis/overview?onboard=true&project=appcomandapps-1541641825014&consoleUI=CLOUD

  //Ejemplos de proyectos:https://www.joshmorony.com/shhh/?convertkit=true&first_name=&email=carina.amuz%40gmail.com

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  marker:any;
  direccion:any;
  bebidas:any;
  comidas:any;
  reservas:any;
  reservaKey : string;
  reservadniCliente:string;
  reservaMesa:any;
  productoPedido : Array<ProductoPedido>;
  producto : Array<Producto>;
  spinner:any;
  user:any;
  beb = 0;
  pla = 0;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseService,
              private messageHandler:MessageHandler,
              private spinnerH:SpinnerHandler,
              private params:ParamsService,
              public geolocation: Geolocation,
              private geocodingProvider: GeocodingProvider,
              private platform: Platform) {
    this.platform.ready().then(()=>{
      this.geolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy:false })
        .then(data => {
          this.cargarMapa(data.coords.latitude, data.coords.longitude);
        });
      //Datos solo para testing si no anda el currentposition en el browser descomentar esta linea
     // this.cargarMapa(-34.6344243, -58.386632199999994)
    });

    this.navParams.get("reserva") ? this.reservaKey = this.navParams.get("reserva") : null;
    this.navParams.get("dniCliente") ? this.reservadniCliente = this.navParams.get("dniCliente") : null;
    this.navParams.get("mesa") ? this.reservaMesa = this.navParams.get("mesa") : null;
    this.productoPedido = new Array<ProductoPedido>();
    this.producto = new Array<Producto>();
    this.user = this.params.user;

    this.database.db.list<any>('productos/platos/').valueChanges()
      .subscribe(snapshots => {
        this.comidas = snapshots;
        this.comidas = this.comidas.filter(f => f.estado == 'Habilitado' );
        this.comidas = this.comidas.filter(f => f.cantidad > 0 );

      });

    this.database.db.list<any>('productos/bebidas/').valueChanges()
      .subscribe(snapshots => {
        this.bebidas = snapshots;
        this.bebidas = this.bebidas.filter(f => f.estado == 'Habilitado' );
        this.bebidas = this.bebidas.filter(f => f.cantidad > 0 );

      });
    //aca
    this.database.db.list<any>('reservas/').valueChanges()
      .subscribe(snapshots => {
        this.reservas = snapshots;
        this.reservas = this.reservas.filter(f => f.estado == 'Reserva');
      });

  }

  ionViewDidLoad() {
  }

  tapEvent(event,producto){
    let flag = false;
    let stock = true;
    if(this.productoPedido.length > 0){//tengo algún producto en la lista de pedidos
      for (let i = 0; i < this.productoPedido.length; i++) {
        if(this.productoPedido[i].idProducto == producto.key){//si ya pedi este producto
          this.productoPedido[i].cantidad ++;                 //le agrego uno
          flag = true;
          if(producto.tipo == 'Bebida'){                      //si el producto es bebida, verifico q me de el stock
            for (let index = 0; index < this.bebidas.length; index++) {
              if(this.bebidas.key == producto.key && this.bebidas.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.bebidas[index].nombre);
                this.productoPedido[i].cantidad --;
                stock = false;
              }
            }
          }else{                                            //idem si es comida
            for (let index = 0; index < this.comidas.length; index++) {
              if(this.comidas.key == producto.key && this.comidas.cantidad < this.productoPedido[i].cantidad){
                this.messageHandler.mostrarError('No hay stock suficiente de '+this.comidas[index].nombre);
                this.productoPedido[i].cantidad --;
                stock = false;
              }
            }
          }

          break;
        }
      }
      if(!flag){//si no pedí el producto lo agrego
        let prod = new ProductoPedido();
        prod.idProducto = producto.key;
        prod.cantidad = 1;
        prod.tipo = producto.tipo;
        this.productoPedido.push(new ProductoPedido(producto.key,1,producto.tipo));
      }
    }else
      this.productoPedido.push(new ProductoPedido(producto.key,1,producto.tipo));

    if(stock){
      producto.cantidad--;
      this.producto.push(producto);
      if(producto.tipo == 'Bebida')
        this.beb ++;
      else
        this.pla++;
    }

  }

  Confirmar(){
    let pedidoASubir : Pedido = new Pedido();
    let aux;
    pedidoASubir.key = this.database.ObtenerKey('pedidos/');
    pedidoASubir.estado = 'Solicitado';
    pedidoASubir.productoPedido = null;
    this.database.jsonPackData = pedidoASubir;
    this.database.SubirDataBase('pedidos/').then(r=>{
      this.restarProducto();

      for (let i = 0; i < this.productoPedido.length; i++) {
        aux = {
          key : this.productoPedido[i].idProducto,
          cantidad : this.productoPedido[i].cantidad,
          tipo : this.productoPedido[i].tipo
        }

        this.database.jsonPackData = aux;

        this.database.SubirDataBase('pedidos/'+pedidoASubir.key+'/productos/').then(e=>{
          this.messageHandler.mostrarMensaje('El pedido fue encargado');
        });
      }
    });

    if(this.params.rol == 'cliente'){
      for (let j = 0; j < this.reservas.length; j++) {
        if(this.reservas[j].dniCliente == this.user.dni){
          let res = {
            key: this.reservas[j].key,
            dniCliente: this.reservas[j].dniCliente,
            idMesa: this.reservas[j].idMesa,
            idPedido: pedidoASubir.key,
            estado:'Con pedido'
          }
          this.database.jsonPackData = res;
          this.database.SubirDataBase('reservas/');
        }
      }
    }else{
      let res = {
        key: this.reservaKey,
        dniCliente: this.reservadniCliente,
        idMesa: this.reservaMesa,
        idPedido: pedidoASubir.key,
        estado:'Con pedido'
      }
      this.database.jsonPackData = res;
      this.database.SubirDataBase('reservas/');
    }
  }

  restarProducto(){
    let prod = new Producto();
    for (let i = 0; i < this.producto.length; i++) {
      //campo que cambia
      prod.cantidad = this.producto[i].cantidad;
      //
      prod.descripcion = this.producto[i].descripcion;
      prod.estado = this.producto[i].estado;
      prod.foto1 = this.producto[i].foto1;
      prod.foto2 = this.producto[i].foto2;
      prod.foto3 = this.producto[i].foto3;
      prod.key = this.producto[i].key;
      prod.nombre = this.producto[i].nombre;
      prod.precio = this.producto[i].precio;
      prod.tiempoElaboracion = this.producto[i].tiempoElaboracion;
      prod.tipo = this.producto[i].tipo;

      this.database.jsonPackData = prod;
      if(prod.tipo == 'Bebida')
        this.database.SubirDataBase('productos/bebidas/');
      else
        this.database.SubirDataBase('productos/platos/');
    }
  }

  mapClick(this, event){
    var latLng = event.latLng;
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.obtenerDireccionPorCoordenadas(latLng.lat(), latLng.lng());
    this.addMarker(latLng.lat(), latLng.lng());
  }

  private cargarMapa(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addListener(this.map, 'click', event => {
      this.mapClick(event)
    });
    this.obtenerDireccionPorCoordenadas(lat, long);
    this.addMarker(lat, long);
  }

  private obtenerDireccionPorCoordenadas(lat, long){
    this.geocodingProvider.obtenerDireccion(lat, long).then(response =>{
      this.direccion = response;
    }, error => {
      console.log(error);
    });
  }

  private addMarker(lat, long){
    let latLng = new google.maps.LatLng(lat, long);
    //Si existe otro punto en el mapa lo elimina
    if(this.marker){
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    let content = "<h5>" + this.direccion + "</h5>";

    this.addInfoWindow(this.marker, content);
  }

  private addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(this.marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  //este sirve para poner dos rutas de destino y te indica que camino tomar
  startNavigating(){
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
      origin: 'adelaide',
      destination: 'adelaide oval',
      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

      if(status == google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }
    });
  }

}
