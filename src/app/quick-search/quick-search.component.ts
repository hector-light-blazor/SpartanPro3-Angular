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

    console.log(this.app.users);
    this.isLoading = true;
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe((response:any) => {

      response.forEach(row => {
           
           if(row.sentto == "00") {
              row.sentto = "ARCHIVE";
           }else {
            this.app.users.forEach(user => {
              if(row.sentto == user.user_id){
                 row.sentto = user.first_name + ' ' + user.last_name;
                 return; //Kill Query..
              }
            });
           }
          
      });

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
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe((response:any) => {

      response.forEach(row => {
           if(row.sentto == "00") {
              row.sentto = "ARCHIVE";
           }else {
            this.app.users.forEach(user => {
              if(row.sentto == user.user_id){
                 row.sentto = user.first_name + ' ' + user.last_name;
                 return; //Kill Query..
              }
            });
           }
          
      });
    });
  }

}
