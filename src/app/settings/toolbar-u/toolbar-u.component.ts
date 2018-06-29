import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { AppService } from '../../app.service';
import { DEL_TOOLBAR, UTOOLBAR_NAME, GTOOLBAR_SETTINGS } from '../settings.api';


@Component({
  selector: 'app-toolbar-u',
  templateUrl: './toolbar-u.component.html',
  styleUrls: ['./toolbar-u.component.css']
})
export class ToolbarUComponent implements OnInit {
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
   this._appService.GET_METHOD(GTOOLBAR_SETTINGS).subscribe((response:any) => {
       
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
   
   this._appService.POST_METHOD(DEL_TOOLBAR, {data: toolbar.id_config}).subscribe(response => {
       this.getToolbarSetts();
   });
 }

 renameToolbar(toolbar) {
   toolbar.show = true;
 }

 saveName(toolbar) {
   toolbar.show = false;
   let object = "id=" + toolbar.id_config + "&name=" + toolbar.name;

   this._appService.GET_METHOD(UTOOLBAR_NAME + object).subscribe(response => {
      
      this.getToolbarSetts();
   })
 }

 closeForm() {
   
   this.wndUpdateOnOff = !this.wndUpdateOnOff;
   this.toolbar.nativeElement.style.display = "block";

   //Refresh settings..
   this.getToolbarSetts();
 }

}
