import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-master-loading',
  templateUrl: './master-loading.component.html',
  styleUrls: ['./master-loading.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MasterLoadingComponent implements OnInit {

 
  @Input() regularLoading: boolean = false;
  constructor() { }

  ngOnInit() {
  
  }



}
