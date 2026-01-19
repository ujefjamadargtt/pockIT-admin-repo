import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import * as XLSX from 'xlsx';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { filter } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Ticket } from 'src/app/Support/Models/TicketingSystem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-group-wise-summary',
  templateUrl: './ticket-group-wise-summary.component.html',
  styleUrls: ['./ticket-group-wise-summary.component.css'],
})
export class TicketGroupWiseSummaryComponent implements OnInit {
  formTitle = 'Ticket Group Wise Summary';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  fileName = 'DeptWise.xlsx';
  dataList = [];
  loadingRecords: boolean = true;
  sortValue: string = 'desc';
  sortKey: string = 'TICKET_GROUP_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [['TICKET_GROUP_VALUE', 'Ticket Group']];
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
  designationId = Number(this.cookie.get('designationId'));
  date1: any;
  date2: any;
  today = new Date();
  orgName: string = this.api['ORGANIZATION_NAME'];
  isButtonSpinning: boolean = false;
  dataCount: number = 0;
  allTotal: number = 0;
  allCreated: number = 0;
  allAssigned: number = 0;
  allAnswered: number = 0;
  allReopened: number = 0;
  allClosed: number = 0;
  allBanned: number = 0;
  allOnHold: number = 0;
  TOTAL: number = 0;
  CREATED: number = 0;
  ASSIGNED: number = 0;
  ANSWERED: number = 0;
  RE_OPEN: number = 0;
  CLOSED: number = 0;
  BANNED: number = 0;
  ON_HOLD: number = 0;
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      this.date1 == null ? this.today : this.date1
    ) < 0;
  onFromDateChange(fromDate) {
    if (fromDate == null) this.date1 = new Date();
    else this.date1 = new Date(fromDate);
  }
  setDateForDeptWiseFilter() {
    this.date = [];
    let currentDate = new Date();
    let previous15thDayDate = currentDate.setDate(currentDate.getDate() + -30);
    this.date1 = new Date(previous15thDayDate);
    this.date2 = new Date();
  }
  ngOnInit() {
    this.setDateForDeptWiseFilter();
    this.api
      .getAllTicketGroups(0, 0, 'VALUE', 'ASC', ' AND ORG_ID=1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ticketGroups = data['data'];
          }
        },
        (err) => { }
      );
    if (this.roleId == 6) this.getDepartmentToShowReport();
    if (this.roleId == 4) this.getDepartmentSupportAgentWise();
    if (this.roleId != 4 && this.roleId != 6) this.search(true);
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }
  supportAgentWiseDeptArray: any = [];
  getDepartmentSupportAgentWise() {
    this.supportAgentWiseDeptArray = [];
    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + this.userId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          var supportAgentWiseDept = data['data'];
          for (var i = 0; i < supportAgentWiseDept.length; i++) {
            this.supportAgentWiseDeptArray.push(
              supportAgentWiseDept[i]['DEPARTMENT_ID']
            );
          }
          if (this.roleId == 4) {
            this.search(true);
          }
        }
      });
  }
  deptWiseReport: any = [];
  getDepartmentToShowReport() {
    this.deptWiseReport = [];
    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + this.userId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
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
  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  search(reset: boolean = false, exportToExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
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
    if (this.ticketGroupText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_GROUP_VALUE LIKE '%${this.ticketGroupText.trim()}%'`;
      this.isticketgroupFilterApplied = true;
    } else {
      this.isticketgroupFilterApplied = false;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    var dateFilter = '';
    if (this.date1 != undefined && this.date2 != undefined) {
      dateFilter =
        " AND DATE(DATE)BETWEEN '" +
        this.datePipe.transform(this.date1, 'yyyy-MM-dd ') +
        "' AND '" +
        this.datePipe.transform(this.date2, 'yyyy-MM-dd') +
        "'";
    }
    if (exportToExcel) {
      this.loadingRecords = true;
      this.api
        .getTicketGroupWiseSummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          '',
          this.cookie.get('orgId')
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.excelData = data.body['data'];
              this.TabId = data['TAB_ID'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.loadingRecords = false;
            this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.loadingRecords = false;
      this.api
        .getTicketGroupWiseSummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          '',
          this.cookie.get('orgId')
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.dataCount = data.body['count'];
              this.dataList = data.body['data'];
              let tempData = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              let allTotal = 0;
              let allCreated = 0;
              let allAssigned = 0;
              let allAnswered = 0;
              let allReopened = 0;
              let allClosed = 0;
              let allBanned = 0;
              let allOnHold = 0;
              for (var i = 0; i < tempData.length; i++) {
                allTotal = allTotal + tempData[i]['TOTAL'];
                allCreated = allCreated + tempData[i]['CREATED'];
                allAssigned = allAssigned + tempData[i]['ASSIGNED'];
                allAnswered = allAnswered + tempData[i]['ANSWERED'];
                allReopened = allReopened + tempData[i]['RE_OPEN'];
                allClosed = allClosed + tempData[i]['CLOSED'];
                allBanned = allBanned + tempData[i]['BANNED'];
                allOnHold = allOnHold + tempData[i]['ON_HOLD'];
              }
              this.allTotal = allTotal;
              this.allCreated = allCreated;
              this.allAssigned = allAssigned;
              this.allAnswered = allAnswered;
              this.allReopened = allReopened;
              this.allClosed = allClosed;
              this.allBanned = allBanned;
              this.allOnHold = allOnHold;
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
    this.setDateForDeptWiseFilter();
    this.search(true);
    this.SELECT_ALL = false;
  }
  exportLoading: boolean = false;
  ticketGroupID2: any;
  isPDFModalVisible: boolean = false;
  PDFModalTitle: string = 'Export in PDF';
  exportInPDFLoading: boolean = false;
  ticketGroupsToPrint: string = '';
  handlePDFModalCancel() {
    this.isPDFModalVisible = false;
  }
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
  getTotal(index: number, size: number) {
    if (Number(index * size) >= Number(this.dataCount)) {
      return true;
    } else {
      return false;
    }
  }
  ticketGroupText: string = '';
  isticketgroupFilterApplied: boolean = false;
  ticketGroupVisible = false;
  totalText: string = '';
  istotalFilterApplied: boolean = false;
  totalVisible = false;
  createdText: string = '';
  iscreatedFilterApplied: boolean = false;
  createdpVisible = false;
  assignedText: string = '';
  assignedVisible = false;
  isassignedFilterApplied: boolean = false;
  answeredText: string = '';
  answeredVisible = false;
  isansweredFilterApplied: boolean = false;
  reOpentext: string = '';
  reopenVisible = false;
  isreopenFilterApplied: boolean = false;
  closeText: string = '';
  closedVisible = false;
  isclosedFilterApplied: boolean = false;
  bannedText: string = '';
  bannedGroupVisible = false;
  isbannedgroupFilterApplied: boolean = false;
  onHoldText: string = '';
  onHoldGroupVisible = false;
  isonHoldgroupFilterApplied: boolean = false;
  excelData: any = [];
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Ticket Group Value'] = this.excelData[i]['TICKET_GROUP_VALUE']
          ? this.excelData[i]['TICKET_GROUP_VALUE']
          : '-';
        obj1['Total'] = this.excelData[i]['TOTAL']
          ? this.excelData[i]['TOTAL']
          : '-';
        obj1['Created'] = this.excelData[i]['CREATED']
          ? this.excelData[i]['CREATED']
          : '-';
        obj1['Assigned'] = this.excelData[i]['ASSIGNED']
          ? this.excelData[i]['ASSIGNED']
          : '-';
        obj1['Answered'] = this.excelData[i]['ANSWERED']
          ? this.excelData[i]['ANSWERED']
          : '-';
        obj1['Closed'] = this.excelData[i]['CLOSED']
          ? this.excelData[i]['CLOSED']
          : '-';
        obj1['Banned'] = this.excelData[i]['BANNED']
          ? this.excelData[i]['BANNED']
          : '-';
        obj1['On Hold'] = this.excelData[i]['ON_HOLD']
          ? this.excelData[i]['ON_HOLD']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Ticket Group Wise Summary Report ' +
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
    if (this.ticketGroupText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isticketgroupFilterApplied = true;
    } else if (this.ticketGroupText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isticketgroupFilterApplied = false;
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
  filterData: any;
  currentClientId = 1; 
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
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Query';
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
    const sortField = (currentSort && currentSort.key) || 'TICKET_GROUP_ID';
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
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
    sessionStorage.setItem('ID', item.ID);
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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
      key: 'TICKET_GROUP_VALUE',
      label: 'Ticket Group value',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Ticket Group value',
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
  openfilter() {
    this.drawerTitle = 'Ticket Group Wise Summary Report Filter';
    this.drawerFilterVisible = true;
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
}