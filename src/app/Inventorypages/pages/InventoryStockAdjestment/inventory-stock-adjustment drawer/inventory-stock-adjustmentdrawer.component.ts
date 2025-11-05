import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-inventory-stock-adjustmentdrawer',
  templateUrl: './inventory-stock-adjustment drawer.component.html',
  styleUrls: ['./inventory-stock-adjustmentdrawer.css'],
})
export class InventoryStockAdjestmentDrawerComponent
  implements OnInit, OnDestroy {
  @Input() drawerClose: any = Function;
  @Input() drawerData: any;
  @Input() Loadwarehouse: any;
  @Input() WAREHOUSE_ID: any;
  formTitle: string = 'Inventory Stock Adjustment';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any = [];
  loadingRecords: boolean = true;
  sortValue: string = 'desc';
  sortKey: string = 'ITEM_ID';
  searchText: string = '';
  filterQuery: string = '';
  columns: string[][] = [
    ['ITEM_ID', 'ITEM_ID'],
    ['CURRENT_STOCK', 'CURRENT_STOCK'],
    ['WARANTEE_IN_DAYS', 'WARANTEE_IN_DAYS'],
    ['EXPIRY_DATE', 'EXPIRY_DATE'],
  ];
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  roleid = sessionStorage.getItem('roleId');
  roleID: number;
  commonFunction = new CommonFunctionService();
  backofficeId = sessionStorage.getItem('backofficeId');
  BACKOFFICE_ID: number;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);

    const decryptedUserId1 = this.roleid
      ? this.commonFunction.decryptdata(this.roleid)
      : '0';

    this.roleID = Number(decryptedUserId1);
    const decryptedbackofficeId = this.backofficeId
      ? this.commonFunction.decryptdata(this.backofficeId)
      : '0';
    this.BACKOFFICE_ID = Number(decryptedbackofficeId);
    this.getWarehouses();
  }

  ngOnDestroy() { }
  deleteCancel() { }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ITEM_ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search(false);
  }
  setWareHouse(event) {
    this.WAREHOUSE_ID = event;
    this.search(true);
  }
  Warehousename: any;
  search(reset: boolean = false): void {
    // if (this.WAREHOUSE_ID !== null) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }

    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ITEM_ID';
      this.sortValue = 'desc';
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    this.loadingRecords = true;

    let warehouseFilter = '';

    if (this.WAREHOUSE_ID && this.WAREHOUSE_ID > 0) {
      warehouseFilter = ' AND WAREHOUSE_ID =' + this.WAREHOUSE_ID.toString();
    }

    this.Warehousename =
      this.Loadwarehouse.find((filter) => filter.ID === this.WAREHOUSE_ID)
        ?.NAME || '';

    this.api
      .getInventoryWarehouseStockManagement(
        0,
        0,
        this.sortKey,
        sort,
        ' AND (PARENT_ID = ' +
        this.drawerData.ID +
        ' OR ITEM_ID = ' +
        this.drawerData.ID +
        ')' +
        likeQuery +
        warehouseFilter
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body['count'];
            this.dataList = response.body['data'];

            this.dataList?.forEach((item: any) => {
              item['QUANTITY'] = 0;
              item['REASON'] = null;
              return item;
            });
          } else {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Failed to get Inventory Records', '');
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.dataList = [];
          this.message.error('Failed To Get Inventory Records', '');
        }
      );
    // }
  }

  INVENTORY_CATEGORY_NAME: any = null;
  INVENTRY_SUB_CATEGORY_NAME: any = null;
  INVENTORY_CATEGORY_ID: any = null;
  INVENTRY_SUB_CATEGORY_ID: any;
  INVENTRY_SUB_CATEGORY_SELECTED_ID: any = null;
  splitddata: any = null;

  // WAREHOUSE_ID: any = 0;
  isFocused: any;

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;

    // Check if the key is a number (48 to 57) or the minus sign (charCode 45)
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
      return false;
    }

    // Allow minus sign only at the beginning and only once
    if (charCode === 45 && inputValue.indexOf('-') !== -1) {
      return false;
    }

    // Allow minus sign only at the beginning
    if (charCode === 45 && inputValue.length > 0) {
      return inputValue.charAt(0) === '-' ? true : false;
    }

    return true;
  }

  updateOneRow(data: any): void {
    let isOK = true;

    if (data['QUANTITY'] == 0) {
      isOK = false;
      this.message.warning(
        'Please Enter  Quantity for ' +
        data['ITEM_NAME'] +
        (data['VARIANT_COMBINATION']
          ? ' (' + data['VARIANT_COMBINATION'] + ')'
          : ''),
        ''
      );
    } else if (Number(data['QUANTITY']) > Number(data['CURRENT_STOCK'])) {
      isOK = false;
      this.message.warning(
        'Please Enter Valid Quantity (Not More than Current Stock) for ' +
        data['ITEM_NAME'] +
        (data['VARIANT_COMBINATION']
          ? ' (' + data['VARIANT_COMBINATION'] + ')'
          : ''),
        ''
      );
    } else if (
      data['REASON'] == null ||
      data['REASON'] == undefined ||
      data['REASON'] == ''
    ) {
      isOK = false;
      this.message.warning(
        'Please Enter Adjustment Reason for ' +
        data['ITEM_NAME'] +
        (data['VARIANT_COMBINATION']
          ? ' (' + data['VARIANT_COMBINATION'] + ')'
          : ''),
        ''
      );
    }

    if (isOK) {
      let adjestmentObj = this.getAdjestmentObject(data);
      // adjestmentObj['QUANTITY'] = adjestmentObj['QUANTITY'] * -1;
      let finalData = new Object();
      finalData['ADJUSTMENT_ARRAY'] = [adjestmentObj];
      this.loadingRecords = true;

      this.api.inventoryAdjestment(finalData).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.loadingRecords = false;
            this.message.success('Inventory Stock Adjusted Successfully', '');
            this.search(false);
          } else {
            this.loadingRecords = false;
            this.message.error('Failed to Update Inventory Stock', '');
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
    }
  }

  getAdjestmentObject(data: any): any {
    let adjestmentObj = new Object();
    adjestmentObj['ITEM_ID'] = data['ITEM_ID'];
    adjestmentObj['ITEM_NAME'] = data['ITEM_NAME'];
    adjestmentObj['OLD_QTY'] = data['CURRENT_STOCK'];

    if (Number(data['QUANTITY']) > 0) {
      adjestmentObj['ADJUSTMENT_QUANTITY'] = Number(data['QUANTITY']);
    } else {
      adjestmentObj['ADJUSTMENT_QUANTITY'] = Number(data['QUANTITY']) * -1;
    }

    adjestmentObj['NEW_QTY'] = 0;
    // adjestmentObj['ADJUSTMENT_TYPE'] = Number(data['QUANTITY']) > 0 ? 'P' : 'M';
    adjestmentObj['ADJUSTMENT_TYPE'] = 'M';
    adjestmentObj['WAREHOUSE_ID'] = this.WAREHOUSE_ID;
    adjestmentObj['WAREHOUSE_NAME'] = this.Warehousename;
    adjestmentObj['IS_VARIANT'] = data['IS_VARIANT'];
    adjestmentObj['PARENT_ID'] = this.drawerData.ID;
    adjestmentObj['VARIANT_ID'] = data['ITEM_ID'];
    adjestmentObj['VARIANT_NAME'] = data['VARIANT_COMBINATION'];
    adjestmentObj['QUANTITY_PER_UNIT'] = data['QUANTITY_PER_UNIT'];
    adjestmentObj['UNIT_ID'] = data['ACTUAL_UNIT_ID'];
    adjestmentObj['UNIT_NAME'] = data['ACTUAL_UNIT_NAME'];
    adjestmentObj['REMARK'] = data['REASON'];
    adjestmentObj['INVENTORY_TRACKING_TYPE'] = data['INVENTORY_TRACKING_TYPE'];
    adjestmentObj['UNIQUE_NO'] = data['UNIQUE_NO'];
    adjestmentObj['IS_VERIENT'] = data['IS_VERIENT'];

    return adjestmentObj;
  }

  updateAll(): void {
    let isOK = true;
    let tempAdjestmentObjArray: any[] = [];

    outerLoop: for (let i = 0; i < this.dataList.length; i++) {
      const element = this.dataList[i];

      if (element['QUANTITY'] > 0 || element['QUANTITY'] < 0) {
        if (
          Number(element['QUANTITY']) + Number(element['CURRENT_STOCK']) <
          0
        ) {
          isOK = false;
          this.message.warning(
            'Please Enter Valid Quantity (Not less than Current Stock) for ' +
            element['ITEM_NAME'] +
            (element['VARIANT_COMBINATION']
              ? ' (' + element['VARIANT_COMBINATION'] + ')'
              : ''),
            ''
          );
          break outerLoop;
        } else if (
          element['REASON'] == null ||
          element['REASON'] == undefined ||
          element['REASON'] == ''
        ) {
          isOK = false;
          this.message.warning(
            'Please Enter Adjustment Reason for ' +
            element['ITEM_NAME'] +
            (element['VARIANT_COMBINATION']
              ? ' (' + element['VARIANT_COMBINATION'] + ')'
              : ''),
            ''
          );
          break outerLoop;
        }

        tempAdjestmentObjArray.push(this.getAdjestmentObject(element));
      }
    }

    if (isOK && tempAdjestmentObjArray.length === 0) {
      isOK = false;
      this.message.warning(
        'Please Enter valid quantity and adjustment reason for at least one item',
        ''
      );
    }

    if (isOK) {
      let finalData = new Object();
      finalData['ADJUSTMENT_ARRAY'] = tempAdjestmentObjArray;
      this.loadingRecords = true;

      this.api.inventoryAdjestment(finalData).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.loadingRecords = false;
            this.message.success('Inventory Stock Adjusted Successfully', '');
            this.search(false);
          } else {
            this.loadingRecords = false;
            this.message.error('Failed to Update Inventory Stock', '');
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
    }
  }

  inventoryAdjestmentHistoryDrawerVisible: boolean = false;
  inventoryAdjestmentHistoryDrawerTitle: string = '';
  inventoryAdjestmentHistoryDrawerData: any[] = [];

  inventoryAdjestmentHistoryDrawerOpen(data: any): void {
    this.inventoryAdjestmentHistoryDrawerTitle =
      data['ITEM_NAME'] +
      ' ' +
      (data['VARIANT_COMBINATION']
        ? ' (' + data['VARIANT_COMBINATION'] + ')'
        : '');
    this.inventoryAdjestmentHistoryDrawerData = data;
    this.inventoryAdjestmentHistoryDrawerVisible = true;
  }

  inventoryAdjestmentHistoryDrawerClose(): void {
    this.inventoryAdjestmentHistoryDrawerVisible = false;
    this.search(false);
  }

  get inventoryAdjestmentHistoryDrawerCloseCallback() {
    return this.inventoryAdjestmentHistoryDrawerClose.bind(this);
  }

  // Loadwarehouse: any;
  iswarehouseLoading: any;

  getWarehouses(): void {
    this.Loadwarehouse = [];
    var userMainId = '';

    if (
      this.BACKOFFICE_ID != null &&
      this.BACKOFFICE_ID != undefined &&
      this.BACKOFFICE_ID != 0
    ) {
      this.iswarehouseLoading = true;

      this.api
        .getWarehouses(
          0,
          0,
          'ID',
          'desc',
          ' AND STATUS = 1 AND WAREHOUSE_MANAGER_ID = ' + this.BACKOFFICE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.iswarehouseLoading = false;
              this.Loadwarehouse = data['data'];
              this.WAREHOUSE_ID = data['data'][0].ID;
              this.search(true);
            } else {
              this.iswarehouseLoading = false;
              this.Loadwarehouse = [];
            }
          },
          (err) => {
            this.iswarehouseLoading = false;
            this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.iswarehouseLoading = false;
            this.Loadwarehouse = data['data'];

            this.WAREHOUSE_ID = data['data'][0].ID;
          } else {
            this.iswarehouseLoading = false;
            this.Loadwarehouse = [];
          }
        },
        (err) => {
          this.iswarehouseLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
      this.search(true);
    }
  }
}