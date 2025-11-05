import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Faq } from 'src/app/Support/Models/TicketingSystem';

@Component({
  selector: 'app-faqresponses',
  templateUrl: './faqresponses.component.html',
  styleUrls: ['./faqresponses.component.css'],
})
export class FaqresponsesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Faq;
  formTitle = 'Manage Faq Responses';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  initFilter = true;
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['USER_MOBILE', 'Mobile Number'],
    ['USER_EMAIL_ID', 'Email ID'],
    ['SUGGESTION', 'Suggestion'],
    ['STATUS', 'Status'],
  ];

  FAQ_MASTER_ID: Number;
  STATUS = 'P';
  USER_TYPE: any;

  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Faq = new Faq();
  isSpinning = false;

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

  //New Advance Filter

  filterData: any;
  currentClientId = 1; // Set the client ID

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
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.search();
  }
  // Basic Methods

  getFAQID(id?) {
    if (id == undefined) this.FAQ_MASTER_ID = 0;
    else this.FAQ_MASTER_ID = id;
  }

  // sort(sort: { key: string; value: string }): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }
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

    // if (this.searchText != '') {
    //   this.filterQuery += ' AND (';
    //   var likeQuery = ' ';
    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like ('%" + this.searchText + "%') OR";
    //   });
    //   this.filterQuery += likeQuery.substring(0, likeQuery.length - 3) + ')';
    // } else {
    //   this.filterQuery = '';
    //   this.applyFilter(this.FAQ_MASTER_ID);
    // }

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

    if (this.UserNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `USER_NAME LIKE '%${this.UserNametext.trim()}%'`;
      this.isUserMobileFilterApplied = true;
    } else {
      this.isUserMobileFilterApplied = false;
    }

    if (this.UserMobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `USER_MOBILE LIKE '%${this.UserMobiletext.trim()}%'`;
      this.isUserMobileFilterApplied = true;
    } else {
      this.isUserMobileFilterApplied = false;
    }

    if (this.UserEmailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `USER_EMAIL_ID LIKE '%${this.UserEmailtext.trim()}%'`;
      this.isUserEmailFilterApplied = true;
    } else {
      this.isUserEmailFilterApplied = false;
    }

    if (this.Suggestiontext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUGGESTION LIKE '%${this.Suggestiontext.trim()}%'`;
      this.isSuggestionFilterApplied = true;
    } else {
      this.isSuggestionFilterApplied = false;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = '${this.statusFilter}'`;
    }

    if (
      globalSearchQuery != null &&
      globalSearchQuery != undefined &&
      globalSearchQuery != '' &&
      likeQuery != null &&
      likeQuery != undefined &&
      likeQuery != ''
    ) {
      likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    }

    // Combine global search query and column-specific search query

    // if (this.FAQ_MASTER_ID != undefined) {
    this.api
      .getAllFaqResponses(
        0,
        0,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.TabId = data['TAB_ID'];
          this.dataList = data['data'];
        },
        (err) => { }
      );
    // }
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
  filterloading: boolean = false;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;

  keyup(event: KeyboardEvent): void {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
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

  // applyFilter(id?) {
  //   this.FAQ_MASTER_ID = id;
  //   this.isSpinning = true;
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
  //   this.filterQuery =
  //     ' AND FAQ_MASTER_ID=' +
  //     this.FAQ_MASTER_ID +
  //     " AND STATUS='" +
  //     this.STATUS +
  //     "' ";

  //     if (
  //       this.USER_TYPE != null &&
  //       this.USER_TYPE != undefined &&
  //       this.USER_TYPE != ""
  //     ) {
  //       this.filterQuery += " AND USER_TYPE = '" + this.USER_TYPE + "'";
  //     }

  //   if (this.FAQ_MASTER_ID != undefined) {
  //     this.api
  //       .getAllFaqResponses(0, 0, this.sortKey, sort, this.filterQuery)
  //       .subscribe(
  //         (data) => {
  //           this.totalRecords = data['count'];
  //           this.dataList = data['data'];
  //           this.loadingRecords = false;
  //           this.filterClass = 'filter-invisible';
  //           this.isFilterApplied = 'primary';
  //           this.isSpinning = false;
  //         },
  //         (err) => {}
  //       );
  //   }

  // }

  selectedFilter: string | null = null;

  applyfilter(item) {

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }

  getName(status) {
    if (status == 'P') return 'Change';
    else return '';
  }

  edit(data: Faq, status, id) {
    if (status == 'P') {
      this.drawerTitle = 'Update Faq';
      // try {
      //   data.TAGS_STRING = data.TAGS.split(',');
      // } catch (error) {
      //   data.TAGS_STRING = [];
      // }
      this.drawerData = Object.assign({}, data);
      this.drawerVisible = true;
    }
  }

  get closeCallback() {
    return this.drawerCloseFaq.bind(this);
  }

  drawerCloseFaq() {
    this.drawerVisible = false;
  }

  UserMobileVisible: boolean = false;
  isUserMobileFilterApplied = false;
  UserMobiletext: string = '';

  UserEmailVisible: boolean = false;
  isUserEmailFilterApplied = false;
  UserEmailtext: string = '';

  SuggesstionVisible: boolean = false;
  isSuggestionFilterApplied = false;
  Suggestiontext: string = '';

  UserNameVisible: boolean = false;
  isUserNameFilterApplied = false;
  UserNametext: string = '';

  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search();
    }

    if (this.UserNametext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.UserNametext.length == 0 && event.key === 'Backspace') {
      this.search();
    }

    if (this.UserMobiletext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.UserMobiletext.length == 0 && event.key === 'Backspace') {
      this.search();
    }

    if (this.UserEmailtext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.UserEmailtext.length == 0 && event.key === 'Backspace') {
      this.search();
    }

    if (this.Suggestiontext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.Suggestiontext.length == 0 && event.key === 'Backspace') {
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

  reset(): void {
    this.searchText = '';
    this.UserNametext = '';
    this.Suggestiontext = '';
    this.UserEmailtext = '';
    this.UserMobiletext = '';
    this.search();
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: 'Like', value: 'P' },
    { text: 'Dislike', value: 'N' },
  ];

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  back() {
    this.router.navigate(['/masters/menu']);
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

  openfilter() {
    this.drawerTitle = 'Faq Responses Filter';
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

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }

  filterFields: any[] = [
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Like' },
        { value: 'N', display: 'DisLike' },
      ],

      placeholder: 'Select Status',
    },
    {
      key: 'USER_TYPE',
      label: 'User Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'A', display: 'Admin' },
        { value: 'T', display: 'Technician' },
        { value: 'V', display: 'Vendor' },
        { value: 'B', display: 'Back Office Team' },
        { value: 'C', display: 'Customer' },
      ],
      placeholder: 'Select User Type',
    },
  ];

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
}
