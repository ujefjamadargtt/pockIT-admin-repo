import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coupon-summary-reports',
  templateUrl: './coupon-summary-reports.component.html',
  styleUrls: ['./coupon-summary-reports.component.css'],
})
export class CouponSummaryReportsComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  formTitle = ' Coupon Summary Report';
  dataList: any = [];
  loadingRecords = true;
  ismapSpinning = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  groupname: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  collegeId = sessionStorage.getItem('collegeId');
  STATUS = 'U';
  SCOPE = 'O';
  startValue: any;
  endValue: any;
  mode: any;
  endOpen = false;
  startOpen = false;
  current = new Date();
  visible = false;
  visible1 = false;
  visible2 = false;
  selectedDate: Date[] = [];
  value1: any;
  value2: any;
  excelData: any = [];
  exportLoading: boolean = false;
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  columns: string[][] = [
    ['NAME', ' Coupon Name '],
    ['COUPON_USED_COUNT', ' Used Count '],
    ['START_DATE', '  Start Date Time  '],
    ['EXPIRY_DATE', '  End Date Time '],
    ['COUPON_VALUE', ' Coupon Value '],
    ['MAX_USES_COUNT', ' Max Uses'],
    ['COUPON_CODE', ' Coupon Code '],
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.changeDate(this.selectedDate);
  }
  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  keyup(keys: any) {
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
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
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
    if (
      this.CouponNametext !== '' &&
      this.CouponNametext !== undefined &&
      this.CouponNametext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.CouponNametext?.trim()}%'`;
      this.isCouponNameFilterApplied = true;
    } else {
      this.isCouponNameFilterApplied = false;
    }
    if (
      this.CouponUsedCounttext !== '' &&
      this.CouponUsedCounttext !== undefined &&
      this.CouponUsedCounttext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_USED_COUNT LIKE '%${this.CouponUsedCounttext?.trim()}%'`;
      this.isCouponUsedCountVisibleFilterApplied = true;
    } else {
      this.isCouponUsedCountVisibleFilterApplied = false;
    }
    if (
      this.MaxUsedCounttext !== '' &&
      this.MaxUsedCounttext !== undefined &&
      this.MaxUsedCounttext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MAX_USES_COUNT LIKE '%${this.MaxUsedCounttext?.trim()}%'`;
      this.isMaxUsedCountVisibleFilterApplied = true;
    } else {
      this.isMaxUsedCountVisibleFilterApplied = false;
    }
    if (
      this.CouponCodetext !== '' &&
      this.CouponCodetext !== undefined &&
      this.CouponCodetext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_CODE LIKE '%${this.CouponCodetext?.trim()}%'`;
      this.isCouponCodeVisibleFilterApplied = true;
    } else {
      this.isCouponCodeVisibleFilterApplied = false;
    }
    if (
      this.CouponValuetext !== '' &&
      this.CouponValuetext !== undefined &&
      this.CouponValuetext !== null
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_VALUE LIKE '%${this.CouponValuetext?.trim()}%'`;
      this.isCouponValueVisibleFilterApplied = true;
    } else {
      this.isCouponValueVisibleFilterApplied = false;
    }
    if (this.StartDateText?.length === 2) {
      const [start, end] = this.StartDateText;
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
    if (this.ExpiryDateText?.length === 2) {
      const [start, end] = this.ExpiryDateText;
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
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .getAllcouponsummaryreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          this.searchText,
          '',
          ''
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.TabId = data['TAB_ID'];
            this.dataList = data['data'];
          },
          (err) => { }
        );
    } else {
      this.exportLoading = true;
      this.loadingRecords = true;
      this.api
        .getAllcouponsummaryreport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          this.searchText,
          '',
          ''
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.exportLoading = false;
            this.totalRecords = data['count'];
            this.TabId = data['TAB_ID'];
            this.dataList = data['data'];
            this.excelData = data['data'];
            this.convertInExcel();
          },
          (err) => { }
        );
    }
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
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
  onKeyDownEvent(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
    }
    this.search(true);
  }
  dates: any = [];
  disabledEndDate2 = (current: Date): any => {
  };
  startDateChange() {
    var startDate = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  getDaysArray(start: any, end: any) {
    for (
      var arr: any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }
  timeDefaultValue = setHours(new Date(), 0);
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.current) > 0;
  /////
  onStartChange(date: Date): void {
    this.startValue = new Date(date);
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
    this.startOpen = open;
  }
  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return startValue.getTime() >= this.current.getTime();
    }
    return startValue.getTime() > this.endValue.getTime();
  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return (
      endValue.getTime() < this.startValue.getTime() ||
      endValue.getTime() >= this.current.getTime()
    );
  };
  disabledDate = (selected: Date): boolean =>
    differenceInCalendarDays(selected, this.current) > 0;
  CouponNametext;
  CouponNameVisible: boolean = false;
  isCouponNameFilterApplied = false;
  CouponUsedCounttext;
  CouponUsedCountVisible: boolean = false;
  isCouponUsedCountVisibleFilterApplied = false;
  MaxUsedCounttext;
  MaxUsedCountVisible: boolean = false;
  isMaxUsedCountVisibleFilterApplied = false;
  CouponCodetext: string = '';
  CouponCodeVisible: boolean = false;
  isCouponCodeVisibleFilterApplied = false;
  CouponValuetext: string = '';
  CouponValueVisible: boolean = false;
  isCouponValueVisibleFilterApplied = false;
  StartDateText;
  StartDateVisible: boolean = false;
  isStartDateVisibleFilterApplied = false;
  ExpiryDateText;
  ExpiryDateVisible: boolean = false;
  isExpiryDateVisibleFilterApplied = false;
  reset(): void {
    this.searchText = '';
    this.CouponNametext = '';
    this.CouponUsedCounttext = '';
    this.CouponCodetext = '';
    this.CouponValuetext = '';
    this.MaxUsedCounttext = '';
    this.StartDateText = '';
    this.ExpiryDateText = '';
    this.search();
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.CouponNametext?.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCouponNameFilterApplied = true;
    } else if (this.CouponNametext?.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCouponNameFilterApplied = false;
    }
    if (this.CouponCodetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCouponCodeVisibleFilterApplied = true;
    } else if (this.CouponCodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCouponCodeVisibleFilterApplied = false;
    }
    if (this.CouponUsedCounttext?.length > 0 && event.key === 'Enter') {
      this.search();
      this.isCouponUsedCountVisibleFilterApplied = true;
    } else if (
      this.CouponUsedCounttext?.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isCouponUsedCountVisibleFilterApplied = false;
    }
    if (this.MaxUsedCounttext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isMaxUsedCountVisibleFilterApplied = true;
    } else if (this.MaxUsedCounttext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isMaxUsedCountVisibleFilterApplied = false;
    }
    if (this.CouponValuetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isCouponValueVisibleFilterApplied = true;
    } else if (this.CouponValuetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCouponValueVisibleFilterApplied = false;
    }
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onStartDateChange(selectedDate: any): void {
    if (this.StartDateText && this.StartDateText.length === 2) {
      this.search();
      this.isStartDateVisibleFilterApplied = true;
    } else {
      this.StartDateText = null;
      this.search();
      this.isStartDateVisibleFilterApplied = false;
    }
  }
  onExpiryDateChange(selectedDate: any): void {
    if (this.ExpiryDateText && this.ExpiryDateText.length === 2) {
      this.search();
      this.isExpiryDateVisibleFilterApplied = true;
    } else {
      this.ExpiryDateText = null;
      this.search();
      this.isExpiryDateVisibleFilterApplied = false;
    }
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
  savedFilters: any[] = [];
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  isDeleting: boolean = false;
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
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Coupon Summary Report Filter'; 
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
  filterFields: any[] = [
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
      key: 'USED_COUNT',
      label: 'Used Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Used Count',
    },
    {
      key: 'MAX_USES_COUNT',
      label: 'Max Uses Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Max Uses Count',
    },
    {
      key: 'START_DATE',
      label: 'Start Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Start Date',
    },
    {
      key: 'EXPIRY_DATE',
      label: 'End Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select End Date',
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
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.isfilterapply = true;
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
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
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Coupon Name'] = this.excelData[i]['NAME'];
        obj1['Coupon Code'] = this.excelData[i]['COUPON_CODE'];
        obj1['Used Count'] = this.excelData[i]['COUPON_USED_COUNT'];
        obj1['Max Uses Count'] = this.excelData[i]['MAX_USES_COUNT'];
        obj1['Start Time'] = this.excelData[i]['START_DATE']
          ? this.datePipe.transform(
            this.excelData[i]['START_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Expiry Time'] = this.excelData[i]['EXPIRY_DATE']
          ? this.datePipe.transform(
            this.excelData[i]['EXPIRY_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Coupon Value'] = this.excelData[i]['COUPON_VALUE'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Coupon Summary Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is no Data', '');
    }
  }
}