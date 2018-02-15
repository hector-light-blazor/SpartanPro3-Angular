import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from "../app.service";
@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {

  //Private variable 
  dataTable:any = [];
  searchTable:string="";
  isLoading: boolean = true;
  constructor(private route: ActivatedRoute,private router: Router, private app: AppService) { }

  ngOnInit() {
    if(parseInt(this.app.account_info.user_id) == 0)this.router.navigateByUrl("/");
    this.isLoading = true;
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe(response => {
      console.log(response);
       this.dataTable = response;
       this.isLoading = false;
    })
    // this.app.GET_TABLE_MULTI(this.route.snapshot.params['search']).subscribe(response => {
    //   this.dataTable = response;
    // });
   
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.app._toolbarBtns.QUICK_SEARCH = true;
  }

  //Main Functions
  //Re quick search
  quickSearch() {
    // this.app.GET_METHOD();
    // this.app.GET_TABLE_MULTI(this.searchTable).subscribe(response => this.dataTable = response);
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe(response => {
      this.dataTable = response;
   })
  }

}
