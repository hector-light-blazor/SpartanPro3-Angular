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
  cmd: CMD_TOOLS = {text: false, square: false};
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
      selection: false,
      perPixelTargetFind: true,
      targetFindTolerance: 5
    })

    this.HandlerCanvasEvents();

     console.log(this.canvas);

     // load sun and center it
      fabric.Image.fromURL(source, (image)  => {
        
        this.canvas.setWidth(image.width);
        this.canvas.setHeight(image.height);
        
        image.set({width: this.canvas.width, height: this.canvas.height, originX: 'left', originY: 'top'});
        this.canvas.setBackgroundImage(image, this.canvas.renderAll.bind(this.canvas));
       // ths.canvas.
      
       // this.canvas.setOverlayImage(image, this.canvas.renderAll.bind(this.canvas));
     
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


  // This gets executed when editing/tools : BUTTONS GET PRESSED>>>>>>
  cmdInfo(event) {
    if(event['text']) {
     
      this.cmd.text = true;
      this.canvas.defaultCursor = "crosshair";
    }
  }



  // This events are controll by the cmds comming from the editing/tools : component
  HandlerCanvasEvents() {
    let _self = this; // GET THE MAIN CLASS OBJECT>..

    this.canvas.on('mouse:down', function(opt) {
     
      var evt = opt.e;
      if (evt.altKey === true) {
       
        this.defaultCursor = "move";
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }else if(_self.cmd.text){
        var itext = new fabric.IText('Hello', {
          left: this.lastPosX,
          top: this.lastPosY,
          fill: 'red',
          strokeWidth: 2,
          stroke: "#880E4F",
        });
       
        _self.canvas.add(itext);
        this.renderAll();
       // itext.bringToFront();
        _self.cmd.text = false;
       this.defaultCursor = "default";
      }
    });
    this.canvas.on('mouse:move', function(opt) {
    
      var e = opt.e;
      if (this.isDragging) {
        this.defaultCursor = "move";
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.renderAll();
       
      }

      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;

    });
    this.canvas.on('mouse:up', function(opt) {
      this.isDragging = false;
      this.selection = true;
      this.defaultCursor = "default";
    });
  }


 

}

interface CMD_TOOLS {
  text: boolean;
  square: boolean;
}
