import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
// import { ApiServiceService } from '../Service/api-service.service';

@Component({
  selector: 'app-view-varientstock',
  templateUrl: './view-varientstock.component.html',
  styleUrls: ['./view-varientstock.component.css'],
})
export class ViewVarientStockComponent {
  @Input() Inventorydata;
  @Input() drawerClose: any = Function;
  @Input() ITEM_NAME: any;
  @Input() TYPE: any = 'M';
  loadingRecords = false;
  dataList: any = [];
  pageIndex = 1;
  pageSize = 10;
  sortKey = '';
  sortValue = '';
  searchText = '';
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['VARIENT_VALUES', 'VARIENT_VALUES'],
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  commonFunction = new CommonFunctionService();

  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  backofficeId = sessionStorage.getItem('backofficeId');
  BACKOFFICE_ID: number;
  roleid = sessionStorage.getItem('roleId');
  roleID: number;
  ngOnInit(): void {
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    this.search();
  }

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
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

    if (this.searchText != '') {
      likeQuery = ' AND';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    if (
      this.WAREHOUSE_ID != null &&
      this.WAREHOUSE_ID != undefined &&
      this.WAREHOUSE_ID.length > 0
    ) {
      likeQuery +=
        ' AND WAREHOUSE_ID IN (' + this.WAREHOUSE_ID.toString() + ')';
    }

    if (
      (this.BACKOFFICE_ID != null &&
        this.BACKOFFICE_ID != undefined &&
        this.BACKOFFICE_ID != 0 &&
        this.WAREHOUSE_ID != null &&
        this.WAREHOUSE_ID != undefined &&
        this.WAREHOUSE_ID.length > 0) ||
      this.BACKOFFICE_ID == null ||
      this.BACKOFFICE_ID == undefined ||
      this.BACKOFFICE_ID == 0
    ) {
      this.api
        .getStocksbyCategory(
          0,
          0,
          this.sortKey,
          sort,
          ' AND ITEM_ID = ' +
          (this.TYPE == 'M' ? this.Inventorydata.ID : this.Inventorydata.ID) +
          likeQuery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            if (data['status'] == 200) {
              this.dataList = data['body']['data'];
            } else {
              this.message.error('Something Went Wrong ...', '');
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
    } else {
      this.dataList = [];
      this.loadingRecords = false;
    }
  }

  drawerinventorylogs: boolean = false;

  drawerTitleinventorylogs!: string;
  widthsss: any = '100%';
  serviceid: any;
  wareousechanged(event) {
    this.WAREHOUSE_ID = event;
    this.search();
  }
  Viewinventorylogs(data: any): void {
    this.drawerTitleinventorylogs = `Activity Logs`;
    this.serviceid = data.ITEM_ID;
    this.ITEM_NAME = data.ITEM_NAME + ' ' + data.VARIANT_NAME;
    this.drawerinventorylogs = true;
  }

  drawerCloseinventorylogs(): void {
    this.drawerinventorylogs = false;
  }
  get closeCallbackinventorylogs() {
    return this.drawerCloseinventorylogs.bind(this);
  }

  WAREHOUSE_ID: any = [];
  Loadwarehouse: any;
  iswarehouseLoading = false;
  getWarehouses(): void {
    this.Loadwarehouse = [];
    this.WAREHOUSE_ID = [];

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
              this.Loadwarehouse.forEach((d) => {
                this.WAREHOUSE_ID.push(d.ID);
              });
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
            this.Loadwarehouse.forEach((d) => {
              this.WAREHOUSE_ID.push(d.ID);
            });
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
    }
  }

  drawerStockDetails: boolean = false;

  drawerTitleStockDetails!: string;

  ViewStockDetails(data: any): void {
    this.drawerTitleStockDetails = `All Stock Details`;
    this.serviceid = data.ITEM_ID;
    this.ITEM_NAME = data.ITEM_NAME + ' ' + data.VARIANT_NAME;
    this.drawerStockDetails = true;
  }

  drawerCloseStockDetails(): void {
    this.drawerStockDetails = false;
  }
  get closeCallbackStockDetails() {
    return this.drawerCloseStockDetails.bind(this);
  }
}
