import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeocodingProvider } from '../../providers/geocoding';
import { Platform } from 'ionic-angular';
declare var google;

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
  origen:string = "adelaide";
  lat: number;
  lng: number;
  misCoordenadas:any;
  direccion:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geolocation: Geolocation,
              private geocodingProvider: GeocodingProvider,
              private platform: Platform) {
    this.platform.ready().then(()=>{
      this.geolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy:false })
        .then(data => {
          let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          google.maps.event.addListener(this.map, 'click', event => {
            this.mapClick(event)
          });
          this.obtenerDireccionPorCoordenadas(data.coords.latitude, data.coords.longitude);
          this.addMarker(data.coords.latitude, data.coords.longitude);
        });
      //Datos solo para testing, borrar en deploy
      /* this.misCoordenadas = {coords: {accuracy: 1696,
           altitude: null,
           altitudeAccuracy: null,
           heading: null,
           latitude: -34.6344243, //-34.6344243
           longitude: -58.386632199999994,//-58.386632199999994
           speed: null,
           timestamp: 1541723729180
         }};
       let latLng = new google.maps.LatLng(this.misCoordenadas.coords.latitude, this.misCoordenadas.coords.longitude);
       let mapOptions = {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       google.maps.event.addListener(this.map, 'click', event => {
         this.mapClick(event)
       });
       this.obtenerDireccionPorCoordenadas(this.misCoordenadas.coords.latitude, this.misCoordenadas.coords.longitude);
       this.addMarker(this.misCoordenadas.coords.latitude, this.misCoordenadas.coords.longitude);
 */
    });
  }

  ionViewDidLoad() {
  }

  mapClick(this, event){
    var latLng = event.latLng;
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.obtenerDireccionPorCoordenadas(latLng.lat(), latLng.lng());
    this.addMarker(latLng.lat(), latLng.lng());
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







  selectLocation(event) {
    //this.showSpinner = true;
    this.geocodingProvider.obtenerDireccionDetalle(event.coords.lat, event.coords.lng)
      .then((data: any) => {
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        if (data != "undefined") {
          var formatted_address = data.direccion;
          var address_components = data.detalle;
          console.log("Dirección: " + formatted_address);
          console.log("Detalle: " + JSON.stringify(address_components));
          //    this.define_countryCode();
        }
        //this.showSpinner = false;
      })
      .catch((error) => {
        console.log("ERROR: al convertir coordenadas -> dirección: " + error);
      })
  }

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
