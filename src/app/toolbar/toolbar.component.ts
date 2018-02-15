import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {toolBarSettings} from "./toolbarSettings";
import {AppService} from "../app.service";
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
 
  encapsulation: ViewEncapsulation.None
})


export class ToolbarComponent implements OnInit {

  // =-=-=- GLOBAL VARIABLES -=-=-filterAvailable=-=-=-=-=
  _toolSettings: toolBarSettings;

  commentText:string;
  ticketAvailable: boolean = false; 
  filterAvailable: boolean = false;
  isAlive: boolean = true;
  expandShow: boolean = true;

  qsearch: string = ''; // Controls quick search input...
  constructor(private app: AppService, private router: Router) { 

    // =-=-=-= Define Blank Tool Settings Configs =-=-=-=-
    this._toolSettings = {SECTIONS: {
      TICKET: {
         onoff: true,
           VIEW:{
            onoff: true,
            ids: {
              dash: true,
              calendar: true,
              arch: true
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
         }
      },

      SUBDIVISION: {onoff: false,
        VIEW: {onoff: false, ids: {dash: false, calendar: false, arch: false}}
      },
      MAP: {onoff: true,
          VIEW: {onoff: true, ids: {MAP: true}}
      },
      SETTINGS: {
        onoff: true,
        PROFILE: {onoff: true, UPDATE: false},
        USER: {onoff: false},
        TICKET: {onoff: false},
        TOOLBAR: {onoff: false},
        GIS: {onoff: false}
      }

    }
      
  
  };
  }

  ngOnInit() {

    //Iniate the control for toolbar from any routes..
    //this.app.ticketInteractionToolbar();
    this.app.ticketInteractionToolbar.takeWhile(() => this.isAlive).subscribe(action => {
       this.ticketAvailable = action;
    });
  }

  // Enable Ticket Toolbar sections..
  enableTicketTools() {
    this.ticketAvailable = true;
  }

  toogleToolbar() {
    this.expandShow = !this.expandShow;
  }

  toogleCharm() {

  }

  _settingsTools(val:string){
    // if(val == 'C'){
    //    //If they press crop lets crop the picture..
    //    this.appService.emitToolbarSettings(Config.TOOLBAR_CLICK.SETTINGS.USER.CROP);
    // }else{
    //    //Hide toolbar..
    //    //to view the user card...
    //    this.appService._toolbarBtns.SETTINGS_PHOTO = false;
    //    this.appService.emitToolbarSettings(Config.TOOLBAR_CLICK.SETTINGS.USER.VIEW);
    // }
   
  }

    //  Get info for quick search processing...
    enterQuickSearch(){
      this.router.navigateByUrl("/ticket/quickSearch/" + this.qsearch);
      this.qsearch = "";
      //this.app._toolbarBtns.QUICK_SEARCH = false;
   }


  actionSendToolBar(action: number) { 
    // Action represent a number that does something fancy
    // To the body view
    // 1 represents save & transfer ticket...
      switch (action) {
        case this.app.toolbarActivies.TICKET_SAVE_TRANSFER:
          console.log("I RAN WHAT"); 
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_ARCHIVE:
          console.log("GOING TO ARCHIVE TICKET");
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_DELETE:
          console.log("GOING TO DELETE TICKET");
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_INSERT_COMMENT:
          console.log("INSERTING COMMENTS");
          this.app.toolbarActions.next({action: action, data: this.commentText});
          this.commentText = "";
          break;
        case this.app.toolbarActivies.TICKET_ESRI_MAP:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_ESRI_IMAGERY:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_DISPLAY_ATTACHMENT:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_LIST_ATTACHMENTS:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        default:
          break;
      }
  }

}
