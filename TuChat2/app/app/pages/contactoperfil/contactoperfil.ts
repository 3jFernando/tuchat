import {Page, NavController, NavParams, Alert, Loading} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {LocalNotifications} from 'ionic-native';
import {NgZone} from 'angular2/core';
import {HomePage} from '../home/home';
import {AddressmapPage} from '../addressmap/addressmap';
import {EmailcontactPage} from '../emailcontact/emailcontact';

@Page({
  templateUrl: 'build/pages/contactoperfil/contactoperfil.html',
  providers: [HTTP_PROVIDERS]
})
export class ContactoperfilPage {

  contacto; urlservice; contarcontcontacto; contarcorazones; contarMensajes;

  constructor(public nav: NavController, public params: NavParams, public http: Http, public zone: NgZone) {
    this.nav      = nav;
    this.http     = http;
    this.zone     = zone;

    this.contacto   = params.data.contacto;
    this.urlservice = params.data.urlservice;

    this.getContarContContacto(this.contacto);
    this.getContarCorazones(this.contacto);
    this.getContarMensajes(this.contacto);
  }

  getContarContContacto(contacto) {
    this.http.get(this.urlservice+':9090/contarcontcontacto/'+contacto.usuario_id_esclavo+'').subscribe(res => {
      this.contarcontcontacto = res.json();
      this.contarcontcontacto = this.contarcontcontacto.contactos;
    }, err => console.error("Fallo al cargar la cantidad de contactos por contacto " + err),
    () => console.log("Cantidad de contactos por contacto cargadas con exito"));
  }

  getContarCorazones(contacto) {
    this.http.get(this.urlservice+':9090/contarcorazonescontacto/'+contacto.usuario_id_esclavo+'').subscribe(res => {
      this.contarcorazones = res.json();
      this.contarcorazones = this.contarcorazones.corazones;
    }, err => console.error("Fallo al cargar la cantidad de corazones por contacto " + err),
    () => console.log("Cantidad de corazones por contacto cargadas con exito"));
  }

  getContarMensajes(contacto) {
    this.http.get(this.urlservice+':9090/contactos/'+contacto.usuario_id_esclavo+'').subscribe(res => {
      this.contarMensajes = res.json();
      this.contarMensajes = this.contarMensajes.mensajes;
    }, err => console.error("Fallo al cargar la cantidad de mensajes por contacto " + err),
    () => console.log("Cantidad de mensajes por contacto cargadas con exito"));
  }

  acualizarCorazon(contacto) {
    //http://10.42.0.1:9090/usuarios/11?ping=asd&usuario_id_rey=2
    this.http.put(this.urlservice+':9090/usuarios/o0?ping='+contacto.ping+'&usuario_id_rey='+contacto.usuario_id_rey+'','').subscribe(res => {
      console.log("actualizando el estado del corazon");
    }, err => console.error("Fallo al cargar el estado del corazon" + err),
    () => {
      console.log("Estado del corazon cargado con exito");
      this.getContarCorazones(this.contacto);
    });
  }

  //eliminar contactos por usuario
  eliminarcontacto(contacto) {
    let alertEliminarContacto = Alert.create({
      title: 'Eliminar union!',
      message: '¿Estas seguro de eliminar tu union con '+contacto.nombre+' ?.',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmarEliminarUnion(contacto);
          }
        }
      ]
    });
    this.nav.present(alertEliminarContacto);
  }

  confirmarEliminarUnion(contacto) {
    let eliminandoContacto = Loading.create({
      content: 'Eliminando union'
    });
    this.nav.present(eliminandoContacto);
    setTimeout(() => {
      this.http.delete(this.urlservice+':9090/contactos/'+contacto.ping+'').subscribe(res => {
      }, err => {
        eliminandoContacto.dismiss();
        this.errorAlTrararDeEliminarElContacto(contacto);
      },
      () => {
        eliminandoContacto.dismiss();
        this.notificacionContactoEliminado(contacto);
        this.nav.setRoot(HomePage, {
          urlservice: this.urlservice
        });
      });
    }, 2000);
  }

  errorAlTrararDeEliminarElContacto(contacto) {
    let errorEliminarContacto = Alert.create({
      title: 'Eliminar union!',
      message: 'Ocurrio un error al tratar de eliminar la union :(',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Reintentar',
          handler: () => {
            this.confirmarEliminarUnion(contacto);
          }
        }
      ]
    });
    this.nav.present(errorEliminarContacto);
  }

  notificacionContactoEliminado(contacto) {
    LocalNotifications.schedule({
       title: 'TuChat',
       text: "Se elimino la unión con "+contacto.nombre_usuario,
       sound: ''+this.urlservice+'/audio/android.mp3',
       at: new Date(new Date().getTime() + 3600),
       led: "FF0000"
    });
  }

  goAddressMap(contacto) {
    this.nav.push(AddressmapPage, {
      'urlService': this.urlservice,
      'contacto': contacto
    });
  }

  goEmailContact(contacto) {
    this.nav.push(EmailcontactPage, {
      'urlService': this.urlservice,
      'contacto': contacto
    });
  }


}
