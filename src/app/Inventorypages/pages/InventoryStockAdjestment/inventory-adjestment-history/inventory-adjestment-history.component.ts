import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-inventory-adjestment-history',
  templateUrl: './inventory-adjestment-history.component.html',
  styleUrls: ['./inventory-adjestment-history.component.css'],
})
export class InventoryAdjestmentHistoryComponent {
  @Input() drawerClose: any = Function;
  @Input() drawerData: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFocused: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['UNIQUE_NO', 'UNIQUE_NO'],
    ['GUARANTTEE_IN_DAYS', 'GUARANTTEE_IN_DAYS'],
    ['WARANTEE_IN_DAYS', 'WARANTEE_IN_DAYS'],
    ['EXPIRY_DATE', 'EXPIRY_DATE'],
  ];
  ADJESTMENT_DATE: any;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  commonFunction = new CommonFunctionService();

  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  roleid = sessionStorage.getItem('roleId');
  roleID: number;
  backofficeId = sessionStorage.getItem('backofficeId');
  BACKOFFICE_ID: number;
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
    // get month of current date
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let startDateStr = `${new Date(currentYear, currentMonth, 1)}`;
    let endDateStr = `${currentDate}`;
    this.ADJESTMENT_DATE = [
      this.datePipe.transform(startDateStr, 'yyyy-MM-dd'),
      this.datePipe.transform(endDateStr, 'yyyy-MM-dd'),
    ];
  }

  close(): void {
    this.drawerClose();
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // let mongoFilterForActionType = {
    //   "ACTION_TYPE": { "$in": ["Adjusted"] }
    // };

    // let mongoFilters = {
    //   $expr: {
    //     $and: [
    //       { $in: ['$ACTION_TYPE', ['Adjusted']] },
    //       {
    //         $and: [
    //           {
    //             $gte: [
    //               {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$INWARDED_DATE',
    //                 },
    //               },
    //               this.datePipe.transform(
    //                 this.ADJESTMENT_DATE[0],
    //                 'yyyy-MM-dd'
    //               ),
    //             ],
    //           },
    //           {
    //             $lte: [
    //               {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$INWARDED_DATE',
    //                 },
    //               },
    //               this.datePipe.transform(
    //                 this.ADJESTMENT_DATE[1],
    //                 'yyyy-MM-dd'
    //               ),
    //             ],
    //           },
    //         ],
    //       },
    //       { $in: ['$INVENTORY_ID', this.drawerData['ID']] },
    //       { $in: ['$WAREHOUSE_ID', this.drawerData['WAREHOUSE_ID']] },
    //     ],
    //   },
    // };
    var likeQuery = '';
    if (
      this.BACKOFFICE_ID != null &&
      this.BACKOFFICE_ID != undefined &&
      this.BACKOFFICE_ID != 0
    ) {
      likeQuery +=
        ' AND WAREHOUSE_ID IN (' + this.WAREHOUSE_ID.toString() + ')';
    }
    this.loadingRecords = true;

    this.api
      .getInventoryAdjestmentHistory(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        // mongoFilters
        ' AND (PARENT_ID = ' +
        this.drawerData.ID +
        ' OR ITEM_ID = ' +
        this.drawerData.ID +
        ')' +
        likeQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body['count'];
            this.dataList = response.body['data'];
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
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  keyup(keys): void {
    const element = window.document.getElementById('button');

    if (element != null) element.focus();

    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  calulateAfterAdjestment(
    oldQty: any,
    adjestedQty: any,
    adjestmentType: string
  ): number {
    let afterAdjestment = 0;

    if (adjestmentType === 'P') {
      afterAdjestment = Number(oldQty) + Number(adjestedQty);
    } else {
      afterAdjestment = Number(oldQty) - Number(adjestedQty);
    }

    return afterAdjestment;
  }

  inventoryAdjustmentDrawerVisible: boolean = false;
  inventoryAdjustmentDrawerTitle: string = '';
  inventoryAdjustmentDrawerData: any[] = [];

  inventoryAdjustmentDrawerOpen(): void {
    this.inventoryAdjustmentDrawerTitle =
      'Adjust Stock of ' + this.drawerData['ITEM_NAME'];
    this.inventoryAdjustmentDrawerData = this.drawerData;
    this.inventoryAdjustmentDrawerVisible = true;
  }

  inventoryAdjustmentDrawerClose(): void {
    this.search();

    this.inventoryAdjustmentDrawerVisible = false;
  }

  get inventoryAdjustmentDrawerCloseCallback() {
    return this.inventoryAdjustmentDrawerClose.bind(this);
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
