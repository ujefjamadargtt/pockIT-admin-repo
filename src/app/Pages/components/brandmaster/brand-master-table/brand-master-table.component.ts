import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { brandMaster } from 'src/app/Pages/Models/BrandMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-brand-master-table',
  templateUrl: './brand-master-table.component.html',
  styleUrls: ['./brand-master-table.component.css'],
})
export class BrandMasterTableComponent {
  formTitle = 'Manage Brands';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfFilter2: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  branchvisible: boolean = false;
  shortvisible: boolean = false;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';

  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['BRAND_NAME', 'Brand Name'],
    ['SHORT_CODE', 'Short Code'],
    // ["STATE_NAME", "State"],
  ];
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: brandMaster = new brandMaster();

  showcolumn = [
    { label: 'Brand Name ', key: 'BRAND_NAME', visible: true },
    { label: 'Short Code', key: 'SHORT_CODE', visible: true },
    // { label: "State", key: "STATE_NAME", visible: true },
  ];

  // Edit Code 3
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
    private cookie: CookieService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.search();
  }

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  // onStateChange(): void {
  //   this.search();
  // }

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
  brandText: any = '';
  shortText: any = '';
  // nameFilter() {
  //   if (this.brandText.trim() === '') {
  //     this.searchText = '';
  //   } else if (this.brandText.length >= 3) {
  //     this.search();
  //   } else {
  //     // this.message.warning('Please enter at least 3 characters to filter.', '');
  //   }
  // }

  likeQuery1 = '';
  filteredBranchData: any[] = [];

  search(reset: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
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

    // Global Search (using searchText)
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

    if (this.brandText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BRAND_NAME LIKE '%${this.brandText.trim()}%'`;
    }

    if (this.shortText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.shortText.trim()}%'`;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    if (this.isPopular) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_POPULAR = ${this.isPopular}`;
    }
    // Combine global search query and column-specific search query
    // likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // Call API with updated search query
    // this.api
    //   .getAllBranch(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     sort,
    //     likeQuery + ''
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.loadingRecords = false;
    //       this.totalRecords = data['count'];
    //       this.dataList = data['data'];
    //     },
    //     (err) => {}
    //   );

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    const finalDataList =
      this.filteredBranchData.length > 0
        ? this.filteredBranchData
        : this.dataList;
    this.api
      .getAllBrands(
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
            this.TabId = data.body['TAB_ID'];
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
          } else if (data['status'] == 400) {
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Brand';
    this.drawerData = new brandMaster();

    // this.drawerData.STATUS = true;

    this.api.getAllBrands(1, 1, 'SEQUENCE_NO', 'desc', '' + '').subscribe(
      (data) => {
        if (data.body['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data.body['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => { }
    );

    this.drawerVisible = true;
  }

  STATE_HAS_LWF = false;
  edit(data: brandMaster): void {
    this.drawerTitle = 'Update Brand';
    this.drawerData = Object.assign({}, data);
    //
    //

    // this.drawerData.STATE_ID = this.drawerData['STATE_ID'];
    //

    // this.drawerData.CITY_ID = data.CITY_ID;
    //this.drawerData.PINCODE_ID = data.PINCODE_ID;
    //
    //

    // this.STATE_HAS_LWF = false;
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  keyup(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  brandFilterApplied = false;
  shortFilterApplied = false;
  onKeyup(event: KeyboardEvent): void {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.searchText.length === 0 && event.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
    if (this.brandText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.brandFilterApplied = true;
    } else if (
      !this.brandText &&
      this.brandText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.brandFilterApplied = false;
    }
    if (this.shortText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.shortFilterApplied = true;
    } else if (
      !this.shortText &&
      this.shortText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.shortFilterApplied = false;
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

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  visible: boolean = false;

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }

  statusFilter: string | undefined = undefined;
  isPopular: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onStatusFilterChange2(selectedStatus: string) {
    this.isPopular = selectedStatus;
    this.search(true);
  }
  reset() { }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(178, columnKey).subscribe(
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

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
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
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Brand Filter';
    // this.filterFields[1]["options"] = this.countryData;
    // this.filterFields[2]["options"] = this.stateData;
    // this.filterFields[3]["options"] = this.districtData;
    // // this.filterFields[4]["options"] = this.cityData;
    // this.filterFields[4]["options"] = this.pincodeData;

    this.drawerFilterVisible = true;

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

  // drawerflterClose(): void {
  //   this.drawerFilterVisible = false;
  //   this.loadFilters();
  // }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'BRAND_NAME',
      label: 'Brand Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Brand Name',
    },
    {
      key: 'SHORT_CODE',
      label: 'Short Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Enter Short Code',
    },
    {
      key: 'IS_POPULAR',
      label: 'Is Popular?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Is Popular',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  isDeleting: boolean = false;

  selectedFilter: string | null = null;
  // filterQuery = '';
  // applyfilter(item) {
  //   this.filterClass = 'filter-invisible';
  //   this.selectedFilter = item.ID;
  //   this.isfilterapply = true;
  //   this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
  //   this.search(true);
  // }

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
  filterloading: boolean = false;

  updateButton: any;
  updateBtn: any;
  whichbutton: any;
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

  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
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

  // Edit Code 1
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
}
