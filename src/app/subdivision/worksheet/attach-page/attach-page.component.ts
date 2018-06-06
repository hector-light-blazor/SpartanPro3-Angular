import { Component, OnInit, Input } from '@angular/core';
import { WorksheetService } from '../../worksheet.service';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-attach-page',
  templateUrl: './attach-page.component.html',
  styleUrls: ['./attach-page.component.css']
})
export class AttachPageComponent implements OnInit {
  

  arrPics: Array<PICS> = [{name: "BOB", src: "TEST.jpg"}];

  groupPics: Array<any> = [];
  ngroup: number = 3;
  isAlive: boolean = false;
  constructor(private worksheetService: WorksheetService) { }

  ngOnInit() {
    console.log(this.worksheetService.attachments);
    
    // while(this.arrPics.length > 0) {
    //    this.groupPics.push(this.arrPics.splice(0, this.ngroup))
    // }

    this.worksheetService.attachCommunication.takeWhile(() => this.isAlive)
    .subscribe(() => {
        console.log("WORKSHEET TOLD ME SOMETHING");
    })

  }

  ngOnChanges() {
    console.log(this.worksheetService.attachments);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}

interface PICS {
  src: string,
  name: string
}
