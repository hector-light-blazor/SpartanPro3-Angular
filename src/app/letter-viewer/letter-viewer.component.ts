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
  canvas:any;
  context: CanvasRenderingContext2D;
  signature: SignaturePad;
  constructor() { }

  ngOnInit() {

    console.log(this.esign);
    console.log(this.src);
    console.log(this.page);
    this.canvas = this.myCanvas.nativeElement;
    
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
    var loadingTask = pdfjsLib.getDocument("https://gis.lrgvdc911.org/LETTER_TEMPLATES/" + this.src);
    loadingTask.promise.then(function(pdf) {
      // you can now use *pdf* here
      console.log("PAGE NUMBER " + _self.page);
      pdf.getPage(_self.page).then((page) => {
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
          renderTask.promise.then(function () {
            console.log('Page rendered');
            _self.signature = new SignaturePad(_self.canvas);
            // var image = new Image();
            //   image.onload = function() {
            //     _self.context.drawImage(image, 466, 928);
            //   };
            //   image.src = _self.esign;
          });
      });

    });
  }

  printCanvas()  
{  
    var dataUrl = this.canvas.toDataURL(); //attempt to save base64 string to server using this var  
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('','','width=340,height=260');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}

}
