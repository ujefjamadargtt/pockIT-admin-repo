import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-technicianwisestatic-inventory-report',
  templateUrl: './technicianwisestatic-inventory-report.component.html',
  styleUrls: ['./technicianwisestatic-inventory-report.component.css']
})
export class TechnicianwisestaticInventoryReportComponent implements OnInit {
  filterGroups: any[] = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private _exportService: ExportService,
    public commonFunction: CommonFunctionService,
    public datepipe: DatePipe
  ) { }
  formTitle = 'Technician wise static Inventory report';
  excelData: any = [];
  exportLoading: boolean = false;
  excelData1: any = [];
  exportLoading1: boolean = false;
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'JOB_CARD_NO';
  searchText1: string = '';
  pageIndex1 = 1;
  pageSize1 = 10;
  sortValue1: string = 'desc';
  sortKey1: string = '';
  chapters: any = [];
  isLoading = true;
  loadingRecords = false;
  loadingRecords1 = false;
  filteredUnitData: any[] = [];
  filterQuery1: any = '';
  dataList: any = [];
  dataList1: any = [];
  filterQuery: string = '';
  savedFilters: any[] = [];
  TabId: number;
  isDeleting: boolean = false;
  drawerTitle!: string;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  StartDate: any = [];
  EndDate: any = [];
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  totalRecords = 1;
  totalRecords1 = 1;
  columns: string[][] = [
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['ORDER_NO', 'ORDER_NO'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['STATIC_ITEM_NAME', 'STATIC_ITEM_NAME'],
  ];
  columns1: string[][] = [
    ['ACTUAL_UNIT_NAME', 'ACTUAL_UNIT_NAME'],
    ['ITEM_NAME', 'ITEM_NAME'],
    ['BATCH_NO', 'BATCH_NO'],
    ['SERIAL_NO', 'SERIAL_NO'],
    ['INVENTRY_SUB_CATEGORY_NAME', 'INVENTRY_SUB_CATEGORY_NAME'],
    ['INVENTORY_CATEGORY_NAME', 'INVENTORY_CATEGORY_NAME'],
  ];
  technicianName: string = '';
  isTechnicianNameVisible: boolean = false;
  isTechnicianFilterApplied: boolean = false;
  orderNo: string = '';
  isOrderNoVisible: boolean = false;
  isOrderNoFilterApplied: boolean = false;
  jobNo: string = '';
  isJobNoVisible: boolean = false;
  isJobNoFilterApplied: boolean = false;
  staticItemName: string = '';
  isStaticItemNameVisible: boolean = false;
  isStaticItemNameFilterApplied: boolean = false;
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.getTeritory();
    this.getteritorydata();
    this.search(true);
  }
  territoryData: any = [];
  territoryData1: any = [];
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  getTeritory() {
    this.api.getTeritory(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.territoryData = data['data'];
          this.TabId = data['TAB_ID'];
        } else {
          this.territoryData = [];
          this.message.error('Failed To Get Territory Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  getteritorydata() {
    this.api.getTeritory(0, 0, '', '', ' AND IS_ACTIVE=1').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.territoryData1.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      }
    });
  }
  territoryVisible = false;
  selectedterritory: any[] = [];
  isterritorynameFilterApplied = false;
  onTerritoryChange(): void {
    if (this.selectedterritory?.length) {
      this.search();
      this.isterritorynameFilterApplied = true;
    } else {
      this.search();
      this.isterritorynameFilterApplied = false;
    }
  }
  managertext: string = '';
  ismangerfilt: boolean = false;
  managervisible = false;
  warehousename: string = '';
  iswarehousename: boolean = false;
  warehousenameisible = false;
  itemtext: string = '';
  itemtextvisible = false;
  isitemFilterApplied: boolean = false;
  serialtext: string = '';
  serialtextvisible = false;
  isserialFilterApplied: boolean = false;
  BATCHtext: string = '';
  BATCHtextvisible = false;
  isBATCHFilterApplied: boolean = false;
  unittext: string = '';
  unittextvisible = false;
  isunitFilterApplied: boolean = false;
  scheduleDateVisible = false;
  isscheduleDateFilterApplied: boolean = false;
  reset(): void {
    this.searchText = '';
    this.technicianName = '';
    this.orderNo = '';
    this.jobNo = '';
    this.staticItemName = '';
    this.warehousename = '';
    this.managertext = '';
    this.itemtext = '';
    this.serialtext = '';
    this.BATCHtext = '';
    this.unittext = '';
    this.search();
  }
  listOfFilter: any[] = [
    { text: 'Pending', value: ['P'] },
    { text: 'Approved', value: ['AP', 'AC'] },
    { text: 'Rejected', value: ['R'] },
  ];
  statusFilter: string[] | undefined = undefined;
  onStatusFilterChange(selectedStatus: string[]) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter1: any[] = [
    { text: 'None', value: 'N' },
    { text: 'Serial No. Wise', value: 'S' },
    { text: 'Batch Wise', value: 'P' },
  ];
  statusFilter1: string | undefined = undefined;
  onStatusFilterChange1(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }
  onKeyup(keys) {
    const element = window.document.getElementById('button');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
    if (this.technicianName.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isTechnicianFilterApplied = true;
    } else if (this.technicianName.length === 0 && keys.key === 'Backspace') {
      this.search();
      this.isTechnicianFilterApplied = false;
    }
    if (this.orderNo.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isOrderNoFilterApplied = true;
    } else if (this.orderNo.length === 0 && keys.key === 'Backspace') {
      this.search();
      this.isOrderNoFilterApplied = false;
    }
    if (this.jobNo.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isJobNoFilterApplied = true;
    } else if (this.jobNo.length === 0 && keys.key === 'Backspace') {
      this.search();
      this.isJobNoFilterApplied = false;
    }
    if (this.staticItemName.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isStaticItemNameFilterApplied = true;
    } else if (this.staticItemName.length === 0 && keys.key === 'Backspace') {
      this.search();
      this.isStaticItemNameFilterApplied = false;
    }
    if (this.technicianName.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isTechnicianFilterApplied = true;
    } else if (this.technicianName.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isTechnicianFilterApplied = false;
    }
    if (this.orderNo.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isOrderNoFilterApplied = true;
    } else if (this.orderNo.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isOrderNoFilterApplied = false;
    }
    if (this.jobNo.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isJobNoFilterApplied = true;
    } else if (this.jobNo.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isJobNoFilterApplied = false;
    }
    if (this.staticItemName.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isStaticItemNameFilterApplied = true;
    } else if (this.staticItemName.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isStaticItemNameFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  filterData: any;
  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  filterloading: boolean = false;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      )
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') {
                sessionStorage.removeItem('ID');
              }
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (element: any) =>
                    Number(element.ID) === Number(sessionStorage.getItem('ID'))
                );
                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA') {
                  this.applyfilter(this.savedFilters[0]);
                }
              }
              this.whichbutton = '';
              this.updateBtn = '';
            }
            this.filterQuery = '';
          } else {
            this.filterloading = false;
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  deleteItem(item: any): void {
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';
          this.loadFilters();
          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);
          } else {
            this.isfilterapply = true;
          }
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
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
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  drawerflterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
    this.whichbutton = buttontype;
    this.updateBtn = updateButton;
    if (buttontype == 'SA') {
      this.loadFilters();
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'JOB_CARD_NO';
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
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.technicianName !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `TECHNICIAN_NAME LIKE '%${this.technicianName.trim()}%'`;
      this.isTechnicianFilterApplied = true;
    } else {
      this.isTechnicianFilterApplied = false;
    }
    if (this.orderNo !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `ORDER_NO LIKE '%${this.orderNo.trim()}%'`;
      this.isOrderNoFilterApplied = true;
    } else {
      this.isOrderNoFilterApplied = false;
    }
    if (this.jobNo !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `JOB_CARD_NO LIKE '%${this.jobNo.trim()}%'`;
      this.isJobNoFilterApplied = true;
    } else {
      this.isJobNoFilterApplied = false;
    }
    if (this.staticItemName !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `STATIC_ITEM_NAME LIKE '%${this.staticItemName.trim()}%'`;
      this.isStaticItemNameFilterApplied = true;
    } else {
      this.isStaticItemNameFilterApplied = false;
    }
    if (this.technicianName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.technicianName.trim()}%'`;
      this.isTechnicianFilterApplied = true;
    } else {
      this.isTechnicianFilterApplied = false;
    }
    if (this.orderNo !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.orderNo.trim()}%'`;
      this.isOrderNoFilterApplied = true;
    } else {
      this.isOrderNoFilterApplied = false;
    }
    if (this.jobNo !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.jobNo.trim()}%'`;
      this.isJobNoFilterApplied = true;
    } else {
      this.isJobNoFilterApplied = false;
    }
    if (this.staticItemName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `STATIC_ITEM_NAME LIKE '%${this.staticItemName.trim()}%'`;
      this.isStaticItemNameFilterApplied = true;
    } else {
      this.isStaticItemNameFilterApplied = false;
    }
    if (this.statusFilter && this.statusFilter.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      if (this.statusFilter.length === 1) {
        likeQuery += `STATUS = '${this.statusFilter[0]}'`;
      } else {
        const statusList = this.statusFilter.map((val) => `'${val}'`).join(',');
        likeQuery += `STATUS IN (${statusList})`;
      }
    }
    if (this.approvedDate?.length === 2) {
      const [start, end] = this.approvedDate;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `REQUESTED_DATE_TIME BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    if (exportInExcel == false) {
      this.api
        .getTechnicianWiseStaticInventoryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.TabId = data['TAB_ID'];
              this.totalRecords = data['count'];
              this.dataList = data['data'];
            } else if (data['code'] == 400) {
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
                'Network error: Please check your internet connection.',
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
      this.loadingRecords = true;
      this.exportLoading = true;
      this.api
        .getTechnicianWiseStaticInventoryReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.exportLoading = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.exportLoading = false;
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
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'JOB_CARD_NO';
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
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Job Wise Part Request Details Filter';
    this.drawerFilterVisible = true;
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
    this.filterGroups2 = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Requested Date'] = this.excelData[i]['REQUESTED_DATE_TIME']
          ? this.datepipe.transform(
            this.excelData[i]['REQUESTED_DATE_TIME'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Technician Name'] = this.excelData[i]['TECHNICIAN_NAME']
          ? this.excelData[i]['TECHNICIAN_NAME']
          : '-';
        obj1['Inventory Name'] = this.excelData[i]['STATIC_ITEM_NAME']
          ? this.excelData[i]['STATIC_ITEM_NAME']
          : '-';
        obj1['Order No.'] = this.excelData[i]['ORDER_NO']
          ? this.excelData[i]['ORDER_NO']
          : '-';
        obj1['Job No.'] = this.excelData[i]['JOB_CARD_NO']
          ? this.excelData[i]['JOB_CARD_NO']
          : '-';
        if (this.excelData[i]['STATUS'] === 'P') {
          obj1['Verification Status'] = 'Pending';
        } else if (this.excelData[i]['STATUS'] === 'AP' || this.excelData[i]['STATUS'] === 'AC' || this.excelData[i]['STATUS'] === 'A') {
          obj1['Verification Status'] = 'Approved';
        } else if (this.excelData[i]['STATUS'] === 'R') {
          obj1['Verification Status'] = 'Rejected';
        } else {
        }
        obj1['Quantity'] = this.excelData[i]['QUANTITY_USED']
          ? this.excelData[i]['QUANTITY_USED']
          : '-';
        obj1['Total Amount'] = this.excelData[i]['TOTAL_AMOUNT']
          ? this.excelData[i]['TOTAL_AMOUNT']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Technician wise static inventory Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('No data found', '');
    }
  }
  selectedFilter: string | null = null;
  isModalVisible = false;
  selectedQuery: string = '';
  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  importInExcel() {
    this.search(true, true);
  }
  getTechnicianWiseStaticInventoryReport(reset: boolean = false, exportInExcel: boolean = false): void {
    this.search(reset, exportInExcel);
  }
  commenttext: string = '';
  isapprovedDateFilterApplied = false;
  approvedDate: any = [];
  approvedDateVisible = false;
  onApprovedDateRangeChange(): void {
    if (this.approvedDate && this.approvedDate.length === 2) {
      const [start, end] = this.approvedDate;
      if (start && end) {
        this.search();
        this.isapprovedDateFilterApplied = true;
      }
    } else {
      this.approvedDate = null;
      this.search();
      this.isapprovedDateFilterApplied = false;
    }
  }
  isapprovedDateFilterApplied1 = false;
  approvedDate1: any = [];
  approvedDateVisible1 = false;
  onApprovedDateRangeChange1(): void {
    if (this.approvedDate1 && this.approvedDate1.length === 2) {
      const [start, end] = this.approvedDate1;
      if (start && end) {
        this.search();
        this.isapprovedDateFilterApplied1 = true;
      }
    } else {
      this.approvedDate1 = null;
      this.search();
      this.isapprovedDateFilterApplied1 = false;
    }
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'REQUESTED_DATE_TIME',
      label: 'Requested Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Requested Date',
    },
    {
      key: 'TECHNICIAN_NAME',
      label: 'Technician Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Name',
    },
    {
      key: 'JOB_CARD_NO',
      label: 'Job Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job Number',
    },
    {
      key: 'ORDER_NO',
      label: 'Order Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order Number',
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        this.isscheduleDateFilterApplied = true;
      }
    } else {
      this.StartDate = null;
      this.search();
      this.isscheduleDateFilterApplied = false;
    }
  }
  isdetailsclosed = false;
  storeid: any;
  PartTitle: any = '';
  closedetailsd() {
    this.search();
    this.isdetailsclosed = false;
  }
  convertInExcel1() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData1.length > 0) {
      for (var i = 0; i < this.excelData1.length; i++) {
        obj1['Category'] = this.excelData1[i]['INVENTORY_CATEGORY_NAME']
          ? this.excelData1[i]['INVENTORY_CATEGORY_NAME']
          : '-';
        obj1['Sub Category'] = this.excelData1[i]['INVENTRY_SUB_CATEGORY_NAME']
          ? this.excelData1[i]['INVENTRY_SUB_CATEGORY_NAME']
          : '-';
        obj1['Item Name'] = this.excelData1[i]['ITEM_NAME']
          ? this.excelData1[i]['ITEM_NAME']
          : '-';
        obj1['Quantity'] = this.excelData1[i]['QUANTITY']
          ? this.excelData1[i]['QUANTITY']
          : '-';
        obj1['Unit Name'] = this.excelData1[i]['ACTUAL_UNIT_NAME']
          ? this.excelData1[i]['ACTUAL_UNIT_NAME']
          : '-';
        obj1['Serial No.'] = this.excelData1[i]['SERIAL_NO']
          ? this.excelData1[i]['SERIAL_NO']
          : '-';
        obj1['Batch No.'] = this.excelData1[i]['BATCH_NO']
          ? this.excelData1[i]['BATCH_NO']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData1.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Job Wise Part Request Details Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('No data found', '');
    }
  }
  onEnterKey1(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
}
