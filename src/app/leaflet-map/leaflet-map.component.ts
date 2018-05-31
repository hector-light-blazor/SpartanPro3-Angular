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

  map: any;
  mapflex:any;
  @Input() overlay:any;
  dropP = false;
  constructor() { }

  ngOnInit() {

    this.map = L.map("map", {loadingControl: true, maxZoom: 22}).setView([26.229259, -98.148752], 8);
   
    //console.log(esri);
    //console.log(L);
    //esri.TileLayer.exten
    try {
      //esri.TileLayer.WMTS = new L.TileLayer.WMTS();

        var ign = new L.TileLayer.WMTS( "https://wms-txgi.tnris.org/login/path/contour-camera-poetic-poem/wms" ,
        {
            layer: "texas",
            style: "normal",
            tilematrixSet: "PM",
            maxZoom: 22,
            format: "image/png",
            attribution: "<a href='https://github.com/mylen/leaflet.TileLayer.WMTS'>GitHub</a>&copy; <a href='http://www.ign.fr'>IGN</a>"
        }
      );

      this.map.addLayer(ign);

      
    
    } catch (error) {
      console.log("ERROR LOADING WMTS LAYER")
    }
   
    //L.esri.basemapLayer('Gray').addTo(this.map);
    
     this.mapflex = L.esri.dynamicMapLayer({
        url: "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/Adress_Streets/MapServer",
        position: 'back',
        zIndex: 0
      }).addTo(this.map);
    
   this.map.addLayer(this.mapflex);
    


  }

  ngOnChanges() {
    console.log(this.overlay);


    // let overlay = L.imageOverlay.rotated("./assets/basham.jpg", points[0].loc, points[1].loc, points[2].loc, {
    //   opacity: 0.5,
    //   interactive: true,
    //    attribution: "Historical building plan &copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
    //  })//.addTo(map);
   
    //  this.map.addLayer(overlay);
  }

}
