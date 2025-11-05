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
import { NzNotificationModule } from 'ng-zorro-antd/notification';
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
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventorymastermoduleComponent } from './inventorymastermodule/inventorymastermodule.component';
import { InventorysubcategorymasterComponent } from './pages/InventorySubCategory/inventorysubcategorymaster/inventorysubcategorymaster.component';
import { InventorysubcategorymasterformComponent } from './pages/InventorySubCategory/inventorysubcategorymasterform/inventorysubcategorymasterform.component';
import { InventoryCategoryMasterDrawerComponent } from './pages/Inventory Category Master/inventory-category-master-drawer/inventory-category-master-drawer.component';
import { InventoryCategoryMasterComponent } from './pages/Inventory Category Master/inventory-category-master/inventory-category-master.component';
import { InventorymasterComponent } from './pages/inventorymaster/inventorymaster.component';
import { InventorymasterformComponent } from './pages/inventorymasterform/inventorymasterform.component';
import { SharedModule } from '../shared/shared.module';
import { AddVarientDrawerComponent } from './pages/add-varient-drawer/add-varient-drawer.component';
import { ItemMappingComponent } from './pages/item-mapping/item-mapping.component';
// import { InventoryInwardListComponent } from './pages/Inventory_Inward/inventory-inward-list/inventory-inward-list.component';
// import { InventoryInwardFormComponent } from './pages/Inventory_Inward/inventory-inward-form/inventory-inward-form.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddStockMovementRequestMasterComponent } from './pages/Stock_Movement_RequestMaster/add-stock-movement-request-master/add-stock-movement-request-master.component';
import { ListStockMovementRequestMasterComponent } from './pages/Stock_Movement_RequestMaster/list-stock-movement-request-master/list-stock-movement-request-master.component';
import { CheckItemRequestComponent } from './pages/CheckItemRequest/check-item-request/check-item-request.component';
import { CheckItemComponent } from './pages/CheckItemRequest/check-item/check-item.component';
import { AddInventoryImagesComponent } from './pages/add-inventory-images/add-inventory-images.component';
// import { InventoryInwardDetailsComponent } from './pages/Inventory_Inward/inventory-inward-details/inventory-inward-details.component';
import { InventoryAdjestmentHistoryComponent } from './pages/InventoryStockAdjestment/inventory-adjestment-history/inventory-adjestment-history.component';
import { InventoryStockAdjestmentComponent } from './pages/InventoryStockAdjestment/inventory-stock-adjestment/inventory-stock-adjestment.component';
import { InventoryInwardListComponent } from './pages/Inventory_Inward/inventory-inward-list/inventory-inward-list.component';
import { InventoryInwardFormComponent } from './pages/Inventory_Inward/inventory-inward-form/inventory-inward-form.component';
import { InventoryInwardDetailsComponent } from './pages/Inventory_Inward/inventory-inward-details/inventory-inward-details.component';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { InventoryStockAdjestmentDrawerComponent } from './pages/InventoryStockAdjestment/inventory-stock-adjustment drawer/inventory-stock-adjustmentdrawer.component';
import { TechnicianMovementAddComponent } from './pages/Technician_Movement_Master/technician-movement-add/technician-movement-add.component';
import { TechnicianMovementListComponent } from './pages/Technician_Movement_Master/technician-movement-list/technician-movement-list.component';
import { StockManagementReportsComponent } from './pages/Inventory_Reports/stock-management-reports/stock-management-reports.component';
import { TechnicianWiseStockDetailsComponent } from './pages/Inventory_Reports/technician-wise-stock-details/technician-wise-stock-details.component';
import { TechnicianPartRequestDetailsReportComponent } from './pages/Inventory_Reports/technician-part-request-details-report/technician-part-request-details-report.component';
import { StockAdjustmentReportComponent } from './pages/Inventory_Reports/stock-adjustment-report/stock-adjustment-report.component';
import { ViewVarientComponent } from './pages/view-varient/view-varient.component';
import { ViewItemchageLogsComponent } from './pages/view-itemchage-logs/view-itemchage-logs.component';
import { WarehouseToTechnicianStockMovementReportComponent } from './pages/Inventory_Reports/warehouse-to-technician-stock-movement-report/warehouse-to-technician-stock-movement-report.component';
import { WarehouseToWarehouseStockMovementReportComponent } from './pages/Inventory_Reports/warehouse-to-warehouse-stock-movement-report/warehouse-to-warehouse-stock-movement-report.component';
import { ViewVarientStockComponent } from './pages/view-varientstock/view-varientstock.component';
import { StocksByUnitReportComponent } from './pages/Inventory_Reports/stocks-by-unit-report/stocks-by-unit-report.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CustomertoTechStockMoveListComponent } from './pages/CustomerToTechnician/customerto-tech-stock-move-list/customerto-tech-stock-move-list.component';
import { CustomertoTechStockMoveDrawerComponent } from './pages/CustomerToTechnician/customerto-tech-stock-move-drawer/customerto-tech-stock-move-drawer.component';
@NgModule({
  declarations: [
    InventorymastermoduleComponent,
    InventorymasterComponent,
    InventorysubcategorymasterComponent,
    InventorysubcategorymasterformComponent,
    InventorysubcategorymasterComponent,
    InventorysubcategorymasterformComponent,
    InventorymasterformComponent,
    InventoryCategoryMasterComponent,
    InventoryCategoryMasterDrawerComponent,
    AddVarientDrawerComponent,
    ItemMappingComponent,
    InventoryInwardListComponent,
    InventoryInwardFormComponent,
    AddStockMovementRequestMasterComponent,
    ListStockMovementRequestMasterComponent,
    CheckItemRequestComponent,
    CheckItemComponent,
    AddInventoryImagesComponent,
    InventoryInwardDetailsComponent,
    InventoryStockAdjestmentComponent,
    InventoryStockAdjestmentDrawerComponent,
    InventoryAdjestmentHistoryComponent,
    TechnicianMovementAddComponent,
    TechnicianMovementListComponent,
    StockManagementReportsComponent,
    TechnicianWiseStockDetailsComponent,
    TechnicianPartRequestDetailsReportComponent,
    StockAdjustmentReportComponent,
    ViewVarientComponent,
    ViewItemchageLogsComponent,
    WarehouseToTechnicianStockMovementReportComponent,
    WarehouseToWarehouseStockMovementReportComponent,
    ViewVarientStockComponent,
    StocksByUnitReportComponent,
    CustomertoTechStockMoveListComponent,
    CustomertoTechStockMoveDrawerComponent
  ],

  imports: [
    // PickerComponent,
    CommonModule,
    InventoryRoutingModule,
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
    SharedModule,
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
    ImageCropperModule,
    NzRateModule,
    AngularEditorModule
  ],
})
export class InventoryModule { }
