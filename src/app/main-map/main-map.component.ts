import { Component,ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { AppService } from '../app.service';
import * as EXIF from "exif-js/exif"
import { MapServiceService } from '../map-service.service';


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
  displayIdentify: boolean = false;
  dragging: boolean = false;
  files: Array<File>;
  fileName: string = "Waiting...";
  fileLoaded:boolean = false;
  pointSymbol: any = null; //holds the point symbol...
  quickPickCollections: Array<any> = []; // Collect all the photos into array for future process...
  displayCollection: boolean = false;
  collectionIndex: number = 0;
  isAlive: boolean = true;

  constructor(private app: AppService,private mapService: MapServiceService, private sanitizer: DomSanitizer) { }

  
  // Gets call by angular that is ready..
  ngOnInit() {

    //=-=-=-= REMOVE OVERFLOW BODY =-==-=
    let fluentHeader = document.getElementById("fluent-menu");
    
    document.body.style.overflow = 'hidden';


    // =-=-= GOINT TO CONTROL ALL THE TOOL BAR ACTIONS =-=-=-=-=
    this.app.toolbarActions.takeWhile(() => this.isAlive).subscribe(action => {

        // Send it to map Service to make the decision...
       switch (action.action) {
        case this.app.toolbarActivies.MAP_IDENTIFY:
          this.mapService.iOn = true;
          this.map.setCursor("pointer")
          break;
      
        default:
          break;
      }

    
    })

    // Setup some tools
    this.mapService.identifyObject = new this.app.esriIdentifyTask(this.app.mapFlexURL);
    this.mapService.identifyParams = new this.app.esriIdentifyParams()
    //=-=-= INIT MAP =-=-=
    this.initMap();
  }

  // Gets call when angular componenet is destroy

  ngOnDestroy() {
    document.body.style.overflow = 'auto';

    this.isAlive = false;

    // Going to try to destroy object...
    try {
     
      this.map.destroy(); // Destroy the map instance...
    } catch (error) {
      
    }
    
  }




  // =-=-=-= INIT MAP =-=-=-=
  initMap() {

    let _self = this;
     // Setup PROXY IF NOT BEEN ALREADY this only applies to esri
     this.app.esriConfig.defaults.io.proxyUrl = this.app.proxyUrl

     // Create Map Object...
     this.map = new this.app.esriMap(this.mapObj.nativeElement,{
        center: [-98.181494, 26.208254], 
        zoom: 8,
        slider: false,
        isDoubleClickZoom: false
     });

     // Set the map object..
     this.mapService.setMapObj(this.map);

     // FINISH THE INDENTIFY PARAMS.....
     this.mapService.identifyParams.tolerance = 3;
     this.mapService.identifyParams.returnGeometry = true;
     this.mapService.identifyParams.layerIds = [1, 8, 11, 46];
     this.mapService.identifyParams.layerOption = this.app.esriIdentifyParams.LAYER_OPTION_ALL;
     this.mapService.identifyParams.width = this.map.width;
     this.mapService.identifyParams.height = this.map.height;


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



       // Setup Listeners...

       this.map.on("extent-change", object => {

          // Time outs on extent change..
          setTimeout(() => {
            if(_self.mapService.iOn) {
              _self.map.setCursor("pointer");
            }
          }, 300);

       });

       this.map.on('click', object => {
          
        // Identifies layers..
        if(this.mapService.iOn) {
            this.mapService.identifyParams.geometry = object.mapPoint;
            this.mapService.identifyParams.mapExtent = this.map.extent;
            var deferred = this.mapService.identifyObject.execute(this.mapService.identifyParams).addCallback(response => {

               response.forEach(element => {
                  element.display = false;
               });

               this.mapService.identifyResponse = response;
               this.mapService.iOn = false;
               this.displayIdentify = true;
            });

          }

       });
      

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

  //=-=-=-=-=-= REMOVE GRAPHICS FROM QPICK =-=-=-=-=
  removeQPick(graphic) {

    // REmove the selected graphic..
    this.quickPickBase.remove(graphic.graphic);
    this.displayCollection = (this.quickPickBase.graphics.length > 0) ? true : false; // If Less than 0 graphics then hide left panel..
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


    async handleInputChange(e) {

      let _self = this;
      this.files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        var reader = new FileReader();

        // Once Loaded process
        reader.onload = this._handleReaderLoaded.bind(this);

    

      if(!this.displayCollection) {
        this.displayCollection = true;
      }

      if(this.files.length == 1) {

      
        // <<<<GET THE PICTURE NAME>>>>
        this.quickPickCollections.push({name: this.files[0].name});
      
        reader.readAsArrayBuffer(this.files[0]); 
      

      }else if(this.files.length > 1) {
          this.collectionIndex = 0;//this.files.length - 1;
          for(var i = 0; i < this.files.length; i++) {
             var promise = Promise.resolve();
            // console.log("HEY " + i)

             await this.pFileReader(this.files[i]).then(e => {
                // console.log(e);
                // console.log(_self.files[_self.collectionIndex].name);
                _self._processMultiple(e, _self.files[_self.collectionIndex].name);
                _self.collectionIndex++;
             });
          
          }

      }
      
  }

 async pFileReader(file): Promise<any>{
    return await new Promise((resolve, reject) => {
      var fr = new FileReader();  
      fr.onload = resolve;  // CHANGE to whatever function you want which would eventually call resolve
      fr.readAsArrayBuffer(file);
    });
  }
 

  
 _processMultiple(e, name) {
  //  console.log(e)
  var reader = e.target;
    
  // GET EXIF BINARY FILE
  var exif = EXIF.readFromBinaryFile(reader.result);
  
  // GET GPS LONGY AND LAT
  var lng = this.toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);
  var lat = this.toDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
 
 // console.log(this);
  var pnt = new this.app.esriPoint(lng, lat);

  // Add to the current array.
  // From Blob array create URL
  var arrayBufferView = new Uint8Array( reader.result );
  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
  var urlCreator = window.URL;
  var imageUrl = urlCreator.createObjectURL( blob );
  let graphic = new this.app.esriGraphic(pnt, this.pointSymbol)
  this.quickPickCollections.push({graphic: graphic, pnt:  pnt, src: this.sanitizer.bypassSecurityTrustUrl(imageUrl), name: name});
 //this.quickPickCollections[this.quickPickCollections.length - 1]['src'] = this.sanitizer.bypassSecurityTrustUrl(imageUrl); // this will fix the unsafe blob image..
 
 // console.log("DONE");
  this.quickPickBase.add(graphic);
 }


  _handleReaderLoaded(e) {
    //  console.log(e)
     var reader = e.target;
    
     // GET EXIF BINARY FILE
     var exif = EXIF.readFromBinaryFile(reader.result);
    // console.log(exif);
     // GET GPS LONGY AND LAT
     var lng = this.toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);
     var lat = this.toDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
     
  
     var pnt = new this.app.esriPoint(lng, lat);

     // Add to the current array.
     // From Blob array create URL
     var arrayBufferView = new Uint8Array( reader.result );
     var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
     var urlCreator = window.URL;
     var imageUrl = urlCreator.createObjectURL( blob );
    
     let name = this.quickPickCollections[this.quickPickCollections.length - 1]['name'];
     this.quickPickCollections[this.quickPickCollections.length - 1]['pnt'] = pnt;
     this.quickPickCollections[this.quickPickCollections.length - 1]['src'] = this.sanitizer.bypassSecurityTrustUrl(imageUrl); // this will fix the unsafe blob image..
     let graphic = this.quickPickCollections[this.quickPickCollections.length - 1]['graphic'] = new this.app.esriGraphic(pnt, this.pointSymbol, {name: name})
     //console.log(this.quickPickCollections);
     this.quickPickBase.add(graphic);
  }

    // Convert decimal degrees
    toDecimal(number, hemi) {
      var flip = (hemi == "W" || hemi == "S") ? -1 : 1;

      var response = number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);


      return flip * response;
  };

    


}