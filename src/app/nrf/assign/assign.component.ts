import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {

  nrfs:any = [];
  users: any =  [];
  constructor(private app: AppService) { 
  }

  ngOnInit() {
    this.users = this.app.users;
    this.app.GET_METHOD(this.app.route.api.gNRF).subscribe(response => {
       //console.log(response);
       this.nrfs = response;
    });
  }

  onChangeAssignee(selected) {
      console.log(selected);

      this.app.POST_METHOD(this.app.route.api.aNRF, {a: selected.assignee, id: selected.nref_id}).subscribe((response: any) => {
          console.log(response);
      });
  }

}
