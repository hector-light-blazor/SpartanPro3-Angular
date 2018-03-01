import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';


import { NotificationsModule } from 'angular-notice'
import { SharedModule} from "./shared/shared.module";

import { AppComponent } from './app.component';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { UppercaseDirective } from './uppercase.directive';

import { ArchiveTicketListComponent } from './archive-ticket-list/archive-ticket-list.component';
import { TicketDataTableComponent } from './ticket-data-table/ticket-data-table.component';
import { AppService } from './app.service';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    UppercaseDirective,
    ArchiveTicketListComponent,
    TicketDataTableComponent
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
