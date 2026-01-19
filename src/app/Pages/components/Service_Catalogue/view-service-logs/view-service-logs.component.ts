import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
@Component({
  selector: 'app-view-service-logs',
  templateUrl: './view-service-logs.component.html',
  styleUrls: ['./view-service-logs.component.css'],
  providers: [DatePipe],
})
export class ViewServiceLogsComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerData: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  searchText1: string = '';
  public commonFunction = new CommonFunctionService();
  currentHour: any = new Date().getHours();
  currentMinute: any = new Date().getMinutes();
  isOk: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'DESC';
  sortKey: string = '_id';
  isLoading = true;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  excelData: any = [];
  exportLoading: boolean = false;
  isSpinning = false;
  @Input() data: any = ServiceCatMasterDataNew;
  @Input() drawerCloset: any = Function;
  @Input() drawerVisiblet: boolean = false;
  @Input() type: any;
  @Input() serviceid: any;
  columns: string[][] = [
    ['EXPRESS_COST', 'EXPRESS_COST'],
    ['NAME', 'NAME'],
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['SUB_CATEGORY_NAME', 'SUB_CATEGORY_NAME'],
    ['VENDOR_COST', 'VENDOR_COST'],
    ['TECHNICIAN_COST', 'TECHNICIAN_COST'],
    ['B2C_PRICE', 'B2C_PRICE'],
    ['B2B_PRICE', 'B2B_PRICE'],
    ['LOG_TEXT', 'LOG_TEXT'],
    ['ADDED_BY', 'ADDED_BY'],
  ];
  loadingRecords = false;
  totalRecords = 0;
  dataList: any = [];
  selectedCategories: number[] = [];
  selectedSubCategories: number[] = [];
  servicename: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public datepipe: DatePipe,
    private _exportService: ExportService
  ) { }
  distinctData: any = [];
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
  close() {
    this.drawerCloset();
  }
  ngOnInit() {
    this.getCategoryData();
    this.getSubCategoryData();
    this.datalistforTable.START_TIME = this.datepipe.transform(
      this.datalistforTable.START_TIME,
      'hh:mm a'
    );
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    this.searchTable();
  }
  ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'Item/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  onKeypressEvent(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');
    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.searchTable(true);
    } else if (this.searchText1.length == 0 && keys.key == 'Backspace') {
      this.searchTable(true);
    }
  }
  searchTableIcon() {
    if (this.searchText1.length >= 3) {
      this.searchTable();
    } else {
      this.message.info('Please enter alteast 3 characters to search', '');
    }
  }
  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '_id';
    const sortOrder = (currentSort && currentSort.value) || 'DESC';
    this.pageIndextable = pageIndex;
    this.pageSizetable = pageSize;
    if (this.pageSizetable != pageSize) {
      this.pageIndextable = 1;
      this.pageSizetable = pageSize;
    }
    if (this.sortKeytable != sortField) {
      this.pageIndextable = 1;
      this.pageSizetable = pageSize;
    }
    this.sortKeytable = sortField;
    this.sortValuetable = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.searchTable();
    }
  }
  datalistforTable: any = [];
  loadtable: boolean = false;
  totalREcordTable: any = 0;
  pageIndextable: any = 1;
  pageSizetable: any = 10;
  sortValuetable: string = 'DESC';
  sortKeytable: any = '_id';
  pageIndexBulk: any = 0;
  pageSizeBulk: any = 0;
  sortValueBulk: string = 'DESC';
  sortKeyBulk: any = '';
  logtype: any = '';
  statusFilter: string | undefined = undefined;
  serviceTypeFilter: string | undefined = undefined;
  JobCreatedFilter: string | undefined = undefined;
  SubServiceFilter: string | undefined = undefined;
  NewFilter: string | undefined = undefined;
  ExpressFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.searchTable(true);
  }
  onServiceTypeFilterChange(selectedStatus: string) {
    this.serviceTypeFilter = selectedStatus;
    this.searchTable(true);
  }
  onJobCreatedFilterChange(selectedStatus: string) {
    this.JobCreatedFilter = selectedStatus;
    this.searchTable(true);
  }
  onSubServiceFilterChange(selectedStatus: string) {
    this.SubServiceFilter = selectedStatus;
    this.searchTable(true);
  }
  onNewFilterChange(selectedStatus: string) {
    this.NewFilter = selectedStatus;
    this.searchTable(true);
  }
  guranteeFilter: string | undefined = undefined;
  onguranteeFilterChange(selectedStatus: string) {
    this.guranteeFilter = selectedStatus;
    this.searchTable(true);
  }
  waranteeFilter: string | undefined = undefined;
  onwarrantyFilterChange(selectedStatus: string) {
    this.waranteeFilter = selectedStatus;
    this.searchTable(true);
  }
  onExpressFilterChange(selectedStatus: string) {
    this.ExpressFilter = selectedStatus;
    this.searchTable(true);
  }
  Durationhours = '';
  Durationminutes = '';
  onInputChange() {
    if (this.Durationhours === '' && this.Durationminutes === '') {
      this.isServiceDurationFilterApplied = false;
      this.searchTable(true); 
    }
  }
  applydurationFilter() {
    if (this.Durationhours === '' || this.Durationminutes === '') {
      this.isServiceDurationFilterApplied = false;
      if (this.Durationhours === '' && this.Durationminutes === '') {
        this.message.error('Please Select Both Hours and Minutes.', '');
      } else if (this.Durationhours === '') {
        this.message.error('Please Select Hours.', '');
      } else if (this.Durationminutes === '') {
        this.message.error('Please Select Minutes.', '');
      }
      this.searchTable(true); 
    } else {
      this.isServiceDurationFilterApplied = true;
      this.searchTable(false); 
    }
  }
  prephours = '';
  prepnminutes = '';
  onprepInputChange() {
    if (this.prephours === '' && this.prepnminutes === '') {
      this.isServiceDurationFilterApplied = false;
      this.searchTable(true); 
    }
  }
  applyprepFilter() {
    if (this.prephours === '' || this.prepnminutes === '') {
      this.isPrepHoursFilterApplied = false;
      if (this.prephours === '' && this.prepnminutes === '') {
        this.message.error('Please Select Both Hours and Minutes.', '');
      } else if (this.prephours === '') {
        this.message.error('Please Select Hours.', '');
      } else if (this.prepnminutes === '') {
        this.message.error('Please Select Minutes.', '');
      }
      this.searchTable(true); 
    } else {
      this.isPrepHoursFilterApplied = true;
      this.searchTable(false); 
    }
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  searchTable(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndextable = 1;
      this.sortKeytable = '_id';
      this.sortValuetable = 'DESC';
    }
    var sort: string;
    try {
      sort = this.sortValuetable.startsWith('a') ? 'asc' : 'DESC';
    } catch (error) {
      sort = '';
    }
    let filter: any = {};
    var likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText1 !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText1}%'`;
          })
          .join(' OR ') +
        ')';
    }
    this.loadingRecords = true;
    if (this.type != null && this.type !== undefined && this.type !== '') {
      if (
        this.type === 'B2BM' ||
        this.type === 'B2BBL' ||
        this.type === 'B2B'
      ) {
        this.logtype = {
          $or: [
            { LOG_TYPE: 'B2BM' },
            { LOG_TYPE: 'B2BBL' },
            { LOG_TYPE: 'B2B' },
          ],
        };
      } else {
        this.logtype = { LOG_TYPE: this.type };
      }
    } else {
      this.logtype = {};
    }
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
        filter.LOG_DATE_TIME = {
          $gte: formatDate(new Date(start)),
          $lte: formatDate(new Date(end)),
        };
      }
    }
    if (this.ServiceModBytext !== '') {
      filter.ADDED_BY = { $regex: this.ServiceModBytext.trim(), $options: 'i' };
      this.isServiceModVisibleFilterApplied = true;
    } else {
      this.isServiceModVisibleFilterApplied = false;
    }
    if (this.Logtext !== '') {
      filter.LOG_TEXT = { $regex: this.Logtext.trim(), $options: 'i' };
      this.isLogTextVisibleFilterApplied = true;
    } else {
      this.isLogTextVisibleFilterApplied = false;
    }
    if (this.nametext !== '') {
      filter.NAME = { $regex: this.nametext.trim(), $options: 'i' };
      this.isServiceNameFilterApplied = true;
    } else {
      this.isServiceNameFilterApplied = false;
    }
    if (this.hsncodetext !== '') {
      filter.HSN_CODE = { $regex: this.hsncodetext.trim(), $options: 'i' };
      this.ishsncodeFilterApplied = true;
    } else {
      this.ishsncodeFilterApplied = false;
    }
    if (this.taxnametext !== '') {
      filter.TAX_NAME = { $regex: this.taxnametext.trim(), $options: 'i' };
      this.isTaxNameFilterApplied = true;
    } else {
      this.isTaxNameFilterApplied = false;
    }
    if (this.unitnametext !== '') {
      filter.UNIT_NAME = { $regex: this.unitnametext.trim(), $options: 'i' };
      this.isUnitNameFilterApplied = true;
    } else {
      this.isUnitNameFilterApplied = false;
    }
    if (this.hsncodetext !== '') {
      filter.HSN_CODE = { $regex: this.hsncodetext.trim(), $options: 'i' };
      this.ishsncodeFilterApplied = true;
    } else {
      this.ishsncodeFilterApplied = false;
    }
    if (this.taxnametext !== '') {
      filter.TAX_NAME = { $regex: this.taxnametext.trim(), $options: 'i' };
      this.isTaxNameFilterApplied = true;
    } else {
      this.isTaxNameFilterApplied = false;
    }
    if (this.guranteetext !== '') {
      filter.GUARANTEE_PERIOD = {
        $regex: this.guranteetext.trim(),
      };
      this.isguranteeFilterApplied = true;
    } else {
      this.isguranteeFilterApplied = false;
    }
    if (this.wranteetext !== '') {
      filter.WARRANTY_PERIOD = {
        $regex: this.wranteetext.trim(),
      };
      this.iswarperiodFilterApplied = true;
    } else {
      this.iswarperiodFilterApplied = false;
    }
    if (this.B2Btext !== '') {
      filter.B2B_PRICE = { $regex: this.B2Btext.trim(), $options: 'i' };
      this.isB2BFilterApplied = true;
    } else {
      this.isB2BFilterApplied = false;
    }
    if (this.B2Ctext !== '') {
      filter.B2C_PRICE = { $regex: this.B2Ctext.trim(), $options: 'i' };
      this.isB2CFilterApplied = true;
    } else {
      this.isB2CFilterApplied = false;
    }
    if (this.TechnicianCosttext !== '') {
      filter.TECHNICIAN_COST = {
        $regex: this.TechnicianCosttext.trim(),
        $options: 'i',
      };
      this.isTechnicalCostFilterApplied = true;
    } else {
      this.isTechnicalCostFilterApplied = false;
    }
    if (this.VendorCosttext !== '') {
      filter.VENDOR_COST = {
        $regex: this.VendorCosttext.trim(),
        $options: 'i',
      };
      this.isVendorCostFilterApplied = true;
    } else {
      this.isVendorCostFilterApplied = false;
    }
    if (this.ExpCosttext !== '') {
      filter.EXPRESS_COST = { $regex: this.ExpCosttext.trim(), $options: 'i' };
      this.isExpressCostFilterApplied = true;
    } else {
      this.isExpressCostFilterApplied = false;
    }
    if (this.Qtytext !== '') {
      filter.QTY = { $regex: this.Qtytext.trim(), $options: 'i' };
      this.isQtyFilterApplied = true;
    } else {
      this.isQtyFilterApplied = false;
    }
    if (this.MaxQtytext !== '') {
      filter.MAX_QTY = { $regex: this.MaxQtytext.trim(), $options: 'i' };
      this.isMaxQtyFilterApplied = true;
    } else {
      this.isMaxQtyFilterApplied = false;
    }
    if (this.Durationhours !== '' && this.Durationminutes !== '') {
      filter.DURATION_HOUR = {
        $regex: `^${this.Durationhours.trim()}$`,
        $options: 'i',
      };
      filter.DURATION_MIN = {
        $regex: `^${this.Durationminutes.trim()}$`,
        $options: 'i', 
      };
      this.isServiceDurationFilterApplied = true;
    } else if (reset) {
      delete filter.DURATION_HOUR;
      delete filter.DURATION_MIN;
      this.isServiceDurationFilterApplied = false;
    }
    if (this.prephours !== '' && this.prepnminutes !== '') {
      filter.PREPARATION_HOURS = {
        $regex: `^${this.prephours.trim()}$`,
        $options: 'i',
      };
      filter.PREPARATION_MINUTES = {
        $regex: `^${this.prepnminutes.trim()}$`,
        $options: 'i', 
      };
      this.isPrepHoursFilterApplied = true;
    } else if (reset) {
      delete filter.PREPARATION_HOURS;
      delete filter.PREPARATION_MINUTES;
      this.isPrepHoursFilterApplied = false;
    }
    if (this.startfromTime && this.starttoTime) {
      filter.START_TIME = { $gte: this.startfromTime, $lte: this.starttoTime };
    }
    if (this.endfromTime1 && this.endtoTime1) {
      filter.END_TIME = { $gte: this.endfromTime1, $lte: this.endtoTime1 };
    }
    if (this.statusFilter) {
      filter.STATUS = this.statusFilter;
    }
    if (this.JobCreatedFilter) {
      filter.IS_JOB_CREATED_DIRECTLY = this.JobCreatedFilter;
    }
    if (this.SubServiceFilter) {
      filter.IS_PARENT = this.SubServiceFilter;
    }
    if (this.ExpressFilter) {
      filter.IS_EXPRESS = this.ExpressFilter;
    }
    if (this.NewFilter) {
      filter.IS_NEW = this.NewFilter;
    }
    if (this.guranteeFilter) {
      filter.GUARANTEE_ALLOWED = this.guranteeFilter;
    }
    if (this.waranteeFilter) {
      filter.WARRANTY_ALLOWED = this.waranteeFilter;
    }
    if (this.serviceTypeFilter) {
      filter.SERVICE_TYPE = this.serviceTypeFilter;
    }
    if (this.selectedCategories.length > 0) {
      filter.CATEGORY_NAME = { $in: this.selectedCategories };
    }
    if (this.selectedSubCategories.length > 0) {
      filter.SUB_CATEGORY_NAME = { $in: this.selectedSubCategories };
    }
    var additionalFilters: any = {};
    if (this.type === 'TERS') {
      additionalFilters = {
        $and: [
          { SERVICE_ID: this.serviceid },
          { TERRITORY_ID: this.data['TERRITORY_ID'] },
          this.logtype,
        ],
      };
    } else if (
      this.type === 'B2BM' ||
      this.type === 'B2BBL' ||
      this.type === 'B2B'
    ) {
      additionalFilters = {
        $and: [
          { SERVICE_ID: this.serviceid },
          { CUSTOMER_ID: this.data['CUSTOMER_ID'] },
          this.logtype,
        ],
      };
    } else {
      additionalFilters = {
        $and: [{ SERVICE_ID: this.serviceid }, this.logtype],
      };
    }
    const combineFilters = (baseFilter: any, newFilter: any) => {
      const mergedFilter = { ...baseFilter };
      for (const key in newFilter) {
        if (key === '$and' && Array.isArray(newFilter[key])) {
          if (mergedFilter[key]) {
            mergedFilter[key] = [...mergedFilter[key], ...newFilter[key]];
          } else {
            mergedFilter[key] = [...newFilter[key]];
          }
        } else {
          mergedFilter[key] = newFilter[key];
        }
      }
      return mergedFilter;
    };
    filter = combineFilters(filter, additionalFilters);
    filter = combineFilters(filter, this.filterQuery);
    if (exportInExcel == false) {
      this.loadtable = true;
      this.api
        .getservicelogs(
          this.pageIndextable,
          this.pageSizetable,
          this.sortKeytable,
          sort,
          filter,
          this.searchText,
          [
            'EXPRESS_COST',
            'NAME',
            'CATEGORY_NAME',
            'SUB_CATEGORY_NAME',
            'VENDOR_COST',
            'TECHNICIAN_COST',
            'B2C_PRICE',
            'B2B_PRIC',
            'LOG_TEXT',
            'ADDED_BY',
          ]
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadtable = false;
              this.TabId = data['TAB_ID'];
              this.totalREcordTable = data['count'];
              this.datalistforTable = data['data'];
            } else if (data['code'] == 400) {
              this.totalREcordTable = 0;
              this.loadtable = false;
              this.datalistforTable = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.totalREcordTable = 0;
              this.loadtable = false;
              this.datalistforTable = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.totalREcordTable = 0;
            this.loadtable = false;
            this.datalistforTable = [];
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
      this.exportLoading = true;
      this.loadingRecords = true;
      this.api
        .getservicelogs(
          this.pageIndex,
          this.pageSizetable,
          this.sortKey,
          sort,
          filter,
          this.searchText,
          [
            'EXPRESS_COST',
            'NAME',
            'CATEGORY_NAME',
            'SUB_CATEGORY_NAME',
            'VENDOR_COST',
            'TECHNICIAN_COST',
            'B2C_PRICE',
            'B2B_PRICE',
            'LOG_TEXT',
            'ADDED_BY',
          ]
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
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: any; 
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  drawerTitle: string;
  isFilterApplied: boolean = false;
  filterloading: boolean = false;
  filterQuery: any;
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
        ` AND TAB_ID = '${this.TabId}' AND USER_ID = ${this.USER_ID}`
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
  isDeleting: boolean = false;
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
            this.searchTable(true);
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
  selectedFilter: string | null = null;
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.searchTable();
  }
  applyfilter(item) {
    try {
      if (item.FILTER_QUERY && item.FILTER_QUERY !== '[object Object]') {
        this.filterQuery = JSON.parse(item.FILTER_QUERY); 
      } else {
        this.filterQuery = {}; 
      }
    } catch (error) {
      this.filterQuery = {}; 
    }
    sessionStorage.setItem('ID', item.ID);
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.searchTable(true);
  }
  toggleLiveDemo(item): void {
    this.selectedQuery = item.SHOW_QUERY;
    this.isModalVisible = true; 
  }
  applyCondition: any;
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
  filterData: any;
  openfilter() {
    this.drawerTitle = 'View Service Logs Filter';
    this.applyCondition = '';
    this.filterFields[3]['options'] = this.categoryData;
    this.filterFields[4]['options'] = this.subcategoryData;
    this.drawerFilterVisible = true;
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
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[3]['options'] = this.categoryData;
    this.filterFields[4]['options'] = this.subcategoryData;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  drawerfilterClose(buttontype, updateButton): void {
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
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'LOG_DATE_TIME',
      label: 'Log Created Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Log Created Date',
    },
    {
      key: 'ADDED_BY',
      label: 'Service Modified By',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Modified By Name',
    },
    {
      key: 'LOG_TEXT',
      label: 'Log Text',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Log Text',
    },
    {
      key: 'CATEGORY_NAME',
      label: 'Category',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Enter Category',
    },
    {
      key: 'SUB_CATEGORY_NAME',
      label: 'Sub Category',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sub Category Name',
    },
    {
      key: 'NAME',
      label: 'Service Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Service Name',
    },
    {
      key: 'SERVICE_TYPE',
      label: 'Service Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'B2B', value: 'B' },
        { display: 'B2C', value: 'C' },
        { display: 'Both B2B and B2C', value: 'O' },
      ],
      placeholder: 'Select Service Type',
    },
    {
      key: 'B2B_PRICE',
      label: 'B2B Price (₹)',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2B Price (₹)',
    },
    {
      key: 'B2C_PRICE',
      label: 'B2C Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2C Price (₹)',
    },
    {
      key: 'TECHNICIAN_COST',
      label: 'Technician Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Cost (₹)',
    },
    {
      key: 'VENDOR_COST',
      label: 'Vendor Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Vendor Cost (₹)',
    },
    {
      key: 'IS_EXPRESS',
      label: 'Is Express ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Express ?',
    },
    {
      key: 'EXPRESS_COST',
      label: 'Express Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Express Cost (₹)',
    },
    {
      key: 'QTY',
      label: 'Quantity',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Quantity',
    },
    {
      key: 'MAX_QTY',
      label: 'Max Quantity',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Max Quantity',
    },
    {
      key: 'HSN_CODE',
      label: 'Hsn Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Hsn Code',
    },
    {
      key: 'TAX_NAME',
      label: 'Tax Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Tax Name',
    },
    {
      key: 'UNIT_NAME',
      label: 'Unit Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Unit Name',
    },
    {
      key: 'DURATION_HOUR',
      label: 'Service Duration Hours',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Select Service Duration Hours',
    },
    {
      key: 'PREPARATION_HOURS',
      label: 'Service Prepration Hours',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Select Service Prepration Hours',
    },
    {
      key: 'START_TIME',
      label: 'Start Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Select Start Time',
    },
    {
      key: 'END_TIME',
      label: 'End Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Select End Time',
    },
    {
      key: 'IS_JOB_CREATED_DIRECTLY',
      label: 'Is job Created Directly?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is job Created Directly ?',
    },
    {
      key: 'IS_PARENT',
      label: 'Is Having Sub Service?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Having Sub Service ?',
    },
    {
      key: 'IS_NEW',
      label: 'Is New?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is New ?',
    },
    {
      key: 'WARRANTY_ALLOWED',
      label: 'Is Warranty Allowed?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Warranty Allowed ?',
    },
    {
      key: 'GUARANTEE_ALLOWED',
      label: 'Is Gurantee Allowed?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Gurantee Allowed ?',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Status',
    },
  ];
  LogDateVisible;
  isLogDateFilterApplied: boolean = false;
  selectedLogDate: any;
  ServiceModByVisible;
  isServiceModVisibleFilterApplied: boolean = false;
  ServiceModBytext: string = '';
  LogTextVisible;
  isLogTextVisibleFilterApplied: boolean = false;
  Logtext: string = '';
  CategoryVisible;
  isCategoryVisibleFilterApplied: boolean = false;
  SubCategoryVisible;
  isSubCategoryVisibleFilterApplied: boolean = false;
  ServiceNameVisible;
  isServiceNameFilterApplied: boolean = false;
  nametext: string = '';
  hsncodeVisible;
  ishsncodeFilterApplied: boolean = false;
  hsncodetext: string = '';
  taxnameVisible;
  isTaxNameFilterApplied: boolean = false;
  taxnametext: string = '';
  unitnameVisible;
  isUnitNameFilterApplied: boolean = false;
  unitnametext: string = '';
  warperiodVisible;
  iswarperiodFilterApplied: boolean = false;
  wranteetext: string = '';
  guranteeVisible;
  isguranteeFilterApplied: boolean = false;
  guranteetext: string = '';
  ServiceTypeVisible;
  isServiceTypeFilterApplied: boolean = false;
  B2BVisible;
  isB2BFilterApplied: boolean = false;
  B2Btext: string = '';
  B2CVisible;
  isB2CFilterApplied: boolean = false;
  B2Ctext: string = '';
  TechnicalCostVisible;
  isTechnicalCostFilterApplied: boolean = false;
  TechnicianCosttext: string = '';
  VendorCostVisible;
  isVendorCostFilterApplied: boolean = false;
  VendorCosttext: string = '';
  IsExpressVisible;
  isExpressFilterApplied: boolean = false;
  ExpressCosttext: string = '';
  ExpressCostVisible;
  isExpressCostFilterApplied: boolean = false;
  ExpCosttext: string = '';
  QtyVisible;
  isQtyFilterApplied: boolean = false;
  Qtytext: string = '';
  MaxQtyVisible;
  isMaxQtyFilterApplied: boolean = false;
  MaxQtytext: string = '';
  PrepHoursVisible;
  isPrepHoursFilterApplied: boolean = false;
  PrepHourstext: string = '';
  ServiceDurationVisible;
  isServiceDurationFilterApplied: boolean = false;
  Durationtext: string = '';
  StartTimeVisible;
  isStartTimeFilterApplied: boolean = false;
  StartTimetext: string = '';
  EndTimeVisible;
  isEndTimeFilterApplied: boolean = false;
  EndTimetext: string = '';
  JobCreatedVisible;
  isJobCreatedFilterApplied: boolean = false;
  JobCreatedtext: string = '';
  IsParentVisible;
  isParentFilterApplied: boolean = false;
  IsParenttext: string = '';
  IsNewVisible;
  isNewFilterApplied: boolean = false;
  IsNewtext: string = '';
  StatusVisible;
  isStatusFilterApplied: boolean = false;
  CustTypeFilter: string | undefined = undefined;
  listofCustType: any[] = [
    { text: 'Individiual', value: 'I' },
    { text: 'Business', value: 'B' },
  ];
  onCustTypeFilterChange(selectedStatus: string) {
    this.CustTypeFilter = selectedStatus;
    this.searchTable(true);
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  onKeyup(keys: any, type: string): void {
    const element = window.document.getElementById('button');
    if (
      type == 'servicemodby' &&
      this.ServiceModBytext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isServiceModVisibleFilterApplied = true;
    } else if (
      type == 'servicemodby' &&
      this.ServiceModBytext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isServiceModVisibleFilterApplied = false;
    }
    if (type == 'logtext' && this.Logtext.length >= 3 && keys.key === 'Enter') {
      this.searchTable();
      this.isLogTextVisibleFilterApplied = true;
    } else if (
      type == 'logtext' &&
      this.Logtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isLogTextVisibleFilterApplied = false;
    }
    if (
      type == 'taxname' &&
      this.taxnametext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isTaxNameFilterApplied = true;
    } else if (
      type == 'taxname' &&
      this.taxnametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isTaxNameFilterApplied = false;
    }
    if (
      type == 'unitame' &&
      this.unitnametext.length >= 3 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isUnitNameFilterApplied = true;
    } else if (
      type == 'unitame' &&
      this.unitnametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isUnitNameFilterApplied = false;
    }
    if (
      type == 'gurantee' &&
      this.guranteetext.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isguranteeFilterApplied = true;
    } else if (
      type == 'gurantee' &&
      this.guranteetext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isguranteeFilterApplied = false;
    }
    if (
      type == 'warranty' &&
      this.wranteetext.length > 0 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.iswarperiodFilterApplied = true;
    } else if (
      type == 'warranty' &&
      this.wranteetext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.iswarperiodFilterApplied = false;
    }
    if (type == 'name' && this.nametext.length >= 3 && keys.key === 'Enter') {
      this.searchTable();
      this.isServiceNameFilterApplied = true;
    } else if (
      type == 'name' &&
      this.nametext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isServiceNameFilterApplied = false;
    }
    if (
      type == 'hsncode' &&
      this.hsncodetext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.ishsncodeFilterApplied = true;
    } else if (
      type == 'hsncode' &&
      this.hsncodetext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.ishsncodeFilterApplied = false;
    }
    if (type == 'b2b' && this.B2Btext.length >= 1 && keys.key === 'Enter') {
      this.searchTable();
      this.isB2BFilterApplied = true;
    } else if (
      type == 'b2b' &&
      this.B2Btext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isB2BFilterApplied = false;
    }
    if (type == 'b2c' && this.B2Ctext.length >= 1 && keys.key === 'Enter') {
      this.searchTable();
      this.isB2CFilterApplied = true;
    } else if (
      type == 'b2c' &&
      this.B2Ctext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isB2CFilterApplied = false;
    }
    if (
      type == 'technicianprice' &&
      this.TechnicianCosttext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isTechnicalCostFilterApplied = true;
    } else if (
      type == 'technicianprice' &&
      this.TechnicianCosttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isTechnicalCostFilterApplied = false;
    }
    if (
      type == 'vendorprice' &&
      this.VendorCosttext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isVendorCostFilterApplied = true;
    } else if (
      type == 'vendorprice' &&
      this.VendorCosttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isVendorCostFilterApplied = false;
    }
    if (
      type == 'expcost' &&
      this.ExpCosttext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isFilterApplied = true;
    } else if (
      type == 'expcost' &&
      this.ExpCosttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isFilterApplied = false;
    }
    if (type == 'qty' && this.Qtytext.length >= 1 && keys.key === 'Enter') {
      this.searchTable();
      this.isQtyFilterApplied = true;
    } else if (
      type == 'qty' &&
      this.Qtytext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isQtyFilterApplied = false;
    }
    if (
      type == 'maxqty' &&
      this.MaxQtytext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isMaxQtyFilterApplied = true;
    } else if (
      type == 'maxqty' &&
      this.MaxQtytext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isMaxQtyFilterApplied = false;
    }
    if (
      type == 'prephours' &&
      this.PrepHourstext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isPrepHoursFilterApplied = true;
    } else if (
      type == 'prephours' &&
      this.PrepHourstext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isPrepHoursFilterApplied = false;
    }
    if (
      type == 'serviceduration' &&
      this.Durationtext.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();
      this.isServiceDurationFilterApplied = true;
    } else if (
      type == 'serviceduration' &&
      this.Durationtext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isServiceDurationFilterApplied = false;
    }
  }
  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.searchTable();
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.searchTable();
    }
  }
  reset(): void {
    this.searchText = '';
    this.ServiceModBytext = '';
    this.Logtext = '';
    this.nametext = '';
    this.B2Btext = '';
    this.B2Ctext = '';
    this.TechnicianCosttext = '';
    this.VendorCosttext = '';
    this.ExpCosttext = '';
    this.MaxQtytext = '';
    this.Qtytext = '';
    this.PrepHourstext = '';
    this.Durationminutes = '';
    this.Durationhours = '';
    this.hsncodetext = '';
    this.taxnametext = '';
    this.unitnametext = '';
    this.wranteetext = '';
    this.guranteetext = '';
    this.searchTable();
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.searchTable(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  categoryData: any = [];
  getCategoryData() {
    this.api
      .getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.categoryData.push({
                value: element.NAME,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  onCategoryChange(): void {
    this.searchTable();
  }
  subcategoryData: any = [];
  getSubCategoryData() {
    this.api
      .getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.subcategoryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  onFilterClick(columnKey: string): void {
    this.api
      .getDistinctData1('678c8276d5fa6d645850e972', columnKey, true, '')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.distinctData = data['data'];
          } else {
            this.distinctData = [];
            this.message.error('Failed To Get Distinct data Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  onSubCategoryChange(): void {
    this.searchTable();
  }
  onLogDateangeChange() {
    if (this.selectedLogDate && this.selectedLogDate.length === 2) {
      const [start, end] = this.selectedLogDate;
      if (start && end) {
        this.searchTable();
        this.isLogDateFilterApplied = true;
      }
    } else {
      this.selectedLogDate = null; 
      this.searchTable();
      this.isLogDateFilterApplied = false;
    }
  }
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
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;
      this.isStartTimeFilterApplied = true;
    } else {
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isStartTimeFilterApplied = false;
    }
    this.searchTable();
  }
  endfromTime: any;
  endtoTime: any;
  endfromTime1;
  endtoTime1;
  fromTime: any;
  toTime: any;
  startfromTime;
  starttoTime;
  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
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
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;
      this.isEndTimeFilterApplied = true;
    } else {
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isEndTimeFilterApplied = false;
    }
    this.searchTable();
  }
  formatTime(time: string): string {
    if (time && /^[0-9]{2}:[0-9]{2}(?::[0-9]{2})?$/.test(time)) {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; 
      return `${this.padZero(hour12)}:${this.padZero(minutes)} ${period}`;
    }
    return '';
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfServiceTypeFilter: any[] = [
    { text: 'B2B', value: 'B' },
    { text: 'B2C', value: 'C' },
    { text: 'Both B2B and B2C', value: 'O' },
  ];
  listOfJobCreatedFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfSubServiceFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfNewFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfwarantyFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfguranteeFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  listOfExpressFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  importInExcel() {
    this.searchTable(true, true);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Log Datetime'] = this.excelData[i]['LOG_DATE_TIME'];
        obj1['Service Modified By'] = this.excelData[i]['ADDED_BY'];
        obj1['Log Text'] = this.excelData[i]['LOG_TEXT'];
        obj1['Category'] = this.excelData[i]['CATEGORY_NAME'];
        obj1['Sub Category'] = this.excelData[i]['SUB_CATEGORY_NAME'];
        obj1['Service Name'] = this.excelData[i]['NAME'];
        if (this.excelData[i]['SERVICE_TYPE'] == 'B') {
          obj1['Service Type'] = 'B2B';
        } else if (this.excelData[i]['SERVICE_TYPE'] == 'C') {
          obj1['Service Type'] = 'B2C';
        } else if (this.excelData[i]['SERVICE_TYPE'] == 'O') {
          obj1['Service Type'] = 'Both B2B & B2C';
        }
        obj1['B2B Price(₹)'] = this.excelData[i]['B2B_PRICE'];
        obj1['B2C Price(₹)'] = this.excelData[i]['B2C_PRICE'];
        obj1['Technician Cost (₹)'] = this.excelData[i]['TECHNICIAN_COST'];
        obj1['Vendor Cost (₹)'] = this.excelData[i]['VENDOR_COST'];
        if (this.excelData[i]['IS_EXPRESS'] == '1') {
          obj1['Is Express?'] = 'Yes';
        } else if (this.excelData[i]['IS_EXPRESS'] == '0') {
          obj1['Is Express?'] = 'No';
        }
        obj1['Express Cost(₹)'] = this.excelData[i]['EXPRESS_COST'];
        obj1['Quantity'] = this.excelData[i]['QTY'];
        obj1['Max Quantity Per Order'] = this.excelData[i]['MAX_QTY'];
        obj1['Service Duration Time'] = this.excelData[i]['DURATION_HOUR'];
        obj1['Service Preparation Time'] =
          this.excelData[i]['PREPARATION_HOURS'];
        obj1['Service Start Time (Mins)'] = this.excelData[i]['START_TIME'];
        obj1['Service End Time (Mins)'] = this.excelData[i]['END_TIME'];
        if (this.excelData[i]['IS_JOB_CREATED_DIRECTLY'] == '1') {
          obj1['Is Job Created Directly?'] = 'Yes';
        } else if (this.excelData[i]['IS_JOB_CREATED_DIRECTLY'] == '0') {
          obj1['Is Job Created Directly?'] = 'No';
        }
        if (this.excelData[i]['IS_PARENT'] == '1') {
          obj1['Is Having Sub Service?'] = 'Yes';
        } else if (this.excelData[i]['IS_PARENT'] == '0') {
          obj1['Is Having Sub Service?'] = 'No';
        }
        if (this.excelData[i]['IS_NEW'] == '1') {
          obj1['Is New?'] = 'Yes';
        } else if (this.excelData[i]['IS_NEW'] == '0') {
          obj1['Is New?'] = 'No';
        }
        if (this.excelData[i]['WARRANTY_ALLOWED'] == '1') {
          obj1['Is New?'] = 'Yes';
        } else if (this.excelData[i]['WARRANTY_ALLOWED'] == '0') {
          obj1['Is New?'] = 'No';
        }
        if (this.excelData[i]['GUARANTEE_ALLOWED'] == '1') {
          obj1['Is New?'] = 'Yes';
        } else if (this.excelData[i]['GUARANTEE_ALLOWED'] == '0') {
          obj1['Is New?'] = 'No';
        }
        if (this.excelData[i]['STATUS'] == '1') {
          obj1['Status'] = 'Active';
        } else if (this.excelData[i]['STATUS'] == '0') {
          obj1['Status'] = 'Inactive';
        }
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Service Logs Report' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
}