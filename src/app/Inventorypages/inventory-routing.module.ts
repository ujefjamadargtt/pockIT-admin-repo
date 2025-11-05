import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventorymastermoduleComponent } from './inventorymastermodule/inventorymastermodule.component';

import { InventorysubcategorymasterComponent } from './pages/InventorySubCategory/inventorysubcategorymaster/inventorysubcategorymaster.component';
import { InventoryCategoryMasterComponent } from './pages/Inventory Category Master/inventory-category-master/inventory-category-master.component';

import { InventorymasterComponent } from './pages/inventorymaster/inventorymaster.component';
// import { InventoryInwardListComponent } from './pages/Inventory_Inward/inventory-inward-list/inventory-inward-list.component';
import { ListStockMovementRequestMasterComponent } from './pages/Stock_Movement_RequestMaster/list-stock-movement-request-master/list-stock-movement-request-master.component';
import { CheckItemRequestComponent } from './pages/CheckItemRequest/check-item-request/check-item-request.component';
import { InventoryInwardListComponent } from './pages/Inventory_Inward/inventory-inward-list/inventory-inward-list.component';
import { InventoryStockAdjestmentComponent } from './pages/InventoryStockAdjestment/inventory-stock-adjestment/inventory-stock-adjestment.component';
import { TechnicianMovementListComponent } from './pages/Technician_Movement_Master/technician-movement-list/technician-movement-list.component';
import { StockManagementReportsComponent } from './pages/Inventory_Reports/stock-management-reports/stock-management-reports.component';
import { TechnicianWiseStockDetailsComponent } from './pages/Inventory_Reports/technician-wise-stock-details/technician-wise-stock-details.component';
import { TechnicianPartRequestDetailsReportComponent } from './pages/Inventory_Reports/technician-part-request-details-report/technician-part-request-details-report.component';
import { StockAdjustmentReportComponent } from './pages/Inventory_Reports/stock-adjustment-report/stock-adjustment-report.component';
import { WarehouseToTechnicianStockMovementReportComponent } from './pages/Inventory_Reports/warehouse-to-technician-stock-movement-report/warehouse-to-technician-stock-movement-report.component';
import { WarehouseToWarehouseStockMovementReportComponent } from './pages/Inventory_Reports/warehouse-to-warehouse-stock-movement-report/warehouse-to-warehouse-stock-movement-report.component';
import { StocksByUnitReportComponent } from './pages/Inventory_Reports/stocks-by-unit-report/stocks-by-unit-report.component';
import { CustomertoTechStockMoveListComponent } from './pages/CustomerToTechnician/customerto-tech-stock-move-list/customerto-tech-stock-move-list.component';

const routes: Routes = [
  {
    path: '',
    component: InventorymastermoduleComponent,
    children: [
      { path: 'inventory_master', component: InventorymasterComponent },
      {
        path: 'inventory_sub_category',
        component: InventorysubcategorymasterComponent,
      },
      // { path: "InventoryCategoryMaster"  },
      {
        path: 'InventoryCategoryMaster',
        component: InventoryCategoryMasterComponent,
      },
      { path: 'inventory-inward', component: InventoryInwardListComponent },

      {
        path: 'stock-movement-requests',
        component: ListStockMovementRequestMasterComponent,
      },
      {
        path: 'check-item-request', component: CheckItemRequestComponent,
      },
      { path: 'inventory-stock-adjustment', component: InventoryStockAdjestmentComponent },



      // new
      { path: 'technician-wise-stock-movement', component: TechnicianMovementListComponent },
      { path: 'warehouse-wise-item-stock-details', component: StockManagementReportsComponent },
      { path: 'technician-wise-item-stock-details', component: TechnicianWiseStockDetailsComponent },
      { path: 'job-wise-part-request-details', component: TechnicianPartRequestDetailsReportComponent },
      { path: 'item-stock-adjustment-report', component: StockAdjustmentReportComponent },
      { path: 'warehouse-to-technician-stock-movement', component: WarehouseToTechnicianStockMovementReportComponent },
      { path: 'warehouse-to-warehouse-stock-movement', component: WarehouseToWarehouseStockMovementReportComponent },
      { path: 'unit-wise-item-stock-details', component: StocksByUnitReportComponent },

      {
        path: 'customer-to-technician-stock-transfer',
        component: CustomertoTechStockMoveListComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule { }
