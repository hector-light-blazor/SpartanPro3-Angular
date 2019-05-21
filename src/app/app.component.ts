import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from "./app.service";
import { Observable } from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { NativeNotificationService } from 'angular-notice/lib/native-notification.service';
import * as LogRocket from 'logrocket';

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
    LogRocket.init('t1zy37/test');
    let _self = this;

  
      //<<Lets Load the ESRI OBJECTS SO THE WHOLE DOCUMENT CAN USE THE OBJECTS>>>
     this.appService.esriLoadObjects();

    this.appService.cntAppFromLogin.takeWhile(() => this.isAlive).subscribe(info => {
        this.isLoading = true;
        this.account_info = info.user;
        this.appService.account_info = this.account_info;
       //  console.log(this.appService.account_info);
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

        // this.appService.GET_METHOD(this.appService.route.api.bRouting + this.appService.account_info.organization_id).subscribe(response => {
        //    console.log(response);
        // });
        //console.log(this.account_info);



      // this.appService.GET_METHOD(this.appService.route.api.gTConfig).subscribe(response => {
      //    console.log(response);

      //  })
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
                _self.appService.cmdToToolbar.next({settings: true});
                _self.router.navigateByUrl("ticket/dashboard");
                //_self.router.navigateByUrl("Map");
            }, 400);
            

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

    // GET LIST BY DEPT USERS...
    this.appService.GET_METHOD(this.appService.route.api.fUsersDept + "?id=1").subscribe((response:any) => {
          if(response.success) {
            this.appService.LVUSERS = response.data;
          }
    });

    // GET LIST BY SUPER USERS...
    this.appService.GET_METHOD(this.appService.route.api.fSuperUsers).subscribe((response:any) => {
        if(response.success) {
          this.appService.SUSERS = response.data;
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
