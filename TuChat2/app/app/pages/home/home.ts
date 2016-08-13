import {Page, Platform, Alert, ActionSheet, NavController, NavParams, Loading} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {NgZone} from 'angular2/core';
import {LocalNotifications} from 'ionic-native';

import {MensajesPage} from '../mensajes/mensajes';
import {AddFriendsPage} from '../add-friends/add-friends';
import {ConfigDataPage} from '../config-data/config-data';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HTTP_PROVIDERS]
})
export class HomePage {

  usuario; data; contactos; nohaycontactos; urlservice; numeroDeContactos; numeroDeCorazones;
  cantidadNotificaciones; notificaciones; socket; pkt;

  constructor(public platform: Platform, public params: NavParams, public nav: NavController, public http: Http, public zone: NgZone) {
    this.platform = platform;
    this.nav      = nav;
    this.http     = http;
    this.zone     = zone;
    this.urlservice = params.data.urlservice;

    //capturando al usuario que inicio sesion
    this.data = window.localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.data);
    this.usuario = this.usuario.usuario;

    this.contactos = [];
    this.nohaycontactos = [];
    this.cargarContactos(this.usuario);
    //metodo que carga contactos por usuario
    this.getContarContUsuario(this.usuario);
    this.getContarCorazones(this.usuario);
    this.getMensajesNuevos(this.usuario);
    this.actualizarEntuchat(this.usuario.id);

    this.pkt = {
      data: '',
      room: 'room2'
    };
    this.socket = io.connect(this.urlservice+':5000');
    this.socket.on(this.pkt.room + 'entuchatactivo', (estado) => {
	    	this.zone.run(() => {
	    		this.cargarContactos(this.usuario);
	    	});
	  });
    this.socket.on(this.pkt.room + 'entuchatinactivo', (estado) => {
	    	this.zone.run(() => {
	    		this.cargarContactos(this.usuario);
	    	});
	  });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.cargarContactos(this.usuario);
      this.getContarContUsuario(this.usuario);
      this.getContarCorazones(this.usuario);
      this.getMensajesNuevos(this.usuario);
      this.actualizarDatosPersonalesUsuarioActual();
      refresher.complete();
    }, 2000);
  }

  getContarContUsuario(usuario) {
    this.http.get(this.urlservice+':9090/contarcontcontacto/'+usuario.id+'').subscribe(res => {
      this.numeroDeContactos = res.json();
      this.numeroDeContactos = this.numeroDeContactos.contactos;
    }, err => console.error("Fallo al cargar la cantidad de contactos por contacto " + err),
    () => console.log("Cantidad de contactos por contacto cargadas con exito"));
  }

  getContarCorazones(usuario) {
    this.http.get(this.urlservice+':9090/contarcorazonescontacto/'+usuario.id+'').subscribe(res => {
      this.numeroDeCorazones = res.json();
      this.numeroDeCorazones = this.numeroDeCorazones.corazones;
    }, err => console.error("Fallo al cargar la cantidad de corazones por contacto " + err),
    () => console.log("Cantidad de corazones por contacto cargadas con exito"));
  }

  //cargar contactos por usuario
  cargarContactos(usuario) {
    this.http.get(this.urlservice+':9090/listadecontactos?usuario_id_rey='+usuario.id+'').subscribe(res => {
          this.contactos = res.json();
          this.contactos = this.contactos.sihaycontactos;
          this.nohaycontactos = res.json();
          this.nohaycontactos = this.nohaycontactos.nohaycontactos;
    }, err => {
      let falloAlCargarLosContactos = Alert.create({
          title: 'FALLO :(',
          message: '¡Upss, parece que ocurrio un error al tratar de cargar tus contactos.'
          +'Asegurate de tener conexion a intenet e intentalo de nuevo :) .!',
          buttons: [ { text: 'Cancelar' },
            {
              text: 'Reintentar',
              handler: () => {
                this.cargarContactos(this.usuario);
                this.getContarContUsuario(this.usuario);
                this.getContarCorazones(this.usuario);
                this.getMensajesNuevos(this.usuario);
                this.actualizarDatosPersonalesUsuarioActual();
              }
            }
          ]
      });
      this.nav.present(falloAlCargarLosContactos);
    },
    () => console.log("Carga de contactos completada"));
  }

  actualizarEntuchat(id) {
    this.http.put(this.urlservice+':9090/actualizarentuchat?id='+id+'&entuchat=1','').subscribe(res => {
        console.log('entuchat actualizado');
    }, err => console.error("Fallo al actualziar entuchat" + err),
    () => console.log(':D'));
    setTimeout(() => {
      this.pkt.data = "";
      this.socket.emit('entuchatactivo', this.pkt);
    },500);
  }

  verInfo0(contacto) {
    let alertVerInfo0 = Alert.create({
      title: "<center>"+contacto.nombre_usuario+"</center>",
      message: "<img src='img/code.png'>"
    });
    this.nav.present(alertVerInfo0);
  }
  verInfo1(contacto) {
    let conImagen = this.urlservice+":9090/resouce/tuchat-"+contacto.usuario_id_esclavo+".png";
    let alertVerInfo1 = Alert.create({
      title: "<center>"+contacto.nombre_usuario+"</center>",
      message: "<img src='"+conImagen+"'>"
    });
    this.nav.present(alertVerInfo1);
  }

  perfil(usuario) {
    let actionPerfil = ActionSheet.create({
    title: ''+this.usuario.nombre+'',
    buttons: [
      {
        text: 'Perfil',
        icon: !this.platform.is('ios') ? 'ios-contact' : null,
        handler: () => {
          setTimeout(() => {
            this.nav.push(ConfigDataPage, {
              urlservice: this.urlservice
            });
          },1000);
        }
      },
      {
        text: 'Cerrar Sesion',
        icon: !this.platform.is('ios') ? 'ios-log-in' : null,
        handler: () => {
          this.logout();
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
  });
  this.nav.present(actionPerfil);
  }

  //mensajes por usuario
  enviarmensajes(contacto) {
    this.http.delete(this.urlservice+':9090/notificaciones/'+contacto.usuario_id_esclavo+'?usuario_id_rey='+contacto.id+'').subscribe(res => {
      console.log("eliminando notificaciones");
      this.getMensajesNuevos(this.usuario);
    }, err => {
      console.error("Fallo al eliminar las notificaciones");
      let fallo = Alert.create({
          title: 'FALLO :(',
          message: '¡Upss, parece que ocurrio un error al tratar de cargar los datos.'
          +'Asegurate de tener conexion a intenet e intentalo de nuevo :) .!',
          buttons: [ { text: 'Cancelar' },
            {
              text: 'Reintentar',
              handler: () => {
                this.enviarmensajes(contacto);
              }
            }
          ]
      });
      this.nav.present(fallo);
    },
    () => {
      console.log("Notificaciones eliminadas con exito");
      this.nav.push(MensajesPage, {
        contacto: contacto,
        urlservice: this.urlservice,
        usuario: this.usuario
      });
    });
  }

  refresh() {
    let loading = Loading.create({
      content: 'Actualizando datos..'
    });
    this.nav.present(loading);
    setTimeout(() => {
      this.cargarContactos(this.usuario);
      this.getContarContUsuario(this.usuario);
      this.getContarCorazones(this.usuario);
      this.getMensajesNuevos(this.usuario);
      this.actualizarDatosPersonalesUsuarioActual();
      loading.dismiss();
    }, 2000);
  }

  actualizarDatosPersonalesUsuarioActual() {
    this.http.get(this.urlservice+':9090/iniciarsesion?nombre_usuario='+this.usuario.nombre_usuario+'&clave='+this.usuario.clave+'').subscribe(res => {
      this.usuario = res.json();
      if(this.usuario.usuario) {
          this.usuario.usuario.forEach((item, index) => {
            this.usuario = item;
            let user = JSON.stringify({
              usuario: this.usuario
            });
            window.localStorage.removeItem('usuario');
            window.localStorage.setItem('usuario', user);
          });
        }
    }, err => {
      let fallo = Alert.create({
          title: 'FALLO :(',
          message: '¡Upss, parece que ocurrio un error al tratar de actualizar tus datos.'
          +'Asegurate de tener conexion a intenet e intentalo de nuevo :) .!',
          buttons: [{text: 'Cancelar'},{text: 'Reintentar'}]
      });
      this.nav.present(fallo);
    },() => console.log("Se actualizaron los datos en el localStora completado"));
  }

  getMensajesNuevos(usuario) {
    this.http.get(this.urlservice+':9090/notificaciones/'+usuario.id+'').subscribe(res => {
          this.cantidadNotificaciones = res.json();
          this.notificaciones         = res.json();

          this.cantidadNotificaciones = this.cantidadNotificaciones.cantidadNotificaciones;
          this.notificaciones         = this.notificaciones.notificaciones;
    }, err => console.error("Fallo al cargar los mensajes nuevos"),
    () => console.log("Mensjaes nuevos cargados con exito"));
  }

  addContactos() {
    this.nav.push(AddFriendsPage, {
      urlservice: this.urlservice
    });
  }

  //eliminar contactos por usuario
  eliminarcontacto(contacto) {
    let alertEliminarContacto = Alert.create({
      title: 'Eliminar union!',
      message: '¿Estas seguro de eliminar tu union con '+contacto.nombre+' ?.',
      buttons: [ { text: 'Cancelar' },
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
        this.cargarContactos(this.usuario);
        this.getContarContUsuario(this.usuario);
        this.getContarCorazones(this.usuario);
        this.getMensajesNuevos(this.usuario);
        this.notificacionContactoEliminado(contacto);
      });
    }, 2000);
  }

  errorAlTrararDeEliminarElContacto(contacto) {
    let errorEliminarContacto = Alert.create({
      title: 'Eliminar union!',
      message: 'Ocurrio un error al tratar de eliminar la union :(',
      buttons: [ { text: 'Cancelar' },
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
       sound: ''+this.urlservice+':9090/audio/android.mp3',
       at: new Date(new Date().getTime() + 3600),
       led: "FF0000"
    });
  }

  //cerrar la sesion del usuario
  logout() {
    let alert = Alert.create({
      title: 'Cerrar sesion',
      message: '¿Esta seguro que desea cerrar sesion?',
      buttons: [ { text: 'Cancelar' },
        {
          text: 'Salir',
          handler: () => {
            let loadginSesion = Loading.create({
              content: 'Estamos cerrando tu sesion.'
            });
            this.nav.present(loadginSesion);
            setTimeout(() => {
                window.localStorage.removeItem('usuario');
                this.http.put(this.urlservice+':9090/actualizarentuchat?id='+this.usuario.id+'&entuchat=','').subscribe(res => {
                    console.log('entuchat actualizado');
                }, err => console.error("Fallo al actualziar entuchat" + err),
                () => console.log("entuchat actualizado"));
                this.nav.setRoot(LoginPage);
                loadginSesion.dismiss();
                setTimeout(() => {
                  this.pkt.data = "";
                  this.socket.emit('entuchatinactivo', this.pkt);
                },500);
            }, 2000);
          }
        }
      ]
    });
    this.nav.present(alert);
  }

}
