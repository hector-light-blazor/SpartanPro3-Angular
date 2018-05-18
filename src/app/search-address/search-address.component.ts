import { Component, OnInit,Input,  ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.component.html',
  styleUrls: ['./search-address.component.css']
})
export class SearchAddressComponent implements OnInit {

  public googleGeoCode: string = 'https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/search/atoComplete?auto=:my_own_keyword' //'https://maps.googleapis.com/maps/api/geocode/json?address=:my_own_keyword';
  @Output() selected = new EventEmitter();
  @Output() xysearch = new EventEmitter();
  myData: any = null;
  lat: boolean = false;
  lng: boolean = false;
  latinput: any = null;
  lnginput: any = null;
  @Input() offset: boolean = false;
  constructor() { }

  ngOnInit() {

   

  }


  ngOnChanges() {
    var container = document.getElementById("search");
    if(this.offset) {
     
      container.style.top = "230px";
    }else {
      container.style.top = "";
    }
  }
  
  enterSearch(){
    if(this.latinput && this.lnginput) {
      this.xysearch.emit({x: this.lnginput, y: this.latinput});
    }
    
  }

  myCallback(select) {
    //console.log(select);

    this.selected.emit(select);
  }

}
