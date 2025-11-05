import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-orderwise-job-card-detailed-report',
  templateUrl: './orderwise-job-card-detailed-report.component.html',
  styleUrls: ['./orderwise-job-card-detailed-report.component.css'],
})
export class OrderwiseJobCardDetailedReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datepipe: DatePipe,
    private _exportService: ExportService
  ) { }

  @Input() orderdetailsdata;
  @Input() orderId;
  @Input() drawerClose!: () => void;

  ngOnInit() {
    this.getteritorydata();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Orderwise Job Details Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'CUSTOMER_NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  filteredData: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['JOB_CARD_NO'],
    ['JOB_CARD_STATUS'],
    ['TECHNICIAN_NAME'],
    ['TERRITORY_NAME'],
    ['SERVICE_SKILLS'],
    ['SERVICE_ADDRESS'],
    ['VENDOR_COST'],
    ['TECHNICIAN_COST'],
    ['SERVICE_AMOUNT'],
    ['TOTAL_AMOUNT'],
    ['SERVICE_FULL_NAME'],
  ];
  drawerCountryMappingVisible = false;
  drawervisible = false;
  Seqtext: any;
  jobCardNoVisible = false;
  jobCardNoText = '';
  // onKeyupS(keys) {
  //   const element = window.document.getElementById('button');
  //   if (element != null) element.focus();
  //   if (this.searchText.length >= 3 && keys.key === 'Enter') {
  //     this.search();
  //   } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
  //     this.dataList = [];
  //     this.search();
  //   }
  // }

  onKeyupS(keys: KeyboardEvent) {
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key === 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  // keyup(event) {
  //   if (this.searchText.length >= 3 && event.key === 'Enter') {
  //     this.search();
  //   } else if (this.searchText.length == 0 && event.key === 'Backspace') {
  //     this.search();
  //   }
  // }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isOrderNumberApplied = false;
  isOrderDateApplied = false;
  isTechnicianNameApplied = false;
  isCustomerNameApplied = false;

  jobCardstatusText = '';
  isjobCardstatusText = false;
  jobCardstatusVisible = false;

  technameText = '';
  istechname = false;
  technameVisible = false;

  sernameText = '';
  issername = false;
  sernameVisible = false;

  seramtText = '';
  isseramt = false;
  seramtVisible = false;

  totalamtText = '';
  istotalamt = false;
  totalamtVisible = false;

  techcostText = '';
  istechcost = false;
  techcostVisible = false;

  vendorcostText = '';
  isvendorcost = false;
  vendorcostVisible = false;

  serskillText = '';
  isserskill = false;
  serskillVisible = false;

  seraddressText = '';
  isseraddress = false;
  seraddressVisible = false;

  techrateText = '';
  istechrate = false;
  techrateVisible = false;

  custrateText = '';
  iscustrete = false;
  custreteVisible = false;

  territoryText = '';
  isterritory = false;
  territoryVisible = false;

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.jobCardNoText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.jobCardNoText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }

    if (this.jobCardstatusText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isjobCardstatusText = true;
    } else if (
      this.jobCardstatusText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isjobCardstatusText = false;
    }

    if (this.technameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.istechname = true;
    } else if (this.technameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istechname = false;
    }

    if (this.sernameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.issername = true;
    } else if (this.sernameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.issername = false;
    }

    if (this.seramtText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isseramt = true;
    } else if (this.seramtText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseramt = false;
    }

    if (this.totalamtText.length > 0 && event.key === 'Enter') {
      this.search();
      this.istotalamt = true;
    } else if (this.totalamtText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istotalamt = false;
    }

    if (this.techcostText.length > 0 && event.key === 'Enter') {
      this.search();
      this.istechcost = true;
    } else if (this.techcostText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istechcost = false;
    }

    if (this.vendorcostText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isvendorcost = true;
    } else if (this.vendorcostText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isvendorcost = false;
    }

    if (this.serskillText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isserskill = true;
    } else if (this.serskillText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isserskill = false;
    }

    if (this.seraddressText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isseraddress = true;
    } else if (this.seraddressText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseraddress = false;
    }

    if (this.techrateText.length > 0 && event.key === 'Enter') {
      this.search();
      this.istechrate = true;
    } else if (this.techrateText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istechrate = false;
    }

    if (this.custrateText.length > 0 && event.key === 'Enter') {
      this.search();
      this.iscustrete = true;
    } else if (this.custrateText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.iscustrete = false;
    }

    if (this.territoryText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isterritory = true;
    } else if (this.territoryText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isterritory = false;
    }
  }
  filterQuery: string = '';

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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

    if (this.jobCardNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.jobCardNoText.trim()}%'`;
    }

    if (this.jobcardstatusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `JOB_CARD_STATUS = '${this.jobcardstatusFilter1}'`;
    }
    if (this.technameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.technameText.trim()}%'`;
    }

    if (this.sernameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_FULL_NAME LIKE '%${this.sernameText.trim()}%'`;
    }
    if (this.seramtText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_AMOUNT LIKE '%${this.seramtText.trim()}%'`;
    }

    if (this.totalamtText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TOTAL_AMOUNT LIKE '%${this.totalamtText.trim()}%'`;
    }

    if (this.territoryText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TERRITORY_NAME LIKE '%${this.territoryText.trim()}%'`;
    }

    if (this.techcostText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_COST LIKE '%${this.techcostText.trim()}%'`;
    }

    if (this.vendorcostText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `VENDOR_COST LIKE '%${this.vendorcostText.trim()}%'`;
    }

    if (this.serskillText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_SKILLS LIKE '%${this.serskillText.trim()}%'`;
    }

    if (this.seraddressText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_ADDRESS LIKE '%${this.seraddressText.trim()}%'`;
    }

    if (this.techrateText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_RATING LIKE '%${this.techrateText.trim()}%'`;
    }

    if (this.custrateText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_RATING LIKE '%${this.custrateText.trim()}%'`;
    }

    // if (this.statusFilter) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `TECHNICIAN_STATUS = '${this.statusFilter}'`;
    // }
    if (this.statusFilter && this.statusFilter.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      if (this.statusFilter.length === 1) {
        likeQuery += `TECHNICIAN_STATUS = '${this.statusFilter[0]}'`;
      } else {
        const statusList = this.statusFilter.map((val) => `'${val}'`).join(',');
        likeQuery += `TECHNICIAN_STATUS IN (${statusList})`;
      }
    }

    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TRACK_STATUS = '${this.statusFilter1}'`;
    }

    // Date Range Filter
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `ASSIGNED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    if (this.createdDate && this.createdDate.length === 2) {
      const [start, end] = this.createdDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `JOB_CREATED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    if (this.sheduledDate && this.sheduledDate.length === 2) {
      const [start, end] = this.sheduledDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    // this.sortKey = 'NAME';
    // sort = 'asc';
    if (exportInExcel == false) {
      this.api
        .getOrderwiseJobCardDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND ORDER_ID = ' + this.orderId + likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.filteredData = data['data'];
              this.TabId = data['TAB_ID'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.filteredData = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.filteredData = [];
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
        .getOrderwiseJobCardDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          ' AND ORDER_ID = ' + this.orderId + likeQuery + this.filterQuery
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
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  //For Input
  countrytext: string = '';
  orderNumberText: string = '';
  // orderDateText: string = '';
  finalAmountText: string = '';
  orderStatusText: string = '';
  idVisible: boolean = false;

  customerNameText: string = '';
  customerNameVisible: boolean = false;

  technicianNameText: string = '';
  technicianNameVisible: boolean = false;
  OrderDateVisible = false;
  orderNumberVisible: boolean = false;

  orderStatusVisible: boolean = false;

  orderDateText: any = null;
  orderDateVisible: boolean = false;

  cancelDateText: any = null;
  cancelDateVisible: boolean = false;

  reasonText: string = '';
  reasonVisible: boolean = false;
  reset(): void {
    this.jobCardNoText = '';
    this.jobCardstatusText = '';
    this.technameText = '';
    this.sernameText = '';
    this.seramtText = '';
    this.totalamtText = '';
    this.techcostText = '';
    this.vendorcostText = '';
    this.serskillText = '';
    this.seraddressText = '';
    this.techrateText = '';
    this.custrateText = '';
    this.searchText = '';
    this.territoryText = '';

    this.search();
  }

  // statusFilter: string | undefined = undefined;
  // onStatusFilterChange(selectedStatus: string) {
  //   this.statusFilter = selectedStatus;

  //   this.search(true);
  // }
  statusFilter: string[] | undefined = undefined;
  onStatusFilterChange(selectedStatus: string[]) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  listOfFilter: any[] = [
    { text: 'Pending', value: ['P'] },
    { text: 'Accepted', value: ['AC', 'AS'] },
    { text: 'Ongoing', value: ['ON'] },
    { text: 'Completed', value: ['CO'] },
  ];

  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;

    this.search(true);
  }
  jobcardstatusFilter1: string | undefined = undefined;
  onjobcardStatusFilterChange1(selectedStatus: string) {
    this.jobcardstatusFilter1 = selectedStatus;

    this.search(true);
  }

  listOfFilter1: any[] = [
    { text: 'Start Traveling', value: 'ST' },
    { text: 'Reached', value: 'RD' },
    { text: 'Start Job', value: 'SJ' },
    { text: 'End Job', value: 'EJ' },
  ];

  listOfjobcardFilter1: any[] = [
    { text: 'Completed', value: 'Completed' },
    { text: 'Assigned', value: 'Assigned' },
    { text: 'Pending', value: 'Pending' },
  ];

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

  createdDateVisible = false;
  iscreatedDateFilterApplied: boolean = false;
  createdDate: any = [];
  oncreatedDateRangeChange(): void {
    if (this.createdDate && this.createdDate.length === 2) {
      const [start, end] = this.createdDate;
      if (start && end) {
        this.search();
        this.iscreatedDateFilterApplied = true;
      }
    } else {
      this.createdDate = null;
      this.search();
      this.iscreatedDateFilterApplied = false;
    }
  }

  sheduledDateVisible = false;
  issheduledDateFilterApplied: boolean = false;
  sheduledDate: any = [];
  onsheduledDateRangeChange(): void {
    if (this.sheduledDate && this.sheduledDate.length === 2) {
      const [start, end] = this.sheduledDate;
      if (start && end) {
        this.search();
        this.issheduledDateFilterApplied = true;
      }
    } else {
      this.sheduledDate = null;
      this.search();
      this.issheduledDateFilterApplied = false;
    }
  }

  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      this.search();
    } else {
      this.orderDateText = null;
      this.search();
    }
  }

  resetDateFilter(): void {
    this.orderDateText = null;
    this.search();
  }

  onCancelDateChange(selectedDate: any): void {
    if (this.cancelDateText && this.cancelDateText.length === 2) {
      this.search();
    } else {
      this.cancelDateText = null;
      this.search();
    }
  }

  resetCancelDateFilter(): void {
    this.cancelDateText = null;
    this.search();
  }

  dataList: any = [];
  visible = false;

  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
    // { label: 'Short Code', value: 'SHORT_CODE' },
  ];

  // new filter

  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  isLoading = false;

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID

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

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;

  filterClass: string = 'filter-invisible';
  getteritorydata() {
    this.api.getTeritory(0, 0, '', '', ' AND IS_ACTIVE=1').subscribe((data) => {
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  whichbutton: any;
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
  territoryData1: any = [];
  filterData: any;
  openfilter() {
    this.drawerTitle = 'Order wise job details Filter';
    this.drawerFilterVisible = true;
    this.filterFields[12]['options'] = this.territoryData1;

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
      key: 'JOB_CARD_NO',
      label: 'Job No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job No',
    },
    {
      key: 'JOB_CARD_STATUS',
      label: 'Job Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'Completed', display: 'Completed' },
        { value: 'Assigned', display: 'Assigned' },
        { value: 'Pending', display: 'Pending' },
      ],
      placeholder: 'Enter Job Status',
    },
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
      key: 'SERVICE_FULL_NAME',
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
      key: 'SERVICE_AMOUNT',
      label: 'Service Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Amount',
    },
    {
      key: 'TOTAL_AMOUNT',
      label: 'Total Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Total Amount',
    },
    {
      key: 'TECHNICIAN_COST',
      label: 'Technician Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Cost',
    },
    {
      key: 'VENDOR_COST',
      label: 'Vendor Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Vendor Cost',
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
      key: 'SCHEDULED_DATE_TIME',
      label: 'Sheduled Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Sheduled Date',
    },
    {
      key: 'SERVICE_SKILLS',
      label: 'Service Skills',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Skills',
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
    // {
    //   key: 'TERRITORY_NAME',
    //   label: 'Territory Name',
    //   type: 'text',
    //   comparators: [
    //     { value: '=', display: 'Equal To' },
    //     { value: '!=', display: 'Not Equal To' },
    //     { value: 'Contains', display: 'Contains' },
    //     { value: 'Does Not Contains', display: 'Does Not Contains' },
    //     { value: 'Starts With', display: 'Starts With' },
    //     { value: 'Ends With', display: 'Ends With' },
    //   ],
    //   placeholder: 'Enter Territory Name',
    // },
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
      key: 'CUSTOMER_RATING',
      label: 'Customer Rating',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Rating',
    },
    {
      key: 'TECHNICIAN_RATING',
      label: 'Technician Rating',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Rating',
    },
    {
      key: 'TECHNICIAN_STATUS',
      label: 'Technician Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: "AS' OR STATUS = 'AC", display: 'Accepted' },
        { value: 'ON', display: 'Ongoing' },
        { value: 'CO', display: 'Completed' },
      ],
      placeholder: 'Select Technician Status',
    },

    {
      key: 'TRACK_STATUS',
      label: 'Track Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'ST', display: 'Start Traveling' },
        { value: 'RD', display: 'Reached' },
        { value: 'SJ', display: 'Start Job' },
        { value: 'EJ', display: 'End Job' },
      ],
      placeholder: 'Select Track Status',
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
  // filterQuery = '';
  applyfilter(item) {
    //
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  drawerTitle;
  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[12]['options'] = this.territoryData1;

    this.FILTER_NAME = data.FILTER_NAME;
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
        obj1['Job No'] = this.excelData[i]['JOB_CARD_NO']
          ? this.excelData[i]['JOB_CARD_NO']
          : '-';
        obj1['Job Status'] = this.excelData[i]['JOB_CARD_STATUS']
          ? this.excelData[i]['JOB_CARD_STATUS']
          : '-';
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME']
          ? this.excelData[i]['TECHNICIAN_NAME']
          : '-';
        obj1['Service Name'] = this.excelData[i]['SERVICE_FULL_NAME']
          ? this.excelData[i]['SERVICE_FULL_NAME']
          : '-';
        obj1['Service Amount'] = this.excelData[i]['SERVICE_AMOUNT']
          ? this.excelData[i]['SERVICE_AMOUNT']
          : '-';
        obj1['Total Amount'] = this.excelData[i]['TOTAL_AMOUNT']
          ? this.excelData[i]['TOTAL_AMOUNT']
          : '-';
        obj1['Technician Cost'] = this.excelData[i]['TECHNICIAN_COST']
          ? this.excelData[i]['TECHNICIAN_COST']
          : '-';
        obj1['Vendor Cost'] = this.excelData[i]['VENDOR_COST']
          ? this.excelData[i]['VENDOR_COST']
          : '-';
        obj1['Assigned Date'] = this.excelData[i]['ASSIGNED_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['ASSIGNED_DATE'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Job Created Date'] = this.excelData[i]['JOB_CREATED_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['JOB_CREATED_DATE'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Scheduled Date'] = this.excelData[i]['SCHEDULED_DATE_TIME']
          ? this.datepipe.transform(
            this.excelData[i]['SCHEDULED_DATE_TIME'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Service Skills'] = this.excelData[i]['SERVICE_SKILLS'];
        obj1['Territory Name'] = this.excelData[i]['TERRITORY_NAME'];
        obj1['Service Address'] = this.excelData[i]['SERVICE_ADDRESS'];
        obj1['Customer Rating'] = this.excelData[i]['CUSTOMER_RATING'];
        obj1['Technician Rating'] = this.excelData[i]['TECHNICIAN_RATING'];
        if (this.excelData[i]['TECHNICIAN_STATUS'] == 'AS') {
          obj1['Technician Status'] = 'Accepted';
        } else if (this.excelData[i]['TECHNICIAN_STATUS'] == 'P') {
          obj1['Technician Status'] = 'Pending';
        } else if (this.excelData[i]['TECHNICIAN_STATUS'] == 'ON') {
          obj1['Technician Status'] = 'Ongoing';
        } else if (this.excelData[i]['TECHNICIAN_STATUS'] == 'CO') {
          obj1['Technician Status'] = 'Completed';
        }
        if (this.excelData[i]['TRACK_STATUS'] == 'ST') {
          obj1['Track Status'] = 'Start Traveling';
        } else if (this.excelData[i]['TRACK_STATUS'] == 'RD') {
          obj1['Track Status'] = 'Reached';
        } else if (this.excelData[i]['TRACK_STATUS'] == 'SJ') {
          obj1['Track Status'] = 'Start Job';
        } else if (this.excelData[i]['TRACK_STATUS'] == 'EJ') {
          obj1['Track Status'] = 'End Job';
        } else if (
          this.excelData[i]['TRACK_STATUS'] == null ||
          this.excelData[i]['TRACK_STATUS'] == '-'
        ) {
          obj1['Track Status'] = '-';
        }
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Order wise job details Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
}
