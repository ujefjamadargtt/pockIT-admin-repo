import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ExportService } from 'src/app/Service/export.service';
import * as XLSX from 'xlsx';
import { ChattdetailsicketComponent } from '../chattdetailsicket/chattdetailsicket.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Ticket } from 'src/app/Support/Models/TicketingSystem';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-support-user-wise-ticket-details',
  templateUrl: './support-user-wise-ticket-details.component.html',
  styleUrls: ['./support-user-wise-ticket-details.component.css'],
})
export class SupportUserWiseTicketDetailsComponent implements OnInit {
  formTitle = 'Customer Wise Ticket Details';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['CREATOR_EMPLOYEE_NAME', 'Employee Name (Created By)'],
    ['TICKET_NO', 'Ticket No.'],
    ['DATE', 'Created On'],
    ['QUESTION', 'Question'],
    ['IS_TAKEN_STATUS', 'Is Taken'],
    ['TICKET_TAKEN_EMPLOYEE', 'Taken By/ Transfer To'],
    ['LAST_RESPONDED', 'Last Responded Date'],
    ['PRIORITY', 'Priority'],
    ['STATUS', 'Status'],
  ];
  SUPPORT_USERS = [];
  supportUsers = [];
  SUPPORT_AGENTS = [];
  supportAgents = [];
  STATUS = [];
  CREATION_DATE: Date[] = [];
  isSpinning = false;
  filterClass: string = 'filter-visible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  dateFormat = 'dd/MM/yyyy';
  data1: any = [];
  index = 0;
  ticketQuestion = {};
  fileName = 'Tickets.xlsx';
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Ticket = new Ticket();
  uniqueDateArry: any = [];
  newData2: any = [];
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));
  CREATION_DATE1 = new Date();
  CREATION_DATE2 = new Date();
  today = new Date();
  orgName: any = '';
  public commonFunction = new CommonFunctionService();
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      this.CREATION_DATE1 == null ? this.today : this.CREATION_DATE1
    ) < 0;
  onFromDateChange(fromDate) {
    if (fromDate == null) this.CREATION_DATE2 = new Date();
    else this.CREATION_DATE2 = new Date(fromDate);
  }
  setDateForDeptWiseFilter() {
    this.CREATION_DATE = [];
    let currentDate = new Date();
    let previous6thDayDate = currentDate.setDate(currentDate.getDate() + -6);
    this.CREATION_DATE1 = new Date(previous6thDayDate);
    this.CREATION_DATE2 = new Date();
  }
  ngOnInit() {
    this.setDateForDeptWiseFilter();
    if (this.roleId == 6) this.getDepartmentToShowReport();
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
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
  }
  createdbyVisible: boolean = false;
  iscreatedbyFilterApplied: boolean = false;
  createdbyText: string = '';
  takenbyVisible: boolean = false;
  istakenbyFilterApplied: boolean = false;
  takenbyText: string = '';
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
  iscreatedDateFilterApplied: boolean = false;
  createdStartDate: any = [];
  createdDateVisible = false;
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
  oncreatedDateRangeChange(): void {
    if (this.createdStartDate && this.createdStartDate.length === 2) {
      const [start, end] = this.createdStartDate;
      if (start && end) {
        this.search();
        this.iscreatedDateFilterApplied = true;
      }
    } else {
      this.createdStartDate = null; 
      this.search();
      this.iscreatedDateFilterApplied = false;
    }
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Yes', value: 'Yes' },
    { text: 'No', value: 'No' },
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
  statusFilter2: string | undefined = undefined;
  onpriorityFilterChange1(selectedStatus: string) {
    this.statusFilter2 = selectedStatus;
    this.search(true);
  }
  listOfpriorityFilter: any[] = [
    { text: 'Very High', value: 'V' },
    { text: 'High', value: 'H' },
    { text: 'Medium', value: 'M' },
    { text: 'Low', value: 'L' },
    { text: 'Very Low', value: 'O' },
  ];
  onKeyup(event: KeyboardEvent): void {
    if (this.createdbyText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.iscreatedbyFilterApplied = true;
    } else if (this.createdbyText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.iscreatedbyFilterApplied = false;
    }
    if (this.takenbyText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.istakenbyFilterApplied = true;
    } else if (this.takenbyText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istakenbyFilterApplied = false;
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
  reset() {
    this.ticketnoText = '';
    this.questionText = '';
    this.createdbyText = '';
    this.takenbyText = '';
  }
  deptWiseReport: any = [];
  getDepartmentToShowReport() {
    this.deptWiseReport = [];
    this.api
      .gettickdeskDepartmentAdminMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND EMPLOYEE_ID=' + this.userId
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          var departments = data['data'];
          for (var i = 0; i < departments.length; i++) {
            this.deptWiseReport.push(departments[i]['DEPARTMENT_ID']);
          }
          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
  }
  exportexcel(): void {
    let element = document.getElementById('summer');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
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
  search(
    reset: boolean = false,
    exportToExcel: boolean = false,
    exportToPDF: boolean = false
  ) {
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
    var supportAgentWiseDept = '';
    var deptAdminWiseDept = '';
    if (this.roleId == 6) {
      if (this.deptWiseReport.length > 0)
        deptAdminWiseDept =
          ' AND DEPARTMENT_ID IN (' + this.deptWiseReport + ')';
      else deptAdminWiseDept = '';
    }
    var creationDateFilter = '';
    if (this.CREATION_DATE1 != undefined && this.CREATION_DATE2 != undefined) {
      creationDateFilter =
        " AND (DATE BETWEEN '" +
        this.datePipe.transform(this.CREATION_DATE1, 'yyyy-MM-dd 00:00:00') +
        "' AND '" +
        this.datePipe.transform(this.CREATION_DATE2, 'yyyy-MM-dd 23:59:59') +
        "')";
    }
    var supportUserFilter = '';
    if (this.SUPPORT_USERS.length > 0)
      supportUserFilter =
        ' AND CREATOR_EMPLOYEE_ID IN (' + this.SUPPORT_USERS + ')';
    var supportAgentFilter = '';
    if (this.SUPPORT_AGENTS.length > 0)
      supportAgentFilter =
        ' AND TAKEN_BY_USER_ID IN (' + this.SUPPORT_AGENTS + ')';
    var statusFilter = '';
    if (this.STATUS.length > 0)
      statusFilter = ' AND STATUS IN (' + this.STATUS + ')';
    var filterQuery5 = '';
    if (this.createdbyText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `CREATOR_EMPLOYEE_NAME LIKE '%${this.createdbyText.trim()}%'`;
    }
    if (this.takenbyText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `TICKET_TAKEN_EMPLOYEE LIKE '%${this.takenbyText.trim()}%'`;
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
      filterQuery5 += `IS_TAKEN_STATUS = "${this.statusFilter}"`;
    }
    if (this.statusFilter1) {
      if (filterQuery5 !== '') {
        filterQuery5 += ' AND ';
      }
      filterQuery5 += `STATUS = "${this.statusFilter1}"`;
    }
    if (this.statusFilter2) {
      if (filterQuery5 !== '') {
        filterQuery5 += ' AND ';
      }
      filterQuery5 += `PRIORITY = "${this.statusFilter2}"`;
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
    if (this.createdStartDate && this.createdStartDate.length === 2) {
      const [start, end] = this.createdStartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        filterQuery5 +=
          (filterQuery5 ? ' AND ' : '') +
          `DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.iscreatedDateFilterApplied = true;
    } else {
      this.iscreatedDateFilterApplied = false;
    }
    filterQuery5 = filterQuery5 ? ' AND ' + filterQuery5 : '';
    if (exportToExcel) {
      this.exportLoading = true;
      this.api
        .getAllTickets(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + filterQuery5
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.dataListForExport = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.exportLoading = false;
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.exportLoading = false;
          }
        );
    }
    else {
      this.loadingRecords = true;
      this.api
        .getAllTickets(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + filterQuery5
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.loadingRecords = false;
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.loadingRecords = false;
          }
        );
    }
  }
  applyFilter() {
    if (
      (this.CREATION_DATE1 != null && this.CREATION_DATE2 != null) ||
      this.SUPPORT_USERS.length > 0 ||
      this.SUPPORT_AGENTS.length > 0
    )
      this.isFilterApplied = 'primary';
    else this.isFilterApplied = 'default';
    this.search(true);
    this.filterClass = 'filter-invisible';
  }
  clearFilter() {
    this.SUPPORT_USERS = [];
    this.SUPPORT_AGENTS = [];
    this.filterQuery = '';
    this.CREATION_DATE = [];
    this.STATUS = [];
    this.setDateForDeptWiseFilter();
    this.search(true);
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }
  @ViewChild(ChattdetailsicketComponent, { static: false })
  ChattdetailsicketComponentVar: ChattdetailsicketComponent;
  grpid = 0;
  bread = [];
  newstr: string;
  GRPNAME = '';
  isloading = false;
  viewTicketData(data: Ticket) {
    this.isloading = true;
    this.newData2 = [];
    this.data1 = [];
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
            this.isloading = false;
            this.grpid = this.data1[0]['TICKET_GROUP_ID'];
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
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Created By'] = this.dataListForExport[i]['CREATOR_EMPLOYEE_NAME']
        ? this.dataListForExport[i]['CREATOR_EMPLOYEE_NAME']
        : '-';
      obj1['Ticket No.'] = this.dataListForExport[i]['TICKET_NO']
        ? this.dataListForExport[i]['TICKET_NO']
        : '-';
      obj1['Datetime'] = this.dataListForExport[i]['DATE']
        ? this.datePipe.transform(
          this.dataListForExport[i]['DATE'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';
      obj1['Question'] = this.dataListForExport[i]['QUESTION']
        ? this.dataListForExport[i]['QUESTION']
        : '-';
      obj1['Is Taken'] = this.dataListForExport[i]['IS_TAKEN_STATUS']
        ? this.dataListForExport[i]['IS_TAKEN_STATUS']
        : '-';
      obj1['Taken By/ Transfer To'] = this.dataListForExport[i][
        'TICKET_TAKEN_EMPLOYEE'
      ]
        ? this.dataListForExport[i]['TICKET_TAKEN_EMPLOYEE']
        : '-';
      obj1['Last Responded Date'] = this.dataListForExport[i]['LAST_RESPONDED']
        ? this.datePipe.transform(
          this.dataListForExport[i]['LAST_RESPONDED'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';
      if (this.dataListForExport[i]['PRIORITY'] == 'V') {
        obj1['Priority'] = 'Very High';
      } else if (this.dataListForExport[i]['PRIORITY'] == 'H') {
        obj1['Priority'] = 'High';
      } else if (this.dataListForExport[i]['PRIORITY'] == 'M') {
        obj1['Priority'] = 'Medium';
      } else if (this.dataListForExport[i]['PRIORITY'] == 'L') {
        obj1['Priority'] = 'Low';
      } else if (this.dataListForExport[i]['PRIORITY'] == 'O') {
        obj1['Priority'] = 'Very Low';
      } else {
        obj1['Priority'] = '-';
      }
      if (this.dataListForExport[i]['STATUS'] == 'P') {
        obj1['Status'] = 'Pending';
      } else if (this.dataListForExport[i]['STATUS'] == 'C') {
        obj1['Status'] = 'Closed';
      } else if (this.dataListForExport[i]['STATUS'] == 'S') {
        obj1['Status'] = 'Assigned';
      } else if (this.dataListForExport[i]['STATUS'] == 'R') {
        obj1['Status'] = 'Answered';
      } else if (this.dataListForExport[i]['STATUS'] == 'O') {
        obj1['Status'] = 'Re - Open';
      } else if (this.dataListForExport[i]['STATUS'] == 'B') {
        obj1['Status'] = 'Banned';
      } else if (this.dataListForExport[i]['STATUS'] == 'H') {
        obj1['Status'] = 'On Hold';
      }
      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Customer Wise Ticket Details ' +
          this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh mm ss a')
        );
      }
    }
  }
  isPDFModalVisible: boolean = false;
  PDFModalTitle: string = 'Export in PDF';
  exportInPDFLoading: boolean = false;
  employeeNameToPrint: string = '';
  supportAgentNameToPrint: string = '';
  statusToPrint: string = '';
  handlePDFModalCancel() {
    this.isPDFModalVisible = false;
  }
  getCurrentDateTime() {
    return new Date();
  }
  getUserName() {
    return this.api.userName;
  }
  getEmployeeToShow() {
    if (this.employeeNameToPrint == '') return 'All';
    else return this.employeeNameToPrint;
  }
  getSupportAgentToShow() {
    if (this.supportAgentNameToPrint == '') return 'All';
    else return this.supportAgentNameToPrint;
  }
  getStatusToShow() {
    if (this.statusToPrint == '') return 'All';
    else return this.statusToPrint;
  }
  isfilterapply: boolean = false;
  userId = sessionStorage.getItem('userId'); 
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
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
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
    this.drawerTitle = 'Employee Wise Details Report Filter';
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
      key: 'CREATOR_EMPLOYEE_NAME',
      label: 'Employee Name (Created By)',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Employee Name (Created By)',
    },
    {
      key: 'TICKET_NO',
      label: 'Ticket No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket No.',
    },
    {
      key: 'DATE',
      label: 'Created Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Created Date',
    },
    {
      key: 'QUESTION',
      label: 'Question',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Question',
    },
    {
      key: 'IS_TAKEN_STATUS',
      label: 'Is Taken Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'Yes', display: 'Yes' },
        { value: 'No', display: 'No' },
      ],
      placeholder: 'Select Is Taken Status',
    },
    {
      key: 'TICKET_TAKEN_EMPLOYEE',
      label: 'Taken By/ Transfer To',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Taken By/ Transfer To',
    },
    {
      key: 'LAST_RESPONDED',
      label: 'Last Responded Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Last Responded Date',
    },
    {
      key: 'PRIORITY',
      label: 'Priority',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'V', display: 'Very High' },
        { value: 'H', display: 'High' },
        { value: 'M', display: 'Medium' },
        { value: 'L', display: 'Low' },
        { value: 'O', display: 'Very Low' },
      ],
      placeholder: 'Select Priority',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: 'C', display: 'Closed' },
        { value: 'S', display: 'Assigned' },
        { value: 'R', display: 'Answered' },
        { value: 'O', display: 'Re-Open' },
        { value: 'B', display: 'Banned' },
        { value: 'H', display: 'On-Hold' },
      ],
      placeholder: 'Select Status',
    },
  ];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  oldFilter: any[] = [];
  isLoading = false;
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  isModalVisible = false; 
  selectedQuery: string = ''; 
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  USER_ID: number; 
  savedFilters: any; 
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
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
}