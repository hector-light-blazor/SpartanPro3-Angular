import { Component } from '@angular/core';
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
  timer = Observable.timer(0, 6000);
  account_info: any;
  ticketFirst: boolean = true;
  ticketCount: number = 0;
  constructor(private appService: AppService, private notify: NativeNotificationService) {
    this.appService.cntAppFromLogin.takeWhile(() => this.isAlive).subscribe(info => {
        this.toolBarOnOff = info.toolbar_on;
        this.account_info = info.user;
        this.appService.account_info = this.account_info;

        // this.appService.GET_METHOD(this.appService.route.api.bRouting + this.appService.account_info.organization_id).subscribe(response => {
        //    console.log(response);
        // });
        //console.log(this.account_info);
    });

    //<<Lets Load the ESRI OBJECTS SO THE WHOLE DOCUMENT CAN USE THE OBJECTS>>>>
    this.appService.esriLoadObjects();
   
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
