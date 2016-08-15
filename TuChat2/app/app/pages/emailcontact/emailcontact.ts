import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/emailcontact/emailcontact.html',
})
export class EmailcontactPage {

  urlService; contacto; data; usuario;

  constructor(public nav: NavController, public params: NavParams) {
    this.nav = nav;
    this.urlService = params.data.urlservice;
    this.contacto   = params.data.contacto;

    //capturando al usuario que inicio sesion
    this.data = window.localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.data);
    this.usuario = this.usuario.usuario;
  }
}
