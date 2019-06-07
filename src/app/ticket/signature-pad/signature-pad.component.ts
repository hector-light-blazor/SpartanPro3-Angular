import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import SignaturePad from 'signature_pad';

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
  constructor() { 
    
  }

  ngOnInit() {
      console.log(document.body.clientWidth);
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
    console.log(this.signature.toData());
    console.log(this.signature.toDataURL());

    var w = window.open(this.signature.toDataURL());
       // w.document.write(this.signature.toDataURL());
  }
}
