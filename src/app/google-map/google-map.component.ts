import { Component,Input,Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  @Input() location: any;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  isLoading:boolean = true;
  constructor() { }
  
  ngOnInit() {
   
    var mapProp;
    if(this.location) {
      var position = new google.maps.LatLng(this.location.y, this.location.x)
      mapProp = {
        center: position,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

     

    } else {
      mapProp = {
        center: new google.maps.LatLng(26.208254, -98.181494),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    }

    
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    if(this.location) {
      var marker = new google.maps.Marker({
        position: position,
        map: this.map
      });
    }

    this.isLoading = false;
  }

  ngOnDestroy() {
  }

  closeMap() {
      this.onClose.emit(true);
  }

}
