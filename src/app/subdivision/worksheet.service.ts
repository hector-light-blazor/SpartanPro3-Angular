import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class WorksheetService {
  

  attachCommunication = new Subject<any>();
  worksheetCommunication = new Subject<any>();

  attachments: Array<SUBDIVISIONS> = [];

  constructor() { }

}


// This Holds The Name, Source, position holds unique id, selected from the attachments
// file object holds the original file uploaded to the web client..
// this is the private properties..
interface SUBDIVISIONS {
  name: string;
  source: string;
  position?: number;
  selected?: boolean;
  file?: any;
}
