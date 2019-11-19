import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  // =-=-=- DECLARE VARIABLES =-=-=-=-=-=-=-=-=
  
  username: string = "";
  users: Array<string> = [];
  password: string = "";
  remeberMe: boolean = false;
  display: boolean = true;
  
  
  cookie: Array<string> = [];
  constructor(private _appService: AppService, private router: Router) { 
   
    this._appService.GET_METHOD(this._appService.route.api.fEmails).subscribe((response: Array<string>) => {
        console.log(response);
        this.users = response;
    });

    if(document.cookie) {
       // Lets Process the cookie
      
       this.cookie = document.cookie.split(';'); // Collect Cookies into array of string...
       this.username = atob(this.getCookieName('username')); // Get Username information..
       this.password = atob(this.getCookieName('pass')); // Get Password Information from cookie...
       
       this.remeberMe = (this.username) ? true : false;
      
    }

  }
  
  ngOnInit() {
    
    if(this.remeberMe) {

      if(this.username && this.password) {
        this.loginFromCookie();
      }
      
    }
  }

  checkLogin() {
    
    //Username
    if(!this.username || !this.password) {
      alert("Please enter credentials"); // TODO: change this to jquery idk maybe remind like this....
      return;
    }

    // Save Username and Password in cookie...
  
    if(this.remeberMe) {
      console.log("SAVE")
      let pass = btoa(btoa(this.password));
      this.setCookie('username', btoa(this.username), 200);
      this.setCookie('pass', pass, 200);
    }else {
      console.log("DONT SAVE")
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = "pass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }

    
    this._appService.POST_METHOD(this._appService.route.api.login, {data: {json: {username: this.username.toUpperCase(), password: btoa(this.password) }}}).subscribe((response: any) => {
      
      if(response.success) {
         
          this._appService.cntAppFromLogin.next({toolbar_on:true, user: response.data[0]});
          this.display = false;
          // this.router.navigateByUrl("ticket/dashboard");
        }else {
           alert("Wrong information");
        }
 
    }, error => alert("Can't Access Server"));
  }

  loginFromCookie() {
    
    this._appService.POST_METHOD(this._appService.route.api.login, {data: {json: {username: this.username.toUpperCase(), password: this.password }}}).subscribe((response: any) => {
      if(response.success) {
       
        this._appService.cntAppFromLogin.next({toolbar_on:true, user: response.data[0]});
        this.display = false;
        // this.router.navigateByUrl("ticket/dashboard");
      }else {alert("Wrong Information")}

  }, error => alert("Can't Access Server"));
  }


  getCookieName(name): string {
     let response = '';
     let lng = this.cookie.length;

     for(var x = 0; x < lng; x++) {
        if(this.cookie[x].includes(name)) {
          this.cookie[x] = this.cookie[x].trim();
          response = this.cookie[x].substr(name.length + 1);
        }
     }

     return response;
  }

  setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
}
