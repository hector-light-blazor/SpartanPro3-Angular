import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from "../app.service";
@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {

  //Private variable 
  dataTable:any = [];
  searchTable:string="";
  isLoading: boolean = true;
  comments: any = [];
  selectedRow: any = null;
  constructor(private route: ActivatedRoute,private router: Router, private app: AppService) { }

  ngOnInit() {
    if(parseInt(this.app.account_info.user_id) == 0)this.router.navigateByUrl("/");

   // console.log(this.app.users);
    this.isLoading = true;
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe((response:any) => {

      response.forEach(row => {
         row.cdisplay = false;
         row.comments = [];
           if(row.sentto == "00") {
              row.sentto = "ARCHIVE";
           }else {
            this.app.users.forEach(user => {
              if(row.sentto == user.user_id){
                 row.sentto = user.first_name + ' ' + user.last_name;
                 return; //Kill Query..
              }
            });
           }
          
      });

       this.dataTable = response;
       this.isLoading = false;
    })
    // this.app.GET_TABLE_MULTI(this.route.snapshot.params['search']).subscribe(response => {
    //   this.dataTable = response;
    // });
   
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.app._toolbarBtns.QUICK_SEARCH = true;
  }

  //Main Functions
  //Re quick search
  quickSearch() {
    // this.app.GET_METHOD();
    // this.app.GET_TABLE_MULTI(this.searchTable).subscribe(response => this.dataTable = response);
    this.app.GET_METHOD(this.app.route.api.gMultiSearch + this.route.snapshot.params['search']).subscribe((response:any) => {

      response.forEach(row => {
           row.cdisplay = false;
           row.comments = [];
           if(row.sentto == "00") {
              row.sentto = "ARCHIVE";
           }else {
            this.app.users.forEach(user => {
              if(row.sentto == user.user_id){
                 row.sentto = user.first_name + ' ' + user.last_name;
                 return; //Kill Query..
              }
            });
           }
          
      });
    });
  }

  openComments(row) {
      
      if(row.cdisplay) {
       
        row.cdisplay = false;
        return;
      }

      if(this.selectedRow) {
        this.selectedRow.cdisplay = false;
      }
      this.selectedRow = row;
      
      row.cdisplay = true;

      //Lets Fetch the comments...
      row.comments = [];
      this.app.GET_METHOD(this.app.route.api.vtFeeds + row.id_ticket).subscribe((response: Array<FEED>) => {
        
          for(let com of response){
             
             // Do hack on time to work on all browsers Edge, Firefox and Chrome..
             // It works awesome on Chrome but I don't want to support only chrome..
             let timeSplit = com.time_track.split(" ");
             timeSplit[0] = timeSplit[0].split("-");
             
             timeSplit[0] = timeSplit[0][1] + '/' + timeSplit[0][2] + '/' + timeSplit[0][0];
             timeSplit[1] = timeSplit[1].substr(0, timeSplit[1].indexOf('.'));
             timeSplit[1] = timeSplit[1].split(':'); // so we can get array and fix the time issue...
             timeSplit[1][0] = (parseInt(timeSplit[1][0]) <  7) ? parseInt(timeSplit[1][0]) + 6 : parseInt(timeSplit[1][0]) - 6; // Make central time from universal time...
             timeSplit[1] = timeSplit[1][0] + ':' + timeSplit[1][1] + ':' + timeSplit[1][2];
             com.time_track = timeSplit[0] + ' ' + timeSplit[1]; // Final Results...
            
             let now = new Date();
             let track:Date = new Date(com.time_track);

             let format = this.app.FORMAT_AMPM(new Date(com.time_track));
            // console.log(format);
             com.edit = false;
             com.allow = (com.user_id == this.app.account_info.user_id);
             com.time = (track.getMonth() + 1)  + "/" + track.getDate() + "/" + track.getFullYear() + " " + format;//this.app.FORMAT_AMPM(new Date(com.time_track));
          }  
          row.comments = response;
      });
  }

}

// Create Interface For Comments
interface FEED {
  id_com:          string,
  user_id:         string,
  first_name:      string,
  last_name:       string,
  time:            string,
  ticket_comments: string,
  ticket_number:   string,
  ticket_section:  string,
  allow?: boolean;
  edit?: boolean;
  time_track:      any
}
