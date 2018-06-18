import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { TicketIComponent } from './ticket-i/ticket-i.component';
import { TicketUComponent } from './ticket-u/ticket-u.component';
import { ToolbarIComponent } from './toolbar-i/toolbar-i.component';
import { ToolbarUComponent } from './toolbar-u/toolbar-u.component';
import { UserUComponent } from './user-u/user-u.component';
import { UserIComponent } from './user-i/user-i.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ],
  declarations: [TicketIComponent, TicketUComponent, ToolbarIComponent, ToolbarUComponent, UserUComponent, UserIComponent, ProfileComponent]
})
export class SettingsModule { }
