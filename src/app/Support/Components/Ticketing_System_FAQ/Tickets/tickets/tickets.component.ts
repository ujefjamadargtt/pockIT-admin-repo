import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketdetailsComponent } from '../ticketdetails/ticketdetails.component';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import {
  Ticket,
  Ticketdetails,
  Ticketgroup,
} from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConnectableObservable } from 'rxjs';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  providers: [DatePipe],
})
export class TicketsComponent implements OnInit {
  formTitle = 'Manage Support Tickets';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  // userId = this.cookie.get('userId');

  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();

  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeIDString = this.backofficeId
    ? this.commonFunction.decryptdata(this.backofficeId)
    : '';
  decreptedbackofficeID: any = parseInt(this.decreptedbackofficeIDString, 10);

  empList: any;
  roleId = this.cookie.get('roleId');
  roleID = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  // sortKey: string = "LAST_RESPONDED";
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['DEPARTMENT_NAME', 'Department Name'],
    ['CREATOR_EMPLOYEE_NAME', 'Created By Name'],
    ['TICKET_NO', 'Ticket No.'],
    ['MOBILE_NO', 'Mobile No.'],
    ['EMAIL_ID', 'Email'],
    ['QUESTION', 'Question'],
    // ['IS_TAKEN_STATUS', 'Is Taken'],
    // ['LAST_RESPONDED', 'Last Responded Date'],
    // ['STATUS', 'Status'],
  ];
  STATUS = 'P';
  isSpinning: boolean = false;
  filterClass: string = 'filter-invisible';
  applicationId = Number(this.cookie.get('applicationId'));
  selectedDate: any = [];
  dateFormat = 'dd/MM/yyyy';

  @ViewChild(TicketdetailsComponent, { static: false })
  details: TicketdetailsComponent;

  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Ticket = new Ticket();
  drawerData1: Ticketdetails = new Ticketdetails();
  data1: any = [];
  ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion = {};
  // value1: any = ""
  // value2: any = ""
  departments: any = [];
  departments2: any = [];

  departmentVisible: boolean = false;
  isnameFilterApplied: boolean = false;
  departmentText: string = '';

  ticketnoVisible: boolean = false;
  isticketnoFilterApplied: boolean = false;
  ticketnoText: string = '';

  mobilenoVisible: boolean = false;
  ismobilenoFilterApplied: boolean = false;
  mobileText: string = '';

  emailVisible: boolean = false;
  isemailFilterApplied: boolean = false;
  emailText: string = '';

  questionVisible: boolean = false;
  isquestionFilterApplied: boolean = false;
  questionText: string = '';

  istakenVisible: boolean = false;
  istakenstatusFilterApplied: boolean = false;
  // questionText: string = '';


  guaranteeVisible: boolean = false;
  isguaranteeFilterApplied: boolean = false;
  guaranteeText: string = '';


  warrantyVisible: boolean = false;
  iswarrantyFilterApplied: boolean = false;
  warrantyText: string = '';

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
      this.StartDate = null; // or [] if you prefer
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

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
    if (this.mobileText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.ismobilenoFilterApplied = true;
    } else if (this.mobileText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismobilenoFilterApplied = false;
    }
    if (this.emailText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isemailFilterApplied = true;
    } else if (this.emailText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isemailFilterApplied = false;
    }
    if (this.questionText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isquestionFilterApplied = true;
    } else if (this.questionText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isquestionFilterApplied = false;
    }


    if (this.warrantyText.length >= 2 && event.key === 'Enter') {
      this.search();
      this.iswarrantyFilterApplied = true;
    } else if (this.warrantyText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.iswarrantyFilterApplied = false;
    }

    if (this.guaranteeText.length >= 2 && event.key === 'Enter') {
      this.search();
      this.isguaranteeFilterApplied = true;
    } else if (this.guaranteeText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isguaranteeFilterApplied = false;
    }
    // if (this.lastDateText.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.isnameFilterApplied = true;
    // } else if (this.lastDateText.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.isnameFilterApplied = false;
    // }
  }

  // columnFilter() {
  //   if (this.departmentText.trim() === '') {
  //     this.searchText = '';
  //   } else if (this.departmentText.length >= 3) {
  //     this.search();
  //   } else {
  //     // this.message.warning('Please enter at least 3 characters to filter.', '');
  //   }
  // }

  reset() {
    this.departmentText = '';
    this.ticketnoText = '';
    this.mobileText = '';
    this.emailText = '';
    this.questionText = '';
  }

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private router: Router
  ) { }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  userid: any;
  ngOnInit() {
    this.decreptedroleIDString = this.roleID
      ? this.commonFunction.decryptdata(this.roleID)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.userid = Number(decryptedUserId);
    this.getMappedDepartments();

    this.table.data = [
      {
        CATEGORY_NAME: 'Electronics',
        STATUS: 'P',
        QUESTION: 'What is the warranty period?',
      },
    ];

    this.filteredData = this.table.data;

    this.columns.forEach((column) => {
      this.filterMenu[column[0]] = `filterMenu${column[0]}`;
    });

    // this.getAllDepartmentsData();
  }

  showcolumn = [
    { label: 'Customer Name ', key: 'NAME', visible: true },
    { label: 'E-mail ID', key: 'EMAIL', visible: true },
    { label: 'Mobile No.', key: 'MOBILE_NO', visible: true },
    { label: 'Customer Type', key: 'CUSTOMER_TYPE', visible: true },
    { label: 'Status', key: 'ACCOUNT_STATUS', visible: true },
  ];

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  selectedDepartment: any = '';

  onDepartmentChange(): void {
    //this.search();
    if (this.selectedDepartment?.length) {
      this.search();
      // this.istechniciannameFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      // this.istechniciannameFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }

  departmentData: any = '';
  getAllDepartmentsData() {
    this.api.getAllDepartments(0, 0, 'id', 'desc', '').subscribe((data) => {
      if (data['status'] == 200) {
        this.departmentData = data.body['data'];
      } else {
        this.departmentData = [];
      }
    });
  }

  // sort(sort: { key: string; value: string }): void {

  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }

  filterText: { [key: string]: string } = {};
  filterVisible: any = {};
  filteredData: any[] = [];
  selectedColumn: string = '';
  filterMenu: any = {};
  table: any = {
    data: [], // Initialize with your actual table data
  };

  onFilterVisibleChange(
    visible: boolean,
    columnKey: string,
    columnName: string
  ) {
    if (visible) {
      this.selectedColumn = columnName;
      this.selectedColumn = columnKey;
    } else {
      this.selectedColumn = '';
    }
  }

  filterQuery3: any = '';

  checkAndApplyFilter(event: KeyboardEvent, selectedColumn: string) {
    const filterValue = this.filterText[selectedColumn] || '';

    if (event.key === 'Enter' && filterValue.length >= 3) {
      this.filterQuery3 = ` AND ${selectedColumn} LIKE '%${filterValue}%'`;

      this.api
        .getAllTickets(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          '',
          this.filterQuery3
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
          },
          (err) => { }
        );
      this.filteredData = this.table.data.filter((item) =>
        item[selectedColumn]
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    } else if (event.key == 'Backspace' && filterValue.length === 0) {
      // Clear filterQuery3
      this.filterQuery3 = '';

      // Reload data without the cleared filter
      this.api
        .getAllTickets(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          '',
          this.filterQuery1 + ' AND ORG_ID=1'
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];

            // Reset filteredData to show full data list
            this.filteredData = this.dataList;
          },
          (err) => { }
        );
    }
  }

  // sort(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'id';
  //   const sortOrder = (currentSort && currentSort.value) || 'desc';

  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search(true);
  // }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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
  filterQuery1: any = '';

  value11: string | null = null;
  value22: string | null = null;

  filterQuery2: any = '';

  applyFilter() {
    // this.filterQuery2 = ''; // Reset the filter query

    // Check if the department is selected
    // if (this.selectedDepartment && this.selectedDepartment.length > 0) {
    //   // Join multiple selected departments with commas
    //   const departmentFilter = this.selectedDepartment.map(dept => `'${dept}'`).join(',');
    //   this.filterQuery2 = ` AND DEPARTMENT_NAME IN (${departmentFilter})`;
    // }

    // if (this.selectedDepartment && this.selectedDepartment.length > 0) {
    //   // Create a LIKE condition for each selected department
    //   const departmentConditions = this.selectedDepartment.map(dept => `DEPARTMENT_NAME LIKE '%${dept}%'`);
    //   this.filterQuery2 = ` AND (${departmentConditions.join(' OR ')})`;
    // }

    if (this.selectedDepartment && this.selectedDepartment.length > 0) {
      // Convert array to string and compare each value with DEPARTMENT_NAME
      const departmentConditions = this.selectedDepartment
        .map((dept) => `DEPARTMENT_NAME = '${dept}'`)
        .join(' OR ');

      // Apply the filter for all selected departments
      this.filterQuery2 = ` AND (${departmentConditions})`;
    }

    // Check if the date range is selected
    if (this.selectedDate && this.selectedDate.length === 2) {
      this.value11 = this.datePipe.transform(
        this.selectedDate[0],
        'yyyy-MM-dd'
      );
      this.value22 = this.datePipe.transform(
        this.selectedDate[1],
        'yyyy-MM-dd'
      );
      this.filterQuery2 += ` AND DATE(LAST_RESPONDED) BETWEEN '${this.value11}' AND '${this.value22}'`;
    }

    // Apply the filter if either department or date is selected
    // var sort: string;
    this.isFilterApplied = 'primary';
    // this.api
    //   .getAllTickets(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     '',
    //     this.filterQuery2
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.loadingRecords = false;
    //       this.totalRecords = data.body['count'];
    //       this.dataList = data.body['data'];
    //     },
    //     (err) => {
    //
    //     }
    //   );
    this.search();

    this.isSpinning = false;
    this.filterClass = 'filter-invisible';
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
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    var filterQuery5 = '';

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

    if (this.STATUS == 'AL') {
      this.filterQuery = this.filterQuery;
    } else {
      this.filterQuery1 = " AND STATUS='" + this.STATUS + "'";
    }

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

    if (this.mobileText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobileText.trim()}%'`;
    }
    if (this.emailText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.emailText.trim()}%'`;
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

    if (this.warrantyText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `WARRANTY_PERIOD LIKE '%${this.warrantyText.trim()}%'`;
    }

    if (this.guaranteeText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `GUARANTEE_PERIOD LIKE '%${this.warrantyText.trim()}%'`;
    }

    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        filterQuery5 +=
          (filterQuery5 ? ' AND ' : '') +
          `LAST_RESPONDED BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isscheduleDateFilterApplied = true;
    } else {
      this.isscheduleDateFilterApplied = false;
    }

    var filterQuery = this.filterQuery + this.filterQuery1;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (this.STATUS == 'P') {
      if (this.departments2.length > 0)
        filterQuery +=
          filterQuery + ' AND DEPARTMENT_ID IN (' + this.departments2 + ')';
    } else filterQuery += filterQuery + ' AND TAKEN_BY_USER_ID=' + this.userid;

    filterQuery5 = filterQuery5 ? ' AND ' + filterQuery5 : '';


    if (
      this.decreptedroleID == 8 ||
      this.decreptedroleID == 1) {
      this.api.getAllTickets(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filterQuery5 +
        filterQuery +
        likeQuery +
        this.filterQuery2 +
        ' AND ORG_ID = 1' +
        " AND ORDER_ID IS NULL " +
        " AND SHOP_ORDER_ID IS NULL"
      )
        .subscribe(
          (data) => {
            if (data.status === 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
            } else {
              this.loadingRecords = false;
              this.totalRecords = 0;
              this.dataList = [];
            }

          },
          (err) => {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
          }
        );
    } else {
      if (this.departments2.length > 0) {
        this.api.getAllTickets(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          filterQuery5 +
          filterQuery +
          likeQuery +
          this.filterQuery2 +
          ' AND ORG_ID = 1' +
          " AND ORDER_ID IS NULL " +
          " AND SHOP_ORDER_ID IS NULL"
        )
          .subscribe(
            (data) => {
              if (data.status === 200) {
                this.loadingRecords = false;
                this.totalRecords = data.body['count'];
                this.dataList = data.body['data'];
              } else {
                this.loadingRecords = false;
                this.totalRecords = 0;
                this.dataList = [];
              }

            },
            (err) => {
              this.loadingRecords = false;
              this.totalRecords = 0;
              this.dataList = [];
            }
          );
      } else {
        this.loadingRecords = false;
        this.totalRecords = 0;
        this.dataList = [];
      }
    }

    //
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // searchSet() {
  //   const scrollDownElement = document.getElementById("button1");
  //   if (scrollDownElement) {
  //     scrollDownElement.focus();
  //   }
  //   // document.getElementById('button1').focus();
  //   this.search(true)
  // }

  filterQuery4: any = '';
  searchSet() {
    if (this.searchText && this.searchText.length >= 3) {
      // Build a dynamic query to compare with each and every field
      // const searchConditions = this.columns.map(column =>
      //   `${column[0]} LIKE '%${this.searchText}%'`
      // ).join(' OR ');
      const searchConditions = this.columns
        .reduce((acc, column) => {
          if (this.searchText) {
            acc.push(`${column[0]} LIKE '%${this.searchText}%'`);
          }
          return acc;
        }, [])
        .join(' OR ');

      // Apply the filter query
      this.filterQuery4 = ` AND (${searchConditions})`;
      this.api
        .getAllTickets(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          '',
          this.filterQuery4
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
          },
          (err) => { }
        );
    } else {
      // Clear the filter if search text is less than 3 characters
      this.filterQuery4 = '';
    }

    // Trigger the search action
    // this.search(true);

    // this.filteredData = this.table.data.filter(item =>
    //   item[selectedColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase())
    // );
  }

  //   searchSet() {
  //     // Check if searchText is defined and length is >= 3
  //     if (this.searchText && this.searchText.length >= 3) {
  //       // Escape special characters in searchText
  //       const searchConditions = this.columns.map(column =>
  //         `${column[0]} LIKE '%${this.searchText}%'`
  //       ).join(' OR ');

  //       // Apply the filter query
  //       this.filterQuery4 = ` AND (${searchConditions})`;

  //       // Only apply the filter if there are conditions
  //       if (searchConditions) {
  //         this.filterQuery4 = ` AND (${searchConditions})`;
  //       } else {
  //         this.filterQuery4 = ''; // Clear filter if no conditions
  //       }
  //     } else {
  //       this.filterQuery4 = ''; // Clear filter if searchText is too short
  //     }

  //     // Trigger the search action
  //     // this.search(true);
  //     this.api.getAllTickets(this.pageIndex, this.pageSize, this.sortKey, '', this.filterQuery4).subscribe(data => {
  //       this.loadingRecords = false;
  //       this.totalRecords = data['count'];
  //       this.dataList = data['data'];

  //     }, err => {
  //
  //     });
  //   } else {
  //   // Clear the filter if search text is less than 3 characters
  //   this.filterQuery4 = '';
  // }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  clearFilter() {
    this.STATUS = 'P';
    // this.filterQuery = ""
    this.filterQuery2 = '';
    this.selectedDate = null;
    this.selectedDepartment = [];
    this.value11 = '';
    this.value22 = '';
    this.filterClass = 'filter-invisible';
    this.applyFilter();
  }

  changeDate(value) {
    // this.value1 = this.datePipe.transform(value[0], "yyyy-MM-dd")
    // this.value2 = this.datePipe.transform(value[1], "yyyy-MM-dd");
  }

  uniqueDateArry: any = [];
  newData2: any = [];
  grpid: number;
  GRPNAME: any = '';
  bread: any = [];
  Grpname: string;
  newstr: string = '';
  isloading = false;
  @ViewChild(TicketdetailsComponent, { static: false })
  TicketdetailsComponentVar: TicketdetailsComponent;

  ViewDetails(data) {
    this.isloading = true;

    this.newData2 = [];
    this.data1 = [];
    this.uniqueDateArry = [];
    // this.TicketdetailsComponentVar.loading = true;
    this.drawerTitle = 'Ticket No. ' + data.TICKET_NO;
    this.drawerData = Object.assign({}, data);

    var filterQuery1 = ' AND TICKET_MASTER_ID = ' + data.ID + '';

    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filterQuery1)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            // this.TicketdetailsComponentVar.loading = false;

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
            // this.api.getBreadInChat(0, 0, 'ID', 'desc', '', '', this.grpid)
            //   .subscribe(
            //     (data) => {
            //       if (data['status'] == 200) {

            //         this.bread = data.body['data'];

            //
            //
            //
            //         this.newstr = '';
            //         this.GRPNAME = '';

            //         for (var i = 0; i < this.bread.length; i++) {
            //           this.GRPNAME =
            //             this.GRPNAME + '>' + this.bread[i]['VALUE'];
            //           var str = this.GRPNAME;
            //           this.newstr = str.replace('>', '');
            //         }
            //       }
            //     },
            //     (err) => { }
            //   );

            this.api
              .getBreadInChat(
                0,
                0,
                'ID',
                'desc',
                '',
                '',
                this.drawerData.TICKET_GROUP_ID
              )
              .subscribe(
                (data: HttpResponse<any>) => {
                  if (data.status == 200) {
                    data = data.body;
                    this.bread = data['data'];

                    // this.isSpinning = false;

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
                  // this.isSpinning = false;
                }
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

  changeRadioButton(event) {
    this.STATUS = event;
    this.applyFilter();
  }

  // getMappedDepartments() {
  //   this.empList = [];
  //   if (
  //     this.decreptedbackofficeID !== null &&
  //     this.decreptedbackofficeID !== undefined &&
  //     this.decreptedbackofficeID !== '' &&
  //     !Number.isNaN(this.decreptedbackofficeID)
  //   ) {
  //     this.api
  //       .mappedDepartments(
  //         0,
  //         0,
  //         '',
  //         '',

  //         ' AND IS_ACTIVE = 1 AND BACKOFFICE_ID = ' + this.decreptedbackofficeID
  //       )
  //       .subscribe(
  //         (data) => {
  //           this.empList = data['data'];

  //           for (var i = 0; i < this.empList?.length; i++) {
  //             this.departments2.push(this.empList[i]['DEPARTMENT_ID']);
  //           }
  //           this.search();
  //         },
  //         (err) => { }
  //       );
  //   } else {
  //     this.search();
  //   }
  // }

  getMappedDepartments() {
    this.empList = [];
    if (
      this.decreptedbackofficeID !== null &&
      this.decreptedbackofficeID !== undefined &&
      this.decreptedbackofficeID !== '' &&
      !Number.isNaN(this.decreptedbackofficeID)
    ) {
      // console.log("1")
      // this.api
      //   .getBackofcTerritoryMappedData(
      //     0,
      //     0,
      //     '',
      //     '',
      //     ' AND IS_ACTIVE =1 AND BACKOFFICE_ID =' + this.decreptedbackofficeID
      //   )
      //   .subscribe((data2) => {
      //     if (data2['code'] == '200') {
      //       console.log("11")

      // if (data2['count'] > 0) {
      //   console.log("111")

      //   data2['data'].forEach((element) => {
      //     this.teritoryIds.push(element.TERITORY_ID);
      //   });
      //   console.log("111this.teritoryIds", this.teritoryIds.length)

      // if (this.teritoryIds.length > 0) {


      this.api
        .mappedDepartments(
          0,
          0,
          '',
          '',

          ' AND IS_ACTIVE = 1 AND BACKOFFICE_ID = ' + this.decreptedbackofficeID
        )
        .subscribe(
          (data) => {

            this.empList = data['data'];
            if (data['code'] == '200') {


              for (var i = 0; i < this.empList?.length; i++) {
                this.departments2.push(this.empList[i]['DEPARTMENT_ID']);
              }
              if (this.departments2.length > 0) {


                this.search(true);
              } else {
                this.loadingRecords = false;
                this.totalRecords = 0;
                this.dataList = [];
              }
            } else {
              this.loadingRecords = false;
              this.totalRecords = 0;
              this.dataList = [];
              this.departments2 = []
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.departments2 = []
          }
        );
      // } else {
      //   this.loadingRecords = false;
      //   this.totalRecords = 0;
      //   this.dataList = [];
      //   this.departments2 = []
      // }

      // } else {
      //   this.loadingRecords = false;
      //   this.totalRecords = 0;
      //   this.dataList = [];
      //   this.departments2 = []
      // }
      //   } else {
      //     this.loadingRecords = false;
      //     this.totalRecords = 0;
      //     this.dataList = [];
      //     this.departments2 = []
      //   }
      // }, err => {
      //   this.loadingRecords = false;
      //   this.totalRecords = 0;
      //   this.dataList = [];
      //   this.departments2 = []
      // });
    } else {

      this.search(true);
    }
  }
}