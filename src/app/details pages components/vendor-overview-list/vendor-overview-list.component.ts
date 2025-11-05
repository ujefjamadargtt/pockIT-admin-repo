import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';

@Component({
  selector: 'app-vendor-overview-list',
  templateUrl: './vendor-overview-list.component.html',
  styleUrls: ['./vendor-overview-list.component.css'],
  providers: [DatePipe]
})
export class VendorOverviewListComponent implements OnInit {
  @Input() FILTER_ID: any
  @Input() TYPE: any = '';

  isSpinning: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  selectedTerritor: string = '';
  isfilterapply = false;
  selectedTechnicianDropdown: string = 'tech1';

  techniciansdata: any[] = [];
  timelineData: any[] = [];
  technician: any[] = [];
  originalTechniciansData: any = [];

  leaveTechnicians = ['Technician 3', 'Technician 4'];
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  selectedDate: Date[] = [];
  date1 =
    new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1;
  value1: any = '';
  value2: any = '';
  ranges: any = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'This Year': [startOfYear(new Date()), endOfYear(new Date())]
  };
  custType: any = '';
  columns: string[][] = [
    ['INVOICE_DATE', 'INVOICE_DATE'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['CUSTOMER_TYPE', 'CUSTOMER_TYPE'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMAIL', 'EMAIL'],
    ['EMAIL', 'EMAIL'],
    ['TOTAL_AMOUNT', 'TOTAL_AMOUNT'],
    ['TAX_AMOUNT', 'TAX_AMOUNT'],
    ['FINAL_AMOUNT', 'FINAL_AMOUNT']
  ];

  Customers: any = [];
  filterQuery1: any = '';
  filterQuery2: any = '';
  filterQuery3: any = '';
  filterQuery4: any = '';
  filterQuery5: any = '';
  filterQuery6: any = '';


  CustomersData: any = []
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getTechniciandata();
    this.value1 = this.datepipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datepipe.transform(new Date(), 'yyyy-MM-31');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using datepipe
    const formattedStartDate: any = this.datepipe.transform(startOfMonth, 'yyyy-MM-dd');
    const formattedEndDate: any = this.datepipe.transform(endOfMonth, 'yyyy-MM-dd');

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
  }
  getCustomers() {
    this.api.getAllCustomer(0, 0, 'NAME', 'desc', ' AND ACCOUNT_STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.CustomersData = data['data'];
      } else {
        this.CustomersData = [];
      }
    }, err => {
      this.CustomersData = [];
    });
  }
  changeDate(value: any) {
    this.value1 = this.datepipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datepipe.transform(value[1], 'yyyy-MM-dd');
  }
  searchdata() {
    if (this.searchText.length >= 3) {
      this.getTechniciandata(true);
    }
  }
  clearFilter() {
    this.pageIndex = 1;
    this.filterQuery = '';
    this.filterQuery1 = '';
    this.filterQuery2 = '';
    this.Customers = null;
    this.selectedDate = [];
    this.custType = '';
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datepipe.transform(startOfMonth, 'yyyy-MM-dd');
    const formattedEndDate: any = this.datepipe.transform(endOfMonth, 'yyyy-MM-dd');

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    this.value1 = this.datepipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datepipe.transform(new Date(), 'yyyy-MM-31');
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.getTechniciandata(true);


  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    // this.loadingRecords = true;
    if (this.selectedDate != null && this.selectedDate.length === 2) {
      this.value1 = this.datepipe.transform(this.selectedDate[0], 'yyyy-MM-dd');
      this.value2 = this.datepipe.transform(this.selectedDate[1], 'yyyy-MM-dd');
      this.getTechniciandata(true);
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
    } else {
      this.message.error('Please Select Filter', '');
      this.filterQuery = '';
      this.isFilterApplied = 'default';
    }
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length > 3 && event.key === 'Enter') {
      this.getTechniciandata(true);
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('buttonss');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.getTechniciandata(true);
    }
    else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.originalTechniciansData = [];
      this.getTechniciandata(true)
    }
  }
  invoiceDataCount: any = 0;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  getTechniciandata(reset: boolean = false) {
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
    if (this.searchText != '' && this.searchText.length > 0) {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ') ';
    }

    if ((this.selectedDate == undefined) || (this.selectedDate.length == 0)) {
      this.filterQuery = '';
    } else {
      this.filterQuery = " AND (INVOICE_DATE BETWEEN '" + this.value1 + "' AND '" + this.value2 + "')";
    }
    if ((this.Customers != undefined) && (this.Customers != null) && (this.Customers.length > 0)) {
      this.filterQuery1 = " AND CUSTOMER_ID IN(" + this.Customers + ")";
    } else {
      this.filterQuery1 = '';
    }
    this.filterQuery2 = '';
    if (this.custType != undefined && this.custType != null && this.custType != '') {
      this.filterQuery2 = " AND CUSTOMER_TYPE IN('" + this.custType + "')";
    } else {
      this.filterQuery2 = '';
    }
    if (this.TYPE == 'ORDER' && this.FILTER_ID != null && this.FILTER_ID != null && this.FILTER_ID != '') {
      this.filterQuery3 = " AND ORDER_ID=" + this.FILTER_ID;
    } else {
      this.filterQuery3 = '';
    }

    if (this.TYPE == 'JOB' && this.FILTER_ID != null && this.FILTER_ID != null && this.FILTER_ID != '') {
      this.filterQuery4 = " AND JOB_CARD_ID=" + this.FILTER_ID;
    } else {
      this.filterQuery4 = '';
    }

    if (this.TYPE == 'CUSTOMER' && this.FILTER_ID != null && this.FILTER_ID != null && this.FILTER_ID != '') {
      this.filterQuery5 = " AND CUSTOMER_ID=" + this.FILTER_ID;
    } else {
      this.filterQuery5 = '';
    }
    if (this.TYPE == 'TECHNICIAN' && this.FILTER_ID != null && this.FILTER_ID != null && this.FILTER_ID != '') {
      this.filterQuery6 = this.FILTER_ID;
    } else {
      this.filterQuery6 = '';
    }
    // likeQuery = this.filterQuery1;

    likeQuery = this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.filterQuery6;

    this.isSpinning = true;

    this.api.getVendorData(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.invoiceDataCount = data['count'];
          this.originalTechniciansData = data['data'];

        } else {
          this.originalTechniciansData = [];
          this.invoiceDataCount = 0;
          this.isSpinning = false;
        }
      },
      () => {
        this.isSpinning = false;
        this.originalTechniciansData = [];
        this.invoiceDataCount = 0;
        this.message.error('Something Went Wrong', '');
      }
    );

  }
  handleHttpError(err: HttpErrorResponse) {
    this.isSpinning = false;
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        ''
      );
    } else {
      this.message.error('Something Went Wrong.', '');
    }
  }

  // shreya
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: any;
  widths: any = '100%';
  custid: any;
  view(data: any): void {
    this.custid = data.ID;
    this.drawerTitleCustomers = `View details of ${data.NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.getTechniciandata();
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }
}