import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  InnerStockMovementRequest,
  StockMovementRequest,
} from 'src/app/Inventorypages/inventorymodal/stockMovementRequestData';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-add-stock-movement-request-master',
  templateUrl: './add-stock-movement-request-master.component.html',
  styleUrls: ['./add-stock-movement-request-master.component.css'],
})
export class AddStockMovementRequestMasterComponent {
  radioValue = '';
  @Input()
  drawerVisible: boolean = false;
  @Input()
  drawerClose!: Function;
  @Input()
  editdata: boolean = false;
  @Input()
  drawerfor: any;
  @Input()
  update: boolean = false;
  @Input()
  data: any = new StockMovementRequest();
  data2 = new InnerStockMovementRequest();
  loadingRecords: any;
  isSpinning: any;
  screenwidth: any;
  product: any;
  isOk = true;
  image: any;
  isFromGodownLoading: boolean = false;
  Itemdata: any[] = [];
  LoadGodown: any[] = [];
  LoadGodown1: any[] = [];
  serialNoData: any = [];
  batchData: any = [];
  @Input()
  items: any[] = [];
  @Input()
  item2: any[] = [];
  today = new Date();
  date: string | number | Date;
  deletedItemData: any[] = [];
  deletedItemData1: any = [];
  newItemTableData: any[] = [];
  public commonFunction = new CommonFunctionService();
  supplierlist: any = [];
  INNERTABLEDATA: any = new InnerStockMovementRequest();
  index = -1;
  totaldata = 1;
  pageSize = 1;
  pageIndex = 1;
  roleID: number;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  roleid = sessionStorage.getItem('roleId'); 
  toGodownName: any;
  tempSelectedItemData: any;
  @Input() category: any;
  isFromGodownLoading1: boolean = false;
  tempSelectedUnitData: any;
  itemWiseUnitList: any;
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number;
  ngOnInit(): void {
    this.data.DATE = new Date();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
    const decryptedUserId1 = this.roleid
      ? this.commonFunction.decryptdata(this.roleid)
      : '0'; 
    this.roleID = Number(decryptedUserId1);
    this.newItemTableData = this.item2.map((item) => item);
    this.GodownMaster();
  }
  checkQuantity(event) {
    if (event) {
      if (Number(event) > this.data2.STOCK) {
        this.message.info(
          'Quantity cannot be greater than available stock',
          ''
        );
        this.data2.QUANTITY = 0;
      } else {
        this.data2.QUANTITY = Number(event);
      }
    }
  }
  getStock(filter, id) {
    var query = '';
    if (id && !this.data2.VARIANT_ID) {
      query = " AND ITEM_ID='" + id + "'";
    }
    if (id && this.data2.VARIANT_ID) {
      query = " AND ITEM_ID='" + this.data2.VARIANT_ID + "'";
    }
    if (this.data.SOURCE_WAREHOUSE_ID) {
      query += " AND WAREHOUSE_ID='" + this.data.SOURCE_WAREHOUSE_ID + "'";
    }
    if (this.radioValue == 'N' && filter) {
      filter = '';
    }
    if (this.radioValue == 'S' && filter) {
      query += " AND SERIAL_NO='" + filter + "'";
    }
    if (this.radioValue == 'B' && filter) {
      query += " AND BATCH_NO='" + filter + "'";
    }
    this.data2.STOCK = null;
    this.data2.STOCK_UNIT_ID = null;
    this.api.getInventoryStock(query).subscribe((data) => {
      if (data['status'] == 200 && data.body['count'] > 0) {
        if (this.radioValue == 'S') {
          this.data2.STOCK = data.body['data'][0]['CURRENT_STOCK'];
          this.data2.STOCK_UNIT_ID = data.body['data'][0]['ACTUAL_UNIT_ID'];
        }
        if (this.radioValue == 'B') {
          this.data2.STOCK = data.body['data'][0]['CURRENT_STOCK'];
          this.data2.STOCK_UNIT_ID = data.body['data'][0]['ACTUAL_UNIT_ID'];
        }
        if (this.radioValue == 'N') {
          this.data2.STOCK = data.body['data'][0]['CURRENT_STOCK'];
          this.data2.STOCK_UNIT_ID = data.body['data'][0]['ACTUAL_UNIT_ID'];
        }
      }
    });
  }
  getBatchData() {
    var query = '';
    if (this.data2.INVENTORY_ID && !this.data2.VARIANT_ID) {
      query = ' AND ITEM_ID=' + this.data2.INVENTORY_ID;
    }
    if (this.data2.INVENTORY_ID && this.data2.VARIANT_ID) {
      query = ' AND ITEM_ID=' + this.data2.VARIANT_ID;
    }
    if (this.data.SOURCE_WAREHOUSE_ID) {
      query += ' AND WAREHOUSE_ID=' + this.data.SOURCE_WAREHOUSE_ID;
    }
    this.api
      .getInventorySerialNoBatch(
        this.radioValue,
        this.data.SOURCE_WAREHOUSE_ID,
        'BATCH_NO',
        query
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          this.batchData = data.body['data'];
          if (this.items.length > 0) {
            this.items.forEach((item) => {
              if (item.BATCH_NO) {
                this.batchData = this.batchData.filter(
                  (data) => data.BATCH_NO !== String(item.BATCH_NO)
                );
              }
            });
          }
        } else {
          this.batchData = [];
        }
      });
  }
  getSerialNoData() {
    var query = '';
    if (this.data2.INVENTORY_ID && !this.data2.VARIANT_ID) {
      query = ' AND ITEM_ID=' + this.data2.INVENTORY_ID;
    }
    if (this.data2.INVENTORY_ID && this.data2.VARIANT_ID) {
      query = ' AND ITEM_ID=' + this.data2.VARIANT_ID;
    }
    if (this.data.SOURCE_WAREHOUSE_ID) {
      query += ' AND WAREHOUSE_ID=' + this.data.SOURCE_WAREHOUSE_ID;
    }
    this.api
      .getInventorySerialNoBatch(
        this.radioValue,
        this.data.SOURCE_WAREHOUSE_ID,
        'SERIAL_NO',
        query
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          this.serialNoData = data.body['data'];
          if (this.items.length > 0) {
            this.items.forEach((item) => {
              if (item.SERIAL_NO) {
                this.serialNoData = this.serialNoData.filter(
                  (data) => data.SERIAL_NO !== String(item.SERIAL_NO)
                );
              }
            });
          }
        } else {
          this.serialNoData = [];
        }
      });
  }
  onChangeMovementType(event) {
    this.data2.INVENTORY_ID = null;
    this.showvariant = false;
    this.serialNoData = [];
    this.batchData = [];
    this.data2.SERIAL_NO = null;
    this.data2.STOCK_UNIT_ID = null;
    this.data2.BATCH_NO = null;
    this.data2.QUANTITY = 0;
    this.data2.STOCK = 0;
    this.data2.UNIT_ID = null;
    this.data2.VARIANT_ID = null;
    this.radioValue = event;
    if (event == 'S') {
      this.getSerialNoData();
      this.loadItems();
    } else if (event == 'B') {
      this.getBatchData();
      this.loadItems();
    } else {
      this.loadItems();
    }
  }
  loadItems(): void {
    this.Itemdata = [];
    this.api
      .getInventoryHirarchyInwardFilterWise(
        this.radioValue,
        this.data.SOURCE_WAREHOUSE_ID,
        this.IS_FIRST
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.Itemdata = data['body']['data'][0]['hierarchy'];
          } else {
            this.Itemdata = [];
          }
        },
        (err) => {
          this.message.error('Server Not Found', '');
        }
      );
  }
  GodownMaster(): void {
    this.LoadGodown = [];
    this.LoadGodown1 = [];
    var userMainId = '';
    if (
      this.USER_ID != null &&
      this.USER_ID != undefined &&
      this.USER_ID != 0
    ) {
      userMainId = ' AND USER_ID=' + this.USER_ID;
    } else {
      userMainId = '';
    }
    if (this.roleID == 1 || this.roleID == 8) {
      this.isFromGodownLoading = true;
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isFromGodownLoading = false;
            this.LoadGodown = data['data'];
            this.LoadGodown1 = data['data'];
            this.LoadGodownMain = data['data'];
            this.LoadGodownMain1 = data['data'];
          } else {
            this.isFromGodownLoading = false;
            this.LoadGodown = [];
            this.LoadGodown1 = [];
          }
        },
        (err) => {
          this.LoadGodown = [];
          this.LoadGodown1 = [];
          this.isFromGodownLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
    } else {
      this.api
        .getBackOfficeData(0, 0, '', 'desc', ' AND IS_ACTIVE=1' + userMainId)
        .subscribe(
          (datat) => {
            if (datat['code'] == 200) {
              if (datat['count'] > 0) {
                this.isFromGodownLoading = true;
                this.api
                  .getWarehouses(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND STATUS=1 AND WAREHOUSE_MANAGER_ID=' +
                    datat['data'][0]['ID']
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.isFromGodownLoading = false;
                        this.LoadGodown1 = data['data'];
                        this.LoadGodownMain1 = data['data'];
                      } else {
                        this.isFromGodownLoading = false;
                        this.LoadGodown1 = [];
                      }
                    },
                    (err) => {
                      this.isFromGodownLoading = false;
                      this.message.error('Server Not Found', '');
                    }
                  );
              } else {
                this.isFromGodownLoading = false;
                this.LoadGodown1 = [];
              }
            } else {
              this.isFromGodownLoading = false;
              this.LoadGodown1 = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.isFromGodownLoading = false;
            this.LoadGodown1 = [];
          }
        );
      this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isFromGodownLoading = false;
            this.LoadGodown = data['data'];
            this.LoadGodownMain = data['data'];
          } else {
            this.isFromGodownLoading = false;
            this.LoadGodown = [];
          }
        },
        (err) => {
          this.LoadGodown = [];
          this.isFromGodownLoading = false;
          this.message.error('Server Not Found', '');
        }
      );
    }
  }
  onUnitSelection(key: number): void {
    this.tempSelectedUnitData = this.itemWiseUnitList.filter(
      (val: any) => val.UNIT_ID === key
    );
  }
  IS_FIRST = 0;
  changeFromGodown(event: any) {
    this.data2.INVENTORY_ID = null;
    if (event === this.data.DESTINATION_WAREHOUSE_ID) {
      this.data.DESTINATION_WAREHOUSE_ID = null;
      this.data.DESTINATION_WAREHOUSE_NAME = null;
    }
    if (
      this.data.DESTINATION_WAREHOUSE_ID !== null &&
      this.data.DESTINATION_WAREHOUSE_ID !== undefined &&
      this.data.DESTINATION_WAREHOUSE_ID !== ''
    ) {
      var mangeruserid: any = this.LoadGodown.filter(
        (val: any) => val.ID === this.data.DESTINATION_WAREHOUSE_ID
      );
      if (
        mangeruserid !== null &&
        mangeruserid !== undefined &&
        mangeruserid !== ''
      ) {
        this.data.WAREHOUSE_MANAGER_USER_ID = mangeruserid[0]?.USER_ID;
      }
    }
    if (event) {
      this.api
        .getInventorymovement(
          0,
          0,
          '',
          'desc',
          ' AND SOURCE_WAREHOUSE_ID=' +
          event +
          ' AND DESTINATION_WAREHOUSE_ID=' +
          this.data.DESTINATION_WAREHOUSE_ID
        )
        .subscribe((data) => {
          if (data['count'] > 0) {
            this.IS_FIRST = 0;
          } else if (data['count'] == 0) {
            this.IS_FIRST = 1;
          }
        });
    }
    this.radioValue = '';
    this.onChangeMovementType(this.radioValue);
    this.getFilteredDestinationGodowns();
    this.INNERTABLEDATA = {};
    this.items = [];
  }
  LoadGodownMain: any = [];
  LoadGodownMain1: any = [];
  getallgodowns() {
    this.isFromGodownLoading1 = true;
    this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isFromGodownLoading1 = false;
          this.LoadGodown1 = data['data'];
          this.LoadGodownMain = data['data'];
          this.getFilteredDestinationGodowns();
        } else {
          this.isFromGodownLoading1 = false;
          this.LoadGodown1 = [];
          this.LoadGodownMain = [];
        }
      },
      (err) => {
        this.LoadGodown1 = [];
        this.LoadGodownMain = [];
        this.isFromGodownLoading1 = false;
        this.message.error('Server Not Found', '');
      }
    );
  }
  getFilteredDestinationGodowns() {
    if (
      this.data.SOURCE_WAREHOUSE_ID === null ||
      this.data.SOURCE_WAREHOUSE_ID === undefined ||
      this.data.SOURCE_WAREHOUSE_ID === 0 ||
      this.data.SOURCE_WAREHOUSE_ID === ''
    ) {
      this.LoadGodown1 = this.LoadGodownMain;
    } else {
      this.LoadGodown = this.LoadGodownMain.filter(
        (godown) => godown.ID !== this.data.SOURCE_WAREHOUSE_ID
      );
    }
  }
  save(addNew: boolean, form1: NgForm): void {
    this.isOk = true;
    if (
      this.data.DATE === null ||
      this.data.DATE === undefined ||
      this.data.DATE === null
    ) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    }
    else if (
      this.data.SOURCE_WAREHOUSE_ID === undefined ||
      this.data.SOURCE_WAREHOUSE_ID === null ||
      this.data.SOURCE_WAREHOUSE_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please select source warehouse', '');
    } else if (
      this.data.DESTINATION_WAREHOUSE_ID === undefined ||
      this.data.DESTINATION_WAREHOUSE_ID === null ||
      this.data.DESTINATION_WAREHOUSE_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please select destination warehouse', '');
    } else if (this.items.length === 0) {
      this.isOk = false;
      this.message.error('Please Add Item(s)', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.data.USER_ID = Number(this.USER_ID);
      this.data.USER_NAME = this.commonFunction.decryptdata(
        sessionStorage.getItem('userName') || ''
      );
      this.data.SOURCE_WAREHOUSE_ID = Number(this.data.SOURCE_WAREHOUSE_ID);
      this.data.DESTINATION_WAREHOUSE_ID = Number(
        this.data.DESTINATION_WAREHOUSE_ID
      );
      this.data.STATUS = 'P';
      this.deletedItemData1 = this.newItemTableData.filter(
        (newItem) => !this.items.some((item) => item.ITEM_ID == newItem.ITEM_ID)
      );
      this.deletedItemData1.forEach((newItem) => {
        this.deletedItemData.push({
          ITEM_ID: newItem.ITEM_ID,
          ITEM_CATEGORY_ID: newItem.ITEM_CATEGORY_ID,
          REQUESTED_QTY_UNIT_ID: newItem.REQUESTED_QTY_UNIT_ID,
        });
      });
      if (this.data.ID) {
        this.data.DATE = this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );
        this.data.USER_NAME = this.commonFunction.decryptdata(
          sessionStorage.getItem('userName') || ''
        );
        this.data.DATE = this.datePipe.transform(
          this.data.DATE,
          'yyyy-MM-dd HH:mm:ss'
        );
        const selectedWarehouse = this.LoadGodownMain.find(
          (val: any) => val.ID === this.data.DESTINATION_WAREHOUSE_ID
        );
        this.data.DESTINATION_WAREHOUSE_NAME = selectedWarehouse
          ? selectedWarehouse.NAME
          : null;
        const selectedWarehouse1111 = this.LoadGodownMain.find(
          (val: any) => val.ID === this.data.SOURCE_WAREHOUSE_ID
        );
        this.data.SOURCE_WAREHOUSE_NAME = selectedWarehouse1111
          ? selectedWarehouse1111.NAME
          : null;
        this.data.USER_NAME = this.commonFunction.decryptdata(
          sessionStorage.getItem('userName') || ''
        );
        this.data.INVENTORY_DETAILS = this.items;
        this.data.deletedItemData = this.deletedItemData;
        this.api.CreateStockRequpdate(this.data).subscribe(
          (successCode) => {
            if (successCode['status'] == 200) {
              this.message.success('Stock Movement Update Successfully', '');
              this.isSpinning = false;
              if (!addNew) this.drawerClose();
            } else if (successCode['status'] == 304) {
              this.message.error('Please start your factory day', '');
              this.isSpinning = false;
            } else {
              this.message.error('Stock Movement Updation failedd', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
          }
        );
      } else {
        const selectedWarehouse = this.LoadGodownMain.find(
          (val: any) => val.ID === this.data.DESTINATION_WAREHOUSE_ID
        );
        this.data.DESTINATION_WAREHOUSE_NAME = selectedWarehouse
          ? selectedWarehouse.NAME
          : null;
        const selectedWarehouse1111 = this.LoadGodownMain.find(
          (val: any) => val.ID === this.data.SOURCE_WAREHOUSE_ID
        );
        this.data.SOURCE_WAREHOUSE_NAME = selectedWarehouse1111
          ? selectedWarehouse1111.NAME
          : null;
        this.data.USER_NAME = this.commonFunction.decryptdata(
          sessionStorage.getItem('userName') || ''
        );
        this.data['INVENTORY_DETAILS'] = this.items;
        this.data.deletedItemData = [];
        this.data.DATE = this.datePipe.transform(
          this.data.DATE,
          'yyyy-MM-dd HH:mm:ss'
        );
        this.api.createMovement(this.data).subscribe(
          (successCode) => {
            if (successCode['status'] == 200) {
              this.message.success('Stock Movement Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new StockMovementRequest();
                this.resetDrawer(form1);
                this.items = [];
              }
              this.isSpinning = false;
            } else {
              this.message.error('Stock Movement Creation Failed', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.message.error('Stock Movement Updation failed', '');
          }
        );
      }
    }
  }
  newRequestNo(): void {
    this.api.stockMovementRequest(1, 1, 'ID', 'DESC', '').subscribe(
      (data) => {
        if (data['status'] == 200) {
          if (data['body']['data'].length > 0) {
            let lastYear =
              data['body']['data'][0]['MOVEMENT_NUMBER'].split('/')[
              data['body']['data'][0]['MOVEMENT_NUMBER'].split('/').length - 1
              ];
            let currentYear = new Date().getFullYear();
            let previousID =
              data['body']['data'][0]['MOVEMENT_NUMBER'].split('/')[
              data['body']['data'][0]['MOVEMENT_NUMBER'].split('/').length - 2
              ];
            let lastID = 0;
            if (!previousID) {
              lastID = 1;
            } else {
              lastID =
                Number(
                  data['body']['data'][0]['MOVEMENT_NUMBER'].split('/')[
                  data['body']['data'][0]['MOVEMENT_NUMBER'].split('/')
                    .length - 2
                  ]
                ) + 1;
            }
            if (lastYear === currentYear) {
              this.data.MOVEMENT_NUMBER =
                'REQ/' +
                lastID.toString().padStart(4, '0') +
                '/' +
                lastYear.toString().slice(-2) +
                '/' +
                'A';
            } else {
              this.data.MOVEMENT_NUMBER =
                'REQ/' +
                lastID.toString().padStart(4, '0') +
                '/' +
                currentYear.toString().slice(-2) +
                '/' +
                'A';
            }
          } else {
            let currentYear = new Date().getFullYear();
            let lastID = 1;
            this.data.MOVEMENT_NUMBER =
              'REQ/' +
              lastID.toString().padStart(4, '0') +
              '/' +
              currentYear.toString().slice(-2) +
              '/' +
              'A';
          }
        }
      },
      (err) => { }
    );
  }
  resetDrawer(form1: NgForm) {
    this.data = new StockMovementRequest();
    form1.form.markAsPristine();
    form1.form.markAsUntouched();
  }
  addData(addNew: boolean, form2: NgForm): void {
    this.isOk = true;
    this.data.MOVEMENT_TYPE = 'T';
    let inventorytrackingtype = this.radioValue;
    if (!this.data2.INVENTORY_ID || this.data2.INVENTORY_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Item Name', '');
      return;
    }
    if (
      this.data2.IS_VARIANT &&
      (!this.data2.VARIANT_ID || this.data2.VARIANT_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Variant Name', '');
      return;
    }
    if (this.radioValue === 'S' && !this.data2.SERIAL_NO) {
      this.isOk = false;
      this.message.error('Please Select Serial No', '');
      return;
    }
    if (this.radioValue === 'B' && !this.data2.BATCH_NO) {
      this.isOk = false;
      this.message.error('Please Select Batch No', '');
      return;
    }
    if (!this.data2.STOCK || this.data2.STOCK <= 0) {
      this.isOk = false;
      this.message.info('There Is No Stock Available', '');
      return;
    }
    if (!this.data2.STOCK_UNIT_ID || this.data2.STOCK_UNIT_ID === 0) {
      this.isOk = false;
      this.message.info('There is No Stock Unit Available', '');
      return;
    }
    if (!this.data2.QUANTITY || this.data2.QUANTITY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Quantity', '');
      return;
    }
    if (!this.data2.UNIT_ID || this.data2.UNIT_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Unit Name', '');
      return;
    }
    if (this.editdata) {
      this.data2.INVENTORY_ID = this.data2.VARIANT_ID
        ? this.data2.VARIANT_ID
        : this.data2.INVENTORY_ID;
    }
    let existingIndex = this.items.findIndex(
      (element: any) =>
        Number(element.INVENTORY_ID) === Number(this.inventoryid) &&
        Number(element.UNIT_ID) === Number(this.data2.UNIT_ID) &&
        (element.SERIAL_NO === this.data2.SERIAL_NO ||
          (!element.SERIAL_NO && !this.data2.SERIAL_NO)) &&
        (element.BATCH_NO === this.data2.BATCH_NO ||
          (!element.BATCH_NO && !this.data2.BATCH_NO))
    );
    if (existingIndex > -1) {
      let existingItem = this.items[existingIndex];
      if (existingItem.STOCK < existingItem.QUANTITY + this.data2.QUANTITY) {
        this.message.error(
          'Quantity should be less than or equal to available stock',
          ''
        );
        return;
      }
      existingItem.QUANTITY += Number(this.data2.QUANTITY);
      this.items = [...this.items]; 
    } else if (this.index > -1) {
      this.items[this.index] = Object.assign({}, this.data2);
      this.items = [...this.items]; 
    } else {
      let selectedUnit = this.itemWiseUnitList.find(
        (val: any) => val.UNIT_ID === this.data2.UNIT_ID
      );
      this.INNERTABLEDATA = {
        INVENTORY_ID: this.inventoryid,
        QUANTITY: Number(this.data2.QUANTITY),
        UNIT_ID: this.data2.UNIT_ID,
        PARENT_ID: this.PARENT_ID,
        INVENTORY_TRACKING_TYPE: inventorytrackingtype,
        INVENTORY_NAME: this.data2.INVENTORY_NAME,
        INVENTROY_SUB_CAT_ID: this.data2.INVENTROY_SUB_CAT_ID,
        INVENTORY_CAT_NAME: this.data2.INVENTORY_CAT_NAME,
        INVENTORY_CAT_ID: this.data2.INVENTORY_CAT_ID,
        INVENTROY_SUB_CAT_NAME: this.data2.INVENTROY_SUB_CAT_NAME,
        UNIT_NAME: selectedUnit?.UNIT_NAME,
        IS_VERIENT: this.ItemDetails.IS_VERIENT,
        VARIANT_NAME: this.data2.VARIANT_NAME,
        VARIANT_ID: this.ItemDetails.ID,
        SERIAL_NO: this.data2.SERIAL_NO,
        BATCH_NO: this.data2.BATCH_NO,
        STOCK: this.data2.STOCK,
        STOCK_UNIT_ID: this.data2.STOCK_UNIT_ID,
        QUANTITY_PER_UNIT: this.ItemDetails.BASE_QUANTITY,
      };
      this.batchData = this.batchData.filter(
        (data) => data.BATCH_NO != this.INNERTABLEDATA.BATCH_NO
      );
      this.items.push(this.INNERTABLEDATA);
      this.items = [...this.items]; 
    }
    this.index = -1;
    this.totaldata = this.items.length;
    this.editdata = false;
    form2.form.reset();
    this.Unitload = false;
    this.data2.VARIANT_ID = null;
    this.data2.VARIANT_NAME = null;
    this.data2.IS_VARIANT = false;
  }
  removedItems: any[] = [];
  edit(data2: InnerStockMovementRequest, i: number): void {
    data2.VARIANT_ID = this.varientId ? this.varientId : data2.VARIANT_ID;
    if (this.varientId) {
      data2.INVENTORY_ID =
        data2.INVENTORY_CAT_ID +
        '-' +
        data2.INVENTROY_SUB_CAT_ID +
        '-' +
        this.ItemDetails.ID;
    } else {
      data2.INVENTORY_ID =
        data2.INVENTORY_CAT_ID +
        '-' +
        data2.INVENTROY_SUB_CAT_ID +
        '-' +
        data2.INVENTORY_ID;
    }
    this.editdata = true;
    this.index = i;
    if (data2['IS_HAVE_VARIANTS'] == true) {
      this.getUnitsedit(data2.VARIANT_ID, data2.UNIT_ID);
      this.data2.STOCK_UNIT_ID = data2.UNIT_ID;
    } else {
      this.getUnitsedit(data2.INVENTORY_ID, data2.UNIT_ID);
    }
    this.radioValue = data2['INVENTORY_TRACKING_TYPE'];
    this.getNamesCatAndSub(data2.INVENTORY_ID);
    this.GetVariants(data2.INVENTORY_ID);
    this.data2 = Object.assign({}, data2);
  }
  delete(data: any, i: number): void {
    this.items = this.items.filter(
      (dat, idx) => !(idx === i && dat.INVENTORY_ID === data.INVENTORY_ID)
    );
  }
  cancel(): void { }
  close(): void {
    this.drawerClose();
  }
  splitddata: any;
  InwardVarientsGet: any = [];
  ItemDetails: any;
  Unitload: boolean = false;
  getUnits(event: any) {
    this.Unitload = true;
    if (event) {
      this.api
        .getItemMappingData(0, 0, '', 'asc', ' AND ITEM_ID=' + event)
        .subscribe(
          (unitdata) => {
            if (unitdata.code == 200) {
              this.Unitload = false;
              this.itemWiseUnitList = unitdata['data'];
              if (unitdata['count'] > 0) {
                var FiltUnit: any = this.itemWiseUnitList.find(
                  (product) => product.UNIT_ID === this.ItemDetails.BASE_UNIT_ID
                );
                if (
                  FiltUnit !== null &&
                  FiltUnit !== undefined &&
                  FiltUnit !== ''
                ) {
                  this.data2.UNIT_ID = FiltUnit.UNIT_ID;
                  this.data2.UNIT_NAME = FiltUnit.UNIT_NAME;
                  this.onUnitSelection(FiltUnit.UNIT_ID);
                }
              }
            } else {
              this.Unitload = false;
              this.itemWiseUnitList = [];
            }
          },
          (err) => {
            this.Unitload = false;
            this.itemWiseUnitList = [];
          }
        );
    } else {
      this.Unitload = false;
    }
  }
  getUnitsVarient(event: any) {
    this.Unitload = true;
    if (event) {
      this.api
        .getItemMappingData(0, 0, '', 'asc', ' AND ITEM_ID=' + event)
        .subscribe(
          (unitdata) => {
            if (unitdata.code == 200) {
              this.Unitload = false;
              this.itemWiseUnitList = unitdata['data'];
              if (unitdata['count'] > 0) {
                var FiltUnit: any = this.InwardVarientsGet.find(
                  (product) => product.ID === event
                );
                if (
                  FiltUnit !== null &&
                  FiltUnit !== undefined &&
                  FiltUnit !== ''
                ) {
                  this.data2.UNIT_ID = FiltUnit.BASE_UNIT_ID;
                  this.data2.UNIT_NAME = FiltUnit.BASE_UNIT_NAME;
                  this.onUnitSelection(FiltUnit.BASE_UNIT_ID);
                }
              }
            } else {
              this.Unitload = false;
              this.itemWiseUnitList = [];
            }
          },
          (err) => {
            this.Unitload = false;
            this.itemWiseUnitList = [];
          }
        );
    } else {
      this.Unitload = false;
    }
  }
  getUnitsedit(event: any, unit: any) {
    this.Unitload = true;
    if (event) {
      this.api
        .getItemMappingData(0, 0, '', 'asc', ' AND ITEM_ID=' + event)
        .subscribe(
          (unitdata) => {
            if (unitdata['code'] == 200) {
              this.Unitload = false;
              this.itemWiseUnitList = unitdata['data'];
              this.onUnitSelection(unit);
            } else {
              this.Unitload = false;
              this.itemWiseUnitList = [];
            }
          },
          (err) => {
            this.Unitload = false;
            this.itemWiseUnitList = [];
          }
        );
    } else {
      this.Unitload = false;
    }
  }
  GetVariants(event: any) {
    if (event != null && event !== undefined && event !== '') {
      if (
        this.ItemDetails !== null &&
        this.ItemDetails !== undefined &&
        this.ItemDetails !== ''
      ) {
        if (this.ItemDetails.IS_HAVE_VARIANTS == true) {
          this.showvariant = true;
          this.data2.IS_VARIANT = true;
          this.itemWiseUnitList = [];
          this.data2.QUANTITY = 1;
          this.data2.UNIT_ID = null;
          this.data2.UNIT_NAME = null;
          this.api
            .getInventory(0, 0, '', '', ' AND PARENT_ID=' + this.ItemDetails.ID)
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.InwardVarientsGet = data['data'];
                  if (this.editdata) {
                    if (this.radioValue) {
                      if (this.radioValue == 'S') {
                        this.getSerialNoData();
                      } else if (this.radioValue == 'B') {
                        this.getBatchData();
                      }
                    }
                  }
                } else {
                  this.InwardVarientsGet = [];
                  this.message.error('Failed to get Inventory Records', '');
                }
              },
              (err) => {
                this.InwardVarientsGet = [];
                this.message.error('Failed To Get Inventory Records', '');
              }
            );
          if (this.items.length > 0) {
            this.items.forEach((item) => {
              if (item.SERIAL_NO) {
                this.serialNoData = this.serialNoData.filter(
                  (data) => data.SERIAL_NO !== String(item.SERIAL_NO)
                );
              }
              if (item.BATCH_NO) {
                this.batchData = this.batchData.filter(
                  (data) => data.BATCH_NO !== String(item.BATCH_NO)
                );
              }
            });
          }
        } else {
          this.showvariant = false;
          this.InwardVarientsGet = [];
          this.data2.VARIANT_ID = null;
          this.data2.IS_VARIANT = false;
          this.data2.QUANTITY = 1;
          this.getUnits(this.ItemDetails.ID);
        }
      } else {
        this.InwardVarientsGet = [];
        this.data2.VARIANT_ID = null;
        this.data2.QUANTITY = 1;
        this.data2.IS_VARIANT = false;
        this.itemWiseUnitList = [];
      }
    } else {
      this.InwardVarientsGet = [];
      this.data2.VARIANT_ID = null;
      this.data2.QUANTITY = 1;
      this.itemWiseUnitList = [];
    }
  }
  inventoryid: any;
  onSerialNoChange(event) {
    this.getStock(event, this.inventoryid);
  }
  onBatchNoChange(event) {
    this.getStock(event, this.inventoryid);
  }
  PARENT_ID;
  child;
  getNamesCatAndSub(selectedKey: any): void {
    this.data2.UNIT_ID = null;
    this.data2.STOCK_UNIT_ID = null;
    this.data2.STOCK = 0;
    this.data2.VARIANT_ID = null;
    this.data2.VARIANT_NAME = null;
    this.data2.BATCH_NO = null;
    this.data2.SERIAL_NO = null;
    this.data2.UNIT_NAME = null;
    this.data2.QUANTITY = 0;
    if (
      selectedKey != null &&
      selectedKey !== undefined &&
      selectedKey !== ''
    ) {
      const ancestry = this.findNodeAncestry(this.Itemdata, selectedKey);
      if (ancestry) {
        this.data2.INVENTORY_CAT_ID = ancestry[0].id;
        this.data2.INVENTORY_CAT_NAME = ancestry[0].title;
        if (ancestry.length > 1) {
          this.data2.INVENTROY_SUB_CAT_ID = ancestry[1].id;
          this.data2.INVENTROY_SUB_CAT_NAME = ancestry[1].title;
        } else {
          this.data2.INVENTROY_SUB_CAT_ID = null;
          this.data2.INVENTROY_SUB_CAT_NAME = null;
        }
        const child = ancestry[ancestry.length - 1];
        this.PARENT_ID = child.details?.PARENT_ID;
        this.data2.INVENTORY_ID = child.id; 
        this.inventoryid = child.id;
        this.data2.INVENTORY_NAME = child.title;
        this.ItemDetails = child.details;
        this.radioValue = this.ItemDetails.INVENTORY_TRACKING_TYPE;
        this.getUnitsedit(child.id, child.details?.BASE_UNIT_ID);
        if (this.radioValue == 'S') {
          this.getSerialNoData();
          this.getStock(this.data2.SERIAL_NO, this.data2.INVENTORY_ID);
        }
        if (this.radioValue == 'B') {
          this.getBatchData();
          this.getStock(this.data2.BATCH_NO, this.data2.INVENTORY_ID);
        }
        if (this.radioValue == 'N') {
          this.getStock('', this.data2.INVENTORY_ID);
        }
      }
      if (this.items.length > 0) {
        this.items.forEach((item) => {
          if (item.SERIAL_NO) {
            this.serialNoData = this.serialNoData.filter(
              (data) => data.SERIAL_NO !== String(item.SERIAL_NO)
            );
          }
          if (item.BATCH_NO) {
            this.batchData = this.batchData.filter(
              (data) => data.BATCH_NO !== String(item.BATCH_NO)
            );
          }
        });
      }
    } else {
      this.data2.INVENTORY_CAT_NAME = null;
      this.data2.INVENTROY_SUB_CAT_NAME = null;
      this.data2.INVENTROY_SUB_CAT_ID = null;
      this.data2.INVENTORY_CAT_ID = null;
      this.data2.INVENTORY_ID = null;
      this.data2.INVENTORY_NAME = null;
    }
  }
  varientId;
  onVariantChange(event) {
    var dataaaa = this.InwardVarientsGet.filter((val: any) => val.ID === event);
    this.data2.VARIANT_NAME = dataaaa[0]?.VARIANT_COMBINATION;
    if (event) {
      this.inventoryid = dataaaa[0]?.ID;
      this.varientId = dataaaa[0]?.ID;
    }
    this.getUnitsVarient(dataaaa[0]?.ID);
    this.radioValue = dataaaa[0]?.INVENTORY_TRACKING_TYPE;
    this.data2.STOCK_UNIT_ID = null;
    if (this.radioValue == 'S') {
      this.getSerialNoData();
      this.getStock(this.data2.SERIAL_NO, this.data2.INVENTORY_ID);
    }
    if (this.radioValue == 'B') {
      this.getBatchData();
      this.getStock(this.data2.BATCH_NO, this.data2.INVENTORY_ID);
    }
    if (this.radioValue == 'N') {
      this.getStock('', this.inventoryid);
    }
    this.data2.SERIAL_NO = null;
    this.data2.BATCH_NO = null;
  }
  showvariant: any = false;
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
  approvalQuantityChange(event, i, data) {
    if (event != null && event !== undefined && event !== '') {
      if (event > data.INWARD_QUANTITY) {
        this.items[i].APPROVAL_QUANTITY = null;
        data.APPROVAL_QUANTITY = null;
        this.message.error(' Quantity is more than Available Quantity', '');
      } else if (event > data.QUANTITY) {
        this.items[i].APPROVAL_QUANTITY = null;
        data.APPROVAL_QUANTITY = null;
        this.message.error('Approved Quantity is more than Quantity', '');
      }
    }
  }
  approve() {
    this.isSpinning = true;
    for (let i = 0; i < this.items.length; i++) {
      if (
        this.items[i].APPROVAL_QUANTITY == null ||
        this.items[i].APPROVAL_QUANTITY == undefined ||
        this.items[i].APPROVAL_QUANTITY == '' ||
        this.items[i].APPROVAL_QUANTITY == 0
      ) {
        this.message.error('please enter the approval quantity', '');
        this.isSpinning = false;
        return;
      }
      if (this.items[i].APPROVAL_QUANTITY > this.items[i].INWARD_QUANTITY) {
        this.items[i].APPROVAL_QUANTITY = null;
        this.items[i].APPROVAL_QUANTITY = null;
        this.message.error(' Quantity is more than Available Quantity', '');
        this.isSpinning = false;
        return;
      } else if (this.items[i].APPROVAL_QUANTITY > this.items[i].QUANTITY) {
        this.items[i].APPROVAL_QUANTITY = null;
        this.items[i].APPROVAL_QUANTITY = null;
        this.message.error('Approved Quantity is more than Quantity', '');
        this.isSpinning = false;
        return;
      }
    }
    this.data.APPROVE_REJECTED_BY_NAME = this.commonFunction.decryptdata(
      sessionStorage.getItem('userName') || ''
    );
    this.data.APPROVE_REJECTED_DATE = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data.APPROVE_REJECTED_BY_ID = this.USER_ID;
    this.data.STATUS = 'A';
    this.data.DETAILS_DATA = this.items;
    this.api.approverejectmomentreq(this.data).subscribe(
      (successCode) => {
        if (successCode['status'] == 200) {
          this.message.success(
            'Stock Movement Request Approved Successfully',
            ''
          );
          this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Stock Movement Request Approved Failed', '');
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
        this.message.error('Stock Movement Request Approved failed', '');
      }
    );
  }
  reject() {
    this.isSpinning = true;
    if (
      this.data.REASON == null ||
      this.data.REASON == undefined ||
      this.data.REASON == ''
    ) {
      this.message.error('please enter the reason', '');
      this.isSpinning = false;
      return;
    }
    this.data.APPROVE_REJECTED_BY_NAME = this.commonFunction.decryptdata(
      sessionStorage.getItem('userName') || ''
    );
    this.data.APPROVE_REJECTED_DATE = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data.APPROVE_REJECTED_BY_ID = this.USER_ID;
    this.data.STATUS = 'R';
    this.data.DETAILS_DATA = this.items;
    this.api.approverejectmomentreq(this.data).subscribe(
      (successCode) => {
        if (successCode['status'] == 200) {
          this.message.success(
            'Stock Movement Request Rejected Successfully',
            ''
          );
          this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Stock Movement Request Rejected Failed', '');
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
        this.message.error('Stock Movement Request Rejected failed', '');
      }
    );
  }
  showreject: boolean = false;
  reject111() {
    this.showreject = true;
  }
  closereject() {
    this.showreject = false;
    this.data.REASON = '';
  }
}