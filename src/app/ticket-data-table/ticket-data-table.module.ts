import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketDataTableRoutingModule } from './ticket-data-table-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TicketDataTableComponent } from './ticket-data-table.component';

@NgModule({
  imports: [
    CommonModule,
    TicketDataTableRoutingModule,
    SharedModule
  ],
  declarations: [TicketDataTableComponent]
})
export class TicketDataTableModule { }
