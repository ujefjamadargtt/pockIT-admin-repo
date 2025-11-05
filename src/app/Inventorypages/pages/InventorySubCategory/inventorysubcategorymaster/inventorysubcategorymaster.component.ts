import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { InventorySubCategory } from 'src/app/Inventorypages/inventorymodal/inventorysubCategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-inventorysubcategorymaster',
  templateUrl: './inventorysubcategorymaster.component.html',
  styleUrls: ['./inventorysubcategorymaster.component.css'],
})
export class InventorysubcategorymasterComponent {
  formTitle = 'Manage Inventory Sub Categories';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  itemNameVisible: boolean = false;
  inventorycategoryvisible: boolean = false;
  unitsvisible: boolean = false;
  qtyvisible: boolean = false;
  subcategorynametext = '';
  subcategorynamevisible: boolean = false;
  descriptionvisible: boolean = false;
  sequenceText: string = '';
  sequencevisible = false;
  isDescriptionFilterApplied: boolean = false;
  isSEQFilterApplied: boolean = false;
  isCategoryFilterApplied: boolean = false;
  issubCategoryFilterApplied: boolean = false;

  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['CATEGORY_NAME', 'Inventory Category'],
    ['NAME', 'Name'],
    ['DESCRIPTION', 'Description'],
    ['IS_ACTIVE', 'Is Active'],
  ];
  // columns1: string[][] = [["NAME", "Branch Name"], ["COUNTRY_NAME", "Country"], ["STATE_NAME", "State"], ["CITY_NAME", "City"]];
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: InventorySubCategory = new InventorySubCategory();
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  itemNametext: string = '';
  locationtext: string = '';
  quantitytext: string = '';
  descriptiontext: string = '';

  // locationtext : string = ""
  selectedcategories: any = [];

  selectedDate: any;
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  columns1: { label: string; value: string }[] = [
    { label: 'Inventory Category', value: 'INVENTRY_CATEGORY_ID' },
    // { label: "Item", value: "Item" },
    { label: 'Sub Category Name', value: 'NAME' },
    { label: 'Description', value: 'DESCRIPTION' },
    { label: 'Sequence No', value: 'SEQ_NO' },
    { label: 'Is Active', value: 'IS_ACTIVE' },
  ];

  showcolumn = [
    { label: 'Inventory Category', key: 'CATEGORY_NAME', visible: true },
    // { label: "Item", key: "ITEM", visible: true },
    { label: 'Sub Category Name', key: 'NAME', visible: true },
    { label: 'Description', key: 'DESCRIPTION', visible: true },
    { label: 'Subcategory Icon', key: 'ICON', visible: true },
    { label: 'Sequence No', key: 'SEQ_NO', visible: true },
    { label: 'Is Active', key: 'IS_ACTIVE', visible: true },
  ];

  checkColumnselect(a: any) { }
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // this.search();
    // this.getUnits()
    this.getInventoryCategory();
    this.getinventorycategorydata();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  categoryData: any = [];
  getInventoryCategory() {
    this.api
      .getInventoryCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.categoryData = data['data'];
        } else {
          this.categoryData = [];
        }
      });
  }

  categoryData1: any = [];

  getinventorycategorydata() {
    this.api
      .getInventoryCategory(0, 0, '', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.categoryData1.push({
                value: element.ID,
                display: element.CATEGORY_NAME,
              });
            });
          }
        }
      });
  }

  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.subcategorynametext.length > 3 && event.key === 'Enter') {
      this.search();
    } else if (
      this.subcategorynametext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
    }

    if (this.descriptiontext.length > 3 && event.key === 'Enter') {
      this.search();
    } else if (this.descriptiontext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }

  subcategoryFilter() {
    if (this.subcategorynametext.trim() === '') {
      // Clear the filter and display all data
      this.searchText = ''; // Clear global search if any
      // thisdescriptionFilter.onKeyup();
    } else if (this.subcategorynametext.length >= 3) {
      // Apply the filter for CATEGORY_NAME
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onSequencenFilter() {
    if (this.sequenceText.trim() === '') {
      // Clear the filter and display all data
      this.searchText = ''; // Clear global search if any
      this.search(true); // Reload original data
    } else if (this.sequenceText.length >= 1) {
      // Apply the filter for DESCRIPTION
      this.search();
    } else {
      this.message.warning('Please enter at least 1 characters to filter.', '');
    }
  }

  descriptionFilter() {
    if (this.descriptiontext.trim() === '') {
      // Clear the filter and display all data
      this.searchText = ''; // Clear global search if any
      // this.onKeyup();
    } else if (this.descriptiontext.length >= 3) {
      // Apply the filter for CATEGORY_NAME
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
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

  // onCountryChange() {}
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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

  back() {
    this.router.navigate(['/masters/menu']);
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
    // temporary false change when api connected
    this.loadingRecords = false;

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

    if (this.descriptiontext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.descriptiontext.trim()}%'`;
      this.isDescriptionFilterApplied = true;
    } else {
      this.isDescriptionFilterApplied = false;
    }

    if (this.subcategorynametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.subcategorynametext.trim()}%'`;
      this.issubCategoryFilterApplied = true;
    } else {
      this.issubCategoryFilterApplied = false;
    }

    if (this.selectedcategories?.length) {
      const categories = this.selectedcategories.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `INVENTRY_CATEGORY_ID IN (${categories})`;
      this.isCategoryFilterApplied = true;
    } else {
      this.isCategoryFilterApplied = false;
    }

    // Sequence
    if (this.sequenceText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.sequenceText.trim()}%'`;
      this.isSEQFilterApplied = true;
    } else {
      this.isSEQFilterApplied = false;
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
      .getInventorySubCategory(
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
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.dataList = [];
            this.loadingRecords = false;
            this.message.error(
              'Failed to get Inventory Sub category Records',
              ''
            );
          }
        },
        (err) => {

          if (err['status'] == 400) {
            this.dataList = [];
            this.loadingRecords = false;

            this.message.error('Invalid filter parameter', '');
          } else {
            this.dataList = [];
            this.loadingRecords = false;

            this.message.error(
              'Failed to get Inventory Sub category Records',
              ''
            );
          }

        }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Add New Inventory Sub Category';
    this.drawerData = new InventorySubCategory();

    // this.drawerData.IS_ACTIVE = true;

    this.api.getInventorySubCategory(1, 1, 'SEQ_NO', 'desc', '' + '').subscribe(
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

  // STATE_HAS_LWF = false;
  edit(data: InventorySubCategory): void {
    this.drawerTitle = 'Update Inventory Sub Category';
    this.drawerData = Object.assign({}, data);
    // this.STATE_HAS_LWF = false;

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length === 0) {
      this.dataList = [];
      this.search();
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

  operators: string[] = ['AND', 'OR'];
  // QUERY_NAME: string = '';
  showQueriesArray = [];

  /*******  Create filter query***********/

  public visiblesave = false;

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset() {
    this.subcategorynametext = '';
    this.descriptiontext = '';
    this.search();
  }

  isModalVisible = false;
  selectedQuery: string = '';

  filterFields: any[] = [
    {
      key: 'CATEGORY_NAME',
      label: 'Inventory Category Name',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Inventory Category Name',
    },
    {
      key: 'NAME',
      label: 'Inventory Subcategory Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],

      placeholder: 'Enter Inventory Subcategory Name',
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

  oldFilter: any[] = [];

  // filterQuery = '';

  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Inventory Subcategory Filter';
    // this.applyCondition = '';
    this.filterFields[0]['options'] = this.categoryData1;

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

  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  whichbutton: any;
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

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterloading: boolean = false;
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  TabId: number; // Ensure TabId is defined and initialized
  public commonFunction = new CommonFunctionService();

  isDeleting: boolean = false;

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

  selectedFilter: string | null = null;
  // filterQuery = '';

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
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  // profile photo
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
    let imagePath =
      this.api.retriveimgUrl + 'InventorySubcategoryIcons/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
}