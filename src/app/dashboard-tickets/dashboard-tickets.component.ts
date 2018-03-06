import { Component,ViewChild,ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
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

  inbox:any =  [];
  openTickets:any   =  [];
  allLoading: boolean = false;
  searchAll:string = '';
  searchInbox: string = '';
  searchMine: string = '';
  organizationFilter: string = ''; //Controls the organization filter for the open tickets..
  
  timer = Observable.timer(0, 6000);
  isAlive:boolean = true;
  choosen: any = null; // this variable handles the right click...
  link: string = 'https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/users/getUserImage/?pic=';
  @ViewChild('rightMenu') righClick: ElementRef;
  @ViewChild('fowardWnw') fowardWn: ElementRef;
  // ON Construct declar some services as needed..



  constructor(public app:AppService) { }

  ngOnInit() {
    //console.log(this.app.users);
    // Begin with Fetching some data from db server..
    // 1.) First Get Worker Ticket Inbox...
    // 2.) Gather All Open Tickets...
    this.allLoading = true;
    this.app.POST_METHOD(this.app.route.api.ftInbox, {data: this.app.account_info.user_id}).subscribe((response:any) => {
        if(response.success) {
          response.data.forEach(element => {
              element.total = (element.total == "0") ? false : true;
              element.letter_generated = (element.letter_generated == "1") ? true : false;
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
        //  console.log(response);

       // Set it to the array in control for open tickets.
       this.openTickets = (response.success) ? response.data : [];
      });

      this.timer.flatMap((i) =>  this.app.POST_METHOD(this.app.route.api.ftInbox, {data: this.app.account_info.user_id})).takeWhile(() => this.isAlive).subscribe((response:any) => {
          if(response.success) {
           
            response.data.forEach(element => {
                element.total = (element.total == "0") ? false : true;
                element.letter_generated = (element.letter_generated == "1") ? true : false;
                element.icon = (element.icon) ? this.app.url + this.app.route.api.uImage + element.icon : "assets/avatar.png";
            });
            this.inbox = (response.success) ? response.data : [];
          }
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
  
  closemenu() {
    this.righClick.nativeElement.style.display = "none";
  }

  closeFowardWindow()
   {
     this.fowardWn.nativeElement.style.display = "none";
   }
  rightMenuCLK(option: string) {

     this.righClick.nativeElement.style.display = "none";
     if(option == "O") {

     }else if(option == "F"){
        this.fowardWn.nativeElement.style.display = "block";
     }
     else if(option == "D"){

     }
  }

  // Start of right click
  onRightClick(event:MouseEvent, choosen){
    
    console.log(choosen);
    this.choosen = choosen;

    this.righClick.nativeElement.style.display = "block";
    this.righClick.nativeElement.style.top = (event.pageY - 184) + "px";
    this.righClick.nativeElement.style.left =  (event.pageX + 20) +  "px";
   
    event.preventDefault();
    event.stopPropagation();
    return false;
}

  //Once Selected Foward Ticket
  fowardTicket(user: any) {
      let attributes = {
        id_ticket: this.choosen.id_ticket,
        sentto: user.user_id
      };

    this.app.POST_METHOD(this.app.route.api.sTicket, {data: attributes}).subscribe((response: any) => {});
    this.fowardWn.nativeElement.style.display = "none";
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

