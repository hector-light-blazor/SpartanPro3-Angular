import { Component,Input,Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-infomartion',
  templateUrl: './infomartion.component.html',
  styleUrls: ['./infomartion.component.css']
})
export class InfomartionComponent implements OnInit {
  @Input() message: string = "Waiting";
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  closeWindow() {
    this.close.emit(false);
  }

}
