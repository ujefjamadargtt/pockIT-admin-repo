import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { customer } from 'src/app/Pages/Models/customer';
import { customerAddLogin } from 'src/app/Pages/Models/customerAddLogin';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-add-login-customer-list',
  templateUrl: './add-login-customer-list.component.html',
  styleUrls: ['./add-login-customer-list.component.css'],
})
export class AddLoginCustomerListComponent {
  @Input() data: any = customerAddLogin;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() mainCustData: customer = new customer();

  drawerDataAddLogin: any;
  isparentId: any;

  drawerCustomerAddLoginVisible = false;
  widthCustomerAddLogin: string = '50%';
  custid: any;
  formTitle = 'Manage Logins';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  // dataList = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  dropdownOpen = false;
  columns: string[][] = [
    ['NAME', 'Customer Name'],
    ['COMPANY_NAME', 'Company Name'],
    ['EMAIL', 'E-Mail ID'],
    ['MOBILE_NO', 'Mobile No.'],
    ['CUSTOMER_TYPE', 'Customer Type'],
    ['ACCOUNT_STATUS', 'Status'],
    ['SHORT_CODE', 'SHORT_CODE'],
  ];

  drawerTitleMap: string;
  drawerDataMap: customer = new customer();
  drawerDataSer: customer = new customer();
  drawerData1: customer = new customer();
  drawerTitleMa!: string;
  drawerTitleSer!: string;
  dataList: any[] = [];
  filteredData: any[] = [];
  time = new Date();
  features = [];
  visible = false;
  // drawerVisible: boolean;
  drawerTitle: string;
  drawerData: customer = new customer();
  customerVisible: boolean = false;
  drawerVisible1invoice: boolean = false;
  cmpnyNamevisible: boolean = false;
  emailvisible: boolean = false;
  mobilevisible: boolean = false;
  customervisible: boolean = false;
  shortcodeVisible: boolean = false;
  isShortCodeFilterApplied: boolean = false;
  shorttext: string = '';
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  customertext: string = '';
  emailtext: string = '';
  companyNameText: string = '';
  mobiletext: string = '';
  companyName: string;
  isfilterapply: boolean = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name ', value: 'NAME' },
    { label: 'E-mail ID', value: 'EMAIL' },
    { label: 'Mobile No.', value: 'MOBILE_NO' },
    { label: 'Customer Type', value: 'CUSTOMER_TYPE' },
  ];
  showcolumn = [
    { label: 'Customer Name ', key: 'NAME', visible: true },
    { label: 'E-mail ID', key: 'EMAIL', visible: true },
    { label: 'Mobile No.', key: 'MOBILE_NO', visible: true },
    { label: 'Customer Type', key: 'CUSTOMER_TYPE', visible: true },
    { label: 'Status', key: 'ACCOUNT_STATUS', visible: true },
  ];

  // Edit Code 3
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

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {}

  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  public commonFunction = new CommonFunctionService();
  TabId: number;
  ngOnInit() {
    this.search();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }
  back() {
    this.router.navigate(['/masters/menu']);
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
  isnameFilterApplied: boolean = false;
  iscmpnyNameFilterApplied: boolean = false;
  isemailFilterApplied: boolean = false;
  ismobileFilterApplied: boolean = false;

  sort(params: NzTableQueryParams): void {
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
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  edit(data: customer): void {
    this.custid = data.ID;

    this.drawerTitle = 'Update Customer';
    this.drawerDataAddLogin = Object.assign({}, data);
    this.isparentId = data.PARENT_ID;
    this.mainCustData = this.mainCustData;
    this.drawerCustomerAddLoginVisible = true;
  }

  search(reset: boolean = false) {
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
    this.loadingRecords = true;

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllCustomer(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
          this.filterQuery +
          ' AND IS_DELETED_BY_CUSTOMER=0 AND IS_PARENT=0 AND CUSTOMER_DETAILS_ID=' +
          this.mainCustData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
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
  }

  AddLogins(data: any): void {
    this.drawerTitle = `Add Logins`;
    this.drawerDataAddLogin = Object.assign({}, data);
    this.drawerCustomerAddLoginVisible = true;
    this.custid = data.ID;
    this.companyName = data.COMPANY_NAME;
  }

  get closeCustomerAddLoginCallback() {
    return this.drawerCustomerAddLoginClose.bind(this);
  }

  drawerCustomerAddLoginClose(): void {
    this.drawerCustomerAddLoginVisible = false;
    this.search(true);
  }

  add(): void {
    this.drawerTitle = 'Create New Logins';
    this.drawerDataAddLogin = new customerAddLogin();
    this.isparentId = this.data.CUSTOMER_MASTER_ID;
    this.custid = '';
    this.mainCustData = this.mainCustData;
    this.drawerCustomerAddLoginVisible = true;
  }

  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
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

  drawerVisibleCustomersLogs: boolean;
  drawerTitleCustomersLogs: string;
  drawerDataCustomersLogs: customer = new customer();
  width: any = '100%';
  custmoerid: any;

  viewLogs(data: customer): void {
    this.drawerTitleCustomersLogs = `View Address Logs of ${data.NAME}`;
    this.drawerDataCustomersLogs = Object.assign({}, data);
    this.drawerVisibleCustomersLogs = true;
    this.custmoerid = data.ID;
  }

  drawerCloseCustomersLogs(): void {
    this.search();
    this.drawerVisibleCustomersLogs = false;
  }
  get closeCallbackCustomersLogs() {
    return this.drawerCloseCustomersLogs.bind(this);
  }

  reset() {
    this.shorttext = '';
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.shorttext.length >= 1 && event.key === 'Enter') {
      this.isShortCodeFilterApplied = true;
    } else if (this.shorttext.length == 0 && event.key === 'Backspace') {
      this.isShortCodeFilterApplied = false;
    }
  }

  drawerDataEmail: customerAddLogin = new customerAddLogin();
  drawerCustomerEmailVisible: boolean = false;
  widthCustomerEmail: string = '60%';
  mainCustDataEmail: any;
  addEmailID(data: any): void {
    this.drawerTitle = `Map Email ID(s)`;
    this.drawerDataEmail = Object.assign({}, data);
    this.mainCustDataEmail = Object.assign({}, data);
    this.drawerCustomerEmailVisible = true;
    this.custid = data.ID;
    this.companyName = data.COMPANY_NAME;
  }

  get closeCustomerEmailCallback() {
    return this.drawerCustomerEmailClose.bind(this);
  }

  drawerCustomerEmailClose(): void {
    this.drawerCustomerEmailVisible = false;
  }
}
