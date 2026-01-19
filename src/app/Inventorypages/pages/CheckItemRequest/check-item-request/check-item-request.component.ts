import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-check-item-request',
  templateUrl: './check-item-request.component.html',
  styleUrls: ['./check-item-request.component.css'],
})
export class CheckItemRequestComponent {
  formTitle: string = 'Check Item Request';
  drawerVisible!: boolean;
  drawerTitle!: string;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  loadingRecords: boolean = true;
  totalRecords = 1;
  dataList = [];
  screenwidth: any;
  unitWidth = 0;
  columns: string[][] = [
    ['STATUS'],
    ['DATE'],
    ['MOVEMENT_REQUEST_NO'],
    ['FROM_GODOWN_NAME'],
    ['TO_GODOWN_NAME'],
    ['VEHICLE_NO'],
    ['TOTAL_ITEMS'],
  ];
  drawerData: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  ngOnInit(): void {
    this.updateUnitWidth();
    window.addEventListener('resize', this.updateUnitWidth.bind(this));
  }
public drawerBodyStyle = {
  height: 'calc(100% - 55px)',
  overflow: 'auto',
  'padding-bottom': '53px'
};
  updateUnitWidth(): void {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth > 1200) {
      this.unitWidth = 700;
    } else if (this.screenwidth > 992) {
      this.unitWidth = 700;
    } else {
      this.unitWidth = this.screenwidth > 500 ? 1250 : 380;
    }
  }
  search(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
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
    if (likeQuery !== '') {
      this.api.stockMovementRequest(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.totalRecords = data['body']['count'];
              this.dataList = data['body']['data'];
              this.totalRecords = this.dataList.length;
              this.loadingRecords = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.dataList = [];
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    } else {
      this.api.stockMovementRequest(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        " AND STATUS='P'"
      )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.totalRecords = data['body']['count'];
              this.dataList = data['body']['data'];
              this.totalRecords = this.dataList.length;
              this.loadingRecords = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.dataList = [];
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    }
  }
  getallStockData(): void {
    this.api.stockMovementRequest(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      '',
      ' AND STATUS = "P"'
    )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.totalRecords = data['body']['count'];
            this.totalRecords = this.dataList.length;
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  items = [];
  items1: any = [];
  index = -1;
  disabled = false;
  update = false;
  INNERTABLEDATA: any = [];
  editdata: boolean;
  edit(data0: any): void {
    this.loadingRecords = true;
    this.update = true;
    this.disabled = true;
    this.items = [];
    this.items1 = [];
    this.drawerTitle = 'Check Item List ';
    this.drawerData = Object.assign({}, data0);
    this.api
      .getAllInnerStockMovementItemDetailsTable(
        0,
        0,
        '',
        '',
        ' AND MOVEMENT_REQUEST_MASTER_ID=' + data0.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              for (let i = 0; i < data['data'].length; i++) {
                this.INNERTABLEDATA[i] = {
                  ID: data['data'][i]['ID'],
                  ITEM_ID: data['data'][i]['ITEM_ID'],
                  ITEM_NAME: data['data'][i]['ITEM_NAME'],
                  REQUESTED_QTY: data['data'][i]['REQUESTED_QTY'],
                  REQUESTED_QTY_UNIT_ID: data['data'][i]['REQUESTED_QTY_UNIT_ID'],
                  UNIT_NAME: data['data'][i]['REQUESTED_QTY_UNIT_NAME'],
                };
                this.items1.push(this.INNERTABLEDATA[i]);
                this.items = this.items1;
              }
            } else {
              this.items = [];
            }
            this.loadingRecords = false;
            this.drawerVisible = true;
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data of Inward Details", '');
          }
          this.index = -1;
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  keyup(event: any) {
    this.search(true);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
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
    this.search();
  }
}
