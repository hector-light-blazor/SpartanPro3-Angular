import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-ticket-u',
  templateUrl: './ticket-u.component.html',
  styleUrls: ['./ticket-u.component.css']
})
export class TicketUComponent implements OnInit {
  
  //-=-=-=-=-=-=-=-= Private Variables... ===-=-
  wndUpdateOnOff:boolean= false;
  toolbarSets = [];
  setInfo:any;

  //=-=-==--==- USE View Child control element =-=-=-=-=-=-=-=
  @ViewChild('wndSettings') toolbar: ElementRef;

  constructor(private _appService:AppService) { }

  ngOnInit() {

     //==== GET TOOLBAR LIST FROM SERVER =-=-=-=-=-=
     this.getToolbarSetts();
  }


  getToolbarSetts(){
    this._appService.GET_METHOD("config/getToolbarSettings/").subscribe((response:any) => {
        
        if(response){
          response.forEach(element => {
            element.show = false;
          });
        }

        this.toolbarSets = response;
    });
  }


  displayUpdateForm(obj:any){
    this.toolbar.nativeElement.style.display = "none";
    this.wndUpdateOnOff = true;
     this.setInfo = obj;

  }

  deleteToolbarSetting(toolbar) {
    this._appService.POST_METHOD("config/delToolbarSettings", toolbar.id_config).subscribe(response => {
        this.getToolbarSetts();
    });
  }

  renameToolbar(toolbar) {
    toolbar.show = true;
  }

  saveName(toolbar) {
    toolbar.show = false;
    let object = "id=" + toolbar.id_config + "&name=" + toolbar.name;

    this._appService.GET_METHOD("config/updateToolbarName/?" + object).subscribe(response => {
       
       this.getToolbarSetts();
    })
  }

}
