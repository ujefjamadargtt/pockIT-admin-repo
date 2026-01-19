import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-stock-management-reports',
  templateUrl: './stock-management-reports.component.html',
  styleUrls: ['./stock-management-reports.component.css'],
})
export class StockManagementReportsComponent implements OnInit {
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
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }
  formTitle = 'Warehouse Wise Item Stock Details';
  excelData: any = [];
  exportLoading: boolean = false;
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ITEM_ID';
  chapters: any = [];
  isLoading = true;
  loadingRecords = false;
  filteredUnitData: any[] = [];
  filterQuery1: any = '';
  dataList: any = [];
  filterQuery: string = '';
  savedFilters: any[] = [];
  TabId: number;
  isDeleting: boolean = false;
  drawerTitle!: string;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  totalRecords = 1;
  columns: string[][] = [
    ['ACTUAL_UNIT_NAME', 'ACTUAL_UNIT_NAME'],
    ['ITEM_NAME', 'ITEM_NAME'],
    ['VARIANT_NAME', 'VARIANT_NAME'],
    ['WAREHOUSE_NAME', 'WAREHOUSE_NAME'],
    ['WAREHOUSE_MANAGER_NAME', 'WAREHOUSE_MANAGER_NAME'],
  ];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.getTeritory();
    this.getteritorydata();
  }
  territoryData: any = [];
  territoryData1: any = [];
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  getTeritory() {
    this.api.getTeritory(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.territoryData = data['data'];
          this.TabId = data['TAB_ID'];
        } else {
          this.territoryData = [];
          this.message.error('Failed To Get Territory Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
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
  territoryVisible = false;
  selectedterritory: any[] = [];
  isterritorynameFilterApplied = false;
  onTerritoryChange(): void {
    if (this.selectedterritory?.length) {
      this.search();
      this.isterritorynameFilterApplied = true;
    } else {
      this.search();
      this.isterritorynameFilterApplied = false;
    }
  }
  managertext: string = '';
  ismangerfilt: boolean = false;
  managervisible = false;
  warehousename: string = '';
  currentstock: string = '';
  iswarehousename: boolean = false;
  iscurrentstock: boolean = false;
  warehousenameisible = false;
  currentstocknameisible = false;
  itemtext: string = '';
  itemtextvisible = false;
  isitemFilterApplied: boolean = false;
  VARIANT_NAMEtext: string = '';
  VARIANT_NAMEtextvisible = false;
  isVARIANT_NAMEFilterApplied: boolean = false;
  serialtext: string = '';
  serialtextvisible = false;
  isserialFilterApplied: boolean = false;
  BATCHtext: string = '';
  BATCHtextvisible = false;
  isBATCHFilterApplied: boolean = false;
  unittext: string = '';
  unittextvisible = false;
  isunitFilterApplied: boolean = false;
  scheduleDateVisible = false;
  isscheduleDateFilterApplied: boolean = false;
  reset(): void {
    this.searchText = '';
    this.warehousename = '';
    this.managertext = '';
    this.itemtext = '';
    this.VARIANT_NAMEtext = '';
    this.serialtext = '';
    this.BATCHtext = '';
    this.unittext = '';
    this.search();
  }
  listOfFilter: any[] = [
    { text: 'Both Sellable & Technician', value: 'B' },
    { text: 'Sellable Inventory', value: 'P' },
    { text: 'Technician Parts Only', value: 'S' },
  ];
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter1: any[] = [
    { text: 'None', value: 'N' },
    { text: 'Serial No. Wise', value: 'S' },
    { text: 'Batch Wise', value: 'B' },
  ];
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  onKeyup(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.warehousename.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iswarehousename = true;
    } else if (this.warehousename.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iswarehousename = false;
    }
    if (this.currentstock.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscurrentstock = true;
    } else if (this.currentstock.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscurrentstock = false;
    }
    if (this.managertext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismangerfilt = true;
    } else if (this.managertext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismangerfilt = false;
    }
    if (this.itemtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isitemFilterApplied = true;
    } else if (this.itemtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isitemFilterApplied = false;
    }
    if (this.VARIANT_NAMEtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isVARIANT_NAMEFilterApplied = true;
    } else if (this.VARIANT_NAMEtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isVARIANT_NAMEFilterApplied = false;
    }
    if (this.serialtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isserialFilterApplied = true;
    } else if (this.serialtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isserialFilterApplied = false;
    }
    if (this.BATCHtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isBATCHFilterApplied = true;
    } else if (this.BATCHtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isBATCHFilterApplied = false;
    }
    if (this.unittext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isunitFilterApplied = true;
    } else if (this.unittext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isunitFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  filterData: any;
  currentClientId = 1;
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
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ITEM_ID';
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
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.warehousename !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_NAME LIKE '%${this.warehousename.trim()}%'`;
      this.iswarehousename = true;
    } else {
      this.iswarehousename = false;
    }
    if (this.currentstock !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CURRENT_STOCK LIKE '%${this.currentstock.trim()}%'`;
      this.iscurrentstock = true;
    } else {
      this.iscurrentstock = false;
    }
    if (this.managertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_MANAGER_NAME LIKE '%${this.managertext.trim()}%'`;
      this.ismangerfilt = true;
    } else {
      this.ismangerfilt = false;
    }
    if (this.itemtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ITEM_NAME LIKE '%${this.itemtext.trim()}%'`;
      this.isitemFilterApplied = true;
    } else {
      this.isitemFilterApplied = false;
    }
    if (this.VARIANT_NAMEtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `VARIANT_NAME LIKE '%${this.VARIANT_NAMEtext.trim()}%'`;
      this.isVARIANT_NAMEFilterApplied = true;
    } else {
      this.isVARIANT_NAMEFilterApplied = false;
    }
    if (this.serialtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERIAL_NO LIKE '%${this.serialtext.trim()}%'`;
      this.isserialFilterApplied = true;
    } else {
      this.isserialFilterApplied = false;
    }
    if (this.BATCHtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BATCH_NO LIKE '%${this.BATCHtext.trim()}%'`;
      this.isBATCHFilterApplied = true;
    } else {
      this.isBATCHFilterApplied = false;
    }
    if (this.unittext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ACTUAL_UNIT_NAME LIKE '%${this.unittext.trim()}%'`;
      this.isunitFilterApplied = true;
    } else {
      this.isunitFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INVENTORY_TYPE = '${this.statusFilter}'`;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INVENTORY_TRACKING_TYPE = '${this.statusFilter1}'`;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0];
        const formattedEnd = new Date(end).toISOString().split('T')[0];
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
      this.isscheduleDateFilterApplied = true;
    } else {
      this.isscheduleDateFilterApplied = false;
    }
    if (this.selectedterritory.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TERRITORY_ID IN (${this.selectedterritory.join(',')})`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    if (exportInExcel == false) {
      this.api
        .getStockMgtReportReport(
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
      this.loadingRecords = true;
      this.api
        .getStockMgtReportReport(
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
    const sortField = (currentSort && currentSort.key) || 'ITEM_ID';
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
  openfilter() {
    this.drawerTitle = 'Warehouse Wise Item Stock Details Filter';
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
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Warehouse Name'] = this.excelData[i]['WAREHOUSE_NAME']
          ? this.excelData[i]['WAREHOUSE_NAME']
          : '-';
        obj1['Warehouse Manager Name'] = this.excelData[i][
          'WAREHOUSE_MANAGER_NAME'
        ]
          ? this.excelData[i]['WAREHOUSE_MANAGER_NAME']
          : '-';
        obj1['Item Name'] = this.excelData[i]['ITEM_NAME']
          ? this.excelData[i]['ITEM_NAME']
          : '-';
        obj1['Variant Name'] = this.excelData[i]['VARIANT_NAME']
          ? this.excelData[i]['VARIANT_NAME']
          : '-';
        if (this.excelData[i]['INVENTORY_TYPE'] === 'B') {
          obj1['Inventory Type'] = 'Both Sellable & Technician Parts';
        } else if (this.excelData[i]['INVENTORY_TYPE'] === 'P') {
          obj1['Inventory Type'] = 'Sellable Inventor';
        } else if (this.excelData[i]['INVENTORY_TYPE'] === 'S') {
          obj1['Inventory Type'] = 'Technician Parts Only';
        } else {
          obj1['Inventory Type'] = '-';
        }
        if (this.excelData[i]['INVENTORY_TRACKING_TYPE'] === 'N') {
          obj1['Tracking Type'] = 'None';
        } else if (this.excelData[i]['INVENTORY_TRACKING_TYPE'] === 'S') {
          obj1['Tracking Type'] = 'Serial No. Wise';
        } else if (this.excelData[i]['INVENTORY_TRACKING_TYPE'] === 'B') {
          obj1['Tracking Type'] = 'Batch Wise';
        } else {
          obj1['Tracking Type'] = '-';
        }
        obj1['Unit Name'] = this.excelData[i]['ACTUAL_UNIT_NAME']
          ? this.excelData[i]['ACTUAL_UNIT_NAME']
          : '-';
        obj1['Alert Stock Level'] = this.excelData[i]['ALERT_STOCK_LEVEL']
          ? this.excelData[i]['ALERT_STOCK_LEVEL']
          : '-';
        obj1['Reorder Stock Level'] = this.excelData[i]['REORDER_STOCK_LEVEL']
          ? this.excelData[i]['REORDER_STOCK_LEVEL']
          : '-';
        obj1['Average Stock Level'] = this.excelData[i]['AVG_LEVEL']
          ? this.excelData[i]['AVG_LEVEL']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Warehouse Wise Item Stock Details Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('No data found', '');
    }
  }
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  importInExcel() {
    this.search(true, true);
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
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
      placeholder: 'Enter Warehouse Name',
    },
    {
      key: 'WAREHOUSE_MANAGER_NAME',
      label: 'Warehouse Manager Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Warehouse Manager Name',
    },
    {
      key: 'ITEM_NAME',
      label: 'Item Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Item Name',
    },
    {
      key: 'VARIANT_NAME',
      label: 'Varient Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Varient Name',
    },
    {
      key: 'INVENTORY_TYPE',
      label: 'Inventory Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'B', display: 'Both Sellable & Technician' },
        { value: 'P', display: 'Sellable Inventory' },
        { value: 'S', display: 'Technician Parts Only' },
      ],
      placeholder: 'Select Inventory Type',
    },
    {
      key: 'INVENTORY_TRACKING_TYPE',
      label: 'Inventory Tracking Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'N', display: 'None' },
        { value: 'S', display: 'Serial No. Wise' },
        { value: 'B', display: 'Batch Wise' },
      ],
      placeholder: 'Select Inventory Tracking Type',
    },
    {
      key: 'ACTUAL_UNIT_NAME',
      label: 'Unit Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Unit Name',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isscheduleDateFilterApplied = true;
      }
    } else {
      this.StartDate = null;
      this.search();
      this.isscheduleDateFilterApplied = false;
    }
  }
}