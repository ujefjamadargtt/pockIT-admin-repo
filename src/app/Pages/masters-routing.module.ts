import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersComponent } from './Masters/masters.component';
import { OrganizationsComponent } from './components/Organizations/organizations/organizations.component';
import { BranchesComponent } from './components/BranchMaster/branches/branches.component';
import { TaxDetailsComponent } from './components/TaxDetailsMaster/tax-details/tax-details.component';
import { PincodesComponent } from './components/PincodeMaster/pincodes/pincodes.component';
import { SubcategoriesComponent } from './components/SubCategoryMaster/subcategories/subcategories.component';
import { CategoriesComponent } from './components/CategoryMaster/categories/categories.component';
import { CustomersComponent } from './components/CustomerMaster/customers/customers.component';
import { EmailTemplatesComponent } from './components/EmailTemplateMaster/email-templates/email-templates.component';
import { WhatsapptemplatesComponent } from './components/WhatsappTemplateMaster/whatsapptemplates/whatsapptemplates.component';
import { SmsesComponent } from './components/SMSMaster/smses/smses.component';
import { TerritoryMasterComponent } from './components/Territory Master/territory-master/territory-master.component';
import { ServiceItemMasterListComponent } from './components/Service Item Master/service-item-master-list/service-item-master-list.component';
import { CurrencyMasterListComponent } from './components/Currency Master/currency-master-list/currency-master-list.component';
import { SkillTableComponent } from './components/Skill Master/skill-table/skill-table.component';
import { TaxTableComponent } from './components/Tax Master/tax-table/tax-table.component';
import { OrderStatusTableComponent } from './components/Order Status Master/order-status-table/order-status-table.component';
import { JobCardStatusTableComponent } from './components/Job Card Status Master/job-card-status-table/job-card-status-table.component';
import { LanguageMasterTableComponent } from './components/Language Master/language-master-table/language-master-table.component';
import { UnitTableComponent } from './components/Unit Master/unit-table/unit-table.component';
import { ListstateComponent } from './components/State/liststate/liststate.component';
import { ListcityComponent } from './components/City/listcity/listcity.component';
import { CountryMasterComponent } from './components/Country Master/country-master/country-master.component';
import { CustomerCategoryMasterComponent } from './components/Customer Category Master/customer-category-master/customer-category-master.component';
import { ServiceCatMasterTableComponent } from './components/Service Catlog Master/service-cat-master-table/service-cat-master-table.component';
import { BackOfficeMasterTableComponent } from './components/Back Office Team Master/back-office-master-table/back-office-master-table.component';
import { AppLanguageMasterComponent } from './components/App language Master/app-language-master/app-language-master.component';
import { TechnicianMasterComponent } from './components/TechnicianMaster/technician-master/technician-master.component';
import { VendorMasterComponent } from './components/Vendor Master/vendor-master/vendor-master.component';
import { EmailServiceConfigsComponent } from './components/Email Service Config master/email-service-configs/email-service-configs.component';
import { SmsServiceConfigsComponent } from './components/SMSConfig/sms-service-configs/sms-service-configs.component';
import { WhatsappServiceConfigsComponent } from './components/WhatsAppServiceConfigMaster/whatsapp-service-configs/whatsapp-service-configs.component';
import { CustomerconfigsComponent } from './components/CustomerConfigMaster/customerconfigs/customerconfigs.component';
import { MasterMenuListComponent } from './components/Master_Menu/master-menu-list/master-menu-list.component';
import { WarehouselocationmasterComponent } from './components/WarehouseLocation/warehouselocationmaster/warehouselocationmaster.component';
import { DistrictMasterListComponent } from './components/DistrictMaster/district-master-list/district-master-list.component';
import { PaymentGatewayMasterComponent } from './components/PaymentGatewayMaster/payment-gateway-master/payment-gateway-master.component';
import { WarehouseMasterComponent } from './components/Warehouse Master/warehouse-master/warehouse-master.component';
import { MainServiceListComponent } from './components/Service_Catalogue/ServicesMasterNew/main-service-list/main-service-list.component';
import { SelpdoclistComponent } from './components/Service_Catalogue/HelpDocuments/selpdoclist/selpdoclist.component';
import { CancelOrderReasonTableComponent } from './components/Cancel Order Reason Master/cancel-order-reason-table/cancel-order-reason-table.component';
import { HSNSACMASTERlistComponent } from './components/HSN_SAC_MASTER/hsn-sac-masterlist/hsn-sac-masterlist.component';
import { BannermasterlistComponent } from './components/BannerMasterlist/bannermasterlist/bannermasterlist.component';
import { SkillStatusComponent } from './components/skill-status/skill-status.component';
import { OrderSummaryReportComponent } from './Reports/order-summary-report/order-summary-report.component';
import { CustomerServiceFeedbackReportComponent } from './Reports/customer-service-feedback-report/customer-service-feedback-report.component';
import { CustomerTechnitianFeedbackReportComponent } from './Reports/customer-technitian-feedback-report/customer-technitian-feedback-report.component';
import { RefundReportComponent } from './Reports/refund-report/refund-report.component';
import { TechnicianCardReportComponent } from './Reports/technician-card-report/technician-card-report.component';
import { VendorPerformanceReportComponent } from './Reports/vendor-performance-report/vendor-performance-report.component';
import { OrderDetailedReportComponent } from './Reports/order-detailed-report/order-detailed-report.component';
import { TechnicianCustomerFeedbackReportComponent } from './Reports/technician-customer-feedback-report/technician-customer-feedback-report.component';
import { OrderCancellationReportComponent } from './Reports/order-cancellation-report/order-cancellation-report.component';
import { TechnicianPerformanceReportComponent } from './Reports/technician-performance-report/technician-performance-report.component';
import { ServiceUtilizationReportComponent } from './Reports/service-utilization-report/service-utilization-report.component';
import { CustomerRegistrationReportComponent } from './Reports/customer-registration-report/customer-registration-report.component';
import { JobAssignmentReportComponent } from './Reports/job-assignment-report/job-assignment-report.component';
import { WhatsappMessageTransactionHistoryReportComponent } from './Reports/whatsapp-message-transaction-history-report/whatsapp-message-transaction-history-report.component';
import { SmsTransactionHistoryReportComponent } from './Reports/sms-transaction-history-report/sms-transaction-history-report.component';
import { EmailTransactionHistoryReportComponent } from './Reports/email-transaction-history-report/email-transaction-history-report.component';
import { B2bCustomerServiceSummeryReportComponent } from './Reports/b2b-customer-service-summery-report/b2b-customer-service-summery-report.component';
import { TechnicianTimeSheetReportComponent } from './Reports/technician-time-sheet-report/technician-time-sheet-report.component';
import { TableTemplateCategoryComponent } from './components/TemplateCategories/templateCategoryMaster/table-template-category/table-template-category.component';
import { ListplaceholderComponent } from './components/TemplateCategories/Template_Parameters/listplaceholder/listplaceholder.component';
import { CoupontypesComponent } from './components/Coupon/coupontypes/coupontypes.component';
import { CouponDetailedReportComponent } from './components/Coupon/CouponReports/coupon-detailed-report/coupon-detailed-report.component';
import { CouponSummaryReportsComponent } from './components/Coupon/CouponReports/coupon-summary-reports/coupon-summary-reports.component';
import { CertificateVerificationComponent } from './components/certificate-verification/certificate-verification.component';
import { HelpDocumentCategoryListComponent } from './components/HelpDocCateAndSubCat/Help Document Category Master/help-document-category-list/help-document-category-list.component';
import { HelpDocumentSubcategoryListComponent } from './components/HelpDocCateAndSubCat/Help Document Subcategory Master/help-document-subcategory-list/help-document-subcategory-list.component';
import { JobtrainingMasterComponent } from './components/Job_Training/jobtraining-master/jobtraining-master.component';
import { CustomerCouponSummaryReportComponent } from './components/Coupon/CouponReports/customer-coupon-summary-report/customer-coupon-summary-report.component';
import { CustomerCouponDetailedReportComponent } from './components/Coupon/CouponReports/customer-coupon-detailed-report/customer-coupon-detailed-report.component';
import { DashboardMasterTableComponent } from './components/DashboardMaster/dashboard-master-table/dashboard-master-table.component';
import { InventoryTransactionReportComponent } from './components/inventory-transaction-report/inventory-transaction-report.component';
import { PaymentGatewayTransactionReportComponent } from './Reports/payment-gateway-transaction-report/payment-gateway-transaction-report.component';
import { ChannellistComponent } from './components/Channels/ChannelMaster/channellist/channellist.component';
import { BrandMasterTableComponent } from './components/brandmaster/brand-master-table/brand-master-table.component';
import { CouponsComponent } from './components/Coupon/Coupons/coupons/coupons.component';
import { TechnicianCashCollectionReportComponent } from './Reports/technician-cash-collection-report/technician-cash-collection-report.component';
import { TechnicianslaReportComponent } from './Reports/techniciansla-report/techniciansla-report.component';
import { CustomerAddressLogsReportComponent } from './Reports/customer-address-logs-report/customer-address-logs-report.component';
import { UserloginlogsComponent } from './Reports/userloginlogs/userloginlogs.component';
import { APKVersionReportComponent } from './Reports/apkversion-report/apkversion-report.component';
import { CustomerwiseOrderDetailedReportComponent } from './Reports/customerwise-order-detailed-report/customerwise-order-detailed-report.component';
import { OrdercancelchargeReportComponent } from './Reports/ordercancelcharge-report/ordercancelcharge-report.component';
import { InvoiceReportsComponent } from './Reports/invoice-reports/invoice-reports.component';
const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      { path: 'organization', component: OrganizationsComponent },
      { path: 'branch', component: BranchesComponent },
      { path: 'pincode', component: PincodesComponent },
      { path: 'taxdetails', component: TaxDetailsComponent },
      { path: 'subcategory', component: SubcategoriesComponent },
      { path: 'category', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'emailtemplate', component: EmailTemplatesComponent },
      { path: 'whatsapptemplates', component: WhatsapptemplatesComponent },
      { path: 'sms', component: SmsesComponent },
      { path: 'territorymaster', component: TerritoryMasterComponent },
      { path: 'serviceItemMaster', component: ServiceItemMasterListComponent },
      { path: 'currmaster', component: CurrencyMasterListComponent },
      { path: 'skill', component: SkillTableComponent },
      { path: 'tax', component: TaxTableComponent },
      { path: 'order_status', component: OrderStatusTableComponent },
      { path: 'job_card_status', component: JobCardStatusTableComponent },
      { path: 'language', component: LanguageMasterTableComponent },
      { path: 'unit', component: UnitTableComponent },
      { path: 'state', component: ListstateComponent },
      { path: 'city', component: ListcityComponent },
      { path: 'countrymaster', component: CountryMasterComponent },
      { path: 'vendor_master', component: VendorMasterComponent },
      { path: 'appLanguagemaster', component: AppLanguageMasterComponent },
      {
        path: 'customer_category_master',
        component: CustomerCategoryMasterComponent,
      },
      { path: 'backoffice', component: BackOfficeMasterTableComponent },
      { path: 'technician_master', component: TechnicianMasterComponent },
      { path: 'emailserviceconfigs', component: EmailServiceConfigsComponent },
      {
        path: 'whatsappserviceconfigs',
        component: WhatsappServiceConfigsComponent,
      },
      { path: 'servicecatlog', component: ServiceCatMasterTableComponent },
      { path: 'smsserviceconfigs', component: SmsServiceConfigsComponent },
      { path: 'customerconfigs', component: CustomerconfigsComponent },
      { path: 'paymentgateway', component: PaymentGatewayMasterComponent },
      { path: 'menu', component: MasterMenuListComponent },
      { path: 'warehouse-master', component: WarehouseMasterComponent },
      {
        path: 'warehouse_location',
        component: WarehouselocationmasterComponent,
      },
      { path: 'service-master', component: MainServiceListComponent },
      { path: 'district-master', component: DistrictMasterListComponent },
      { path: 'tax', component: TaxTableComponent },
      { path: 'help-documents', component: SelpdoclistComponent },
      {
        path: 'cancel-order-reason',
        component: CancelOrderReasonTableComponent,
      },
      { path: 'hsn-master', component: HSNSACMASTERlistComponent },
      { path: 'banner-master', component: BannermasterlistComponent },
      { path: 'skill-verification-requests', component: SkillStatusComponent },
      { path: 'order-summary-report', component: OrderSummaryReportComponent },
      {
        path: 'customer-service-feedback-report',
        component: CustomerServiceFeedbackReportComponent,
      },
      {
        path: 'customer-technician-feedback-report',
        component: CustomerTechnitianFeedbackReportComponent,
      },
      { path: 'refund-report', component: RefundReportComponent },
      {
        path: 'technician-wise-job-card-report',
        component: TechnicianCardReportComponent,
      },
      {
        path: 'vendor-performance-report',
        component: VendorPerformanceReportComponent,
      },
      {
        path: 'order-detailed-report',
        component: OrderDetailedReportComponent,
      },
      {
        path: 'technician-customer-feedback-report',
        component: TechnicianCustomerFeedbackReportComponent,
      },
      {
        path: 'order-cancellation-report',
        component: OrderCancellationReportComponent,
      },
      {
        path: 'technician-performance-report',
        component: TechnicianPerformanceReportComponent,
      },
      {
        path: 'service-utilization-report',
        component: ServiceUtilizationReportComponent,
      },
      {
        path: 'customer-registration-report',
        component: CustomerRegistrationReportComponent,
      },
      {
        path: 'job-assignment-report',
        component: JobAssignmentReportComponent,
      },
      {
        path: 'whatsapp-transaction-history-report',
        component: WhatsappMessageTransactionHistoryReportComponent,
      },
      {
        path: 'sms-transaction-history-report',
        component: SmsTransactionHistoryReportComponent,
      },
      {
        path: 'email-transaction-history-report',
        component: EmailTransactionHistoryReportComponent,
      },
      {
        path: 'b2b-customer-service-summary-report',
        component: B2bCustomerServiceSummeryReportComponent,
      },
      {
        path: 'technician-time-sheet-report',
        component: TechnicianTimeSheetReportComponent,
      },
      {
        path: 'help-document-category-master',
        component: HelpDocumentCategoryListComponent,
      },
      {
        path: 'help-document-subcategory-master',
        component: HelpDocumentSubcategoryListComponent,
      },
      { path: 'coupon-master', component: CouponsComponent },
      { path: 'coupon-type-master', component: CoupontypesComponent },
      {
        path: 'certificate-verification-requests',
        component: CertificateVerificationComponent,
      },
      { path: 'job-training-master', component: JobtrainingMasterComponent },
      {
        path: 'coupon-detailed-report',
        component: CouponDetailedReportComponent,
      },
      {
        path: 'customer-coupon-detailed-report',
        component: CustomerCouponDetailedReportComponent,
      },
      {
        path: 'customer-coupon-summary-report',
        component: CustomerCouponSummaryReportComponent,
      },
      { path: 'brand-master', component: BrandMasterTableComponent },
      {
        path: 'coupon-summary-report',
        component: CouponSummaryReportsComponent,
      },
      {
        path: 'template-category-master',
        component: TableTemplateCategoryComponent,
      },
      {
        path: 'template-parameter-master',
        component: ListplaceholderComponent,
      },
      { path: 'dashboard-master', component: DashboardMasterTableComponent },
      {
        path: 'inventory-transaction-report',
        component: InventoryTransactionReportComponent,
      },
      {
        path: 'payment-gateway-transaction-report',
        component: PaymentGatewayTransactionReportComponent,
      },
      { path: 'channel-list', component: ChannellistComponent },
      {
        path: 'technician-cash-collecction-report',
        component: TechnicianCashCollectionReportComponent,
      },
      {
        path: 'technician-pending-job-report',
        component: TechnicianslaReportComponent,
      },
      {
        path: 'customer-address-log-report',
        component: CustomerAddressLogsReportComponent,
      },
      {
        path: 'user-login-logs-report',
        component: UserloginlogsComponent,
      },
      {
        path: 'apk-version-history-report',
        component: APKVersionReportComponent,
      },
      {
        path: 'customer-wise-order-details-report',
        component: CustomerwiseOrderDetailedReportComponent,
      },
      {
        path: 'order-cancellation-charges-report',
        component: OrdercancelchargeReportComponent,
      },
      {
        path: 'invoice-reports',
        component: InvoiceReportsComponent,
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule { }
