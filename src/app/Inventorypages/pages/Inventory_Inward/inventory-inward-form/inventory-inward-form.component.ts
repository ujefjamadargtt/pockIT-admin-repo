import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { InventoryInwardMasterData } from 'src/app/Inventorypages/inventorymodal/inventoryInwardMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-inventory-inward-form',
  templateUrl: './inventory-inward-form.component.html',
  styleUrls: ['./inventory-inward-form.component.css'],
})
export class InventoryInwardFormComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: InventoryInwardMasterData;
  @Input() drawerVisible: boolean;
  HSNdata: any = [];
  taxData: any = [];
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  GLOBAL_EXPIRY_DATE: any;
  GLOBAL_GUARANTTEE_IN_DAYS: any;
  GLOBAL_WARRANTY_IN_DAYS: any;
  UNIQUE_NOGlobal: any;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  addpat = /[ .a-zA-Z0-9 ]+/;
  pincode = /([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})/;
  PTECpattern = /^99\d{9}P$/;
  org = [];
  orgId = this.cookie.get('orgId');
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  date;
  InventorySubCategoryList: any = [];
  InventoryCategoryList: any = [];
  UnitList: any = [];
  warehouseList: any = [];
  storageLocationlist: any = [];
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  userroleid: any;
  userid: any;
  ngOnInit() {
    this.userid = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.userroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.getWarehouses();
    this.getInventoryCategory();
    if (this.data?.WAREHOUSE_ID) {
      this.onWarehousechange(this.data.WAREHOUSE_ID);
    }
    if (this.data.ID) {
      this.getNamesCatAndSub(this.data.INWARD_ITEM_ID);
    }
  }
  inventoryLoading: boolean = false;
  deleteCancel() { }
  getInventoryCategory() {
    this.inventoryLoading = true;
    this.api.getInventoryHirarchyInward().subscribe(
      (data) => {
        if (data['status'] == 200) {
          this.inventoryLoading = false;
          this.InventoryCategoryList = data['body']['data'][0]['hierarchy'];
        } else {
          this.inventoryLoading = false;
          this.InventoryCategoryList = [];
        }
      },
      () => {
        this.inventoryLoading = false;
        this.InventoryCategoryList = [];
      }
    );
  }
  onChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      let selectedUnit = this.UnitList.find(
        (unit: any) => unit.UNIT_ID === selectedId
      );
      if (
        selectedUnit != null &&
        selectedUnit != undefined &&
        selectedUnit != ''
      ) {
        this.data.UNIT_NAME = selectedUnit['UNIT_NAME'];
        this.ItemDetails['BASE_QUANTITY'] = selectedUnit['QUANTITY_PER_UNIT'];
        this.ItemDetails['ACTUAL_UNIT_ID'] = selectedId;
        this.ItemDetails['ACTUAL_UNIT_NAME'] = selectedUnit['UNIT_NAME'];
      }
      this.data.UNIT_ID = selectedId;
    } else {
      this.data.UNIT_NAME = null;
      this.data.UNIT_ID = null;
    }
  }
  MainonChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.UnitList.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.data.UNIT_NAME = selectedProduct['NAME'];
      } else {
        this.data.UNIT_NAME = null;
      }
      this.data.UNIT_ID = selectedId;
    } else {
      this.data.UNIT_NAME = null;
      this.data.UNIT_ID = null;
    }
  }
  onVariantChange(event: any) {
    if (event == true) {
      this.data.UNIT_ID = null;
      this.data.QUANTITY = null;
      this.data.UNIT_NAME = null;
      this.data.WAREHOUSE_ID = null;
      this.data.WAREHOUSE_NAME = null;
    } else {
      this.data.QUANTITY = 1;
      if (this.UnitList.length > 0) {
        this.data['ACTUAL_UNIT_ID'] = this.UnitList[0].ID;
        this.data['ACTUAL_UNIT_NAME'] = this.UnitList[0].NAME;
        this.data.UNIT_ID = this.UnitList[0].ID;
        this.data.UNIT_NAME = this.UnitList[0].NAME;
      }
    }
  }
  splitddata: any;
  InwardVarientsGet: any = [];
  ItemDetails: any;
  variantchange(event) {
    if (event != null && event !== undefined && event !== '') {
      let selectedProduct1 = this.InwardVarientsGet.find(
        (product) => product.ID === event
      );
      if (
        selectedProduct1 != null &&
        selectedProduct1 !== undefined &&
        selectedProduct1 !== ''
      ) {
        this.ItemDetails.BASE_UNIT_ID = selectedProduct1['BASE_UNIT_ID'];
        this.ItemDetails.BASE_UNIT_NAME = selectedProduct1['BASE_UNIT_NAME'];
        this.ItemDetails.BASE_QUANTITY = selectedProduct1['BASE_QUANTITY'];
        this.ItemDetails.INVENTORY_TRACKING_TYPE =
          selectedProduct1['INVENTORY_TRACKING_TYPE'];
        this.ItemDetails.EXPIRY_DATE_ALLOWED =
          selectedProduct1['EXPIRY_DATE_ALLOWED'];
        this.ItemDetails.GUARANTEE_ALLOWED =
          selectedProduct1['GUARANTEE_ALLOWED'];
        this.ItemDetails.WARRANTY_ALLOWED =
          selectedProduct1['WARRANTY_ALLOWED'];
        this.data.INWARD_VARIANT_ID = selectedProduct1['ID'];
        this.data.INWARD_VARIANT_NAME = selectedProduct1['VARIANT_COMBINATION'];
        this.data['PARENT_ID'] = selectedProduct1['PARENT_ID'];
        this.data.UNIT_ID = selectedProduct1['BASE_UNIT_ID'];
        this.data.UNIT_NAME = selectedProduct1['BASE_UNIT_NAME'];
        this.data['ACTUAL_UNIT_NAME'] = this.ItemDetails['ACTUAL_UNIT_NAME'];
        this.data['ACTUAL_UNIT_ID'] = this.ItemDetails['ACTUAL_UNIT_ID'];
        this.data.QUANTITY = 1;
        this.data.INWARD_NO = this.data.INWARD_NO;
        this.data.PO_NUMBER = this.data.PO_NUMBER;
        this.data.WAREHOUSE_ID = this.data.WAREHOUSE_ID;
        this.data.WAREHOUSE_NAME = this.data.WAREHOUSE_NAME;
        this.data['INVENTORY_DETAILS'] = [];
        this.getUnits(selectedProduct1['ID']);
      } else {
        this.ItemDetails.BASE_UNIT_ID = null;
        this.ItemDetails.BASE_UNIT_NAME = null;
        this.data['ACTUAL_UNIT_NAME'] = null;
        this.data['ACTUAL_UNIT_ID'] = null;
        this.ItemDetails.BASE_QUANTITY = null;
        this.ItemDetails.INVENTORY_TRACKING_TYPE = null;
        this.ItemDetails.EXPIRY_DATE_ALLOWED = false;
        this.ItemDetails.GUARANTEE_ALLOWED = false;
        this.ItemDetails.WARRANTY_ALLOWED = false;
        this.data.INWARD_VARIANT_ID = null;
        this.data.INWARD_VARIANT_NAME = null;
        this.data.UNIT_ID = null;
        this.data.UNIT_NAME = null;
        this.data.QUANTITY = 1;
        this.data.INWARD_NO = null;
        this.data.PO_NUMBER = null;
        this.data.WAREHOUSE_ID = null;
        this.data.WAREHOUSE_NAME = null;
        this.data['INVENTORY_DETAILS'] = [];
        this.UnitList = [];
      }
    } else {
      this.data.UNIT_NAME = null;
      this.data.UNIT_ID = null;
      this.data.QUANTITY = 1;
      this.UnitList = [];
    }
  }
  isVarientLoading: boolean = false;
  GetVariants(event: any) {
    if (event != null && event !== undefined && event !== '') {
      if (
        this.ItemDetails !== null &&
        this.ItemDetails !== undefined &&
        this.ItemDetails !== ''
      ) {
        if (this.ItemDetails.IS_HAVE_VARIANTS == true) {
          this.data.IS_VARIANT = true;
          this.UnitList = [];
          this.data.QUANTITY = 1;
          this.data.UNIT_ID = null;
          this.data.UNIT_NAME = null;
          this.isVarientLoading = true;
          this.api
            .getInventory(
              0,
              0,
              '',
              '',
              ' AND STATUS=1 AND PARENT_ID = ' + this.ItemDetails.ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.isVarientLoading = false;
                  this.InwardVarientsGet = data['data'];
                } else {
                  this.isVarientLoading = false;
                  this.InwardVarientsGet = [];
                  this.message.error('Failed to get Inventory Records', '');
                }
              },
              (err) => {
                this.isVarientLoading = false;
                this.InwardVarientsGet = [];
                this.message.error('Failed To Get Inventory Records', '');
              }
            );
        } else {
          this.InwardVarientsGet = [];
          this.data.INWARD_VARIANT_ID = null;
          this.data.IS_VARIANT = false;
          this.data.QUANTITY = 1;
          this.data['PARENT_ID'] = 0;
          this.ItemDetails['BASE_QUANTITY'] = 1;
          this.getUnits(this.ItemDetails.ID);
        }
      } else {
        this.InwardVarientsGet = [];
        this.data.INWARD_VARIANT_ID = null;
        this.data.QUANTITY = 1;
        this.data.IS_VARIANT = false;
        this.UnitList = [];
      }
    } else {
      this.InwardVarientsGet = [];
      this.data.INWARD_VARIANT_ID = null;
      this.data.QUANTITY = 1;
      this.UnitList = [];
    }
  }
  ItemId = 0;
  guaranteeDays = 0;
  warrantyDays = 0;
  getNamesCatAndSub(selectedKey: any): void {
    this.guaranteeDays = 0;
    this.warrantyDays = 0;
    if (
      selectedKey != null &&
      selectedKey !== undefined &&
      selectedKey !== ''
    ) {
      const ancestry = this.findNodeAncestry(
        this.InventoryCategoryList,
        selectedKey
      );
      if (ancestry) {
        this.data.INVENTORY_CATEGORY_ID = ancestry[0].id;
        this.data.INVENTORY_CATEGORY_NAME = ancestry[0].title;
        if (ancestry.length > 1) {
          this.data.INVENTRY_SUB_CATEGORY_ID = ancestry[1].id;
          this.data.INVENTRY_SUB_CATEGORY_NAME = ancestry[1].title;
        } else {
          this.data.INVENTRY_SUB_CATEGORY_ID = null;
          this.data.INVENTRY_SUB_CATEGORY_NAME = null;
        }
        const child = ancestry[ancestry.length - 1];
        this.ItemId = child.details.ID;
        if (this.ItemId) {
          this.api
            .getInventory(
              0,
              0,
              '',
              'desc',
              " AND ID='" + this.ItemId + "' AND STATUS=1"
            )
            .subscribe((gwdata) => {
              if (gwdata.count > 0) {
                if (gwdata['data'][0]['GUARANTEE_ALLOWED']) {
                  this.guaranteeDays = gwdata['data'][0]['GUARANTEE_PERIOD'];
                }
                if (gwdata['data'][0]['WARRANTY_ALLOWED']) {
                  this.warrantyDays = gwdata['data'][0]['WARRANTY_PERIOD'];
                }
              }
            });
        }
        this.data.INWARD_ITEM_NAME = child.title;
        this.ItemDetails = child.details;
      }
    } else {
      this.data.INVENTORY_CATEGORY_NAME = null;
      this.data.INVENTRY_SUB_CATEGORY_NAME = null;
      this.data.INVENTRY_SUB_CATEGORY_ID = null;
      this.data.INVENTORY_CATEGORY_ID = null;
      this.data.INWARD_ITEM_ID = null;
      this.data.INWARD_ITEM_NAME = null;
      this.guaranteeDays = 0;
      this.warrantyDays = 0;
    }
  }
  findNodeAncestry(
    nodes: any[],
    key: string,
    ancestry: any[] = []
  ): any[] | null {
    for (const node of nodes) {
      const newAncestry = ancestry.concat([
        {
          id: node.ID,
          key: node.key,
          title: node.title,
          details: node.details,
        },
      ]);
      if (node.key === key) {
        return newAncestry;
      }
      if (node.children && node.children.length) {
        const result = this.findNodeAncestry(node.children, key, newAncestry);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
  childrenIds: string[] = [];
  searchsku(sku: string): void {
    if (!sku) {
      this.childrenIds = [];
      return;
    }
    const node = this.findNodeBySKU(this.InventoryCategoryList, sku);
    if (node) {
      this.childrenIds = node;
      if (this.childrenIds.length > 0) {
      }
    } else {
      this.childrenIds = [];
    }
  }
  findNodeBySKU(nodes: any[], sku: string): any | null {
    for (const node of nodes) {
      if (
        node.details &&
        node.details.SKU_CODE &&
        node.details.SKU_CODE.toLowerCase() === sku.toLowerCase()
      ) {
        return node.details;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNodeBySKU(node.children, sku);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  getAllChildIds(node: any): string[] {
    let ids: string[] = [];
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        ids.push(child.key);
        ids = ids.concat(this.getAllChildIds(child));
      }
    }
    return ids;
  }
  onWarehousechange(warehouseid: any) {
    if (warehouseid != null && warehouseid != undefined && warehouseid != '') {
      var selectedProduct = this.warehouseList.find(
        (product) => product.ID === warehouseid
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.data.WAREHOUSE_NAME = selectedProduct['NAME'];
      } else {
        this.data.WAREHOUSE_NAME = null;
      }
      this.data.WAREHOUSE_ID = warehouseid;
    } else {
      this.data.WAREHOUSE_NAME = null;
      this.data.WAREHOUSE_ID = null;
    }
  }
  warehouseLoading: boolean = false;
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
                    } else {
                      this.warehouseLoading = false;
                      this.warehouseList = [];
                    }
                  },
                  (err) => {
                    this.warehouseLoading = false;
                    this.warehouseList = [];
                  }
                );
            } else {
              this.warehouseLoading = false;
              this.warehouseList = [];
            }
          },
          (err) => {
            this.warehouseLoading = false;
            this.warehouseList = [];
          }
        );
    } else {
      this.warehouseLoading = true;
      this.api.getWarehouses(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.warehouseLoading = false;
            this.warehouseList = data['data'];
          } else {
            this.warehouseLoading = false;
            this.warehouseList = [];
          }
        },
        (err) => {
          this.warehouseLoading = false;
          this.warehouseList = [];
        }
      );
    }
  }
  Unitload: boolean = false;
  getUnits(event: any) {
    if (event) {
      this.Unitload = true;
      this.api
        .getItemMappingData(0, 0, '', 'asc', ' AND ITEM_ID = ' + event)
        .subscribe(
          (unitdata) => {
            if (unitdata.code == 200) {
              this.Unitload = false;
              this.UnitList = unitdata['data'];
              if (unitdata['count'] > 0) {
                this.data.UNIT_ID = this.ItemDetails.BASE_UNIT_ID;
                this.data.UNIT_NAME = this.ItemDetails.BASE_UNIT_NAME;
                this.data['ACTUAL_UNIT_ID'] = this.data.UNIT_ID;
                this.data['ACTUAL_UNIT_NAME'] = this.data.UNIT_NAME;
              }
            } else {
              this.Unitload = false;
              this.UnitList = [];
            }
          },
          (err) => {
            this.Unitload = false;
            this.UnitList = [];
          }
        );
    }
  }
  close(myForm: NgForm) {
    this.drawerClose();
    this.resetDrawer(myForm);
  }
  resetDrawer(myForm: NgForm) {
    myForm.form.markAsPristine();
    myForm.form.markAsUntouched();
    this.ItemDetails = null;
    this.finalInwardArray = [];
    this.inwardDataList = [];
  }
  alphanumchar(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
  }
  alphaOnly(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;
    if (
      this.data.INWARD_DATE === null ||
      this.data.INWARD_DATE === undefined
    ) {
      this.isOk = false;
      this.message.warning('Please Select Stock Check-In Date', '');
    } else if (
      this.data.WAREHOUSE_ID === null ||
      this.data.WAREHOUSE_ID === undefined ||
      this.data.WAREHOUSE_ID === '' ||
      this.data.WAREHOUSE_ID === 0
    ) {
      this.isOk = false;
      this.message.warning('Please Select Valid Warehouse Name', '');
    } else if (this.finalInwardArray.length == 0) {
      this.isOk = false;
      this.message.error('Please Enter Valid Inventory Stock Check-In Details', '');
    }
    outerLoop: for (let i = 0; i < this.finalInwardArray.length; i++) {
      const item = this.finalInwardArray[i];
      innerLoop: for (let j = 0; j < item['INVENTORY_DETAILS'].length; j++) {
        const element = item['INVENTORY_DETAILS'][j];
        if (
          item['INVENTORY_DETAILS'][j]['IS_HAVE_VARIANTS'] != undefined &&
          item['INVENTORY_DETAILS'][j]['INWARD_VARIANT_ID'] != null &&
          item['INVENTORY_DETAILS'][j]['INWARD_VARIANT_ID'] != null
        ) {
          item['INVENTORY_DETAILS'][j]['INWARD_ITEM_ID'] =
            item['INVENTORY_DETAILS'][j]['INWARD_VARIANT_ID'];
        }
        if (element.INVENTORY_TRACKING_TYPE !== 'N' && (element.UNIQUE_NO === '')) {
          this.isOk = false;
          this.message.error(
            'Please enter valid unique number for ' + element.ITEM_NAME,
            ''
          );
          break outerLoop;
        }
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateInventory(this.data).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              this.message.success(
                'Inventory Stock Check-In Details Updated Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(
                'Failed to Update Inventory Stock Check-In Details',
                ''
              );
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        var data: any = {
          PO_NUMBER: this.finalInwardArray[0]['PO_NUMBER'],
          INWARD_DATE: this.finalInwardArray[0]['INWARD_DATE'],
          INWARD_NO: this.finalInwardArray[0]['INWARD_NO'],
          WAREHOUSE_ID: this.finalInwardArray[0]['WAREHOUSE_ID'],
          INVENTORY_DETAILS: [],
          WAREHOUSE_NAME: this.finalInwardArray[0]['WAREHOUSE_NAME'],
        };
        for (let i = 0; i < this.finalInwardArray.length; i++) {
          data['INVENTORY_DETAILS'] = [
            ...data['INVENTORY_DETAILS'],
            ...this.finalInwardArray[i]['INVENTORY_DETAILS'],
          ];
        }
        this.api.createInventoryInward(data).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              this.message.success('Inventory Stock Check-In Successfully', '');
              this.isSpinning = false;
              if (!addNew) this.drawerClose();
              else {
                this.resetDrawer(myForm);
                this.data = new InventoryInwardMasterData();
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed to Inventory Stock Check-In', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }
  getItemsAsPerSKU(SKU: string): void {
    let SKUFilter = '';
    if (SKU && SKU !== '') {
      SKUFilter = " AND SKU_CODE LIKE '%" + SKU + "%'";
    }
    outerLoop: for (let element of this.InventoryCategoryList) {
      for (let innerElement of element['children']) {
        for (let childElement of innerElement['children']) {
          if (childElement['details']['SKU_CODE'] === SKU) {
            this.data.INWARD_ITEM_ID = childElement.key;
            this.getNamesCatAndSub(this.data.INWARD_ITEM_ID);
            this.GetVariants(this.data.INWARD_ITEM_ID);
            break outerLoop;
          } else {
            this.data.INVENTORY_CATEGORY_NAME = null;
            this.data.INVENTRY_SUB_CATEGORY_NAME = null;
            this.data.INVENTRY_SUB_CATEGORY_ID = null;
            this.data.INVENTORY_CATEGORY_ID = null;
            this.data.INWARD_ITEM_ID = null;
            this.data.INWARD_ITEM_NAME = null;
            this.ItemDetails = null;
          }
        }
      }
    }
  }
  finalInwardArray: any[] = [];
  inwardDataList: any[] = [];
  inwardLoadingRecords: boolean = false;
  generateInwardData1() {
    let isOK = true;
    if (
      this.data.WAREHOUSE_ID == null ||
      this.data.WAREHOUSE_ID == undefined ||
      this.data.WAREHOUSE_ID == 0
    ) {
      isOK = false;
      this.message.warning('Please Select Valid Warehouse Name', '');
    } else if (!this.ItemDetails) {
      isOK = false;
      this.message.warning('Please Select Valid Item', '');
    }
  }
  onExpiryDateChange(data: any, i: any) {
    this.inwardDataList[i].EXPIRY_DATE = this.datePipe.transform(data, 'yyyy-MM-dd');
  }
  generateInwardData(
    inputQty: number,
    trackingType: string
  ): void {
    let isOK = true;
    if (
      this.data.WAREHOUSE_ID == null ||
      this.data.WAREHOUSE_ID == undefined ||
      this.data.WAREHOUSE_ID == 0
    ) {
      isOK = false;
      this.message.warning('Please Select Valid Warehouse Name', '');
    } else if (!this.ItemDetails) {
      isOK = false;
      this.message.warning('Please Select Valid Item', '');
    }
    else if (this.ItemDetails && this.ItemDetails['IS_HAVE_VARIANTS']) {
      if (
        this.data.INWARD_VARIANT_ID == null ||
        this.data.INWARD_VARIANT_ID == undefined ||
        this.data.INWARD_VARIANT_ID == ''
      ) {
        isOK = false;
        this.message.warning('Please Select Valid Variant', '');
      }
    } else if (
      this.data.UNIT_ID == null ||
      this.data.UNIT_ID == undefined ||
      this.data.UNIT_ID == 0
    ) {
      isOK = false;
      this.message.warning('Please Select Valid Unit', '');
    }
    if (isOK) {
      this.inwardLoadingRecords = true;
      let count = 1;
      if (trackingType === 'B') {
        count = Number(inputQty);
      } else if (trackingType === 'S' || trackingType === 'N') {
        count = Number(inputQty);
      }
      let guaranteeDays = this.guaranteeDays;
      let warrantyDays = this.warrantyDays;
      let existingRecord = this.finalInwardArray.find((record) => {
        if (this.ItemDetails.IS_HAVE_VARIANTS) {
          return ((
            (Number(record.INVENTORY_DETAILS[0].PARENT_ID) === this.ItemDetails.ID) &&
            (record.INWARD_VARIANT_ID === this.data.INWARD_VARIANT_ID) &&
            (record.UNIT_ID === this.data.UNIT_ID))
          );
        } else {
          return ((
            (Number(record.INVENTORY_DETAILS[0].INWARD_ITEM_ID) === this.ItemDetails.ID) &&
            (record.UNIT_ID === this.data.UNIT_ID))
          );
        }
      });
      if (existingRecord) {
        existingRecord.INWARD_QUANTITY = (existingRecord.INWARD_QUANTITY || 0) + inputQty;
        existingRecord.QUANTITY = (existingRecord.QUANTITY || 0) + inputQty;
        let additionalEntries = new Array(count).fill(null).map(() => ({
          ITEM_NAME: this.ItemDetails['ITEM_NAME'],
          BASE_UNIT_NAME: this.ItemDetails['BASE_UNIT_NAME'],
          PARENT_ID: this.data['PARENT_ID'],
          SKU_CODE: this.data['SKU_CODE'],
          ACTUAL_UNIT_NAME: this.data['UNIT_NAME'],
          ACTUAL_UNIT_ID: this.data['UNIT_ID'],
          INWARD_QUANTITY: inputQty,
          BASE_QUANTITY: this.ItemDetails['BASE_QUANTITY'],
          INVENTORY_TRACKING_TYPE: this.ItemDetails['INVENTORY_TRACKING_TYPE'],
          UNIQUE_NO: '',
          GUARANTTEE_IN_DAYS: guaranteeDays,
          WARANTEE_IN_DAYS: warrantyDays,
          EXPIRY_DATE: null,
          INWARD_VARIANT_ID: this.data.INWARD_VARIANT_ID || null,
          INWARD_VARIANT_NAME: this.data.INWARD_VARIANT_NAME || null,
          EXPIRY_DATE_ALLOWED: this.ItemDetails['EXPIRY_DATE_ALLOWED'],
          GUARANTEE_ALLOWED: this.ItemDetails['GUARANTEE_ALLOWED'],
          WARRANTY_ALLOWED: this.ItemDetails['WARRANTY_ALLOWED'],
          IS_VARIANT: this.data.IS_VARIANT,
          INWARD_ITEM_ID: this.data.INWARD_VARIANT_ID
            ? this.data.INWARD_VARIANT_ID
            : this.data.INWARD_ITEM_ID.split('-')[this.data.INWARD_ITEM_ID.split('-').length - 1],
          INVENTORY_CATEGORY_ID: this.data['INVENTORY_CATEGORY_ID'],
          INVENTRY_SUB_CATEGORY_ID: this.data['INVENTRY_SUB_CATEGORY_ID'],
          QUANTITY: inputQty,
          QUANTITY_PER_UNIT: this.ItemDetails['BASE_QUANTITY'],
          UNIT_ID: this.data['UNIT_ID'],
        }));
        let updatedRecord: any = { ...existingRecord, INVENTORY_DETAILS: [...existingRecord.INVENTORY_DETAILS, ...additionalEntries] };
        let index = this.finalInwardArray.findIndex(record => record === existingRecord);
        if (index !== -1) {
          this.finalInwardArray[index] = updatedRecord;
        } else {
          this.finalInwardArray.push(updatedRecord);
        }
        this.inwardDataList =
          this.finalInwardArray[this.finalInwardArray.length - 1][
          'INVENTORY_DETAILS'
          ];
        this.selectedTagIndex = this.finalInwardArray.length - 1;
      } else {
        let inwardDataList = new Array(count).fill(null).map(() => ({
          ITEM_NAME: this.ItemDetails['ITEM_NAME'],
          BASE_UNIT_NAME: this.ItemDetails['BASE_UNIT_NAME'],
          PARENT_ID: this.data['PARENT_ID'],
          SKU_CODE: this.data['SKU_CODE'],
          ACTUAL_UNIT_NAME: this.data['UNIT_NAME'],
          ACTUAL_UNIT_ID: this.data['UNIT_ID'],
          INWARD_QUANTITY: inputQty,
          BASE_QUANTITY: this.ItemDetails['BASE_QUANTITY'],
          INVENTORY_TRACKING_TYPE: this.ItemDetails['INVENTORY_TRACKING_TYPE'],
          UNIQUE_NO: '',
          GUARANTTEE_IN_DAYS: guaranteeDays,
          WARANTEE_IN_DAYS: warrantyDays,
          EXPIRY_DATE: null,
          INWARD_VARIANT_ID: this.data.INWARD_VARIANT_ID
            ? this.data.INWARD_VARIANT_ID
            : null,
          INWARD_VARIANT_NAME: this.data.INWARD_VARIANT_NAME
            ? this.data.INWARD_VARIANT_NAME
            : null,
          EXPIRY_DATE_ALLOWED: this.ItemDetails['EXPIRY_DATE_ALLOWED'],
          GUARANTEE_ALLOWED: this.ItemDetails['GUARANTEE_ALLOWED'],
          WARRANTY_ALLOWED: this.ItemDetails['WARRANTY_ALLOWED'],
          IS_VARIANT: this.data.IS_VARIANT,
          INWARD_ITEM_ID: this.data.INWARD_VARIANT_ID
            ? this.data.INWARD_VARIANT_ID
            : this.data.INWARD_ITEM_ID.split('-')[
            this.data.INWARD_ITEM_ID.split('-').length - 1
            ],
          INVENTORY_CATEGORY_ID: this.data['INVENTORY_CATEGORY_ID'],
          INVENTRY_SUB_CATEGORY_ID: this.data['INVENTRY_SUB_CATEGORY_ID'],
          QUANTITY: inputQty,
          QUANTITY_PER_UNIT: this.ItemDetails['BASE_QUANTITY'],
          UNIT_ID: this.data['UNIT_ID'],
        }));
        this.data.INWARD_DATE = this.datePipe.transform(
          this.data.INWARD_DATE,
          'yyyy-MM-dd'
        );
        this.data['INVENTORY_TRACKING_TYPE'] =
          this.ItemDetails['INVENTORY_TRACKING_TYPE'];
        this.data['QUANTITY_PER_UNIT'] = this.ItemDetails['BASE_QUANTITY'];
        this.data['ACTUAL_UNIT_NAME'] = this.ItemDetails['ACTUAL_UNIT_NAME'];
        this.data['ACTUAL_UNIT_ID'] = this.ItemDetails['ACTUAL_UNIT_ID'];
        this.data['INWARD_QUANTITY'] = this.ItemDetails['INWARD_QUANTITY'];
        this.data['UNIT_NAME'] = this.ItemDetails['BASE_UNIT_NAME'];
        this.data['BASE_UNIT_NAME'] = this.ItemDetails['BASE_UNIT_NAME'];
        this.data['BASE_UNIT_ID'] = this.ItemDetails['BASE_UNIT_ID'];
        this.data['VARIANT_NAME'] = '';
        this.data['WAREHOUSE_NAME'] = this.data.WAREHOUSE_NAME;
        this.data['INVENTORY_DETAILS'] = inwardDataList;
        this.finalInwardArray.push(JSON.parse(JSON.stringify(this.data)));
        this.inwardDataList =
          this.finalInwardArray[this.finalInwardArray.length - 1][
          'INVENTORY_DETAILS'
          ];
        this.selectedTagIndex = this.finalInwardArray.length - 1;
      }
      this.ItemDetails = null;
      this.data.QUANTITY = 1;
      this.data.INWARD_ITEM_ID = null;
      this.data.INWARD_ITEM_NAME = null;
      this.data.INWARD_VARIANT_ID = null;
      this.data.IS_VARIANT = false;
      this.data.INWARD_VARIANT_NAME = null;
      this.data.UNIT_ID = null;
      this.data.UNIT_NAME = null;
      this.data.SKU_CODE = null;
      this.UnitList = [];
      this.InwardVarientsGet = [];
      this.inwardLoadingRecords = false;
    }
  }
  disabledPastDates = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };
  onGlobalExpiryDateChange(expiryDate: any): void {
    if (expiryDate) {
      this.inwardDataList.map((item: any) => {
        if (
          item['EXPIRY_DATE_ALLOWED']
        ) {
          item['EXPIRY_DATE'] = this.datePipe.transform(expiryDate, 'yyyy-MM-dd');
        }
      });
    } else {
      this.GLOBAL_EXPIRY_DATE = null
    }
  }
  selectedTagIndex: number | null = null;
  onItemTagClick(index: number): void {
    this.selectedTagIndex = index;
    this.inwardDataList = this.finalInwardArray[index]['INVENTORY_DETAILS'];
    this.GLOBAL_EXPIRY_DATE = null;
    this.GLOBAL_GUARANTTEE_IN_DAYS = null;
    this.UNIQUE_NOGlobal = null;
    this.GLOBAL_WARRANTY_IN_DAYS = null;
  }
  onGlobalGuaranteeChange(guaranteeDays: any): void {
    this.inwardDataList.map((item: any) => {
      if (
        item['INVENTORY_TRACKING_TYPE'] === 'S' &&
        item['GUARANTEE_ALLOWED']
      ) {
        item['GUARANTTEE_IN_DAYS'] = Number(guaranteeDays);
      }
    });
  }
  onGlobalWarrantyChange(warrantyDays: any): void {
    this.inwardDataList.map((item: any) => {
      if (item['INVENTORY_TRACKING_TYPE'] === 'S' && item['WARRANTY_ALLOWED']) {
        item['WARANTEE_IN_DAYS'] = Number(warrantyDays);
      }
    });
  }
  Uniquenochange(warrantyDays: any): void {
    if (warrantyDays) {
      this.inwardDataList.map((item: any) => {
        item['UNIQUE_NO'] = warrantyDays;
      });
    } else {
      this.UNIQUE_NOGlobal = null;
    }
  }
  onItemTagClose(index: number): void {
    this.finalInwardArray.splice(index, 1);
    this.inwardDataList = [];
    if (index - 1 >= 0) {
      this.onItemTagClick(index - 1);
    }
  }
}
