import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ExportService } from 'src/app/Service/export.service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groupwiseautocloseticketcount',
  templateUrl: './groupwiseautocloseticketcount.component.html',
  styleUrls: ['./groupwiseautocloseticketcount.component.css'],
})
export class GroupwiseautocloseticketcountComponent implements OnInit {
  formTitle = 'Department Wise Ticket Auto Close Summary Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'DEPARTMENT_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  supportUsers = [];
  SUPPORT_USERS: any = [];
  columns: string[][] = [['DEPARTMENT_NAME', 'Department Name']];

  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  USER_ID: any;
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  today = new Date();
  // current = new Date()

  CurrentValue: any = new Date();
  START_DATE: any = new Date();
  END_DATE: any = new Date();

  endOpen = false;
  startOpen = false;

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.search();
    this.GetDepartmentData();
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  keyup(keys) {
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
    // this.search(true);
  }
  // startOpen: boolean = false

  onStartChange(date: Date): void {
    this.START_DATE = date;
  }
  onEndChange(date: Date): void {
    this.END_DATE = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  disabledStartDate = (START_DATE: Date): boolean => {
    if (!START_DATE || !this.END_DATE) {
      return false;
    }
    return START_DATE.getTime() > this.END_DATE;
  };

  current = new Date();

  disabledEndDate = (END_DATE: Date): boolean => {
    if (!END_DATE) {
      return false;
    }

    var previousDate = new Date(this.START_DATE);
    previousDate.setDate(previousDate.getDate() + -1);

    return END_DATE <= new Date(previousDate);
  };

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  // START_DATE: any = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd')
  // END_DATE: any = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd')
  departmentname: any;
  departmentdata: any;

  GetDepartmentData() {
    this.api.getAllDepartments(0, 0, '', 'asc', '').subscribe((data) => {
      if (data['status'] == 200) {
        if (data.body['data'].length > 0) {
          this.departmentdata = data.body['data'];

        } else {
          this.departmentdata = [];
        }
      } else {
        this.message.error('Failed To Get Department Data', '');
        this.departmentdata = [];
      }
    });
  }

  applyFilter() {
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');

    var filter = '';
    filter = this.filterQuery;
    var likeQuery = '';

    if (
      this.departmentname &&
      this.departmentname != null &&
      this.departmentname != undefined &&
      this.departmentname.length != 0
    ) {
      this.filterQuery = ' AND DEPARTMENT_ID IN (' + this.departmentname + ')';
      // ` AND DEPARTMENT_NAME LIKE '%${this.departmentname.trim()}%'`;
    }



    // if (this.SUPPORT_USERS != null || this.SUPPORT_USERS.length > 0 ) {
    //   this.USER_ID = this.SUPPORT_USERS
    // }
    if (this.START_DATE != null) {
      this.START_DATE = this.START_DATE;
    }
    if (this.END_DATE != null) {
      this.END_DATE = this.END_DATE;
    }

    this.search(true);
    this.isFilterApplied = 'primary';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.departmentname = [];
    // this.START_DATE = '';
    // this.END_DATE = '';
    this.START_DATE = new Date();
    this.END_DATE = new Date();
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    this.search(true);
  }
  branchData = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }

  departmentVisible: boolean = false;
  isnameFilterApplied: boolean = false;
  departmentText: string = '';

  onKeyup(event: KeyboardEvent): void {
    if (this.departmentText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.departmentText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
  }

  reset() {
    this.departmentText = '';
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    // if (this.SUPPORT_USERS != undefined || this.SUPPORT_USERS.length > 0) {
    //   this.USER_ID = this.SUPPORT_USERS;
    // }
    this.START_DATE = this.datePipe.transform(this.START_DATE, 'yyyy-MM-dd');
    this.END_DATE = this.datePipe.transform(this.END_DATE, 'yyyy-MM-dd');
    var likeQuery = '';
    if (this.searchText != '') {
      // likeQuery = " AND";
      likeQuery = ' AND (';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ')';
    }

    var filterQuery5 = '';

    if (this.departmentText !== '') {
      filterQuery5 +=
        (filterQuery5 ? ' AND ' : '') +
        `DEPARTMENT_NAME LIKE '%${this.departmentText.trim()}%'`;
    }
    filterQuery5 = filterQuery5 ? ' AND ' + filterQuery5 : '';

    // this.USER_ID = this.SUPPORT_USERS;
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.isSpinning = true;
      this.api
        .getGroupWiseAutoCloseTicketCount(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          filterQuery5 + this.filterQuery + likeQuery,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {

            this.loadingRecords = false;
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            this.loadingRecords = false;
          },
          (err) => {

            // this.loadingRecords = false;
            // this.isSpinning = false;
            this.message.error('Server Not Found', '');
            this.loadingRecords = false;
          }
        );
    } else {
      this.exportLoading = true;

      this.api
        .getGroupWiseAutoCloseTicketCount(
          0,
          0,
          this.sortKey,
          sort,
          filterQuery5 + this.filterQuery + likeQuery,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.branchData = data.body['data'];
              this.convertInExcel();
              this.exportLoading = false;
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.exportLoading = false;
          }
        );
    }
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'DEPARTMENT_ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.branchData.length; i++) {
      obj1['Department Name'] = this.branchData[i]['DEPARTMENT_NAME'];
      obj1['Number of Tickets'] = this.branchData[i]['NUMBER_OF_TICKETS'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.branchData.length - 1) {
        this._exportService.exportExcel1(
          arry1,
          'Department Wise Ticket Auto Close Summary Report' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
