import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { emailserviceconfig } from 'src/app/Pages/Models/emailserviceconfig';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-email-service-configs',
  templateUrl: './email-service-configs.component.html',
  styleUrls: ['./email-service-configs.component.css'],
})
export class EmailServiceConfigsComponent {
  formTitle = 'Manage Email Service Configuration';
  drawerVisible: boolean = false;
  drawerData: emailserviceconfig = new emailserviceconfig();
  searchText = '';
  loadingRecords = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  totalRecords = 1;
  emailServiceConfigData: any = [];
  columns: string[][] = [
    ['SERVICE_PROVIDER', 'SERVICE_PROVIDER'],
    ['SMTP_HOST', 'SMTP_HOST'],
    ['SMTP_PORT', 'SMTP_PORT'],
    ['USERNAME', 'USERNAME'],
    ['SENDER_EMAIL', 'SENDER_EMAIL'],
    ['SENDER_NAME', 'SENDER_NAME'],
  ];
  constructor(
    private router: Router,
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  dataList = [];
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  ngonInit() {
    if (this.searchText.length > 3) {
      this.search(true);
    } else if (this.searchText.length == 0) {
      this.search(true);
    }
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  drawerTitle = '';
  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length == 0) {
      this.search();
    }
  }
  shouldTruncateAt25(value: string): boolean {
    const mCount = (value.match(/m/g) || []).length; 
    return value.length > 25 && mCount > 6; 
  }
  add(): void {
    this.drawerTitle = 'Add New Email Service Configuration';
    this.drawerData = new emailserviceconfig();
    this.drawerVisible = true;
    this.api.getemailServiceConfigData(1, 1, '', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
        } else {
          this.message.error('Server Not Found.', '');
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
  edit(data: emailserviceconfig): void {
    this.drawerTitle = 'Update Email Service Configuration';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
  ProviderText: string = '';
  ProviderVisible = false;
  hostText: string = '';
  hostVisible = false;
  PortText: string = '';
  portVisible = false;
  UserVisible = false;
  UserText: string = '';
  EmailText: string = '';
  EmailVisible = false;
  SenderText: string = '';
  SenderVisible = false;
  TypeVisible = false;
  selectedTypes: number[] = [];
  onTypeChange(): void {
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
    var likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    this.loadingRecords = true;
    if (this.ProviderText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_PROVIDER LIKE '%${this.ProviderText.trim()}%'`;
    }
    if (this.hostText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SMTP_HOST LIKE '%${this.hostText.trim()}%'`;
    }
    if (this.UserText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `USERNAME LIKE '%${this.UserText.trim()}%'`;
    }
    if (this.PortText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SMTP_PORT LIKE '%${this.PortText.trim()}%'`;
    }
    if (this.EmailText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SENDER_EMAIL LIKE '%${this.EmailText.trim()}%'`;
    }
    if (this.SenderText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SENDER_NAME LIKE '%${this.SenderText.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getemailServiceConfigData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.emailServiceConfigData = data['data'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.emailServiceConfigData = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.emailServiceConfigData = [];
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
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }
  isSnameApplied = false;
  isEmailApplied = false;
  isUserApplied = false;
  isPortApplied = false;
  isHostApplied = false;
  isServiceApplied = false;
  onKeyup(event: KeyboardEvent, field: string): void {
    const fieldValue = this[field]; 
    if (event.key === 'Enter') {
      if (fieldValue.length >= 3) {
        this.search();
        this.setFilterApplied(field, true);
      }
    } else if (event.key === 'Backspace' && fieldValue.length === 0) {
      this.search();
      this.setFilterApplied(field, false);
    }
  }
  setFilterApplied(field: string, value: boolean): void {
    switch (field) {
      case 'ProviderText':
        this.isServiceApplied = value;
        break;
      case 'hostText':
        this.isHostApplied = value;
        break;
      case 'PortText':
        this.isPortApplied = value;
        break;
      case 'UserText':
        this.isUserApplied = value;
        break;
      case 'EmailText':
        this.isEmailApplied = value;
        break;
      case 'SenderText':
        this.isSnameApplied = value;
        break;
      default:
        break;
    }
  }
  reset(): void {
    this.searchText = '';
    this.ProviderText = '';
    this.hostText = '';
    this.PortText = '';
    this.UserText = '';
    this.SenderText = '';
    this.EmailText = '';
    this.isSnameApplied = false;
    this.isEmailApplied = false;
    this.isUserApplied = false;
    this.isPortApplied = false;
    this.isHostApplied = false;
    this.isServiceApplied = false;
    this.search();
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showadd() {
    if (this.emailServiceConfigData.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}
