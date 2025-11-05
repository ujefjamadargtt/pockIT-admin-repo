import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
// import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { InventoryMaster } from '../../inventorymodal/inventoryMaster';

@Component({
  selector: 'app-view-itemchage-logs',
  templateUrl: './view-itemchage-logs.component.html',
  styleUrls: ['./view-itemchage-logs.component.css'],
})
export class ViewItemchageLogsComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerData: InventoryMaster = new InventoryMaster();
  searchText1: string = '';
  public commonFunction = new CommonFunctionService();
  currentHour: any = new Date().getHours();
  currentMinute: any = new Date().getMinutes();
  isOk: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'DESC';
  sortKey: string = '';
  isLoading = true;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  excelData: any = [];
  exportLoading: boolean = false;
  isSpinning = false;

  @Input() data: any = InventoryMaster;
  @Input() drawerCloset: any = Function;
  @Input() drawerVisiblet: boolean = false;
  @Input() type: any;
  @Input() serviceid: any;

  columns: string[][] = [
    ['ITEM_NAME', 'Item Name'],
    ['INVENTORY_CATEGORY_NAME', 'Inventory Category'],
    ['INVENTRY_SUB_CATEGORY_NAME', 'Inventory Sub Category'],
    ['BASE_UNIT_NAME', 'Unit'],
    ['BRAND_NAME', 'Brand Name'],
    ['SELLING_PRICE', 'Selling Price'],
    ['DESCRIPTION', 'Description'],
    ['SKU_CODE', 'SKU Code'],
  ];
  loadingRecords = false;
  totalRecords = 0;
  dataList: any = [];
  selectedCategories: number[] = [];
  selectedCategories1: number[] = [];
  selectedCategories2: number[] = [];
  selectedSubCategories: number[] = [];
  selectedSubCategories1: number[] = [];
  selectedSubCategories2: number[] = [];
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
  // Edit Code 3
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
    this.getHSNData();
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
    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  onKeypressEvent(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');

    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.searchTable(true);
    } else if (this.searchText1.length == 0 && keys.key == 'Backspace') {
      // this.dataList = []
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
  serviceTypeFilter1: string | undefined = undefined;
  JobCreatedFilter: string | undefined = undefined;
  SubServiceFilter: string | undefined = undefined;
  NewFilter: string | undefined = undefined;
  ExpressFilter: string | undefined = undefined;
  ExpressFilterexp: string | undefined = undefined;
  ExpressFilterwar: string | undefined = undefined;
  ExpressFilter1: string | undefined = undefined;

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.searchTable(true);
  }

  onServiceTypeFilterChange(selectedStatus: string) {
    this.serviceTypeFilter = selectedStatus;
    this.searchTable(true);
  }

  onServiceTypeFilterChange1(selectedStatus: string) {
    this.serviceTypeFilter1 = selectedStatus;
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

  onExpressFilterChange(selectedStatus: string) {
    this.ExpressFilter = selectedStatus;
    this.searchTable(true);
  }

  onExpressFilterChangeexp(selectedStatus: string) {
    this.ExpressFilterexp = selectedStatus;
    this.searchTable(true);
  }

  onExpressFilterChangewar(selectedStatus: string) {
    this.ExpressFilterwar = selectedStatus;
    this.searchTable(true);
  }

  onExpressFilterChange1(selectedStatus: string) {
    this.ExpressFilter1 = selectedStatus;
    this.searchTable(true);
  }

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
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

    // Global Search (using searchText)
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

        filter.DATE_OF_ENTRY = {
          $gte: formatDate(new Date(start)),
          $lte: formatDate(new Date(end)),
        };
      }
    }

    if (this.ServiceModBytext !== '') {
      filter.AADED_BY = { $regex: this.ServiceModBytext.trim(), $options: 'i' };
      this.isServiceModVisibleFilterApplied = true;
    } else {
      this.isServiceModVisibleFilterApplied = false;
    }

    if (this.Logtext !== '') {
      filter.ACTION_LOG = { $regex: this.Logtext.trim(), $options: 'i' };
      this.isLogTextVisibleFilterApplied = true;
    } else {
      this.isLogTextVisibleFilterApplied = false;
    }

    if (this.nametext !== '') {
      filter.ITEM_NAME = { $regex: this.nametext.trim(), $options: 'i' };
      this.isServiceNameFilterApplied = true;
    } else {
      this.isServiceNameFilterApplied = false;
    }

    if (this.vartext !== '') {
      filter.VARIANT_COMBINATION = {
        $regex: this.vartext.trim(),
        $options: 'i',
      };
      this.isvarNameFilterApplied = true;
    } else {
      this.isvarNameFilterApplied = false;
    }

    // if (this.hsncodetext !== '') {
    //   filter.HSN_CODE = { $regex: this.hsncodetext.trim(), $options: 'i' };
    //   this.ishsncodeFilterApplied = true;
    // } else {
    //   this.ishsncodeFilterApplied = false;
    // }

    if (this.unitnametext1 !== '') {
      filter.GUARANTEE_PERIOD = {
        $in: this.unitnametext1,
      };
      this.isUnitNameFilterApplied1 = true;
    } else {
      this.isUnitNameFilterApplied1 = false;
    }

    if (this.unitnametextwper !== '') {
      filter.WARRANTY_PERIOD = {
        $in: this.unitnametextwper,
      };
      this.isUnitNameFilterAppliedwarper = true;
    } else {
      this.isUnitNameFilterAppliedwarper = false;
    }

    if (this.shorttext !== '') {
      filter.SHORT_CODE = {
        $regex: this.shorttext.trim(),
        $options: 'i',
      };
      this.isshortFilterApplied = true;
    } else {
      this.isshortFilterApplied = false;
    }

    if (this.hsncodetext !== '') {
      filter.SKU_CODE = { $regex: this.hsncodetext.trim(), $options: 'i' };
      this.ishsncodeFilterApplied = true;
    } else {
      this.ishsncodeFilterApplied = false;
    }

    if (this.taxnametext !== '') {
      filter.REORDER_STOCK_LEVEL = {
        $regex: this.taxnametext.trim(),
        $options: 'i',
      };
      this.isTaxNameFilterApplied = true;
    } else {
      this.isTaxNameFilterApplied = false;
    }

    if (this.unitnametext !== '') {
      filter.DISCOUNTED_PRICE = {
        $regex: this.unitnametext.trim(),
        $options: 'i',
      };
      this.isUnitNameFilterApplied = true;
    } else {
      this.isUnitNameFilterApplied = false;
    }

    if (this.B2Btext !== '') {
      filter.BASE_QUANTITY = { $in: this.B2Btext };
      this.isB2BFilterApplied = true;
    } else {
      this.isB2BFilterApplied = false;
    }

    if (this.B2Ctext !== '') {
      filter.BASE_PRICE = { $regex: this.B2Ctext.trim(), $options: 'i' };
      this.isB2CFilterApplied = true;
    } else {
      this.isB2CFilterApplied = false;
    }

    if (this.TechnicianCosttext !== '') {
      filter.SELLING_PRICE = {
        $regex: this.TechnicianCosttext.trim(),
        $options: 'i',
      };
      this.isTechnicalCostFilterApplied = true;
    } else {
      this.isTechnicalCostFilterApplied = false;
    }

    if (this.VendorCosttext !== '') {
      filter.EXPECTED_DELIVERY_IN_DAYS = {
        $in: this.VendorCosttext,
      };
      this.isVendorCostFilterApplied = true;
    } else {
      this.isVendorCostFilterApplied = false;
    }

    if (this.ExpCosttext !== '') {
      filter.ALERT_STOCK_LEVEL = {
        $regex: this.ExpCosttext.trim(),
        $options: 'i',
      };
      this.isExpressCostFilterApplied = true;
    } else {
      this.isExpressCostFilterApplied = false;
    }

    if (this.Qtytext !== '') {
      filter.AVG_LEVEL = { $regex: this.Qtytext.trim(), $options: 'i' };
      this.isQtyFilterApplied = true;
    } else {
      this.isQtyFilterApplied = false;
    }

    if (this.MaxQtytext !== '') {
      filter.DESCRIPTION = { $regex: this.MaxQtytext.trim(), $options: 'i' };
      this.isMaxQtyFilterApplied = true;
    } else {
      this.isMaxQtyFilterApplied = false;
    }

    if (this.statusFilter) {
      filter.STATUS = this.statusFilter;
    }

    if (this.JobCreatedFilter) {
      filter.TAX_PREFERENCE = this.JobCreatedFilter;
    }

    if (this.SubServiceFilter) {
      filter.IS_HAVE_VARIANTS = this.SubServiceFilter;
    }

    if (this.ExpressFilter) {
      filter.DISCOUNT_ALLOWED = this.ExpressFilter;
    }

    if (this.ExpressFilterexp) {
      filter.EXPIRY_DATE_ALLOWED = this.ExpressFilterexp;
    }

    if (this.ExpressFilterwar) {
      filter.WARRANTY_ALLOWED = this.ExpressFilterwar;
    }

    if (this.ExpressFilter1) {
      filter.GUARANTEE_ALLOWED = this.ExpressFilter1;
    }

    if (this.NewFilter) {
      filter.IS_NEW = this.NewFilter;
    }

    if (this.serviceTypeFilter) {
      filter.INVENTORY_TYPE = this.serviceTypeFilter;
    }

    if (this.serviceTypeFilter1) {
      filter.INVENTORY_TRACKING_TYPE = this.serviceTypeFilter1;
    }

    // Category Filter
    if (this.selectedCategories.length > 0) {
      filter.INVENTORY_CATEGORY_NAME = { $in: this.selectedCategories };
    }

    if (this.selectedCategories1.length > 0) {
      filter.BRAND_NAME = { $in: this.selectedCategories1 };
    }

    if (this.selectedCategories2.length > 0) {
      filter.BASE_UNIT_NAME = { $in: this.selectedCategories2 };
    }
    // Subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      filter.INVENTRY_SUB_CATEGORY_NAME = { $in: this.selectedSubCategories };
    }

    if (this.selectedSubCategories1.length > 0) {
      filter.TAX_NAME = {
        $in: this.selectedSubCategories1,
      };
    }
    if (this.selectedSubCategories2.length > 0) {
      filter.HSN_NAME = { $in: this.selectedSubCategories2 };
    }
    var additionalFilters: any = {};

    additionalFilters = {
      ITEM_ID: this.serviceid,
    };

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

    // Combine filters
    filter = combineFilters(filter, additionalFilters);
    filter = combineFilters(filter, this.filterQuery);
    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .getItemlogs(
          this.pageIndextable,
          this.pageSizetable,
          this.sortKeytable,
          sort,
          filter,
          this.searchText,
          [
            'ITEM_NAME',
            'INVENTORY_CATEGORY_NAME',
            'INVENTRY_SUB_CATEGORY_NAME',
            'ACTION_LOG',
            'AADED_BY',
            'DESCRIPTION',
            'VARIANT_COMBINATION',
            'BASE_UNIT_NAME',
            'BRAND_NAME',
            'HSN_NAME',
            'BASE_PRICE',
            'SELLING_PRICE',
            'TAX_NAME',
            'SKU_CODE',
            'DISCOUNTED_PRICE',
            'SHORT_CODE',
          ]
        )
        .subscribe(
          (data) => {
            if (data['count'] > 0) {
              this.loadtable = false;
              this.TabId = data['TAB_ID'];
              this.totalREcordTable = data['count'];
              this.datalistforTable = data['data'];
              this.loadingRecords = false;
            } else {
              this.totalREcordTable = 0;
              this.loadtable = false;
              this.datalistforTable = [];
              this.loadingRecords = false;
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
              this.loadingRecords = false;
            } else {
              this.message.error('Something Went Wrong.', '');
              this.loadingRecords = false;
            }
          }
        );
    } else {
      this.exportLoading = true;
      this.loadingRecords = true;

      this.api
        .getItemlogs(
          this.pageIndex,
          this.pageSizetable,
          this.sortKey,
          sort,
          // likeQuery + this.filterQuery
          filter,
          this.searchText,
          [
            'ITEM_NAME',
            'INVENTORY_CATEGORY_NAME',
            'INVENTRY_SUB_CATEGORY_NAME',
            'ACTION_LOG',
            'AADED_BY',
            'DESCRIPTION',
            'VARIANT_COMBINATION',
            'BASE_UNIT_NAME',
            'BRAND_NAME',
            'HSN_NAME',
            'BASE_PRICE',
            'SELLING_PRICE',
            'TAX_NAME',
            'SKU_CODE',
            'DISCOUNTED_PRICE',
            'SHORT_CODE',
          ]
        )
        .subscribe(
          (data) => {
            if (data['count'] > 0) {
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

  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: any; // Ensure TabId is defined and initialized
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  drawerTitle: string;
  isFilterApplied: boolean = false;
  filterloading: boolean = false;
  filterQuery: any;
  whichbutton: any;
  // filterloading: boolean = false;
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
      ) // Use USER_ID as a number
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
            // else if (this.whichbutton == 'SA') {
            //   this.applyfilter(this.savedFilters[0]);
            // }

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
      // Try to parse FILTER_QUERY if it's a valid JSON string
      if (item.FILTER_QUERY && item.FILTER_QUERY !== '[object Object]') {
        this.filterQuery = JSON.parse(item.FILTER_QUERY); // Should be a valid filter object
      } else {
        this.filterQuery = {}; // Default to empty object if invalid format
      }
    } catch (error) {
      this.filterQuery = {}; // Set to empty object in case of error
    }
    sessionStorage.setItem('ID', item.ID);

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    // this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.searchTable(true);
  }

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }
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
  // currentClientId = 1;
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'View Inventory Logs Filter';
    this.applyCondition = '';
    this.filterFields[3]['options'] = this.categoryData;
    this.filterFields[4]['options'] = this.subcategoryData;
    this.filterFields[10]['options'] = this.branddata;
    this.filterFields[12]['options'] = this.unitdata;
    this.filterFields[16]['options'] = this.taxdata;
    this.filterFields[18]['options'] = this.hsndata;
    this.drawerFilterVisible = true;
    // Edit code 2

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

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  hsndata: any = [];
  unitdata: any = [];
  branddata: any = [];
  taxdata: any = [];
  getHSNData() {
    this.api
      .getAllHSNSAC(0, 0, 'ID', 'desc', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data.code == 200) {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.hsndata.push({
                value: element.ID,
                display: element.CODE,
              });
            });
          }
        } else {
          this.hsndata = [];
        }
      });

    this.api
      .getUnitData(0, 0, 'id', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.unitdata.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });

    this.api
      .getAllInventoryBrand(0, 0, 'ID', 'desc', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data.body['count'] > 0) {
            data.body['data'].forEach((element) => {
              this.branddata.push({
                value: element.ID,
                display: element.BRAND_NAME,
              });
            });
          }
        } else {
          this.branddata = [];
        }
      });

    this.api
      .getTaxData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data.code == 200) {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.taxdata.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        } else {
          this.taxdata = [];
        }
      });
  }
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[3]['options'] = this.categoryData;
    this.filterFields[4]['options'] = this.subcategoryData;
    this.filterFields[10]['options'] = this.branddata;
    this.filterFields[12]['options'] = this.unitdata;
    this.filterFields[16]['options'] = this.taxdata;
    this.filterFields[18]['options'] = this.hsndata;
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
      key: 'DATE_OF_ENTRY',
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
      key: 'AADED_BY',
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
      key: 'ACTION_LOG',
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
      key: 'INVENTORY_CATEGORY_NAME',
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
      placeholder: 'Enter Category Name',
    },

    {
      key: 'INVENTRY_SUB_CATEGORY_NAME',
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
      key: 'ITEM_NAME',
      label: 'Inventory Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Inventory Name',
    },
    {
      key: 'VARIANT_COMBINATION',
      label: 'Variant Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Variant Name',
    },
    {
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Description',
    },
    {
      key: 'INVENTORY_TYPE',
      label: 'Inventory Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Both Sellable & Technician Parts', value: 'B' },
        { display: 'Sellable Inventory', value: 'P' },
        { display: 'Technician Parts Only', value: 'S' },
      ],
      placeholder: 'Select Inventory Type',
    },
    {
      key: 'INVENTORY_TRACKING_TYPE',
      label: 'Inventory Tracking Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'None', value: 'N' },
        { display: 'Serial No. Wise', value: 'S' },
        { display: 'Batch Wise', value: 'B' },
      ],
      placeholder: 'Select Inventory Tracking Type',
    },
    {
      key: 'BRAND_NAME',
      label: 'Brand Name',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Brand Name',
    },
    {
      key: 'BASE_QUANTITY',
      label: 'Base Quantity',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Base Quantity',
    },
    {
      key: 'BASE_UNIT_NAME',
      label: 'Base Unit Name',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Base Unit Name',
    },
    {
      key: 'BASE_PRICE',
      label: 'Base Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Base Price (₹)',
    },
    {
      key: 'SELLING_PRICE',
      label: 'Selling Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Selling Price (₹)',
    },
    {
      key: 'TAX_PREFERENCE',
      label: 'Tax Preference',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'T', display: 'Taxable' },
        { value: 'NT', display: 'Non Taxable' },
      ],
      placeholder: 'Tax Preference',
    },
    {
      key: 'TAX_NAME',
      label: 'Tax Name',
      type: 'search',
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
      key: 'IS_HAVE_VARIANTS',
      label: 'Is Having Variants?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Is Having Variants ?',
    },
    {
      key: 'HSN_NAME',
      label: 'Hsn Code',
      type: 'search',
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
      key: 'SKU_CODE',
      label: 'SKU Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter SKU Code',
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
      key: 'EXPECTED_DELIVERY_IN_DAYS',
      label: 'Expected Delivery In Days',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        // { value: 'Contains', display: 'Contains' },
        // { value: 'Does Not Contains', display: 'Does Not Contains' },
        // { value: 'Starts With', display: 'Starts With' },
        // { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Expected Delivery In Days',
    },
    {
      key: 'ALERT_STOCK_LEVEL',
      label: 'Alert Stock Level',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Alert Stock Level',
    },
    {
      key: 'AVG_LEVEL',
      label: 'Average Level',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Average Level',
    },
    {
      key: 'REORDER_STOCK_LEVEL',
      label: 'Reordered Stock Level',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Reordered Stock Level',
    },
    {
      key: 'DISCOUNT_ALLOWED',
      label: 'Discount Allowed ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Discount Allowed ?',
    },
    // {
    //   key: 'DISCOUNTED_PERCENTAGE',
    //   label: 'Discount Percentage',
    //   type: 'text',
    //   comparators: [
    //     { value: '=', display: 'Equal To' },
    //     { value: '!=', display: 'Not Equal To' },
    //     { value: 'Contains', display: 'Contains' },
    //     { value: 'Does Not Contains', display: 'Does Not Contains' },
    //     { value: 'Starts With', display: 'Starts With' },
    //     { value: 'Ends With', display: 'Ends With' },
    //   ],
    //   placeholder: 'Enter Discount Percentage',
    // },
    {
      key: 'DISCOUNTED_PRICE',
      label: 'Discount Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Discount Price (₹)',
    },
    {
      key: 'GUARANTEE_ALLOWED',
      label: 'Guarantee Allowed ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Guarantee Allowed ?',
    },
    {
      key: 'GUARANTEE_PERIOD',
      label: 'Guarantee Period',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        // { value: 'Contains', display: 'Contains' },
        // { value: 'Does Not Contains', display: 'Does Not Contains' },
        // { value: 'Starts With', display: 'Starts With' },
        // { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Guarantee Period',
    },
    {
      key: 'EXPIRY_DATE_ALLOWED',
      label: 'Expiry Date Allowed ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Expiry Date Allowed ?',
    },
    {
      key: 'WARRANTY_ALLOWED',
      label: 'Warranty Allowed ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Yes' },
        { value: '0', display: 'No' },
      ],
      placeholder: 'Warranty Allowed ?',
    },

    {
      key: 'WARRANTY_PERIOD',
      label: 'Warranty Period',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        // { value: 'Contains', display: 'Contains' },
        // { value: 'Does Not Contains', display: 'Does Not Contains' },
        // { value: 'Starts With', display: 'Starts With' },
        // { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Warranty Period',
    },
    {
      key: 'SHORT_CODE',
      label: 'Short Code',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Short Code',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Status',
    },
  ];

  // filters
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

  CategoryVisible1;
  isCategoryVisibleFilterApplied1: boolean = false;

  CategoryVisible2;
  isCategoryVisibleFilterApplied2: boolean = false;

  SubCategoryVisible;
  isSubCategoryVisibleFilterApplied: boolean = false;

  SubCategoryVisible1;
  isSubCategoryVisibleFilterApplied1: boolean = false;

  SubCategoryVisible2;
  isSubCategoryVisibleFilterApplied2: boolean = false;

  ServiceNameVisible;
  isServiceNameFilterApplied: boolean = false;
  nametext: string = '';

  varNameVisible;
  isvarNameFilterApplied: boolean = false;
  vartext: string = '';

  hsncodeVisible;
  ishsncodeFilterApplied: boolean = false;
  hsncodetext: string = '';

  taxnameVisible;
  isTaxNameFilterApplied: boolean = false;
  taxnametext: string = '';

  unitnameVisible;
  isUnitNameFilterApplied: boolean = false;
  unitnametext: string = '';

  unitnameVisible1;
  isUnitNameFilterApplied1: boolean = false;
  unitnametext1: string = '';

  unitnameVisiblewarper;
  isUnitNameFilterAppliedwarper: boolean = false;
  unitnametextwper: string = '';

  shortvisible;
  isshortFilterApplied: boolean = false;
  shorttext: string = '';

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
    // this.search(true);
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
      this.taxnametext.length >= 1 &&
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
      this.unitnametext.length >= 1 &&
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
      type == 'unitame1' &&
      this.unitnametext1.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();

      this.isUnitNameFilterApplied1 = true;
    } else if (
      type == 'unitame1' &&
      this.unitnametext1.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();

      this.isUnitNameFilterApplied1 = false;
    }

    if (
      type == 'unitamewper' &&
      this.unitnametextwper.length >= 1 &&
      keys.key === 'Enter'
    ) {
      this.searchTable();

      this.isUnitNameFilterAppliedwarper = true;
    } else if (
      type == 'unitamewper' &&
      this.unitnametextwper.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();

      this.isUnitNameFilterAppliedwarper = false;
    }

    if (type == 'short' && this.shorttext.length >= 3 && keys.key === 'Enter') {
      this.searchTable();

      this.isshortFilterApplied = true;
    } else if (
      type == 'short' &&
      this.shorttext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();

      this.isshortFilterApplied = false;
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

    if (type == 'varname' && this.vartext.length >= 3 && keys.key === 'Enter') {
      this.searchTable();
      this.isvarNameFilterApplied = true;
    } else if (
      type == 'varname' &&
      this.vartext.length == 0 &&
      keys.key === 'Backspace'
    ) {
      this.searchTable();
      this.isvarNameFilterApplied = false;
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
      this.MaxQtytext.length >= 3 &&
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
  }
  keyup(keys) {
    // if (this.searchText.length >= 3) {
    //   this.search();
    // } else if (this.searchText.length == 0) {
    //   this.search();
    // }

    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.searchTable(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.searchTable(true);
    }
  }
  reset(): void {
    this.searchText = '';
    this.ServiceModBytext = '';
    this.Logtext = '';
    this.nametext = '';
    this.vartext = '';

    this.B2Btext = '';
    this.B2Ctext = '';
    this.TechnicianCosttext = '';
    this.VendorCosttext = '';
    this.ExpCosttext = '';
    this.MaxQtytext = '';
    this.Qtytext = '';

    this.hsncodetext = '';
    this.taxnametext = '';
    this.unitnametext = '';
    this.unitnametext1 = '';
    this.unitnametextwper = '';
    this.shorttext = '';

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
      .getInventoryCategory(0, 0, 'ID', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.categoryData.push({
                value: element.ID,
                display: element.CATEGORY_NAME,
              });
            });
          }
        }
      });
  }

  onCategoryChange(): void {
    this.searchTable();
  }

  onCategoryChange1(): void {
    this.searchTable();
  }
  onCategoryChange2(): void {
    this.searchTable();
  }
  subcategoryData: any = [];
  getSubCategoryData() {
    this.api
      .getInventorySubCategory(0, 0, 'ID', 'asc', ' AND IS_ACTIVE = 1')
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
      .getDistinctData1('67ce938026fe415bc5612796', columnKey, true, '')
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
  onSubCategoryChange1(): void {
    this.searchTable();
  }
  onSubCategoryChange2(): void {
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
      this.selectedLogDate = null; // or [] if you prefer
      this.searchTable();
      this.isLogDateFilterApplied = false;
    }
  }

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  listOfServiceTypeFilter: any[] = [
    { text: 'Both Sellable & Technician Parts', value: 'B' },
    { text: 'Sellable Inventory', value: 'P' },
    { text: 'Technician Parts Only', value: 'S' },
  ];

  listOfServiceTypeFilter1: any[] = [
    { text: 'None', value: 'N' },
    { text: 'Serial No. Wise', value: 'S' },
    { text: 'Batch Wise', value: 'B' },
  ];

  listOfJobCreatedFilter: any[] = [
    { text: 'Taxable', value: 'T' },
    { text: 'Non Taxable', value: 'NT' },
  ];

  listOfSubServiceFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfNewFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfExpressFilter: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfExpressFilter1: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfExpressFilterexp: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];

  listOfExpressFilterwar: any[] = [
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
        obj1['Log Datetime'] = this.excelData[i]['DATE_OF_ENTRY'];
        obj1['Service Modified By'] = this.excelData[i]['AADED_BY'];
        obj1['Log Text'] = this.excelData[i]['ACTION_LOG'];
        obj1['Category'] = this.excelData[i]['INVENTRY_CATEGORY_NAME'];
        obj1['Sub Category'] = this.excelData[i]['INVENTRY_SUB_CATEGORY_NAME'];
        obj1['Service Name'] = this.excelData[i]['ITEM_NAME'];
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
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }
}