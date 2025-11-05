import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { ExportService } from 'src/app/Service/export.service';
import { Ticket } from 'src/app/Support/Models/TicketingSystem';

// import { ChattdetailsicketComponent } from '../chattdetailsicket/chattdetailsicket.component';
import { ChattdetailsicketComponent } from '../chattdetailsicket/chattdetailsicket.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-group-wise-auto-close-ticket',
  templateUrl: './group-wise-auto-close-ticket.component.html',
  styleUrls: ['./group-wise-auto-close-ticket.component.css'],
})
export class GroupWiseAutoCloseTicketComponent implements OnInit {
  formTitle = 'Department Wise Ticket Auto Close Detailed Report';
  employeenm = '';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any[] = [];
  dataListForExport = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  savedFilters: any; // Define the type of savedFilters if possible

  columns: string[][] = [
    ['CREATER_NAME', 'Creator Name'],
    ['DEPARTMENT_NAME', 'Department Name'],
    ['TICKET_NO', 'Ticket No.'],

    ['TICKET_TAKEN_EMPLOYEE', 'Ticket Taken By'],
    ['TICKET_TAKEN_DEPARTMENT_NAME', 'Department Name'],
  ];

  // USER_ID: any
  supportUsers: any = [];
  branches: any;
  TICKET_GENERATOR_BRANCH_ID: any = [];

  BRANCH = [];
  DEPARTMENT_ID: any = [];
  DEPARTMENT: any = [];
  TICKET_GROUP = [];
  // ticketGroups = [];
  departments: any = [];
  SUPPORT_USER = 'AL';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: Date[] = [];
  dateFormat = 'dd-MM-yyyy';
  date: Date[] = [];
  data1: any = [];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Ticket = new Ticket();
  uniqueDateArry: any[] = [];
  newData2: any = [];
  // data1 = [];
  // ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion = {};
  value1: string = '';
  value2: string = '';
  leaves = [];
  supportusers: any;
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));

  // orgName: string = this.api.ORGANIZATION_NAME;
  isButtonSpinning: boolean = false;
  FROM_DATE: any = new Date();
  TO_DATE: any = new Date();
  endOpen = false;
  // startOpen = false;
  employees = [];
  EXECUTIVE_ID: any = [];
  DATE: any;

  CurrentValue: any = new Date();

  dateQuery: string = '';
  START_DATE: any = new Date();
  END_DATE: any = new Date();

  isfilterapply: boolean = false;
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  customerNameText: string = '';
  customerNameText1: string = '';
  customerNameVisible: boolean = false;
  customerNameVisible1: boolean = false;
  OrderDateVisible = false;
  orderDateVisible1 = false;
  orderDateVisible2 = false;
  orderNumberText: string = '';
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    this.getSupportUsers();
    this.getDepartments();
    this.getBranches();
    this.search(true);
  }
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  getSupportUsers() {
    this.supportUsers = [];

    this.api
      .getAllemployeeMaster(
        0,
        0,
        'NAME',
        'asc',
        ' AND ORG_ID= 1' + ' AND ID!=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.supportUsers = data['data'];
            // this.onSelectAllCheckedUserID(true);
            // this.getDepartments();
          }
        },
        (err) => { }
      );
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }

  SELECT_ALL_UserID: boolean = false;
  // onSelectAllCheckedUserID(event) {

  //   this.SELECT_ALL_UserID = event

  //   //
  //   let ids = [];
  //   if (this.SELECT_ALL_UserID == true) {
  //     for (var i = 0; i < this.supportUsers.length; i++) {
  //       // ids.push(this.supportUsers[i]["ID"]);
  //       //
  //     }
  //   } else {
  //     ids = [];
  //   }
  //   this.USER_ID = ids
  // }

  // onSelectOffUserID(event) {
  //   var a = this.supportUsers.length
  //   var b = this.supportUsers.length - event.length
  //   if (a! = b) {
  //     this.SELECT_ALL_UserID = false;
  //   } else {
  //     this.SELECT_ALL_UserID = true;

  //   }
  //   this.USER_ID = event
  //   if (this.USER_ID.length == 0) {
  //     this.SELECT_ALL_UserID = false;
  //   }
  // }

  getDepartments() {
    this.api
      .getAllDepartments(
        0,
        0,
        'NAME',
        'ASC',
        ' AND ORG_ID= 1'
      )
      .subscribe(
        (data) => {
          // if (data['status'] == 200) {
          //   this.departments = data.body['data'];
          //   // this.onSelectAllChecked(true);
          //   // this.getBranches()
          // }
          if (data['status'] == 200) {
            if (data.body['count'] > 0) {
              data.body['data'].forEach((element) => {
                this.departments.push({
                  value: element.NAME,
                  display: element.NAME,
                });
              });
            }
          }
        },
        (err) => { }
      );
  }

  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(126, columnKey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.distinctData = data['data'];
        } else {
          this.distinctData = [];
          this.message.error('Failed To Get Distinct data Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  isCountryFilterApplied = false;
  countryVisible: boolean = false;
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.isCountryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isCountryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }

  isCountryFilterApplied1 = false;
  countryVisible1: boolean = false;
  onCountryChange1(): void {
    if (this.selectedCountries1?.length) {
      this.search();
      this.isCountryFilterApplied1 = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isCountryFilterApplied1 = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }
  SELECT_ALL: boolean = false;
  onSelectAllChecked(event) {
    this.SELECT_ALL = event;
    //
    let ids = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.departments.length; i++) {
        // ids.push(this.departments[i]["ID"]);
        //
      }
    } else {
      ids = [];
    }
    this.DEPARTMENT = ids;
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

  getBranches() {
    this.branches = [];

    this.api
      .getAllBranch(
        0,
        0,
        'NAME',
        'ASC',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.branches = data['data'];
            // this.onSelectAllCheckedBranch(true);
            // this.search(true);
          }
        },
        (err) => { }
      );
  }

  SELECT_ALL_Branch: boolean = false;
  onSelectAllCheckedBranch(event) {
    this.SELECT_ALL_Branch = event;
    //
    let ids = [];
    if (this.SELECT_ALL_Branch == true) {
      for (var i = 0; i < this.branches.length; i++) {
        // ids.push(this.branches[i]["ID"]);
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

  keyup(event: any) {
    this.search(true);
  }

  startOpen: boolean = false;

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

  isOrderNumberApplied: boolean = false;
  isOrderDateApplied = false;
  isOrderStatusApplied = false;
  isCustomerNameApplied = false;
  isreasonApplied = false;
  isorderStatusApplied = false;
  isCustomerNameApplied1 = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.customerNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.customerNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }
    if (this.customerNameText1.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied1 = true;
    } else if (
      this.customerNameText1.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isCustomerNameApplied1 = false;
    }
    if (this.orderNumberText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOrderNumberApplied = true;
    } else if (this.orderNumberText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOrderNumberApplied = false;
    }

    // if (this.orderStatusText.length >= 3 && event.key === "Enter") {
    //   this.search();
    //   this.isorderStatusApplied = true;
    // } else if (this.orderStatusText.length == 0 && event.key === "Backspace") {
    //   this.search();
    //   this.isorderStatusApplied = false;
    // }
    // if (this.reasonText.length >= 3 && event.key === "Enter") {
    //   this.search();
    //   this.isreasonApplied = true;
    // } else if (this.reasonText.length == 0 && event.key === "Backspace") {
    //   this.search();
    //   this.isreasonApplied = false;
    // }
    // if (this.cancelDateText != null && event.key === 'Enter') {
    //   this.search();
    //   this.isOrderDateApplied = true;
    // } else if (this.cancelDateText == null && event.key === 'Backspace') {
    //   this.search();
    //   this.isOrderDateApplied = false;
    // }
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  filterGroups: any[] = [
    {
      operator: "AND",
      conditions: [
        {
          condition: {
            field: "",
            comparator: "",
            value: "",
          },
          operator: "AND",
        },
      ],
      groups: [],
    },
  ];

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
  currentClientId = 1
  openfilter() {
    this.drawerTitle =
      ' Department Wise Ticket Auto Close Detailed Report Filter';
    this.filterFields[2]['options'] = this.departments;
    this.drawerFilterVisible = true;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

    // Edit code 2

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


  selectedFilter: string | null = null;
  // filterQuery = '';
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
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  isDeleting: boolean = false;


  editQuery(data: any) {

    this.filterFields[2]['options'] = this.departments;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  nameFilter() {
    if (this.customerNameText.trim() === '') {
      this.searchText = '';
    } else if (this.customerNameText.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  nameFilter1() {
    if (this.customerNameText1.trim() === '') {
      this.searchText = '';
    } else if (this.customerNameText1.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  dataList2 = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }

    // this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    if (this.DEPARTMENT != undefined || this.DEPARTMENT.length > 0) {
      this.DEPARTMENT_ID = this.DEPARTMENT;
    }

    //

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

    if (this.orderDateText?.length === 2) {
      const [start, end] = this.orderDateText;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }

    if (this.orderDateText1?.length === 2) {
      const [start, end] = this.orderDateText1;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `LAST_RESPONDED BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }

    if (this.orderDateText2?.length === 2) {
      const [start, end] = this.orderDateText2;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `CREATED_MODIFIED_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }

    // if (this.customerNameText !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") +
    //     `CREATER_NAME LIKE '%${this.customerNameText.trim()}%'`;
    // }

    if (this.customerNameText?.trim()) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CREATER_NAME LIKE '%${this.customerNameText.trim()}%' `;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = '${this.statusFilter1}'`;
    }
    if (this.customerNameText1 !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TAKEN_EMPLOYEE LIKE '%${this.customerNameText1.trim()}%'`;
    }

    if (this.orderNumberText !== '') {
      likeQuery += `TICKET_NO LIKE '%${this.orderNumberText.trim()}%'`;
    }

    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DEPARTMENT_NAME IN ('${this.selectedCountries.join(
        "','"
      )}')`; // Update with actual field name in the DB
    }

    if (this.selectedCountries1.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TICKET_TAKEN_DEPARTMENT_NAME IN ('${this.selectedCountries1.join(
        "','"
      )}')`; // Update with actual field name in the DB
    }
    // if (exportInExcel == false) {
    //   this.loadingRecords = true;
    //   this.isSpinning = true;
    //   this.api.getGroupWiseAutoClose(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.filterQuery + likeQuery, this.START_DATE, this.END_DATE, this.USER_ID, this.DEPARTMENT_ID, this.TICKET_GENERATOR_BRANCH_ID).subscribe(data => {
    //     this.loadingRecords = false;
    //     this.isSpinning = false;
    //     this.totalRecords = data['count'];
    //     this.dataList = data['data'];
    //     this.totalRecords = data["count"];
    //     this.TabId = data["TAB_ID"];
    //   }, err => {
    //
    //     // this.isSpinning = false;
    //     // this.loadingRecords = false;
    //     this.message.error("Server Not Found", "");
    //   });
    // }
    // else {
    //   this.exportLoading = true;
    //   this.api.getGroupWiseAutoClose(0, 0, this.sortKey, this.sortValue, this.filterQuery + likeQuery, this.START_DATE, this.END_DATE, this.USER_ID, this.DEPARTMENT_ID, this.TICKET_GENERATOR_BRANCH_ID).subscribe(data => {
    //     if (data['code'] == 200) {
    //       this.exportLoading = false;
    //       this.isSpinning = false;
    //       this.loadingRecords = false;
    //       this.dataList2 = data['data'];
    //       this.convertInExcel();
    //     }
    //   },
    //     err => {
    //       if (err['ok'] == false)
    //         this.isSpinning = false;
    //       this.loadingRecords = false;
    //       this.message.error("Server Not Found", "");
    //     });
    // }

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.api
        .getGroupWiseAutoClose(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          likeQuery + this.filterQuery,
          this.START_DATE,
          this.END_DATE,
          this.USER_ID,
          this.DEPARTMENT_ID,
          this.TICKET_GENERATOR_BRANCH_ID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
              this.TabId = data.body['TAB_ID'];
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
                'Unable to connect. Please check your internet or server connection and try again shortly.',
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
        .getGroupWiseAutoClose(
          0,
          0,
          this.sortKey,
          this.sortValue,
          likeQuery + this.filterQuery,
          this.START_DATE,
          this.END_DATE,
          this.USER_ID,
          this.DEPARTMENT_ID,
          this.TICKET_GENERATOR_BRANCH_ID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.dataList2 = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.convertInExcel();
            } else {
              this.dataList2 = [];
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
  orderDateVisible: boolean = false;
  orderDateText: any = null;
  orderDateText1: any = null;
  orderDateText2: any = null;
  citytext: string = '';
  selectedCountries: number[] = [];
  selectedCountries1: number[] = [];
  orderNumberVisible: boolean = false;
  reset(): void {
    this.orderDateText = '';
    this.orderDateText1 = '';
    this.orderDateText2 = '';

    this.customerNameText = '';
    this.orderNumberText = '';
    this.orderNumberVisible = false;
    this.customerNameVisible = false;
    this.customerNameVisible1 = false;
    this.orderDateVisible = false;
    this.orderDateVisible1 = false;
    this.orderDateVisible2 = false;
    this.orderStatusVisible = false;
    this.search();
  }
  listOforderStatusFilter: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Closed', value: 'C' },
    { text: 'Assigned', value: 'S' },
    { text: 'Answered', value: 'R' },
    { text: 'Re-Open', value: 'O' },
    { text: 'Banned', value: 'B' },
    { text: 'On-Hold', value: 'H' },
  ];

  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      this.search();
    } else {
      this.orderDateText = null;
      this.search();
    }
  }
  statusFilter1: string | undefined = undefined;
  OrderStatusVisible: boolean = false;

  orderStatusVisible: boolean = false;
  onorderStatusFilterChange(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  onDateChange1(selectedDate: any): void {
    if (this.orderDateText1 && this.orderDateText1.length === 2) {
      this.search();
    } else {
      this.orderDateText1 = null;
      this.search();
    }
  }
  onDateChange2(selectedDate: any): void {
    if (this.orderDateText2 && this.orderDateText2.length === 2) {
      this.search();
    } else {
      this.orderDateText2 = null;
      this.search();
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    let sortOrder = (currentSort && currentSort.value) || 'desc';
    if (sortOrder === 'ascend') {
      sortOrder = 'asc';
    } else if (sortOrder === 'descend') {
      sortOrder = 'desc';
    }
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
  TabId: number;

  filterloading: boolean = false;

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



  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }



  whichbutton: any;
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

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  filterFields: any[] = [
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
      key: 'CREATER_NAME',
      label: 'Creator Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Creator Name',
    },
    {
      key: 'DEPARTMENT_NAME',
      label: 'Department Name',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Department Name',
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
      key: 'TICKET_TAKEN_EMPLOYEE',
      label: 'Ticket Taken By',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Taken By',
    },
    {
      key: 'TICKET_TAKEN_DEPARTMENT_NAME',
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
      key: 'CREATED_MODIFIED_DATE',
      label: 'Auto close Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Auto close Date Time',
    },

    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { display: 'Pending', value: 'P' },
        { display: 'Closed', value: 'C' },
        { display: 'Assigned', value: 'S' },
        { display: 'Answered', value: 'R' },
        { display: 'Re-Open', value: 'O' },
        { display: 'Banned', value: 'B' },
        { display: 'On-Hold', value: 'H' },
      ],
      placeholder: 'Enter Status',
    },
  ];
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.dataList2.length; i++) {
      obj1['Tickets No.'] = this.dataList2[i]['TICKET_NO'];
      obj1['Creator Name'] =
        this.dataList2[i]['CREATER_NAME'] == null
          ? '-'
          : this.dataList2[i]['CREATER_NAME'];
      obj1['Department Name'] =
        this.dataList2[i]['DEPARTMENT_NAME'] == null
          ? '-'
          : this.dataList2[i]['DEPARTMENT_NAME'];
      obj1['Ticket Generator Branch'] =
        this.dataList2[i]['TICKET_GENERATOR_BRANCH'] == null
          ? '-'
          : this.dataList2[i]['TICKET_GENERATOR_BRANCH'];

      obj1['Created Date'] = this.dataList2[i]['DATE']
        ? this.datePipe.transform(
          this.dataList2[i]['DATE'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';

      obj1['Ticket Taken By'] =
        this.dataList2[i]['TICKET_TAKEN_EMPLOYEE'] == null
          ? '-'
          : this.dataList2[i]['TICKET_TAKEN_EMPLOYEE'];
      obj1['Agent Department'] =
        this.dataList2[i]['TICKET_TAKEN_DEPARTMENT_NAME'] == null
          ? '-'
          : this.dataList2[i]['TICKET_TAKEN_DEPARTMENT_NAME'];

      obj1['Last Responded'] = this.dataList2[i]['LAST_RESPONDED']
        ? this.datePipe.transform(
          this.dataList2[i]['LAST_RESPONDED'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';

      obj1['Auto close Date Time'] = this.dataList2[i]['CREATED_MODIFIED_DATE']
        ? this.datePipe.transform(
          this.dataList2[i]['CREATED_MODIFIED_DATE'],
          'dd/MM/yyyy hh:mm a'
        )
        : '-';

      if (this.dataList2[i]['STATUS'] == 'P') {
        obj1['Status'] = 'Pending';
      } else if (this.dataList2[i]['STATUS'] == 'C') {
        obj1['Status'] = 'Closed';
      } else if (this.dataList2[i]['STATUS'] == 'S') {
        obj1['Status'] = 'Assigned';
      } else if (this.dataList2[i]['STATUS'] == 'R') {
        obj1['Status'] = 'Answered';
      } else if (this.dataList2[i]['STATUS'] == 'O') {
        obj1['Status'] = 'Re-Open';
      } else if (this.dataList2[i]['STATUS'] == 'B') {
        obj1['Status'] = 'Banned';
      } else if (this.dataList2[i]['STATUS'] == 'H') {
        obj1['Status'] = 'On-Hold';
      }

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataList2.length - 1) {
        this._exportService.exportExcel1(
          arry1,
          'Department Wise Ticket Auto Close Detailed Report' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }

  // @ViewChild(ChattdetailsicketComponent, { static: false }) ChattdetailsicketComponentVar: ChattdetailsicketComponent;
  grpid = 0;
  bread = [];
  newstr: string;
  GRPNAME = '';
  isloading = false;

  viewTicketData(data: any) {
    this.isloading = true;

    this.newData2 = [];
    this.data1 = [];
    // this.ChattdetailsicketComponentVar.loading = true;
    this.drawerTitle = 'Ticket No. ' + data.TICKET_NO;
    this.drawerData = Object.assign({}, data);
    var filterQuery1 = ' AND TICKET_MASTER_ID = ' + data.TICKET_MASTER_ID + '';
    this.uniqueDateArry = [];

    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filterQuery1)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            // this.ChattdetailsicketComponentVar.loading = false;
            this.totalRecords = data.body['count'];
            this.data1 = data.body['data'];
            this.isloading = false;

            // this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            if (data['count'] > 0) {
              this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            } else {
              this.grpid = 0;
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
            // this.ChattdetailsicketComponentVar.scrollIntoViewFunction();

            this.api
              .getBreadInChat(0, 0, 'ID', 'desc', '', '', this.grpid)
              .subscribe(
                (data) => {
                  if (data['status'] == 200) {
                    this.bread = data.body['data'];
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
}