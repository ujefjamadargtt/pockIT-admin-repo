import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { InventoryInwardMasterData } from 'src/app/Inventorypages/inventorymodal/inventoryInwardMasterData';
@Component({
  selector: 'app-inventory-inward-list',
  templateUrl: './inventory-inward-list.component.html',
  styleUrls: ['./inventory-inward-list.component.css'],
})
export class InventoryInwardListComponent implements OnInit {
  formTitle = 'Manage Inventory Stock Check-In';
  pageIndex = 1;
  pageSize = 10;
  inventoryForm: any = '75%';
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  PONoVisible: boolean = false;
  InwardNoVisible: boolean = false;
  warehouseNameVisible: boolean = false;
  unitsvisible: boolean = false;
  qtyvisible: boolean = false;
  purchasepricevisible: boolean = false;
  sellingpricevisible: boolean = false;
  locationvisible: boolean = false;
  warehousevisible: boolean = false;
  inwardDateVisible: boolean = false;
  remarkvisible: boolean = false;
  isbarcodeFilterApplied: boolean = false;
  barcodevisible = false;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFocused: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PO_NUMBER', 'PO_NUMBER'],
    ['INWARD_NO', 'INWARD_NO'],
    ['WAREHOUSE_NAME', 'WAREHOUSE_NAME'],
  ];
  disableItems: boolean = false;
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: InventoryInwardMasterData = new InventoryInwardMasterData();
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  PONotext: string = '';
  InwardNotext: string = '';
  warehouseNametext: string = '';
  quantitytext: string = '';
  purchasepricetext: string = '';
  sellingpricetext: string = '';
  barcodetext: string = '';
  remark: string = '';
  remarkstext: string = '';
  selectedSubcategories: any = [];
  subCategoryData: any = [];
  selectedcategories: any = [];
  categoryData: any = [];
  wareHouselocationList: any = [];
  selectedwarehouseLocations: any = [];
  selectedUnits: any = [];
  unitLists: any = [];
  selectedWarehouses: any = [];
  warehousesList: any = [];
  selectedDate: any;
  isPONOFilterApplied = false;
  iscategoryFilterApplied = false;
  issubcategoryFilterApplied = false;
  isunitFilterApplied = false;
  isInwardNoFilterApplied = false;
  isWarehouseFilterApplied = false;
  issellingFilterApplied = false;
  iswarehouseFilterApplied = false;
  islocationFilterApplied = false;
  isdateFilterApplied = false;
  isRemarksFilterApplied = false;
  Unitdata: any[] = [];
  columns1: { label: string; value: string }[] = [
    { label: 'Item Name', value: 'ITEM_NAME' },
    { label: 'Inventory Category', value: 'INVENTORY_CATEGORY_ID' },
    { label: 'Inventory Sub-Category', value: 'INVENTRY_SUB_CATEGORY_ID' },
    { label: 'Unit', value: 'BASE_UNIT_ID' },
    { label: 'Quantity', value: 'QUANTITY' },
    { label: 'Selling Price', value: 'SELLING_PRICE' },
    { label: 'Location', value: 'LOCATION_ID' },
    { label: 'Warehouse', value: 'WAREHOUSE_ID' },
    { label: 'Date of Entry', value: 'DATE_OF_ENTRY' },
    { label: 'Status', value: 'STATUS' },
  ];
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  showcolumn = [
    { label: 'Selling Price', key: 'SELLING_PRICE', visible: true },
    { label: 'Warehouse', key: 'WAREHOUSE', visible: true },
    { label: 'Date of Entry', key: 'DATE_OF_ENTRY', visible: true },
    { label: 'Status', key: 'STATUS', visible: true },
  ];
  onCategoryChange(): void {
    if (this.selectedcategories?.length) {
      this.search();
      this.iscategoryFilterApplied = true;
    } else {
      this.search();
      this.iscategoryFilterApplied = false;
    }
  }
  onsubCategoryChange(): void {
    if (this.selectedSubcategories?.length) {
      this.search();
      this.issubcategoryFilterApplied = true;
    } else {
      this.search();
      this.issubcategoryFilterApplied = false;
    }
  }
  onUnitChange(): void {
    if (this.selectedUnits?.length) {
      this.search();
      this.isunitFilterApplied = true;
    } else {
      this.search();
      this.isunitFilterApplied = false;
    }
  }
  onlocationChange(): void {
    if (this.selectedwarehouseLocations?.length) {
      this.search();
      this.islocationFilterApplied = true;
    } else {
      this.search();
      this.islocationFilterApplied = false;
    }
  }
  onwarehouseChange(): void {
    if (this.selectedWarehouses?.length) {
      this.search();
      this.iswarehouseFilterApplied = true;
    } else {
      this.search();
      this.iswarehouseFilterApplied = false;
    }
  }
  onDateChange(): void {
    if (this.selectedDate) {
      this.search();
      this.isdateFilterApplied = true;
    } else {
      this.search();
      this.isdateFilterApplied = false;
    }
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.PONotext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isPONOFilterApplied = true;
    } else if (this.PONotext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isPONOFilterApplied = false;
    }
    if (this.InwardNotext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isInwardNoFilterApplied = true;
    } else if (this.InwardNotext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isInwardNoFilterApplied = false;
    }
    if (this.warehouseNametext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isWarehouseFilterApplied = true;
    } else if (
      this.warehouseNametext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.isWarehouseFilterApplied = false;
    }
  }
  UnitList: any;
  status: any;
  warehouseLoading: boolean = false;
  warehouseList: any = [];
  warehousess: any = [];
  userroleid: any;
  userid: any;
  HouseData: any[] = [];
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
  checkColumnselect(a: any) { }
  public commonFunction = new CommonFunctionService();
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
    this.userid = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.userroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.getUnits();
    this.getInventoryCategory();
    this.getSubCategory();
    this.getWarehouses();
  }
  getWarehouses() {
    if (this.userroleid == 23 || this.userroleid == '23') {
      this.warehouseLoading = true;
      this.api
        .getBackOfficeData(
          0,
          0,
          'NAME',
          'ASC',
          ' AND IS_ACTIVE = 1 AND USER_ID=' + this.userid
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200 && data['count'] > 0) {
              this.api
                .getWarehouses(
                  0,
                  0,
                  'NAME',
                  'ASC',
                  ' AND STATUS = 1 AND WAREHOUSE_MANAGER_ID=' +
                  data['data'][0]['ID']
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.warehouseLoading = false;
                      this.warehouseList = data['data'];
                      this.warehousess = this.warehouseList.map(
                        (warehouse) => warehouse.ID
                      );
                      this.search();
                      if (data['count'] > 0) {
                        data['data'].forEach((element) => {
                          this.HouseData.push({
                            value: element.ID,
                            display: element.NAME,
                          });
                        });
                      }
                    } else {
                      this.warehouseLoading = false;
                      this.warehouseList = [];
                      this.warehousess = [];
                    }
                  },
                  (err) => {
                    this.warehouseLoading = false;
                    this.warehouseList = [];
                    this.warehousess = [];
                  }
                );
            } else {
              this.warehouseLoading = false;
              this.warehouseList = [];
              this.warehousess = [];
            }
          },
          (err) => {
            this.warehouseLoading = false;
            this.warehouseList = [];
            this.warehousess = [];
          }
        );
    } else {
      this.warehouseLoading = true;
      this.api.getWarehouses(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.warehouseLoading = false;
            this.warehouseList = data['data'];
            this.warehousess = this.warehouseList.map(
              (warehouse) => warehouse.ID
            );
            this.search();
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.HouseData.push({
                  value: element.ID,
                  display: element.NAME,
                });
              });
            }
          } else {
            this.warehouseLoading = false;
            this.warehouseList = [];
            this.warehousess = [];
          }
        },
        (err) => {
          this.warehouseLoading = false;
          this.warehouseList = [];
          this.warehousess = [];
        }
      );
    }
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  inventorydata: any = [];
  getInventoryCategory() {
    this.api
      .getInventoryCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.categoryData = data['data'];
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.inventorydata.push({
                value: element.ID,
                display: element.INVENTORY_CATEGORY_NAME,
              });
            });
          }
        } else {
          this.categoryData = [];
        }
      });
  }
  Subdata: any[] = [];
  getSubCategory() {
    this.api
      .getInventorySubCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((categorysuccess) => {
        if (categorysuccess.code == 200) {
          this.subCategoryData = categorysuccess['data'];
          if (categorysuccess['count'] > 0) {
            categorysuccess['data'].forEach((element) => {
              this.Subdata.push({
                value: element.ID,
                display: element.INVENTORY_CATEGORY_NAME,
              });
            });
          }
        } else {
          this.subCategoryData = [];
        }
      });
  }
  getUnits() {
    this.api
      .getUnitData(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((unitdata) => {
        if (unitdata.code == 200) {
          this.UnitList = unitdata['data'];
          if (unitdata['count'] > 0) {
            unitdata['data'].forEach((element) => {
              this.Unitdata.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        } else {
          this.UnitList = [];
        }
      });
  }
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
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  search(reset: boolean = false): void {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
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
    if (this.PONotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PO_NUMBER LIKE '%${this.PONotext.trim()}%'`;
    }
    if (this.InwardNotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INWARD_NO LIKE '%${this.InwardNotext.trim()}%'`;
    }
    if (this.warehouseNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WAREHOUSE_NAME LIKE '%${this.warehouseNametext.trim()}%'`;
    }
    if (this.selectedcategories?.length) {
      const categories = this.selectedcategories.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `INVENTORY_CATEGORY_ID IN (${categories})`;
    }
    if (this.selectedSubcategories?.length) {
      const subCategories = this.selectedSubcategories.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INVENTRY_SUB_CATEGORY_ID IN (${subCategories})`;
    }
    if (this.selectedUnits?.length) {
      const units = this.selectedUnits.join(',');
      likeQuery += (likeQuery ? ' AND ' : '') + `BASE_UNIT_ID IN (${units})`;
    }
    if (this.selectedwarehouseLocations?.length) {
      const warehouseLocations = this.selectedwarehouseLocations.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `LOCATION_ID IN (${warehouseLocations})`;
    }
    if (this.selectedWarehouses?.length) {
      const warehouses = this.selectedWarehouses.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `WAREHOUSE_ID IN (${warehouses})`;
    }
    if (this.selectedDate) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INWARD_DATE = '${this.datePipe.transform(
          this.selectedDate,
          'yyyy-MM-dd'
        )}'`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;
    var warefilter: any = '';
    if (this.warehousess.length > 0) {
      warefilter = ' AND WAREHOUSE_ID IN (' + this.warehousess + ')';
      this.api
        .getInventoryInward(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + warefilter
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              this.loadingRecords = false;
              this.totalRecords = response.body['count'];
              this.dataList = response.body['data'];
              this.TabId = response.body['TAB_ID'];
            } else if (response.status == 400) {
              this.dataList = [];
              this.loadingRecords = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.dataList = [];
              this.loadingRecords = false;
              this.message.error('Failed to get Inventory Records', '');
            }
          },
          (err) => {
            if (err['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Failed To Get Inventory Records', '');
            }
          }
        );
    } else {
      this.loadingRecords = false;
      this.dataList = [];
    }
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  ShowTax: boolean = false;
  UName: any;
  add(): void {
    this.drawerTitle = 'New Stock Check-In';
    this.disableItems = false;
    this.drawerData = new InventoryInwardMasterData();
    this.drawerVisible = true;
  }
  Image_Url: any;
  Image_Url_2: any;
  Image_Url_3: any;
  Image_Url_4: any;
  edit(data: InventoryInwardMasterData): void {
    this.disableItems = true;
    this.ShowTax = false;
    this.drawerTitle = 'Update Inventory Stock Check-In Details';
    this.drawerData = Object.assign({}, data);
    this.drawerData.INWARD_ITEM_ID =
      data.INVENTORY_CATEGORY_ID + '-' + data.INWARD_ITEM_ID;
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  keyup(keys): void {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search();
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  isAdjustmentvisible = false;
  isAdjustmentTitle = 'Adjust Quantity';
  isAdjustmentSpinning = true;
  unitselect1: any;
  unitselect2: any;
  unitselect3: any;
  isOk2 = true;
  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    '=',
    '!=',
    '<',
    '>',
    '<=',
    '>=',
    'Contains',
    'Does not Contain',
    'Start With',
    'End With',
  ];
  getComparisonOptions(selectedColumn: string): string[] {
    if (
      selectedColumn === 'INVENTORY_CATEGORY_ID' ||
      selectedColumn === 'INWARD_ITEM_ID' ||
      selectedColumn === 'DATE_OF_ENTRY' ||
      selectedColumn === 'BASE_UNIT_ID' ||
      selectedColumn === 'WAREHOUSE_ID' ||
      selectedColumn === 'STATUS'
    ) {
      return ['=', '!='];
    }
    return [
      '=',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      'Contains',
      'Does not Contain',
      'Start With',
      'End With',
    ];
  }
  columns2: string[][] = [['AND'], ['OR']];
  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter;
  }
  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;
  conditions: any[] = [];
  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: '',
      COMPARISION_VALUE: '',
      TABLE_VALUE: '',
    });
  }
  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }
  operators: string[] = ['AND', 'OR'];
  showQueriesArray = [];
  filterBox = [
    {
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    },
  ];
  addCondition() {
    this.filterBox.push({
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    });
  }
  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }
  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else {
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }
  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }
  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]['FILTER'].length - 1;
    if (
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == '' ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == undefined ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == null
    ) {
      isOk = false;
      this.message.error('Please check some fields are empty', '');
    } else if (
      i != 0 &&
      (this.filterBox[i]['CONDITION'] == undefined ||
        this.filterBox[i]['CONDITION'] == null ||
        this.filterBox[i]['CONDITION'] == '')
    ) {
      isOk = false;
      this.message.error('Please select operator.', '');
    }
    if (isOk) {
      this.filterBox.push({
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      });
    }
  }
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
  createFilterQuery(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.isSpinner = true;
      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';
        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }
          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];
          if (selection1 === 'DATE_OF_ENTRY') {
            selection3 = selection3
              ? this.datePipe
                .transform(filter['SELECTION3'], 'yyyy-MM-dd')
                ?.toString() || ''
              : '';
          }
          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            this.query += this.query2;
          }
        }
        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }
      this.showquery = this.query;
      var newQuery = ' AND ' + this.query;
      this.filterQuery1 = newQuery;
      let sort = ''; 
      let filterQuery = '';
      this.api
        .getInventory(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.isSpinner = false;
            }
          },
          (err) => {
            if (err['ok'] === false) this.message.error('Server Not Found', '');
          }
        );
      this.QUERY_NAME = '';
    }
  }
  restrictedKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'TRUNCATE',
    'ALTER',
    'CREATE',
    'RENAME',
    'GRANT',
    'REVOKE',
    'EXECUTE',
    'UNION',
    'HAVING',
    'WHERE',
    'ORDER BY',
    'GROUP BY',
    'ROLLBACK',
    'COMMIT',
    '--',
    ';',
    '',
  ];
  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    sessionStorage.setItem('ID', item.ID);
    this.search(true);
  }
  resetValues(): void {
    this.filterBox = [
      {
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      },
    ];
    this.search();
  }
  public visiblesave = false;
  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }
  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  Insertname() {
    if (this.QUERY_NAME.trim()) {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      this.visiblesave = false;
      this.QUERY_NAME = ''; 
    } else {
    }
  }
  visible: boolean = false;
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  showcolumnVisible: boolean = false;
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset() { }
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number; 
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  selectedFilter: string | null = null;
  selectedQuery = '';
  isModalVisible = false;
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  drawerFilterVisible = false;
  drawerfilterClose(buttontype, updateButton) {
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'Inventory Stock Check-In Filter';
    this.applyCondition = '';
    this.filterFields[3]['options'] = this.HouseData;
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
    this.filterFields[3]['options'] = this.HouseData;
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  filterFields: any[] = [
    {
      key: 'PO_NUMBER',
      label: 'PO Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter PO Number',
    },
    {
      key: 'INWARD_NO',
      label: 'Stock Check-In Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Stock Check-In Number',
    },
    {
      key: 'INWARD_DATE',
      label: 'Stock Check-In Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Stock Check-In Date',
    },
    {
      key: 'WAREHOUSE_NAME',
      label: 'Warehouse Name',
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
      placeholder: 'Enter Warehouse Name',
    },
  ];
  addvarientdrawerVisible = false;
  addvariant(data: any) {
    this.drawerTitle = 'Add Variant';
    this.addvarientdrawerVisible = true;
    this.drawerData = Object.assign({}, data);
  }
  addvarientdrawerClose(): void {
    this.search();
    this.addvarientdrawerVisible = false;
  }
  get addvarientcloseCallback() {
    return this.addvarientdrawerClose.bind(this);
  }
  ItemId: any;
  Unitid: any;
  itemcategoryis: any;
  ItemMappingDrawerTitle!: string;
  Unitname: any;
  ItemMappingDrawerVisible: boolean = false;
  ItemMapping(data: any): void {
    this.Unitname = data.UNIT_CODE;
    this.Unitid = data.UNIT_ID;
    this.ItemId = data.ID;
    this.itemcategoryis = data.INVENTORY_CATEGORY_ID;
    this.ItemMappingDrawerTitle = 'Unit Mapping To ' + data.ITEM_NAME;
    this.ItemMappingDrawerVisible = true;
  }
  ItemMappingDrawerClose(): void {
    this.search();
    this.ItemMappingDrawerVisible = false;
  }
  get ItemMappingCloseCallback() {
    return this.ItemMappingDrawerClose.bind(this);
  }
  inventoryInwardDrawerVisible: boolean = false;
  inventoryInwardDrawerTitle: string = '';
  INWARD_MASTER_TD: number = 0;
  inventoryInwarddata: any;
  inventoryInwardDrawerOpen(data: any): void {
    this.inventoryInwardDrawerVisible = true;
    this.inventoryInwarddata = data;
    this.inventoryInwardDrawerTitle = 'Inventory Stock Check-In Details';
    this.INWARD_MASTER_TD = data.ID;
  }
  inventoryInwardDrawerClose(): void {
    this.inventoryInwardDrawerVisible = false;
    this.search(false);
  }
  get inventoryInwardDrawerCloseCallback() {
    return this.inventoryInwardDrawerClose.bind(this);
  }
}
