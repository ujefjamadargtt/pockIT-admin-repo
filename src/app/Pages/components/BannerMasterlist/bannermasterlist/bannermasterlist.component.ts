import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { bannermodal } from 'src/app/Pages/Models/bannermodal';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-bannermasterlist',
  templateUrl: './bannermasterlist.component.html',
  styleUrls: ['./bannermasterlist.component.css'],
})
export class BannermasterlistComponent implements OnInit {
  adminId: any;
  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  img: any;
  visible = false;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: bannermodal = new bannermodal();
  @Input()
  dataList: any[] = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  formTitle = 'Manage Banners';
  list: any = [];
  list1 = [];
  height: any;
  width: any;
  mapdrawerVisible: boolean = false;
  mapdrawerTitle!: string;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }
  columns: string[][] = [
    ['TITLE', 'TITLE'],
    ['SUB_TITLE', 'SUB_TITLE'],
    ['SUB_TITLE_1', 'SUB_TITLE_1'],
    ['SEQ_NO', 'SEQ_NO'],
  ];
  back() {
    this.router.navigate(['/masters/menu']);
  }
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
  showcloumnVisible: boolean = false;
  showcolumn = [
    { label: 'Title', key: 'TITLE', visible: true },
    { label: 'Description', key: 'SUB_TITLE', visible: true },
    { label: 'Sequence No.', key: 'SEQ_NO', visible: true },
    { label: 'Status', key: 'STATUS', visible: true },
    { label: 'Is For Shop', key: 'IS_FOR_SHOP', visible: true },
  ];
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  TitleVisible = false;
  titletext: string = '';
  istitleFilterApplied: boolean = false;
  TitlecolorVisible = false;
  titlecolortext: string = '';
  istitlecolorFilterApplied: boolean = false;
  subTitleVisible = false;
  subtitletext: string = '';
  issubtitleFilterApplied: boolean = false;
  subTitlecolorVisible = false;
  subtitlecolortext: string = '';
  issubtitlecolorFilterApplied: boolean = false;
  subTitleVisible1 = false;
  subtitletext1: string = '';
  issubtitleFilterApplied1: boolean = false;
  subTitlecolorVisible1 = false;
  subtitlecolortext1: string = '';
  subistitlecolorFilterApplied1: boolean = false;
  seqvisible = false;
  seqtext: string = '';
  isseqfilterapplied: boolean = false;
  statusFilter: string | undefined = undefined;
  isForShopFilter: string | undefined = undefined;
  isTypeShopFilter: string | undefined = undefined;
  isForFilter: string | undefined = undefined;
  isForCustTypeFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onShopFilterChange(selectedisforshop: string) {
    this.isForShopFilter = selectedisforshop;
    this.search(true);
  }
  onTypeFilterChange(selectedisfortype: string) {
    this.isTypeShopFilter = selectedisfortype;
    this.search(true);
  }
  onForFilterChange(selectedisforFor: string) {
    this.isForFilter = selectedisforFor;
    this.search(true);
  }
  onCustTypeFilterChange(selectedisforCustType: string) {
    this.isForCustTypeFilter = selectedisforCustType;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfShopFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfTypeFilter: any[] = [
    { text: 'Main Banner', value: 'M' },
    { text: 'Offer Banner', value: 'O' },
  ];
  listOfForFilter: any[] = [
    { text: 'Website', value: 'W' },
    { text: 'Mobile', value: 'M' },
  ];
  listOfCustTypeFilter: any[] = [
    { text: 'B2B', value: 'BB' },
    { text: 'B2C', value: 'BC' },
    { text: 'Both', value: 'BO' },
  ];
  reset(): void {
    this.searchText = '';
    this.titlecolortext = '';
    this.titletext = '';
    this.subtitlecolortext = '';
    this.subtitletext = '';
    this.subtitlecolortext1 = '';
    this.subtitletext1 = '';
    this.seqtext = '';
    this.search();
  }
  onKeyup(keys: any, type: string): void {
    const element = window.document.getElementById('button');
    if (
      type === 'titlee' &&
      this.titletext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search(); 
      this.istitleFilterApplied = true; 
    } else if (
      type === 'titlee' &&
      this.titletext.length === 0 &&
      keys.key === 'Backspace'
    ) {
      this.search(); 
      this.istitleFilterApplied = false; 
    }
    if (
      type == 'titlecolorr' &&
      this.titlecolortext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.istitlecolorFilterApplied = true;
    } else if (
      type == 'titlecolorr' &&
      this.titlecolortext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.istitlecolorFilterApplied = false;
    }
    if (
      type == 'subtitlee' &&
      this.subtitletext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.issubtitleFilterApplied = true;
    } else if (
      type == 'subtitlee' &&
      this.subtitletext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.issubtitleFilterApplied = false;
    }
    if (
      type == 'subtitlecolorr' &&
      this.subtitlecolortext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.issubtitlecolorFilterApplied = true;
    } else if (
      type == 'subtitlecolorr' &&
      this.subtitlecolortext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.issubtitlecolorFilterApplied = false;
    }
    if (
      type == 'subtitlee1' &&
      this.subtitletext1.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.issubtitleFilterApplied1 = true;
    } else if (
      type == 'subtitlee1' &&
      this.subtitletext1.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.issubtitleFilterApplied1 = false;
    }
    if (
      type == 'subtitlecolorr1' &&
      this.subtitlecolortext1.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.search();
      this.subistitlecolorFilterApplied1 = true;
    } else if (
      type == 'subtitlecolorr1' &&
      this.subtitlecolortext1.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.subistitlecolorFilterApplied1 = false;
    }
    if (type == 'seqno' && this.seqtext.length > 0 && keys.key === 'Enter') {
      this.search();
      this.isseqfilterapplied = true;
    } else if (
      type == 'seqno' &&
      this.seqtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isseqfilterapplied = false;
    }
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
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
  add(): void {
    this.drawerTitle = 'Add New Banner';
    this.drawerData = new bannermodal();
    this.api.getAllBannerMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => { }
    );
    this.drawerVisible = true;
  }
  adID: any;
  MAP_TYPE: any[] = [];
  keyup(event: any) {
    this.search();
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get CloseMapbanner() {
    return this.drawerClose1.bind(this);
  }
  drawerClose1(): void {
    this.search();
    this.mapdrawerVisible = false;
  }
  SPECIAL_WORD: any;
  edit(data: bannermodal): void {
    this.drawerTitle = 'Update Banner';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
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
    var sort: string;
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
    this.loadingRecords = true;
    if (this.titletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `TITLE LIKE '%${this.titletext.trim()}%'`;
      this.istitleFilterApplied = true; 
    } else {
      this.istitleFilterApplied = false; 
    }
    if (this.titlecolortext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TITLE_COLOR LIKE '%${this.titlecolortext.trim()}%'`;
      this.istitlecolorFilterApplied = true; 
    } else {
      this.istitlecolorFilterApplied = false; 
    }
    if (this.subtitletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUB_TITLE LIKE '%${this.subtitletext.trim()}%'`;
      this.issubtitleFilterApplied = true;
    } else {
      this.issubtitleFilterApplied = false;
    }
    if (this.subtitlecolortext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUB_TITLE_COLOR LIKE '%${this.subtitlecolortext.trim()}%'`;
      this.issubtitlecolorFilterApplied = true;
    } else {
      this.issubtitlecolorFilterApplied = false;
    }
    if (this.subtitletext1 !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUB_TITLE_1 LIKE '%${this.subtitletext1.trim()}%'`;
      this.issubtitleFilterApplied1 = true;
    } else {
      this.issubtitleFilterApplied1 = false;
    }
    if (this.subtitlecolortext1 !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUB_TITLE_COLOR_1 LIKE '%${this.subtitlecolortext1.trim()}%'`;
      this.subistitlecolorFilterApplied1 = true;
    } else {
      this.subistitlecolorFilterApplied1 = false;
    }
    if (this.seqtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `SEQ_NO LIKE '%${this.seqtext.trim()}%'`;
      this.isseqfilterapplied = true;
    } else {
      this.isseqfilterapplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    if (this.isForShopFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_FOR_SHOP = ${this.isForShopFilter}`;
    }
    if (this.isTypeShopFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `BANNER_TYPE = '${this.isTypeShopFilter}'`;
    }
    if (this.isForFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `BANNER_FOR = '${this.isForFilter}'`;
    }
    if (this.isForCustTypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CUSTOMER_TYPE = '${this.isForCustTypeFilter}'`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllBannerMaster(
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
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
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
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
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
  filterloading: boolean = false;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Banner Filter';
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
      key: 'TITLE',
      label: 'Title',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Title',
    },
    {
      key: 'SUB_TITLE',
      label: 'Description',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Description',
    },
    {
      key: 'SEQ_NO',
      label: 'Sequence no.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sequence no.',
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
    {
      key: 'IS_FOR_SHOP',
      label: 'Is For Shop',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Is For Shop',
    },
    {
      key: 'BANNER_TYPE',
      label: 'Banner Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'M', display: 'Main Banner' },
        { value: 'O', display: 'Offer Banner' },
      ],
      placeholder: 'Select Banner Type',
    },
    {
      key: 'BANNER_FOR',
      label: 'Banner For',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'W', display: 'Website' },
        { value: 'M', display: 'Mobile' },
      ],
      placeholder: 'Select Banner For',
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
        { value: 'BB', display: 'B2B' },
        { value: 'BC', display: 'B2C' },
        { value: 'BO', display: 'Both' },
      ],
      placeholder: 'Select Customer Type',
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
  selectedQuery: string = '';
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
    this.selectedQuery = '';
  }
  isSpinning = false;
  ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'BannerImages/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
}