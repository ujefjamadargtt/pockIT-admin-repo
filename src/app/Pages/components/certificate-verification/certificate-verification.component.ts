import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-certificate-verification',
  templateUrl: './certificate-verification.component.html',
  styleUrls: ['./certificate-verification.component.css'],
})
export class CertificateVerificationComponent {
  formTitle = 'Certificate Verification';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  columns: string[][] = [
    ['ISSUED_BY_ORGANIZATION_NAME', 'ISSUED_BY_ORGANIZATION_NAME'],
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['NAME', 'NAME'],
    ['CREDENTIAL_ID', 'CREDENTIAL_ID'],
    ['CERTIFICATE_PHOTO', 'CERTIFICATE_PHOTO'],
    ['APPROVED_BY', 'APPROVED_BY'],
    ['REJECT_REMARK', 'REJECT_REMARK'],
  ];
  time = new Date();
  features = [];
  visible1 = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  showcolumn = [
    {
      label: 'Issued By Organization',
      key: 'ISSUED_BY_ORGANIZATION_NAME',
      visible: true,
    },
    { label: 'Technician Name ', key: 'TECHNICIAN_NAME', visible: true },
    { label: 'Certificate Name ', key: 'NAME', visible: true },
    { label: 'Credential ID ', key: 'CREDENTIAL_ID', visible: true },
    { label: 'Certificate Image', key: 'CERTIFICATE_PHOTO', visible: true },
    { label: 'Request Date ', key: 'ISSUED_DATE', visible: true },
    { label: 'Remark', key: 'REJECT_REMARK', visible: true },
  ];
  isapprovedDateFilterApplied = false;
  approvedDateVisible = false;
  isapprovedFilterApplied = false;
  approvedvisible = false;
  approvedby = '';
  techname = '';
  istechnmFilterApplied = false;
  technamevisible = false;
  showcloumnVisible: boolean = false;
  orderrno: string = '';
  ordernovisible = false;
  Mobilenovisible = false;
  customernamevisible = false;
  addressvisible = false;
  statusFilter: string | undefined = undefined;
  isnewFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilterisnew: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  onISNEWFilterChange(selectedStatus: string) {
    this.isnewFilter = selectedStatus;
    this.search(true);
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Approved By ', value: 'APPROVED_BY' },
    { label: 'Technician Name ', value: 'TECHNICIAN_NAME' },
    { label: 'Certificate Name ', value: 'CERTIFICATE_NAME' },
    { label: 'Remark', value: 'REJECT_REMARK' },
  ];
  isFilterApplied: boolean = false;
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
    private sanitizer: DomSanitizer
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    this.getcounts();
  }
  imageshow: any = null;
  selectedFile: any;
  imagePreview: any;
  ImageModalVisible = false;
  ViewImage = 1;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'CertificatePhotos/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = imagePath;
    this.ImageModalVisible = true;
  }
  VERIFIED_STATUS: any = 'P';
  ExtraQuery: any = '';
  back() {
    this.router.navigate(['/masters/menu']);
  }
  reset(): void {
    this.searchText = '';
    this.customername = '';
    this.techname = '';
    this.approvedby = '';
    this.search();
  }
  submittedDateVisible = false;
  isSubmittedDateFilterApplied: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  approvedDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isSubmittedDateFilterApplied = true;
      }
    } else {
      this.StartDate = null; 
      this.search();
      this.isSubmittedDateFilterApplied = false;
    }
  }
  onApprovedDateRangeChange(): void {
    if (this.approvedDate && this.approvedDate.length === 2) {
      const [start, end] = this.approvedDate;
      if (start && end) {
        this.search();
        this.isapprovedDateFilterApplied = true;
      }
    } else {
      this.approvedDate = null; 
      this.search();
      this.isapprovedDateFilterApplied = false;
    }
  }
  sort(params: NzTableQueryParams): void {
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
  TabId: number;
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
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
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(ISSUED_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00')`;
      }
    }
    if (this.approvedDate && this.approvedDate.length === 2) {
      const [start, end] = this.approvedDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `(ACTION_DATE_TIME BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00')`;
      }
    }
    if (this.customername !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ISSUED_BY_ORGANIZATION_NAME LIKE '%${this.customername.trim()}%'`;
    }
    if (this.approvedby !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `APPROVED_BY LIKE '%${this.approvedby.trim()}%'`;
    }
    if (this.techname !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.techname.trim()}%'`;
    }
    if (this.remark !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REJECT_REMARK LIKE '%${this.remark.trim()}%'`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.ExtraQuery = " AND STATUS='" + this.VERIFIED_STATUS + "'";
    this.api
      .gettechniciancertificatereq(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.ExtraQuery + ' AND !IS_DELETE'
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
            this.TabId = data.body['TAB_ID'];
            this.api
              .gettechniciancertificatereqcount(
                this.pageIndex,
                this.pageSize,
                this.sortKey,
                sort,
                likeQuery + this.filterQuery + ' AND !IS_DELETE'
              )
              .subscribe(
                (dataaa) => {
                  if (data['status'] == 200) {
                    this.loadingRecords = false;
                    this.approvedCount = dataaa.body['data'][0]['APPROVED'];
                    this.pendingCount = dataaa.body['data'][0]['PENDING'];
                    this.rejectedCount = dataaa.body['data'][0]['REJECTED'];
                  } else {
                    this.loadingRecords = false;
                    this.message.error(
                      'Failed to get Data. please try again later.',
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
                  } else {
                    this.message.error('Server error: ' + err.message, '');
                  }
                }
              );
          } else if (data['status'] == 400) {
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
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  isordernoFilterApplied = false;
  iscustnmFilterApplied = false;
  ismobFilterApplied = false;
  Seqtext: string = '';
  customername: string = '';
  mobilenooo: string = '';
  addressss: string = '';
  reason: string = '';
  remark: String = '';
  remarkvisible = false;
  isremarkFilterApplied = false;
  reasonvisible = false;
  Seqvisible = false;
  isaddFilterApplied = false;
  isreasonFilterApplied = false;
  isterritorynameFilterApplied = false;
  territoryVisible = false;
  selectedterritory: any[] = [];
  onKeyup(event: KeyboardEvent, field: string): void {
    if (
      this.customername.length >= 3 &&
      event.key === 'Enter' &&
      field == 'CR_N'
    ) {
      this.search();
      this.iscustnmFilterApplied = true;
    } else if (
      this.customername.length == 0 &&
      event.key === 'Backspace' &&
      field == 'CR_N'
    ) {
      this.search();
      this.iscustnmFilterApplied = false;
    }
    if (this.techname.length >= 3 && event.key === 'Enter' && field == 'TECH') {
      this.search();
      this.istechnmFilterApplied = true;
    } else if (
      this.techname.length == 0 &&
      event.key === 'Backspace' &&
      field == 'TECH'
    ) {
      this.search();
      this.istechnmFilterApplied = false;
    }
    if (
      this.approvedby.length >= 3 &&
      event.key === 'Enter' &&
      field == 'APB'
    ) {
      this.search();
      this.isapprovedFilterApplied = true;
    } else if (
      this.approvedby.length == 0 &&
      event.key === 'Backspace' &&
      field == 'APB'
    ) {
      this.search();
      this.isapprovedFilterApplied = false;
    }
    if (this.remark.length >= 3 && event.key === 'Enter' && field == 'REM') {
      this.search();
      this.isremarkFilterApplied = true;
    } else if (
      this.remark.length == 0 &&
      event.key === 'Backspace' &&
      field == 'REM'
    ) {
      this.search();
      this.isremarkFilterApplied = false;
    }
  }
  onCountryChange(): void {
    if (this.selectedterritory?.length) {
      this.search();
      this.isterritorynameFilterApplied = true; 
    } else {
      this.search();
      this.isterritorynameFilterApplied = false; 
    }
  }
  navigateToMastersMenu(): void {
    this.router.navigate(['/masters/menu']);
  }
  close(): void {
    this.visible1 = false;
  }
  close1(accountMasterPage: NgForm) {
    this.drawerVisible1 = false;
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
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
  decryptedUserId = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '0';
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1;
  selectedFilter: string | null = null;
  oldFilter: any[] = [];
  isLoading = false;
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
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
    this.drawerTitle = 'Cerficate Verification Filter';
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  filterFields: any[] = [
    {
      key: 'ISSUED_DATE',
      label: 'Request Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Request Date',
    },
    {
      key: 'ACTION_DATE_TIME',
      label: 'Verification Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Verification Date',
    },
    {
      key: 'APPROVED_BY',
      label: 'Approved By',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Enter Approved By',
    },
    {
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Enter Technician Name',
    },
    {
      key: 'NAME',
      label: 'Certificate Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Certificate Name',
    },
    {
      key: 'CREDENTIAL_ID',
      label: 'Credential ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Credential ID',
    },
    {
      key: 'ISSUED_BY_ORGANIZATION_NAME',
      label: 'Organization Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Enter Organization Name',
    },
  ];
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
  whichbutton: any;
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
  rejectreason: any = '';
  appreorder(data: any, action: any) {
    this.isspinnnnnnn = true;
    if (
      (this.rejectreason == '' ||
        this.rejectreason == null ||
        this.rejectreason == undefined) &&
      this.action == 'R'
    ) {
      this.message.error('Please enter rejection remark ', '');
      this.isspinnnnnnn = false;
    } else {
      var dataaa = {
        ID: data.ID,
        STATUS: this.action,
        REJECT_REMARK: this.rejectreason == '' ? '' : this.rejectreason,
        TECHNICIAN_ID: data.TECHNICIAN_ID,
        TECHNICIAN_NAME: data.TECHNICIAN_NAME,
      };
      this.api.updatetechniciancertificatestatus(dataaa).subscribe(
        (successCode: any) => {
          if (successCode.status == 200) {
            if (this.action == 'A') {
              this.message.success(
                'The Certificate verification request has been approved successfully.',
                ''
              );
              this.rejectreason = '';
            } else {
              this.message.success(
                'The Certificate verification request has been rejected successfully.',
                ''
              );
              this.rejectreason = '';
            }
            this.openmodell = false;
            this.isspinnnnnnn = false;
            this.search();
          } else {
            this.message.error('Failed to update', '');
            this.isspinnnnnnn = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isspinnnnnnn = false;
        }
      );
    }
  }
  isspinnnnnnn: boolean = false;
  openmodell: boolean = false;
  openmodellRefund: boolean = false;
  cancelorderdata: any;
  action: any;
  opencancelmodal(event: any, action: any) {
    this.openmodell = true;
    this.action = action;
    this.cancelorderdata = '';
    this.cancelorderdata = event;
  }
  opencancelmodalRefunc(event: any) {
    this.openmodellRefund = true;
    this.cancelorderdata = '';
    this.cancelorderdata = event;
  }
  canorderRefund() {
    this.openmodellRefund = false;
    this.isspinnnnnnn = false;
    this.cancelorderdata = '';
  }
  simplecancel() {
    this.openmodell = false;
    this.isspinnnnnnn = false;
    this.cancelorderdata = '';
  }
  rejectedCount: any = 0;
  pendingCount: any = 0;
  approvedCount: any = 0;
  getcounts() { }
  selectStatus(event) {
    this.VERIFIED_STATUS = event;
    this.search(true);
  }
}