import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Coupan } from 'src/app/Support/Models/coupan';
@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css'],
})
export class CouponsComponent implements OnInit {
  formTitle = 'Manage Coupons';
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
  logtext: string = '';
  filterloading: boolean = false;
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
  columns: string[][] = [
    ['COUPON_TYPE_NAME', 'Coupon Type Name'],
    ['NAME', '  Name  '],
    ['START_DATE', 'Start Date'],
    ['EXPIRY_DATE', 'Expiry Date'],
    ['MAX_USES_COUNT', 'Max Usage Count'],
    ['COUPON_CODE', 'Coupon Code'],
    ['COUPON_VALUE', 'Coupon Value'],
    ['PERUSER_MAX_COUNT', 'Per user Max Count'],
  ];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Coupan = new Coupan();
  drawerVisiblemapping: boolean;
  drawerTitlemapping: string;
  dataList1: any = [];
  pageSize2 = 10;
  constructor(
    public api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.search();
    this.getCouponType();
    this.getAllCoupontypes();
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  onKeyDownEvent(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
    }
    this.search(true);
  }
  selectedCouponfor = [];
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
    var globalSearchQuery = '';
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
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
      this.isNameFilterApplied = true;
    } else {
      this.isNameFilterApplied = false;
    }
    if (this.maxusescounttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MAX_USES_COUNT LIKE '%${this.maxusescounttext.trim()}%'`;
      this.isMaxUsesCountFilterApplied = true;
    } else {
      this.isMaxUsesCountFilterApplied = false;
    }
    if (this.selectedCouponfor.length > 0) {
      this.isCouponForVisibleFilterApplied = true;
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUPON_FOR IN (${this.selectedCouponfor.join(',')})`; 
    } else {
      this.isCouponForVisibleFilterApplied = false;
    }
    if (this.CouponCodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_CODE LIKE '%${this.CouponCodetext.trim()}%'`;
      this.isCouponCodeVisibleFilterApplied = true;
    } else {
      this.isCouponCodeVisibleFilterApplied = false;
    }
    if (this.CouponValuetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_VALUE LIKE '%${this.CouponValuetext.trim()}%'`;
      this.isCouponValueVisibleFilterApplied = true;
    } else {
      this.isCouponValueVisibleFilterApplied = false;
    }
    if (this.PerUserMaxCounttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PERUSER_MAX_COUNT LIKE '%${this.PerUserMaxCounttext.trim()}%'`;
      this.isPerUserMaxCountVisibleFilterApplied = true;
    } else {
      this.isPerUserMaxCountVisibleFilterApplied = false;
    }
    if (this.selectedCouponType.length > 0) {
      this.iscoupontypeFilterApplied = true;
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUPON_TYPE_ID IN (${this.selectedCouponType.join(',')})`; 
    } else {
      this.iscoupontypeFilterApplied = false;
    }
    if (this.startDateText?.length === 2) {
      const [start, end] = this.startDateText;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `START_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    if (this.expiryDateText?.length === 2) {
      const [start, end] = this.expiryDateText;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `EXPIRY_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllCoupons(
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
            this.TabId = data['TAB_ID'];
            this.dataList = data['data'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.message.error('Failed to get coupon data', '');
            this.dataList = [];
          }
        },
        (err) => {
          if (err['status'] == 400) {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.dataList = [];
          }
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New Coupon';
    this.drawerData = new Coupan();
    this.drawerVisible = true;
  }
  edit(data: Coupan): void {
    this.drawerTitle = 'Update Coupon';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  MapFacility(data: Coupan) {
    this.drawerTitlemapping = 'Map Services For ' + data.NAME;
    this.drawerData = Object.assign({}, data);
    this.drawerVisiblemapping = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallbackmapping() {
    return this.drawerClosemapping.bind(this);
  }
  drawerClosemapping(): void {
    this.search();
    this.drawerVisiblemapping = false;
  }
  drawerCouponTerritoryVisible: boolean=false;
  drawerTitleCouponTerritory: string;
  drawerDataCouponTerritory: any;
  MapTerritory(data: Coupan) {
    this.drawerTitleCouponTerritory = 'Map Territory For ' + data.NAME;
    this.drawerDataCouponTerritory = Object.assign({}, data);
    this.drawerCouponTerritoryVisible = true;
  }
   drawerCloseTerritorymapping(): void {
    this.search();
    this.drawerCouponTerritoryVisible = false;
  }
  get closeCallbackTerritorymapping() {
    return this.drawerCloseTerritorymapping.bind(this);
  }
  iscoupontypeFilterApplied: boolean = false;
  NameVisible;
  isNameFilterApplied: boolean = false;
  nametext: string = '';
  MaxUsesCountVisible;
  isMaxUsesCountFilterApplied: boolean = false;
  maxusescounttext: string = '';
  CouponForVisible;
  isCouponForVisibleFilterApplied: boolean = false;
  CouponFortext: string = '';
  CouponCodeVisible;
  isCouponCodeVisibleFilterApplied: boolean = false;
  CouponCodetext: string = '';
  CouponValueVisible;
  isCouponValueVisibleFilterApplied: boolean = false;
  CouponValuetext: string = '';
  PerUserMaxCountVisible;
  isPerUserMaxCountVisibleFilterApplied: boolean = false;
  PerUserMaxCounttext: string = '';
  startDateText: any = null;
  startDateVisible: boolean = false;
  expiryDateText: any = null;
  expiryDateVisible: boolean = false;
  couponTypeVisible;
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(keys: any, type: string): void {
    const element = window.document.getElementById('button');
    if (type == 'name' && this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isNameFilterApplied = true;
    } else if (
      type == 'name' &&
      this.nametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isNameFilterApplied = false;
    }
    if (
      type == 'maxusescount' &&
      this.maxusescounttext.length >= 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isMaxUsesCountFilterApplied = true;
    } else if (
      type == 'maxusescount' &&
      this.maxusescounttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isMaxUsesCountFilterApplied = false;
    }
    if (
      type == 'couponcode' &&
      this.CouponCodetext.length >= 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isCouponCodeVisibleFilterApplied = true;
    } else if (
      type == 'couponcode' &&
      this.CouponCodetext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isCouponCodeVisibleFilterApplied = false;
    }
    if (
      type == 'couponvalue' &&
      this.CouponValuetext.length >= 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isCouponValueVisibleFilterApplied = true;
    } else if (
      type == 'couponvalue' &&
      this.CouponValuetext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isCouponValueVisibleFilterApplied = false;
    }
    if (
      type == 'PerUserMaxCount' &&
      this.PerUserMaxCounttext.length >= 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isPerUserMaxCountVisibleFilterApplied = true;
    } else if (
      type == 'PerUserMaxCount' &&
      this.PerUserMaxCounttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isPerUserMaxCountVisibleFilterApplied = false;
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
    if (this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (this.nametext.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.maxusescounttext.length >= 0 && keys.key === 'Enter') {
      this.search();
    } else if (this.maxusescounttext.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.CouponCodetext.length >= 0 && keys.key === 'Enter') {
      this.search();
    } else if (this.CouponCodetext.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.CouponValuetext.length >= 0 && keys.key === 'Enter') {
      this.search();
    } else if (this.CouponValuetext.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.PerUserMaxCounttext.length >= 0 && keys.key === 'Enter') {
      this.search();
    } else if (
      this.PerUserMaxCounttext.length === 0 &&
      keys.key == 'Backspace'
    ) {
      this.dataList = [];
      this.search();
    }
  }
  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.maxusescounttext = '';
    this.CouponCodetext = '';
    this.CouponValuetext = '';
    this.PerUserMaxCounttext = '';
    this.search();
  }
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
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
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Coupons Filter';
    this.drawerFilterVisible = true;
    this.filterFields[0]['options'] = this.coupontype;
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
  coupontype: any = [];
  getAllCoupontypes() {
    this.api
      .getAllCoupontypes(0, 0, 'ID', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.coupontype.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  filterFields: any[] = [
    {
      key: 'COUPON_TYPE_NAME',
      label: 'Coupon Type',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Enter Coupon Type',
    },
    {
      key: 'NAME',
      label: 'Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Name',
    },
    {
      key: 'START_DATE',
      label: 'Start Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equals To' },
      ],
      placeholder: 'Select Start Date',
    },
    {
      key: 'EXPIRY_DATE',
      label: 'Expiry Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equals To' },
      ],
      placeholder: 'Select Expiry Date',
    },
    {
      key: 'MAX_USES_COUNT',
      label: 'Max Usage Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Max Usage Count',
    },
    {
      key: 'COUPON_FOR',
      label: 'Coupon For',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'BO', display: 'Both' },
        { value: 'IN', display: 'Inventory' },
        { value: 'SE', display: 'Service' },
      ],
      placeholder: 'Select Coupon For',
    },
    {
      key: 'COUPON_CODE',
      label: 'Coupon Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Coupon Code',
    },
    {
      key: 'COUPON_VALUE',
      label: 'Coupon Value',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Coupon Value',
    },
    {
      key: 'PERUSER_MAX_COUNT',
      label: 'Per User Max Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Per User Count',
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  isDeleting: boolean = false;
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
    this.filterFields[0]['options'] = this.coupontype;
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  CouponTypeData: any = [];
  getCouponType() {
    this.api.getAllCoupontypes(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CouponTypeData = data['data'];
        } else {
          this.CouponTypeData = [];
          this.message.error('Failed To Get Category Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  onCouponTypeChange(): void {
    this.search();
  }
  selectedCouponType: number[] = [];
  onStartDateChange(selectedDate: any): void {
    if (this.startDateText && this.startDateText.length === 2) {
      this.search();
    } else {
      this.startDateText = null;
      this.search();
    }
  }
  onExpiryDateChange(selectedDate: any): void {
    if (this.expiryDateText && this.expiryDateText.length === 2) {
      this.search();
    } else {
      this.expiryDateText = null;
      this.search();
    }
  }
  drawerVisibleInventoryMapping: boolean;
  drawerTitleInventoryMap: string;
  MapInventory(data: Coupan) {
    this.drawerTitleInventoryMap = 'Map Inventories For ' + data.NAME;
    this.drawerData = Object.assign({}, data);
    this.drawerVisibleInventoryMapping = true;
  }
  drawerCloseInventorymapping(): void {
    this.search();
    this.drawerVisibleInventoryMapping = false;
  }
  get closeCallbackInventorymapping() {
    return this.drawerCloseInventorymapping.bind(this);
  }
}