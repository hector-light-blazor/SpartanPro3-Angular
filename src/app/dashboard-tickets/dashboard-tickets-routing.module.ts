import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardTicketsComponent } from './dashboard-tickets.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardTicketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardTicketsRoutingModule { }
