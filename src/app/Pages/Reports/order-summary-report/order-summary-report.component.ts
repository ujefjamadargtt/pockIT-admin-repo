import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-order-summary-report',
  templateUrl: './order-summary-report.component.html',
  styleUrls: ['./order-summary-report.component.css'],
})
export class OrderSummaryReportComponent {
  drawerVisible: boolean = false;
  // drawerData: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  searchText1: string = '';
  public commonFunction = new CommonFunctionService();
  currentHour: any = new Date().getHours();
  currentMinute: any = new Date().getMinutes();
  isOk: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = '';
  isLoading = true;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  excelData: any = [];
  exportLoading: boolean = false;
  isSpinning = false;
  formTitle = 'Order Summary Report';

  columns: string[][] = [
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    // ["REJECTED", "REJECTED"],
    // ["CANCELLED", "CANCELLED"],
    // ["COMPLETED", "COMPLETED"],
    // ["PENDING", "PENDING"],
    // ["FINAL_AMOUNT", "FINAL_AMOUNT"],
    // ["order_count", "order_count"],
  ];
  loadingRecords = false;
  totalRecords = 0;
  dataList: any = [];
  selectedCategories: number[] = [];
  selectedSubCategories: number[] = [];
  servicename: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    public datepipe: DatePipe,
    private _exportService: ExportService
  ) { }

  distinctData: any = [];
  // Edit Code 3
  filterGroups: any[] = [
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

  nametext: string = '';
  iscustNameFilterApplied: boolean = false;
  custnamevisible = false;

  totalorder: string = '';
  istotalorderFilterApplied: boolean = false;
  totalordervisible = false;

  totalamount: string = '';
  istotalamountFilterApplied: boolean = false;
  totalamountVisible = false;

  pendingtext: string = '';
  ispendingFilterApplied: boolean = false;
  pendingVisible = false;

  completedtext: string = '';
  iscompletedFilterApplied: boolean = false;
  completedVisible = false;

  cancelledtext: string = '';
  iscancelledFilterApplied: boolean = false;
  cancelledVisible = false;

  rejectedtext: string = '';
  isrejectedFilterApplied: boolean = false;
  rejectedVisible = false;
  ngOnInit() { }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  onKeypressEvent(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');

    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText1.length == 0 && keys.key == 'Backspace') {
      // this.dataList = []
      this.search(true);
    }
  }

  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  onKeyup(keys: any, type: string): void {
    const element = window.document.getElementById('button');

    if (type == 'name' && this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscustNameFilterApplied = true;
    } else if (
      type == 'name' &&
      this.nametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.iscustNameFilterApplied = false;
    }

    if (
      type == 'totalord' &&
      this.totalorder.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.istotalorderFilterApplied = true;
    } else if (
      type == 'totalord' &&
      this.totalorder.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.istotalorderFilterApplied = false;
    }

    if (
      type == 'totalamt' &&
      this.totalamount.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.istotalamountFilterApplied = true;
    } else if (
      type == 'totalamt' &&
      this.totalamount.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.istotalamountFilterApplied = false;
    }

    if (type == 'pend' && this.pendingtext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.ispendingFilterApplied = true;
    } else if (
      type == 'pend' &&
      this.pendingtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.ispendingFilterApplied = false;
    }

    if (
      type == 'comp' &&
      this.completedtext.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.iscompletedFilterApplied = true;
    } else if (
      type == 'comp' &&
      this.completedtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.iscompletedFilterApplied = false;
    }

    if (
      type == 'can' &&
      this.cancelledtext.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.iscancelledFilterApplied = true;
    } else if (
      type == 'can' &&
      this.cancelledtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.iscancelledFilterApplied = false;
    }

    if (type == 'rej' && this.rejectedtext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isrejectedFilterApplied = true;
    } else if (
      type == 'rej' &&
      this.rejectedtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isrejectedFilterApplied = false;
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'CUSTOMER_ID';
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

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'CUSTOMER_ID';
      this.sortValue = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    var globalSearchQuery = '';
    // Global Search (using searchText)
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

    this.loadingRecords = true;

    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.nametext.trim()}%'`;
      this.iscustNameFilterApplied = true;
    } else {
      this.iscustNameFilterApplied = false;
    }

    if (this.totalorder !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `order_count LIKE '%${this.totalorder.trim()}%'`;
      this.istotalorderFilterApplied = true;
    } else {
      this.istotalorderFilterApplied = false;
    }

    if (this.totalamount !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `FINAL_AMOUNT LIKE '%${this.totalamount.trim()}%'`;
      this.istotalamountFilterApplied = true;
    } else {
      this.istotalamountFilterApplied = false;
    }

    if (this.pendingtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PENDING LIKE '%${this.pendingtext.trim()}%'`;
      this.ispendingFilterApplied = true;
    } else {
      this.ispendingFilterApplied = false;
    }

    if (this.completedtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COMPLETED LIKE '%${this.completedtext.trim()}%'`;
      this.iscompletedFilterApplied = true;
    } else {
      this.iscompletedFilterApplied = false;
    }

    if (this.rejectedtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CANCELLED LIKE '%${this.rejectedtext.trim()}%'`;
      this.isrejectedFilterApplied = true;
    } else {
      this.isrejectedFilterApplied = false;
    }

    if (this.cancelledtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REJECTED LIKE '%${this.cancelledtext.trim()}%'`;
      this.iscancelledFilterApplied = true;
    } else {
      this.iscancelledFilterApplied = false;
    }
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .getOrderSummaryreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.TabId = data['TAB_ID'];
              this.totalRecords = data['count'];
              this.dataList = data['data'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            if (err.status === 0) {
              this.message.error(
                'Network error: Please check your internet connection.',
                ''
              );
            } else if (err['status'] == 400) {
              this.loadingRecords = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
    } else {
      this.loadingRecords = false;
      this.exportLoading = true;

      this.api
        .getOrderSummaryreport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
              this.exportLoading = false;
            } else {
              this.excelData = [];
              this.exportLoading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.exportLoading = false;

            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong.', '');
              this.exportLoading = false;
            }
          }
        );
    }
  }

  reset() {
    this.rejectedtext = '';
    this.cancelledtext = '';
    this.completedtext = '';
    this.pendingtext = '';
    this.totalamount = '';
    this.totalorder = '';
    this.nametext = '';
    this.searchText = '';
  }

  // new  Main filter
  TabId: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  loadFilters() {
    this.filterloading = true;

    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
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
            // else if (this.whichbutton == 'SA') {
            //   this.applyfilter(this.savedFilters[0]);
            // }

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

  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  drawerTitle: string;

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
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Order Summary Report Filter';
    this.drawerFilterVisible = true;

    // Edit code 2

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

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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

  filterFields: any[] = [
    {
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Name',
    },
    // {
    //   key: "order_count",
    //   label: "Total Orders",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Total Orders",
    // },
    // {
    //   key: "FINAL_AMOUNT",
    //   label: "Total Amount",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Total Amount",
    // },
    // {
    //   key: "PENDING",
    //   label: "Pending",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Pending",
    // },
    // {
    //   key: "COMPLETED",
    //   label: "Completed",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Completed",
    // },
    // {
    //   key: "CANCELLED",
    //   label: "Cancelled",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Cancelled",
    // },
    // {
    //   key: "REJECTED",
    //   label: "Rejected",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Rejected",
    // },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  isDeleting: boolean = false;

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
          } else {
            this.isfilterapply = true;
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

  selectedFilter: string | null = null;
  // filterQuery = '';
  applyfilter(item) {
    //
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

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME'];
        obj1['Total Order'] = this.excelData[i]['order_count'];
        obj1['Total Amount'] = this.excelData[i]['FINAL_AMOUNT'];

        obj1['Pending'] = this.excelData[i]['PENDING'];
        obj1['Completed'] = this.excelData[i]['COMPLETED'];
        obj1['Cancelled'] = this.excelData[i]['CANCELLED'];
        obj1['Rejected'] = this.excelData[i]['REJECTED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Order Summary Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
}
