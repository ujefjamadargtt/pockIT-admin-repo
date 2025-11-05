import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-creater-wise-auto-close-ticket-report',
  templateUrl: './creater-wise-auto-close-ticket-report.component.html',
  styleUrls: ['./creater-wise-auto-close-ticket-report.component.css'],
})
export class CreaterWiseAutoCloseTicketReportComponent implements OnInit {
  formTitle = 'Creator Wise Auto Close Ticket Report';
  employeenm = '';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'USER_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';

  columns: string[][] = [['CREATER_NAME', 'Creator Name']];
  isDeleting: boolean = false;
  BRANCH = [];
  SalesExecutive = [];
  SUPPORT_USER = 'AL';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  selectedDate: Date[] = [];
  dateFormat = 'dd-MM-yyyy';
  date: Date[] = [];
  data1 = [];
  // ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion = {};
  value1: string = '';
  value2: string = '';
  leaves = [];
  supportusers = [];
  // userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));

  // orgName: string = this.api.ORGANIZATION_NAME;
  isButtonSpinning: boolean = false;
  FROM_DATE: any = new Date();
  TO_DATE: any = new Date();
  endOpen = false;
  // startOpen = false;
  employees = [];
  EXECUTIVE_ID: any = [];
  DATE: any;
  selectedFilter: string | null = null;
  CurrentValue: any = new Date();
  commonFunction = new CommonFunctionService();
  dateQuery: string = '';
  START_DATE: any = new Date();
  END_DATE: any = new Date();
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: number; // Ensure TabId is defined and initialized
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.search(true);
    let rawUserId = sessionStorage.getItem('userId');
    this.USER_ID = rawUserId
      ? Number(this.commonFunction.decryptdata(rawUserId))
      : 0;
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(true);
  }

  keyup(event: any) {
    this.search(true);
  }
  mainsearchkeyup(event: KeyboardEvent) {
    event.preventDefault(); // Prevent form submission
    if (
      this.searchText.length === 0 ||
      (event.key === 'Enter' && this.searchText.length >= 3)
    ) {
      this.search(true);
    }
  }
  @ViewChild('searchInput') searchInput!: ElementRef;

  preventDefault(event: Event) {
    event.preventDefault();
    this.searchInput.nativeElement.focus();
  }
  startOpen: boolean = false;

  onStartChange(date: Date): void {
    this.START_DATE = date;
  }
  onEndChange(date: Date): void {
    this.END_DATE = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  disabledStartDate = (START_DATE: Date): boolean => {
    if (!START_DATE || !this.END_DATE) {
      return false;
    }
    return START_DATE.getTime() > this.END_DATE;
  };

  current = new Date();

  disabledEndDate = (END_DATE: Date): boolean => {
    if (!END_DATE) {
      return false;
    }

    var previousDate = new Date(this.START_DATE);
    previousDate.setDate(previousDate.getDate() + -1);

    return END_DATE <= new Date(previousDate);
  };

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  isfilterapply: boolean = false;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }
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
    // this.search(true);
  }
  visible = false;
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  filterFields: any[] = [
    {
      key: 'CREATER_NAME',
      label: 'Creator Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      // options: [],
      placeholder: 'Enter Creator Name',
    },

    // {
    //   key: 'NUMBER_OF_TICKETS',
    //   label: 'No Of tickets',
    //   type: 'text',
    //   comparators: [
    //     '=',
    //     '!=',
    //     'Contains',
    //     'Does Not Contains',
    //     'Starts With',
    //     'Ends With',
    //   ],
    //   placeholder: 'Enter No Of tickets',
    // }
  ];
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  oldFilter: any[] = [];

  // filterQuery = '';

  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  drawerTitle;
  // openfilter() {
  //   this.drawerTitle = 'Creator Wise Auto Close Report Filter';
  //   this.applyCondition = '';
  //   // this.filterFields[0]['options'] = this.categorydate1;
  //   // this.filterFields[1]['options'] = this.subcategorydate1;

  //   this.drawerFilterVisible = true;
  // }
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

  filterData: any;
  openfilter() {
    this.drawerTitle = 'Creator Wise Auto Close Report Filter';
    this.drawerFilterVisible = true;

    // Edit Code 2

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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  Businessvisible1 = false;
  Businessvisible2 = false;
  column1applied = false;
  column2applied = false;
  column1text = '';
  column2text = '';
  setFilterApplied(field: string, value: boolean): void {
    switch (field) {
      case 'column1text':
        this.column1applied = value;
        break;
      case 'column2text':
        this.column2applied = value;
        break;

      default:
        break;
    }
  }
  onKeyup(event: KeyboardEvent, field: string): void {
    const fieldValue = this[field]; // Dynamically access the field value

    if (event.key === 'Enter') {
      if (fieldValue.length >= 3) {
        this.search();
        this.setFilterApplied(field, true);
        // this.column1applied = true;
      }
    } else if (event.key === 'Backspace' && fieldValue.length === 0) {
      this.search();
      this.setFilterApplied(field, false);
    }
  }
  reset(): void {
    // this.column1applied= false;

    this.search();
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
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

  EditQueryData = [];
  editButton: any = 'N';
  FILTER_NAME: any;
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
  // isDeleting: boolean = false;
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
  dataList2 = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
    // this.loadingRecords = true;
    var sort: string = '';

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    //
    //

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    if (this.column1text != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `AND CREATER_NAME LIKE '%${this.column1text.trim()}%'`;
    }
    if (this.column2text != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `AND NUMBER_OF_TICKETS LIKE '%${this.column2text.trim()}%'`;
    }
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.isSpinning = true;
      this.api
        .getCreatorWiseAutoClose(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.TabId = data.body['TAB_ID'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
            } else {
              this.message.error('Failed To Get Records', '');
              this.loadingRecords = false;
              this.isSpinning = false;
              this.totalRecords = 0;
              this.dataList = [];
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.dataList = [];
            this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getCreatorWiseAutoClose(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.isSpinning = false;
              // this.totalRecords = data.body['count'];
              this.dataList2 = data.body['data'];
              this.convertInExcel();
            } else {
              this.message.error('Failed To Get Records', '');
              this.loadingRecords = false;
              this.isSpinning = false;
              // this.totalRecords = 0;
              this.dataList2 = [];
            }
          },
          (err) => {
            if (err['ok'] == false) this.exportLoading = false;
            this.loadingRecords = false;
            this.isSpinning = false;
            this.dataList2 = [];
            this.message.error('Server Not Found', '');
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'USER_ID';
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

  clearFilter() {
    this.filterQuery = '';
    this.START_DATE = new Date();
    this.END_DATE = new Date();
    this.search(true);
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.dataList2.length; i++) {
      obj1['Creator Name'] = this.dataList2[i]['CREATER_NAME'];
      obj1['Number Of Tickets'] = this.dataList2[i]['NUMBER_OF_TICKETS'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataList2.length - 1) {
        this._exportService.exportExcel1(
          arry1,
          'Creator Wise Auto Close Support Ticket Report' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
