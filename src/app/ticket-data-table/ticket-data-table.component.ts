import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-ticket-data-table',
  templateUrl: './ticket-data-table.component.html',
  styleUrls: ['./ticket-data-table.component.css']
})
export class TicketDataTableComponent implements OnInit {
  //Private variables...
  dataTable = [];
  lmt:number;
  searchTable: string = "";
  filterDate:DATE_JSON;
  isAlive: boolean = true;
  isLoading: boolean = true;
  constructor(public appService: AppService) { 
    this.lmt = 1000;
    this.dataTable = [];
    this.searchTable = "";
    this.filterDate = {
      to: "",
      from: ""
    }

    this.appService._dataTableViews.TABLE = true;

}

  ngOnInit() {
          //On init display 
          this.appService._toolbarBtns.TICKET_TABLE = true;
    
          this.appService.dataTable.takeWhile(() => this.isAlive).subscribe(value => {
            this.dataTable = value;
          }); 
          
          this.appService.GET_METHOD(this.appService.route.api.gFTable + this.lmt).subscribe((response: any) => {
              this.dataTable = response;
              this.isLoading = false;
          });
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.appService._toolbarBtns.TICKET_TABLE = false;
    this.appService._dataTableViews.LMT = this.lmt;
    this.isAlive = false;
    
  }


  toggleTable(){
    this.appService._dataTableViews.TABLE = !this.appService._dataTableViews.TABLE;
  }

  //Filter table by date..
  filterByDate(){

      let filter = this.filterDate.from + "&t=" + this.filterDate.to;
      this.dataTable = [];
      this.isLoading = true;

      this.appService.GET_METHOD(this.appService.route.api.gFRTable + filter).subscribe((response: Array<any>) => {
          this.toggleTable();
          this.dataTable = response;
          this.isLoading = false;
      });
     
  }

}

interface DATE_JSON{
  to: string;
  from: string;
}
