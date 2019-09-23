import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Router } from '@angular/router';
import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component';
import { NgxSmartModalModule,NgxSmartModalService } from 'ngx-smart-modal';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ParticularIssueComponent } from './particular-issue/particular-issue.component';

@NgModule({
  declarations: [DashboardComponentComponent, ParticularIssueComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgxSmartModalModule.forRoot(),
    NgxEditorModule,
    OrderModule,
    FilterPipeModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule.forChild([
      {path:'Dashboard',component:DashboardComponentComponent},
      {path:'Issue/:IssueId',component:ParticularIssueComponent}
    ])
  ],
  providers: [ NgxSmartModalService],
})
export class DashboardModule { }
