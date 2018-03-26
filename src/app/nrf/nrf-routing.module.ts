import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import { AssignComponent } from './assign/assign.component';
import { ExportComponent } from './export/export.component';

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent

}, {
  path: 'upload',
  component: UploadComponent
},
{
 path: 'assign', 
 component: AssignComponent
}, {
  path: 'export',
  component: ExportComponent

}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NrfRoutingModule { }
