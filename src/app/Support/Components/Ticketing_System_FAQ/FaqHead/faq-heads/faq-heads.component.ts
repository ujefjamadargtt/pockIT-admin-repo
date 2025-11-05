import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FaqHeadComponent } from '../faq-head/faq-head.component';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Faqhead } from 'src/app/Support/Models/TicketingSystem';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-heads',
  templateUrl: './faq-heads.component.html',
  styleUrls: ['./faq-heads.component.css'],
})
export class FaqHeadsComponent implements OnInit {
  formTitle = 'Manage FAQ Heads';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    // ['PARENT_NAME', 'Parent Name'],
    ['NAME', 'FAQ Head Name'],
  ];
  applicationId = Number(this.cookie.get('applicationId'));
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Faqhead = new Faqhead();
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

  //New Advance Filter

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

  // Basic Methods
  // sort(sort: { key: string; value: string }): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
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

    // var likeQuery = ' ';
    // if (this.searchText != '') {
    //   likeQuery = ' AND (';
    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    // }

    // if (likeQuery)
    //   this.filterQuery = ' AND APPLICATION_ID=' + this.applicationId + likeQuery;
    // else this.filterQuery = ' AND APPLICATION_ID=' + this.applicationId;

    var likeQuery = '';
    var globalSearchQuery = '';
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

    if (this.FAQHeadNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.FAQHeadNametext.trim()}%'`;
      this.isFAQHeadNameFilterApplied = true;
    } else {
      this.isFAQHeadNameFilterApplied = false;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }

    // Parent Filter
    // if (this.parentFilter) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `IS_PARENT = ${this.parentFilter}`;
    // }

    if (this.headtypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `FAQ_HEAD_TYPE = '${this.headtypeFilter}'`;
    }
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getAllFaqHeads(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data.body['count'];
          this.dataList = data.body['data'];
          this.TabId = data.body['TAB_ID'];

          if (this.totalRecords == 0) {
            data.body['SEQUENCE_NO'] = 1;
          } else {
            data.body['SEQUENCE_NO'] =
              this.dataList[this.dataList.length - 1]['SEQUENCE_NO'] + 1;
          }
        },
        (err) => { }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // @ViewChild(FaqHeadComponent, { static: false })
  // FaqHeadComponentVar: FaqHeadComponent;

  add(): void {
    this.drawerVisible = true;

    this.drawerTitle = 'Create New FAQ Head';
    this.drawerData = new Faqhead();

    this.api.getAllFaqHeads(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['body']['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO =
            data['body']['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => { }
    );

    this.drawerData.ORG_ID = null;
    this.drawerData.PARENT_ID = null;
    this.drawerData.NAME = null;
    this.drawerData.DESCRIPTION = null;

    // this.FaqHeadComponentVar.loadFaqHeads1();
  }

  edit(data: Faqhead): void {
    this.drawerTitle = 'Update FAQ Head';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    // this.FaqHeadComponentVar.loadFaqHeads1();
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  FAQHeadNameVisible: boolean = false;
  isFAQHeadNameFilterApplied = false;
  FAQHeadNametext: string = '';

  reset(): void {
    this.searchText = '';
    this.FAQHeadNametext = '';

    this.search();
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }

    if (this.FAQHeadNametext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.FAQHeadNametext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
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

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  statusFilter: string | undefined = undefined;

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  listOfparentFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfheadtypeFilter: any[] = [
    { text: 'Customer', value: 'C' },
    { text: 'Technician', value: 'T' },
  ];

  parentFilter: string | undefined = undefined;

  onparentFilterChange(selectedStatus: string) {
    this.parentFilter = selectedStatus;
    this.search(true);
  }

  headtypeFilter: string | undefined = undefined;

  onheadtypeFilterChange(selectedStatus: string) {
    this.headtypeFilter = selectedStatus;
    this.search(true);
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  // Advance Filter
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  savedFilters: any;
  currentClientId = 1;
  TabId: any;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  filterClass: string = 'filter-invisible';
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

  selectedFilter: string | null = null;

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }

  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'FAQ  Filter';
    this.applyCondition = '';
    // this.filterFields[3]['options'] = this.categoryData;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

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
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.FILTER_NAME = data.FILTER_NAME;

    this.EditQueryData = data;
    this.filterData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Query';
    this.drawerFilterVisible = true;
    // this.filterFields[3]['options'] = this.categoryData;
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }

  drawerflterClose(buttontype, updateButton) {
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
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'FAQ Head Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter FAQ Head Name',
    },
    // {
    //   key: 'IS_PARENT',
    //   label: 'Is Parent ?',
    //   type: 'select',
    //   comparators: [
    //     { value: '=', display: 'Equal To' },
    //     { value: '!=', display: 'Not Equal To' },
    //   ],
    //   options: [
    //     { value: '1', display: 'Yes' },
    //     { value: '0', display: 'No' },
    //   ],
    //   placeholder: 'Is Parent ?',
    // },
    {
      key: 'FAQ_HEAD_TYPE',
      label: 'FAQ Head Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'C', display: 'Customer' },
        { value: 'T', display: 'Technician' },
      ],
      placeholder: 'FAQ Head Type',
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
      placeholder: 'Status',
    },
  ];

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
}