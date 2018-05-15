import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-basemap',
  templateUrl: './basemap.component.html',
  styleUrls: ['./basemap.component.css']
})
export class BasemapComponent implements OnInit {

  @Output() change = new EventEmitter();

  mapflex: number = 0;
  wms: number = 1;
  google: number =2;
  constructor() { }

  ngOnInit() {
  }

  changeBase(base) {
    // Tell the parent component what happend...
    this.change.emit(base);
  }

}
