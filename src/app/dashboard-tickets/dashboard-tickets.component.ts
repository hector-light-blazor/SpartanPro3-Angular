import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AppService} from "../app.service";
import { Observable } from 'rxjs';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  styleUrls: ['./dashboard-tickets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardTicketsComponent implements OnInit {


  // Global variable 

  inbox:Array<STATUS> =  [];
  openTickets:Array<STATUS>   =  [];
  allLoading: boolean = false;
  searchAll:string = '';
  searchInbox: string = '';
  searchMine: string = '';
  organizationFilter: string = ''; //Controls the organization filter for the open tickets..
  
  timer = Observable.timer(0, 6000);
  isAlive:boolean = true;
  // ON Construct declar some services as needed..



  constructor(public app:AppService) { }

  ngOnInit() {

    // Begin with Fetching some data from db server..
    // 1.) First Get Worker Ticket Inbox...
    // 2.) Gather All Open Tickets...
    this.allLoading = true;
    this.app.POST_METHOD(this.app.route.api.ftInbox, {data: this.app.account_info.user_id}).subscribe((response:any) => {
        console.log(response);
        if(response) {
          response.data.forEach(element => {
              element.icon = (element.icon) ? this.app.url + this.app.route.api.uImage + element.icon : "assets/avatar.png";
          });
          this.inbox = (response.success) ? response.data : [];
        }
        
        
    });

    // GET ALL OPEN TICKETS BY ORGINZATION... 
    if(this.app.account_info.organization_id) {
      this.organizationFilter = this.app.account_info.organization_id;
      this.getOpenTickets();

      this.timer
      .flatMap((i) => this.app.GET_METHOD(this.app.route.api.oTicket + this.organizationFilter)).takeWhile(() => this.isAlive).subscribe((response:any) => {
          if(response.success) {
            let size = response.data.length;
            // Parse the images to show icons...
            for(var i = 0; i < size; i++){
                if(response.data[i].icon){
              

                response.data[i].icon = this.app.url + this.app.route.api.uImage + response.data[i].icon;
              }else{
                response.data[i].icon = "assets/avatar.png";
              }

              if(response.data[i].icon_transfer){
            

                response.data[i].icon_transfer =  this.app.url + this.app.route.api.uImage + response.data[i].icon_transfer;
              }else{
                response.data[i].icon_transfer = "assets/avatar.png";
              }
            }

          }
      

       // Set it to the array in control for open tickets.
       this.openTickets = (response.success) ? response.data : [];
      });
    }


  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isAlive = false; // STOP THE TIMER BECAUSE WE AREN'T here anymore lol..
    
  }

  changeOrganizationFilter(id) {
    this.organizationFilter = id;
    this.getOpenTickets();
  }

  getOpenTickets()
  {

    this.app.GET_METHOD(this.app.route.api.oTicket + this.organizationFilter).subscribe( (response: any) => {
        if(response.success) {
          let size = response.data.length;
          // Parse the images to show icons...
          for(var i = 0; i < size; i++){
              if(response.data[i].icon){
            

              response.data[i].icon = this.app.url + this.app.route.api.uImage + response.data[i].icon;
            }else{
              response.data[i].icon = "assets/ticket.png";
            }

            if(response.data[i].icon_transfer){
          

              response.data[i].icon_transfer =  this.app.url + this.app.route.api.uImage + response.data[i].icon_transfer;
            }else{
              response.data[i].icon_transfer = "assets/avatar.png";
            }
          }

        }
      

       // Set it to the array in control for open tickets.
       this.openTickets = (response.success) ? response.data : [];

       this.allLoading = false;
   });
  }
  

}

interface STATUS {
  staff?: string;
  created_date?: string;
  objectid?: string;
  cfirst_name?: string;
  clast_name?: string;
  init?: string;
}

