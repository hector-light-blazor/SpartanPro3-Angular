import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nrfs: any= [];
  openForm: boolean = false;
  selected: any = null;
  constructor(private app: AppService) {


   }

  ngOnInit() {
    if(!this.app.account_info.user_id) return;
    this.onRefresh();
  }

  onOpenForm(selected) {
    this.openForm = true;
    this.selected = selected;

  }

  onRefresh() {
    this.app.GET_METHOD(this.app.route.api.emNRF + this.app.account_info.user_id).subscribe((response: any) => {
      
      this.nrfs = response;
    });
  }

}
