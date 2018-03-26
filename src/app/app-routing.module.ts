import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashboardTicketsComponent} from './dashboard-tickets/dashboard-tickets.component';
import {TckCalendarViewComponent} from './tck-calendar-view/tck-calendar-view.component';
import {TicketComponent} from './ticket/ticket.component';
import {QuickSearchComponent} from './quick-search/quick-search.component';
import {ArchiveTicketListComponent} from './archive-ticket-list/archive-ticket-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'ticket/charts',
    loadChildren: './ticket-charts/ticket-charts.module#TicketChartsModule'
  },
  {
    path: 'ticket/dashboard',
    loadChildren: './dashboard-tickets/dashboard-tickets.module#DashboardTicketsModule'
  },
  {
    path: 'ticket/filter',
    loadChildren: './ticket-data-table/ticket-data-table.module#TicketDataTableModule'
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
    loadChildren: './tck-calendar-view/tck-calendar-view.module#TckCalendarViewModule'
  },
  
  {
    path: 'ticket/quickSearch/:search', 
    loadChildren: './quick-search/quick-search.module#QuickSearchModule'
  },

  {
    path: 'nrf',
    loadChildren: './nrf/nrf.module#NrfModule'
  },
  {
    path: 'subdivision',
    loadChildren: '.subdivision/subdivision.module#SubdivisionModule'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
