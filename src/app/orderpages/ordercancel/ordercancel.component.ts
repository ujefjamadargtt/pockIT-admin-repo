import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/Service/export.service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-ordercancel',
  templateUrl: './ordercancel.component.html',
  styleUrls: ['./ordercancel.component.css']
})
export class OrdercancelComponent {
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
  formTitle = 'Order Cancellation';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'CUSTOMER_NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['CUSTOMER_NAME'],
    ['ORDER_NUMBER'],
    ['NET_AMOUNT'],
    ['ORDER_STATUS_NAME'],
    ['GROSS_AMOUNT'],
    ['TAX_RATE'],
    ['COUPON_CHARGES'],
    ['SERVICE_CHARGES'],
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isOrderNumberApplied = false;
  isOrderDateApplied = false;
  isFinalAmountApplied = false;
  isOrderStatusApplied = false;
  grossAmountText = '';
  isGrossAmountApplied = false;
  GrossAmountVisible = false;
  taxrateText = '';
  istaxrateApplied = false;
  taxrateVisible = false;
  couponchargesText = '';
  iscouponchargesApplied = false;
  couponchargesVisible = false;
  discountchargesText = '';
  isdiscountchargesApplied = false;
  discountchargesVisible = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.countrytext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.countrytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.orderNumberText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOrderNumberApplied = true;
    } else if (this.orderNumberText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOrderNumberApplied = false;
    }
    if (this.finalAmountText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isFinalAmountApplied = true;
    } else if (this.finalAmountText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFinalAmountApplied = false;
    }
    if (this.grossAmountText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isGrossAmountApplied = true;
    } else if (this.grossAmountText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isGrossAmountApplied = false;
    }
    if (this.taxrateText.length > 0 && event.key === 'Enter') {
      this.search();
      this.istaxrateApplied = true;
    } else if (this.taxrateText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istaxrateApplied = false;
    }
    if (this.couponchargesText.length > 0 && event.key === 'Enter') {
      this.search();
      this.iscouponchargesApplied = true;
    } else if (
      this.couponchargesText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.iscouponchargesApplied = false;
    }
    if (this.discountchargesText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isdiscountchargesApplied = true;
    } else if (
      this.discountchargesText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isdiscountchargesApplied = false;
    }
    if (this.orderStatusText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOrderStatusApplied = true;
    } else if (this.orderStatusText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOrderStatusApplied = false;
    }
  }
  filterQuery: string = '';
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '';
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
    if (this.countrytext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.countrytext.trim()}%'`;
    }
    if (this.orderNumberText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NUMBER LIKE '%${this.orderNumberText.trim()}%'`;
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
          `ORDER_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.finalAmountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NET_AMOUNT LIKE '%${this.finalAmountText.trim()}%'`;
    }
    if (this.grossAmountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `GROSS_AMOUNT LIKE '%${this.grossAmountText.trim()}%'`;
    }
    if (this.taxrateText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TAX_RATE LIKE '%${this.taxrateText.trim()}%'`;
    }
    if (this.couponchargesText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_CHARGES LIKE '%${this.couponchargesText.trim()}%'`;
    }
    if (this.discountchargesText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_CHARGES LIKE '%${this.discountchargesText.trim()}%'`;
    }
    if (this.orderStatusText?.length) {
      const categories = this.orderStatusText.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `TECHNICIAN_ID IN (${categories})`;
      this.isOrderStatusApplied = true;
    } else {
      this.isOrderStatusApplied = false;
    }
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.Seqtext.toString().trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ORDER_STATUS_NAME = '${this.statusFilter}'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .getOrderDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + " AND ORDER_STATUS NOT IN ('CA','CO','OR','PC')"
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
      this.exportLoading = true;
      this.loadingRecords = false;
      this.api
        .getOrderDetailedReport(
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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
  countrytext: string = '';
  orderNumberText: string = '';
  finalAmountText: string = '';
  orderStatusText: any;
  Countryvisible = false;
  OrderNumberVisible = false;
  OrderDateVisible = false;
  FinalAmountVisible = false;
  OrderStatusVisible = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  reset(): void {
    this.searchText = '';
    this.countrytext = '';
    this.orderNumberText = '';
    this.finalAmountText = '';
    this.orderStatusText = '';
    this.Shortcodetext = '';
    this.grossAmountText = '';
    this.taxrateText = '';
    this.couponchargesText = '';
    this.discountchargesText = '';
    this.search();
  }
  orderDateText: any;
  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      const [start, end] = this.orderDateText;
      if (start && end) {
        this.search();
        this.isOrderDateApplied = true;
      }
    } else {
      this.orderDateText = null; 
      this.search();
      this.isOrderDateApplied = false;
    }
  }
  resetDateFilter(): void {
    this.orderDateText = '';
    this.isOrderDateApplied = false;
    this.search(); 
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Order Accepted', value: 'Order Accepted' },
    { text: 'Order Scheduled', value: 'Order Scheduled' },
    { text: 'Order Placed', value: 'Order Placed' },
    { text: 'Order Ongoing', value: 'Order Ongoing' },
  ];
  dataList: any = [];
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
  ];
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  isLoading = false;
  isModalVisible = false; 
  selectedQuery: string = ''; 
  savedFilters: any; 
  currentClientId = 1; 
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
    this.drawerTitle = 'Order Detailed Filter';
    this.drawerFilterVisible = true;
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
      key: 'NET_AMOUNT',
      label: 'Net Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Net Amount',
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
        { display: 'Order Accepted', value: 'Order Accepted' },
        { display: 'Order Scheduled', value: 'Order Scheduled' },
        { display: 'Order Placed', value: 'Order Placed' },
        { display: 'Order Ongoing', value: 'Order Ongoing' },
      ],
      placeholder: 'Select Order Status',
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  drawerTitle;
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
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME'];
        obj1['Order No.'] = this.excelData[i]['ORDER_NUMBER'];
        obj1['Net Amount'] = this.excelData[i]['NET_AMOUNT'];
        obj1['Gross Amount'] = this.excelData[i]['GROSS_AMOUNT'];
        obj1['Tax Rate'] = this.excelData[i]['TAX_RATE'];
        obj1['Coupon Charges'] = this.excelData[i]['COUPON_CHARGES'];
        obj1['Discount Charges'] = this.excelData[i]['DISCOUNT_CHARGES'];
        obj1['Total Tax'] = this.excelData[i]['TOTAL_TAX'];
        obj1['Service Charges'] = this.excelData[i]['SERVICE_CHARGES'];
        obj1['Order Status'] = this.excelData[i]['ORDER_STATUS_NAME'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Order Canceled Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter = '';
  ratingfilter = '';
  orderwisejobcardreport(data: any) {
    this.jobdetailsdata = data;
    this.getTechniciansJobs(data);
    this.jobdetaildrawerTitle = `Jobs under order ${data['ORDER_NUMBER']}`;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
    this.search();
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  orderId: any;
  getTechniciansJobs(data) {
    this.orderId = data.ID;
    this.jobdetailsshow = true;
  }
}
