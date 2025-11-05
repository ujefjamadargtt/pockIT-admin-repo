import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportRoutingModule } from './support-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NgxPrintModule } from 'ngx-print';
import { KonwledgeBaseCategoryAddComponent } from './Components/KnowledgeBaseCategoryMaster/konwledge-base-category-add/konwledge-base-category-add.component';
import { KonwledgeBaseCategoryListComponent } from './Components/KnowledgeBaseCategoryMaster/konwledge-base-category-list/konwledge-base-category-list.component';
import { SupportMasterComponent } from './support-master/support-master.component';
import { KnowledgeBaseSubCategoryListComponent } from './Components/KnowledgeBaseSubCategoryMaster/knowledge-base-sub-category-list/knowledge-base-sub-category-list.component';
import { KnowledgeBaseSubCategoryAddComponent } from './Components/KnowledgeBaseSubCategoryMaster/knowledge-base-sub-category-add/knowledge-base-sub-category-add.component';
import { KnowledgeBaseMasterAddComponent } from './Components/KnowledgeBaseMaster/knowledge-base-master-add/knowledge-base-master-add.component';
import { KnowledgeBaseMasterListComponent } from './Components/KnowledgeBaseMaster/knowledge-base-master-list/knowledge-base-master-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from '../shared/shared.module';
import { DepartmentComponent } from './Components/Ticketing_System_FAQ/Department/department/department.component';
import { TransferTicketDrawerComponent } from './Components/Ticketing_System_FAQ/Tickets/transfer-ticket-drawer/transfer-ticket-drawer.component';
import { TicketgroupComponent } from './Components/Ticketing_System_FAQ/Tickets/ticketgroup/ticketgroup.component';
import { TicketdetailsComponent } from './Components/Ticketing_System_FAQ/Tickets/ticketdetails/ticketdetails.component';
import { FaqHeadComponent } from './Components/Ticketing_System_FAQ/FaqHead/faq-head/faq-head.component';
import { TicketsComponent } from './Components/Ticketing_System_FAQ/Tickets/tickets/tickets.component';
import { FaqsComponent } from './Components/Ticketing_System_FAQ/FAQ/faqs/faqs.component';
import { FaqHeadsComponent } from './Components/Ticketing_System_FAQ/FaqHead/faq-heads/faq-heads.component';
import { FaqresponsesComponent } from './Components/Ticketing_System_FAQ/FAQ/faqresponses/faqresponses.component';
import { DepartmentsComponent } from './Components/Ticketing_System_FAQ/Department/departments/departments.component';
import { FaqComponent } from './Components/Ticketing_System_FAQ/FAQ/faq/faq.component';
import { CreateticketComponent } from './Components/Ticketing_System_FAQ/createticket/createticket.component';
// import { SearchfaqComponent } from './Components/Ticketing_System_FAQ/searchfaq/searchfaq.component';
import { ViewchatticketComponent } from './Components/Ticketing_System_FAQ/viewchatticket/viewchatticket.component';
import { MyticketComponent } from './Components/Ticketing_System_FAQ/myticket/myticket.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DepartMentMappingFormComponent } from './Components/depart-ment-mapping-form/depart-ment-mapping-form.component';
import { FAQDesignPageComponent } from '../Pages/components/faq-design-page/faq-design-page.component';
import { ChattdetailsicketComponent } from './Components/Ticket Reports/chattdetailsicket/chattdetailsicket.component';
import { TicketreportComponent } from './Components/Ticket Reports/ticketreport/ticketreport.component';
import { SupportUserWiseTicketDetailsComponent } from './Components/Ticket Reports/support-user-wise-ticket-details/support-user-wise-ticket-details.component';
import { GroupwiseautocloseticketcountComponent } from './Components/Ticket Reports/groupwiseautocloseticketcount/groupwiseautocloseticketcount.component';
import { CreaterWiseAutoCloseTicketReportComponent } from './Components/Ticket Reports/creater-wise-auto-close-ticket-report/creater-wise-auto-close-ticket-report.component';
import { TicketGroupWiseTicketDetailsComponent } from './Components/Ticket Reports/ticket-group-wise-ticket-details/ticket-group-wise-ticket-details.component';
import { TicketGroupWiseTimeTakenToCloseComponent } from './Components/Ticket Reports/ticket-group-wise-time-taken-to-close/ticket-group-wise-time-taken-to-close.component';
import { TicketTransferReportComponent } from './Components/Ticket Reports/ticket-transfer-report/ticket-transfer-report.component';
import { GroupWiseAutoCloseTicketComponent } from './Components/Ticket Reports/group-wise-auto-close-ticket/group-wise-auto-close-ticket.component';
import { TicketGroupWiseSummaryComponent } from './Components/Ticket Reports/ticket-group-wise-summary/ticket-group-wise-summary.component';
import { TicketautocloseComponent } from './Components/Ticket Reports/ticketautoclose/ticketautoclose.component';
import { UserwisesummaryComponent } from './Components/Ticket Reports/userwisesummary/userwisesummary.component';
import { HelpdocumentpageComponent } from './Components/helpdocumentpage/helpdocumentpage.component';
import { OrderTicketsComponent } from './Components/order-tickets/order-tickets.component';
import { NewknowledgebasecategoryComponent } from '../Pages/components/newknowledgebasecategory/newknowledgebasecategory.component';
@NgModule({
  declarations: [
    KonwledgeBaseCategoryAddComponent,
    KonwledgeBaseCategoryListComponent,
    SupportMasterComponent,
    KnowledgeBaseSubCategoryListComponent,
    KnowledgeBaseSubCategoryAddComponent,
    KnowledgeBaseMasterAddComponent,
    KnowledgeBaseMasterListComponent,
    TransferTicketDrawerComponent,
    TicketsComponent,
    TicketgroupComponent,
    TicketdetailsComponent,
    FaqHeadsComponent,
    FaqHeadComponent,
    FaqsComponent,
    FaqresponsesComponent,
    FaqComponent,
    DepartmentsComponent,
    DepartmentComponent,
    ViewchatticketComponent,
    MyticketComponent,
    CreateticketComponent,
    DepartMentMappingFormComponent,
    FAQDesignPageComponent,
    HelpdocumentpageComponent,
    TicketreportComponent,
    ChattdetailsicketComponent,
    SupportUserWiseTicketDetailsComponent,
    GroupwiseautocloseticketcountComponent,
    CreaterWiseAutoCloseTicketReportComponent,
    TicketGroupWiseTicketDetailsComponent,
    TicketGroupWiseTimeTakenToCloseComponent,
    TicketTransferReportComponent,
    GroupWiseAutoCloseTicketComponent,
    TicketGroupWiseSummaryComponent,
    TicketautocloseComponent,
    UserwisesummaryComponent,
    OrderTicketsComponent,
    NewknowledgebasecategoryComponent
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule,
    // SupportMasterComponent,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzModalModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzTimePickerModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NgxPrintModule,
    SharedModule,
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    NzSpaceModule,
    NzEmptyModule,
    NzStepsModule,
    NzDropDownModule,
    AngularEditorModule,
    NzBreadCrumbModule,
    NzCollapseModule,
  ]
})
export class SupportModule { }
