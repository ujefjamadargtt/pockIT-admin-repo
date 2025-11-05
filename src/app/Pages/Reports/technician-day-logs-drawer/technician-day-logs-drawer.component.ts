import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-technician-day-logs-drawer',
  templateUrl: './technician-day-logs-drawer.component.html',
  styleUrls: ['./technician-day-logs-drawer.component.css'],
})
export class TechnicianDayLogsDrawerComponent {
  @Input() drawerClose: Function;
  @Input() techdetailsdata: any;
  @Input() techId: any;

  activeTabIndex: number = 0;
  tabs = [
    {
      name: 'Technician Job Details',
      disabled: false,
    },
    {
      name: 'Technician Day Logs',
      disabled: false,
    },
    {
      name: 'Technician Availability Logs',
      disabled: false,
    },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datePipe: DatePipe
  ) { }
  formTitle = 'Technician Performance Details';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = '_id';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  dataList: any[] = [];
  columns: string[][] = [['NAME', 'NAME']];

  FROM_DATE: any = new Date();
  TO_DATE: any = new Date();

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.SEARCHVALUE = this.searchText;
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.SEARCHVALUE = '';
      this.dataList = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  public commonFunction = new CommonFunctionService();
  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();

    this.getTeritory();
    this.searchCustomer('');
    this.searchService('');
    this.getOrder(this.searchkey);
    this.getJobCard(this.searchkey1);
  }
  SEARCHVALUE: any;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    } else {
    }

    if (this.searchText) {
      this.SEARCHVALUE = this.searchText;
    } else {
      this.SEARCHVALUE = '';
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '_id';
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
    this.FROM_DATE = this.datePipe.transform(this.FROM_DATE, 'yyyy-MM-dd');
    this.TO_DATE = this.datePipe.transform(this.TO_DATE, 'yyyy-MM-dd');
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .gettechnicianactivitylogsreport(
          this.techId,
          this.FROM_DATE,
          this.TO_DATE,
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.SEARCHVALUE,
          this.ordID,
          this.jobcardID,
          this.serID,
          this.custid,
          this.custtype,
          this.territoryID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
            } else if (data['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
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
            } else if (err['status'] == 400) {
              this.loadingRecords = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
    } else {
      this.exportLoading = true;
      this.loadingRecords = true;

      this.api
        .gettechnicianactivitylogsreport(
          this.techId,
          this.FROM_DATE,
          this.TO_DATE,
          0,
          0,
          this.sortKey,
          sort,
          this.SEARCHVALUE,
          this.ordID,
          this.jobcardID,
          this.serID,
          this.custid,
          this.custtype,
          this.territoryID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.loadingRecords = false;
              this.excelData = data.body['data'];
              this.search1(true, true);

              // this.convertInExcel();
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '_id';
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
  formatTime(time: string): string {
    // Ensure the time is valid and in the format HH:mm:ss or HH:mm
    if (time && /^[0-9]{2}:[0-9]{2}(?::[0-9]{2})?$/.test(time)) {
      // Split the time into hours and minutes (ignore seconds if present)
      const [hours, minutes] = time.split(':').map(Number);

      // Convert 24-hour format to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 (midnight)

      // Return formatted time
      return `${this.padZero(hour12)}:${this.padZero(minutes)} ${period}`;
    }
    return '';
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // filter
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  isFilterApplied: any = 'default';
  isSpinning = false;

  customertype: any[] = [];
  CustomerName: any = [];
  CustomerData: any = [];
  OrderName: any = [];
  orderData: any = [];
  custid: any = [];
  custtype: any = [];
  ordID: any = [];
  serviceData: any = [];
  ServiceName: any = [];
  serID: any = [];
  territoryData: any = [];
  TerritoryName: any = [];
  territoryID: any = [];

  jobcardData: any = [];
  jobcardName: any = [];
  jobcardID: any = [];

  // JoiningDate: any = [];
  JoiningDate: any = [new Date(), new Date()];

  value1: string | null = null;
  value2: string | null = null;

  disableFutureDates = (current: Date): boolean => {
    var tomorrow: any = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return current.getTime() >= tomorrow.getTime();
  };

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  isfilter: boolean = false;
  applyFilter() {
    this.isFilterApplied = 'primary';
    this.isfilter = false;
    this.loadingRecords = true;
    this.filterQuery = '';
    this.pageIndex = 1;

    if (this.JoiningDate != null && this.JoiningDate.length == 2) {
      this.value1 = this.datePipe.transform(this.JoiningDate[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.JoiningDate[1], 'yyyy-MM-dd');

      this.FROM_DATE = this.value1;
      this.value1 = this.datePipe.transform(this.JoiningDate[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.JoiningDate[1], 'yyyy-MM-dd');

      this.TO_DATE = this.value2;
      this.isFilterApplied = 'primary';
      this.isfilter = true;
    }

    if (this.customertype.length > 0) {
      const customertypeList = this.customertype
        .map((status) => `'${status}'`)
        .join(', ');
      this.custtype = customertypeList;
      this.isfilter = true;
    } else {
      this.custtype = [];
    }

    if (
      this.CustomerName.length > 0 &&
      this.CustomerName != null &&
      this.CustomerName != undefined &&
      this.CustomerName != 0
    ) {
      this.custid = this.CustomerName;
      this.isfilter = true;
    } else {
      this.custid = [];
    }

    if (
      this.OrderName.length > 0 &&
      this.OrderName != null &&
      this.OrderName != undefined &&
      this.OrderName != 0
    ) {
      this.ordID = this.OrderName;
      this.isfilter = true;
    } else {
      this.ordID = [];
    }

    if (
      this.ServiceName.length > 0 &&
      this.ServiceName != null &&
      this.ServiceName != undefined &&
      this.ServiceName != 0
    ) {
      this.serID = this.ServiceName;
      this.isfilter = true;
    } else {
      this.serID = [];
    }

    if (
      this.TerritoryName.length > 0 &&
      this.TerritoryName != null &&
      this.TerritoryName != undefined &&
      this.TerritoryName != 0
    ) {
      this.territoryID = this.TerritoryName;
      this.isfilter = true;
    } else {
      this.territoryID = [];
    }

    if (
      this.jobcardName.length > 0 &&
      this.jobcardName != null &&
      this.jobcardName != undefined &&
      this.jobcardName != 0
    ) {
      this.jobcardID = this.jobcardName;
      this.isfilter = true;
    } else {
      this.jobcardID = [];
    }

    this.loadingRecords = false;
    if (this.isfilter) {
      this.loadingRecords = true;

      this.search();
      this.search1();
      this.search2();
      this.filterClass = 'filter-invisible';
    } else {
      this.message.error('please Select Filter Value', '');
      this.isFilterApplied = 'default';
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.dataList = [];
    this.customertype = [];
    this.custtype = [];
    this.CustomerName = [];
    this.custid = [];
    this.OrderName = [];
    this.ordID = [];
    this.ServiceName = [];
    this.serID = [];
    this.TerritoryName = [];
    this.territoryID = [];

    this.jobcardName = [];
    this.jobcardID = [];
    this.filterQuery = '';
    this.JoiningDate = [new Date(), new Date()];
    this.FROM_DATE = new Date();
    this.TO_DATE = new Date();
    this.search();
    this.search1();
    this.search2();
  }
  searchService(searchValue: string) {
    if (searchValue.length >= 3) {
      var filterCondition = ` AND STATUS=1 AND NAME LIKE '%${searchValue}%'`;
      var pageSize = 0;
      var pageindex = 0;
    } else {
      var filterCondition = ' AND STATUS=1';
      var pageSize = 10;
      var pageindex = 1;
    }

    this.api
      .getServiceItem(pageindex, pageSize, '', 'asc', filterCondition)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.serviceData = data['data'];
          } else {
            this.serviceData = [];
          }
        } else {
          this.message.error('Failed To Get Service Details', '');
          this.serviceData = [];
        }
      });
  }

  searchCustomer(searchValue: string): void {
    if (searchValue.length >= 3) {
      var filterCondition = ` AND ACCOUNT_STATUS=1 AND NAME LIKE '%${searchValue}%'`;
      var pageSize = 0;
      var pageindex = 0;
    } else {
      var filterCondition = ' AND ACCOUNT_STATUS=1';
      var pageSize = 10;
      var pageindex = 1;
    }
    this.api
      .getAllCustomer(pageindex, pageSize, 'NAME', 'asc', filterCondition)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.CustomerData = data['data'].length > 0 ? data['data'] : [];
        } else {
          this.message.error('Failed To Get Customer Details', '');
          this.CustomerData = [];
        }
      });
  }
  pageIndex3 = 1;
  getTeritory() {
    this.api.getTeritory(0, 0, '', 'asc', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200) {
        if (data['data'].length > 0) {
          this.territoryData = data['data'];
        } else {
          this.territoryData = [];
        }
      } else {
        this.message.error('Failed To Get Territory Details', '');
        this.territoryData = [];
      }
    });
  }

  // order select fillter
  searchkey = '';
  totalrecords = 0;
  isLoading = false;

  getOrder(event) {
    event =
      event != '' && event != undefined && event != null
        ? ' AND (ORDER_NUMBER like "%' + event + '%")'
        : '';

    this.api
      // .getOrdersData(this.pageIndex1, 8, '', 'asc', event)

      .getDistinctOrderNumbers(
        this.pageIndex3,
        8,
        '',
        'asc',
        ' AND TECHNICIAN_ID IN (' + this.techId + ')' + event
      )
      .subscribe((data) => {
        if (data['status'] == 200 && data.body['data'].length > 0) {
          this.orderData = [...this.orderData, ...data.body['data']];
          this.totalrecords = data.body['count'];
        }
        this.isLoading = false;
      });
  }

  getord(event) {
    this.searchkey = event;
    if (event.length >= 3) {
      this.orderData = [];
      this.pageIndex3 = 1;
      this.getOrder(this.searchkey);
    }
  }

  loadMore() {
    if (this.totalrecords > this.orderData.length) {
      this.pageIndex3++;
      this.getOrder(this.searchkey);
    }
  }

  keyup3(event) {
    if (
      this.searchkey == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.orderData = [];
      this.pageIndex3 = 1;
      this.getOrder('');
    }
  }

  // job select fillter
  searchkey1 = '';
  totalrecords1 = 0;
  isLoading1 = false;
  pageIndex4 = 1;
  getJobCard(event) {
    event =
      event != '' && event != undefined && event != null
        ? ' AND (JOB_CARD_NO like "%' + event + '%")'
        : '';

    this.api
      .getpendinjobsdataa(
        this.pageIndex4,
        8,
        '',
        'asc',
        ' AND TECHNICIAN_ID = ' + this.techId + event
      )
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.jobcardData = [...this.jobcardData, ...data['data']];
          this.totalrecords1 = data['count'];
        }
        this.isLoading1 = false;
      });
  }

  gejob(event) {
    this.searchkey1 = event;
    if (event.length >= 3) {
      this.jobcardData = [];
      this.pageIndex4 = 1;
      this.getJobCard(this.searchkey1);
    }
  }

  loadMore1() {
    if (this.totalrecords1 > this.jobcardData.length) {
      this.pageIndex4++;
      this.getJobCard(this.searchkey1);
    }
  }

  keyup4(event) {
    if (
      this.searchkey1 == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.jobcardData = [];
      this.pageIndex4 = 1;
      this.getJobCard('');
    }
  }

  // tab 2

  searchText1: string = '';
  pageIndex1 = 1;
  pageSize1 = 10;
  sortKey1: string = '_id';
  sortValue1: string = 'desc';
  loadingRecords1 = false;
  totalRecords1 = 1;
  dataList1: any[] = [];
  columns1: string[][] = [['NAME', 'NAME']];

  filterQuery1: string = '';
  filterClass1: string = 'filter-invisible';

  isFilterApplied1: any = 'default';
  isSpinning1 = false;

  LogTextVisible;
  isLogTextVisibleFilterApplied: boolean = false;
  Logtext: string = '';

  LogDateVisible;
  isLogDateFilterApplied: boolean = false;
  selectedLogDate: any;

  keyup1(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.search1();
    } else if (this.searchText1.length === 0 && keys.key == 'Backspace') {
      this.dataList1 = [];
      this.search1();
    }
  }

  onEnterKey1(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  onKeyup(keys: any, type: string): void {
    const element = window.document.getElementById('button');
    if (type == 'logtext' && this.Logtext.length >= 3 && keys.key === 'Enter') {
      this.search1();

      this.isLogTextVisibleFilterApplied = true;
    } else if (
      type == 'logtext' &&
      this.Logtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.search1();

      this.isLogTextVisibleFilterApplied = false;
    }
  }
  reset(): void {
    this.searchText1 = '';
    this.Logtext = '';

    this.search1();
  }
  showFilter1() {
    if (this.filterClass1 === 'filter-visible')
      this.filterClass1 = 'filter-invisible';
    else this.filterClass1 = 'filter-visible';
  }
  filterQueryDate: any;
  filterQueryDate1: any;
  value3: any = '';
  value4: any = '';

  //filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search1(true);
  }
  listOfFilter: any[] = [
    { text: 'Online', value: 'EN' },
    { text: 'Offline', value: 'DE' },
  ];

  onLogDateangeChange() {
    if (this.selectedLogDate && this.selectedLogDate.length === 2) {
      const [start, end] = this.selectedLogDate;
      if (start && end) {
        this.search1();
        this.isLogDateFilterApplied = true;
      }
    } else {
      this.selectedLogDate = null; // or [] if you prefer
      this.search1();
      this.isLogDateFilterApplied = false;
    }
  }

  search1(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText1.length < 3 && this.searchText1.length !== 0) {
      return;
    } else {
    }

    if (reset) {
      this.pageIndex1 = 1;
      this.sortKey1 = '_id';
      this.sortValue1 = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValue1.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery: any = {};

    if (this.techId) {
      likeQuery = {
        // Include existing conditions if any
        $and: [{ TECHNICIAN_ID: this.techId }],
      };
    }

    this.filterQueryDate = {
      $and: [
        {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$LOG_DATE_TIME',
                    },
                  },
                  this.FROM_DATE, // Start date
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$LOG_DATE_TIME',
                    },
                  },
                  this.TO_DATE, // End date
                ],
              },
            ],
          },
        },
        { TECHNICIAN_ID: this.techId }, // Combine this condition directly within the same `$and` array
      ],
    };
    if (this.selectedLogDate?.length === 2) {
      const [start, end] = this.selectedLogDate;
      if (start && end) {
        const formatDate = (date: Date) =>
          new Date(
            `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${date
                .getDate()
                .toString()
                .padStart(2, '0')}T${date
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${date
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}:00`
          );

        this.filterQueryDate.$and.push({
          LOG_DATE_TIME: {
            $gte: formatDate(new Date(start)),
            $lte: formatDate(new Date(end)),
          },
        });
      }
    }

    // if (this.statusFilter) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `STATUS = ${this.statusFilter}`;
    // }

    if (this.Logtext !== '') {
      this.filterQueryDate.$and.push({
        LOG_TEXT: { $regex: this.Logtext.trim(), $options: 'i' },
      });
      this.isLogTextVisibleFilterApplied = true;
    } else {
      this.isLogTextVisibleFilterApplied = false;
    }

    if (this.statusFilter) {
      this.filterQueryDate.$and.push({
        STATUS: this.statusFilter,
      });
    }
    if (exportInExcel == false) {
      this.api
        .gettechniciandaylogsreport(
          this.pageIndex1,
          this.pageSize1,
          this.sortKey1,
          sort,
          this.filterQueryDate,
          this.searchText1,
          ['LOG_TEXT', 'TYPE']
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords1 = false;
              this.totalRecords1 = data.body['count'];
              this.dataList1 = data.body['data'];
            } else {
              this.loadingRecords1 = false;
              this.dataList1 = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords1 = false;
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
      this.loadingRecords1 = true;

      this.api
        .gettechniciandaylogsreport(
          0,
          0,
          this.sortKey1,
          sort,
          this.filterQueryDate,
          this.searchText1,
          ['LOG_TEXT', 'TYPE']
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.loadingRecords1 = false;
              this.excelData1 = data.body['data'];
              // this.convertInExcel();
              this.search2(true, true);
            } else {
              this.excelData1 = [];
              this.exportLoading = false;
              this.loadingRecords1 = false;
            }
          },
          (err) => {
            this.loadingRecords1 = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  sort1(params: NzTableQueryParams) {
    this.loadingRecords1 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '_id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex1 = pageIndex;
    this.pageSize1 = pageSize;

    if (this.pageSize1 != pageSize) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }

    if (this.sortKey1 != sortField) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }

    this.sortKey1 = sortField;
    this.sortValue1 = sortOrder;
    this.search1();
  }

  searchText2: string = '';
  pageIndex2 = 1;
  pageSize2 = 10;
  sortKey2: string = '_id';
  sortValue2: string = 'desc';
  loadingRecords2 = false;
  totalRecords2 = 1;
  dataList2: any[] = [];
  columns2: string[][] = [['NAME', 'NAME']];

  filterQuery2: string = '';
  filterClass2: string = 'filter-invisible';

  isFilterApplied2: any = 'default';
  isSpinning2 = false;

  LogDateVisible1;
  isLogDateFilterApplied1: boolean = false;
  selectedLogDate1: any;

  keyup2(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText2.length >= 3 && keys.key === 'Enter') {
      this.search2();
    } else if (this.searchText2.length === 0 && keys.key == 'Backspace') {
      this.dataList2 = [];
      this.search2();
    }
  }

  onEnterKey2(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  showFilter2() {
    if (this.filterClass2 === 'filter-visible')
      this.filterClass2 = 'filter-invisible';
    else this.filterClass2 = 'filter-visible';
  }
  onLogDateangeChange1() {
    if (this.selectedLogDate1 && this.selectedLogDate1.length === 2) {
      const [start, end] = this.selectedLogDate1;
      if (start && end) {
        this.search2();
        this.isLogDateFilterApplied1 = true;
      }
    } else {
      this.selectedLogDate1 = null; // or [] if you prefer
      this.search2();
      this.isLogDateFilterApplied1 = false;
    }
  }

  //filter
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search2(true);
  }
  listOfFilter1: any[] = [
    { text: 'Available', value: 'true' },
    { text: 'Holiday', value: 'false' },
  ];

  search2(reset: boolean = false, exportInExcel: boolean = false) {
    if (this.searchText2.length < 3 && this.searchText2.length !== 0) {
      return;
    } else {
    }

    if (reset) {
      this.pageIndex2 = 1;
      this.sortKey2 = '_id';
      this.sortValue2 = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValue2.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery: any = {};

    if (this.techId) {
      likeQuery = {
        // Include existing conditions if any
        $and: [{ TECHNICIAN_ID: this.techId }],
      };
    }

    this.filterQueryDate1 = {
      $and: [
        {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$DATE_OF_MONTH',
                    },
                  },
                  this.FROM_DATE2, // Start date
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$DATE_OF_MONTH',
                    },
                  },
                  this.TO_DATE2, // End date
                ],
              },
            ],
          },
        },
        { TECHNICIAN_ID: this.techId }, // Combine this condition directly within the same `$and` array
      ],
    };

    if (this.selectedLogDate1?.length === 2) {
      const [start, end] = this.selectedLogDate1;
      if (start && end) {
        const formatDate = (date: Date) =>
          new Date(
            `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${date
                .getDate()
                .toString()
                .padStart(2, '0')}T${date
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${date
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}:00`
          );

        this.filterQueryDate1.$and.push({
          DATE_OF_MONTH: {
            $gte: formatDate(new Date(start)),
            $lte: formatDate(new Date(end)),
          },
        });
      }
    }

    if (this.statusFilter1) {
      this.filterQueryDate1.$and.push({
        IS_SERIVCE_AVAILABLE: this.statusFilter1,
      });
    }
    if (this.startfromTime && this.starttoTime) {
      this.filterQueryDate1.$and.push({
        DAY_START_TIME: { $gte: this.startfromTime, $lte: this.starttoTime },
      });
    }

    // End Time Range Filter
    if (this.endfromTime1 && this.endtoTime1) {
      this.filterQueryDate1.$and.push({
        DAY_END_TIME: { $gte: this.endfromTime1, $lte: this.endtoTime1 },
      });
    }

    if (this.startfromTime2 && this.starttoTime2) {
      this.filterQueryDate1.$and.push({
        BREAK_START_TIME: {
          $gte: this.startfromTime2,
          $lte: this.starttoTime2,
        },
      });
    }

    // End Time Range Filter
    if (this.endfromTime12 && this.endtoTime12) {
      this.filterQueryDate1.$and.push({
        BREAK_END_TIME: { $gte: this.endfromTime12, $lte: this.endtoTime12 },
      });
    }
    if (exportInExcel == false) {
      this.api
        .gettechnicianactivitycalreport(
          this.pageIndex2,
          this.pageSize2,
          this.sortKey2,
          sort,
          this.filterQueryDate1,
          this.searchText2,
          []
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.loadingRecords2 = false;
              this.totalRecords2 = data.body['count'];
              this.dataList2 = data.body['data'];
            } else {
              this.loadingRecords2 = false;
              this.dataList2 = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords2 = false;
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
      this.loadingRecords2 = true;

      this.api
        .gettechnicianactivitycalreport(
          0,
          0,
          this.sortKey2,
          sort,
          this.filterQueryDate1,
          this.searchText2,
          []
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;
              this.loadingRecords2 = false;
              this.excelData2 = data.body['data'];
              setTimeout(() => this.convertInExcel(), 1000);
              // this.convertInExcel();
            } else {
              this.excelData2 = [];
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

  sort2(params: NzTableQueryParams) {
    this.loadingRecords2 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '_id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex2 = pageIndex;
    this.pageSize2 = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex2 = 1;
      this.pageSize2 = pageSize;
    }

    if (this.sortKey2 != sortField) {
      this.pageIndex2 = 1;
      this.pageSize2 = pageSize;
    }

    this.sortKey2 = sortField;
    this.sortValue2 = sortOrder;
    this.search2();
  }
  isfilter2: boolean = false;
  FROM_DATE2: any = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  TO_DATE2: any = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  JoiningDate2: any = [
    new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st day of current month
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Last day of current month
  ];
  value6: string | null = null;
  value7: string | null = null;

  applyFilter2() {
    this.isFilterApplied2 = 'primary';
    this.isfilter2 = false;
    this.loadingRecords2 = true;
    this.filterQuery2 = '';
    this.pageIndex = 1;

    if (this.JoiningDate2 != null && this.JoiningDate2.length == 2) {
      this.value6 = this.datePipe.transform(this.JoiningDate2[0], 'yyyy-MM-dd');
      this.value7 = this.datePipe.transform(this.JoiningDate2[1], 'yyyy-MM-dd');

      this.FROM_DATE2 = this.value6;
      this.value6 = this.datePipe.transform(this.JoiningDate2[0], 'yyyy-MM-dd');
      this.value7 = this.datePipe.transform(this.JoiningDate2[1], 'yyyy-MM-dd');

      this.TO_DATE2 = this.value7;
      this.isFilterApplied2 = 'primary';
      this.isfilter2 = true;
    }

    this.loadingRecords2 = false;
    if (this.isfilter2) {
      this.loadingRecords2 = true;

      this.search2();
      this.filterClass2 = 'filter-invisible';
    } else {
      this.message.error('please Select Filter Value', '');
      this.isFilterApplied2 = 'default';
    }
  }

  clearFilter2() {
    this.filterClass2 = 'filter-invisible';
    this.isFilterApplied2 = 'default';
    this.dataList2 = [];

    this.filterQuery2 = '';
    this.JoiningDate2 = [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st day of current month
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Last day of current month
    ];

    this.FROM_DATE2 = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    this.TO_DATE2 = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    this.search2();
  }

  endfromTime: any;
  endtoTime: any;
  endfromTime1;
  endtoTime1;

  fromTime: any;
  toTime: any;
  startfromTime;
  starttoTime;

  endfromTime2: any;
  endtoTime2: any;
  endfromTime12;
  endtoTime12;

  fromTime2: any;
  toTime2: any;
  startfromTime2;
  starttoTime2;

  StartTimeVisible;
  isStartTimeFilterApplied: boolean = false;
  StartTimetext: string = '';

  EndTimeVisible;
  isEndTimeFilterApplied: boolean = false;
  EndTimetext: string = '';

  StartTimeVisible1;
  isStartTimeFilterApplied1: boolean = false;
  StartTimetext1: string = '';

  EndTimeVisible1;
  isEndTimeFilterApplied1: boolean = false;
  EndTimetext1: string = '';

  updateStartFromTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0);
  }
  onTimeFilterChange(): void {
    if (this.fromTime && this.toTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isStartTimeFilterApplied = true;
    } else {
      // Clear the filter
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isStartTimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search2();
  }

  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.endfromTime
        .getHours()
        .toString()
        .padStart(2, '0');
      const startMinutes = this.endfromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.endtoTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.endtoTime
        .getMinutes()
        .toString()
        .padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isEndTimeFilterApplied = true;
    } else {
      // Clear the filter
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isEndTimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search2();
  }

  onTimeFilterChange1(): void {
    if (this.fromTime2 && this.toTime2) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.fromTime2.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime2
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime2.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime2.getMinutes().toString().padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.startfromTime2 = `${startHours}:${startMinutes}:00`;
      this.starttoTime2 = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isStartTimeFilterApplied1 = true;
    } else {
      // Clear the filter
      this.fromTime2 = null;
      this.toTime2 = null;
      this.startfromTime2 = null;
      this.starttoTime2 = null;
      this.isStartTimeFilterApplied1 = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search2();
  }

  onendTimeFilterChange1(): void {
    if (this.endfromTime2 && this.endtoTime2) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.endfromTime2
        .getHours()
        .toString()
        .padStart(2, '0');
      const startMinutes = this.endfromTime2
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.endtoTime2.getHours().toString().padStart(2, '0');
      const endMinutes = this.endtoTime2
        .getMinutes()
        .toString()
        .padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.endfromTime12 = `${startHours}:${startMinutes}:00`;
      this.endtoTime12 = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isEndTimeFilterApplied1 = true;
    } else {
      // Clear the filter
      this.endfromTime2 = null;
      this.endtoTime2 = null;
      this.endfromTime12 = null;
      this.endtoTime12 = null;
      this.isEndTimeFilterApplied1 = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.search2();
  }

  exportLoading;
  excelData: any = [];
  excelData1: any = [];
  excelData2: any = [];

  importInExcel() {
    this.search(true, true);
    // Delay to ensure data is ready
  }

  convertInExcel() {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    const formatData = (data: any[]) =>
      data.map((item) => ({
        'Job Created Date': item['JOB_CREATED_DATE']
          ? this.datePipe.transform(
            item['JOB_CREATED_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-',
        'Job No.': item['JOB_CARD_NO'] ? item['JOB_CARD_NO'] : '-',

        'Order No.': item['ORDER_NO'] ? item['ORDER_NO'] : '-',

        Status:
          item['CUSTOMER_TYPE'] === 'I'
            ? 'Individual'
            : item['CUSTOMER_TYPE'] === 'B'
              ? 'Business'
              : '-',
        'Customer Name': item['CUSTOMER_NAME'] ? item['CUSTOMER_NAME'] : '-',
        'Technician Name': item['TECHNICIAN_NAME']
          ? item['TECHNICIAN_NAME']
          : '-',
        'Service Address': item['SERVICE_ADDRESS']
          ? item['SERVICE_ADDRESS']
          : '-',
        'Service Name': item['SERVICE_FULL_NAME']
          ? item['SERVICE_FULL_NAME']
          : '-',
        'Start Time': item['START_TIME']
          ? this.formatTime(item['START_TIME'])
          : '-',

        'End Time': item['END_TIME'] ? this.formatTime(item['END_TIME']) : '-',
        'Reached At Location': item['REACHED_AT_LOCATION']
          ? this.datePipe.transform(
            item['REACHED_AT_LOCATION'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-',
        Pincode: item['PINCODE'] ? item['PINCODE'] : '-',
        'Territory Name': item['TERRITORY_NAME'] ? item['TERRITORY_NAME'] : '-',
        'Service Amount': item['SERVICE_AMOUNT'] ? item['SERVICE_AMOUNT'] : '-',
        'Customer Mobile No.': item['CUSTOMER_MOBILE_NUMBER']
          ? item['CUSTOMER_MOBILE_NUMBER']
          : '-',
        'Technician Cost': item['TECHNICIAN_COST']
          ? item['TECHNICIAN_COST']
          : '-',
        'Vendor Cost': item['VENDOR_COST'] ? item['VENDOR_COST'] : '-',
        'Start Job': item['START_JOB']
          ? this.datePipe.transform(item['START_JOB'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'Pause Job': item['PAUSE_JOB']
          ? this.datePipe.transform(item['PAUSE_JOB'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'Resume Job': item['RESUME_JOB']
          ? this.datePipe.transform(item['RESUME_JOB'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'End Job': item['END_JOB']
          ? this.datePipe.transform(item['END_JOB'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'Job Status': item['JOB_CARD_STATUS']
          ? item['JOB_CARD_STATUS']
          : '-',
        'Job Completed Date': item['JOB_COMPLETED_DATETIME']
          ? this.datePipe.transform(
            item['JOB_COMPLETED_DATETIME'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-',
        'Order Status': item['ORDER_STATUS_NAME']
          ? item['ORDER_STATUS_NAME']
          : '-',
        'Is Job Completed ?': item['IS_JOB_COMPLETE'] ? 'Yes' : 'No',
      }));
    const formatData1 = (data: any[]) =>
      data.map((item) => ({
        'Log Date Time': item['LOG_DATE_TIME']
          ? this.datePipe.transform(item['LOG_DATE_TIME'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'Log Text': item['LOG_TEXT'] ? item['LOG_TEXT'] : '-',
        Status:
          item['STATUS'] === 'EN'
            ? 'Online'
            : item['STATUS'] === 'DE'
              ? 'Offline'
              : '-',
      }));
    const formatData2 = (data: any[]) =>
      data.map((item) => ({
        Date: item['DATE_OF_MONTH']
          ? this.datePipe.transform(item['DATE_OF_MONTH'], 'dd/MM/yyyy hh:mm a')
          : '-',
        'Day Start Time': item['DAY_START_TIME']
          ? this.formatTime(item['DAY_START_TIME'])
          : '-',

        'Day End Time': item['DAY_END_TIME']
          ? this.formatTime(item['DAY_END_TIME'])
          : '-',
        'Break Start Time': item['BREAK_START_TIME']
          ? this.formatTime(item['BREAK_START_TIME'])
          : '-',
        'Break End Time': item['BREAK_END_TIME']
          ? this.formatTime(item['BREAK_END_TIME'])
          : '-',
        ' Is Service Available ?':
          item['IS_SERIVCE_AVAILABLE'] === true
            ? 'Available'
            : item['IS_SERIVCE_AVAILABLE'] === false
              ? 'Holiday'
              : '-',
      }));

    // Creating sheets with formatted data
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(formatData(this.excelData)),
      'Technician Job Details'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(formatData1(this.excelData1)),
      'Technician Day Logs'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(formatData2(this.excelData2)),
      'Technician Availability Logs'
    );

    XLSX.writeFile(
      workbook,
      `Technician Performance Details Report_${this.datePipe.transform(
        new Date(),
        'dd/MM/yyyy'
      )}.xlsx`
    );
  }
}