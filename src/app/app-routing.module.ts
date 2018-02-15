import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashboardTicketsComponent} from './dashboard-tickets/dashboard-tickets.component';
import {TckCalendarViewComponent} from './tck-calendar-view/tck-calendar-view.component';
import {TicketComponent} from './ticket/ticket.component';
import {QuickSearchComponent} from './quick-search/quick-search.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'ticket/dashboard',
    component: DashboardTicketsComponent
  },
  {
    path: 'ticket/new',
    component: TicketComponent
  },
  {
    path: 'ticket/view/:id',
    component: TicketComponent
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
