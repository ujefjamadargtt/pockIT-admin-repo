import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AddVarient } from '../../inventorymodal/AddVarient';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NzPopconfirmComponent } from 'ng-zorro-antd/popconfirm';
import { InventoryMaster2111 } from '../../inventorymodal/inventoryMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DatePipe } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { appkeys } from 'src/app/app.constant';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AddInventoryImagesComponent } from '../add-inventory-images/add-inventory-images.component';
@Component({
  selector: 'app-add-varient-drawer',
  templateUrl: './add-varient-drawer.component.html',
  styleUrls: ['./add-varient-drawer.component.css'],
})
export class AddVarientDrawerComponent {
  public commonFunction = new CommonFunctionService();
  @ViewChild('confirm') confirm: NzPopconfirmComponent;
  @Input() Inventorydata;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  data: any = new AddVarient();
  dataaa11: any = new InventoryMaster2111();
  BASE_UNIT_ID;
  activeTabIndex: number = 0;
  tabs = [
    {
      name: 'Add Variant',
      disabled: false,
    },
    {
      name: 'Add Variant Details',
      disabled: true,
    },
  ];
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  isSpinning = false;
  isOk = true;
  isFocused = '';
  inputValuess1: any = [];
  isnext: boolean = false;
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['VARIENT_VALUES', 'VARIENT_VALUES'],
  ];
  AddVarientData: any = [];
  loadingRecordss: boolean = false;
  isnameFilterApplied: boolean = false;
  AppLanguagevisible = false;
  NAME;
  VARIANT_VALUES;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.getUnits();
    this.gettaxdata();
    this.getpreviousdata();
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/;
    const char = event.key;
    if (!allowedPattern.test(char)) {
      event.preventDefault();
    }
  }
  validateVariantValues(event: KeyboardEvent): void {
    const pattern = /^[a-zA-Z0-9 ._-]+$/;
    const char = event.key;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }
  handleVariantChange(): void {
    const uniqueValues = new Map<string, string>(); 
    this.data.VARIENT_VALUES.forEach((value) => {
      const lowerCaseValue = value.toLowerCase();
      if (!uniqueValues.has(lowerCaseValue)) {
        uniqueValues.set(lowerCaseValue, value);
      }
    });
    this.data.VARIENT_VALUES = Array.from(uniqueValues.values());
  }
  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.AddVarientData = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
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
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.loadingRecordss = true;
    this.api
      .getVarientData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND INVENTORY_ID = ' + this.Inventorydata.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.loadingRecordss = false;
            this.totalRecords = data['count'];
            this.AddVarientData = data['data'];
          } else {
            this.loadingRecordss = false;
            this.loadingRecords = false;
            this.AddVarientData = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecordss = false;
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
  addvarient(addNew: boolean, websitebannerPage1: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.VARIENT_VALUES == undefined ||
        this.data.VARIENT_VALUES == null ||
        this.data.VARIENT_VALUES == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Variant Name.', '');
    } else if (
      this.data.VARIENT_VALUES == null ||
      this.data.VARIENT_VALUES == undefined ||
      this.data.VARIENT_VALUES == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Values.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        this.data.CLIENT_ID = 1;
        this.data.INVENTORY_ID = this.Inventorydata.ID;
        this.data.VARIENT_VALUES = this.data.VARIENT_VALUES.join(',');
        if (this.data.ID) {
          this.api.updateVarientData(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Variant Data Updated Successfully', '');
                this.search();
                this.resetDrawer(websitebannerPage1);
                this.isSpinning = false;
              } else {
                this.message.error('Variant Updation Failed', '');
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
          this.api.CreateVarientData(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Variant Created Successfully', '');
                this.resetDrawer(websitebannerPage1);
                this.search();
                this.isSpinning = false;
              } else {
                this.message.error('Variant Creation Failed...', '');
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
  }
  resetDrawer(websitebannerPage1: NgForm) {
    this.data = new AddVarient();
    websitebannerPage1.form.markAsPristine();
    websitebannerPage1.form.markAsUntouched();
  }
  edit(data) {
    this.data = Object.assign({}, data);
    this.data.VARIENT_VALUES = data.VARIENT_VALUES
      ? data.VARIENT_VALUES.split(',')
      : [];
  }
  saveNextFinal() {
    if (this.isOk) {
      this.activeTabIndex = 1;
      this.switchValue = true;
    }
    this.generateCombinations();
    this.dataList.forEach((data) => {
      if (
        !data.BASE_QUANTITY ||
        data.BASE_QUANTITY == 0 ||
        data.BASE_QUANTITY == null ||
        data.BASE_QUANTITY == undefined ||
        data.BASE_QUANTITY == ''
      ) {
        data.BASE_QUANTITY = 1;
      }
    });
  }
  cancelNextFinal() {
    this.switchValue = true;
  }
  next() {
    this.isOk = true;
    if (
      !this.AddVarientData ||
      this.AddVarientData.length === 0 ||
      this.AddVarientData.length === null ||
      this.AddVarientData.length === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Add Atleast 1 Variant', '');
      this.switchValue = true;
    } else {
      this.switchValue = false;
    }
  }
  variantCombinations: any = [];
  UnitList: any = [];
  close() {
    this.drawerClose();
  }
  back() {
    this.activeTabIndex = 0;
    this.isnext = true;
    this.dataList = [];
    this.getpreviousdata();
  }
  cancel() { }
  previousVariantCombinations: any = [];
  cartesianProduct(arrays: string[][]): string[] {
    return arrays.reduce((acc, currentArray) => {
      if (acc.length === 0) return currentArray;
      let result: string[] = [];
      acc.forEach((prev) => {
        currentArray.forEach((curr) => {
          result.push(prev + '-' + curr);
        });
      });
      return result;
    });
  }
  Combination_valuesss: any = [];
  searchText11: string = '';
  pageIndex11 = 1;
  pageSize11 = 10;
  sortKey11: string = 'NAME';
  sortValue11: string = 'desc';
  loadingRecords11 = false;
  totalRecords11 = 1;
  sort11(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex11 = pageIndex;
    this.pageSize11 = pageSize;
    if (this.pageSize11 != pageSize) {
      this.pageIndex11 = 1;
      this.pageSize11 = pageSize;
    }
    if (this.sortKey11 != sortField) {
      this.pageIndex11 = 1;
      this.pageSize11 = pageSize;
    }
    this.sortKey11 = sortField;
    this.sortValue11 = sortOrder;
    this.search11();
  }
  search11(reset: boolean = false) {
    if (
      this.searchText11.trim().length < 3 &&
      this.searchText11.trim().length !== 0
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
    this.api.getInventory(0, 0, this.sortKey, sort, likeQuery).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loadingRecords11 = false;
          this.totalRecords11 = data['count'];
        } else {
          this.loadingRecords11 = false;
          this.message.error('Failed to get Inventory Records', '');
        }
      },
      (err) => {
        this.loadingRecords11 = false;
        this.dataList = [];
        this.message.error('Failed To Get Inventory Records', '');
      }
    );
  }
  warehouseList: any = [];
  taxData: any = [];
  addcombinationvalues() {
    if (this.Combination_valuesss.length == 0) {
      this.message.error('Please Select Combination Values', '');
      return;
    }
    var array: any = [];
    this.Combination_valuesss.forEach((element) => {
      array.push({
        VARIANT_COMBINATION: element,
        ID: null,
        ITEM_NAME: this.Inventorydata.ITEM_NAME || null,
        IS_REFURBISHED: this.Inventorydata.IS_REFURBISHED || false,
        BRAND_ID: this.Inventorydata.BRAND_ID || null,
        BRAND_NAME: this.Inventorydata.BRAND_NAME || null,
        INVENTORY_CATEGORY_ID: this.Inventorydata.INVENTORY_CATEGORY_ID || null,
        INVENTRY_SUB_CATEGORY_ID:
          this.Inventorydata.INVENTRY_SUB_CATEGORY_ID || null,
        UNIT_ID: null,
        DATE_OF_ENTRY: new Date(), 
        STATUS: true,
        RETURN_ALOW: false,
        BASE_UNIT_ID: null,
        AVG_LEVEL: null,
        REORDER_STOCK_LEVEL: null,
        ALERT_STOCK_LEVEL: null,
        HSN_ID: null,
        TAX_PREFERENCE: null,
        TAX_ID: null,
        IS_HAVE_VARIANTS: false,
        IS_SET: false,
        DESCRIPTION: null,
        INVENTORY_CATEGORY_NAME:
          this.Inventorydata.INVENTORY_CATEGORY_NAME || null,
        INVENTRY_SUB_CATEGORY_NAME:
          this.Inventorydata.INVENTRY_SUB_CATEGORY_NAME || null,
        BASE_UNIT_NAME: null,
        HSN_NAME: null,
        TAX_NAME: null,
        UNIT_NAME: null,
        SHORT_CODE: null,
        QUANTITY: null,
        SELLING_PRICE: null,
        BASE_QUANTITY: null,
        INVENTORY_TRACKING_TYPE: 'N',
      });
    });
    this.Combination_valuesss = [];
    this.dataList = [...this.dataList, ...array];
    this.totalRecords11 = this.dataList.length;
  }
  Unitload: boolean = false;
  getUnits() {
    this.Unitload = true;
    this.api.getUnitData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1').subscribe(
      (unitdata) => {
        if (unitdata.code == 200) {
          this.Unitload = false;
          this.UnitList = unitdata['data'];
          if (!this.data.ID) {
            if (unitdata['count'] > 0) {
            }
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
  gettaxdata() {
    this.api
      .getTaxData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.taxData = data['data'];
        } else {
          this.taxData = [];
        }
      });
  }
  getWarehouses() {
    this.api.getWarehouses(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.warehouseList = data['data'];
        } else {
          this.warehouseList = [];
        }
      },
      (err) => {
        this.warehouseList = [];
      }
    );
  }
  onSetChange(event: any, i: any) {
    this.dataList[i].BASE_QUANTITY = null;
  }
  onTaxPreferenceChange(event: any, i: any) {
    if (event == 'NT') this.dataList[i].TAX_ID = null;
    this.onChangeTax(this.dataList[i].TAX_ID, i);
  }
  updateSingleRow(dataaaaa: any, ii: any) {
    if (dataaaaa.WAREHOUSE_ID) {
      dataaaaa.WAREHOUSE_ID = dataaaaa.WAREHOUSE_ID.join(',');
    } else {
      dataaaaa.WAREHOUSE_ID = null;
    }
    this.loadingRecords11 = true;
    if (
      dataaaaa.BASE_UNIT_ID === null ||
      dataaaaa.BASE_UNIT_ID === undefined ||
      dataaaaa.BASE_UNIT_ID === '' ||
      dataaaaa.BASE_UNIT_ID === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Select Base Unit', '');
    } else if (
      dataaaaa.BASE_QUANTITY === null ||
      dataaaaa.BASE_QUANTITY === undefined ||
      dataaaaa.BASE_QUANTITY === '' ||
      dataaaaa.BASE_QUANTITY === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Quantity Per Unit', '');
    } else if (
      dataaaaa.SELLING_PRICE === null ||
      dataaaaa.SELLING_PRICE === undefined ||
      dataaaaa.SELLING_PRICE === '' ||
      dataaaaa.SELLING_PRICE === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Selling Price', '');
    } else if (
      dataaaaa.TAX_PREFERENCE === null ||
      dataaaaa.TAX_PREFERENCE === undefined ||
      dataaaaa.TAX_PREFERENCE === ''
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Select Tax Prefrance', '');
    } else if (
      (dataaaaa.TAX_ID === null ||
        dataaaaa.TAX_ID === undefined ||
        dataaaaa.TAX_ID === '' ||
        dataaaaa.TAX_ID === 0) &&
      dataaaaa.TAX_PREFERENCE == 'T'
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Select Tax Slab', '');
    }
    else if (
      dataaaaa.AVG_LEVEL === null ||
      dataaaaa.AVG_LEVEL === undefined ||
      dataaaaa.AVG_LEVEL === '' ||
      dataaaaa.AVG_LEVEL === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Average Stock Level', '');
    } else if (
      dataaaaa.REORDER_STOCK_LEVEL === null ||
      dataaaaa.REORDER_STOCK_LEVEL === undefined ||
      dataaaaa.REORDER_STOCK_LEVEL === '' ||
      dataaaaa.REORDER_STOCK_LEVEL === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Re-Order Stock Level', '');
    } else if (
      dataaaaa.ALERT_STOCK_LEVEL === null ||
      dataaaaa.ALERT_STOCK_LEVEL === undefined ||
      dataaaaa.ALERT_STOCK_LEVEL === '' ||
      dataaaaa.ALERT_STOCK_LEVEL === 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Alert Stock Level', '');
    }
    else if (
      (dataaaaa.WARRANTY_ALLOWED &&
        (dataaaaa.WARRANTY_PERIOD == null ||
          dataaaaa.WARRANTY_PERIOD == undefined ||
          String(dataaaaa.WARRANTY_PERIOD) == '')) ||
      dataaaaa.WARRANTY_PERIOD == 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Valid Warranty Period', '');
    } else if (
      dataaaaa.WARRANTY_ALLOWED &&
      (dataaaaa.WARRANTY_CARD == null ||
        dataaaaa.WARRANTY_CARD == undefined ||
        String(dataaaaa.WARRANTY_CARD) == '')
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Upload Warranty Card', '');
    } else if (dataaaaa.GUARANTEE_ALLOWED) {
      if (
        dataaaaa.GUARANTEE_PERIOD == null ||
        dataaaaa.GUARANTEE_PERIOD == undefined ||
        String(dataaaaa.GUARANTEE_PERIOD) == ''
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error('Please Enter Valid Guarantee Period', '');
      }
    } else if (dataaaaa.RETURN_ALOW) {
      if (
        dataaaaa.RETURN_ALLOW_PERIOD == null ||
        dataaaaa.RETURN_ALLOW_PERIOD == undefined ||
        String(dataaaaa.RETURN_ALLOW_PERIOD) == ''
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error('Please Enter Valid Returning Period', '');
      }
    } else if (dataaaaa.DISCOUNT_ALLOWED) {
      if (
        dataaaaa.DISCOUNTED_PRICE == null ||
        dataaaaa.DISCOUNTED_PRICE == undefined ||
        String(dataaaaa.DISCOUNTED_PRICE) == ''
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error('Please Enter Valid Discount Period', '');
      }
    } else if (dataaaaa.REPLACEMENT_ALLOW) {
      if (
        dataaaaa.REPLACEMENT_PERIOD == null ||
        dataaaaa.REPLACEMENT_PERIOD == undefined ||
        String(dataaaaa.REPLACEMENT_PERIOD) == ''
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error('Please Enter Valid Replacement Period', '');
      }
    } else if (
      dataaaaa.EXPECTED_DELIVERY_IN_DAYS == null ||
      dataaaaa.EXPECTED_DELIVERY_IN_DAYS == undefined ||
      String(dataaaaa.EXPECTED_DELIVERY_IN_DAYS) == '' ||
      dataaaaa.EXPECTED_DELIVERY_IN_DAYS == 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Expected Delivery Days ', '');
      return;
    } else if (
      dataaaaa.EXPECTED_DELIVERY_CHARGES == null ||
      dataaaaa.EXPECTED_DELIVERY_CHARGES == undefined ||
      String(dataaaaa.EXPECTED_DELIVERY_CHARGES) == '' ||
      dataaaaa.EXPECTED_DELIVERY_CHARGES == 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Expected Delivery Charges ', '');
      return;
    } else if (
      dataaaaa.SHORT_CODE == null ||
      dataaaaa.SHORT_CODE == undefined ||
      String(dataaaaa.SHORT_CODE) == '' ||
      dataaaaa.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.loadingRecords11 = false;
      this.message.error('Please Enter Short Code ', '');
      return;
    } else {
      dataaaaa.BASE_UNIT_NAME = this.UnitList.find(
        (x: any) => x.ID == dataaaaa.BASE_UNIT_ID
      )?.NAME;
      if (dataaaaa.ID) {
        this.api.updateInventory(dataaaaa).subscribe(
          (successCode: HttpResponse<any>) => {
            if (successCode.status === 200) {
              this.message.success('Variants Details Updated Successfully', '');
              this.loadingRecords11 = false;
              this.isSpinning = false;
              this.loadingRecords11 = false;
            } else {
              this.message.error('Variants Details Not Updated', '');
              this.isSpinning = false;
              this.loadingRecords11 = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
            this.loadingRecords11 = false;
          }
        );
      } else {
        dataaaaa.DATE_OF_ENTRY = this.datePipe.transform(
          dataaaaa.DATE_OF_ENTRY,
          'yyyy-MM-dd'
        );
        this.api.createInventory(dataaaaa).subscribe(
          (successCode: HttpResponse<any>) => {
            if (successCode.status === 200) {
              this.dataList[ii].ID = successCode.body.ID;
              this.message.success('Variants Saved Successfully', '');
              this.isSpinning = false;
              this.loadingRecords11 = false;
              this.isSpinning = false;
            } else {
              this.message.error('Variants Not Saved', '');
              this.isSpinning = false;
              this.loadingRecords11 = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
            this.loadingRecords11 = false;
          }
        );
      }
    }
  }
  Savealldata() {
    this.isOk = true;
    for (var i = 0; i < this.dataList.length; i++) {
      if (
        this.dataList[i].BASE_UNIT_ID === null ||
        this.dataList[i].BASE_UNIT_ID === undefined ||
        this.dataList[i].BASE_UNIT_ID === '' ||
        this.dataList[i].BASE_UNIT_ID === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Select Base Unit for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].BASE_QUANTITY === null ||
        this.dataList[i].BASE_QUANTITY === undefined ||
        this.dataList[i].BASE_QUANTITY === '' ||
        this.dataList[i].BASE_QUANTITY === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Quantity Per Unit for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].BASE_PRICE === null ||
        this.dataList[i].BASE_PRICE === undefined ||
        this.dataList[i].BASE_PRICE === '' ||
        this.dataList[i].BASE_PRICE === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Base Price for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].SELLING_PRICE === null ||
        this.dataList[i].SELLING_PRICE === undefined ||
        this.dataList[i].SELLING_PRICE === '' ||
        this.dataList[i].SELLING_PRICE === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Selling Price for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].TAX_PREFERENCE === null ||
        this.dataList[i].TAX_PREFERENCE === undefined ||
        this.dataList[i].TAX_PREFERENCE === ''
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Select Tax Prefrance for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        (this.dataList[i].TAX_ID === null ||
          this.dataList[i].TAX_ID === undefined ||
          this.dataList[i].TAX_ID === '') &&
        this.dataList[i].TAX_PREFERENCE == 'T'
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Select Tax Slab for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].AVG_LEVEL === null ||
        this.dataList[i].AVG_LEVEL === undefined ||
        this.dataList[i].AVG_LEVEL === '' ||
        this.dataList[i].AVG_LEVEL === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Average Stock Level for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].REORDER_STOCK_LEVEL === null ||
        this.dataList[i].REORDER_STOCK_LEVEL === undefined ||
        this.dataList[i].REORDER_STOCK_LEVEL === '' ||
        this.dataList[i].REORDER_STOCK_LEVEL === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Re-Order Stock Level for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].ALERT_STOCK_LEVEL === null ||
        this.dataList[i].ALERT_STOCK_LEVEL === undefined ||
        this.dataList[i].ALERT_STOCK_LEVEL === '' ||
        this.dataList[i].ALERT_STOCK_LEVEL === 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Alert Stock Level for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      }
      else if (
        this.dataList[i].WARRANTY_ALLOWED &&
        (this.dataList[i].WARRANTY_PERIOD == null ||
          this.dataList[i].WARRANTY_PERIOD == undefined ||
          String(this.dataList[i].WARRANTY_PERIOD) == '' ||
          this.dataList[i].WARRANTY_PERIOD == 0)
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Valid Warranty Period for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].WARRANTY_ALLOWED &&
        (this.dataList[i].WARRANTY_CARD == null ||
          this.dataList[i].WARRANTY_CARD == undefined ||
          String(this.dataList[i].WARRANTY_CARD) == '')
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Upload Warranty Card for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].GUARANTEE_ALLOWED &&
        (this.dataList[i].GUARANTEE_PERIOD == null ||
          this.dataList[i].GUARANTEE_PERIOD == undefined ||
          String(this.dataList[i].GUARANTEE_PERIOD) == '')
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Valid Guarantee Period for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].RETURN_ALOW &&
        (this.dataList[i].RETURN_ALLOW_PERIOD == null ||
          this.dataList[i].RETURN_ALLOW_PERIOD == undefined ||
          String(this.dataList[i].RETURN_ALLOW_PERIOD) == '')
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Valid Returning Period for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].DISCOUNT_ALLOWED &&
        (this.dataList[i].DISCOUNTED_PRICE == null ||
          this.dataList[i].DISCOUNTED_PRICE == undefined ||
          String(this.dataList[i].DISCOUNTED_PRICE) == '')
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Valid Discount Period for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].DISCOUNT_ALLOWED &&
        (Number(this.dataList[i].SELLING_PRICE) <
          Number(this.dataList[i].DISCOUNTED_PRICE))
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Discounted price must be less than selling price for ' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (this.dataList[i].REPLACEMENT_ALLOW) {
        if (
          this.dataList[i].REPLACEMENT_PERIOD == null ||
          this.dataList[i].REPLACEMENT_PERIOD == undefined ||
          String(this.dataList[i].REPLACEMENT_PERIOD) == ''
        ) {
          this.isOk = false;
          this.loadingRecords11 = false;
          this.message.error(
            'Please Enter Valid Replacement Period for' +
            this.dataList[i]['VARIANT_COMBINATION'],
            ''
          );
          return;
        }
      } else if (
        this.dataList[i].EXPECTED_DELIVERY_IN_DAYS == null ||
        this.dataList[i].EXPECTED_DELIVERY_IN_DAYS == undefined ||
        String(this.dataList[i].EXPECTED_DELIVERY_IN_DAYS) == '' ||
        this.dataList[i].EXPECTED_DELIVERY_IN_DAYS == 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Expected Delivery Days for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].EXPECTED_DELIVERY_CHARGES == null ||
        this.dataList[i].EXPECTED_DELIVERY_CHARGES == undefined ||
        String(this.dataList[i].EXPECTED_DELIVERY_CHARGES) == '' ||
        this.dataList[i].EXPECTED_DELIVERY_CHARGES == 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Expected Delivery Charges for' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      } else if (
        this.dataList[i].SHORT_CODE == null ||
        this.dataList[i].SHORT_CODE == undefined ||
        String(this.dataList[i].SHORT_CODE) == '' ||
        this.dataList[i].SHORT_CODE == 0
      ) {
        this.isOk = false;
        this.loadingRecords11 = false;
        this.message.error(
          'Please Enter Short Code For ' +
          this.dataList[i]['VARIANT_COMBINATION'],
          ''
        );
        return;
      }
      this.dataList[i].DATE_OF_ENTRY = this.datePipe.transform(
        this.dataList[i].DATE_OF_ENTRY,
        'yyyy-MM-dd'
      );
      this.dataList[i].BASE_UNIT_NAME = this.UnitList.find(
        (x: any) => x.ID == this.dataList[i].BASE_UNIT_ID
      )?.NAME;
      if (i == this.dataList.length - 1) {
        if (this.isOk) {
          this.switchValue = false;
        } else {
          this.loadingRecords11 = false;
          this.isSpinning = false;
        }
      }
    }
  }
  cancelFinal() {
    this.loadingRecords11 = false;
    this.isSpinning = false;
  }
  switchValue = true;
  saveFinal() {
    this.loadingRecords11 = true;
    this.isSpinning = true;
    if (this.isOk) {
      var dataaaaaa: any = [...this.dataList];
      dataaaaaa.forEach((item: any) => {
        item.WAREHOUSE_ID = Array.isArray(item.WAREHOUSE_ID)
          ? item.WAREHOUSE_ID.join(',')
          : item.WAREHOUSE_ID;
        item.REPLACEMENT_ALLOW =
          item.REPLACEMENT_ALLOW == null ||
            item.REPLACEMENT_ALLOW == undefined ||
            item.REPLACEMENT_ALLOW == false
            ? 0
            : 1;
        item.RETURN_ALOW =
          item.RETURN_ALOW == null ||
            item.RETURN_ALOW == undefined ||
            item.RETURN_ALOW == false
            ? 0
            : 1;
      });
      var dataa2 = {
        DATA: dataaaaaa,
      };
      this.api.addupdatebulkdata(dataa2).subscribe(
        (successCode: HttpResponse<any>) => {
          if (successCode.status === 200 && successCode.body.code === 200) {
            this.message.success('Variant Details Saved Successfully', '');
            this.isSpinning = false;
            this.loadingRecords11 = false;
            this.drawerClose();
            this.isSpinning = false;
          } else if (successCode.body.code === 300) {
            this.message.info(successCode.body.message, '');
            this.isSpinning = false;
            this.loadingRecords11 = false;
            this.isSpinning = false;
          } else {
            this.message.error('Variant Not Saved', '');
            this.isSpinning = false;
            this.loadingRecords11 = false;
          }
        },
        (err) => {
          this.isSpinning = false;
          this.loadingRecords11 = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
    } else {
      this.isSpinning = false;
      this.loadingRecords11 = false;
    }
  }
  dataList111: any = [];
  getpreviousdata() {
    this.isSpinning = true;
    this.api
      .getInventory(0, 0, '', '', ' AND PARENT_ID = ' + this.Inventorydata.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList111 = data['data'];
            this.previousVariantCombinations = data['data'];
            this.dataaa11 = this.previousVariantCombinations;
            this.dataList111 = this.previousVariantCombinations;
            this.isSpinning = false;
          } else {
            this.previousVariantCombinations = [];
            this.loadingRecords = false;
            this.message.error('Failed to get Inventory Records', '');
            this.previousVariantCombinations = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          this.previousVariantCombinations = [];
          this.loadingRecords = false;
          this.isSpinning = false;
          this.message.error('Failed To Get Inventory Records', '');
        }
      );
  }
  onWarehousechange(warehouseid: any) {
    if (warehouseid && warehouseid.length > 0) {
      let selectedWarehouses = this.warehouseList.filter((warehouse) =>
        warehouseid.includes(warehouse.ID)
      );
      if (selectedWarehouses.length > 0) {
        this.data.WAREHOUSE_NAME = selectedWarehouses
          .map((w) => w.NAME)
          .join(', ');
      } else {
        this.data.WAREHOUSE_NAME = null;
      }
    } else {
      this.data.WAREHOUSE_NAME = null;
    }
  }
  generateCombinations() {
    this.loadingRecords11 = true;
    let variantArrays = this.AddVarientData.map((item) =>
      item.VARIENT_VALUES.split(',').map((value) => value.toLowerCase())
    );
    let newCombinations = this.cartesianProduct(variantArrays);
    let previousSet = new Set(
      this.previousVariantCombinations.map((item) => item.VARIANT_COMBINATION)
    );
    let updatedCombinations: any = [];
    newCombinations.forEach((combination) => {
      if (!previousSet.has(combination)) {
        updatedCombinations.push(
          this.createVariantObject(combination, false, '')
        );
      }
    });
    this.previousVariantCombinations.forEach((oldCombination) => {
      let isDisabled = !newCombinations.includes(
        oldCombination.VARIANT_COMBINATION
      );
      updatedCombinations.push(
        this.createVariantObject(
          oldCombination.VARIANT_COMBINATION,
          isDisabled,
          oldCombination
        )
      );
    });
    this.variantCombinations = updatedCombinations;
    this.previousVariantCombinations = [...updatedCombinations];
    this.dataList = this.previousVariantCombinations;
    this.loadingRecords11 = false;
  }
  dataList: any = [
    {
      BASE_QUANTITY: 0, 
      WAREHOUSE_ID: [] as number[], 
    },
  ];
  createVariantObject(
    variantCombination: any,
    isDisabled: any,
    oldData: any = {}
  ) {
    return {
      VARIANT_COMBINATION: variantCombination,
      IS_DISABLED: isDisabled,
      ID: oldData.ID || null,
      PARENT_ID: this.Inventorydata.ID,
      IS_REFURBISHED: oldData.IS_REFURBISHED || this.Inventorydata.IS_REFURBISHED || false,
      ITEM_NAME: oldData.ITEM_NAME || this.Inventorydata.ITEM_NAME || null,
      BRAND_ID: oldData.BRAND_ID || this.Inventorydata.BRAND_ID || null,
      BRAND_NAME: oldData.BRAND_NAME || this.Inventorydata.BRAND_NAME || null,
      IS_NEW: oldData.IS_NEW || this.Inventorydata.IS_NEW || 0,
      INVENTORY_TYPE:
        oldData.INVENTORY_TYPE || this.Inventorydata.INVENTORY_TYPE || null,
      INVENTORY_CATEGORY_ID:
        oldData.INVENTORY_CATEGORY_ID ||
        this.Inventorydata.INVENTORY_CATEGORY_ID ||
        null,
      INVENTRY_SUB_CATEGORY_ID:
        oldData.INVENTRY_SUB_CATEGORY_ID ||
        this.Inventorydata.INVENTRY_SUB_CATEGORY_ID ||
        null,
      UNIT_ID: oldData.UNIT_ID || null,
      DATE_OF_ENTRY: oldData.DATE_OF_ENTRY || new Date(),
      STATUS: oldData.STATUS === 1 ? true : false,
      RETURN_ALOW: oldData.RETURN_ALOW,
      BASE_UNIT_ID: oldData.BASE_UNIT_ID || null,
      AVG_LEVEL: oldData.AVG_LEVEL || null,
      REORDER_STOCK_LEVEL: oldData.REORDER_STOCK_LEVEL || null,
      ALERT_STOCK_LEVEL: oldData.ALERT_STOCK_LEVEL || null,
      HSN_ID: oldData.HSN_ID || this.Inventorydata.HSN_ID || null,
      TAX_PREFERENCE: oldData.TAX_PREFERENCE || null,
      TAX_ID: oldData.TAX_ID || null,
      IS_HAVE_VARIANTS: oldData.IS_HAVE_VARIANTS || false,
      IS_SET: oldData.IS_SET || false,
      DESCRIPTION:
        oldData.DESCRIPTION || this.Inventorydata.DESCRIPTION || null,
      INVENTORY_CATEGORY_NAME:
        oldData.INVENTORY_CATEGORY_NAME ||
        this.Inventorydata.INVENTORY_CATEGORY_NAME ||
        null,
      INVENTRY_SUB_CATEGORY_NAME:
        oldData.INVENTRY_SUB_CATEGORY_NAME ||
        this.Inventorydata.INVENTRY_SUB_CATEGORY_NAME ||
        null,
      BASE_UNIT_NAME: oldData.BASE_UNIT_NAME || null,
      HSN_NAME: oldData.HSN_NAME || this.Inventorydata.HSN_NAME || null,
      TAX_NAME: oldData.TAX_NAME || null,
      UNIT_NAME: oldData.UNIT_NAME || null,
      QUANTITY: oldData.QUANTITY || null,
      SELLING_PRICE: oldData.SELLING_PRICE || null,
      BASE_PRICE: oldData.BASE_PRICE || null,
      BASE_QUANTITY: oldData.BASE_QUANTITY || null,
      SKU_CODE: oldData.SKU_CODE || null,
      INVENTORY_TRACKING_TYPE: oldData.INVENTORY_TRACKING_TYPE || 'N',
      EXPIRY_DATE_ALLOWED: oldData.EXPIRY_DATE_ALLOWED || null,
      GUARANTEE_ALLOWED: oldData.GUARANTEE_ALLOWED || null,
      WARRANTY_ALLOWED: oldData.WARRANTY_ALLOWED || null,
      WARRANTY_PERIOD: oldData.WARRANTY_PERIOD || 0,
      WARRANTY_CARD: oldData.WARRANTY_CARD || null,
      INVENTORY_DETAILS_IMAGE: oldData.INVENTORY_DETAILS_IMAGE || null,
      GUARANTEE_PERIOD: oldData.GUARANTEE_PERIOD || 0,
      RETURN_ALLOW_PERIOD: oldData.RETURN_ALLOW_PERIOD || 0,
      DISCOUNT_ALLOWED: oldData.DISCOUNT_ALLOWED || false,
      DISCOUNTED_PRICE: oldData.DISCOUNTED_PRICE || 0,
      REPLACEMENT_ALLOW: oldData.REPLACEMENT_ALLOW || false,
      REPLACEMENT_PERIOD: oldData.REPLACEMENT_PERIOD || 0,
      EXPECTED_DELIVERY_IN_DAYS: oldData.EXPECTED_DELIVERY_IN_DAYS || 0,
      SHORT_CODE: oldData.SHORT_CODE || null,
      EXPECTED_DELIVERY_CHARGES: oldData.EXPECTED_DELIVERY_CHARGES || 0,
    };
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
  setDefaultBaseQuantity(index: number) {
    if (
      !this.dataList[index].BASE_QUANTITY ||
      this.dataList[index].BASE_QUANTITY === ''
    ) {
      this.dataList[index].BASE_QUANTITY = '1';
    }
  }
  changeTrackingType(event: any, rowData: any) {
    if (event === 'B') {
      rowData.WARRANTY_ALLOWED = false;
      rowData.GUARANTEE_ALLOWED = false;
      rowData['WARRANTY_CARD'] = null;
      rowData['fileURL'] = null;
      rowData['WARRANTY_PERIOD'] = 0;
      rowData['GUARANTEE_PERIOD'] = 0;
    } else if (event === 'N') {
      rowData.EXPIRY_DATE_ALLOWED = null;
      rowData.WARRANTY_ALLOWED = null;
      rowData.GUARANTEE_ALLOWED = null;
      rowData['WARRANTY_CARD'] = null;
      rowData['fileURL'] = null;
      rowData['WARRANTY_PERIOD'] = 0;
      rowData['GUARANTEE_PERIOD'] = 0;
    } else {
      rowData.WARRANTY_ALLOWED = false;
      rowData.GUARANTEE_ALLOWED = false;
      rowData.EXPIRY_DATE_ALLOWED = false;
      rowData['WARRANTY_CARD'] = null;
      rowData['fileURL'] = null;
      rowData['WARRANTY_PERIOD'] = 0;
      rowData['GUARANTEE_PERIOD'] = 0;
    }
  }
  warrantyAllowChange(event, i) {
    if (!event) {
      this.dataList[i].WARRANTY_PERIOD = 0;
      this.dataList[i].WARRANTY_CARD = '';
      this.dataList[i].fileURL = null;
    }
  }
  guaranteeAllowChange(event, i) {
    if (!event) {
      this.dataList[i].GUARANTEE_PERIOD = 0;
    }
  }
  returnStatusChange(event, i) {
    if (!event) {
      this.dataList[i].RETURN_ALLOW_PERIOD = 0;
    }
  }
  onGlobalUnitChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['BASE_UNIT_ID'] = Number(data);
    });
  }
  TAX_PREFERENCE;
  onGlobalTaxableChange(data: any): void {
    this.dataList.map((item: any, index) => {
      if (item.ID == null) item['TAX_PREFERENCE'] = data;
      if (data == 'NT') {
        if (item.ID == null) item['TAX_ID'] = null;
        this.TAX_ID = null;
      }
      this.onChangeTax(item['TAX_PREFERENCE'], index);
    });
    this.onChangeTax2(data);
  }
  TAX_ID;
  onGlobalTaxChange(data: any): void {
    this.onTaxChange2(data);
    this.dataList.map((item: any, index) => {
      if (item['TAX_PREFERENCE'] == 'T') {
        if (item.ID == null) {
          item['TAX_ID'] = data;
          this.onTaxChange(item['TAX_ID'], index);
        }
      }
    });
  }
  onChangeTax(event: any, index) {
    this.dataList[index].SELLING_PRICE = null;
    this.dataList[index].DISCOUNTED_PRICE = 0;
    if (event === 'T') {
    } else {
      this.dataList[index].TAX_ID = 0;
      this.dataList[index].SELLING_PRICE = this.dataList[index].BASE_PRICE;
      if (this.dataList[index].DISCOUNT_ALLOWED) {
        this.dataList[index].DISCOUNTED_PRICE = 0;
      }
    }
  }
  onChangeTax2(event: any) {
    this.PURCHASE_PRICE = null;
    this.DISCOUNT_PRICE_ALL = 0;
    if (event === 'T') {
    } else {
      this.TAX_ID = 0;
      this.PURCHASE_PRICE = this.BASE_PRICE;
      if (this.IS_DISCOUNT_ALLOWED_ALL) {
        this.DISCOUNT_PRICE_ALL = 0;
      }
    }
  }
  onTaxChange2(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        if (this.BASE_PRICE && this.BASE_PRICE > 0) {
          this.PURCHASE_PRICE = this.calculateTotalPrice(
            this.BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.IS_DISCOUNT_ALLOWED_ALL) {
            this.DISCOUNT_PRICE_ALL = 0;
          }
        }
      } else {
      }
      this.TAX_ID = selectedId;
    } else {
      this.PURCHASE_PRICE = this.BASE_PRICE;
      if (this.IS_DISCOUNT_ALLOWED_ALL) {
        this.DISCOUNT_PRICE_ALL = 0;
      }
      this.TAX_ID = null;
    }
  }
  onTaxChange(selectedId: any, index): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.dataList[index].TAX_NAME = selectedProduct['NAME'];
        if (
          this.dataList[index].BASE_PRICE &&
          this.dataList[index].BASE_PRICE > 0
        ) {
          this.dataList[index].SELLING_PRICE = this.calculateTotalPrice(
            this.dataList[index].BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.dataList[index].DISCOUNT_ALLOWED) {
            this.dataList[index].DISCOUNTED_PRICE = 0;
          }
        }
      } else {
        this.dataList[index].TAX_NAME = null;
      }
      this.dataList[index].TAX_ID = selectedId;
    } else {
      this.dataList[index].TAX_NAME = null;
      this.dataList[index].SELLING_PRICE = this.dataList[index].BASE_PRICE;
      if (this.dataList[index].DISCOUNT_ALLOWED) {
        this.dataList[index].DISCOUNTED_PRICE = 0;
      }
      this.dataList[index].TAX_ID = null;
    }
  }
  SKU_CODE;
  onGlobalSKUChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['SKU_CODE'] = data;
    });
  }
  BASE_PRICE;
  onGlobalBASE_PRICEChange(data: any): void {
    this.onBasePriceChange2(data);
    this.dataList.map((item: any, index) => {
      if (item.ID == null) {
        item['BASE_PRICE'] = data;
        this.onBasePriceChange(item['BASE_PRICE'], index);
      }
    });
  }
  onBasePriceChange(event, index) {
    if (event && this.dataList[index].TAX_ID) {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === this.dataList[index].TAX_ID
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        if (
          this.dataList[index].BASE_PRICE &&
          this.dataList[index].BASE_PRICE > 0
        ) {
          this.dataList[index].SELLING_PRICE = this.calculateTotalPrice(
            this.dataList[index].BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.dataList[index].DISCOUNT_ALLOWED) {
            this.dataList[index].DISCOUNTED_PRICE = 0;
          }
        }
      } else {
        this.dataList[index].SELLING_PRICE = event;
        if (this.dataList[index].DISCOUNT_ALLOWED) {
          this.dataList[index].DISCOUNTED_PRICE = 0;
        }
      }
    } else {
      this.dataList[index].SELLING_PRICE = event;
      if (this.dataList[index].DISCOUNT_ALLOWED) {
        this.dataList[index].DISCOUNTED_PRICE = 0;
      }
    }
  }
  onBasePriceChange2(event) {
    if (event && this.TAX_ID) {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === this.TAX_ID
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        if (this.BASE_PRICE && this.BASE_PRICE > 0) {
          this.PURCHASE_PRICE = this.calculateTotalPrice(
            this.BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.IS_DISCOUNT_ALLOWED_ALL) {
            this.DISCOUNT_PRICE_ALL = 0;
          }
        }
      } else {
        this.PURCHASE_PRICE = event;
        if (this.IS_DISCOUNT_ALLOWED_ALL) {
          this.DISCOUNT_PRICE_ALL = 0;
        }
      }
    } else {
      this.PURCHASE_PRICE = event;
      if (this.IS_DISCOUNT_ALLOWED_ALL) {
        this.DISCOUNT_PRICE_ALL = 0;
      }
    }
  }
  onSellingPriceChange2(event) {
    if (event && event > 0 && this.IS_DISCOUNT_ALLOWED_ALL) {
      this.DISCOUNT_PRICE_ALL = 0;
    } else {
      this.DISCOUNT_PRICE_ALL = 0;
    }
  }
  calculateTotalPrice(price: number, taxRate: number): number {
    const taxAmount = this.calculateTax(Number(price), Number(taxRate));
    return Number(price) + Number(taxAmount);
  }
  calculateTax(price: number, taxRate: number): number {
    return (Number(price) * Number(taxRate)) / 100;
  }
  PURCHASE_PRICE;
  onGlobalPURCHASE_PRICEChange(data: any): void {
    this.onSellingPriceChange2(data);
    this.dataList.map((item: any) => {
      if (item.ID == null) item['SELLING_PRICE'] = data;
    });
  }
  HEIGHT;
  onGlobalHEIGHTChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['HEIGHT'] = data;
    });
  }
  WEIGHT;
  onGlobalWEIGHTChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['WEIGHT'] = data;
    });
  }
  LENGTH;
  onGlobalLENGTHChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['LENGTH'] = data;
    });
  }
  BREADTH;
  onGlobalBREADTHChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['BREADTH'] = data;
    });
  }
  BASE_QUANTITY;
  onGlobalBASE_QUANTITYChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['BASE_QUANTITY'] = data;
    });
  }
  AVG_LEVEL;
  onGlobalAVG_LEVELChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['AVG_LEVEL'] = data;
    });
  }
  REORDER_STOCK_LEVEL;
  onGlobalREORDER_STOCK_LEVELChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['REORDER_STOCK_LEVEL'] = data;
    });
  }
  ALERT_STOCK_LEVEL;
  onGlobalALERT_STOCK_LEVELChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['ALERT_STOCK_LEVEL'] = data;
    });
  }
  INVENTORY_TRACKING_TYPE;
  onGlobaltrackingtypeChange(data: any): void {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['INVENTORY_TRACKING_TYPE'] = data;
      if (data == 'N') {
        if (item.ID == null) item['WARRANTY_ALLOWED'] = false;
        if (item.ID == null) item['WARRANTY_PERIOD'] = 0;
        if (item.ID == null) item['GUARANTEE_ALLOWED'] = false;
        if (item.ID == null) item['GUARANTEE_PERIOD'] = 0;
        item['WARRANTY_CARD'] = null;
        item['fileURL'] = null;
        this.WARRANTY_ALLOWED_ALL = false;
        this.GUARANTEE_ALLOWED_ALL = false;
        this.WARRANTY_PERIOD_ALL = 0;
        this.GUARANTEE_PERIOD_ALL = 0;
      } else if (data == 'B') {
        if (item.ID == null) item['WARRANTY_ALLOWED'] = false;
        if (item.ID == null) item['WARRANTY_PERIOD'] = 0;
        if (item.ID == null) item['GUARANTEE_ALLOWED'] = false;
        if (item.ID == null) item['GUARANTEE_PERIOD'] = 0;
        item['WARRANTY_CARD'] = null;
        item['fileURL'] = null;
        this.WARRANTY_ALLOWED_ALL = false;
        this.GUARANTEE_ALLOWED_ALL = false;
        this.WARRANTY_PERIOD_ALL = 0;
        this.GUARANTEE_PERIOD_ALL = 0;
      }
    });
  }
  WARRANTY_ALLOWED_ALL;
  onGlobalWarrantyAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.INVENTORY_TRACKING_TYPE === 'S') {
        if (item.ID == null) item['WARRANTY_ALLOWED'] = event;
        if (!event) {
          if (item.ID == null) {
            item['WARRANTY_PERIOD'] = 0;
            item['WARRANTY_CARD'] = null;
            item['fileURL'] = null;
            this.WARRANTY_PERIOD_ALL = 0;
          }
        }
      } else {
        item['WARRANTY_PERIOD'] = 0;
        item['WARRANTY_CARD'] = null;
        item['fileURL'] = null;
        item['WARRANTY_ALLOWED'] = false;
        this.WARRANTY_PERIOD_ALL = 0;
      }
    });
    this.WARRANTY_ALLOWED_ALL = event;
    this.WARRANTY_PERIOD_ALL = 0;
  }
  WARRANTY_PERIOD_ALL;
  onGlobalWarrantyPeriodChange(event) {
    this.dataList.map((item: any) => {
      if (item['WARRANTY_ALLOWED']) {
        if (item.ID == null) item['WARRANTY_PERIOD'] = event;
      }
    });
  }
  GUARANTEE_ALLOWED_ALL;
  onGlobalGuarnteeAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.INVENTORY_TRACKING_TYPE === 'S') {
        if (item.ID == null) item['GUARANTEE_ALLOWED'] = event;
        if (!event) {
          if (item.ID == null) item['GUARANTEE_PERIOD'] = 0;
        }
      } else {
        item['GUARANTEE_PERIOD'] = 0;
        item['GUARANTEE_ALLOWED'] = false;
        this.GUARANTEE_PERIOD_ALL = 0;
      }
    });
    this.GUARANTEE_ALLOWED_ALL = event;
  }
  GUARANTEE_PERIOD_ALL;
  globalguaranteePeriodChange(event) {
    this.dataList.map((item: any) => {
      if (item['GUARANTEE_ALLOWED']) {
        if (item.ID == null) item['GUARANTEE_PERIOD'] = event;
      }
    });
  }
  EXPIRY_DATE_ALLOWED;
  onGlobalExpiryAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['EXPIRY_DATE_ALLOWED'] = event;
    });
    this.EXPIRY_DATE_ALLOWED = event;
  }
  STATUS: boolean = true;
  onGlobalstatusAllowdedChange(event: boolean) {
    this.dataList.map((item: any) => {
      item['STATUS'] = event;
    });
    this.STATUS = event;
  }
  IS_RETURN_ALOW_ALL;
  onGlobalreturnAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['RETURN_ALOW'] = event;
      if (!event) {
        if (item.ID == null) item['RETURN_ALLOW_PERIOD'] = 0;
        this.RETURN_ALLOW_PERIOD_ALL = 0;
      }
    });
    this.IS_RETURN_ALOW_ALL = event;
  }
  RETURN_ALLOW_PERIOD_ALL;
  onGlobalReturnPeriodChange(event) {
    this.dataList.map((item: any) => {
      if (item['RETURN_ALOW']) {
        if (item.ID == null) item['RETURN_ALLOW_PERIOD'] = event;
      }
    });
    this.RETURN_ALLOW_PERIOD_ALL = event;
  }
  IS_DISCOUNT_ALLOWED_ALL;
  onGlobaldiscountAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['DISCOUNT_ALLOWED'] = event;
      if (!event) {
        if (item.ID == null) item['DISCOUNTED_PRICE'] = 0;
        this.DISCOUNT_PRICE_ALL = 0;
      }
    });
    this.IS_DISCOUNT_ALLOWED_ALL = event;
  }
  DISCOUNT_PRICE_ALL;
  onGlobalDiscountPriceChange(event) {
    this.dataList.map((item: any) => {
      if (item['DISCOUNT_ALLOWED']) {
        if (item.ID == null) item['DISCOUNTED_PRICE'] = event;
      }
    });
    this.DISCOUNT_PRICE_ALL = event;
  }
  onChangeDiscountAllowed(event, i) {
    if (!event) {
      this.dataList[i]['DISCOUNTED_PRICE'] = 0;
    }
  }
  IS_REPLACEMENT_ALLOW_ALL;
  onGlobalReplacementAllowdedChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['REPLACEMENT_ALLOW'] = event;
      if (!event) {
        if (item.ID == null) item['REPLACEMENT_PERIOD'] = 0;
        this.DISCOUNT_PRICE_ALL = 0;
        this.REPLACEMENT_PERIOD_ALL = 0;
      }
    });
    this.IS_REPLACEMENT_ALLOW_ALL = event;
  }
  REPLACEMENT_PERIOD_ALL;
  onGlobalreplacemenrPriceChange(event) {
    this.dataList.map((item: any) => {
      if (item['REPLACEMENT_ALLOW']) {
        if (item.ID == null) item['REPLACEMENT_PERIOD'] = event;
      }
    });
    this.REPLACEMENT_PERIOD_ALL = event;
  }
  onReplacementChange(event, i) {
    if (!event) {
      this.dataList[i]['REPLACEMENT_PERIOD'] = 0;
    }
  }
  IS_ALL_EXPECTED;
  onGlobalExpectedChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['EXPECTED_DELIVERY_IN_DAYS'] = event;
    });
    this.IS_ALL_EXPECTED = event;
  }
  EXPECTED_DELIVERY_CHARGES;
  onGlobalExpectedChargeChange(event) {
    this.dataList.map((item: any) => {
      if (item.ID == null) item['EXPECTED_DELIVERY_CHARGES'] = event;
    });
    this.EXPECTED_DELIVERY_CHARGES = event;
  }
  CropImageModalVisible = false;
  isSpinningCrop = false;
  cropimageshow: any;
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  deleteCancel() { }
  removeImage(i) {
    this.data.WARRANTY_CARD = ' ';
    this.dataList[i]['fileURL'] = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any, i) {
    this.dataList[i]['fileURL'] = null;
    this.UrlImageOne = null;
    this.dataList[i].WARRANTY_CARD = ' ';
    this.dataList[i]['fileURL'] = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedUrl2;
  viewImage2(imageURL: string): void {
    let imagePath = this.api.retriveimgUrl + 'WarrantyCard/' + imageURL;
    this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedUrl2;
    this.ImageModalVisible = true;
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath =
      this.api.retriveimgUrl + 'InventorySubcategoryIcons/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  sanitizedFileURL1: SafeUrl | null = null;
  imageshow;
  selectedFile: any;
  onFileSelected(event: any, i): void {
    const maxFileSize = 1 * 1024 * 1024; 
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.match(/(image\/(jpeg|jpg|png)|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
        this.message.error(
          'Please select a valid image or PDF file (PNG, JPG, JPEG, PDF).',
          ''
        );
        event.target.value = null;
        return;
      }
      if (file.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        event.target.value = null;
        return;
      }
      this.dataList[i]['fileURL'] = file;
      this.dataList[i]['loading'] = true;
      if (file.type === 'application/pdf') {
        this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
        this.dataList[i].WARRANTY_CARD = file.name;
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.dataList[i]['fileURL'].name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.dataList[i].WARRANTY_CARD != undefined &&
          this.dataList[i].WARRANTY_CARD.trim() !== ''
        ) {
          var arr = this.dataList[i].WARRANTY_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
        this.api.onUpload('WarrantyCard', file, url).subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne = percentDone;
            if (this.percentImageOne == 100) {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.dataList[i]['loading'] = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload Attachment...', '');
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.dataList[i]['loading'] = false;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('Successfully Uploaded Attachment', '');
              this.isSpinning = false;
              this.dataList[i].WARRANTY_CARD = url;
              this.progressBarImageOne = false;
              this.dataList[i]['loading'] = false;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.dataList[i].WARRANTY_CARD = null;
            }
          }
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; 
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(this.dataList[i]['fileURL'])
          );
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.dataList[i]['fileURL'].name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = d == null ? '' : d + number + '.' + fileExt;
          if (
            this.dataList[i].WARRANTY_CARD != undefined &&
            this.dataList[i].WARRANTY_CARD.trim() !== ''
          ) {
            var arr = this.dataList[i].WARRANTY_CARD.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.api.onUpload('WarrantyCard', file, url).subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.dataList[i]['loading'] = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.dataList[i]['loading'] = false;
              this.percentImageOne = 0;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Successfully Uploaded Attachment', '');
                this.dataList[i]['loading'] = false;
                this.isSpinning = false;
                this.dataList[i].WARRANTY_CARD = url;
                this.progressBarImageOne = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.dataList[i].WARRANTY_CARD = null;
              }
            }
          });
        };
      };
      reader.readAsDataURL(file);
    }
  }
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  imageCropped(event: ImageCroppedEvent) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 128;
    canvas.height = 128;
    const img: any = new Image();
    img.src = event.base64;
    img.onload = () => {
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 128, 128);
      this.compressImage(canvas, 0.7); 
    };
  }
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const sizeInMB = blob.size / (1024 * 1024); 
        if (sizeInMB > 1 && quality > 0.1) {
          this.compressImage(canvas, quality - 0.1);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
          };
        }
      },
      'image/jpeg',
      quality
    ); 
  }
  uploadedImage: any = '';
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  imagePreview;
  imagePreview2;
  uploadedImage2: any = '';
  fullImageUrl2: string;
  imagePreview3;
  uploadedImage3: any = '';
  fullImageUrl3: string;
  imagePreview4;
  uploadedImage4: any = '';
  fullImageUrl4: string;
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) { }
  loadImageFailed() { }
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
  imageshow1;
  imagePreview1: any;
  selectedFile1: any;
  UrlImageOne1;
  progressBarImageOne1: boolean = false;
  percentImageOne1 = 0;
  timer1: any;
  urlImageOneShow1: boolean = false;
  fileURL1: any = '';
  uploadedImage1: any = '';
  ViewImage1: any;
  ImageModalVisible1 = false;
  onFileSelected1(event: any, i): void {
    const maxFileSize = 1 * 1024 * 1024; 
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.match(/(image\/(jpeg|jpg|png))/)) {
        this.message.error(
          'Please select a valid image or PDF file (PNG, JPG, JPEG).',
          ''
        );
        event.target.value = null;
        return;
      }
      if (file.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        event.target.value = null;
        return;
      }
      this.dataList[i]['fileURL1'] = file;
      this.dataList[i]['loading'] = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview1 = e.target.result; 
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          this.sanitizedFileURL1 = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(this.dataList[i]['fileURL1'])
          );
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.dataList[i]['fileURL1'].name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = d == null ? '' : d + number + '.' + fileExt;
          if (
            this.dataList[i].INVENTORY_DETAILS_IMAGE != undefined &&
            this.dataList[i].INVENTORY_DETAILS_IMAGE.trim() !== ''
          ) {
            var arr = this.dataList[i].INVENTORY_DETAILS_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.api
            .onUpload('InventoryDetailsImage', file, url)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImageOne1 = percentDone;
                if (this.percentImageOne1 == 100) {
                  this.isSpinning = false;
                  this.progressBarImageOne1 = false;
                  this.dataList[i]['loading'] = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Image...', '');
                this.isSpinning = false;
                this.progressBarImageOne1 = false;
                this.dataList[i]['loading'] = false;
                this.percentImageOne1 = 0;
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Successfully Uploaded Image', '');
                  this.dataList[i]['loading'] = false;
                  this.isSpinning = false;
                  this.dataList[i].INVENTORY_DETAILS_IMAGE = url;
                  this.progressBarImageOne1 = false;
                } else {
                  this.isSpinning = false;
                  this.progressBarImageOne1 = false;
                  this.percentImageOne1 = 0;
                  this.dataList[i].INVENTORY_DETAILS_IMAGE = null;
                }
              }
            });
        };
      };
      reader.readAsDataURL(file);
    }
  }
  viewImage1(imageURL: string): void {
    this.ViewImage1 = 1;
    this.GetImage1(imageURL);
  }
  sanitizedLink1: any = '';
  GetImage1(link: string) {
    let imagePath = this.api.retriveimgUrl + 'InventoryDetailsImage/' + link;
    this.sanitizedLink1 =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow1 = this.sanitizedLink1;
    this.ImageModalVisible1 = true;
  }
  deleteCancel1() { }
  removeImage1() {
    this.data.INVENTORY_DETAILS_IMAGE = '';
    this.fileURL1 = null;
    this.isSpinning = false;
    this.progressBarImageOne1 = false;
    this.percentImageOne1 = 0;
    this.data.INVENTORY_DETAILS_IMAGE = null;
  }
  image1DeleteConfirm1(data: any, i) {
    this.dataList[i]['fileURL1'] = null;
    this.UrlImageOne1 = null;
    this.dataList[i].INVENTORY_DETAILS_IMAGE = ' ';
    this.dataList[i]['fileURL1'] = null;
  }
  ImageModalCancel1() {
    this.ImageModalVisible1 = false;
  }
}