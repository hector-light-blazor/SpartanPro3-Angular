import { Component, OnInit, Input } from '@angular/core';
import { WorksheetService, SUBDIVISIONS } from '../../worksheet.service';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-attach-page',
  templateUrl: './attach-page.component.html',
  styleUrls: ['./attach-page.component.css']
})
export class AttachPageComponent implements OnInit {
  

  arrPics: Array<any> = [];
  previewON: boolean = false;
  groupPics: Array<any> = [];
  ngroup: number = 3;
  isAlive: boolean = true;
  constructor(private worksheetService: WorksheetService) { }

  ngOnInit() {
   // console.log(this.worksheetService.attachments);
    
    

    this.worksheetService.attachCommunication.takeWhile(() => this.isAlive)
    .subscribe((attach) => {
       // console.log("WORKSHEET TOLD ME SOMETHING");
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

    let index = -1;
    let len = this.worksheetService.attachments.length;

    for(var i = 0; i < len; i++) {
      if(this.worksheetService.attachments[i].position == position) {
        index = i;
        break;
      }
    }

    this.worksheetService.attachments.splice(index, 1);
    let arr =  this.worksheetService.attachments.slice();
    this.arrPics = arr;

    this.groupPics = this.chunk(this.arrPics, 0, 3);

    this.worksheetService.worksheetCommunication.next({action:"REMOVE", pos: position});
  }

 // This is to change the overlay picture from the new attachment source
 // But if the user press the one is current selected then we are going to remove that on from georeference..
  changeGeo(object:SUBDIVISIONS) {
    
    // We are going to try if not we failed...
    try {

      if(object.selected) {

      
       
        this.worksheetService.leafletCommunication.next({remove: true, overlay: false, pos: object.position, selection: object.selected});
        object.selected = false;
        // Kill it
        return;
      }

      if(object) {
        this.worksheetService.attachments.forEach(element => {
            element.selected = false;
        });


        // The new selected turn true..
        object.selected = true;

        // this.worksheetService.worksheetCommunication.next({action:"REFERENCE", overlay:object.source, position: object.position });

        this.worksheetService.leafletCommunication.next({remove: false, overlay: true, source: object.source, position: object.position});
        

      }
    } catch (error) {
      
    }
      
     
  }

  onPreview(object: SUBDIVISIONS) {
    console.log(object);
    this.worksheetService.worksheetCommunication.next({preview: true, source: object.source});
  }

}
