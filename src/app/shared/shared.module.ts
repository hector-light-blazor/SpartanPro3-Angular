import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MasterLoadingComponent } from '../master-loading/master-loading.component';
import { FilterminePipe } from '../filtermine.pipe';
import { TicketWorkflowComponent } from '../ticket-workflow/ticket-workflow.component';
import { FormsModule } from '@angular/forms';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { EsriMapComponent } from '../esri-map/esri-map.component';
import { FullScreenPickComponent } from '../full-screen-pick/full-screen-pick.component';
import { QuickPickToolsComponent } from '../quick-pick-tools/quick-pick-tools.component';
import { GoogleMapComponent } from '../google-map/google-map.component';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    TextMaskModule,
    NgxDatatableModule
  ],
  providers: [],
  declarations: [MasterLoadingComponent, 
    TicketWorkflowComponent,
    FileUploaderComponent, 
    FileViewerComponent, 
    QuickPickToolsComponent,
    FullScreenPickComponent,
    EsriMapComponent,
    GoogleMapComponent,
    FilterminePipe],
  exports: [MasterLoadingComponent,FormsModule, TextMaskModule,NgxDatatableModule,
    TicketWorkflowComponent,FileUploaderComponent, EsriMapComponent, GoogleMapComponent,
    FileViewerComponent,QuickPickToolsComponent ,FullScreenPickComponent, FilterminePipe]
})
export class SharedModule { }
