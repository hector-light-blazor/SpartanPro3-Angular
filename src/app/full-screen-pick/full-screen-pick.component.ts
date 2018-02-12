import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-full-screen-pick',
  templateUrl: './full-screen-pick.component.html',
  styleUrls: ['./full-screen-pick.component.css']
})
export class FullScreenPickComponent implements OnInit {
  @Input() src: string = "assets/default-image.png";
  @Output() onClose = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  // Close window...
  _onCloseWindow(){
    this.onClose.emit(false) 
  }

}
