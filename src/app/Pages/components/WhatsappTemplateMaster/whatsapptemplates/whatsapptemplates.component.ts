import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { whatsapptemplate } from 'src/app/Pages/Models/whatsapptemplate';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-whatsapptemplates',
  templateUrl: './whatsapptemplates.component.html',
  styleUrls: ['./whatsapptemplates.component.css'],
})
export class WhatsapptemplatesComponent {
  isFilterApplied: any = 'default';
  formTitle = 'Manage WhatsApp Templates';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;
  dataList = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  startValue: any;
  endValue: any;
  TYPE = '';
  categoryvisible: boolean = false;
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: whatsapptemplate = new whatsapptemplate();
  loadingForm = false;
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  likeQuery: any = '';
  STATUS = '';
  isnameFilterApplied: boolean = false;
  name: string = '';
  namevisible = false;
  iscategoryFilterApplied = false;
  selectedCategories: any[] = [];
  islanguageFilterApplied = false;
  languagevisible: boolean = false;
  selectedLanguages: any[] = [];
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
    private datePipe: DatePipe,
    private router: Router
  ) { }
  ngOnInit() {
    this.search();
  }
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['CATEGORY', 'CATEGORY'],
    ['LANGUAGES', 'LANGUAGES'],
  ];
  columns1: { label: string; value: string }[] = [
    { label: 'Template Name', value: 'NAME' },
    { label: 'Category', value: 'CATEGORY' },
    { label: 'Language', value: 'LANGUAGES' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  CATEGORY = [
    { ID: 'UTILITY', NAME: 'UTILITY' },
    { ID: 'MARKETING', NAME: 'MARKETING' },
  ];
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  statusFilter: string | undefined = undefined;
  languageFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  filteredWhatsappData: any[] = [];
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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
    if (this.name !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.name.trim()}%'`;
    }
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectedCategories
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `CATEGORY IN (${formattedValues})`;
    }
    if (this.selectedLanguages.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectedLanguages
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `LANGUAGES IN (${formattedValues})`;
    }
    if (this.templatestatusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TEMPLATE_STATUS = '${this.templatestatusFilter}'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllTemplates(
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
            this.dataList = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
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
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add(): void {
    this.drawerTitle = 'New Whatsapp Template';
    this.drawerData = new whatsapptemplate();
    this.drawerVisible = true;
  }
  drawerVisible1: boolean = false;
  drawerTitle1;
  edit(data: any): void {
    this.drawerTitle = 'Update New Template';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible1 = true;
    this.drawerTitle1 = 'Template Preview';
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.TYPE = '';
    this.STATUS = '';
    this.filterQuery = '';
    this.search();
  }
  applyFilter() {
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    var sort: string;
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.filterQuery = '';
    this.search();
    this.filterClass = 'filter-invisible';
  }
  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  disabledDate1 = (endValue: Date): any => {
    if (this.startValue != null) {
      if (!endValue) {
        return false;
      }
      var modulePreviousDate = new Date(this.startValue);
      modulePreviousDate.setDate(modulePreviousDate.getDate() + -1);
      return endValue <= new Date(modulePreviousDate);
    }
  };
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onTemplateStatusFilterChange(selectedStatus: string) {
    this.templatestatusFilter = selectedStatus;
    this.search(true);
  }
  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.name.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.name.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.name.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.name.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
  }
  nameFilter() {
    if (this.name.trim() === '') {
      this.searchText = ''; 
    } else if (this.name.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  reset(): void {
    this.searchText = '';
    this.name = '';
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  templatestatusFilter: string | undefined = undefined;
  listoftemplatestatus: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Approved', value: 'A' },
    { text: 'Rejected', value: 'R' },
  ];
  LANGUAGES = [
    { ID: 'en', NAME: 'English' },
    { ID: 'en_US', NAME: 'English(US)' },
    { ID: 'en_UK', NAME: 'English(UK)' },
    { ID: 'mr', NAME: 'Marathi' },
    { ID: 'hi', NAME: 'Hindi' },
  ];
  filterdrawerTitle!: string;
  applyCondition: any;
  onCategoryChange(): void {
    if (this.selectedCategories?.length) {
      this.search();
      this.iscategoryFilterApplied = true; 
    } else {
      this.search();
      this.iscategoryFilterApplied = false; 
    }
  }
  onlanguageChange(): void {
    if (this.selectedLanguages?.length) {
      this.search();
      this.islanguageFilterApplied = true;
    } else {
      this.search();
      this.islanguageFilterApplied = false;
    }
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
    this.drawerTitle = 'WhatsApp Template Filter';
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
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Template Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Template Name',
    },
    {
      key: 'CATEGORY',
      label: 'Category',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'UTILITY', display: 'UTILITY' },
        { value: 'MARKETING', display: 'MARKETING' },
      ],
      placeholder: 'Select Category',
    },
    {
      key: 'LANGUAGES',
      label: 'Language',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'en', display: 'English' },
        { value: 'en_US', display: 'English(US)' },
        { value: 'en_UK', display: 'English(UK)' },
        { value: 'mr', display: 'Marathi' },
        { value: 'hi', display: 'Hindi' },
      ],
      placeholder: 'Select Language',
    },
    {
      key: 'TEMPLATE_STATUS',
      label: 'Template Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: 'A', display: 'Approved' },
        { value: 'R', display: 'Rejected' },
      ],
      placeholder: 'Select Template Status',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
}
