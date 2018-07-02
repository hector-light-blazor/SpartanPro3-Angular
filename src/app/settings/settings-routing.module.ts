import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarIComponent } from './toolbar-i/toolbar-i.component';
import { ToolbarUComponent } from './toolbar-u/toolbar-u.component';
import { TicketIComponent } from './ticket-i/ticket-i.component';
import { TicketUComponent } from './ticket-u/ticket-u.component';
import { UserUComponent } from './user-u/user-u.component';
import { UserIComponent } from './user-i/user-i.component';

const routes: Routes = [{
  path: "createToolbar",
  component: ToolbarIComponent
},
{
  path: "updateToolbars",
  component: ToolbarUComponent
},
{
  path: "Ticket",
  component: TicketIComponent
},{
  path: "updateTicket",
  component: TicketUComponent
},
  {
    path: "createUser",
    component: UserIComponent
  },
{
  path: "updateUsers",
  component: UserUComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
