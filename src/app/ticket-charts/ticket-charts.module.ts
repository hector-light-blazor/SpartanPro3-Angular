import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import { TicketChartsRoutingModule } from './ticket-charts-routing.module';
import { TicketChartsComponent } from './ticket-charts.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TicketChartsRoutingModule
  ],
  declarations: [TicketChartsComponent]
})
export class TicketChartsModule { }
