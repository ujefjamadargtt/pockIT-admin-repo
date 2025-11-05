import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { NzTableQueryParams } from 'ng-zorro-antd/table';
// import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
// import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import { fileURLToPath } from 'url';
// import { ApiService } from '../Service/api.service';
@Component({
  selector: 'app-apkversion-report',
  templateUrl: './apkversion-report.component.html',
  styleUrls: ['./apkversion-report.component.css'],
})
export class APKVersionReportComponent implements OnInit {
  formTitle = 'APK Version Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';

  columns: string[][] = [
    ['CUSTOMER_CUR_VERSION', 'CUSTOMER_CUR_VERSION'],
    ['TECHNICIAN_CUR_VERSION', 'TECHNICIAN_CUR_VERSION'],
    ['CUSTOMER_DESCRIPTION', 'CUSTOMER_DESCRIPTION'],
    ['TECHNICIAN_DESCRIPTION', 'TECHNICIAN_DESCRIPTION'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) { }
  current = new Date();
  ngOnInit(): void {
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date();
    this.search();
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  disableFutureDates = (current: Date): boolean => {
    var tomorrow: any = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return current.getTime() >= tomorrow.getTime();
  };
  monthFormat = 'MMM-yyyy';
  MONTH1: any;
  MONTHS: any;
  YEARS: any;
  TempstartValue: any;
  TempendValue: any;
  applyFilter() {
    this.filterQuery = '';
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      this.filterQuery = likeQuery;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    this.isFilterApplied = 'primary';
    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.dataList = [];
    this.MONTH1 = null;
    this.DATE = [];
    this.search();
  }
  // DATE;
  DATE: Date[] = [];

  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  FROM_DATE: any;
  TO_DATE: any;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.DATE[0] != null && this.DATE[1] != null) {
      this.filterQuery =
        " AND DATE(DATETIME) BETWEEN '" +
        this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd') +
        "' ";
    } else if (
      this.MONTH1 != null ||
      this.MONTH1 != undefined ||
      this.MONTH1 != ''
    ) {
      this.filterQuery =
        " AND YEAR(DATETIME)= '" +
        this.datePipe.transform(this.MONTH1, 'MM') +
        "' AND MONTH(DATETIME)='" +
        this.datePipe.transform(this.MONTH1, 'y') +
        "' ";

      // MONTHS = this.datePipe.transform(this.MONTH1, 'MM');
      // YEARS = this.datePipe.transform(this.MONTH1, 'y');
    }
    var filter = '';
    filter = this.filterQuery;

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .getAPKDetails(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + filter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];

              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.loadingRecords = false;
              this.dataList = [];
              this.filterClass = 'filter-invisible';
              this.message.error('Something Went Wrong...', '');
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.exportLoading = false;

      this.api
        .getAPKDetails(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + filter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
              this.message.error('Something Went Wrong...', '');
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  BRANCH: any = [];
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();

    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Date'] = this.excelData[i]['DATETIME'];
        obj1['Customer Version'] = this.excelData[i]['CUSTOMER_CUR_VERSION'];
        obj1['Technician Version'] =
          this.excelData[i]['TECHNICIAN_CUR_VERSION'];
        obj1['Customer Description'] =
          this.excelData[i]['CUSTOMER_DESCRIPTION'];
        obj1['Technician Description'] =
          this.excelData[i]['TECHNICIAN_DESCRIPTION'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'APK Version Report' +
            this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
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
}