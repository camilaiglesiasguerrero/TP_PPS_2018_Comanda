webpackJsonp([0],{

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IniciarsesionPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_messageHandler_service__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_spinnerHandler_service__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__registrarse_registrarse__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_params_service__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { NgForm } from '@angular/forms';





var IniciarsesionPage = /** @class */ (function () {
    function IniciarsesionPage(navCtrl, navParams, autenticationService, errorHandler, spinnerHandler, paramsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.autenticationService = autenticationService;
        this.errorHandler = errorHandler;
        this.spinnerHandler = spinnerHandler;
        this.paramsService = paramsService;
        this.splash = true;
        this.user = { name: '', pass: '' };
        this.loading = false;
        this.spiner = null;
        this.userSelect = "";
        this.selectUserOptions = { title: '' };
        this.selectUserOptions.title = "Usuarios disponibles";
    }
    IniciarsesionPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.paramsService.isLogged = false;
        if (this.navParams.get('fromApp')) {
            this.splash = false;
        }
        else {
            setTimeout(function () {
                _this.splash = false;
            }, 1000);
        }
    };
    IniciarsesionPage.prototype.singIn = function () {
        var _this = this;
        if (this.validForm()) {
            this.spiner = this.spinnerHandler.getAllPageSpinner();
            this.spiner.present();
            this.autenticationService.singIn(this.user.name, this.user.pass)
                .then(function (response) {
                _this.spiner.dismiss();
                _this.paramsService.isLogged = true;
                if (response.email == "admin@gmail.com") {
                    _this.paramsService.usuarioAdmin = true;
                }
                else {
                    _this.paramsService.usuarioAdmin = false;
                }
                _this.autenticationService.logInFromDataBase();
                // this.navCtrl.setRoot(PartidosPage);
                console.log("Se logueo correctamente");
            })
                .catch(function (error) {
                _this.spiner.dismiss();
                _this.errorHandler.mostrarError(error, "Error al iniciar sesión");
            });
        }
    };
    IniciarsesionPage.prototype.registerUser = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__registrarse_registrarse__["a" /* RegistrarsePage */], { page: 'login' });
    };
    IniciarsesionPage.prototype.userSelectChange = function () {
        switch (this.userSelect) {
            case "admin": {
                this.user.name = "administrador@gmail.com";
                this.user.pass = "111111";
                break;
            }
            case "invitado": {
                this.user.name = "invitado@gmail.com";
                this.user.pass = "222222";
                break;
            }
            case "usuario": {
                this.user.name = "usuario@gmail.com";
                this.user.pass = "333333";
                break;
            }
            case "anonimo": {
                this.user.name = "anonimo@gmail.com";
                this.user.pass = "44";
                break;
            }
            case "tester": {
                this.user.name = "tester@gmail.com";
                this.user.pass = "55";
                break;
            }
        }
    };
    IniciarsesionPage.prototype.validForm = function () {
        if (this.user.pass && this.user.pass) {
            return true;
        }
        this.errorHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
        return false;
    };
    IniciarsesionPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-iniciarsesion',template:/*ion-inline-start:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\iniciarsesion\iniciarsesion.html"*/'<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">\n\n\n\n<div id="custom-overlay" [style.display]="splash ? \'flex\': \'none\'">\n\n  <div class="flb">\n\n    <div class="Aligner-item Aligner-item--top">\n\n    </div>\n\n    <img src="assets/imgs/logoFondo.png">\n\n    <div class="Aligner-item Aligner-item--bottom">\n\n    </div>\n\n  </div>\n\n</div>\n\n\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon color="dark" name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Comanda</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-row>\n\n    <ion-col>\n\n      <ion-item>\n\n        <ion-label floating>Correo Electrónico</ion-label>\n\n        <ion-input type="email" required name="email" [(ngModel)]="user.name"></ion-input>\n\n      </ion-item>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row>\n\n    <ion-col>\n\n      <ion-item>\n\n        <ion-label floating>Contraseña</ion-label>\n\n        <ion-input type="password" required name="password" [(ngModel)]="user.pass"></ion-input>\n\n      </ion-item>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row>\n\n    <ion-col>\n\n      <ion-item>\n\n        <ion-label floating>Seleccionar Usuario</ion-label>\n\n        <ion-select [(ngModel)]="userSelect" [selectOptions]="selectUserOptions" (ionChange)="userSelectChange()"  >\n\n            <ion-option value="admin">Administrador</ion-option>\n\n            <ion-option value="invitado">Invitado</ion-option>\n\n            <ion-option value="usuario">Usuario</ion-option>\n\n            <ion-option value="anonimo">Anónimo</ion-option>\n\n            <ion-option value="tester">Tester</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n\n\n  <ion-row>\n\n    <ion-col>\n\n      <button ion-button block color="dark" (click)="singIn()">Iniciar Sesión</button>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row>\n\n    <ion-col>\n\n      <button ion-button block color="light" (click)="registerUser()">Registrarse</button>\n\n    </ion-col>\n\n  </ion-row>\n\n</ion-content>\n\n'/*ion-inline-end:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\iniciarsesion\iniciarsesion.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */],
            __WEBPACK_IMPORTED_MODULE_3__services_messageHandler_service__["a" /* MessageHandler */],
            __WEBPACK_IMPORTED_MODULE_4__services_spinnerHandler_service__["a" /* SpinnerHandler */],
            __WEBPACK_IMPORTED_MODULE_6__services_params_service__["a" /* ParamsService */]])
    ], IniciarsesionPage);
    return IniciarsesionPage;
}());

//# sourceMappingURL=iniciarsesion.js.map

/***/ }),

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SpinnerHandler; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SpinnerHandler = /** @class */ (function () {
    function SpinnerHandler(loadingCtrl) {
        this.loadingCtrl = loadingCtrl;
    }
    SpinnerHandler.prototype.getAllPageSpinner = function () {
        var loader = this.loadingCtrl.create({
            spinner: 'circles',
            showBackdrop: false,
            cssClass: 'small-spinner'
        });
        return loader;
    };
    SpinnerHandler = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */]])
    ], SpinnerHandler);
    return SpinnerHandler;
}());

//# sourceMappingURL=spinnerHandler.service.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegistrarsePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_cliente__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_messageHandler_service__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_spinnerHandler_service__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__iniciarsesion_iniciarsesion__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_params_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_clientes_service__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__home_home__ = __webpack_require__(236);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var RegistrarsePage = /** @class */ (function () {
    function RegistrarsePage(navCtrl, navParams, autenticationService, messageHandler, spinnerHandler, barcodeScanner, clientesService, paramsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.autenticationService = autenticationService;
        this.messageHandler = messageHandler;
        this.spinnerHandler = spinnerHandler;
        this.barcodeScanner = barcodeScanner;
        this.clientesService = clientesService;
        this.paramsService = paramsService;
        this.user = { email: '', pass: '', secondPass: '', dni: '', nombre: '', apellido: '', foto: '' };
        this.title = "Registrarse";
        this.miScan = {};
        this.fromLogin = false;
        if (this.navParams.data.page == 'login') {
            this.fromLogin = true;
        }
    }
    RegistrarsePage.prototype.ionViewDidLoad = function () {
        this.paramsService.isLogged = false;
    };
    RegistrarsePage.prototype.registerUser = function () {
        if (this.validForm()) {
            if (this.fromLogin) {
                this.registrarYLoguear();
            }
            else {
                this.crearUsuario();
            }
        }
    };
    RegistrarsePage.prototype.cancel = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */], { 'fromApp': true });
    };
    RegistrarsePage.prototype.tomarFoto = function () {
    };
    RegistrarsePage.prototype.escanearDni = function () {
        /*    this.qrScanner.prepare()
                .then((status: QRScannerStatus) => {
                    if (status.authorized) {
                        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                            console.log('Scanned something', text);
    
                            this.qrScanner.hide(); // hide camera preview
                            scanSub.unsubscribe(); // stop scanning
                        });
    
                    } else if (status.denied) {
                        this.messageHandler.mostrarErrorLiteral("No se puede continuar si no se habilita el permiso");
                    } else {
                        // permission was denied, but not permanently. You can ask for permission again at a later time.
                        this.messageHandler.mostrarErrorLiteral("No se puede continuar si no se habilita el permiso");
                        
                    }
                })
                .catch((e: any) => console.log('Error is', e));*/
        var _this = this;
        try {
            this.options = { prompt: "Escaneá el DNI", formats: "PDF_417" };
            this.barcodeScanner.scan(this.options).then(function (barcodeData) {
                _this.miScan = (barcodeData.text).split('@');
                _this.user.apellido = _this.miScan[1];
                _this.user.nombre = _this.miScan[2];
                _this.user.dni = _this.miScan[4];
            }, function (error) {
                //this.errorHandler.mostrarErrorLiteral(error);
            });
        }
        catch (error) {
            //this.errorHandler.mostrarErrorLiteral("catch" + error);
        }
    };
    RegistrarsePage.prototype.validForm = function () {
        if (this.user.email && this.user.pass && this.user.secondPass) {
            if (this.user.pass == this.user.secondPass) {
                if (this.user.pass.length > 5) {
                    return true;
                }
                this.messageHandler.mostrarErrorLiteral("La contraseña debe tener 6 caracteres mínimo", "Error al registrarse");
            }
            else {
                this.messageHandler.mostrarErrorLiteral("Las contraseñas no coinciden", "Error al registrarse");
            }
        }
        else {
            this.messageHandler.mostrarErrorLiteral("Todos los campos son obligatorios", "Error al registrarse");
        }
        return false;
    };
    RegistrarsePage.prototype.crearUsuario = function () {
    };
    RegistrarsePage.prototype.registrarYLoguear = function () {
        var _this = this;
        var spiner = this.spinnerHandler.getAllPageSpinner();
        spiner.present();
        this.autenticationService.registerUserAndLogin(this.user.email, this.user.pass)
            .then(function (response) {
            var cliente = new __WEBPACK_IMPORTED_MODULE_0__models_cliente__["a" /* Cliente */](_this.user.nombre, _this.user.apellido, _this.user.dni, _this.user.foto);
            cliente.uid = _this.autenticationService.getUID();
            _this.clientesService.guardar(cliente)
                .then(function (response) {
                spiner.dismiss();
                _this.messageHandler.mostrarMensaje("Bienvenido!!");
                _this.paramsService.isLogged = true;
                if (_this.fromLogin) {
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_10__home_home__["a" /* HomePage */]);
                }
            }, function (error) {
                _this.autenticationService.deleteUserLogged()
                    .then(function (response) {
                    spiner.dismiss();
                    _this.messageHandler.mostrarErrorLiteral("Ocurrió un error al registrarse");
                    _this.paramsService.isLogged = true;
                    if (_this.fromLogin) {
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_10__home_home__["a" /* HomePage */]);
                    }
                }, function (error) {
                    console.log("no se puedo eliminar el usuario logueado");
                    spiner.dismiss();
                    _this.messageHandler.mostrarErrorLiteral("Hubo un error en el registro");
                });
            });
        })
            .catch(function (error) {
            spiner.dismiss();
            _this.messageHandler.mostrarError(error, "Error al registrarse");
        });
    };
    RegistrarsePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-registrarse',template:/*ion-inline-start:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\registrarse\registrarse.html"*/'<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">\n\n<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle color="secondary">\n\n            <ion-icon color="secondary" name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>{{title}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <div class="flex-v center-horizontal">\n\n        <div class="">\n\n            <ion-row>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>Nombre</ion-label>\n\n                        <ion-input type="text" name="dni" [(ngModel)]="user.nombre"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>Apellido</ion-label>\n\n                        <ion-input type="text" name="dni" [(ngModel)]="user.apellido"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>DNI</ion-label>\n\n                        <ion-input type="text" name="dni" [(ngModel)]="user.dni"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>Correo Electrónico</ion-label>\n\n                        <ion-input type="email" name="email" [(ngModel)]="user.email"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>Contraseña</ion-label>\n\n                        <ion-input type="password" name="password" [(ngModel)]="user.pass"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col>\n\n                    <ion-item>\n\n                        <ion-label floating>Repetir Contraseña</ion-label>\n\n                        <ion-input type="password" name="password" [(ngModel)]="user.secondPass"></ion-input>\n\n                    </ion-item>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col text-center>\n\n                    <button ion-button round color="light" (click)="escanearDni()">\n\n                        <ion-icon color="secondary" name="qr-scanner" style="margin-right:5px;"></ion-icon>\n\n                        Escanear DNI\n\n                    </button>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col text-center>\n\n                    <button ion-button round color="light" (click)="tomarFoto()">\n\n                        <ion-icon color="secondary" name="camera" style="margin-right:5px;"></ion-icon>\n\n                        Tomar foto\n\n                    </button>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col text-center>\n\n                    <button ion-button round color="light" (click)="registerUser()">Registrarse</button>\n\n                </ion-col>\n\n            </ion-row>\n\n            <!-- <ion-row>\n\n\n\n                <ion-fab right bottom>\n\n                    <button ion-fab color="light">\n\n                        <ion-icon color="secondary" name="arrow-dropright"></ion-icon>\n\n                    </button>\n\n                    <ion-fab-list side="left">\n\n                        <button ion-fab color="light" (click)="escanearDni()">\n\n                            <ion-icon color="secondary" name="qr-scanner"></ion-icon>\n\n                        </button>\n\n                        <button ion-fab color="light" (click)="tomarFoto()">\n\n                            <ion-icon color="secondary" name="camera"></ion-icon>\n\n                        </button>\n\n                        <button ion-fab color="light" (click)="cancel()">\n\n                            <ion-icon color="secondary" name="arrow-back"></ion-icon>\n\n                        </button>\n\n                        <button ion-fab color="light" (click)="cancel()">\n\n                            <ion-icon color="secondary" name="arrow-back"></ion-icon>\n\n                        </button>\n\n                    </ion-fab-list>\n\n                </ion-fab>\n\n            </ion-row>\n\n            -->\n\n        </div>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\registrarse\registrarse.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__["a" /* AuthenticationService */],
            __WEBPACK_IMPORTED_MODULE_5__services_messageHandler_service__["a" /* MessageHandler */],
            __WEBPACK_IMPORTED_MODULE_6__services_spinnerHandler_service__["a" /* SpinnerHandler */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            __WEBPACK_IMPORTED_MODULE_9__services_clientes_service__["a" /* ClientesService */],
            __WEBPACK_IMPORTED_MODULE_8__services_params_service__["a" /* ParamsService */]])
    ], RegistrarsePage);
    return RegistrarsePage;
}());

//# sourceMappingURL=registrarse.js.map

/***/ }),

/***/ 126:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 126;

/***/ }),

/***/ 169:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 169;

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ClientesService = /** @class */ (function () {
    function ClientesService(MiAuth, afDB) {
        this.MiAuth = MiAuth;
        this.afDB = afDB;
        this.serviceRef = this.afDB.list('clientes');
    }
    ClientesService.prototype.guardar = function (model) {
        return this.serviceRef.push(model);
    };
    ClientesService.prototype.editar = function (model, key) {
        return this.serviceRef.update(key, model);
    };
    ClientesService.prototype.obtenerLista = function () {
        return this.serviceRef;
    };
    ClientesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], ClientesService);
    return ClientesService;
}());

//# sourceMappingURL=clientes.service.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n'/*ion-inline-end:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(257);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_media_capture__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_video_player__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__globalConfigs__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_status_bar__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_splash_screen__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_barcode_scanner__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_angularfire2__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angularfire2_database__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2_auth__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__app_component__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_home_home__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_list_list__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_iniciarsesion_iniciarsesion__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_registrarse_registrarse__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_authentication_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_messageHandler_service__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services_spinnerHandler_service__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__services_params_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__services_clientes_service__ = __webpack_require__(235);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









//LectorQR

//Firebase



//Pages





//Services





var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_registrarse_registrarse__["a" /* RegistrarsePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_10_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_6__globalConfigs__["a" /* configs */].firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_11_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_12_angularfire2_auth__["b" /* AngularFireAuthModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_registrarse_registrarse__["a" /* RegistrarsePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
                __WEBPACK_IMPORTED_MODULE_21__services_params_service__["a" /* ParamsService */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_media_capture__["a" /* MediaCapture */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_video_player__["a" /* VideoPlayer */],
                __WEBPACK_IMPORTED_MODULE_18__services_authentication_service__["a" /* AuthenticationService */],
                __WEBPACK_IMPORTED_MODULE_19__services_messageHandler_service__["a" /* MessageHandler */],
                __WEBPACK_IMPORTED_MODULE_20__services_spinnerHandler_service__["a" /* SpinnerHandler */],
                __WEBPACK_IMPORTED_MODULE_22__services_clientes_service__["a" /* ClientesService */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return configs; });
var configs = {
    firebaseConfig: {
        apiKey: "AIzaSyAmQCFaQFzBeY7KHtGa-WMDjzsAFX_VFfs",
        authDomain: "appcomanda-fa69f.firebaseapp.com",
        databaseURL: "https://appcomanda-fa69f.firebaseio.com",
        projectId: "appcomanda-fa69f",
        storageBucket: "appcomanda-fa69f.appspot.com",
        messagingSenderId: "264597556384"
    }
};
//# sourceMappingURL=globalConfigs.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_params_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_messageHandler_service__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_iniciarsesion_iniciarsesion__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_registrarse_registrarse__ = __webpack_require__(115);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, paramsService, messageHandler, authenticationService) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.paramsService = paramsService;
        this.messageHandler = messageHandler;
        this.authenticationService = authenticationService;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.loginPages = [
            { title: 'Iniciar Sesión', component: __WEBPACK_IMPORTED_MODULE_7__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */] },
            { title: 'Registrarse', component: __WEBPACK_IMPORTED_MODULE_8__pages_registrarse_registrarse__["a" /* RegistrarsePage */] }
        ];
        this.pages = [
            { title: 'Cerrar Sesión', component: __WEBPACK_IMPORTED_MODULE_7__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */] },
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        var _this = this;
        if (page.title == 'Cerrar Sesión') {
            var alertConfirm = this.messageHandler.mostrarMensajeConfimación("¿Quieres cerrar sesión?", "Cerrar sesión");
            alertConfirm.present();
            alertConfirm.onDidDismiss(function (confirm) {
                if (confirm) {
                    _this.cerrarSesion();
                }
            });
            this.nav.setRoot(page.component, { 'fromApp': true });
        }
    };
    MyApp.prototype.cerrarSesion = function () {
        this.paramsService.isLogged = false;
        this.authenticationService.logOut();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_iniciarsesion_iniciarsesion__["a" /* IniciarsesionPage */], { 'fromApp': true });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\app\app.html"*/'<ion-menu [content]="content">\n\n  <ion-header>\n\n    <ion-toolbar>\n\n      <ion-title>Menu</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n\n\n  <ion-content>\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        {{p.title}}\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_4__services_params_service__["a" /* ParamsService */], __WEBPACK_IMPORTED_MODULE_5__services_messageHandler_service__["a" /* MessageHandler */], __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__["a" /* AuthenticationService */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cliente; });
var Cliente = /** @class */ (function () {
    function Cliente(nombre, apellido, dni, foto) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
    }
    return Cliente;
}());

//# sourceMappingURL=cliente.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListPage = /** @class */ (function () {
    function ListPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }
    ListPage_1 = ListPage;
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ListPage_1, {
            item: item
        });
    };
    ListPage = ListPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\list\list.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n\n      {{item.title}}\n\n      <div class="item-note" item-end>\n\n        {{item.note}}\n\n      </div>\n\n    </button>\n\n  </ion-list>\n\n  <div *ngIf="selectedItem" padding>\n\n    You navigated here from <b>{{selectedItem.title}}</b>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"E:\CamiLa\Documents\PPS\TP_PPS_2018_Comanda\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ParamsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ParamsService = /** @class */ (function () {
    function ParamsService() {
    }
    ParamsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], ParamsService);
    return ParamsService;
}());

//# sourceMappingURL=params.service.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessageHandler; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MessageHandler = /** @class */ (function () {
    function MessageHandler(alertCtrl, alert) {
        this.alertCtrl = alertCtrl;
        this.alert = alert;
    }
    MessageHandler_1 = MessageHandler;
    MessageHandler.prototype.getErrorMessage = function (error) {
        var mensaje = "Error desconocido";
        for (var i = 0; i < MessageHandler_1.knownErrors.length; i++) {
            if (error.code == MessageHandler_1.knownErrors[i].code) {
                mensaje = MessageHandler_1.knownErrors[i].message;
                break;
            }
        }
        return mensaje;
    };
    MessageHandler.prototype.mostrarError = function (error, title, message) {
        console.log("ocurrio un error", error);
        var errorMessage = this.getErrorMessage(error);
        var alert = this.alertCtrl.create({
            message: message ? message + errorMessage : errorMessage,
            duration: 4000,
            position: "top",
            cssClass: 'error-alert'
        });
        alert.present();
    };
    MessageHandler.prototype.mostrarErrorLiteral = function (error, title) {
        var alert = this.alertCtrl.create({
            message: error,
            duration: 4000,
            position: "top",
            cssClass: 'error-alert'
        });
        alert.present();
    };
    MessageHandler.prototype.mostrarMensaje = function (mesagge) {
        var alert = this.alertCtrl.create({
            message: mesagge,
            duration: 4000,
            position: "top",
            cssClass: 'success-alert',
        });
        alert.present();
    };
    MessageHandler.prototype.mostrarMensajeConfimación = function (mensaje, title) {
        var alert = this.alert.create({
            title: title,
            message: mensaje,
            cssClass: 'confirm-alert',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () {
                        alert.dismiss(false);
                        return false;
                    }
                },
                {
                    text: 'Si',
                    handler: function () {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        return alert;
    };
    MessageHandler.knownErrors = [
        {
            code: 'auth/email-already-in-use',
            message: "El email ya existe"
        },
        {
            code: 'auth/user-not-found',
            message: "El email no se encuentra registrado"
        },
        {
            code: 'auth/wrong-password',
            message: "Contraseña Incorrecta"
        },
        {
            code: "auth/network-request-failed",
            message: "No hay conexión a internet"
        },
        {
            code: "auth/invalid-email",
            message: "Email inválido"
        },
    ];
    MessageHandler = MessageHandler_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], MessageHandler);
    return MessageHandler;
    var MessageHandler_1;
}());

//# sourceMappingURL=messageHandler.service.js.map

/***/ }),

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(MiAuth, afDB) {
        this.MiAuth = MiAuth;
        this.afDB = afDB;
    }
    AuthenticationService.prototype.registerUserAndLogin = function (email, pass) {
        return this.MiAuth.auth.createUserWithEmailAndPassword(email, pass);
    };
    AuthenticationService.prototype.registerUser = function (email, pass) {
    };
    AuthenticationService.prototype.singIn = function (email, pass) {
        return this.MiAuth.auth.signInWithEmailAndPassword(email, pass);
    };
    AuthenticationService.prototype.getEmail = function () {
        return this.MiAuth.auth.currentUser.email;
    };
    AuthenticationService.prototype.getUID = function () {
        return this.MiAuth.auth.currentUser.uid;
    };
    AuthenticationService.prototype.logOut = function () {
        this.MiAuth.auth.signOut();
        this.logoutFromDatabase();
    };
    AuthenticationService.prototype.deleteUserLogged = function () {
        var user = this.MiAuth.auth.currentUser;
        return user.delete();
    };
    AuthenticationService.prototype.logInFromDataBase = function () {
        this.afDB.database.goOnline();
    };
    AuthenticationService.prototype.logoutFromDatabase = function () {
        this.afDB.database.goOffline();
    };
    AuthenticationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], AuthenticationService);
    return AuthenticationService;
}());

//# sourceMappingURL=authentication.service.js.map

/***/ })

},[237]);
//# sourceMappingURL=main.js.map