import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Ticketgroup } from 'src/app/Support/Models/ticketgroup';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ExportService } from 'src/app/Service/export.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-userwisesummary',
  templateUrl: './userwisesummary.component.html',
  styleUrls: ['./userwisesummary.component.css'],
  providers: [DatePipe],
})
export class UserwisesummaryComponent implements OnInit {
  formTitle = 'Customer Wise Summary Report';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'CREATOR_EMPLOYEE_ID';
  searchText: string = '';
  fileName = 'UserWise.xlsx';
  isFilterApplied: string = 'default';
  columns: string[][] = [['CREATOR_EMPLOYEE_NAME', 'Employee Name']];
  excelData: any = [];
  exportLoading: boolean = false;
  DEPARTMENT = [];
  SUPPORT_USER = [];
  isSpinning = false;
  filterClass: string = 'filter-visible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: Date[] = [];
  dateFormat = 'dd/MM/yyyy';
  date: Date[] = [];
  data1 = [];
  ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion = {};
  fromDate: string = '';
  toDate: string = '';
  departments: any = [];
  supportusers = [];
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));
  date1: any;
  date2: any;
  today = new Date();
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
    this.supportusers = [];
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }
  supportAgentWiseDeptArray: any = [];
  getDepartmentSupportAgentWise() {
    this.supportAgentWiseDeptArray = [];
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'CREATOR_EMPLOYEE_ID';
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
  search(
    reset: boolean = false,
    exportToExcel: boolean = false,
    exportToPDF: boolean = false
  ) {
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
    var globalSearchQuery = '';
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
    var supportUserFilter = '';
    if (this.SUPPORT_USER.length > 0)
      supportUserFilter =
        ' AND CREATOR_EMPLOYEE_ID IN (' + this.SUPPORT_USER + ')';
    var deptFilter = '';
    if (this.DEPARTMENT.length > 0)
      deptFilter = ' AND DEPARTMENT_ID IN (' + this.DEPARTMENT + ')';
    var supportAgentWiseDept = '';
    if (this.roleId == 4) {
      if (this.supportAgentWiseDeptArray.length > 0)
        supportAgentWiseDept =
          ' AND DEPARTMENT_ID IN (' + this.supportAgentWiseDeptArray + ')';
      else supportAgentWiseDept = '';
    }
    var deptAdminWiseDept = '';
    if (this.roleId == 6) {
      if (this.deptWiseReport.length > 0)
        deptAdminWiseDept =
          ' AND DEPARTMENT_ID IN (' + this.deptWiseReport + ')';
      else deptAdminWiseDept = '';
    }
    var dateFilter = '';
    if (this.date1 != undefined && this.date2 != undefined) {
      dateFilter =
        " AND ( DATE(DATE) BETWEEN '" +
        this.datePipe.transform(this.date1, 'yyyy-MM-dd ') +
        "' AND '" +
        this.datePipe.transform(this.date2, 'yyyy-MM-dd ') +
        "')";
    }
    if (this.EmployeeNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CREATOR_EMPLOYEE_NAME LIKE '%${this.EmployeeNametext.trim()}%'`;
      this.isEmployeeNameFilterApplied = true;
    } else {
      this.isEmployeeNameFilterApplied = false;
    }
    if (this.DepartmentNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DEPARTMENT_NAME LIKE '%${this.DepartmentNametext.trim()}%'`;
      this.isDepartmentNameFilterApplied = true;
    } else {
      this.isDepartmentNameFilterApplied = false;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getUserwiseReport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
        this.filterQuery +
        supportUserFilter +
        deptFilter +
        supportAgentWiseDept +
        deptAdminWiseDept +
        dateFilter +
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.dataCount = data.body['data'].length;
            let tempData = data.body['data'];
            this.TabId = data.body['TAB_ID'];
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
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
    if (exportToExcel) {
      this.exportLoading = true;
      this.api
        .getUserwiseReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
          this.filterQuery +
          supportUserFilter +
          deptFilter +
          supportAgentWiseDept +
          deptAdminWiseDept +
          dateFilter +
          ' AND ORG_ID=1'
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.excelData = data.body['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
    this.date1 = this.datePipe.transform(new Date(this.date1), 'yyyy-MM-dd');
    this.date2 = this.datePipe.transform(new Date(this.date2), 'yyyy-MM-dd');
    if (
      (this.date1 != null && this.date2 != null) ||
      this.SUPPORT_USER.length > 0
    )
      this.isFilterApplied = 'primary';
    else this.isFilterApplied = 'default';
    this.search(true);
    this.filterClass = 'filter-invisible';
  }
  clearFilter() {
    this.SUPPORT_USER = [];
    this.DEPARTMENT = [];
    this.date = [];
    this.filterQuery = '';
    this.fromDate = '';
    this.toDate = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.setDateForDeptWiseFilter();
    this.search(true);
    this.SELECT_ALL = false;
    this.SELECT_ALL1 = false;
  }
  employeeID2: any;
  departmentID2: any;
  isPDFModalVisible: boolean = false;
  PDFModalTitle: string = 'Export in PDF';
  exportInPDFLoading: boolean = false;
  departmentNameToPrint: string = '';
  employeeNameToPrint: string = '';
  importInPDF(departmentID, employeeID) {
    this.departmentNameToPrint = '';
    this.employeeNameToPrint = '';
    this.search(false, false, true);
    let tempDepartmentName = '';
    let tempEmployeeName = '';
    for (var i = 0; i < departmentID.length; i++) {
      let departments = this.departments.filter((obj1) => {
        return obj1.ID == departmentID[i];
      });
      tempDepartmentName = tempDepartmentName + departments[0]['NAME'] + ', ';
    }
    for (var i = 0; i < employeeID.length; i++) {
      let supportUsers = this.supportusers.filter((obj1: any) => {
        return obj1.ID == employeeID[i];
      });
      tempEmployeeName = tempEmployeeName + supportUsers[0]['NAME'] + ', ';
    }
    this.departmentNameToPrint = tempDepartmentName.substring(
      0,
      tempDepartmentName.length - 2
    );
    this.employeeNameToPrint = tempEmployeeName.substring(
      0,
      tempEmployeeName.length - 2
    );
  }
  handlePDFModalCancel() {
    this.isPDFModalVisible = false;
  }
  getCurrentDateTime() {
    return new Date();
  }
  getUserName() {
    return this.api.userName;
  }
  getDepartments() {
    if (
      this.departmentNameToPrint == '' ||
      this.DEPARTMENT.length == this.departments.length
    )
      return 'All';
    else return this.departmentNameToPrint;
  }
  getEmployeeNames() {
    if (
      this.employeeNameToPrint == '' ||
      this.SUPPORT_USER.length == this.supportusers.length
    )
      return 'All';
    else return this.employeeNameToPrint;
  }
  pdfDownload: boolean = false;
  public generatePDF() {
    this.isButtonSpinning = true;
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'yyyy-MM-dd');
    var dates = this.datePipe.transform(date, 'h:mm:ss a');
    var data = document.getElementById('print');
    html2pdf()
      .from(data)
      .set({
        margin: [16, 13, 12, 13],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'legal', orientation: 'landscape' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        var totalPages = pdf.internal.getNumberOfPages();
        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }
      })
      .save(this.formTitle + '_' + datef + '_' + dates + '.pdf');
  }
  SELECT_ALL: boolean = false;
  onSelectAllChecked(event) {
    this.SELECT_ALL = event;
    let ids: any = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.departments.length; i++) {
        ids.push(this.departments[i]['ID']);
      }
    } else {
      ids = [];
    }
    this.DEPARTMENT = ids;
  }
  SELECT_ALL1: boolean = false;
  onSelectAllChecked1(event) {
    this.SELECT_ALL1 = event;
    let ids = [];
    if (this.SELECT_ALL1 == true) {
      for (var i = 0; i < this.supportusers.length; i++) {
        ids.push(this.supportusers[i]['ID']);
      }
    } else {
      ids = [];
    }
    this.SUPPORT_USER = ids;
  }
  onSelectOff(event) {
    var a = this.departments.length;
    var b = this.departments.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL = false;
    } else {
      this.SELECT_ALL = true;
    }
    this.DEPARTMENT = event;
    if (this.DEPARTMENT.length == 0) {
      this.SELECT_ALL = false;
    }
  }
  onSelectOff1(event) {
    var a = this.supportusers.length;
    var b = this.supportusers.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL1 = false;
    } else {
      this.SELECT_ALL1 = true;
    }
    this.SUPPORT_USER = event;
    if (this.SUPPORT_USER.length == 0) {
      this.SELECT_ALL1 = false;
    }
  }
  getTotal(index: number, size: number) {
    if (Number(index * size) >= Number(this.dataCount)) {
      return true;
    } else {
      return false;
    }
  }
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerTitle;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  savedFilters: any[] = [];
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  filterloading: boolean = false;
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
  updateBtn: any;
  whichbutton: any;
  updateButton: any;
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
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
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
  openfilter() {
    this.drawerTitle = 'Customer Wise Summary Report Filter';
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
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'CREATOR_EMPLOYEE_NAME',
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
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
  isModalVisible = false;
  selectedQuery: string = '';
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
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
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(event: KeyboardEvent, type: string): void {
    if (
      type == 'searchtext' &&
      this.searchText.length >= 3 &&
      event.key === 'Enter'
    ) {
      this.search();
    } else if (
      type == 'searchtext' &&
      this.searchText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    if (
      type == 'CustName' &&
      this.EmployeeNametext.length >= 3 &&
      event.key === 'Enter'
    ) {
      this.search();
    } else if (
      type == 'CustName' &&
      this.EmployeeNametext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.dataList = [];
      this.search();
    }
    if (this.DepartmentNametext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (
      this.DepartmentNametext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.dataList = [];
      this.search();
    }
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.search(true);
    }
    if (this.EmployeeNametext.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (this.EmployeeNametext.length == 0 && keys.key === 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.DepartmentNametext.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (
      this.DepartmentNametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.dataList = [];
      this.search();
    }
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  EmployeeNametext: string = '';
  EmployeeNameVisible: boolean = false;
  isEmployeeNameFilterApplied = false;
  DepartmentNametext: string = '';
  DepartmentNameVisible: boolean = false;
  isDepartmentNameFilterApplied = false;
  reset(): void {
    this.searchText = '';
    this.EmployeeNametext = '';
    this.DepartmentNametext = '';
    this.search();
  }
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Customer Name'] = this.excelData[i]['CREATOR_EMPLOYEE_NAME'];
        obj1['Total Tickets'] = this.excelData[i]['TOTAL'];
        obj1['Pending'] = this.excelData[i]['CREATED'];
        obj1['Assigned'] = this.excelData[i]['ASSIGNED'];
        obj1['Answered'] = this.excelData[i]['ANSWERED'];
        obj1['Re-open'] = this.excelData[i]['RE_OPEN'];
        obj1['Closed'] = this.excelData[i]['CLOSED'];
        obj1['Banned'] = this.excelData[i]['BANNED'];
        obj1['On-Hold'] = this.excelData[i]['ON_HOLD'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Customer Wise Summary Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
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
}