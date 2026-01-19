import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { InventoryCategoryData } from 'src/app/Inventorypages/inventorymodal/InventoryCategoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-inventory-category-master',
  templateUrl: './inventory-category-master.component.html',
  styleUrls: ['./inventory-category-master.component.css'],
})
export class InventoryCategoryMasterComponent {
  drawerVisible: boolean = false;
  drawerData: InventoryCategoryData = new InventoryCategoryData();
  searchText: string = '';
  formTitle = 'Manage Inventory Categories';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  chapters: any = [];
  isLoading = true;
  columns: string[][] = [
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['DESCRIPTION', 'DESCRIPTION'],
    ['SEQ_NO', 'SEQ_NO'],
    ['IS_ACTIVE', 'IS_ACTIVE'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  isFilterApplied: boolean = false;
  isDescriptionFilterApplied: boolean = false;
  isCategoryFilterApplied: boolean = false;
  categoryvisible = false;
  sequencevisible = false;
  descriptionvisible = false;
  categoryText: string = '';
  descriptiontext: string = '';
  sequenceText: string = '';
  statusFilter: string | undefined = undefined;
  filterClass: string = 'filter-invisible';
  isfilterapply: boolean = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  keyup(keys) {
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  reset(): void {
    this.searchText = '';
    this.categoryText = '';
    this.descriptiontext = '';
    this.sequenceText = '';
    this.search();
  }
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
  operators: string[] = ['AND', 'OR'];
  countryData: any = [];
  stateData: any = [];
  hide: boolean = true;
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
  filterQuery: string = '';
  QUERY_NAME: string = '';
  filterQuery1: any = '';
  INSERT_NAMES: any[] = [];
  restrictedKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'TRUNCATE',
    'ALTER',
    'CREATE',
    'RENAME',
    'GRANT',
    'REVOKE',
    'EXECUTE',
    'UNION',
    'HAVING',
    'WHERE',
    'ORDER BY',
    'GROUP BY',
    'ROLLBACK',
    'COMMIT',
    '--',
    ';',
    '',
  ];
  isModalVisible = false;
  selectedQuery: string = '';
  public visiblesave = false;
  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }
  createFilterQuery(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.isSpinner = true;
      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';
        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }
          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];
          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            this.query += this.query2;
          }
        }
        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }
      this.showquery = this.query;
      var newQuery = ' AND ' + this.query;
      this.filterQuery1 = newQuery;
      let sort = ''; 
      let filterQuery = '';
      this.api
        .getInventoryCategory(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.isSpinner = false;
            }
          },
          (err) => {
            if (err['ok'] === false) this.message.error('Server Not Found', '');
          }
        );
      this.QUERY_NAME = '';
    }
  }
  resetValues(): void {
    this.filterBox = [
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
    this.search();
  }
  search(reset: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
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
    if (this.categoryText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CATEGORY_NAME LIKE '%${this.categoryText.trim()}%'`;
    }
    if (this.descriptiontext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.descriptiontext.trim()}%'`;
    }
    if (this.sequenceText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SEQ_NO LIKE '%${this.sequenceText.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getInventoryCategory(
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
  categoryInputTimeout: any;
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onCategoryFilter() {
    if (this.categoryText.trim() === '') {
      this.searchText = ''; 
    } else if (this.categoryText.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onDescriptionFilter() {
    if (this.descriptiontext.trim() === '') {
      this.searchText = ''; 
      this.search(true); 
    } else if (this.descriptiontext.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onSequencenFilter() {
    if (this.sequenceText.trim() === '') {
      this.searchText = ''; 
      this.search(true); 
    } else if (this.sequenceText.length >= 1) {
      this.search();
    } else {
      this.message.warning('Please enter at least 1 characters to filter.', '');
    }
  }
  onKeyup(event: KeyboardEvent): void {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.categoryText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCategoryFilterApplied = true;
    } else if (this.categoryText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCategoryFilterApplied = false;
    }
    if (this.descriptiontext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isDescriptionFilterApplied = true;
    } else if (this.descriptiontext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isDescriptionFilterApplied = false;
    }
    if (this.sequenceText.length > 0 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.sequenceText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
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
  add(): void {
    this.drawerTitle = 'Add New Inventory Category ';
    this.drawerData = new InventoryCategoryData();
    this.drawerVisible = true;
    this.api.getInventoryCategory(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
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
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: InventoryCategoryData): void {
    this.drawerTitle = 'Update Inventory category';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  filterFields: any[] = [
    {
      key: 'CATEGORY_NAME',
      label: 'Category Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Category Name',
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
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Inventory category Filter';
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
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  TabId: number; 
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  filterloading: boolean = false;
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
  selectedFilter: string | null = null;
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
    this.isModalVisible = true; 
  }
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
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
    let imagePath = this.api.retriveimgUrl + 'InventoryCategoryIcons/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
}