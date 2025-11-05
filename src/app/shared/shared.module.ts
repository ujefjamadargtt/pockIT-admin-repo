import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsjobComponent } from '../details pages components/detailsjob/detailsjob.component';
import { JobcardpageComponent } from '../details pages components/jobcardpage/jobcardpage.component';
import { InvoicepageComponent } from '../details pages components/invoicepage/invoicepage.component';
import { CustomerrattingComponent } from '../details pages components/customerratting/customerratting.component';
import { TechnicianrattingComponent } from '../details pages components/technicianratting/technicianratting.component';
import { TechnicianlocationsmapComponent } from '../details pages components/technicianlocationsmap/technicianlocationsmap.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
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
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ChatoverviewCompComponent } from '../details pages components/chatoverview-comp/chatoverview-comp.component';
import { MultiplelocationpageComponent } from '../details pages components/multiplelocationpage/multiplelocationpage.component';
import { CurrentmaplocationComponent } from '../details pages components/currentmaplocation/currentmaplocation.component';
import { ActionlogsComponent } from '../details pages components/actionlogs/actionlogs.component';
import { LocationComponent } from '../map/location/location.component';
import { techniciansdetailsDetailsComponent } from '../details pages components/techniciansdetails/techniciansdetails.component';
// import { technicainslistComponent } from '../TechnicainMap/technicainslist/technicainslist.component';
import { ShareedcomComponent } from './shareedcom/shareedcom.component';
import { SharedRoutingModule } from './shared-routing.module';
import { PaymenttransactionpageComponent } from '../details pages components/paymenttransactionpage/paymenttransactionpage.component';
import { technicainslistComponent } from '../details pages components/technicainslist/technicainslist.component';
import { MainorderComponent } from '../orderpages/mainorder/mainorder.component';
import { AddressaddComponent } from '../orderpages/addressadd/addressadd.component';
import { CustaddComponent } from '../orderpages/custadd/custadd.component';
import { OrderFilterComponent } from '../orderpages/Order FIlter/order-filter/order-filter.component';
import { OrdercreatedrawerComponent } from '../orderpages/ordercreatedrawer/ordercreatedrawer.component';
import { OrderdetailsdrawerComponent } from '../orderpages/orderdetailsdrawer/orderdetailsdrawer.component';
import { OrderlistComponent } from '../orderpages/orderlist/orderlist.component';
import { ViewCustomerRatingComponent } from '../orderpages/view-customer-rating/view-customer-rating.component';
import { ViewPastOrderDrawerComponent } from '../orderpages/view-past-order-drawer/view-past-order-drawer.component';
// import { ListTechnicainMapComponent } from '../TechnicainMap/list-technicain-map/list-technicain-map.component';
import { VendorOverviewListComponent } from '../details pages components/vendor-overview-list/vendor-overview-list.component';
import { VendorOverviewDetailsComponent } from '../details pages components/vendor-overview-details/vendor-overview-details.component';
import { CustomerOverviewListComponent } from '../Pages/components/CustomerOverview/customer-overview-list/customer-overview-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CustomerViewInvoicesComponent } from '../CustomerPages/customer-view-invoices/customer-view-invoices.component';
import { TechcalenderComponent } from '../details pages components/techcalender/techcalender.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { TechnicianActiveStatusReportComponent } from '../details pages components/technician-active-status-report/technician-active-status-report.component';
import { MainFilterComponent } from '../Pages/components/main-filter/main-filter.component';
import { TechnicianViewJobsComponent } from '../Pages/components/TechnicianMaster/technician-view-jobs/technician-view-jobs.component';
import { TechnicianMapJobsDataComponent } from '../details pages components/technician-map-jobs-data/technician-map-jobs-data.component';
import { TechnicianJobStatusChangeComponent } from '../details pages components/technician-job-status-change/technician-job-status-change.component';
import { CustomeActivityListComponent } from '../details pages components/CustomerActivity/custome-activity-list/custome-activity-list.component';
import { CustomersjobslistComponent } from '../details pages components/CustomerActivity/customersjobslist/customersjobslist.component';
import { CancelorderreqComponent } from '../orderpages/cancelorderreq/cancelorderreq.component';
import { ChatdrawerComponent } from '../details pages components/ChatInteraction/chatdrawer/chatdrawer.component';
import { ChatlistComponent } from '../details pages components/ChatInteraction/chatlist/chatlist.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CancelshoporderreqComponent } from '../Inventorypages/pages/Shop/cancelshoporderreq/cancelshoporderreq.component';
import { ReportComponent } from '../details pages components/reports/reports.component';
import { InventorylogsComponent } from '../details pages components/inventorylogs/inventorylogs.component';
import { BrandMasterFormComponent } from '../Pages/components/brandmaster/brand-master-form/brand-master-form.component';
import { BrandMasterTableComponent } from '../Pages/components/brandmaster/brand-master-table/brand-master-table.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { VendorDetailedReportComponent } from '../Pages/Reports/vendor-detailed-report/vendor-detailed-report.component';

@NgModule({
  declarations: [
    DetailsjobComponent,
    JobcardpageComponent,
    InvoicepageComponent,
    CustomerrattingComponent,
    ChatoverviewCompComponent,
    TechnicianrattingComponent,
    TechnicianlocationsmapComponent,
    MultiplelocationpageComponent,
    CurrentmaplocationComponent,
    ActionlogsComponent,
    CustomeActivityListComponent,
    CustomersjobslistComponent,
    TechnicianMapJobsDataComponent,
    LocationComponent,
    techniciansdetailsDetailsComponent,
    technicainslistComponent,
    ShareedcomComponent,
    PaymenttransactionpageComponent,
    CancelorderreqComponent,
    CancelshoporderreqComponent,
    // CustomerActionsComponent,
    VendorOverviewListComponent,
    VendorOverviewDetailsComponent,
    CustomerViewInvoicesComponent,
    TechcalenderComponent,
    MainorderComponent,
    OrderlistComponent,
    OrderdetailsdrawerComponent,
    ViewCustomerRatingComponent,
    ViewPastOrderDrawerComponent,
    OrdercreatedrawerComponent,
    OrderFilterComponent,
    AddressaddComponent,
    CustaddComponent,
    CustomerOverviewListComponent,
    TechnicianActiveStatusReportComponent,
    MainFilterComponent,
    TechnicianViewJobsComponent,
    TechnicianJobStatusChangeComponent,
    ChatlistComponent,
    ChatdrawerComponent,
    ReportComponent,
    InventorylogsComponent,
    BrandMasterFormComponent,
    BrandMasterTableComponent,
    VendorDetailedReportComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NzLayoutModule,
    NzCalendarModule,
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
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    NzSpaceModule,
    NzEmptyModule,
    NzStepsModule,
    NzDropDownModule,
    NzCommentModule,
    NzRateModule,
    AngularEditorModule,
    PickerModule,
    ImageCropperModule
  ],
  exports: [
    TechnicianJobStatusChangeComponent,
    DetailsjobComponent,
    JobcardpageComponent,
    SharedRoutingModule,
    InvoicepageComponent,
    CustomerrattingComponent,
    TechnicianrattingComponent,
    // CustomerActionsComponent,
    MainFilterComponent,
    TechnicianViewJobsComponent,
    CustomerViewInvoicesComponent,
    TechcalenderComponent,
    TechnicianlocationsmapComponent,
    ChatoverviewCompComponent,
    MultiplelocationpageComponent,
    CurrentmaplocationComponent,
    ActionlogsComponent,
    LocationComponent,
    CancelorderreqComponent,
    techniciansdetailsDetailsComponent,
    technicainslistComponent,
    PaymenttransactionpageComponent,
    MainorderComponent,
    OrderlistComponent,
    TechnicianMapJobsDataComponent,
    OrderdetailsdrawerComponent,
    ViewCustomerRatingComponent,
    ViewPastOrderDrawerComponent,
    OrdercreatedrawerComponent,
    OrderFilterComponent,
    // ListTechnicainMapComponent,
    CustomeActivityListComponent,
    CustomersjobslistComponent,
    AddressaddComponent,
    CustaddComponent,
    VendorOverviewListComponent,
    VendorOverviewDetailsComponent,
    CustomerOverviewListComponent,
    ChatlistComponent,
    ChatdrawerComponent,
    ReportComponent,
    InventorylogsComponent,
    BrandMasterFormComponent,
    BrandMasterTableComponent,
    VendorDetailedReportComponent
  ],
})
export class SharedModule { }
