import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketDataTableComponent } from './ticket-data-table.component';

const routes: Routes = [{path: '', component: TicketDataTableComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketDataTableRoutingModule { }
