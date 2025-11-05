import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CountryData } from 'src/app/Pages/Models/CountryMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-refund-report',
  templateUrl: './refund-report.component.html',
  styleUrls: ['./refund-report.component.css'],
})
export class RefundReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Refund Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'CUSTOMER_NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];

  columns: string[][] = [
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['TOTAL_AMOUNT', 'TOTAL_AMOUNT'],
    ['PAYMENT_REFUND_STATUS', 'PAYMENT_REFUND_STATUS'],
    ['PAYMENT_STATUS', 'PAYMENT_STATUS'],
  ];
  drawerCountryMappingVisible = false;
  drawerTitle = 'Add New Country';
  drawerData: CountryData = new CountryData();
  drawervisible = false;
  Seqtext: any;

  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isrefundFilterApplied = false;
  isShortApplied = false;
  isSeqApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.countrytext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.countrytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.Refundtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isrefundFilterApplied = true;
    } else if (this.Refundtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isrefundFilterApplied = false;
    }

    if (this.Shortcodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isShortApplied = true;
    } else if (this.Shortcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isShortApplied = false;
    }
    if (this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isSeqApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isSeqApplied = false;
    }
  }
  filterQuery: string = '';
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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

    // Country Filter
    if (this.countrytext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.countrytext.trim()}%'`;
    }

    // For Refund

    if (this.Refundtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TOTAL_AMOUNT LIKE '%${this.Refundtext.trim()}%'`;
    }

    // //Short Code
    // if (this.Shortcodetext !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `SHORT_CODE LIKE '%${this.Shortcodetext.trim()}%'`;
    // }
    //Seq no
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.Seqtext.toString().trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_REFUND_STATUS = '${this.statusFilter}'`;
    }

    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_STATUS = '${this.statusFilter1}'`;
    }

    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    // this.sortKey = 'NAME';
    // sort = 'asc';
    if (exportInExcel == false) {
      this.api
        .getrefundRepor(
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
              this.totalRecords = data['count'];
              this.Country = data['data'];
              this.TabId = data['TAB_ID'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.Country = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.Country = [];
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
      this.api
        .getrefundRepor(0, 0, this.sortKey, sort, likeQuery + this.filterQuery)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
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

  close() {
    this.drawervisible = false;
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }

  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }

  //For Input
  countrytext: string = '';
  Refundtext: string = '';
  Countryvisible = false;
  Refund = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  reset(): void {
    this.searchText = '';
    this.countrytext = '';
    this.Refundtext = '';
    this.Shortcodetext = '';
    this.search();
  }

  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;

    this.search(true);
  }

  listOfFilter: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Refunded', value: 'RF' },
  ];

  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;

    this.search(true);
  }

  listOfFilter1: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Reject', value: 'R' },
    { text: 'Approved', value: 'A' },
  ];

  dataList: any = [];
  visible = false;

  columns1: { label: string; value: string }[] = [
    { label: 'Country Name', value: 'CUSTOMER_NAME' },
  ];

  // new filter
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  isLoading = false;
  currentClientId = 1;

  // new  Main filter

  //Edit Code 3

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

  filterData: any;

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

  TabId: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;

  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  filterloading: boolean = false;

  whichbutton: any;
  updateButton: any;
  updateBtn: any;

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

  openfilter() {
    this.drawerTitle = 'Refund Filter';
    this.drawerFilterVisible = true;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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
  }

  drawerflterClose(buttontype, updateButton): void {
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
    return this.drawerflterClose.bind(this);
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
    {
      key: 'TOTAL_AMOUNT',
      label: 'Refund Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Refund Amount',
    },
    {
      key: 'PAYMENT_REFUND_STATUS',
      label: 'Payment Refunded Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: 'RF', display: 'Refunded' },
      ],
      placeholder: 'Select Payment Refunded Status',
    },
    {
      key: 'PAYMENT_STATUS',
      label: 'Payment Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: 'A', display: 'Approved' },
        { value: 'R', display: 'Rejected' },
      ],
      placeholder: 'Select Payment Status',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    //
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }

  excelData: any = [];
  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME'];
        obj1['Refund Amount'] = this.excelData[i]['TOTAL_AMOUNT'];
        //  obj1["Payment Refund Status"] = this.excelData[i]["PAYMENT_REFUND_STATUS"];
        if (this.excelData[i]['PAYMENT_REFUND_STATUS'] == 'P') {
          obj1['Payment Refund Status'] = 'Pending';
        } else if (this.excelData[i]['PAYMENT_REFUND_STATUS'] == 'RF') {
          obj1['Payment Refund Status'] = 'Refunded';
        }
        //  obj1["Payment Status"] = this.excelData[i]["PAYMENT_STATUS"];
        if (this.excelData[i]['PAYMENT_STATUS'] == 'P') {
          obj1['Payment Status'] = 'Pending';
        } else if (this.excelData[i]['PAYMENT_STATUS'] == 'A') {
          obj1['Payment Status'] = 'Approved';
        } else if (this.excelData[i]['PAYMENT_STATUS'] == 'R') {
          obj1['Payment Status'] = 'Rejected';
        }
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Refund Report ' + this.datepipe.transform(new Date(), 'dd/MM/yyyy')
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
