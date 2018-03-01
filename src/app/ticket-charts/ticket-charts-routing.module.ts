import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketChartsComponent } from './ticket-charts.component';

const routes: Routes = [{path: '', component: TicketChartsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketChartsRoutingModule { }
