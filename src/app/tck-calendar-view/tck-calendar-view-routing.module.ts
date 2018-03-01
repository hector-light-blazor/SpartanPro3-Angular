import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TckCalendarViewComponent } from './tck-calendar-view.component';

const routes: Routes = [{path: '', component: TckCalendarViewComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TckCalendarViewRoutingModule { }
