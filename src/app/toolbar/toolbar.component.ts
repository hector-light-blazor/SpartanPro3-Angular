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
  fullScreen:boolean = false;
  isAlive: boolean = true;
  expandShow: boolean = true;
  qsearch: string = ''; // Controls quick search input...
  constructor(public app: AppService, private router: Router) { 

    this.app._toolbarBtns.TICKET_TABLE = false;
    // =-=-=-= Define Blank Tool Settings Configs =-=-=-=-
    this._toolSettings = {SECTIONS: {
      TICKET: {
         onoff: true,
           DISPLAY:{
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
         }
      },
      NRF: {
        onoff: true,
        DISPLAY: {
          onoff: true,
          ids: {
            DASHBOARD: true
          }
        },
        MANAGEMENT: {
          onoff: true,
          ids: {
            UPLOAD: true,
            USERS: true,
            EXPORT: true
          }
        }
      },

      SUBDIVISION: {onoff: true,
        DISPLAY: {onoff: true, ids: {dash: false, calendar: false, arch: false}}
      },
      MAP: {onoff: true,
          DISPLAY: {onoff: true, ids: {MAP: true}},
          TOOLS: {onoff: true, ids: {MEASURE: true, IDENTIFY: true, EDIT_RANGES: true}}
      },
      SETTINGS: {
        onoff: true,
        PROFILE: {onoff: true, UPDATE: false},
        USER: {onoff: true},
        TICKET: {onoff: true},
        TOOLBAR: {onoff: true},
        GIS: {onoff: true, ROUTING: true}
      }

    }
      
  
  };
  }

  ngOnInit() {

   
    this.app.ticketInteractionToolbar.takeWhile(() => this.isAlive).subscribe(action => {
       this.ticketAvailable = action;
    });

    // Setup the toolbar information...

    this.app.account_info.config.forEach(element => {
        //console.log(element);
        if(element.setting_type == "TOOLBAR") {
          this._toolSettings = element.json;
          // console.log(this._toolSettings)
         // console.log(element.json);
        }
    });

    
  }



  // Enable Ticket Toolbar sections..
  enableTicketTools() {
    this.ticketAvailable = true;
  }

  toogleToolbar() {
    this.expandShow = !this.expandShow;
    var tabs = document.getElementsByClassName("tabs-content")
    if(this.expandShow) 
      tabs[0]['style']['display'] = ''
    else
      tabs[0]['style']['display'] = 'none'
    
    this.app.toolbarActions.next({action: this.app.toolbarActivies.COLLAPSE_TOOLBAR, data: this.expandShow});
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
         
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_ARCHIVE:
       
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_DELETE:
      
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_INSERT_COMMENT:
    
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
       
        case this.app.toolbarActivies.TICKET_GOOGLE_MAP:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_LIST_ATTACHMENTS:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_LETTER:
          
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.TICKET_LETTER_ESIGN:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.MAP_IDENTIFY:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.MAP_MEASURE:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        case this.app.toolbarActivies.EDIT_RANGES:
          this.app.toolbarActions.next({action: action, data: null})
          break;
        case this.app.toolbarActivies.BOOKMARK:
          this.app.toolbarActions.next({action: action, data: null});
        case this.app.toolbarActivies.QUICK_PICK:
          this.app.toolbarActions.next({action: action, data: null});
          break;
        default:
          break;
      }
  }

  showDate(){
    this.app._dataTableViews.DATE = (this.app._dataTableViews.DATE) ? false : true;
    this.app._dataTableViews.TABLE = (this.app._dataTableViews.TABLE) ?  false : true;  
  }

  getMoreTable(val:number){ // GET 1000 items more filter table..

    this.app._dataTableViews.LMT += val;
    this.app.dataTable.next([]);
    this.app.GET_METHOD(this.app.route.api.gFTable + this.app._dataTableViews.LMT).subscribe((response:any) => {

        this.app.dataTable.next(response);
    });
 }
 resetTable(val: number) { // Reset filter table module...
    this.app._dataTableViews.LMT = 1000;
    this.app.dataTable.next([]);
    this.app.GET_METHOD(this.app.route.api.gFTable + this.app._dataTableViews.LMT).subscribe((response:any) => {
  
        this.app.dataTable.next(response);
    });
 }

 onLogOut() {
   //TODO: REMOVE COOKIES...
   this.delete_cookie("username");
   this.delete_cookie("pass");
   console.log(window.location.origin);
   console.log(window.location);
   var split = window.location.pathname.split("/");
  
    setTimeout(() => {
      //window.open("https://gis.lrgvdc911.org/spartanpro3/", "_self");
      window.open(window.location.origin + "/" + split[1], "_self");
    }, 100);
   
 }

 //New Function to go Full Screen
 goFullScreen() {
 
  

  if(this.fullScreen) {
    this.fullScreen = false;
    if (document.exitFullscreen) {
      document.exitFullscreen();
  }
  }
  else {
    this.fullScreen = true;
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    }
  }
  
 }


 delete_cookie(name) {
    console.log(document.cookie);
    document.cookie = name+'=; Max-Age=-99999999;';  
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
 }

}
