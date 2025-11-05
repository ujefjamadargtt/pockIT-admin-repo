import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-order-cancellation-report',
  templateUrl: './order-cancellation-report.component.html',
  styleUrls: ['./order-cancellation-report.component.css'],
})
export class OrderCancellationReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datepipe: DatePipe,
    private _exportService: ExportService
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Order Cancellation Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'CUSTOMER_NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  orderCancellationData: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['CUSTOMER_NAME'],
    ['ORDER_STATUS_NAME'],
    ['REASON'],
    ['ORDER_NUMBER'],
  ];
  drawerCountryMappingVisible = false;
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

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  // keyup(event) {
  //   if (this.searchText.length >= 3 && event.key === 'Enter') {
  //     this.search();
  //   } else if (this.searchText.length == 0 && event.key === 'Backspace') {
  //     this.search();
  //   }
  // }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isOrderNumberApplied: boolean = false;
  isOrderDateApplied = false;
  isOrderStatusApplied = false;
  isCustomerNameApplied = false;
  isreasonApplied = false;
  isorderStatusApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.customerNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.customerNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }

    if (this.orderNumberText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOrderNumberApplied = true;
    } else if (this.orderNumberText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOrderNumberApplied = false;
    }

    if (this.orderStatusText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isorderStatusApplied = true;
    } else if (this.orderStatusText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isorderStatusApplied = false;
    }
    if (this.reasonText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isreasonApplied = true;
    } else if (this.reasonText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isreasonApplied = false;
    }
    // if (this.cancelDateText != null && event.key === 'Enter') {
    //   this.search();
    //   this.isOrderDateApplied = true;
    // } else if (this.cancelDateText == null && event.key === 'Backspace') {
    //   this.search();
    //   this.isOrderDateApplied = false;
    // }
  }
  filterQuery: string = '';

  nameFilter() {
    if (this.customerNameText.trim() === '') {
      this.searchText = '';
    } else if (this.customerNameText.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
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

    if (this.orderNumberText !== '') {
      likeQuery += `ORDER_NUMBER LIKE '%${this.orderNumberText.trim()}%'`;
    }
    if (this.customerNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.customerNameText.trim()}%'`;
    }
    // Status Filter
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ORDER_STATUS_NAME = '${this.statusFilter1}'`;
    }
    if (this.reasonText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REASON LIKE '%${this.reasonText.trim()}%'`;
    }
    if (this.orderDateText?.length === 2) {
      const [start, end] = this.orderDateText;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `REQUESTED_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    if (this.cancelDateText?.length === 2) {
      const [start, end] = this.cancelDateText;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `CANCEL_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    // this.sortKey = 'NAME';
    // sort = 'asc';
    // this.filterQuery = " AND ORDER_STATUS = 'CA'";
    if (exportInExcel == false) {
      this.api
        .getorderCancellationReport(
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
              this.orderCancellationData = data['data'];
              this.TabId = data['TAB_ID'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.orderCancellationData = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.orderCancellationData = [];
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
      this.exportLoading = true;

      this.api
        .getorderCancellationReport(
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
  orderNumberText: string = '';
  // orderDateText: string = '';
  finalAmountText: string = '';
  orderStatusText: string = '';
  idVisible: boolean = false;

  customerNameText: string = '';
  customerNameVisible: boolean = false;

  technicianNameText: string = '';
  technicianNameVisible: boolean = false;
  OrderDateVisible = false;
  orderNumberVisible: boolean = false;
  OrderStatusVisible: boolean = false;

  orderStatusVisible: boolean = false;

  orderDateText: any = null;
  orderDateVisible: boolean = false;

  cancelDateText: any = null;
  cancelDateVisible: boolean = false;

  reasonText: string = '';
  reasonVisible: boolean = false;
  reset(): void {
    this.reasonText = '';
    this.cancelDateText = '';
    this.orderDateText = '';
    this.orderStatusText = '';
    this.customerNameText = '';
    this.orderNumberText = '';
    this.orderNumberVisible = false;
    this.customerNameVisible = false;
    this.orderStatusVisible = false;
    this.orderDateVisible = false;
    this.cancelDateVisible = false;
    this.reasonVisible = false;

    this.search();
  }

  statusFilter1: string | undefined = undefined;
  onorderStatusFilterChange(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }

  listOforderStatusFilter: any[] = [
    { text: 'Order Scheduled', value: 'Order Scheduled' },
    { text: 'Order Cancelled', value: 'Order Cancelled' },
    // { text: 'Order Completed', value: 'Order Completed' },
    { text: 'Order Placed', value: 'Order Placed' },
    { text: 'Order Rejected', value: 'Order Rejected' },
    { text: 'Order Ongoing', value: 'Order Ongoing' },
  ];

  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      this.search();
    } else {
      this.orderDateText = null;
      this.search();
    }
  }

  resetDateFilter(): void {
    this.orderDateText = null;
    this.search();
  }

  onCancelDateChange(selectedDate: any): void {
    if (this.cancelDateText && this.cancelDateText.length === 2) {
      this.search();
    } else {
      this.cancelDateText = null;
      this.search();
    }
  }

  resetCancelDateFilter(): void {
    this.cancelDateText = null;
    this.search();
  }
  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  dataList: any = [];
  visible = false;

  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
    // { label: 'Short Code', value: 'SHORT_CODE' },
  ];

  // new filter

  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  isLoading = false;

  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  //TabId: number; // Ensure TabId is defined and initialized

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  whichbutton: any;
  filterloading: boolean = false;
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

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
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
  openfilter() {
    this.drawerTitle = 'Order Cancellation Report Filter';
    this.drawerFilterVisible = true;

    // Edit Code 2

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
      key: 'REQUESTED_DATE',
      label: 'Requested Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Requested Date',
    },
    {
      key: 'CANCEL_DATE',
      label: 'Cancel Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Cancel Date',
    },
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
      key: 'ORDER_NUMBER',
      label: 'Order No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order No.',
    },
    {
      key: 'ORDER_STATUS_NAME',
      label: 'Order Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Order Scheduled', value: 'Order Scheduled' },
        { display: 'Order Cancelled', value: 'Order Cancelled' },
        { display: 'Order Placed', value: 'Order Placed' },
        { display: 'Order Rejected', value: 'Order Rejected' },
        { display: 'Order Placed', value: 'Order Placed' },
      ],
      placeholder: 'Enter Order Status',
    },
    {
      key: 'REASON',
      label: 'Reason',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Reason',
    },
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

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  drawerTitle;
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
        // obj1['Requested Date'] = this.datepipe.transform(this.excelData[i]['REQUESTED_DATE'], 'dd/MM/yyyy');
        obj1['Request Date'] = this.excelData[i]['REQUESTED_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['REQUESTED_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';

        // obj1['Cancel Date'] = this.datepipe.transform(this.excelData[i]['CANCEL_DATE'], 'dd/MM/yyyy');
        obj1['Cancel Date'] = this.excelData[i]['CANCEL_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['CANCEL_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';

        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME']
          ? this.excelData[i]['CUSTOMER_NAME']
          : '-';
        obj1['Order No.'] = this.excelData[i]['ORDER_NUMBER']
          ? this.excelData[i]['ORDER_NUMBER']
          : '-';
        obj1['Order Status'] = this.excelData[i]['ORDER_STATUS_NAME']
          ? this.excelData[i]['ORDER_STATUS_NAME']
          : '-';
        obj1['Reason'] = this.excelData[i]['REASON']
          ? this.excelData[i]['REASON']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Order Cancellation Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
}
