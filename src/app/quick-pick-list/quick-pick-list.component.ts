import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-pick-list',
  templateUrl: './quick-pick-list.component.html',
  styleUrls: ['./quick-pick-list.component.css']
})
export class QuickPickListComponent implements OnInit {
  @Input() picks: Array<any> = [];
  @Output() remove = new EventEmitter();
  @Output() zoom = new EventEmitter();
  constructor() { }

  ngOnInit() {
   
  }

  removeElement(item, i) {
  
    this.picks.splice(i, 1);

    // Tell the parent component to remove graphic..
    this.remove.emit(item);
  }

  zoomPic(item, i) {
    
    this.zoom.emit(item);
  }

  uploadPic(item) { 

      console.log(item);
  }

}
