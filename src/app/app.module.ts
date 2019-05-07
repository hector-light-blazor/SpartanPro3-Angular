import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';


import { NotificationsModule } from 'angular-notice'
import { SharedModule} from "./shared/shared.module";
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';

import { ArchiveTicketListComponent } from './archive-ticket-list/archive-ticket-list.component';
import { AppService } from './app.service';
import { MainMapComponent } from './main-map/main-map.component';

import { QuickPickListComponent } from './quick-pick-list/quick-pick-list.component';
import { SearchAddressComponent } from './search-address/search-address.component';
import { MapServiceService } from './map-service.service';


import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { GoogleMap2Component } from './google-map2/google-map2.component';
import { BasemapComponent } from './basemap/basemap.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    ArchiveTicketListComponent,
    MainMapComponent,
    
    QuickPickListComponent,
    SearchAddressComponent,

    
    GoogleMap2Component,
    BasemapComponent,
    BookmarkComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NguiAutoCompleteModule,
    AppRoutingModule,
    NotificationsModule,
    SharedModule
  ],
  providers: [AppService, MapServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
