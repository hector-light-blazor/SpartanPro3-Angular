import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorksheetService } from '../../worksheet.service';


@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.css']
})
export class EditingComponent implements OnInit {

  @ViewChild("editing") myCanvas: ElementRef;
  isAlive: boolean = true;
  canvas: any = null;
  context: any = null;

  constructor(public worksheet: WorksheetService) {

     
      
   }

  ngOnInit() {

    this.worksheet.editingCommunication.takeWhile(() => this.isAlive)
    .subscribe((action) => {
        if(action.load) {
            this.loadCanvas(action.source);
        }
    });
  }

  loadCanvas(source) {
    if(!this.canvas) {
      console.log("HELLO")
       this.canvas =  this.myCanvas.nativeElement;
       this.context = this.canvas.getContext("2d");
    }
    var image = new Image();
    image.src = source;
    
    image.onload = () => {
      console.log(this);
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.context.drawImage(image, 0,0)
    }

   

    
  }

  ngOnDestroy() {

    this.isAlive = false;
  }

}
