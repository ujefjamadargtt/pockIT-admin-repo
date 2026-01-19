import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentComponent } from '../department/department.component';
import {
  Department,
  DepartmentworkingDetails,
} from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent implements OnInit {
  formTitle = 'Manage Departments';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied = false;
  columns: string[][] = [
    ['NAME', 'Department Name'],
    ['SHORT_CODE', 'Short Code'],
    ['SEQUENCE_NO', 'Sequence no'],
  ];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Department = new Department();
  applicationId = Number(this.cookie.get('applicationId'));
  drawerVisible1: boolean;
  drawerTitle1: string;
  drawerData1: Department = new Department();
  listOfData: DepartmentworkingDetails[] = [];
  OPEN_TIME2 = null;
  CLOSE_TIME2 = null;
  DAYS = false;
  org: any = [];
  orgId = this.cookie.get('orgId');
  back() {
    this.router.navigate(['/masters/menu']);
  }
  public commonFunction = new CommonFunctionService();
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private router: Router,
    private message: NzNotificationService
  ) { }
  USER_ID: any;
  userId = sessionStorage.getItem('userId');
  ngOnInit() {
    this.search();
    this.orgId = this.cookie.get('orgId');
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.sortKey = sortField;
    this.sortValue = sortOrder;
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
  search(reset: boolean = false) {
    var filter = '';
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
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
    if (this.depttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.depttext.trim()}%'`;
    }
    if (this.Shortcodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.Shortcodetext.trim()}%'`;
    }
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQUENCE_NO LIKE '%${this.Seqtext.toString().trim()}%'`;
    }
    if (this.Timetext && this.Timetext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TIME_PERIOD LIKE '%${this.Timetext.toString().trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllDepartments(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['body']['count'];
          this.dataList = data['body']['data'];
          this.TabId = data['body']['TAB_ID'];
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  savedFilters: any;
  TabId: number;
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
  }
  filterloading: boolean = false;
  isDeleting: boolean = false;
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
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  add(): void {
    this.drawerTitle = 'Create New Department';
    this.drawerData = new Department();
    this.drawerData.ORG_ID = Number(1);
    this.listOfData = [];
    this.api
      .getAllDepartments(
        1,
        1,
        'SEQUENCE_NO',
        'desc',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['body']['count'] == 0) {
            this.drawerData.SEQUENCE_NO = 1;
          } else {
            this.drawerData.SEQUENCE_NO =
              Number(data['body']['data'][0]['SEQUENCE_NO']) + 1;
          }
        },
        (err) => { }
      );
    for (let i = 0; i < 7; i++) {
      this.listOfData.push({
        ID: 0,
        DAY: i,
        IS_HOLIDAY: false,
        OPEN_TIME: null,
        CLIENT_ID: this.api.clientId,
        DEPARTMENT_ID: 0,
        DATE: '',
        CLOSE_TIME: null,
      });
    }
    this.OPEN_TIME2 = null;
    this.CLOSE_TIME2 = null;
    this.DAYS = false;
    this.drawerVisible = true;
  }
  @ViewChild(DepartmentComponent, { static: false })
  DepartmentComponentVar: DepartmentComponent;
  edit(data: Department): void {
    this.drawerTitle = 'Update Department';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  getdepartments() {
    this.api
      .getAllDepartments(
        1,
        1,
        'SEQUENCE_NO',
        'asc',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['count'] == 0) {
            this.drawerData.SEQUENCE_NO = 1;
          } else {
            this.drawerData.SEQUENCE_NO =
              Number(data['data'][0]['SEQUENCE_NO']) + 1;
          }
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => { }
      );
  }
  drawerClose(): void {
    this.drawerVisible = false;
    this.search();
  }
  drawerClose1(): void {
    this.drawerVisible1 = false;
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
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
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
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Department Filter';
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Department Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Department Name',
    },
    {
      key: 'SHORT_CODE',
      label: 'Short Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Short Code',
    },
    {
      key: 'TICKET_TIME_PERIOD',
      label: 'Closure Time (In Day(s))',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Closure Time in Days',
    },
    {
      key: 'SEQUENCE_NO',
      label: 'Sequence Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sequence Number',
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
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];
  oldFilter: any[] = [];
  isLoading = false;
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  Departmentvisible = false;
  ShortCodevisible = false;
  Seqvisible = false;
  Timevisible = false;
  depttext: string = '';
  Seqtext: any = '';
  isShortApplied = false;
  isSeqApplied = false;
  Timetext: any = '';
  isTimeApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.depttext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.depttext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.Shortcodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isShortApplied = true;
    } else if (this.Shortcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isShortApplied = false;
    }
    if (this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isSeqApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isSeqApplied = false;
    }
    if (this.Timetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isTimeApplied = true;
    } else if (this.Timetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isTimeApplied = false;
    }
  }
  Countryvisible = false;
  Shortcodetext: string = '';
  reset(): void {
    this.searchText = '';
    this.depttext = '';
    this.Seqtext = '';
    this.Shortcodetext = '';
    this.Timetext = '';
    this.search();
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
}