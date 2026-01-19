import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-territory-master',
  templateUrl: './territory-master.component.html',
  styleUrls: ['./territory-master.component.css'],
})
export class TerritoryMasterComponent {
  drawerVisible: boolean = false;
  drawerData: TerritoryMaster = new TerritoryMaster();
  searchText: string = '';
  formTitle = 'Manage Territories';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  chapters: any = [];
  isLoading = true;
  drawerDataMaped: TerritoryMaster = new TerritoryMaster();
  drawerTitleMaped!: string;
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  roleid = sessionStorage.getItem('roleId'); 
  ROLE_ID: number;
  TabId: number;
  mappedterritory: any = [];
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['IS_EXPRESS_SERVICE_AVAILABLE', 'IS_EXPRESS_SERVICE_AVAILABLE'],
    ['SEQ_NO', 'SEQ_NO'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  drawerTitleSlots!: string;
  drawerDataSlots: TerritoryMaster = new TerritoryMaster();
  name: string = '';
  namevisible = false;
  seqno: string = '';
  seqvisible = false;
  countryVisible: boolean = false;
  selectedCountries: number[] = [];
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  ExpressServiceFilter: string | undefined = undefined;
  ExpressServicelistOfFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'NAME' },
    { label: 'Country Name', value: 'COUNTRY_ID' },
    {
      label: 'Is Express Service Available',
      value: 'IS_EXPRESS_SERVICE_AVAILABLE',
    },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  isFocused: string = '';
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
  }
  isnameFilterApplied: boolean = false;
  isseqnoFilterApplied: boolean = false;
  ismobileFilterApplied: boolean = false;
  mobilevisible = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.name.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.name.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.mobiletext.length > 0 && event.key === 'Enter') {
      this.search();
      this.ismobileFilterApplied = true;
    } else if (this.mobiletext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismobileFilterApplied = false;
    }
    if (this.seqno.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isseqnoFilterApplied = true;
    } else if (this.seqno.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseqnoFilterApplied = false;
    }
  }
  reset2() {
    this.mobiletext = '';
  }
  ngOnInit() {
    this.getCountyData();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
    const decryptedUserId1 = this.roleid
      ? this.commonFunction.decryptdata(this.roleid)
      : '0'; 
    this.ROLE_ID = Number(decryptedUserId1);
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(122, columnKey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.distinctData = data['data'];
        } else {
          this.distinctData = [];
          this.message.error('Failed To Get Distinct data Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
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
    if (this.selectedCountries?.length) {
      this.search();
      this.iscountryFilterApplied = true;
    } else {
      this.search();
      this.iscountryFilterApplied = false;
    }
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onExpressServiceChange(selectedExpressService: string) {
    this.ExpressServiceFilter = selectedExpressService;
    this.search(true);
  }
  mobiletext: string = '';
  mobileFilter() {
    if (this.mobiletext.trim() === '') {
      this.searchText = '';
    } else if (this.mobiletext.length >= 3) {
      this.search();
    } else {
    }
  }
  reset(): void {
    this.searchText = '';
    this.mobiletext = '';
    this.name = '';
    this.seqno = '';
    this.search();
  }
  search(reset: boolean = false) {
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
    if (this.name !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.name.trim()}%'`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUPPORT_CONTACT_NUMBER LIKE '%${this.mobiletext.trim()}%'`;
    }
    if (this.ExpressServiceFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_EXPRESS_SERVICE_AVAILABLE = ${this.ExpressServiceFilter}`;
    }
    if (this.seqno !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `SEQ_NO LIKE '%${this.seqno.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (this.ROLE_ID == 1 || this.ROLE_ID == 8) {
      this.api
        .getTeritory(
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
    } else {
      if (this.mappedterritory.length > 0) {
        this.api
          .getTeritory(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            likeQuery +
            this.filterQuery +
            ' AND ID IN(' +
            this.mappedterritory +
            ')'
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.TabId = data['TAB_ID'];
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
              } else {
                this.message.error('Something Went Wrong.', '');
              }
            }
          );
      } else {
        this.loadingRecords = false;
        this.dataList = [];
        this.totalRecords = 0;
      }
    }
  }
  add(): void {
    this.drawerTitle = 'Add New Territory ';
    this.drawerData = new TerritoryMaster();
    this.api.getTeritory(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        } else {
          this.message.error('Server Not Found', '');
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
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
    this.drawerVisible = true;
  }
  sort(params: NzTableQueryParams) {
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
    var userId = '';
    var userMainId = '';
    if (
      this.USER_ID != null &&
      this.USER_ID != undefined &&
      this.USER_ID != 0
    ) {
      userId = ' AND BACKOFFICE_ID=' + this.USER_ID;
      userMainId = ' AND USER_ID=' + this.USER_ID;
    } else {
      userId = '';
      userMainId = '';
    }
    if (this.ROLE_ID == 1 || this.ROLE_ID == 8) {
      this.search();
    } else {
      this.api
        .getBackOfficeData(0, 0, '', 'desc', ' AND IS_ACTIVE=1' + userMainId)
        .subscribe(
          (datat) => {
            if (datat['code'] == 200) {
              if (datat['count'] > 0) {
                this.api
                  .getBackofcTerritoryMappedData(
                    0,
                    0,
                    '',
                    'desc',
                    ' AND IS_ACTIVE=1 AND BACKOFFICE_ID=' +
                    datat['data'][0]['ID']
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] > 0) {
                          const territoryIds = data['data'].map(
                            (item) => item.TERITORY_ID
                          );
                          this.mappedterritory = territoryIds;
                          this.search();
                        } else {
                          this.mappedterritory = [];
                        }
                      } else {
                        this.mappedterritory = [];
                      }
                    },
                    (err: HttpErrorResponse) => {
                      this.mappedterritory = [];
                    }
                  );
              } else {
                this.mappedterritory = [];
              }
            } else {
              this.mappedterritory = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.mappedterritory = [];
          }
        );
    }
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: TerritoryMaster): void {
    this.drawerTitle = 'Update Territory';
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
  drawerPicodeVisible = false;
  drawerPicodeMappingClose(): void {
    this.search();
    this.drawerPicodeVisible = false;
  }
  get closePincodeMappingCallback() {
    return this.drawerPicodeMappingClose.bind(this);
  }
  PincodeMapping(data: any): void {
    this.drawerTitle = ` Map Pincodes to the ${data.NAME} Territory`;
    this.drawerData = Object.assign({}, data);
    this.drawerPicodeVisible = true;
  }
  parseExpectedTime(expectedTime: string): Date | null {
    if (!expectedTime) return null;
    const [hours, minutes, seconds] = expectedTime.split(':').map(Number);
    const now = new Date(); 
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    return now; 
  }
  widthsss: any = '100%';
  drawerserviceVisible = false;
  ServiceMapping(data: any): void {
    this.drawerTitle = `Manage Mapped Services to ${data.NAME} Territory`;
    this.drawerData = Object.assign({}, data);
    this.drawerserviceVisible = true;
  }
  drawerServiceMappingClose(): void {
    this.search();
    this.drawerserviceVisible = false;
  }
  get closeServiceMappingCallback() {
    return this.drawerServiceMappingClose.bind(this);
  }
  widthsSkill: string = '100%';
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
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'Territory Filter';
    this.filterFields[1]['options'] = this.countryData;
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
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Territory Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Territory Name',
    },
    {
      key: 'COUNTRY_NAME',
      label: 'Country',
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
      placeholder: 'Enter Country Name',
    },
    {
      key: 'SUPPORT_CONTACT_NUMBER',
      label: 'Support Contact No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Support Contact No.',
    },
    {
      key: 'IS_EXPRESS_SERVICE_AVAILABLE',
      label: 'Is Express Service Available ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Express Service Available ?',
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
  isModalVisible = false; 
  selectedQuery: string = ''; 
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  drawerserviceVisibleMaped: boolean = false;
  VieMappedServices(data: any): void {
    this.drawerTitleMaped = `View Service Details`;
    this.drawerDataMaped = Object.assign({}, data);
    this.drawerserviceVisibleMaped = true;
  }
  drawerServiceMappingCloseMaped(): void {
    this.search();
    this.drawerserviceVisibleMaped = false;
  }
  get closeServiceMappingCallbackMaped() {
    return this.drawerServiceMappingCloseMaped.bind(this);
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  public commonFunction = new CommonFunctionService();
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
  updateButton: any;
  updateBtn: any;
  whichbutton: any;
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[1]['options'] = this.countryData;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.EditQueryData = data;
    this.filterData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  drawerSlotsVisible = false;
  drawerSlotsMappingClose(): void {
    this.search();
    this.drawerSlotsVisible = false;
  }
  get closeSlotsMappingCallback() {
    return this.drawerSlotsMappingClose.bind(this);
  }
  MapTimeSLots(data: any): void {
    this.drawerTitleSlots = ` Map Time Slots to the ${data.NAME} Territory`;
    this.drawerDataSlots = Object.assign({}, data);
    this.drawerSlotsVisible = true;
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
  drawerServiceCalenderVisible = false;
  ServiceCalender(data: any): void {
    this.drawerTitle = `Manage Holidays to ${data.NAME} Territory`;
    this.drawerData = Object.assign({}, data);
    this.drawerServiceCalenderVisible = true;
  }
  drawercalendarClose(): void {
    this.search();
    this.drawerServiceCalenderVisible = false;
  }
}
