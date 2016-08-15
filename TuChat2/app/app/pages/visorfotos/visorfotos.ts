import {Page, NavController, Loading, Platform, ActionSheet, NavParams} from 'ionic-angular';
import {Http, HTTP_PROVIDERS, Headers, RequestOptions} from 'angular2/http';
import {NgZone} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/visorfotos/visorfotos.html',
  providers: [HTTP_PROVIDERS]
})

export class VisorfotosPage {

  contacto; urlservice; ncontacto;

  constructor(public nav: NavController, public params: NavParams, public platform: Platform, public http: Http, public zone: NgZone) {
    this.nav        = nav;
    this.http       = http;
    this.zone       = zone;
    this.platform   = platform;
    this.urlservice = params.data.urlservice;
    this.contacto   = params.data.contacto;
    this.ncontacto  = params.data.ncontacto;
  }

  descargarImg(contacto, ncontacto) {
    let descargarImgSheet = ActionSheet.create({
      title: ""+this.ncontacto+"",
      buttons: [
        {
          text: 'Descargar foto',
          icon: !this.platform.is('ios') ? 'ios-download' : null,
          handler: () => {
            let loadDesimg = Loading.create({
              content: "Descargando Fotografia..."
            });
            this.nav.present(loadDesimg);
            setTimeout(() => {
              let headers   = new Headers({
                  'Content-Type': 'application/json'
              });
              let options   = new RequestOptions({ headers: headers});
              this.http.get(this.urlservice+":9090/descargarImg/"+contacto+"",options).subscribe(res => {
                console.log("descargando fotografia");
              }, err => console.log("error al intentar descargar la fotografia"), () => {
                console.log("fotografia descargada");
              });
              loadDesimg.dismiss();
            }, 7000);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    this.nav.present(descargarImgSheet);
  }

}
