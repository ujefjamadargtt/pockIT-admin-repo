import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-payment-transaction-report',
  templateUrl: './payment-transaction-report.component.html',
  styleUrls: ['./payment-transaction-report.component.css']
})
export class PaymentTransactionReportComponent implements OnInit {
  formTitle = 'Payment Gateway Transaction Report';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;
  dataList: any[] = [];
  loadingRecords = false;
  sortValue = 'desc';
  sortKey = 'ID';
  searchText = '';
  filterQuery = '';
  isFilterApplied = 'default';
  private _requestPending = false;
  columns: string[][] = [
    ['MOBILE_NUMBER', 'Mobile Number'],
    ['PAYMENT_FOR', 'Payment For'],
    ['TRANSACTION_DATE', 'Transaction Date'],
    ['TRANSACTION_ID', 'Transaction ID'],
    ['TRANSACTION_AMOUNT', 'Transaction Amount'],
    ['MERCHENT_ORDER_ID', 'Merchant Order ID'],
    ['RESPONSE_MESSAGE', 'Response Message'],
  ];
  STATUS = 'AL';
  TICKET_GROUP: any[] = [];
  SUPPORT_USER = 'AL';
  isSpinning = false;
  filterClass = 'filter-invisible';   
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: any = [];
  dateFormat = 'dd/MM/yyyy';
  date: Date[] = [];
  data1: any[] = [];
  index = 0;
  ticketQuestion = {};
  value1: any = '';
  value2: any = '';
  ticketGroups: any[] = [];
  supportusers: any[] = [];
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  fileName = 'PaymentGatewayTransaction.xlsx';
  exportLoading = false;
  pdfDownload = false;
  SELECT_ALL = false;
  ticketGroupsToPrint = '';
  orderidText = ''; isorderidFilterApplied = false; orderidVisible = false;
  customerIdText = ''; iscustomeridFilterApplied = false; customeriddVisible = false;
  jobcardText = ''; isjobcardFilterApplied = false; jobcardVisible = false;
  mobileText = ''; ismobilenoFilterApplied = false; mobilenoVisible = false;
  transactionIdText = ''; istransactionidFilterApplied = false; transactionidVisible = false;
  transactionamountText = ''; istransactionamountFilterApplied = false; transactionamountVisible = false;
  merchantOrder = ''; ismerchantorderFilterApplied = false; merchantorderVisible = false;
  responsemessageText = ''; isresponseFilterApplied = false; responseVisible = false;
  dateVisible = false; isdateFilterApplied = false;
  StartDate: any[] = [];
  statusFilter1: string | undefined = undefined;
  listOfFilter1: any[] = [
    { text: 'Order', value: 'O' },
    { text: 'Part Payment', value: 'P' },
  ];
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Success', value: 'Success' },
    { text: 'Fail', value: 'Fail' },
  ];
  excelData: any[] = [];
  isDeleting = false;
  savedFilters: any;
  selectedFilter: string | null = null;
  isfilterapply = false;
  public commonFunction = new CommonFunctionService();
  whichbutton: any;
  filterloading = false;
  updateBtn: any;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId ? this.commonFunction.decryptdata(this.userId) : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  TabId!: number;
  isModalVisible = false;
  selectedQuery = '';
  EditQueryData: any[] = [];
  editButton: any = '';
  FILTER_NAME: any;
  drawerTitle = '';
  drawerFilterVisible = false;
  filterData: any;
  currentClientId = 1;
  isTextOverflow = false;
  filterGroups: any[] = [this._emptyGroup()];
  filterGroups2: any[] = [this._emptyGroup()];
  filterFields: any[] = [
    {
      key: 'ORDER_NO', label: 'Order ID', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Order ID',
    },
    {
      key: 'CUSTOMER_NAME', label: 'Customer Name', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Customer Name',
    },
    {
      key: 'JOB_CARD_NO', label: 'Job Card Number', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Job Card Number',
    },
    {
      key: 'MOBILE_NUMBER', label: 'Mobile Number', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Mobile Number',
    },
    {
      key: 'PAYMENT_FOR', label: 'Payment For', type: 'select',
      comparators: [{ value: '=', display: 'Equal To' }, { value: '!=', display: 'Not Equal To' }],
      options: [
        { display: 'Order', value: 'O' },
        { display: 'Part Payment', value: 'P' },
      ],
      placeholder: 'Select Payment For',
    },
    {
      key: 'TRANSACTION_DATE', label: 'Transaction Date', type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Transaction Date',
    },
    {
      key: 'TRANSACTION_ID', label: 'Transaction ID', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Transaction ID',
    },
    {
      key: 'TRANSACTION_STATUS', label: 'Transaction Status', type: 'select',
      comparators: [{ value: '=', display: 'Equal To' }, { value: '!=', display: 'Not Equal To' }],
      options: [
        { display: 'Success', value: 'Success' },
        { display: 'Fail', value: 'Fail' },
      ],
      placeholder: 'Select Transaction Status',
    },
    {
      key: 'TRANSACTION_AMOUNT', label: 'Transaction Amount', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Transaction Amount',
    },
    {
      key: 'MERCHENT_ORDER_ID', label: 'Merchant Order ID', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Merchant Order ID',
    },
    {
      key: 'RESPONSE_MESSAGE', label: 'Response Message', type: 'text',
      comparators: this._textComparators(),
      placeholder: 'Enter Response Message',
    },
  ];
  oldFilter: any[] = [];
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.search(true);
  }
  back(): void {
    this.router.navigate(['/masters/menu']);
  }
  search(reset = false, exportInExcel = false): void {
    if (this._requestPending && !exportInExcel) {
      return;
    }
    if (
      this.searchText.trim().length > 0 &&
      this.searchText.trim().length < 3
    ) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch {
      sort = 'desc';
    }
    let globalSearchQuery = '';
    if (this.searchText.trim() !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns.map(c => `${c[0]} LIKE '%${this.searchText.trim()}%'`).join(' OR ') +
        ')';
    }
    const parts: string[] = [];
    if (this.orderidText.trim())
      parts.push(`ORDER_NO LIKE '%${this.orderidText.trim()}%'`);
    if (this.customerIdText.trim())
      parts.push(`CUSTOMER_NAME LIKE '%${this.customerIdText.trim()}%'`);
    if (this.jobcardText.trim())
      parts.push(`JOB_CARD_NO LIKE '%${this.jobcardText.trim()}%'`);
    if (this.mobileText.trim())
      parts.push(`MOBILE_NUMBER LIKE '%${this.mobileText.trim()}%'`);
    if (this.statusFilter1)
      parts.push(`PAYMENT_FOR = '${this.statusFilter1}'`);
    if (this.StartDate && this.StartDate.length === 2 && this.StartDate[0] && this.StartDate[1]) {
      const start = new Date(this.StartDate[0]).toISOString().split('T')[0];
      const end = new Date(this.StartDate[1]).toISOString().split('T')[0];
      parts.push(`DATE(TRANSACTION_DATE) BETWEEN '${start}' AND '${end}'`);
      this.isdateFilterApplied = true;
    } else {
      this.isdateFilterApplied = false;
    }
    if (this.transactionIdText.trim())
      parts.push(`TRANSACTION_ID LIKE '%${this.transactionIdText.trim()}%'`);
    if (this.statusFilter)
      parts.push(`TRANSACTION_STATUS = '${this.statusFilter}'`);
    if (this.transactionamountText.trim())
      parts.push(`TRANSACTION_AMOUNT LIKE '%${this.transactionamountText.trim()}%'`);
    if (this.merchantOrder.trim())
      parts.push(`MERCHENT_ORDER_ID LIKE '%${this.merchantOrder.trim()}%'`);
    if (this.responsemessageText.trim())
      parts.push(`RESPONSE_MESSAGE LIKE '%${this.responsemessageText.trim()}%'`);
    this.isorderidFilterApplied = !!this.orderidText.trim();
    this.iscustomeridFilterApplied = !!this.customerIdText.trim();
    this.isjobcardFilterApplied = !!this.jobcardText.trim();
    this.ismobilenoFilterApplied = !!this.mobileText.trim();
    this.istransactionidFilterApplied = !!this.transactionIdText.trim();
    this.istransactionamountFilterApplied = !!this.transactionamountText.trim();
    this.ismerchantorderFilterApplied = !!this.merchantOrder.trim();
    this.isresponseFilterApplied = !!this.responsemessageText.trim();
    const columnFilter = parts.length ? ' AND ' + parts.join(' AND ') : '';
    const likeQuery = globalSearchQuery + columnFilter;
    const fullFilter = likeQuery + this.filterQuery;
    if (!exportInExcel) {
      this._requestPending = true;
      this.loadingRecords = true;
      this.api
        .paymentgatewaytransactionReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          fullFilter,
          ''
        )
        .subscribe({
          next: (data) => {
            this._requestPending = false;
            this.loadingRecords = false;
            if (data['status'] === 200) {
              this.TabId = data.body['TAB_ID'];
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'] ?? [];
            } else if (data['status'] === 400) {
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.dataList = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          error: (err: HttpErrorResponse) => {
            this._requestPending = false;
            this.loadingRecords = false;
            this.dataList = [];
            if (err.status === 0) {
              this.message.error('Network error: Please check your internet connection.', '');
            } else if (err.status === 400) {
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        });
    } else {
      this.exportLoading = true;
      this.api
        .paymentgatewaytransactionReport(0, 0, this.sortKey, sort, fullFilter, '')
        .subscribe({
          next: (data) => {
            this.exportLoading = false;
            if (data['status'] === 200) {
              this.excelData = data.body['data'] ?? [];
              this.totalRecords = data.body['count'];
              this.dataList = this.excelData;
              this.convertInExcel();
            } else {
              this.excelData = [];
            }
          },
          error: (err: HttpErrorResponse) => {
            this.exportLoading = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        });
    }
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.search();   
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.search();
  }
  sort(params: NzTableQueryParams): void {
    const { sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const newSortField = currentSort?.key ?? 'ID';
    const newSortOrder = currentSort?.value ?? 'desc';
    if (newSortField !== this.sortKey || newSortOrder !== this.sortValue) {
      this.sortKey = newSortField;
      this.sortValue = newSortOrder;
      this.pageIndex = 1;
      this.search();
    }
  }
  showFilter(): void {
    this.filterClass = this.filterClass === 'filter-visible'
      ? 'filter-invisible'
      : 'filter-visible';
  }
  showMainFilter(): void {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  clearFilter(): void {
    this.TICKET_GROUP = [];
    this.date = [];
    this.filterQuery = '';
    this.selectedDate = null;
    this.value1 = '';
    this.value2 = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.SELECT_ALL = false;
    this.search(true);
  }
  exportexcel(): void {
    const element = document.getElementById('summer');
    if (!element) return;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
  importInExcel(): void {
    this.search(true, true);
  }
  convertInExcel(): void {
    const arry1: any[] = [];
    if (!this.excelData.length) {
      this.message.error('There is No Data', '');
      return;
    }
    for (let i = 0; i < this.excelData.length; i++) {
      const r = this.excelData[i];
      const obj: any = {
        'Order ID': r['ORDER_NO'] || '-',
        'Customer Name': r['CUSTOMER_NAME'] || '-',
        'Job Card Number': r['JOB_CARD_NO'] || '-',
        'Mobile Number': r['MOBILE_NUMBER'] || '-',
        'Payment For': r['PAYMENT_FOR'] === 'O' ? 'Order'
          : r['PAYMENT_FOR'] === 'P' ? 'Part Payment'
            : (r['PAYMENT_FOR'] || '-'),
        'Transaction Date': r['TRANSACTION_DATE'] || '-',
        'Transaction ID': r['TRANSACTION_ID'] || '-',
        'Transaction Status': r['TRANSACTION_STATUS'] || '-',
        'Transaction Amount': r['TRANSACTION_AMOUNT'] || '-',
        'Merchant Order ID': r['MERCHENT_ORDER_ID'] || '-',
        'Response Message': r['RESPONSE_MESSAGE'] || '-',
      };
      arry1.push(obj);
    }
    this._exportService.exportExcel(
      arry1,
      'Payment Gateway Transaction Report ' +
      this.datepipe.transform(new Date(), 'dd/MM/yyyy')
    );
  }
  reset(): void {
    this.searchText = '';
  }
  getCurrentDateTime() { return new Date(); }
  getUserName() { return this.api.userName; }
  getTicketGroups(): string {
    return (!this.ticketGroupsToPrint || this.TICKET_GROUP.length === this.ticketGroups.length)
      ? 'All'
      : this.ticketGroupsToPrint;
  }
  onSelectAllChecked(event: boolean): void {
    this.SELECT_ALL = event;
    this.TICKET_GROUP = event ? this.ticketGroups.map(g => g['ID']) : [];
  }
  onSelectOff(event: any[]): void {
    this.SELECT_ALL = event.length === this.ticketGroups.length;
    this.TICKET_GROUP = event;
    if (!this.TICKET_GROUP.length) this.SELECT_ALL = false;
  }
  onKeyup(keys: KeyboardEvent): void {
    if (keys.key === 'Enter' && this.searchText.length >= 3) {
      this.search(true);
    } else if (keys.key === 'Backspace' && this.searchText.length === 0) {
      this.dataList = [];
      this.search(true);
    }
    const triggerSearch = (len: number, minLen: number) => {
      if (keys.key === 'Enter' && len >= minLen) this.search();
      else if (keys.key === 'Backspace' && len === 0) this.search();
    };
    triggerSearch(this.orderidText.length, 1);
    triggerSearch(this.customerIdText.length, 3);
    triggerSearch(this.jobcardText.length, 1);
    triggerSearch(this.mobileText.length, 3);
    triggerSearch(this.transactionIdText.length, 3);
    triggerSearch(this.transactionamountText.length, 1);
    triggerSearch(this.merchantOrder.length, 3);
    triggerSearch(this.responsemessageText.length, 3);
  }
  onEnterKey(event: Event): void {
    (event as KeyboardEvent).preventDefault();
  }
  onStatusFilterChange(selectedStatus: string): void {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onStatusFilterChange1(selectedStatus: string): void {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  onDateRangeChange(): void {
    if (this.StartDate?.length === 2 && this.StartDate[0] && this.StartDate[1]) {
      this.isdateFilterApplied = true;
      this.search();
    } else {
      this.StartDate = [];
      this.isdateFilterApplied = false;
      this.search();
    }
  }
  loadFilters(): void {
    this.filterloading = true;
    this.api
      .getFilterData1(0, 0, 'id', 'desc', ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`)
      .subscribe({
        next: (response) => {
          this.filterloading = false;
          if (response.code === 200) {
            this.savedFilters = response.data;
            if (this.whichbutton === 'SA' || this.updateBtn === 'UF') {
              if (this.whichbutton === 'SA') sessionStorage.removeItem('ID');
              const storedId = sessionStorage.getItem('ID');
              if (storedId) {
                const found = this.savedFilters.find(
                  (e: any) => Number(e.ID) === Number(storedId)
                );
                if (found) this.applyfilter(found);
              } else if (this.whichbutton === 'SA') {
                this.applyfilter(this.savedFilters[0]);
              }
              this.whichbutton = '';
              this.updateBtn = '';
            }
            this.filterQuery = '';
          } else {
            this.message.error('Failed to load filters.', '');
          }
        },
        error: () => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      });
    this.filterQuery = '';
  }
  deleteItem(item: any): void {
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe({
      next: (data) => {
        if (data['code'] === 200) {
          this.savedFilters = this.savedFilters.filter((f: any) => f.ID !== item.ID);
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.isDeleting = false;
          this.filterloading = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';
          this.loadFilters();
          if (this.selectedFilter === item.ID) {
            this.filterQuery = '';
            this.search(true);
          } else {
            this.isfilterapply = true;
          }
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.filterloading = false;
        this.isDeleting = false;
        if (err.status === 0) {
          this.message.error('Unable to connect.', '');
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    });
  }
  applyfilter(item: any): void {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  Clearfilter(): void {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  editQuery(data: any): void {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  openfilter(): void {
    this.drawerTitle = 'Payment Gateway Transaction Report Filter';
    this.drawerFilterVisible = true;
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterGroups = [this._emptyGroup()];
    this.filterGroups2 = [this._emptyGroup()];
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
  }
  onFilterApplied(obj: any): void {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  drawerfilterClose(buttontype: string, updateButton: string): void {
    this.drawerFilterVisible = false;
    this.whichbutton = buttontype;
    this.updateBtn = updateButton;
    this.loadFilters();
  }
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  checkOverflow(element: HTMLElement, tooltip: any): void {
    const overflow = element.scrollWidth > element.clientWidth;
    overflow ? tooltip.show() : tooltip.hide();
  }
  private _emptyGroup() {
    return {
      operator: 'AND',
      conditions: [{ condition: { field: '', comparator: '', value: '' }, operator: 'AND' }],
      groups: [],
    };
  }
  private _textComparators() {
    return [
      { value: '=', display: 'Equal To' },
      { value: '!=', display: 'Not Equal To' },
      { value: 'Contains', display: 'Contains' },
      { value: 'Does Not Contains', display: 'Does Not Contains' },
      { value: 'Starts With', display: 'Starts With' },
      { value: 'Ends With', display: 'Ends With' },
    ];
  }
}