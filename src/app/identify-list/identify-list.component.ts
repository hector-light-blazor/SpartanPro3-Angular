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
  @Output() display = new EventEmitter();

  opacity: any = 1;

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

     // Only if the feature is display true
     if(feature.display) 
         this.display.emit(feature.feature);
    

  }

  onClose() {

      this.close.emit(false);
  }

  // Display the transparency..
  onTransparency() {
    this.opacity = (this.opacity == 1) ? 0.5 : 1;
  }

  onMini() {
     // Make the identify window minimized...
     var container = document.getElementById("container");
     var arrow = document.getElementById("arrow");
     container.style.display = 'none';
     arrow.style.display = "block"
  }
  unMini() {

    var container = document.getElementById("container")
    var arrow = document.getElementById('arrow')
    container.style.display = "block"
    arrow.style.display = "none"
  }
}
