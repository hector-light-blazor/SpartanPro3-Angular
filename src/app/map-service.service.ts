import { Injectable } from '@angular/core';

@Injectable()
export class MapServiceService {

  // This service to handle functions from tool bar to map object...
  // and anything else...

  identifyObject: any;
  identifyParams: any;
  identifyResponse: any;
  mapObject: any;
  cursor: string = "default";
  iOn: boolean = false;
  constructor() { }

  setMapObj(obj) {
    this.mapObject = obj;
  }

  setCursor(selection:string) {
    this.iOn = true;
    this.cursor = selection;

  }

}
