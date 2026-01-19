import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { warehouselocation } from 'src/app/Pages/Models/warehouselocations';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-warehouselocationmaster',
  templateUrl: './warehouselocationmaster.component.html',
  styleUrls: ['./warehouselocationmaster.component.css'],
})
export class WarehouselocationmasterComponent {
  formTitle = 'Manage Warehouse Locations';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  itemNameVisible: boolean = false;
  inventorycategoryvisible: boolean = false;
  unitsvisible: boolean = false;
  qtyvisible: boolean = false;
  subcategorynametext = '';
  subcategorynamevisible: boolean = false;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['WAREHOUSE_NAME', 'Warehouse'],
    ['LOCATION_NAME', 'Location Name'],
    ['SHORT_CODE', 'Short Code'],
    ['LOCATION_DESCRIPTION', 'Description'],
  ];
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: warehouselocation = new warehouselocation();
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  itemNametext: string = '';
  locationtext: string = '';
  quantitytext: string = '';
  isLocationFilterApplied = false;
  iswarehouseFilterApplied = false;
  isshortcodeFilterApplied = false;
  isdescriptionFilterApplied = false;
  selectedcategories: any = [];
  Warehouselist: any = [];
  selectedDate: any;
  shortCodeVisible: boolean = false;
  discriptionVisible: boolean = false;
  locationNameVisible: boolean = false;
  warehouseVisible: boolean = false;
  selectedWarehouse: any;
  locationNameText: string = '';
  shortCodeText: string = '';
  descriptionFilter: string = '';
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  columns1: { label: string; value: string }[] = [
    { label: 'Warehouse', value: 'WAREHOUSE_ID' },
    { label: 'Location Name', value: 'LOCATION_NAME' },
    { label: 'Short Code', value: 'SHORT_CODE' },
    { label: 'Location Description', value: 'LOCATION_DESCRIPTION' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  showcolumn = [
    { label: 'Warehouse', key: 'WAREHOUSE', visible: true },
    { label: 'Location Name', key: 'LOCATION_NAME', visible: true },
    { label: 'Short Code', key: 'SHORT_CODE', visible: true },
    {
      label: 'Location Description',
      key: 'LOCATION_DESCRIPTION',
      visible: true,
    },
    { label: 'Status', key: 'IS_ACTIVE', visible: true },
  ];
  navigateToMastersMenu(): void {
    this.router.navigate(['/masters/menu']);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.locationNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isLocationFilterApplied = true;
    } else if (this.locationNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isLocationFilterApplied = false;
    }
    if (this.shortCodeText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isshortcodeFilterApplied = true;
    } else if (this.shortCodeText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isshortcodeFilterApplied = false;
    }
    if (this.descriptionFilter.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isdescriptionFilterApplied = true;
    } else if (
      this.descriptionFilter.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isdescriptionFilterApplied = false;
    }
  }
  onWarehouseChange(): void {
    if (this.selectedWarehouse?.length) {
      this.search();
      this.iswarehouseFilterApplied = true; 
    } else {
      this.search();
      this.iswarehouseFilterApplied = false; 
    }
  }
  locationNameFilter() {
    if (this.locationNameText.trim() === '') {
      this.searchText = ''; 
    } else if (this.locationNameText.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onshortcodeFilter() {
    if (this.locationNameText.trim() === '') {
      this.searchText = ''; 
    } else if (this.locationNameText.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  checkColumnselect(a: any) { }
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.getWarehouses();
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  getWarehouses() {
    this.api
      .getWarehouses(0, 0, 'id', 'desc', " AND STATUS='A'")
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.Warehouselist = data['data'];
        } else {
          this.Warehouselist = [];
        }
      });
  }
  sort(params: NzTableQueryParams): void {
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
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number;
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
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
    if (this.selectedWarehouse?.length) {
      const categories = this.selectedWarehouse.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `WAREHOUSE_ID IN (${categories})`;
    }
    if (this.locationNameText?.trim()) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LOCATION_NAME LIKE '%${this.locationNameText.trim()}%'`;
    }
    if (this.shortCodeText?.trim()) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.shortCodeText.trim()}%'`;
    }
    if (this.descriptionFilter?.trim()) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LOCATION_DESCRIPTION LIKE '%${this.descriptionFilter.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getWarehousesLocation(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery + likeQuery + ''
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Failed to get warehouse location Records', '');
          }
        },
        (err) => {
          this.dataList = [];
          this.loadingRecords = false;
          this.message.error('Failed to get Warehouse location Records', '');
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New Warehouse Location';
    this.drawerData = new warehouselocation();
    this.drawerVisible = true;
  }
  edit(data: warehouselocation): void {
    this.drawerTitle = 'Update Warehouse Location';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  keyup(event) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.searchText.length === 0 && event.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
  }
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset() { }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'Warehouse Location Filter';
    this.applyCondition = '';
    this.drawerFilterVisible = true;
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
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
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Warehouse Name',
    },
    {
      key: 'LOCATION_NAME',
      label: 'Location Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Location Name',
    },
    {
      key: 'SHORT_CODE',
      label: 'Short Code',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Short Code',
    },
    {
      key: 'LOCATION_DESCRIPTION',
      label: 'Location Description',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Location Description',
    },
    {
      key: 'IS_ACTIVE',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; 
        switch (comparator) {
          case 'Contains':
            return `${field} LIKE '%${value}%'`;
          case 'Does Not Contains':
            return `${field} NOT LIKE '%${value}%'`;
          case 'Starts With':
            return `${field} LIKE '${value}%'`;
          case 'Ends With':
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });
      const nestedGroups = (group.groups || []).map(processGroup);
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };
    return filterGroups.map(processGroup).join(' AND '); 
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  oldFilter: any[] = [];
  isModalVisible = false; 
  selectedQuery: string = ''; 
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  filterloading: boolean = false;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        '',
        '',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) 
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
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
  deleteItem(item: any): void {
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          this.filterloading = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';
          this.loadFilters();
          this.filterQuery = '';
          this.search(true);
        } else {
          this.message.error('Failed to delete filter.', '');
          this.filterloading = false;
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
    this.search();
  }
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
}
