import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import {
  InnerStockMovementRequest,
  StockMovementRequest,
} from 'src/app/Inventorypages/inventorymodal/stockMovementRequestData';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-stock-movement-request-master',
  templateUrl: './list-stock-movement-request-master.component.html',
  styleUrls: ['./list-stock-movement-request-master.component.css'],
})
export class ListStockMovementRequestMasterComponent {
  formTitle: string = 'Manage Warehouse Wise Stock Transfer';
  drawerVisible!: boolean;
  drawerTitle!: string;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  dataList: any[] = [];
  isSpinning: boolean = false;
  Godown1: any;
  Godown2: any;
  screenwidth = 0;
  fromDate
  toDate
  selectedWarehouses: any = [];
  warehouseList: any = [];
  loadWarehouse = false;
  selectedDestinationWarehouses: any = [];
  warehouseList2: any = [];
  loadWarehouse2 = false;
  columns: string[][] = [
    ['DATE'],
    ['SOURCE_WAREHOUSE_NAME'],
    ['DESTINATION_WAREHOUSE_NAME'],
    ['USER_NAME'],
  ];
  public commonFunction = new CommonFunctionService();
  disabledDate1 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.startValue)) < 0;
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.endValue) > 0;
  drawerData: StockMovementRequest = new StockMovementRequest();
  current: number = 1;
  rejectRemarkExpand: boolean[] = [];
  godownID: number;
  roleID: any = sessionStorage.getItem('roleId');
  useriddd: any = sessionStorage.getItem('userId');
  showRejectionRemarkModal: boolean = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService,
    private router: Router
  ) { }
  ngOnInit(): void {
    const decryptedUserId = this.useriddd
      ? this.commonFunction.decryptdata(this.useriddd)
      : '0'; 
    this.useriddd = Number(decryptedUserId);
    const decryptedUserId1 = this.roleID
      ? this.commonFunction.decryptdata(this.roleID)
      : '0'; 
    this.roleID = Number(decryptedUserId1);
    this.GodownMaster();
    this.screenwidth = window.innerWidth;
    this.currentDate = new Date();
    if (this.currentDate) {
      this.currentDate = new Date(this.currentDate);
    } else {
      this.currentDate = new Date();
    }
    this.startValue = new Date(
      this.currentDate.getFullYear() +
      '-' +
      (this.currentDate.getMonth() + 1) +
      '-01'
    );
    this.endValue = new Date();
    this.fromDate = this.currentDate.getFullYear() +
      '-' +
      (this.currentDate.getMonth() + 1) +
      '-01'
    this.toDate = new Date()
  }
  onWarehousechange(data: any) {
    this.warehouseList2 = this.warehouseList.filter(
      (filterdData) => !data.includes(filterdData.ID)
    );
  }
  onWarehousechange2(data: any) {
    if (data.length <= 0) {
      this.selectedDestinationWarehouses = this.warehouseList2.map(
        (warehouse) => warehouse.ID
      );
    }
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  search(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
      this.pageSize = 10;
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.loadingRecords = true;
    var filterrrrr = '';
    if (this.roleID == 1 || this.roleID == 8) {
    } else {
      if (this.radioValue == 'M') {
        filterrrrr = ' AND USER_ID=' + this.useriddd;
      } else {
        var dd: any = [];
        this.LoadGodown.forEach((element: any) => {
          dd.push(element.ID);
        });
        filterrrrr =
          ' AND USER_ID<>' +
          this.useriddd +
          ' AND SOURCE_WAREHOUSE_ID in(' +
          dd +
          ') ';
      }
      if (this.selectedWarehouses.length > 0) {
        let quotedData = this.selectedWarehouses
          .map((data) => `'${data}'`)
          .join(',');
        let sourceFilter = ` AND SOURCE_WAREHOUSE_ID IN (${quotedData})`;
        likeQuery += sourceFilter;
        this.isfilterapply = true
      }
      if (this.selectedDestinationWarehouses.length > 0) {
        let quotedData = this.selectedDestinationWarehouses
          .map((data) => `'${data}'`)
          .join(',');
        let sourceFilter = ` AND DESTINATION_WAREHOUSE_ID IN (${quotedData})`;
        likeQuery += sourceFilter;
        this.isfilterapply = true
      }
      if (this.fromDate && this.toDate) {
        let from = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd')
        let to = this.datePipe.transform(this.toDate, 'yyyy-MM-dd')
        let dateQuery = " AND DATE BETWEEN ('" + from + " 00:00:00') AND ('" + to + " 23:59:00')"
        likeQuery += dateQuery
        this.isfilterapply = true
      }
    }
    this.api
      .stockMovementRequestnew(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + filterrrrr + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.TabId = data['body']['TAB_ID'];
            this.totalRecords = data['body']['count'];
            this.dataList = data['body']['data'];
            this.rejectRemarkExpand = new Array(this.totalRecords).fill(false);
            this.loadingRecords = false;
            if (this.totalRecords == 0) {
              this.drawerData.MOVEMENT_NUMBER = '0001';
            } else {
              let finalreq =
                parseInt(data['body']['data'][0]['MOVEMENT_NUMBER']) + 1;
              this.drawerData.MOVEMENT_NUMBER = finalreq
                .toString()
                .padStart(4, '0');
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.dataList = [];
        }
      );
  }
  showFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  Godownlist: any = [];
  RequestBy: any;
  dispatchedBy: any;
  GetGodown() {
    this.Godown1 = 1;
    this.Godown2 = 2;
    this.applyFilter();
    this.api.getWarehouses(0, 0, '', '', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200) {
        this.Godownlist = data['data'];
        this.warehouseList = data['data'];
      } else {
        this.message.error('Failed To Get Godown List', '');
      }
    });
  }
  Godownone(data: any) { }
  StorageLocation(data: any) { }
  applyFilter() {
    if (this.Godown1 || this.Godown2 || this.RequestBy) {
      this.isfilterapply = true;
    } else {
      this.isfilterapply = false;
    }
    this.search(true);
    this.filterClass = 'filter-invisible';
  }
  isfilterapply2;
  applyFilter2() {
    if (this.Godown1 || this.Godown2 || this.RequestBy) {
      this.isfilterapply2 = true;
    } else {
      this.isfilterapply2 = false;
    }
    if (this.fromDate && !this.toDate) {
      this.message.error('Please select to date', '')
      return
    }
    if (!this.fromDate && this.toDate) {
      this.message.error('Please select from date', '')
      return
    }
    this.search(true);
    this.filterClass = 'filter-invisible';
  }
  clearFilter2() {
    this.filterClass = 'filter-invisible';
    this.search(true);
  }
  add(): void {
    this.drawerfor = 'ADDORUPDATE';
    this.category = '';
    this.drawerTitle = 'Transfer Stock';
    this.drawerData = new StockMovementRequest();
    this.items1 = [];
    this.items = [];
    this.editdata = false;
    this.drawerVisible = true;
  }
  items: any = [];
  items1: any = [];
  item2: any = [];
  index = -1;
  data2 = new InnerStockMovementRequest();
  datacount = 0;
  datacount1 = 0;
  product: any = [];
  productname: any[] = [];
  disabled: boolean = false;
  update: boolean = false;
  INNERTABLEDATA: any = [];
  editdata: boolean;
  category: any;
  edit(data0: StockMovementRequest): void {
    this.drawerfor = 'ADDORUPDATE';
    this.item2 = [];
    this.update = true;
    this.disabled = true;
    this.items = [];
    this.items1 = [];
    this.drawerTitle = 'Update Stock Movement Request';
    this.drawerData = Object.assign({}, data0);
    this.loadingRecords = true;
    this.api
      .getAllInnerStockMovementItemDetailsTableeee(0, 0, '', '', data0.ID)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.drawerVisible = true;
            this.item2 = data['body']['data'];
            if (data['body']['data'].length > 0) {
              for (let i = 0; i < data['body']['data'].length; i++) {
                this.INNERTABLEDATA[i] = {
                  ...data['body']['data'][i],
                };
                this.items1.push(this.INNERTABLEDATA[i]);
                this.items = this.items1;
              }
              this.category = this.INNERTABLEDATA[0]['ITEM_CATEGORY_ID'];
            } else {
              this.items = [];
            }
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data of Stock Check-In Details", '');
          }
          this.index = -1;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Server Not Found', '');
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search(false);
    this.drawerVisible = false;
  }
  loadMore(): void {
    this.pageSize += 10;
    this.search(false);
  }
  isFilterApplied: any = 'default';
  startValue: any;
  endValue: any;
  currentDate: any;
  getStatusWiseCurrentStage(status: string): number {
    if (status == 'P') {
      return 1;
    } else if (status == 'A') {
      return 2;
    } else if (status == 'D') {
      return 3;
    } else {
      return 1;
    }
  }
  requestDrawerVisible: boolean = false;
  requestDrawerTitle: string;
  requestDrawerData: any[] = [];
  get closeCallbackRequestDrawer() {
    return this.requestDrawerClose.bind(this);
  }
  requestDrawerClose(): void {
    this.search(false);
    this.requestDrawerVisible = false;
  }
  openRequestCheckDrawer(data: any): void {
    this.update = true;
    this.disabled = true;
    this.items = [];
    this.items1 = [];
    this.requestDrawerTitle = 'Check Item List';
    this.requestDrawerData = Object.assign({}, data);
    this.loadingRecords = true;
    const status = this.requestDrawerData['STATUS'];
    this.api
      .getAllInnerStockMovementItemDetailsTable(
        0,
        0,
        '',
        '',
        ' AND MOVEMENT_REQUEST_MASTER_ID=' + data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.requestDrawerVisible = true;
            if (data['data'].length > 0) {
              for (let i = 0; i < data['data'].length; i++) {
                this.INNERTABLEDATA[i] = {
                  ID: data['data'][i]['ID'],
                  ITEM_ID: data['data'][i]['ITEM_ID'],
                  ITEM_NAME: data['data'][i]['ITEM_NAME'],
                  REQUESTED_QTY: data['data'][i]['REQUESTED_QTY'],
                  REQUESTED_LOOSE_QTY: data['data'][i]['REQUESTED_LOOSE_QTY'],
                  ITEM_CATEGORY_ID: data['data'][i]['ITEM_CATEGORY_ID'],
                  REQUESTED_QTY_UNIT_ID:
                    data['data'][i]['REQUESTED_QTY_UNIT_ID'],
                  CONFIRMED_QTY:
                    status == 'P'
                      ? data['data'][i]['REQUESTED_QTY']
                      : data['data'][i]['CONFIRMED_QTY'],
                  CONFIRMED_LOOSE_QTY:
                    status == 'P'
                      ? data['data'][i]['REQUESTED_LOOSE_QTY']
                      : data['data'][i]['CONFIRMED_LOOSE_QTY'],
                  CONFIRMED_UNIT_ID:
                    status == 'P'
                      ? data['data'][i]['REQUESTED_QTY_UNIT_ID']
                      : data['data'][i]['CONFIRMED_UNIT_ID'],
                  UNIT_NAME:
                    status == 'P'
                      ? data['data'][i]['REQUESTED_QTY_UNIT_NAME']
                      : data['data'][i]['CONFIRMED_UNIT_NAME'],
                  REMARK: data['data'][i]['REMARK'],
                };
                this.items1.push(this.INNERTABLEDATA[i]);
                this.items = this.items1;
              }
            } else {
              this.items = [];
            }
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data of Stock Check-In Details", '');
          }
          this.index = -1;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Server Not Found', '');
        }
      );
  }
  isShowConfirmedQtyColumn: boolean = false;
  OpenModel(data: any): void {
    this.isShowConfirmedQtyColumn = false;
    if (
      data['STATUS'] == 'A' ||
      data['STATUS'] == 'R' ||
      data['STATUS'] == 'D'
    ) {
      if (data['STATUS'] == 'A' || data['STATUS'] == 'D') {
        this.isShowConfirmedQtyColumn = true;
      }
      this.loadingRecords = true;
      this.api
        .getAllInnerStockMovementItemDetailsTable(
          0,
          0,
          '',
          '',
          ' AND MOVEMENT_REQUEST_MASTER_ID=' + data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.Itemdata = data['data'];
              this.switchValue = true;
            } else {
              this.loadingRecords = false;
              this.Itemdata = [];
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.message.error('Server Not Found', '');
          }
        );
    }
  }
  switchValue: boolean = false;
  closeModel() {
    this.switchValue = false;
  }
  radioValue = 'M';
  onChangeRadioButton(event: any) {
    this.search();
  }
  onEnterBtnDown(): void {
    document.getElementById('searchBtn')?.focus();
  }
  Itemdata: any = [];
  tempRejectionRemark: string;
  onRejectedBtnClick(index: number, data: any): void {
    this.showRejectionRemarkModal = true;
    this.tempRejectionRemark = data['REJECT_REMARK'];
  }
  closeRejectionRemarkModel(): void {
    this.showRejectionRemarkModal = false;
  }
  approve(data0: StockMovementRequest): void {
    this.drawerfor = 'APPROVE';
    this.item2 = [];
    this.update = true;
    this.disabled = true;
    this.items = [];
    this.items1 = [];
    this.drawerTitle = 'Approve / Reject Stock Movement Request';
    this.drawerData = Object.assign({}, data0);
    this.loadingRecords = true;
    this.api
      .getAllInnerStockMovementItemDetailsTableeee22(0, 0, '', '', data0.ID)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.drawerVisible = true;
            this.item2 = data['body']['data'];
            if (data['body']['data'].length > 0) {
              for (let i = 0; i < data['body']['data'].length; i++) {
                this.INNERTABLEDATA[i] = {
                  ...data['body']['data'][i],
                };
                this.items1.push(this.INNERTABLEDATA[i]);
                this.items = this.items1;
              }
              this.category = this.INNERTABLEDATA[0]['ITEM_CATEGORY_ID'];
            } else {
              this.items = [];
            }
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data of Stock Check-In Details", '');
          }
          this.index = -1;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Server Not Found', '');
        }
      );
  }
  viewdata(data0: StockMovementRequest): void {
    this.drawerfor = 'VIEW';
    this.item2 = [];
    this.update = true;
    this.disabled = true;
    this.items = [];
    this.items1 = [];
    this.drawerTitle = 'View Transferred Stock';
    this.drawerData = Object.assign({}, data0);
    this.loadingRecords = true;
    this.api
      .getAllInnerStockMovementItemDetailsTableeee(0, 0, '', '', data0.ID)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.drawerVisible = true;
            this.item2 = data['body']['data'];
            if (data['body']['data'].length > 0) {
              for (let i = 0; i < data['body']['data'].length; i++) {
                this.INNERTABLEDATA[i] = {
                  ...data['body']['data'][i],
                };
                this.items1.push(this.INNERTABLEDATA[i]);
                this.items = this.items1;
              }
              this.category = this.INNERTABLEDATA[0]['ITEM_CATEGORY_ID'];
            } else {
              this.items = [];
            }
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data of Stock Check-In Details", '');
          }
          this.index = -1;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Server Not Found', '');
        }
      );
  }
  drawerfor: any = 'ADDORUPDATE';
  LoadGodownmain: any = [];
  isFromGodownLoading: boolean = false;
  LoadGodown: any = [];
  LoadGodownforfilter: any = [];
  LoadGodownmainforfilter: any = [];
  GodownMaster(): void {
    this.LoadGodown = [];
    var userMainId = '';
    if (
      this.useriddd != null &&
      this.useriddd != undefined &&
      this.useriddd != 0
    ) {
      userMainId = ' AND USER_ID=' + this.useriddd;
    } else {
      userMainId = '';
    }
    if (this.roleID == 1 || this.roleID == 8) {
      this.isFromGodownLoading = true;
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isFromGodownLoading = false;
            this.LoadGodown = data['data'];
            this.LoadGodownmain = data['data'];
            this.LoadGodownforfilter = data['data'];
            this.LoadGodownmainforfilter = data['data'];
            this.warehouseList = data['data'];
            this.warehouseList2 = data['data'];
            data['data'].forEach((element) => {
              this.LoadGodownmainforfilter.push({
                value: element.ID,
                display: element.NAME,
              });
            });
            data['data'].forEach((element) => {
              this.LoadGodownforfilter.push({
                value: element.ID,
                display: element.NAME,
              });
            });
            this.search(true);
          } else {
            this.isFromGodownLoading = false;
          }
        },
        (err) => {
          this.LoadGodown = [];
          this.isFromGodownLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
    } else {
      this.api
        .getBackOfficeData(0, 0, '', 'desc', ' AND IS_ACTIVE=1' + userMainId)
        .subscribe(
          (datat) => {
            if (datat['code'] == 200) {
              if (datat['count'] > 0) {
                this.api
                  .getWarehouses(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND STATUS=1 AND WAREHOUSE_MANAGER_ID=' +
                    datat['data'][0]['ID']
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.isFromGodownLoading = false;
                        this.LoadGodown = data['data'];
                        this.warehouseList = data['data'];
                        this.warehouseList2 = data['data'];
                        data['data'].forEach((element) => {
                          this.LoadGodownforfilter.push({
                            value: element.ID,
                            display: element.NAME,
                          });
                        });
                        this.search(true);
                      } else {
                        this.isFromGodownLoading = false;
                        this.LoadGodown = [];
                      }
                    },
                    (err) => {
                      this.isFromGodownLoading = false;
                      this.message.error('Server Not Found', '');
                    }
                  );
              } else {
                this.isFromGodownLoading = false;
                this.LoadGodown = [];
              }
            } else {
              this.isFromGodownLoading = false;
              this.LoadGodown = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.isFromGodownLoading = false;
            this.LoadGodown = [];
          }
        );
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isFromGodownLoading = false;
            this.LoadGodownmain = data['data'];
            data['data'].forEach((element) => {
              this.LoadGodownmainforfilter.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          } else {
            this.isFromGodownLoading = false;
          }
        },
        (err) => {
          this.LoadGodownmain = [];
          this.isFromGodownLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
    }
  }
  TabId: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  filterloading: boolean = false;
  isDeleting: boolean = false;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) 
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') {
                sessionStorage.removeItem('ID');
              }
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (element: any) =>
                    Number(element.ID) === Number(sessionStorage.getItem('ID'))
                );
                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA') {
                  this.applyfilter(this.savedFilters[0]);
                }
              }
              this.whichbutton = '';
              this.updateBtn = '';
            }
            this.filterQuery = '';
          } else {
            this.filterloading = false;
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  deleteItem(item: any): void {
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';
          this.loadFilters();
          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);
          }
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }
  filterGroups: any[] = [
    {
      operator: "AND",
      conditions: [
        {
          condition: {
            field: "",
            comparator: "",
            value: "",
          },
          operator: "AND",
        },
      ],
      groups: [],
    },
  ];
  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  filterData: any;
  currentClientId = 1
  openfilter() {
    this.drawerTitle = 'Stock Movement Request Filter';
    this.drawerFilterVisible = true;
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterFields[0]['options'] = this.LoadGodownmainforfilter;
    this.filterFields[1]['options'] = this.LoadGodownforfilter;
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
    this.filterGroups2 = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }
  filterFields: any[] = [
    {
      key: 'SOURCE_WAREHOUSE_ID',
      label: 'Source Godown',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: this.LoadGodownmainforfilter,
      placeholder: 'Select Source Godown',
    },
    {
      key: 'DESTINATION_WAREHOUSE_ID',
      label: 'Destination Godown',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: this.LoadGodownforfilter,
      placeholder: 'Select Destination Godown',
    },
    {
      key: 'MOVEMENT_NUMBER',
      label: 'Movement Request No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Movement Request No',
    },
    {
      key: 'DATE',
      label: 'Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'less Than Equal To' },
      ],
      options: [],
      placeholder: 'Select Date',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  isModalVisible = false;
  selectedQuery: string = '';
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[0]['options'] = this.LoadGodownmainforfilter;
    this.filterFields[1]['options'] = this.LoadGodownforfilter;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerflterClose.bind(this);
  }
  drawerfilterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
    this.whichbutton = buttontype;
    this.updateBtn = updateButton;
    if (buttontype == 'SA') {
      this.loadFilters();
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  applyCondition: any;
}
