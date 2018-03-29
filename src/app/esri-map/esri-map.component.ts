import { Component,ViewChild,Input, Output,ElementRef, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import {AppService} from '../app.service';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EsriMapComponent implements OnInit {

  @Output() closeClick = new EventEmitter<string>(); // close click element send event emitter to parent..
  @Output() reset = new EventEmitter<boolean>(); // handles reseting variables on parent comp if needed.
  @Output() mapEvents = new EventEmitter<any>(); // handles map events send back to parent..
  @Input() extent:any = null; // on change extent to zoom particular point of interest...
  @Input() polygon:any = null; // display polygon graphic location..
  @Input() point: any = null; // Display point graphic location....
  @Input() ticketEnabled: boolean = null; // This will handle to display graphics layer for tickets and editing portion...
  @Input() basemap: string = ''; //Tell the component what basemap to choose to display...
  @ViewChild('map') mapObj:ElementRef; // Controls the html element to put the web map..
  @ViewChild('window') window: ElementRef; // controls the container html of the map..

  // =-=-=-= ESRI VARIABLES _+_+__+_
  map: any; //Map Object to display layers...
  parcelLayer: any = null; // this layer displays all parcels for selection or display...
  ticketLayer: any = null; //Be able to edit and move graphic tickets...
  isLoading: boolean = true;
  edit: any = null;// this object handles the editing for the current graphics layer...
  pointSymbol: any = null; //holds the point symbol...
  polygonSymbol: any = null; // holds the polygon symbol....
  query: any = null; // holds query object...
  queryTask: any = null; // holds query task....
  quickPickLayer: any = null; // Holds all the camera pictures coming from quick pick...]
  msagLayer: any = null; // msag community layer..
  trackExtent: any = null;

  // =-=-= QUICK PICK TOOLS =-=-=-=-=-=
  quickPickEnabled: boolean = false;
  selectedAttributes: any = null;
  selectedPic: any = null;
  selectedQuickPick: any = null;
  enabledFullScreenPic: boolean = false;
  isAlive: boolean = true; //Controls the alive part for unsubscribe and subscribe...

  constructor(private app: AppService){ }

  ngOnInit() {

    //=-=-= INIT MAP =-=-=
    this.initMap();

    //=-=-= LISTENT TO EMITS FROM QUICK PICK TOOLS =-=-=-=-=
    this.app.actionsQuickPick.takeWhile(() => this.isAlive).subscribe(response => {
        if(response.action == 1) // Meaning to show fullscreen
        {
            this.enabledFullScreenPic = true;
        }
    });
  }

  ngOnChange() {
    
    // if(this.extent) { // Input 
    //   console.log(this.extent);
    // }
  }

  ngOnDestroy() {
    this.isAlive = false;
    if(this.map) {
      this.map.removeAllLayers();
      this.map.destroy();
    }
    
  }

  

  // =-=-=-=-= MODULE HANDLES INIT MAP =-=-=-=-=-=-=-=-=-=
  initMap() { 
    let _self = this;
    //Setup the map in 
    this.app.esriConfig.defaults.io.proxyUrl = this.app.proxyUrl

   this.map = new this.app.esriMap(this.mapObj.nativeElement,{
      center: [-98.181494, 26.208254], 
      zoom: 8,
      slider: false,
      isDoubleClickZoom: false
     });

     //Create query and query task objects if needed for future use...
     this.query = new this.app.esriQuery();
     // setup the properties for the query..
     this.query.outFields = [this.app.propertyId];
     this.queryTask = new this.app.esriQueryTask(this.app.hcadquery);



     // DIsplay parcels
     this.parcelLayer = new this.app.esriGraphicsLayer({id: "parcel"});

     // Display msag community
     this.msagLayer = new this.app.esriGraphicsLayer({id: "msag"});

     this.msagLayer.setMinScale(100000);

     // Display quick pick parcels layer..
     this.quickPickLayer = new this.app.esriGraphicsLayer({id: "quickPick"});
     this.quickPickLayer.setMinScale(150000); // Set min Scale for the layer...

    // =-=-=-=-=-=-= CHECK WHAT BASEMAP TO USE =-=-=-=-=-=-=-=
    if(this.basemap == 'MAPFLEX') {
     
      if(this.app.mapFlexBaseMap) {
        // Create the Layer...
        if(this.app.esriDynamicLayer) {
          
          this.app.mapFlexBaseMap = new this.app.esriDynamicLayer(this.app.mapFlexURL);
          this.map.addLayer(this.app.mapFlexBaseMap);
          this.map.addLayer(this.msagLayer);
          this.map.addLayer(this.parcelLayer);
        }
		
      }
     
    }else if(this.basemap == 'IMAGERY') {

      let layerInfo = new this.app.esriWMTSLayerInfo({identifier: 'texas', 
      titleMatrixSet: '0to20',format: 'png'});

      let options = {serviceMode: 'KVP', layerInfo: layerInfo};
      this.app.imageryLayer = new this.app.esriWMTSLayer(this.app.wmtsURL, options);
      this.app.mapFlexBaseMap = new this.app.esriDynamicLayer(this.app.mapFlexURL);
      this.app.mapFlexBaseMap.setVisibleLayers([32,0, 8]);
      this.map.addLayer(this.app.imageryLayer);
      this.map.addLayer(this.app.mapFlexBaseMap);
      this.map.addLayer(this.msagLayer);
      this.map.addLayer(this.parcelLayer);
    
    }

    // ALWAYS ADD THE QUICK PICK LAYER..
    this.map.addLayer(this.quickPickLayer);

    if(this.ticketEnabled) { // if true add the ticket graphics layer to map..

      this.ticketLayer = new this.app.esriGraphicsLayer({id: "tickets"});

      this.map.addLayer(this.ticketLayer);
    }

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

     
    this.polygonSymbol = new this.app.esriSimpleFillSymbol(this.app.esriSimpleFillSymbol.STYLE_SOLID,
        new this.app.esriSimpleLineSymbol(this.app.esriSimpleLineSymbol.STYLE_DASHDOT,
        new this.app.esriColor([0, 0, 0]), 4),new this.app.esriColor([12, 227, 172, 0.2])
        );


    
    // Loading off
    this.isLoading = false;
      
		

     // =-=-=-=-= INIT MAP EVENTS =-=-=-=-=-=-=-=
    this.map.on("load", response => { // TODO: once production added to load instead layer add result..
        //DID THEY PROVIDED EXTENT TO ZOOM IN
        if(this.extent) {
          this.map.setExtent(this.extent);
        }
    
    // Add Extent Change to display quick pick..
    this.map.on('extent-change', response => {
        let extent = this.app.esriwebMercatorUtils.webMercatorToGeographic(response.extent);
        
        if(this.trackExtent) {

          if(this.trackExtent.xmin != extent.xmin && this.trackExtent.ymin != extent.ymin && this.trackExtent.xmax != extent.xmax && this.trackExtent.ymax != extent.ymax) {
              
             this.getCameraLayer(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
          }

       }else {
          this.getCameraLayer(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
       }
       // .. GET THE OLD EXTENT NO MATTER WHAT ...
       this.trackExtent = extent; 
    });
    
    this.map.on('mouse-move', response => {

        if(this.ticketEnabled && !this.point) { // only if ticket is enabled..
            this.ticketLayer.clear();
            this.ticketLayer.add(new this.app.esriGraphic(response.mapPoint, this.pointSymbol));
        }
    });

    this.map.on('click', response => {
        if(this.ticketEnabled && !this.point) {
          let graphic = new this.app.esriGraphic(response.mapPoint, this.pointSymbol); // temporarily hold graphic...
          this.map.setMapCursor("default"); // Change Cursor back default
          
          this.ticketEnabled = false; // disable the fact of moving...
          this.ticketLayer.clear(); // remove all old graphic ...
          this.ticketLayer.add(graphic); // add to the new graphic new location..
        
          this.point = this.app.esriwebMercatorUtils.webMercatorToGeographic(response.mapPoint); // Convert to 4326 spatial reference...
          this.mapEvents.emit(this.point); // send the 4326 geometry back to the user...
          this.app.animateGraphic(graphic); // animate the graphic to be cool
          console.log(JSON.stringify(response.mapPoint));

           // lets search the property and send the found parcel from either hcad or db server holding the other information...
         
          this.app.GEOMETRY_METHOD('geom=' + JSON.stringify(response.mapPoint)).subscribe((response:any) => {
            
             if(response){
              if(response.features.length > 0) {
                //display polygon because we found one...
                let poly = new _self.app.esriPolygon(response.features[0].geometry);
                let graphic = new _self.app.esriGraphic(poly, _self.polygonSymbol);
                _self.parcelLayer.clear();
                _self.parcelLayer.add(graphic);

                 _self.mapEvents.emit(response.features[0]);


                 _self.app.animateGraphic(graphic);
               }
            }
          });

         
        }
    });

    if(this.ticketEnabled) {

      this.ticketLayer.on('dbl-click', response => {
         
          this.ticketEnabled = true;
          this.map.setMapCursor("pointer");
          if(this.point) {
            this.point = null;
          }
      });

    }


    // =-=-=-=-=-= ENDING OF MAP EVENTS =-=-=-=-=-=-=-=-=-=-=-=
     // Check if there is graphics to display...
     if(this.point) {
      // display...
      // Generate graphic..
      
      

      let graphic = new this.app.esriGraphic(this.point, this.pointSymbol);

      if(this.ticketEnabled) {
       
        if(this.app.esriEdit) {
          this.edit = new this.app.esriEdit(this.map); // enable edit object only if ticket is enabled...
        }
        this.ticketLayer.add(graphic);// Add the graphic to the map
      }else {
        this.map.graphics.add(graphic); // add the graphic to from the map object because we don't ahve the graphics layer enabled...
      }
    

      //TODO: Zoom to radius with circle extent...
      let circle = this.app.esriCircle(this.point, {"radius": 300});
      // this.map.centerAt(this.point);
      this.map.setExtent(circle.getExtent());

     
      this.app.animateGraphic(graphic);

      

      this.isLoading = false;
      
    }


      if(this.polygon) {
       
        


        let graphic = new this.app.esriGraphic(this.polygon, this.polygonSymbol);
      
       this.parcelLayer.add(graphic);
        

        // CALL MODULE TO ANIMATE GRAPHIC>>>
        this.app.animateGraphic(graphic);
      }
      
        // FINISH THE LOADING SCREEN>>>>
        this.isLoading = false;
	
    }); // End of Map Loaded...

    // Add Click on quick pick ...
    this.quickPickLayer.on("click", response => {

       if(response) { // Is there response

         if(response.graphic) { // is there graphic from the response
           console.log("I AM CHANGING ATTRIBUTES");
           this.selectedAttributes = null;
           this.selectedAttributes = response.graphic.attributes; // Send attributes to quick pick tools..
           this.selectedPic = this.app.url + this.app.route.api.dQuickPick + response.graphic.attributes.filepath;
           this.quickPickEnabled = true; // Display quick pick tools
           // Draw square for selecting the graphic...
           let symbol = new this.app.esriSimpleMarkerSymbol(this.app.esriSimpleMarkerSymbol.STYLE_SQUARE, 35,
            new this.app.esriSimpleLineSymbol(this.app.esriSimpleLineSymbol.STYLE_SOLID,
            new this.app.esriColor([255,0,0]), 1),
            new this.app.esriColor([0,0,0,0.1]));
          this.map.graphics.clear();
          let graphic = new this.app.esriGraphic(response.graphic.geometry, symbol)
          this.map.graphics.add(graphic);

          this.app.animateGraphic(graphic);
        }
       }
    })

    this.quickPickLayer.on('dbl-click', response => {
        console.log(response);
    });

  }

  // =-=-=-= MODULE CLEAR MAP GRAPHICS IF NEEDED =-=-=-=
  clearMapGraphics() {
    this.map.graphics.clear();
  }

  
  // =-=-=-=-=-=-=-=-= MODULE MINIMIZED MAP =-=-=-=-=-
  minimizedMap() {

  }

  // =-=-=-=-=-=-=-=-=-= MODULE MAXIMIZE MAP =-=-=-=-=-=-=-=-=-=
  maximizeMap() {

  }

  // GET CAMERA INFORMATION FROM SERVER =-=-=-=-=--=-
  getCameraLayer(xmin, ymin, xmax, ymax) {
    this.quickPickLayer.clear();
    this.app.POST_METHOD("qprocess/getBoxPics/", {data: { 
      xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax,
      orga: this.app.account_info.organization_id
         }}).subscribe((response:any) => {
          if(response.success) {
              let i = response.data.length;
              while(i--)
              {
                if(response.data[i].type == "H")
                {
                  this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.HomeObj, response.data[i]
                  ));
                }
                else if(response.data[i].type == "B")
                {  
                    this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.BusObj, response.data[i]));
                }
                else if(response.data[i].type == "M")
                {
                  this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.MobileObj, response.data[i]));
                }
                else if(response.data[i].type == "F")
                {
                  this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.FireObj, response.data[i]));
                }
                else if(response.data[i].type == "N")
                {
                  this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.PicNewObj, response.data[i]));
                }
                else if(response.data[i].type == "S")
                {
                 this.quickPickLayer.add(new this.app.esriGraphic(new this.app.esriPoint(
                    response.data[i].x, response.data[i].y), this.app.cameraGraphics.StreetSignObj, response.data[i]));
                }
              }
          }
    });
}


  // =-=-=-=-=-=-=-=-= MODULE CLOSE MAP -=-=-=-=-
  closeMap() {
    console.log("GOINT TO CLOSE MAP");

    this.closeClick.emit('close');
  }

}
