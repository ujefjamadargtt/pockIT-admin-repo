import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CountryData } from 'src/app/Pages/Models/CountryMasterData';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-wallet-list-drawer',
  templateUrl: './wallet-list-drawer.component.html',
  styleUrls: ['./wallet-list-drawer.component.css'],
})
export class WalletListDrawerComponent implements OnInit {
  @Input() data: any = CountryData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
  ) { }
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  transactionData: any[] = [];
  filterQuery: string = '';
  TabId: number;
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  filterGroups: any[] = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: { field: '', comparator: '', value: '' },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  filterData: any;
  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: { field: '', comparator: '', value: '' },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  ngOnInit(): void {
    this.search();
  }
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') this.search();
    else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.transactionData = [];
      this.likeQuery = '';
      this.search();
    }
  }
  onEnterKey(event: Event) {
    (event as KeyboardEvent).preventDefault();
  }
  likeQuery = '';
  totalSpendAmt = 0;
  search(): void {
    this.isSpinning = true;
    {
      if (this.searchText !== '') {
        this.likeQuery = ` AND (CUSTOMER_NAME LIKE '%${this.searchText}%')`;
      }
      let payload = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortKey: this.sortKey,
        sortValue: this.sortValue,
        filter: ` AND TRANSACTION_ID = ${this.data.ID} ${this.likeQuery}`,
      };
      this.api.getCustomerWalletTransaction(payload).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.transactionData = successCode.data || [];
            this.totalRecords = successCode.count;
            this.TabId = successCode.TAB_ID;
            this.totalSpendAmt = successCode.totalamt[0].TOTAL_AMOUNT || 0;
            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(successCode.message, '');
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            '',
          );
          this.isSpinning = false;
        },
      );
    }
  }
  close() {
    this.drawerClose();
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortKey = currentSort?.key || 'id';
    if (currentSort?.value === 'ascend') {
      this.sortValue = 'asc';
    } else if (currentSort?.value === 'descend') {
      this.sortValue = 'desc';
    } else {
      this.sortValue = '';
    }
    this.search();
  }
}
