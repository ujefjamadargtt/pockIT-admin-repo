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
  selector: 'app-technician-performance-report',
  templateUrl: './technician-performance-report.component.html',
  styleUrls: ['./technician-performance-report.component.css'],
})
export class TechnicianPerformanceReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    public datepipe: DatePipe,
    private _exportService: ExportService
  ) { }
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Technician Performance Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  columns: string[][] = [['NAME']];
  drawerCountryMappingVisible = false;
  drawervisible = false;
  Seqtext: any;
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isCustomerNameApplied: boolean = false;
  isOrderCountApplied: boolean = false;
  isCompletedApplied: boolean = false;
  isPendingApplied: boolean = false;
  isCancelledApplied: boolean = false;
  isRejectedApplied: boolean = false;
  isFinalAmountApplied: boolean = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.nameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.nameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }
  }
  filterQuery: string = '';
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'NAME';
      this.sortValue = 'desc';
    }
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
            return `${column} LIKE '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.nameText.trim()) {
      likeQuery += `NAME LIKE '%${this.nameText.trim()}%'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getTechnicianPerformanceReport(
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
              this.Country = data['data'];
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
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
    } else {
      this.exportLoading = true;
      this.loadingRecords = true;
      this.api
        .getTechnicianPerformanceReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'NAME';
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
  countrytext: string = '';
  orderNumberText: string = '';
  orderDateText: string = '';
  finalAmountText: string = '';
  orderStatusText: string = '';
  nameVisible = false;
  orderCountVisible = false;
  completedVisible = false;
  pendingVisible = false;
  cancelledVisible = false;
  rejectedVisible = false;
  finalAmountVisible = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  nameText: string = '';
  orderCountText: string = '';
  completedText: string = '';
  pendingText: string = '';
  cancelledText: string = '';
  rejectedText: string = '';
  reset(): void {
    this.nameText = '';
    this.orderCountText = '';
    this.completedText = '';
    this.pendingText = '';
    this.cancelledText = '';
    this.rejectedText = '';
    this.finalAmountText = '';
    this.search(true);
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  dataList: any = [];
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'NAME' },
  ];
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  isLoading = false;
  isModalVisible = false;
  selectedQuery: string = '';
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  savedFilters: any;
  currentClientId = 1;
  isfilterapply: boolean = false;
  drawerTitle!: string;
  filterClass: string = 'filter-invisible';
  filterloading: boolean = false;
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
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
    this.drawerTitle = 'Technician Performance Report Filter';
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
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Name'] = this.excelData[i]['NAME'];
        obj1['Total Jobs'] = this.excelData[i]['TOTAL_JOBS'];
        obj1['Assigned Jobs'] = this.excelData[i]['ASSIGNED_JOBS'];
        obj1['Completed Jobs'] = this.excelData[i]['COMPLETED_JOBS'];
        obj1['Average Ratings'] = this.excelData[i]['AVRAGE_REVIEW'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Technician Performance Report' +
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
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  opentechperformacedetails(data: any) {
    this.jobdetailsdata = data;
    this.getTechniciansJobs(data);
    this.jobdetaildrawerTitle = `View details of ${data.NAME}`;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  techId: any;
  getTechniciansJobs(data) {
    this.techId = data.ID;
    this.jobdetailsshow = true;
  }
}
