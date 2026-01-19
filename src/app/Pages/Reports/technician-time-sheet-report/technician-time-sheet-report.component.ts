import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
@Component({
  selector: 'app-technician-time-sheet-report',
  templateUrl: './technician-time-sheet-report.component.html',
  styleUrls: ['./technician-time-sheet-report.component.css'],
})
export class TechnicianTimeSheetReportComponent implements OnInit {
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
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }
  datefilter: any = '';
  ngOnInit() {
    this.datefilter =
      " AND date(SCHEDULED_DATE_TIME) BETWEEN  '" +
      this.datepipe.transform(new Date(), 'yyyy-MM-dd') +
      "' AND '" +
      this.datepipe.transform(new Date(), 'yyyy-MM-dd') +
      "'";
    this.searchTechnician('');
    this.getJobCard(this.selectedjob, this.selectedTechnician);
    this.getOrder(this.selectedorder, this.selectedTechnician);
  }
  formTitle = 'Technician Time sheet Report';
  excelData: any = [];
  exportLoading: boolean = false;
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  pageIndex = 1;
  pageIndex1 = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'TECHNICIAN_NAME';
  chapters: any = [];
  loadingRecords = false;
  filteredUnitData: any[] = [];
  filterQuery1: any = '';
  dataList: any = [];
  filterQuery: string = '';
  savedFilters: any[] = [];
  TabId: number;
  isDeleting: boolean = false;
  selectedType: string = 'Job';
  drawerTitle!: string;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  totalRecords = 1;
  selectedDate1: Date;
  columns: string[][] = [
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['EXPECTED_DATE_TIME', 'EXPECTED_DATE_TIME'],
    ['ORDER_NO', 'ORDER_NO'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['SERVICE_NAME', 'SERVICE_NAME'],
    ['WORK_DEVIATION', 'WORK_DEVIATION'],
  ];
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  isSpinning: boolean = false;
  value1: any = '';
  value2: any = '';
  selectedJobs: any;
  selectedOrders: any;
  startdate: Date = new Date();
  enddate: Date = new Date();
  TYPE: any;
  isFilterApplied: any = 'default';
  applyFilter() {
    this.isFilterApplied = 'primary';
    this.loadingRecords = true;
    this.filterQuery = '';
    this.datefilter = '';
    this.pageIndex = 1;
    if (this.startdate != null && this.enddate != null) {
      this.value1 = this.datepipe.transform(this.startdate, 'yyyy-MM-dd');
      this.value2 = this.datepipe.transform(this.enddate, 'yyyy-MM-dd');
      this.filterQuery +=
        " AND date(SCHEDULED_DATE_TIME) BETWEEN  '" +
        this.value1 +
        "' AND '" +
        this.value2 +
        "'";
      this.isFilterApplied = 'primary';
    }
    if (this.selectedTechnician.length > 0) {
      this.filterQuery +=
        ' AND TECHNICIAN_ID IN (' + this.selectedTechnician + ')';
    }
    if (this.selectedjob.length > 0 && this.selectedType == 'Job') {
      this.filterQuery += ' AND JOB_CARD_ID IN (' + this.selectedjob + ')';
    }
    if (this.selectedorder.length > 0 && this.selectedType == 'Order') {
      this.filterQuery += ` AND ORDER_NO IN ('${this.selectedorder}')`;
    }
    this.loadingRecords = false;
    if (this.filterQuery) {
      this.search();
      this.filterClass = 'filter-invisible';
    } else {
      this.message.error('please Select Filter Value', '');
      this.isFilterApplied = 'default';
    }
  }
  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.startdate = new Date();
    this.enddate = new Date();
    this.selectedTechnician = [];
    this.selectedjob = [];
    this.selectedorder = [];
    this.filterQuery = '';
    this.datefilter =
      " AND date(SCHEDULED_DATE_TIME) BETWEEN  '" +
      this.datepipe.transform(new Date(), 'yyyy-MM-dd') +
      "' AND '" +
      this.datepipe.transform(new Date(), 'yyyy-MM-dd') +
      "'";
    this.search();
  }
  onSelectionChange() { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  reset(): void {
    this.searchText = '';
    this.ordernumbertext = '';
    this.servicenametext = '';
    this.jobcardnumbertext = '';
    this.search();
  }
  distinctData: any = [];
  jobData: any = [];
  orderData: any = [];
  selectedTechnician: any = [];
  istechniciannameFilterApplied: boolean = false;
  techniciannameVisible = false;
  isexpectedDateFilterApplied: boolean = false;
  expectedDateVisible = false;
  ordernumbertext: string = '';
  isordernumberFilterApplied: boolean = false;
  ordernumberVisible = false;
  jobcardnumbertext: string = '';
  isjobcardnumberFilterApplied: boolean = false;
  jobcardnumberVisible = false;
  servicenametext: string = '';
  isservicenameFilterApplied: boolean = false;
  servicenameVisible = false;
  isstarttimeFilterApplied: boolean = false;
  starttimeVisible = false;
  isendtimeFilterApplied: boolean = false;
  endtimeVisible = false;
  isscheduledDateTimeFilterApplied: boolean = false;
  scheduledDateTimeVisible = false;
  isendDateTimeFilterApplied: boolean = false;
  enddDateTimeVisible = false;
  isjobcompleteDateFilterApplied: boolean = false;
  jobcompleteDateVisible = false;
  formatTime(time: string): string {
    if (time && /^[0-9]{2}:[0-9]{2}(?::[0-9]{2})?$/.test(time)) {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; 
      return `${this.padZero(hour12)}:${this.padZero(minutes)} ${period}`;
    }
    return '';
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  importInExcel() {
    this.search(true, true);
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isexpectedDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isexpectedDateFilterApplied = false;
    }
  }
  today: Date = new Date();
  StartDate1: any = [];
  EndDate1: any = [];
  onDateRangeChange1(): void {
    if (this.StartDate1 && this.StartDate1.length === 2) {
      const [start, end] = this.StartDate1;
      if (start && end) {
        this.search();
        this.isscheduledDateTimeFilterApplied = true;
      }
    } else {
      this.StartDate1 = null; 
      this.search();
      this.isscheduledDateTimeFilterApplied = false;
    }
  }
  StartDate2: any = [];
  EndDate2: any = [];
  onDateRangeChange2(): void {
    if (this.StartDate2 && this.StartDate2.length === 2) {
      const [start, end] = this.StartDate2;
      if (start && end) {
        this.search();
        this.isendDateTimeFilterApplied = true;
      }
    } else {
      this.StartDate2 = null; 
      this.search();
      this.isendDateTimeFilterApplied = false;
    }
  }
  StartDate3: any = [];
  EndDate3: any = [];
  onDateRangeChange3(): void {
    if (this.StartDate3 && this.StartDate3.length === 2) {
      const [start, end] = this.StartDate3;
      if (start && end) {
        this.search();
        this.isjobcompleteDateFilterApplied = true;
      }
    } else {
      this.StartDate3 = null; 
      this.search();
      this.isjobcompleteDateFilterApplied = false;
    }
  }
  StartTime: Date | null = null; 
  onTimeChange(time: Date | null): void {
    this.isstarttimeFilterApplied = !!time; 
  }
  onTimeChange1(time: Date | null): void {
    this.isendtimeFilterApplied = !!time; 
  }
  onKeyup(keys) {
    if (this.jobcardnumbertext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isjobcardnumberFilterApplied = true;
    } else if (this.jobcardnumbertext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isjobcardnumberFilterApplied = false;
    }
    if (this.servicenametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isservicenameFilterApplied = true;
    } else if (this.servicenametext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isservicenameFilterApplied = false;
    }
    if (this.ordernumbertext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isordernumberFilterApplied = true;
    } else if (this.ordernumbertext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isordernumberFilterApplied = false;
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  listOfFilter: any[] = [
    { text: 'Completed', value: 'Completed' },
    { text: 'Assigned', value: 'Assigned' },
    { text: 'Pending', value: 'Pending' },
  ];
  listOforderstatusFilter: any[] = [
    { text: 'Order Placed', value: 'Order Placed' },
    { text: 'Order Accepted', value: 'Order Accepted' },
    { text: 'Order Rejected', value: 'Order Rejected' },
    { text: 'Order Scheduled', value: 'Order Scheduled' },
    { text: ' Order Ongoing', value: ' Order Ongoing' },
    { text: 'Order Completed', value: 'Order Completed' },
    { text: 'Order Cancelled', value: 'Order Cancelled' },
    {
      text: 'Requested for order reschedule',
      value: 'Requested for order reschedule',
    },
    {
      text: 'Reschedule request approved',
      value: 'Reschedule request approved',
    },
    {
      text: 'Reschedule request rejected',
      value: 'Reschedule request rejected',
    },
    {
      text: 'Requested for order cancellation',
      value: 'Requested for order cancellation',
    },
    {
      text: 'Cancellation request approved',
      value: 'Cancellation request approved',
    },
    {
      text: 'Cancellation request rejected',
      value: 'Cancellation request rejected',
    },
  ];
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus1: string) {
    this.statusFilter1 = selectedStatus1;
    this.search(true);
  }
  isModalVisible = false;
  selectedQuery: string = '';
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  endfromTime: any;
  endtoTime: any;
  endfromTime1;
  endtoTime1;
  fromTime: any;
  toTime: any;
  startfromTime;
  starttoTime;
  onTypeChange(event) {
    if (event == 'Job') {
      this.selectedorder = [];
    } else {
      this.selectedjob = [];
    }
  }
  searchTechnician(searchValue: string): void {
    if (searchValue.length >= 3) {
      var filterCondition = ` AND IS_ACTIVE=1 AND NAME LIKE '%${searchValue}%'`;
      var pageSize = 0;
      var pageindex = 0;
    } else {
      var filterCondition = ' AND IS_ACTIVE=1';
      var pageSize = 10;
      var pageindex = 1;
    }
    this.api
      .getTechnicianData(pageindex, pageSize, 'NAME', 'asc', filterCondition)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.distinctData = data['data'].length > 0 ? data['data'] : [];
        } else {
          this.message.error('Failed To Get Technician Details', '');
          this.distinctData = [];
        }
      });
  }
  onTechnicianChange() {
    this.getJobCard('', this.selectedTechnician);
    this.getOrder('', this.selectedTechnician);
    if (this.selectedTechnician.length > 0) {
      this.selectedjob = this.selectedjob;
      this.selectedorder = this.selectedorder;
    } else {
      this.selectedjob = [];
      this.selectedorder = [];
    }
    this.jobcardData = [];
    this.orderData = [];
    if (this.selectedType == 'Job') {
      this.pageIndex1 = 1;
    } else {
      this.pageIndex2 = 1;
    }
  }
  searchkey1 = '';
  totalrecords1 = 0;
  isLoading1 = false;
  jobcardData: any = [];
  selectedjob: any = [];
  jobfilter: any = '';
  getJobCard(event, techid) {
    event =
      event != '' && event != undefined && event != null
        ? ' AND (JOB_CARD_NO like "%' + event + '%")'
        : '';
    if (
      !this.selectedTechnician ||
      this.selectedTechnician == '' ||
      this.selectedTechnician == undefined ||
      this.selectedTechnician == null
    ) {
      this.jobfilter = event;
    } else {
      this.jobfilter = ' AND TECHNICIAN_ID IN (' + techid + ')' + event;
    }
    this.api
      .getpendinjobsdataa(this.pageIndex1, 8, '', 'asc', this.jobfilter)
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.jobcardData = [...this.jobcardData, ...data['data']];
          this.totalrecords1 = data['count'];
        }
        this.isLoading1 = false;
      });
  }
  gejob(event) {
    this.searchkey1 = event;
    if (event.length >= 3) {
      this.jobcardData = [];
      this.pageIndex1 = 1;
      this.getJobCard(this.searchkey1, this.selectedTechnician);
    }
  }
  loadMore1() {
    if (this.totalrecords1 > this.jobcardData.length) {
      this.pageIndex1++;
      this.getJobCard(this.searchkey1, this.selectedTechnician);
    }
  }
  keyup4(event) {
    if (
      this.searchkey1 == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.jobcardData = [];
      this.pageIndex1 = 1;
      this.getJobCard('', this.selectedTechnician);
    }
  }
  searchkey = '';
  totalrecords = 0;
  isLoading = false;
  selectedorder: any = [];
  pageIndex2 = 1;
  orderfilter: any = '';
  getOrder(event, techid) {
    event =
      event != '' && event != undefined && event != null
        ? ' AND (ORDER_NUMBER like "%' + event + '%")'
        : '';
    if (
      !this.selectedTechnician ||
      this.selectedTechnician == '' ||
      this.selectedTechnician == undefined ||
      this.selectedTechnician == null
    ) {
      this.orderfilter = event;
    } else {
      this.orderfilter = ' AND TECHNICIAN_ID IN (' + techid + ')' + event;
    }
    this.api
      .getDistinctOrderNumbers(this.pageIndex2, 8, '', 'asc', this.orderfilter)
      .subscribe((data) => {
        if (data['status'] == 200 && data.body['data'].length > 0) {
          this.orderData = [...this.orderData, ...data.body['data']];
          this.totalrecords = data.body['count'];
        }
        this.isLoading = false;
      });
  }
  getord(event) {
    this.searchkey = event;
    if (event.length >= 3) {
      this.orderData = [];
      this.pageIndex2 = 1;
      this.getOrder(this.searchkey, this.selectedTechnician);
    }
  }
  loadMore() {
    if (this.totalrecords > this.orderData.length) {
      this.pageIndex2++;
      this.getOrder(this.searchkey, this.selectedTechnician);
    }
  }
  keyup3(event) {
    if (
      this.searchkey == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.orderData = [];
      this.pageIndex2 = 1;
      this.getOrder('', this.selectedTechnician);
    }
  }
  selectedTechnician1: any[] = [];
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  onTechnicianChange1(): void {
    if (this.selectedTechnician1?.length) {
      this.search();
      this.istechniciannameFilterApplied = true; 
    } else {
      this.search();
      this.istechniciannameFilterApplied = false; 
    }
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
      this.sortKey = 'TECHNICIAN_NAME';
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
    let filter: any = {};
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
    if (this.selectedTechnician1?.length) {
      const categories = this.selectedTechnician1.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `TECHNICIAN_ID IN (${categories})`;
      this.istechniciannameFilterApplied = true;
    } else {
      this.istechniciannameFilterApplied = false;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `EXPECTED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isexpectedDateFilterApplied = true;
    } else {
      this.isexpectedDateFilterApplied = false;
    }
    if (this.ordernumbertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.ordernumbertext.trim()}%'`;
      this.isordernumberFilterApplied = true;
    } else {
      this.isordernumberFilterApplied = false;
    }
    if (this.jobcardnumbertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.jobcardnumbertext.trim()}%'`;
      this.isjobcardnumberFilterApplied = true;
    } else {
      this.isjobcardnumberFilterApplied = false;
    }
    if (this.servicenametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_NAME LIKE '%${this.servicenametext.trim()}%'`;
      this.isservicenameFilterApplied = true;
    } else {
      this.isservicenameFilterApplied = false;
    }
    if (this.startfromTime && this.starttoTime) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `START_TIME BETWEEN '${this.startfromTime.trim()}' AND '${this.starttoTime.trim()}'`;
    }
    if (this.endfromTime1 && this.endtoTime1) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `END_TIME BETWEEN '${this.endfromTime1.trim()}' AND '${this.endtoTime1.trim()}'`;
    }
    if (this.StartDate1 && this.StartDate1.length === 2) {
      const [start, end] = this.StartDate1;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isscheduledDateTimeFilterApplied = true;
    } else {
      this.isscheduledDateTimeFilterApplied = false;
    }
    if (this.StartDate2 && this.StartDate2.length === 2) {
      const [start, end] = this.StartDate2;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(END_DATE_TIME) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isendDateTimeFilterApplied = true;
    } else {
      this.isendDateTimeFilterApplied = false;
    }
    if (this.StartDate3 && this.StartDate3.length === 2) {
      const [start, end] = this.StartDate3;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `JOB_COMPLETED_DATETIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isjobcompleteDateFilterApplied = true;
    } else {
      this.isjobcompleteDateFilterApplied = false;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    const finalDataList =
      this.filteredUnitData.length > 0 ? this.filteredUnitData : this.dataList;
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getTechnicianTimeSheetReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.datefilter + likeQuery + this.filterQuery
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
      this.loadingRecords = true;
      this.exportLoading = true;
      this.api
        .getTechnicianTimeSheetReport(
          0,
          0,
          this.sortKey,
          sort,
          this.datefilter + likeQuery + this.filterQuery
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
    const sortField = (currentSort && currentSort.key) || 'TECHNICIAN_NAME';
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
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME'] || '-';
        (obj1['Expected Date Time'] = this.excelData[i]['EXPECTED_DATE_TIME']
          ? this.datepipe.transform(
            this.excelData[i]['EXPECTED_DATE_TIME'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-'),
          (obj1['Order Name'] = this.excelData[i]['ORDER_NO'] || '-');
        obj1['Job Number'] = this.excelData[i]['JOB_CARD_NO'] || '-';
        obj1['Service Name'] = this.excelData[i]['SERVICE_NAME'] || '-';
        obj1['Start Time'] =
          this.formatTime(this.excelData[i]['START_TIME']) || '-';
        obj1['End Time'] =
          this.formatTime(this.excelData[i]['END_TIME']) || '-';
        (obj1['Scheduled Date Time'] = this.excelData[i]['SCHEDULED_DATE_TIME']
          ? this.datepipe.transform(
            this.excelData[i]['SCHEDULED_DATE_TIME'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-'),
          (obj1['End Date Time'] = this.excelData[i]['END_DATE_TIME']
            ? this.datepipe.transform(
              this.excelData[i]['END_DATE_TIME'],
              'dd/MM/yyyy hh:mm a'
            )
            : '-'),
          (obj1['Job Completed Date Time'] = this.excelData[i][
            'JOB_COMPLETED_DATETIME'
          ]
            ? this.datepipe.transform(
              this.excelData[i]['JOB_COMPLETED_DATETIME'],
              'dd/MM/yyyy hh:mm a'
            )
            : '-'),
          (obj1['Total Time'] = this.excelData[i]['TOTAL_TIME'] || '-');
        obj1['Work Deviation'] = this.excelData[i]['WORK_DEVIATION'] || '-';
        obj1['Is Early Or Late ?'] =
          this.excelData[i]['IS_EARLY_OR_LATE'] == 'E' ? 'Early' : 'Late';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Technician Time Sheet Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  updateStartFromTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }
  }
  onTimeFilterChange(): void {
    if (this.fromTime && this.toTime) {
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;
      this.isstarttimeFilterApplied = true;
    } else {
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isstarttimeFilterApplied = false;
    }
    this.search();
  }
  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
      const startHours = this.endfromTime
        .getHours()
        .toString()
        .padStart(2, '0');
      const startMinutes = this.endfromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.endtoTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.endtoTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;
      this.isendtimeFilterApplied = true;
    } else {
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isendtimeFilterApplied = false;
    }
    this.search();
  }
}