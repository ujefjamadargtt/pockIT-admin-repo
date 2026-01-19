import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-customer-overview-list',
  templateUrl: './customer-overview-list.component.html',
  styleUrls: ['./customer-overview-list.component.css'],
  providers: [DatePipe]
})
export class CustomerOverviewListComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: customer = new customer();
  @Input() drawerVisible: boolean;
  @Input() custid: any;
  @Input() TYPE: any = '';
  cusstomerFilter: any = '';
  constructor(private api: ApiServiceService, private message: NzNotificationService) { }
  ngOnInit() {
    this.getaddressData();
    this.getCustomerData();
    this.cusstomerFilter = " AND CUSTOMER_ID=" + this.custid
  }
  close() {
    this.drawerClose();
  }
  @Input() jobdetailsdata: any
  @Input() invoicefilter: any
  show: any = 0
  onSelectedIndexChange(event) {
    this.show = event;
  }
  addressData: any = [];
  loadaddresses: boolean = false;
  totalRecords: any = 0;
  CustData: any = [];
  loadCust: boolean = false;
  getaddressData() {
    this.loadaddresses = true;
    this.api.getAllCustomerAddress(0, 0, 'IS_DEFAULT',
      'desc', " AND STATUS = 1 AND CUSTOMER_ID=" + this.custid).subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.loadaddresses = false;
            this.totalRecords = data["count"]
            this.addressData = data["data"];
          } else {
            this.loadaddresses = false;
            this.totalRecords = 0;
            this.addressData = [];
          }
        },
        (err) => {
          this.loadaddresses = false;
          this.totalRecords = 0;
          this.addressData = [];
        }
      );
  }
  getCustomerData() {
    this.loadCust = true;
    this.api.getAllCustomer(0, 0, "", "desc", " AND ID=" + this.custid).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.loadCust = false;
          this.CustData = data["data"][0];
        } else {
          this.loadCust = false;
          this.CustData = [];
        }
      },
      (err) => {
        this.loadCust = false;
        this.CustData = [];
      }
    );
  }
}
