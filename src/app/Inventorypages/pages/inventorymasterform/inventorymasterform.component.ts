import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, switchMap, forkJoin } from 'rxjs';
import { appkeys } from 'src/app/app.constant';
import { InventoryMaster } from 'src/app/Inventorypages/inventorymodal/inventoryMaster';
import { brandMaster } from 'src/app/Pages/Models/BrandMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-inventorymasterform',
  templateUrl: './inventorymasterform.component.html',
  styleUrls: ['./inventorymasterform.component.css'],
})
export class InventorymasterformComponent {
  @Input() drawerClose: Function;
  @Input() data: InventoryMaster;
  @Input() drawerVisible: boolean;
  @Input() disableItems: any;
  @Input() ShowTax: any;
  @Input() UnitName: any;

  HSNdata: any = [];
  BrandData: any = [];
  taxData: any = [];
  dummy: any = [];
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
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
  subcategoryid: any;
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.data?.ID) {
      const html = this.data.DESCRIPTION || '';
      this.cleanTextLength = html.length;
      this.showLengthError = html.length > this.maxLength;
    }
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.INVENTORY_DETAILS_IMAGE != null &&
      this.data.INVENTORY_DETAILS_IMAGE != undefined &&
      this.data.INVENTORY_DETAILS_IMAGE != ' '
    ) {
      this.uploadedImage1 = this.data.INVENTORY_DETAILS_IMAGE;
    } else {
    }

    // this.getSubCategory()
    this.getWarehouses();
    // this.getWarehouselocations()
    this.getInventoryCategory();
    this.getUnits();
    // if (this.data?.INVENTRY_SUB_CATEGORY_ID) {
    //   this.onWarehousechange(this.data.WAREHOUSE_ID);
    // }

    if (this.data.TAX_PREFERENCE == 'T') {
      this.ShowTax = true;
    }

    if (this.data.ID) {
      this.subcategoryid = this.data.INVENTRY_SUB_CATEGORY_ID;
      this.getNamesCatAndSub(this.data.INVENTRY_SUB_CATEGORY_ID);
      this.initializeWarehouse();
    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '90px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Details here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript'],
      ['customClasses', 'insertVideo', 'insertImage'],
    ],
  };
  getInventoryCategory() {
    this.api.getcategoryhierarchyInventory().subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.InventoryCategoryList = data['data'][0]['categories'];
        } else {
          this.InventoryCategoryList = [];
        }
      },
      () => {
        this.InventoryCategoryList = [];
      }
    );

    this.api
      .getAllHSNSAC(0, 0, 'ID', 'desc', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.HSNdata = data['data'];
        } else {
          this.HSNdata = [];
        }
      });

    this.api
      .getAllInventoryBrand(0, 0, 'ID', 'desc', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          this.BrandData = data['body']['data'];
        } else {
          this.BrandData = [];
        }
      });

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

  onChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.UnitList.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.data.BASE_UNIT_NAME = selectedProduct['NAME'];
        const unitCode: string = selectedProduct.SHORT_CODE;
        this.UnitName = unitCode;
      }
      this.data.BASE_UNIT_ID = selectedId;
    } else {
      this.data.BASE_UNIT_NAME = null;
      this.data.BASE_UNIT_ID = null;
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
        // this.data.BASE_UNIT_NAME = selectedProduct[0]['NAME'];
        this.data.UNIT_NAME = selectedProduct['NAME'];
      } else {
        this.data.UNIT_NAME = null;
      }
      // this.data.BASE_UNIT_ID = selectedId;
      this.data.UNIT_ID = selectedId;
    } else {
      this.data.UNIT_NAME = null;
      this.data.UNIT_ID = null;
    }
  }
  calculateTax(price: number, taxRate: number): number {
    return (Number(price) * Number(taxRate)) / 100;
  }

  calculateTotalPrice(price: number, taxRate: number): number {
    const taxAmount = this.calculateTax(Number(price), Number(taxRate));
    return Number(price) + Number(taxAmount);
  }
  onTaxChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        // this.data.BASE_UNIT_NAME = selectedProduct[0]['NAME'];
        this.data.TAX_NAME = selectedProduct['NAME'];
        if (this.data.BASE_PRICE && this.data.BASE_PRICE > 0) {
          this.data.SELLING_PRICE = this.calculateTotalPrice(
            this.data.BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.data.DISCOUNT_ALLOWED) {
            this.data.DISCOUNTED_PRICE = 0;
          }
        }
      } else {
        this.data.TAX_NAME = null;
      }
      // this.data.BASE_UNIT_ID = selectedId;
      this.data.TAX_ID = selectedId;
    } else {
      this.data.TAX_NAME = null;
      this.data.SELLING_PRICE = this.data.BASE_PRICE;
      if (this.data.DISCOUNT_ALLOWED) {
        this.data.DISCOUNTED_PRICE = 0;
      }
      this.data.TAX_ID = null;
    }
  }
  onSetChange(event: any) {
    if (event == false) {
      this.data.BASE_QUANTITY = null;
    } else {
      this.data.BASE_QUANTITY = 1;
    }
  }

  onVariantChange(event: any) {
    if (event == true) {
      this.data.BASE_UNIT_ID = null;
      this.data.BASE_UNIT_NAME = null;
      this.data.BASE_QUANTITY = null;
      this.data.PARENT_ID = 0;
      this.data.AVG_LEVEL = null;
      this.data.REORDER_STOCK_LEVEL = null;
      this.data.ALERT_STOCK_LEVEL = null;
      this.data.TAX_PREFERENCE = null;
      this.data.UNIT_ID = null;
      this.data.UNIT_NAME = null;
      this.data.TAX_ID = null;
      this.data.TAX_NAME = null;
      this.data.SELLING_PRICE = null;
      this.data.BASE_PRICE = null;
      this.data.DISCOUNTED_PERCENTAGE = 0;
      this.data.DISCOUNTED_PRICE = 0;
      // this.data.WAREHOUSE_ID = null;
      // this.data.WAREHOUSE_NAME = null;
      this.data.IS_SET = false;
      this.data.IS_NEW = false;
      this.data.GUARANTEE_ALLOWED = false;
      this.data.EXPIRY_DATE_ALLOWED = false;
      this.data.WARRANTY_ALLOWED = false;
      this.data.DISCOUNT_ALLOWED = false;
      this.data.REPLACEMENT_ALLOW = false;
      this.data.REPLACEMENT_PERIOD = 0;
      this.data.RETURN_ALLOW_PERIOD = 0;
      this.data.WARRANTY_PERIOD = 0;
      this.data.DISCOUNTED_PERCENTAGE = 0;
      this.data.GUARANTEE_PERIOD = 0;
      this.data.WARRANTY_CARD = '';
      this.data.RETURN_ALOW = false;
      this.data.INVENTORY_TRACKING_TYPE = null;
    } else {
      this.data.BASE_QUANTITY = 1;
      this.data.IS_NEW = false;
      this.data.TAX_PREFERENCE = 'T';
      this.data.GUARANTEE_ALLOWED = false;
      this.data.EXPIRY_DATE_ALLOWED = false;
      this.data.IS_SET = false;
      this.data.DISCOUNT_ALLOWED = false;
      this.data.WARRANTY_ALLOWED = false;
      this.data.REPLACEMENT_ALLOW = false;
      this.data.REPLACEMENT_PERIOD = 0;
      this.data.RETURN_ALOW = false;
      this.data.RETURN_ALLOW_PERIOD = 0;
      this.data.WARRANTY_PERIOD = 0;
      this.data.GUARANTEE_PERIOD = 0;
      this.data.WARRANTY_CARD = '';
      this.data.INVENTORY_TRACKING_TYPE = null;
      if (this.UnitList.length > 0) {
        this.data.UNIT_ID = this.UnitList[0].ID;
        this.data.UNIT_NAME = this.UnitList[0].NAME;
        this.data.BASE_UNIT_ID = this.UnitList[0].ID;
        this.data.BASE_UNIT_NAME = this.UnitList[0].NAME;
        this.UnitName = this.UnitList[0].SHORT_CODE;
      }
    }
  }

  OnHSNChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.HSNdata.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        // this.data.BASE_UNIT_NAME = selectedProduct[0]['NAME'];
        this.data.HSN_NAME = selectedProduct['CODE'];
      } else {
        this.data.HSN_NAME = null;
      }
      // this.data.BASE_UNIT_ID = selectedId;
      this.data.HSN_ID = selectedId;
    } else {
      this.data.HSN_NAME = null;
      this.data.HSN_ID = null;
    }
  }

  OnBrandChange(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.BrandData.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.data.BRAND_NAME = selectedProduct['BRAND_NAME'];
      } else {
        this.data.BRAND_NAME = null;
      }
      this.data.BRAND_ID = selectedId;
    } else {
      this.data.BRAND_NAME = null;
      this.data.BRAND_ID = null;
    }
  }
  onChangeTax(event: any) {
    this.data.SELLING_PRICE = null;
    this.data.DISCOUNTED_PRICE = 0;
    if (event === 'T') {
      this.ShowTax = true;
    } else {
      this.data.TAX_ID = 0;
      this.data.SELLING_PRICE = this.data.BASE_PRICE;
      if (this.data.DISCOUNT_ALLOWED) {
        this.data.DISCOUNTED_PRICE = 0;
      }
      this.ShowTax = false;
    }
  }
  splitddata: any;
  getNamesCatAndSub(selectedKey: any): void {
    if (selectedKey != null && selectedKey != undefined && selectedKey !== '') {
      // Find the selected subcategory and its parent category
      this.subcategoryid = selectedKey;
      let parentCategoryName = null;
      let subCategoryName = null;
      let CategoryNameId = null;
      this.InventoryCategoryList.forEach((category) => {
        if (category.children) {
          const subCategory = category.children.find(
            (child) => child.key === selectedKey
          );
          if (subCategory) {
            parentCategoryName = category.title; // Parent category name
            subCategoryName = subCategory.title; // Subcategory name
            CategoryNameId = category.key; // Subcategory name
            this.data.INVENTORY_CATEGORY_NAME = parentCategoryName;
            this.data.INVENTRY_SUB_CATEGORY_NAME = subCategoryName;
            this.data.INVENTORY_CATEGORY_ID = CategoryNameId;
            this.splitddata = subCategory.key.split('-')[1];
            this.data.INVENTRY_SUB_CATEGORY_ID = this.splitddata;
          }
        }
      });
    } else {
      // Clear values if no subcategory is selected
      this.data.INVENTORY_CATEGORY_NAME = null;
      this.data.INVENTRY_SUB_CATEGORY_NAME = null;
      this.data.INVENTORY_CATEGORY_ID = null;
      this.data.INVENTRY_SUB_CATEGORY_ID = null;
    }
  }
  // onWarehousechange(warehouseid: any) {
  //   if (warehouseid != null && warehouseid != undefined && warehouseid != '') {
  //
  //     var selectedProduct = this.warehouseList.find(
  //       (product) => product.ID === warehouseid
  //     );
  //     if (
  //       selectedProduct != null &&
  //       selectedProduct != undefined &&
  //       selectedProduct != ''
  //     ) {
  //       // this.data.BASE_UNIT_NAME = selectedProduct[0]['NAME'];
  //       this.data.WAREHOUSE_NAME = selectedProduct['NAME'];
  //     } else {
  //       this.data.WAREHOUSE_NAME = null;
  //     }
  //     // this.data.BASE_UNIT_ID = selectedId;
  //     this.data.WAREHOUSE_ID = warehouseid;
  //   } else {
  //     this.data.WAREHOUSE_NAME = null;
  //     // this.data.WAREHOUSE_ID = null;
  //   }
  // }
  // onWarehousechange(warehouseid: any) {
  //   if (warehouseid && warehouseid.length > 0) {
  //

  //     // Filter all selected warehouses based on IDs
  //     var selectedWarehouses = this.warehouseList.filter((warehouse) =>
  //       warehouseid.includes(warehouse.ID)
  //     );

  //

  //     if (selectedWarehouses.length > 0) {
  //       // Extract names of selected warehouses
  //       let warehouseNames = selectedWarehouses.map((w) => w.NAME);

  //
  //     } else {
  //
  //     }
  //   } else {
  //
  //   }
  // }

  onWarehousechange(warehouseid: any) {
    if (warehouseid && warehouseid.length > 0) {
      // Filter all selected warehouses based on IDs
      let selectedWarehouses = this.warehouseList.filter((warehouse) =>
        warehouseid.includes(warehouse.ID)
      );

      if (selectedWarehouses.length > 0) {
        // Extract names of selected warehouses and join them into a string
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
  calculateDiscount(sellingprice: number, percentage) {
    let discountedrate = (Number(sellingprice) * Number(percentage)) / 100;
    return Number(this.data.SELLING_PRICE - discountedrate);
  }
  onDiscountPercentageChange(event) {
    if (event && event > 0 && this.data.SELLING_PRICE) {
      this.data.DISCOUNTED_PRICE = this.calculateDiscount(
        this.data.SELLING_PRICE,
        event
      );
    } else {
      this.data.DISCOUNTED_PRICE = 0;
    }
  }
  updateWarehouseNames(warehouseid: any) {
    if (warehouseid && warehouseid.length > 0) {
      let selectedWarehouses = this.warehouseList.filter((warehouse) =>
        warehouseid.includes(Number(warehouse.ID))
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
  getWarehouses() {
    this.api.getWarehouses(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.warehouseList = data['data'];
          if (this.data.WAREHOUSE_ID && this.data.WAREHOUSE_ID.length > 0) {
            this.updateWarehouseNames(this.data.WAREHOUSE_ID);
          }
        } else {
          this.warehouseList = [];
        }
      },
      (err) => {
        this.warehouseList = [];
      }
    );
  }

  getSubCategory() {
    // this.api.getInventorySubCategory(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1').subscribe(categorysuccess => {
    //   if (categorysuccess.code == 200) {
    //     this.InventorySubCategoryList = categorysuccess['data']
    //   }
    //   else {
    //     this.InventorySubCategoryList = []
    //   }
    // })
  }

  getWarehouselocations() {
    this.api
      .getWarehousesLocation(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((categorysuccess) => {
        if (categorysuccess.code == 200) {
          this.storageLocationlist = categorysuccess['data'];
        } else {
          this.storageLocationlist = [];
        }
      });
  }

  Unitload: boolean = false;

  getUnits() {
    this.Unitload = true;
    this.api.getUnitData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE=1').subscribe(
      (unitdata) => {
        if (unitdata.code == 200) {
          this.Unitload = false;
          this.UnitList = unitdata['data'];
          if (!this.data.ID) {
            if (unitdata['count'] > 0) {
              this.data.UNIT_ID = this.UnitList[0].ID;
              this.data.UNIT_NAME = this.UnitList[0].NAME;
              this.data.BASE_UNIT_ID = this.UnitList[0].ID;
              this.data.BASE_UNIT_NAME = this.UnitList[0].NAME;
              this.UnitName = this.UnitList[0].SHORT_CODE;
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

  close(myForm: NgForm) {
    this.drawerClose();
    this.resetDrawer(myForm);
  }

  resetDrawer(myForm: NgForm) {
    myForm.form.markAsPristine();
    myForm.form.markAsUntouched();
    this.add();
  }

  add(): void {
    // this.api.getAllBranch(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.data.SEQ_NO = 1;
    //   } else {
    //     this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //     this.data.IS_ACTIVE = true;
    //   }
    // }, err => {
    //
    // })
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
  onlynum2(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value + event.key;

    if (!/^\d*$/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    } else if (parseInt(newValue, 10) > 100) {
      event.preventDefault(); // Prevent values greater than 100
    }
  }
  onStatusChange(status: boolean): void {
    this.data.STATUS = status;
  }

  initializeWarehouse(): void {
    // this.data.WAREHOUSE_ID = this.data.WAREHOUSE_ID.split(',').map(Number);
  }
  onBasePriceChange(event) {
    if (event && this.data.TAX_ID) {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === this.data.TAX_ID
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        // this.data.BASE_UNIT_NAME = selectedProduct[0]['NAME'];
        // this.data.TAX_NAME = selectedProduct['NAME'];
        if (this.data.BASE_PRICE && this.data.BASE_PRICE > 0) {
          this.data.SELLING_PRICE = this.calculateTotalPrice(
            this.data.BASE_PRICE,
            selectedProduct['IGST']
          );
          if (this.data.DISCOUNT_ALLOWED) {
            this.data.DISCOUNTED_PRICE = 0;
          }
        }
      } else {
        this.data.SELLING_PRICE = event;
        if (this.data.DISCOUNT_ALLOWED) {
          this.data.DISCOUNTED_PRICE = 0;
        }
        // this.data.DISCOUNTED_PRICE = 0;
      }
    } else {
      this.data.SELLING_PRICE = event;
      if (this.data.DISCOUNT_ALLOWED) {
        this.data.DISCOUNTED_PRICE = 0;
      }
      // this.data.DISCOUNTED_PRICE = 0;
    }
  }
  onSellingPriceChange(event) {
    if (event && event > 0 && this.data.DISCOUNT_ALLOWED) {
      this.data.DISCOUNTED_PRICE = 0;
    } else {
      this.data.DISCOUNTED_PRICE = 0;
    }
  }
  convertSrcToFile(src: string): Observable<File> {
    return new Observable((observer) => {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `image_${Date.now()}.png`, {
            type: blob.type,
          });
          observer.next(file);
          observer.complete();
        });
    });
  }

  prepareDescriptionWithUploads(
    html: string,
    callback: (updatedHtml: string) => void
  ): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const imgElements = Array.from(tempDiv.querySelectorAll('img'));
    const uploadObservables: Observable<any>[] = [];
    const replacements: { element: HTMLImageElement; filename: string }[] = [];

    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && (src.startsWith('data:image/') || src.startsWith('blob:'))) {
        const filename = `image_${Date.now()}_${Math.floor(
          Math.random() * 10000
        )}.png`;

        const obs = this.convertSrcToFile(src).pipe(
          switchMap((file) =>
            this.api.onUpload2('InventoryDetailsImage', file, filename)
          )
        );

        uploadObservables.push(obs);
        replacements.push({ element: img, filename });
      }
    });

    if (uploadObservables.length === 0) {
      callback(tempDiv.innerHTML);
      return;
    }

    forkJoin(uploadObservables).subscribe(() => {
      replacements.forEach((rep) => {
        const url = `${this.api.retriveimgUrl}InventoryDetailsImage/${rep.filename}`;
        // console.log(url, '---url ---- ');

        rep.element.setAttribute('src', url);
      });

      callback(tempDiv.innerHTML);
    });
  }

  save(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isOk = true;

    const isBlobInDescription =
      this.data.DESCRIPTION && this.data.DESCRIPTION.includes('data:image');

    if (isBlobInDescription) {
      this.prepareDescriptionWithUploads(
        this.data.DESCRIPTION,
        (updatedHtml) => {
          this.data.DESCRIPTION = updatedHtml;
          this.continueSave(addNew, ServiceCatmaster);
        }
      );
    } else {
      this.continueSave(addNew, ServiceCatmaster);
    }
  }

  cleanTextLength = 0;
  showLengthError = false;
  maxLength = 50000;

  checkDescriptionLength(): void {
    const html = this.data.DESCRIPTION || '';

    const totalLength = html.length;
    this.cleanTextLength = totalLength;
    this.showLengthError = totalLength > this.maxLength;

    if (this.showLengthError) {
      const truncated = html.slice(0, this.maxLength);

      this.data.DESCRIPTION = '';
      setTimeout(() => {
        this.data.DESCRIPTION = truncated;
        this.cleanTextLength = truncated.length;
        // this.showLengthError = false;
      });
    }
  }

  continueSave(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;

    if (
      this.data.INVENTRY_SUB_CATEGORY_ID === null ||
      this.data.INVENTRY_SUB_CATEGORY_ID === undefined ||
      this.data.INVENTRY_SUB_CATEGORY_ID === ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Inventory Sub Category', '');
    } else if (
      this.data.ITEM_NAME === null ||
      this.data.ITEM_NAME === undefined ||
      this.data.ITEM_NAME === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Inventory Name', '');
    } else if (
      this.data.SHORT_CODE === null ||
      this.data.SHORT_CODE === undefined ||
      this.data.SHORT_CODE === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    } else if (
      this.data.DESCRIPTION === null ||
      this.data.DESCRIPTION === undefined ||
      this.data.DESCRIPTION === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Desription', '');
    }
    // else if (
    //   this.data.WAREHOUSE_ID === null ||
    //   this.data.WAREHOUSE_ID === undefined ||
    //   this.data.WAREHOUSE_ID === ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Warehouse', '');
    // }
    else if (
      this.data.BRAND_ID === null ||
      this.data.BRAND_ID === undefined ||
      this.data.BRAND_ID === ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Brand Name', '');
    }
    // else if (
    //   this.data.HEIGHT === null ||
    //   this.data.HEIGHT === undefined ||
    //   this.data.HEIGHT === '' || this.data.HEIGHT === 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Height', '');
    // }
    // else if (
    //   this.data.WEIGHT === null ||
    //   this.data.WEIGHT === undefined ||
    //   this.data.WEIGHT === '' || this.data.WEIGHT === 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Weight', '');
    // } else if (
    //   this.data.LENGTH === null ||
    //   this.data.LENGTH === undefined ||
    //   this.data.LENGTH === '' || this.data.LENGTH === 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Length', '');
    // } else if (
    //   this.data.BREADTH === null ||
    //   this.data.BREADTH === undefined ||
    //   this.data.BREADTH === '' || this.data.BREADTH === 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Breadth', '');
    // }
    else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.BASE_UNIT_ID === null ||
        this.data.BASE_UNIT_ID === undefined ||
        this.data.BASE_UNIT_ID === '' ||
        this.data.BASE_UNIT_ID === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Base Unit', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.BASE_QUANTITY === null ||
        this.data.BASE_QUANTITY === undefined ||
        this.data.BASE_QUANTITY === '' ||
        this.data.BASE_QUANTITY === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Quantity Per Unit', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.BASE_PRICE === null ||
        this.data.BASE_PRICE === undefined ||
        this.data.BASE_PRICE === '' ||
        this.data.BASE_PRICE === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Price', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.TAX_PREFERENCE === null ||
        this.data.TAX_PREFERENCE === undefined ||
        this.data.TAX_PREFERENCE === '' ||
        this.data.TAX_PREFERENCE === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Tax Preference', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      this.data.TAX_PREFERENCE === 'T' &&
      (this.data.TAX_ID === null ||
        this.data.TAX_ID === undefined ||
        this.data.TAX_ID === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Valid Tax Slab', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.SELLING_PRICE === null ||
        this.data.SELLING_PRICE === undefined ||
        this.data.SELLING_PRICE === '' ||
        this.data.SELLING_PRICE === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Selling Price', '');
    }

    // else if (!this.data.IS_HAVE_VARIANTS && (this.data.SERIAL_NO === null || this.data.SERIAL_NO === undefined || this.data.SERIAL_NO === '' || this.data.SERIAL_NO === 0)) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Serial No.', '');
    // }
    else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.AVG_LEVEL === null ||
        this.data.AVG_LEVEL === undefined ||
        this.data.AVG_LEVEL === '' ||
        this.data.AVG_LEVEL === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Average Stock Level', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.REORDER_STOCK_LEVEL === null ||
        this.data.REORDER_STOCK_LEVEL === undefined ||
        this.data.REORDER_STOCK_LEVEL === '' ||
        this.data.REORDER_STOCK_LEVEL === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Re-Order Stock Level', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.ALERT_STOCK_LEVEL === null ||
        this.data.ALERT_STOCK_LEVEL === undefined ||
        this.data.ALERT_STOCK_LEVEL === '' ||
        this.data.ALERT_STOCK_LEVEL === 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Alert Stock Level', '');
    } else if (
      this.data.RETURN_ALOW &&
      (this.data.RETURN_ALLOW_PERIOD === null ||
        this.data.RETURN_ALLOW_PERIOD === undefined ||
        String(this.data.RETURN_ALLOW_PERIOD) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Return Allow Period', '');
    } else if (
      this.data.DISCOUNT_ALLOWED &&
      (this.data.DISCOUNTED_PRICE === null ||
        this.data.DISCOUNTED_PRICE === undefined ||
        this.data.DISCOUNTED_PRICE === 0 ||
        String(this.data.DISCOUNTED_PRICE) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Discounted Price', '');
    } else if (
      this.data.REPLACEMENT_ALLOW &&
      (this.data.REPLACEMENT_PERIOD === null ||
        this.data.REPLACEMENT_PERIOD === undefined ||
        String(this.data.REPLACEMENT_PERIOD) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Replacement Period', '');
    } else if (
      this.data.WARRANTY_ALLOWED &&
      (this.data.WARRANTY_PERIOD === null ||
        this.data.WARRANTY_PERIOD === undefined ||
        String(this.data.WARRANTY_PERIOD) === '' ||
        this.data.WARRANTY_PERIOD) == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Warranty Period', '');
    } else if (
      this.data.WARRANTY_ALLOWED &&
      (this.data.WARRANTY_CARD === null ||
        this.data.WARRANTY_CARD === undefined ||
        this.data.WARRANTY_CARD.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please Upload Warranty Card', '');
    } else if (
      this.data.GUARANTEE_ALLOWED &&
      (this.data.GUARANTEE_PERIOD === null ||
        this.data.GUARANTEE_PERIOD === undefined ||
        String(this.data.GUARANTEE_PERIOD) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Guarantee Period', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.EXPECTED_DELIVERY_IN_DAYS === null ||
        this.data.EXPECTED_DELIVERY_IN_DAYS === undefined ||
        String(this.data.EXPECTED_DELIVERY_IN_DAYS) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Expected Delivery In Days', '');
    } else if (
      !this.data.IS_HAVE_VARIANTS &&
      (this.data.EXPECTED_DELIVERY_CHARGES === null ||
        this.data.EXPECTED_DELIVERY_CHARGES === undefined ||
        this.data.EXPECTED_DELIVERY_CHARGES < 0 ||
        String(this.data.EXPECTED_DELIVERY_CHARGES) === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Expected Delivery Charges', '');
    }

    this.data.WAREHOUSE_ID = '';

    if (this.isOk) {
      if (!this.data.IS_HAVE_VARIANTS) {
        this.data.INVENTORY_DETAILS_IMAGE = this.data.INVENTORY_DETAILS_IMAGE;
      } else {
        this.data.INVENTORY_DETAILS_IMAGE = null;
      }
      this.isSpinning = true;
      this.data.DATE_OF_ENTRY = this.datePipe.transform(
        this.data.DATE_OF_ENTRY,
        'yyyy-MM-dd'
      );
      if (this.data.REMARKS == '') {
        this.data.REMARKS = null;
      }
      if (this.data.ID) {
        if (
          this.splitddata !== null &&
          this.splitddata !== undefined &&
          this.splitddata !== ''
        ) {
          this.data.INVENTRY_SUB_CATEGORY_ID = this.splitddata;
        } else {
          this.data.INVENTRY_SUB_CATEGORY_ID =
            this.data.INVENTRY_SUB_CATEGORY_ID.split('-')[1];
        }
      } else {
        if (
          this.splitddata !== null &&
          this.splitddata !== undefined &&
          this.splitddata !== ''
        ) {
          this.data.INVENTRY_SUB_CATEGORY_ID = this.splitddata;
        } else {
          this.data.INVENTRY_SUB_CATEGORY_ID =
            this.data.INVENTRY_SUB_CATEGORY_ID.split('-')[1];
        }
      }
      // this.data.WAREHOUSE_ID = this.data.WAREHOUSE_ID.join(',');

      {
        this.data.WAREHOUSE_ID = '';
        if (String(this.data.EXPECTED_DELIVERY_CHARGES) === '')
          this.data.EXPECTED_DELIVERY_CHARGES = 0;
        if (String(this.data.GUARANTEE_PERIOD) === '')
          this.data.GUARANTEE_PERIOD = 0;
        if (String(this.data.WARRANTY_PERIOD) === '')
          this.data.WARRANTY_PERIOD = 0;
        if (String(this.data.EXPECTED_DELIVERY_IN_DAYS) === '')
          this.data.EXPECTED_DELIVERY_IN_DAYS = 0;
        this.createOrUpdate(addNew, myForm);
      }
    }
  }

  createOrUpdate(addNew: boolean, myForm: NgForm): void {
    if (this.data.ID) {
      this.api.updateInventory(this.data).subscribe(
        (successCode: HttpResponse<any>) => {
          if (successCode.body.code === 200) {
            this.message.success('Inventory details updated successfully', '');

            if (!addNew) this.drawerClose();

            this.isSpinning = false;
          } else if (successCode.body.code == '300') {
            this.getNamesCatAndSub(this.subcategoryid);
            this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
            this.message.info(
              'An inventory item with the same short code already exists.',
              ''
            );
            this.isSpinning = false;
          } else {
            this.getNamesCatAndSub(this.subcategoryid);
            this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
            this.message.error('Failed to update inventory details ', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.getNamesCatAndSub(this.subcategoryid);
          this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinning = false;
        }
      );
    } else {
      this.api.createInventory(this.data).subscribe(
        (successCode: HttpResponse<any>) => {
          if (successCode.body.code === 200) {
            this.message.success('Inventory details saved successfully', '');
            this.isSpinning = false;

            if (!addNew) this.drawerClose();
            else {
              this.resetDrawer(myForm);
              this.data = new InventoryMaster();
            }

            this.isSpinning = false;
          } else if (successCode.body.code == '300') {
            this.getNamesCatAndSub(this.subcategoryid);
            this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
            this.message.info(
              'An inventory item with the same short code already exists.',
              ''
            );
            this.isSpinning = false;
          } else {
            this.getNamesCatAndSub(this.subcategoryid);
            this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
            this.message.error('Failed to save inventory details', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.getNamesCatAndSub(this.subcategoryid);
          this.data.INVENTRY_SUB_CATEGORY_ID = this.subcategoryid;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );

          this.isSpinning = false;
        }
      );
    }
  }
  warrantyUpdate(event) {
    this.data.WARRANTY_ALLOWED = event;
    if (event == false) {
      this.data.WARRANTY_PERIOD = 0;
      this.data.WARRANTY_CARD = '';
    }
  }
  guarantyUpdate(event) {
    this.data.GUARANTEE_ALLOWED = event;
    if (event == false) {
      this.data.GUARANTEE_PERIOD = 0;
    }
  }
  changeTrackingType(event: any) {
    this.data.WARRANTY_CARD = '';
    this.data.WARRANTY_PERIOD = 0;
    this.data.GUARANTEE_PERIOD = 0;
    if (event == 'B') {
      this.data.WARRANTY_ALLOWED = false;
      this.data.GUARANTEE_ALLOWED = false;
    } else if (event == 'S') {
      this.data.EXPIRY_DATE_ALLOWED = false;
    } else {
      this.data.WARRANTY_ALLOWED = false;
      this.data.GUARANTEE_ALLOWED = false;
      this.data.EXPIRY_DATE_ALLOWED = false;
    }
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
  removeImage() {
    this.data.WARRANTY_CARD = ' ';
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.WARRANTY_CARD = ' ';
    // this.data.ICON = "";

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedUrl2;
  viewImage2(imageURL: string): void {
    // this.ViewImage = 1;
    // this.GetImage(imageURL);
    let imagePath = this.api.retriveimgUrl + 'WarrantyCard/' + imageURL;
    // this.sanitizedUrl2 =
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

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;

  // imagePreview: any;
  selectedFile: any;
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; // 1 MB

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validate file type
      if (!file.type.match(/(image\/(jpeg|jpg|png)|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
        this.message.error(
          'Please select a valid image or PDF file (PNG, JPG, JPEG, PDF).',
          ''
        );
        event.target.value = null;
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        event.target.value = null;
        return;
      }

      this.fileURL = file;

      // Handle PDF file
      if (file.type === 'application/pdf') {
        this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
        this.data.WARRANTY_CARD = file.name;
        //
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = d == null ? '' : d + number + '.' + fileExt;

        if (
          this.data.WARRANTY_CARD != undefined &&
          this.data.WARRANTY_CARD.trim() !== ''
        ) {
          var arr = this.data.WARRANTY_CARD.split('/');
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload Attachment...', '');
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            // this.selectedFileName = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              // this.message.success('Profile Photo Uploaded Successfully...', '');
              this.message.success('Successfully Uploaded Attachment', '');
              this.isSpinning = false;
              // this.progressBarImageOne = false;
              this.data.WARRANTY_CARD = url;
              this.progressBarImageOne = false;
              // this.isVisibleMiddle = false;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.WARRANTY_CARD = null;
            }
          }
        });
        return;
      }

      // Handle image file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Base64 data for preview

        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(this.fileURL)
          );
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileURL.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = d == null ? '' : d + number + '.' + fileExt;

          if (
            this.data.WARRANTY_CARD != undefined &&
            this.data.WARRANTY_CARD.trim() !== ''
          ) {
            var arr = this.data.WARRANTY_CARD.split('/');
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
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              // this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                // this.message.success('Profile Photo Uploaded Successfully...', '');
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                // this.progressBarImageOne = false;
                this.data.WARRANTY_CARD = url;
                this.progressBarImageOne = false;
                // this.isVisibleMiddle = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.data.WARRANTY_CARD = null;
              }
            }
          });
          //
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
    //

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
      ctx.fillStyle = '#ffffff'; // Change this color if needed
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 128, 128);

      // Convert to JPEG with reduced quality
      this.compressImage(canvas, 0.7); // Start with 70% quality
    };
  }

  // Function to compress image and ensure size < 1MB
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const sizeInMB = blob.size / (1024 * 1024); // Convert to MB

        if (sizeInMB > 1 && quality > 0.1) {
          // If size is still >1MB, reduce quality and try again
          this.compressImage(canvas, quality - 0.1);
        } else {
          // Final compressed image (size is now below 1MB)
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
            //
          };
        }
      },
      'image/jpeg',
      quality
    ); // Convert to JPEG with given quality
  }

  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    //
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) { }

  loadImageFailed() { }

  drawerbrandTitle = '';
  drawerbrandData: any;
  drawerbrandVisible = false;
  addBrand(): void {
    this.drawerbrandTitle = 'Create New Brand';
    this.drawerbrandData = new brandMaster();
    this.drawerbrandVisible = true;
  }

  drawerbrandClose(): void {
    this.drawerbrandVisible = false;
    this.api
      .getAllInventoryBrand(1, 1, 'ID', 'DESC', ' AND STATUS = 1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          this.BrandData.push(data['body']['data'][0]);
          this.data.BRAND_ID = data['body']['data'][0].ID;
          this.OnBrandChange(this.data.BRAND_ID);
        }
      });
  }
  get closebrandCallback() {
    return this.drawerbrandClose.bind(this);
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
  onFileSelected1(event: any) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB

    // File validation
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      this.fileURL1 = <File>event.target.files[0];

      // File size validation
      if (this.fileURL1.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL1 = null;
        return;
      }

      // Proceed with file upload
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL1.name.split('.').pop();

      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = d == null ? '' : d + number + '.' + fileExt;

      if (
        this.data.INVENTORY_DETAILS_IMAGE != undefined &&
        this.data.INVENTORY_DETAILS_IMAGE.trim() != ''
      ) {
        var arr = this.data.INVENTORY_DETAILS_IMAGE.split('/');
        if (arr.length > 1) {
          url = arr[5];
        }
      }

      const uploadedfileExt = this.uploadedImage1.split('.').pop();

      if (this.data.ID || this.UrlImageOne1) {
        if (uploadedfileExt == fileExt) {
          this.UrlImageOne1 = this.uploadedImage1;
        } else {
          this.UrlImageOne1 = url;
        }
      } else {
        this.UrlImageOne1 = url;
      }
      this.progressBarImageOne1 = true;
      this.urlImageOneShow1 = true;
      this.isSpinning = true;

      this.timer = this.api
        .onUpload('InventoryDetailsImage', this.fileURL1, this.UrlImageOne1)
        .subscribe((res) => {
          this.data.INVENTORY_DETAILS_IMAGE = this.UrlImageOne1;
          this.uploadedImage1 = this.data.INVENTORY_DETAILS_IMAGE;
          if (res.type === HttpEventType.Response) {
            // Handle upload success
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne1 = percentDone;
            if (this.percentImageOne1 === 100) {
              this.isSpinning = false;
              setTimeout(() => {
                this.progressBarImageOne1 = false;
              }, 2000);
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload Image.', '');
            this.isSpinning = false;
            this.progressBarImageOne1 = false;
            this.percentImageOne1 = 0;
            this.data.INVENTORY_DETAILS_IMAGE = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] === 200) {
              this.message.success('Image Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.INVENTORY_DETAILS_IMAGE = this.UrlImageOne1;
              this.uploadedImage1 = this.data.INVENTORY_DETAILS_IMAGE;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne1 = false;
              this.percentImageOne1 = 0;
              this.data.INVENTORY_DETAILS_IMAGE = null;
            }
          }
        });
    } else {
      this.message.error('Only images (jpeg, jpg, png) files are allowed.', '');
      this.fileURL1 = null;
      this.isSpinning = false;
      this.progressBarImageOne1 = false;
      this.percentImageOne1 = 0;
      this.data.INVENTORY_DETAILS_IMAGE = null;
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

    // Display the modal only after setting the image URL
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
  image1DeleteConfirm1(data: any) {
    this.data.INVENTORY_DETAILS_IMAGE = '';
    this.fileURL1 = null;
    this.isSpinning = false;
    this.progressBarImageOne1 = false;
    this.percentImageOne1 = 0;
    this.data.INVENTORY_DETAILS_IMAGE = null;
  }
  ImageModalCancel1() {
    this.ImageModalVisible1 = false;
  }
}
