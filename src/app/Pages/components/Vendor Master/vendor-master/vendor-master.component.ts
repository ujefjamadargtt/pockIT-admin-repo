import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { VendorMasterData } from 'src/app/Pages/Models/vendorMaterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css'],
})
export class VendorMasterComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }
  formTitle = 'Manage Vendors';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Vendor: any[] = [];
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  roleid = sessionStorage.getItem('roleId'); 
  ROLE_ID: number;
  mappedterritory: any;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];
  drawerVendorMappingVisible = false;
  drawerTitle = 'Add New Vendor';
  drawerData: any;
  drawervisible = false;
  isSpinning;
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
  columns: string[][] = [
    ['BUSINESS_NAME', 'BUSINESS_NAME'],
    ['NAME', 'NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    ['GST_NO', 'GST_NO'],
    ['PAN', 'PAN'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['STATE_NAME', 'STATE_NAME'],
    ['DISTRICT_NAME', 'DISTRICT_NAME'],
    ['PINCODE', 'PINCODE'],
  ];
  ngOnInit(): void {
    this.loadingRecords = false;
    const decryptedUserId1 = this.roleid
      ? this.commonFunction.decryptdata(this.roleid)
      : '0'; 
    this.ROLE_ID = Number(decryptedUserId1);
    this.getCountyData();
    this.getStateData();
    this.getDistData();
    this.getPincodeData('PINCODE');
  }
  @ViewChild('searchInput') searchInput!: ElementRef;
  preventDefault(event: Event) {
    event.preventDefault();
    this.searchInput.nativeElement.focus();
  }
  mainsearchkeyup(event: KeyboardEvent) {
    event.preventDefault(); 
    if (
      this.searchText.length === 0 ||
      (event.key === 'Enter' && this.searchText.length >= 3)
    ) {
      this.search(true);
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isBusinessApplied = false;
  isEmailApplied = false;
  isMobileApplied = false;
  isContactApplied = false;
  isPanApplied = false;
  isGstApplied = false;
  onKeyup(event: KeyboardEvent, field: string): void {
    const fieldValue = this[field]; 
    if (event.key === 'Enter') {
      if (fieldValue.length >= 3) {
        this.search();
        this.setFilterApplied(field, true);
      }
    } else if (event.key === 'Backspace' && fieldValue.length === 0) {
      this.search();
      this.setFilterApplied(field, false);
    }
  }
  setFilterApplied(field: string, value: boolean): void {
    switch (field) {
      case 'Businesstext':
        this.isBusinessApplied = value;
        break;
      case 'Emailtext':
        this.isEmailApplied = value;
        break;
      case 'Contacttext':
        this.isContactApplied = value;
        break;
      case 'Mobiletext':
        this.isMobileApplied = value;
        break;
      case 'PANtext':
        this.isPanApplied = value;
        break;
      case 'GSTtext':
        this.isGstApplied = value;
        break;
      case 'PinText':
        this.isPincodeFilterApplied = value;
        break;
      default:
        break;
    }
  }
  isCountryFilterApplied = false;
  isStateFilterApplied = false;
  isDistrictFilterApplied = false;
  isPincodeFilterApplied = false;
  onCountryChange(): void {
    this.isCountryFilterApplied =
      this.selectedCountries && this.selectedCountries.length > 0;
    this.search();
  }
  onStateChange(): void {
    this.isStateFilterApplied =
      this.selectedStates && this.selectedStates.length > 0;
    this.search();
  }
  onDistrictChange(): void {
    this.isDistrictFilterApplied =
      this.selectedDist && this.selectedDist.length > 0;
    this.search();
  }
  onPincodeChange(): void {
    this.isPincodeFilterApplied =
      this.selectedPincodes && this.selectedPincodes.length > 0;
    this.search();
  }
  selecteReportingPerson: number[] = [];
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
    if (this.searchText != '') {
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
    if (this.Businesstext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BUSINESS_NAME LIKE '%${this.Businesstext.trim()}%'`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery != '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery != '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_NAME IN ('${this.selectedStates.join("','")}')`; 
    }
    if (this.selectedDist.length > 0) {
      if (likeQuery != '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DISTRICT_NAME IN ('${this.selectedDist.join("','")}')`; 
    }
    if (this.selectedPincodes.length > 0) {
      if (likeQuery != '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PINCODE IN ('${this.selectedPincodes.join("','")}')`; 
    }
    if (this.Contacttext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.Contacttext.trim()}%'`;
    }
    if (this.Emailtext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.Emailtext.trim()}%'`;
    }
    if (this.Mobiletext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NUMBER LIKE '%${this.Mobiletext.trim()}%'`;
    }
    if (this.GSTtext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `GST_NO LIKE '%${this.GSTtext.trim()}%'`;
    }
    if (this.PANtext != '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `PAN LIKE '%${this.PANtext.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery != '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (this.ROLE_ID == 1 || this.ROLE_ID == 8) {
      this.api
        .getVendorData(
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
              this.Vendor = data['data'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.Vendor = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.Vendor = [];
              this.message.error(
                'Failed to get vendor data. Please try again shortly',
                ''
              );
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
      this.api
        .getVendorData(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND (TERITORY_IDS IN(' +
          this.mappedterritory +
          ')' + ' OR TERITORY_IDS IN (0))'
        )
        .subscribe(
          (data) => {
            if (data["code"] == 200) {
              this.loadingRecords = false;
              this.TabId = data["TAB_ID"];
              this.totalRecords = data["count"];
              this.Vendor = data["data"];
            } else {
              this.loadingRecords = false;
              this.Vendor = [];
              this.message.error(
                "Failed to get vendor data. Please try again shortly",
                ""
              );
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            if (err.status === 0) {
              this.message.error(
                "Unable to connect. Please check your internet or server connection and try again shortly.",
                ""
              );
            } else {
              this.message.error("Something Went Wrong.", "");
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
    var userId = '';
    var userMainId = '';
    if (
      this.USER_ID != null &&
      this.USER_ID != undefined &&
      this.USER_ID != 0
    ) {
      userMainId = ' AND USER_ID=' + this.USER_ID;
    } else {
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
                          this.loadingRecords = true;
                          this.message.info("Currently you are not mapped to any territory. Please map territory", "");
                          this.mappedterritory = [];
                        }
                      } else {
                        this.loadingRecords = true;
                        this.mappedterritory = [];
                      }
                    },
                    (err: HttpErrorResponse) => {
                      this.loadingRecords = true;
                      this.mappedterritory = [];
                    }
                  );
              } else {
                this.loadingRecords = true;
                this.mappedterritory = [];
              }
            } else {
              this.loadingRecords = true;
              this.mappedterritory = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = true;
            this.mappedterritory = [];
          }
        );
    }
  }
  drawerClose(): void {
    this.search();
    this.drawervisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  close() {
    this.drawervisible = false;
  }
  drawerVendorMappingClose(): void {
    this.drawerVendorMappingVisible = false;
  }
  get closeChapterMappingCallback() {
    return this.drawerVendorMappingClose.bind(this);
  }
  edit(data): void {
    this.drawerTitle = 'Update Vendor';
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
  }
  add(): void {
    this.drawerTitle = 'Add New Vendor';
    this.drawerData = new VendorMasterData();
    this.drawervisible = true;
  }
  Businesstext: string = '';
  Businessvisible = false;
  Contacttext: string = '';
  ContactPersonvisible = false;
  Emailtext: string = '';
  Emailvisible = false;
  Mobiletext: string = '';
  MobileVisible = false;
  PANtext: string = '';
  PANVisible = false;
  GSTtext: string = '';
  GSTVisible = false;
  AddressVisible = false;
  reset(): void {
    this.isBusinessApplied = false;
    this.isEmailApplied = false;
    this.isMobileApplied = false;
    this.isContactApplied = false;
    this.isPanApplied = false;
    this.isGstApplied = false;
    this.PincodeVisible = false;
    this.searchText = '';
    this.Businesstext = '';
    this.Contacttext = '';
    this.Emailtext = '';
    this.Mobiletext = '';
    this.search();
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showcloumnVisible: boolean = false;
  showcolumn = [
    { label: 'PAN', key: 'PAN', visible: true },
    { label: 'GST No.', key: 'GST_NO', visible: true },
    { label: 'Country', key: 'COUNTRY_NAME', visible: false },
    { label: 'State', key: 'STATE_NAME', visible: false },
    { label: 'District', key: 'DISTRICT_NAME', visible: false },
    { label: 'Pincode', key: 'PINCODE', visible: false },
    { label: 'Status', key: 'STATUS', visible: true },
  ];
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  selectedCountries: number[] = [];
  selectedDist: number[] = [];
  selectedStates: number[] = [];
  selectedPincodes: number[] = [];
  selectedPincode: number[] = [];
  dataList: any = [];
  DistVisible: any;
  StateVisible: any;
  PincodeVisible: any;
  visible = false;
  countryVisible: boolean = false;
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(133, columnKey).subscribe(
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
      .getAllCountryMaster(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
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
  StateData: any = [];
  getStateData() {
    this.api
      .getState(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.StateData.push({ value: element.ID, display: element.NAME });
            });
          }
        }
      });
  }
  districtData: any = [];
  getDistData() {
    this.api
      .getdistrict(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.districtData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  PincodeData: any = [];
  getPincodeData(columnKey) {
    this.api.getDistinctData(133, columnKey).subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.PincodeData.push({
              value: element.PINCODE,
              display: element.PINCODE,
            });
          });
        }
      }
    });
  }
  handleError() {
    this.PincodeData = [];
    this.loadingRecords = false;
    this.message.error('Failed to get pincode data.', '');
  }
  handleHttpError(err: HttpErrorResponse) {
    this.loadingRecords = false;
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        ''
      );
    } else {
      this.message.error('Something went wrong.', '');
    }
  }
  shouldTruncateAt25(value: string): boolean {
    const mCount = (value.match(/m/g) || []).length; 
    return value.length > 25 && mCount > 6; 
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
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
  filterData: any;
  currentClientId = 1;
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
  openfilter() {
    this.drawerTitle = 'Vendor Filter';
    this.drawerFilterVisible = true;
    this.filterFields[6]['options'] = this.countryData;
    this.filterFields[7]['options'] = this.StateData;
    this.filterFields[8]['options'] = this.districtData;
    this.filterFields[9]['options'] = this.PincodeData;
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
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'BUSINESS_NAME',
      label: 'Business Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Business Name',
    },
    {
      key: 'NAME',
      label: 'Contact Person Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Contact Person Name',
    },
    {
      key: 'EMAIL_ID',
      label: 'Email Id',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Email Id',
    },
    {
      key: 'MOBILE_NUMBER',
      label: 'Mobile Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Mobile Number',
    },
    {
      key: 'GST_NO',
      label: 'GST No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter GST No.',
    },
    {
      key: 'PAN',
      label: 'PAN No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Pan No',
    },
    {
      key: 'COUNTRY_NAME',
      label: 'Country Name',
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
      key: 'STATE_NAME',
      label: 'State Name',
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
      placeholder: 'Enter State Name',
    },
    {
      key: 'DISTRICT_NAME',
      label: 'District Name',
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
      placeholder: 'Enter District Name',
    },
    {
      key: 'PINCODE',
      label: 'Pincode',
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
      placeholder: 'Enter Pincode',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  isDeleting: boolean = false;
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[6]['options'] = this.countryData;
    this.filterFields[7]['options'] = this.StateData;
    this.filterFields[8]['options'] = this.districtData;
    this.filterFields[9]['options'] = this.PincodeData;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
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
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: any;
  widths: any = '100%';
  custid: any;
  view(data: any): void {
    this.custid = data.ID;
    this.drawerTitleCustomers = `View details of ${data.NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.search();
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }
  drawerMappingTitle!: string;
  drawerMappigVisible: boolean = false;
  mapTerritory(data: any) {
    this.drawerMappingTitle = `Map the territory to ${data.NAME}`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisible = true;
  }
  draweMappingClose(): void {
    this.search();
    this.drawerMappigVisible = false;
  }
  get closeCallbackMapping() {
    return this.draweMappingClose.bind(this);
  }
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
    let imagePath = this.api.retriveimgUrl + 'VendorProfile/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
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
