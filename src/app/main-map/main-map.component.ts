import { Component,ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { AppService } from '../app.service';
import * as EXIF from "exif-js/exif"

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  // Global Variables..
  @ViewChild('map') mapObj:ElementRef; 
  @ViewChild('base') baseObj: ElementRef;

  // Esri Local Variables...
  map: any = null;
  mapFlexBase: any = null;
  skeletonFlexBase: any = null;
  quickPickBase: any = null;
  mapWMSBase: any = null;
  mapflex: number = 0;
  wms: number = 1;
  google: number =2;
  
  dragging: boolean = false;
  files: Array<File>;
  fileName: string = "Waiting...";
  fileLoaded:boolean = false;
  pointSymbol: any = null; //holds the point symbol...
  quickPickCollections: Array<any> = []; // Collect all the photos into array for future process...
  displayCollection: boolean = false;

  constructor(private app: AppService, private sanitizer: DomSanitizer) { }

  
  // Gets call by angular that is ready..
  ngOnInit() {

    //=-=-=-= REMOVE OVERFLOW BODY =-==-=
    let fluentHeader = document.getElementById("fluent-menu");
    
    document.body.style.overflow = 'hidden';

    //=-=-= INIT MAP =-=-=
    this.initMap();
  }

  // Gets call when angular componenet is destroy

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    this.map.destroy(); // Destroy the map instance...
  }




  // =-=-=-= INIT MAP =-=-=-=
  initMap() {
     // Setup PROXY IF NOT BEEN ALREADY this only applies to esri
     this.app.esriConfig.defaults.io.proxyUrl = this.app.proxyUrl

     // Create Map Object...
     this.map = new this.app.esriMap(this.mapObj.nativeElement,{
        center: [-98.181494, 26.208254], 
        zoom: 8,
        slider: false,
        isDoubleClickZoom: false
     });


     // TESTING POINT SYMBOL
     this.pointSymbol = new this.app.esriSimpleMarkerSymbol(
      this.app.esriSimpleMarkerSymbol.STYLE_CIRCLE, 
      12, 
      new this.app.esriSimpleLineSymbol(
      this.app.esriSimpleLineSymbol.STYLE_SOLID,
      new this.app.esriColor([0, 0, 0]), 
      4
      ), 
      new this.app.esriColor([220,20,60])
      );

      // Create Dynamic Map..
      this.mapFlexBase = new this.app.esriDynamicLayer(this.app.mapFlexURL);
      this.skeletonFlexBase = new this.app.esriDynamicLayer("https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/Adress_Streets/MapServer", {visible: false});
      
      // Create the WMS Layer Google Arieals.
       let layerInfo = new this.app.esriWMTSLayerInfo({identifier: 'texas', 
      titleMatrixSet: '0to20',format: 'png'});

      // Options For the WMS Layer..
      let options = {serviceMode: 'KVP', layerInfo: layerInfo, visible: false};
      
      // Create the WMS Layer GOOGLE ARIEALS>..
      this.mapWMSBase = new this.app.esriWMTSLayer(this.app.wmtsURL, options);
     

      this.quickPickBase = new this.app.esriGraphicsLayer();

      // Lets Load Layers to the map object...
       // add layer...
       this.map.addLayers([this.mapWMSBase,this.mapFlexBase, this.skeletonFlexBase, this.quickPickBase]);


      

  }


  // =-=-=-=-=-=-= CHANGE LAYERS =-=-=-=-
  changeBase(option) {
      if(option == this.mapflex){
        
        this.mapFlexBase.show();
        this.mapWMSBase.hide();
    
      }
      else if(option == this.wms) {
      this.mapFlexBase.hide();
       this.skeletonFlexBase.show();
   
       this.mapWMSBase.show();
      
      }

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
      this.files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
     
      if(!this.displayCollection) {
        this.displayCollection = true;
      }
      if(this.files.length == 1) {


        var reader = new FileReader();
        var reader64 = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader64.onload = this._handleBase64Loaded.bind(this);
        // <<<<GET THE PICTURE NAME>>>>
        this.quickPickCollections.push({name: this.files[0].name});
       // this.files[0].getAsDataURL();
        reader.readAsArrayBuffer(this.files[0]); 
       // reader64.readAsDataURL(this.files[0]);

      }else if(this.files.length > 1) {

          var length = this.files.length;
          for(var i = 0; i < length; i++) {
            var reader = new FileReader();
            var reader64 = new FileReader();

            this.quickPickCollections.push({name: this.files[i].name});
            
          }
      }
      
  }

  _handleBase64Loaded(e) {
    var target = e.target;
    this.quickPickCollections[this.quickPickCollections.length - 1]['src'] = target.result;
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    
     var exif = EXIF.readFromBinaryFile(reader.result);
     
     
     var lng = this.toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);
     var lat = this.toDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
     
  
     var pnt = new this.app.esriPoint(lng, lat);

     // Add to the current array.
     // From Blob array create URL
     var arrayBufferView = new Uint8Array( reader.result );
     var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
     var urlCreator = window.URL;
     var imageUrl = urlCreator.createObjectURL( blob );
  
     this.quickPickCollections[this.quickPickCollections.length - 1]['pnt'] = pnt;
     this.quickPickCollections[this.quickPickCollections.length - 1]['src'] = this.sanitizer.bypassSecurityTrustUrl(imageUrl); // this will fix the unsafe blob image..
      console.log(this.quickPickCollections);
     this.quickPickBase.add(new this.app.esriGraphic(pnt, this.pointSymbol));
  }

    // Convert decimal degrees
    toDecimal(number, hemi) {
      var flip = (hemi == "W" || hemi == "S") ? -1 : 1;

      var response = number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);


      return flip * response;
  };

    


}
