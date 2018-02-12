import { Component,Input,Output, EventEmitter, OnInit } from '@angular/core';
import {AppService} from '../app.service';
@Component({
  selector: 'app-ticket-workflow',
  templateUrl: './ticket-workflow.component.html',
  styleUrls: ['./ticket-workflow.component.css']
})
export class TicketWorkflowComponent implements OnInit {

  @Input() staffId: any = null;
  @Input() routing: any = null;
  @Output() onClose = new EventEmitter<any>();
  staff: any = {name: ""};
  profileImage: string = "";
  workflow: any = [];
  
  constructor(private app: AppService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.staffId){
      this.app.GET_METHOD("users/getUserNameById/?id=" + this.staffId).subscribe((response:any) => {
         
          if(response.success){
             this.staff = response.data;
          }
      });
      this.fetchUserImage();
    }

    if(this.routing) {
       // Parse Routing
       if(typeof(this.routing) == "string") {
         this.routing = JSON.parse(this.routing);
         console.log(this.app.users);
       }
       this.routing.a.forEach(route => {
          this.app.users.forEach(user => {
              if(route == user.user_id){
                  user.avatar = (user.icon2) ? this.app.url + this.app.route.api.uImage + user.icon2 : "assets/avatar.png";
                  this.workflow.push(user);
                  return;
              }
          });
       });
       console.log(this.workflow);
       console.log(this.routing);
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

  _onCloseWindow(){
    this.onClose.emit(true);
  }

}
