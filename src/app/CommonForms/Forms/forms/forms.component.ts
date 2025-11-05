import { Component, OnInit } from '@angular/core';
import { FormMaster } from 'src/app/CommonModels/form-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  formTitle = 'Manage Forms';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PARENT_NAME', 'Parent Name'],
    ['NAME', 'Name'],
    ['LINK', 'link'],
    ['ICON', 'Icon'],
  ];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: FormMaster = new FormMaster();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.search();
  }

  keyup(event) {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
  }

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery += ')';
    }

    this.loadingRecords = true;
    this.api
      .getAllForms(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        () => {
          this.loadingRecords = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Form';
    this.drawerData = new FormMaster();
    this.drawerVisible = true;
  }

  edit(data: FormMaster): void {
    this.drawerTitle = 'Update Form Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
