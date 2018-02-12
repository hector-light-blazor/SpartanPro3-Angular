import { Component, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../app.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import "rxjs/add/operator/takeWhile";
import { timeout } from 'q';

declare var jQuery:any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TicketComponent implements OnInit {

  // ... Private Variables ...
   @ViewChild(DatatableComponent) table: DatatableComponent;
  attributes: Ticket; // ..This Holds the binding for ticket form attributes..
  showFileUploader: boolean = false; // Displays the file uploader to attach files to ticket...
  showFileViewer: boolean = false; //Displays all the attachments to this ticket...
  displayWorkflow: boolean = false; //Display all worflow for this ticket...
  connectionsCount: number = 0; // How many same tickets exists...
  messagesCount: number = 0; //Messages Telling User information is available..
  connectionsPulse: boolean = false; // Controls the css animation..
  showAttach: boolean = false; // .. This Is To Show Attachments For Ticket Component
  showViewAttach: boolean = false; // .. This Shows Attachement For Ticket Component
  showViewRoutes: boolean = false; // TODO: MayBe We Needed IDK To Show Where The Ticket Is Going lol
  showRoutes: boolean = false; // TODO: Show Routes Maybe not needed this is OLD need to remove..
  isAlive: boolean = true; // Needs this for subscribe of toolbar actions...
  comments: Array<FEED> = []; // ..  Holds The Comment Feeds For Ticket ...
  isLoading: boolean = true;
  isConnectionsLoading: boolean = true;
  numberOfDays: string = ""; // Shows the number days left for the ticket..
  iconNumberOfDays: boolean = false; //Displays Something...
  due_date: string = ""; //Date the ticket is due..
  init_date: string = ""; //Show beginning Date...
  front: boolean = true; // Controls display remainder days left...
  confirmSelection: number = -1; // display confirmation display.. for delete and archive...
  parcels: any; // List All Parcels from db server
  profileImage: string = "assets/avatar.png"; //display profile image...
  isMapEnabled: boolean = false; // Controls the esri map view to display ...
  extent: any = null; //ticket extent from parcels...
  base: string = ''; //Tell the esri map component what basemap to use....
  loc: any = null; // hold the locaiton to display to esri map...
  parcel: any = null; // hold the parcel location to display to esri map component ...
  selectedParcel: any = null; // hold selected parcel to decide if to use for confirmation...
  searchParcel: string = ''; // find particular parcel information from db server...
  enableTicket: boolean = false; // this variable will tell esri map comp either to display graphics layer for ticket or not for editing and other purposes.
  users: any = [] // Gets a list of all users to be used in drop downs as options...

  // Control ticket fields..
  customerSection: boolean = false;
  premisesSection: boolean = false;
  lvSection: boolean = false;
  dbSection: boolean = false;
  gisSection: boolean = false;

  rows = [];
  columns = [
    { name: 'ticketnum'   },
    { name: 'createddate' },
    { name: 'firstname'   },
    { name: 'lastname'    },
    { name: 'fulladdress' }
  ];



  // Mask For Input Telephone Numbers to Change Proper Format..
  mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  constructor(public app: AppService, private route: ActivatedRoute, private router: Router) {

    this.attributes = {
      id_ticket: 0,
      cfirst_name: '',
      clast_name: '',
      telephone_land_line: '',
      alt_telephone: '',
      objectid: 0,
      add_num: 0,
      range_high: 0,
      range_low: 0,
      esn: 0,
      plack_generated: false,
      letter_generated: false,
      address_issued: false

    }
    
   


      this.isConnectionsLoading = true;
      this.isAlive = true;
      // ..Handle Clicks Comming From Toolbar...
      // .. That Targets Special Functions for Ticket...
      this.app.toolbarActions.takeWhile(() => this.isAlive).subscribe(action => {
          
         // When User Click Toolbar Function Decides what to accomplish here...
         this.decideAction(action); 
      });

      // .. Lets Get If We Get Id From Route
      // .. This is to double check if ticket is been viewed...
      this.route.params.subscribe(params => {
       
        // .. Once We Subscribe Lets get the params if available...
        // .. If ID Available meaning that we are viewing ticket...
         if(params.hasOwnProperty("id")) {
         
           let ticket:string = params['id'];
        
           this.app.GET_METHOD(this.app.route.api.vwTicket + 'id=' + ticket).subscribe((response:any) => {

            //console.log(response);
            //Only Parse If There Is Data
            if(response) {

              if(response.length < 1){
                //alert("No Data Found");
                jQuery.Notify({
                  caption: 'Error',
                  content: "No Ticket Found",
                  type: this.app.msg_codes.alert
              });
                return;
              }
              // Parse The Information and input to the form 2 way data binding...
              this.parseTicket(response);


              // Fetch The remainder days left for this ticket information..
              this.fetchNumberOfDaysTicket();

              // Check if we can search for duplicates tickets
              this.getConnections();

              // ...After That Next Lets Retrieve Feeds Comments For This Particular Ticket..
              this.getComments();

              // ... GET PARCELS INFORMATION FROM HCAD>>>>
              this.findParcelsInfo(this.attributes.property_id, this.app.propertyId, true);
              
              // Not Show Loading Because Data is here...
              this.isLoading = false;

            }
             
             
           }, error => {
            jQuery.Notify({
              caption: 'Error',
              content: "Failed to load Ticket",
              type: this.app.msg_codes.alert
          });
           });
         }else {

          
           this.generateTicketNumber();
         }
      })

   }

   // LifeCycle Angular Framework..
   // Once the component is ready to be used do something with it...
  ngOnInit() {

    let _self = this;

    


    //Just In Case If Toolbar is not available for users to use..
    setTimeout(() => {
      _self.app.ticketInteractionToolbar.next(true);

    }, 100);
  

    //Next Fetch Users from Database..
    this.fetchUsers();
    this.table.bodyHeight = 400;
   
  }

  // LifeCycle Angular Framework.
  // if the component detects is going to change view or destroy do something that happens..
 ngOnDestroy() {

    // Destroy this is alive...
    this.isAlive = false;

    // Once We Destroy the component remove the unecessary toolbar 
    this.app.ticketInteractionToolbar.next(false);

    // ..As Well The Ticket what ever was edited..
    // .. No routing necessary...
    this.masterSave(this.prepareTicket()); 
 }

  // Generate New Ticket Number
  generateTicketNumber() {
    // CAN'T GENERATE TICKET NUMBER BECAUSE NEEDS USER TO BE LOG IN..
    if(!this.app.account_info.user_id) {
        jQuery.Notify({
          caption: 'Error',
          content: "Please Sign In",
          type: this.app.msg_codes.alert
      });
      return;
    }

    // TODO: ASK API TO CREATE TICKET NUMBER..
    this.app.GET_METHOD(this.app.route.api.tNumber).subscribe((response:any) => {
       
     
      if(response.success){
          let today = new Date();
         let dd = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();
         let mm = ((today.getMonth() + 1) < 10) ? 0 + (today.getMonth() + 1).toString() : today.getMonth() + 1;
         let yyyy = today.getFullYear();
         let object = (yyyy.toString().substr(-2)) + (mm.toString()) + (dd.toString());
         let zero = '00';
         if(response.data[0].count < 100){
           object += zero + response.data[0].count.toString();
         }else{
          object += (response.data[0].count.toString());
         }
         this.attributes.objectid = parseInt(object);

         // Save the beginning part of this ticket...
         this.saveInitialTicket();
      }else {
        this.isLoading = false;
      }
    });

  
    
  }

  // Once ticket number is generate save initial ticket to db server
  saveInitialTicket() {

      let attr = {
        objectid: this.attributes.objectid,
        started_ticket: this.app.account_info.user_id,
        sentto: this.app.account_info.user_id,
        orga: this.app.account_info.organization_id
    }
  
    let _self = this;
      this.app.POST_METHOD(this.app.route.api.initTicket, {data: attr}).subscribe((response: any) => {
        if(response.success){
          this.attributes.id_ticket = response.id.id_ticket;
          // this.ticketNum.emit(this.attributes.id_ticket);
        
          setTimeout(function() {
              _self.app.id_ticket = _self.attributes.id_ticket;
          }, 200);

          this.fetchNumberOfDaysTicket();
        }
  
      });

  }


  //============ MODULE GETS THE CREATED DATE AND REMAINDER DAYS FOR DUE DATE ===================
  fetchNumberOfDaysTicket(){
    if(this.attributes.id_ticket){
      this.app.GET_METHOD("addressticket/numberOfDays/?id=" + this.attributes.id_ticket).subscribe((response:any) => {
         
          this.numberOfDays = response.remainder;
          this.iconNumberOfDays = false;
          this.due_date = new Date(response.final).toDateString();
          let date = null;
          if(response.created_date.includes('00:00:')){
            let tmp = response.created_date.substr(0, 10);
           
            date = new Date(tmp.replace(/-/g, '\/'));
          }else{
            date = new Date(response.created_date);
          }
          this.init_date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
          this.isLoading = false;
      });

    }


  }

  showBack() {
      this.front = false;
  }

  showFront() {
      this.front = true;
  }


  // Handles Clicks ON connection table..
  clickSelectedConnection(event) {
    if(event.type == "click"){
     
      // Save Information 
      this.masterSave(this.prepareTicket()); 

      // Reset attributes...
      for(var x in this.attributes) {
          this.attributes[x] = '';
      }
      
      // Change Router To click id ticket...
     this.router.navigateByUrl("ticket/view/" + event.row['id_ticket']);
    }
  }

  //remove body overflow..
  removeOverflowBody() {
    //document.body.style.overflow = 'hidden';
  }

  // Module To Fetch Users..
  fetchUsers() {
    this.app.GET_METHOD(this.app.route.api.fUsers).subscribe((response:any) => {
        
        this.users = response.data;
    });
  }

  // Module to fetch duplicate tickets in the system...
  // Purpose is to see if there is history in the past regarding the information provided...
  getConnections() {

      let data = null;
      //First Check if property id is there..
      if(this.attributes.property_id) {
         data = {data: {'property_id' : this.attributes.property_id, 'id_ticket': this.attributes.id_ticket}};
      }else if(this.attributes.tax_account_num){ //else if check if tax account num available..
         data = {data: {'tax_account_num': this.attributes.tax_account_num, 'id_ticket' : this.attributes.id_ticket}};
      }

      if(data) {
        this.app.POST_METHOD(this.app.route.api.hTicket, data).subscribe((response: any) => {
           //console.log(response);
           if(response.success) {
              this.connectionsCount = response.data.length;
              this.connectionsPulse = response.data.length > 0; // Controls the css animation..

              this.rows = response.data;

              if(this.connectionsPulse) {
                jQuery.Notify({
                  caption: 'Connections',
                  content: "Found New Connection",
                  timeout: 5000,
                  type: this.app.msg_codes.success
                });
              }

              //console.log(response.data);
           }

           this.isConnectionsLoading = false;
        });
      }
      
     
  }

  

    // Module to handle actions coming from toolbar 
    // Decisions To Be Made For This Component..
  decideAction(action: any) { 
      let _self = this;
      switch (action.action) {
        case this.app.toolbarActivies.TICKET_SAVE_TRANSFER:
         
          // First Route Ticket to next person in line...
          // Second Prepare ticket and finally send to save updates db server..
          if(this.attributes.system_assign) {
            this.attributes['sentto'] = this._routeFigure();
          }
         
          this.masterSave(this.prepareTicket()); 

          setTimeout(() => {
             // Change route to default view for this user...
            _self.router.navigateByUrl("ticket/dashboard");

          }, 300);
         
          break;
        case this.app.toolbarActivies.TICKET_ARCHIVE:
          //Display pop up for archive..
          this.confirmSelection = 1;
          jQuery("#confirm").fadeIn("slow");
          break;
        case this.app.toolbarActivies.TICKET_DELETE:
          this.confirmSelection = 0;
          jQuery("#confirm").fadeIn("slow");
         break;
        case this.app.toolbarActivies.TICKET_INSERT_COMMENT:
          this.enterComment(action.data);
         break;
        case this.app.toolbarActivies.TICKET_ESRI_MAP:
          this.isMapEnabled = true;
          this.base = 'MAPFLEX';
          this.parcel = null;
          this.extent = null;
          this.enableTicket = true;
          // IF there is x and y to this location zoom in...
          this.loc = (this.attributes.lat && this.attributes.longy) ? new this.app.esriPoint(parseFloat(this.attributes.longy), parseFloat(this.attributes.lat)) : null;
          
          break;
        case this.app.toolbarActivies.TICKET_ESRI_IMAGERY:
          this.isMapEnabled = true;
          this.base = 'IMAGERY';
          this.parcel = null; // Polygon for parcel null
          this.extent = null; // extent null 
          this.enableTicket = true;
          // only display ticket if available information..
          this.loc = (this.attributes.lat && this.attributes.longy) ? new this.app.esriPoint(parseFloat(this.attributes.longy), parseFloat(this.attributes.lat)) : null;
          break;
        case this.app.toolbarActivies.TICKET_DISPLAY_ATTACHMENT:
          this.showFileUploader = true;
          break;
        case this.app.toolbarActivies.TICKET_LIST_ATTACHMENTS:
          this.showFileViewer = true;
        default:
          break;
      }
  }

  //Handle file uploader actions component
  fileUploaderActions(event) {
     if(event.action == 1) {
       this.showFileUploader = false;
     }
  }

  prepareTicket() {
    let attr = {}; 
    // Prepare tickets for saving into the db server..
    // console.log(this.attributes);
    for(var x in this.attributes) {
      //console.log(x);
      if(x == 'point' && !this.attributes[x] && this.attributes.lat && this.attributes.longy) {

        this.attributes[x] = 'POINT(' + this.attributes.longy + ' ' + this.attributes.lat + ')';
        attr[x] = this.attributes[x];
       // console.log(x);
      }
      else if(x == 'system_assign' && typeof(this.attributes[x]) == 'object'){ // Convert to string..
        
         this.attributes[x] = JSON.stringify(this.attributes[x]);
        
         attr[x] = this.attributes[x]
      }
      else if(this.attributes[x] && typeof(this.attributes[x]) != "boolean") {
        attr[x] = this.attributes[x];
      }else if(x == "address_issued" || x == "letter_generated" || x == "plack_generated") {
        
        attr[x] = (this.attributes[x]) ? 1 : 0;
      }
      else if(x == 'add_num'){
        attr[x] = 0;
      }
      else {

        attr[x] = '';
      }
    }

    return attr;

  }

   // Module To Handle Parsing of Downloaded Tickets From DB is only for viewing ticket..
  parseTicket(attributes: Ticket) {

    for(var x in attributes) {
     
        if(attributes[x] || x == 'point') 
        {
          if(x == "address_issued" || x == "letter_generated" || x == "plack_generated"){
           
            attributes[x] = (attributes[x] == 1) ? true : false;
          }else if(x == 'point'){
            attributes[x] = null;
          }
          this.attributes[x] = attributes[x];
        }
    }
   
  }
  //Make Decision what to find parcel

  decideParcelInfo(value) {
     
    if(!isNaN(value)) this.findParcelsInfo(value, this.app.propertyId, false);
    else if(value.indexOf('-') != -1) this.findParcelsInfo(value, this.app.taxAccount, false)
    else this.findParcelsInfo(value, this.app.hoodName, false);
  }

  // Handles closing map view

  closeClick(event: string) {
    console.log("I AM RUNNING WHAT");
    this.isMapEnabled = false;
  }

  findParcelsInfo(value, property, msg:boolean, routing?: boolean) {
    if(!property) return;
    if(!value) return;
   
    this.isLoading = true;
    this.parcels = [];
    this.messagesCount = 0;
    value = (typeof(value) == "string") ? value.replace(' #', '+%23') : value; //if user inputs # fix with ascii character//
    
    let search = 'search='+ value + '&field=' + property;
  
    this.app.FIND_METHOD(search).subscribe((response:any) => {
      
      this.isLoading = false;
        if(response) { //Is there reponse...
           response = (typeof(response) == "string") ? JSON.parse(response) : response;
          
            if(response.results.length > 0) { // is there data to process.
              
              response.results.forEach(element => {
                element.moreinfo = false;
                element.display = [];
              });

              this.messagesCount = response.results.length;
              this.parcels = response.results;

              //Display MESSAGE TO USER WE FOUND INFORMATION.
              if(msg) {
                jQuery.Notify({
                  caption: 'FOUND PARCEL',
                  content: 'Check the MESSAGES TAB for more information!',
                  timeout: 5000,
                  type: this.app.msg_codes.info
          
              });
              }    

              // Check if the user is interested in routing...
              if(routing) {
                console.log("ROUTING ENABLE");
                if(!this.attributes.system_assign) { // if not available is going to get gis route...
                  console.log("SYSTEM ASSIGN IS EMPTY");
                  // Lets generate gis routing... for this user..
                  let poly = new this.app.esriPolygon(response.geometry.rings);
                  this.gisRouting(poly.getCentroid().x, poly.getCentroid().y);
                }
              }
            } // end of response results length..
        }
    });
   }

 
  // ...Module Responsible For Getting Feed Comments FROM DB...
  getComments() {
      this.comments = [];
      this.app.GET_METHOD(this.app.route.api.vtFeeds + this.attributes.id_ticket).subscribe((response: Array<FEED>) => {
        
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
             console.log(format);
             com.edit = false;
             com.allow = (com.user_id == this.app.account_info.user_id);
             com.time = (track.getMonth() + 1)  + "/" + track.getDate() + "/" + track.getFullYear() + " " + format;//this.app.FORMAT_AMPM(new Date(com.time_track));
          }  
          this.comments = response;
      });
  }

  // ... Module Focus on Update Existing Feed Comments to the database....
  editComment(com: FEED) {
      com.edit = false;
      this.isLoading = true;
      this.app.POST_METHOD(this.app.route.api.utFeeds, {data: {id: com.id_com, msg: com.ticket_comments}}).subscribe(response => {
          this.isLoading = false;
          this.getComments();
      });
  }

  // ... Module to Delete Selected Comment .. Only allow if you own the comment 
  // CONSIDERATION: TODO: If administrator can delete and update any comment..
  delComment(id) {

    this.isLoading = true;
    // delComment
    this.app.GET_METHOD(this.app.route.api.dtFeeds + id).subscribe(response => {this.getComments() 
      this.isLoading = false});

  }


    // Enter comments into the ticket feed..
    enterComment(msg: string){

      // no user id can't upload to db svr..
      if(!this.app.account_info.user_id) {
      
        jQuery.Notify({
          caption: 'Error',
          content: "Please Sign In",
          type: this.app.msg_codes.alert
      });
        return;
      }

      // show is loading screen..
      this.isLoading = true;

        // collect data 
      let data = {id: this.app.account_info.user_id, 
          msg: msg, f: this.app.account_info.first_name, l: this.app.account_info.last_name, num: this.attributes.id_ticket
      }   
      
      // from this app post data to db server..
      this.app.POST_METHOD(this.app.route.api.itFeeds,{data: data}).subscribe((response:any) => {
        
        if(!response.success) {
          jQuery.Notify({
            caption: 'Error',
            content: "Failed to insert comment.",
            type: this.app.msg_codes.alert
          });
          return;
        }else { // if everything good re-download feed comments from db..
           this.getComments();
        }
        this.isLoading = false;
      }, error => {
         this.isLoading = false;
         
      })
 
    }

    // =-=-=--= MODULE SAVES THE ENTIRE TICKET TO DB SERVER =-=-=-=-=-=-=-=
    masterSave(attr){
    
      this.app.POST_METHOD(this.app.route.api.sTicket, {data: attr}).subscribe((response:any) => {
        //console.log(response);
        if(!response.success){
          console.log(response);
          jQuery.Notify({
                caption: 'Failed Ticket',
                content: "Failed to save",
                type: this.app.msg_codes.alert
            });
        }
       
      });
      return;
    }

    // =-=-=-=-=-=-=-= MODULE PASS TICKET TO NEXT ROUTE =-==-=-=-=-=
    _routeFigure() {
      let sentto:number = parseInt(this.attributes['started_ticket']);
    
      this.attributes.system_assign = (typeof(this.attributes.system_assign) == "string") ? JSON.parse(this.attributes.system_assign) : this.attributes.system_assign;

      if(this.attributes['system_assign'].a.length > 0) {
           if(this.attributes['system_assign'].a[this.attributes['system_assign'].index] == sentto && this.attributes['system_assign'].index == 0)
          {
            //.log("IF HERE");
            this.attributes['system_assign'].index++;
            sentto = this.attributes['system_assign'].a[this.attributes['system_assign'].index];
            this.attributes['system_assign'].index++;
          }
          else{
            //console.log("ELSE HERE");
            if(this.attributes['system_assign'].index == 3)this.attributes['system_assign'].index = 0;
            sentto = this.attributes['system_assign'].a[this.attributes['system_assign'].index];
            this.attributes['system_assign'].index++;
          }
      }
     // console.log(sentto);
      return sentto;
    }
	
	// Make Decision from pop up confirm decision to delete or archive...
    confirmationDecision() {

        if(this.confirmSelection == 0) { // Zero is to delete
            let attributes = {
              id_ticket: this.attributes.id_ticket,
              system_assign: '{"a": [], "index": 0}',
              sentto: "0000",
              status: 'DELETE'
    
          };
          this.attributes.status = 'DELETE';
          this.attributes.sentto = '0000';
          

        this.app.POST_METHOD(this.app.route.api.sTicket, {data: attributes}).subscribe((response: any) => {
              this.closeConfirmation();
              if(!response.success){
                jQuery.Notify({
                      caption: 'Error Ticket',
                      content: 'Failed To Delete Ticket',
                      type: this.app.msg_codes.alert
                  });
              }
              else {
                this.router.navigateByUrl("ticket/dashboard");
                
              }
          });
        
  
        }else if(this.confirmSelection == 1) { // 1 is to archive...
           //lets close this ticket and archive change route to home..
              let attributes = {
                id_ticket: this.attributes.id_ticket,
                system_assign: '{"a": [], "index": 0}',
                sentto: "00",
                status: 'ARCHIVE'

            };
            this.attributes.status = 'ARCHIVE';
            this.attributes.sentto = '00';

           this.app.POST_METHOD(this.app.route.api.sTicket, {data: attributes}).subscribe((response: any) => {
                this.closeConfirmation(); // Close confirmation...
              if(!response.success){
                jQuery.Notify({
                      caption: 'Error Ticket',
                      content: 'Failed To Archive Ticket',
                      type:this.app.msg_codes.alert
                  });
              }else{
                this.router.navigateByUrl("ticket/dashboard");
              }
           });
        }else if(this.confirmSelection == 2) // 2 is to copy information ticket..
        {
          this.copyInformation();
          this.closeConfirmation();
        }

    }

    //Close Confirmation for Delete and Archive for know...
    closeConfirmation() {
      jQuery("#confirm").fadeOut("slow");
    }

    //DisplayConfirmation for copy info from message section to ticcket
    copyConfiramtion(data) {
      this.selectedParcel = data; // Selected parcel
      jQuery("#confirm").fadeIn('slow'); // show confirmation..
      this.confirmSelection = 2; // When making decisions from yes or no...
    }

    // When The User press the copy button will get information paste into address ticket..
    copyInformation() {
       
        let poly = this.app.esriPolygon(this.selectedParcel.geometry);
        this.app.ticketCenter = poly;
		    this.attributes.subdivision = this.selectedParcel.attributes.hood_name;
        this.attributes.tax_account_num = this.selectedParcel.attributes.geo_id;
		    this.attributes.property_id = this.selectedParcel.attributes.PROP_ID;
        this.attributes.lat   = poly.getCentroid().y;
        this.attributes.longy = poly.getCentroid().x;

        //Generate New Point into postgresql
        this.attributes.point = 'POINT(' + this.attributes.longy + ' ' + this.attributes.lat + ')';

        //GET GIS ROUTE FOR THIS LOCATION...
        this.gisRouting(this.attributes.longy, this.attributes.lat);

		//Figure the lot number and block if available...
		
		if(this.selectedParcel.attributes.legal_desc.indexOf('LOT') != -1) {
			let legal = this.selectedParcel.attributes.legal_desc;
			let lcount = 0;
			let lot = '';
			for(var x = legal.indexOf("LOT"); x < legal.length; x++){
				lot += legal.charAt(x);
				if(legal.charAt(x) == ' ') {
					lcount += 1;
				}
				if(lcount == 2)
				{
					break;
				}
			}
			this.attributes.lot_num = lot.trim();
		}else if(this.selectedParcel.attributes.legal_desc.indexOf(' LT ') != -1) {
			let legal = this.selectedParcel.attributes.legal_desc;
			let lcount = 0;
			let lot = '';
			for(var x = legal.indexOf("LT"); x < legal.length; x++){
				lot += legal.charAt(x);
				if(legal.charAt(x) == ' ') {
					lcount += 1;
				}
				if(lcount == 2)
				{
					break;
				}
			}
			this.attributes.lot_num = lot.trim();
		}
		
		// Check FOR BLOCK 
		if(this.selectedParcel.attributes.legal_desc.indexOf('BLOCK') != -1) {
			let legal = this.selectedParcel.attributes.legal_desc;
			let lcount = 0;
			let block = '';
			for(var x = legal.indexOf('BLOCK'); x < legal.length; x++){
				block += legal.charAt(x);
				if(legal.charAt(x) == ' ') {
					lcount += 1;
				}
				if(lcount == 2)
				{
					break;
				}
			}
			this.attributes.block_num = block.trim();
			
		}else if(this.selectedParcel.attributes.legal_desc.indexOf(' BLK ') != -1) {
			let legal = this.selectedParcel.attributes.legal_desc;
			let lcount = 0;
			let block = '';
			for(var x = legal.indexOf('BLK'); x < legal.length; x++){
				block += legal.charAt(x);
				if(legal.charAt(x) == ' ') {
					lcount += 1;
				}
				if(lcount == 2)
				{
					break;
				}
			}
			this.attributes.block_num = block.trim();
		}
		
		// legal_desc
        // <<<<<GET GIS PERSONNEL FROM DATABASE>>>>
    }

    // MODULE: View Parcel Map get data from parcel info...
    displayMap(data) {
       

        if(window.pageYOffset != 0) { //Make sure the user didn't scroll down if yes then scroll Up to see map..
          window.scrollTo(0, 0);
        }

        let poly = new this.app.esriPolygon(data.geometry);
		
        this.isMapEnabled = true;
        this.app.ticketCenter = poly;
        this.extent = poly.getExtent();
        this.base = 'MAPFLEX';
        this.parcel = poly;
        this.enableTicket = false;
        this.loc = null;
    }  

    gisRouting(x, y) { // <<<<<<GET PEOPLE RESPONSIBLE FOR THE GIS ROUTE>>>>>
      let object = "x=" + x + "&y=" + y;
      this.app.GET_METHOD(this.app.route.api.gRouting + object).subscribe((response:any) => {
         // console.log(response);
          if(response.success){
            let arr = (response.data.length == 1) ? JSON.parse("[" + response.data[0].staff.split(",") + "]"): response.data;
            
            if(arr.length > 0){ // Add the new route to the ticket...
                this.attributes.system_assign = {a: arr, index: 0};
            }
          }
      });
    }

    openMessageTable(data) {
        data.display = [];
        data.moreinfo = !data.moreinfo;
        for(var x in data.attributes) {
        
          data.display.push({"name" : x, "value" : data.attributes[x]});
        }
    }

    // Display who created ticket...
    _openStaffProfile() {
        this.displayWorkflow = true;
    }

    //Collect esri events...
    collectMapEvents(event) {
    
      if(event.hasOwnProperty('type')) { // if is geometry check 
        if(event.type == "point") { // if is geometry point then get x and y send to attributes.
            // if point update lat and longy as well point..
            this.attributes.lat = event.y;
            this.attributes.longy = event.x;
            this.attributes.point = 'POINT(' + this.attributes.longy + ' ' + this.attributes.lat + ')';

            // Since we click at the map we need to get the gis route for this location click..
            this.gisRouting(event.x, event.y); // who is in charge of this location...

        }
      }else if(event.hasOwnProperty('attributes')) {

        this.findParcelsInfo(event.attributes[this.app.propertyId], this.app.propertyId, true);
      }
    }
    
    changeXYFields() {
      if(this.attributes.lat && this.attributes.longy) { // if both values are available..
        if(!this.attributes.system_assign) // if empty lets get gis route...
        {
          this.gisRouting(this.attributes.longy, this.attributes.lat); //Lets get GIS Route..
        }
      }
    }

    changeLVPersonnel() {
       if(this.attributes.system_assign) {
          // if string convert to object
          this.attributes.system_assign = (typeof(this.attributes.system_assign) == "string") ? JSON.parse(this.attributes.system_assign) : this.attributes.system_assign;
          if(typeof(this.attributes.system_assign) == "object"){ // Only do something if is object..
             this.attributes.system_assign.a[0] = (typeof(this.attributes.address_by) == "string") ? parseInt(this.attributes.address_by) : this.attributes.address_by; // Convert string to integer
             
             //Move Index foward if thats were we going..
             if(this.attributes.system_assign.index == 0) {
               this.attributes.system_assign.index++; // Move foward to next personnel...
             }
          }
       }
    }

    // End of Class..
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


// Create InterFace For Tickets
interface Ticket{
  id_ticket?: number;
  objectid?: number;
  cfull_name?: string;
  cfirst_name?: string;
  clast_name?: string;
  telephone_land_line?: string;
  alt_telephone?: string;
  alt2_telephone?: string;
  alt3_telephone?: string;
  alt4_telephone?: string;
  pfirst_name?: string;
  plast_name?: string;
  pfull_name?: string;
  subdivision?: string;
  block_num?: string;
  lot_num?: string;
  tax_account_num?: string;
  property_id?: string;
  street?: string;
  intersection?: string;
  building_description?: string;
  comments?: string;
  mailing_address?: string;
  add_num?: number;
  prd?: string;
  rd?: string;
  sts?: string;
  pod?: string;
  unit?: string;
  msag_comm?: string;
  postal_comm?: string;
  full_address?: string;
  address_by?: any;
  address_issued?: any;
  letter_generated?: any;
  plack_generated?: any;
  address_issued_date?: string;
  address_issued_by?: string;
  lat?: string;
  longy?: string;
  range_low?: number;
  range_high?: number;
  esn?: number;
  msag_valid?:   string;
  trans_id?:     string;
  date_verified?: string;
  verified_by?:   string;
  initials_mapping?: string;
  mapping_verified_date?: string;
  initials_geocoding?: string;
  geocoding_date?: string;
  lock_tck?: any;
  system_assign?: any;
  sentto?: any;
  status?: string;
  started_ticket?: string;
  point?: string;

}
