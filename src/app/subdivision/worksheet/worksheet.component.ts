import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var pdfjsLib:any;
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
  @ViewChild("pdfCanvas") myCanvas: ElementRef;

  context: CanvasRenderingContext2D;

    
  constructor() { }

  ngOnInit() {
    let canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
   
  }

  test(binary) {
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
    
    let canvas = _self.myCanvas.nativeElement;
    let context: CanvasRenderingContext2D = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.then(function () {
        console.log('Page rendered');
        let canvas = _self.myCanvas.nativeElement;

        var dataURL = canvas.toDataURL();
        _self.overlay = dataURL;
        console.log(dataURL);
      });
    });
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });
  }



  // =-=-=-=-=-=-=-= THIS IS FOR DRAG AND DROP FILES TO VIEW ON MAP SUCH AS QUICK PICK =-=-=-=-=-=-=-=-=-=-=-=-=-=
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
      console.log(e);

      let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
      var reader = new FileReader();

      reader.onload = (target) => {
        console.log(target);
        this.test(target.currentTarget['result'])
      }

      reader.readAsArrayBuffer(files[0]);

      console.log(files);
  }

}

interface STREET {
  name: string;
  low:  string;
  high: string;
}
