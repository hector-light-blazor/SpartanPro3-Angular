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


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    ArchiveTicketListComponent,
    MainMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NotificationsModule,
    SharedModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
