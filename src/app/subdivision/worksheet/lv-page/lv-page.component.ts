import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lv-page',
  templateUrl: './lv-page.component.html',
  styleUrls: ['./lv-page.component.css']
})
export class LvPageComponent implements OnInit {
  streets: Array<STREET> = [];
  street: STREET = null;
  name: string;
  low: string;
  high: string;
  nameError: boolean = false;
  highError: boolean = false;
  lowError: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  addStreet() {

    if(this.checkLVStreets()) { //If info not filled out stop the program alert users.
      return;
    }
  
    this.streets.push({name: this.name, low: this.low, high: this.high});

    // Back to blank..
    this.low = this.name = this.high = "";
    this.nameError = this.highError = this.lowError = false;
    
}

removeItem(index) {
  this.streets.splice(index, 1);
}

checkLVStreets():boolean {
  var response:boolean = false;
  if(!this.name) {
    this.nameError = true;
    response = true;
  }

  let num:any = this.high;
  
  if(!this.high) {
    this.highError = true;
    response = true;
  }
  else if(isNaN(num)) {
    this.highError = true;
    response = true
  }
   num = this.low;
  if(!this.low) {
    this.lowError = true;
    response = true;
  }

  else if(isNaN(num)) {
    this.lowError = true;
    response = true;
  }

  return response;
}

}

interface STREET {
  name: string;
  low:  string;
  high: string;
}
