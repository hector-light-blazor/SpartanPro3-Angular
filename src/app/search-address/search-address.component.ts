import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.component.html',
  styleUrls: ['./search-address.component.css']
})
export class SearchAddressComponent implements OnInit {

  public googleGeoCode: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=:my_own_keyword';
  
  constructor() { }

  ngOnInit() {
  }

}
