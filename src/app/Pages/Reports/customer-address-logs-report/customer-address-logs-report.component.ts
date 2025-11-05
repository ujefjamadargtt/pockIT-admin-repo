import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { customer } from '../../Models/customer';

@Component({
  selector: 'app-customer-address-logs-report',
  templateUrl: './customer-address-logs-report.component.html',
  styleUrls: ['./customer-address-logs-report.component.css'],
})
export class CustomerAddressLogsReportComponent {
  @Input() drawerClose: Function;
  @Input() data: customer = new customer();
  @Input() drawerVisible: boolean;
  @Input() custmoerid: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datepipe: DatePipe,
    private _exportService: ExportService
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
  }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Customer Address Service Logs Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  orderCancellationData: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['ADDRESS_LINE_1', 'ADDRESS_LINE_1'],
    ['ADDRESS_LINE_2', 'ADDRESS_LINE_2'],
    ['CONTACT_PERSON_NAME', 'CONTACT_PERSON_NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['CREATED_MODIFIED_DATE', 'CREATED_MODIFIED_DATE'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['DISTRICT_NAME', 'DISTRICT_NAME'],
    ['GEO_LOCATION', 'GEO_LOCATION'],
    ['LANDMARK', 'LANDMARK'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['PINCODE', 'PINCODE'],
    ['STATE_NAME', 'STATE_NAME'],
    ['TERRITORY_NAME', 'TERRITORY_NAME'],
  ];
  drawerCountryMappingVisible = false;
  drawervisible = false;
  Seqtext: any;
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

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  distinctData: any = [];

  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(204, columnKey).subscribe(
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

  onKeyup(event: KeyboardEvent): void {
    if (this.addressline1Text.length >= 3 && event.key === 'Enter') {
      this.search();
      this.addressline1Applied = true;
    } else if (this.addressline1Text.length == 0 && event.key === 'Backspace') {
      this.search();
      this.addressline1Applied = false;
    }

    if (this.addressline2Text.length >= 3 && event.key === 'Enter') {
      this.search();
      this.addressline2Applied = true;
    } else if (this.addressline2Text.length == 0 && event.key === 'Backspace') {
      this.search();
      this.addressline2Applied = false;
    }

    if (this.contactPersonNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.iscontactpersonNameApplied = true;
    } else if (
      this.contactPersonNameText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.iscontactpersonNameApplied = false;
    }

    if (this.countryNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCountryFilterApplied = true;
    } else if (this.countryNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCountryFilterApplied = false;
    }

    if (this.customerNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isCustomerNameApplied = true;
    } else if (this.customerNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isCustomerNameApplied = false;
    }

    if (this.districtNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isDistFilterApplied = true;
    } else if (this.districtNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isDistFilterApplied = false;
    }

    if (this.GeoLocationText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isGeoLocationFilterApplied = true;
    } else if (this.GeoLocationText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isGeoLocationFilterApplied = false;
    }

    if (this.landmarkText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.islandmarkFilterApplied = true;
    } else if (this.landmarkText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.islandmarkFilterApplied = false;
    }

    if (this.mobileText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.ismobileFilterApplied = true;
    } else if (this.mobileText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismobileFilterApplied = false;
    }

    if (this.pincodeText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isPincodeFilterApplied = true;
    } else if (this.pincodeText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isPincodeFilterApplied = false;
    }

    if (this.stateNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isStateFilterApplied = true;
    } else if (this.stateNameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isStateFilterApplied = false;
    }

    if (this.territoryNameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isterritoryNameApplied = true;
    } else if (
      this.territoryNameText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isterritoryNameApplied = false;
    }
  }
  filterQuery: string = '';

  nameFilter() {
    if (this.customerNameText.trim() === '') {
      this.searchText = '';
    } else if (this.customerNameText.length >= 3) {
      this.search();
    } else {
    }
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }

    var sort: string;
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

    var filterQuery = '';

    if (this?.addressline1Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ADDRESS_LINE_1 LIKE '%${this.addressline1Text?.trim()}%'`;
    }

    if (this?.addressline2Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ADDRESS_LINE_2 LIKE '%${this.addressline2Text?.trim()}%'`;
    }
    if (this.contactPersonNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CONTACT_PERSON_NAME LIKE '%${this.contactPersonNameText?.trim()}%'`;
    }

    if (this.countryNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUNTRY_NAME LIKE '%${this.countryNameText?.trim()}%'`;
    }

    if (this.customerNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.customerNameText?.trim()}%'`;
    }

    if (this.districtNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DISTRICT_NAME LIKE '%${this.districtNameText?.trim()}%'`;
    }

    if (this.GeoLocationText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `GEO_LOCATION LIKE '%${this.GeoLocationText?.trim()}%'`;
    }

    if (this.landmarkText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LANDMARK LIKE '%${this.landmarkText?.trim()}%'`;
    }

    if (this.mobileText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobileText?.trim()}%'`;
    }

    if (this.pincodeText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PINCODE LIKE '%${this.pincodeText?.trim()}%'`;
    }

    if (this.stateNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `STATE_NAME LIKE '%${this.stateNameText?.trim()}%'`;
    }

    // Status Filter
    if (this.defaultFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_DEFAULT = '${this.defaultFilter}'`;
    }

    if (this.territoryNameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TERRITORY_NAME LIKE '%${this.territoryNameText?.trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }

    // Type Filter
    if (this.typeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TYPE = '${this.typeFilter}'`;
    }

    if (this.cancelDateText?.length === 2) {
      const [start, end] = this.cancelDateText;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `CREATED_MODIFIED_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    if (exportInExcel == false) {
      this.api
        .getCustomerAddressLogs(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND CUSTOMER_ID =' + this.custmoerid
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['body']['count'];
              this.orderCancellationData = data['body']['data'];
              this.TabId = data['body']['TAB_ID'];
            } else if (data['status'] == 400) {
              this.loadingRecords = false;
              this.orderCancellationData = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.orderCancellationData = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
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
        .getCustomerAddressLogs(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND CUSTOMER_ID=' + this.custmoerid
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.excelData = data['body']['data'];
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
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  close() {
    this.drawervisible = false;
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }

  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }

  orderDateText: any;
  cancelDateVisible: boolean = false;
  cancelDateText: any;
  iscancelDateApplied: boolean = false;

  ////
  addressLine1Visible: boolean = false;
  addressline1Text: string = '';

  addressline1Applied: boolean = false;

  addressLine2Visible: boolean = false;
  addressline2Text: string = '';
  addressline2Applied: boolean = false;

  contactpersonNameVisible: boolean = false;
  contactPersonNameText: string = '';
  iscontactpersonNameApplied: boolean = false;

  countryVisible: boolean = false;
  countryNameText: string = '';
  isCountryFilterApplied: boolean = false;

  customerNameVisible: boolean = false;
  customerNameText: string = '';
  isCustomerNameApplied: boolean = false;

  distVisible: boolean = false;
  districtNameText: string = '';
  isDistFilterApplied: boolean = false;

  geoLocationtVisible: boolean = false;
  GeoLocationText: string = '';
  isGeoLocationFilterApplied: boolean = false;

  landmarkVisible: boolean = false;
  landmarkText: string = '';
  islandmarkFilterApplied: boolean = false;

  mobileVisible: boolean = false;
  mobileText: string = '';
  ismobileFilterApplied: boolean = false;

  pincodeVisible: boolean = false;
  pincodeText: string = '';
  isPincodeFilterApplied: boolean = false;

  stateVisible: boolean = false;
  stateNameText: string = '';
  isStateFilterApplied: boolean = false;

  StatusVisible: boolean = false;
  isStatusApplied: boolean = false;

  territoryNameVisible: boolean = false;
  territoryNameText: string = '';
  isterritoryNameApplied: boolean = false;

  typeVisible: boolean = false;
  istypeApplied: boolean = false;

  defaultVisible: boolean = false;
  isdefaultApplied: boolean = false;

  reset(): void {
    this.addressline1Text = '';
    this.addressline2Text = '';
    this.contactPersonNameText = '';
    this.countryNameText = '';
    this.customerNameText = '';
    this.districtNameText = '';
    this.GeoLocationText = '';
    this.landmarkText = '';
    this.mobileText = '';
    this.pincodeText = '';
    this.stateNameText = '';
    this.territoryNameText = '';
    this.cancelDateText = null;

    this.search();
  }

  //status Filter
  statusFilter: string | undefined = undefined;

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  typeFilter: string | undefined = undefined;

  onTypeFilterChange(selectedStatus: string) {
    this.typeFilter = selectedStatus;
    this.search(true);
  }

  listOtypeFilter: any[] = [
    { text: 'House', value: 'H' },
    { text: 'Work', value: 'W' },
    { text: 'Office', value: 'F' },
  ];

  defaultFilter: string | undefined = undefined;

  ondefaultFilterChange(selectedStatus: string) {
    this.defaultFilter = selectedStatus;
    this.search(true);
  }

  listOfdefaultFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  onDateChange(selectedDate: any): void {
    if (this.orderDateText && this.orderDateText.length === 2) {
      this.search();
    } else {
      this.orderDateText = null;
      this.search();
    }
  }

  resetDateFilter(): void {
    this.orderDateText = null;
    this.search();
  }

  onCancelDateChange(selectedDate: any): void {
    if (this.cancelDateText && this.cancelDateText.length === 2) {
      this.search();
    } else {
      this.cancelDateText = null;
      this.search();
    }
  }

  resetCancelDateFilter(): void {
    this.cancelDateText = null;
    this.search();
  }

  dataList: any = [];
  visible = false;

  columns1: { label: string; value: string }[] = [
    { label: 'Customer Name', value: 'CUSTOMER_NAME' },
    // { label: 'Short Code', value: 'SHORT_CODE' },
  ];

  // new filter

  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  isLoading = false;

  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  //TabId: number; // Ensure TabId is defined and initialized

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  whichbutton: any;
  filterloading: boolean = false;
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
  //Edit Code 3

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
  openfilter() {
    this.drawerTitle = 'Customer Service Logs Report Filter';
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
  filterFields: any[] = [
    {
      key: 'CREATED_MODIFIED_DATE',
      label: 'Modified Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Modified Date',
    },
    {
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Name',
    },
    {
      key: 'MOBILE_NO',
      label: 'Mobile No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Mobile No',
    },
    {
      key: 'CONTACT_PERSON_NAME',
      label: 'Contact Person Names',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Contact Person Name',
    },

    {
      key: 'ADDRESS_LINE_1',
      label: 'House No./Flat No./Floor No',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter House No./Flat No./Floor No',
    },
    {
      key: 'ADDRESS_LINE_2',
      label: 'Building Name / Area Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Building Name / Area Name',
    },
    {
      key: 'LANDMARK',
      label: 'Landmark',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Landmark',
    },

    {
      key: 'COUNTRY_NAME',
      label: 'Country',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Country',
    },
    {
      key: 'STATE_NAME',
      label: 'State Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter State Name',
    },

    {
      key: 'DISTRICT_NAME',
      label: 'District',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter District',
    },

    {
      key: 'PINCODE',
      label: 'Pincode',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Pincode',
    },
    {
      key: 'IS_DEFAULT',
      label: 'Default Address',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Yes', value: '1' },
        { display: 'No', value: '0' },
      ],
      placeholder: 'Select Default Address',
    },

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
    {
      key: 'GEO_LOCATION',
      label: 'Geo Location',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Geo Location',
    },
    {
      key: 'TYPE',
      label: 'Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Work', value: 'W' },
        { display: 'House', value: 'H' },
        { display: 'Office', value: 'F' },
      ],
      placeholder: 'Select Type',
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
        { display: 'Active', value: '1' },
        { display: 'Inactive', value: '0' },
      ],
      placeholder: 'Enter Status',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
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
  drawerTitle;
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

  excelData: any = [];
  exportLoading: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Last Modified Date'] = this.excelData[i]['CREATED_MODIFIED_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['CREATED_MODIFIED_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME']
          ? this.excelData[i]['CUSTOMER_NAME']
          : '-';

        obj1['Mobile No'] = this.excelData[i]['MOBILE_NO']
          ? this.excelData[i]['MOBILE_NO']
          : '-';
        obj1['Contact Person Name'] = this.excelData[i]['CONTACT_PERSON_NAME']
          ? this.excelData[i]['CONTACT_PERSON_NAME']
          : '-';

        obj1['House No./Flat No./Floor No'] = this.excelData[i][
          'ADDRESS_LINE_1'
        ]
          ? this.excelData[i]['ADDRESS_LINE_1']
          : '-';
        obj1['Building Name / Area Name'] = this.excelData[i]['ADDRESS_LINE_2']
          ? this.excelData[i]['ADDRESS_LINE_2']
          : '-';
        obj1['Landmark'] = this.excelData[i]['LANDMARK']
          ? this.excelData[i]['LANDMARK']
          : '-';

        obj1['Country'] = this.excelData[i]['COUNTRY_NAME']
          ? this.excelData[i]['COUNTRY_NAME']
          : '-';

        obj1['State'] = this.excelData[i]['STATE_NAME']
          ? this.excelData[i]['STATE_NAME']
          : '-';

        obj1['District'] = this.excelData[i]['DISTRICT_NAME']
          ? this.excelData[i]['DISTRICT_NAME']
          : '-';

        obj1['Pincode'] = this.excelData[i]['PINCODE']
          ? this.excelData[i]['PINCODE']
          : '-';

        if (this.excelData[i]['IS_DEFAULT'] == '1') {
          obj1['Default Address ?'] = 'Yes';
        } else if (this.excelData[i]['IS_DEFAULT'] == '0') {
          obj1['Default Address ?'] = 'No';
        }

        obj1['Territory'] = this.excelData[i]['TERRITORY_NAME']
          ? this.excelData[i]['TERRITORY_NAME']
          : '-';

        obj1['Geo Location'] = this.excelData[i]['GEO_LOCATION']
          ? this.excelData[i]['GEO_LOCATION']
          : '-';

        if (this.excelData[i]['TYPE'] == 'H') {
          obj1['Type'] = 'House';
        } else if (this.excelData[i]['TYPE'] == 'W') {
          obj1['Type'] = 'Work';
        } else if (this.excelData[i]['TYPE'] == 'F') {
          obj1['Type'] = 'Office';
        }

        if (this.excelData[i]['STATUS'] == '1') {
          obj1['Status'] = 'Active';
        } else if (this.excelData[i]['STATUS'] == '0') {
          obj1['Status'] = 'Inctive';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Customer Address Logs Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  showcolumn = [
    { label: 'Address Line 1', key: 'ADDRESS_LINE_1', visible: true },
    { label: 'Addres Line 2', key: 'ADDRESS_LINE_2', visible: true },
    { label: 'Contact Person Name', key: 'CONTACT_PERSON_NAME', visible: true },
    { label: 'Country Name', key: 'COUNTRY_NAME', visible: true },
    { label: 'Modified Date', key: 'CREATED_MODIFIED_DATE', visible: true },
    { label: 'Customer Name', key: 'CUSTOMER_NAME', visible: true },
    { label: 'District Name', key: 'DISTRICT_NAME', visible: true },
    { label: 'Geo Location', key: 'GEO_LOCATION', visible: true },
    { label: 'Landmark', key: 'LANDMARK', visible: true },
    { label: 'Mobile', key: 'MOBILE_NO', visible: true },
    { label: 'Pincode', key: 'PINCODE', visible: true },
    { label: 'State Name', key: 'STATE_NAME', visible: true },
    { label: 'Status', key: 'STATUS', visible: true },
    { label: 'Territory Name', key: 'TERRITORY_NAME', visible: true },
    { label: 'Type', key: 'TYPE', visible: true },
  ];
}
