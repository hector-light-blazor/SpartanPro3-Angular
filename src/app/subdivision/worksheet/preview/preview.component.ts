import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() source: any;

  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit(true);
  }

}
