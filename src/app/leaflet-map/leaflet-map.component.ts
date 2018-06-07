import { Component,Input, OnInit } from '@angular/core';
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

  

  constructor() { }

  ngOnInit() {

    
      try {
         this.setUpMap();

        this.setUpMapListener();

        // Setup The Opacity Control
        this.opacitySlider = new L.control.layerOpacity().addTo(this.map);
 

       

      }  catch (error) {
         console.log("ERROR LEAFLET MAP")
      }


  }

  ngOnChanges() {
    
    if(!isNaN(this.remove)) { // if number then remove the layer and other information...

      // Before we remove lets check is the current one in view...
      console.log(this.remove);
      console.log(this.overlay);
      if(this.remove == this.overlay.selection) {
         this.map.removeLayer(this.imgOverlay);
         this.imgOverlay = null;

          this.points.forEach(element => {
           this.map.removeLayer(element.marker);
         });
         this.points = [];
         
         return;
      }

     
     
    }

    if(this.overlay) {

      this.overlay;
      this.dropP = true;
      //console.log(this.map.getBounds());
      var bounds = this.map.getBounds();
    
      if(this.imgOverlay) {
        this.imgOverlay.setUrl(this.overlay.src);
      }
      else {

        this.points.push({loc: bounds.getNorthWest(), marker:  L.marker(bounds.getNorthWest(), {draggable: true} ).addTo(this.map)});
        this.repositionHandler();
        this.points.push({loc: bounds.getNorthEast(), marker:  L.marker(bounds.getNorthEast(), {draggable: true} ).addTo(this.map)});
        this.repositionHandler();
        this.points.push({loc: bounds.getSouthWest(), marker:  L.marker(bounds.getSouthWest(), {draggable: true} ).addTo(this.map)});
        this.repositionHandler();

        this.imgOverlay = L.imageOverlay.rotated(this.overlay.src,  bounds.getNorthWest(), bounds.getNorthEast(),  bounds.getSouthWest(), {
               
          interactive: true,
           attribution: "Historical building plan &copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
         })
       
         this.map.addLayer(this.imgOverlay);
  
         this.opacitySlider.addLayer(this.imgOverlay);
      }
      
     
  
    }

  
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
            attribution: "<a href='https://github.com/mylen/leaflet.TileLayer.WMTS'>GitHub</a>&copy; <a href='http://www.ign.fr'>IGN</a>"
        }
      );

      this.map.addLayer(this.wmts);

      this.mapflex = L.esri.dynamicMapLayer({
        url: "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/Adress_Streets/MapServer",
        position: 'back',
        zIndex: 0
      }).addTo(this.map);
    

    
    this.map.addLayer(this.mapflex);

      
    
   
  }

  setUpMapListener() {
    let _self = this;
   
    // this.map.on("click", response => {
    //   if(this.dropP) {
    //     if(this.points.length < 3) {
    //        this.points.push({loc: response.latlng, marker:  L.marker(response.latlng, {draggable: true} ).addTo(this.map)});
    //       // this.points[this.points.length - 1].marker.on('drag dragend', this.repositionImage);

    //       this.repositionHandler();
    //     }else {
    //       this.dropP = false;
          
    //       if(this.imgOverlay) {
    //         this.imgOverlay.setUrl(this.overlay);
    //         return;
    //       }
    //       console.log(this.points)
    //       this.imgOverlay = L.imageOverlay.rotated(this.overlay, this.points[0].loc,this.points[1].loc, this.points[2].loc, {
               
    //            interactive: true,
    //             attribution: "Historical building plan &copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
    //           })//.addTo(map);
            
    //           this.map.addLayer(this.imgOverlay);

    //           this.opacitySlider.addLayer(this.imgOverlay);
    //     }

    //  }

    // })

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
