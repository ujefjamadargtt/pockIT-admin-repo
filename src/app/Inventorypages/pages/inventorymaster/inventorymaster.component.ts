import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
// import { invetoryAdjustments } from "src/app/Pages/Models/inventoryAdjustment";
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DatePipe } from '@angular/common';
import { InventoryMaster } from 'src/app/Inventorypages/inventorymodal/inventoryMaster';
import { invetoryAdjustments } from 'src/app/Inventorypages/inventorymodal/inventoryAdjustment';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AddInventoryImagesComponent } from '../add-inventory-images/add-inventory-images.component';
import { ServiceCatMasterDataNewNonB2b } from 'src/app/Pages/Models/ServiceCatMasterData';

@Component({
  selector: 'app-inventorymaster',
  templateUrl: './inventorymaster.component.html',
  styleUrls: ['./inventorymaster.component.css'],
})
export class InventorymasterComponent {
  public commonFunction = new CommonFunctionService();

  formTitle = 'Manage Inventories';
  pageIndex = 1;
  pageSize = 10;
  inventoryForm: any = '90%';
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  userId = sessionStorage.getItem('userId');

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  itemNameVisible: boolean = false;
  inventorycategoryvisible: boolean = false;
  inventorysubcategoryvisible: boolean = false;
  unitsvisible: boolean = false;
  qtyvisible: boolean = false;
  purchasepricevisible: boolean = false;
  sellingpricevisible: boolean = false;
  locationvisible: boolean = false;
  warehousevisible: boolean = false;
  dateofentryvisible: boolean = false;
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
    ['ITEM_NAME', 'Item Name'],
    ['INVENTORY_CATEGORY_NAME', 'Inventory Category'],
    ['INVENTRY_SUB_CATEGORY_NAME', 'Inventory Sub Category'],
    ['BASE_UNIT_NAME', 'Unit'],
    // ['QUANTITY', 'Quantity'],
    ['SELLING_PRICE', 'Selling Price'],
    ['DATE_OF_ENTRY', 'Date of Entry'],
    ['SKU_CODE', 'SKU Code'],
  ];
  disableItems: boolean = false;

  // columns1: string[][] = [["NAME", "Branch Name"], ["COUNTRY_NAME", "Country"], ["STATE_NAME", "State"], ["CITY_NAME", "City"]];
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: InventoryMaster = new InventoryMaster();
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  itemNametext: string = '';
  unitNametext: string = '';
  locationtext: string = '';
  quantitytext: string = '';
  purchasepricetext: string = '';
  sellingpricetext: string = '';
  barcodetext: string = '';
  remark: string = '';
  // locationtext : string = ""
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
  isitemnameFilterApplied = false;
  iscategoryFilterApplied = false;
  issubcategoryFilterApplied = false;
  isunitFilterApplied = false;
  isquantityFilterApplied = false;
  ispurchaseFilterApplied = false;
  issellingFilterApplied = false;
  iswarehouseFilterApplied = false;
  islocationFilterApplied = false;
  isdateFilterApplied = false;
  isRemarksFilterApplied = false;

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

  //New Advance Filter

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

  columns1: { label: string; value: string }[] = [
    { label: 'Item Name', value: 'ITEM_NAME' },
    { label: 'Inventory Category', value: 'INVENTORY_CATEGORY_ID' },
    { label: 'Inventory Sub-Category', value: 'INVENTRY_SUB_CATEGORY_ID' },
    { label: 'Unit', value: 'BASE_UNIT_ID' },
    // { label: 'Quantity', value: 'QUANTITY' },
    { label: 'Selling Price', value: 'SELLING_PRICE' },
    { label: 'Location', value: 'LOCATION_ID' },
    { label: 'Warehouse', value: 'WAREHOUSE_ID' },
    { label: 'Date of Entry', value: 'DATE_OF_ENTRY' },
    { label: 'Status', value: 'STATUS' },
  ];

  data: invetoryAdjustments = new invetoryAdjustments();
  storageLocationlist: any;

  // This method returns the sum of original quantity and adjustment quantity

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showcolumn = [
    { label: 'Selling Price', key: 'SELLING_PRICE', visible: true },
    // { label: 'Warehouse', key: 'WAREHOUSE', visible: true },
    { label: 'Date of Entry', key: 'DATE_OF_ENTRY', visible: true },
    { label: 'Status', key: 'STATUS', visible: true },
    { label: 'Rating', key: 'RATING', visible: true },
  ];

  onCategoryChange(): void {
    if (this.selectedcategories?.length) {
      this.search();
      this.iscategoryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.iscategoryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onsubCategoryChange(): void {
    if (this.selectedSubcategories?.length) {
      this.search();
      this.issubcategoryFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.issubcategoryFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onUnitChange(): void {
    if (this.selectedUnits?.length) {
      this.search();
      this.isunitFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isunitFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onlocationChange(): void {
    if (this.selectedwarehouseLocations?.length) {
      this.search();
      this.islocationFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.islocationFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onwarehouseChange(): void {
    if (this.selectedWarehouses?.length) {
      this.search();
      this.iswarehouseFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.iswarehouseFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onDateChange(): void {
    if (this.selectedDate) {
      this.search();
      this.isdateFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isdateFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
    // this.search();
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.itemNametext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isitemnameFilterApplied = true;
    } else if (this.itemNametext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isitemnameFilterApplied = false;
    }

    // if (this.selectedcategories.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.iscategoryFilterApplied = true;
    // } else if (this.selectedcategories.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.iscategoryFilterApplied = false;
    // }

    // if (this.selectedSubcategories.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.issubcategoryFilterApplied = true;
    // } else if (this.selectedSubcategories.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.issubcategoryFilterApplied = false;
    // }

    // if (this.selectedUnits.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.isunitFilterApplied = true;
    // } else if (this.selectedUnits.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.isunitFilterApplied = false;
    // }

    if (this.quantitytext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isquantityFilterApplied = true;
    } else if (this.quantitytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isquantityFilterApplied = false;
    }

    if (this.purchasepricetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.ispurchaseFilterApplied = true;
    } else if (
      this.purchasepricetext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
      this.ispurchaseFilterApplied = false;
    }

    if (this.sellingpricetext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.issellingFilterApplied = true;
    } else if (this.sellingpricetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.issellingFilterApplied = false;
    }

    if (this.barcodetext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isbarcodeFilterApplied = true;
    } else if (this.barcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isbarcodeFilterApplied = false;
    }
    // if (this.selectedWarehouses.length >= 3 && event.key === 'Enter') {
    //   this.search();
    //   this.iswarehouseFilterApplied = true;
    // } else if (this.selectedWarehouses.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.iswarehouseFilterApplied = false;
    // }

    if (this.remarkstext.length >= 1 && event.key === 'Enter') {
      this.search();
    } else if (this.remarkstext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }

  // Method to calculate the total quantity

  UnitList: any;
  status: any;
  checkColumnselect(a: any) { }
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit() {
    this.search();
    this.getUnits();
    this.getInventoryCategory();
    this.geInventorydata();
    this.getSubCategory();
    this.getWarehouselocations();
    this.getWarehouses();
    this.getsubcategory();
    this.getUnitsData();
    this.getwarehouse();
    this.getWarehouLoactionData();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  // onCountryChange() {}
  getInventoryCategory() {
    this.api
      .getInventoryCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.categoryData = data['data'];
        } else {
          this.categoryData = [];
        }
      });

    this.api
      .getInventorySubCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((categorysuccess) => {
        if (categorysuccess.code == 200) {
          this.subCategoryData = categorysuccess['data'];
        } else {
          this.subCategoryData = [];
        }
      });
  }

  inventorydata: any = [];

  geInventorydata() {
    {
      this.api.getInventoryCategory(0, 0, 'id', 'asc', '').subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.inventorydata.push({
                value: element.ID,
                display: element.CATEGORY_NAME,
              });
            });
          }
        }
      });
    }
  }
  Subdata: any[] = [];
  getsubcategory() {
    {
      this.api
        .getInventorySubCategory(0, 0, 'id', 'asc', ' AND IS_ACTIVE =1')
        .subscribe((data) => {
          if (data['code'] == '200') {
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.Subdata.push({
                  value: element.ID,
                  display: element.NAME,
                });
              });
            }
          }
        });
    }
  }
  getSubCategory() {
    this.api
      .getInventorySubCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((categorysuccess) => {
        if (categorysuccess.code == 200) {
          this.subCategoryData = categorysuccess['data'];
        } else {
          this.subCategoryData = [];
        }
      });
  }
  getWarehouses() {
    this.api
      .getWarehouses(0, 0, 'id', 'desc', ' AND STATUS= 1')
      .subscribe((selectedWarehouses) => {
        if (selectedWarehouses['code'] == 200) {
          this.warehousesList = selectedWarehouses['data'];
        } else {
          this.warehousesList = [];
        }
      });
  }
  getWarehouselocations() {
    this.api
      .getWarehousesLocation(0, 0, 'id', 'desc', ' AND IS_ACTIVE = 1')
      .subscribe((categorysuccess) => {
        if (categorysuccess.code == 200) {
          this.storageLocationlist = categorysuccess['data'];
        } else {
          this.storageLocationlist = [];
        }
      });
  }

  getUnits() {
    this.api
      .getUnitData(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((unitdata) => {
        if (unitdata.code == 200) {
          this.UnitList = unitdata['data'];
        } else {
          this.UnitList = [];
        }
      });
  }
  Unitdata: any[] = [];
  getUnitsData() {
    {
      this.api
        .getUnitData(0, 0, 'id', 'asc', ' AND IS_ACTIVE =1')
        .subscribe((data) => {
          if (data['code'] == '200') {
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.Unitdata.push({
                  value: element.ID,
                  display: element.NAME,
                });
              });
            }
          }
        });
    }
  }
  HouseData: any[] = [];
  getwarehouse() {
    {
      this.api
        .getWarehouseData(0, 0, '', '', ' AND STATUS =1')
        .subscribe((data) => {
          if (data['code'] == '200') {
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.HouseData.push({
                  value: element.ID,
                  display: element.NAME,
                });
              });
            }
          }
        });
    }
  }

  WarehouseLocationdata: any[] = [];
  getWarehouLoactionData() {
    {
      this.api
        .getWarehousesLocation(0, 0, 'id', 'asc', ' AND IS_ACTIVE = 1')
        .subscribe((data) => {
          if (data['code'] == '200') {
            if (data['count'] > 0) {
              data['data'].forEach((element) => {
                this.WarehouseLocationdata.push({
                  value: element.ID,
                  display: element.LOCATION_NAME,
                });
              });
            }
          }
        });
    }
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
    this.search();
  }

  search(reset: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }

    // if (reset) {
    //   this.pageIndex = 1;
    //   this.sortKey = "id";
    //   this.sortValue = "desc";
    // }
    // // temporary false change when api connected
    // this.loadingRecords = true;

    // let sort: string;
    // try {
    //   sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    // } catch (error) {
    //   sort = "";
    // }

    // let likeQuery = "";

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

    // Global Search (using searchText)
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

    if (this.itemNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ITEM_NAME LIKE '%${this.itemNametext.trim()}%'`;
    }

    // if (this.selectedcategories !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") +
    //     `INVENTORY_CATEGORY_ID LIKE '%${this.selectedcategories.trim()}%'`;
    //     this.iscategoryFilterApplied = true;
    // }
    // else{
    //   // this.iscategoryFilterApplied = false;
    // }

    if (this.quantitytext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `QUANTITY LIKE '%${this.quantitytext.trim()}%'`;
    }

    if (this.sellingpricetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SELLING_PRICE LIKE '%${this.sellingpricetext.trim()}%'`;
    }

    if (this.barcodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SKU_CODE LIKE '%${this.barcodetext.trim()}%'`;
    }

    if (this.remarkstext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REMARKS LIKE '%${this.remarkstext.trim()}%'`;
      this.isRemarksFilterApplied = true;
    } else {
      this.isRemarksFilterApplied = false;
    }

    // Inventory Category
    // Selected Categories
    if (this.selectedcategories?.length) {
      const categories = this.selectedcategories.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `INVENTORY_CATEGORY_ID IN (${categories})`;
      // this.iscategoryFilterApplied = true;
    }

    {
      // this.iscategoryFilterApplied = false;
    }

    // Selected Sub-Categories
    if (this.selectedSubcategories?.length) {
      const subCategories = this.selectedSubcategories.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `INVENTRY_SUB_CATEGORY_ID IN (${subCategories})`;
    }

    // Selected Units
    if (this.selectedUnits?.length) {
      const units = this.selectedUnits.join(',');
      likeQuery += (likeQuery ? ' AND ' : '') + `BASE_UNIT_ID IN (${units})`;
    }

    // Selected Warehouse Locations
    if (this.selectedwarehouseLocations?.length) {
      const warehouseLocations = this.selectedwarehouseLocations.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `LOCATION_ID IN (${warehouseLocations})`;
    }

    // Selected Warehouses
    if (this.selectedWarehouses?.length) {
      const warehouses = this.selectedWarehouses.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `WAREHOUSE_ID IN (${warehouses})`;
    }

    // Entry Date (if a range is required, modify accordingly)
    if (this.selectedDate) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DATE_OF_ENTRY = '${this.datePipe.transform(
          this.selectedDate,
          'yyyy-MM-dd'
        )}'`;
    }

    // State Filter

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      likeQuery += `STATUS = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadingRecords = true;

    // Call API with updated search query
    this.api
      .getInventory(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND PARENT_ID = 0 ' + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
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
  }
  // public commonFunction = new CommonFunctionService();
  // getUnits() {
  //   this.api
  //     .getUnitData(0, 0, "id", "desc", " AND IS_ACTIVE=1")
  //     .subscribe((unitdata) => {
  //       if (unitdata.code == 200) {
  //         this.UnitList = unitdata["data"];
  //       } else {
  //         this.UnitList = [];
  //       }
  //     });
  // }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  ShowTax: boolean = false;
  UName: any;

  add(): void {
    this.drawerTitle = 'Add New Inventory';
    this.disableItems = false;
    this.drawerData = new InventoryMaster();
    this.drawerVisible = true;
  }

  edit(data: InventoryMaster): void {
    this.disableItems = true;
    this.ShowTax = false;
    this.UName = data.BASE_UNIT_NAME;

    if (data.TAX_PREFERENCE == 'T') {
      this.ShowTax = true;
    } else {
      this.ShowTax = false;
    }

    this.drawerTitle = 'Update Inventory Details';
    this.drawerData = Object.assign({}, data);
    this.drawerData.INVENTRY_SUB_CATEGORY_ID =
      data.INVENTORY_CATEGORY_ID + '-' + data.INVENTRY_SUB_CATEGORY_ID;
    this.drawerVisible = true;
    // this.drawerData.WAREHOUSE_ID = Number(this.drawerData.WAREHOUSE_ID);
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  keyup(keys): void {
    // if (this.searchText.trim().length >= 3) {
    //   this.search(); // Perform search when the text is valid
    // } else if (this.searchText.length == 0 && event.key === 'backspace') {
    //    // Clear the results when the text is empty
    //    this.search()
    // }

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
    // this.search(true);
  }

  isAdjustmentvisible = false;
  isAdjustmentTitle = 'Adjust Quantity';
  isAdjustmentSpinning = true;
  unitselect1: any;
  unitselect2: any;
  unitselect3: any;
  changeQuantity(quantity: number) {
    if (this.data.OLD_QTY && quantity) {
      this.data.NEW_QTY = Number(this.data.OLD_QTY) + Number(quantity);
    } else {
      this.data.NEW_QTY = 0;
    }
  }
  openAdjustment(data) {
    if (data) {
      // this.isAdjustmentTitle = "Inventory "  + ' ' + data["ITEM_NAME"] + " Adjustment";
      this.isAdjustmentTitle = 'Inventory ' + ' ' + ' Adjustment';
      this.isAdjustmentvisible = true;
      this.isAdjustmentSpinning = false;
      this.data = new invetoryAdjustments();
      this.data.OLD_QTY = data['QUANTITY'];
      this.unitselect1 = data['BASE_UNIT_ID'];
      this.unitselect2 = data['BASE_UNIT_ID'];
      this.unitselect3 = data['BASE_UNIT_ID'];
      this.data.ITEM_ID = data['ID'];
      this.data.ITEM_NAME = data['ITEM_NAME'];
      //

      this.getWarehouselocations();
      // {
      //   this.api
      //     .getWarehousesLocation(0, 0, "id", "desc", " AND STATUS=1")
      //     .subscribe((categorysuccess) => {
      //       if (categorysuccess.code == 200) {
      //         this.storageLocationlist = categorysuccess["data"];
      //       } else {
      //         this.storageLocationlist = [];
      //       }
      //     });

      // }
    }
  }

  adjustmentclose() {
    this.isAdjustmentvisible = false;
  }

  closeAdjustment(adjustmentForm: NgForm) {
    this.isAdjustmentvisible = false;
    this.isAdjustmentSpinning = false;
    this.data = new invetoryAdjustments();
    this.unitselect1 = null;
    this.unitselect2 = null;
    this.unitselect3 = null;
    // this.resetDrawer(adjustmentForm)
    if (adjustmentForm) {
      adjustmentForm.resetForm(); // Reset the form if it's valid
    }
    this.drawerClose();
    // this.resetDrawer(adjustmentForm);
  }
  // resetDrawer(adjustmentForm: NgForm) {
  //   adjustmentForm.form.markAsPristine();
  //   adjustmentForm.form.markAsUntouched();
  //   this.add();
  // }
  isOk2 = true;
  saveAdjustment(addNew: boolean, adjustmentForm: NgForm) {
    if (
      !this.data.OLD_QTY &&
      !this.data.ADJUSTMENT_QUANTITY &&
      !this.data.NEW_QTY &&
      !this.data.ADJUSTMENT_REASON
    ) {
      this.message.error('All fields are required.', '');
      this.isAdjustmentSpinning = false;
      this.isOk2 = false;
    } else if (!this.data.OLD_QTY || this.data.OLD_QTY == 0) {
      this.message.error('Please enter Old Quantity', '');
      this.isAdjustmentSpinning = false;
      this.isOk2 = false;
    } else if (
      !this.data.ADJUSTMENT_QUANTITY ||
      this.data.ADJUSTMENT_QUANTITY == 0
    ) {
      this.message.error('Please enter Adjustment Quantity', '');
      this.isAdjustmentSpinning = false;
      this.isOk2 = false;
    } else if (!this.data.NEW_QTY || this.data.NEW_QTY == 0) {
      this.message.error('Please enter New Quantity', '');
      this.isAdjustmentSpinning = false;
      this.isOk2 = false;
    } else if (!this.data.ADJUSTMENT_REASON) {
      this.message.error('Please enter Adjustment Reason', '');
      this.isAdjustmentSpinning = false;

      this.isOk2 = false;
    }
    if (this.isOk2) {
      this.data.ID = this.data['ID'];

      this.isAdjustmentSpinning = true;

      if (this.USER_ID) {
        this.data.ADJUSTED_BY = this.USER_ID;
        this.api.createInventoryAdjustment(this.data).subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.message.success('Adjustment Added Successfully', '');
              this.isAdjustmentSpinning = false;

              this.closeAdjustment(adjustmentForm);
            } else {
              this.message.error('Failed To Add Adjustment', '');
              this.isAdjustmentSpinning = false;
            }
          },
          (err) => {
            this.message.error('Server error', '');
            this.isAdjustmentSpinning = false;
          }
        );
      } else {
        // Handle the null case
        // You can also assign a default value or take other necessary actions
        this.data.ADJUSTED_BY = null; // or some default value
      }
    }
  }
  // Main Filter code

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
      selectedColumn === 'INVENTRY_SUB_CATEGORY_ID' ||
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
  // QUERY_NAME: string = '';
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

  /*******  Create filter query***********/
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
            //this.query2 += '(';
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
            //this.query2 += ') ';
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

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api
        .getInventory(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
          // filterQuery
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
    '/*',
    '*/',
  ];

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }
  // applyFilter(i: number, j: number) {
  //   const currentFilter = this.filterBox[i]['FILTER'][j];

  //   const selection1 = currentFilter.SELECTION1;
  //   if (selection1 === 'DATE_OF_ENTRY') {
  //     currentFilter.SELECTION3 = currentFilter.SELECTION3
  //       ? this.datePipe
  //           .transform(currentFilter.SELECTION3, 'yyyy-MM-dd')
  //           ?.toString() || ''
  //       : '';
  //   }
  //   const selection2 = currentFilter.SELECTION2;
  //   const selection3 = currentFilter.SELECTION3;

  //   if (!selection1) {
  //     this.message.error('Please select a column', '');
  //   } else if (!selection2) {
  //     this.message.error('Please select a comparison', '');
  //   } else if (!selection3 || selection3.length < 1) {
  //     this.message.error(
  //       'Please enter a valid value with at least 1 character',
  //       ''
  //     );
  //   } else if (
  //     typeof selection3 === 'string' &&
  //     !this.isValidInput(selection3)
  //   ) {
  //     this.message.error(`Invalid Input: ${selection3} is not allowed.`, '');
  //   } else {
  //     const sort = this.sortValue?.startsWith('a') ? 'asc' : 'desc';

  //     const getComparisonFilter = (
  //       comparisonValue: any,
  //       columnName: any,
  //       tableValue: any
  //     ) => {
  //       switch (comparisonValue) {
  //         case '=':
  //         case '!=':
  //         case '<':
  //         case '>':
  //         case '<=':
  //         case '>=':
  //           return `${tableValue} ${comparisonValue} '${columnName}'`;
  //         case 'Contains':
  //           return `${tableValue} LIKE '%${columnName}%'`;
  //         case 'Does not Contain':
  //           return `${tableValue} NOT LIKE '%${columnName}%'`;
  //         case 'Start With':
  //           return `${tableValue} LIKE '${columnName}%'`;
  //         case 'End With':
  //           return `${tableValue} LIKE '%${columnName}'`;
  //         default:
  //           return '';
  //       }
  //     };

  //     const filterCondition = getComparisonFilter(
  //       selection2,
  //       selection3,
  //       selection1
  //     );
  //     const FILDATA = `AND (${filterCondition})`;

  //     this.isSpinner = true;

  //     this.api
  //       .getInventory(
  //         this.pageIndex,
  //         this.pageSize,
  //         this.sortKey,
  //         sort,
  //         FILDATA
  //       )
  //       .subscribe(
  //         (data) => {
  //           if (data['code'] === 200) {
  //             this.totalRecords = data['count'];
  //             this.dataList = data['data'];
  //           } else {
  //             this.dataList = [];
  //           }
  //           this.isSpinner = false;
  //         },
  //         (err) => {
  //           if (err['ok'] === false) {
  //             this.message.error('Server Not Found', '');
  //           }
  //           this.isSpinner = false;
  //         }
  //       );
  //   }
  // }

  // applyfilter(item) {
  //   const formattedDate = this.datePipe.transform('DATE', 'yyyy-MM-dd');
  //   this.filterQuery = ' AND (' + item.query + ')';
  //   this.search(true);
  // }

  // filterQuery = '';

  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
    sessionStorage.setItem('ID', item.ID);
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
    // this.createFilterQuery();
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
      this.QUERY_NAME = ''; // Clear input after adding
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

  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: number; // Ensure TabId is defined and initialized

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
    this.search();
    sessionStorage.removeItem('ID');
  }
  selectedFilter: string | null = null;

  selectedQuery = '';
  isModalVisible = false;
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
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
    this.drawerTitle = 'Inventory Filter';
    this.applyCondition = '';
    this.filterFields[1]['options'] = this.inventorydata;
    this.filterFields[2]['options'] = this.Subdata;
    this.filterFields[3]['options'] = this.Unitdata;
    this.filterFields[6]['options'] = this.HouseData;
    this.filterFields[7]['options'] = this.WarehouseLocationdata;
    this.drawerFilterVisible = true;

    // Edit code 2

    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

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
  // Edit Code 3

  // Edit Code 1
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
    this.filterFields[1]['options'] = this.inventorydata;
    this.filterFields[2]['options'] = this.Subdata;
    this.filterFields[3]['options'] = this.Unitdata;
    this.filterFields[6]['options'] = this.HouseData;
    this.filterFields[7]['options'] = this.WarehouseLocationdata;
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
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }
  filterFields: any[] = [
    {
      key: 'ITEM_NAME',
      label: 'Item Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Item Name',
    },
    {
      key: 'INVENTORY_CATEGORY_NAME',
      label: 'Category Name',
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
      key: 'INVENTRY_SUB_CATEGORY_ID',
      label: 'Sub Category Name',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Sub Category Name',
    },
    {
      key: 'BASE_UNIT_ID',
      label: 'Base Unit',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Enter Base Unit',
    },

    // {
    //   key: 'QUANTITY',
    //   label: 'Opening Stock',
    //   type: 'text',
    //   comparators: [
    //     '=',
    //     '!=',
    //     'Contains',
    //     'Does Not Contains',
    //     'Starts With',
    //     'Ends With',
    //   ],
    //   placeholder: 'Enter Opening Stock',
    // },
    {
      key: 'SELLING_PRICE',
      label: 'Selling Price (₹)',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Selling Price(₹)',
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
      key: 'WAREHOUSE_ID',
      label: 'Warehouse Name',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Warehouse Name',
    },
    {
      key: 'DATE_OF_ENTRY',
      label: 'Date Of Entry',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Date',
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
      placeholder: 'Select Status',
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
    this.Unitid = data.BASE_UNIT_ID;
    this.ItemId = data.ID;
    this.itemcategoryis = data.INVENTORY_CATEGORY_ID;
    this.ItemMappingDrawerTitle = 'Unit Mapping To ' + data.ITEM_NAME;
    this.drawerData = Object.assign({}, data);
    this.drawerData.INVENTRY_SUB_CATEGORY_ID =
      data.INVENTORY_CATEGORY_ID + '-' + data.INVENTRY_SUB_CATEGORY_ID;
    this.ItemMappingDrawerVisible = true;
  }

  ItemMappingDrawerClose(): void {
    this.search();
    this.ItemMappingDrawerVisible = false;
  }

  get ItemMappingCloseCallback() {
    return this.ItemMappingDrawerClose.bind(this);
  }

  itemImagesDrawerVisible: boolean = false;
  itemImagesDrawerTitle: string = '';
  addImageDrawerData: any;
  @ViewChild(AddInventoryImagesComponent)
  AddInventoryImagesComponentVar!: AddInventoryImagesComponent;

  openItemImagesDrawer(data: any): void {
    this.addImageDrawerData = Object.assign({}, data);
    this.itemImagesDrawerTitle = 'Inventory Image(s)';
    this.itemImagesDrawerVisible = true;

    setTimeout(() => {
      this.AddInventoryImagesComponentVar.getPreviousImages(data.ID);
    });
  }

  itemImagesDrawerClose(): void {
    this.itemImagesDrawerVisible = false;
    this.search(false);
  }

  get itemImagesDrawerCloseCallback() {
    return this.itemImagesDrawerClose.bind(this);
  }

  inventoryAdjestmentHistoryDrawerVisible: boolean = false;
  inventoryAdjestmentHistoryDrawerTitle: string = '';
  inventoryAdjestmentHistoryDrawerData: any[] = [];

  inventoryAdjestmentHistoryDrawerOpen(data: any): void {
    this.inventoryAdjestmentHistoryDrawerTitle =
      'Adjustment Details of ' + data['ITEM_NAME'];
    this.inventoryAdjestmentHistoryDrawerData = data;
    this.inventoryAdjestmentHistoryDrawerVisible = true;
  }

  inventoryAdjestmentHistoryDrawerClose(): void {
    this.inventoryAdjestmentHistoryDrawerVisible = false;
    this.search(false);
  }

  get inventoryAdjestmentHistoryDrawerCloseCallback() {
    return this.inventoryAdjestmentHistoryDrawerClose.bind(this);
  }

  viewdrawerData;
  viewdrawerTitle;
  viewvarientdrawerVisible = false;
  viewvariant(data: any) {
    this.viewdrawerTitle = 'View All Variants';
    this.viewvarientdrawerVisible = true;
    this.viewdrawerData = Object.assign({}, data);
  }

  viewvarientdrawerClose(): void {
    this.search();
    this.viewvarientdrawerVisible = false;
  }

  get viewvarientcloseCallback() {
    return this.viewvarientdrawerClose.bind(this);
  }

  drawerserviceVisibleMaped: boolean = false;
  drawerDataMaped: ServiceCatMasterDataNewNonB2b =
    new ServiceCatMasterDataNewNonB2b();
  drawerTitleMaped!: string;
  widthsss: any = '100%';
  serviceid: any;
  VieMappedServices(data: any): void {
    this.drawerTitleMaped = `View Change Logs`;
    this.serviceid = data.ID;

    this.drawerDataMaped = Object.assign({}, data);
    this.drawerserviceVisibleMaped = true;
  }

  drawerServiceMappingCloseMaped(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerserviceVisibleMaped = false;
  }
  get closeServiceMappingCallbackMaped() {
    return this.drawerServiceMappingCloseMaped.bind(this);
  }

  drawerinventorylogs: boolean = false;

  drawerTitleinventorylogs!: string;
  ITEM_NAME = '';
  Viewinventorylogs(data: any): void {
    this.drawerTitleinventorylogs = `Inventory Logs`;
    this.serviceid = data.ID;

    this.ITEM_NAME = data.ITEM_NAME;
    this.drawerinventorylogs = true;
  }

  drawerCloseinventorylogs(): void {
    this.drawerinventorylogs = false;
  }
  get closeCallbackinventorylogs() {
    return this.drawerCloseinventorylogs.bind(this);
  }

  drawerStockDetails: boolean = false;

  drawerTitleStockDetails!: string;

  ViewStockDetails(data: any): void {
    this.drawerTitleStockDetails = `Stock Details`;
    this.viewdrawerData = data;
    this.ITEM_NAME = data.ITEM_NAME + ' ' + data.VARIANT_NAME;
    this.drawerStockDetails = true;
  }

  drawerCloseStockDetails(): void {
    this.drawerStockDetails = false;
  }
  get closeCallbackStockDetails() {
    return this.drawerCloseStockDetails.bind(this);
  }
}