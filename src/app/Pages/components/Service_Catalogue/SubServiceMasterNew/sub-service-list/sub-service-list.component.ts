import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { truncateSync } from 'fs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-sub-service-list',
  templateUrl: './sub-service-list.component.html',
  styleUrls: ['./sub-service-list.component.css'],
  providers: [DatePipe],
})
export class SubServiceListComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerData: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  searchText: string = '';
  formTitle = 'Manage Services';
  pageIndex = 1;
  pageSize = 19;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  chapters: any = [];
  isLoading = true;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  @Input() data: any = ServiceCatMasterDataNew;
  @Input() parentSerId: any;
  @Input() sername: any;
  @Input() drawerVisible1: boolean = false;
  @Input() closeCallbacksubservice: any = Function;
  drawerMappigVisible: boolean = false;
  drawerMappingTitle!: string;
  columns: string[][] = [
    ['DESCRIPTION', 'DESCRIPTION'],
    ['NAME', 'NAME'],
    ['SERVICE_NAME', 'SERVICE_NAME'],
  ];
  loadingRecords = false;
  totalRecords = 0;
  dataList: any = [];
  drawerTitle!: string;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showcloumnVisible: boolean = false;
  servicecattext: string = '';
  sercatnameVisible: boolean = false;
  servicecatdesctext: string = '';
  sercatdescVisible: boolean = false;
  B2Btext: string = '';
  b2bVisible: boolean = false;
  B2Ctext: string = '';
  b2cVisible: boolean = false;
  expresspriceb2b: string = '';
  expressb2bVisible: boolean = false;
  expresspriceb2c: string = '';
  expressb2cVisible: boolean = false;
  estimationTimemins: string = '';
  estimationTimeVisible: boolean = false;
  widths: string = '90%';
  widths1: string = '100%';
  selectedCategories: number[] = [];
  categoryVisible = false;
  selectedSubCategories: number[] = [];
  subcategoryVisible = false;
  showcolumn = [
    { label: 'Category', key: 'CATEGORY_ID', visible: true },
    { label: 'Subcategory', key: 'SUB_CATEGORY_ID', visible: true },
    { label: 'Service Name', key: 'NAME', visible: true },
    { label: 'Service Description', key: 'DESCRIPTION', visible: true },
    { label: 'Price B2B', key: 'B2B_PRICE', visible: true },
    { label: 'Price B2C', key: 'B2C_PRICE', visible: true },
    { label: 'Express Price For B2B', key: 'EXPRESS_COST', visible: true },
    { label: 'Estimation Time', key: 'DURATION', visible: true },
    { label: 'Catlogue Image', key: 'SERVICE_IMAGE', visible: true },
    { label: 'Status', key: 'STATUS', visible: true },
  ];
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
    private sanitizer: DomSanitizer,
    private router: Router,
    public datepipe: DatePipe
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onCategoryChange(): void {
    this.search();
  }
  onSubCategoryChange(): void {
    this.search();
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.search(true);
    this.getTaxData();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  draweMappingClose(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerMappigVisible = false;
  }
  mapSkill(data: any) {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerMappingTitle = `Map Skills to ${data.NAME} Service`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisible = true;
  }
  get closeCallbackMapping() {
    return this.draweMappingClose.bind(this);
  }
  CategoryData: any = [];
  getcategoryData() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CategoryData = data['data'];
        } else {
          this.CategoryData = [];
          this.message.error('Failed To Get Category Data', '');
        }
      },
      () => {
      }
    );
  }
  SubCategoryData: any = [];
  getsubcategoryData() {
    this.api.getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.SubCategoryData = data['data'];
        } else {
          this.SubCategoryData = [];
          this.message.error('Failed To Get Subategory Data', '');
        }
      },
      () => {
      }
    );
  }
  keyup(event: KeyboardEvent): void {
    if (this.searchText.length > 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeypressEvent(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && keys.key == 'Backspace') {
      this.search(true);
    }
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.dataList = [];
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
    var globalSearchQuery = '';
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
    if (this.servicecattext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.servicecattext.trim()}%'`;
    }
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; 
    }
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUB_CATEGORY_ID IN (${this.selectedSubCategories.join(
        ','
      )})`; 
    }
    if (this.servicecatdesctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.servicecatdesctext.trim()}%'`;
    }
    if (this.B2Btext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2B_PRICE LIKE '%${this.B2Btext.trim()}%'`;
    }
    if (this.B2Ctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2C_PRICE LIKE '%${this.B2Ctext.trim()}%'`;
    }
    if (this.expresspriceb2b !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EXPRESS_COST LIKE '%${this.expresspriceb2b.trim()}%'`;
    }
    if (this.estimationTimemins !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DURATION LIKE '%${this.estimationTimemins.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS= ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    this.api
      .getServiceItem(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
        ' AND IS_FOR_B2B = 0 AND PARENT_ID=' +
        this.parentSerId +
        this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = [...this.dataList, ...data['data']];
            this.dataList.forEach((item) => {
              item.SERVICE_IMAGE = `${item.SERVICE_IMAGE
                }?t=${new Date().getTime()}`;
            });
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.totalRecords = 0;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.totalRecords = 0;
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          this.totalRecords = 0;
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
  loadMore() {
    this.pageIndex += 1;
    this.search();
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
  parentId: any;
  dataMain: any = [];
  add(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.parentId = this.parentSerId;
    this.drawerTitle = 'Add New Sub Service';
    this.dataMain = this.data;
    this.drawerData = new ServiceCatMasterDataNew();
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search(true);
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  close() {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.closeCallbacksubservice();
  }
  edit(data: ServiceCatMasterDataNew): void {
    this.drawerTitle = 'Update Sub Service';
    this.parentId = this.parentSerId;
    this.dataMain = this.data;
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerData = Object.assign({}, data);
    if (
      this.drawerData.START_TIME != undefined &&
      this.drawerData.START_TIME != null &&
      this.drawerData.START_TIME != ''
    ) {
      const today = new Date();
      const timeParts = this.drawerData.START_TIME.split(':'); 
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.START_TIME = new Date(today);
      }
    }
    if (
      this.drawerData.END_TIME != undefined &&
      this.drawerData.END_TIME != null &&
      this.drawerData.END_TIME != ''
    ) {
      const today = new Date();
      const timeParts = this.drawerData.END_TIME.split(':'); 
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.END_TIME = new Date(today);
      }
    }
    this.drawerVisible = true;
  }
  reset(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.searchText = '';
    this.servicecattext = '';
    this.servicecatdesctext = '';
    this.expresspriceb2b = '';
    this.expresspriceb2c = '';
    this.search();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  isfilterapply: boolean = false;
  filterQuery: string = '';
  visible = false;
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
      selectedColumn === 'CATEGORY_ID' ||
      selectedColumn === 'SUB_CATEGORY_ID' ||
      selectedColumn === 'STATUS'
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
  columns1: { label: string; value: string }[] = [
    { label: 'Category', value: 'CATEGORY_ID' },
    { label: 'Sub Category', value: 'SUB_CATEGORY_ID' },
    { label: 'Service Name', value: 'NAME' },
    { label: 'Service Description', value: 'DESCRIPTION' },
    { label: 'Price B2B (₹)', value: 'B2B_PRICE' },
    { label: 'Price B2C (₹)', value: 'B2C_PRICE' },
    { label: 'Express Price For B2B (₹)', value: 'EXPRESS_COST' },
    { label: 'Estimation Time (mins)', value: 'DURATION' },
    { label: 'Status', value: 'STATUS' },
  ];
  filterClass: string = 'filter-invisible';
  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;
  conditions: any[] = [];
  operators: string[] = ['AND', 'OR'];
  showQueriesArray = [];
  public visiblesave = false;
  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  isModalVisible = false; 
  selectedQuery: string = ''; 
  ViewImage: any;
  ImageModalVisible = false;
  imageshow;
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'ServiceCatalog/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  drawerVisibleDesigner: boolean = false;
  dataDesigner: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  drawerTitleDesigner!: string;
  widths11: string = '60%';
  widthsSkill: string = '100%';
  opendetailsDrawer(data: ServiceCatMasterDataNew) {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerTitleDesigner = 'Add Details of ' + data.NAME;
    this.drawerVisibleDesigner = true;
    this.dataDesigner = Object.assign({}, data);
  }
  drawerClosedesigner(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerVisibleDesigner = false;
  }
  get closeCallbacksubDesigner() {
    return this.drawerClosedesigner.bind(this);
  }
  drawerMappigVisibleHelp: boolean = false;
  drawerMappingTitleHelp!: string;
  draweMappingCloseHelp(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerMappigVisibleHelp = false;
  }
  widthsDoc: any = '100%';
  HelpDocMap(data: any) {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerMappingTitleHelp = `Map Help Documents To ${data.NAME} Service`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisibleHelp = true;
  }
  get HelpcloseCallbackMapping() {
    return this.draweMappingCloseHelp.bind(this);
  }
  drawerserviceVisibleMaped: boolean = false;
  drawerDataMaped: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  drawerTitleMaped!: string;
  widthsss: any = '100%';
  serviceid: any;
  VieMappedServices(data: any): void {
    this.drawerTitleMaped = `View Service Logs`;
    this.serviceid = data.ID;
    this.drawerDataMaped = Object.assign({}, data);
    this.drawerserviceVisibleMaped = true;
  }
  drawerServiceMappingCloseMaped(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerserviceVisibleMaped = false;
  }
  get closeServiceMappingCallbackMaped() {
    return this.drawerServiceMappingCloseMaped.bind(this);
  }
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
  taxData: any = [];
  getTaxData() {
    this.api
      .getTaxData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.taxData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  openfilter() {
    this.drawerTitle = 'Subservice Filter';
    this.applyCondition = '';
    this.filterFields[1]['options'] = this.taxData;
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
    this.filterFields[1]['options'] = this.taxData;
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'SERVICE_TYPE',
      label: 'Service Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'B', display: 'B2B' },
        { value: 'C', display: 'B2C' },
        { value: 'O', display: 'Both' },
      ],
      placeholder: 'Select Service Type',
    },
    {
      key: 'TAX_ID',
      label: 'Tax Slab',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Tax Slab',
    },
    {
      key: 'IS_EXPRESS',
      label: 'Is Express Service Available?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Is Express Service Available?',
    },
    {
      key: 'IS_JOB_CREATED_DIRECTLY',
      label: 'Is Job Created Directly?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Is Job Created Directly?',
    },
    {
      key: 'IS_NEW',
      label: 'Is New?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Select Is New?',
    },
    {
      key: 'START_TIME',
      label: 'Start Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Start Time',
    },
    {
      key: 'END_TIME',
      label: 'End Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter End Time',
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
      placeholder: 'Select Status',
    },
  ];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
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
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
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
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number;
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  drawerfilterClose(buttontype, updateButton) {
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
  drawerratingVisible = false;
  viewratings(data): void {
    this.drawerTitle = 'View Ratings';
    this.drawerData = Object.assign({}, data);
    this.drawerratingVisible = true;
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
  }
  ratingdrawerClose(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerratingVisible = false;
  }
  get ratingcloseCallback() {
    return this.ratingdrawerClose.bind(this);
  }
}
