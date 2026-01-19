import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-cancelorderreq',
  templateUrl: './cancelorderreq.component.html',
  styleUrls: ['./cancelorderreq.component.css'],
})
export class CancelorderreqComponent {
  formTitle = 'Manage Cancel Order Request';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  columns: string[][] = [
    ['ORDER_NUMBER', 'ORDER_NUMBER'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
  ];
  time = new Date();
  features = [];
  visible1 = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  showcolumn = [
    { label: 'Order No. ', key: 'ORDER_NUMBER', visible: true },
    { label: 'Customer Name ', key: 'CUSTOMER_NAME', visible: true },
    { label: 'Mobile No.', key: 'MOBILE_NO', visible: true },
    { label: 'Address ', key: 'SERVICE_ADDRESS', visible: true },
    { label: 'Request Date ', key: 'REQUESTED_DATE', visible: true },
    { label: 'Reason', key: 'REASON', visible: true },
    { label: 'Remark', key: 'REMARK', visible: true },
    { label: 'Territory Name', key: 'TERRITORY_NAME', visible: true },
  ];
  showcloumnVisible: boolean = false;
  orderrno: string = '';
  ordernovisible = false;
  Mobilenovisible = false;
  customernamevisible = false;
  addressvisible = false;
  statusFilter: string | undefined = undefined;
  isnewFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilterisnew: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  onISNEWFilterChange(selectedStatus: string) {
    this.isnewFilter = selectedStatus;
    this.search(true);
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Order No. ', value: 'ORDER_NUMBER' },
    { label: 'Customer Name ', value: 'CUSTOMER_NAME' },
    { label: 'Mobile No.', value: 'MOBILE_NO' },
    { label: 'Address ', value: 'SERVICE_ADDRESS' },
    { label: 'Reason', value: 'REASON' },
    { label: 'Remark', value: 'REMARK' },
    { label: 'Territory Name', value: 'TERRITORY_NAME' },
  ];
  isFilterApplied: boolean = false;
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
    private message: NzNotificationService,
    private router: Router
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.getTeritory();
    this.getTeritory1();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    this.getcounts();
  }
  VERIFIED_STATUS: any = 'P';
  ExtraQuery: any = '';
  back() {
    this.router.navigate(['/masters/menu']);
  }
  reset(): void {
    this.searchText = '';
    this.orderrno = '';
    this.customername = '';
    this.mobilenooo = '';
    this.addressss = '';
    this.search();
  }
  submittedDateVisible = false;
  isSubmittedDateFilterApplied: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isSubmittedDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isSubmittedDateFilterApplied = false;
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
  TabId: number;
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
    this.loadingRecords = true;
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `REQUESTED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.orderrno !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NUMBER LIKE '%${this.orderrno.trim()}%'`;
    }
    if (this.customername !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.customername.trim()}%'`;
    }
    if (this.mobilenooo !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobilenooo.trim()}%'`;
    }
    if (this.addressss !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_ADDRESS LIKE '%${this.addressss.trim()}%'`;
    }
    if (this.reason !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `REASON LIKE '%${this.reason.trim()}%'`;
    }
    if (this.remark !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `REMARK LIKE '%${this.remark.trim()}%'`;
    }
    if (this.selectedterritory.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TERRITORY_ID IN (${this.selectedterritory.join(',')})`; 
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.ExtraQuery = " AND REFUND_STATUS='" + this.VERIFIED_STATUS + "'";
    this.api
      .getcancelorderreq(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.ExtraQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
            this.api
              .getcancelorderreqcount(
                this.pageIndex,
                this.pageSize,
                this.sortKey,
                sort,
                likeQuery + this.filterQuery
              )
              .subscribe(
                (dataaa) => {
                  if (data['code'] == 200) {
                    this.loadingRecords = false;
                    this.approvedCount = dataaa['data'][0]['APPROVED'];
                    this.pendingCount = dataaa['data'][0]['PENDING'];
                    this.rejectedCount = dataaa['data'][0]['REJECTED'];
                  } else {
                    this.loadingRecords = false;
                    this.message.error(
                      'Failed to get Data. please try again later.',
                      ''
                    );
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
                    this.message.error('Server error: ' + err.message, '');
                  }
                }
              );
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
  isordernoFilterApplied = false;
  iscustnmFilterApplied = false;
  ismobFilterApplied = false;
  Seqtext: string = '';
  customername: string = '';
  mobilenooo: string = '';
  addressss: string = '';
  reason: string = '';
  remark: String = '';
  remarkvisible = false;
  isremarkFilterApplied = false;
  reasonvisible = false;
  Seqvisible = false;
  isaddFilterApplied = false;
  isreasonFilterApplied = false;
  isterritorynameFilterApplied = false;
  territoryVisible = false;
  selectedterritory: any[] = [];
  onKeyup(event: KeyboardEvent, field: string): void {
    if (
      this.orderrno.length >= 3 &&
      event.key === 'Enter' &&
      field == 'OR_NO'
    ) {
      this.search();
      this.isordernoFilterApplied = true;
    } else if (
      this.orderrno.length == 0 &&
      event.key === 'Backspace' &&
      field == 'OR_NO'
    ) {
      this.search();
      this.isordernoFilterApplied = false;
    }
    if (
      this.customername.length >= 3 &&
      event.key === 'Enter' &&
      field == 'CR_N'
    ) {
      this.search();
      this.iscustnmFilterApplied = true;
    } else if (
      this.customername.length == 0 &&
      event.key === 'Backspace' &&
      field == 'CR_N'
    ) {
      this.search();
      this.iscustnmFilterApplied = false;
    }
    if (
      this.mobilenooo.length > 0 &&
      event.key === 'Enter' &&
      field == 'MO_NO'
    ) {
      this.search();
      this.ismobFilterApplied = true;
    } else if (
      this.mobilenooo.length == 0 &&
      event.key === 'Backspace' &&
      field == 'MO_NO'
    ) {
      this.search();
      this.ismobFilterApplied = false;
    }
    if (
      this.addressss.length >= 3 &&
      event.key === 'Enter' &&
      field == 'ADDR'
    ) {
      this.search();
      this.isaddFilterApplied = true;
    } else if (
      this.addressss.length == 0 &&
      event.key === 'Backspace' &&
      field == 'ADDR'
    ) {
      this.search();
      this.isaddFilterApplied = false;
    }
    if (this.reason.length >= 3 && event.key === 'Enter' && field == 'REA') {
      this.search();
      this.isreasonFilterApplied = true;
    } else if (
      this.reason.length == 0 &&
      event.key === 'Backspace' &&
      field == 'REA'
    ) {
      this.search();
      this.isreasonFilterApplied = false;
    }
    if (this.remark.length >= 3 && event.key === 'Enter' && field == 'REM') {
      this.search();
      this.isremarkFilterApplied = true;
    } else if (
      this.remark.length == 0 &&
      event.key === 'Backspace' &&
      field == 'REM'
    ) {
      this.search();
      this.isremarkFilterApplied = false;
    }
  }
  onCountryChange(): void {
    if (this.selectedterritory?.length) {
      this.search();
      this.isterritorynameFilterApplied = true; 
    } else {
      this.search();
      this.isterritorynameFilterApplied = false; 
    }
  }
  territoryData: any = [];
  getTeritory() {
    this.api.getTeritory(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.territoryData = data['data'];
        } else {
          this.territoryData = [];
          this.message.error('Failed To Get Territory Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  territoryData1: any = [];
  getTeritory1() {
    this.api
      .getTeritory(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.territoryData1.push({
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
  close(): void {
    this.visible1 = false;
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
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
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1;
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  oldFilter: any[] = [];
  isLoading = false;
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
  openfilter() {
    this.drawerTitle = 'Cancel Order Request Filter';
    this.filterFields[6]['options'] = this.territoryData1;
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  whichbutton: any;
  filterloading: boolean = false;
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  filterFields: any[] = [
    {
      key: 'REQUESTED_DATE',
      label: 'Request Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Request Date',
    },
    {
      key: 'ORDER_NUMBER',
      label: 'Order Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order Number',
    },
    {
      key: 'CUSTOMER_NAME',
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
      options: [],
      placeholder: 'Select Customer Name',
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
      key: 'SERVICE_ADDRESS',
      label: 'Address',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Address',
    },
    {
      key: 'REASON',
      label: 'Reason',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Reason',
    },
    {
      key: 'TERRITORY_NAME',
      label: 'Territory',
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
      placeholder: 'Enter Territory Name',
    },
  ];
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[6]['options'] = this.territoryData1;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  rejectreason: any = '';
  appreorder(data: any, action: any) {
    this.isspinnnnnnn = true;
    if (
      (this.rejectreason == '' ||
        this.rejectreason == null ||
        this.rejectreason == undefined) &&
      this.action == 'R'
    ) {
      this.message.error('Please enter rejection remark ', '');
      this.isspinnnnnnn = false;
    } else {
      var dataaa = {
        ID: data.ID,
        REFUND_STATUS: this.action,
        REMARK: this.rejectreason == '' ? '' : this.rejectreason,
        ORDER_ID: data.ORDER_ID,
        CUSTOMER_ID: data.CUSTOMER_ID,
        ORDER_STATUS: data.ORDER_STATUS,
        PAYMENT_MODE: data.PAYMENT_MODE,
      };
      this.api.approverejectorder(dataaa).subscribe(
        (successCode: any) => {
          if (successCode.code == 200) {
            if (this.action == 'A') {
              this.message.success(
                'The order cancellation request has been approved successfully.',
                ''
              );
            } else {
              this.message.success(
                'The order cancellation request has been rejected successfully.',
                ''
              );
            }
            this.openmodell = false;
            this.isspinnnnnnn = false;
            this.search();
          } else {
            this.message.error('Failed to update', '');
            this.isspinnnnnnn = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isspinnnnnnn = false;
        }
      );
    }
  }
  isspinnnnnnn: boolean = false;
  openmodell: boolean = false;
  openmodellRefund: boolean = false;
  cancelorderdata: any;
  action: any;
  opencancelmodal(event: any, action: any) {
    this.openmodell = true;
    this.action = action;
    this.cancelorderdata = '';
    this.rejectreason = '';
    this.cancelorderdata = event;
  }
  opencancelmodalRefunc(event: any) {
    this.openmodellRefund = true;
    this.cancelorderdata = '';
    this.cancelorderdata = event;
  }
  canorderRefund() {
    this.openmodellRefund = false;
    this.isspinnnnnnn = false;
    this.cancelorderdata = '';
  }
  simplecancel() {
    this.openmodell = false;
    this.isspinnnnnnn = false;
    this.cancelorderdata = '';
  }
  rejectedCount: any = 0;
  pendingCount: any = 0;
  approvedCount: any = 0;
  getcounts() { }
  selectStatus(event) {
    this.VERIFIED_STATUS = event;
    this.search(true);
  }
  appreorderRef(data: any) {
    this.isspinnnnnnn = true;
    var dataaa = {
      ID: data.ID,
      REFUND_STATUS: data.REFUND_STATUS,
      REMARK: data.REMARK,
      ORDER_ID: data.ORDER_ID,
      CUSTOMER_ID: data.CUSTOMER_ID,
      ORDER_STATUS: data.ORDER_STATUS,
      PAYMENT_REFUND_STATUS: 'RF',
      PAYMENT_MODE: data.PAYMENT_MODE,
    };
    this.api.Refundorder(dataaa).subscribe(
      (successCode: any) => {
        if (successCode.code == 200) {
          this.message.success('Refund status updated successfully', '');
          this.openmodellRefund = false;
          this.isspinnnnnnn = false;
          this.search();
        } else {
          this.message.error('Failed to update refund status', '');
          this.isspinnnnnnn = false;
        }
      },
      (err) => {
        this.message.error('Something went wrong, please try again later', '');
        this.isspinnnnnnn = false;
      }
    );
  }
}
