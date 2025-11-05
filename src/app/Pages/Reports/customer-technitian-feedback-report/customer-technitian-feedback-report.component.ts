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
  selector: 'app-customer-technitian-feedback-report',
  templateUrl: './customer-technitian-feedback-report.component.html',
  styleUrls: ['./customer-technitian-feedback-report.component.css'],
})
export class CustomerTechnitianFeedbackReportComponent {
  drawerVisible: boolean = false;
  searchText: string = '';
  formTitle = 'Customer Technician Feedback Report';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'CUSTOMER_NAME';
  chapters: any = [];
  isLoading = true;
  columns: string[][] = [
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['COMMENTS', 'COMMENTS'],
    ['RATING', 'RATING'],
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  operators: string[] = ['AND', 'OR'];

  query = '';
  query2 = '';

  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;
  isSpinner: boolean = false;
  QUERY_NAME: string = '';
  showquery: any;
  INSERT_NAMES: any[] = [];

  //Edit Code 3

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

  filterData: any;
  whichbutton: any;
  currentClientId = 1; // Set the client ID

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
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getCustData();
    this.getTechData();
  }

  custData: any = [];
  getCustData() {
    this.api.getAllCustomer(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.custData.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }

  techData: any = [];
  getTechData() {
    this.api.getTechnicianData(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.techData.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  nametext: string = '';
  iscustNameFilterApplied: boolean = false;
  custnamevisible = false;

  servicename: string = '';
  isserviceNameFilterApplied: boolean = false;
  servicenamevisible = false;

  ratingtext: string = '';
  isratingNameFilterApplied: boolean = false;
  ratingvisible = false;

  commenttext: string = '';
  iscommentFilterApplied: boolean = false;
  commentvisible = false;

  onKeyup(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }

    if (this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscustNameFilterApplied = true;
    } else if (this.nametext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscustNameFilterApplied = false;
    }

    if (this.servicename.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isserviceNameFilterApplied = true;
    } else if (this.servicename.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isserviceNameFilterApplied = false;
    }

    if (this.ratingtext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isratingNameFilterApplied = true;
    } else if (this.ratingtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isratingNameFilterApplied = false;
    }

    if (this.commenttext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscommentFilterApplied = true;
    } else if (this.commenttext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscommentFilterApplied = false;
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  filteredUnitData: any[] = [];

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'CUSTOMER_ID';
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
    // Date Range Filter
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(FEEDBACK_DATE_TIME) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.nametext.trim()}%'`;
      this.iscustNameFilterApplied = true;
    } else {
      this.iscustNameFilterApplied = false;
    }

    if (this.servicename !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.servicename.trim()}%'`;
      this.isserviceNameFilterApplied = true;
    } else {
      this.isserviceNameFilterApplied = false;
    }

    if (this.ratingtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RATING LIKE '%${this.ratingtext.trim()}%'`;
      this.isratingNameFilterApplied = true;
    } else {
      this.isratingNameFilterApplied = false;
    }

    if (this.commenttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COMMENTS LIKE '%${this.commenttext.trim()}%'`;
      this.iscommentFilterApplied = true;
    } else {
      this.iscommentFilterApplied = false;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    const finalDataList =
      this.filteredUnitData.length > 0 ? this.filteredUnitData : this.dataList;
    if (exportInExcel == false) {
      this.api
        .getCustTechnicianfeedbackreport(
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
              this.TabId = data['TAB_ID'];
              this.totalRecords = data['count'];
              this.dataList = data['data'];
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
    } else {
      this.loadingRecords = false;
      this.exportLoading = true;

      this.api
        .getCustTechnicianfeedbackreport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
              this.exportLoading = false;
            } else {
              this.excelData = [];
              this.exportLoading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.exportLoading = false;

            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
            } else {
              this.exportLoading = false;

              this.message.error('Something Went Wrong.', '');
            }
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'FEEDBACK_DATE_TIME';
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

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.servicename = '';
    this.ratingtext = '';
    this.commenttext = '';

    this.search();
  }

  nameFilter() {
    if (this.nametext.trim() === '') {
      this.searchText = '';
    } else if (this.nametext.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  servicenameFilter() {
    if (this.servicename.trim() === '') {
      this.searchText = '';
    } else if (this.servicename.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  ratingFilter() {
    if (this.ratingtext.trim() === '') {
      this.searchText = '';
    } else if (this.ratingtext.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }

  commentFilter() {
    if (this.commenttext.trim() === '') {
      this.searchText = '';
    } else if (this.commenttext.length >= 3) {
      this.search();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
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
      this.StartDate = null; // or [] if you prefer
      this.search();
      this.isSubmittedDateFilterApplied = false;
    }
  }

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
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
  filterloading: boolean = false;
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

  openfilter() {
    this.filterFields[1]['options'] = this.custData;
    this.filterFields[2]['options'] = this.techData;

    this.drawerTitle = 'Customer Technician Feedback Report Filter';
    this.drawerFilterVisible = true;

    // Edit Code 2

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

  drawerflterClose(buttontype, updateButton): void {
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
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'FEEDBACK_DATE_TIME',
      label: 'Feedback Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Feedback Date',
    },
    {
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
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
      placeholder: 'Enter Customer Name',
    },
    {
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
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
      placeholder: 'Enter Technician Name',
    },
    {
      key: 'RATING',
      label: 'Rating',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Rating',
    },
    {
      key: 'COMMENTS',
      label: 'Comment',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Comment',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[1]['options'] = this.custData;
    this.filterFields[2]['options'] = this.techData;

    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    //
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }

  excelData: any = [];
  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Feedback Date'] = this.excelData[i]['FEEDBACK_DATE_TIME']
          ? this.datepipe.transform(
            this.excelData[i]['FEEDBACK_DATE_TIME'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME']
          ? this.excelData[i]['CUSTOMER_NAME']
          : '-';
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME']
          ? this.excelData[i]['TECHNICIAN_NAME']
          : '-';
        obj1['Rating'] = this.excelData[i]['RATING']
          ? this.excelData[i]['RATING']
          : '-';
        obj1['Comments'] = this.excelData[i]['COMMENTS']
          ? this.excelData[i]['COMMENTS']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Customer Technician Feedback Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }

  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
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
