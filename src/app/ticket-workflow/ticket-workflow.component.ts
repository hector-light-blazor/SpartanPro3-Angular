import { Component,Input,Output, EventEmitter, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-workflow',
  templateUrl: './ticket-workflow.component.html',
  styleUrls: ['./ticket-workflow.component.css']
})
export class TicketWorkflowComponent implements OnInit {

  @Input() staffId: any = null;
  @Input() routing: any = null;
  @Input() sentto: any = null;
  @Input() ticketid: any = null;
  @Output() onClose = new EventEmitter<any>();
  staff: any = {name: ""};
  profileImage: string = "";
  workflow: any = [];
  mainUser: boolean = false;
  users: Array<any> = [];
  constructor(private app: AppService, private router: Router) { }

  ngOnInit() {
   this.users = this.app.users;
  
  }

  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.staffId){
      if(this.staffId == this.sentto) {
         this.mainUser = true;
      }
      this.app.GET_METHOD("users/getUserNameById/?id=" + this.staffId).subscribe((response:any) => {
         
          if(response.success){
             this.staff = response.data;
          }
      });
      this.fetchUserImage();
    }

    this.processRouting();
  }

  processRouting() {
    if(this.routing) {
       
      // Parse Routing
      if(typeof(this.routing) == "string") {
        this.routing = JSON.parse(this.routing);
       //  console.log(this.app.users);
      }
      let show: boolean = false;
      
      this.routing.a.forEach(route => {
         if(route == this.sentto) {
            show = true;
         } 

         this.app.users.forEach(user => {
             
             if(route == user.user_id){
                 if(show) {
                    user.hasticket = true;
                    show = false;
                 }else {
                   user.hasticket = false;
                 }
                 user.avatar = (user.icon2) ? this.app.url + this.app.route.api.uImage + user.icon2 : "assets/avatar.png";
                 this.workflow.push(user);
                 return;
             }
         });
      });
     //  console.log(this.workflow);
     //  console.log(this.routing);
   }
  }


  fetchUserImage(){
    this.app.GET_METHOD("users/getProfileIMage/?id=" + this.staffId).subscribe((response:any) => {
       
        if(response.data.icon){
            let img = JSON.parse(response.data.icon);
            
            this.profileImage = img.type + ";" + img.encode + "," + img.data;
        }
        else{
          this.profileImage = "assets/avatar.png";
        }
    });
  }


  onChangeSentTo(sent:any) {
    //Reset everything else..
    this.workflow.forEach(element => {
        element.hasticket = false;
    });
   
    sent.hasticket = true;
    //Finally Change and save info
    this.app.POST_METHOD("addressticket/moveTicketNewStaff", {data: 
      {objectid: this.ticketid, sent: sent.user_id }
    }).subscribe((response) => {
      this.onClose.emit({close: true, routing: this.routing, stopSave: true});
        setTimeout(() => {
          this.router.navigate(['ticket/dashboard']);
        }, 300);
        
    });
  }

  _onCloseWindow(){
    this.onClose.emit({close: true, routing: this.routing, stopSave: false});
  }

  setSelected(option, index: number) {
    //console.log(option, index);
    this.routing['a'][index] = parseInt(option);
    this.workflow = [];
    this.processRouting();
  }

}
