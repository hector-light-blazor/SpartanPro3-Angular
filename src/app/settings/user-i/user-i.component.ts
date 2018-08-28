import { Component, OnInit, ElementRef, ViewChild, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { AppService } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { GTOOLBAR_SETTINGS, GTICKET_SETTINGS, GHOME_VIEWS, UPDATE_USERS, NEW_USER, DEFAULT_IMAGE } from '../settings.api';


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
  admin: boolean = true;
  //Value closes take while subscriptions handlers..
  isAlive:boolean= true;

  constructor(private _appService: AppService, private route: ActivatedRoute) { 


   // console.log(this._appService.account_info)

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

    this.attributes.password = "";

    // Lets check if attributes has the key config id...
    // if it does contain the config id then change the user settings...
    if(this.attributes.hasOwnProperty("config_id")) {
       let size = this.attributes['config_id'].length;

       for(var x = 0; x < size; x++) {
          var value = this.attributes['config_id'][x];
          if(value['setting'] == "TICKET") {
            this.attributes.ticket_option = value['id'];
          }else if(value['setting'] == "TOOLBAR") {
            this.attributes.toolbar_option = value['id'];
          }else if(value['setting'] == "HOMEVIEW") {
            this.attributes.home_view_option = value['id'];
          }
       }
       this.attributes.repass = "";

       if(this.attributes.icon) {
         this.src = this.attributes.icon;
       }
    }

  }



  _closeForm() {
    this.closeEditForm.next(true);
  }


  _changeInit(value) {

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

   //Submit form...
   onSubmit(event: Event){
       event.preventDefault();
    
        if(this.attributes.ticket_option == "0"){
          jQuery.Notify({
                  caption: "",
                  content: "Please choose ticket settings",
                  type: this._appService.msg_codes.alert
        });
        return;
      }

      if(this.attributes.toolbar_option == "0"){
          jQuery.Notify({
                  caption: "",
                  content: "Please choose toolbar settings",
                  type:  this._appService.msg_codes.alert
        });
        return;
      }

      if(this.attributes.home_view_option == "0") {
          jQuery.Notify({
                  caption: "",
                  content: "Please choose home view settings",
                  type:  this._appService.msg_codes.alert
        });
        return;
      }

    
      if(this.attributes.password == this.attributes.repass){
         this.error_pass = false;
      }else if(this.attributes.password != this.attributes.repass){
       return;
      }

      let attributes = {};
      let settings   = {};


      for(var x in this.attributes){
     
        if(x === "ticket_option"){
          settings[x] = this.attributes[x];
        }
        else if(x == "toolbar_option"){
          settings[x] = this.attributes[x];
        }
        else if(x == "home_view_option") {
           settings[x] = this.attributes[x];
        }
        else if(x != "repass" && x != "config_id"){
          if(this.attributes[x]){
             if(x == "password") this.attributes[x] = btoa(this.attributes[x]);
             attributes[x] = this.attributes[x];
          }
        }
      }

      attributes['icon'] = "";

      if(this.src != DEFAULT_IMAGE){

        let arr = this.src.split(";");
        let arr2 = arr[1].split(",");
        
  
        attributes['icon'] = '{"type" : "'  + arr[0]  +'", "encode" : "'  + arr2[0]  + '", "data" : "' +  arr2[1] +  '"}';
      }else{
        delete attributes['icon'];
      }

      let final_att = {"user" : attributes, "settings": settings};

   
      if(this.btnTitle == "Update") {
         //DELETE COLUMN..
        delete attributes['organization_name'];
        this._appService.POST_METHOD(UPDATE_USERS, {data: final_att}).subscribe((response:any) => {
          if(response.success){

            jQuery.Notify({
                caption: "",
                content: "User updated",
                type: this._appService.msg_codes.success
              });

          }else{

            jQuery.Notify({
                caption: "",
                content: "User Not Updated",
                type: this._appService.msg_codes.alert
              });
          }
        });
      }else {
            this._appService.POST_METHOD(NEW_USER, {data: final_att}).subscribe(response => {
              if(response){
                for(var x in this.attributes){
                  this.attributes[x] = "";
                }
                    jQuery.Notify({
                      caption: "",
                      content: "User added",
                      type: this._appService.msg_codes.success
                    });
                 
              }else{
                jQuery.Notify({
                caption: "",
                content: "User Error",
                type: this._appService.msg_codes.alert
              });
              }
          })
      }
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
