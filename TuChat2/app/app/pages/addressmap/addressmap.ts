import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/addressmap/addressmap.html',
})
export class AddressmapPage {

  urlService; contacto;
  map: any;
  apiKey: 'AIzaSyAKEAE6aWlxS4ln2wglkPmQmhNXlJP_9E4';

  constructor(public nav: NavController, public params: NavParams) {
    this.nav = nav;
    this.urlService = params.data.urlservice;
    this.contacto   = params.data.contacto;

    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    if(typeof google == "undefined" || typeof google.maps == "undefined") {
      //Load the SDK
      window.mapInit = () => {
        this.initMap();
      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      if(this.apiKey){
          script.src = 'http://maps.google.com/maps/api/js?key='+this.apiKey+'&callback=mapInit';
      } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
      }
      document.body.appendChild(script);
    }
  }

  initMap(){
    let mapOptions = {
      center: {lat: 1.8523192510203763, lng: -76.04569897055626},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

}
