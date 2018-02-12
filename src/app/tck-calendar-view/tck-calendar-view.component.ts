import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tck-calendar-view',
  templateUrl: './tck-calendar-view.component.html',
  styleUrls: ['./tck-calendar-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TckCalendarViewComponent implements OnInit {

  choosen_date: String;
  choosen_tickets: Array<Object>;
  calendar_size: number;
  keep_today:Date = new Date();
  today:Date;
  current_Month: String;
  current_Year:Number;
  titles:Array<String> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  month:Array<Calendar> = [];
  rows: Array<Number> = [0, 1, 2, 3,4 ,5 ,6];
  constructor() { }

  ngOnInit() {
  }


  closemenu(val: string) {

  }

  previous() {

  }

  next() {

  }

  

  

}

interface Calendar{
  date:Number,
  object:Date,
  events:Array<Object>,
  gray: boolean,
  regular: boolean,
  today: boolean,
  passdue: boolean
}
