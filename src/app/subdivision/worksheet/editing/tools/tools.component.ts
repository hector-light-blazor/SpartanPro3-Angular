import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


var _self = this;
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  @ViewChild("tool") tool: ElementRef;
  startX: number = 0;
  startY: number = 0;
  x: number = 0;
  y: number = 0;
  dragStart: boolean = false;

 
  constructor() { }

  ngOnInit() {

  }

 

}
