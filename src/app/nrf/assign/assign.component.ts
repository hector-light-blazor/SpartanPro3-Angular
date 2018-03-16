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

    console.log(this.app.url + this.app.route.api.gNRF);

   

  }

  ngOnInit() {
    this.users = this.app.users;
    this.app.GET_METHOD(this.app.route.api.gNRF).subscribe(response => {
       console.log(response);
       this.nrfs = response;
    });
  }

  onChangeAssignee(selected) {
      console.log(selected);
  }

}
