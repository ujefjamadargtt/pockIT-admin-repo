import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-customerratting',
  templateUrl: './customerratting.component.html',
  styleUrls: ['./customerratting.component.css'],
})
export class CustomerrattingComponent {
  pageIndex = 1;
  pageSize = 10;
  pageIndexforTechnician = 1;
  pageSizeforTechnician = 10;
  isSpinning = false;
  dataList: any = [];
  technicianData: any = [];
  totalRecords = 1;
  orderID;
  progressList: any;
  averageRating;
  globalRating;
  progPer;
  progressTechList: any;
  averageTechnicianRating;
  globalTechnicianRating;

  @Input() FILTER_ID: any;
  @Input() TYPE: any = '';
  @Input() customer_id: any = '';
  CustomersData: any = [];
  TechData: any = [];
  filterQuery: string = '';
  filterQuery1: string = '';

  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  Customers: any = [];
  Technician: any = [];
  Vendorfilterquery1: any = '';

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  loaddata: boolean = false;
  public commonFunction = new CommonFunctionService();
  roleID;
  vendorid;
  useridd;
  TECHNICIAN_ID: any = [];
  roleIDs = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  customerMangeer: any = '';

  ngOnInit(): void {
    this.useridd = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.roleID = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.decreptedroleIDString = this.roleIDs
      ? this.commonFunction.decryptdata(this.roleIDs)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    if (
      this.decreptedroleID != 1 &&
      this.decreptedroleID != 6 &&
      this.decreptedroleID != 8 &&
      this.decreptedroleID != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    }
    if (this.decreptedroleID === 7) {
      this.customerMangeer = this.decreptedbackofficeId
    } else {
      this.customerMangeer = '';
    }
    if (this.TYPE == 'SHOP_ORDER') {
      this.viewshoprating();
    } else {
      if (this.TYPE == 'VENDOR') {
        var filterquery: any = '';
        var TECH_IDS: any = [];
        this.loaddata = true;
        this.api
          .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.FILTER_ID)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loaddata = false;

                data['data'].forEach((element) => {
                  if (element.ID) TECH_IDS.push(element.ID);
                });
                filterquery = ' AND ID in (' + TECH_IDS.toString() + ')';
                this.Vendorfilterquery1 =
                  ' AND TECHNICIAN_ID in (' + TECH_IDS.toString() + ')';
                if (TECH_IDS.length > 0) {
                  this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
                  this.getTECH1(filterquery);
                }
              } else {
                this.loaddata = false;
              }
            },
            (err) => {
              this.loaddata = false;
            }
          );
      } else {
        if (this.TYPE != 'CUSTOMER') {
          this.getCustomers();
        }
        if (this.TYPE != 'TECHNICIAN') {
          this.getTechinitialdata();
        }
      }
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  getCustomers() {
    if (this.TYPE != 'ORDER') {

      if (this.decreptedroleID == 7) {
        this.api
          .getAllCustomer(0, 0, 'NAME', 'desc', ' AND ACCOUNT_STATUS=1 AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.CustomersData = data['data'];
              } else {
                this.CustomersData = [];
              }
            },
            (err) => {
              this.CustomersData = [];
            }
          );
      } else {
        this.api
          .getAllCustomer(0, 0, 'NAME', 'desc', ' AND ACCOUNT_STATUS=1')
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.CustomersData = data['data'];
              } else {
                this.CustomersData = [];
              }
            },
            (err) => {
              this.CustomersData = [];
            }
          );
      }
    } else {
    }
  }

  getTechinitialdata() {
    if (this.roleID == '9') {
      this.vendorid = this.commonFunction.decryptdata(
        sessionStorage.getItem('vendorId') || ''
      );
      this.api
        .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.vendorid)
        .subscribe((successdata2) => {
          if (successdata2['code'] == 200) {
            if (successdata2['count'] > 0) {
              this.TECHNICIAN_ID = [];
              successdata2['data'].forEach((element) => {
                this.TECHNICIAN_ID.push(element.ID);
              });
              this.getTECH();
            }
          }
        });
    } else if (
      this.roleID != 1 &&
      this.roleID != 6 &&
      this.roleID != 8 &&
      this.roleID != 9
    ) {
      var filterrrr = ' AND USER_ID=' + this.useridd;
      this.api.getBackOfficeData(0, 0, '', '', filterrrr).subscribe(
        (dataaa1) => {
          if (dataaa1['code'] == 200) {
            this.api
              .getterritoryPincodeData11(
                0,
                0,
                '',
                '',
                " AND STATUS='M' AND TERRITORY_ID in (" +
                dataaa1['data'][0].TERITORY_IDS +
                ')'
              )
              .subscribe(
                (successdata) => {
                  if (successdata['code'] == 200) {
                    var t: any = [];
                    successdata['data'].forEach((element) => {
                      t.push(element.PINCODE_ID);
                    });
                    this.api
                      .getTechnicianPincodeMappedData(
                        0,
                        0,
                        '',
                        '',
                        " AND STATUS='M' AND PINCODE_ID in (" +
                        t.toString() +
                        ')'
                      )
                      .subscribe((successdata2) => {
                        this.TECHNICIAN_ID = [];
                        successdata2['data'].forEach((element) => {
                          this.TECHNICIAN_ID.push(element.TECHNICIAN_ID);
                        });
                        this.getTECH();
                      });
                  }
                },
                () => {
                  this.message.error('Something Went Wrong', '');
                }
              );
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.getTECH();
      this.ViewCustomerReviewDetails();
    }
  }
  getTECH() {
    var filter = '';
    if (
      this.roleID != 1 &&
      this.roleID != 6 &&
      this.roleID != 8
    ) {
      var tec = Array.from(new Set(this.TECHNICIAN_ID));
      filter = ' AND ID in(' + tec.toString() + ')';
    }

    this.api
      .getTechnicianData(0, 0, 'NAME', 'desc', ' AND IS_ACTIVE=1' + filter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.TechData = data['data'];
            if (
              this.roleID != 1 &&
              this.roleID != 6 &&
              this.roleID != 8
            ) {
              this.Technician = tec;
              this.ViewCustomerReviewDetails();
            }
          } else {
            this.TechData = [];
          }
        },
        (err) => {
          this.TechData = [];
        }
      );
  }

  getTECH1(filter: any) {
    this.api
      .getTechnicianData(0, 0, 'NAME', 'desc', ' AND IS_ACTIVE=1' + filter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.TechData = data['data'];
          } else {
            this.TechData = [];
          }
        },
        (err) => {
          this.TechData = [];
        }
      );
  }

  clearFilter() {
    this.pageIndex = 1;
    this.filterQuery = '';
    this.filterQuery1 = '';

    if (this.TYPE != 'JOB' && this.TYPE != 'ORDER') this.Customers = null;
    if (
      this.roleID != 1 &&
      this.roleID != 6 &&
      this.roleID != 8
    ) {
      var tec = Array.from(new Set(this.TECHNICIAN_ID));
      this.Technician = tec;
    } else this.Technician = null;

    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    if (this.TYPE == 'VENDOR') {
      this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
    } else {
      this.ViewCustomerReviewDetails();
    }
  }
  loadMore() {
    this.pageSize += 10;
    if (this.TYPE == 'SHOP_ORDER') {
      this.viewshoprating();
    } else if (this.TYPE == 'VENDOR') {
      this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
    } else {
      this.ViewCustomerReviewDetails();
    }
  }
  filterdata: any = '';

  ViewCustomerReviewDetails() {
    // this.customerfilter = this.customerfilter == undefined ? '' : this.customerfilter
    this.isSpinning = true;
    if (this.TYPE == 'ORDER' || this.TYPE == 'JOB') {
      this.Customers = this.customer_id;
    } else if (
      this.Customers != undefined &&
      this.Customers != null &&
      this.Customers.length > 0
    ) {
      this.filterQuery = ' AND CUSTOMER_ID IN(' + this.Customers + ')';
    } else {
      this.filterQuery = '';
    }

    if (
      this.Technician != undefined &&
      this.Technician != null &&
      this.Technician.length > 0
    ) {
      this.filterQuery1 = ' AND TECHNICIAN_ID IN(' + this.Technician + ')';
    } else {
      this.filterQuery1 = '';
    }

    if (
      this.TYPE == 'CUSTOMER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND CUSTOMER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'JOB' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND JOB_CARD_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'ORDER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND ORDER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'TECHNICIAN' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND TECHNICIAN_ID=' + this.FILTER_ID;
    } else {
      this.filterdata = '';
    }
    this.api
      .getTechnicianReviewData1(
        this.pageIndex,
        this.pageSize,
        '',
        '',
        this.filterQuery + this.filterQuery1 + this.filterdata, this.customerMangeer
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.dataList = data['data'];
            this.totalRecords = Number(data['count']);
            this.averageRating = Number(data['averageRating']);
            this.globalRating = data['count'];
            this.progressList = data['progress'].reverse();
            this.isSpinning = false;
            //
          } else {
            this.dataList = [];
            this.message.error('Failed To Get Customer Review Details.', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
        }
      );
  }

  ViewCustomerReviewDetails1(dataFilt: any) {
    // this.customerfilter = this.customerfilter == undefined ? '' : this.customerfilter
    this.isSpinning = true;

    if (this.TYPE == 'ORDER' || this.TYPE == 'JOB') {
      this.Customers = this.customer_id;
    } else if (
      this.Customers != undefined &&
      this.Customers != null &&
      this.Customers.length > 0
    ) {
      this.filterQuery = ' AND CUSTOMER_ID IN(' + this.Customers + ')';
    } else {
      this.filterQuery = '';
    }
    if (
      this.Technician != undefined &&
      this.Technician != null &&
      this.Technician.length > 0
    ) {
      this.filterQuery1 = ' AND TECHNICIAN_ID IN(' + this.Technician + ')';
    } else {
      this.filterQuery1 = '';
    }

    if (
      this.TYPE == 'CUSTOMER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND CUSTOMER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'JOB' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND JOB_CARD_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'ORDER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND ORDER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'TECHNICIAN' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND TECHNICIAN_ID=' + this.FILTER_ID;
    } else {
      this.filterdata = '';
    }
    this.api
      .getTechnicianReviewData1(
        this.pageIndex,
        this.pageSize,
        '',
        '',
        this.filterQuery + this.filterQuery1 + this.filterdata + dataFilt, this.customerMangeer
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.dataList = data['data'];
            this.totalRecords = Number(data['count']);
            this.averageRating = Number(data['averageRating']);
            this.globalRating = data['count'];
            this.progressList = data['progress'].reverse();
            this.isSpinning = false;
            //
          } else {
            this.dataList = [];
            this.message.error('Failed To Get Customer Review Details.', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
        }
      );
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    // this.loadingRecords = true;
    if (this.TYPE == 'VENDOR') {
      if (
        this.Customers != null &&
        this.Customers != undefined &&
        this.Customers.length > 0 &&
        this.Technician != null &&
        this.Technician != undefined &&
        this.Technician.length > 0
      ) {
        this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else if (
        this.Customers != null &&
        this.Customers != undefined &&
        this.Customers.length > 0
      ) {
        this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else if (
        this.Technician != null &&
        this.Technician != undefined &&
        this.Technician.length > 0
      ) {
        this.ViewCustomerReviewDetails1(this.Vendorfilterquery1);
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else {
        this.message.error('Please Select Filter', '');
        this.filterQuery = '';
        this.isFilterApplied = 'default';
      }
    } else {
      if (
        this.Customers != null &&
        this.Customers != undefined &&
        this.Customers.length > 0 &&
        this.Technician != null &&
        this.Technician != undefined &&
        this.Technician.length > 0
      ) {
        this.ViewCustomerReviewDetails();
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else if (
        this.Customers != null &&
        this.Customers != undefined &&
        this.Customers.length > 0
      ) {
        this.ViewCustomerReviewDetails();
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else if (
        this.Technician != null &&
        this.Technician != undefined &&
        this.Technician.length > 0
      ) {
        this.ViewCustomerReviewDetails();
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
      } else {
        this.message.error('Please Select Filter', '');
        this.filterQuery = '';
        this.isFilterApplied = 'default';
      }
    }

    // this.loadingRecords = false;
  }

  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
    }
  }

  viewshoprating() {
    // this.customerfilter = this.customerfilter == undefined ? '' : this.customerfilter
    this.isSpinning = true;

    this.filterdata = ' AND ORDER_ID=' + this.FILTER_ID;
    // this.filterQuery + this.filterQuery1 +
    this.api
      .getshoporderrattingdata(
        this.pageIndex,
        this.pageSize,
        '',
        '',
        this.filterdata
      )
      .subscribe(
        (data) => {
          if (data['status'] === 200) {
            this.dataList = data['body']['data'];
            this.totalRecords = Number(data['body']['count']);
            this.averageRating = Number(data['body']['averageRating']);
            this.globalRating = data['body']['count'];
            this.progressList = data['body']['progress'].reverse();
            this.isSpinning = false;
            //
          } else {
            this.dataList = [];
            this.message.error('Failed To Get Customer Review Details.', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
        }
      );
  }
}