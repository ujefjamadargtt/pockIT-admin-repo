import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { PlaceholderMaster } from 'src/app/Pages/Models/PlaceholderMaster';

@Component({
  selector: 'app-listplaceholder',
  templateUrl: './listplaceholder.component.html',
  styleUrls: ['./listplaceholder.component.css'],
})
export class ListplaceholderComponent {
  // [data]="drawerData"

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: PlaceholderMaster = new PlaceholderMaster();
  formTitle = 'Manage Placeholder';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  columns: string[][] = [
    ['LABEL', 'LABEL'],
    ['TEMPLATE_CATEGORY_NAME', 'TEMPLATE_CATEGORY_NAME'],
  ];
  adminId: any;

  // Column Filter
  selectedCountries: number[] = [];
  countryVisible: boolean = false;
  statetext: string = '';
  stateVisible: boolean = false;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  visible = false;
  ShortCodevisible = false;
  Shortcodetext: string = '';
  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Country', value: 'COUNTRY_ID' },
    { label: 'State', value: 'NAME' },
    { label: 'Status', value: 'IS_ACTIVE' },
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
    private message: NzNotificationService,
    private router: Router
  ) { }
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
  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.TemplateCategory1();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters(); // Convert decryptedUserId to a number
    this.tableOptionss();
  }
  isStateApplied = false;
  isShortCodeApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.statetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isStateApplied = true;
    } else if (this.statetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isStateApplied = false;
    }
    if (this.Shortcodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isShortCodeApplied = true;
    } else if (this.Shortcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isShortCodeApplied = false;
    }
  }

  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.countryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  iscountryFilterApplied = false;
  onCountryChange(): void {
    //this.search();
    if (this.selectedCountries?.length) {
      this.search();
      this.iscountryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.iscountryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  keyup(event) {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }

  // distinctData: any = [];
  // onFilterClick(columnKey: string): void {

  //   this.api.getDistinctData(97, columnKey).subscribe(
  //     (data) => {
  //       if (data["code"] == 200) {
  //         this.distinctData = data["data"];
  //       } else {
  //         this.distinctData = [];
  //         this.message.error("Failed To Get Distinct data Data", "");
  //       }
  //     },
  //     () => {
  //       this.message.error("Something Went Wrong", "");
  //     }
  //   );
  // }

  TemplateCategory1() {
    this.api
      .getTemplateCategory(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == '200') {
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.templateCategoryOptions1.push({
                  value: element.ID,
                  display: element.NAME,
                });
              });
            }
          } else {
            this.templateCategoryOptions1 = [];
            this.message.error('Failed To Get Template Category Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  templateCategoryOptions: any = [];
  templateCategoryOptions1: any = [];

  TemplateCategory(columnKey: string): void {
    this.api.getTemplateCategorytable(164, columnKey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.templateCategoryOptions = data['data'];
        } else {
          this.templateCategoryOptions = [];
          this.message.error('Failed To Get Distinct data Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  // templateCategoryOptions: any = []

  // TemplateCategory() {
  //   this.api
  //     .getTemplateCategory(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.templateCategoryOptions = data['data'];
  //         } else {
  //           this.templateCategoryOptions = [];
  //           this.message.error('Failed To Get Template Category Data', '');
  //         }
  //       },
  //       () => {
  //         this.message.error('Something Went Wrong', '');
  //       }
  //     );
  // }

  isFilterApplied;
  statekeyup() {
    if (this.statetext.length >= 3) {
      this.search();
      this.isFilterApplied = true;
    } else if (this.statetext.length === 0) {
      this.dataList = [];
      this.search();
      this.isFilterApplied = false;
    } else if (this.statetext.length < 3) {
      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
  }

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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

    // City Filter
    if (this.statetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.statetext.trim()}%'`;
    }
    if (this.Shortcodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LABEL LIKE '%${this.Shortcodetext.trim()}%'`;
    }
    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TEMPLATE_CATEGORY_NAME IN ('${this.selectedCountries.join(
        "','"
      )}')`; // Update with actual field name in the DB
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // Call API with updated search query
    this.api
      .getplaceholder(
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

            //this.loadFilters();
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

  reset(): void {
    this.searchText = '';
    this.statetext = '';
    this.Shortcodetext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Add New Placeholder';
    this.drawerData = new PlaceholderMaster();

    this.selectedTable =
      // this.api.getState(1, 1, "SEQ_NO", "desc", "").subscribe(
      //   (data) => {
      //     if (data["count"] == 0) {
      //       this.drawerData.SEQ_NO = 1;
      //     } else {
      //       this.drawerData.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
      //     }
      //   },
      //   (err) => { }
      // );

      this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    //

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

  TABLE_NAME: any;
  TABLE_COLUMN: any;
  selectedTable: any;
  keyOptions: any;
  tableOptions: any[] = [];

  tableOptionss() {
    // this.isCountrySpinning = true;
    this.api.getallTable(0, 0, 'TABLE_NAME', 'asc', '').subscribe(
      (data) => {
        if (data.code === 200) {
          this.tableOptions = data.data;
        } else {
          this.tableOptions = [];
          this.message.error('Failed To Get Table Options Data', '');
        }
        // this.isCountrySpinning = false;
      },
      () => {
        this.message.error('Something Went Wrong', '');
        // this.isCountrySpinning = false;
      }
    );
  }

  edit(data: PlaceholderMaster): void {
    this.drawerTitle = 'Update Placeholder';
    this.drawerData = Object.assign({}, data);

    // Assign the selected table name
    this.selectedTable = this.drawerData.TABLE_NAME;

    // Find the matching table data from tableOptions
    const selectedTableData = this.tableOptions.find(
      (table: any) => table.TABLE_NAME === this.selectedTable
    );

    // Extract COLUMN_JSON keys if found
    this.keyOptions = selectedTableData?.COLUMN_JSON
      ? Object.keys(selectedTableData.COLUMN_JSON)
      : [];

    this.drawerVisible = true;
  }

  // edit(data: PlaceholderMaster): void {
  //   this.drawerTitle = " Update Placeholder";
  //   this.drawerData = Object.assign({}, data);

  //

  //   this.drawerVisible = true;

  //
  //
  // }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  // new filter
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
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  openfilter() {
    this.drawerTitle = 'Placeholder Filter';
    // this.applyCondition = "";
    this.filterFields[1]['options'] = this.templateCategoryOptions1;

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

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'LABEL',
      label: 'Label',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Label Name',
    },

    {
      key: 'TEMPLATE_CATEGORY_NAME',
      label: 'Template Category',
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
      placeholder: 'Select Template Category',
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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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

  oldFilter: any[] = [];
  isLoading = false;

  public commonFunction = new CommonFunctionService();
  selectedFilter: string | null = null;
  // filterQuery = '';

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  //TabId: number; // Ensure TabId is defined and initialized
  TabId: number;
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

  drawerfilterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }
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
  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[1]['options'] = this.templateCategoryOptions1;

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