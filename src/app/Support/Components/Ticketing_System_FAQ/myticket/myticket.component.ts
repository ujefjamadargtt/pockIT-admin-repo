import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ViewchatticketComponent } from '../viewchatticket/viewchatticket.component';
import { CreateticketComponent } from '../createticket/createticket.component';
import { TicketdetailsComponent } from '../Tickets/ticketdetails/ticketdetails.component';
import {
  Ticket,
  Ticketdetails,
  Ticketgroup,
} from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-myticket',
  templateUrl: './myticket.component.html',
  styleUrls: ['./myticket.component.css'],
  providers: [DatePipe],
})
export class MyticketComponent implements OnInit {
  formTitle = 'Manage Support Tickets';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  userId = sessionStorage.getItem('userId');
  userroleid: any;
  userroleid1: any;
  loadingRecords = true;
  sortValue: string = 'id';
  sortKey: string = 'LAST_RESPONDED';
  searchText: string = '';
  filterQuery: string = '';
  DatefilterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['DEPARTMENT_NAME', 'Department'],
    ['TICKET_NO', 'Ticket No.'],
    ['QUESTION', 'Question'],
    ['IS_TAKEN', 'Is Taken'],
    ['LAST_RESPONDED', 'Last Responded Date'],
    ['STATUS', 'Status'],
  ];
  STATUS = 'U';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  applicationId = 3;
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: any = [];
  dateFormat = 'dd/MM/yyyy';
  @ViewChild(TicketdetailsComponent, { static: false })
  details: TicketdetailsComponent;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Ticket = new Ticket();
  drawerVisible2: boolean;
  drawerTitle2: string;
  drawerData2: Ticket = new Ticket();
  drawerData1: Ticketdetails = new Ticketdetails();
  data1: any = [];
  ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion = {};
  value1: any = '';
  value2: any = '';
  Grpname: string;
  newstr: string;
  newData2: any = [];
  grpid: any = 0;
  GRPNAME: any = '';
  bread: any = [];
  dateFormatMMM = 'dd/MM/yyyy';
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.userroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.userroleid1 = parseInt(this.userroleid, 10);
    this.search();
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
  departmentVisible: boolean = false;
  isnameFilterApplied: boolean = false;
  departmentText: string = '';
  ticketnoVisible: boolean = false;
  isticketnoFilterApplied: boolean = false;
  ticketnoText: string = '';
  questionVisible: boolean = false;
  isquestionFilterApplied: boolean = false;
  questionText: string = '';
  istakenVisible: boolean = false;
  istakenstatusFilterApplied: boolean = false;
  lastrespondedDateVisible: boolean = false;
  isscheduleDateFilterApplied: boolean = false;
  lastDateText: string = '';
  StartDate: any = [];
  EndDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isscheduleDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isscheduleDateFilterApplied = false;
    }
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  listOfststusFilter: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Closed', value: 'C' },
    { text: 'Assigned', value: 'S' },
    { text: 'Answered', value: 'R' },
    { text: 'Re-Open', value: 'O' },
    { text: 'Banned', value: 'B' },
    { text: 'On-Hold', value: 'H' },
  ];
  reset() {
    this.departmentText = '';
    this.ticketnoText = '';
    this.questionText = '';
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.departmentText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.departmentText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.ticketnoText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isticketnoFilterApplied = true;
    } else if (this.ticketnoText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isticketnoFilterApplied = false;
    }
    if (this.questionText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isquestionFilterApplied = true;
    } else if (this.questionText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isquestionFilterApplied = false;
    }
  }
  disabledDate = (current: Date): boolean => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const currentDate = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    );
    today.setHours(0, 0, 0, 0);
    oneMonthAgo.setHours(0, 0, 0, 0);
    return currentDate > today;
  };
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
  clearFilter() {
    this.STATUS = 'U';
    this.filterClass = 'filter-invisible';
    this.filterQuery = '';
    this.selectedDate = '';
    this.dataList = [];
    this.searchText = '';
    this.DatefilterQuery = '';
    this.search(true);
  }
  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  search(reset: boolean = false) {
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
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var filterQuery =
      ' AND USER_ID=' + this.commonFunction.decryptdata(this.userId || '');
    if (this.STATUS == 'AL') {
      filterQuery = filterQuery;
    } else if (this.STATUS == 'U') {
      filterQuery += "  AND STATUS in ('P','S','O','B','H')";
    } else {
      filterQuery += " AND STATUS='" + this.STATUS + "'";
    }
    var filterQuery5 = '';
    if (this.departmentText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `DEPARTMENT_NAME LIKE '%${this.departmentText.trim()}%'`;
    }
    if (this.ticketnoText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `TICKET_NO LIKE '%${this.ticketnoText.trim()}%'`;
    }
    if (this.questionText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `QUESTION LIKE '%${this.questionText.trim()}%'`;
    }
    if (this.statusFilter) {
      if (filterQuery5 !== '') {
        filterQuery5 += ' AND ';
      }
      filterQuery5 += `IS_TAKEN = ${this.statusFilter}`;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        filterQuery5 +=
          (filterQuery5 ? ' AND ' : '') +
          `LAST_RESPONDED BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isscheduleDateFilterApplied = true;
    } else {
      this.isscheduleDateFilterApplied = false;
    }
    filterQuery5 = filterQuery5 ? ' AND ' + filterQuery5 : '';
    if (filterQuery != undefined) this.loadingRecords = true;
    this.api
      .getAllTickets(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filterQuery5 + likeQuery + filterQuery + this.DatefilterQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
          } else {
            this.dataList = [];
            this.message.error(`Something went wrong.`, '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
          }
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  searchSet(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
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
  showFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  formattedStartDate: any;
  formattedEndDate: any;
  dateRangeQuery: any;
  formatDatabaseDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  formatDatabaseDate1(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd 23:59:59') || '';
  }
  applyFilter() {
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    if (this.selectedDate && this.selectedDate.length === 2) {
      const startDate = this.selectedDate[0];
      const endDate = this.selectedDate[1];
      this.formattedStartDate = this.formatDatabaseDate(startDate);
      this.formattedEndDate = this.formatDatabaseDate1(endDate);
      this.dateRangeQuery = `AND DATE BETWEEN '${this.formattedStartDate}' AND '${this.formattedEndDate}'`;
      if (this.dateRangeQuery != null && this.dateRangeQuery !== '') {
        this.DatefilterQuery = this.dateRangeQuery;
      }
    }
    this.search();
    this.filterClass = 'filter-invisible';
  }
  uniqueDateArry: any = [];
  @ViewChild(ViewchatticketComponent, { static: false })
  ViewchatticketComponentVar: ViewchatticketComponent;
  ngAfterViewInit() {
    if (this.ViewchatticketComponentVar) {
    } else {
    }
  }
  ViewDetails(data: Ticket) {
    this.isSpinning = true;
    this.newData2 = [];
    this.data1 = [];
    this.uniqueDateArry = [];
    this.drawerTitle = 'Ticket No. ' + data.TICKET_NO;
    this.drawerData = Object.assign({}, data);
    var filterQuery1 = ' AND TICKET_MASTER_ID = ' + data.ID + '';
    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filterQuery1)
      .subscribe(
        (data: HttpResponse<any>) => {
          if (data.status == 200) {
            data = data.body;
            this.totalRecords = data['count'];
            this.data1 = data['data'];
            this.isSpinning = false;
            if (data['count'] > 0) {
              this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            } else {
              this.grpid = 0;
            }
            for (var i = 0; i < this.data1.length; i++) {
              this.uniqueDateArry.push(
                this.datePipe.transform(
                  this.data1[i]['CREATED_MODIFIED_DATE'],
                  'yyyy-MM-dd'
                )
              );
            }
            this.uniqueDateArry = [...new Set(this.uniqueDateArry)];
            this.uniqueDateArry.sort();
            this.uniqueDateArry.forEach((d1) => {
              this.newData2.push({
                key: d1,
                data: this.data1.filter(
                  (data) =>
                    this.datePipe.transform(
                      data.CREATED_MODIFIED_DATE,
                      'yyyy-MM-dd'
                    ) == d1
                ),
              });
            });
            this.data1 = this.newData2;
            this.api
              .getBreadInChat(0, 0, 'ID', 'desc', '', '', this.grpid)
              .subscribe(
                (data: HttpResponse<any>) => {
                  if (data.status == 200) {
                    data = data.body;
                    this.bread = data['data'];
                    this.newstr = '';
                    this.GRPNAME = '';
                    for (var i = 0; i < this.bread.length; i++) {
                      this.GRPNAME =
                        this.GRPNAME + '>' + this.bread[i]['VALUE'];
                      var str = this.GRPNAME;
                      this.newstr = str.replace('>', '');
                    }
                  }
                },
                (err) => {
                }
              );
          }
          this.isSpinning = false;
        },
        (err) => {
        }
      );
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  @ViewChild(CreateticketComponent, { static: false })
  CreateticketComponentVar: CreateticketComponent;
  add() {
    this.isSpinning = true;
    this.index = 0;
    var filterQuery = " AND PARENT_ID=0 AND TYPE='Q'";
    this.api.getAllTicketGroups(0, 0, 'id', 'ASC', filterQuery).subscribe(
      (response: HttpResponse<any>) => {
        const ticketGroups = response.status;
        this.isSpinning = true;
        if (response.status == 200) {
          if (response.body.data[0]?.length == 0) {
            this.ticketQuestion = {};
            this.ticketGroups = [];
            this.isSpinning = false;
          } else {
            this.ticketQuestion = response.body.data[0];
            var filterQuery2 =
              ' AND PARENT_ID=' + response.body.data[0]['ID'] + " AND TYPE='O'";
            this.api
              .getAllTicketGroups(
                0,
                0,
                'SEQ_NO',
                'ASC',
                filterQuery2 + ' AND STATUS=1 '
              )
              .subscribe((ticketGroups) => {
                this.ticketGroups = ticketGroups.body.data;
                this.isSpinning = false;
              });
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      }
    );
    this.drawerVisible2 = true;
    this.drawerTitle2 = 'Create New Ticket';
    this.drawerData2 = new Ticket();
  }
  drawerClose1(): void {
    this.search();
    this.drawerVisible2 = false;
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  changeRadioButton(event) {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.applyFilter();
  }
  onTicketDeleteCancel() { }
  onTicketDeleteConfirm(data: Ticket) {
    data.STATUS = 'C';
    this.api
      .updateTicketGroup(data)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;
        if (statusCode === 200) {
          this.message.success('Ticket Closed successfully', '');
          this.STATUS = 'U';
          this.applyFilter();
          this.isSpinning = false;
        } else {
          this.STATUS = 'U';
          this.applyFilter();
          this.message.error('Failed to Ticket Close', '');
          this.isSpinning = false;
        }
      });
  }
  closeTicket() {
    this.api.autoCloseTicket().subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.message.success('Ticket Closed successfully', '');
        } else {
          this.message.error('Failed to Ticket Close', '');
        }
      },
      (err) => {
        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }
}
