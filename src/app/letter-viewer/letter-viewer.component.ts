import { Component, OnInit, Input,Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import SignaturePad from 'signature_pad';
import { AppService } from '../app.service';
declare var pdfjsLib:any;
declare var jQuery:any;
@Component({
  selector: 'app-letter-viewer',
  templateUrl: './letter-viewer.component.html',
  styleUrls: ['./letter-viewer.component.css']
})
export class LetterViewerComponent implements OnInit {
  @Input() src: string;
  @Input() page: number = 0;
  @Input() esign: string;
  @Input() pdfFile: any;
  @Input() id_ticket: any;
  @Output() close = new EventEmitter();
  @ViewChild("pdfCanvas") myCanvas: ElementRef;
  @ViewChild("signCanvas") signCanvas: ElementRef;
  loading: boolean = false;
  attach_loading: boolean = false;
  waterMark: string;
  canvas:any;
  canvasSign: any;
  canvasMerge: any;
  message: string = "";
  informationDisplay: boolean= false;
  context: CanvasRenderingContext2D;
  mergeContext: CanvasRenderingContext2D;
  signature: SignaturePad;
  width: string;
  height: string;
  constructor(private app: AppService) { }

  ngOnInit() {

    this.canvasSign = this.signCanvas.nativeElement;
    this.canvas = this.myCanvas.nativeElement;
    this.canvasMerge =  document.createElement('canvas');
    
    this.context = this.canvas.getContext("2d");
    if(this.src) {
      this.parsePDF();
    }else if(this.pdfFile) {
      this.parsePDF();
    }
   
  }

  onClose() {
      this.close.emit(true);
  }


  parsePDF() {
    let _self = this;
    //let sourcePDF = (this.src.includes("https")) ? this.src : "https://gis.lrgvdc911.org/LETTER_TEMPLATES/" + this.src;
    var loadingTask = pdfjsLib.getDocument("https://gis.lrgvdc911.org/LETTER_TEMPLATES/" + this.pdfFile['pdf']);
    loadingTask.promise.then(function(pdf) {
      // you can now use *pdf* here
      
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

  printCanvas2(open:boolean = true, attach: boolean = false) {
    if(open) {
      this.loading = true;
      let data = this.signature.toData();
   
      //if no signature then can't attach...
      if(data.length < 1) {
        jQuery.Notify({
          caption: 'Error',
          content: "No Signature Found!!",
          type: this.app.msg_codes.alert
        });
        this.attach_loading = false;
        this.informationDisplay = true;
             this.message = "No Signature Found!!";
        return;
      }
   
    }


    
    let form = new FormData();
    
    form.append("image", this.canvasSign.toDataURL());
    form.append("pdf", this.pdfFile['pdf']);
    form.append("page", this.pdfFile['page'])
    
      this.app.POST_METHOD(this.app.route.api.gEsignCompletion, form).subscribe((response) => {

          response = (typeof(response) == 'string') ? JSON.parse(response) : response;
          
          
          
          if(response.hasOwnProperty("watermark")) {
            this.waterMark = response['watermark'];
            var url = 'https://gis.lrgvdc911.org/LETTER_TEMPLATES/' + response['watermark'];
            
            if(open) {
              window.open(url);
            }

            if(attach) {
              this.attachFunction()
            }
            
            
            
           
          }
          this.loading = false;
      });
  }

  attachFunction() {
    this.mergeContext.drawImage(this.canvas, 0, 0);
    this.mergeContext.drawImage(this.canvasSign, 0, 0);
    let form = new FormData();
    form.append('fname', this.waterMark);
    form.append('ticketNumber', this.id_ticket);
    form.append('jpg', this.canvasMerge.toDataURL('image/jpeg'));
    this.app.POST_METHOD(this.app.route.api.aLTicket, form).subscribe((response) => {
       this.attach_loading = false;
       this.informationDisplay = true;
       this.message = "Letter has been attach";

    });
  }
  

  attachLetter() {
    this.attach_loading = true;
    const data = this.signature.toData();
   
      //if no signature then can't attach...
      if(data.length < 1) {
        jQuery.Notify({
          caption: 'Error',
          content: "No Signature Found!!",
          type: this.app.msg_codes.alert
        });
        this.attach_loading = false;
        this.informationDisplay = true;
             this.message = "No Signature Found!!";
        return;
      }

      if(this.waterMark){ //Awesome process it
            //Lets merge the signature for base jpg to send to php
          this.attachFunction();
      }else {
          this.printCanvas2(false, true);
      }
      

}

}
