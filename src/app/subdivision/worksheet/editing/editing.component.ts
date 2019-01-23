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
  mouseX: number = 0;
  mouseY: number = 0;
  scaleFactor:any = 1.1;
  image: any = null;
  imgW: any = null;
  imgH: any = null;
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

     // load sun and center it
      fabric.Image.fromURL(source, (image)  => {
        
        // this.canvas.setWidth(image.width);
        // this.canvas.setHeight(image.height);
        this.imgH = image.height;
        this.imgW = image.width;

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
    this.canvas.dispose();
    this.close.emit(true);
  }


  //Controls the zoom in..
  mouseScroll(e) {
   
    var evt = window.event || e;
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

     
      var center = this.canvas.getCenter()
      var itext = new fabric.IText('Please enter text', {


        left: center.left,//(first == 1) ? _self.addOrSub(evt.clientX, this.viewportTransform[4]) : point.x,
        top:  center.top,//(first == 1) ? _self.addOrSub(evt.clientY, this.viewportTransform[5]) : point.y,
        fill: 'red',
        strokeWidth: 2,
        stroke: "#880E4F",
      });

      this.canvas.add(itext);
     
    }else if(event['save']) {
        this.canvas.setWidth(this.imgW);
        this.canvas.setHeight(this.imgH);
        this.canvas.setZoom(1);
      // console.log(this.canvas.getZoom())
        
    }
  }

 addOrSub(val, bval, mul = 0) {
   var response = 0;
   if(Math.sign(bval) == -1) {
      
     
        response = (val - (bval)); 
   }else {
      response = val - bval;
   }
  // console.log(response);
   return response;
 }

 newPoint(x, y, transform) {
   var pnt = new fabric.Point(x, y);
   var npnt = fabric.util.transformPoint(pnt, transform)

   return npnt;
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
      }else {
        // console.log(opt)
        // console.log(this);
      }

      // else if(_self.cmd.text){
       
      //   console.log(this.viewportTransform)
      //   let point = _self.newPoint(evt.clientX, evt.clientY, this.viewportTransform);
      //   let first = this.viewportTransform[0];
      //   var itext = new fabric.IText('Hello', {
      //     left: 0,//(first == 1) ? _self.addOrSub(evt.clientX, this.viewportTransform[4]) : point.x,
      //     top:  0,//(first == 1) ? _self.addOrSub(evt.clientY, this.viewportTransform[5]) : point.y,
      //     fill: 'red',
      //     strokeWidth: 2,
      //     stroke: "#880E4F",
      //   });
       
      //   _self.canvas.add(itext);
      //   this.renderAll();
      
      //   _self.cmd.text = false;
      //  this.defaultCursor = "default";
      // }
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
  
  hello(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

 

}

interface CMD_TOOLS {
  text: boolean;
  square: boolean;
}
