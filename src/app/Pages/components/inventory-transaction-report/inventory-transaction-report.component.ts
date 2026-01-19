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
  selector: 'app-inventory-transaction-report',
  templateUrl: './inventory-transaction-report.component.html',
  styleUrls: ['./inventory-transaction-report.component.css'],
})
export class InventoryTransactionReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }
  ngOnInit() {
    this.getwarehouse();
    this.getitems();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Inventory Transaction report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['TRANSACTION_ID', 'TRANSACTION_ID'],
    ['ITEM_NAME', 'ITEM_NAME'],
    ['WAREHOUSE_NAME', 'WAREHOUSE_NAME'],
    ['INWARD_NO', 'INWARD_NO'],
    ['REMARKS', 'REMARKS'],
  ];
  drawerCountryMappingVisible = false;
  drawerTitle = '';
  drawerData: any;
  drawervisible = false;
  Seqtext: any;
  isjobcardFilterApplied = false;
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
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
  selectedCountries: number[] = [];
  isCountryFilterApplied = false;
  countryVisible: boolean = false;
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.isCountryFilterApplied = true; 
    } else {
      this.search();
      this.isCountryFilterApplied = false; 
    }
  }
  selecteditems: number[] = [];
  isitemFilterApplied = false;
  itrmvisible: boolean = false;
  onitemChange(): void {
    if (this.selecteditems?.length) {
      this.search();
      this.isitemFilterApplied = true; 
    } else {
      this.search();
      this.isitemFilterApplied = false; 
    }
  }
  selectedware: number[] = [];
  isWarehouseFilterApplied = false;
  Warehousevisible: boolean = false;
  onwareChange(): void {
    if (this.selectedware?.length) {
      this.search();
      this.isWarehouseFilterApplied = true; 
    } else {
      this.search();
      this.isWarehouseFilterApplied = false; 
    }
  }
  selectedadjust: number[] = [];
  isadjustFilterApplied = false;
  adjustVisible: boolean = false;
  onadjustChange(): void {
    if (this.selectedadjust?.length) {
      this.search();
      this.isadjustFilterApplied = true; 
    } else {
      this.search();
      this.isadjustFilterApplied = false; 
    }
  }
  selectedinwards: number[] = [];
  isinwardFilterApplied = false;
  inwardVisible: boolean = false;
  oninwardChange(): void {
    if (this.selectedinwards?.length) {
      this.search();
      this.isinwardFilterApplied = true; 
    } else {
      this.search();
      this.isinwardFilterApplied = false; 
    }
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(194, columnKey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.distinctData = data['data'];
        } else {
          this.distinctData = [];
          this.message.error('Failed To Get Distinct data Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
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
    if (this.inwardtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isinwardFilterApplied = true;
    } else if (this.inwardtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isinwardFilterApplied = false;
    }
    if (this.Refundtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isjobcardFilterApplied = true;
    } else if (this.Refundtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isjobcardFilterApplied = false;
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
    if (this.countrytext !== '') {
      likeQuery +=
        (likeQuery ? ' TRANSACTION_ID ' : '') +
        `TRANSACTION_ID LIKE '%${this.countrytext.trim()}%'`;
    }
    if (this.inwardtext !== '') {
      likeQuery +=
        (likeQuery ? ' INWARD_NO ' : '') +
        `INWARD_NO LIKE '%${this.inwardtext.trim()}%'`;
    }
    if (this.Refundtext !== '') {
      likeQuery +=
        (likeQuery ? ' REMARKS ' : '') +
        `REMARKS LIKE '%${this.Refundtext.trim()}%'`;
    }
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
          `TRANSACTION_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TRANSACTION_TYPE = '${this.statusFilter}'`;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `GATEWAY_TYPE = '${this.statusFilter1}'`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `MOVEMENT_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.selecteditems.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ITEM_NAME IN ('${this.selecteditems.join("','")}')`; 
    }
    if (this.selectedware.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `WAREHOUSE_NAME IN ('${this.selectedware.join("','")}')`; 
    }
    if (this.selectedadjust.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ADJUSTMENT_NAME IN ('${this.selectedadjust.join("','")}')`; 
    }
    if (this.selectedinwards.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INWARD_NAME IN ('${this.selectedinwards.join("','")}')`; 
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.api
        .Inventorypurchase(
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
      this.api
        .Inventorypurchase(
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
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
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
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;
      this.isStartTimeFilterApplied = true;
    } else {
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isStartTimeFilterApplied = false;
    }
    this.search();
  }
  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
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
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;
      this.isEndTimeFilterApplied = true;
    } else {
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isEndTimeFilterApplied = false;
    }
    this.search();
  }
  countrytext: string = '';
  inwardtext: string = '';
  Refundtext: string = '';
  Countryvisible = false;
  Refund = false;
  fromDateVisible = false;
  reset(): void {
    this.searchText = '';
    this.inwardtext = '';
    this.countrytext = '';
    this.Refundtext = '';
    this.search();
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Credit', value: 'C' },
    { text: 'Debit', value: 'D' },
  ];
  statusFilter1: string | undefined = undefined;
  ontypeStatusFilterChange(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  listOfFiltertype: any[] = [
    { text: 'Movement', value: 'M' },
    { text: 'Adjustment', value: 'A' },
    { text: 'Inward', value: 'I' },
  ];
  dataList: any = [];
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
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
      this.selectedFromDate = null; 
      this.search();
      this.isFromDateFilterApplied = false;
    }
  }
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  isLoading = false;
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
  filterloading: boolean = false;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(0, 0, 'id', 'desc', ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
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
  itemdata: any = [];
  warehousedata: any = [];
  getwarehouse() {
    this.api.getWarehouseData(0, 0, 'NAME', 'ASC', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.warehousedata.push({
                value: element.NAME,
                display: element.NAME,
              });
            });
          }
        }
      },
      (err) => { }
    );
  }
  getitems() {
    this.api.getInventory(0, 0, 'ITEM_NAME', 'ASC', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.itemdata.push({
                value: element.ITEM_NAME,
                display: element.ITEM_NAME,
              });
            });
          }
        }
      },
      (err) => { }
    );
  }
  openfilter() {
    this.drawerTitle = 'Inventory Transaction Report Filter';
    this.drawerFilterVisible = true;
    this.filterFields[3]['options'] = this.itemdata;
    this.filterFields[4]['options'] = this.warehousedata;
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
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'TRANSACTION_ID',
      label: 'Transaction ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transaction ID',
    },
    {
      key: 'TRANSACTION_DATE',
      label: 'Transaction Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Transaction Date',
    },
    {
      key: 'TRANSACTION_TYPE',
      label: 'Transaction Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'C', display: 'Credit' },
        { value: 'D', display: 'Debit' },
      ],
      placeholder: 'Select Transaction Type',
    },
    {
      key: 'ITEM_NAME',
      label: 'Item Name',
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select Item Name',
    },
    {
      key: 'WAREHOUSE_NAME',
      label: 'Warehouse Name',
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select Warehouse Name',
    },
    {
      key: 'INWARD_NO',
      label: 'Stock Check-In No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Inward No.',
    },
    {
      key: 'GATEWAY_TYPE',
      label: 'Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'M', display: 'Movement' },
        { value: 'A', display: 'Adjustment' },
        { value: 'I', display: 'Inward' },
      ],
      placeholder: 'Select Type',
    },
    {
      key: 'REMARKS',
      label: 'Remark',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Remark',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
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
  ]
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[3]['options'] = this.itemdata;
    this.filterFields[4]['options'] = this.warehousedata;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
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
        obj1['Transaction ID'] = this.excelData[i]['TRANSACTION_ID'];
        obj1['Transaction Date'] = this.excelData[i]['TRANSACTION_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['TRANSACTION_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        if (this.excelData[i]['TRANSACTION_TYPE'] == 'C') {
          obj1['Transaction Type'] = 'Credit';
        } else if (this.excelData[i]['TRANSACTION_TYPE'] == 'D') {
          obj1['Transaction Type'] = 'Debit';
        } else if (!this.excelData[i]['TRANSACTION_TYPE']) {
          obj1['Transaction Type'] = '-';
        }
        obj1['Item Name'] = this.excelData[i]['ITEM_NAME']
          ? this.excelData[i]['ITEM_NAME']
          : '-';
        obj1['Warehouse Name'] = this.excelData[i]['WAREHOUSE_NAME']
          ? this.excelData[i]['WAREHOUSE_NAME']
          : '-';
        obj1['Inward No.'] = this.excelData[i]['INWARD_NO']
          ? this.excelData[i]['INWARD_NO']
          : '-';
        if (this.excelData[i]['GATEWAY_TYPE'] == 'M') {
          obj1['Type'] = 'Movement';
        } else if (this.excelData[i]['GATEWAY_TYPE'] == 'A') {
          obj1['Type'] = 'Adjustment';
        } else if (this.excelData[i]['GATEWAY_TYPE'] == 'I') {
          obj1['Type'] = 'Inward';
        } else if (!this.excelData[i]['GATEWAY_TYPE']) {
          obj1['Type'] = '-';
        }
        obj1['Remarks'] = this.excelData[i]['REMARKS']
          ? this.excelData[i]['REMARKS']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Inventory Transaction Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
}
