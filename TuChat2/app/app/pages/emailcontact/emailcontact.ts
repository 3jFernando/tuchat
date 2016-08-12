import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/emailcontact/emailcontact.html',
})
export class EmailcontactPage {

  urlService; contacto;

  constructor(public nav: NavController, public params: NavParams) {
    this.nav = nav;
    this.urlService = params.data.urlservice;
    this.contacto   = params.data.contacto;
  }
}
