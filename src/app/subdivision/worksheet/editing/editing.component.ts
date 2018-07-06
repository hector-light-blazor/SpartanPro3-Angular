import { Component, OnInit,Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { WorksheetService } from '../../worksheet.service';

declare var fabric;
@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.css']
})
export class EditingComponent implements OnInit {

  @ViewChild("editing") myCanvas: ElementRef;
  @Input() source: any = null;
  @Output() close  = new EventEmitter();
  isAlive: boolean = true;
  canvas: any = null;
  context: any = null;
  lastX:number =0;
  lastY: number =0;
  scaleFactor:any = 1.1;
  image: any = null;
  constructor(public worksheet: WorksheetService) {

     
      
   }

  ngOnInit() {

    this.worksheet.editingCommunication.takeWhile(() => this.isAlive)
    .subscribe((action) => {
        if(action.load) {
            this.loadCanvas(action.source);
        }
    });

    if(this.source) {

      let _self = this;

      setTimeout(() => {
        _self.loadCanvas(_self.source);
      }, 200);


     
    }

  }


  // Loading Canvas with source..
  loadCanvas(source) {
    console.log(fabric);

    this.canvas = new fabric.Canvas('c', {
      hoverCursor: 'pointer',
      selection: true,
      perPixelTargetFind: true,
      targetFindTolerance: 5
    })

     // load sun and center it
      fabric.Image.fromURL(source, (image)  => {
        
        this.canvas.setWidth(image.width);
        this.canvas.setHeight(image.height);
       
       //  image.center();

        var itext = new fabric.Text('This is a IText object', {
          left: 100,
          top: 150,
          fill: '#D81B60',
          strokeWidth: 2,
          stroke: "#880E4F",
        });

      
        this.canvas.setOverlayImage(image, this.canvas.renderAll.bind(this.canvas));

        console.log(this.canvas);
     


      });
    
  }

 

  // When the component is destroy...
  ngOnDestroy() {

    this.isAlive = false;
  }

  // Tell Parent component that we are closing the component
  onClose() {
    this.close.emit(true);
  }


  //Controls the zoom in..
  mouseScroll(e) {
    console.log("I am running");
    var evt=window.event || e;
		var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;
		var curZoom = this.canvas.getZoom(),  newZoom = curZoom + delta / 4000,
		x = e.offsetX, y = e.offsetY;
		//applying zoom values.
		this.canvas.zoomToPoint({ x: x, y: y }, newZoom);
		if(e != null)e.preventDefault();
		return false;
  }

}
