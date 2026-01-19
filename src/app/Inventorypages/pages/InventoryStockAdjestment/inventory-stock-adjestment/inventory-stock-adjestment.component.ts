import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-inventory-stock-adjestment',
  templateUrl: './inventory-stock-adjestment.component.html',
  styleUrls: ['./inventory-stock-adjestment.component.css'],
})
export class InventoryStockAdjestmentComponent implements OnInit, OnDestroy {
  formTitle: string = 'Inventory Stock Adjustment';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any = [];
  loadingRecords: boolean = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
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
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router
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
    this.getGodownMaster();
    this.getInventoryCategory();
  }
  ngOnDestroy() { }
  getNamesCatAndSub(selectedKey: any): void {
    if (selectedKey != null && selectedKey != undefined && selectedKey !== '') {
      let parentCategoryName = null;
      let subCategoryName = null;
      let CategoryNameId = null;
      this.InventoryCategoryList.forEach((category: any) => {
        if (category.children) {
          const subCategory = category.children.find(
            (child: any) => child.key === selectedKey
          );
          if (subCategory) {
            parentCategoryName = category.title;
            subCategoryName = subCategory.title;
            CategoryNameId = category.key;
            this.INVENTORY_CATEGORY_NAME = parentCategoryName;
            this.INVENTRY_SUB_CATEGORY_NAME = subCategoryName;
            this.INVENTORY_CATEGORY_ID = CategoryNameId;
            this.splitddata = subCategory.key.split('-')[1];
            this.INVENTRY_SUB_CATEGORY_SELECTED_ID = this.splitddata;
          }
        }
      });
    } else {
      this.INVENTORY_CATEGORY_NAME = null;
      this.INVENTRY_SUB_CATEGORY_NAME = null;
      this.INVENTORY_CATEGORY_ID = null;
      this.INVENTRY_SUB_CATEGORY_SELECTED_ID = null;
    }
  }
  applyFilter() {
    this.search(true);
  }
  back(): void {
    this.router.navigate(['/masters/menu']);
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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
  search(reset: boolean = false): void {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    let warehouseFilter = '';
    if (this.WAREHOUSE_ID && this.WAREHOUSE_ID > 0) {
      warehouseFilter = ' AND WAREHOUSE_ID = ' + this.WAREHOUSE_ID;
    }
    let subCategoryFilter = '';
    if (this.INVENTRY_SUB_CATEGORY_SELECTED_ID) {
      warehouseFilter =
        +' AND INVENTRY_SUB_CATEGORY_ID = ' +
        this.INVENTRY_SUB_CATEGORY_SELECTED_ID;
    }
    this.loadingRecords = true;
    this.api
      .getInventoryWarehouseStockManagement(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + warehouseFilter + subCategoryFilter
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body['count'];
            this.dataList = response.body['data'];
            this.dataList.forEach((item: any) => {
              item['QUANTITY'] = 0;
              item['REASON'] = null;
              return item;
            });
          } else if (response.status === 400) {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Failed to get Inventory Records', '');
          }
        },
        (err) => {
          if (err['status'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Failed To Get Inventory Records', '');
          }
        }
      );
  }
  LoadGodown: any[] = [];
  isGodownLoading: boolean = false;
  getGodownMaster(): void {
    this.LoadGodown = [];
    var userMainId = '';
    if (
      this.USER_ID != null &&
      this.USER_ID != undefined &&
      this.USER_ID != 0
    ) {
      userMainId = ' AND USER_ID = ' + this.USER_ID;
    } else {
      userMainId = '';
    }
    if (this.roleID == 1 || this.roleID == 8) {
      this.isGodownLoading = true;
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isGodownLoading = false;
            this.LoadGodown = data['data'];
            this.search(true);
          } else {
            this.isGodownLoading = false;
            this.LoadGodown = [];
          }
        },
        (err) => {
          this.LoadGodown = [];
          this.isGodownLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
    } else {
      this.api
        .getBackOfficeData(0, 0, '', 'desc', ' AND IS_ACTIVE = 1' + userMainId)
        .subscribe(
          (datat) => {
            if (datat['code'] == 200) {
              if (datat['count'] > 0) {
                this.isGodownLoading = true;
                this.api
                  .getWarehouses(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND STATUS = 1 AND WAREHOUSE_MANAGER_ID = ' +
                    datat['data'][0]['ID']
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.isGodownLoading = false;
                        this.LoadGodown = data['data'];
                        this.WAREHOUSE_ID = this.LoadGodown[0].ID;
                        this.search(true);
                      } else {
                        this.isGodownLoading = false;
                        this.LoadGodown = [];
                      }
                    },
                    (err) => {
                      this.isGodownLoading = false;
                      this.message.error('Server Not Found', '');
                    }
                  );
              } else {
                this.isGodownLoading = false;
                this.LoadGodown = [];
              }
            } else {
              this.isGodownLoading = false;
              this.LoadGodown = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.isGodownLoading = false;
            this.LoadGodown = [];
          }
        );
    }
  }
  InventoryCategoryList: any = [];
  getInventoryCategory(): void {
    this.api.getcategoryhierarchyInventory().subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.InventoryCategoryList = data['data'][0]['categories'];
        } else {
          this.InventoryCategoryList = [];
        }
      },
      () => {
        this.InventoryCategoryList = [];
      }
    );
  }
  INVENTORY_CATEGORY_NAME: any = null;
  INVENTRY_SUB_CATEGORY_NAME: any = null;
  INVENTORY_CATEGORY_ID: any = null;
  INVENTRY_SUB_CATEGORY_ID: any;
  INVENTRY_SUB_CATEGORY_SELECTED_ID: any = null;
  splitddata: any = null;
  WAREHOUSE_ID: any = 0;
  isFocused: any;
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
      return false;
    }
    if (charCode === 45 && inputValue.indexOf('-') !== -1) {
      return false;
    }
    if (charCode === 45 && inputValue.length > 0) {
      return inputValue.charAt(0) === '-' ? true : false;
    }
    return true;
  }
  addQuantity(index: number): void {
    this.dataList[index]['QUANTITY'] =
      Number(this.dataList[index]['QUANTITY']) + 1;
  }
  minusQuantity(index: number): void {
    this.dataList[index]['QUANTITY'] =
      Number(this.dataList[index]['QUANTITY']) - 1;
  }
  updateOneRow(data: any): void {
    let isOK = true;
    if (data['QUANTITY'] == 0) {
      isOK = false;
      this.message.warning(
        'Please Enter Valid Quantity (Greater than 0 or Less than 0) for ' +
        data['ITEM_NAME'] +
        (data['VARIANT_COMBINATION']
          ? ' (' + data['VARIANT_COMBINATION'] + ')'
          : ''),
        ''
      );
    }
    if (Number(data['QUANTITY']) + Number(data['CURRENT_STOCK']) < 0) {
      isOK = false;
      this.message.warning(
        'Please Enter Valid Quantity (Not less than Current Stock) for ' +
        data['ITEM_NAME'] +
        (data['VARIANT_COMBINATION']
          ? ' (' + data['VARIANT_COMBINATION'] + ')'
          : ''),
        ''
      );
    }
    if (
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
    adjestmentObj['ADJUSTMENT_TYPE'] = Number(data['QUANTITY']) > 0 ? 'P' : 'M';
    adjestmentObj['WAREHOUSE_ID'] = data['WAREHOUSE_ID'];
    adjestmentObj['WAREHOUSE_NAME'] = data['WAREHOUSE_NAME'];
    adjestmentObj['IS_VARIANT'] = data['IS_VARIANT'];
    adjestmentObj['VARIANT_ID'] = data['ITEM_ID'];
    adjestmentObj['VARIANT_NAME'] = data['VARIANT_COMBINATION'];
    adjestmentObj['QUANTITY_PER_UNIT'] = data['QUANTITY_PER_UNIT'];
    adjestmentObj['UNIT_ID'] = data['UNIT_ID'];
    adjestmentObj['UNIT_NAME'] = data['UNIT_NAME'];
    adjestmentObj['REMARK'] = data['REASON'];
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
        }
        if (
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
      'Adjust Details of ' + data['ITEM_NAME'];
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
}
