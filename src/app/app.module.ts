import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NotificationsModule } from 'angular-notice'

import {AppService} from "./app.service";
import { AppComponent } from './app.component';
import { MasterLoadingComponent } from './master-loading/master-loading.component';
import { DashboardTicketsComponent } from './dashboard-tickets/dashboard-tickets.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { TicketComponent } from './ticket/ticket.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { TckCalendarViewComponent } from './tck-calendar-view/tck-calendar-view.component';
import { UppercaseDirective } from './uppercase.directive';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { TicketWorkflowComponent } from './ticket-workflow/ticket-workflow.component';
import { FilterminePipe } from './filtermine.pipe';
import { QuickPickToolsComponent } from './quick-pick-tools/quick-pick-tools.component';
import { FullScreenPickComponent } from './full-screen-pick/full-screen-pick.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { ArchiveTicketListComponent } from './archive-ticket-list/archive-ticket-list.component';
import { TicketChartsComponent } from './ticket-charts/ticket-charts.component';


@NgModule({
  declarations: [
    AppComponent,
    MasterLoadingComponent,
    DashboardTicketsComponent,
    TicketComponent,
    EsriMapComponent,
    ToolbarComponent,
    LoginComponent,
    TckCalendarViewComponent,
    UppercaseDirective,
    FileUploaderComponent,
    FileViewerComponent,
    TicketWorkflowComponent,
    FilterminePipe,
    QuickPickToolsComponent,
    FullScreenPickComponent,
    QuickSearchComponent,
    GoogleMapComponent,
    ArchiveTicketListComponent,
    TicketChartsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TextMaskModule,
    NgxDatatableModule,
    NotificationsModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
