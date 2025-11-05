import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-customer-actions',
  templateUrl: './customer-actions.component.html',
  styleUrls: ['./customer-actions.component.css']
})
export class CustomerActionsComponent implements OnInit {
  formTitle = "Manage Customers";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  // dataList = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  dataList: any = [];
  @Input() drawerClose: Function;
  @Input() data: customer = new customer();
  @Input() drawerVisible: boolean;
  @Input() custid: any;

  constructor(private api: ApiServiceService, private message: NzNotificationService, public router: Router) { }
  ngOnInit() {
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
    this.loadingRecords = true;
    this.api
      .getAllCustomer(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort, ''
        // ' AND ID=' + this.custid
      )
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
  assigndataa: any;
  openModal: boolean = false;
  openModal1: boolean = false;

  REMARKS: any;
  isSpinning: boolean = false;
  edit(data: any) {
    this.assigndataa = data;
    this.openModal = true;
  }

  edit1(data: any) {
    this.assigndataa = data;
    this.openModal1 = true;
  }


  closemodelll() {
    this.assigndataa = null;
    this.openModal = false;
    this.openModal1 = false;
  }

  Approve(data: any) {
    this.isSpinning = true;
    this.api.updateCustomer(this.data).subscribe((successCode: any) => {
      if (successCode.code == "200") {
        this.isSpinning = false;
        this.openModal = false;
        this.message.success(
          "Invoice rejected successfully",
          ""
        );
        this.drawerClose();
      } else {
        this.message.error("Failed to reject invoice", "");
        this.isSpinning = false;
      }
    }, err => {
      this.message.error("Something went wrong, please try again later", "");
      this.isSpinning = false;
    });
  }

  reject(data: any) {
    if (this.REMARKS == null || this.REMARKS == undefined || this.REMARKS.trim() == '') {
      this.message.error("Please enter rejection remark", "")
    } else {
      this.isSpinning = true;
      this.api.updateCustomer(this.data).subscribe((successCode: any) => {
        if (successCode.code == "200") {
          this.isSpinning = false;
          this.openModal = false;
          this.message.success(
            "Invoice rejected successfully",
            ""
          );
          this.drawerClose();
        } else {
          this.message.error("Failed to reject invoice", "");
          this.isSpinning = false;
        }
      }, err => {
        this.message.error("Something went wrong, please try again later", "");
        this.isSpinning = false;
      });
    }

  }

}
