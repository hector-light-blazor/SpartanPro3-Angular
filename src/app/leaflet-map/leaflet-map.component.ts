import { Component, OnInit } from '@angular/core';

declare var L:any;

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  map: any;
  mapflex:any;

  constructor() { }

  ngOnInit() {

    this.map = L.map("map").setView([26.229259, -98.148752], 4);

    console.log(L);
    // var ign = new L.TileLayer.WMTS( "https://wms-txgi.tnris.org/login/path/contour-camera-poetic-poem/wms" ,
    //                            {
    //                                layer: "texas",
    //                                style: "normal",
    //                                tilematrixSet: "PM",
    //                                format: "image/png",
    //                                attribution: "<a href='https://github.com/mylen/leaflet.TileLayer.WMTS'>GitHub</a>&copy; <a href='http://www.ign.fr'>IGN</a>"
    //                            }
    //                           );
							  
		// 	this.map.addLayer(ign);

    
    this.mapflex = L.esri.dynamicMapLayer({
        url: "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/MapFlex2/MapServer",
        position: 'back',
        zIndex: 0
      });
    
    this.map.addLayer(this.mapflex);
    


  }

}
