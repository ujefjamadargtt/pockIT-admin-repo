import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShareedcomComponent } from './shareedcom/shareedcom.component';
import { InvoicepageComponent } from '../details pages components/invoicepage/invoicepage.component';
import { ChatoverviewCompComponent } from '../details pages components/chatoverview-comp/chatoverview-comp.component';
import { CustomerrattingComponent } from '../details pages components/customerratting/customerratting.component';
import { TechnicianrattingComponent } from '../details pages components/technicianratting/technicianratting.component';
import { ActionlogsComponent } from '../details pages components/actionlogs/actionlogs.component';
import { JobcardpageComponent } from '../details pages components/jobcardpage/jobcardpage.component';
import { technicainslistComponent } from '../details pages components/technicainslist/technicainslist.component';
import { TechnicianActiveStatusReportComponent } from '../details pages components/technician-active-status-report/technician-active-status-report.component';
import { CustomeActivityListComponent } from '../details pages components/CustomerActivity/custome-activity-list/custome-activity-list.component';
import { CancelorderreqComponent } from '../orderpages/cancelorderreq/cancelorderreq.component';
import { ChatlistComponent } from '../details pages components/ChatInteraction/chatlist/chatlist.component';
import { CancelshoporderreqComponent } from '../Inventorypages/pages/Shop/cancelshoporderreq/cancelshoporderreq.component';
import { ReportComponent } from '../details pages components/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: ShareedcomComponent,
    children: [
      { path: 'technician-overview', component: technicainslistComponent },
      { path: 'all-invoice', component: InvoicepageComponent },
      { path: 'jobs', component: JobcardpageComponent },
      { path: 'chats', component: ChatoverviewCompComponent },
      { path: 'customer-ratings', component: CustomerrattingComponent },
      { path: 'technician-ratings', component: TechnicianrattingComponent },
      { path: 'action-and-activity-logs', component: ActionlogsComponent },
      {
        path: 'technician-activities',
        component: TechnicianActiveStatusReportComponent,
      },
      { path: 'customer-activities', component: CustomeActivityListComponent },
      { path: 'cancel-order-requests', component: CancelorderreqComponent },
      {
        path: 'shoporder-cancel-requests',
        component: CancelshoporderreqComponent,
      },
      { path: 'backoffice-technician-chat', component: ChatlistComponent },
      // new
      { path: 'reports', component: ReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }
