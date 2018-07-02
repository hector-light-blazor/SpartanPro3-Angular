import { Component, OnInit, ElementRef, ViewChild, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { AppService } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { GTOOLBAR_SETTINGS, GTICKET_SETTINGS, GHOME_VIEWS } from '../settings.api';

declare var jQuery:any;

@Component({
  selector: 'app-user-i',
  templateUrl: './user-i.component.html',
  styleUrls: ['./user-i.component.css']
})
export class UserIComponent implements OnInit {


  toolname: any = "";

  @ViewChild('avatar') avatar: ElementRef; //File Input html element..
  @ViewChild("container") container: ElementRef;
  @ViewChild("form") form:ElementRef; 
  
  // @ViewChild(forwardRef(() => CanvasEditingComponent))
  // private canvasEditing: CanvasEditingComponent;

  // SRC for image to display 
  src: any = "assets/avatar.png"; //this src is for the image display on the avatar...
  @Input() btnOnOff:boolean = false;
 
  @Input() attributes: USER;

  @Input() btnTitle: string = 'Submit';

  @Input() enbPass: boolean = true;
  @Output() closeEditForm = new EventEmitter();


  toolbars:any = [];
  tickets:any  = [];
  homeviews:any = [];
  error_pass: boolean=false;  
  admin: boolean = false;
  //Value closes take while subscriptions handlers..
  isAlive:boolean= true;

  constructor(private _appService: AppService, private route: ActivatedRoute) { 


    console.log(this._appService.account_info)

        //Assign values to attributes..
      this.attributes = {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        initials: "",
        password: "",
        repass: "",
        icon: "",
        ticket_option: "0",
        toolbar_option: "0",
        home_view_option: "0"

      }

      this.fetchToolbarSettings();
      this.fetchTicketSettings();
      this.fetchHomeViewSettings();
  }

  ngOnInit() {
  }








   //=-=-=-=-=-=-=-= FETCH TOOLBAR SETTINGS =-=-=-=-==-=-=-=-=-=
   fetchToolbarSettings(){
    this._appService.GET_METHOD(GTOOLBAR_SETTINGS).subscribe(response => {
        
        this.toolbars = response;
    });
  }

  //=-=-=-=-=-=-=-=-=-= FETCH TICKET SETTINGS =-=-=-=-=-=-=-=-=
  fetchTicketSettings(){
    this._appService.GET_METHOD(GTICKET_SETTINGS).subscribe(response => {
        this.tickets = response;
    });

  }
  // =-=-==-=-=-==--=-= FETCH HOME VIEW SETTINGS =-=-=-=-=-=-=--=-=
  fetchHomeViewSettings() {
     this._appService.GET_METHOD(GHOME_VIEWS).subscribe(response => {
         this.homeviews = response;
     });
  }

}


interface USER{
  first_name: string,
  last_name: string,
  middle_name: string,
  initials: string,
  email: string,
  password: string,
  repass: string,
  icon:string,
  ticket_option: string,
  toolbar_option:string,
  home_view_option: string
}
