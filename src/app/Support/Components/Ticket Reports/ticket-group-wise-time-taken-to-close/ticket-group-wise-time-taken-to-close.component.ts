import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import * as XLSX from 'xlsx';
import { differenceInCalendarDays } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-group-wise-time-taken-to-close',
  templateUrl: './ticket-group-wise-time-taken-to-close.component.html',
  styleUrls: ['./ticket-group-wise-time-taken-to-close.component.css'],
})
export class TicketGroupWiseTimeTakenToCloseComponent implements OnInit {
  formTitle = 'Ticket Group Wise Time Taken To Close';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  fileName = 'DeptWise.xlsx';
  dataList = [];
  dataListForExport = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'TICKET_GROUP_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [['TICKET_GROUP_VALUE', 'Ticket Group']];
  TICKET_GROUP = [];
  isSpinning = false;
  filterClass: string = 'filter-visible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: Date[] = [];
  dateFormat = 'dd/MM/yyyy';
  date: Date[] = [];
  data1 = [];
  index = 0;
  ticketQuestion = {};
  value1: string = '';
  value2: string = '';
  ticketGroups = [];
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
  allCLOSED_BEFORE_24: number = 0;
  allCLOSED_BETWEEN_24_48: number = 0;
  allCLOSED_BETWEEN_48_72: number = 0;
  allCLOSED_AFTER_72: number = 0;
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  setDateForDeptWiseFilter() {
    this.date = [];
    let currentDate = new Date();
    let previous30thDayDate = currentDate.setDate(currentDate.getDate() + -30);
    this.date1 = new Date(previous30thDayDate);
    this.date2 = new Date();
  }
  ngOnInit() {
    this.setDateForDeptWiseFilter();
    this.api
      .getAllTicketGroups(0, 0, 'VALUE', 'ASC', ' AND ORG_ID=1')
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.ticketGroups = data.body['data'];
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
  supportAgentWiseDeptArray: number[] = [];
  getDepartmentSupportAgentWise() {
    this.supportAgentWiseDeptArray = [] as number[];
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
          var supportAgentWiseDept = data.body['data'];
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  deptWiseReport: number[] = [];
  getDepartmentToShowReport() {
    this.deptWiseReport = [] as number[];
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
          var departments = data.body['data'];
          for (var i = 0; i < departments.length; i++) {
            this.deptWiseReport.push(departments[i]['DEPARTMENT_ID']);
          }
          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
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
  exportexcel(): void {
    let element = document.getElementById('summer');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd') as string;
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd') as string;
  }
  search(
    reset: boolean = false,
    exportToExcel: boolean = false,
    exportToPDF: boolean = false
  ) {
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
    var ticketGrroupFilter = '';
    if (this.TICKET_GROUP.length > 0)
      ticketGrroupFilter =
        ' AND TICKET_GROUP_ID IN (' + this.TICKET_GROUP + ')';
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
        " AND (DATE BETWEEN '" +
        this.datePipe.transform(this.date1, 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.date2, 'yyyy-MM-dd') +
        "')";
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
    this.api
      .getTicketGroupWiseTimeTakenToCloseReport(
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
            this.dataCount = data.body['count'];
            let tempData = data.body['data'];
            this.TabId = data.body['TAB_ID'];
            let allCLOSED_BEFORE_24 = 0;
            let allCLOSED_BETWEEN_24_48 = 0;
            let allCLOSED_BETWEEN_48_72 = 0;
            let allCLOSED_AFTER_72 = 0;
            for (var i = 0; i < tempData.length; i++) {
              allCLOSED_BEFORE_24 =
                allCLOSED_BEFORE_24 + tempData[i]['CLOSED_BEFORE_24'];
              allCLOSED_BETWEEN_24_48 =
                allCLOSED_BETWEEN_24_48 + tempData[i]['CLOSED_BETWEEN_24_48'];
              allCLOSED_BETWEEN_48_72 =
                allCLOSED_BETWEEN_48_72 + tempData[i]['CLOSED_BETWEEN_48_72'];
              allCLOSED_AFTER_72 =
                allCLOSED_AFTER_72 + tempData[i]['CLOSED_AFTER_72'];
            }
            this.allCLOSED_BEFORE_24 = allCLOSED_BEFORE_24;
            this.allCLOSED_BETWEEN_24_48 = allCLOSED_BETWEEN_24_48;
            this.allCLOSED_BETWEEN_48_72 = allCLOSED_BETWEEN_48_72;
            this.allCLOSED_AFTER_72 = allCLOSED_AFTER_72;
          } else if (data['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {
          if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
          }
        }
      );
    if (exportToExcel) {
      this.exportLoading = true;
      this.api
        .getTicketGroupWiseTimeTakenToCloseReport(
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
              this.exportLoading = false;
              this.dataListForExport = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.loadingRecords = true;
      this.api
        .getTicketGroupWiseTimeTakenToCloseReport(
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
              this.loadingRecords = false;
              this.dataListForExport = data.body['data'];
              this.totalRecords = data.body['count'];
              this.TabId = data.body['TAB_ID'];
              this.dataList = data.body['data'];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  exportLoading: boolean = false;
  departmentID2: any;
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataListForExport.length > 0) {
      for (var i = 0; i < this.dataListForExport.length; i++) {
        obj1['Ticket Group'] =
          this.dataListForExport[i]['TICKET_GROUP_VALUE'] ?? '-';
        obj1['Closed Before 24 hrs'] =
          this.dataListForExport[i]['CLOSED_BEFORE_24'] ?? '-';
        obj1['Closed Between 24 To 48 hrs'] =
          this.dataListForExport[i]['CLOSED_BETWEEN_24_48'] ?? '-';
        obj1['Closed Between 48 To 72 hrs'] =
          this.dataListForExport[i]['CLOSED_BETWEEN_48_72'] ?? '-';
        obj1['Closed After 72 hrs'] =
          this.dataListForExport[i]['CLOSED_AFTER_72'] ?? '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.dataListForExport.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Ticket Group Wise Time Taken to Close Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  isPDFModalVisible: boolean = false;
  PDFModalTitle: string = 'Export in PDF';
  exportInPDFLoading: boolean = false;
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
  before24Text: string = '';
  isbefore24FilterApplied: boolean = false;
  before24Visible = false;
  between24_48Text: string = '';
  isbetween24_48FilterApplied: boolean = false;
  between24_48Visible = false;
  between48_72Text: string = '';
  isbetween48_72FilterApplied: boolean = false;
  between48_72Visible = false;
  after72Text: string = '';
  isafter72FilterApplied: boolean = false;
  after72Visible = false;
  reset(): void {
    this.searchText = '';
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.ticketGroupText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isticketgroupFilterApplied = true;
    } else if (this.ticketGroupText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isticketgroupFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
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
  clearFilter() {
    this.TICKET_GROUP = [];
    this.date = [];
    this.filterQuery = '';
    this.selectedDate = [];
    this.value1 = '';
    this.value2 = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.setDateForDeptWiseFilter();
    this.search(true);
    this.SELECT_ALL = false;
  }
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
  drawerTitle!: string;
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
    this.drawerTitle = 'Ticket Group Wise Time Taken to Close';
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
      key: 'TICKET_GROUP_VALUE',
      label: 'Ticket Group Value',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Group Value',
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
}