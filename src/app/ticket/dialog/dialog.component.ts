import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() attributes: any = null;
  @Output() close = new EventEmitter();
  @Output() send = new EventEmitter();
  choosen: string = "";
  names: Array<string> = [];

  constructor() { }

  ngOnInit() {
   
    if(this.attributes) {
      this.names.push(this.attributes.clast_name + " " + this.attributes.cfirst_name);
      this.names.push(this.attributes.plast_name + " " + this.attributes.pfirst_name);
    }
  
  }

  closeDialog() {
    this.close.emit(true);
  }

  sendLetterRequest() {
    this.send.emit(this.choosen);
  }

}
