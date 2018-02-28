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
  constructor(private appService: AppService) { 
    this.lmt = 1000;
    this.dataTable = [];
    this.searchTable = "";
    this.filterDate = {
      to: "",
      from: ""
    }

}

  ngOnInit() {
          //On init display 
          //this.appService._toolbarBtns.TICKET_TABLE = true;
    
          // this.appService.dataTable.takeWhile(() => this.isAlive).subscribe(value => {
          //   this.dataTable = value;
          // }); 
    
          // this.appService.GET_TABLE(this.lmt).subscribe(response => {
          //     this.dataTable = response;
          // }); 
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.appService._toolbarBtns.TICKET_TABLE = false;
    // this.appService._dataTableViews.LMT = this.lmt;
    this.isAlive = false;
    //this.appService.emitTableLMT(0);
    //this.appService._dataTableViews.LMT = 0;
    //this.appService.dataTable.unsubscribe();
    //this.appService.tableLMT.unsubscribe(); 
  }


  toggleTable(){
    //this.appService._dataTableViews.TABLE = !this.appService._dataTableViews.TABLE;
  }

  //Filter table by date..
  filterByDate(){
      console.log(this.filterDate);
      let filter = this.filterDate.from + "&t=" + this.filterDate.to;
      // this.appService.GET_TABLE_RANGE(filter).subscribe(response => {
      //   this.toggleTable();
      //   this.dataTable = response;
      // });
  }

}

interface DATE_JSON{
  to: string;
  from: string;
}
