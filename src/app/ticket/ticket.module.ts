import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TicketComponent } from './ticket.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TicketRoutingModule,
    SharedModule
  ],
  declarations: [TicketComponent, DialogComponent]
})
export class TicketModule { }
