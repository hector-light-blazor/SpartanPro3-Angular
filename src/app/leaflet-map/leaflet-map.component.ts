import { Component,Input, OnInit } from '@angular/core';
import { WorksheetService } from '../subdivision/worksheet.service';
//
//import * as esri from "esri-leaflet";
declare var L:any;

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  @Input() overlay:any; // This Contains the image picture
  @Input() remove: any = null; // This will remove the layer if user removes it from attachments...


  map: any; // Map Object
  mapflex:any; // The Dynamic Layer
  wmts: any;  // The WMTS Layer Google Imagery
  imgOverlay: any = null // The image overlay object
  points: any = [];
  dropP = false; // This is to control if yes to drop points
  // points: Array<any> = []; // Collection of points to anchor the subdivision into the map
  opacitySlider: any = null;
  isAlive: boolean = true;
  

  constructor(private worksheetS: WorksheetService) { }

  ngOnInit() {

    
      try {
         this.setUpMap();

        this.setUpMapListener();

        // Setup The Opacity Control
        this.opacitySlider = new L.control.layerOpacity().addTo(this.map);
        

        // Setup Communication
        this.worksheetS.leafletCommunication.takeWhile(() => this.isAlive)
        .subscribe((action) => {

         // console.log(action);
           if(action.overlay) {
            if(action.source) {
             //  console.log("HELLO") 
           
             
              //console.log(this.map.getBounds());
              var bounds = this.map.getBounds();
            
              if(this.imgOverlay) { // IF OBJECT EXIST THEN JUST CHANGE SOURCE...
                this.imgOverlay.setUrl(action.source);
              }
              else { // THen object doesn't exists create object with new source...
        
                this.points.push({loc: bounds.getNorthWest(), marker:  L.marker(bounds.getNorthWest(), {draggable: true} ).addTo(this.map)});
                this.repositionHandler();
                this.points.push({loc: bounds.getNorthEast(), marker:  L.marker(bounds.getNorthEast(), {draggable: true} ).addTo(this.map)});
                this.repositionHandler();
                this.points.push({loc: bounds.getSouthWest(), marker:  L.marker(bounds.getSouthWest(), {draggable: true} ).addTo(this.map)});
                this.repositionHandler();
        
                this.imgOverlay = L.imageOverlay.rotated(action.source,  bounds.getNorthWest(), bounds.getNorthEast(),  bounds.getSouthWest(), {
                       
                  interactive: true,
                   attribution: ""
                 })
               
                 this.map.addLayer(this.imgOverlay);
          
                 this.opacitySlider.addLayer(this.imgOverlay);
              }
              
             
          
            }
           }
           else if(action.remove) {
             console.log(action);
            if(!isNaN(action.position)) { // if number then remove the layer and other information...

 
              if(action.selection) {
             
                if(this.imgOverlay) { // If this is not null we will do this if not don't bother.
                  this.map.removeLayer(this.imgOverlay);
                  this.imgOverlay = null;
         
                   this.points.forEach(element => {
                    this.map.removeLayer(element.marker);
                  });
                  this.points = [];
                 
                  return;
                }
              }
            }
           } // End of Action..
        });
        

       

      }  catch (error) {
         console.log("ERROR LEAFLET MAP")
         console.log(error);
      }


  }

 

  ngOnDestroy() {
   
     this.isAlive = false;
   }

  setUpMap() {
      // 1.) Setup Map Object....

      // 2.) Add Imagery to WMTS...

      // 3.) Add Roads and Points to Map....

      this.map = L.map("map", {loadingControl: true, maxZoom: 22}).setView([26.229259, -98.148752], 8);
   

      this.wmts = new L.TileLayer.WMTS( "https://wms-txgi.tnris.org/login/path/contour-camera-poetic-poem/wms" ,
        {
            layer: "texas",
            style: "normal",
            tilematrixSet: "PM",
            maxZoom: 22,
            format: "image/png",
            attribution: ""
        }
      );

      this.map.addLayer(this.wmts);

      // Only address and streets send to the front...
      
      this.mapflex = L.esri.dynamicMapLayer({
        url: "https://gis.lrgvdc911.org/arcgis2/rest/services//Dynamic/Adress_Streets/MapServer",
        position: 'back',
        zIndex: 0
      }).addTo(this.map);
    

    
    this.map.addLayer(this.mapflex);

      
    
   
  }

  setUpMapListener() {
    let _self = this;
   
    this.map.on("layeradd", response => {

        if(this.imgOverlay) {
          this.imgOverlay.bringToFront();
          var element = this.imgOverlay.getElement();
          element.style.zIndex = 2;
        }
    })


  }


  repositionHandler() {
    this.points[this.points.length - 1].marker.on('drag dragend', () => {
      if(this.imgOverlay) {
        this.imgOverlay.reposition(this.points[0].marker.getLatLng(), this.points[1].marker.getLatLng(), this.points[2].marker.getLatLng());
    
      }
    });
  }

  



}
