import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-basemap',
  templateUrl: './basemap.component.html',
  styleUrls: ['./basemap.component.css']
})
export class BasemapComponent implements OnInit {

  @Input() offset: boolean = false;
  @Output() change = new EventEmitter();

  mapflex: number = 0;
  wms: number = 1;
  google: number =2;
  vsub: number = 3;
  varrow: number = 4;
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges() {
    var container = document.getElementById("base");
    if(this.offset) {
     
      container.style.top = "230px";
    }else {
      container.style.top = "";
    }
  }

  changeBase(base) {
    // Tell the parent component what happend...
    this.change.emit(base);
  }

}
