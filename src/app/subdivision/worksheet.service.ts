import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

declare var pdfjsLib:any;
declare var Tiff: any;


@Injectable()
export class WorksheetService {
  

  // This is two way communication with other components..
  attachCommunication = new Subject<any>();
  worksheetCommunication = new Subject<any>();
  leafletCommunication = new Subject<any>();
  
  // Private properties to handle certain global variables for other components to use...
  attachments: Array<SUBDIVISIONS> = [];
  canvas: any= null;
  context: any = null;
  image: any = null;
  constructor() { }

  setCanvas(object) {
    this.canvas = object;
  }

  setContext(object) {
    this.context = object;
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

    this.leafletCommunication.next({remove: false, overlay: true, source: this.attachments[index].source, position: this.attachments[index].position});
        
  }
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
