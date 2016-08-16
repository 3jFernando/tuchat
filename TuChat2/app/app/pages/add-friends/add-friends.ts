import {Page, NavController, NavParams, Alert, Loading} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {LocalNotifications} from 'ionic-native';
import {VisorfotosPage} from '../visorfotos/visorfotos';

@Page({
  templateUrl: 'build/pages/add-friends/add-friends.html',
  providers: [HTTP_PROVIDERS]
})
export class AddFriendsPage {

  usuarios; data; usuario; urlservice; searchQuery; unionExistente;

  constructor(public nav: NavController, public params: NavParams, public http: Http, public zone: NgZone) {
    this.nav    = nav;
    this.zone   = zone;
    this.http   = http;
    this.urlservice = params.data.urlservice;

    this.searchQuery = '';

    //captuar el usuario activo en la sesion
    this.data = window.localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.data);
    this.usuario = this.usuario.usuario;


    this.usuarios = [];
    this.getUsuarios();
    this.unionExistente = '';
  }

  //metodo que invoca al socket para obtener los usuarios
  getUsuarios() {
    this.http.get(this.urlservice+':9090/usuarios?id='+this.usuario.id+'').subscribe(res => {
        this.usuarios = res.json();
    }, err => {
      let falloAlCargarLosUsuario = Alert.create({
          title: 'FALLO :(',
          message: '¡Upss, parece que ocurrio un error al tratar de cargar los usuarios.'
          +'Asegurate de tener conexion a intenet e intentalo de nuevo :) .!',
          buttons: [
            {
                text: 'Cancelar'
            },
            {
              text: 'Reintentar',
              handler: () => {
                this.getUsuarios();
              }
            }
          ]
      });
      this.nav.present(falloAlCargarLosUsuario);
    },() => console.log("Carga de usuarios completada"));
  }

  addUsuario(usuario) {
    let alert = Alert.create({
      title: 'Agregar usuario!',
      message: '¿Estas seguro que deseas unirte con '+usuario.nombre,
      buttons: [
        {
          text: 'Unirme',
          handler: () => {
            let cargando = Loading.create({
              content: 'Nueva union con '+usuario.nombre
            });
            this.nav.present(cargando);
            setTimeout(() => {
              this.http.post(this.urlservice+':9090/agregarContactos'
                  +'?usuario_id_rey='+this.usuario.id
                  +'&usuario_id_esclavo='+usuario.id+'','').subscribe(res => {
                    console.log("Enviando datos");
                    this.unionExistente = res.json();
                    this.unionExistente = this.unionExistente.error;
                    if(this.unionExistente !== '') {
                        this.laUnionYaExisteAlert(usuario);
                    }
                }, err => console.error("Error al cargar los usuarios" + err),
                () => console.log("Carga de usuarios completada"));
                this.notificacion(usuario);
              cargando.dismiss();
            }, 3000);
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    this.nav.present(alert);

  }

  laUnionYaExisteAlert(usuario) {
      let unionAlert = Alert.create({
          title: ''+this.usuario.nombre+'',
          message: 'Ya estas unido a '+usuario.nombre+'. Recuerda que no puedes unirte dos veses con el mismo usuario',
          buttons: [{ text: 'Vale!' }]
      });
      this.nav.present(unionAlert);
  }

  notificacion(usuario) {
    LocalNotifications.schedule({
      title: 'Tienes una nuevo union.',
      text: 'Con '+usuario.nombre_usuario,
      icon: ''+this.urlservice+'/resouce/tuchat-'+usuario.id+'.png',
      sound: ''+this.urlservice+'/audio/ios.caf',
      at: new Date(new Date().getTime() + 3600),

    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.usuarios = [];
      this.getUsuarios();
      refresher.complete();
    }, 2000);
  }

  getItems(searchbar) {
    this.getUsuarios();
    //valor del input
    var q = searchbar.value;
    //validamos si tiene datos el input
    if(q.trim() == '') {
      return;
    }
    this.usuarios = this.usuarios.filter((v) => {
      if(v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }

  viewInfoimg(usuario) {
    this.nav.push(VisorfotosPage, {
      url: "resouce/",
      contacto: "tuchat-"+usuario.id+"",
      tipo: ".png",
      ncontacto: usuario.nombre,
      urlservice: this.urlservice,
    });
  }

}
