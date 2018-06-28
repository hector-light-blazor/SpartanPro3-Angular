import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarIComponent } from './toolbar-i/toolbar-i.component';
import { ToolbarUComponent } from './toolbar-u/toolbar-u.component';

const routes: Routes = [{
  path: "createToolbar",
  component: ToolbarIComponent
},
{
  path: "updateToolbars",
  component: ToolbarUComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
