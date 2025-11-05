import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { paymentgateway } from 'src/app/Pages/Models/paymentgateway';

@Component({
  selector: 'app-paymentgateways',
  templateUrl: './paymentgateways.component.html',
  styleUrls: ['./paymentgateways.component.css']
})
export class PaymentgatewaysComponent {
  formTitle = "Manage Payment gateway Config.";
  drawerVisible: boolean = false
  drawerData: paymentgateway = new paymentgateway();
  searchText = ''
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  totalRecords = 1
  emailServiceConfigData: any = []
  paymentGatewayData: any = []
  drawerClose(): void {
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerTitle = ''
  add(): void {
    this.drawerTitle = "Create New Payment gateway Config";

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
}
