import { Component, OnInit, Input,Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import SignaturePad from 'signature_pad';
declare var pdfjsLib:any;
@Component({
  selector: 'app-letter-viewer',
  templateUrl: './letter-viewer.component.html',
  styleUrls: ['./letter-viewer.component.css']
})
export class LetterViewerComponent implements OnInit {
  @Input() src: string = "https://gis.lrgvdc911.org/LETTER_TEMPLATES/1906041469_1559924597195.pdf";
  @Input() page: number = 0;
  @Input() esign: string;
  @Input() pdfFile: any;
  @Output() close = new EventEmitter();
  @ViewChild("pdfCanvas") myCanvas: ElementRef;
  @ViewChild("signCanvas") signCanvas: ElementRef;
  canvas:any;
  canvasSign: any;
  canvasMerge: any;
  context: CanvasRenderingContext2D;
  mergeContext: CanvasRenderingContext2D;
  signature: SignaturePad;
  width: string;
  height: string;
  constructor() { }

  ngOnInit() {

    console.log(this.esign);
    console.log(this.src);
    console.log(this.page);
    this.canvasSign = this.signCanvas.nativeElement;
    this.canvas = this.myCanvas.nativeElement;
    this.canvasMerge =  document.createElement('canvas');
    
    this.context = this.canvas.getContext("2d");
    if(this.src) {
      this.parsePDF();
    }
   
  }

  onClose() {
      this.close.emit(true);
  }


  parsePDF() {
    let _self = this;
    let sourcePDF = (this.src.includes("https")) ? this.src : "https://gis.lrgvdc911.org/LETTER_TEMPLATES/" + this.src;
    var loadingTask = pdfjsLib.getDocument("https://gis.lrgvdc911.org/LETTER_TEMPLATES/" + this.pdfFile['pdf']);
    loadingTask.promise.then(function(pdf) {
      // you can now use *pdf* here
      console.log("PAGE NUMBER " + _self.pdfFile['page']);
      pdf.getPage(_self.pdfFile['page']).then((page) => {
          var scale = 1.5;
          var viewport = page.getViewport(scale);

          // Prepare canvas using PDF page dimensions

          _self.canvasMerge.height = viewport.height;
          _self.canvasMerge.width = viewport.width;
          _self.canvas.height = viewport.height;
          _self.canvas.width = viewport.width;
          _self.canvasSign.height = viewport.height;
          _self.canvasSign.width = viewport.width;
          _self.width = viewport.width + "px";
          _self.height = viewport.height + "px";
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: _self.context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            console.log('Page rendered');
            _self.signature = new SignaturePad(_self.canvasSign);
            _self.mergeContext = _self.canvasMerge.getContext('2d');
            // var image = new Image();
            //   image.onload = function() {
            //     _self.context.drawImage(image, 466, 928);
            //   };
            //   image.src = _self.esign;
          });
      });

    });
  }

  onErase() { //Erase the signature..
    this.signature.clear();
  }

  printCanvas()  
{  

  
    this.mergeContext.drawImage(this.canvas, 0, 0);
    this.mergeContext.drawImage(this.canvasSign, 0, 0);
    
    var dataUrl = this.canvasMerge.toDataURL(); //attempt to save base64 string to server using this var  
   // var dataURL = this.canvasSign.toDataURL();
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Address Letter</title></head>';
    //windowContent += '<style>img {position: absolute;} </style>'
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
   // windowContent += '<img src="' + dataURL + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('','_blank');
    printWin.document.open();
    printWin.document.write(windowContent);
    //printWin.document.close();
    printWin.focus();
    printWin.print();
    //printWin.close();
}

}
