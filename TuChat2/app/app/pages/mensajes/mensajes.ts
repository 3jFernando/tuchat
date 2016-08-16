import {Page, NavController, Loading, Alert, Platform, ActionSheet,NavParams} from 'ionic-angular';
import {Http, HTTP_PROVIDERS, Headers, RequestOptions} from 'angular2/http';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {ContactoperfilPage} from '../contactoperfil/contactoperfil';
import {VisorfotosPage} from '../visorfotos/visorfotos';

@Page({
  templateUrl: 'build/pages/mensajes/mensajes.html',
  providers: [HTTP_PROVIDERS]
})
export class MensajesPage {

  contacto; urlservice; mensaje; nohaymensaje; usuario; mensajes; socket; model; pkt; photosms;

  constructor(public nav: NavController, public platform: Platform, public params: NavParams, public http: Http, public zone: NgZone) {
    this.nav        = nav;
    this.http       = http;
    this.platform   = platform;
    this.zone       = zone;

    this.contacto   = params.data.contacto;
    this.urlservice = params.data.urlservice;
    this.usuario    = params.data.usuario;
    this.mensaje    = '';
    this.nohaymensaje = '';
    this.mensajes   = [];
    this.listarmensajes(this.contacto);
    this.pkt = {
      data: '',
      room: 'room1',
    };
    this.socket = io.connect(this.urlservice+':5000');
    this.socket.on(this.pkt.room + 'message', (msg) => {
	    	this.zone.run(() => {
	    		this.listarmensajes(this.contacto);
	    	});
	  });
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

  cargarFotosms() {
    let actionFoto = ActionSheet.create({
      title: 'ENVIALE UNA FOTOGRAFIA',
      buttons: [
        {
          text: 'Desde la Galeria',
          icon: !this.platform.is('ios') ? 'md-images' : null,
          handler: () => {
            let options = {
                  quality: 100,
                  destinationType: 0,
                  sourceType: 0,
                  allowEdit: false,
                  encodingType: 1,
                  saveToPhotoAlbum: false,
                  targetWidth: 300,
                  targetHeight: 300,
              };
              Camera.getPicture(options).then((imageData) => {
                  let base64Image = "data:image/jpeg;base64," + imageData;
                  this.zone.run(() => {
                    let foto      = base64Image;
                    let body      = JSON.stringify({
                        foto: foto
                    });
                    let headers   = new Headers({
                        'Content-Type': 'application/json'
                    });
                    let options   = new RequestOptions({ headers: headers});

                    this.http.post(this.urlservice+':9090/mensajes'
                      +'?usuario_id_rey='+this.usuario.id
                      +'&usuario_id_esclavo='+this.contacto.usuario_id_esclavo
                      +'&mensaje='+''
                      +'&ping='+this.contacto.ping
                      +'&tipo=img',body,options).subscribe(res => {
                          console.log("imgsms enviando");
                      }, err => console.error("Fallo al enviar la imgsms " + err),
                      () => console.log("sms enviado"));
                      this.notificarMensajesNuevos();
                  });
                  setTimeout(() => {
                    this.pkt.data = this.mensaje;
                    this.socket.emit('message', this.pkt);
                  },1000);
                  this.mensaje = '';
              }, (err) => {
                  console.error(err);
              });
          }
        },
        {
          text: 'Desde la Camara',
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            let options = {
                  quality: 100,
                  destinationType: 0,
                  sourceType: 1,
                  allowEdit: false,
                  encodingType: 1,
                  saveToPhotoAlbum: false,
                  targetWidth: 300,
                  targetHeight: 300,
              };
              Camera.getPicture(options).then((imageData) => {
                  let base64Image = "data:image/jpeg;base64," + imageData;
                  this.zone.run(() => {
                    let foto      = base64Image;
                    let body      = JSON.stringify({
                        foto: foto
                    });
                    let headers   = new Headers({
                        'Content-Type': 'application/json'
                    });
                    let options   = new RequestOptions({ headers: headers});

                    this.http.post(this.urlservice+':9090/mensajes'
                      +'?usuario_id_rey='+this.usuario.id
                      +'&usuario_id_esclavo='+this.contacto.usuario_id_esclavo
                      +'&mensaje='+''
                      +'&ping='+this.contacto.ping
                      +'&tipo=img',body,options).subscribe(res => {
                          console.log("imgsms enviando");
                      }, err => console.error("Fallo al enviar la imgsms " + err),
                      () => console.log("sms enviado"));
                      this.notificarMensajesNuevos();
                  });
                  setTimeout(() => {
                    this.pkt.data = this.mensaje;
                    this.socket.emit('message', this.pkt);
                  },1000);
                  this.mensaje = '';
              }, (err) => {
                  console.error(err);
              });
          }
        },
        {
          text: 'Cancelar',
          icon: !this.platform.is('ios') ? 'md-close-circle' : null,
          role: 'cancel'
        }
      ]
    });
    this.nav.present(actionFoto);
  }

  listarmensajes(contacto) {
    this.http.get(this.urlservice+':9090/mensajes/'+contacto.ping+'').subscribe(res => {
      this.mensajes = res.json();
      this.mensajes = this.mensajes.sihaymensajes;
      this.nohaymensaje = res.json();
      this.nohaymensaje = this.nohaymensaje.nohaymensajes;
    }, err => console.error("Fallo al cargar los mensajes " + err),
    () => console.log("Mensajes cargados"));
  }

  notificarMensajesNuevos() {
    this.http.post(this.urlservice+':9090/notificaciones?usuario_id_rey='+this.contacto.id+'&usuario_id_esclavo='+this.usuario.id+'&estado=1','').subscribe(res => {
        console.log('se esta enviando la notificacion del nuevo mensaje');
    },err => console.error("Fallo al crear la notificacion " + err),
    () => console.log("Notificacion creada con exito"));
  }

  infosms(mensaje) {

    if(mensaje.tipo === 'text') {
        let alertInfosms = Alert.create({
          title: "Visto",
          message: "Enviado: "+mensaje.created_at+". SMS: "+mensaje.mensaje+"",
          buttons: [{ text: 'Cancelar' },
            {
              text: "Borrar",
              handler: () => {
                this.http.delete(this.urlservice+":9090/mensajes/"+mensaje.id+"").subscribe(res => {
                  let dialogElimsms = Loading.create({
                    content: "Eliminando mensaje..."
                  });
                  this.nav.present(dialogElimsms);
                  setTimeout(() => {
                    dialogElimsms.dismiss();
                  }, 600);
                }, err => console.log("sms error delete"), () => {
                  setTimeout(() => {
                    this.pkt.data = this.mensaje;
                    this.socket.emit('message', this.pkt);
                  },500);
                  this.mensaje = '';
                });
              }
            }
          ]
        });
        this.nav.present(alertInfosms);
    } else if(mensaje.tipo === 'img') {
        let alertInfosms = Alert.create({
          title: "Visto",
          message: "Enviado: "+mensaje.created_at+". <br>Presiona 'VER', para visualizar la fotografia en su tamaño real.",
          buttons: [
            {
              text: 'Ver',
              handler: () => {
                this.nav.push(VisorfotosPage, {
                  url: "imgsms/",
                  contacto: ""+mensaje.mensaje,
                  tipo: ".png",
                  ncontacto: mensaje.created_at,
                  urlservice: this.urlservice,
                });
              }
            },
            {
              text: "Borrar",
              handler: () => {
                this.http.delete(this.urlservice+":9090/mensajes/"+mensaje.id+"").subscribe(res => {
                  let dialogElimsms = Loading.create({
                    content: "Eliminando mensaje..."
                  });
                  this.nav.present(dialogElimsms);
                  setTimeout(() => {
                    dialogElimsms.dismiss();
                  }, 600);
                }, err => console.log("sms error delete"), () => {
                  setTimeout(() => {
                    this.pkt.data = this.mensaje;
                    this.socket.emit('message', this.pkt);
                  },500);
                  this.mensaje = '';
                });
              }
            }
          ]
        });
        this.nav.present(alertInfosms);
    }
  }

}
