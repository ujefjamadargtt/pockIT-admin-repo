import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CountryData } from 'src/app/Pages/Models/CountryMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-technician-card-report',
  templateUrl: './technician-card-report.component.html',
  styleUrls: ['./technician-card-report.component.css'],
})
export class TechnicianCardReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Technician wise job report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = '';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['START_TIME', 'START_TIME'],
    ['END_TIME', 'END_TIME'],
  ];
  drawerCountryMappingVisible = false;
  drawerTitle = 'Add New Country';
  drawerData: CountryData = new CountryData();
  drawervisible = false;
  Seqtext: any;
  isjobcardFilterApplied = false;
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
    // this.search(true);
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isShortApplied = false;
  isSeqApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.countrytext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.countrytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.Refundtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isjobcardFilterApplied = true;
    } else if (this.Refundtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isjobcardFilterApplied = false;
    }

    if (this.startTimetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.startTimetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.EndTimetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.EndTimetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.ExpectedTimeec.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ExpectedTimeec.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.ActualTimeec.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ActualTimeec.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.Shortcodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isShortApplied = true;
    } else if (this.Shortcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isShortApplied = false;
    }
    if (this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isSeqApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isSeqApplied = false;
    }
  }
  filterQuery: string = '';

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'TECHNICIAN_NAME';
      this.sortValue = 'desc';
    }

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

    // Country Filter
    if (this.countrytext !== '') {
      likeQuery +=
        (likeQuery ? ' TECHNICIAN_NAME ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.countrytext.trim()}%'`;
    }

    // For Refund

    if (this.Refundtext !== '') {
      likeQuery +=
        (likeQuery ? ' JOB_CARD_NO ' : '') +
        `JOB_CARD_NO LIKE '%${this.Refundtext.trim()}%'`;
    }

    // Start Time Range Filter
    if (this.startfromTime && this.starttoTime) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `START_TIME BETWEEN '${this.startfromTime.trim()}' AND '${this.starttoTime.trim()}'`;
    }

    // End Time Range Filter
    if (this.endfromTime1 && this.endtoTime1) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `END_TIME BETWEEN '${this.endfromTime1.trim()}' AND '${this.endtoTime1.trim()}'`;
    }

    // ExpectedTimeec

    if (this.ExpectedTimeec !== '') {
      likeQuery +=
        (likeQuery ? ' EXPECTED_TIME_IN_MIN ' : '') +
        `EXPECTED_TIME_IN_MIN LIKE '%${this.ExpectedTimeec.trim()}%'`;
    }

    // Actual Time

    if (this.ActualTimeec !== '') {
      likeQuery +=
        (likeQuery ? ' ACTUAL_TIME_IN_MIN ' : '') +
        `ACTUAL_TIME_IN_MIN LIKE '%${this.ActualTimeec.trim()}%'`;
    }

    // Date

    if (this.selectedFromDate?.length === 2) {
      const [start, end] = this.selectedFromDate;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `ASSIGNED_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }

    //Seq no
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.Seqtext.toString().trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_REFUND_STATUS = '${this.statusFilter}'`;
    }
    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    // this.sortKey = 'NAME';
    // sort = 'asc';
    if (exportInExcel == false) {
      this.api
        .TechnicianwiseRepor(
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
              this.Country = data['data'];
              this.TabId = data['TAB_ID'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.Country = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.Country = [];
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
    } else {
      this.loadingRecords = false;
      this.exportLoading = true;

      this.api
        .TechnicianwiseRepor(
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
              this.message.error('Something Went Wrong.', '');
              this.exportLoading = false;
            }
          }
        );
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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

  close() {
    this.drawervisible = false;
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }

  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }

  updateStartFromTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0);
  }

  endfromTime: any;
  endtoTime: any;
  endfromTime1;
  endtoTime1;

  fromTime: any;
  toTime: any;
  startfromTime;
  starttoTime;
  isStartTimeFilterApplied = false;
  StartTimeVisible = false;
  isEndTimeFilterApplied = false;
  EndTimeVisible = false;
  onTimeFilterChange(): void {
    if (this.fromTime && this.toTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isStartTimeFilterApplied = true;
    } else {
      // Clear the filter
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isStartTimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search();
  }
  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.endfromTime
        .getHours()
        .toString()
        .padStart(2, '0');
      const startMinutes = this.endfromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.endtoTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.endtoTime
        .getMinutes()
        .toString()
        .padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isEndTimeFilterApplied = true;
    } else {
      // Clear the filter
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isEndTimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search();
  }
  //For Input
  countrytext: string = '';
  Refundtext: string = '';
  startTimetext: string = '';
  EndTimetext: string = '';
  ExpectedTimeec: string = '';
  ActualTimeec: string = '';
  Countryvisible = false;
  Refund = false;
  fromDateVisible = false;
  startTime = false;
  EndTime = false;
  ExpectedTime = false;
  ActualTime = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  reset(): void {
    this.searchText = '';
    this.countrytext = '';
    this.Refundtext = '';
    this.startTimetext = '';
    this.EndTimetext = '';
    this.ExpectedTimeec = '';
    this.ActualTimeec = '';
    this.Shortcodetext = '';
    this.search();
  }

  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;

    this.search(true);
  }

  listOfFilter: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'RF', value: 'RF' },
  ];

  dataList: any = [];
  visible = false;

  columns1: { label: string; value: string }[] = [
    { label: 'Country Name', value: 'CUSTOMER_NAME' },
  ];

  selectedFromDate: any;
  isFromDateFilterApplied: boolean = false;
  onFromDateangeChange() {
    if (this.selectedFromDate && this.selectedFromDate.length === 2) {
      const [start, end] = this.selectedFromDate;
      if (start && end) {
        this.search();
        this.isFromDateFilterApplied = true;
      }
    } else {
      this.selectedFromDate = null; // or [] if you prefer
      this.search();
      this.isFromDateFilterApplied = false;
    }
  }
  formatTime(time: string): string {
    // Ensure the time is valid and in the format HH:mm:ss or HH:mm
    if (time && /^[0-9]{2}:[0-9]{2}(?::[0-9]{2})?$/.test(time)) {
      // Split the time into hours and minutes (ignore seconds if present)
      const [hours, minutes] = time.split(':').map(Number);

      // Convert 24-hour format to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 (midnight)

      // Return formatted time
      return `${this.padZero(hour12)}:${this.padZero(minutes)} ${period}`;
    }
    return '';
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  // new filter
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  isLoading = false;

  savedFilters: any; // Define the type of savedFilters if possible

  // new  Main filter

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

  //New Advance Filter

  filterData: any;
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

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;

  filterClass: string = 'filter-invisible';

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  filterloading: boolean = false;

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
    // this.filterFields[0]['options'] = this.countryData;

    this.drawerTitle = 'Technician Card Filter';
    this.drawerFilterVisible = true;

    // Edit code 2

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
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Name',
    },
    {
      key: 'JOB_CARD_NO',
      label: 'Job No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job No.',
    },
    {
      key: 'ASSIGNED_DATE',
      label: 'Assigned Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than ' },
        { value: '<', display: 'Less Than ' },
        { value: '>=', display: 'Greater Than Equal TO' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Assigned Date',
    },
    {
      key: 'START_TIME',
      label: 'Start Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than ' },
        { value: '<', display: 'Less Than ' },
        { value: '>=', display: 'Greater Than Equal TO' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Start Time',
    },
    {
      key: 'END_TIME',
      label: 'End Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than ' },
        { value: '<', display: 'Less Than ' },
        { value: '>=', display: 'Greater Than Equal TO' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select End Time',
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
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
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
    // this.filterFields[0]['options'] = this.countryData;

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
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME']
          ? this.excelData[i]['TECHNICIAN_NAME']
          : '-';
        obj1['Job No.'] = this.excelData[i]['JOB_CARD_NO']
          ? this.excelData[i]['JOB_CARD_NO']
          : '-';
        // obj1['Assigned Date'] = this.datepipe.transform(this.excelData[i]['ASSIGNED_DATE'], 'dd/MM/yyyy');
        obj1['Assigned Date'] = this.excelData[i]['ASSIGNED_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['ASSIGNED_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';

        obj1['Start Time'] = this.excelData[i]['START_TIME']
          ? this.formatTime(this.excelData[i]['START_TIME'])
          : '-';

        obj1['End Time'] = this.excelData[i]['END_TIME']
          ? this.formatTime(this.excelData[i]['END_TIME'])
          : '-';
        obj1['Expected time in minute'] = this.excelData[i][
          'EXPECTED_TIME_IN_MIN'
        ]
          ? this.excelData[i]['EXPECTED_TIME_IN_MIN']
          : '-';
        obj1['Actual time in minute'] = this.excelData[i]['ACTUAL_TIME_IN_MIN']
          ? this.excelData[i]['ACTUAL_TIME_IN_MIN']
          : '-';

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Technician wise job report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
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
