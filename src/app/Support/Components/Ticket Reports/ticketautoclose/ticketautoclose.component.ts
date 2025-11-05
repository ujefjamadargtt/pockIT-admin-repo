import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

// import { ChattdetailsicketComponent } from '../chattdetailsicket/chattdetailsicket.component';
import { Ticket } from 'src/app/Support/Models/TicketingSystem';
import { Router } from '@angular/router';
// import { ChattdetailsicketComponent } from '../../Reports/chattdetailsicket/chattdetailsicket.component';

@Component({
  selector: 'app-ticketautoclose',
  templateUrl: './ticketautoclose.component.html',
  styleUrls: ['./ticketautoclose.component.css'],
})
export class TicketautocloseComponent implements OnInit {
  formTitle = 'Employee Wise Ticket Auto Close Detailed Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  supportUsers = [];
  supportAgents = [];
  TAKEN_BY_USER_ID: any = [];
  branches = [];
  TICKET_GENERATOR_BRANCH_ID = [];
  columns: string[][] = [
    ['CREATER_NAME', 'Creator'],
    ['TICKET_NO', 'Ticket No.'],
    ['DATE', 'Date'],
    ['LAST_RESPONDED', 'Last Response Date'],
    ['TICKET_TAKEN_EMPLOYEE', 'Support Agent'],
    ['TICKET_TAKEN_DEPARTMENT', 'Agent Department'],
  ];

  drawerVisible: boolean;
  drawerTitle: string;
  // drawerData: Ticket = new Ticket();
  uniqueDateArry: any = [];
  newData2: any = [];
  data1: any = [];
  // userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  USER_ID: any = [];
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  today = new Date();
  CurrentValue: any = new Date();

  // startValue: any = new Date(
  //   this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
  // );
  // endValue: any = new Date();
  START_DATE: any = new Date();
  END_DATE: any = new Date();
  endOpen = false;
  startOpen = false;

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSupportUsers();
    this.getSupportAgents();
    // this.getBranches();
    this.search();
  }

  keyup(event: any) {
    this.search(true);
  }

  reset(): void {
    this.searchText = '';
  }

  StartDate: any;

  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isdateFilterApplied = true;
      }
    } else {
      this.StartDate = null; // or [] if you prefer
      this.search();
      this.isdateFilterApplied = false;
    }
  }

  StartDate1: any;
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  onDateRangeChange1(): void {
    if (this.StartDate1 && this.StartDate1.length === 2) {
      const [start, end] = this.StartDate1;
      if (start && end) {
        this.search();
        // this.isdateFilterApplied = true;
      }
    } else {
      this.StartDate1 = null; // or [] if you prefer
      this.search();
      // this.isdateFilterApplied = false;
    }
  }

  creatornameText: string = '';
  iscreatornameFilterApplied: boolean = false;
  creatornameVisible = false;

  ticketnoText: string = '';
  isticketnoFilterApplied: boolean = false;
  ticketnoVisible = false;

  isdateFilterApplied: boolean = false;
  dateVisible = false;

  islastdateFilterApplied: boolean = false;
  lastdateVisible = false;

  empText: string = '';
  isempFilterApplied: boolean = false;
  empVisible = false;

  deptText: string = '';
  isdeptFilterApplied: boolean = false;
  deptVisible = false;

  onKeyup(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }

    if (this.creatornameText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscreatornameFilterApplied = true;
    } else if (this.creatornameText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscreatornameFilterApplied = false;
    }

    if (this.ticketnoText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isticketnoFilterApplied = true;
    } else if (this.ticketnoText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isticketnoFilterApplied = false;
    }

    if (this.empText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isempFilterApplied = true;
    } else if (this.empText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isempFilterApplied = false;
    }

    if (this.deptText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isdeptFilterApplied = true;
    } else if (this.deptText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isdeptFilterApplied = false;
    }
  }
  getSupportUsers() {
    this.supportUsers = [];
    this.userId = sessionStorage.getItem('userId');
    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.USER_ID = parseInt(this.decrepteduserIDString, 10);

    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'id',
        'asc',
        ' AND BACKOFFICE_ID=' + this.USER_ID
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.supportUsers = data.body['data'];
            // this.onSelectAllChecked(true);
            // this.getSupportAgents();
          }
        },
        (err) => { }
      );
  }

  SELECT_ALL: boolean = false;
  onSelectAllChecked(event) {
    this.SELECT_ALL = event;

    //
    let ids = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.supportUsers.length; i++) {
        ids.push(this.supportUsers[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.USER_ID = ids;
  }

  onSelectOff(event) {
    var a = this.supportUsers.length;
    var b = this.supportUsers.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL = false;
    } else {
      this.SELECT_ALL = true;
    }
    this.USER_ID = event;
    if (this.USER_ID.length == 0) {
      this.SELECT_ALL = false;
    }
  }
  USER_ID2: any = [];
  getSupportAgents() {
    this.supportAgents = [];

    this.userId = sessionStorage.getItem('userId');
    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.USER_ID = parseInt(this.decrepteduserIDString, 10);
    // this.api.getbackOfficeDepartmentMapping(0, 0, 'NAME', 'asc', ' AND ID!=1 AND ID IN (SELECT EMPLOYEE_ID from view_employee_role_mapping where ORG_ID=' + this.cookie.get('orgId') + ' AND ROLE_ID=4)').subscribe(data => {
    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'id',
        'asc',
        ' AND BACKOFFICE_ID=' + this.USER_ID
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.supportAgents = data.body['data'];
            // this.onSelectAllChecked1(true);
            // this.getBranches();
          }
        },
        (err) => { }
      );
  }

  SELECT_ALL1: boolean = false;
  onSelectAllChecked1(event) {
    this.SELECT_ALL1 = event;
    //
    let ids = [];
    if (this.SELECT_ALL1 == true) {
      for (var i = 0; i < this.supportAgents.length; i++) {
        ids.push(this.supportAgents[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.TAKEN_BY_USER_ID = ids;
  }

  onSelectOff1(event) {
    var a = this.supportAgents.length;
    var b = this.supportAgents.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL1 = false;
    } else {
      this.SELECT_ALL1 = true;
    }
    this.TAKEN_BY_USER_ID = event;
    if (this.TAKEN_BY_USER_ID.length == 0) {
      this.SELECT_ALL1 = false;
    }
  }

  // getBranches() {
  //   this.branches = [];

  //   this.api.getAllBranch(0, 0, 'NAME', 'ASC', ' AND ORG_ID=' + this.cookie.get('orgId')).subscribe(data => {
  //     if (data['status'] == 200) {
  //       this.branches = data.body['data'];
  //       // this.onSelectAllCheckedBranch(true);
  //       // this.search(true);
  //     }

  //   }, err => {
  //
  //   });
  // }

  SELECT_ALL_Branch: boolean = false;
  onSelectAllCheckedBranch(event) {
    this.SELECT_ALL_Branch = event;
    //
    let ids = [];
    if (this.SELECT_ALL_Branch == true) {
      for (var i = 0; i < this.branches.length; i++) {
        ids.push(this.branches[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.TICKET_GENERATOR_BRANCH_ID = ids;
  }
  onSelectOffBrach(event) {
    var a = this.branches.length;
    var b = this.branches.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL_Branch = false;
    } else {
      this.SELECT_ALL_Branch = true;
    }
    this.TICKET_GENERATOR_BRANCH_ID = event;
    if (this.TICKET_GENERATOR_BRANCH_ID.length == 0) {
      this.SELECT_ALL_Branch = false;
    }
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

  FROM_DATE: any = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
  TO_DATE: any = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');

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

    if (this.START_DATE != null) {
      this.FROM_DATE = this.START_DATE;
    }
    if (this.END_DATE != null) {
      this.TO_DATE = this.END_DATE;
    }

    this.search(true);
    this.isFilterApplied = 'primary';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.START_DATE = new Date();
    this.END_DATE = new Date();
    this.FROM_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.TO_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    this.USER_ID = [];
    this.TAKEN_BY_USER_ID = [];
    this.TICKET_GENERATOR_BRANCH_ID = [];
    this.onSelectAllChecked(false);
    this.onSelectAllChecked1(false);
    this.onSelectAllCheckedBranch(false);
    this.search(true);
  }
  branchData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // var likeQuery = "";
    // if (this.searchText != "") {
    //   likeQuery = " AND (";

    //   this.columns.forEach(column => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    //   likeQuery = likeQuery + ")";
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

    if (this.creatornameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CREATER_NAME LIKE '%${this.creatornameText.trim()}%'`;
      this.iscreatornameFilterApplied = true;
    } else {
      this.iscreatornameFilterApplied = false;
    }

    if (this.ticketnoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_NO LIKE '%${this.ticketnoText.trim()}%'`;
      this.isticketnoFilterApplied = true;
    } else {
      this.isticketnoFilterApplied = false;
    }

    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(DATE) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
        this.isdateFilterApplied = true;
      } else {
        this.isdateFilterApplied = false;
      }
    }

    if (this.StartDate1 && this.StartDate1.length === 2) {
      const [start, end] = this.StartDate1;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(LAST_RESPONDED) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
        this.islastdateFilterApplied = true;
      } else {
        this.islastdateFilterApplied = false;
      }
    }

    if (this.empText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TAKEN_EMPLOYEE LIKE '%${this.empText.trim()}%'`;
      this.isempFilterApplied = true;
    } else {
      this.isempFilterApplied = false;
    }

    if (this.deptText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TAKEN_DEPARTMENT LIKE '%${this.deptText.trim()}%'`;
      this.isdeptFilterApplied = true;
    } else {
      this.isdeptFilterApplied = false;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.isSpinning = true;
      // this.api.getTicketAutoClose(this.pageIndex, this.pageSize, this.sortKey, sort, this.filterQuery + likeQuery, this.FROM_DATE, this.TO_DATE, this.USER_ID, this.TAKEN_BY_USER_ID, this.TICKET_GENERATOR_BRANCH_ID)
      this.api
        .getTicketAutoClose(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];

              this.TabId = data.body['TAB_ID'];

              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else if (data['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
            }
          },
          (err) => {
            if (err['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
            }
          }
        );
    } else {
      this.exportLoading = true;

      this.api
        .getTicketAutoClose(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.branchData = data.body['data'];
              this.TabId = data.body['TAB_ID'];

              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.exportLoading = false;
            this.message.error('Server Not Found', '');
          }
        );
    }
  }

  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == "descend") {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc'
  //   }
  //   //
  //   this.search(true);
  // }
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

  back() {
    this.router.navigate(['/masters/menu']);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.branchData.length > 0) {
      for (var i = 0; i < this.branchData.length; i++) {
        // obj1["Feedback Date"] = this.excelData[i]["FEEDBACK_DATE_TIME"]
        //   ? this.datepipe.transform(
        //     this.excelData[i]["FEEDBACK_DATE_TIME"],
        //     "dd/MM/yyyy hh:mm a"
        //   )
        //   : "-";

        obj1['Creator'] = this.branchData[i]['CREATER_NAME'] ?? '-';
        obj1['Ticket No.'] = this.branchData[i]['TICKET_NO'] ?? '-';
        obj1['Date'] = this.branchData[i]['DATE']
          ? this.datePipe.transform(this.branchData[i]['DATE'], 'dd/MM/yyyy')
          : '-';
        obj1['Last Response Date'] = this.branchData[i]['LAST_RESPONDED']
          ? this.datePipe.transform(
            this.branchData[i]['LAST_RESPONDED'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Support Agent'] =
          this.branchData[i]['TICKET_TAKEN_EMPLOYEE'] ?? '-';
        obj1['Agent Department'] =
          this.branchData[i]['TICKET_TAKEN_DEPARTMENT'] ?? '-';

        arry1.push(Object.assign({}, obj1));
        if (i == this.branchData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Ticket Auto Close Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }

  // @ViewChild(ChattdetailsicketComponent, { static: false }) ChattdetailsicketComponentVar: ChattdetailsicketComponent;
  grpid = 0;
  bread = [];
  newstr: string;
  GRPNAME = '';

  drawerData: any = [];
  isloading = false;
  viewTicketData(data: Ticket) {
    this.isloading = true;
    this.newData2 = [];
    this.data1 = [];
    this.uniqueDateArry = [];
    // this.ChattdetailsicketComponentVar.loading = true;
    this.drawerTitle = 'Ticket No. ' + data.TICKET_NO;
    this.drawerData = Object.assign({}, data);
    var filterQuery1 = ' AND TICKET_MASTER_ID = ' + data.TICKET_MASTER_ID + '';

    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filterQuery1)
      .subscribe(
        (data: HttpResponse<any>) => {
          if (data.status == 200) {
            data = data.body;
            // this.ViewchatticketComponentVar.isSpinning = false;
            this.totalRecords = data['count'];
            this.data1 = data['data'];
            this.isloading = false;

            // this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            if (data['count'] > 0) {
              this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            } else {
              this.grpid = 0;
              // console.warn('No ticket data found for this ticket.');
            }

            // Getting Unique dates
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
            // this.ViewchatticketComponentVar.scrollIntoViewFunction();

            this.api
              // .getBreadInChat(0, 0, 'ID', 'desc', '', '', this.grpid)
              .getBreadInChat(0, 0, 'ID', 'desc', '', '', '')
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
                (err) => { }
              );
          }
          this.isloading = false;
        },
        (err) => { }
      );

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search(false);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onEnterKeyPress() {
    // document.getElementById("searchBtn").focus();
  }

  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';

  USER_ID1 = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = "";
  // filterClass: string = "filter-invisible";
  savedFilters: any[] = [];

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

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
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

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }

  // drawerTitle!: string;

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
    this.drawerTitle = 'Employee Wise Ticket Auto Close Filter';
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

  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
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
      key: 'CREATER_NAME',
      label: 'Creater Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Creater Name',
    },
    {
      key: 'TICKET_NO',
      label: 'Ticket Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Number',
    },
    {
      key: 'DATE',
      label: 'Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Date',
    },
    {
      key: 'LAST_RESPONDED',
      label: 'Last Responded',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Last Responded',
    },
    {
      key: 'TICKET_TAKEN_EMPLOYEE',
      label: 'Support Agent',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Support Agent',
    },
    {
      key: 'TICKET_TAKEN_DEPARTMENT',
      label: 'Agent Department',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Agent Department',
    },

    // {
    //   key: "CLOSED_BEFORE_24",
    //   label: "Closed Before 24",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Closed Before 24",
    // },
    // {
    //   key: "CLOSED_BETWEEN_24_48",
    //   label: "Closed Between 24_48",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Closed Between 24_48",
    // },
    // {
    //   key: "CLOSED_BETWEEN_48_72",
    //   label: "Closed Between 48_72",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter Closed Between 48_72",
    // },
    // {
    //   key: "CLOSED_AFTER_72",
    //   label: "After 72",
    //   type: "text",
    //   comparators: [
    //     "=",
    //     "!=",
    //     "Contains",
    //     "Does Not Contains",
    //     "Starts With",
    //     "Ends With",
    //   ],
    //   placeholder: "Enter After 72",
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
}
