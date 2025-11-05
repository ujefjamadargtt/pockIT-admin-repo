import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { smsmaster } from 'src/app/Pages/Models/smsmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-smses',
  templateUrl: './smses.component.html',
  styleUrls: ['./smses.component.css'],
})
export class SmsesComponent {
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';

  formTitle = 'Manage SMS Templates';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  startValue: any;
  endValue: any;
  TYPE = '';

  columns: string[][] = [
    ['TEMPLATE_NAME', 'Name'],
    ['CATEGORY', 'Category'],
    ['LANGUAGE_CODE_NAME', 'lANGUAGE'],
  ];

  //drawer Variables
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: smsmaster = new smsmaster();
  loadingForm = false;
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  likeQuery: any = '';
  STATUS = '';
  visible = false;
  isfilterapply: boolean = false;

  isnameFilterApplied: boolean = false;
  name: string = '';
  namevisible = false;
  iscategoryFilterApplied = false;
  categoryvisible: boolean = false;
  selectedCategories: any[] = [];

  islanguageFilterApplied = false;
  languagevisible: boolean = false;
  selectedLanguages: any[] = [];

  statusFilter: string | undefined = undefined;
  isDeleting: boolean = false;

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  templatestatusFilter: string | undefined = undefined;
  listoftemplatestatus: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Approved', value: 'A' },
    { text: 'Rejected', value: 'R' },
  ];

  CATEGORY = [
    { ID: 'Alerts', NAME: 'Alerts' },
    { ID: 'Transaction', NAME: 'Transaction' },
    { ID: 'Reminders', NAME: 'Reminders' },
    { ID: 'Promotions', NAME: 'Promotions' },
    { ID: 'Updates', NAME: 'Updates' },
    { ID: 'Feedback', NAME: 'Feedback' },
    { ID: 'Notification', NAME: 'Notification' },
    { ID: 'Onboarding', NAME: 'Onboarding' },
    { ID: 'Loyalty', NAME: 'Loyalty' },
    { ID: 'Security', NAME: 'Security' },
    { ID: 'Other', NAME: 'Other' },
  ];

  LANGUAGE_CODE = [
    { ID: 'en', NAME: 'English' },
    { ID: 'en_US', NAME: 'English(US)' },
    { ID: 'en_UK', NAME: 'English(UK)' },
    { ID: 'mr', NAME: 'Marathi' },
    { ID: 'hi', NAME: 'Hindi' },
    { ID: 'ja', NAME: 'Japanese' },
    { ID: 'ko', NAME: 'Korean' },
    { ID: 'ru', NAME: 'Russian' },
    { ID: 'de', NAME: 'German' },
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

  ngOnInit() {
    // this.search();
    this.getLanguageData();
    this.getLanguageData1();
  }
  LanguageData1: any = [];
  getLanguageData() {
    this.api
      .getLanguageData(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.LanguageData1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  LanguageData: any = [];

  getLanguageData1() {
    this.api.getLanguageData(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.LanguageData = data['data'];
        } else {
          this.LanguageData = [];
          this.message.error('Failed To Get Language Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  columns1: { label: string; value: string }[] = [
    { label: 'Template Name', value: 'TEMPLATE_NAME' },
    { label: 'Category', value: 'CATEGORY' },
    { label: 'Language', value: 'LANGUAGE_CODE' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

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
    // this.search(true);
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
      // Clear the filter and display all data
      this.searchText = ''; // Clear global search if any
      // this.onKeyup();
    } else if (this.name.length >= 3) {
      // Apply the filter for CATEGORY_NAME
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
  // Basic Methods
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

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onTemplateStatusFilterChange(selectedStatus: string) {
    this.templatestatusFilter = selectedStatus;
    this.search(true);
  }

  onCategoryChange(): void {
    if (this.selectedCategories?.length) {
      this.search();
      this.iscategoryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.iscategoryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onlanguageChange(): void {
    if (this.selectedLanguages?.length) {
      this.search();
      this.islanguageFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.islanguageFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  search(reset: boolean = false) {
    // this.loadingRecords = true;
    // if (reset) {
    //   this.pageIndex = 1;
    // }

    // var sort: string;
    // try {
    //   sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    // } catch (error) {
    //   sort = '';
    // }
    // var likeQuery = '';
    // if (this.TYPE != '' && this.STATUS != '') {
    //   this.filterQuery = '?category=' + this.TYPE + '&status=' + this.STATUS;
    // } else if (this.TYPE != '' && this.STATUS == '') {
    //   this.filterQuery = '?category=' + this.TYPE;
    // } else if (this.TYPE == '' && this.STATUS != '') {
    //   this.filterQuery = '?status=' + this.STATUS;
    // }
    // if (this.TYPE == '' && this.STATUS == '' && this.searchText != '') {
    //   likeQuery = '?name=' + this.searchText;
    // } else if (this.searchText != '') {
    //   likeQuery = '&name=' + this.searchText;
    // }

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
    this.loadingRecords = true;

    // name Filter
    if (this.name !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TEMPLATE_NAME LIKE '%${this.name.trim()}%'`;
    }

    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      // Wrap each value in single quotes for SQL syntax
      const formattedValues = this.selectedCategories
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `CATEGORY IN (${formattedValues})`;
    }

    // if (
    //   this.selectedLanguages.length > 0
    // ) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   // Wrap each value in single quotes for SQL syntax
    //   const formattedValues = this.selectedLanguages
    //     .map((sep: string) => `'${sep}'`)
    //     .join(',');
    //   likeQuery += `LANGUAGE_CODE IN (${formattedValues})`;
    // }

    // Country Filter
    if (this.selectedLanguages.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `LANGUAGE_CODE IN (${this.selectedLanguages.join(',')})`; // Update with actual field name in the DB
    }

    // templateStatus Filter
    if (this.templatestatusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TEMPLATE_STATUS = '${this.templatestatusFilter}'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // this.api
    //   .getSmsTemplates(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     sort,
    //     this.filterQuery + likeQuery
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.loadingRecords = false;
    //       this.totalRecords = data["count"];
    //       this.dataList = data["data"];
    //     },
    //     (err) => {
    //       if (err["ok"] == false) this.message.error("Server Not Found", "");
    //     }
    //   );

    this.api
      .getSmsTemplates(
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
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add  SMS Template';
    this.drawerData = new smsmaster();
    //this.loadForms()
    this.drawerVisible = true;
  }
  drawerVisible1: boolean = false;
  drawerTitle1;
  edit(data: any): void {
    this.drawerTitle = 'Update  SMS Template';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.BODY_VALUES = JSON.parse(this.drawerData.BODY_VALUES);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }

  selectedFilter: string | null = null;

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
    // this.search(false);
  }

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  // userId = sessionStorage.getItem("userId");
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  // isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = "";
  // filterClass: string = "filter-invisible";
  savedFilters: any[] = [];

  // new filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

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
    //  

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
            //  
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

  orderData: any;
  filterdrawerTitle!: string;
  // drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'SMS Template Filter';
    // this.applyCondition = "";
    this.filterFields[2]['options'] = this.LanguageData1;

    this.drawerFilterVisible = true;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

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
  }

  updateButton: any;
  updateBtn: any;
  whichbutton: any;
  drawerfilterClose(buttontype, updateButton): void {
    //  

    this.drawerFilterVisible = false;
    this.loadFilters();

    this.whichbutton = buttontype;
    this.updateBtn = updateButton;

    if (buttontype == 'SA') {
      //  
      //  

      this.loadFilters();
    } else if (buttontype == 'SC') {
      //  
      this.loadFilters();
    }
  }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'TEMPLATE_NAME',
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
        { value: 'Alerts', display: 'Alerts' },
        { value: 'Transaction', display: 'Transaction' },
        { value: 'Reminders', display: 'Reminders' },
        { value: 'Promotions', display: 'Promotions' },
        { value: 'Updates', display: 'Updates' },
        { value: 'Feedback', display: 'Feedback' },
        { value: 'Notification', display: 'Notification' },
        { value: 'Onboarding', display: 'Onboarding' },
        { value: 'Loyalty', display: 'Loyalty' },
        { value: 'Security', display: 'Security' },
        { value: 'Other', display: 'Other' },
      ],
      placeholder: 'Select Category',
    },
    {
      key: 'LANGUAGE_CODE',
      label: 'Language',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
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
        { value: 'R', display: 'hRejected' },
      ],
      placeholder: 'Select Template Status',
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

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings

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

      // Combine conditions and nested group queries using the group's operator
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };

    return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with 'AND'
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

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

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[2]['options'] = this.LanguageData1;

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
