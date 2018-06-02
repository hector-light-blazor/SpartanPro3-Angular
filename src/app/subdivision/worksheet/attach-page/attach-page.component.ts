import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attach-page',
  templateUrl: './attach-page.component.html',
  styleUrls: ['./attach-page.component.css']
})
export class AttachPageComponent implements OnInit {
  @Input() src: string = "";

  arrPics: Array<PICS> = [{name: "BOB", src: "TEST.jpg"}];

  groupPics: Array<any> = [];
  ngroup: number = 3;

  constructor() { }

  ngOnInit() {

    
    while(this.arrPics.length > 0) {
       this.groupPics.push(this.arrPics.splice(0, this.ngroup))
    }
  }

  ngOnChanges() {
    if(this.src) {
      this.arrPics.push();
    }
  }

}

interface PICS {
  src: string,
  name: string
}
