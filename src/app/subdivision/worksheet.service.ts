import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class WorksheetService {
  

  attachCommunication = new Subject<any>();
  worksheetCommunication = new Subject<any>();

  attachments: Array<SUBDIVISIONS> = [];

  constructor() { }

}

interface SUBDIVISIONS {
  name: string;
  source: string;
}
