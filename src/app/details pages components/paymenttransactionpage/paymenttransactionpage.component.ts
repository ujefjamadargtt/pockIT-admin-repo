import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-paymenttransactionpage',
  templateUrl: './paymenttransactionpage.component.html',
  styleUrls: ['./paymenttransactionpage.component.css']
})
export class PaymenttransactionpageComponent {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) { }
  @Input() paymentTransactionFilter: any
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
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
    this.getPaymentTransaction();
  }
  paymentTransactionData: any
  getPaymentTransaction() {
    this.paymentTransactionFilter = this.paymentTransactionFilter == undefined ? '' : this.paymentTransactionFilter
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.paymentTransactionFilter = this.paymentTransactionFilter == undefined ? '' : this.paymentTransactionFilter;
    this.api.getPaymentTransaction(this.pageIndex, this.pageSize, this.sortKey, sort, this.paymentTransactionFilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.paymentTransactionData = data['data'];
        } else {
          this.message.error('Failed To get Payment Transaction Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  handleCancel(): void {
    this.isModalVisible = false;
  }
  isModalVisible: boolean = false;
  pdfUrl: any
  showPaymentTransactionModal(data: any): void {
    if (data?.INVOICE_URL) {
      const a = this.api.retriveimgUrl + 'Invoices' + '/' + data.INVOICE_URL;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(a);
      this.isModalVisible = true;
    } else {
      this.message.error('Invoice URL not available', '');
    }
  }
  downloadPDF(): void {
    const urlString = this.pdfUrl.changingThisBreaksApplicationSecurity || '';
    if (!urlString) {
      return;
    }
    const headers = new HttpHeaders().set('Accept', 'application/pdf');
    this.httpClient.get(urlString, { responseType: 'blob', headers: headers }).subscribe(
      (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = urlString.split('/').pop() || 'invoice.pdf'; 
        a.target = '_self'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); 
        URL.revokeObjectURL(blobUrl);
      },
      (error) => {
      }
    );
  }
}
