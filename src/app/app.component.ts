import { Component } from '@angular/core';
import {AppService} from "./app.service";
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
  account_info: any;
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
    this.testNotify();

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
        icon: '../assets/ng-shield.png',
        tag: 'notice'
    };

    this.notify.notify(options);
  }
}
