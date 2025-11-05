import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-techniciansla-report',
  templateUrl: './techniciansla-report.component.html',
  styleUrls: ['./techniciansla-report.component.css'],
})
export class TechnicianslaReportComponent {
  formTitle = 'Technician Pending Job Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  supportUsers = [];
  SUPPORT_USERS: any = [];
  columns: string[][] = [
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['ORDER_NO', 'ORDER_NO'],
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['TECHNICIAN_MOBILE_NO', 'TECHNICIAN_MOBILE_NO'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['CUSTOMER_MOBILE_NUMBER', 'CUSTOMER_MOBILE_NUMBER'],
    ['CUSTOMER_TYPE', 'CUSTOMER_TYPE'],
    ['TERRITORY_NAME', 'TERRITORY_NAME'],
    ['SERVICE_NAME', 'SERVICE_NAME'],
    ['SERVICE_AMOUNT', 'SERVICE_AMOUNT'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';
  today = new Date();
  // current = new Date()

  CurrentValue: any = new Date();
  START_DATE: any = new Date();
  END_DATE: any = new Date();

  endOpen = false;
  startOpen = false;

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

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedDate[0] = new Date();
    this.selectedDate[1] = new Date();

    this.search();
  }

  back() {
    this.router.navigate(['/masters/menu']);
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }
  // startOpen: boolean = false

  onStartChange(date: Date): void {
    this.START_DATE = date;
  }
  onEndChange(date: Date): void {
    this.END_DATE = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  disabledStartDate = (START_DATE: Date): boolean => {
    if (!START_DATE || !this.END_DATE) {
      return false;
    }
    return START_DATE.getTime() > this.END_DATE;
  };

  current = new Date();

  disabledEndDate = (END_DATE: Date): boolean => {
    if (!END_DATE) {
      return false;
    }

    var previousDate = new Date(this.START_DATE);
    previousDate.setDate(previousDate.getDate() + -1);

    return END_DATE <= new Date(previousDate);
  };

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  // START_DATE: any = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd')
  // END_DATE: any = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd')

  applyFilter() {
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');

    var filter = '';
    filter = this.filterQuery;
    var likeQuery = '';

    // if (this.SUPPORT_USERS != null || this.SUPPORT_USERS.length > 0 ) {
    //   this.USER_ID = this.SUPPORT_USERS
    // }
    if (this.START_DATE != null) {
      this.START_DATE = this.START_DATE;
    }
    if (this.END_DATE != null) {
      this.END_DATE = this.END_DATE;
    }

    this.search(true);
    this.isFilterApplied = 'primary';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    // this.START_DATE = '';
    // this.END_DATE = '';
    this.START_DATE = new Date();
    this.END_DATE = new Date();
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    this.selectedDate[0] = new Date();
    this.selectedDate[1] = new Date();

    this.search(true);
  }
  branchData = [];
  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  onKeyup(event: KeyboardEvent, eventttt: any): void {
    if (
      this.JobCardNoText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'JobCardNoText'
    ) {
      this.search();
      this.isJobCardNoFilterApplied = true;
    } else if (
      this.JobCardNoText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'JobCardNoText'
    ) {
      this.search();
      this.isJobCardNoFilterApplied = false;
    }

    if (
      this.OrderNoText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'OrderNoText'
    ) {
      this.search();
      this.isOrderNoFilterApplied = true;
    } else if (
      this.OrderNoText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'OrderNoText'
    ) {
      this.search();
      this.isOrderNoFilterApplied = false;
    }

    if (
      this.TechnicianNameText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'TechnicianNameText'
    ) {
      this.search();
      this.isTechnicianNameFilterApplied = true;
    } else if (
      this.TechnicianNameText.length == 0 &&
      eventttt == 'TechnicianNameText' &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isTechnicianNameFilterApplied = false;
    }

    if (
      this.TechMobText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'TechMobText'
    ) {
      this.search();
      this.isTechMobFilterApplied = true;
    } else if (
      this.TechMobText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'TechMobText'
    ) {
      this.search();
      this.isTechMobFilterApplied = false;
    }

    if (
      this.CustNameText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'CustText'
    ) {
      this.search();
      this.isCustNameFilterApplied = true;
    } else if (
      this.CustNameText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'CustText'
    ) {
      this.search();
      this.isCustNameFilterApplied = false;
    }

    if (
      this.CustMobileText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'CustMobileText'
    ) {
      this.search();
      this.isCustMobFilterApplied = true;
    } else if (
      this.CustMobileText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'CustMobileText'
    ) {
      this.search();
      this.isCustMobFilterApplied = false;
    }

    if (
      this.CustTypeText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'CustTypeText'
    ) {
      this.search();
      this.isCustTypeFilterApplied = true;
    } else if (
      this.CustTypeText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'CustTypeText'
    ) {
      this.search();
      this.isCustTypeFilterApplied = false;
    }

    if (
      this.TerritoryNameText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'TerritoryNameText'
    ) {
      this.search();
      this.isTerritoryNameFilterApplied = true;
    } else if (
      this.TerritoryNameText.length == 0 &&
      eventttt == 'TerritoryNameText' &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isTerritoryNameFilterApplied = false;
    }

    if (
      this.ServiceNameText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'ServiceNameText'
    ) {
      this.search();
      this.isServiceFilterApplied = true;
    } else if (
      this.ServiceNameText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'ServiceNameText'
    ) {
      this.search();
      this.isServiceFilterApplied = false;
    }

    if (
      this.ServiceAmountText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'ServiceAmountText'
    ) {
      this.search();
      this.isServiceAmountFilterApplied = true;
    } else if (
      this.ServiceAmountText.length == 0 &&
      eventttt == 'ServiceAmountText' &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isServiceAmountFilterApplied = false;
    }

    if (
      this.ServiceAddressText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'ServiceAddressText'
    ) {
      this.search();
      this.isServiceAddressFilterApplied = true;
    } else if (
      this.ServiceAddressText.length == 0 &&
      eventttt == 'ServiceAddressText' &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isServiceAddressFilterApplied = false;
    }

    if (
      this.RemarkText.length >= 3 &&
      event.key === 'Enter' &&
      eventttt == 'RemarkText'
    ) {
      this.search();
      this.isRemarkFilterApplied = true;
    } else if (
      this.RemarkText.length == 0 &&
      event.key === 'Backspace' &&
      eventttt == 'RemarkText'
    ) {
      this.search();
      this.isRemarkFilterApplied = false;
    }
  }

  reset() {
    this.JobCardNoText = '';
    this.jobcardDateText = null;
    this.RemarkText = '';

    this.AssignedDateText = '';
    this.JobDateText = '';
    this.CustMobileText = '';
    this.CustTypeText = '';
    this.OrderNoText = '';
    this.ServiceAddressText = '';
    this.ServiceNameText = '';
    this.CustMobileText = '';
    this.TerritoryNameText = '';
    this.ServiceAddressText = '';
    this.scheduledDateText = null;
    this.AssignedDateText = null;
    this.JobDateText = null;
    this.AssignedDateVisible = false;
    this.JobDateVisible = false;
    this.scheduledDateVisible = false;
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    // var likeQuery = '';
    // if (this.searchText != '') {
    //   likeQuery = ' AND (';

    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    //   likeQuery = likeQuery + ')';
    // }
    let likeQuery = '';
    let globalSearchQuery = '';

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

    var filterQuery = '';

    if (this.JobCardNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.JobCardNoText.trim()}%'`;
      this.isJobCardNoFilterApplied = true;
    } else {
      this.isJobCardNoFilterApplied = false;
    }

    if (this.OrderNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.OrderNoText.trim()}%'`;
      this.isOrderNoFilterApplied = true;
    } else {
      this.isOrderNoFilterApplied = false;
    }

    if (this.TechnicianNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.TechnicianNameText.trim()}%'`;
      this.isTechnicianNameFilterApplied = true;
    } else {
      this.isTechnicianNameFilterApplied = false;
    }

    if (this.TechMobText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_MOBILE_NO LIKE '%${this.TechMobText.trim()}%'`;
      this.isTechMobFilterApplied = true;
    } else {
      this.isTechMobFilterApplied = false;
    }

    if (this.CustNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.CustNameText.trim()}%'`;
      this.isCustNameFilterApplied = true;
    } else {
      this.isCustNameFilterApplied = false;
    }

    if (this.CustMobileText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_MOBILE_NUMBER LIKE '%${this.CustMobileText.trim()}%'`;
      this.isCustMobFilterApplied = true;
    } else {
      this.isCustMobFilterApplied = false;
    }

    if (this.CustTypeText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_TYPE LIKE '%${this.CustTypeText.trim()}%'`;
      this.isCustTypeFilterApplied = true;
    } else {
      this.isCustTypeFilterApplied = false;
    }

    if (this.TerritoryNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TERRITORY_NAME LIKE '%${this.TerritoryNameText.trim()}%'`;
      this.isTerritoryNameFilterApplied = true;
    } else {
      this.isJobCardNoFilterApplied = false;
    }

    if (this.ServiceNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_NAME LIKE '%${this.ServiceNameText.trim()}%'`;
      this.isServiceFilterApplied = true;
    } else {
      this.isServiceFilterApplied = false;
    }

    if (this.ServiceAmountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_AMOUNT LIKE '%${this.ServiceAmountText.trim()}%'`;
      this.isJobCardNoFilterApplied = true;
    } else {
      this.isJobCardNoFilterApplied = false;
    }

    if (this.ServiceAddressText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_ADDRESS LIKE '%${this.ServiceAddressText.trim()}%'`;
      this.isServiceAddressFilterApplied = true;
    } else {
      this.isServiceAddressFilterApplied = false;
    }

    if (this.RemarkText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REMARK LIKE '%${this.RemarkText.trim()}%'`;
      this.isRemarkFilterApplied = true;
    } else {
      this.isRemarkFilterApplied = false;
    }

    var dateeefilter = '';
    if (this.selectedDate.length == 2) {
      dateeefilter =
        " AND  DATE (JOB_CREATED_DATE) BETWEEN '" +
        this.datePipe.transform(this.selectedDate[0], 'yyyy-MM-dd') +
        "' AND' " +
        this.datePipe.transform(this.selectedDate[1], 'yyyy-MM-dd') +
        "'";
    }

    // if (this.assignedselectedDate.length == 2) {
    //   likeQuery +=
    //     "DATE (ASSIGNED_DATE) BETWEEN '" +
    //     this.datePipe.transform(this.assignedselectedDate[0], 'yyyy-MM-dd') +
    //     "' AND' " +
    //     this.datePipe.transform(this.assignedselectedDate[1], 'yyyy-MM-dd') +
    //     "'";
    // }

    if (this.createdDate && this.createdDate.length === 2) {
      const [start, end] = this.createdDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `ASSIGNED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `JOB_CREATED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    if (this.sheduledDate && this.sheduledDate.length === 2) {
      const [start, end] = this.sheduledDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    // if (this.scheduledselectedDate.length == 2) {
    //   likeQuery +=
    //     "DATE (SCHEDULED_DATE_TIME) BETWEEN '" +
    //     this.datePipe.transform(this.scheduledselectedDate[0], 'yyyy-MM-dd') +
    //     "' AND' " +
    //     this.datePipe.transform(this.scheduledselectedDate[1], 'yyyy-MM-dd') +
    //     "'";
    // }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CUSTOMER_TYPE = '${this.statusFilter}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.isSpinning = true;
      this.api
        .getTechnicianSLAReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateeefilter
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['body']['count'];
              this.TabId = data['body']['TAB_ID'];
              this.dataList = data['body']['data'];

              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.loadingRecords = false;
            } else if (data['status'] == 400) {

              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.loadingRecords = false;
              this.dataList = [];
            }
          },
          (err) => {
            this.message.error('Server Not Found', '');
            this.loadingRecords = false;
          }
        );
    } else {
      this.exportLoading = true;

      this.api
        .getTechnicianSLAReport(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateeefilter
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.TabId = data['body']['TAB_ID'];
              this.branchData = data['body']['data'];

              if (this.branchData.length > 0) {
                this.convertInExcel();
              } else {
                this.message.info('no data', '');
              }

              this.exportLoading = false;
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.exportLoading = false;
          }
        );
    }
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.branchData.length; i++) {
      obj1['Job Created Date'] = this.branchData[i]['JOB_CREATED_DATE']
        ? this.datePipe.transform(
          this.branchData[i]['JOB_CREATED_DATE'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';
      obj1['Job No.'] = this.branchData[i]['JOB_CARD_NO'];
      obj1['Order No'] = this.branchData[i]['ORDER_NO'];
      obj1['Scheduled Date'] = this.branchData[i]['SCHEDULED_DATE_TIME']
        ? this.datePipe.transform(
          this.branchData[i]['SCHEDULED_DATE_TIME'],
          'dd/MM/yyyy'
        )
        : '-';
      obj1['Technician Name'] = this.branchData[i]['TECHNICIAN_NAME'];
      obj1['Technician Mobile No'] = this.branchData[i]['TECHNICIAN_MOBILE_NO'];
      obj1['Assigned Date'] = this.branchData[i]['ASSIGNED_DATE']
        ? this.datePipe.transform(
          this.branchData[i]['ASSIGNED_DATE'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';
      obj1['Customer Name'] = this.branchData[i]['CUSTOMER_NAME'];
      obj1['Customer Mobile'] = this.branchData[i]['CUSTOMER_MOBILE_NUMBER'];
      obj1['Customer Type'] = this.branchData[i]['CUSTOMER_TYPE'];
      if (this.branchData[i]['CUSTOMER_TYPE'] == 'I') {
        obj1['Customer Type'] = 'Individual(B2C)';
      } else if (this.branchData[i]['CUSTOMER_TYPE'] == 'B') {
        obj1['Customer Type'] = 'Business(B2B)';
      }

      obj1['Territory Name'] = this.branchData[i]['TERRITORY_NAME'];
      obj1['Service Name'] = this.branchData[i]['SERVICE_NAME'];
      obj1['Service Amount'] = this.branchData[i]['SERVICE_AMOUNT'];
      obj1['Service Address'] = this.branchData[i]['SERVICE_ADDRESS'];
      // obj1['Remark'] = this.branchData[i]['REMARK'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.branchData.length - 1) {
        this._exportService.exportExcel1(
          arry1,
          'Technician Pending Job Report ' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }

  JobCreatedVisible: boolean = false;
  isJobCreatedFilterApplied: boolean = false;
  jobcardDateText: any = null;

  JobCardNoVisible: boolean = false;
  isJobCardNoFilterApplied: boolean = false;
  JobCardNoText: string = '';

  OrderNoVisible: boolean = false;
  isOrderNoFilterApplied: boolean = false;
  OrderNoText: string = '';

  TechnicianNameVisible: boolean = false;
  isTechnicianNameFilterApplied: boolean = false;
  TechnicianNameText: string = '';

  TechMobVisible: boolean = false;
  isTechMobFilterApplied: boolean = false;
  TechMobText: string = '';

  AssignedDateVisible: boolean = false;
  isAssignedDateFilterApplied: boolean = false;
  AssignedDateText: any = null;

  JobDateVisible: boolean = false;
  isJobDateFilterApplied: boolean = false;
  JobDateText: any = null;

  selectedDateText: any = null;

  scheduledDateVisible: boolean = false;
  isScheduledDateFilterApplied: boolean = false;
  scheduledDateText: any = null;

  CustMobVisible: boolean = false;
  isCustMobFilterApplied: boolean = false;
  CustNameText: string = '';

  CustNameVisible: boolean = false;
  isCustNameFilterApplied: boolean = false;
  CustMobileText: string = '';

  CustTypeVisible: boolean = false;
  isCustTypeFilterApplied: boolean = false;
  CustTypeText: string = '';

  TerritoryNameVisible: boolean = false;
  isTerritoryNameFilterApplied: boolean = false;
  TerritoryNameText: string = '';

  ServiceVisible: boolean = false;
  isServiceFilterApplied: boolean = false;
  ServiceNameText: string = '';

  ServiceAmountVisible: boolean = false;
  isServiceAmountFilterApplied: boolean = false;
  ServiceAmountText: string = '';

  ServiceAddressVisible: boolean = false;
  isServiceAddressFilterApplied: boolean = false;
  ServiceAddressText: string = '';

  RemarkVisible: boolean = false;
  isRemarkFilterApplied: boolean = false;
  RemarkText: string = '';

  selectedDate: any = [];

  assignedselectedDate: any = [];
  jobselectedDate: any = [];

  scheduledselectedDate: any = [];

  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: 'Individual(B2C)', value: 'I' },
    { text: 'Business(B2B)', value: 'B' },
  ];

  onTypeFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onassignedDateChange(assignedselectedDate: any): void {
    if (this.AssignedDateText && this.AssignedDateText.length === 2) {
      this.search();
    } else {
      this.AssignedDateText = null;
      this.search();
    }
  }
  sheduledDateVisible = false;
  issheduledDateFilterApplied: boolean = false;
  sheduledDate: any = [];
  onsheduledDateRangeChange(): void {
    if (this.sheduledDate && this.sheduledDate.length === 2) {
      const [start, end] = this.sheduledDate;
      if (start && end) {
        this.search();
        this.issheduledDateFilterApplied = true;
      }
    } else {
      this.sheduledDate = null;
      this.search();
      this.issheduledDateFilterApplied = false;
    }
  }

  submittedDateVisible = false;
  isSubmittedDateFilterApplied: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isSubmittedDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; // or [] if you prefer
      this.search();
      this.isSubmittedDateFilterApplied = false;
    }
  }
  createdDateVisible = false;
  iscreatedDateFilterApplied: boolean = false;
  createdDate: any = [];
  oncreatedDateRangeChange(): void {
    if (this.createdDate && this.createdDate.length === 2) {
      const [start, end] = this.createdDate;
      if (start && end) {
        this.search();
        this.iscreatedDateFilterApplied = true;
      }
    } else {
      this.createdDate = null;
      this.search();
      this.iscreatedDateFilterApplied = false;
    }
  }

  onscheduledselectedDateChange(scheduledselectedDate: any): void {
    if (this.scheduledDateText && this.scheduledDateText.length === 2) {
      this.search();
    } else {
      this.scheduledDateText = null;
      this.search();
    }
  }

  onselectedDateChange(selectedDate: any): void {
    if (this.selectedDateText && this.selectedDateText.length === 2) {
      this.search();
    } else {
      this.selectedDateText = null;
      this.search();
    }
  }

  //New Filter

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  savedFilters: any[] = [];
  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
  selectedFilter: string | null = null;
  isDeleting: boolean = false;
  filterData: any;
  currentClientId = 1;
  oldFilter: any[] = [];
  isModalVisible = false;
  selectedQuery: string = '';
  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  drawerTitle!: string;

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

  applyfilter(item) {
    //
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
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

  openfilter() {
    this.drawerTitle = 'Technician Pending Job Report Filter';
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

  filterFields: any[] = [
    {
      key: 'JOB_CREATED_DATE',
      label: 'Job Created Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Job Created Date',
    },

    {
      key: 'JOB_CARD_NO',
      label: 'Job No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job No',
    },
    {
      key: 'ORDER_NO',
      label: 'Order No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order No',
    },
    {
      key: 'SCHEDULED_DATE_TIME',
      label: 'Scheduled Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Scheduled Date',
    },
    {
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Name',
    },
    {
      key: 'TECHNICIAN_MOBILE_NO',
      label: 'Technician Mobile No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Mobile No',
    },

    {
      key: 'ASSIGNED_DATE',
      label: 'Assigned Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Assigned Date',
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
      key: 'CUSTOMER_MOBILE_NUMBER',
      label: 'Customer Mobile No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Mobile No',
    },

    {
      key: 'CUSTOMER_TYPE',
      label: 'Customer Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'I', display: 'Individual(B2C)' },
        { value: 'B', display: 'Business(B2B)' },
      ],
      placeholder: 'Select Customer Type',
    },
    {
      key: 'TERRITORY_NAME',
      label: 'Territory Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Territory Name',
    },
    {
      key: 'SERVICE_NAME',
      label: 'Service Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Name',
    },
    {
      key: 'SERVICE_AMOUNT',
      label: 'Service Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Amount',
    },
    {
      key: 'SERVICE_ADDRESS',
      label: 'Service Address',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Address',
    },
  ];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

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
