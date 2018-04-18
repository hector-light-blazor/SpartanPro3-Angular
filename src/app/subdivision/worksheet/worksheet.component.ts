import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css']
})
export class WorksheetComponent implements OnInit {

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

  checkLVStreets():boolean {
    var response:boolean = false;
    if(!this.name) {
      this.nameError = true;
      response = true;
    }
    
    if(!this.high) {
      this.highError = true;
      response = true;
    }
    
    if(!this.low) {
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
