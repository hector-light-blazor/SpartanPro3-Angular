import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TckCalendarViewRoutingModule } from './tck-calendar-view-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TckCalendarViewComponent } from './tck-calendar-view.component';

@NgModule({
  imports: [
    CommonModule,
    TckCalendarViewRoutingModule,
    SharedModule
  ],
  declarations: [TckCalendarViewComponent]
})
export class TckCalendarViewModule { }
