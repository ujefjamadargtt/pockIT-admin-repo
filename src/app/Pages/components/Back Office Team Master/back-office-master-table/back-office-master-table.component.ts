import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BackOfficeMasterData } from 'src/app/Pages/Models/BackOfficeMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-back-office-master-table',
  templateUrl: './back-office-master-table.component.html',
  styleUrls: ['./back-office-master-table.component.css'],
})
export class BackOfficeMasterTableComponent {
  public commonFunction = new CommonFunctionService();
  drawerMappigVisible: boolean = false;
  drawerVisible: boolean = false;
  drawerData: BackOfficeMasterData = new BackOfficeMasterData();
  searchText: string = '';
  formTitle = 'Manage Back Office Team';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  chapters: any = [];
  isLoading = true;
  statusFilter: string | undefined = undefined;
  nametext: string = '';
  nameVisible: boolean = false;
  roleVisible: boolean = false;
  selectedRole: number[] = [];
  emailtext: string = '';
  emailVisible: boolean = false;
  mobiletext: string = '';
  mobileVisible: boolean = false;
  isSpinning = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  columns: string[][] = [
    ['ROLE_NAME', 'ROLE_NAME'],
    ['NAME', 'NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    ['IS_ACTIVE', 'IS_ACTIVE'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  drawerMappingTitle!: string;
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
  ngOnInit() {
    this.userroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.userid = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    if (this.userroleid == '5') {
      var filterrrr = ' AND USER_ID=' + this.userid;
      this.api.getBackOfficeData(0, 0, '', '', filterrrr).subscribe(
        (dataaa1) => {
          if (dataaa1['code'] == 200) {
            var dataaaaaa1 = dataaa1['data'];
            this.territoryidfilter = dataaaaaa1[0].TERITORY_IDS;
            this.search(true);
          } else {
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
    }
    this.getroles();
  }
  roleidfilter: any;
  roleData: any[] = [];
  userroleid: any;
  userid: any;
  territoryidfilter: any = '';
  rolseloading: boolean = false;
  roleOptions: any[] = [];
  getroles() {
    this.rolseloading = true;
    this.api
      .getAllRoles(0, 0, '', 'asc', " AND TYPE = 'Back Office'")
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.roleData = data['data'];
            this.roleOptions = this.roleData.map((role: any) => ({
              value: String(role.ID),
              display: role.NAME,
            }));
            const roleField = this.filterFields.find(
              (field) => field.key === 'ROLE_ID'
            );
            if (roleField) {
              roleField.options = this.roleOptions;
            }
            this.rolseloading = false;
          } else {
            this.roleData = [];
            this.rolseloading = false;
            this.message.error('Failed to get roles', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.rolseloading = false;
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
  shouldTruncateAt25(value: string): boolean {
    const mCount = (value.match(/m/g) || []).length; 
    return value.length > 35 && mCount > 6; 
  }
  mainsearchkeyup(event: KeyboardEvent) {
    event.preventDefault(); 
    if (
      this.searchText.length === 0 ||
      (event.key === 'Enter' && this.searchText.length >= 3)
    ) {
      this.search();
    }
  }
  isnametextApplied = false;
  isEmailApplied = false;
  isMobileApplied = false;
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
      case 'nametext':
        this.isnametextApplied = value;
        break;
      case 'emailtext':
        this.isEmailApplied = value;
        break;
      case 'mobiletext':
        this.isMobileApplied = value;
        break;
      default:
        break;
    }
  }
  isRoleFilterApplied = false;
  onRoleChange(): void {
    this.isRoleFilterApplied =
      this.selectedRole && this.selectedRole.length > 0;
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
    var idfilter = '';
    this.loadingRecords = true;
    if (this.userroleid == '5') {
      if (this.territoryidfilter != '') {
        this.territoryidfilter = this.territoryidfilter.split(',');
        const likeConditions = this.territoryidfilter
          .map((id) => `TERITORY_IDS LIKE '%${id}%'`)
          .join(' OR ');
        idfilter += ` AND (${likeConditions})`;
      }
    }
    if (this.selectedRole.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ROLE_ID IN (${this.selectedRole.join(',')})`; 
    }
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NUMBER LIKE '%${this.mobiletext.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getBackOfficeData11(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + idfilter,
        this.territoryidfilter,
        this.userroleid == '5' ? 1 : 0
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
  @ViewChild('searchInput') searchInput!: ElementRef;
  preventDefault(event: Event) {
    event.preventDefault();
    this.searchInput.nativeElement.focus();
  }
  add(): void {
    this.drawerTitle = 'Create New Back Office Team Member';
    this.drawerData = new BackOfficeMasterData();
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  draweMappingClose(): void {
    this.search();
    this.drawerMappigVisible = false;
  }
  get closeCallbackMapping() {
    return this.draweMappingClose.bind(this);
  }
  edit(data: BackOfficeMasterData): void {
    this.drawerTitle = 'Update Back Office Team Member';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  reset(): void {
    this.isnametextApplied = false;
    this.isEmailApplied = false;
    this.isMobileApplied = false;
    this.searchText = '';
    this.nametext = '';
    this.search();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  mapTerritory(data: any) {
    this.drawerMappingTitle = `Map the territory to ${data.NAME}`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisible = true;
  }
  back() {
    this.router.navigate(['/masters/menu']); 
  }
  TabId: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
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
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
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
  selectedFilter: string | null = null;
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
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Back Office Team Member Filter';
    this.drawerFilterVisible = true;
    this.filterFields[0]['options'] = this.roleOptions;
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
      key: 'ROLE_NAME',
      label: 'Role',
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
      placeholder: 'Enter role Name',
    },
    {
      key: 'NAME',
      label: 'Team Member Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Team Member Name',
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
    this.filterFields[0]['options'] = this.roleOptions;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
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
    let imagePath = this.api.retriveimgUrl + 'BackofficeProfile/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
}
