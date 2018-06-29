import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';
import { GTICKET_SETTINGS } from '../settings.api';

@Component({
  selector: 'app-ticket-u',
  templateUrl: './ticket-u.component.html',
  styleUrls: ['./ticket-u.component.css']
})
export class TicketUComponent implements OnInit {
  
  @ViewChild('wndTicketSettings') ticket: ElementRef;
  

  ticketSets:any = [];
  setInfo:any;
  upForm:boolean = false;
  title:string = "Update Ticket Settings";
  
  constructor(private _appService:AppService) {
     
  }

  ngOnInit() {

   this.refreshData(); 
  }


  closeForm(){
    this.upForm = false;
    this.ticket.nativeElement.style.display = "block";
    this.refreshData();
  }

  displayUpdateForm(obj:any){
    this.ticket.nativeElement.style.display = "none";
    this.upForm = true;
    this.setInfo = obj;
  }

  refreshData(){
    //lets get the information from database...
    this._appService.GET_METHOD(GTICKET_SETTINGS).subscribe(response =>{
        
        this.ticketSets = response;
    });
  }


}
