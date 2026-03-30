import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { WalletTransactionData } from 'src/app/Pages/Models/walletTransaction';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css'],
})
export class WalletListComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
  ) { }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Manage Wallet Transactions';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  walletlist: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['TERRITORY_NAME', 'Territory Name'],
    ['WALLET_AMOUNT', 'Wallet Amount'],
  ];
  date: Date[] = [];
  customer: any = [];
  isFocused: any;
  drawerTitle = 'Add Wallet Transaction';
  drawerData: WalletTransactionData = new WalletTransactionData();
  drawervisible = false;
  searchkey = '';
  drawerCountryMappingVisible = false;
  Seqtext: any;
  savingNewWalletTransaction = false;
  savingNew1WalletTransaction = false;
  filterGroups: any[] = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: { field: '', comparator: '', value: '' },
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
          condition: { field: '', comparator: '', value: '' },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  isTextOverflow = false;
  showConfirmationModal: boolean = false;
  confirmationMessage: string = '';
  private pendingAddNew: boolean = false;
  private pendingForm: NgForm;
  private pendingSaveAndNew: boolean = false;
  territory_name: any;
  expiry_days: boolean = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) tooltip.show();
    else tooltip.hide();
  }
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') this.search(true);
    else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    (event as KeyboardEvent).preventDefault();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isFilterApplied = false;
  isShortApplied = false;
  isSeqApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.territoryTEXT.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.territoryTEXT.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
  }
  onKeyDown(event: KeyboardEvent) {
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Shift', 'Control', 'Alt'];
    if (controlKeys.includes(event.key)) {
      return;
    }
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
  showMaxInfoMessage(): boolean {
    if ((this.walletTransactionData.TRANSACTION_TYPE === 'AT' ||
      this.walletTransactionData.TRANSACTION_TYPE === 'PR') &&
      this.drData?.WALLET_AMOUNT) {
      return this.walletTransactionData.WALLET_AMOUNT >= this.drData.WALLET_AMOUNT;
    }
    return false;
  }
  onAmountInput(event: any) {
    const value = parseInt(event.target.value);
    if (this.walletTransactionData.TRANSACTION_TYPE === 'AT' ||
      this.walletTransactionData.TRANSACTION_TYPE === 'PR') {
      if (value > this.drData.WALLET_AMOUNT) {
        const maxValue = Math.floor(this.drData.WALLET_AMOUNT);
        event.target.value = maxValue;
        this.defaultAmountData.WALLET_AMOUNT = maxValue;
        this.walletTransactionData.WALLET_AMOUNT = maxValue;
      }
    }
  }
  onDaysInput(event: any) {
    const value = parseFloat(event.target.value);
    if (value > 999) {
      event.target.value = 999;
      this.walletTransactionData.EXPIRY_DAYS = 999;
    }
  }
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) return;
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch {
      sort = '';
    }
    var likeQuery = `TYPE IN ('PR', 'AT', 'RF') `;
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((c) => `${c[0]} like '%${this.searchText}%'`)
          .join(' OR ') +
        ')';
    }
    if (this.territoryTEXT !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TERRITORY_NAME LIKE '%${this.territoryTEXT.trim()}%'`;
    }
    let dateQuery = '';
    if (this.date && this.date.length === 2) {
      const [startDate, endDate] = this.date;
      dateQuery += ` AND DATE(TRANSACTION_DATE) BETWEEN '${startDate.toISOString().split('T')[0]}' AND '${endDate.toISOString().split('T')[0]}'`;
    }
    if (this.transactiontypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TYPE = '${this.transactiontypeFilter}'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllWalletlist(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + dateQuery,
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.walletlist = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.walletlist = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.walletlist = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0)
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              '',
            );
          else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else this.message.error('Something Went Wrong.', '');
        },
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
  drawerClose(): void {
    this.search();
    this.walletDrawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  close() {
    this.drawervisible = false;
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }
  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }
  edit(data: WalletTransactionData): void {
    this.drawerTitle = 'Wallet Transaction History';
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
  }
  add(): void {
    this.drawerTitle = 'Add New Wallet Transaction';
    this.drawerData = new WalletTransactionData();
    this.drawervisible = true;
  }
  territoryTEXT: string = '';
  territoryVisible = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;
  reset(): void {
    this.searchText = '';
    this.territoryTEXT = '';
    this.Shortcodetext = '';
    this.search();
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfFilter1: any[] = [
    { text: 'Admin Topup', value: 'AT' },
    { text: 'Promotional', value: 'PR' },
    { text: 'Refund', value: 'RF' },
  ];
  transactiontypeFilter: string | undefined = undefined;
  transactiontypeFilterChange(selectedStatus: string) {
    this.transactiontypeFilter = selectedStatus;
    this.search(true);
  }
  dataList: any = [];
  filterQuery: string = '';
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  showMainFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  drawerFilterVisible: boolean = false;
  orderData: any;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  applyCondition: any;
  drawerfilterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  openfilter() {
    this.drawerTitle = 'Wallet Filter';
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
            condition: { field: '', comparator: '', value: '' },
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
            condition: { field: '', comparator: '', value: '' },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`,
      )
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') sessionStorage.removeItem('ID');
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (el) =>
                    Number(el.ID) === Number(sessionStorage.getItem('ID')),
                );
                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA')
                  this.applyfilter(this.savedFilters[0]);
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
        () => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        },
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
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter((f) => f.ID !== item.ID);
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';
          this.loadFilters();
          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.isfilterapply = false;
            this.search(true);
          } else this.isfilterapply = true;
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0)
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            '',
          );
        else this.message.error('Something Went Wrong.', '');
      },
    );
  }
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  drawerflterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
    this.whichbutton = buttontype;
    this.updateBtn = updateButton;
    if (buttontype == 'SA') this.loadFilters();
    else if (buttontype == 'SC') this.loadFilters();
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'TERRITORY_NAME',
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
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  isLoading = false;
  selectedFilter: string | null = null;
  isModalVisible = false;
  selectedQuery: string = '';
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  savedFilters: any[] = [];
  currentClientId = 1;
  filterloading: boolean = false;
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    this.search();
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
  isDefaultAmountModalVisible = false;
  savingDefaultAmount = false;
  defaultAmoutnLoader = false;
  crData: any = null;
  drData: any = null;
  defaultAmountData: {
    ID?: number;
    WALLET_AMOUNT: any;
    STATUS: number;
    EXPIRY_DAYS: any;
    TYPE: string;
  } = { WALLET_AMOUNT: null, STATUS: 1, EXPIRY_DAYS: null, TYPE: 'CR' };
  openDefaultAmountModal(): void {
    this.getDefaultAmountData();
    this.isDefaultAmountModalVisible = true;
  }
  getDefaultAmountData(): void {
    const payload = {
      pageIndex: 0,
      pageSize: 0,
      sortKey: 'ID',
      sortValue: '',
      filter: '',
    };
    this.defaultAmoutnLoader = true;
    this.api.defaultWalletTransactionGet(payload).subscribe(
      (res: any) => {
        if (res.code == '200') {
          const data = res.data || [];
          this.crData = data.find((x: any) => x.TYPE === 'CR') || null;
          this.drData = data.find((x: any) => x.TYPE === 'DR') || null;
          this.setFormData('CR');
          this.defaultAmoutnLoader = false;
        } else {
          this.defaultAmoutnLoader = false;
          this.message.error('Failed To Get Default Amounts', '');
        }
      },
      () => {
        this.defaultAmoutnLoader = false;
        this.message.error('Something went wrong', '');
      }
    );
  }
  setFormData(type: string) {
    this.defaultAmountData.TYPE = type;
    let selected = type === 'CR' ? this.crData : this.drData;
    if (selected) {
      this.defaultAmountData = {
        WALLET_AMOUNT: selected?.WALLET_AMOUNT
          ? Number(selected.WALLET_AMOUNT)
          : null,
        STATUS: selected?.STATUS ?? 1,
        EXPIRY_DAYS: type === 'CR'
          ? selected?.EXPIRY_DAYS ?? null
          : null,
        TYPE: type
      };
    }
    else {
      this.defaultAmountData = {
        WALLET_AMOUNT: null,
        STATUS: 1,
        EXPIRY_DAYS: null,
        TYPE: type
      };
    }
  }
  onTypeChange(type: string) {
    this.setFormData(type);
  }
  closeDefaultAmountModal(): void {
    this.isDefaultAmountModalVisible = false;
  }
  isValidDefaultAmountData = true;
  saveDefaultAmount(): void {
    this.isValidDefaultAmountData = true;
    if (
      !this.defaultAmountData.WALLET_AMOUNT ||
      this.defaultAmountData.WALLET_AMOUNT < 1 ||
      this.defaultAmountData.WALLET_AMOUNT > 9999
    ) {
      this.isValidDefaultAmountData = false;
      this.message.error('Please enter a valid amount.', '');
      return;
    }
    if (this.defaultAmountData.TYPE === 'CR') {
      if (
        !this.defaultAmountData.EXPIRY_DAYS ||
        this.defaultAmountData.EXPIRY_DAYS < 1 ||
        this.defaultAmountData.EXPIRY_DAYS > 999
      ) {
        this.isValidDefaultAmountData = false;
        this.message.error('Please enter a valid expiry day.', '');
        return;
      }
    }
    if (this.defaultAmountData.TYPE === 'DR') {
      this.defaultAmountData.EXPIRY_DAYS = null;
    }
    if (this.isValidDefaultAmountData) {
      this.savingDefaultAmount = true;
      this.api.saveDefaultWalletAmount(this.defaultAmountData).subscribe(
        (res) => {
          this.savingDefaultAmount = false;
          if (res['code'] === 200) {
            this.message.success(
              'Default registration amount saved successfully.',
              '',
            );
            this.closeDefaultAmountModal();
          } else {
            this.message.error('Failed to save. Please try again.', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.savingDefaultAmount = false;
          if (err.status === 0)
            this.message.error(
              'Unable to connect. Please check your connection.',
              '',
            );
          else this.message.error('Something Went Wrong.', '');
        },
      );
    } else {
      this.isValidDefaultAmountData = false;
      this.message.error('Please select the all required fields.', '');
    }
  }
  saveWalletTransactionol(action: 'close' | 'new'): void {
    if (!this.walletTransactionData.TERRITORY_ID) {
      this.message.error('Please select a territory.', '');
      return;
    }
    if (
      !this.walletTransactionData.WALLET_AMOUNT ||
      isNaN(Number(this.walletTransactionData.WALLET_AMOUNT))
    ) {
      this.message.error('Please enter a valid amount.', '');
      return;
    }
    this.savingWalletTransaction = true;
    const payload = {
      TYPE: this.walletTransactionData.TRANSACTION_TYPE,
      TERRITORY_ID: this.walletTransactionData.TERRITORY_ID,
      WALLET_AMOUNT: this.walletTransactionData.WALLET_AMOUNT,
      REMARK: this.walletTransactionData.REMARKS || '',
    };
    this.api.saveWalletTransaction(payload).subscribe(
      (res) => {
        this.savingWalletTransaction = false;
        if (res['code'] === 200) {
          this.message.success('Wallet transaction saved successfully.', '');
          if (action === 'close') {
            this.closeWalletDrawer();
          } else {
            this.resetWalletForm();
          }
        } else {
          this.message.error('Failed to save. Please try again.', '');
        }
      },
      (err: HttpErrorResponse) => {
        this.savingWalletTransaction = false;
        if (err.status === 0)
          this.message.error(
            'Unable to connect. Please check your connection.',
            '',
          );
        else this.message.error('Something Went Wrong.', '');
      },
    );
  }
  isSpinning: boolean = false;
  isOk: boolean = true;
  modalTitle: string = 'Confirm Transaction';
  saveWalletTransaction(
    addNew: boolean,
    walletTransactionDrawer: NgForm,
  ): void {
    this.isOk = true;
    this.isSpinning = false;
    const data = this.walletTransactionData;
    switch (data.TRANSACTION_TYPE) {
      case 'AT':
        this.modalTitle = 'Confirm Transaction of Admin Topup';
        break;
      case 'PR':
        this.modalTitle = 'Confirm Transaction of Promotional';
        break;
      case 'RF':
        this.modalTitle = 'Confirm Transaction of Refund';
        break;
      default:
        this.modalTitle = 'Confirm Transaction';
    }
    if (data.TRANSACTION_TYPE === 'AT' || data.TRANSACTION_TYPE === 'PR') {
      if (!data.TERRITORY_ID || data.TERRITORY_ID === 0) {
        this.message.error('Please Select Territory.', '');
        return;
      }
    } else {
      if (!data.CUSTOMER_ID || data.CUSTOMER_ID === 0) {
        this.message.error('Please Select Customer.', '');
        return;
      }
    }
    if (!data.WALLET_AMOUNT) {
      this.message.error('Please Enter Amount.', '');
      return;
    }
    if (data.TRANSACTION_TYPE === 'AT' || data.TRANSACTION_TYPE === 'PR') {
      if (data.WALLET_AMOUNT < 1 || data.WALLET_AMOUNT > this.drData?.WALLET_AMOUNT) {
        this.message.error(`Amount must be ${this.drData?.WALLET_AMOUNT} or less than ${this.drData?.WALLET_AMOUNT}.`, '');
        return;
      }
    }
    if (data.TRANSACTION_TYPE === 'AT' || data.TRANSACTION_TYPE === 'PR') {
      if (!data.EXPIRY_DAYS) {
        this.message.error('Please Enter Expiry In Days.', '');
        return;
      }
      console.log("Tejas", data.EXPIRY_DAYS)
      if (data.EXPIRY_DAYS < 1 || data.EXPIRY_DAYS > 999) {
        this.message.error('Expiry Days must be between 1 and 999.', '');
        return;
      }
    }
    if (!data.REMARKS || data.REMARKS.trim() === '') {
      this.message.error('Please Enter Remark.', '');
      return;
    }
    this.pendingAddNew = addNew;
    this.pendingForm = walletTransactionDrawer;
    this.confirmationMessage = `Are you want to sure?`;;
    this.showConfirmationModal = true;
  }
  confirmSave(): void {
    this.showConfirmationModal = false;
    this.executeSaveWalletTransaction(this.pendingAddNew, this.pendingForm);
  }
  executeSaveWalletTransaction(
    addNew: boolean,
    walletTransactionDrawer: NgForm,
  ): void {
    this.isOk = true;
    this.isSpinning = false;
    const data = this.walletTransactionData;
    if (data.TRANSACTION_TYPE === 'RF') {
      data.TERRITORY_ID = null;
      data.EXPIRY_DAYS = null;
    }
    if (data.TRANSACTION_TYPE === 'AT' || data.TRANSACTION_TYPE === 'PR') {
      data.CUSTOMER_ID = null;
    }
    data.CLIENT_ID = 1;
    delete data.TERRITORY_SEARCH;
    if (!addNew) this.savingNewWalletTransaction = true;
    else this.savingNew1WalletTransaction = true;
    this.api.createCustomerWalletData(data).subscribe((res: any) => {
      if (res.code === 200) {
        if (!addNew) this.savingNewWalletTransaction = false;
        else this.savingNew1WalletTransaction = false;
        this.message.success('Wallet Transaction Created Successfully', '');
        if (!addNew) {
          this.drawerClose();
        } else {
          walletTransactionDrawer.resetForm(this.walletTransactionData);
          this.resetWalletForm();
        }
      } else if (res.code === 300) {
        if (!addNew) this.savingNewWalletTransaction = false;
        else this.savingNew1WalletTransaction = false;
        this.message.error(res.message, '');
      } else {
        if (!addNew) this.savingNewWalletTransaction = false;
        else this.savingNew1WalletTransaction = false;
        this.message.error('Wallet Transaction Creation Failed...', '');
      }
    });
  }
  resetDrawer(CountryDrawer: NgForm) {
    CountryDrawer.form.markAsPristine();
    CountryDrawer.form.markAsUntouched();
  }
  allowDecimalOnly(event: KeyboardEvent): boolean {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    if (
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(char)
    )
      return true;
    if (char === '.' && !input.value.includes('.')) return true;
    if (/^\d$/.test(char)) {
      const parts = input.value.split('.');
      if (
        parts[1] !== undefined &&
        parts[1].length >= 2 &&
        input.selectionStart !== null &&
        input.selectionStart > input.value.indexOf('.')
      ) {
        event.preventDefault();
        return false;
      }
      return true;
    }
    event.preventDefault();
    return false;
  }
  onDecimalPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') || '';
    if (!/^\d+(\.\d{0,2})?$/.test(pasted)) event.preventDefault();
  }
  walletDrawerVisible = false;
  savingWalletTransaction = false;
  territorySearchLoading = false;
  territorySearchResults: any[] = [];
  CUSTOMER_COUNT: any;
  walletTransactionData: {
    ID?: number | string;
    TRANSACTION_TYPE: 'AT' | 'RF' | 'PR';
    TERRITORY_SEARCH: any;
    TERRITORY_ID: number | null;
    WALLET_AMOUNT: any;
    REMARKS: any;
    CUSTOMER_ID?: any;
    EXPIRY_DAYS?: any;
    CLIENT_ID?: any;
  } = {
      TRANSACTION_TYPE: 'AT',
      TERRITORY_SEARCH: '',
      TERRITORY_ID: null,
      WALLET_AMOUNT: 0,
      REMARKS: '',
      EXPIRY_DAYS: null,
    };
  openWalletDrawer(): void {
    this.resetWalletForm();
    this.savingNewWalletTransaction = false;
    this.savingNew1WalletTransaction = false;
    this.getDefaultAmountData();
    this.walletDrawerVisible = true;
  }
  closeWalletDrawer(): void {
    this.walletDrawerVisible = false;
    this.resetWalletForm();
    this.search();
  }
  private resetWalletForm(): void {
    this.walletTransactionData = {
      TRANSACTION_TYPE: 'AT',
      TERRITORY_SEARCH: '',
      TERRITORY_ID: null,
      WALLET_AMOUNT: null,
      REMARKS: '',
    };
    this.CUSTOMER_COUNT = null;
    this.territorySearchResults = [];
  }
  onTransactionTypeChange(type: 'AT' | 'PR' | 'RF'): void {
    this.walletTransactionData.TERRITORY_SEARCH = '';
    this.walletTransactionData.TERRITORY_ID = null;
    this.CUSTOMER_COUNT = null;
    this.searchkey = '';
    this.customer = [];
    this.selectedCustomer = null;
    this.walletTransactionData.CUSTOMER_ID = null;
    if (type == 'RF' && this.walletTransactionData.WALLET_AMOUNT) {
      this.walletTransactionData.WALLET_AMOUNT = null;
      this.walletTransactionData.REMARKS = null;
    }
    this.territorySearchResults = [];
  }
  territoryPageIndex = 1;
  territoryPageSize = 10;
  territoryHasMore = false;
  territoryNoData = false;
  onTerritorySearch(value: string, form?: NgForm): void {
    this.walletTransactionData.TERRITORY_ID = null;
    this.CUSTOMER_COUNT = null;
    this.walletTransactionData.WALLET_AMOUNT = null;
    this.walletTransactionData.EXPIRY_DAYS = null;
    this.walletTransactionData.REMARKS = '';
    this.territorySearchResults = [];
    this.territoryPageIndex = 1;
    this.territoryHasMore = false;
    this.territoryNoData = false;
    if (form) {
      form.form.markAsPristine();
      form.form.markAsUntouched();
    }
    if (value && value.trim().length >= 2) {
      this.walletTransactionData.TERRITORY_SEARCH = value;
      this.searchTerritory();
    } else {
      this.walletTransactionData.TERRITORY_SEARCH = '';
      this.territoryNoData = true;
    }
  }
  searchTerritory(loadMore: boolean = false): void {
    if (!this.walletTransactionData.TERRITORY_SEARCH?.trim()) {
      this.territoryNoData = true;
      return;
    }
    this.territorySearchLoading = true;
    const page = loadMore ? this.territoryPageIndex + 1 : 1;
    this.api
      .getTeritory(
        page,
        this.territoryPageSize,
        'id',
        'desc',
        ` AND (NAME like '%${this.walletTransactionData.TERRITORY_SEARCH.trim()}%')`,
      )
      .subscribe(
        (res) => {
          this.territorySearchLoading = false;
          if (res.code === 200) {
            const data = res.data || [];
            if (loadMore) {
              this.territorySearchResults = [
                ...this.territorySearchResults,
                ...data,
              ];
              this.territoryPageIndex++;
            } else {
              this.territorySearchResults = data;
              this.territoryPageIndex = 1;
            }
            this.territoryNoData = this.territorySearchResults.length === 0;
            if (data.length < this.territoryPageSize) {
              this.territoryHasMore = false;
            } else {
              this.territoryHasMore = true;
            }
          } else {
            this.territorySearchResults = [];
            this.territoryNoData = true;
          }
        },
        () => {
          this.territorySearchLoading = false;
          this.territorySearchResults = [];
          this.territoryNoData = true;
        },
      );
  }
  private resetTerritorySelection(form?: NgForm): void {
    this.walletTransactionData.TERRITORY_SEARCH = '';
    this.walletTransactionData.TERRITORY_ID = null;
    this.CUSTOMER_COUNT = null;
    this.territorySearchResults = [];
    this.territoryPageIndex = 1;
    this.territoryHasMore = false;
    this.territoryNoData = false;
    this.walletTransactionData.WALLET_AMOUNT = null;
    this.walletTransactionData.EXPIRY_DAYS = null;
    this.walletTransactionData.REMARKS = '';
    if (form) {
      form.form.markAsPristine();
      form.form.markAsUntouched();
      form.controls['walletAmount']?.reset();
      form.controls['expiryInDays']?.reset();
      form.controls['walletRemark']?.reset();
    }
  }
  selectTerritory(id: number | null, form?: NgForm): void {
    if (!id) {
      this.resetTerritorySelection(form);
      return;
    }
    const territory = this.territorySearchResults.find((t) => t.ID === id);
    if (!territory) return;
    this.territory_name = territory.NAME || this.walletTransactionData.TERRITORY_SEARCH;
    this.walletTransactionData.TERRITORY_ID = territory.ID;
    this.CUSTOMER_COUNT = territory.CUSTOMER_COUNT ?? null;
    if (
      territory.CUSTOMER_COUNT === undefined ||
      territory.CUSTOMER_COUNT === null
    ) {
      this.territorySearchLoading = true;
      const payload = {
        pageIndex: 0,
        pageSize: 0,
        sortKey: 'ID',
        sortValue: '',
        filter: '',
        TERRITORY_ID: territory.ID,
      };
      this.api.getTerritoryCustomerCount(payload).subscribe(
        (res) => {
          if (res.code === 200) {
            this.CUSTOMER_COUNT = res.count ?? 0;
            this.territorySearchLoading = false;
            this.walletTransactionData.TERRITORY_ID = territory.ID;
            this.walletTransactionData.WALLET_AMOUNT = null;
            this.walletTransactionData.EXPIRY_DAYS = null;
          } else {
            this.territorySearchLoading = false;
            this.walletTransactionData.WALLET_AMOUNT = null;
            this.walletTransactionData.EXPIRY_DAYS = null;
          }
        },
        (error) => {
          this.territorySearchLoading = false;
          this.walletTransactionData.WALLET_AMOUNT = null;
          this.walletTransactionData.EXPIRY_DAYS = null;
        },
      );
    }
  }
  totalrecords1 = 0;
  company: any = [];
  pageIndex1 = 1;
  getCustomerLoading = false;
  loadMore() {
    if (this.totalrecords1 > this.customer.length && this.searchkey) {
      this.pageIndex1++;
      this.getcustomer(this.searchkey);
    }
  }
  searchTimeout: any;
  onKeyUp(event: KeyboardEvent, form?: NgForm) {
    const input = (event.target as HTMLInputElement)?.value || '';
    this.searchkey = input;
    if (event.key === 'Enter') {
      this.triggerSearch();
    }
    if (!this.searchkey.trim()) {
      this.resetCustomerSelection(form);
      this.customer = [];
    }
    if (!this.searchkey.trim()) {
    this.resetCustomerSelection(form);
    this.customer = [];
  } else if (this.searchkey.trim().length < 3) {
    this.resetCustomerSelection(form);
    this.customer = [];
  } else {
    if (this.walletTransactionData.CUSTOMER_ID) {
      this.resetCustomerSelection(form);
      this.customer = [];
    }
  }
  }
  resetCustomerSelection(form?: NgForm): void {
    this.customer = [];
    this.selectedCustomer = null;
    this.totalrecords1 = 0;
    this.walletTransactionData.CUSTOMER_ID = null;
    this.walletTransactionData.WALLET_AMOUNT = null;
    this.walletTransactionData.EXPIRY_DAYS = null;
    this.walletTransactionData.REMARKS = '';
    if (form) {
      form.form.markAsPristine();
      form.form.markAsUntouched();
      form.controls['walletAmount']?.reset();
      form.controls['expiryInDays']?.reset();
      form.controls['walletRemark']?.reset();
    }
  }
  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement)?.value || '';
    if (!input || !input.trim()) {
      this.customer = [];
      this.searchkey = '';
    }
  }
  triggerSearch() {
    if (this.searchkey.trim().length >= 3) {
      this.pageIndex1 = 1;
      this.customer = [];
      this.getcustomer(this.searchkey);
    } else {
      this.walletTransactionData.EXPIRY_DAYS = 0;
      this.walletTransactionData.WALLET_AMOUNT = 0;
      this.customer = [];
      this.resetCustomerSelection();
    }
  }
  getcustomer(search: string = '', orgName: string = '') {
  const customerType = 'I';
  let filter = ' AND ACCOUNT_STATUS = 1';
  if (search && search.trim() !== '') {
    filter += ` AND (NAME like "%${search}%" OR EMAIL like "%${search}%" OR COMPANY_NAME like "%${search}%" OR MOBILE_NO like "%${search}%"
    )`;
  }
  if (orgName) {
    filter += ` AND COMPANY_NAME = '${orgName}'`;
  }
  if (customerType) {
    filter += ` AND CUSTOMER_TYPE = '${customerType}'`;
  }
  this.getCustomerLoading = true;
  this.api
    .getAllCustomer(this.pageIndex1, 8, '', '', filter)
    .subscribe((data) => {
      if (data['code'] === 200) {
        const newData = data['data'] || [];
        if (this.pageIndex1 === 1) {
          this.customer = newData;
        } else {
          this.customer = [...this.customer, ...newData];
        }
        this.totalrecords1 = data['count'] || 0;
        if (this.pageIndex1 === 1 && 
            this.customer.length === 1 && 
            !this.walletTransactionData.CUSTOMER_ID) {
          this.autoSelectSingleCustomer();
        }
      }
      this.getCustomerLoading = false;
    }, (error) => {
      console.error('Error fetching customers:', error);
      this.getCustomerLoading = false;
      this.customer = [];
    });
}
autoSelectSingleCustomer() {
  if (this.customer.length === 1) {
    const singleCustomer = this.customer[0];
    this.selectedCustomer = { ...singleCustomer };
    this.walletTransactionData.CUSTOMER_ID = singleCustomer.ID;
    this.customer = [];
    this.searchkey = singleCustomer.NAME;
  }
}
  selectedCustomer: any;
  onCustomerSelect(customerId: number) {
    if (!customerId) {
      this.selectedCustomer = null;
      this.walletTransactionData.CUSTOMER_ID = null;
      return;
    }
    this.selectedCustomer = this.customer.find((c) => c.ID === customerId);
    this.walletTransactionData.CUSTOMER_ID = customerId;
    this.customer = [];
  }
  onScroll(event: any) {
    const target = event.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      this.loadMore();
    }
  }
}
