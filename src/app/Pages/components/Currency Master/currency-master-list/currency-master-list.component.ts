import { Component } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CurrencyMaster } from 'src/app/Pages/Models/CurrencyMaster';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-currency-master-list',
  templateUrl: './currency-master-list.component.html',
  styleUrls: ['./currency-master-list.component.css'],
})
export class CurrencyMasterListComponent {
  drawerVisible: boolean = false;
  drawerData: CurrencyMaster = new CurrencyMaster();
  searchText: string = '';
  formTitle = 'Manage Currencies';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  isLoading = true;
  columns: string[][] = [
    ['CURRENCY_NAME', 'CURRENCY_NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['DECIMAL_SEPARATOR', 'DECIMAL_SEPARATOR'],
    ['THOUSAND_SEPERATOR', 'THOUSAND_SEPERATOR'],
    ['EXCHANGE_RATE', 'EXCHANGE_RATE'],
    ['DECIMAL_SPACE', 'DECIMAL_SPACE'],
    ['SYMBOL', 'SYMBOL'],
    ['SHORT_CODE', 'SHORT_CODE'],
    ['SEQ_NO', 'SEQ_NO'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  countryVisible: boolean = false;
  selectedCountries: number[] = [];
  decimalseleratorVisible: boolean = false;
  selectedDecimalSeperator: string[] = [];
  thousandseleratorVisible: boolean = false;
  selectedthousandSeperator: string[] = [];
  currencyName: string = '';
  visible = false;
  CURRvisible = false;
  exchangerate: string = '';
  toexchangerate: string = '';
  exchangeratevisible = false;
  decimalspace: string = '';
  decimalspacevisible = false;
  Symbol: string = '';
  symbolvisible = false;
  shortcode: string = '';
  shortcodevsible = false;
  seqno: string = '';
  seqnovisible = false;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showcloumnVisible: boolean = false;
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  isnameFilterApplied: boolean = false;
  iscountrynameFilterApplied: boolean = false;
  isdecimalspaceFilterApplied: boolean = false;
  issymbolFilterApplied: boolean = false;
  isshortcodeFilterApplied: boolean = false;
  isdecimalseperatorFilterApplied: boolean = false;
  isthousandseperateFilterApplied: boolean = false;
  isexchangerateFilterApplied: boolean = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Currency Name', value: 'CURRENCY_NAME' },
    { label: 'Country Name', value: 'COUNTRY_ID' },
    { label: 'Exchange Rate', value: 'EXCHANGE_RATE' },
    { label: 'Symbol', value: 'SYMBOL' },
    { label: 'Short Code', value: 'SHORT_CODE' },
    { label: 'Sequence No.', value: 'SEQ_NO' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  showcolumn = [
    { label: 'Exchange Rate', key: 'EXCHANGE_RATE', visible: true },
    { label: 'Short Code', key: 'SHORT_CODE', visible: true },
    { label: 'Sequence No.', key: 'SEQ_NO', visible: true },
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
  back() {
    this.router.navigate(['/masters/menu']);
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
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.currencyName.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.currencyName.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.seqno.length > 0 && event.key === 'Enter') {
      this.search();
    } else if (this.seqno.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.Symbol.length > 0 && event.key === 'Enter') {
      this.search();
      this.issymbolFilterApplied = true;
    } else if (this.Symbol.length == 0 && event.key === 'Backspace') {
      this.search();
      this.issymbolFilterApplied = false;
    }
    if (this.shortcode.length > 0 && event.key === 'Enter') {
      this.search();
      this.isshortcodeFilterApplied = true;
    } else if (this.shortcode.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isshortcodeFilterApplied = false;
    }
    if (this.decimalspace.length > 0 && event.key === 'Enter') {
      this.search();
      this.isdecimalspaceFilterApplied = true;
    } else if (this.decimalspace.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isdecimalspaceFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset(): void {
    this.searchText = '';
    this.currencyName = '';
    this.decimalspace = '';
    this.Symbol = '';
    this.shortcode = '';
    this.seqno = '';
    this.likeQuery1 = '';
    this.search();
  }
  DECIMAL_SEPARATOR = [
    { Id: '.', Name: 'Period (.)' },
    { Id: ',', Name: 'Comma (,)' },
    { Id: '_', Name: 'Underscore (_)' },
  ];
  THOUSAND_SEPERATOR = [
    { Id: '.', Name: 'Period (.)' },
    { Id: ',', Name: 'Comma (,)' },
  ];
  SYMBOL = [
    { Id: '$', Name: '$' },
    { Id: '€', Name: '€' },
    { Id: '£', Name: '£' },
    { Id: '¥', Name: '¥' },
    { Id: '₹', Name: '₹' },
    { Id: '₽', Name: '₽' },
    { Id: 'R$', Name: 'R$' },
    { Id: 'R', Name: 'R' },
    { Id: 'HK$', Name: 'HK$' },
    { Id: 'CHF', Name: 'CHF' },
  ];
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
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.iscountrynameFilterApplied = true; 
    } else {
      this.search();
      this.iscountrynameFilterApplied = false; 
    }
  }
  onDecimalSeleratorChange(): void {
    if (this.selectedDecimalSeperator?.length) {
      this.search();
      this.isdecimalseperatorFilterApplied = true; 
    } else {
      this.search();
      this.isdecimalseperatorFilterApplied = false; 
    }
  }
  onthousandSeleratorChange(): void {
    if (this.selectedthousandSeperator?.length) {
      this.search();
      this.isthousandseperateFilterApplied = true; 
    } else {
      this.search();
      this.isthousandseperateFilterApplied = false; 
    }
  }
  likeQuery1 = '';
  filteredCurrencyData: any[] = [];
  applyExchangeRateFilter() {
    const fromRate = parseFloat(this.exchangerate);
    const toRate = parseFloat(this.toexchangerate);
    if (fromRate > toRate) {
      this.message.error(
        'From exchange rate must be less than or equal to To exchange rate.',
        ''
      );
      return;
    }
    if (!fromRate || !toRate) {
      this.message.error('Please enter valid From and To exchange rates.', '');
      return;
    }
    this.likeQuery1 = `EXCHANGE_RATE BETWEEN ${fromRate} AND ${toRate}`;
    this.isexchangerateFilterApplied = true; 
    this.search();
  }
  onInputChange() {
    if (!this.exchangerate && !this.toexchangerate) {
      this.isexchangerateFilterApplied = false; 
      this.search();
    }
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(16, columnKey).subscribe(
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
  nameFilter() {
    if (this.currencyName.trim() === '') {
      this.searchText = '';
    } else if (this.currencyName.length >= 3) {
      this.search();
    } else {
    }
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
  decimalspaceFilter() {
    if (this.decimalspace.trim() === '') {
      this.searchText = '';
    } else if (this.decimalspace.length >= 3) {
      this.search();
    } else {
    }
  }
  symbolFilter() {
    if (this.Symbol.trim() === '') {
      this.searchText = '';
    } else if (this.Symbol.length >= 3) {
      this.search();
    } else {
    }
  }
  shortcodeFilter() {
    if (this.shortcode.trim() === '') {
      this.searchText = '';
    } else if (this.shortcode.length > 0) {
      this.search();
    } else {
    }
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
    if (this.currencyName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CURRENCY_NAME LIKE '%${this.currencyName.trim()}%'`;
    }
    if (this.exchangerate !== '' && this.toexchangerate !== '') {
      likeQuery += this.likeQuery1;
    } else {
    }
    if (this.decimalspace !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DECIMAL_SPACE LIKE '%${this.decimalspace.trim()}%'`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.selectedDecimalSeperator.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectedDecimalSeperator
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `DECIMAL_SEPARATOR IN (${formattedValues})`;
    }
    if (this.selectedthousandSeperator.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectedthousandSeperator
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `THOUSAND_SEPERATOR IN (${formattedValues})`;
    }
    if (this.Symbol !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `SYMBOL LIKE '%${this.Symbol.trim()}%'`;
    }
    if (this.shortcode !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SHORT_CODE LIKE '%${this.shortcode.trim()}%'`;
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
    const finalDataList =
      this.filteredCurrencyData.length > 0
        ? this.filteredCurrencyData
        : this.dataList;
    this.api
      .getCurrency(
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
  add(): void {
    this.drawerTitle = 'Add New Currency';
    this.drawerData = new CurrencyMaster();
    this.drawerVisible = true;
    this.api.getCurrency(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  edit(data: CurrencyMaster): void {
    this.drawerTitle = 'Update Currency';
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
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'Currency Filter';
    this.filterFields[1]['options'] = this.countryData;
    this.drawerFilterVisible = true;
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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
      key: 'CURRENCY_NAME',
      label: 'Currency Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Currency Name',
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
      key: 'EXCHANGE_RATE',
      label: 'Exchange Rate',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Exchange Rate',
    },
    {
      key: 'SYMBOL',
      label: 'Symbol',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Symbol',
    },
    {
      key: 'SHORT_CODE',
      label: 'Short Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Short Code',
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
  isDeleting: boolean = false;
  BtnDelete: any;
  ButtonDelete;
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
  isModalVisible = false; 
  selectedQuery: string = ''; 
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.getCountyData();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[1]['options'] = this.countryData;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
}
