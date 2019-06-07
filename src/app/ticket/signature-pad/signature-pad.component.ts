import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import SignaturePad from 'signature_pad';
import { AppService } from '../../app.service';

declare var pdfjsLib:any;
@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements OnInit {

  signature: SignaturePad;
  @Input() pdfFile: any = null;
  @Output() close = new EventEmitter();
  canvas: HTMLCanvasElement = null;
  windowBody: HTMLElement = null;
  constructor(private appService: AppService) { 
    
  }

  ngOnInit() {
      console.log(this.pdfFile);
      this.canvas = <HTMLCanvasElement> document.getElementById('signature-pad');
      this.windowBody = <HTMLElement> document.getElementById("bodyContent");
      this.signature = new SignaturePad(this.canvas);
    
     // this.canvas.width = this.windowBody.clientWidth;
     // this.canvas.height = this.windowBody.clientHeight;

  }

  closeDialog() {
    this.close.emit(true);
  }

  clearSign() {
    this.signature.clear();
  }

  previewLetter() {
   

   // var w = window.open(this.signature.toDataURL());
    this.appService.cntAppFromLogin.next({esign: this.signature.toDataURL(), 
          pdfSRC:this.pdfFile.pdf, 
          PAGE_NUMBER:this.pdfFile.page});
  }
}
