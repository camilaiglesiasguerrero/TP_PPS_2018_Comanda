import { Injectable } from '@angular/core';

@Injectable()
export class ParamsService {

    params:any;
    isLogged:boolean;
    usuarioAdmin:boolean;
    rol:string;
    user:any;
    email:string;
    password:string;
    
    name:string;
    pass:string;

    propinaAux:any = 0;

}
