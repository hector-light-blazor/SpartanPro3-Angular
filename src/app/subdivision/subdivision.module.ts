import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SubdivisionRoutingModule } from './subdivision-routing.module';
import { WorksheetComponent } from './worksheet/worksheet.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SubdivisionRoutingModule
  ],
  declarations: [WorksheetComponent]
})
export class SubdivisionModule { }
