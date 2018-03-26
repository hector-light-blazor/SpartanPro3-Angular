import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorksheetComponent } from './worksheet/worksheet.component';

const routes: Routes = [{
   path: 'new',
   component: WorksheetComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubdivisionRoutingModule { }
