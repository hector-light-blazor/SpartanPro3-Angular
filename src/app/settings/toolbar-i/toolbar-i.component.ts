import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';
import {toolBarSettings} from "../../toolbar/toolbarSettings";
@Component({
  selector: 'app-toolbar-i',
  templateUrl: './toolbar-i.component.html',
  styleUrls: ['./toolbar-i.component.css']
})
export class ToolbarIComponent implements OnInit {


   //===== Private Variables...
   _toolSettings: toolBarSettings;
   name:string = "";

   //===== Input, Output Variables to control component =======
   @Input() btnOnOff:boolean = false;
   @Input() title:string = "Insert Toolbar Settings";
   @Input() btnTitle:string= "Save";
   @Input() settings:any;
   @Output() btnClose = new EventEmitter<any>();
  constructor(public _appService: AppService) { 

      //Testing toolbar settings..
      this._toolSettings = {SECTIONS: {
        TICKET: {
                  onoff: true,
                    VIEW:{
                      onoff: true,
                      ids: {
                        dash: true,
                        calendar: true,
                        arch: true,
                        charts: true
                      }
                  },
                  INSERT: {
                      onoff: true,
                      ids: {
                        nw: true
                      }
                  },
                  RECORDS: {
                      onoff: true,
                      ids: {
                        filter: true
                      }
                  },
                  QUICKSEARCH: {
                      onoff: true,
                      ids: {
                        search: true
                      }
                  }, 
                  EDITS: {
                    onoff: true,
                    ids: {
                      SAVE_TRANSFER: true,
                      DELETE: true,
                      ARCHIVE: true
                    }
                   },
                  TICKET_INSERT: {
                    onoff: true,
                    ids:{
                      COMMENTS: true,
                      ATTACHMENT: true
                    }
                  },
                  TICKET_VIEW: {
                    onoff: true,
                    ids:{
                      MAP: true,
                      ATTACHMENT: true,
                      LETTER: true
                    }
                  }, 
                  FILTER: {
                    onoff: true,
                    ids: {
                      DATE: true,
                      DOWNLOAD: true,
                      RESET: true
                    }
                  }
            },
            SUBDIVISION: {
              onoff: true,
              VIEW: {
                onoff: true,
                ids: {dash: true, calendar: true, arch: true}
              }
              
            },
            MAP: {onoff: true,
              VIEW: {onoff: true, ids: {MAP: true}},
              TOOLS: {onoff: true, ids: {MEASURE: true, IDENTIFY: true}}
          },
            SETTINGS: {
              onoff: true,
              PROFILE: {
                onoff: true,
                UPDATE: true
              },
              USER: {
                onoff: true,
                INSERT: true,
                UPDATE: true
              },
              TICKET: {
                onoff: true,
                INSERT: true,
                UPDATE: true
              },
              TOOLBAR: {
                onoff: true,
                INSERT: true,
                UPDATE: true
              },
              GIS: {
                onoff: true,
                ROUTING: true
              }
            }
      }};
  }

  ngOnInit() {
  }

}
