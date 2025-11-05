import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  encapsulation: ViewEncapsulation.None, // Make styles global
})
export class RolesComponent implements OnInit {
  formTitle = 'Manage Roles';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PARENT_ROLE_NAME', 'Parent'],
    ['NAME', 'Name'],
    ['DESCRIPTION', 'Description'],
    ['TYPE', 'Type'],
  ];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: RoleMaster = new RoleMaster();
  drawerVisible1: boolean = false;
  drawerTitle1: string = '';
  drawerData1: RoleMaster = new RoleMaster();
  drawerData2: string[] = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit() {
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

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }

    this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.api
      .getAllRoles(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + " AND ARCHIVE_FLAG='F'")
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        () => {
          this.loadingRecords = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Role';
    this.drawerData = new RoleMaster();
    this.drawerVisible = true;
  }

  edit(data: RoleMaster): void {
    this.drawerTitle = 'Update Role Details';
    this.drawerData = Object.assign({}, data);
    this.drawerData.PARENT_ID = this.drawerData.PARENT_ID;

    this.drawerVisible = true;
  }

  MapData: any;
  loadForm: boolean = false;
  MapForms(data: RoleMaster): void {
    this.loadForm = true;
    this.MapData = data.ID;

    this.api.getRoleDetails(data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.drawerData2 = data['data'];
          this.loadForm = false;
        } else {
          this.message.error('Something Went Wrong', '');
          this.loadForm = false;
        }
      },
      () => {
        this.message.error('Something Went Wrong ...', '');
      }
    );

    this.drawerTitle1 = 'Assign form to ' + data.NAME + '';
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  keyup(event) {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
  }
}
