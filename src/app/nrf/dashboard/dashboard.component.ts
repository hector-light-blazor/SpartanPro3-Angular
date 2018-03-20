import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nrfs: any= [];
  constructor(private app: AppService) {


   }

  ngOnInit() {
    
    this.app.GET_METHOD(this.app.route.api.emNRF + this.app.account_info.user_id).subscribe((response: any) => {
        console.log(response);
    });
  }

}
