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
    let _self   = this;
    this.canvas = new fabric.Canvas('c', {
      hoverCursor: 'pointer',
      selection: true,
      perPixelTargetFind: true,
      targetFindTolerance: 5
    })


    this.canvas.on('mouse:down', function(opt) {
     
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }else {
        var itext = new fabric.Text('This is a IText object', {
          left:0,
          top: 0,
          fill: 'red',
          strokeWidth: 2,
          stroke: "#880E4F",
        });
        console.log(itext);
        _self.canvas.add(itext);
        this.renderAll();
        itext.bringToFront();
      }
    });
    this.canvas.on('mouse:move', function(opt) {
      if (this.isDragging) {
        var e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.renderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    this.canvas.on('mouse:up', function(opt) {
      this.isDragging = false;
      this.selection = true;
    });

     // load sun and center it
      fabric.Image.fromURL(source, (image)  => {
        
        this.canvas.setWidth(window.innerWidth -100);
        this.canvas.setHeight(window.innerHeight-100);
       
       //  image.center();

        
        console.log(this.canvas);
      
        this.canvas.setOverlayImage(image, this.canvas.renderAll.bind(this.canvas));
     
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
