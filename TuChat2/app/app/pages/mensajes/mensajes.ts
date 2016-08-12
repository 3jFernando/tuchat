import {Page, NavController, NavParams, Keyboard} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {NgZone} from 'angular2/core';

import {ContactoperfilPage} from '../contactoperfil/contactoperfil';

@Page({
  templateUrl: 'build/pages/mensajes/mensajes.html',
  providers: [HTTP_PROVIDERS]
})
export class MensajesPage {

  contacto; urlservice; mensaje; usuario; mensajes; socket; model; pkt;

  pantalla: string = "chat";
  isAndroid: boolean = false;

  constructor(public nav: NavController, public params: NavParams, public http: Http, public zone: NgZone, public keyboard: Keyboard) {
    this.nav        = nav;
    this.http       = http;
    this.zone       = zone;
    this.keyboard   = keyboard;

    this.contacto   = params.data.contacto;
    this.urlservice = params.data.urlservice;
    this.usuario    = params.data.usuario;
    this.mensaje    = '';
    this.mensajes   = [];
    this.listarmensajes(this.contacto);
    this.pkt = {
      data: '',
      room: 'room1'
    };
    this.socket = io.connect(this.urlservice+':5000');
    this.socket.on(this.pkt.room + 'message', (msg) => {
	    	this.zone.run(() => {
	    		this.listarmensajes(this.contacto);
	    	});
	  });
    setTimeout(() => {
      this.keyboard.isOpen()
    }, 300);
  }

  perfilcontacto(contacto) {
      this.nav.push(ContactoperfilPage, {
        contacto: contacto,
        urlservice: this.urlservice
      });
  }

  enviarmensaje(){
    this.http.post(this.urlservice+':9090/mensajes'
      +'?usuario_id_rey='+this.usuario.id
      +'&usuario_id_esclavo='+this.contacto.usuario_id_esclavo
      +'&mensaje='+this.mensaje
      +'&ping='+this.contacto.ping
      +'&tipo=text','').subscribe(res => {
          console.log("enviado mensaje");
      }, err => console.error("Fallo al enviar el mensaje " + err),
      () => console.log("Mensaje enviado"));

      this.notificarMensajesNuevos();
      setTimeout(() => {
        this.pkt.data = this.mensaje;
        this.socket.emit('message', this.pkt);
      },500);
      this.mensaje = '';
  }

  listarmensajes(contacto) {
    this.http.get(this.urlservice+':9090/mensajes/'+contacto.ping+'').subscribe(res => {
      this.mensajes = res.json();
      this.mensajes = this.mensajes.mensajes;
    }, err => console.error("Fallo al cargar los mensajes " + err),
    () => console.log("Mensajes cargados"));
  }

  notificarMensajesNuevos() {
    this.http.post(this.urlservice+':9090/notificaciones?usuario_id_rey='+this.contacto.id+'&usuario_id_esclavo='+this.usuario.id+'&estado=1','').subscribe(res => {
        console.log('se esta enviando la notificacion del nuevo mensaje');
    },err => console.error("Fallo al crear la notificacion " + err),
    () => console.log("Notificacion creada con exito"));
  }

}
