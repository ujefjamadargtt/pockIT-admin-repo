import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-technician-map-jobs-data',
  templateUrl: './technician-map-jobs-data.component.html',
  styleUrls: ['./technician-map-jobs-data.component.css'],
})
export class TechnicianMapJobsDataComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  @Input() viewjobsdata: any;
  @Input() technicianId: any;
  formTitle = 'Manage Jobs';
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
  backofficeId = sessionStorage.getItem('backofficeId');
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  decreptedbackofficeId = 0;
  @Input() teritoryIds: any = [];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
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
    likeQuery = likeQuery + ' AND TECHNICIAN_ID = ' + this.technicianId;
    if (this.teritoryIds.length != 0) {
      likeQuery =
        likeQuery +
        ' AND TERRITORY_ID in (' +
        this.teritoryIds.toString() +
        ')';
    }
    this.api
      .getpendinjobsdataa(
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
  filterData: any;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
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
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
      key: 'ASSIGNED_DATE',
      label: 'Assigned Date',
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
      key: 'SCHEDULED_DATE_TIME',
      label: 'Scheduled Date',
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
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
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
  updatejobstatus1(dataMain: any, status) {
    this.ViewUpdateStatusModal = true;
    this.MainUpdateData = dataMain;
    this.statustech = status;
    this.paymenttech = '';
    this.is_complete_job = 0;
  }
  is_complete_job = 0;
  updatejobstatus12(dataMain: any, status) {
    this.ViewUpdateStatusModal = true;
    this.MainUpdateData = dataMain;
    this.paymenttech = status;
    this.statustech = 'SJ';
    this.is_complete_job = 1;
  }
  CancelmodalUpdate() {
    this.ViewUpdateStatusModal = false;
    this.is_complete_job = 0;
  }
  otpwindow(dataMainn: any, status) {
    this.paymenttech = '';
    this.statustech = status;
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
            this.OTP = '';
            this.ViewUpdateOTP = true;
            this.message.success(
              'Happy Code has been successfully sent to customer mobile no.',
              ''
            );
            this.isSpinningACtive = false;
          } else {
            this.message.error('Failed to send Happy Code', '');
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
    if (this.OTP === '' || this.OTP === null || this.OTP === undefined) {
      this.message.error('Please enter Happy Code', '');
    } else if (
      this.OTP !== '' &&
      this.OTP !== null &&
      this.OTP !== undefined &&
      this.OTP.length < 4
    ) {
      this.message.error('Please enter valid Happy Code', '');
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
              this.message.error('Please enter valid Happy Code', '');
            } else {
              this.message.error('Failed to verify Happy Code', '');
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
  statustech: any = '';
  paymenttech: any = '';
  updatejobstatus(dataMain: any) {
    this.isSpinningACtive = true;
    if (this.paymenttech == 'P') dataMain.IS_JOB_COMPLETE = 1;
    if (this.paymenttech == 'PR') dataMain.JOB_PAYMENT_STATUS = 'D';
    this.api
      .ChangeJobStatusForTech(
        dataMain.TECHNICIAN_ID,
        this.statustech,
        this.USER_ID,
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
            this.message.success('Job Status Updated Successfully', '');
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
    this.api
      .ChangeJobStatusForTech(
        dataMain.TECHNICIAN_ID,
        this.statustech,
        this.USER_ID,
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
  generateInvoice(data) {
    var d = {
      JOB_CARD_ID: data.ID,
      ORDER_ID: data.ORDER_ID,
      JOB_CARD_NO: data.JOB_CARD_NO,
      INVOICE_FOR: 'J',
      ORDER_NO: data.ORDER_NO,
    };
    this.filterloading = true;
    this.loadingRecords = true;
    this.api.generatetInvoice(d).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.isSpinningACtive = false;
          this.loadVerifyOTP = false;
          this.loadingRecords = false;
          this.ViewUpdateOTP = false;
          this.ViewUpdateStatusModal = false;
          this.isSpinningACtive = false;
          this.filterloading = false;
          this.message.success('Invoice Generated Successfully.', '');
          this.search();
        } else {
          this.isSpinningACtive = false;
          this.loadingRecords = false;
          this.loadVerifyOTP = false;
          this.filterloading = false;
          this.message.error('Failed to Generate Invoice.', '');
        }
      },
      (err) => {
        this.isSpinningACtive = false;
        this.loadingRecords = false;
        this.loadVerifyOTP = false;
        this.filterloading = false;
        this.message.error('Something went wrong, please try again later.', '');
      }
    );
  }
  ChangeJobPaymentStatusForTech(data) {
    var d = {
      JOB_CARD_ID: data.ID,
      CUSTOMER_ID: data.CUSTOMER_ID,
      TECHNICIAN_NAME: data.TECHNICIAN_NAME,
      TECHNICIAN_ID: data.TECHNICIAN_ID,
      STATUS: data.STATUS,
      JOB_CARD_NO: data.JOB_CARD_NO,
      ORDER_ID: data.ORDER_ID,
      IS_UPDATED_BY_ADMIN: 1,
    };
    this.filterloading = true;
    this.api.ChangeJobPaymentStatusForTech(d).subscribe((res) => {
      if (res.status == 200) {
        this.isSpinningACtive = false;
        this.loadVerifyOTP = false;
        this.ViewUpdateOTP = false;
        this.ViewUpdateStatusModal = false;
        this.isSpinningACtive = false;
        this.message.success('Payment Status changed Successfully.', '');
        this.search();
      } else {
        this.isSpinningACtive = false;
        this.loadVerifyOTP = false;
        this.message.error('Failed to Change Payment Status.', '');
      }
      this.filterloading = false;
    });
  }
  addPhotos(data) {
    var d = {
      JOB_CARD_ID: data.ID,
      CUSTOMER_ID: data.CUSTOMER_ID,
      PHOTOS_DATA: [],
      REMARK: data.REMARK,
      TECHNICIAN_ID: data.TECHNICIAN_ID,
      STATUS: data.STATUS,
      ORDER_ID: data.ORDER_ID,
      IS_UPDATED_BY_ADMIN: 1,
    };
    this.filterloading = true;
    this.isSpinningACtive = true;
    this.api.addPhotos(d).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.isSpinningACtive = false;
          this.loadVerifyOTP = false;
          this.ViewUpdateOTP = false;
          this.ViewUpdateStatusModal = false;
          this.filterloading = false;
          this.message.success('Successfully Marked As Completed.', '');
          this.search();
          this.is_complete_job = 0;
        } else {
          this.isSpinningACtive = false;
          this.filterloading = false;
          this.loadVerifyOTP = false;
          this.message.error('Failed to Change Job Status.', '');
        }
      },
      (err) => {
        this.isSpinningACtive = false;
        this.filterloading = false;
        this.loadVerifyOTP = false;
        this.message.error('Something went wrong, please try again later.', '');
      }
    );
  }
}
