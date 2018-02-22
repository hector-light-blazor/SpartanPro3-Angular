import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AppService} from "../app.service";
declare var jQuery:any;
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
  constructor(private _service:AppService) { }

  ngOnInit() {
     //First Lets generate the date object for today..
    //Second get Current Year..
    //Third lets get current month name...
    this.choosen_date = "";
    this.calendar_size = 42;
    this.today = new Date();
    this.current_Year = this.today.getFullYear();
    this.current_Month = this.getCurrentMonthName(this.today.getMonth());

    //Last lets generate the Numbers to put in the calendar..
    this.genNumForCalendar();
    this.getCalendarService();
  }


  genNumForCalendar(){
    //If is not first of the month lets create new date to generate 
   
    if(this.today.getDate() != 1){
        
      let first_month:any = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
     
      if(first_month.getDay() != 0){
         //If not first of the month lets sub tract to get the reminder days from last month..
        

         first_month.setDate(first_month.getDate() - first_month.getDay());

         this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });

         for (var index = 1; index < this.calendar_size; index++) {
             
             first_month.setDate(first_month.getDate() + 1);
             if(this.today.getMonth() != first_month.getMonth()){
               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });
             }
             else if(this.keep_today.getDate() == first_month.getDate() && this.keep_today.getMonth() == first_month.getMonth() && this.keep_today.getFullYear() == first_month.getFullYear())
             {
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: true, regular: false, passdue: false });   
             }else{
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: false, regular: true, passdue: false });
             }            
         }
         
      }else{
         first_month.setDate(first_month.getDate() - first_month.getDay());

         this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });

         for (var index = 1; index < this.calendar_size; index++) {
             
             first_month.setDate(first_month.getDate() + 1);
             if(this.today.getMonth() != first_month.getMonth()){
               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });
             }
             else if(this.keep_today.getDate() == first_month.getDate() && this.keep_today.getMonth() == first_month.getMonth() && this.keep_today.getFullYear() == first_month.getFullYear())
             {
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: true, regular: false, passdue: false });   
             }else{
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: false, regular: true, passdue: false });
             }            
         }
      }
      //console.log("first if///");
    }else{ //If is the first of the month...
          
        let first_month:any = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

      if(first_month.getDay() != 0){
         //If not first of the month lets sub tract to get the reminder days from last month..
         //console.log("not sunday");

         first_month.setDate(first_month.getDate() - first_month.getDay());

         this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });

         for (var index = 1; index < this.calendar_size; index++) {
             
             first_month.setDate(first_month.getDate() + 1);
             if(this.today.getMonth() != first_month.getMonth()){
               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });
             }
             else if(this.keep_today.getDate() == first_month.getDate() && this.keep_today.getMonth() == first_month.getMonth() && this.keep_today.getFullYear() == first_month.getFullYear())
             {
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: true, regular: false, passdue:false });   
             }else{
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: false, regular: true, passdue:false });
             }            
         }
         
      }else{ //If it belongs the first week of the month...
          
          let first_month:any = new Date(this.today); //Create new object of date...
         
          if(this.keep_today.getDate() == first_month.getDate() && this.keep_today.getMonth() == first_month.getMonth() && this.keep_today.getFullYear() == first_month.getFullYear()){
               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: true, regular: false,passdue:false  });
          }else{
               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: false, regular: true, passdue: false });
          }
          

         for (var index = 1; index < this.calendar_size; index++) {
             
             first_month.setDate(first_month.getDate() + 1);
             if(this.today.getMonth() != first_month.getMonth()){

               this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: true, today: false, regular: false, passdue: false });
             }
             else if(this.keep_today.getDate() == first_month.getDate() && this.keep_today.getMonth() == first_month.getMonth() && this.keep_today.getFullYear() == first_month.getFullYear())
             {
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: true, regular: false, passdue: false });   
             }else{
                 this.month.push({date:first_month.getDate(), object: this.clone(first_month), events: [], gray: false, today: false, regular: true, passdue: false });
             }            
         }
      }

    }
 }

 clone(obj) {
       var copy;

   // Handle the 3 simple types, and null or undefined
   if (null == obj || "object" != typeof obj) return obj;

   // Handle Date
   if (obj instanceof Date) {
       copy = new Date();
       copy.setTime(obj.getTime());
       return copy;
   }

   // Handle Array
   if (obj instanceof Array) {
       copy = [];
       for (var i = 0, len = obj.length; i < len; i++) {
           copy[i] = this.clone(obj[i]);
       }
       return copy;
   }

   // Handle Object
   if (obj instanceof Object) {
       copy = {};
       for (var attr in obj) {
           if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
       }
       return copy;
   }

   throw new Error("Unable to copy obj! Its type isn't supported.");
 }

 getCalendarService(){
     //Start and end for this calendar get due dates from spartan database..
     if(this.month.length == 0){
         return;
     }
     let start = (this.month[0].object.getMonth() + 1) + "/" + this.month[0].object.getDate() + "/" + this.month[0].object.getFullYear();
     let end   = (this.month[this.month.length - 1].object.getMonth() + 1) + "/" + this.month[this.month.length - 1].object.getDate() + "/" + this.month[this.month.length - 1].object.getFullYear();
     let site = "addressticket/getCalendar/?s=" + start + "&e=" + end;
     
   //   Send a get request to this site from start and end dates... 
     this._service.GET_METHOD(site).subscribe((response:any) => {
       
         this.month.forEach(date => {
               response.forEach(resp => {
                   
                   let due = new Date(resp.due);
                   due.setDate(due.getDate() + 1);
                   if(date.object.getFullYear() == due.getFullYear() && date.object.getMonth() == due.getMonth() && date.object.getDate() == due.getDate()){
                      
                       date.events.push(resp);
                   }
                   
               });

              
               
         });
          this.checkBehindMonth();
     })
 }

 getCurrentMonthName(month:Number){
   let name = "";
   if(month == 0){
       name = "January";
   }
   else if(month == 1){
       name = "February";
   }
   else if(month == 2){
       name = "March";
   }
   else if(month == 3){
       name = "April";
   }else if(month == 4){
       name = "May";
   }
   else if(month == 5){
       name = "June";
   }else if(month == 6){
       name = "July";
   }else if(month == 7){
       name = "August";
   }else if(month == 8){
       name = "September";
   }else if(month == 9){
       name = "October";
   }else if(month == 10){
       name = "November";
   }else if(month == 11){
       name = "December";
   }
   return name;
 }

 //go previous calendar
 previous(){
     //console.log(this.today.getMonth() - 1);
   if((this.today.getMonth() - 1) == -1)
   {
       this.current_Year = this.today.getFullYear() - 1;
       this.today = new Date(this.today.getFullYear() - 1, 11, 1);
   }else{
       this.today = new Date(this.today.getFullYear(), (this.today.getMonth() - 1), 1);
   }
   
   this.current_Month = this.getCurrentMonthName(this.today.getMonth());
   this.month = [];
   this.genNumForCalendar();
   this.getCalendarService();
 }

 //go next calendar..
 next(){
     if(this.today.getMonth() + 1 == 12)
   {
       this.current_Year = this.today.getFullYear() + 1;
       this.today = new Date(this.today.getFullYear() + 1, 0, 1);
   }else{
       this.today = new Date(this.today.getFullYear(), (this.today.getMonth() + 1), 1);
   }
   
   this.current_Month = this.getCurrentMonthName(this.today.getMonth());
   this.month = [];
   this.genNumForCalendar();
   this.getCalendarService();
 }

 //THis function is going to check if they are less form today to turn them red or blue...
 //meaning they are really past due tickets...
 checkBehindMonth(){
     let today = new Date();
     this.month.forEach(day => {
           if(day.events.length > 0){
              if(!day.today){
                   if(today.getMonth() > day.object.getMonth()){
                       day.passdue = true;
                   }else if(today.getFullYear() > day.object.getFullYear()){
                       day.passdue = true;
                   }else if(today.getDate() > day.object.getDate() && today.getMonth() == day.object.getMonth()){
                       day.passdue = true;
                   }else{
                       day.passdue = false;
                   }
              }    
           }
     });
 }


 //Selection in the calendar of due dates..
 selection(date:Calendar){
     jQuery('#showTickets').fadeIn("slow");
     //console.log(date);
     this.choosen_date = (date.object.getMonth() + 1) + "/" +  date.object.getDate() + "/" + date.object.getFullYear();
     this.choosen_tickets = date.events;
 }

 // close the open pop up from the selection. Functions...
 closemenu(value){
   jQuery(value).fadeOut('slow');
   this.choosen_date = "";
   this.choosen_tickets = [];
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
