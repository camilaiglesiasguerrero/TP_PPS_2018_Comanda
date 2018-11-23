import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeocodingProvider } from '../../providers/geocoding';
import { Platform } from 'ionic-angular';
declare var google;
import { SpinnerHandler } from '../../services/spinnerHandler.service';
import { MessageHandler } from '../../services/messageHandler.service';
import { ParamsService } from '../../services/params.service';
import {diccionario} from "../../models/diccionario";

@Component({
  selector: 'page-ubicacion',
  templateUrl: 'ubicacion.html',
})
export class UbicacionPage {

  //Google map tutorial: https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
  //Navigation geolocation: https://www.joshmorony.com/implementing-turn-by-turn-navigation-with-google-maps-in-ionic/
  //Apikey name: appcomandapps / AIzaSyBJffx9HcTzjsw4mBAEMti_BUuXA9VTIaA
  //Cloud de servicios de google apis (mail de ger) https://console.cloud.google.com/google/maps-apis/overview?onboard=true&project=appcomandapps-1541641825014&consoleUI=CLOUD

  //Ejemplos de proyectos:https://www.joshmorony.com/shhh/?convertkit=true&first_name=&email=carina.amuz%40gmail.com

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  @Input('direccion') direccion:any;
  @Input('show-ruta') showRuta:any;
  @Input('show-detalles') showDetalles:any;
  @Input('ocultar-ingresar-direccion') hiddenInputDir:any;

  map: any;
  marker:any;
  latLong:any;
  directionsService:any;
  directionsDisplay:any;
  tiempoArribo:string = "";
  infoDireccion:string = "";



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private messageHandler:MessageHandler,
              private params:ParamsService,
              public geolocation: Geolocation,
              private geocodingProvider: GeocodingProvider,
              private platform: Platform) {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition({timeout: 30000, enableHighAccuracy: false})
        .then(data => {
          this.cargarMapa(data.coords.latitude, data.coords.longitude);
        });
      //Datos solo para testing si no anda el currentposition en el browser descomentar esta linea
      // this.cargarMapa(-34.6344243, -58.386632199999994)
    });
  }

  mapClick(this, event){
    var latLng = event.latLng;
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.obtenerDireccionPorCoordenadas(latLng.lat(), latLng.lng());
    this.addMarker(latLng.lat(), latLng.lng());
  }

  buscarCoordenadas(){
    this.geocodingProvider.obtenerCoordenadas(this.direccion.value).then(response =>{
      this.cargarMapa(response.lat, response.long);
      this.direccion['value'] = response.direccion;
    }, error =>{
      this.messageHandler.mostrarErrorLiteral("Error al obtener la ubicación");
    })
  }

  private cargarMapa(lat, long) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    if(this.direccion && this.direccion.lat && this.direccion.long ){
      lat = this.direccion.lat;
      long = this.direccion.long;
    }
    this.latLong = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: this.latLong,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addListener(this.map, 'click', event => {
      this.mapClick(event)
    });
    this.directionsDisplay.setMap(this.map);
    this.obtenerDireccionPorCoordenadas(lat, long);
    this.addMarker(lat, long);
    if(this.showRuta){
      this.obtenerRutaALocal();
    }
  }

  private obtenerDireccionPorCoordenadas(lat, long){
    this.geocodingProvider.obtenerDireccion(lat, long).then(response =>{
      this.direccion['value'] = response;
      this.direccion['lat'] = lat;
      this.direccion['long'] = long
      this.direccion['infoDireccion'] = this.infoDireccion;
    }, error => {
      console.log(error);
    });
  }

  private addMarker(lat, long){
    let latLng = new google.maps.LatLng(lat, long);
    this.latLong = latLng;
    //Si existe otro punto en el mapa lo elimina
    if(this.marker){
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    let content = "<h5>" + this.direccion.value + "</h5>";
    this.addInfoWindow(this.marker, content);
    if(this.showRuta){
      this.obtenerRutaALocal();
    }
  }

  private addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(this.marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  private obtenerRutaALocal(){
    let destino = new google.maps.LatLng(diccionario.direccion_local.lat, diccionario.direccion_local.long);
    let configRute = {
      origin: this.latLong,
      destination:  destino,
      travelMode: 'DRIVING',
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: 'pessimistic'
      },
      provideRouteAlternatives: true
    }
    this.directionsService.route(configRute, (result, status) =>{
      if (status == 'OK') {
        this.directionsDisplay.setDirections(result);
        this.tiempoArribo = result.routes[0].legs[0].duration_in_traffic.text;
        this.direccion['tiempoArribo'] = result.routes[0].legs[0].duration_in_traffic.value / 59.9;
      }
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
