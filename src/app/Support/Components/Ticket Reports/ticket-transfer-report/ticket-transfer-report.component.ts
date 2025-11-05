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

@Component({
  selector: 'app-ticket-transfer-report',
  templateUrl: './ticket-transfer-report.component.html',
  styleUrls: ['./ticket-transfer-report.component.css'],
})
export class TicketTransferReportComponent implements OnInit {
  formTitle = 'Ticket Transfer Report';
  fileName = 'TicketTransferReport.xlsx';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  loadingRecords = false;
  // SearchData : string = '';
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  filterQuery: string = '';
  columns: string[][] = [
    ['CREATOR_EMPLOYEE_NAME', 'Tickdesk Creator'],
    ['TICKET_TAKEN_EMPLOYEE', 'Tickdesk Receiver'],
    ['TICKET_TAKEN_DEPARTMENT_NAME', 'Transfer Department'],
    ['RECIVER_AGENT', 'Receiver Agent'],
    ['ANSWER_AGENT', 'Answered Agent'],
  ];

  columns1: string[][] = [
    ['CREATOR_EMPLOYEE_NAME', 'Tickdesk Creator'],
    ['TICKET_TAKEN_EMPLOYEE', 'Tickdesk Receiver'],
    ['TICKET_TAKEN_DEPARTMENT_NAME', 'Transfer Department'],
    ['TICKET_TRANSFER_EMPLOYEE_NAME', 'Employee Name'],
  ];

  searchText: string = '';
  date = null;
  excelData: any = [];
  exportLoading: boolean = false;

  orgId = this.cookie.get('orgId');
  startValue: any = new Date();
  endValue: any = new Date();
  STARTDATE = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
  ENDDATE = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');

  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private router: Router
  ) { }

  isDeleting: boolean = false;
  savedFilters: any;
  selectedFilter: string | null = null;
  isfilterapply: boolean = false;

  public commonFunction = new CommonFunctionService();

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  TabId: number;
  filterloading: boolean = false;

  filterData: any;
  currentClientId = 1; // Set the client ID

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
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  EditQueryData = [];
  editButton: any;
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

  openfilter() {
    this.drawerTitle = 'Ticket Transfer Report';

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

  departments = [];
  getDepartments() {
    this.departments = [];

    this.api
      .getAllDepartments(
        0,
        0,
        'NAME',
        'ASC',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.departments = data['data'];
          }
        },
        (err) => { }
      );
  }
  supportUsers = [];
  supportUsers1 = [];
  supportUsers2 = [];

  getSupportUsers() {
    this.supportUsers = [];

    this.api
      .getAllemployeeMaster(
        0,
        0,
        'NAME',
        'asc',
        ' AND ORG_ID=1 AND ID!=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.supportUsers = data['data'];
          }
        },
        (err) => { }
      );
  }
  getSupportUsers1() {
    this.supportUsers1 = [];

    this.api
      .getAllemployeeMaster(
        0,
        0,
        'NAME',
        'asc',
        ' AND ORG_ID=1 AND ID!=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.supportUsers1 = data['data'];
          }
        },
        (err) => { }
      );
  }
  getSupportUsers2() {
    this.supportUsers2 = [];

    this.api
      .getAllemployeeMaster(
        0,
        0,
        'NAME',
        'asc',
        ' AND ORG_ID=1 AND ID!=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.supportUsers2 = data['data'];
          }
        },
        (err) => { }
      );
  }
  ngOnInit() {
    this.search();
    this.getDepartments();
    this.getSupportUsers2();
    this.getSupportUsers1();
    this.getSupportUsers();
  }

  endOpen = false;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() < this.startValue.getTime() - 1;
  };
  onStartChange(date: Date): void {
    this.startValue = date;
  }
  onEndChange(date: Date): void {
    this.endValue = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }
  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  faqs = [];

  getFaqsHead() {
    this.faqs = [];

    this.api.getAllFaqHeads(0, 0, 'NAME', 'asc', ' AND STATUS=1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          this.faqs = data['data'];
        }
        //
      },
      (err) => {
        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }
  SELECT_ALL1: boolean = false;

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  applyFilter1() {
    var sort: string;
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    var filter = '';
    filter = this.filterQuery;
    var likeQuery = '';

    if (this.startValue != null) {
      this.STARTDATE = this.startValue;
    }
    if (this.endValue != null) {
      this.ENDDATE = this.endValue;
    }

    this.search();
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND ';

      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
  }

  clearFilter1() {
    this.SELECT_ALL1 = false;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    // this.MONTH1 = new Date();
    this.startValue = new Date();
    this.endValue = new Date();
    this.STARTDATE = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.ENDDATE = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    this.filterQuery = '';
    // this.dataList = [];
    this.search();
    this.SELECT_ALL = false;
    this.SELECT_ALL1 = false;
    this.SELECT_ALL2 = false;
    this.SELECT_ALL3 = false;
  }

  dataList: any = [];
  // exportLoading: boolean = false;

  dateQuery;
  dataList1;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    // var likeQuery = "";
    var globalSearchQuery = '';
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

    if (this.ticketCreatortext !== '' && this.ticketCreatortext.length >= 3) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CREATOR_EMPLOYEE_NAME LIKE '%${this.ticketCreatortext.trim()}%'`;
    }
    if (
      this.ticketReceivertext !== '' &&
      this.ticketReceivertext !== undefined &&
      this.ticketReceivertext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RECIVER_NAME LIKE '%${this.ticketReceivertext.trim()}%'`;
      this.isticketReceiverFilterApplied = true;
    } else {
      this.isticketReceiverFilterApplied = false;
    }

    if (
      this.ticketTransfertext !== '' &&
      this.ticketTransfertext !== undefined &&
      this.ticketTransfertext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TAKEN_DEPARTMENT_NAME LIKE '%${this.ticketTransfertext.trim()}%'`;
      this.isticketTransferFilterApplied = true;
    } else {
      this.isticketTransferFilterApplied = false;
    }

    if (
      this.ticketReceiverAgenttext !== '' &&
      this.ticketReceiverAgenttext !== undefined &&
      this.ticketReceiverAgenttext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RECIVER_AGENT LIKE '%${this.ticketReceiverAgenttext.trim()}%'`;
      this.isticketReceiverAgentFilterApplied = true;
    } else {
      this.isticketReceiverAgentFilterApplied = false;
    }

    if (
      this.ticketAnswerAgenttext !== '' &&
      this.ticketAnswerAgenttext !== undefined &&
      this.ticketAnswerAgenttext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ANSWER_AGENT LIKE '%${this.ticketAnswerAgenttext.trim()}%'`;
      this.isansweredAgentFilterApplied = true;
    } else {
      this.isansweredAgentFilterApplied = false;
    }

    if (this.startValue != null && this.endValue != null) {
      this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
      this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');

      // " AND MOBILE_VERIFICATION_DATETIME = '" +this.startValue + "' ";
      this.dateQuery =
        " AND DATE(CREATED_MODIFIED_DATE) BETWEEN '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
    }
    var USER_IDFilter = '';
    // if (this.USER_ID.length > 0)
    //   USER_IDFilter = "'" + this.USER_ID + "'";

    var TAKEN_BY_USER_IDFilter = '';
    if (this.TAKEN_BY_USER_ID.length > 0)
      TAKEN_BY_USER_IDFilter = " '" + this.TAKEN_BY_USER_ID + "'";

    var DEPARTMENT_IDFilter = '';
    if (this.DEPARTMENT_ID.length > 0)
      DEPARTMENT_IDFilter = " '" + this.DEPARTMENT_ID + "'";

    var TRANSFER_USER_IDFilter = '';
    if (this.TRANSFER_USER_ID.length > 0)
      TRANSFER_USER_IDFilter = "'" + this.TRANSFER_USER_ID + "'";

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getTicketTransfer(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          USER_IDFilter,
          TAKEN_BY_USER_IDFilter,
          DEPARTMENT_IDFilter,
          TRANSFER_USER_IDFilter
        )
        .subscribe(
          (data) => {
            //
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.TabId = data.body['TAB_ID'];
            this.dataList = data.body['data'];

            this.filterClass = 'filter-invisible';
          },
          (err) => { }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getTicketTransfer(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          USER_IDFilter,
          TAKEN_BY_USER_IDFilter,
          DEPARTMENT_IDFilter,
          TRANSFER_USER_IDFilter
        )
        .subscribe(
          (data) => {
            //
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.TabId = data.body['TAB_ID'];
            this.dataList = data.body['data'];
            this.excelData = data.body['data'];
            this.convertInExcel();
            this.exportLoading = false;
            this.filterClass = 'filter-invisible';
          },
          (err) => { }
        );
    }
    // else {
    //   this.exportLoading = true;
    //   this.api
    //     .getTicketTransfer(
    //       0,
    //       0,
    //       this.sortKey,
    //       sort,
    //       this.dateQuery + likeQuery,
    //       USER_IDFilter,
    //       TAKEN_BY_USER_IDFilter,
    //       DEPARTMENT_IDFilter,
    //       TRANSFER_USER_IDFilter
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.exportLoading = false;
    //           this.dataList1 = data.body['data'];
    //           // this.convertInExcel();
    //         }
    //       },
    //       (err) => {
    //         if (err['ok'] == false) this.message.error('Server Not Found', '');
    //       }
    //     );
    // }
  }

  SELECT_ALL: boolean = false;
  DEPARTMENT_ID = [];

  TAKEN_BY_USER_ID = [];
  onSelectAllChecked1(event) {
    this.SELECT_ALL1 = event;
    //
    let ids = [];
    if (this.SELECT_ALL1 == true) {
      for (var i = 0; i < this.supportUsers.length; i++) {
        ids.push(this.supportUsers[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.TAKEN_BY_USER_ID = ids;
  }
  onSelectOff1(event) {
    var a4 = this.supportUsers.length;
    var b4 = this.supportUsers.length - event.length;
    if ((a4! = b4)) {
      this.SELECT_ALL1 = false;
    } else {
      this.SELECT_ALL1 = true;
    }
    this.TAKEN_BY_USER_ID = event;
    if (this.TAKEN_BY_USER_ID.length == 0) {
      this.SELECT_ALL1 = false;
    }
  }

  SELECT_ALL2: boolean = false;
  // USER_ID = []
  onSelectAllChecked2(event) {
    this.SELECT_ALL2 = event;
    //
    let ids2 = [];
    if (this.SELECT_ALL2 == true) {
      for (var i = 0; i < this.supportUsers1.length; i++) {
        ids2.push(this.supportUsers1[i]['ID']);
        //
      }
    } else {
      ids2 = [];
    }
    // this.USER_ID = ids2
  }
  onSelectOff2(event) {
    var a3 = this.supportUsers2.length;
    var b3 = this.supportUsers2.length - event.length;
    if ((a3! = b3)) {
      this.SELECT_ALL2 = false;
    } else {
      this.SELECT_ALL2 = true;
    }
    this.USER_ID = event;
    // if (this.USER_ID.length == 0) {
    //   this.SELECT_ALL2 = false;
    // }
  }
  onSelectAllChecked3(event) {
    this.SELECT_ALL = event;
    //
    let ids3 = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.departments.length; i++) {
        ids3.push(this.departments[i]['ID']);
        //
      }
    } else {
      ids3 = [];
    }
    this.DEPARTMENT_ID = ids3;
  }
  onSelectOff3(event) {
    var a1 = this.departments.length;
    var b1 = this.departments.length - event.length;
    if ((a1! = b1)) {
      this.SELECT_ALL = false;
    } else {
      this.SELECT_ALL = true;
    }
    this.DEPARTMENT_ID = event;
    if (this.DEPARTMENT_ID.length == 0) {
      this.SELECT_ALL = false;
    }
  }
  SELECT_ALL3 = false;
  TRANSFER_USER_ID = [];
  onSelectAllChecked4(event) {
    this.SELECT_ALL3 = event;
    //
    let ids4 = [];
    if (this.SELECT_ALL3 == true) {
      for (var i = 0; i < this.supportUsers2.length; i++) {
        ids4.push(this.supportUsers2[i]['ID']);
        //
      }
    } else {
      ids4 = [];
    }
    this.TRANSFER_USER_ID = ids4;
  }
  onSelectOff4(event) {
    var a2 = this.supportUsers2.length;
    var b2 = this.supportUsers2.length - event.length;
    if ((a2! = b2)) {
      this.SELECT_ALL3 = false;
    } else {
      this.SELECT_ALL3 = true;
    }
    this.TRANSFER_USER_ID = event;
    if (this.TRANSFER_USER_ID.length == 0) {
      this.SELECT_ALL3 = false;
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
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  onKeyup(event: KeyboardEvent, type: any): void {
    if (
      this.ticketCreatortext.length >= 3 &&
      event.key === 'Enter' &&
      type === 'name'
    ) {
      this.search();
      this.isticketCreatorFilterApplied = true;
    } else if (
      this.ticketCreatortext.length == 0 &&
      event.key === 'Backspace' &&
      type === 'name'
    ) {
      this.search();
      this.isticketCreatorFilterApplied = false;
    }

    if (
      this.ticketReceivertext.length >= 3 &&
      event.key === 'Enter' &&
      type === 'rec'
    ) {
      this.search();
      this.isticketReceiverFilterApplied = true;
    } else if (
      this.ticketReceivertext.length == 0 &&
      event.key === 'Backspace' &&
      type === 'rec'
    ) {
      this.search();
      this.isticketReceiverFilterApplied = false;
    }

    if (
      this.ticketTransfertext.length >= 3 &&
      event.key === 'Enter' &&
      type === 'trans'
    ) {
      this.search();
      this.isticketTransferFilterApplied = true;
    } else if (
      this.ticketTransfertext.length == 0 &&
      event.key === 'Backspace' &&
      type === 'trans'
    ) {
      this.search();
      this.isticketTransferFilterApplied = false;
    }

    if (
      this.ticketReceiverAgenttext.length >= 3 &&
      event.key === 'Enter' &&
      type === 'ragent'
    ) {
      this.search();
      this.isticketReceiverAgentFilterApplied = true;
    } else if (
      this.ticketReceiverAgenttext.length == 0 &&
      event.key === 'Backspace' &&
      type === 'ragent'
    ) {
      this.search();
      this.isticketReceiverAgentFilterApplied = false;
    }

    if (
      this.ticketAnswerAgenttext.length >= 3 &&
      event.key === 'Enter' &&
      type === 'ans'
    ) {
      this.search();
      this.isansweredAgentFilterApplied = true;
    } else if (
      this.ticketAnswerAgenttext.length == 0 &&
      event.key === 'Backspace' &&
      type === 'ans'
    ) {
      this.search();
      this.isansweredAgentFilterApplied = false;
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  ticketCreatorVisible: boolean = false;
  isticketCreatorFilterApplied = false;
  ticketCreatortext: string = '';

  ticketReceiverVisible: boolean = false;
  isticketReceiverFilterApplied = false;
  ticketReceivertext: string = '';

  ticketTransferVisible: boolean = false;
  isticketTransferFilterApplied = false;
  ticketTransfertext: string = '';

  ticketReceiverAgentVisible: boolean = false;
  isticketReceiverAgentFilterApplied = false;
  ticketReceiverAgenttext: string = '';

  answeredAgentVisible: boolean = false;
  isansweredAgentFilterApplied = false;
  ticketAnswerAgenttext: string = '';

  reset(): void {
    this.searchText = '';
    this.ticketCreatortext = '';
    this.ticketReceivertext = '';
    this.ticketTransfertext = '';
    this.ticketReceiverAgenttext = '';
    this.ticketReceivertext = '';
    this.search();
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'CREATOR_EMPLOYEE_NAME',
      label: 'Ticket Creator',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Creator',
    },
    {
      key: 'RECIVER_NAME',
      label: 'Ticket Receiver',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Receiver',
    },
    {
      key: 'TICKET_TAKEN_DEPARTMENT_NAME',
      label: 'Transfer Department',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transfer Department',
    },
    {
      key: 'RECIVER_AGENT',
      label: 'Receiver Agent',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Receiver Agent',
    },
    {
      key: 'ANSWER_AGENT',
      label: 'Answer Agent',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Answer Agent',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Ticket Creator'] = this.excelData[i]['CREATOR_EMPLOYEE_NAME']
          ? this.excelData[i]['CREATOR_EMPLOYEE_NAME']
          : '-';
        obj1['Ticket Receiver'] = this.excelData[i]['RECIVER_NAME']
          ? this.excelData[i]['RECIVER_NAME']
          : '-';
        obj1['Transfer Department'] = this.excelData[i][
          'TICKET_TAKEN_DEPARTMENT_NAME'
        ]
          ? this.excelData[i]['TICKET_TAKEN_DEPARTMENT_NAME']
          : '-';
        obj1['Receiver Agent'] = this.excelData[i]['RECIVER_AGENT']
          ? this.excelData[i]['RECIVER_AGENT']
          : '-';
        obj1['Answered Agent'] = this.excelData[i]['ANSWER_AGENT']
          ? this.excelData[i]['ANSWER_AGENT']
          : '-';

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Ticket Transfer Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
}