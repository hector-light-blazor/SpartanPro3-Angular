import { Component,ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  // Global Variables..
  @ViewChild('map') mapObj:ElementRef; 


  // Esri Local Variables...
  map: any = null;
  mapFlexBase: any = null;
  mapWMSBase: any = null;
  

  constructor(private app: AppService) { }

  
  // Gets call by angular that is ready..
  ngOnInit() {

    //=-=-=-= REMOVE OVERFLOW BODY =-==-=
    console.log(document.body.style.overflow);
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

      // Create Dynamic Map..
      this.mapFlexBase = new this.app.esriDynamicLayer(this.app.mapFlexURL);
    

      // Create the WMS Layer Google Arieals.
       let layerInfo = new this.app.esriWMTSLayerInfo({identifier: 'texas', 
      titleMatrixSet: '0to20',format: 'png'});

      // Options For the WMS Layer..
      let options = {serviceMode: 'KVP', layerInfo: layerInfo};
      
      // Create the WMS Layer GOOGLE ARIEALS>..
      this.mapWMSBase = new this.app.esriWMTSLayer(this.app.wmtsURL, options);
     
     
     
      // Lets Load Layers to the map object...
      this.map.addLayer(this.mapFlexBase);


  }

}
