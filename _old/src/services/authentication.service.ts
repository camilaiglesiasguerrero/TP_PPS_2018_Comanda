import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class AuthenticationService{

    constructor(private MiAuth:AngularFireAuth,
        public afDB: AngularFireDatabase){

    }

    registerUserAndLogin(email:string, pass:string){
        return this.MiAuth.auth.createUserWithEmailAndPassword(email, pass)
    }

    registerUser(email:string, pass:string){

    }

    singIn(email:string, pass:string){
        return this.MiAuth.auth.signInWithEmailAndPassword(email, pass);
    }

    getEmail(){
        return  this.MiAuth.auth.currentUser.email;
    }

    getUID(){
        return this.MiAuth.auth.currentUser.uid;
    }

    logOut(){
        this.MiAuth.auth.signOut();
        this.logoutFromDatabase();
    }

    deleteUserLogged(){
        var user = this.MiAuth.auth.currentUser;
        return user.delete();
    }

    public logInFromDataBase(){
        this.afDB.database.goOnline();
    }
    
    public logoutFromDatabase() {
        this.afDB.database.goOffline();
    }


}