import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {HttpClient} from "@angular/common/http";

declare var pdfjsLib:any;
declare var Tiff: any;


@Injectable()
export class WorksheetService {
  

  // This is two way communication with other components..
  attachCommunication = new Subject<any>();
  worksheetCommunication = new Subject<any>();
  leafletCommunication = new Subject<any>();
  editingCommunication = new Subject<any>();
  
  // Private properties to handle certain global variables for other components to use...
  attachments: Array<SUBDIVISIONS> = [];
  canvas: any= null;
  context: any = null;
  image: any = null;
  url: string = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";

  attributes: WORKSHEET = {streets: [], 
    LV: { eng_dev: {checkbox: true, date: "test"}, online_carson: {checkbox: true, date: "carson"}, city: {checkbox: true, date: "online"} }, };

  constructor(private http: HttpClient) { }

  setCanvas(object) {
    this.canvas = object;
  }

  setContext(object) {
    this.context = object;
  }


  GET_METHOD(page) {
    return  this.http.get(this.url + page);
  }

  processRotation(id, source) {

   // this.image=document.createElement("img");
    var size = this.attachments.length;
    var index = -1;

    for(var i = 0; i < size; i++) {
      if(id == this.attachments[i].position) {
         index = i;
         break;
      }
   }

    this.attachments[index].image.onload = () => {

       
        var degrees = this.attachments[index].degrees += 90 % 360;

        this.rotateGeoImage(degrees, index);
    }
    
    this.attachments[index].image.src = source
  
  }

  rotateGeoImage(degrees, index) {

    if(degrees == 90 || degrees == 270) {
        this.canvas.width  =  this.attachments[index].image.height;
        this.canvas.height = this.attachments[index].image.width;
    } else {
        this.canvas.width =  this.attachments[index].image.width;
        this.canvas.height = this.attachments[index].image.height;
    }

     this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    if(degrees == 90 || degrees == 270) {
        this.context.translate(this.attachments[index].image.height/2,this.attachments[index].image.width/2);
    } else {
        this.context.translate(this.attachments[index].image.width/2, this.attachments[index].image.height/2);
   }
    this.context.rotate(degrees*Math.PI/180);
    this.context.drawImage(this.attachments[index].image,-this.attachments[index].image.width/2,-this.attachments[index].image.height/2);

    this.attachments[index].source = this.canvas.toDataURL();

    // Only run this command if the rotation is the one selected...
    if(this.attachments[index].selected) {
      this.leafletCommunication.next({remove: false, overlay: true, source: this.attachments[index].source, position: this.attachments[index].position});
        
    }
  
  }
}

export interface WORKSHEET {
  objectid?: number;
  sub_name?: string;
  tax_account?: string;
  community?: string;
  esn?: number;
  geojson?: any;
  streets?: Array<STREET>;
  LV?: LV;
  DB?: DB;
  GIS?: GIS;

}


export interface LV {
   eng_dev?: LV_OPTIONS;
   online_carson?: LV_OPTIONS;
   city?: LV_OPTIONS;
   address_by?: number;
   date_sign_off?: any;
   sign_off_by?: any;
}

export interface LV_OPTIONS {
  checkbox?: boolean;
  date?: any;
}

export interface DB {
  msag?: DB_MSAG;
  plat_scan?: DB_PLAT;
  date_sign_off?: any;
  sign_off_by?: number

}

export interface DB_MSAG {
  checkbox_enter?: boolean;
  checkbox_update?: boolean;
  checkbox_verified?: boolean;
  enter_date?: any;
  update_date?: any;
  verified_date?: any;
}

export interface DB_PLAT {
  checkbox_enter?: boolean;
  checkbox_update?: boolean;
  checkbox_verified?: boolean;
  enter_date?: any;
  update_date?: any;
  verified_date?: any;
}

export interface GIS {
  map_items?: any;
  mapping_verified?: any;
  geocoding_verified?: any;
  date_sign_off?: any;
  sign_off_by?: number;

}

export interface GIS {

}

export interface STREET {
  st_name?: string;
  low?:  string;
  high?: string;
  street_id?: number;
}




// This Holds The Name, Source, position holds unique id, selected from the attachments
// file object holds the original file uploaded to the web client..
// this is the private properties..
export interface SUBDIVISIONS {
  name: string;
  source: string;
  position?: number;
  selected?: boolean;
  file?: any;
  degrees?: number;
  image?: any;
}
