import { Component, OnInit, Input } from '@angular/core';
import { WorksheetService } from '../../worksheet.service';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-attach-page',
  templateUrl: './attach-page.component.html',
  styleUrls: ['./attach-page.component.css']
})
export class AttachPageComponent implements OnInit {
  

  arrPics: Array<any> = [];

  groupPics: Array<any> = [];
  ngroup: number = 3;
  isAlive: boolean = true;
  constructor(private worksheetService: WorksheetService) { }

  ngOnInit() {
   // console.log(this.worksheetService.attachments);
    
    

    this.worksheetService.attachCommunication.takeWhile(() => this.isAlive)
    .subscribe((attach) => {
        console.log("WORKSHEET TOLD ME SOMETHING");
        this.arrPics = attach.slice();

        this.groupPics = this.chunk(this.arrPics, 0, 3);
        
        


        // console.log(this.groupPics);
        // console.log(this.worksheetService.attachments);
    })

  }
  
  chunk(arr, start, amount){
    var result = [], 
        i, 
        start = start || 0, 
        amount = amount || 500, 
        len = arr.length;

    do {
        //console.log('appending ', start, '-', start + amount, 'of ', len, '.');
        result.push(arr.slice(start, start+amount));
        start += amount;

    } while (start< len);

    return result;
};

  ngOnChanges() {
    //console.log(this.worksheetService.attachments);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  removeItem(position) {
    this.worksheetService.attachments.splice(position, 1);
    let arr =  this.worksheetService.attachments.slice();
    this.arrPics = arr;

    this.groupPics = this.chunk(this.arrPics, 0, 3);

    this.worksheetService.worksheetCommunication.next({action:"REMOVE", pos: position});
  }

}
