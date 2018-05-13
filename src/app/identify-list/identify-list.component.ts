import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-identify-list',
  templateUrl: './identify-list.component.html',
  styleUrls: ['./identify-list.component.css']
})
export class IdentifyListComponent implements OnInit {

  @Input() list: Array<any> = null;
  selection: any = null;
  selectionIndex: number = -1;

  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  viewFeature(feature, i) {
    
    
    if(this.selectionIndex != i && this.selection) { // if they are not the same hide the other one.
      this.selection.display = false;
    }

     feature.display = (this.selectionIndex == i) ? !this.selection.display : true;

     // Always assign the new feature and selection index even is repeated..
     this.selection = feature;
     this.selectionIndex = i


    

  }

  onClose() {

      this.close.emit(false);
  }

}
