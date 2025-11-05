import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { emailtemplate } from 'src/app/Pages/Models/emailtemplate';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.css'],
})
export class EmailTemplatesComponent {
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';

  formTitle = 'Manage Email Templates';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  startValue: any;
  endValue: any;
  TYPE = '';

  columns1: string[][] = [
    ['TEMPLATE_NAME', 'Name'],
    ['LANGUAGE_CODE_NAME', 'Language'],
    ['TEMPLATE_CATEGORY_NAME', 'Category'],
  ];

  //drawer Variables
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: emailtemplate = new emailtemplate();
  loadingForm = false;
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  likeQuery: any = '';
  STATUS = '';
  tempvisible = false;
  temptext = '';
  subtext = '';
  istempApplied = false;
  isShortApplied = false;
  isSeqApplied = false;
  subvisible;
  false;
  issubApplied = false;
  Languagetext = '';
  laguagevisible = false;
  statusFilter: string | undefined = undefined;
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

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  templatestatusFilter: string | undefined = undefined;
  onTempStatusFilterChange(selectedStatus: string) {
    this.templatestatusFilter = selectedStatus;
    this.search(true);
  }
  listOfTempFilter: any[] = [
    { text: 'Approved', value: 'A' },
    { text: 'Rejected', value: 'R' },
    { text: 'Pending', value: 'P' },
  ];
  reset(): void {
    this.searchText = '';
    this.temptext = '';
    //this.Shortcodetext = "";
    this.search();
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.temptext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.istempApplied = true;
    } else if (this.temptext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istempApplied = false;
    }
    if (this.subtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.issubApplied = true;
    } else if (this.subtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.issubApplied = false;
    }
    // if (this.Seqtext.length > 0 && event.key === "Enter") {
    //   this.search();
    //   this.isSeqApplied = true;
    // } else if (this.Seqtext.length == 0 && event.key === "Backspace") {
    //   this.search();
    //   this.isSeqApplied = false;
    // }
  }
  templateCategories = [
    { Id: 'Welcome Email', Name: 'Welcome Email' },
    { Id: 'Password Reset', Name: 'Password Reset' },
    { Id: 'Appointment Confirmation', Name: 'Appointment Confirmation' },
    { Id: 'Order Notification', Name: 'Order Notification' },
    { Id: 'Promotional Email', Name: 'Promotional Email' },
    { Id: 'Follow-up Email', Name: 'Follow-up Email' },
    { Id: 'Feedback Request', Name: 'Feedback Request' },
    { Id: 'Other', Name: 'Other' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.search();
    this.getallLanguages();
    this.getLanguageData();
    this.getTemplateCategories();
    this.getTemplateCategories1();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
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
  templateCategories1: any = [];
  getTemplateCategories() {
    this.api.getTemplateCategoryData(0, 0, '', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.templateCategories1 = data['data'];

          //this.loadFilters();
        } else {
          this.templateCategories1 = [];
          this.message.error('Something Went Wrong ...', '');
        }
      },
      (err: HttpErrorResponse) => {
        // this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  templateCategory: any = [];
  getTemplateCategories1() {
    this.api
      .getTemplateCategoryData(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.templateCategory.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  LangugageData: any[] = [];
  isSpinning = false;

  // getallLanguages() {
  //   this.api.getLanguageData(0, 0, "", "asc", " AND IS_ACTIVE =1").subscribe(
  //     (data) => {
  //       if (data["code"] == 200) {
  //         this.LangugageData = data["data"];
  //         this.isSpinning = false;
  //       } else {
  //         this.LangugageData = [];
  //         this.message.error("Failed to get Langugae data...", "");
  //         this.isSpinning = false;
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.isSpinning = false;
  //       if (err.status === 0) {
  //         this.message.error(
  //           "Unable to connect. Please check your internet or server connection and try again shortly.",
  //           ""
  //         );
  //       } else {
  //         this.message.error("Something went wrong.", "");
  //       }
  //     }
  //   );
  // }

  getallLanguages() {
    this.api.getLanguageData(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.LangugageData = data['data'];
        } else {
          this.LangugageData = [];
          this.message.error('Failed To Get Language Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
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
    // this.search(true);
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

  columns: string[][] = [
    ['TEMPLATE_NAME', 'TEMPLATE_NAME'],
    ['TEMPLATE_CATEGORY_NAME', 'TEMPLATE_CATEGORY_NAME'],
    ['LANGUAGE_CODE_NAME', 'LANGUAGE_CODE_NAME'],
  ];
  selectedLanguages: any[] = [];
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
    if (this.temptext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TEMPLATE_NAME LIKE '%${this.temptext.trim()}%'`;
    }

    if (this.selectedCategory.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      // Wrap each value in single quotes for SQL syntax
      const formattedValues = this.selectedCategory
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `TEMPLATE_CATEGORY_ID IN (${formattedValues})`;
    }

    // if (this.selectedLanguages.length > 0) {
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
    if (this.templatestatusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TEMPLATE_STATUS = "${this.templatestatusFilter}"`;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getEmailTemplates(
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
  selectedCategory: any[] = [];
  isCategoryApplied = false;
  onCountryChange(): void {
    //his.search();
    if (this.selectedCategory?.length) {
      this.search();
      this.isCategoryApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isCategoryApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }
  isLanguageApplied = false;
  onLanguageChange(): void {
    //his.search();
    if (this.selectedLanguages?.length) {
      this.search();
      this.isLanguageApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isLanguageApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }
  drawerClose(): void {
    this.search();
    this.drawervisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  // add(): void {
  //   this.drawerTitle = 'Add New Template';
  //   this.drawerData = new emailtemplate();
  //   //this.loadForms()
  //   this.drawerVisible = true;
  // }
  add(): void {
    this.drawerTitle = 'Add New Template';
    this.drawerData = new emailtemplate();
    this.drawervisible = true;
  }

  drawerVisible1: boolean = false;
  drawerTitle1;
  drawervisible = false;
  edit(data: emailtemplate): void {
    this.drawerTitle = 'Update New Template';
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
    this.drawerData.TEMPLATE_CATEGORY_ID = Number(data.TEMPLATE_CATEGORY_ID);
    this.drawerData.BODY_VALUES = JSON.parse(this.drawerData.BODY_VALUES);
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
    // this.search(false);
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  TabId: number;
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  //TabId: number; // Ensure TabId is defin

  isLoading = false;

  applyCondition: any;

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
  // currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Email Template Filter';
    this.filterFields[2]['options'] = this.LanguageData1;
    this.filterFields[1]['options'] = this.templateCategory;
    // this.applyCondition = "";
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
  selectedFilter: string | null = null;
  // filterQuery = '';

  // applyfilter(item) {
  //   this.filterClass = 'filter-invisible';
  //   this.selectedFilter = item.ID;
  //   this.isfilterapply = true;
  //   this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
  //   this.search(true);
  // }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

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
    this.filterFields[1]['options'] = this.templateCategory;

    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }

  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;

  // drawerfilterClose() {
  //   this.drawerFilterVisible = false;
  //   this.loadFilters();
  // }
  // get filtercloseCallback() {
  //   return this.drawerfilterClose.bind(this);
  // }
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
      key: 'TEMPLATE_CATEGORY_NAME',
      label: 'Category ',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [
        // { value: 'Welcome Email', display: 'Welcome Email' },
        // { value: 'Password Reset', display: 'Password Reset' },
        // {
        //   value: 'Appointment Confirmation',
        //   display: 'Appointment Confirmation',
        // },
        // { value: 'Order Notification', display: 'Order Notification' },
        // { value: 'Promotional Email', display: 'Promotional Email' },
        // { value: 'Follow-up Email', display: 'Follow-up Email' },
        // { value: 'Feedback Request', display: 'Feedback Request' },
        // { value: 'Other', display: 'Other' },
      ],
      placeholder: 'Enter Category',
    },
    {
      key: 'LANGUAGE_CODE_NAME',
      label: 'Language',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],

      placeholder: 'Enter Language Name',
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
        { value: 'R', display: 'Rejected' },
        { value: 'A', display: 'Approved' },
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
  filterloading: boolean = false;
  whichbutton: any;
  // filterloading: boolean = false;

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

  applyfilter(item) {
    //  
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

  isDeleting: boolean = false;

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
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
}