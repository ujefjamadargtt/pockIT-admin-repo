import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-customer-coupon-summary-report',
  templateUrl: './customer-coupon-summary-report.component.html',
  styleUrls: ['./customer-coupon-summary-report.component.css'],
})
export class CustomerCouponSummaryReportComponent {
  formTitle = 'Customer Coupon Summary';
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
  filterValue = '';
  filterClass: string = 'filter-invisible';
  excelData: any = [];
  exportLoading: boolean = false;
  columns: string[][] = [
    ['CUSTOMER_NAME', 'Customer Name'],
    ['MOBILE_NO', 'Mobile No'],
    ['EMAIL', 'Email Id'],
    ['TOTAL_COUPON_USED', 'Total Coupons Used'],
  ];
  date: Date[] = [];

  isExportloading = false;
  coursesNodes = [];
  VIDEO_ID = '';
  loadingVideos = false;
  students = [];
  STUDENT_ID = '';
  loadingStudents = false;
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

  isloadSpinning = false;
  dataList1 = [];

  pageSize2 = 10;
  selectedDate: Date[] = [];
  value1: string = '';
  value2: string = '';
  dateFormat = 'dd/MM/yyyy';
  datePipe = new DatePipe('en-US');
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public datepipe: DatePipe,
    private _exportService: ExportService,
    private router: Router
  ) { }
  ngOnInit() {
    // this.search();
    this.selectedDate = [new Date(), new Date()];
    // this.changeDate(this.selectedDate);

    // this.loadAllCourses();

    // this.logtext = 'OPENED - Student Coupon Summary KEYWORD[O - Chapters] ';
    // this.api.addLog('A', this.logtext, this.api.emailId)
    //   .subscribe(successCode => {
    //     if (successCode['code'] == "200") {
    //
    //     }
    //     else {
    //
    //     }
    //   });
  }
  // changeDate(value) {
  //   this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
  //   this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  // }

  // loadAllCourses() {
  //   this.api.getAllStudents(0, 0, 'ID', 'ASC', ' ').subscribe(
  //     (localName) => {
  //       this.coursesNodes = localName['data'];
  //       // this.filterValue = this.coursesNodes[0]['ID']
  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }
  back() {
    this.router.navigate(['/masters/menu']);
  }

  keyup(keys: any) {
    // this.search();
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  // Basic Methods
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
    this.search(false);
  }

  // onKeyDownEvent(event) {
  //   if (event.key == 'Enter') {
  //     event.preventDefault();
  //   }

  //   this.isFilterApplied = 'default';
  //   this.filterClass = 'filter-invisible';
  //   this.search(true);
  // }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    let dateQuery = '';
    if (this.date && this.date.length === 2) {
      const [startDate, endDate] = this.date;
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      // if(dateQuery!=='') dateQuery+=' AND ';
      dateQuery += ` AND  DATE(CREATED_MODIFIED_DATE) BETWEEN '${start}' AND '${end}' `
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';

      // this.logtext =
      //   'Filter Applied - Student Video Student Details"+ sort +" "+this.sortKey +" KEYWORD [F - Chapters] ';
      // this.api
      //   .addLog('A', this.logtext, this.api.emailId)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      //
      //     } else {
      //
      //     }
      //   });
    } catch (error) {
      sort = '';
    }

    // if (this.searchText != '') {
    //   var likeQuery = ' AND (';
    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';

    // }

    var likeQuery = '';

    var globalSearchQuery = '';
    // Global Search (using searchText)
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

    this.logtext =
      'Filter Applied - Customer Coupon Summary' +
      likeQuery +
      ' KEYWORD [F - Chapters] ';
    // this.api.addLog('A', this.logtext, this.api.emailId)
    //   .subscribe(successCode => {
    //     if (successCode['code'] == "200") {
    //
    //     }
    //     else {
    //
    //     }
    //   });

    var filter = '';
    if (likeQuery) filter = this.filterQuery + likeQuery;
    else filter = this.filterQuery;

    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.nametext.trim()}%'`;
      this.isCustNameFilterApplied = true;
    } else {
      this.isCustNameFilterApplied = false;
    }

    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobiletext.trim()}%'`;
      this.isMobileVisibleFilterApplied = true;
    } else {
      this.isMobileVisibleFilterApplied = false;
    }

    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
      this.isEmailVisibleFilterApplied = true;
    } else {
      this.isEmailVisibleFilterApplied = false;
    }

    if (this.TotCouponUsedtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TOTAL_COUPON_USED LIKE '%${this.TotCouponUsedtext.trim()}%'`;
      this.isTotCouponUsedVisibleFilterApplied = true;
    } else {
      this.isTotCouponUsedVisibleFilterApplied = false;
    }

    this.isloadSpinning = true;

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.api
        .getCustomerCouponSummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + dateQuery
        )
        .subscribe(
          (data) => {
            //
            this.isloadSpinning = false;
            this.loadingRecords = false;
            if (data['code'] == '200') {
              this.totalRecords = data['count'];
              this.TabId = data['TAB_ID'];
              this.dataList = data['data'];
              if (data['count'] > '0') this.dataList1 = data['data'];
            } else if (data['code'] == 400) {
              this.isloadSpinning = false;
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.isloadSpinning = false;
              this.loadingRecords = false;

            }
          },
          (err) => {

            if (err['status'] == 400) {
              this.isloadSpinning = false;
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.isloadSpinning = false;
              this.loadingRecords = false;
              this.dataList = [];
              // this.message.error('Failed To Get Inventory Records', '');
            }
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getCustomerCouponSummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + dateQuery
        )
        .subscribe(
          (data) => {
            //
            this.isloadSpinning = false;
            this.loadingRecords = false;
            if (data['code'] == '200') {
              this.totalRecords = data['count'];
              this.TabId = data['TAB_ID'];
              this.dataList = data['data'];
              this.excelData = data['data'];
              this.convertInExcel();
              if (data['count'] > '0') this.dataList1 = data['data'];
              this.exportLoading = false;
            }
          },
          (err) => {
            this.exportLoading = false;
          }
        );
    }
  }

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  // applyFilter() {
  //   if (this.filterValue == '') this.filterQuery = '';
  //   else this.filterQuery = ' AND CUSTOMER_ID=' + this.filterValue;

  //   this.isFilterApplied = 'primary';
  //   this.filterClass = 'filter-invisible';

  //   this.search(true);
  // }

  clearFilter() {
    this.filterValue = '';
    this.filterQuery = '';
    this.selectedDate = [new Date(), new Date()];
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  nametext: string = '';
  CustNameVisible: boolean = false;
  isCustNameFilterApplied = false;

  mobiletext: string = '';
  mobileVisible: boolean = false;
  isMobileVisibleFilterApplied = false;

  emailtext: string = '';
  emailVisible: boolean = false;
  isEmailVisibleFilterApplied = false;

  TotCouponUsedtext: string = '';
  TotCouponUsedVisible: boolean = false;
  isTotCouponUsedVisibleFilterApplied = false;

  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.mobiletext = '';
    this.emailtext = '';
    this.TotCouponUsedtext = '';
    this.search();
  }

  onKeyup(keys: any, type: string): void {
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && keys.key === 'Backspace') {
      this.search(true);
    }

    if (type == 'name' && this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isCustNameFilterApplied = true;
    } else if (
      type == 'name' &&
      this.nametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isCustNameFilterApplied = false;
    }

    if (
      type == 'mobile' &&
      this.mobiletext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isMobileVisibleFilterApplied = true;
    } else if (
      type == 'mobile' &&
      this.mobiletext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isMobileVisibleFilterApplied = false;
    }

    if (type == 'email' && this.emailtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isEmailVisibleFilterApplied = true;
    } else if (
      type == 'email' &&
      this.emailtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isEmailVisibleFilterApplied = false;
    }

    if (
      type == 'totalcoupons' &&
      this.TotCouponUsedtext.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.isTotCouponUsedVisibleFilterApplied = true;
    } else if (
      type == 'totalcoupons' &&
      this.TotCouponUsedtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isTotCouponUsedVisibleFilterApplied = false;
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  drawerTitle;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = "";
  // filterClass: string = "filter-invisible";
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
    this.drawerTitle = 'Customer Coupon Summary Report Filter';
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
      placeholder: 'Enter Customer Name',
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
      placeholder: 'Enter Mobile No.',
    },
    {
      key: 'EMAIL',
      label: 'Email',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Email',
    },
    {
      key: 'TOTAL_COUPON_USED',
      label: 'Total Coupon Used',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Total Coupon Used',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME'];
        obj1['Mobile No'] = this.excelData[i]['MOBILE_NO'];
        obj1['Email'] = this.excelData[i]['EMAIL'];
        obj1['Total Coupon Used'] = this.excelData[i]['TOTAL_COUPON_USED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Customer Coupon Summary Report' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
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
}