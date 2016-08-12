import {Page, NavController, ActionSheet, Alert, Platform, Loading, NavParams} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {Http, HTTP_PROVIDERS, Headers, RequestOptions} from 'angular2/http';

@Page({
  templateUrl: 'build/pages/config-data/config-data.html',
  providers:  [HTTP_PROVIDERS]
})
export class ConfigDataPage {

  data; usuario; urlservice; photo;
  nombre; nombre_usuario; telefono; direccion; correo; estado;

  constructor(public nav: NavController, public platform: Platform, public zone: NgZone, public http: Http, public params: NavParams) {
    this.nav      = nav;
    this.platform = platform;
    this.zone     = zone;
    this.urlservice = params.data.urlservice;

    this.data = window.localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.data);
    this.usuario = this.usuario.usuario;
  }

  carbiarFotografia() {
      let actionFoto = ActionSheet.create({
        title: 'ESTABLECER FOTOGRAFIA',
        buttons: [
          {
            text: 'Abrir Galeria',
            icon: !this.platform.is('ios') ? 'md-images' : null,
            handler: () => {
              let options = {
                    quality: 100,
                    destinationType: 0,
                    sourceType: 0,
                    allowEdit: true,
                    encodingType: 1,
                    saveToPhotoAlbum: false,
                    targetWidth: 300,
                    targetHeight: 300,
                };
                Camera.getPicture(options).then((imageData) => {
                    let base64Image = "data:image/jpeg;base64," + imageData;
                    this.zone.run(() => this.photo = base64Image);
                }, (err) => {
                    console.error(err);
                });
            }
          },
          {
            text: 'Abrir Camara',
            icon: !this.platform.is('ios') ? 'md-camera' : null,
            handler: () => {
              let options = {
                    quality: 100,
                    destinationType: 0,
                    sourceType: 1,
                    allowEdit: true,
                    encodingType: 1,
                    saveToPhotoAlbum: false,
                    targetWidth: 300,
                    targetHeight: 300,
                };
                Camera.getPicture(options).then((imageData) => {
                    let base64Image = "data:image/jpeg;base64," + imageData;
                    this.zone.run(() => this.photo = base64Image);
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

  sendImage(id) {
      this.procesoDeActualizarFotoDePerfil(id);
  }

  procesoDeActualizarFotoDePerfil(id) {
    let loadingFoto = Loading.create({
      content: 'Actualizado foto de perfil..'
    });
    this.nav.present(loadingFoto);
    setTimeout(() => {
      let url       = this.urlservice+":9090/actualizarfotografia/"+id;
      let foto      = this.photo;
      let body      = JSON.stringify({
          foto: foto
      });
      let headers   = new Headers({
          'Content-Type': 'application/json'
      });
      let options   = new RequestOptions({ headers: headers});

      this.http.put(url, body, options)
               .subscribe(res => {
                   console.log("Subscribiendose..");
               }, err => console.error("Fallido: " + err),
               () => console.log("Completado."));
      this.actualizarDatosUsuarioActual();
      loadingFoto.dismiss();
    }, 3000);
  }

  actualizarDatosUsuarioActual() {
    this.http.get(this.urlservice+':9090/iniciarsesion?nombre_usuario='+this.usuario.nombre_usuario+'&clave='+this.usuario.clave+'').subscribe(res => {
      this.usuario = res.json();
      if(this.usuario.usuario) {
          window.localStorage.removeItem('usuario');
          this.usuario.usuario.forEach((item, index) => {
            this.usuario = item;
            let user = JSON.stringify({
              usuario: this.usuario
            });
            window.localStorage.setItem('usuario', user);
          });
        }
    }, err => {
      let falloAlGuardarLaImagen = Alert.create({
          title: 'FALLO :(',
          message: '¡Upss, parece que ocurrio un error al tratar de actualizar tu imagen de perfil.'
          +'Asegurate de tener conexion a intenet e intentalo de nuevo :) .!',
          buttons: [
            {
                text: 'Cancelar'
            },
            {
              text: 'Reintentar',
              handler: () => {
                  this.procesoDeActualizarFotoDePerfil(this.usuario.id);
              }
            }
          ]
      });
      this.nav.present(falloAlGuardarLaImagen);
    },() => console.log("Se actualizaron los datos en el localStora completado"));
  }

  guardarCambios(usuario) {
    let loadingActualizarDatos = Loading.create({
      content: 'Actualizando datos..'
    });
    this.nav.present(loadingActualizarDatos);
    setTimeout(() => {
      loadingActualizarDatos.dismiss();
      //http://10.42.0.1:9090/actualizardatos?id=4&nombre=Solenit Londoño&nombre_usuario=&telefono=&direccion=&estado=&correo=
      this.http.put(this.urlservice+':9090/actualizardatos'+
        '?id='+usuario.id+
        '&nombre='+usuario.nombre+
        '&nombre_usuario='+usuario.nombre_usuario+
        '&telefono='+usuario.telefono+
        '&direccion='+usuario.direccion+
        '&estado='+usuario.estado+
        '&correo='+usuario.correo,'').subscribe(res => {
          this.actualizarDatosPersonalesUsuarioActual();
        }, err => {
          let alertFallo = Alert.create({
            title: 'Fallo!',
            message: 'Upss, ocurrio un error al tratar de actualizar los datos, por favor verifica tu conexion a internet e intentalo de nuevo.',
            buttons: [
              {
                text: 'cancelar',
                handler: () => {
                  return;
                }
              },
              {
                text: 'Reintentar',
                handler: () => {
                  this.guardarCambios(usuario);
                }
              }
            ]
          });
          this.nav.present(alertFallo);
        }, () => console.log('datos actualizados con exito'));
    },2000);
  }

  actualizarDatosPersonalesUsuarioActual() {
    this.http.get(this.urlservice+':9090/iniciarsesion?nombre_usuario='+this.usuario.nombre_usuario+'&clave='+this.usuario.clave+'').subscribe(res => {
      this.usuario = res.json();
      if(this.usuario.usuario) {
          window.localStorage.removeItem('usuario');
          this.usuario.usuario.forEach((item, index) => {
            this.usuario = item;
            let user = JSON.stringify({
              usuario: this.usuario
            });
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

}
