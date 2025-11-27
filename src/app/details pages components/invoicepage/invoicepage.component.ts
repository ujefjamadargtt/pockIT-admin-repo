import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';

@Component({
  selector: 'app-invoicepage',
  templateUrl: './invoicepage.component.html',
  styleUrls: ['./invoicepage.component.css']
})
export class InvoicepageComponent {
  @Input() FILTER_ID: any
  @Input() TYPE: any = '';
  @Input() tableData: any[] = [];
  @Input() showMinimal: boolean = false;
  loadingRecords: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  exportLoading = false;
  exportdataList: any[] = [];
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
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient, private _exportService: ExportService,
  ) { }

  filterqueryVendor: any = '';
  ngOnInit(): void {
    // First day of the month
    const now = new Date();
    this.value1 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
    // Last day of the month
    this.value2 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd');
    const formattedEndDate: any = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    if (this.TYPE == 'VENDOR') {
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
              this.filterqueryVendor =
                ' AND TECHNICIAN_ID in (' + TECH_IDS.toString() + ')';
              if (TECH_IDS.length > 0) {
                this.getjobss(this.filterqueryVendor);
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
      this.getInvoiceLog();
    }
    this.getCustomers();

  }


  filterdata: any = '';
  dataListOrder: any = [];
  JOB: any;
  filterqueryVendors1: any = '';
  loaddata: boolean = false
  getjobss(filterdatapassed: any) {
    this.loaddata = true;
    var TECH_IDS: any = [];
    this.api
      .getpendinjobsdataa(
        0, 0,
        '',
        '',
        filterdatapassed
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loaddata = false;
            this.dataListOrder = data['data'];
            data['data'].forEach((element) => {
              if (element.ID) TECH_IDS.push(element.ID);
            });
            this.filterqueryVendors1 =
              ' AND JOB_CARD_ID in (' + TECH_IDS.toString() + ')';
            if (TECH_IDS.length > 0) {
              this.getInvoiceLog1();
            }
          } else {
            this.dataListOrder = [];
            this.loaddata = false;
          }
        }, (err => {
          this.dataListOrder = [];
          this.loaddata = false;
        })
      );
  }


  sort(params: NzTableQueryParams): void {
    // if (this.invoicefilter != null && this.invoicefilter != '') {


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
    if (currentSort != null && currentSort.value != undefined) {
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1();
      } else {
        this.getInvoiceLog();
      }
    }
    // }
  }
  Customers: any = [];
  filterQuery1: any = '';
  filterQueryJob: any = '';
  filterQuery2: any = '';
  filterQuery3: any = '';
  filterQuery4: any = '';
  filterQuery5: any = '';
  filterQuery6: any = '';


  CustomersData: any = []

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
  getCustomers1(filter: any) {
    this.api.getAllCustomer(0, 0, 'NAME', 'desc', ' AND ACCOUNT_STATUS=1' + filter).subscribe(data => {
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
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  invoiceData: any;
  searchdata() {
    if (this.searchText.length >= 3) {
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1(true, false);
      } else {
        this.getInvoiceLog(true, false);
      }
    }
  }
  invoiceDataCount: any = 0;
  getInvoiceLog(reset: boolean = false, exportInExcel: boolean = false) {
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
    if ((this.JOB != undefined) && (this.JOB != null) && (this.JOB.length > 0)) {
      this.filterQueryJob = " AND JOB_CARD_ID IN(" + this.JOB + ")";
    } else {
      this.filterQueryJob = '';
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

    likeQuery = this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.filterQuery6 + this.filterQueryJob;

    this.loadingRecords = true;
    if (this.TYPE == 'TECHNICIAN' && this.FILTER_ID == '') {
      this.invoiceData = [];
      this.invoiceDataCount = 0;
      this.loadingRecords = false;
      this.message.info("Invoice data not found because no invoice has been generated by this technician yet.", "")
    } else {
      if (exportInExcel == false) {
        this.api.getInvoice(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.invoiceDataCount = data['count'];
              this.invoiceData = data['data'];

            } else {
              this.invoiceData = [];
              this.invoiceDataCount = 0;
              this.loadingRecords = false;
            }
          },
          () => {
            this.loadingRecords = false;
            this.invoiceData = [];
            this.invoiceDataCount = 0;
            this.message.error('Something Went Wrong', '');
          }
        );
      } else {
        if (this.invoiceDataCount > 0) {
          this.exportLoading = true;
          this.api.getInvoice(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.exportdataList = data['data'];
                this.convertInExcel();
                this.loadingRecords = false;
                this.exportLoading = false;
              } else {
                this.exportLoading = false;
                this.exportdataList = [];
                this.loadingRecords = false;
                this.message.error('Failed To get Invoice Data', '');
              }
            },
            () => {
              this.exportdataList = [];
              this.exportLoading = false;
              this.loadingRecords = false;
              this.message.error('Something Went Wrong', '');
            }
          );
        } else {
          this.exportLoading = false;
          this.loadingRecords = false;
          this.message.info("At least one record must be present in the table to download the Excel file.", "")
        }

      }
    }

  }

  getInvoiceLog1(reset: boolean = false, exportInExcel: boolean = false) {
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
    if ((this.JOB != undefined) && (this.JOB != null) && (this.JOB.length > 0)) {
      this.filterQueryJob = " AND JOB_CARD_ID IN(" + this.JOB + ")";
    } else {
      this.filterQueryJob = '';
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

    likeQuery = this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.filterQuery6 + this.filterQueryJob + this.filterqueryVendors1;

    this.loadingRecords = true;
    if (this.TYPE == 'TECHNICIAN' && this.FILTER_ID == '') {
      this.invoiceData = [];
      this.invoiceDataCount = 0;
      this.loadingRecords = false;
      this.message.info("Invoice data not found because no invoice has been generated by this technician yet.", "")
    } else {
      if (exportInExcel == false) {
        this.api.getInvoice(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.invoiceDataCount = data['count'];
              this.invoiceData = data['data'];

            } else {
              this.invoiceData = [];
              this.invoiceDataCount = 0;
              this.loadingRecords = false;
            }
          },
          () => {
            this.loadingRecords = false;
            this.invoiceData = [];
            this.invoiceDataCount = 0;
            this.message.error('Something Went Wrong', '');
          }
        );
      } else {
        if (this.invoiceDataCount > 0) {
          this.exportLoading = true;
          this.api.getInvoice(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.exportdataList = data['data'];
                this.convertInExcel();
                this.loadingRecords = false;
                this.exportLoading = false;
              } else {
                this.exportLoading = false;
                this.exportdataList = [];
                this.loadingRecords = false;
                this.message.error('Failed To get Invoice Data', '');
              }
            },
            () => {
              this.exportdataList = [];
              this.exportLoading = false;
              this.loadingRecords = false;
              this.message.error('Something Went Wrong', '');
            }
          );
        } else {
          this.exportLoading = false;
          this.loadingRecords = false;
          this.message.info("At least one record must be present in the table to download the Excel file.", "")
        }

      }
    }

  }

  clearFilter() {
    this.pageIndex = 1;
    this.filterQuery = '';
    this.filterQuery1 = '';
    this.filterQueryJob = '';
    this.filterQuery2 = '';
    this.Customers = null;
    this.custType = '';
    this.selectedDate = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd');
    const formattedEndDate: any = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    const now = new Date();
    this.value1 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
    // Last day of the month
    this.value2 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    if (this.TYPE == 'VENDOR') {
      this.getInvoiceLog1(true);
    } else {
      this.getInvoiceLog(true);
    }


  }
  handleCancel(): void {
    this.isModalVisible = false;
  }

  isModalVisible: boolean = false;
  pdfUrl: any
  showInvoiceModal(data: any): void {
    if (data?.INVOICE_URL) {
      const a = this.api.retriveimgUrl + 'Invoices' + '/' + data.INVOICE_URL;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(a);

      this.isModalVisible = true;
    } else {
      this.message.error('Invoice URL not available', '');
    }
  }
  showInvoiceModalz(data: any): void {
    const a = this.api.retriveimgUrl + 'Invoices' + '/' + data.INVOICE_NUMBER;
    if (data?.INVOICE_NUMBER) {
      setTimeout(()=>{
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(a);
          this.isModalVisible = true;
      },500)
    } else {
      this.message.error('Invoice URL not available', '');
    }
  }
  downloadPDF(): void {
    // Extract the original URL from the sanitized URL (without breaking security)
    const urlString = this.pdfUrl.changingThisBreaksApplicationSecurity || '';


    if (!urlString) {
      return;
    }

    // Create HTTP request headers to force the PDF MIME type
    const headers = new HttpHeaders().set('Accept', 'application/pdf');

    // Fetch the PDF as a Blob from the server with forced MIME type
    this.httpClient.get(urlString, { responseType: 'blob', headers: headers }).subscribe(
      (response: Blob) => {
        // Log the received Blob to ensure it's a PDF


        // Create a temporary Blob URL
        const blobUrl = URL.createObjectURL(response);

        // Create an anchor element for download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = urlString.split('/').pop() || 'invoice.pdf'; // Use the file name from URL
        a.target = '_self'; // Download in the same tab

        // Trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Clean up the DOM

        // Revoke the Blob URL after the download starts
        URL.revokeObjectURL(blobUrl);
      },
      (error) => {
      }
    );
  }
  importInExcel() {
    if (this.TYPE == 'VENDOR') {
      this.getInvoiceLog1(true, true);
    } else {
      this.getInvoiceLog(true, true);
    }
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportdataList.length; i++) {
      obj1['Invoice Date'] = this.exportdataList[i]['INVOICE_DATE'] ? this.datePipe.transform(this.exportdataList[i]['INVOICE_DATE'], 'dd/MM/yyyy') : "-";

      obj1['Customer Name'] = this.exportdataList[i]['CUSTOMER_NAME'] ? this.exportdataList[i]['CUSTOMER_NAME'] : "-";

      obj1['Mobile No.'] = this.exportdataList[i]['MOBILE_NO'] ? this.exportdataList[i]['MOBILE_NO'] : "-";
      obj1['Email ID'] = this.exportdataList[i]['EMAIL'] ? this.exportdataList[i]['EMAIL'] : "-";
      if (this.exportdataList[i]['CUSTOMER_TYPE'] == 'I') {
        obj1[' Customer Type'] = 'Individual(B2C)';
      } else if (this.exportdataList[i]['CUSTOMER_TYPE'] == 'B') {
        obj1[' Customer Type'] = 'Business(B2B)';
      } else {
        obj1[' Customer Type'] = '-';
      }
      obj1['Total Amount'] = this.exportdataList[i]['TOTAL_AMOUNT'] ? this.exportdataList[i]['TOTAL_AMOUNT'] : "0";
      obj1['Tax Amount'] = this.exportdataList[i]['TAX_AMOUNT'] ? this.exportdataList[i]['TAX_AMOUNT'] : "0";
      obj1['Discount Amount'] = this.exportdataList[i]['DISCOUNT_AMOUNT'] ? this.exportdataList[i]['DISCOUNT_AMOUNT'] : "0";
      obj1['Final Amount'] = this.exportdataList[i]['FINAL_AMOUNT'] ? this.exportdataList[i]['FINAL_AMOUNT'] : "0";
      // obj1['Invoice PDF'] = this.exportdataList[i]['INVOICE_URL']
      //   ? `=HYPERLINK("${appkeys.retriveimgUrl}Invoices/${this.exportdataList[i]['INVOICE_URL']}", "Download")`
      //   : "-";
      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Invoice Report On ' +
          this.datePipe.transform(new Date(), 'dd/mm/yyyy')
        );
      }
    }
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';

  }

  applyFilter() {
    // this.loadingRecords = true;
    if (this.selectedDate != null && this.selectedDate.length === 2) {
      this.value1 = this.datePipe.transform(this.selectedDate[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.selectedDate[1], 'yyyy-MM-dd');
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1(true);
      } else {
        this.getInvoiceLog(true);
      }
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
    } else {
      this.message.error('Please Select Filter', '');
      this.filterQuery = '';
      this.isFilterApplied = 'default';
    }
    // this.loadingRecords = false;
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length > 3 && event.key === 'Enter') {
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1(true);
      } else {
        this.getInvoiceLog(true);
      }
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('buttonss');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1(true, false);
      } else {
        this.getInvoiceLog(true, false);
      }
    }
    else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.invoiceData = [];
      if (this.TYPE == 'VENDOR') {
        this.getInvoiceLog1(true, false);
      } else {
        this.getInvoiceLog(true, false);
      }
    }
  }
}
