import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubdivisionRoutingModule } from './subdivision-routing.module';
import { WorksheetComponent } from './worksheet/worksheet.component';

@NgModule({
  imports: [
    CommonModule,
    SubdivisionRoutingModule
  ],
  declarations: [WorksheetComponent]
})
export class SubdivisionModule { }
