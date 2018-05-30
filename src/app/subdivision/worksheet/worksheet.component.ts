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

  

}

interface STREET {
  name: string;
  low:  string;
  high: string;
}
