import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { category } from 'src/app/Pages/Models/category';
import { customer } from 'src/app/Pages/Models/customer';
import { customerAddLogin } from 'src/app/Pages/Models/customerAddLogin';
import { ServiceCatMasterDataNewB2b } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  formTitle = 'Manage Customers';
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
    ['CUSTOMER_MANAGER_NAME', 'Manager Name'],
    ['CUSTOMER_TYPE', 'Customer Type'],
    ['ACCOUNT_STATUS', 'Status'],
    ['SHORT_CODE', 'SHORT_CODE'],
  ];

  // columns1: string[][] = [["NAME", "Branch Name"], ["COUNTRY_NAME", "Country"], ["STATE_NAME", "State"], ["CITY_NAME", "City"]];
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
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: customer = new customer();
  customerVisible: boolean = false;
  drawerVisible1invoice: boolean = false;
  cmpnyNamevisible: boolean = false;
  emailvisible: boolean = false;
  mobilevisible: boolean = false;
  customervisible: boolean = false;
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  accountstatus: any = 'Active';
  accountstatusFilter: any = '';
  customertext: string = '';

  shorttext: string = '';
  shortcodeVisible: boolean = false;
  isShortCodeFilterApplied: boolean = false;
  isnameFilterApplied: boolean = false;
  iscmpnyNameFilterApplied: boolean = false;
  isemailFilterApplied: boolean = false;
  ismobileFilterApplied: boolean = false;
  manNamevisible = false;
  ismanNameFilterApplied: boolean = false;
  manNameText: string = '';
  emailtext: string = '';
  companyNameText: string = '';
  mobiletext: string = '';
  companyName: string;

  isB2CcmpnyAddressFilterApplied: boolean = false;
  B2CcmpnyAddressvisible: boolean = false;
  B2CcmpnyAddressText: string = '';

  isB2CcmpnyNameFilterApplied: boolean = false;
  B2CcmpnyNamevisible: boolean = false;
  B2CcmpnyNameText: string = '';

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
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  public commonFunction = new CommonFunctionService();
  TabId: number;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
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

  nameFilter() {
    if (this.customertext.trim() === '') {
      this.searchText = '';
    } else if (this.customertext.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  managerFilter() {
    if (this.manNameText.trim() === '') {
      this.searchText = '';
    } else if (this.manNameText.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  companyFilter() {
    if (this.companyNameText.trim() === '') {
      this.searchText = '';
    } else if (this.companyNameText.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  emailFilter() {
    if (this.emailtext.trim() === '') {
      this.searchText = '';
    } else if (this.emailtext.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  companyNameFilter() {
    if (this.B2CcmpnyNameText.trim() === '') {
      this.searchText = '';
    } else if (this.B2CcmpnyNameText.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  companyAddressFilter() {
    if (this.B2CcmpnyAddressText.trim() === '') {
      this.searchText = '';
    } else if (this.B2CcmpnyAddressText.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  mobileFilter() {
    if (this.mobiletext.trim() === '') {
      this.searchText = '';
    } else if (this.mobiletext.length >= 3) {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
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
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
  }

  activestateget(event: any) {
    this.accountstatus = event;
    if (this.accountstatus === 'Active') {
      this.search(true);
    } else {
      this.search1(true);
    }
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
    if (this.customertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.customertext.trim()}%'`;
    }

    if (this.B2CcmpnyNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INDIVIDUAL_COMPANY_NAME LIKE '%${this.B2CcmpnyNameText.trim()}%'`;
    }

    if (this.B2CcmpnyAddressText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COMPANY_ADDRESS LIKE '%${this.B2CcmpnyAddressText.trim()}%'`;
    }

    if (this.shorttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.shorttext.trim()}%'`;
    }

    if (this.manNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_MANAGER_NAME LIKE '%${this.manNameText.trim()}%'`;
    }
    if (this.companyNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COMPANY_NAME LIKE '%${this.companyNameText.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobiletext.trim()}%'`;
    }

    if (this.customertypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CUSTOMER_TYPE = '${this.customertypeFilter}'`;
    }

    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ACCOUNT_STATUS = ${this.statusFilter}`;
    }

    if (this.GSTFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_HAVE_GST = ${this.GSTFilter}`;
    }

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (this.accountstatus === 'Active') {
      this.accountstatusFilter = ' AND IS_DELETED_BY_CUSTOMER=0';
    } else {
      this.accountstatusFilter = ' AND IS_DELETED_BY_CUSTOMER=1';
    }
    this.api
      .getCustomerDetails(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.accountstatusFilter
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

  search1(reset: boolean = false) {
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
    if (this.customertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.customertext.trim()}%'`;
    }

    if (this.manNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_MANAGER_NAME LIKE '%${this.manNameText.trim()}%'`;
    }
    if (this.companyNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COMPANY_NAME LIKE '%${this.companyNameText.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobiletext.trim()}%'`;
    }

    if (this.customertypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CUSTOMER_TYPE = '${this.customertypeFilter}'`;
    }

    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ACCOUNT_STATUS = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (this.accountstatus === 'Active') {
      this.accountstatusFilter = ' AND IS_DELETED_BY_CUSTOMER=0';
    } else {
      this.accountstatusFilter = ' AND IS_DELETED_BY_CUSTOMER=1';
    }
    this.api
      .getAllCustomer(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.accountstatusFilter
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Customer';
    this.drawerData = new customer();
    this.drawerVisible = true;
  }

  custid: any;
  CUSTOMER_MASTER_ID: any;
  edit(data: customer): void {
    this.custid = data.CUSTOMER_MASTER_ID;
    this.CUSTOMER_MASTER_ID = data.ID;

    this.drawerTitle = 'Update Customer';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  close(): void {
    this.visible = false;
  }

  close1(accountMasterPage: NgForm) {
    this.drawerVisible1 = false;
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }

  drawerClose(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }

    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }

  allChecked;

  selectedOptions: any[] = [];
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Update column visibility on checkbox change
  onCheckboxChange(column: any) {
    column.visible = !column.visible;
  }
  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search(true);
      } else {
        this.search1(true);
      }
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      if (this.accountstatus === 'Active') {
        this.search(true);
      } else {
        this.search1(true);
      }
    }
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.customertext.length >= 3 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isnameFilterApplied = true;
    } else if (this.customertext.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isnameFilterApplied = false;
    }

    if (this.manNameText.length >= 3 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.ismanNameFilterApplied = true;
    } else if (this.manNameText.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.ismanNameFilterApplied = false;
    }

    if (this.emailtext.length >= 3 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isemailFilterApplied = true;
    } else if (this.emailtext.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isemailFilterApplied = false;
    }

    if (this.mobiletext.length > 0 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.ismobileFilterApplied = true;
    } else if (this.mobiletext.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.ismobileFilterApplied = false;
    }

    if (this.companyNameText.length >= 3 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.iscmpnyNameFilterApplied = true;
    } else if (this.companyNameText.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.iscmpnyNameFilterApplied = false;
    }

    if (this.shorttext.length >= 1 && event.key === 'Enter') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isShortCodeFilterApplied = true;
    } else if (this.shorttext.length == 0 && event.key === 'Backspace') {
      if (this.accountstatus === 'Active') {
        this.search();
      } else {
        this.search1();
      }
      this.isShortCodeFilterApplied = false;
    }

    if (this.B2CcmpnyNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isB2CcmpnyNameFilterApplied = true;
    } else if (this.B2CcmpnyNameText.length == 0 && event.key === 'Backspace') {
      this.search1();
      this.isB2CcmpnyNameFilterApplied = false;
    }

    if (this.B2CcmpnyAddressText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isB2CcmpnyAddressFilterApplied = true;
    } else if (
      this.B2CcmpnyAddressText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search1();
      this.isB2CcmpnyAddressFilterApplied = false;
    }
  }
  listOfFilter1: any[] = [
    { text: 'Individual', value: 'I' },
    { text: 'Business', value: 'B' },
  ];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  listOfFilter2: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, '', '', ' AND ACCOUNT_STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countryData = data['data'];
          } else {
            this.countryData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  pincodeData: any = [];
  getPincodeData() {
    this.api
      .getAllCountryMaster(0, 0, '', '', ' AND ACCOUNT_STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.pincodeData = data['data'];
          } else {
            this.pincodeData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  cityData: any = [];
  getCityData() {
    this.api
      .getAllCityMaster(0, 0, '', '', ' AND ACCOUNT_STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cityData = data['data'];
          } else {
            this.cityData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  stateData: any = [];
  getStateData() {
    this.api.getState(0, 0, '', '', ' AND ACCOUNT_STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.stateData = data['data'];
        } else {
          this.stateData = [];
          this.message.error('Failed To Get State Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  GSTFilter: string | undefined = undefined;
  onGSTFilterChange(selectedStatus: string) {
    this.GSTFilter = selectedStatus;
    this.search(true);
  }
  customertypeFilter: string | undefined = undefined;
  customertypeFilterChange(selectedStatus: string) {
    this.customertypeFilter = selectedStatus;
    this.search(true);
  }
  reset() {
    this.customertext = '';
  }
  reset1() {
    this.emailtext = '';
    this.companyNameText = '';
    this.manNameText = '';
  }
  reset2() {
    this.mobiletext = '';
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  // shreya
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: customer = new customer();
  widths: any = '100%';
  custidOverview: any;
  view(data: customer): void {
    this.custidOverview = data.CUSTOMER_MASTER_ID;
    this.CUSTOMER_MASTER_ID = data.CUSTOMER_MASTER_ID;
    this.drawerTitleCustomers = `View details of ${data.NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }

  // new filter
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
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Customer Filter';
    // this.applyCondition = "";

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

  drawerfilterClose(buttontype, updateButton): void {
    //

    this.drawerFilterVisible = false;
    this.loadFilters();

    this.whichbutton = buttontype;
    this.updateBtn = updateButton;

    if (buttontype == 'SA') {
      //
      //

      this.loadFilters();
    } else if (buttontype == 'SC') {
      //
      this.loadFilters();
    }
  }
  whichbutton: any;

  filterloading: boolean = false;
  isDeleting: boolean = false;

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
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
  }

  deleteItem(item: any): void {
    //

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
            //
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

  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'NAME',
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
      placeholder: 'Enter name',
    },

    {
      key: 'COMPANY_NAME',
      label: 'Company Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Company Name',
    },
    {
      key: 'EMAIL',
      label: 'Email ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Email ID',
    },
    {
      key: 'MOBILE_NO',
      label: 'Mobile Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Mobile Number',
    },

    {
      key: 'CUSTOMER_MANAGER_NAME',
      label: 'Manager name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Manager name',
    },
    {
      key: 'CUSTOMER_TYPE',
      label: 'Customer Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'I', display: 'Individual' },
        { value: 'B', display: 'Business' },
      ],
      placeholder: 'Select Customer Type',
    },

    {
      key: 'IS_HAVE_GST',
      label: 'GST Invoice ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Have GST ?',
    },

    {
      key: 'INDIVIDUAL_COMPANY_NAME',
      label: 'B2C Company Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2C Company Name',
    },
    {
      key: 'COMPANY_ADDRESS',
      label: 'B2C Company Address',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2C Company Address',
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
      key: 'ACCOUNT_STATUS',
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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings

        switch (comparator) {
          case 'Contains':
            return `${field} LIKE '%${value}%'`;
          case 'Does Not Contains':
            return `${field} NOT LIKE '%${value}%'`;
          case 'Starts With':
            return `${field} LIKE '${value}%'`;
          case 'Ends With':
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });

      const nestedGroups = (group.groups || []).map(processGroup);

      // Combine conditions and nested group queries using the group's operator
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };

    return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with ' AND'
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  widthsss: any = '100%';
  drawerserviceVisibleMap: boolean = false;
  ServiceMapping(data: any): void {
    this.drawerTitleMa = `${data.NAME} Customer Wise Service Change Management`;
    this.drawerDataMap = Object.assign({}, data);
    this.drawerserviceVisibleMap = true;
  }

  drawerServiceMappingCloseMap(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerserviceVisibleMap = false;
  }
  get closeServiceMappingCallbackMap() {
    return this.drawerServiceMappingCloseMap.bind(this);
  }

  drawerserviceVisibleSer: boolean = false;
  ServiceMappingSer(data: any): void {
    this.drawerTitleSer = `Manage Services`;
    this.drawerDataSer = Object.assign({}, data);
    this.drawerserviceVisibleSer = true;
  }

  drawerServiceMappingCloseSer(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerserviceVisibleSer = false;
  }
  get closeServiceMappingCallbackSer() {
    return this.drawerServiceMappingCloseSer.bind(this);
  }

  custid1: any;
  widthInv: any = '70%';
  viewInvoiceRequest(data: any): void {
    this.drawerTitle1 = `Verify Invoice Requests`;
    this.custid1 = data.ID;
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1invoice = true;
  }

  drawerClose1invoice(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerVisible1invoice = false;
  }
  get closeCallback1() {
    return this.drawerClose1invoice.bind(this);
  }
  oldFilter: any[] = [];
  isLoading = false;
  isfilterapply: boolean = false;

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
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }
  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
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

  // profile photo
  ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'CustomerProfile/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  drawerSlotsVisible = false;
  drawerTitleSlots!: string;
  drawerDataSlots: customer = new customer();

  drawerSlotsMappingClose(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerSlotsVisible = false;
  }
  get closeSlotsMappingCallback() {
    return this.drawerSlotsMappingClose.bind(this);
  }

  MapTimeSLots(data: any): void {
    this.drawerTitleSlots = ` Map Time Slots to the ${data.NAME} Customer`;
    this.drawerDataSlots = Object.assign({}, data);
    this.drawerSlotsVisible = true;
  }

  //Sanjana

  widthTechnician: string = '100%';

  get closeTechniciansMappingCallback() {
    return this.drawerTechniciansMappingClose.bind(this);
  }
  drawerTechniciansVisible = false;
  drawerTechniciansMappingClose(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerTechniciansVisible = false;
  }

  TechnicianMapping(data: any): void {
    this.drawerTitle = ` Map technicians to the ${data.COMPANY_NAME}`;
    this.drawerData = Object.assign({}, data);
    this.drawerTechniciansVisible = true;
  }

  //Add Logins

  drawerDataAddLogin: customerAddLogin = new customerAddLogin();

  drawerCustomerAddLoginVisible = false;
  widthCustomerAddLogin: string = '50%';

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
  }

  //Add Login List
  drawerDataAddLoginList: customerAddLogin = new customerAddLogin();

  drawerCustomerAddLoginListVisible = false;
  widthCustomerAddListLogin: string = '70%';
  mainCustData: any;
  addNewLogins(data: any): void {
    this.drawerTitle = `Add Logins`;
    this.drawerDataAddLoginList = Object.assign({}, data);
    this.mainCustData = Object.assign({}, data);
    this.drawerCustomerAddLoginListVisible = true;
    this.custid = data.ID;
    this.companyName = data.COMPANY_NAME;
  }

  get closeCustomerAddLoginListCallback() {
    return this.drawerCustomerAddLoginListClose.bind(this);
  }

  drawerCustomerAddLoginListClose(): void {
    this.drawerCustomerAddLoginListVisible = false;
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

  parentSerId: any;
  sername: any;
  drawerDataB2bCust: customer = new customer();
  drawerVisibleB2bCust: boolean = false;
  drawerTitleB2bCust: any = '';
  addSubServiceB2bCust(data: customer): void {
    this.drawerTitleB2bCust = 'Manage Services';
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerDataB2bCust = Object.assign({}, data);
    this.parentSerId = data.ID;
    this.drawerVisibleB2bCust = true;
  }

  drawerCloseSubserviceB2bCust(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerVisibleB2bCust = false;
  }

  get closeCallbacksubserviceB2bCust() {
    return this.drawerCloseSubserviceB2bCust.bind(this);
  }

  //sanjana
  drawerVisibleCustomersLogs: boolean;
  drawerTitleCustomersLogs: string;
  drawerDataCustomersLogs: customer = new customer();
  width: any = '100%';
  custmoerid: any;

  viewLogs(data: customer): void {
    this.CUSTOMER_MASTER_ID = data.CUSTOMER_MASTER_ID;
    this.drawerTitleCustomersLogs = `View Address Logs of ${data.NAME}`;
    this.drawerDataCustomersLogs = Object.assign({}, data);
    this.drawerVisibleCustomersLogs = true;
    this.custmoerid = data.CUSTOMER_MASTER_ID;
  }

  drawerCloseCustomersLogs(): void {
    if (this.accountstatus === 'Active') {
      this.search();
    } else {
      this.search1();
    }
    this.drawerVisibleCustomersLogs = false;
  }
  get closeCallbackCustomersLogs() {
    return this.drawerCloseCustomersLogs.bind(this);
  }

  // activateBoolean: boolean = false;
  activateBoolean: boolean[] = [];

  activatecustomer(data: any, index: any): void {
    this.activateBoolean[index] = true;
    this.api.activatthisecustomer(data.ID, data.NAME, data.MOBILE_NO).subscribe(
      (response) => {
        if (response['code'] === 200) {
          this.activateBoolean[index] = false;
          this.message.success(
            'Customer account has been reactivated successfully.',
            ''
          );
          if (this.accountstatus === 'Active') {
            this.search();
          } else {
            this.search1();
          }
        } else {
          this.activateBoolean[index] = false;
          this.message.error('Failed to reactivate customer account.', '');
        }
      },
      (err: HttpErrorResponse) => {
        this.activateBoolean[index] = false;
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
