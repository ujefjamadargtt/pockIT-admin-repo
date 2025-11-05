import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { KnowledgeBaseMaster } from 'src/app/Support/Models/KnowledgeBaseMaster';

@Component({
  selector: 'app-knowledge-base-master-list',
  templateUrl: './knowledge-base-master-list.component.html',
  styleUrls: ['./knowledge-base-master-list.component.css'],
})
export class KnowledgeBaseMasterListComponent {
  drawerVisible: boolean = false;
  drawerData: KnowledgeBaseMaster = new KnowledgeBaseMaster();
  searchText: string = '';
  formTitle = 'Manage Knowledge Base';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';

  isLoading = true;
  columns: string[][] = [
    ['TITLE', 'TITLE'],
    ['DESCRIPTION', 'DESCRIPTION'],
    ['KNOWLEDGEBASE_SUB_CATEGORY_NAME', 'KNOWLEDGEBASE_SUB_CATEGORY_NAME'],
    ['KNOWLEDGEBASE_CATEGORY_NAME', 'KNOWLEDGEBASE_CATEGORY_NAME'],

    // ['DESCRIPTION', 'DESCRIPTION']
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;

  iscategoryFilterApplied = false;
  issubcategoryFilterApplied = false;
  istitleFilterApplied = false;
  isdescriptionFilterApplied = false;
  title: string = '';
  descriptionText: string = '';
  titlevisible = false;
  descriptionvisible = false;
  categoryvisible: boolean = false;
  selectedCategories: number[] = [];
  subcategoryvisible: boolean = false;
  selectedsubCategories: number[] = [];
  description: string = '';
  descriptionvsible = false;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfDocType: any[] = [
    { text: 'Document', value: 'D' },
    { text: 'Link', value: 'L' },
  ];

  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Category', value: 'KNOWLEDGEBASE_CATEGORY_ID' },
    { label: 'Subcategory', value: 'KNOWLEDGE_SUB_CATEGORY_ID' },
    { label: 'Title', value: 'TITLE' },
    // { label: 'Description', value: 'DESCRIPTION' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  onKeyup(event: KeyboardEvent): void {
    if (this.title.length >= 3 && event.key === 'Enter') {
      this.search();
      this.istitleFilterApplied = true;
    } else if (this.title.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istitleFilterApplied = false;
    }

    if (this.descriptionText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isdescriptionFilterApplied = true;
    } else if (this.descriptionText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isdescriptionFilterApplied = false;
    }
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  // onsubCategoryChange(): void {
  //   this.search();
  // }
  // onCategoryChange(): void {
  //   this.search();
  // }
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
  onsubCategoryChange(): void {
    if (this.selectedsubCategories?.length) {
      this.search();
      this.issubcategoryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.issubcategoryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  DocumentType: any;
  onDocumentTypeChange(selectedStatus: string) {
    this.DocumentType = selectedStatus;
    this.search(true);
  }

  reset(): void {
    this.searchText = '';
    this.title = '';
    this.description = '';
    this.search();
  }
  ngOnInit() {
    this.getcategoryData();
    this.getcategorydata();
    this.getsubcategoryData();
    this.getsubcategorydata();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  CategoryData: any = [];
  getcategoryData() {
    this.api
      .getKnowledgeBaseCategoryData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data: HttpResponse<any>) => {
          //

          const statusCode = data.status;
          const responseBody = data.body;

          if (statusCode) {
            this.CategoryData = responseBody['data'];
          } else {
            this.CategoryData = [];
            this.message.error('Failed To Get Category Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  categorydate1: any = [];

  getcategorydata() {
    this.api
      .getKnowledgeBaseCategoryData(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data: HttpResponse<any>) => {
        //

        const statusCode = data.status;
        const responseBody = data.body;

        if (statusCode == 200) {
          if (responseBody['count'] > 0) {
            responseBody['data'].forEach((element) => {
              this.categorydate1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }

  SubcategoryData: any = [];
  getsubcategoryData() {
    this.api
      .getKnowledgeBasesubCategoryData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data: HttpResponse<any>) => {
          //

          const statusCode = data.status;
          const responseBody = data.body;

          if (statusCode == 200) {
            this.SubcategoryData = responseBody['data'];
          } else {
            this.SubcategoryData = [];
            this.message.error('Failed To Get Subcategory Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  subcategorydate1: any = [];

  getsubcategorydata() {
    this.api
      .getKnowledgeBasesubCategoryData(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data: HttpResponse<any>) => {
        //

        const statusCode = data.status;
        const responseBody = data.body;

        if (statusCode == 200) {
          if (responseBody['count'] > 0) {
            responseBody['data'].forEach((element) => {
              this.subcategorydate1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
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

    // title Filter
    if (this.title !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `TITLE LIKE '%${this.title.trim()}%'`;
    }
    // description Filter
    if (this.descriptionText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.descriptionText.trim()}%'`;
    }

    // // DESCRIPTION Filter
    // if (this.description !== '') {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `DESCRIPTION LIKE '%${this.description.trim()}%'`;
    // }
    // KNOWLEDGEBASE_CATEGORY_ID Filter
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `KNOWLEDGEBASE_CATEGORY_ID IN (${this.selectedCategories.join(
        ','
      )})`; // Update with actual field name in the DB
    }
    // KNOWLEDGE_SUB_CATEGORY_ID Filter
    if (this.selectedsubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `KNOWLEDGE_SUB_CATEGORY_ID IN (${this.selectedsubCategories.join(
        ','
      )})`; // Update with actual field name in the DB
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    // Document
    if (this.DocumentType) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TYPE = '${this.DocumentType}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getKnowledgeBaseData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          //

          const statusCode = data.status;
          const responseBody = data.body;

          if (statusCode == 200) {
            this.loadingRecords = false;
            this.totalRecords = responseBody['count'];
            this.dataList = responseBody['data'];
            this.TabId = responseBody['TAB_ID'];
          } else if (statusCode == 400) {
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
    this.drawerTitle = 'Add New Knowledge Base';
    this.drawerData = new KnowledgeBaseMaster();
    this.drawerVisible = true;
  }
  stripHtmlAndDecodeEntities(html: string): string {
    if (!html) return ''; // Return empty string if description is missing

    try {
      html = html; // Parse if it's stringified JSON
    } catch (e) {
      // If parsing fails, it's already a normal string
    }

    // Remove HTML tags
    html = html.replace(/<[^>]*>/g, '').trim();

    // Decode HTML entities using a temporary DOM element
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
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

  edit(data: KnowledgeBaseMaster): void {
    this.drawerTitle = 'Update Knowledge Base';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.DESCRIPTION = this.drawerData.DESCRIPTION;
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

  // Main Filter code
  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    '=',
    '!=',
    '<',
    '>',
    '<=',
    '>=',
    'Contains',
    'Does not Contain',
    'Start With',
    'End With',
  ];

  getComparisonOptions(selectedColumn: string): string[] {
    if (
      selectedColumn === 'IS_ACTIVE' ||
      selectedColumn === 'KNOWLEDGE_SUB_CATEGORY_ID' ||
      selectedColumn === 'KNOWLEDGEBASE_CATEGORY_ID'
    ) {
      return ['=', '!='];
    }
    return [
      '=',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      'Contains',
      'Does not Contain',
      'Start With',
      'End With',
    ];
  }
  columns2: string[][] = [['AND'], ['OR']];

  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter;
  }

  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;

  conditions: any[] = [];

  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: '',
      COMPARISION_VALUE: '',
      TABLE_VALUE: '',
    });
  }

  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  operators: string[] = ['AND', 'OR'];
  // QUERY_NAME: string = '';
  showQueriesArray = [];

  filterBox = [
    {
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    },
  ];

  addCondition() {
    this.filterBox.push({
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    });
  }

  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }

  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }

  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  filterFields: any[] = [
    {
      key: 'KNOWLEDGEBASE_CATEGORY_NAME',
      label: 'Knowledgebase Category Name',
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
      placeholder: 'Enter Knowledgrbase Category Name',
    },

    {
      key: 'KNOWLEDGEBASE_SUB_CATEGORY_NAME',
      label: 'Knowledgebase Subategory Name',
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
      placeholder: 'Enter Knowledgrbase Subcategory Name',
    },

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
      key: 'DESCRIPTION',
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
      key: 'TYPE',
      label: 'Document Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'D', display: 'Document' },
        { value: 'L', display: 'Link' },
      ],
      placeholder: 'Select Document Type',
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

  // filterQuery = '';

  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  // openfilter() {
  //   this.drawerTitle = 'Knowledgebase Filter';
  //   this.applyCondition = '';
  //   this.filterFields[0]['options'] = this.categorydate1;
  //   this.filterFields[1]['options'] = this.subcategorydate1;

  //   this.drawerFilterVisible = true;
  // }

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

  filterData: any;
  currentClientId = 1;

  openfilter() {
    this.drawerTitle = 'Knowledgebase Filter';
    this.filterFields[0]['options'] = this.categorydate1;
    this.filterFields[1]['options'] = this.subcategorydate1;
    this.drawerFilterVisible = true;

    // Edit Code 2

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
  whichbutton: any;
  filterloading: boolean = false;
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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  selectedFilter: string | null = null;
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

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }
  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  TabId: number; // Ensure TabId is defined and initialized
  public commonFunction = new CommonFunctionService();

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  // drawerfilterClose() {
  //   this.drawerFilterVisible = false;
  //   this.loadFilters();
  // }
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
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

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;

  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[0]['options'] = this.categorydate1;
    this.filterFields[1]['options'] = this.subcategorydate1;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  ViewImage: any;
  ImageModalVisible: boolean = false;
  isSpinning = false;

  imageshow;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewLink(link: string): void {
    if (link) {
      window.open(link, '_blank'); // Opens the link in a new tab/window
    } else {
    }
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'KnowledgeBaseDoc/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }
  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'KnowledgeBaseDoc/' + link;

    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');

    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
}