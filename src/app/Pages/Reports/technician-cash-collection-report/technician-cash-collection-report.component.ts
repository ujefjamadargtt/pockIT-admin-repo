import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
@Component({
  selector: 'app-technician-cash-collection-report',
  templateUrl: './technician-cash-collection-report.component.html',
  styleUrls: ['./technician-cash-collection-report.component.css'],
})
export class TechnicianCashCollectionReportComponent {
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
    private router: Router,
    private _exportService: ExportService,
    public datepipe: DatePipe
  ) { }
  formTitle = 'Technician Cash Collection Report';
  excelData: any = [];
  exportLoading: boolean = false;
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = '';
  chapters: any = [];
  isLoading = true;
  loadingRecords = false;
  filteredUnitData: any[] = [];
  filterQuery1: any = '';
  dataList: any = [];
  filterQuery: string = '';
  savedFilters: any[] = [];
  TabId: number;
  isDeleting: boolean = false;
  drawerTitle!: string;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  totalRecords = 1;
  columns: string[][] = [
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['TECHNICIAN_MOBILE_NO', 'TECHNICIAN_MOBILE_NO'],
    ['BUSINESS_NAME', 'BUSINESS_NAME'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['ORDER_NO', 'ORDER_NO'],
    ['TRANSACTION_AMOUNT', 'TRANSACTION_AMOUNT'],
    ['TRANSACTION_DATE', 'TRANSACTION_DATE'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['CUSTOMER_MOBILE_NO', 'CUSTOMER_MOBILE_NO'],
  ];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit(): void {
    this.getVendorData();
    this.getTechnicianData();
    this.getCustomerData();
  }
  nametext: string = '';
  isTechnicianNameFilterApplied: boolean = false;
  technicianNameVisible = false;
  mobiletext: string = '';
  ismobileFilterApplied: boolean = false;
  mobileVisible = false;
  vendornametext: string = '';
  isvendornameFilterApplied: boolean = false;
  vendornameVisible = false;
  jobtext: string = '';
  isjobFilterApplied: boolean = false;
  jobvisible = false;
  orderNumberText: string = '';
  isOrderNumberApplied: boolean = false;
  orderNumberVisible = false;
  transactionAmountText: string = '';
  istransactionAmountApplied: boolean = false;
  transactionAmountVisible = false;
  transactionDateText: string = '';
  isTransactionDateFilterApplied: boolean = false;
  transactionDateVisible = false;
  customerNameText: string = '';
  isCustomerNameApplied: boolean = false;
  customerNameVisible = false;
  custmobiletext: string = '';
  iscustmobileFilterApplied: boolean = false;
  custmobileVisible = false;
  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.mobiletext = '';
    this.search();
  }
  onKeyup(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.nametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isTechnicianNameFilterApplied = true;
    } else if (this.nametext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isTechnicianNameFilterApplied = false;
    }
    if (this.mobiletext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismobileFilterApplied = true;
    } else if (this.mobiletext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismobileFilterApplied = false;
    }
    if (this.vendornametext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isvendornameFilterApplied = true;
    } else if (this.vendornametext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isvendornameFilterApplied = false;
    }
    if (this.jobtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isjobFilterApplied = true;
    } else if (this.jobtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isjobFilterApplied = false;
    }
    if (this.orderNumberText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isOrderNumberApplied = true;
    } else if (this.orderNumberText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isOrderNumberApplied = false;
    }
    if (this.transactionAmountText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.istransactionAmountApplied = true;
    } else if (
      this.transactionAmountText.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.istransactionAmountApplied = false;
    }
    if (this.transactionDateText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isTransactionDateFilterApplied = true;
    } else if (
      this.transactionDateText.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search();
      this.isTransactionDateFilterApplied = false;
    }
    if (this.customerNameText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.customerNameText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }
    if (this.custmobiletext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iscustmobileFilterApplied = true;
    } else if (this.custmobiletext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iscustmobileFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
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
  editQuery(data: any) {
    this.filterFields[0]['options'] = this.TechData;
    this.filterFields[3]['options'] = this.VendorData;
    this.filterFields[8]['options'] = this.CustData;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
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
    if (buttontype == 'SA') {
      this.loadFilters();
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
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
    this.loadingRecords = true;
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    let likeQuery = '';
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
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.nametext.trim()}%'`;
      this.isTechnicianNameFilterApplied = true;
    } else {
      this.isTechnicianNameFilterApplied = false;
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_MOBILE_NO LIKE '%${this.mobiletext.trim()}%'`;
      this.ismobileFilterApplied = true;
    } else {
      this.ismobileFilterApplied = false;
    }
    if (this.vendornametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BUSINESS_NAME LIKE '%${this.vendornametext.trim()}%'`;
      this.isvendornameFilterApplied = true;
    } else {
      this.isvendornameFilterApplied = false;
    }
    if (this.jobtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.jobtext.trim()}%'`;
      this.isjobFilterApplied = true;
    } else {
      this.isjobFilterApplied = false;
    }
    if (this.orderNumberText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.orderNumberText.trim()}%'`;
      this.isOrderNumberApplied = true;
    } else {
      this.isOrderNumberApplied = false;
    }
    if (this.transactionAmountText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TRANSACTION_AMOUNT LIKE '%${this.transactionAmountText.trim()}%'`;
      this.istransactionAmountApplied = true;
    } else {
      this.istransactionAmountApplied = false;
    }
    if (this.customerNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.nametext.trim()}%'`;
      this.isCustomerNameApplied = true;
    } else {
      this.isCustomerNameApplied = false;
    }
    if (this.custmobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_MOBILE_NO LIKE '%${this.custmobiletext.trim()}%'`;
      this.iscustmobileFilterApplied = true;
    } else {
      this.iscustmobileFilterApplied = false;
    }
    if (this.transactionDateText?.length === 2) {
      const [start, end] = this.transactionDateText;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `TRANSACTION_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    if (this.typeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TECHNICIAN_TYPE = '${this.typeFilter}'`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    const finalDataList =
      this.filteredUnitData.length > 0 ? this.filteredUnitData : this.dataList;
    if (exportInExcel == false) {
      this.api
        .getTechnicianCashCollectionReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + `AND PAYMENT_MODE='C'`
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
      this.loadingRecords = false;
      this.api
        .getTechnicianCashCollectionReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ` AND PAYMENT_MODE='C'`
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
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
  currentClientId = 1; 
  openfilter() {
    this.filterFields[0]['options'] = this.TechData;
    this.filterFields[3]['options'] = this.VendorData;
    this.filterFields[8]['options'] = this.CustData;
    this.drawerTitle = 'Technician Cash Collection Report Filter';
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
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Technican Name'] = this.excelData[i]['TECHNICIAN_NAME']
          ? this.excelData[i]['TECHNICIAN_NAME']
          : '-';
        obj1['Technician Mobile'] = this.excelData[i]['TECHNICIAN_MOBILE_NO']
          ? this.excelData[i]['TECHNICIAN_MOBILE_NO']
          : '-';
        if (this.excelData[i]['TECHNICIAN_TYPE'] == 'V') {
          obj1['Technician Type'] = 'Vendor Managed';
        } else if (this.excelData[i]['TECHNICIAN_TYPE'] == 'O') {
          obj1['Technician Type'] = 'On Payroll';
        } else if (this.excelData[i]['TECHNICIAN_TYPE'] == 'F') {
          obj1['Technician Type'] = 'Freelancer';
        }
        obj1['Vendor Name'] = this.excelData[i]['BUSINESS_NAME']
          ? this.excelData[i]['BUSINESS_NAME']
          : '-';
        obj1['Job Number'] = this.excelData[i]['JOB_CARD_NO']
          ? this.excelData[i]['JOB_CARD_NO']
          : '-';
        obj1['Order Number'] = this.excelData[i]['ORDER_NO']
          ? this.excelData[i]['ORDER_NO']
          : '-';
        obj1['Transaction Amount'] = this.excelData[i]['TRANSACTION_AMOUNT'];
        obj1['Transaction Date'] = this.excelData[i]['TRANSACTION_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['TRANSACTION_DATE'],
            'dd/MM/yyyy'
          )
          : '-';
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME'];
        obj1['Customer Mobile'] = this.excelData[i]['CUSTOMER_MOBILE_NO'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Technician Cash Collection Report' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  selectedFilter: string | null = null;
  isModalVisible = false;
  selectedQuery: string = '';
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  importInExcel() {
    this.search(true, true);
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      options: [],
      placeholder: 'Select Techinican  Name',
    },
    {
      key: 'TECHNICIAN_MOBILE_NO',
      label: 'Technician Mobile',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Mobile ',
    },
    {
      key: 'TECHNICIAN_TYPE',
      label: 'Technician Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'O', display: 'On Payroll' },
        { value: 'V', display: 'Vendor Managed' },
        { value: 'F', display: 'Freelancer' },
      ],
      placeholder: 'Select Technician Type',
    },
    {
      key: 'BUSINESS_NAME',
      label: 'Vendor Name',
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
      placeholder: 'Enter Vendor Name',
    },
    {
      key: 'JOB_CARD_NO',
      label: 'Job Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job Number',
    },
    {
      key: 'ORDER_NO',
      label: 'Order Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order Number',
    },
    {
      key: 'TRANSACTION_AMOUNT',
      label: 'Transaction Amount',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Transaction Amount',
    },
    {
      key: 'TRANSACTION_DATE',
      label: 'Transaction Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Transaction Date',
    },
    {
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
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
      placeholder: 'Enter Customer Name',
    },
    {
      key: 'CUSTOMER_MOBILE_NO',
      label: 'Customer Mobile',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Mobile ',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isTransactionDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isTransactionDateFilterApplied = false;
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
  onTransactionDateChange(selectedDate: any): void {
    if (this.transactionDateText && this.transactionDateText.length === 2) {
      this.search();
    } else {
      this.transactionDateText = '';
      this.search();
    }
  }
  typeFilter: string | undefined = undefined;
  listOfTechFilter: any[] = [
    { text: 'On Payroll', value: 'O' },
    { text: 'Vendor Managed', value: 'V' },
    { text: 'Freelancer', value: 'F' },
  ];
  ontypeFilterChange(selectedStatus: string) {
    this.typeFilter = selectedStatus;
    this.search(true);
  }
  VendorData: any = [];
  getVendorData() {
    this.api.getVendorData(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.VendorData.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }
  TechData: any = [];
  getTechnicianData() {
    this.api.getTechnicianData(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.TechData.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }
  CustData: any = [];
  getCustomerData() {
    this.api.getAllCustomer(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.CustData.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }
  s;
}
