import { Component, OnInit } from '@angular/core';
import { WorksheetService } from '../../worksheet.service';

@Component({
  selector: 'app-lv-page',
  templateUrl: './lv-page.component.html',
  styleUrls: ['./lv-page.component.css']
})
export class LvPageComponent implements OnInit {
 
  // Collect information...
  name: string;
  low: string;
  high: string;

  // Error
  nameError: boolean = false;
  highError: boolean = false;
  lowError: boolean = false;
  
  constructor(public workSheet: WorksheetService) { }

  ngOnInit() {
  }

  addStreet() {

    if(this.checkLVStreets()) { //If info not filled out stop the program alert users.
      return;
    }
  
    this.workSheet.attributes.streets.push({st_name: this.name, low: this.low, high: this.high});

    // Back to blank..
    this.low = this.name = this.high = "";
    this.nameError = this.highError = this.lowError = false;
    
}

removeItem(index) {
  this.workSheet.attributes.streets.splice(index, 1);
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

