import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AppLanguageData } from 'src/app/Pages/Models/ApplanguageMaster';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-app-language-master',
  templateUrl: './app-language-master.component.html',
  styleUrls: ['./app-language-master.component.css'],
})
export class AppLanguageMasterComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  formTitle = 'Manage App Languages';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Applanguage: any[] = [];
  columns: string[][] = [['NAME', 'NAME']];
  drawerApplanguageMappingVisible = false;
  drawerTitle = 'New App Language';
  drawerTitle1 = 'Language Translation';
  drawerData: AppLanguageData = new AppLanguageData();
  drawerData1: any;
  drawervisible = false;
  drawervisible1 = false;
  isnameFilterApplied: boolean = false;
  isshortcodeFilterApplied: boolean = false;
  isseqnoFilterApplied: boolean = false;
  AppLanguageText: string = '';
  AppLanguagevisible = false;
  ShortCodetext: string = '';
  ShortCodevisible = false;
  SeqenceVisible = false;
  Sequenecetext: string = '';
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
  filterData: any;
  whichbutton: any;
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
  reset(): void {
    this.searchText = '';
    this.AppLanguageText = '';
    this.ShortCodetext = '';
    this.Sequenecetext = '';
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  keyup(keys) {
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
  public commonFunction = new CommonFunctionService();
  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.AppLanguageText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.AppLanguageText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.ShortCodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isshortcodeFilterApplied = true;
    } else if (this.ShortCodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isshortcodeFilterApplied = false;
    }
    if (this.Sequenecetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isseqnoFilterApplied = true;
    } else if (this.Sequenecetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseqnoFilterApplied = false;
    }
  }
  nameFilter() {
    if (this.AppLanguageText.trim() === '') {
      this.searchText = '';
    } else if (this.AppLanguageText.length >= 3) {
      this.search();
    } else {
    }
  }
  shortcodeFilter() {
    if (this.ShortCodetext.trim() === '') {
      this.searchText = '';
    } else if (this.ShortCodetext.length > 0) {
      this.search();
    } else {
    }
  }
  seqnoFilter() {
    if (this.Sequenecetext.trim() === '') {
      this.searchText = '';
    } else if (this.Sequenecetext.length > 0) {
      this.search();
    } else {
    }
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
    if (this.AppLanguageText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.AppLanguageText.trim()}%'`;
    }
    if (this.ShortCodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.ShortCodetext.trim()}%'`;
    }
    if (this.Sequenecetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.Sequenecetext.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAppLanguageData(
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
            this.Applanguage = data.body['data'];
            this.TabId = data.body['TAB_ID'];
          } else if (data['status'] == 400) {
            this.loadingRecords = false;
            this.Applanguage = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.Applanguage = [];
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
  }
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
  drawerClose(): void {
    this.search();
    this.drawervisible = false;
  }
  drawerClose1(): void {
    this.search();
    this.drawervisible1 = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  close() {
    this.drawervisible = false;
  }
  close1() {
    this.drawervisible1 = false;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update App Language';
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
  }
  edit1(data: any): void {
    this.drawerTitle1 = 'Language Translation';
    this.drawerData1 = Object.assign({}, data);
    this.drawervisible1 = true;
  }
  add(): void {
    this.drawerTitle = 'Add New Language';
    this.drawerData = new AppLanguageData();
    this.api.getAppLanguageData(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['status'] == 200) {
          if (data.body['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data.body['data'][0]['SEQ_NO'] + 1;
          }
          this.drawervisible = true;
        } else {
          this.message.error('Server Not Found.', '');
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
  dataList: any = [];
  visible = false;
  filterQuery: string = '';
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'App Language Name', value: 'NAME' },
    { label: 'Short Code', value: 'SHORT_CODE' },
    { label: 'App Language Type', value: 'APPLICATION_TYPE' },
    { label: 'Sequence No.', value: 'SEQ_NO' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfFilter1: any[] = [
    { text: 'Technician App', value: 'T' },
    { text: 'Web App', value: 'W' },
  ];
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
    this.drawerTitle = 'App Language Filter';
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
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'App Language Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter App Language Name',
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
      placeholder: 'Enter Short Code',
    },
    {
      key: 'SEQ_NO',
      label: 'Sequence Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sequence Number',
    },
    {
      key: 'IS_ACTIVE',
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
  isLoading = false;
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
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number; 
  filterloading: boolean = false;
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
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
          }
          else {
            this.isfilterapply = true
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
  updateButton: any;
  updateBtn: any;
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
    this.drawerTitle = 'Edit FIlter';
    this.drawerFilterVisible = true;
  }
}
