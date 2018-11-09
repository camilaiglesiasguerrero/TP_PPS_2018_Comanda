import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { configs } from '../../src/app/globalConfigs';


@Injectable()
export class GeocodingProvider {

  constructor(public _http: HttpClient) {
    console.log('Hello GeocordingProvider Provider');
  }

  //METODO -> OBTENER UNA DIRECCION (a partir de coordenadas)
  obtenerDireccion(lat:number, lng:number){
    let promesa = new Promise((resolve, reject)=>{
      let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat +","+ lng + "&key=" + configs.googleMaps.apiKey;
      this._http.get(url)
        .subscribe( (data:any) =>{
          let direccion:string = data.results[0].formatted_address;
          console.log("DATOS AL OBTENER DIRECCION: " + direccion);
          resolve(direccion);
        }, error=>{
          console.log("ERROR! al obtener dirección: " + error);
        });
    });
    return promesa;
  }

  //METODO -> OBTENER UNA DIRECCION + DETALLE (a partir de coordenadas)
  obtenerDireccionDetalle(lat:number, lng:number){
    let promesa = new Promise((resolve, reject)=>{
      let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat +","+ lng + "&key=" + configs.googleMaps.apiKey;
      this._http.get(url)
        .subscribe( (data:any) =>{
          console.log("DATA: " + data.results);
          let direccion:any;
          if(data.results[0] != undefined){
            direccion = {
              direccion: data.results[0].formatted_address,
              detalle: data.results[0].address_components
            }
          }
          else{
            direccion = "undefined";
          }

          console.log("DATOS AL OBTENER DIRECCION: " + direccion);
          resolve(direccion);
        }, error=>{
          console.log("ERROR! al obtener dirección: " + error);
        });
    });
    return promesa;
  }

  //METODO -> OBTENER COORDENADAS (a partir de una dirección)
  obtenerCoordenadas(direccion:string){
    let promesa = new Promise<number[]>((resolve, reject)=>{
      let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ direccion +"&key=" + configs.googleMaps.apiKey;
      this._http.get(url)
        .subscribe( (data:any) =>{
          let latlng:number[] = [data.json().results[0].geometry.location.lat, data.json().results[0].geometry.location.lng];
          console.log("LatLng: " + latlng);
          resolve(latlng);
        }, error=>{
          console.log("ERROR! al obtener coordenadas: " + error);
        });
    });
    return promesa;
  }
}
