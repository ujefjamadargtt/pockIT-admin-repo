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
  selector: 'app-payment-gateway-transaction-report',
  templateUrl: './payment-gateway-transaction-report.component.html',
  styleUrls: ['./payment-gateway-transaction-report.component.css'],
})
export class PaymentGatewayTransactionReportComponent implements OnInit {
  formTitle = 'Payment Gateway Transaction Report';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  fileName = 'DeptWise.xlsx';
  dataList: any = [];
  loadingRecords: boolean = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['MOBILE_NUMBER', 'Ticket Group'],
    ['MEMBER_FROM', 'Ticket Group'],
    ['PAYMENT_FOR', 'Ticket Group'],
    ['PAYMENT_MODE', 'Ticket Group'],
    ['TRANSACTION_DATE', 'Ticket Group'],
    ['TRANSACTION_ID', 'Ticket Group'],
    ['TRANSACTION_AMOUNT', 'Ticket Group'],
    ['PAYLOAD', 'Ticket Group'],
    ['RESPONSE_DATA', 'Ticket Group'],
    ['MERCHENT_ORDER_ID', 'Ticket Group'],
    ['MERCHENT_ID', 'Ticket Group'],
    ['RESPONSE_MESSAGE', 'Ticket Group'],
  ];
  STATUS = 'AL';
  TICKET_GROUP = [];
  SUPPORT_USER = 'AL';
  isSpinning = false;
  filterClass: string = 'filter-visible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: any = [];
  dateFormat = 'dd/MM/yyyy';
  date: Date[] = [];
  data1 = [];
  index = 0;
  ticketQuestion = {};
  value1: any = '';
  value2: any = '';
  ticketGroups = [];
  supportusers = [];
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.filterClass = 'filter-invisible';
  }
  exportexcel(): void {
    let element = document.getElementById('summer');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
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
    this.loadingRecords = true;
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    let likeQuery = '';
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
    if (this.orderidText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_ID LIKE '%${this.orderidText.trim()}%'`;
      this.isorderidFilterApplied = true;
    } else {
      this.isorderidFilterApplied = false;
    }
    if (this.customerIdText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.customerIdText.trim()}%'`;
      this.iscustomeridFilterApplied = true;
    } else {
      this.iscustomeridFilterApplied = false;
    }
    if (this.jobcardText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_ID LIKE '%${this.jobcardText.trim()}%'`;
      this.isjobcardFilterApplied = true;
    } else {
      this.isjobcardFilterApplied = false;
    }
    if (this.mobileText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NUMBER LIKE '%${this.mobileText.trim()}%'`;
      this.ismobilenoFilterApplied = true;
    } else {
      this.ismobilenoFilterApplied = false;
    }
    if (this.memberText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MEMBER_FROM LIKE '%${this.memberText.trim()}%'`;
      this.ismemberfromFilterApplied = true;
    } else {
      this.ismemberfromFilterApplied = false;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_FOR = '${this.statusFilter1}'`;
      this.ispaymentforFilterApplied = true;
    } else {
      this.ispaymentforFilterApplied = false;
    }
    if (this.statusFilter2) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_MODE = '${this.statusFilter2}'`;
      this.ispaymntmodeFilterApplied = true;
    } else {
      this.ispaymntmodeFilterApplied = false;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(TRANSACTION_DATE) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isdateFilterApplied = true;
    } else {
      this.isdateFilterApplied = false;
    }
    if (this.transactionIdText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TRANSACTION_ID LIKE '%${this.transactionIdText.trim()}%'`;
      this.istransactionidFilterApplied = true;
    } else {
      this.istransactionidFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TRANSACTION_STATUS = '${this.statusFilter}'`;
    }
    if (this.transactionamountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TRANSACTION_AMOUNT LIKE '%${this.transactionamountText.trim()}%'`;
      this.istransactionamountFilterApplied = true;
    } else {
      this.istransactionamountFilterApplied = false;
    }
    if (this.paylodText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PAYLOAD LIKE '%${this.paylodText.trim()}%'`;
      this.ispayloadFilterApplied = true;
    } else {
      this.ispayloadFilterApplied = false;
    }
    if (this.responseText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RESPONSE_DATA LIKE '%${this.responseText.trim()}%'`;
      this.isresponsedataFilterApplied = true;
    } else {
      this.isresponsedataFilterApplied = false;
    }
    if (this.merchantOrder !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MERCHENT_ORDER_ID LIKE '%${this.merchantOrder.trim()}%'`;
      this.ismerchantorderFilterApplied = true;
    } else {
      this.ismerchantorderFilterApplied = false;
    }
    if (this.merchantIdText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MERCHENT_ID LIKE '%${this.merchantIdText.trim()}%'`;
      this.ismerchantIdFilterApplied = true;
    } else {
      this.ismerchantIdFilterApplied = false;
    }
    if (this.responsemessageText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RESPONSE_MESSAGE LIKE '%${this.responsemessageText.trim()}%'`;
      this.isresponseFilterApplied = true;
    } else {
      this.isresponseFilterApplied = false;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .paymentgatewaytransactionReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          ''
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              ;
              this.loadingRecords = false;
              this.TabId = data.body['TAB_ID'];
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
            } else if (data['status'] == 400) {
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
      this.api
        .paymentgatewaytransactionReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          ''
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.excelData = data.body['data'];
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
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
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  clearFilter() {
    this.TICKET_GROUP = [];
    this.date = [];
    this.filterQuery = '';
    this.selectedDate = null;
    this.value1 = '';
    this.value2 = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
    this.SELECT_ALL = false;
  }
  exportLoading: boolean = false;
  ticketGroupID2: any;
  ticketGroupsToPrint: string = '';
  getCurrentDateTime() {
    return new Date();
  }
  getUserName() {
    return this.api.userName;
  }
  getTicketGroups() {
    if (
      this.ticketGroupsToPrint == '' ||
      this.TICKET_GROUP.length == this.ticketGroups.length
    )
      return 'All';
    else return this.ticketGroupsToPrint;
  }
  pdfDownload: boolean = false;
  SELECT_ALL: boolean = false;
  onSelectAllChecked(event) {
    this.SELECT_ALL = event;
    let ids = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.ticketGroups.length; i++) {
        ids.push(this.ticketGroups[i]['ID']);
      }
    } else {
      ids = [];
    }
    this.TICKET_GROUP = ids;
  }
  onSelectOff(event) {
    var a = this.ticketGroups.length;
    var b = this.ticketGroups.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL = false;
    } else {
      this.SELECT_ALL = true;
    }
    this.TICKET_GROUP = event;
    if (this.TICKET_GROUP.length == 0) {
      this.SELECT_ALL = false;
    }
  }
  ticketGroupText: string = '';
  isticketgroupFilterApplied: boolean = false;
  ticketGroupVisible = false;
  orderidText: string = '';
  isorderidFilterApplied: boolean = false;
  orderidVisible = false;
  customerIdText: string = '';
  iscustomeridFilterApplied: boolean = false;
  customeriddVisible = false;
  jobcardText: string = '';
  isjobcardFilterApplied: boolean = false;
  jobcardVisible = false;
  mobilenoVisible: boolean = false;
  ismobilenoFilterApplied: boolean = false;
  mobileText: string = '';
  memberfromVisible: boolean = false;
  ismemberfromFilterApplied: boolean = false;
  memberText: string = '';
  paymentforVisible: boolean = false;
  ispaymentforFilterApplied: boolean = false;
  paymentfor: string = '';
  paymntmodeVisible: boolean = false;
  ispaymntmodeFilterApplied: boolean = false;
  paymentmodText: string = '';
  transactionidVisible: boolean = false;
  istransactionidFilterApplied: boolean = false;
  transactionIdText: string = '';
  transactionamountVisible: boolean = false;
  istransactionamountFilterApplied: boolean = false;
  transactionamountText: string = '';
  payloadVisible: boolean = false;
  ispayloadFilterApplied: boolean = false;
  paylodText: string = '';
  responsedataVisible: boolean = false;
  isresponsedataFilterApplied: boolean = false;
  responseText: string = '';
  merchantorderVisible: boolean = false;
  ismerchantorderFilterApplied: boolean = false;
  merchantOrder: string = '';
  merchantIdVisible: boolean = false;
  ismerchantIdFilterApplied: boolean = false;
  merchantIdText: string = '';
  responseVisible: boolean = false;
  isresponseFilterApplied: boolean = false;
  responsemessageText: string = '';
  dateVisible: boolean = false;
  isdateFilterApplied: boolean = false;
  StartDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isdateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isdateFilterApplied = false;
    }
  }
  excelData: any = [];
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Success', value: 'Success' },
    { text: 'Fail', value: 'Fail' },
  ];
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  listOfFilter1: any[] = [
    { text: 'Job', value: 'Job' },
    { text: 'Order', value: 'Order' },
  ];
  statusFilter2: string | undefined = undefined;
  onStatusFilterChange2(selectedStatus: string) {
    this.statusFilter2 = selectedStatus;
    this.search(true);
  }
  listOfFilter2: any[] = [
    { text: 'Online', value: 'Online' },
    { text: 'Offline', value: 'Offline' },
  ];
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Order Id'] = this.excelData[i]['ORDER_ID']
          ? this.excelData[i]['ORDER_ID']
          : '-';
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME']
          ? this.excelData[i]['CUSTOMER_NAME']
          : '-';
        obj1['Job Card Id'] = this.excelData[i]['JOB_CARD_ID']
          ? this.excelData[i]['JOB_CARD_ID']
          : '-';
        obj1['Mobile Number'] = this.excelData[i]['MOBILE_NUMBER']
          ? this.excelData[i]['MOBILE_NUMBER']
          : '-';
        obj1['Number From'] = this.excelData[i]['MEMBER_FROM']
          ? this.excelData[i]['MEMBER_FROM']
          : '-';
        obj1['Payment For'] = this.excelData[i]['PAYMENT_FOR']
          ? this.excelData[i]['PAYMENT_FOR']
          : '-';
        obj1['Payment Mode'] = this.excelData[i]['PAYMENT_MODE']
          ? this.excelData[i]['PAYMENT_MODE']
          : '-';
        obj1['Transaction Date'] = this.excelData[i]['TRANSACTION_DATE']
          ? this.excelData[i]['TRANSACTION_DATE']
          : '-';
        obj1['Transaction Id'] = this.excelData[i]['TRANSACTION_ID']
          ? this.excelData[i]['TRANSACTION_ID']
          : '-';
        obj1['Transaction Status'] = this.excelData[i]['TRANSACTION_STATUS']
          ? this.excelData[i]['TRANSACTION_STATUS']
          : '-';
        obj1['Transaction Amount'] = this.excelData[i]['TRANSACTION_AMOUNT']
          ? this.excelData[i]['TRANSACTION_AMOUNT']
          : '-';
        obj1['Payload'] = this.excelData[i]['PAYLOAD']
          ? this.excelData[i]['PAYLOAD']
          : '-';
        obj1['Response Data'] = this.excelData[i]['RESPONSE_DATA']
          ? this.excelData[i]['RESPONSE_DATA']
          : '-';
        obj1['Merchant Order Id'] = this.excelData[i]['MERCHENT_ORDER_ID']
          ? this.excelData[i]['MERCHENT_ORDER_ID']
          : '-';
        obj1['MERCHENT_ID'] = this.excelData[i]['MERCHENT_ID']
          ? this.excelData[i]['MERCHENT_ID']
          : '-';
        obj1['Response Message'] = this.excelData[i]['RESPONSE_MESSAGE']
          ? this.excelData[i]['RESPONSE_MESSAGE']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Payment Gateway Transaction Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  reset(): void {
    this.searchText = '';
  }
  onKeyup(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.orderidText.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isorderidFilterApplied = true;
    } else if (this.orderidText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isorderidFilterApplied = false;
    }
    if (this.customerIdText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscustomeridFilterApplied = true;
    } else if (this.customerIdText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscustomeridFilterApplied = false;
    }
    if (this.jobcardText.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isjobcardFilterApplied = true;
    } else if (this.jobcardText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isjobcardFilterApplied = false;
    }
    if (this.mobileText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismobilenoFilterApplied = true;
    } else if (this.mobileText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismobilenoFilterApplied = false;
    }
    if (this.memberText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismemberfromFilterApplied = true;
    } else if (this.memberText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismemberfromFilterApplied = false;
    }
    if (this.paymentfor.length > 0 && keys.key === 'Enter') {
      this.search();
      this.ispaymentforFilterApplied = true;
    } else if (this.paymentfor.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ispaymentforFilterApplied = false;
    }
    if (this.paymentmodText.length > 0 && keys.key === 'Enter') {
      this.search();
      this.ispaymntmodeFilterApplied = true;
    } else if (this.paymentmodText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ispaymntmodeFilterApplied = false;
    }
    if (this.transactionIdText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.istransactionidFilterApplied = true;
    } else if (this.transactionIdText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.istransactionidFilterApplied = false;
    }
    if (this.transactionamountText.length > 0 && keys.key === 'Enter') {
      this.search();
      this.istransactionamountFilterApplied = true;
    } else if (
      this.transactionamountText.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.istransactionamountFilterApplied = false;
    }
    if (this.paylodText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ispayloadFilterApplied = true;
    } else if (this.paylodText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ispayloadFilterApplied = false;
    }
    if (this.responseText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isresponsedataFilterApplied = true;
    } else if (this.responseText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isresponsedataFilterApplied = false;
    }
    if (this.merchantOrder.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismerchantorderFilterApplied = true;
    } else if (this.merchantOrder.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismerchantorderFilterApplied = false;
    }
    if (this.merchantIdText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismerchantIdFilterApplied = true;
    } else if (this.merchantIdText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismerchantIdFilterApplied = false;
    }
    if (this.responsemessageText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isresponseFilterApplied = true;
    } else if (
      this.responsemessageText.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isresponseFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  importInExcel() {
    this.search(true, true);
  }
  isDeleting: boolean = false;
  savedFilters: any;
  selectedFilter: string | null = null;
  isfilterapply: boolean = false;
  public commonFunction = new CommonFunctionService();
  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
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
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  TabId: number;
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
  isModalVisible = false; 
  selectedQuery: string = ''; 
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  EditQueryData = [];
  editButton: any = '';
  FILTER_NAME: any;
  drawerTitle: string = '';
  drawerFilterVisible: boolean = false;
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
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
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
      key: 'ORDER_ID',
      label: 'Order ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order ID',
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
      key: 'JOB_CARD_ID',
      label: 'Job Card ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job Card ID',
    },
    {
      key: 'MOBILE_NUMBER',
      label: 'Mobile Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Mobile Number',
    },
    {
      key: 'MEMBER_FROM',
      label: 'Member From',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Member From',
    },
    {
      key: 'PAYMENT_FOR',
      label: 'Payment for',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Job', value: 'Job' },
        { display: 'Order', value: 'Order' },
      ],
      placeholder: 'Select Payment for',
    },
    {
      key: 'PAYMENT_MODE',
      label: 'Payment Mode',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Online', value: 'online' },
        { display: 'Offline', value: 'offline' },
      ],
      placeholder: 'Select Payment Mode',
    },
    {
      key: 'TRANSACTION_DATE',
      label: 'Transaction Date',
      type: 'date',
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
      key: 'TRANSACTION_ID',
      label: 'Transactio Id',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transactio Id',
    },
    {
      key: 'TRANSACTION_STATUS',
      label: 'Transactio Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Success', value: 'Success' },
        { display: 'Fail', value: 'Fail' },
      ],
      placeholder: 'Enter Transactio Status',
    },
    {
      key: 'TRANSACTION_AMOUNT',
      label: 'Transactio Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transactio Amount',
    },
    {
      key: 'PAYLOAD',
      label: 'Payload',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Payload',
    },
    {
      key: 'RESPONSE_DATA',
      label: 'Response Data',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Response Data',
    },
    {
      key: 'MERCHENT_ID',
      label: 'Merchant ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Merchant ID',
    },
    {
      key: 'RESPONSE_MESSAGE',
      label: 'Response Message',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Response Message',
    },
  ];
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Payment Gateway Transaction Report Filter';
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
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
}
