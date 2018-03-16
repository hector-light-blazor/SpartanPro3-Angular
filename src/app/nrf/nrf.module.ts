import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NrfRoutingModule } from './nrf-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import {SharedModule} from "../shared/shared.module";
import { AssignComponent } from './assign/assign.component';
import { FormComponent } from './form/form.component';

@NgModule({
  imports: [
    CommonModule,
    NrfRoutingModule,
    SharedModule
  ],
  declarations: [DashboardComponent, UploadComponent, AssignComponent, FormComponent]
})
export class NrfModule { }
