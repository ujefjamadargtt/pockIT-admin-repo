import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { helpDocumentCategory } from 'src/app/Pages/Models/helpdocumentcategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-help-document-category-list',
  templateUrl: './help-document-category-list.component.html',
  styleUrls: ['./help-document-category-list.component.css'],
})
export class HelpDocumentCategoryListComponent {
  drawerVisible: boolean = false;
  drawerData: helpDocumentCategory = new helpDocumentCategory();
  searchText: string = '';
  formTitle = 'Manage Help Document Categories';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'HELP_CATEGORY_NAME';

  isLoading = true;
  columns: string[][] = [
    ['HELP_CATEGORY_NAME', 'HELP_CATEGORY_NAME'],
    ['IS_ACTIVE', 'IS_ACTIVE'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;

  hepDocumentCategoryName: string = '';
  categoryvisible = false;
  description: string = '';
  descriptionvsible = false;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  iscategoryFilterApplied: boolean = false;
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

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

  isDeleting: boolean = false;

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

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
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

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  // columns1: { label: string; value: string }[] = [
  //   { label: 'Knowledge Base Category Name', value: 'NAME' },
  //   { label: 'Description', value: 'DESCRIPTION' },
  //   { label: 'Status', value: 'IS_ACTIVE' },
  // ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  filterloading: boolean = false;
  selectedFilter: string | null = null;

  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any[] = []; // Define the type of savedFilters if possible
  TabId: number; // Ensure TabId is defined and initialized
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    // Ensure USER_ID is assigned a valid number
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
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
    if (this.hepDocumentCategoryName.length >= 3 && event.key === 'Enter') {
      this.search();
      this.iscategoryFilterApplied = true;
    } else if (
      this.hepDocumentCategoryName.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.iscategoryFilterApplied = false;
    }
    // if (this.description.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.isdescriptionFilterApplied = true;
    // } else if (this.description.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.isdescriptionFilterApplied = false;
    // }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  reset(): void {
    this.searchText = '';
    this.hepDocumentCategoryName = '';
    // this.description = '';
    this.search();
  }

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'HELP_CATEGORY_NAME';
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

    // knowledgeBaseCategoryName Filter
    if (this.hepDocumentCategoryName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `HELP_CATEGORY_NAME LIKE '%${this.hepDocumentCategoryName.trim()}%'`;
    } else {
    }
    // description Filter
    // if (this.description !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `DESCRIPTION LIKE '%${this.description.trim()}%'`;
    // }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getHelpDocumentCategoryData(
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
            this.totalRecords = data['body']['count'];
            this.dataList = data['body']['data'];
            this.TabId = data['body']['TAB_ID'];
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

  add(): void {
    this.drawerTitle = 'Add New Category';
    this.drawerData = new helpDocumentCategory();
    this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'HELP_CATEGORY_NAME';
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

  edit(data: helpDocumentCategory): void {
    this.drawerTitle = 'Update Category';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // Main Filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  filterFields: any[] = [
    {
      key: 'HELP_CATEGORY_NAME',
      label: 'Help Document Category Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Help Document Category Name',
    },

    // {
    //   key: 'DESCRIPTION',
    //   label: 'Description',
    //   type: 'text',
    //   comparators: [
    //     '=',
    //     '!=',
    //     'Contains',
    //     'Does Not Contains',
    //     'Starts With',
    //     'Ends With',
    //   ],
    //   placeholder: 'Enter Description',
    // },

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

  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  openfilter() {
    this.drawerTitle = 'Help Document Category Filter';
    this.drawerFilterVisible = true;

    // Edit code 2

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
  drawerflterClose(buttontype, updateButton): void {
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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  oldFilter: any[] = [];

  // selectedFilter: string | null = null;
  // filterQuery = '';

  // isModalVisible = false; // Controls modal visibility
  // selectedQuery: string = ''; // Holds the query to display
  // toggleLiveDemo(query: any): void {
  //   this.selectedQuery = query.FILTER_QUERY;
  //   this.isModalVisible = true;
  // }
  // handleCancel(): void {
  //   this.isModalVisible = false; // Close the modal
  //   this.selectedQuery = ''; // Clear the selected query
  // }

  drawerfilterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }

  isModalVisible = false;
  selectedQuery: string = '';

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  // Edit Code 1
  // EditQueryData = [];
  // editButton: any;
  // FILTER_NAME: any;
  // editQuery(data: any) {
  //   this.filterGroups = JSON.parse(data.FILTER_JSON);
  //   this.FILTER_NAME = data.FILTER_NAME;

  //   this.EditQueryData = data;
  //   this.editButton = "Y";
  //   this.drawerTitle = "Edit Query";
  //   this.drawerFilterVisible = true;
  // }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
}
