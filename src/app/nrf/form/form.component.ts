import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() attributes: any = null;
  @Output() close = new EventEmitter();
  name: string = 'None';
  comment: string = "";
  comments: any = [];
  constructor(private app:  AppService) { }

  ngOnInit() {
   
    this.app.users.forEach(element => {
        if(element.user_id == this.attributes.assignee) {
          this.name = element.first_name + " " + element.last_name;
          return;
        }
    });

    if(this.attributes.status != "CLOSED") {
      this.attributes.status = "OPEN";
    }

    this.getComments();
  }

  onClose() {
    this.close.emit(false);
  }

  // Add Time Stamp once click on the record for nrf...
  timeStampCall(val:number) {
      var date = new Date();
      var submit = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + 
      date.getDate() + " " + ((date.getHours() < 10) ? '0'+date.getHours() : date.getHours()) +
        ":" + ((date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()) + ":" +
        ((date.getSeconds() < 10) ? '0'+date.getSeconds() : date.getSeconds())
        ;
      ;
      if(val == 1 ) {
        
        this.attributes.call_one = submit;  
        this.app.POST_METHOD(this.app.route.api.tsNRF, {time: submit, id: this.attributes.nref_id, 
          field: 1}).subscribe((response: any) => {
           
          })
      }else if(val == 2 ) {
           
        this.attributes.call_two = submit;
        this.app.POST_METHOD(this.app.route.api.tsNRF, {time: submit, id: this.attributes.nref_id, 
          field: 2}).subscribe((response: any) => {
            
          })
      }else if(val == 3 ) {
         
        this.attributes.call_three = submit;  
        this.app.POST_METHOD(this.app.route.api.tsNRF, {time: submit, id: this.attributes.nref_id, 
          field: 3}).subscribe((response: any) => {
           
          })
      }

    }

    onChange() {

     // console.log(this.attributes);

      this.app.POST_METHOD(this.app.route.api.cNRF, {id: this.attributes.nref_id, status: this.attributes.status}).subscribe(response => {
          //console.log(response);
          this.onClose();
      });
    }

    getComments() {
       this.app.GET_METHOD(this.app.route.api.gcNRF + this.attributes.nref_id).subscribe(response => {
          this.comments = response;
       });
    }
    sendComments() {

        this.app.POST_METHOD(this.app.route.api.scNRF, {id: this.attributes.nref_id, comment: this.comment}).subscribe(response => {
            this.getComments();
            this.comment = "";
        });

    }

}
