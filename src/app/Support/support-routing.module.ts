import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KonwledgeBaseCategoryListComponent } from './Components/KnowledgeBaseCategoryMaster/konwledge-base-category-list/konwledge-base-category-list.component';
import { SupportMasterComponent } from './support-master/support-master.component';
import { KnowledgeBaseSubCategoryListComponent } from './Components/KnowledgeBaseSubCategoryMaster/knowledge-base-sub-category-list/knowledge-base-sub-category-list.component';
import { KnowledgeBaseMasterListComponent } from './Components/KnowledgeBaseMaster/knowledge-base-master-list/knowledge-base-master-list.component';
import { MyticketComponent } from './Components/Ticketing_System_FAQ/myticket/myticket.component';
import { TicketsComponent } from './Components/Ticketing_System_FAQ/Tickets/tickets/tickets.component';
import { FaqHeadsComponent } from './Components/Ticketing_System_FAQ/FaqHead/faq-heads/faq-heads.component';
import { FaqsComponent } from './Components/Ticketing_System_FAQ/FAQ/faqs/faqs.component';
import { DepartmentsComponent } from './Components/Ticketing_System_FAQ/Department/departments/departments.component';
import { TicketgroupComponent } from './Components/Ticketing_System_FAQ/Tickets/ticketgroup/ticketgroup.component';
import { DepartMentMappingFormComponent } from './Components/depart-ment-mapping-form/depart-ment-mapping-form.component';
import { FAQDesignPageComponent } from '../Pages/components/faq-design-page/faq-design-page.component';
import { HelpdocumentpageComponent } from './Components/helpdocumentpage/helpdocumentpage.component';
import { TicketreportComponent } from './Components/Ticket Reports/ticketreport/ticketreport.component';
import { SupportUserWiseTicketDetailsComponent } from './Components/Ticket Reports/support-user-wise-ticket-details/support-user-wise-ticket-details.component';
import { GroupwiseautocloseticketcountComponent } from './Components/Ticket Reports/groupwiseautocloseticketcount/groupwiseautocloseticketcount.component';
import { CreaterWiseAutoCloseTicketReportComponent } from './Components/Ticket Reports/creater-wise-auto-close-ticket-report/creater-wise-auto-close-ticket-report.component';
import { TicketTransferReportComponent } from './Components/Ticket Reports/ticket-transfer-report/ticket-transfer-report.component';
import { TicketGroupWiseTicketDetailsComponent } from './Components/Ticket Reports/ticket-group-wise-ticket-details/ticket-group-wise-ticket-details.component';
import { TicketGroupWiseTimeTakenToCloseComponent } from './Components/Ticket Reports/ticket-group-wise-time-taken-to-close/ticket-group-wise-time-taken-to-close.component';
import { GroupWiseAutoCloseTicketComponent } from './Components/Ticket Reports/group-wise-auto-close-ticket/group-wise-auto-close-ticket.component';
import { TicketGroupWiseSummaryComponent } from './Components/Ticket Reports/ticket-group-wise-summary/ticket-group-wise-summary.component';
import { TicketautocloseComponent } from './Components/Ticket Reports/ticketautoclose/ticketautoclose.component';
import { UserwisesummaryComponent } from './Components/Ticket Reports/userwisesummary/userwisesummary.component';
import { OrderTicketsComponent } from './Components/order-tickets/order-tickets.component';
import { NewknowledgebasecategoryComponent } from '../Pages/components/newknowledgebasecategory/newknowledgebasecategory.component';

const routes: Routes = [
  {
    path: "",
    component: SupportMasterComponent,
    children: [
      { path: "knowledgebasecategory", component: KonwledgeBaseCategoryListComponent },
      { path: "knowledgebasesubcategory", component: KnowledgeBaseSubCategoryListComponent },
      { path: "knowledgebasemaster", component: KnowledgeBaseMasterListComponent },

      { path: 'view-faqs', component: FAQDesignPageComponent },
      { path: 'help_guide', component: HelpdocumentpageComponent },
      { path: 'faq-heads', component: FaqHeadsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: "support-ticket-list", component: TicketsComponent },
      { path: "department-master", component: DepartmentsComponent },
      { path: 'ticketgroups', component: TicketgroupComponent },
      { path: 'department-mapping', component: DepartMentMappingFormComponent },
      { path: "tickets", component: MyticketComponent },



      // 18-02-2025
      { path: 'ticket-details-report', component: TicketreportComponent },
      {
        path: 'user-wise-details-report',
        component: SupportUserWiseTicketDetailsComponent,
      },
      {
        path: 'group-wise-auto-close-ticket-count-report',
        component: GroupwiseautocloseticketcountComponent,
      },
      { path: 'creator-wise-auto-close-report', component: CreaterWiseAutoCloseTicketReportComponent },
      { path: 'ticket-transfer-report', component: TicketTransferReportComponent },
      { path: 'ticket-groupwise-details-report', component: TicketGroupWiseTicketDetailsComponent },

      { path: 'ticket-groupwise-timetaken-to-close-report', component: TicketGroupWiseTimeTakenToCloseComponent },
      { path: 'group-wise-auto-close-ticket', component: GroupWiseAutoCloseTicketComponent },
      { path: 'ticket-groupwise-summary-report', component: TicketGroupWiseSummaryComponent },
      { path: 'ticket-autoclose-component', component: TicketautocloseComponent },
      { path: 'user-wise-summary', component: UserwisesummaryComponent },
      { path: "order-tickets", component: OrderTicketsComponent },
      {
        path: 'knowledge-base',
        component: NewknowledgebasecategoryComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
