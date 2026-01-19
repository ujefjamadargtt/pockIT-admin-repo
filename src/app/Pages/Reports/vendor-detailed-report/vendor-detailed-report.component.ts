import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse } from '@angular/common/http';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { filter } from 'rxjs';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { VendorDetailedReport } from '../../Models/VendorDetailedReport';
import { ExportService } from 'src/app/Service/export.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-vendor-detailed-report',
  templateUrl: './vendor-detailed-report.component.html',
  styleUrls: ['./vendor-detailed-report.component.css'],
})
export class VendorDetailedReportComponent {
  @Input() data: any = VendorDetailedReport;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private _exportService: ExportService
  ) { }
  public commonFunction = new CommonFunctionService();
  formTitle = 'Vendor Detailed Report';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = '';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  TabId: number;
  columns: string[][] = [
    ['VENDOR_NAME'],
    ['SERVICE_NAME'],
    ['JOB_CARD_NO'],
    ['ORDER_NO'],
    ['VENDOR_COST'],
    ['TECHNICIAN_NAME'],
    ['TECHNICIAN_COST'],
  ];
  drawerCountryMappingVisible = false;
  drawervisible = false;
  Seqtext: any;
  excelData: any = [];
  exportLoading: boolean = false;
  dataList: any = [];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isNameApplied: boolean = false;
  isServiceNameApplied: boolean = false;
  isJobCardNoApplied: boolean = false;
  isOrderNoApplied: boolean = false;
  isJobCompletedDateApplied: boolean = false;
  isVendorCostApplied: boolean = false;
  isTechnicianCostApplied: boolean = false;
  isTechnicianNameApplied: boolean = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.nameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isNameApplied = true;
    } else if (this.nameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isNameApplied = false;
    }
    if (this.servicenameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isServiceNameApplied = true;
    } else if (this.servicenameText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isServiceNameApplied = false;
    }
    if (this.jobcardnoText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isJobCardNoApplied = true;
    } else if (this.jobcardnoText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isJobCardNoApplied = false;
    }
    if (this.ordernoText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isOrderNoApplied = true;
    } else if (this.ordernoText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isOrderNoApplied = false;
    }
    if (this.vendorcostText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isVendorCostApplied = true;
    } else if (this.vendorcostText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isVendorCostApplied = false;
    }
    if (this.techniciannameText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isTechnicianNameApplied = true;
    } else if (
      this.techniciannameText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isTechnicianNameApplied = false;
    }
    if (this.techniciancostText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isTechnicianCostApplied = true;
    } else if (
      this.techniciancostText.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isTechnicianCostApplied = false;
    }
  }
  ngOnInit(): void {
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formattedStartDate: any = this.datePipe.transform(
      startOfMonth,
      'yyyy-MM-dd'
    );
    const formattedEndDate: any = this.datePipe.transform(
      endOfMonth,
      'yyyy-MM-dd'
    );
    this.selectedDate = [formattedStartDate, formattedEndDate];
    this.getTECH();
    this.getVendorData();
    this.getServiceData();
    this.getJobCardNoData();
  }
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 0 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.search(true);
  }
  filterQuery: string = '';
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'VENDOR_NAME';
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
  nameText: string = '';
  servicenameText: string = '';
  jobcardnoText: string = '';
  ordernoText: string = '';
  jobdateText: string = '';
  vendorcostText: string = '';
  techniciannameText: string = '';
  techniciancostText: string = '';
  nameVisible = false;
  servicenameVisible = false;
  jobcardnoVisible = false;
  ordernoVisible = false;
  jobdateVisible = false;
  vendorcostVisible = false;
  techniciannameVisible = false;
  techniciancostVisible = false;
  reset(): void {
    this.nameText = '';
    this.servicenameText = '';
    this.jobcardnoText = '';
    this.ordernoText = '';
    this.jobdateText = '';
    this.vendorcostText = '';
    this.techniciannameText = '';
    this.techniciancostText = '';
    this.search(true);
  }
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '';
      this.sortValue = 'desc';
    }
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    let likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column} LIKE '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.nameText.trim()) {
      likeQuery += `VENDOR_NAME LIKE '%${this.nameText.trim()}%'`;
    }
    if (this.servicenameText.trim()) {
      likeQuery += `SERVICE_NAME LIKE '%${this.servicenameText.trim()}%'`;
    }
    if (this.jobcardnoText.trim()) {
      likeQuery += `JOB_CARD_NO LIKE '%${this.jobcardnoText.trim()}%'`;
    }
    if (this.ordernoText.trim()) {
      likeQuery += `ORDER_NO LIKE '%${this.ordernoText.trim()}%'`;
    }
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; 
        const formattedEnd = new Date(end).toISOString().split('T')[0]; 
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(JOB_COMPLETED_DATETIME) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }
    if (this.vendorcostText.trim()) {
      likeQuery += `VENDOR_COST LIKE '%${this.vendorcostText.trim()}%'`;
    }
    if (this.techniciancostText.trim()) {
      likeQuery += `TECHNICIAN_COST LIKE '%${this.techniciancostText.trim()}%'`;
    }
    if (this.techniciannameText.trim()) {
      likeQuery += `TECHNICIAN_NAME LIKE '%${this.techniciannameText.trim()}%'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    let userFilter =
      this.decreptedroleId == 9 ? ` AND USER_ID=${this.decrepteduserID}` : '';
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getVendorDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + userFilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.TabId = data['TAB_ID'];
              this.totalRecords = data['count'];
              this.Country = data['data'];
            } else {
              this.loadingRecords = false;
              this.Country = [];
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
    } else {
      this.exportLoading = true;
      this.loadingRecords = true;
      this.api
        .getVendorDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + userFilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.loadingRecords = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  importInExcel() {
    this.search(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        if (this.decreptedroleId !== 9) {
          obj1['Name'] = this.excelData[i]['VENDOR_NAME'];
        }
        obj1['Service Name'] = this.excelData[i]['SERVICE_NAME'];
        obj1['Job No.'] = this.excelData[i]['JOB_CARD_NO'];
        obj1['Order No.'] = this.excelData[i]['ORDER_NO'];
        obj1['Job Completed Date'] =
          this.excelData[i]['JOB_COMPLETED_DATETIME'];
        obj1['Vendor Cost'] = this.excelData[i]['VENDOR_COST'];
        obj1['Technician Cost'] = this.excelData[i]['TECHNICIAN_COST'];
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Vendor Detaialed Report' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
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
  searchopen() {
    if (this.searchText.length >= 0) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  filterloading: boolean = false;
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  value1: string | null = null;
  value2: string | null = null;
  selectedDate: Date[] = [];
  isFilterApplied: any = 'default';
  applyFilter() {
    this.filterQuery = ''; 
    if (this.selectedDate && this.selectedDate.length === 2) {
      this.value1 = this.datePipe.transform(this.selectedDate[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.selectedDate[1], 'yyyy-MM-dd');
      this.filterQuery += ` AND DATE(JOB_COMPLETED_DATETIME) BETWEEN '${this.value1}' AND '${this.value2}'`;
    }
    if (this.Technician && this.Technician.length) {
      this.filterQuery += ` AND TECHNICIAN_ID IN (${this.Technician.join(
        ','
      )})`;
    }
    if (this.Vendor && this.Vendor.length) {
      this.filterQuery += ` AND VENDOR_ID IN (${this.Vendor.join(',')})`;
    }
    if (this.Service && this.Service.length) {
      this.filterQuery += ` AND SERVICE_ID IN (${this.Service.join(',')})`;
    }
    if (this.JobCardNo && this.JobCardNo.length) {
      const formattedJobCards = this.JobCardNo.map((job) => `'${job}'`).join(
        ','
      );
      this.filterQuery += ` AND JOB_CARD_NO IN (${formattedJobCards})`;
    }
    this.search();
    this.isSpinning = false;
    this.filterClass = 'filter-invisible';
  }
  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  clearFilter() {
    this.Technician = [];
    this.Vendor = [];
    this.Service = [];
    this.JobCardNo = [];
    this.filterQuery = '';
    this.filterClass = 'filter-invisible';
    this.applyFilter();
  }
  isSpinning: boolean = false;
  TechData: any;
  Technician: any;
  getTECH() {
    this.api
      .getTechnicianData(0, 0, 'NAME', 'desc', ' AND IS_ACTIVE=1')
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
  VendorData: any;
  Vendor: any;
  getVendorData() {
    this.api.getVendorData(0, 0, 'NAME', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.VendorData = data['data'];
        } else {
          this.VendorData = [];
        }
      },
      (err) => {
        this.VendorData = [];
      }
    );
  }
  ServiceData: any;
  Service: any;
  getServiceData() {
    this.api.getServiceItem(0, 0, 'NAME', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ServiceData = data['data'];
        } else {
          this.ServiceData = [];
        }
      },
      (err) => {
        this.ServiceData = [];
      }
    );
  }
  JobCardNoData: any;
  JobCardNo: any;
  getJobCardNoData() {
    this.api.getpendinjobsdataa(0, 0, '', '', ' AND STATUS="CO"').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.JobCardNoData = data['data'];
        } else {
          this.JobCardNoData = [];
        }
      },
      (err) => {
        this.JobCardNoData = [];
      }
    );
  }
  date1 =
    new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1;
  ranges: any = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'This Year': [startOfYear(new Date()), endOfYear(new Date())],
  };
  StartDate: any = [];
  EndDate: any = [];
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isJobCompletedDateApplied = true;
      }
    } else {
      this.StartDate = null;
      this.search();
      this.isJobCompletedDateApplied = false;
    }
  }
}