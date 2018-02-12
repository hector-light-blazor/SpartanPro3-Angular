import { Component,Input,Output, EventEmitter, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';


declare var jQuery:any;

@Component({
  selector: 'file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

  @Input() ticketid: string= "";
  @Output() actions = new EventEmitter<any>();
  pics = [];
  i:number = 0;
  rows = [];

  isLoading: boolean = false;

  constructor(private app: AppService) { }

  ngOnInit() {
    let _self = this;
    this.pics = [];
  
    // //Download http post...
    // this.getAttachments();
  }

  // When input changes next get attachments for this ticket..
  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    
    if(this.ticketid) {
      this.getAttachments();
    }
    
  }

  maximizeMap() {

  }

  minimizedMap() {
    
  }

  closeWindow() {
    this.actions.emit({action: 1, data: null});
  }

  //Get attachments for particular ticket..
  getAttachments(){
    if(!this.ticketid) {
      console.log("NO TICKET AVAILABLE");
      return;
    }
    this.app.POST_METHOD(this.app.route.api.gTAttachments,  {data: this.ticketid}).subscribe((response: any) => {
        //console.log(response)
        if(response.success){
          
          let length = (response.data.length - 1);
          if(response.data.length < 1) return;
          for(let x in response.data){
                
                var file = response.data[x].file_name.toLowerCase();
                if(file.includes(".jpg") || file.includes(".png"))
                {
                  response.data[x].preview = this.app.url + this.app.route.api.dTAttachment + response.data[x].file_name;
                }else if(file.includes(".pdf"))
                {
                  response.data[x].preview = this.app.url + this.app.route.api.dTAttachment + response.data[x].file_name.replace(".pdf", ".jpg").replace('.PDF', '.jpg');
                }

                else if(file.includes(".docx"))
                {
                  response.data[x].preview = this.app.url + this.app.route.api.dTAttachment + response.data[x].file_name.replace(".docx", ".jpg");
                }
                else if(file.includes(".doc"))
                {
                  response.data[x].preview = this.app.url + this.app.route.api.dTAttachment + response.data[x].file_name.replace(".doc", ".jpg");
                }
                else if(file.includes(".csv") || file.includes(".xlsx") || file.includes(".xls"))
                {
                 response.data[x].preview = "img/excel.png";
                }
                if(parseInt(x) == length)break;
          }
          this.pics = response.data;
          this.rows = Array.from(Array(Math.ceil(this.pics.length / 3)).keys());
          //console.log(this.rows);
        }
        
    });
  }
  
  //Download selected file from ticket..
  downloadFile(name){
    var url = this.app.url + this.app.route.api.gTFile + name;
    window.open(url, "_self");
  }

  //Delete attachment from ticket..
  deleteAttach(name){
    var con =  confirm("Delete Picture!");
    if(con){
      this.pics = [] // Reset pictures display
      this.app.POST_METHOD(this.app.route.api.dltAttachment, {data: name}).subscribe((response: any) => {
        if(response.success){
           jQuery.Notify({
                     caption: 'Attachment',
                     content: 'Delete Success',
                     type: this.app.msg_codes.success
            });
            this.pics = [];
            this.getAttachments();
        }
        else if(!response.success){
           jQuery.Notify({
          caption: "Delete",
          content: "Failed to delete",
          type: this.app.msg_codes.alert
        });
        }
      })
    }
  }
  

}

