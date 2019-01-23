import { Component, OnInit,Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


var _self = this;
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  @ViewChild("tool") tool: ElementRef;
  @Output() cmd = new EventEmitter();

  startX: number = 0;
  startY: number = 0;
  x: number = 0;
  y: number = 0;
  xf: string = "";
  yf: string = "30px";
  dragStart: boolean = false;

 
  constructor() { }

  ngOnInit() {

  }

  // When it starts.
  onDragStart(event) {
    
    this.startX = event.screenX - this.x;
    this.startY = event.screenY - this.y;

  }
  // While is dragging.
  onDrag(event) {
    
    this.x = (event.screenX - this.startX);
    this.y =  (event.screenY - this.startY);
    this.xf = this.x + "px";
    this.yf = this.y + "px";
    
  }

  // When dragging is done...
  onDragEnd(event) {
    this.x = (event.screenX - this.startX);
    this.y =  (event.screenY - this.startY);
    this.xf = this.x + "px";
    this.yf = this.y + "px";
  }


  addText() {
    this.cmd.emit({text: true});
  }

  onSave() {
    this.cmd.emit({save: true});
  }

 

}
