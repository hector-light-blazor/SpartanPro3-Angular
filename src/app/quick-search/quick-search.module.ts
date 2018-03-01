import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickSearchRoutingModule } from './quick-search-routing.module';
import { QuickSearchComponent } from './quick-search.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    QuickSearchRoutingModule,
    SharedModule
  ],
  declarations: [QuickSearchComponent]
})
export class QuickSearchModule { }
