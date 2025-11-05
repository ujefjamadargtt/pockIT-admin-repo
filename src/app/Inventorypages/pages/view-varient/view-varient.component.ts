import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { AddInventoryImagesComponent } from '../add-inventory-images/add-inventory-images.component';
import { appkeys } from 'src/app/app.constant';
// import { ApiServiceService } from '../Service/api-service.service';

@Component({
  selector: 'app-view-varient',
  templateUrl: './view-varient.component.html',
  styleUrls: ['./view-varient.component.css'],
})
export class ViewVarientComponent {
  @Input() Inventorydata;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  loadingRecords = false;
  dataList: any = [];
  pageIndex = 1;
  pageSize = 10;
  sortKey = '';
  sortValue = '';
  searchText = '';
  columns: any[] = [
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
    { label: 'Tracking Type', value: 'INVENTORY_TRACKING_TYPE' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  commonFunction = new CommonFunctionService();

  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  backofficeId = sessionStorage.getItem('backofficeId');
  BACKOFFICE_ID: number;
  roleid = sessionStorage.getItem('roleId');
  roleID: number;
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
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  itemNametext: string = '';
  unitNametext: string = '';
  locationtext: string = '';
  quantitytext: string = '';
  purchasepricetext: string = '';
  sellingpricetext: string = '';
  barcodetext: string = '';
  hsncodetext: string = '';
  remark: string = '';
  remarkstext: string = '';
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
  ishsncodeFilterApplied: boolean = false;
  barcodevisible = false;
  hsncodevisible = false;
  decreptedroleId = 0;
  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);

    const decryptedUserId1 = this.roleid
      ? this.commonFunction.decryptdata(this.roleid)
      : '0';
    var roleId = sessionStorage.getItem('roleId');
    var decreptedroleIdString = roleId
      ? this.commonFunction.decryptdata(roleId)
      : '';
    this.decreptedroleId = parseInt(decreptedroleIdString, 10);

    this.roleID = Number(decryptedUserId1);
    const decryptedbackofficeId = this.backofficeId
      ? this.commonFunction.decryptdata(this.backofficeId)
      : '0';
    this.BACKOFFICE_ID = Number(decryptedbackofficeId);
    this.getWarehouses();
    this.getUnits();
    this.getUnitsData();
  }
  UnitList = [];
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
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOftackingType: any[] = [
    { text: 'Batch Wise', value: 'B' },
    { text: 'Serial No. Wise', value: 'S' },
    { text: 'None', value: 'N' },
  ];

  tackingTypeFilter: string | undefined = undefined;
  ontackingTypeFilterChange(selectedtackingType: string) {
    this.tackingTypeFilter = selectedtackingType;
    this.search(true);
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  reset() { }
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

  onKeyup(event: KeyboardEvent): void {
    if (this.itemNametext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isitemnameFilterApplied = true;
    } else if (this.itemNametext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isitemnameFilterApplied = false;
    }

    if (this.barcodetext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.isbarcodeFilterApplied = true;
    } else if (this.barcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isbarcodeFilterApplied = false;
    }
    if (this.hsncodetext.length >= 1 && event.key === 'Enter') {
      this.search();
      this.ishsncodeFilterApplied = true;
    } else if (this.hsncodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ishsncodeFilterApplied = false;
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

  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }

    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    if (this.barcodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SKU_CODE LIKE '%${this.barcodetext.trim()}%'`;
    }
    if (this.hsncodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `HSN_CODE LIKE '%${this.hsncodetext.trim()}%'`;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    // Tracking Type Filter
    if (this.tackingTypeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      likeQuery += `INVENTORY_TRACKING_TYPE = ${this.tackingTypeFilter}`;
    }
    if (
      this.BACKOFFICE_ID != null &&
      this.BACKOFFICE_ID != undefined &&
      this.BACKOFFICE_ID != 0
    ) {
      likeQuery +=
        ' AND WAREHOUSE_ID IN (' + this.WAREHOUSE_ID.toString() + ')';
    }

    this.api
      .getInventory(0, 0, '', '', ' AND PARENT_ID = ' + this.Inventorydata.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.dataList = data['data'];
          } else {
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
  }

  drawerinventorylogs: boolean = false;

  drawerTitleinventorylogs!: string;
  widthsss: any = '100%';
  serviceid: any;
  ITEM_NAME = '';
  Viewinventorylogs(data: any): void {
    this.drawerTitleinventorylogs = `Activity Logs`;
    this.serviceid = data.ID;
    this.ITEM_NAME = data.ITEM_NAME + '-' + data.VARIANT_NAME;
    this.drawerinventorylogs = true;
  }

  drawerCloseinventorylogs(): void {
    this.drawerinventorylogs = false;
  }
  get closeCallbackinventorylogs() {
    return this.drawerCloseinventorylogs.bind(this);
  }

  WAREHOUSE_ID: any = [];
  Loadwarehouse: any;
  iswarehouseLoading = false;
  getWarehouses(): void {
    this.Loadwarehouse = [];
    this.WAREHOUSE_ID = [];

    if (
      this.BACKOFFICE_ID != null &&
      this.BACKOFFICE_ID != undefined &&
      this.BACKOFFICE_ID != 0
    ) {
      this.iswarehouseLoading = true;

      this.api
        .getWarehouses(
          0,
          0,
          'ID',
          'desc',
          ' AND STATUS = 1 AND WAREHOUSE_MANAGER_ID = ' + this.BACKOFFICE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.iswarehouseLoading = false;
              this.Loadwarehouse = data['data'];
              this.Loadwarehouse.forEach((d) => {
                this.WAREHOUSE_ID.push(d.ID);
              });
              this.search(true);
            } else {
              this.iswarehouseLoading = false;
              this.Loadwarehouse = [];
            }
          },
          (err) => {
            this.iswarehouseLoading = false;
            this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.search(true);
    }
  }

  drawerStockDetails: boolean = false;

  drawerTitleStockDetails!: string;
  viewdrawerData;
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

  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
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

  ItemId: any;
  Unitid: any;
  itemcategoryis: any;
  ItemMappingDrawerTitle!: string;
  Unitname: any;
  ItemMappingDrawerVisible: boolean = false;
  drawerData: any;

  ItemMapping(data: any, i: any): void {
    this.Unitname = data.UNIT_CODE;
    this.Unitid = data.BASE_UNIT_ID;
    this.ItemId = this.dataList[i].ID;
    this.itemcategoryis = data.INVENTORY_CATEGORY_ID;
    this.drawerData = Object.assign({}, data);
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
}
