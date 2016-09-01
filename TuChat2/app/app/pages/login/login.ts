import {Page, NavController, Alert, Loading} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {NgZone} from 'angular2/core';

import {HomePage} from '../home/home';
import {PchatPage} from '../pchat/pchat';


@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [HTTP_PROVIDERS]
})

export class LoginPage {

  nombre_usuario; clave; usuario; sesioniniciada; urlservice;

  constructor(public nav: NavController, public http: Http, public zone: NgZone) {
    this.nav    = nav;
    this.http   = http;
    this.zone   = zone;

    this.urlservice = 'http://127.0.0.1';

    this.nombre_usuario = '';
    this.clave          = '';
    this.usuario        = [];

    this.validarSesionesIniciadas();

  }

  validarSesionesIniciadas() {
    this.sesioniniciada = window.localStorage.getItem('usuario');
    if(this.sesioniniciada !== null) {
      this.sesioniniciada = JSON.parse(this.sesioniniciada);
      this.sesioniniciada = this.sesioniniciada.usuario;
      let loadginSesion = Loading.create({
        content: ''+this.sesioniniciada.nombre+' estamos iniciando tu sesion.'
      });
      this.nav.present(loadginSesion);
      setTimeout(() => {
          loadginSesion.dismiss();
          this.nav.setRoot(HomePage,{
            urlservice: this.urlservice
          });
      }, 0);
    } else {
      console.log("no hay sesion iniciadas");
    }
  }

  login() {
    this.http.get(this.urlservice+':9090/iniciarsesion?nombre_usuario='+this.nombre_usuario+'&clave='+this.clave+'').subscribe(res => {
      this.usuario = res.json();
      if(this.usuario.usuario) {
        let loadgin = Loading.create({
          content: 'Iniciando tu sesion.'
        });
        this.nav.present(loadgin);
        setTimeout(() => {
          this.usuario.usuario.forEach((item, index) => {
            this.usuario = item;
            let user = JSON.stringify({
              usuario: this.usuario
            });
            window.localStorage.setItem('usuario', user);
            window.localStorage.setItem('nickname', this.nombre_usuario);
            loadgin.dismiss();
            this.nav.setRoot(HomePage,{
              urlservice: this.urlservice
            });
          });
        });
      }
      else if(this.usuario.usuarioError){
        let alert = Alert.create({
          title: 'Inicio de sesion.',
          message: 'Fallido: por favor asegurece de que su nombre de usuario y su clave sean correctas.',
          buttons: [
            {
              text: 'Reintertar',
              hendler: () => {
                this.clave = '';
              }
            }
          ]
        });
        this.nav.present(alert);
      }
    }, err => console.error("Inicio de sesion fallido " + err),
    () => console.log("Inicio de sesion completado"));
  }

}
