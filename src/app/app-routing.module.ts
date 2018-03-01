import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashboardTicketsComponent} from './dashboard-tickets/dashboard-tickets.component';
import {TckCalendarViewComponent} from './tck-calendar-view/tck-calendar-view.component';
import {TicketComponent} from './ticket/ticket.component';
import {QuickSearchComponent} from './quick-search/quick-search.component';
import {ArchiveTicketListComponent} from './archive-ticket-list/archive-ticket-list.component';
import {TicketChartsComponent} from './ticket-charts/ticket-charts.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'ticket/dashboard',
    loadChildren: './dashboard-tickets/dashboard-tickets.module#DashboardTicketsModule'
  },
  {
    path: 'ticket/charts',
    component: TicketChartsComponent
  },
  {
    path: 'ticket/new',
    loadChildren: './ticket/ticket.module#TicketModule'
  
  },
  {
    path: 'ticket/view/archives',
    component: ArchiveTicketListComponent
  },
  {
    path: 'ticket/view/:id',
    loadChildren: './ticket/ticket.module#TicketModule'
  },
  {
    path: 'ticket/calendar-view',
    component: TckCalendarViewComponent
  },
  
  {
    path: 'ticket/quickSearch/:search', component: QuickSearchComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
