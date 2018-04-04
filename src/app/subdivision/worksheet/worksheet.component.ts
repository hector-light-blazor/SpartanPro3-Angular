import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css']
})
export class WorksheetComponent implements OnInit {

  streets: Array<STREET> = [];

  name: string;
  low: string;
  high: string;

  constructor() { }

  ngOnInit() {
  }

  addStreet() {
      console.log("HELLO");
      this.streets.push({name: this.name, low: this.low, high: this.high});
      console.log(this.streets)
  }

}

interface STREET {
  name: string;
  low:  string;
  high: string;
}
