import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { pincode } from 'src/app/Pages/Models/pincode';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.css'],
})
export class PincodesComponent {
  formTitle = 'Manage Pincodes';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  selectedCountries: any = [];
  columns: string[][] = [
    ['COUNTRY_NAME', 'Country'],
    ['STATE_NAME', 'State'],
    ['DISTRICT_NAME', 'District'],
    ['PINCODE_NUMBER', 'Pincode'],
  ];
  time = new Date();
  features = [];
  visible = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: pincode = new pincode();
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  distVisible: boolean = false;
  filterClass: string = 'filter-invisible';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  columns1: { label: string; value: string }[] = [
    { label: 'Country', value: 'COUNTRY_ID' },
    { label: 'State', value: 'STATE' },
    { label: 'District', value: 'DISTRICT' },
    { label: 'Pincode', value: 'PINCODE_NUMBER' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.search();
    this.getStateData();
    this.getCountyData();
    this.getDistData();
    this.getPincodeData();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  isCountryFilterApplied = false;
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.isCountryFilterApplied = true; 
    } else {
      this.search();
      this.isCountryFilterApplied = false; 
    }
  }
  isStateFilterApplied = false;
  onStateChange(): void {
    if (this.selectedStates?.length) {
      this.search();
      this.isStateFilterApplied = true; 
    } else {
      this.search();
      this.isStateFilterApplied = false; 
    }
  }
  isDistFilterApplied = false;
  onDistChange(): void {
    if (this.selectedDist?.length) {
      this.search();
      this.isDistFilterApplied = true; 
    } else {
      this.search();
      this.isDistFilterApplied = false; 
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
  selectedStates: any = [];
  selectedDist: any = [];
  selectedPincodes: any = [];
  disttext: string = '';
  isPincodeFilterApplied = false;
  distkeyup(event) {
    if (this.disttext.length > 3 && event.key === 'Enter') {
      this.search();
      this.isPincodeFilterApplied = true;
    } else if (this.disttext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isPincodeFilterApplied = true;
    }
  }
  Pincodetext = '';
  isPinApplied = false;
  Officetext = '';
  OfficeVisible = false;
  isOfficeFilterApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.Pincodetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isPinApplied = true;
    } else if (this.Pincodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isPinApplied = false;
    }
    if (this.Officetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOfficeFilterApplied = true;
    } else if (this.Officetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOfficeFilterApplied = false;
    }
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
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
    this.loadingRecords = true;
    let sort: string;
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
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_NAME IN ('${this.selectedStates.join("','")}')`; 
    }
    if (this.selectedDist.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DISTRICT_NAME IN ('${this.selectedDist.join("','")}')`; 
    }
    if (this.Pincodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PINCODE_NUMBER LIKE '%${this.Pincodetext.trim()}%'`;
    }
    if (this.pincodeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PINCODE_FOR = '${this.pincodeFilter}'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllPincode(
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
          } else {
            this.dataList = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
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
    this.drawerTitle = 'Create New Pincode';
    this.drawerData = new pincode();
    this.drawerVisible = true;
  }
  edit(data: pincode): void {
    this.drawerTitle = 'Update Pincode Details';
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
  nametext: string = '';
  emailtext: string = '';
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  PINCODEVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onSortClick(event: MouseEvent) {
    event.stopPropagation(); 
  }
  showcolumn = [
    { label: 'Country Name', key: 'COUNTRY_NAME', visible: true },
    { label: 'State Name', key: 'STATE_NAME', visible: true },
    { label: 'District Name', key: 'DISTRICT_NAME', visible: true },
    { label: 'Pincode', key: 'PINCODE_NUMBER', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true },
  ];
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.search();
  }
  reset1(): void {
    this.searchText = '';
    this.emailtext = '';
    this.search();
  }
  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, '', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.countryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  pincodeData: any = [];
  getPincodeData() {
    this.api.getAllPincode(0, 0, '', 'asc', ' AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.pincodeData = data['data'];
        } else {
          this.pincodeData = [];
          this.message.error('Failed To Get Pincode Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  stateData: any = [];
  getStateData() {
    this.api
      .getState(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.stateData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  distData: any = [];
  getDistData() {
    this.api
      .getDistrict(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.distData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  navigateToMastersMenu(): void {
    this.router.navigate(['/masters/menu']);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isfilterapply: boolean = false;
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(82, columnKey).subscribe(
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
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Pincode Filter';
    this.drawerFilterVisible = true;
    this.filterFields[0]['options'] = this.countryData;
    this.filterFields[1]['options'] = this.stateData;
    this.filterFields[2]['options'] = this.distData;
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
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'COUNTRY_NAME',
      label: 'Country',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select Country',
    },
    {
      key: 'STATE_NAME',
      label: 'State',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select State',
    },
    {
      key: 'DISTRICT_NAME',
      label: 'District',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select District',
    },
    {
      key: 'PINCODE_NUMBER',
      label: 'Pincode',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Pincode',
    },
    {
      key: 'PINCODE_FOR',
      label: 'Pincode For',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'S', display: 'For Service' },
        { value: 'I', display: 'For Shop' },
        { value: 'B', display: 'Both Service & Shop' },
      ],
      placeholder: 'Select Pincode For',
    },
    {
      key: 'IS_ACTIVE',
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
  oldFilter: any[] = [];
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
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  TabId: number;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  filterloading: boolean = false;
  isDeleting: boolean = false;
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  isLoading = false;
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
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
    this.filterFields[0]['options'] = this.countryData;
    this.filterFields[1]['options'] = this.stateData;
    this.filterFields[2]['options'] = this.distData;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  pincodeFilter: string | undefined = undefined;
  onPincodeFilterChange(selectedStatus: string) {
    this.pincodeFilter = selectedStatus;
    this.search(true);
  }
  listOfPincodeFilter: any[] = [
    { text: 'For Service', value: 'S' },
    { text: 'For Shop', value: 'I' },
    { text: 'Both Service & Shop', value: 'B' },
  ];
}