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
  selector: 'app-warehouse-to-technician-stock-movement-report',
  templateUrl: './warehouse-to-technician-stock-movement-report.component.html',
  styleUrls: ['./warehouse-to-technician-stock-movement-report.component.css'],
})
export class WarehouseToTechnicianStockMovementReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datepipe: DatePipe,
    private _exportService: ExportService
  ) {}
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Warehouse to technician stock movement report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = '';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  totaldata = 1;
  items: any = [];
  columns: string[][] = [
    ['TECHNICIAN_NAME'],
    ['DATE'],
    ['TRANSFER_MODE'],
    ['WAREHOUSE_NAME'],
    ['USER_NAME'],
  ];
  columns2: string[][] = [
    ['INVENTORY_NAME'],
    ['VARIANT_NAME'],
    ['SERIAL_NO'],
    ['BATCH_NO'],
    ['QUANTITY'],
    ['UNIT_NAME'],
  ];
  drawerCountryMappingVisible = false;
  drawervisible = false;
  Seqtext: any;
  transferModeVisible = false;
  transferModeOptions = [
    { value: 'W', display: 'Warehouse to technician' },
    { value: 'T', display: 'Technician to warehouse' },
  ];
  listOfFilter1 = [
    { value: 'W', text: 'Warehouse to technician' },
    { value: 'T', text: 'Technician to warehouse' },
  ];
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.Country = [];
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
  onEnterKey2(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyupS2(keys) {
    const element = window.document.getElementById('button2');
    if (element != null) element.focus();
    if (this.searchText2.length >= 3 && keys.key === 'Enter') {
      this.search2();
    } else if (this.searchText2.length === 0 && keys.key == 'Backspace') {
      this.items = [];
      this.search2();
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isOrderNumberApplied = false;
  isOrderDateApplied = false;
  isFinalAmountApplied = false;
  isOrderStatusApplied = false;
  grossAmountText: any = [];
  isGrossAmountApplied = false;
  GrossAmountVisible = false;
  taxrateText = '';
  istaxrateApplied = false;
  taxrateVisible = false;
  couponchargesText = '';
  iscouponchargesApplied = false;
  couponchargesVisible = false;
  discountchargesText = '';
  isdiscountchargesApplied = false;
  discountchargesVisible = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.countrytext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.countrytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.finalAmountText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isFinalAmountApplied = true;
    } else if (this.finalAmountText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFinalAmountApplied = false;
    }
    if (this.grossAmountText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isGrossAmountApplied = true;
    } else if (this.grossAmountText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isGrossAmountApplied = false;
    }
    if (this.taxrateText.length > 0 && event.key === 'Enter') {
      this.search();
      this.istaxrateApplied = true;
    } else if (this.taxrateText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istaxrateApplied = false;
    }
  }
  filterQuery: string = '';
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
      this.StartDate = null;
      this.search();
      this.isSubmittedDateFilterApplied = false;
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
    this.jobdetailsshow = false;
    this.search();
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }
  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }
  countrytext: string = '';
  orderNumberText: string = '';
  finalAmountText: string = '';
  orderStatusText: any;
  Countryvisible = false;
  OrderNumberVisible = false;
  OrderDateVisible = false;
  FinalAmountVisible = false;
  OrderStatusVisible = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  reset(): void {
    this.searchText = '';
    this.countrytext = '';
    this.orderNumberText = '';
    this.finalAmountText = '';
    this.orderStatusText = '';
    this.Shortcodetext = '';
    this.grossAmountText = '';
    this.taxrateText = '';
    this.couponchargesText = '';
    this.discountchargesText = '';
    this.search();
  }
  reset2(): void {
    this.searchText2 = '';
    this.itemNameText = '';
    this.varientNameText = '';
    this.unitText = '';
    this.batchNoText = '';
    this.serialNoText = '';
    this.search2();
  }
  orderDateText: any;
  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      const [start, end] = this.orderDateText;
      if (start && end) {
        this.search();
        this.isOrderDateApplied = true;
      }
    } else {
      this.orderDateText = null;
      this.search();
      this.isOrderDateApplied = false;
    }
  }
  resetDateFilter(): void {
    this.orderDateText = '';
    this.isOrderDateApplied = false;
    this.search();
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Order Scheduled', value: 'Order Scheduled' },
    { text: 'Order Cancelled', value: 'Order Cancelled' },
    { text: 'Order Placed', value: 'Order Placed' },
    { text: 'Order Rejected', value: 'Order Rejected' },
    { text: 'Order Ongoing', value: 'Order Rejected' },
  ];
  dataList: any = [];
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
  ];
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  isLoading = false;
  isModalVisible = false;
  selectedQuery: string = '';
  savedFilters: any;
  currentClientId = 1;
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  filterData: any;
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
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
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
  openfilter() {
    this.drawerTitle = 'Warehouse To Technician Stock Movement Filter';
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
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '';
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
    if (this.countrytext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.countrytext.trim()}%'`;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0];
        const formattedEnd = new Date(end).toISOString().split('T')[0];
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00')`;
      }
    }
    if (this.orderDateText?.length === 2) {
      const [start, end] = this.orderDateText;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `ORDER_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.finalAmountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_NAME LIKE '%${this.finalAmountText.trim()}%'`;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TRANSFER_MODE = '${this.statusFilter1}'`;
    }
    if (this.taxrateText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `USER_NAME LIKE '%${this.taxrateText.trim()}%'`;
    }
    if (this.couponchargesText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_CHARGES LIKE '%${this.couponchargesText.trim()}%'`;
    }
    if (this.discountchargesText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_CHARGES LIKE '%${this.discountchargesText.trim()}%'`;
    }
    if (this.orderStatusText?.length) {
      const categories = this.orderStatusText.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `TECHNICIAN_ID IN (${categories})`;
      this.isOrderStatusApplied = true;
    } else {
      this.isOrderStatusApplied = false;
    }
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.Seqtext.toString().trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ORDER_STATUS_NAME = '${this.statusFilter}'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .TechnicianstockMovementRequestnew(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.Country = data.body['data'];
              this.TabId = data.body['TAB_ID'];
            } else if (data['status'] == 400) {
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
              this.Country = [];
            } else if (err['status'] == 400) {
              this.loadingRecords = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
              this.Country = [];
            }
          }
        );
    } else {
      this.loadingRecords = false;
      this.exportLoading = true;
      this.api
        .TechnicianstockMovementRequestnew(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.excelData = data.body['data'];
              this.exportLoading = false;
              this.convertInExcel();
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
            }
          }
        );
    }
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'DATE',
      label: 'Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Date',
    },
    {
      key: 'WAREHOUSE_NAME',
      label: 'Warehouse Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter User Name',
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
      key: 'USER_NAME',
      label: 'Transferred By',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transferred By',
    },
    {
      key: 'TRANSFER_MODE',
      label: 'Transfer Mode',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transfer Mode',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  drawerTitle;
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  importInExcel2() {
    this.search2(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Date'] = this.datepipe.transform(
          this.excelData[i]['DATE'],
          'dd/MM/yyyy hh:mm a'
        );
        obj1['Warehouse Name'] = this.excelData[i]['WAREHOUSE_NAME'];
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME'];
        obj1['User Name'] = this.excelData[i]['USER_NAME'];
        obj1['Transfer Mode'] =
          this.excelData[i]['TRANSFER_MODE'] == 'W'
            ? 'Warehouse to technician'
            : 'Technician to warehouse';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Warehouse to technician stock report ' +
              this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  convertInExcel2() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData2.length > 0) {
      for (var i = 0; i < this.excelData2.length; i++) {
        obj1['Item Name'] = this.excelData2[i]['INVENTORY_NAME'];
        obj1['Variant Name'] = this.excelData2[i]['VARIANT_NAME'];
        obj1['Serial No'] = this.excelData2[i]['SERIAL_NO'];
        obj1['Batch No'] = this.excelData2[i]['BATCH_NO'];
        obj1['Quantity'] = this.excelData2[i]['QUANTITY'];
        obj1['Unit'] = this.excelData2[i]['UNIT_NAME'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData2.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Warehouse to technician stock movement details' +
              this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter = '';
  ratingfilter = '';
  pageIndex1 = 1;
  pageSize1 = 10;
  sortKey1 = '';
  sortValue1 = 'desc';
  searchText2 = '';
  loadingRecords2 = false;
  totalRecords2 = false;
  exportLoading2 = false;
  excelData2: any = [];
  itemNameText = '';
  itemNameApplied = false;
  itemNameVisible = false;
  varientNameText = '';
  varientNameApplied = false;
  varientNameVisible = false;
  serialNoText = '';
  serialNoApplied = false;
  serialNoVisible = false;
  batchNoText = '';
  batchNoApplied = false;
  batchNoVisible = false;
  quantityText = '';
  quantityApplied = false;
  quantityVisible = false;
  unitText = '';
  unitApplied = false;
  unitVisible = false;
  onKeyup2(event: KeyboardEvent): void {
    if (this.itemNameText.length >= 3 && event.key === 'Enter') {
      this.search2();
      this.itemNameApplied = true;
    } else if (this.itemNameText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.itemNameApplied = false;
    }
    if (this.varientNameText.length > 0 && event.key === 'Enter') {
      this.search2();
      this.varientNameApplied = true;
    } else if (this.varientNameText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.varientNameApplied = false;
    }
    if (this.serialNoText.length > 0 && event.key === 'Enter') {
      this.search2();
      this.serialNoApplied = true;
    } else if (this.serialNoText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.serialNoApplied = false;
    }
    if (this.batchNoText.length > 0 && event.key === 'Enter') {
      this.search2();
      this.batchNoApplied = true;
    } else if (this.batchNoText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.batchNoApplied = false;
    }
    if (this.quantityText.length > 0 && event.key === 'Enter') {
      this.search2();
      this.quantityApplied = true;
    } else if (this.quantityText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.quantityApplied = false;
    }
    if (this.unitText.length > 0 && event.key === 'Enter') {
      this.search2();
      this.unitApplied = true;
    } else if (this.unitText.length == 0 && event.key === 'Backspace') {
      this.search2();
      this.unitApplied = false;
    }
  }
  search2(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText2.length < 3 && this.searchText2.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex1 = 1;
      this.sortKey1 = '';
      this.sortValue1 = 'desc';
    }
    var sort: string;
    try {
      sort = this.sortValue1.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText2 !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns2
          .map((column) => {
            return `${column[0]} like '%${this.searchText2}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.itemNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INVENTORY_NAME LIKE '%${this.itemNameText.trim()}%'`;
    }
    if (this.varientNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `VARIANT_NAME LIKE '%${this.varientNameText.trim()}%'`;
    }
    if (this.serialNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERIAL_NO LIKE '%${this.serialNoText.trim()}%'`;
    }
    if (this.batchNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BATCH_NO LIKE '%${this.batchNoText.trim()}%'`;
    }
    if (this.quantityText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `QUANTITY LIKE '%${this.quantityText.trim()}%'`;
    }
    if (this.unitText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `UNIT_NAME LIKE '%${this.unitText.trim()}%'`;
    }
    this.loadingRecords2 = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .getAllInnerTechnicianStockMovementItemDetailsTableeee2(
          this.pageIndex1,
          this.pageSize1,
          this.sortKey1,
          sort,
          likeQuery + this.filterQuery,
          this.jobdetailsdata.ID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords2 = false;
              this.totalRecords2 = data.body['count'];
              this.items = data.body['data'];
            } else if (data['status'] == 400) {
              this.loadingRecords2 = false;
              this.items = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords2 = false;
              this.items = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords2 = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
              this.items = [];
            } else if (err['status'] == 400) {
              this.loadingRecords2 = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
              this.items = [];
            }
          }
        );
    } else {
      this.loadingRecords2 = false;
      this.api
        .getAllInnerTechnicianStockMovementItemDetailsTableeee2(
          0,
          0,
          this.sortKey1,
          sort,
          likeQuery + this.filterQuery,
          this.jobdetailsdata.ID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords2 = false;
              this.excelData2 = data.body['data'];
              this.convertInExcel2();
            } else {
              this.excelData2 = [];
              this.exportLoading2 = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords2 = false;
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
  }
  sort2(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex1 = pageIndex;
    this.pageSize1 = pageSize;
    if (this.pageSize1 != pageSize) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }
    if (this.sortKey1 != sortField) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }
    this.sortKey1 = sortField;
    this.sortValue1 = sortOrder;
    this.search2();
  }
  orderwisejobcardreport(data: any) {
    this.jobdetailsdata = data;
    this.search2();
    this.jobdetaildrawerTitle = `View Details`;
    this.jobdetailsshow = true;
  }
  drawersize = '1000';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
    this.search();
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  orderId: any;
  getTechniciansJobs(data) {
    this.orderId = data.ID;
    this.jobdetailsshow = true;
  }
}
