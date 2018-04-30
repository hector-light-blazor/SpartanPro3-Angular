import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-pick-list',
  templateUrl: './quick-pick-list.component.html',
  styleUrls: ['./quick-pick-list.component.css']
})
export class QuickPickListComponent implements OnInit {
  @Input() picks: Array<any> = []
  constructor() { }

  ngOnInit() {
    console.log(this.picks);
  }

}
