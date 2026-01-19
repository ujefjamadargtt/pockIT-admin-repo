import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { paymentgateway } from 'src/app/Pages/Models/paymentgateway';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-payment-gateway-master',
  templateUrl: './payment-gateway-master.component.html',
  styleUrls: ['./payment-gateway-master.component.css'],
})
export class PaymentGatewayMasterComponent {
  drawerVisible: boolean = false;
  drawerData: paymentgateway = new paymentgateway();
  searchText: string = '';
  formTitle = 'Manage Payment Gateways';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  isLoading = true;
  columns: string[][] = [
    ['GATEWAY_NAME', 'GATEWAY_NAME'],
    ['GATEWAY_TYPE', 'GATEWAY_TYPE'],
    ['API_KEY', 'API_KEY'],
    ['API_SECRET', 'API_SECRET'],
    ['MERCHANT_ID', 'MERCHANT_ID'],
    ['ENDPOINT_URL', 'ENDPOINT_URL'],
    ['WEBHOOK_URL', 'WEBHOOK_URL'],
    ['SUPPORTED_CURRENCIES', 'SUPPORTED_CURRENCIES'],
    ['IS_ACTIVE', 'IS_ACTIVE'],
    ['MODE', 'MODE'],
    ['ENCRYPTION_KEY', 'ENCRYPTION_KEY'],
    ['SETTLEMENT_TIME', 'SETTLEMENT_TIME'],
    ['MIN_AMOUNT', 'MIN_AMOUNT'],
    ['MAX_AMOUNT', 'MAX_AMOUNT'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  GatewayName: string = '';
  GatewayType: string = '';
  apikey: string = '';
  apisecret: string = '';
  endpointurl: string = '';
  webhookurl: string = '';
  encryptionkey: string = '';
  merchant: string = '';
  settlementtime: string = '';
  mode: string = '';
  currency: any = [];
  currencyvisible: boolean = false;
  gatewayvisible = false;
  gatewaytypevisible = false;
  apikeyvisible = false;
  apisecretvisible = false;
  merchantvisible = false;
  endpointvisible = false;
  webhookvisible = false;
  encryptionkeyvisible = false;
  showcloumnVisible = false;
  timevisible = false;
  modevisible = false;
  isnameFilterApplied = false;
  istypeFilterApplied = false;
  isapikeyFilterApplied = false;
  isapisecretFilterApplied = false;
  ismerchantFilterApplied = false;
  isendpointFilterApplied = false;
  iswebhookFilterApplied = false;
  iscurrenciesFilterApplied = false;
  isencryptionkeyFilterApplied = false;
  istimeFilterApplied = false;
  ismodeFilterApplied = false;
  minamountvisible = false;
  maxamoutvisible = false;
  isminamountFilterApplied = false;
  ismaxamountFilterApplied = false;
  selectedFilter: string | null = null;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfModes: any[] = [
    { text: 'Test', value: '1' },
    { text: 'Live', value: '0' },
  ];
  listOfTimes: any[] = [
    { text: 'Same Days', value: '1' },
    { text: '1-2 Days', value: '0' },
    { text: '3-5 Days', value: '0' },
  ];
  searchCurrencies(): void {
    this.searchText = '';
    this.search();
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Gateway Name', value: 'GATEWAY_NAME' },
    { label: 'Gateway Type', value: 'GATEWAY_TYPE' },
    { label: 'Api Key', value: 'API_KEY' },
    { label: 'Api Secret', value: 'API_SECRET' },
    { label: 'Merchant', value: 'MERCHANT_ID' },
    { label: 'Endpoint Url', value: 'ENDPOINT_URL' },
    { label: 'Webhook Url', value: 'WEBHOOK_URL' },
    { label: 'Supported Currencies', value: 'SUPPORTED_CURRENCIES' },
    { label: 'Status', value: 'IS_ACTIVE' },
    { label: 'Mode', value: 'MODE' },
    { label: 'Encryption Key', value: 'ENCRYPTION_KEY' },
    { label: 'Settlement Time', value: 'SETTLEMENT_TIME' },
    { label: 'Min Amount', value: 'MIN_AMOUNT' },
    { label: 'Max Amount', value: 'MAX_AMOUNT' },
  ];
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  showcolumn = [
    { label: 'Gateway Name', key: 'GATEWAY_NAME', visible: true },
    { label: 'Gateway Type', key: 'GATEWAY_TYPE', visible: true },
    { label: 'Api Key', key: 'API_KEY', visible: true },
    { label: 'Api Secret', key: 'API_SECRET', visible: true },
    { label: 'Endpoint Url', key: 'ENDPOINT_URL', visible: true },
    { label: 'Merchant', key: 'MERCHANT_ID', visible: true },
    { label: 'Webhook Url', key: 'WEBHOOK_URL', visible: true },
    { label: 'Supported Currencies', key: 'CURRENCY_NAME', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true },
    { label: 'Mode', key: 'MODE', visible: true },
    { label: 'Encryption Keys', key: 'ENCRYPTION_KEY', visible: true },
    { label: 'Min Amount', key: 'MIN_AMOUNT', visible: true },
    { label: 'Max Amount', key: 'MAX_AMOUNT', visible: true },
    { label: 'Settlement Time', key: 'SETTLEMENT_TIME', visible: true },
  ];
  TimeData = [
    { value: 'same-day', label: 'Same Day' },
    { value: '1-2 days', label: '1-2 Days' },
    { value: '3-5 days', label: '3-5 Days' },
  ];
  ModeData = [
    { value: 'Test', label: 'Test' },
    { value: 'Live', label: 'Live' },
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
    private router: Router
  ) { }
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
  }
  minamount: string = '';
  maxamount: string = '';
  minamountFilter() {
    if (this.minamount === '') {
      this.searchText = ''; 
    } else if (this.minamount.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  maxamountFilter() {
    if (this.maxamount === '') {
      this.searchText = ''; 
    } else if (this.maxamount.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.GatewayName.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.GatewayName.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.GatewayType.length >= 3 && event.key === 'Enter') {
      this.search();
      this.istypeFilterApplied = true;
    } else if (this.GatewayType.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istypeFilterApplied = false;
    }
    if (this.apikey.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isapikeyFilterApplied = true;
    } else if (this.apikey.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isapikeyFilterApplied = false;
    }
    if (this.apisecret.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isapisecretFilterApplied = true;
    } else if (this.apisecret.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isapisecretFilterApplied = false;
    }
    if (this.merchant.length >= 3 && event.key === 'Enter') {
      this.search();
      this.ismerchantFilterApplied = true;
    } else if (this.apisecret.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismerchantFilterApplied = false;
    }
    if (this.endpointurl.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isendpointFilterApplied = true;
    } else if (this.endpointurl.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isendpointFilterApplied = false;
    }
    if (this.webhookurl.length >= 3 && event.key === 'Enter') {
      this.search();
      this.iswebhookFilterApplied = true;
    } else if (this.webhookurl.length == 0 && event.key === 'Backspace') {
      this.search();
      this.iswebhookFilterApplied = false;
    }
    if (this.encryptionkey.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isencryptionkeyFilterApplied = true;
    } else if (this.encryptionkey.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isencryptionkeyFilterApplied = false;
    }
    if (this.settlementtime.length > 0 && event.key === 'Enter') {
      this.search();
      this.istimeFilterApplied = true;
    } else if (this.encryptionkey.length == 0 && event.key === 'Backspace') {
      this.search();
      this.istimeFilterApplied = false;
    }
    if (this.minamount.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isminamountFilterApplied = true;
    } else if (this.minamount.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isminamountFilterApplied = false;
    }
    if (this.maxamount.length >= 3 && event.key === 'Enter') {
      this.search();
      this.ismaxamountFilterApplied = true;
    } else if (this.maxamount.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismaxamountFilterApplied = false;
    }
  }
  gatewayNameFilter() {
    if (this.GatewayName.trim() === '') {
      this.searchText = ''; 
    } else if (this.GatewayName.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  gatewayTypeeFilter() {
    if (this.GatewayType.trim() === '') {
      this.searchText = ''; 
    } else if (this.GatewayType.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  apiKeyFilter() {
    if (this.apikey.trim() === '') {
      this.searchText = ''; 
    } else if (this.apikey.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  merchantFilter() {
    if (this.merchant.trim() === '') {
      this.searchText = ''; 
    } else if (this.merchant.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  apiSecretFilter() {
    if (this.apisecret.trim() === '') {
      this.searchText = ''; 
    } else if (this.apisecret.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  endpointurlFilter() {
    if (this.endpointurl.trim() === '') {
      this.searchText = ''; 
    } else if (this.endpointurl.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  webhookurlFilter() {
    if (this.webhookurl.trim() === '') {
      this.searchText = ''; 
    } else if (this.webhookurl.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  encryptionKeyFilter() {
    if (this.encryptionkey.trim() === '') {
      this.searchText = ''; 
    } else if (this.encryptionkey.length >= 3) {
      this.search();
    } else {
      this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  settlementtimeFilter() {
    if (this.settlementtime.trim() === '') {
      this.searchText = ''; 
    } else if (this.settlementtime.length > 0) {
      this.search();
    } else {
    }
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onCategoryChange(): void {
    this.search();
  }
  reset(): void {
    this.searchText = '';
    this.GatewayName = '';
    this.GatewayType = '';
    this.apikey = '';
    this.apisecret = '';
    this.merchant = '';
    this.endpointurl = '';
    this.webhookurl = '';
    this.currency = '';
    this.encryptionkey = '';
    this.settlementtime = '';
    this.mode = '';
    this.search();
  }
  onSearchKeyUp(): void {
    if (this.searchText.length >= 3 || this.searchText.length === 0) {
      this.search();
    } else {
    }
  }
  TabId: number;
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
    if (this.GatewayName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `GATEWAY_NAME LIKE '%${this.GatewayName.trim()}%'`;
    }
    if (this.GatewayType !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `GATEWAY_TYPE LIKE '%${this.GatewayType.trim()}%'`;
    }
    if (this.apikey !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `API_KEY LIKE '%${this.apikey.trim()}%'`;
    }
    if (this.apisecret !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `API_SECRET LIKE '%${this.apisecret.trim()}%'`;
    }
    if (this.merchant !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MERCHANT_ID LIKE '%${this.merchant.trim()}%'`;
    }
    if (this.endpointurl !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ENDPOINT_URL LIKE '%${this.endpointurl.trim()}%'`;
    }
    if (this.webhookurl !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WEBHOOK_URL LIKE '%${this.webhookurl.trim()}%'`;
    }
    if (
      this.currency !== '' &&
      this.currency != null &&
      this.currency != undefined &&
      this.currency.length > 0
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SUPPORTED_CURRENCIES LIKE '%${this.currency}%'`;
      this.iscurrenciesFilterApplied = true;
    }
    else {
      this.iscurrenciesFilterApplied = false;
    }
    if (this.encryptionkey !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ENCRYPTION_KEY LIKE '%${this.encryptionkey.trim()}%'`;
    }
    if (
      this.settlementtime !== '' &&
      this.settlementtime != null &&
      this.settlementtime != undefined
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SETTLEMENT_TIME LIKE '%${this.settlementtime.trim()}%'`;
    }
    if (this.mode !== '' && this.mode != null && this.mode != undefined) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `MODE LIKE '%${this.mode.trim()}%'`;
      this.ismodeFilterApplied = true;
    }
    else {
      this.ismodeFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getPaymentGatewayData(
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
            this.TabId = data['TAB_ID'];
            this.totalRecords = data['count'];
            this.dataList = data['data'];
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
  ngOnInit() {
    this.getCurrencyData();
  }
  CurrencyData: any[] = []; 
  add(): void {
    this.drawerTitle = 'Add New Payment Gateway';
    this.drawerData = new paymentgateway();
    this.drawerVisible = true;
    this.drawerVisible = true;
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
  edit(data: paymentgateway): void {
    this.drawerTitle = 'Update Payment Gateway';
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
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
      selectedColumn === 'MODE' ||
      selectedColumn === 'SETTLEMENT_TIME'
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
  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
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
    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else {
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
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
  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]['FILTER'].length - 1;
    if (
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == '' ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == undefined ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == null
    ) {
      isOk = false;
      this.message.error('Please check some fields are empty', '');
    } else if (
      i != 0 &&
      (this.filterBox[i]['CONDITION'] == undefined ||
        this.filterBox[i]['CONDITION'] == null ||
        this.filterBox[i]['CONDITION'] == '')
    ) {
      isOk = false;
      this.message.error('Please select operator.', '');
    }
    if (isOk) {
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
  }
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
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
        .getPaymentGatewayData(
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
  getCurrencyData() {
    this.api.getCurrency(0, 0, '', '', ' AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] === 200) {
          this.CurrencyData = data['data']; 
        } else {
          this.CurrencyData = [];
          this.message.error('Failed To Get Currency Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
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
  public visiblesave = false;
  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }
  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  Insertname() {
    if (this.QUERY_NAME.trim()) {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      this.visiblesave = false;
      this.QUERY_NAME = ''; 
    } else {
    }
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
  handleCancelTop(): void {
    this.visiblesave = false;
  }
  handleOkTop(): void {
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
    }
    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '');
    } else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      this.visiblesave = false;
      this.QUERY_NAME = ''; 
    }
    this.visiblesave = false;
  }
  isModalVisible = false; 
  selectedQuery: string = ''; 
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
  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }
  filterFields: any[] = [
    {
      key: 'GATEWAY_NAME',
      label: 'Gateway Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Gateway Name',
    },
    {
      key: 'GATEWAY_TYPE',
      label: 'Gateway Type',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Gateway Type',
    },
    {
      key: 'API_KEY',
      label: 'Api Key',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Api Key',
    },
    {
      key: 'API_SECRET',
      label: 'Api Secret',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Api Secret',
    },
    {
      key: 'MERCHANT_ID',
      label: 'Merchant',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Merchabt Id',
    },
    {
      key: 'ENDPOINT_URL',
      label: 'Endpoint Url',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Endpoint Url',
    },
    {
      key: 'WEBHOOK_URL',
      label: 'Webhookm Url',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Webhook Url',
    },
    {
      key: 'ENCRYPTION_KEY',
      label: 'Encryption Key',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Encryption Key',
    },
    {
      key: 'MIN_AMOUNT',
      label: 'Minimum Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Webhook Url',
    },
    {
      key: 'MAX_AMOUNT',
      label: 'Maximum Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Webhook Url',
    },
    {
      key: 'SETTLEMENT_TIME',
      label: 'Settlement Time',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Webhook Url',
    },
  ];
  oldFilter: any[] = [];
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  filterloading: boolean = false;
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
          else {
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
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  currentClientId = 1; 
  openfilter() {
    this.drawerTitle = 'Payment Gateway Filter';
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
    this.drawerFilterVisible = true;
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  savedFilters: any[] = [];
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
}