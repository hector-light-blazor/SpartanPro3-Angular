import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from "./app.service";
import { Observable } from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { NativeNotificationService } from 'angular-notice/lib/native-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  toolBarOnOff: boolean = false;
  title = 'app';
  isAlive: boolean = true;
  isLoading: boolean = false;
  msg: string = "Please wait... Setting up Spartan Pro";
  timer = Observable.timer(0, 6000);
  account_info: any;
  ticketFirst: boolean = true;
  ticketCount: number = 0;

  constructor(private router: Router, private appService: AppService, private notify: NativeNotificationService) {

    let _self = this;

  
      //<<Lets Load the ESRI OBJECTS SO THE WHOLE DOCUMENT CAN USE THE OBJECTS>>>
     this.appService.esriLoadObjects();

    this.appService.cntAppFromLogin.takeWhile(() => this.isAlive).subscribe(info => {
        this.isLoading = true;
       
        this.account_info = info.user;
        this.appService.account_info = this.account_info;

        // Get Inbox Information..
        this.timer.flatMap((i) =>  this.appService.POST_METHOD(this.appService.route.api.ftInbox, {data: this.appService.account_info.user_id})).takeWhile(() => this.isAlive).subscribe((response:any) => {
          if(response.success) {
            if(this.ticketFirst) {
              this.ticketCount = response.data.length;
              this.ticketFirst = false;
            }else {
              let count = response.data.length;
              if(count > this.ticketCount) {
                  this.ticketNotify();
                  this.ticketCount = count;
              }
            }

            
          }
      });

     


      // Process the msag polygon...
      // if(this.appService.msagObject) {
      //   this.appService.msagObject.forEach(element => {

      //       // console.log(element);
      //       element.geo = new this.appService.esriPolygon(element.geo.coordinates[0]);
      //    });
      //   console.log(this.appService.msagObject);
      // }
    


        // this.appService.GET_METHOD(this.appService.route.api.bRouting + this.appService.account_info.organization_id).subscribe(response => {
        //    console.log(response);
        // });
        //console.log(this.account_info);



      // this.appService.GET_METHOD(this.appService.route.api.gTConfig).subscribe(response => {
      //    console.log(response);
      // })
      this.appService.GET_METHOD(this.appService.route.api.gUConfig + this.appService.account_info.user_id).subscribe((response:any) => {
       
        if(response){
         
         // console.log(response);
              for(var x = 0; x < response.length; x++){
                response[x].json = JSON.parse(response[x].json);
              }
            this.appService.account_info.config = response;
            
            setTimeout(() => {
               _self.toolBarOnOff = info.toolbar_on;
                _self.isLoading = false;
                _self.router.navigateByUrl("ticket/dashboard");
                //_self.router.navigateByUrl("Map");
            }, 400);
              

             // console.log(response);
            //     if(response[x].setting_type == "TOOLBAR"){
            //       // console.log(response[x]);
            //         this._toolSettings = response[x].json;
            //         if(!this._toolSettings.SECTIONS.TICKET.QUICKSEARCH.onoff){
            //             this.appService._toolbarBtns.QUICK_SEARCH = false;
            //           }
            //          console.log(this._toolSettings);
            //           if(this._toolSettings.SECTIONS.SETTINGS.USER.onoff) {
            //             console.log("ADMIN")
            //             this.appService.admin = true;
            //           }else {
            //             this.appService.admin = false;
            //           }
                    
            //     }else if(response[x].setting_type == "HOMEVIEW") {
            //         if(response[x].name == "QUICKPICK") {
            //           this.router.navigateByUrl("/home/mapView");
            //         }
            //     }
            // }

        } 
    });
    });

  
   
    // GET LIST OF USERS...
    this.appService.GET_METHOD(this.appService.route.api.gListUsers).subscribe((response:any) => {
        //console.log(response);
        if(response.success) {
           this.appService.users = response.data;
        }
    });

    // Get List of Organizations....
    this.appService.GET_METHOD(this.appService.route.api.gListOrga).subscribe((response: any) => {
      
      
       this.appService.organizations = response;
    });
    

  }

  // make sure to change the service into more elegant solution
  // by adding the window.focus on click module...
  testNotify() {
    let options = {
        title: 'hello world',
        body : 'this is a notification body',
        dir: 'ltr',
        icon: '../assets/spartanpro_icon.png',
        tag: 'notice'
    };

    this.notify.notify(options);
  }

  ticketNotify() {
    let options = {
        title: 'Spartan Pro',
        body : 'You have new ticket',
        dir: 'ltr',
        icon: '../assets/spartanpro_icon.png',
        tag: 'notice'
    };

    this.notify.notify(options);
  }



}
