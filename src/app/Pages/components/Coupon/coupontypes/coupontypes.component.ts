import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Coupontype } from 'src/app/Support/Models/coupontype';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coupontypes',
  templateUrl: './coupontypes.component.html',
  styleUrls: ['./coupontypes.component.css'],
})
export class CoupontypesComponent implements OnInit {
  formTitle = 'Manage Coupon Types';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  isFilterApplied: string = 'default';
  logtext: string = '';
  CouponTypetext: string = '';
  couponTypeVisible: boolean = false;
  isCouponTypeFilterApplied = false;
  filterloading: boolean = false;
  statusFilter: string | undefined = undefined;
  columns: string[][] = [['NAME', 'Name']];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  filterGroups: any[] = [
    {
      operator: "AND",
      conditions: [
        {
          condition: {
            field: "",
            comparator: "",
            value: "",
          },
          operator: "AND",
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
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Coupontype = new Coupontype();
  constructor(
    public api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() { }
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
  onKeyDownEvent(event) {
    this.search(true);
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
    if (this.CouponTypetext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.CouponTypetext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById("button");
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  back() {
    this.router.navigate(["/masters/menu"]);
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
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
    if (this.CouponTypetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.CouponTypetext.trim()}%'`;
      this.isCouponTypeFilterApplied = true;
    } else {
      this.isCouponTypeFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllCoupontypes(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.TabId = data["TAB_ID"];
          this.dataList = data['data'];
        },
        (err) => { }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New Coupon Type';
    this.drawerData = new Coupontype();
    this.drawerVisible = true;
  }
  edit(data: Coupontype): void {
    this.drawerTitle = 'Update Coupon Type';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  reset(): void {
    this.searchText = '';
    this.CouponTypetext = '';
    this.search();
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem("userId");
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : "";
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = "";
  filterClass: string = "filter-invisible";
  savedFilters: any[] = [];
  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
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
                ;
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
          else {
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  filterData: any;
  currentClientId = 1
  openfilter() {
    this.drawerTitle = 'Coupon Types Filter';
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
  filterFields: any[] = [
    {
      key: "NAME",
      label: "Coupon Type",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Coupon Type",
    },
    {
      key: "IS_ACTIVE",
      label: "Status",
      type: "select",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: "1", display: "Active" },
        { value: "0", display: "Inactive" },
      ],
      placeholder: "Select Status",
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  isModalVisible = false;
  selectedQuery: string = "";
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
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
    this.selectedQuery = "";
  }
}