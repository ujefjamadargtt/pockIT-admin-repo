import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { customer } from 'src/app/Pages/Models/customer';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-custome-activity-list',
  templateUrl: './custome-activity-list.component.html',
  styleUrls: ['./custome-activity-list.component.css'],
})
export class CustomeActivityListComponent implements OnInit {
  formTitle = 'Customers Activities';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
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
    ['EMAIL', 'E-Mail ID'],
    ['MOBILE_NO', 'Mobile No.'],
    ['CUSTOMER_TYPE', 'Customer Type'],
    ['ACCOUNT_STATUS', 'Status'],
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
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: customer = new customer();
  customerVisible: boolean = false;
  drawerVisible1invoice: boolean = false;
  emailvisible: boolean = false;
  mobilevisible: boolean = false;
  customervisible: boolean = false;
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  customertext: string = '';
  emailtext: string = '';
  mobiletext: string = '';
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
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public router: Router
  ) { }
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  public commonFunction = new CommonFunctionService();
  TabId: number;
  ngOnInit() {
    this.search();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isnameFilterApplied: boolean = false;
  isemailFilterApplied: boolean = false;
  ismobileFilterApplied: boolean = false;
  nameFilter() {
    if (this.customertext.trim() === '') {
      this.searchText = '';
    } else if (this.customertext.length >= 3) {
      this.search(true);
    } else {
    }
  }
  emailFilter() {
    if (this.emailtext.trim() === '') {
      this.searchText = '';
    } else if (this.emailtext.length >= 3) {
      this.search();
    } else {
    }
  }
  mobileFilter() {
    if (this.mobiletext.trim() === '') {
      this.searchText = '';
    } else if (this.mobiletext.length >= 3) {
      this.search();
    } else {
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
    this.search();
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
    this.api
      .getAllCustomer(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
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
          }
          else {
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
            this.isSpinning = false;
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
  edit(data: customer): void {
    this.custid = data.ID;
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
    this.search();
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
  onCheckboxChange(column: any) {
    column.visible = !column.visible;
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
  onKeyup(event: KeyboardEvent): void {
    if (this.customertext.length >= 3 && event.key === 'Enter') {
      this.search(true);
      this.isnameFilterApplied = true;
    } else if (this.customertext.length == 0 && event.key === 'Backspace') {
      this.search(true);
      this.isnameFilterApplied = false;
    }
    if (this.emailtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isemailFilterApplied = true;
    } else if (this.emailtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isemailFilterApplied = false;
    }
    if (this.mobiletext.length > 0 && event.key === 'Enter') {
      this.search();
      this.ismobileFilterApplied = true;
    } else if (this.mobiletext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismobileFilterApplied = false;
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
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
  }
  reset2() {
    this.mobiletext = '';
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: customer = new customer();
  widths: any = '100%';
  view(data: customer): void {
    this.custid = data.ID;
    this.drawerTitleCustomers = `View details of ${data.NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.search();
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }
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
  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
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
  openfilter() {
    this.drawerTitle = 'Customer Activities Filter';
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
        let processedValue = typeof value === 'string' ? `'${value}'` : value; 
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
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };
    return filterGroups.map(processGroup).join(' AND '); 
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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
  widthsss: any = '100%';
  drawerserviceVisibleMap: boolean = false;
  ServiceMapping(data: any): void {
    this.drawerTitleMa = `${data.NAME} Customer Wise Service Change Management`;
    this.drawerDataMap = Object.assign({}, data);
    this.drawerserviceVisibleMap = true;
  }
  drawerServiceMappingCloseMap(): void {
    this.search();
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
    this.search();
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
    this.search();
    this.drawerVisible1invoice = false;
  }
  get closeCallback1() {
    return this.drawerClose1invoice.bind(this);
  }
  oldFilter: any[] = [];
  isLoading = false;
  isfilterapply: boolean = false;
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
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  get filtercloseCallback() {
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
  viewJobsWidth: string = '100%';
  viewJobsDrawerVisible = false;
  viewJobsdrawerTitle = '';
  viewjobsdata: any;
  technicianId: any;
  viewJobs(data: TechnicianMasterData) {
    this.viewJobsDrawerVisible = true;
    this.viewjobsdata = data;
    this.getViewJobs(data);
    this.viewJobsdrawerTitle = `Jobs of ${data.NAME}`;
  }
  viewJobsdrawerClose(): void {
    this.viewJobsDrawerVisible = false;
    this.search();
  }
  get viewJobscloseCallback() {
    return this.viewJobsdrawerClose.bind(this);
  }
  getViewJobs(data) {
    this.technicianId = data.ID;
    this.viewJobsDrawerVisible = true;
  }
}
