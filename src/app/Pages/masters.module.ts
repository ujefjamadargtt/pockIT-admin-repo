import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgxPrintModule } from 'ngx-print';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MastersRoutingModule } from './masters-routing.module';
// import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MastersComponent } from './Masters/masters.component';
import { OrganizationComponent } from './components/Organizations/organization/organization.component';
import { OrganizationsComponent } from './components/Organizations/organizations/organizations.component';
import { BranchesComponent } from './components/BranchMaster/branches/branches.component';
import { BranchComponent } from './components/BranchMaster/branch/branch.component';
import { PincodeComponent } from './components/PincodeMaster/pincode/pincode.component';
import { PincodesComponent } from './components/PincodeMaster/pincodes/pincodes.component';
import { TaxDetailComponent } from './components/TaxDetailsMaster/tax-detail/tax-detail.component';
import { TaxDetailsComponent } from './components/TaxDetailsMaster/tax-details/tax-details.component';
import { CategoryComponent } from './components/CategoryMaster/category/category.component';
import { CategoriesComponent } from './components/CategoryMaster/categories/categories.component';
import { SubcategoriesComponent } from './components/SubCategoryMaster/subcategories/subcategories.component';
import { SubcategoryComponent } from './components/SubCategoryMaster/subcategory/subcategory.component';
import { CustomerComponent } from './components/CustomerMaster/customer/customer.component';
import { CustomersComponent } from './components/CustomerMaster/customers/customers.component';
import { EmailTemplateComponent } from './components/EmailTemplateMaster/email-template/email-template.component';
import { EmailTemplatesComponent } from './components/EmailTemplateMaster/email-templates/email-templates.component';
import { WhatsapptemplateComponent } from './components/WhatsappTemplateMaster/whatsapptemplate/whatsapptemplate.component';
import { WhatsapptemplatesComponent } from './components/WhatsappTemplateMaster/whatsapptemplates/whatsapptemplates.component';
import { TemplatepreviewComponent } from './components/WhatsappTemplateMaster/templatepreview/templatepreview.component';
import { SmsesComponent } from './components/SMSMaster/smses/smses.component';
import { SmsComponent } from './components/SMSMaster/sms/sms.component';
import { AddressDetailsComponent } from './components/CustomerMaster/address-details/address-details.component';
import { TerritoryMasterComponent } from './components/Territory Master/territory-master/territory-master.component';
import { TerritoryMasterAddComponent } from './components/Territory Master/territory-master-add/territory-master-add.component';
import { ServiceItemMasterListComponent } from './components/Service Item Master/service-item-master-list/service-item-master-list.component';
import { ServiceItemMasterAddComponent } from './components/Service Item Master/service-item-master-add/service-item-master-add.component';
import { CurrencyMasterListComponent } from './components/Currency Master/currency-master-list/currency-master-list.component';
import { CurrencyMasterAddComponent } from './components/Currency Master/currency-master-add/currency-master-add.component';
import { SkillDrawerComponent } from './components/Skill Master/skill-drawer/skill-drawer.component';
import { SkillTableComponent } from './components/Skill Master/skill-table/skill-table.component';
import { TaxTableComponent } from './components/Tax Master/tax-table/tax-table.component';
import { TaxDrawerComponent } from './components/Tax Master/tax-drawer/tax-drawer.component';
import { OrderStatusTableComponent } from './components/Order Status Master/order-status-table/order-status-table.component';
import { OrderStatusDrawerComponent } from './components/Order Status Master/order-status-drawer/order-status-drawer.component';
import { UnitTableComponent } from './components/Unit Master/unit-table/unit-table.component';
import { UnitDrawerComponent } from './components/Unit Master/unit-drawer/unit-drawer.component';
import { LanguageMasterTableComponent } from './components/Language Master/language-master-table/language-master-table.component';
import { LanguageMasterDrawerComponent } from './components/Language Master/language-master-drawer/language-master-drawer.component';
import { JobCardStatusTableComponent } from './components/Job Card Status Master/job-card-status-table/job-card-status-table.component';
import { JobCardStatusDrawerComponent } from './components/Job Card Status Master/job-card-status-drawer/job-card-status-drawer.component';
import { ListstateComponent } from './components/State/liststate/liststate.component';
import { ListcityComponent } from './components/City/listcity/listcity.component';
import { AddcityComponent } from './components/City/addcity/addcity.component';
import { AddstateComponent } from './components/State/addstate/addstate.component';
import { CountrymasterDrawerComponent } from './components/Country Master/countrymaster-drawer/countrymaster-drawer.component';
import { CountryMasterComponent } from './components/Country Master/country-master/country-master.component';
import { CustomerCategoryMasterDrawerComponent } from './components/Customer Category Master/customer-category-master-drawer/customer-category-master-drawer.component';
import { CustomerCategoryMasterComponent } from './components/Customer Category Master/customer-category-master/customer-category-master.component';
import { BackOfficeMasterDrawerComponent } from './components/Back Office Team Master/back-office-master-drawer/back-office-master-drawer.component';
import { BackOfficeMasterTableComponent } from './components/Back Office Team Master/back-office-master-table/back-office-master-table.component';
import { ServiceCatMasterDrawerComponent } from './components/Service Catlog Master/service-cat-master-drawer/service-cat-master-drawer.component';
import { ServiceCatMasterTableComponent } from './components/Service Catlog Master/service-cat-master-table/service-cat-master-table.component';
import { TechnicianMasterComponent } from './components/TechnicianMaster/technician-master/technician-master.component';
import { TechnicianMasterdrawerComponent } from './components/TechnicianMaster/technician-masterdrawer/technician-masterdrawer.component';
import { AppLanguageDrawerComponent } from './components/App language Master/app-language-drawer/app-language-drawer.component';
import { AppLanguageMasterComponent } from './components/App language Master/app-language-master/app-language-master.component';
import { VendorMasterComponent } from './components/Vendor Master/vendor-master/vendor-master.component';
import { VendorMasterDrawerComponent } from './components/Vendor Master/vendor-master-drawer/vendor-master-drawer.component';
import { TerritoryPincodeMappingComponent } from './components/Territory Master/territory-pincode-mapping/territory-pincode-mapping.component';
import { EmailServiceConfigsComponent } from './components/Email Service Config master/email-service-configs/email-service-configs.component';
import { EmailServiceConfigComponent } from './components/Email Service Config master/email-service-config/email-service-config.component';
import { SmsServiceConfigComponent } from './components/SMSConfig/sms-service-config/sms-service-config.component';
import { SmsServiceConfigsComponent } from './components/SMSConfig/sms-service-configs/sms-service-configs.component';
import { WhatsappServiceConfigsComponent } from './components/WhatsAppServiceConfigMaster/whatsapp-service-configs/whatsapp-service-configs.component';
import { WhatsappServiceConfigComponent } from './components/WhatsAppServiceConfigMaster/whatsapp-service-config/whatsapp-service-config.component';
import { CustomerconfigsComponent } from './components/CustomerConfigMaster/customerconfigs/customerconfigs.component';
import { CustomerconfigComponent } from './components/CustomerConfigMaster/customerconfig/customerconfig.component';
import { TerritoryServiceMappingComponent } from './components/Territory Master/territory-service-mapping/territory-service-mapping.component';
import { TerritoryMappingComponent } from './components/Back Office Team Master/territory-mapping/territory-mapping.component';
import { MasterMenuListComponent } from './components/Master_Menu/master-menu-list/master-menu-list.component';
import { WarehouselocationmasterComponent } from './components/WarehouseLocation/warehouselocationmaster/warehouselocationmaster.component';
import { WarehouselocationformComponent } from './components/WarehouseLocation/warehouselocationform/warehouselocationform.component';
import { SkillMappingComponent } from './components/Service Catlog Master/skill-mapping/skill-mapping.component';
import { TechnicianPincodeMappingComponent } from './components/TechnicianMaster/technician-pincode-mapping/technician-pincode-mapping.component';
import { TechnicianSkillsMappingComponent } from './components/TechnicianMaster/technician-skills-mapping/technician-skills-mapping.component';
import { AppLanguageTranslationComponent } from './components/App language Master/app-language-translation/app-language-translation.component';
import { DistrictMasterListComponent } from './components/DistrictMaster/district-master-list/district-master-list.component';
import { DistrictMasterDrawerComponent } from './components/DistrictMaster/district-master-drawer/district-master-drawer.component';
import { TechnicianServiceMappingComponent } from './components/TechnicianMaster/technician-service-mapping/technician-service-mapping.component';
import { TechnicianLanguageMappingComponent } from './components/TechnicianMaster/technician-language-mapping/technician-language-mapping.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PaymentGatewayMasterComponent } from './components/PaymentGatewayMaster/payment-gateway-master/payment-gateway-master.component';
import { PaymentGatewayMasterDrawerComponent } from './components/PaymentGatewayMaster/payment-gateway-master-drawer/payment-gateway-master-drawer.component';
import { SharedModule } from '../shared/shared.module';
import { TerritoryWiseServiceChangeComponent } from './components/Territory Master/territory-wise-service-change/territory-wise-service-change.component';
import { TerritoryWiseServiceChangeFormComponent } from './components/Territory Master/territory-wise-service-change-form/territory-wise-service-change-form.component';
import { WarehouseMasterComponent } from './components/Warehouse Master/warehouse-master/warehouse-master.component';
import { WarehouseDrawerComponent } from './components/Warehouse Master/warehouse-drawer/warehouse-drawer.component';
import { ViewMappedServicesComponent } from './components/Territory Master/view-mapped-services/view-mapped-services.component';
import { CustomerFilterComponent } from './components/CustomerMaster/customer-filter/customer-filter.component';
import { TechnicianFilterComponent } from './components/TechnicianMaster/technician-filter/technician-filter.component';
// import { MainFilterComponent } from './components/main-filter/main-filter.component';
import { TechconfigrationComponent } from './components/TechnicianMaster/techconfigration/techconfigration.component';
import { CustomerActionsComponent } from '../CustomerPages/customer-actions/customer-actions.component';
import { TechnicianCalenderComponent } from './components/TechnicianMaster/technician-calender/technician-calender.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { MainServiceMasterComponent } from './components/Service_Catalogue/ServicesMasterNew/main-service-master/main-service-master.component';
import { SelpdocformComponent } from './components/Service_Catalogue/HelpDocuments/selpdocform/selpdocform.component';
import { SelpdoclistComponent } from './components/Service_Catalogue/HelpDocuments/selpdoclist/selpdoclist.component';
import { AddnewServiceForB2BComponent } from './components/Service_Catalogue/mapServicesToCustomer/addnew-service-for-b2-b/addnew-service-for-b2-b.component';
import { AddnewServiceForB2BListComponent } from './components/Service_Catalogue/mapServicesToCustomer/addnew-service-for-b2-blist/addnew-service-for-b2-blist.component';
import { B2bsubServiceFormComponent } from './components/Service_Catalogue/mapServicesToCustomer/b2bsub-service-form/b2bsub-service-form.component';
import { B2bsubServiceListComponent } from './components/Service_Catalogue/mapServicesToCustomer/b2bsub-service-list/b2bsub-service-list.component';
import { CustomerServicesMappingFormComponent } from './components/Service_Catalogue/mapServicesToCustomer/customer-services-mapping-form/customer-services-mapping-form.component';
import { CustomerServicesMappingListComponent } from './components/Service_Catalogue/mapServicesToCustomer/customer-services-mapping-list/customer-services-mapping-list.component';
import { AddDetailsDrawerMainComponent } from './components/Service_Catalogue/ServicesMasterNew/add-details-drawer-main/add-details-drawer-main.component';
import { MainServiceListComponent } from './components/Service_Catalogue/ServicesMasterNew/main-service-list/main-service-list.component';
import { MapHelpDocumentsComponent } from './components/Service_Catalogue/ServicesMasterNew/map-help-documents/map-help-documents.component';
import { SubServiceListComponent } from './components/Service_Catalogue/SubServiceMasterNew/sub-service-list/sub-service-list.component';
import { SubServiceMasterComponent } from './components/Service_Catalogue/SubServiceMasterNew/sub-service-master/sub-service-master.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ViewServiceLogsComponent } from './components/Service_Catalogue/view-service-logs/view-service-logs.component';
import { VendorTerritoryMappingComponent } from './components/Vendor Master/vendor-territory-mapping/vendor-territory-mapping.component';
import { CancelOrderReasonTableComponent } from './components/Cancel Order Reason Master/cancel-order-reason-table/cancel-order-reason-table.component';
import { CancelOrderReasonDrawerComponent } from './components/Cancel Order Reason Master/cancel-order-reason-drawer/cancel-order-reason-drawer.component';
import { AddHSNSACMASTERComponent } from './components/HSN_SAC_MASTER/add-hsn-sac-master/add-hsn-sac-master.component';
import { HSNSACMASTERlistComponent } from './components/HSN_SAC_MASTER/hsn-sac-masterlist/hsn-sac-masterlist.component';
import { BannermasterlistComponent } from './components/BannerMasterlist/bannermasterlist/bannermasterlist.component';
import { AddbannermasterComponent } from './components/BannerMasterlist/addbannermaster/addbannermaster.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SkillStatusComponent } from './components/skill-status/skill-status.component';
import { WarehouseterriorymappingComponent } from './components/warehouseterriorymapping/warehouseterriorymapping.component';
import { ViewServiceRatingComponent } from './components/Service_Catalogue/view-service-rating/view-service-rating.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { OrderSummaryReportComponent } from './Reports/order-summary-report/order-summary-report.component';
import { CustomerServiceFeedbackReportComponent } from './Reports/customer-service-feedback-report/customer-service-feedback-report.component';
import { CustomerTechnitianFeedbackReportComponent } from './Reports/customer-technitian-feedback-report/customer-technitian-feedback-report.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { VendorPerformanceReportComponent } from './Reports/vendor-performance-report/vendor-performance-report.component';
import { TechnicianCardReportComponent } from './Reports/technician-card-report/technician-card-report.component';
import { RefundReportComponent } from './Reports/refund-report/refund-report.component';
import { OrderDetailedReportComponent } from './Reports/order-detailed-report/order-detailed-report.component';
import { TechnicianCustomerFeedbackReportComponent } from './Reports/technician-customer-feedback-report/technician-customer-feedback-report.component';
import { OrderCancellationReportComponent } from './Reports/order-cancellation-report/order-cancellation-report.component';
import { CustomerRegistrationReportComponent } from './Reports/customer-registration-report/customer-registration-report.component';
import { ServiceUtilizationReportComponent } from './Reports/service-utilization-report/service-utilization-report.component';
import { TechnicianPerformanceReportComponent } from './Reports/technician-performance-report/technician-performance-report.component';
import { JobAssignmentReportComponent } from './Reports/job-assignment-report/job-assignment-report.component';
import { WhatsappMessageTransactionHistoryReportComponent } from './Reports/whatsapp-message-transaction-history-report/whatsapp-message-transaction-history-report.component';
import { SmsTransactionHistoryReportComponent } from './Reports/sms-transaction-history-report/sms-transaction-history-report.component';
import { EmailTransactionHistoryReportComponent } from './Reports/email-transaction-history-report/email-transaction-history-report.component';
import { B2bCustomerServiceSummeryReportComponent } from './Reports/b2b-customer-service-summery-report/b2b-customer-service-summery-report.component';
import { OrderwiseJobCardDetailedReportComponent } from './Reports/orderwise-job-card-detailed-report/orderwise-job-card-detailed-report.component';
import { TechnicianTimeSheetReportComponent } from './Reports/technician-time-sheet-report/technician-time-sheet-report.component';
import { TerritoryTimeSlotsComponent } from './components/Territory Master/territory-time-slots/territory-time-slots.component';
import { TableTemplateCategoryComponent } from './components/TemplateCategories/templateCategoryMaster/table-template-category/table-template-category.component';
import { DrawerTemplateCategoryComponent } from './components/TemplateCategories/templateCategoryMaster/drawer-template-category/drawer-template-category.component';
import { CouponfacilitymappingComponent } from './components/Coupon/couponfacilitymapping/couponfacilitymapping.component';
// import { CouponComponent } from './components/Coupon/Couponss/coupon/coupon.component';
// import { CouponsComponent } from './components/Coupon/Couponss/coupons/coupons.component';
import { CoupontypeComponent } from './components/Coupon/coupontype/coupontype.component';
import { CoupontypesComponent } from './components/Coupon/coupontypes/coupontypes.component';
import { AddplaceholderComponent } from './components/TemplateCategories/Template_Parameters/addplaceholder/addplaceholder.component';
import { ListplaceholderComponent } from './components/TemplateCategories/Template_Parameters/listplaceholder/listplaceholder.component';
import { CustomerTImeSlotsComponent } from './components/CustomerMaster/customer-time-slots/customer-time-slots.component';
import { CouponSummaryReportsComponent } from './components/Coupon/CouponReports/coupon-summary-reports/coupon-summary-reports.component';
import { CouponDetailedReportComponent } from './components/Coupon/CouponReports/coupon-detailed-report/coupon-detailed-report.component';
import { CertificateVerificationComponent } from './components/certificate-verification/certificate-verification.component';
import { HelpDocumentCategoryDrawerComponent } from './components/HelpDocCateAndSubCat/Help Document Category Master/help-document-category-drawer/help-document-category-drawer.component';
import { HelpDocumentCategoryListComponent } from './components/HelpDocCateAndSubCat/Help Document Category Master/help-document-category-list/help-document-category-list.component';
import { HelpDocumentSubcategoryDrawerComponent } from './components/HelpDocCateAndSubCat/Help Document Subcategory Master/help-document-subcategory-drawer/help-document-subcategory-drawer.component';
import { HelpDocumentSubcategoryListComponent } from './components/HelpDocCateAndSubCat/Help Document Subcategory Master/help-document-subcategory-list/help-document-subcategory-list.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { JobtrainingMasterDrawerComponent } from './components/Job_Training/jobtraining-master-drawer/jobtraining-master-drawer.component';
import { JobtrainingMasterComponent } from './components/Job_Training/jobtraining-master/jobtraining-master.component';
import { CustomerCouponDetailedReportComponent } from './components/Coupon/CouponReports/customer-coupon-detailed-report/customer-coupon-detailed-report.component';
import { CustomerCouponSummaryReportComponent } from './components/Coupon/CouponReports/customer-coupon-summary-report/customer-coupon-summary-report.component';
import { CouponinventorymappingComponent } from './components/Coupon/couponinventorymapping/couponinventorymapping.component';
import { DashboardMasterDrawerComponent } from './components/DashboardMaster/dashboard-master-drawer/dashboard-master-drawer.component';
import { DashboardMasterTableComponent } from './components/DashboardMaster/dashboard-master-table/dashboard-master-table.component';
import { InventoryTransactionReportComponent } from './components/inventory-transaction-report/inventory-transaction-report.component';
import { PaymentGatewayTransactionReportComponent } from './Reports/payment-gateway-transaction-report/payment-gateway-transaction-report.component';
import { ChannellistComponent } from './components/Channels/ChannelMaster/channellist/channellist.component';
import { ChanneladdComponent } from './components/Channels/ChannelMaster/channeladd/channeladd.component';
import { CouponsComponent } from './components/Coupon/Coupons/coupons/coupons.component';
import { CouponComponent } from './components/Coupon/Coupons/coupon/coupon.component';
import { TechnicianCashCollectionReportComponent } from './Reports/technician-cash-collection-report/technician-cash-collection-report.component';
import { TechnicianDayLogsDrawerComponent } from './Reports/technician-day-logs-drawer/technician-day-logs-drawer.component';
import { CustomerTechnicianMappingComponent } from './components/CustomerMaster/customer-technician-mapping/customer-technician-mapping.component';
import { AddLoginAddressDetailsComponent } from './components/CustomerMaster/add-login-address-details/add-login-address-details.component';
import { AddLoginCustomerComponent } from './components/CustomerMaster/add-login-customer/add-login-customer.component';
import { AddLoginCustomerListComponent } from './components/CustomerMaster/add-login-customer-list/add-login-customer-list.component';
import { TechnicianslaReportComponent } from './Reports/techniciansla-report/techniciansla-report.component';
import { CustomerAddressLogsReportComponent } from './Reports/customer-address-logs-report/customer-address-logs-report.component';
import { UserloginlogsComponent } from './Reports/userloginlogs/userloginlogs.component';
import { MapEmailToParentCustomerComponent } from './components/CustomerMaster/CustomerEmailMapping/map-email-to-parent-customer/map-email-to-parent-customer.component';
import { MapEmailToChildCustomerComponent } from './components/CustomerMaster/CustomerEmailMapping/map-email-to-child-customer/map-email-to-child-customer.component';
import { APKVersionReportComponent } from './Reports/apkversion-report/apkversion-report.component';
import { CustomerwiseOrderDetailedReportComponent } from './Reports/customerwise-order-detailed-report/customerwise-order-detailed-report.component';
import { CouponterritotymappingComponent } from './components/Coupon/couponterritotymapping/couponterritotymapping.component';
import { TerritoryCalendarComponent } from './components/Territory Master/territory-calendar/territory-calendar.component';

@NgModule({
  declarations: [
    MastersComponent,
    TerritoryWiseServiceChangeComponent,
    TerritoryWiseServiceChangeFormComponent,
    OrganizationComponent,
    OrganizationsComponent,
    BranchesComponent,
    BranchComponent,
    PincodeComponent,
    WarehouseDrawerComponent,
    WarehouseMasterComponent,
    PincodesComponent,
    TaxDetailComponent,
    CustomerActionsComponent,
    TechconfigrationComponent,
    TechnicianFilterComponent,
    TaxDetailsComponent,
    TableTemplateCategoryComponent,
    DrawerTemplateCategoryComponent,
    AddHSNSACMASTERComponent,
    HSNSACMASTERlistComponent,
    CategoryComponent,
    CategoriesComponent,
    CancelOrderReasonDrawerComponent,
    CancelOrderReasonTableComponent,
    SubcategoriesComponent,
    SubcategoryComponent,
    CustomerComponent,
    TechnicianCalenderComponent,
    CustomerFilterComponent,
    CustomersComponent,
    VendorTerritoryMappingComponent,
    TemplatepreviewComponent,
    WhatsapptemplateComponent,
    WhatsapptemplatesComponent,
    EmailTemplateComponent,
    EmailTemplatesComponent,
    SmsComponent,
    APKVersionReportComponent,
    SmsesComponent,
    AddressDetailsComponent,
    TerritoryMasterAddComponent,
    TerritoryMasterComponent,
    ServiceItemMasterAddComponent,
    ServiceItemMasterListComponent,
    CurrencyMasterAddComponent,
    CurrencyMasterListComponent,
    SkillDrawerComponent,
    SkillTableComponent,
    TaxTableComponent,
    TaxDrawerComponent,
    OrderStatusTableComponent,
    OrderStatusDrawerComponent,
    JobCardStatusDrawerComponent,
    JobCardStatusTableComponent,
    LanguageMasterDrawerComponent,
    LanguageMasterTableComponent,
    UnitDrawerComponent,
    UnitTableComponent,
    ListstateComponent,
    ListcityComponent,
    AddstateComponent,
    AddcityComponent,
    CountrymasterDrawerComponent,
    MastersComponent,
    CountryMasterComponent,
    CountrymasterDrawerComponent,
    CustomerCategoryMasterComponent,
    CustomerCategoryMasterDrawerComponent,
    MastersComponent,
    CountrymasterDrawerComponent,
    BackOfficeMasterDrawerComponent,
    BackOfficeMasterTableComponent,
    ServiceCatMasterDrawerComponent,
    ServiceCatMasterTableComponent,
    TechnicianMasterComponent,
    TechnicianMasterdrawerComponent,
    AppLanguageDrawerComponent,
    AppLanguageMasterComponent,
    VendorMasterComponent,
    VendorMasterDrawerComponent,
    TerritoryPincodeMappingComponent,
    SmsServiceConfigComponent,
    SmsServiceConfigsComponent,
    EmailServiceConfigsComponent,
    EmailServiceConfigComponent,
    WhatsappServiceConfigComponent,
    WhatsappServiceConfigsComponent,
    CustomerconfigComponent,
    CustomerconfigsComponent,
    TerritoryPincodeMappingComponent,
    TerritoryServiceMappingComponent,
    TerritoryMappingComponent,
    MasterMenuListComponent,
    WarehouselocationmasterComponent,
    WarehouselocationformComponent,
    TechnicianPincodeMappingComponent,
    TechnicianSkillsMappingComponent,
    SkillMappingComponent,
    AppLanguageTranslationComponent,
    MainServiceMasterComponent,
    MainServiceListComponent,
    SubServiceMasterComponent,
    SubServiceListComponent,
    DistrictMasterListComponent,
    DistrictMasterDrawerComponent,
    TechnicianServiceMappingComponent,
    TechnicianLanguageMappingComponent,
    AddDetailsDrawerMainComponent,
    PaymentGatewayMasterComponent,
    PaymentGatewayMasterDrawerComponent,
    SelpdoclistComponent,
    SelpdocformComponent,
    MapHelpDocumentsComponent,
    ViewMappedServicesComponent,
    CustomerServicesMappingListComponent,
    CustomerServicesMappingFormComponent,
    AddnewServiceForB2BComponent,
    AddnewServiceForB2BListComponent,
    B2bsubServiceListComponent,
    B2bsubServiceFormComponent,
    ViewServiceLogsComponent,
    BannermasterlistComponent,
    AddbannermasterComponent,
    // TechnicianViewJobsComponent,
    SkillStatusComponent,
    WarehouseterriorymappingComponent,
    ViewServiceRatingComponent,
    OrderSummaryReportComponent,
    CustomerServiceFeedbackReportComponent,
    CustomerTechnitianFeedbackReportComponent,
    VendorPerformanceReportComponent,
    TechnicianCardReportComponent,
    RefundReportComponent,
    OrderDetailedReportComponent,
    TechnicianCustomerFeedbackReportComponent,
    OrderCancellationReportComponent,
    CustomerRegistrationReportComponent,
    ServiceUtilizationReportComponent,
    TechnicianPerformanceReportComponent,
    JobAssignmentReportComponent,
    WhatsappMessageTransactionHistoryReportComponent,
    SmsTransactionHistoryReportComponent,
    EmailTransactionHistoryReportComponent,
    B2bCustomerServiceSummeryReportComponent,
    OrderwiseJobCardDetailedReportComponent,
    TechnicianTimeSheetReportComponent,
    TerritoryTimeSlotsComponent,
    CoupontypesComponent,
    CoupontypeComponent,
    CouponsComponent,
    CouponComponent,
    CouponfacilitymappingComponent,
    AddplaceholderComponent,
    ListplaceholderComponent,
    CustomerTImeSlotsComponent,
    CouponSummaryReportsComponent,
    CouponDetailedReportComponent,
    CertificateVerificationComponent,
    HelpDocumentCategoryDrawerComponent,
    HelpDocumentCategoryListComponent,
    HelpDocumentSubcategoryDrawerComponent,
    HelpDocumentSubcategoryListComponent,
    JobtrainingMasterDrawerComponent,
    JobtrainingMasterComponent,
    CustomerCouponSummaryReportComponent,
    CustomerCouponDetailedReportComponent,
    CouponinventorymappingComponent,
    DashboardMasterTableComponent,
    DashboardMasterDrawerComponent,
    InventoryTransactionReportComponent,
    PaymentGatewayTransactionReportComponent,
    ChannellistComponent,
    ChanneladdComponent,
    TechnicianCashCollectionReportComponent,
    TechnicianDayLogsDrawerComponent,
    CustomerTechnicianMappingComponent,
    AddLoginCustomerListComponent,
    AddLoginCustomerComponent,
    AddLoginAddressDetailsComponent,
    TechnicianslaReportComponent,
    CustomerAddressLogsReportComponent,
    UserloginlogsComponent,
    MapEmailToParentCustomerComponent,
    MapEmailToChildCustomerComponent,
    CustomerwiseOrderDetailedReportComponent,
    CouponterritotymappingComponent,
    TerritoryCalendarComponent
  ],
  imports: [
    // PickerComponent,
    CommonModule,
    SharedModule,
    NzCalendarModule,
    MastersRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    PickerModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    SharedModule,
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
    AngularEditorModule,
    ColorPickerModule,
    NzCommentModule,
    NzRateModule,
    ImageCropperModule,
    NzCollapseModule,
  ],
  exports: [
    MastersComponent,
    OrganizationComponent,
    OrganizationsComponent,
    BranchesComponent,
    BranchComponent,
    PincodeComponent,
    PincodesComponent,
    TaxDetailComponent,
    TaxDetailsComponent,
    CategoryComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    SubcategoryComponent,
    CustomerComponent,
    CustomersComponent,
    TemplatepreviewComponent,
    WhatsapptemplateComponent,
    WhatsapptemplatesComponent,
    EmailTemplateComponent,
    EmailTemplatesComponent,
    SmsComponent,
    SmsesComponent,
    AddressDetailsComponent,
    TerritoryMasterAddComponent,
    TerritoryMasterComponent,
    ServiceItemMasterAddComponent,
    ServiceItemMasterListComponent,
    CurrencyMasterAddComponent,
    CurrencyMasterListComponent,
    SkillDrawerComponent,
    SkillTableComponent,
    TaxTableComponent,
    TaxDrawerComponent,
    OrderStatusTableComponent,
    OrderStatusDrawerComponent,
    JobCardStatusDrawerComponent,
    JobCardStatusTableComponent,
    LanguageMasterDrawerComponent,
    LanguageMasterTableComponent,
    UnitDrawerComponent,
    UnitTableComponent,
    ListstateComponent,
    ListcityComponent,
    AddstateComponent,
    AddcityComponent,
    CountrymasterDrawerComponent,
    MastersComponent,
    CountryMasterComponent,
    CountrymasterDrawerComponent,
    CustomerCategoryMasterComponent,
    CustomerCategoryMasterDrawerComponent,
    MastersComponent,
    CountrymasterDrawerComponent,
    BackOfficeMasterDrawerComponent,
    BackOfficeMasterTableComponent,
    ServiceCatMasterDrawerComponent,
    ServiceCatMasterTableComponent,
    TechnicianMasterComponent,
    TechnicianMasterdrawerComponent,
    AppLanguageDrawerComponent,
    AppLanguageMasterComponent,
    VendorMasterComponent,
    VendorMasterDrawerComponent,
    TerritoryPincodeMappingComponent,
    SmsServiceConfigComponent,
    SmsServiceConfigsComponent,
    EmailServiceConfigsComponent,
    EmailServiceConfigComponent,
    WhatsappServiceConfigComponent,
    WhatsappServiceConfigsComponent,
    CustomerconfigComponent,
    CustomerconfigsComponent,

    TerritoryPincodeMappingComponent,
    TerritoryServiceMappingComponent,
    TerritoryMappingComponent,
    MasterMenuListComponent,
    WarehouselocationmasterComponent,
    WarehouselocationformComponent,
    TechnicianPincodeMappingComponent,
    TechnicianSkillsMappingComponent,
    SkillMappingComponent,
    InventoryTransactionReportComponent,
    PaymentGatewayTransactionReportComponent,
  ],
})
export class MasterModule { }
