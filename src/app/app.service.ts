import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import * as esriLoader from 'esri-loader';

// THIS HOLDS ALL THE STRINGS FOR API
export class ROUTES {
   api: API_ROUTES

   constructor() {
     this.api = {
       login: "users/checkLogin/", // Handles Login
       vwTicket: "addressticket/view2/?", // gets viewing ticket
       ssTicket: "addressticket/saveSinglePiece/", // save single ticket
       vtFeeds: "addressticket/getComments/?id=", // view ticket feeds
       dtFeeds: "addressticket/delComment/?id=", // delete ticket feed
       itFeeds: "addressticket/insertComments/", // insert ticket feed
       utFeeds: "addressticket/updateComment/", // update ticket feed
       ftInbox: "addressticket/getInbox", // fetch ticket inbox
       oTicket:  "addressticket/getAllPendingTicketsByOrga/?id=", // all open pending tickets by organization....
       mTicket: "addressticket/getMine/?id=", //mine tickets..
       uImage: "users/getUserImage/?pic=",  // user image.."users/getUsers/"
       fUsers: "users/getUsers/", // fetch all users.
       hTicket: "addressticket/getHistory", // history tickets..
       tNumber: "addressticket/getTicketNumber", // Generate new Ticket number
       initTicket: "addressticket/initTicket",   // Save Initial Ticket
       sTicket: "addressticket/save/", //Save ticket
       gRouting: "gis/getGISRoutingPersonel/?", // TICKET DECISION FOR GIS ROUTING>>>
       bRouting: "gis/failOverRouting/?orga=", // Back up Routing Handles fail over from GIS Routing...
       gUpload:  "gis/uploadGIS/",   // Handles all the gis zip upload to the db server...
       tAttachment: "addressticket/uploadAttachments/", // Ticket ATTACHMENT>>>>>> Handles the ticket attachment to the db server....
       dTAttachment: "addressticket/displayPic/?path=", // DIsplay ticket attachment file...
       gTFile:  "addressticket/getFile/?path=", // DOWNLOAD ATTACHMENT FROM TICKET
       dltAttachment:  "addressticket/deleteAttachment", //DELETE ATTACHMENT FROM TICKET....
       gTAttachments: "addressticket/getAttachments/", // DOWNLOAD ALL TICKET ATTACHMENTS RELATED TO THIS TICKET....
       gListUsers:    "users/getListUsers/", // Get List Users...
       gListOrga:   "users/getListOrganization/", // Get List of organization..
       dQuickPick: "qprocess/displayPic/?path=" // Display QUick Pick picture...
    }
   }
}
// PURPOSE: The App Service will be used for re-usable code & HTTP request to the server...
// As well handles all esri load to the web application...
@Injectable()
export class AppService {
  id_ticket: number = null; // get current ticket number..
  users: any = null; // Get a list of users from server...
  organizations: any = []; // stores the list of organizations in this variable...
  route: ROUTES = new ROUTES();
  url: string  = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";
  hcadurl: string = this.url + 'proxy/findHCADParcels/?' //"http://propaccess.hidalgoad.org:6080/arcgis/rest/services/HidalgoMapSearch/MapServer/find?";
  hcadurl2: string = this.url + 'proxy/geometryHCADParcels/?';
  hcadquery: string = "http://propaccess.hidalgoad.org:6080/arcgis/rest/services/HidalgoMapSearch/MapServer/1";
  // Get Account Info
  account_info: LOGIN_INFO = {
     deparment_id: "",
     user_id: null
  }

  // MSG Codes for Notify Pop
  msg_codes: MSG_CODES = {alert: "alert", success: "success", info: 'info'};

  // Toolbar Activities when pressing a button does an action on certain occasions..

  toolbarActivies: TOOL_ACTIONS = {TICKET_SAVE_TRANSFER: 1, 
    TICKET_ARCHIVE: 2, TICKET_DELETE: 3, TICKET_INSERT_COMMENT: 4, TICKET_ESRI_MAP: 5, TICKET_ESRI_IMAGERY: 6,
    TICKET_DISPLAY_ATTACHMENT: 7, TICKET_LIST_ATTACHMENTS: 8
  };

  // Sends information to app component from login component..
  cntAppFromLogin = new Subject<any>();

  // Sends Actions where is needed...
  toolbarActions = new Subject<any>(); // ...This handle all transactions from toolbar to interact with routes...

  ticketInteractionToolbar = new Subject<any>();

  // New Subject for Quick Pick...
  actionsQuickPick = new Subject<any>();
  

  //PARCEL FIELDS 
  propertyId: string = 'hcad.DBO.Parcel.PROP_ID';
  hoodName: string = 'HCAD2.dbo.web_map_property.hood_name';
  taxAccount: string = 'HCAD2.dbo.web_map_property.geo_id';

  //proxy url
  proxyUrl: string = 'https://gis.lrgvdc911.org/DotNet/proxy.ashx?';

  // =-=-=-=-= ESRI GLOBAL VARIABLES =-=-=-=-=-=-=-=
  esriMap:any = null;
  esriConfig: any = null;
  esriGraphic: any = null;
  esriwebMercatorUtils: any = null;
  esriEdit: any = null;
  esriGraphicsLayer: any = null;
  esriWMTSLayer: any = null;
  esriWMTSLayerInfo: any = null;
  esriDynamicLayer: any = null;
  esriColor = null;
  esriPoint = null;
  esriCircle = null;
  esriSimpleMarkerSymbol = null;
  esriSimpleLineSymbol = null;
  esriSimpleFillSymbol = null;
  esriPictureMarkerSymbol: any = null;
  esriPolygon: any = null;
  esriCoreFx: any = null;
  esriFx: any = null;
  esriEasing: any = null;
  esriQuery: any = null;
  esriQueryTask: any = null;
  mapFlexBaseMap: any = null;
  imageryLayer: any = null;
  mapFlexURL: string = "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/MapFlex2/MapServer";
  imageryURL: string = 'https://wms-txgi.tnris.org/login/path/contour-camera-poetic-poem/wms';
  wmtsURL: string = 'https://txgi.tnris.org/login/path/contour-camera-poetic-poem/wmts';
  ticketCenter: any = null;
  cameraGraphics: PICK = {HOME: "assets/Home-48.png", 
    MOBILE: "assets/MHome-48.png",      PICNEW: "assets/New-48.png", STREETSIGN : "assets/Signpost-48.png",
    FIRE: "assets/Fire_Hydrant-48.png", BUSINESS : "assets/Business-48.png"
  }
  
  constructor(private http: HttpClient) { }

  // Gets information from database.
  GET_METHOD(request) {
    return this.http.get(this.url + request);
  }

  FIND_METHOD(request) {

    return this.http.get(this.hcadurl + request);
  }

  GEOMETRY_METHOD(request) {
    
    return this.http.get(this.hcadurl2 + request);
  }

    // Post information to the database...
  POST_METHOD(request, body) {
    return this.http.post(this.url + request, body);
  }

  // Module to handle string to float
  formatFloat(value) {
     return (typeof(value) == 'string') ? parseFloat(value) : value;
  }
 
  // Formating from am to pm resuable modules..
  FORMAT_AMPM(date: Date): String {
      let hours = date.getHours();
      let minutes:any = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;

      return strTime;
  }


  //<<<LOAD ESRI MAP OBJECTS HERE>>>>>
  esriLoadObjects() {
    console.log("ESRI LOADED STARTED");
    const options = {
      url: 'https://js.arcgis.com/3.23/'
    };

    esriLoader.loadModules(['esri/map','esri/config','esri/graphic', "esri/geometry/webMercatorUtils",
    "esri/toolbars/edit", 'esri/layers/WMTSLayer', 'esri/layers/GraphicsLayer','esri/layers/WMTSLayerInfo',
    'esri/layers/ArcGISDynamicMapServiceLayer', "esri/Color", "esri/geometry/Point", "esri/geometry/Circle", 
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",'esri/symbols/SimpleFillSymbol', "esri/symbols/PictureMarkerSymbol",
    "esri/tasks/query", "esri/tasks/QueryTask",
	'esri/geometry/Polygon', 'dojo/fx', 'dojo/_base/fx', 'dojo/fx/easing'], options)
    .then(([Map,Config, Graphic, webMercatorUtils, Edit, WMTSLayer,GraphicsLayer,WMTSLayerInfo, ArcGISDynamicMapServiceLayer, Color, 
      Point, Circle, SimpleMarkerSymbol, SimpleLineSymbol,SimpleFillSymbol,PictureMarkerSymbol, Query, QueryTask, Polygon, coreFx, fx, easing]) => {

    this.esriMap            = Map;
    this.esriConfig         = Config;
    this.esriGraphic        = Graphic;
    this.esriwebMercatorUtils = webMercatorUtils;
    this.esriEdit           = Edit;
    this.esriGraphicsLayer  = GraphicsLayer;
    this.esriWMTSLayer      = WMTSLayer;
    this.esriWMTSLayerInfo  = WMTSLayerInfo;
    this.esriDynamicLayer   = ArcGISDynamicMapServiceLayer;
	  this.esriColor          = Color;
    this.esriPoint          = Point;
    this.esriCircle         = Circle;
	  this.esriCoreFx         = coreFx;
	  this.esriFx             = fx;
    this.esriEasing         = easing;
    this.esriQuery          = Query;
    this.esriQueryTask      = QueryTask;
    this.esriPictureMarkerSymbol = PictureMarkerSymbol;
	  
	  this.esriSimpleMarkerSymbol = SimpleMarkerSymbol;
	  this.esriSimpleLineSymbol   = SimpleLineSymbol;
	  this.esriSimpleFillSymbol   = SimpleFillSymbol;
    this.esriPolygon      = Polygon;

      // Create Dynamic Object to re-use
      this.mapFlexBaseMap = new ArcGISDynamicMapServiceLayer(this.mapFlexURL);

      //Generate the picture graphics objects for use...
      this.cameraGraphics.HomeObj = new PictureMarkerSymbol(this.cameraGraphics.HOME, 30, 30);
      this.cameraGraphics.MobileObj = new PictureMarkerSymbol(this.cameraGraphics.MOBILE, 34, 34)
      this.cameraGraphics.PicNewObj = new PictureMarkerSymbol(this.cameraGraphics.PICNEW, 30, 30);
      this.cameraGraphics.StreetSignObj = new PictureMarkerSymbol(this.cameraGraphics.STREETSIGN, 30, 30);
      this.cameraGraphics.FireObj = new PictureMarkerSymbol(this.cameraGraphics.FIRE, 30, 30);
      this.cameraGraphics.BusObj  = new PictureMarkerSymbol(this.cameraGraphics.BUSINESS, 30, 30);

    }) // End of Loading Esri Modules..
   
  }
  
  // MODULE TO ANIMATE GRAPHICS>>>
  animateGraphic(graphicFlash) {
    
    if(!graphicFlash) return;
    if(!graphicFlash.getDojoShape()) return; // if null
    if(!graphicFlash.getDojoShape().getNode()) return; // if null 

	  var shape = graphicFlash.getDojoShape().getNode();
	  var animA = this.esriFx.fadeOut({ 
      	node:shape,
        duration: 400,
        easing: this.esriEasing.linear
      });
      
      var animB = this.esriFx.fadeIn({
            node: shape,
        		easing: this.esriEasing.linear,
        		duration: 400
          });
     
      this.esriCoreFx.chain([animB, animA, animB, animA,animB, animA, animB, animB, animA, animB, animA,animB, animA, animB]).play();  
  }


}

interface PICK {
  BUSINESS?: string;
  BusObj?: any;
  FIRE?: string;
  FireObj?: any;
  HOME?: string;
  HomeObj?: any;
  MOBILE?: string;
  MobileObj?: any;
  PICNEW?: string;
  PicNewObj?: any;
  STREETSIGN?: string;
  StreetSignObj?: any;

}

interface TOOL_ACTIONS {
  TICKET_SAVE_TRANSFER?:number;
  TICKET_ARCHIVE?: number;
  TICKET_DELETE?: number;
  TICKET_INSERT_COMMENT?: number;
  TICKET_ESRI_MAP?: number;
  TICKET_ESRI_IMAGERY?: number;
  TICKET_DISPLAY_ATTACHMENT?: number;
  TICKET_LIST_ATTACHMENTS?: number;
}

interface API_ROUTES {
   login?: string;
   ssTicket?: string;
   vwTicket?: string;
   vtFeeds?: string;
   dtFeeds?: string;
   itFeeds?: string;
   utFeeds?: string;
   ftInbox?: string;
   oTicket?: string;
   mTicket?: string;
   uImage?: string;
   fUsers?: string;
   hTicket?: string;
   tNumber?: string;
   initTicket?: string;
   sTicket?: string;
   gRouting?: string;
   bRouting?: string;
   gUpload?: string;
   tAttachment?: string;
   dTAttachment?: string;
   gTFile?: string;
   gTAttachments?: string
   dltAttachment?: string;
   gListUsers?: string;
   gListOrga?: string;
   dQuickPick?: string;
}

interface LOGIN_INFO {
  deparment_id?: string;
  first_name?: string;
  initials?: string;
  last_name?: string;
  online?: string;
  organization_id?: string;
  password?: "";
  role_id?: string;
  symbol?: string;
  user_id?: string
}

interface MSG_CODES {
   alert?: string;
   success?: string;
   info?: string;
}
