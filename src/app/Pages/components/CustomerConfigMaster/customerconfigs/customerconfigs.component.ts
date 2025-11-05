import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { custconfig } from 'src/app/Pages/Models/custconfig';

@Component({
  selector: 'app-customerconfigs',
  templateUrl: './customerconfigs.component.html',
  styleUrls: ['./customerconfigs.component.css']
})
export class CustomerconfigsComponent {
  formTitle = "Manage Customer Config.";
  drawerVisible: boolean = false
  drawerData: custconfig = new custconfig();
  searchText = ''
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  totalRecords = 1
  emailServiceConfigData: any = []

  constructor(
    private router: Router
  ) { }
  ngOnInit() {
  }
  drawerClose(): void {
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerTitle = ''
  add(): void {
    this.drawerTitle = "Create New Customer Config";

    this.drawerVisible = true;
  }
  edit(data) { }
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
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
}
