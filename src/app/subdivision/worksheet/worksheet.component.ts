import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorksheetService } from '../worksheet.service';
import "rxjs/add/operator/takeWhile";
import {WORKSHEET_NUMBER} from '../worksheet.api';

declare var pdfjsLib:any;
declare var Tiff: any;
@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css']
})
export class WorksheetComponent implements OnInit {


  @ViewChild("pdfCanvas") myCanvas: ElementRef;

  
  dragging: boolean = false;
  overlay: any = null;
  isAlive: boolean = true;
  isLoading: boolean = false;
  remove: number;
  canvas: any;
  context: CanvasRenderingContext2D;
  previewON = false;
  source: any;
  editingOn: boolean = false;
  selectedEditing:any = null;

  constructor(public worksheetService: WorksheetService) {

   }

  ngOnInit() {
  
    //Lets Get New Worksheet Number ...
  
    // this.worksheetService.GET_METHOD(WORKSHEET_NUMBER).subscribe((response) => {
    //     console.log(response);
    //     if(response['success']) {
    //       let count = response['data'][0].count;
    //       let today = new Date();
    //       let dd = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();
    //       let mm = ((today.getMonth() + 1) < 10) ? 0 + (today.getMonth() + 1).toString() : today.getMonth() + 1;
    //       let yyyy = today.getFullYear();
    //       let object = (yyyy.toString().substr(-2)) + (mm.toString()) + (dd.toString());
    //       let zero = '00';
    //       if(count < 100){
    //         object += zero + count.toString();
    //       }else{
    //        object += (count.toString());
    //       }
    //       this.worksheetService.attributes.objectid =  parseInt(object);
    //     }
    // })


    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");

    // SET THE CANVAS AND CONTEXT...
    this.worksheetService.setCanvas(this.canvas);
    this.worksheetService.setContext(this.context);

    //TWO WAY Communication Service...
    this.worksheetService.worksheetCommunication.takeWhile(() => this.isAlive)
    .subscribe((action) => {
        if(action.preview) {
          this.previewON = true;

          this.source = action.source;
        }
        else if(action.editing) {
          this.editingOn = true;
          this.selectedEditing = action.source;
        }
    })

  }

  ngOnDestroy() {
  
    this.isAlive = false;
  }

  parsePDF(binary, geo) {
    let _self = this;
    var loadingTask = pdfjsLib.getDocument({data: binary}) //  this.pdfData});

    loadingTask.promise.then(function(pdf) {
   // console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then((page) => {
    //console.log('Page loaded');
    
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
    renderTask.then(function (e) {
       
        var dataURL = _self.canvas.toDataURL();
        let index = _self.worksheetService.attachments.length - 1
        _self.worksheetService.attachments[index].source = dataURL;

       if(geo){
        _self.worksheetService.leafletCommunication.next({remove: false, overlay: true, source: dataURL, position: _self.worksheetService.attachments[index].position});
        
       }
      

        _self.isLoading = false;
        _self.sendCommunication();
      });
    });
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });
  }

  sendCommunication() {
    //console.log("SENDING COM");
    this.worksheetService.attachCommunication.next(this.worksheetService.attachments);
  }

  // =-=-=-=-=-=-=-= THIS IS FOR DRAG AND DROP FILES TO VIEW ON MAP FOR PDF OR TIFFS =-=-=-=-=-=-=-=-=-=-=-=-=-=
  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {

      this.dragging = false;
  }

  handleDrop(e, reference) {
      e.preventDefault();
      this.dragging = false;
      this.isLoading = true;
      
      this.handleInputChange(e, reference);
  }

  handleInputChange(e, geo) {
    

      let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
     
      if(files.length == 1) {

        var d = new Date();
      
        let name:string = files[0].name;

        // Loop Through All the attachments change them to false...
        this.worksheetService.attachments.forEach(element => {
            if(geo) {
              element.selected = false;
            }
        });

        // The new one only will have selected true...
        this.worksheetService.attachments.push({name: name, source: "", selected: geo, file: files[0], degrees: 0, image: document.createElement("img")});
        this.worksheetService.attachments[this.worksheetService.attachments.length - 1].position = d.getTime();
        
        if(name.toLowerCase().includes(".pdf")) {

          var reader = new FileReader();

          reader.onload = (target) => {
            this.parsePDF(target.currentTarget['result'], geo)
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
            let index = this.worksheetService.attachments.length - 1
            //this.overlay = {src: dataURL, selection: this.worksheetService.attachments[index].position};
            if(geo){
              this.worksheetService.leafletCommunication.next({remove: false, overlay: true, source: dataURL, position: this.worksheetService.attachments[index].position});
        
            }
           
            this.worksheetService.attachments[index].source = dataURL;
            
            this.isLoading = false;
            this.sendCommunication();
            
          }
  
          // Read the array of buffer...
          reader.readAsArrayBuffer(files[0]);

        }

        else if(name.toLowerCase().includes(".png") || name.toLowerCase().includes(".jpg") || name.toLowerCase().includes(".jpeg")) {
         

          var reader = new FileReader();

            reader.onload =  (e) => {
            //  console.log(e)

              let index = this.worksheetService.attachments.length - 1;
              if(geo){
                this.worksheetService.leafletCommunication.next({remove: false, overlay: true, source: e.currentTarget['result'], position: this.worksheetService.attachments[index].position});
        
              }
             
              this.worksheetService.attachments[index].source = e.currentTarget['result'];

              this.isLoading = false;

              this.sendCommunication();
            };

            reader.readAsDataURL(files[0]);
        }
      }

     
  }

}



