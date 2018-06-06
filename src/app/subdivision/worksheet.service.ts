import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class WorksheetService {
  

  attachCommunication = new Subject();
  worksheetCommunication = new Subject();

  attachments: Array<SUBDIVISIONS> = [];

  constructor() { }

}

interface SUBDIVISIONS {
  name: string;
  source: string;
}
