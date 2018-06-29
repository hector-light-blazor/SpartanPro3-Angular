import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';
import { UTICKET_SETTINGS, ITICKET_SETTINGS } from '../settings.api';


declare var jQuery:any;

@Component({
  selector: 'app-ticket-i',
  templateUrl: './ticket-i.component.html',
  styleUrls: ['./ticket-i.component.css']
})
export class TicketIComponent implements OnInit {
 
  settingName:string="";
  boolCustomerSection:boolean = false;
  boolPremisesSection:boolean = false;
  boolLVSection:boolean=false;
  boolDBSection:boolean=false;
  boolGISSection:boolean=false;
  btnOnOff:boolean = false;0

  // INPUT AND OUTPUT COMMUNICATION WITH DOM OR PARENT COMPONENTS
  @Input() btnTitle:string = "Save";
  @Input() settings:any;
  @Input() title:string = "Insert Ticket Settings";
  @Input() cntButton:boolean;
  @Output() btnClose = new EventEmitter<any>();

  constructor(private _appService: AppService) { }

  ngOnInit() {
  }


    ngOnChanges() {
      if(this.cntButton){
        this.btnOnOff = this.cntButton;
      }

      if(this.settings){
        this.settings.json = (typeof this.settings.json == "string") ? JSON.parse(this.settings.json) : this.settings.json;
        this.settingName = this.settings.name;
        this.boolCustomerSection = this.settings.json.customerSection;
        this.boolPremisesSection = this.settings.json.premisesSection;
        this.boolLVSection = this.settings.json.lvSection;
        this.boolDBSection = this.settings.json.dbSection;
        this.boolGISSection = this.settings.json.gisSection;
      }
    
  }

  closeForm(){
    this.btnClose.emit();
  }

  sendSettings(){
    
      let json_settings = {
          "type"            : this.settingName.toUpperCase(), 
          "json"            : {
            "customerSection" : this.boolCustomerSection,
            "premisesSection" : this.boolPremisesSection,
            "lvSection"       : this.boolLVSection,
            "dbSection"       : this.boolDBSection,
            "gisSection"      : this.boolGISSection
          }
        
      }
      if(this.btnTitle == "Update"){
        json_settings['id'] = this.settings.id_config;

        this._appService.POST_METHOD(UTICKET_SETTINGS, {data: json_settings}).subscribe((response:any) =>{
            if(response.success){
                  jQuery.Notify({
                caption: "Settings",
                content: "Setting updated",
                type: this._appService.msg_codes.success
              });
              
          }else{
              jQuery.Notify({
              caption: "Settings",
              content: "Couldn't save to database.",
              type: this._appService.msg_codes.alert
            });
          }
        });
      }else{
          this._appService.POST_METHOD(ITICKET_SETTINGS, {data:json_settings}).subscribe((response:any) =>{
          console.log(response);
          if(response.success){
                  jQuery.Notify({
                caption: "Settings",
                content: "Setting saved",
                type: this._appService.msg_codes.success
              });
              this.resetInfo();
          }else{
            jQuery.Notify({
            caption: "Settings",
            content: "Couldn't save to database.",
            type: this._appService.msg_codes.alert
          });
          }
        })
      }
  }

  resetInfo(){
    this.settingName = "";
    this.boolCustomerSection = false;
    this.boolPremisesSection  = false;
    this.boolLVSection =false;
    this.boolDBSection =false;
    this.boolGISSection = false;
  }
}
