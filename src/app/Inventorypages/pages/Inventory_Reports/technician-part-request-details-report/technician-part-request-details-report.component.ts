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
  selector: 'app-technician-part-request-details-report',
  templateUrl: './technician-part-request-details-report.component.html',
  styleUrls: ['./technician-part-request-details-report.component.css'],
})
export class TechnicianPartRequestDetailsReportComponent implements OnInit {
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
    public datepipe: DatePipe
  ) { }
  formTitle = 'Job Wise Part Request Details';
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
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  totalRecords = 1;
  totalRecords1 = 1;
  columns: string[][] = [
    ['ORDER_NO', 'ORDER_NO'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['TECHNICIAN_NAME', 'TECHNICIAN_NAME'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
  ];
  columns1: string[][] = [
    ['ACTUAL_UNIT_NAME', 'ACTUAL_UNIT_NAME'],
    ['ITEM_NAME', 'ITEM_NAME'],
    ['BATCH_NO', 'BATCH_NO'],
    ['SERIAL_NO', 'SERIAL_NO'],
    ['INVENTRY_SUB_CATEGORY_NAME', 'INVENTRY_SUB_CATEGORY_NAME'],
    ['INVENTORY_CATEGORY_NAME', 'INVENTORY_CATEGORY_NAME'],
  ];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.getTeritory();
    this.getteritorydata();
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
    if (this.warehousename.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.iswarehousename = true;
    } else if (this.warehousename.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.iswarehousename = false;
    }
    if (this.managertext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.ismangerfilt = true;
    } else if (this.managertext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.ismangerfilt = false;
    }
    if (this.itemtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isitemFilterApplied = true;
    } else if (this.itemtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isitemFilterApplied = false;
    }
    if (this.serialtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isserialFilterApplied = true;
    } else if (this.serialtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isserialFilterApplied = false;
    }
    if (this.BATCHtext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isBATCHFilterApplied = true;
    } else if (this.BATCHtext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isBATCHFilterApplied = false;
    }
    if (this.unittext.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isunitFilterApplied = true;
    } else if (this.unittext.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isunitFilterApplied = false;
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
    if (this.warehousename !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_NAME LIKE '%${this.warehousename.trim()}%'`;
      this.iswarehousename = true;
    } else {
      this.iswarehousename = false;
    }
    if (this.managertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CUSTOMER_NAME LIKE '%${this.managertext.trim()}%'`;
      this.ismangerfilt = true;
    } else {
      this.ismangerfilt = false;
    }
    if (this.itemtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `JOB_CARD_NO LIKE '%${this.itemtext.trim()}%'`;
      this.isitemFilterApplied = true;
    } else {
      this.isitemFilterApplied = false;
    }
    if (this.unittext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ORDER_NO LIKE '%${this.unittext.trim()}%'`;
      this.isunitFilterApplied = true;
    } else {
      this.isunitFilterApplied = false;
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
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INVENTORY_TRACKING_TYPE = '${this.statusFilter1}'`;
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
    if (this.approvedDate1?.length === 2) {
      const [start, end] = this.approvedDate1;
      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `VERIFICATION_DATE BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
      }
    }
    if (this.selectedterritory.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TERRITORY_ID IN (${this.selectedterritory.join(',')})`; 
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    if (exportInExcel == false) {
      this.api
        .getTechniciansPartRequestReport(
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
        .getTechniciansPartRequestReport(
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
        obj1['Customer Name'] = this.excelData[i]['CUSTOMER_NAME']
          ? this.excelData[i]['CUSTOMER_NAME']
          : '-';
        obj1['Job No.'] = this.excelData[i]['JOB_CARD_NO']
          ? this.excelData[i]['JOB_CARD_NO']
          : '-';
        obj1['Order No.'] = this.excelData[i]['ORDER_NO']
          ? this.excelData[i]['ORDER_NO']
          : '-';
        if (this.excelData[i]['STATUS'] === 'P') {
          obj1['Verification Status'] = 'Pending';
        } else if (this.excelData[i]['STATUS'] === 'AP') {
          obj1['Verification Status'] = 'Approved';
        } else if (this.excelData[i]['STATUS'] === 'R') {
          obj1['Verification Status'] = 'Rejected';
        } else {
          obj1['Verification Status'] = '-';
        }
        obj1['Verification Date'] = this.excelData[i]['VERIFICATION_DATE']
          ? this.datepipe.transform(
            this.excelData[i]['VERIFICATION_DATE'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Total Items'] = this.excelData[i]['TOTAL_ITEMS']
          ? this.excelData[i]['TOTAL_ITEMS']
          : '-';
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
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
  importInExcel1() {
    this.search1(true, true);
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
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Name',
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
    {
      key: 'STATUS',
      label: 'Approval Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: "AP' OR STATUS = 'AC", display: 'Approved' },
        { value: 'R', display: 'Rejected' },
      ],
      placeholder: 'Select Approval Status',
    },
    {
      key: 'VERIFICATION_DATE',
      label: 'Verification Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Verification Date',
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
  ViewDetails(data) {
    this.storeid = data.JOB_CARD_ID;
    this.PartTitle = 'Part request details of job no ' + data.JOB_CARD_NO;
    this.search1();
    this.isdetailsclosed = true;
  }
  closedetailsd() {
    this.search();
    this.isdetailsclosed = false;
  }
  search1(reset: boolean = false, exportInExcel: boolean = false) {
    if (
      this.searchText1.trim().length < 3 &&
      this.searchText1.trim().length !== 0
    ) {
      return;
    }
    if (reset) {
      this.pageIndex1 = 1;
      this.sortKey1 = '';
      this.sortValue1 = 'desc';
    }
    let sort: string;
    try {
      sort = this.sortValue1.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    let likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText1 !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns1
          .map((column) => {
            return `${column[0]} like '%${this.searchText1}%'`;
          })
          .join(' OR ') +
        ')';
    }
    if (this.warehousename !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_NAME LIKE '%${this.warehousename.trim()}%'`;
      this.iswarehousename = true;
    } else {
      this.iswarehousename = false;
    }
    if (this.managertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_MANAGER_NAME LIKE '%${this.managertext.trim()}%'`;
      this.ismangerfilt = true;
    } else {
      this.ismangerfilt = false;
    }
    if (this.itemtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ITEM_NAME LIKE '%${this.itemtext.trim()}%'`;
      this.isitemFilterApplied = true;
    } else {
      this.isitemFilterApplied = false;
    }
    if (this.serialtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERIAL_NO LIKE '%${this.serialtext.trim()}%'`;
      this.isserialFilterApplied = true;
    } else {
      this.isserialFilterApplied = false;
    }
    if (this.BATCHtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `BATCH_NO LIKE '%${this.BATCHtext.trim()}%'`;
      this.isBATCHFilterApplied = true;
    } else {
      this.isBATCHFilterApplied = false;
    }
    if (this.unittext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ACTUAL_UNIT_NAME LIKE '%${this.unittext.trim()}%'`;
      this.isunitFilterApplied = true;
    } else {
      this.isunitFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INVENTORY_TYPE = '${this.statusFilter}'`;
    }
    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `INVENTORY_TRACKING_TYPE = '${this.statusFilter1}'`;
    }
    if (this.selectedterritory.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TERRITORY_ID IN (${this.selectedterritory.join(',')})`; 
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (exportInExcel == false) {
      this.loadingRecords1 = true;
      this.api
        .getTechniciansPartRequestDetailsReport(
          this.pageIndex1,
          this.pageSize1,
          this.sortKey1,
          sort,
          likeQuery,
          this.storeid
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords1 = false;
              this.TabId = data['TAB_ID'];
              this.totalRecords1 = data['count'];
              this.dataList1 = data['data'];
            } else if (data['code'] == 400) {
              this.loadingRecords1 = false;
              this.dataList1 = [];
              this.message.error('Invalid filter parameter', '');
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
      this.loadingRecords1 = true;
      this.exportLoading1 = true;
      this.api
        .getTechniciansPartRequestDetailsReport(
          0,
          0,
          this.sortKey1,
          sort,
          likeQuery,
          this.storeid
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords1 = false;
              this.exportLoading1 = false;
              this.excelData1 = data['data'];
              this.convertInExcel1();
            } else {
              this.excelData1 = [];
              this.exportLoading1 = false;
              this.loadingRecords1 = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords1 = false;
            this.exportLoading1 = false;
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
  sort1(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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
    if (currentSort != null && currentSort.value != undefined) {
      this.search1();
    }
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
  onKeyup1(keys) {
    const element = window.document.getElementById('button1');
    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.search1();
    } else if (this.searchText1.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search1();
    }
  }
  onEnterKey1(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
}
