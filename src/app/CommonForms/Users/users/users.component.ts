import { Component, OnInit } from '@angular/core';
import { UserMaster } from 'src/app/CommonModels/user-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  formTitle = 'Manage Users';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  roles: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  userRolevisible: boolean = false;
  isRoleFilterApplied = false;
  selectedRoles: number[] = [];
  userNamevisible: boolean = false;
  isUserNameFilterApplied = false;
  UserNametext: string = '';
  Emailvisible: boolean = false;
  isEmailFilterApplied = false;
  Emailtext: string = '';
  columns: string[][] = [
    ['ROLE_NAME', 'Role'],
    ['NAME', 'Name'],
    ['EMAIL_ID', 'Email'],
  ];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: any = new UserMaster();
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
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
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.UserNametext.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.UserNametext.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
    if (this.Emailtext.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.Emailtext.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  ngOnInit() {
    this.getRoleData();
    this.search();
  }
  onRoleChange(): void {
    this.search();
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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
    this.search(false);
  }
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
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
    if (this.selectedRoles.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `ROLE_ID IN (${this.selectedRoles.join(',')})`; 
      this.isRoleFilterApplied = true;
    } else {
      this.isRoleFilterApplied = false;
    }
    if (this.UserNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.UserNametext.trim()}%'`;
      this.isUserNameFilterApplied = true;
    } else {
      this.isUserNameFilterApplied = false;
    }
    if (this.Emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.Emailtext.trim()}%'`;
      this.isEmailFilterApplied = true;
    } else {
      this.isEmailFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllUsers(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + '' + " AND ROLE_TYPE='Super Admin'"
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => { }
      );
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  showcolumn = [
    { label: 'Branch ', key: 'NAME', visible: true },
    { label: 'Country', key: 'COUNTRY_NAME', visible: true },
    { label: 'State', key: 'STATE_NAME', visible: true },
    { label: 'City', key: 'CITY_NAME', visible: true },
  ];
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New User';
    this.drawerData = new UserMaster();
    this.drawerData.IS_ACTIVE = true;
    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update User Details';
    this.drawerData = Object.assign({}, data);
    if (
      this.drawerData.ROLE_IDS != null &&
      this.drawerData.ROLE_IDS != undefined &&
      this.drawerData.ROLE_IDS != ''
    ) {
      this.drawerData.ROLE_DATA = data['ROLE_IDS'].split(',');
      for (var i = 0; i < this.drawerData.ROLE_DATA.length; i++) {
        this.drawerData.ROLE_DATA[i] = Number(this.drawerData.ROLE_DATA[i]);
      }
    } else {
    }
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ViewImage: any;
  ImageModalVisible = false;
  imageshow;
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'userProfile/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  roleData: any = [];
  getRoleData() {
    this.api.getAllRoles(0, 0, '', '', " AND ARCHIVE_FLAG='F'").subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.roleData = data['data'];
        } else {
          this.roleData = [];
          this.message.error('Failed To Get Role Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
}
