import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-customersjobslist',
  templateUrl: './customersjobslist.component.html',
  styleUrls: ['./customersjobslist.component.css'],
})
export class CustomersjobslistComponent implements OnInit {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  @Input() viewjobsdata: any;
  @Input() technicianId: any;
  sortValue: string = 'desc';
  sortKey: string = '';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = '';
  isSpinning = false;
  loadingRecords;
  columns: string[][] = [
    ['JOB_CREATED_DATE', 'JOB_CREATED_DATE'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['ORDER_NO', 'ORDER_NO'],
    ['ASSIGNED_DATE', 'ASSIGNED_DATE'],
    ['SCHEDULED_DATE_TIME', 'SCHEDULED_DATE_TIME'],
    ['SERVICE_NAME', 'SERVICE_NAME'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['CUSTOMER_MOBILE_NUMBER', 'CUSTOMER_MOBILE_NUMBER'],
  ];
  allSelected = false;
  tableIndeterminate: boolean = false;
  tableIndeterminate11: boolean = false;
  selectedPincode: any[] = [];
  city: any[] = [];
  state: any[] = [];
  filterQuery: string = '';
  totalRecords = 1;
  dataList: any = [];
  filterClass: string = 'filter-invisible';
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  name = sessionStorage.getItem('userName'); 
  NAME: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number; 
  public commonFunction = new CommonFunctionService();
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  drawerTitle: string;
  isFilterApplied: boolean = false;
  filterloading: boolean = false;
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    const decryptedUserId1 = this.name
      ? this.commonFunction.decryptdata(this.name)
      : '0';
    this.NAME = Number(decryptedUserId1);
  }
  JobCreatedDateVisible;
  isJobCreatedDateFilterApplied: boolean = false;
  JobCreatedDatetext: string = '';
  selectedJobCreatedDate: any;
  JobCardNoVisible;
  isJobCardNoFilterApplied: boolean = false;
  JobCardNotext: string = '';
  OrderNoVisible;
  isOrderNoFilterApplied: boolean = false;
  OrderNotext: string = '';
  AssignedDateVisible;
  isAssignedDateFilterApplied: boolean = false;
  AssignedDatetext: string = '';
  selectedAssignedDate: any;
  ScheduledDateVisible;
  isSchedulaedDateFilterApplied: boolean = false;
  ScheduledDatetext: string = '';
  selectedScheduledDate: any;
  ServiceNameVisible;
  isServiceNameFilterApplied: boolean = false;
  ServiceNametext: string = '';
  ServiceAddVisible;
  isServiceAddFilterApplied: boolean = false;
  ServiceAddtext: string = '';
  CustNameVisible;
  isCustNameFilterApplied: boolean = false;
  custNametext: string = '';
  CustMobVisible;
  isCustMobFilterApplied: boolean = false;
  custMobtext: string = '';
  CustTypeFilter: string | undefined = undefined;
  listofCustType: any[] = [
    { text: 'Individiual', value: 'I' },
    { text: 'Business', value: 'B' },
  ];
  onCustTypeFilterChange(selectedStatus: string) {
    this.CustTypeFilter = selectedStatus;
    this.search(true);
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
  onDateRangeChange() {
    if (
      this.selectedJobCreatedDate &&
      this.selectedJobCreatedDate.length === 2
    ) {
      const [start, end] = this.selectedJobCreatedDate;
      if (start && end) {
        this.search();
        this.isJobCreatedDateFilterApplied = true;
      }
    } else {
      this.selectedJobCreatedDate = null; 
      this.search();
      this.isJobCreatedDateFilterApplied = false;
    }
  }
  onAssignedDateRangeChange() {
    if (this.selectedAssignedDate && this.selectedAssignedDate.length === 2) {
      const [start, end] = this.selectedAssignedDate;
      if (start && end) {
        this.search();
        this.isAssignedDateFilterApplied = true;
      }
    } else {
      this.selectedAssignedDate = null; 
      this.search();
      this.isAssignedDateFilterApplied = false;
    }
  }
  onScheduledDateRangeChange() {
    if (this.selectedScheduledDate && this.selectedScheduledDate.length === 2) {
      const [start, end] = this.selectedScheduledDate;
      if (start && end) {
        this.search();
        this.isSchedulaedDateFilterApplied = true;
      }
    } else {
      this.selectedScheduledDate = null; 
      this.search();
      this.isSchedulaedDateFilterApplied = false;
    }
  }
  search(reset: boolean = false) {
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
    this.loadingRecords = true;
    if (this.selectedJobCreatedDate?.length === 2) {
      const [start, end] = this.selectedJobCreatedDate;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
              .getDate()
              .toString()
              .padStart(2, '0')} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}:00`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(JOB_CREATED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }
    if (this.JobCardNotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.JobCardNotext?.trim()}%'`;
      this.isJobCardNoFilterApplied = true;
    } else {
      this.isJobCardNoFilterApplied = false;
    }
    if (this.OrderNotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.OrderNotext?.trim()}%'`;
      this.isOrderNoFilterApplied = true;
    } else {
      this.isOrderNoFilterApplied = false;
    }
    if (this.selectedAssignedDate?.length === 2) {
      const [start, end] = this.selectedAssignedDate;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
              .getDate()
              .toString()
              .padStart(2, '0')} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}:00`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(ASSIGNED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }
    if (this.selectedScheduledDate?.length === 2) {
      const [start, end] = this.selectedScheduledDate;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
              .getDate()
              .toString()
              .padStart(2, '0')} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}:00`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }
    if (this.ServiceNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_NAME LIKE '%${this.ServiceNametext?.trim()}%'`;
      this.isServiceNameFilterApplied = true;
    } else {
      this.isServiceNameFilterApplied = false;
    }
    if (this.ServiceAddtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_ADDRESS LIKE '%${this.ServiceAddtext?.trim()}%'`;
      this.isServiceAddFilterApplied = true;
    } else {
      this.isServiceAddFilterApplied = false;
    }
    if (this.custNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.custNametext?.trim()}%'`;
      this.isCustNameFilterApplied = true;
    } else {
      this.isCustNameFilterApplied = false;
    }
    if (this.custMobtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_MOBILE_NUMBER LIKE '%${this.custMobtext?.trim()}%'`;
      this.isCustMobFilterApplied = true;
    } else {
      this.isCustMobFilterApplied = false;
    }
    if (this.CustTypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CUSTOMER_TYPE = '${this.CustTypeFilter}'`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getpendinjobsdataa(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + ' AND CUSTOMER_ID = ' + this.technicianId
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
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
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
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  applyCondition: any;
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
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  filterData: any;
  openfilter() {
    this.drawerTitle = 'View Jobs Filter';
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
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
      key: 'JOB_CREATED_DATE',
      label: 'Job Created Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Job Created Date',
    },
    {
      key: 'JOB_CARD_NO',
      label: 'Job Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job Number',
    },
    {
      key: 'ORDER_NO',
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
      key: 'SCHEDULED_DATE_TIME',
      label: 'Scheduled Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Scheduled Date',
    },
    {
      key: 'ASSIGNED_DATE',
      label: 'Assigned Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Assigned Date',
    },
    {
      key: 'SERVICE_NAME',
      label: 'Service Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Name',
    },
    {
      key: 'SERVICE_ADDRESS',
      label: 'Service Address',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Address',
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
      placeholder: 'Enter Customer Name',
    },
    {
      key: 'CUSTOMER_MOBILE_NUMBER',
      label: 'Customer Mobile Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Mobile Number',
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
  ];
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
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
    if (this.JobCreatedDatetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (
      this.JobCreatedDatetext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.JobCardNotext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.JobCardNotext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.OrderNotext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.OrderNotext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.OrderNotext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.OrderNotext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.ServiceNametext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ServiceNametext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.ServiceAddtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ServiceAddtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.custNametext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.custNametext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.custMobtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.custMobtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
  }
  reset(): void {
    this.searchText = '';
    this.JobCreatedDatetext = '';
    this.JobCardNotext = '';
    this.OrderNotext = '';
    this.ServiceNametext = '';
    this.ServiceAddtext = '';
    this.custNametext = '';
    this.custMobtext = '';
    this.search();
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  ViewUpdateStatusModal: boolean = false;
  ViewUpdateOTP: boolean = false;
  MainUpdateData: any;
  isSpinningACtive: boolean = false;
  OTP: any;
  updatejobstatus1(dataMain: any) {
    this.ViewUpdateStatusModal = true;
    this.MainUpdateData = dataMain;
  }
  CancelmodalUpdate() {
    this.ViewUpdateStatusModal = false;
  }
  otpwindow(dataMainn: any) {
    this.MainUpdateData = dataMainn;
    this.isSpinningACtive = true;
    this.api
      .TechsendOTPToConfirm(
        dataMainn.CUSTOMER_MOBILE_NUMBER,
        dataMainn.CUSTOMER_COUNTRY_CODE,
        dataMainn.TECHNICIAN_ID,
        dataMainn.TECHNICIAN_NAME,
        dataMainn.CUSTOMER_ID,
        dataMainn.ORDER_ID,
        dataMainn.ORDER_NO,
        dataMainn.JOB_CARD_NO,
        dataMainn.SERVICE_ID,
        dataMainn.CUSTOMER_TYPE
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ViewUpdateOTP = true;
            this.message.success(
              'OTP has been successfully sent to the mobile number ' +
              dataMainn.CUSTOMER_MOBILE_NUMBER,
              ''
            );
            this.isSpinningACtive = false;
          } else {
            this.message.error('Failed to send OTP', '');
            this.isSpinningACtive = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinningACtive = false;
        }
      );
  }
  loadVerifyOTP: boolean = false;
  OTPVerify(datamm: any) {
    if (this.OTP == '' || this.OTP == null || this.OTP == undefined) {
      this.message.error('Please enter OTP', '');
    } else if (
      this.OTP != '' &&
      this.OTP != null &&
      this.OTP != undefined &&
      this.OTP.length < 4
    ) {
      this.message.error('Please enter valid OTP', '');
    } else {
      this.loadVerifyOTP = true;
      this.api
        .TechverifyOTPToConfirm(
          datamm.CUSTOMER_MOBILE_NUMBER,
          datamm.TECHNICIAN_ID,
          datamm.JOB_CARD_NO,
          this.OTP,
          ''
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadVerifyOTP = true;
              this.updatejobstatusForOTP(datamm);
            } else if (data['code'] == 400) {
              this.loadVerifyOTP = false;
              this.message.error('Please enter valid OTP', '');
            } else {
              this.message.error('Failed to verify OTP', '');
              this.loadVerifyOTP = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.loadVerifyOTP = false;
          }
        );
    }
  }
  Cancelotp() {
    this.ViewUpdateOTP = false;
  }
  updatejobstatus(dataMain: any) {
    this.isSpinningACtive = true;
    var statustech: any = '';
    if (dataMain.TRACK_STATUS == 'SJ' && dataMain.STATUS != 'CO') {
      statustech = 'EJ';
    } else if (dataMain.TRACK_STATUS == 'RD' && dataMain.STATUS != 'CO') {
      statustech = 'SJ';
    } else if (dataMain.TRACK_STATUS == 'ST' && dataMain.STATUS != 'CO') {
      statustech = 'RD';
    } else if (
      dataMain.STATUS == 'AS' &&
      (dataMain.TECHNICIAN_STATUS == 'AC' ||
        dataMain.TECHNICIAN_STATUS == 'AS') &&
      dataMain.STATUS != 'CO' &&
      (dataMain.TRACK_STATUS == '' ||
        dataMain.TRACK_STATUS == '-' ||
        dataMain.TRACK_STATUS == null ||
        dataMain.TRACK_STATUS == undefined)
    ) {
      statustech = 'ST';
    }
    this.api
      .ChangeJobStatusForTech(
        dataMain.TECHNICIAN_ID,
        statustech,
        dataMain.TECHNICIAN_ID,
        dataMain.JOB_CARD_NO,
        dataMain.TECHNICIAN_NAME,
        dataMain.ORDER_ID,
        dataMain.SERVICE_ID,
        dataMain.ID,
        [dataMain]
      )
      .subscribe(
        (datasub) => {
          if (datasub['code'] == 200) {
            this.isSpinningACtive = false;
            this.loadVerifyOTP = false;
            this.ViewUpdateOTP = false;
            this.ViewUpdateStatusModal = false;
            this.search();
          } else {
            this.isSpinningACtive = false;
            this.loadVerifyOTP = false;
            this.message.error('Failed to update job status', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinningACtive = false;
          this.loadVerifyOTP = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
  }
  updatejobstatusForOTP(dataMain: any) {
    this.isSpinningACtive = true;
    var statustech: any = '';
    if (dataMain.TRACK_STATUS == 'SJ' && dataMain.STATUS != 'CO') {
      statustech = 'EJ';
    } else if (dataMain.TRACK_STATUS == 'RD' && dataMain.STATUS != 'CO') {
      statustech = 'SJ';
    } else if (dataMain.TRACK_STATUS == 'ST' && dataMain.STATUS != 'CO') {
      statustech = 'RD';
    } else if (
      dataMain.STATUS == 'AS' &&
      (dataMain.TECHNICIAN_STATUS == 'AC' ||
        dataMain.TECHNICIAN_STATUS == 'AS') &&
      dataMain.STATUS != 'CO' &&
      (dataMain.TRACK_STATUS == '' ||
        dataMain.TRACK_STATUS == '-' ||
        dataMain.TRACK_STATUS == null ||
        dataMain.TRACK_STATUS == undefined)
    ) {
      statustech = 'ST';
    }
    this.api
      .ChangeJobStatusForTech(
        dataMain.TECHNICIAN_ID,
        statustech,
        dataMain.TECHNICIAN_ID,
        dataMain.JOB_CARD_NO,
        dataMain.TECHNICIAN_NAME,
        dataMain.ORDER_ID,
        dataMain.SERVICE_ID,
        dataMain.ID,
        [dataMain]
      )
      .subscribe(
        (datasub) => {
          if (datasub['code'] == 200) {
            this.isSpinningACtive = false;
            this.loadVerifyOTP = false;
            this.ViewUpdateOTP = false;
            this.ViewUpdateStatusModal = false;
            this.message.success('Job completed successfully', '');
            this.search();
          } else {
            this.isSpinningACtive = false;
            this.loadVerifyOTP = false;
            this.message.error('Failed to update job status', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinningACtive = false;
          this.loadVerifyOTP = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
  }
  viewJobsWidth: string = '100%';
  viewJobsDrawerVisibleTech = false;
  viewJobsdrawerTitleTech = '';
  viewjobsdataTech: any;
  technicianIdTech: any;
  TechID: any;
  updatetechStatus(data: TechnicianMasterData) {
    this.viewJobsDrawerVisibleTech = true;
    this.viewjobsdataTech = data;
    this.TechID = data.ID;
    this.viewJobsdrawerTitleTech = `Update Job Status Of ${data.NAME}`;
  }
  viewJobsdrawerCloseTech(): void {
    this.viewJobsDrawerVisibleTech = false;
  }
  get jobdetailscloseCallbackTech() {
    return this.viewJobsdrawerCloseTech.bind(this);
  }
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter: any;
  openjobcarddetails(data: any) {
    this.invoicefilter = ' AND JOB_CARD_ID=' + data.ID;
    this.jobdetailsdata = data;
    this.jobdetaildrawerTitle = 'Job details of ' + data.JOB_CARD_NO;
    this.jobdetailsshow = true;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  ratingsShow: boolean = false;
  ratingsData: any;
  RatingsdrawerTitle: any = '';
  custid: any;
  giveratings(data: any) {
    this.ratingsData = data;
    this.custid = data.ID;
    this.RatingsdrawerTitle = 'Give ratings to ' + data.TECHNICIAN_NAME;
    this.ratingsShow = true;
  }
  drawersizeRatings = '30%';
  giveratingsdrawerClose(): void {
    this.ratingsShow = false;
    this.search();
  }
  get giveratingscloseCallback() {
    return this.giveratingsdrawerClose.bind(this);
  }
  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
    }
  }
}