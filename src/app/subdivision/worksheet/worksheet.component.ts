import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorksheetService } from '../worksheet.service';
import "rxjs/add/operator/takeWhile";

declare var pdfjsLib:any;
declare var Tiff: any;
@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css']
})
export class WorksheetComponent implements OnInit {

  streets: Array<STREET> = [];
  street: STREET = null;
  name: string;
  low: string;
  high: string;
  nameError: boolean = false;
  highError: boolean = false;
  lowError: boolean = false;
  dragging: boolean = false;
  overlay: any = null;
  isAlive: boolean = true;
 
  @ViewChild("pdfCanvas") myCanvas: ElementRef;
  canvas: any;
  context: CanvasRenderingContext2D;

    
  constructor(private worksheetService: WorksheetService) { }

  ngOnInit() {
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");

    //TWO WAY Communication Service...
    this.worksheetService.worksheetCommunication.takeWhile(() => this.isAlive)
    .subscribe(() => {
        console.log("ATTACHMENT TOLD ME SOMETHING");
    })

  }

  ngOnDestroy() {
    console.log("I AM DESTROY")
    this.isAlive = false;
  }

  parsePDF(binary) {
    let _self = this;
    var loadingTask = pdfjsLib.getDocument({data: binary}) //  this.pdfData});

    loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then((page) => {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport(scale);

    // Prepare canvas using PDF page dimensions
    
   
    _self.canvas.height = viewport.height;
    _self.canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: _self.context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.then(function () {
        console.log('Page rendered');
        let canvas = _self.myCanvas.nativeElement;

        var dataURL = _self.canvas.toDataURL();

        _self.worksheetService.attachments[_self.worksheetService.attachments.length - 1].source = dataURL;

        _self.overlay = dataURL;
        
        
        _self.sendCommunication();
      });
    });
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });
  }

  sendCommunication() {
    console.log("SENDING COM");
    this.worksheetService.attachCommunication.next(this.worksheetService.attachments);
  }

  // =-=-=-=-=-=-=-= THIS IS FOR DRAG AND DROP FILES TO VIEW ON MAP FOR PDF OR TIFFS =-=-=-=-=-=-=-=-=-=-=-=-=-=
  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {

      this.dragging = false;
  }

  handleDrop(e) {
      e.preventDefault();
      this.dragging = false;

      this.handleInputChange(e);
  }

  handleInputChange(e) {
    

      let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
      
      if(files.length == 1) {
        let name:string = files[0].name;
        this.worksheetService.attachments.push({name: name, source: ""});
        this.worksheetService.attachments[this.worksheetService.attachments.length - 1].position = this.worksheetService.attachments.length - 1;
        if(name.toLowerCase().includes(".pdf")) {

          var reader = new FileReader();

          reader.onload = (target) => {
            this.parsePDF(target.currentTarget['result'])
          }
  
          // Read the array of buffer...
          reader.readAsArrayBuffer(files[0]);
      
        }
        else if(name.toLowerCase().includes(".tif") || name.toLowerCase().includes('.tiff')) {

          //Process Tiff File...
          var reader = new FileReader();

          reader.onload = (target) => {

            //GEt The Array Buffer From Tiff and process..
            var tiff = new Tiff({buffer: target.currentTarget['result']});
            var canvas = tiff.toCanvas();

            // Send the Tiff to get overlay..
            var dataURL = canvas.toDataURL();
            this.overlay = dataURL;

            this.worksheetService.attachments[this.worksheetService.attachments.length - 1].source = dataURL;
            

            this.sendCommunication();
            
          }
  
          // Read the array of buffer...
          reader.readAsArrayBuffer(files[0]);



        }
      }

     
  }

}

interface STREET {
  name: string;
  low:  string;
  high: string;
}


