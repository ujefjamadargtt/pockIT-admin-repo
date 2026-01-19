import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  TechnicianRequestMovementCust,
  InnerTableCust,
} from 'src/app/Inventorypages/inventorymodal/technicianMovement';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-customerto-tech-stock-move-drawer',
  templateUrl: './customerto-tech-stock-move-drawer.component.html',
  styleUrls: ['./customerto-tech-stock-move-drawer.component.css']
})
export class CustomertoTechStockMoveDrawerComponent {
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
  data: any = new TechnicianRequestMovementCust();
  data2 = new InnerTableCust();
  loadingRecords: any;
  isSpinning: any;
  screenwidth: any;
  product: any;
  isOk = true;
  image: any;
  isFromGodownLoading: boolean = false;
  LoadGodownMain: any = [];
  Itemdata: any[] = [];
  LoadGodown: any[] = [];
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
  INNERTABLEDATA: any = new InnerTableCust();
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
  technicianData: any = [];
  getTechnician(event: any) {
    this.data.TECHNICIAN_ID = null;
    this.technicianData = [];
    this.isFromGodownLoading1 = true;
    this.api
      .gettechniciantransfer(
        event
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          this.isFromGodownLoading1 = false;
          this.technicianData = data.body['data'];
        } else {
          this.isFromGodownLoading1 = false;
          this.technicianData = [];
        }
      }, err => {
        this.isFromGodownLoading1 = false;
        this.technicianData = [];
      });
  }
  loadItems(): void {
    this.Itemdata = [];
    let wmanager;
    let TechnicianId;
    if (this.data.CUSTOMER_ID && this.data.TECHNICIAN_ID) {
      if (this.data.TRANSFER_MODE == 'T') {
        wmanager = null;
        TechnicianId = this.data.TECHNICIAN_ID;
      } else {
        wmanager = null;
        TechnicianId = null;
      }
      this.api
        .getInventoryHirarchyInwardFilterWise2cust(
          this.data.CUSTOMER_ID,
          this.data.TECHNICIAN_ID
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.Itemdata = data['body']['data'];
            } else {
              this.Itemdata = [];
            }
          },
          (err) => {
            this.message.error('Server Not Found', '');
          }
        );
    }
  }
  GodownMaster(): void {
    this.LoadGodown = [];
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
      this.api.getcustomertransfer(0, 0, 'ID', 'desc', '').subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.isFromGodownLoading = false;
            this.LoadGodown = data.body['data'];
            this.LoadGodownMain = data.body['data'];
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
    } else {
      this.isFromGodownLoading = true;
      this.api
        .getcustomertransfer(
          0,
          0,
          'ID',
          'desc',
          ''
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.isFromGodownLoading = false;
              this.LoadGodown = data.body['data'];
              this.LoadGodownMain = data.body['data'];
            } else {
              this.isFromGodownLoading = false;
              this.LoadGodown = [];
            }
          },
          (err) => {
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
  gettechname(event: any) {
    var custname: any = this.technicianData.filter(
      (val: any) => val.ID === event
    );
    this.data.TECHNICIAN_NAME = custname[0].NAME;
  }
  getcustname(event: any) {
    var custname: any = this.LoadGodown.filter(
      (val: any) => val.ID === event
    );
    this.data.CUSTOMER_NAME = custname[0].NAME;
  }
  IS_FIRST = 0;
  changeFromGodown(event) {
    this.data2.UNIT_ID = null;
    this.data2.ID = null;
    this.data2.INVENTORY_TRACKING_TYPE = null;
    this.data2.INVENTORY_NAME = null;
    this.data2.INVENTORY_ID = null;
    this.data2.IS_VARIANT = null;
    this.data2.JOB_CARD_ID = null;
    this.data2.BATCH_NO = null;
    this.data2.SERIAL_NO = null;
    this.data2.UNIT_NAME = null;
    this.data2.QUANTITY = null;
    this.data2.IS_VERIENT = 0,
      this.data2.PARENT_ID = null,
      this.data2.VARIANT_NAME = null,
      this.data2.QUANTITY_PER_UNIT = null,
      this.data2.INVENTORY_CAT_ID = null,
      this.data2.INVENTORY_DETAILS_ID = null,
      this.data2.INVENTORY_CAT_NAME = null,
      this.data2.INVENTROY_SUB_CAT_ID = null,
      this.data2.INVENTROY_SUB_CAT_NAME = null,
      this.radioValue = '';
    if (event && this.data.TECHNICIAN_ID && this.data.CUSTOMER_ID) {
      this.loadItems()
    }
    this.INNERTABLEDATA = {};
    this.items = [];
  }
  save(addNew: boolean, form1: NgForm): void {
    this.isOk = true;
    if (
      this.data.DATE === null ||
      this.data.DATE === undefined ||
      this.data.DATE === null
    ) {
      this.isOk = false;
      this.message.error('Please select date', '');
    }
    else if (
      this.data.CUSTOMER_ID === undefined ||
      this.data.CUSTOMER_ID === null ||
      this.data.CUSTOMER_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please select customer name', '');
    } else if (
      this.data.TECHNICIAN_ID === undefined ||
      this.data.TECHNICIAN_ID === null ||
      this.data.TECHNICIAN_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please select technician', '');
    } else if (this.items.length === 0) {
      this.isOk = false;
      this.message.error('Please add atleast 1 part', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.data.USER_ID = Number(this.USER_ID);
      this.data.USER_NAME = this.commonFunction.decryptdata(
        sessionStorage.getItem('userName') || ''
      );
      this.data.CUSTOMER_ID = Number(this.data.CUSTOMER_ID);
      this.data.MOVEMENT_TYPE = 'M'
      this.data.STATUS = 'P';
      this.data.ITEM_IDS = this.items.map(item => item.ID).join(',');
      this.data.INVENTORY_DETAILS_ID = this.items.map(item => item.INVENTORY_DETAILS_ID).join(',');
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
        const techician = this.technicianData.find(
          (val: any) => val.ID === this.data.TECHNICIAN_ID
        );
        this.data.TECHNICIAN_NAME = techician ? techician.NAME : null;
        this.data.USER_NAME = this.commonFunction.decryptdata(
          sessionStorage.getItem('userName') || ''
        );
        this.data.INVENTORY_DETAILS = this.items;
        this.data.deletedItemData = this.deletedItemData;
        this.api.TechnicianStockRequpdatecust(this.data).subscribe(
          (successCode) => {
            if (successCode['status'] == 200) {
              this.message.success(
                'Customer to technician stock transfer successfully',
                ''
              );
              this.isSpinning = false;
              if (!addNew) this.drawerClose();
            } else if (successCode['status'] == 304) {
              this.message.error('Something went wrong, please try again later', '');
              this.isSpinning = false;
            } else {
              this.message.error(
                'Failed to transfer customer to technician stock',
                ''
              );
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
        const techician = this.technicianData.find(
          (val: any) => val.ID === this.data.TECHNICIAN_ID
        );
        this.data.TECHNICIAN_NAME = techician ? techician.NAME : null;
        this.data.USER_NAME = this.commonFunction.decryptdata(
          sessionStorage.getItem('userName') || ''
        );
        this.data['INVENTORY_DETAILS'] = this.items;
        this.data.deletedItemData = [];
        this.data.DATE = this.datePipe.transform(
          this.data.DATE,
          'yyyy-MM-dd HH:mm:ss'
        );
        this.api.createTechnicianMovementcust(this.data).subscribe(
          (successCode) => {
            if (successCode['status'] == 200) {
              this.message.success(
                'Customer to technician stock transfer successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.data = new TechnicianRequestMovementCust();
                this.resetDrawer(form1);
                this.items = [];
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed to transfer customer to technician stock', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.message.error('Failed to transfer customer to technician stock', '');
          }
        );
      }
    }
  }
  INVENTORY_ID: any;
  newRequestNo(): void {
    this.api.TechnicianstockMovementRequestcust(1, 1, 'ID', 'DESC', '').subscribe(
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
  getNamesCatAndSub(selectkey: any) {
    var SelectedInventory: any = this.Itemdata.filter((val: any) => val.ID === selectkey);
    if (SelectedInventory !== null && SelectedInventory !== undefined && SelectedInventory !== '' && SelectedInventory.length > 0) {
      this.data2.UNIT_ID = SelectedInventory[0].ACTUAL_UNIT_ID;
      this.data2.ID = SelectedInventory[0].ID;
      this.data2.INVENTORY_ID = SelectedInventory[0].ITEM_ID;
      this.data2.UNIT_NAME = SelectedInventory[0].ACTUAL_UNIT_NAME;
      this.data2.IS_VERIENT = SelectedInventory[0].IS_VERIENT,
        this.data2.IS_VARIANT = SelectedInventory[0].IS_VARIANT,
        this.data2.PARENT_ID = SelectedInventory[0].PARENT_ID,
        this.data2.VARIANT_NAME = SelectedInventory[0].VARIANT_NAME,
        this.data2.INVENTORY_NAME = SelectedInventory[0].ITEM_NAME;
      this.data2.QUANTITY = SelectedInventory[0].IN_QTY;
      this.data2.QUANTITY_PER_UNIT = SelectedInventory[0].QUANTITY_PER_UNIT,
        this.data2.INVENTORY_TRACKING_TYPE = SelectedInventory[0].INVENTORY_TRACKING_TYPE;
      this.data2.INVENTORY_CAT_ID = SelectedInventory[0].INVENTORY_CATEGORY_ID,
        this.data2.INVENTORY_DETAILS_ID = SelectedInventory[0].INVENTORY_DETAILS_ID,
        this.data2.INVENTORY_CAT_NAME = SelectedInventory[0].INVENTORY_CATEGORY_NAME,
        this.data2.INVENTROY_SUB_CAT_ID = SelectedInventory[0].INVENTRY_SUB_CATEGORY_ID,
        this.data2.INVENTROY_SUB_CAT_NAME = SelectedInventory[0].INVENTRY_SUB_CATEGORY_NAME,
        this.data2.BATCH_NO = SelectedInventory[0].BATCH_NO;
      this.data2.SERIAL_NO = SelectedInventory[0].SERIAL_NO;
      this.data2.JOB_CARD_ID = SelectedInventory[0].JOB_CARD_ID;
    } else {
      this.data2.UNIT_ID = null;
      this.data2.ID = null;
      this.data2.INVENTORY_ID = null;
      this.data2.INVENTORY_TRACKING_TYPE = null;
      this.data2.INVENTORY_NAME = null;
      this.data2.IS_VARIANT = null;
      this.data2.JOB_CARD_ID = null;
      this.data2.BATCH_NO = null;
      this.data2.SERIAL_NO = null;
      this.data2.UNIT_NAME = null;
      this.data2.QUANTITY = null;
      this.data2.IS_VERIENT = 0,
        this.data2.PARENT_ID = null,
        this.data2.VARIANT_NAME = null,
        this.data2.QUANTITY_PER_UNIT = null,
        this.data2.INVENTORY_CAT_ID = null,
        this.data2.INVENTORY_DETAILS_ID = null,
        this.data2.INVENTORY_CAT_NAME = null,
        this.data2.INVENTROY_SUB_CAT_ID = null,
        this.data2.INVENTROY_SUB_CAT_NAME = null
    }
  }
  resetDrawer(form1: NgForm) {
    this.data = new TechnicianRequestMovementCust();
    form1.form.markAsPristine();
    form1.form.markAsUntouched();
  }
  addData(isAdd: boolean, form2: NgForm): void {
    if (!this.data2.INVENTORY_ID || this.data2.INVENTORY_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Part Name', '');
      return;
    }
    if (this.editdata) {
      this.data2.INVENTORY_ID = this.data2.INVENTORY_ID
    }
    let existingIndex = this.items.findIndex(
      (element: any) =>
        Number(element.ID) === Number(this.data2.ID) &&
        Number(element.UNIT_ID) === Number(this.data2.UNIT_ID) &&
        (element.SERIAL_NO === this.data2.SERIAL_NO ||
          (!element.SERIAL_NO && !this.data2.SERIAL_NO)) &&
        (element.BATCH_NO === this.data2.BATCH_NO ||
          (!element.BATCH_NO && !this.data2.BATCH_NO))
    );
    if (existingIndex > -1) {
      this.items = [...this.items]; 
    } else
      if (this.index > -1) {
        this.items[this.index] = Object.assign({}, this.data2);
        this.items = [...this.items];
      } else {
        this.INNERTABLEDATA = {
          INVENTORY_ID: this.data2.INVENTORY_ID,
          QUANTITY: Number(this.data2.QUANTITY),
          UNIT_ID: this.data2.UNIT_ID,
          ID: this.data2.ID,
          INVENTORY_TRACKING_TYPE: this.data2.INVENTORY_TRACKING_TYPE,
          INVENTORY_NAME: this.data2.INVENTORY_NAME,
          UNIT_NAME: this.data2.UNIT_NAME,
          SERIAL_NO: this.data2.SERIAL_NO,
          BATCH_NO: this.data2.BATCH_NO,
          JOB_CARD_ID: this.data2.JOB_CARD_ID,
          IS_VARIANT: this.data2.IS_VARIANT,
          IS_VERIENT: this.data2.IS_VERIENT,
          PARENT_ID: this.data2.PARENT_ID,
          VARIANT_NAME: this.data2.VARIANT_NAME,
          QUANTITY_PER_UNIT: this.data2.QUANTITY_PER_UNIT,
          INVENTORY_CAT_ID: this.data2.INVENTORY_CAT_ID,
          INVENTORY_DETAILS_ID: this.data2.INVENTORY_DETAILS_ID,
          INVENTORY_CAT_NAME: this.data2.INVENTORY_CAT_NAME,
          INVENTROY_SUB_CAT_ID: this.data2.INVENTROY_SUB_CAT_ID,
          INVENTROY_SUB_CAT_NAME: this.data2.INVENTROY_SUB_CAT_NAME,
        };
        this.items.push(this.INNERTABLEDATA);
        this.items = [...this.items]; 
      }
    this.index = -1;
    this.totaldata = this.items.length;
    this.editdata = false;
    form2.form.reset();
  }
  removedItems: any[] = [];
  edit(data2: InnerTableCust, i: number): void {
    this.editdata = true;
    this.index = i;
    this.radioValue = data2['INVENTORY_TRACKING_TYPE'];
    this.INVENTORY_ID = data2.ID
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
  PARENT_ID;
  child;
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
            'Stock transfer request rejected successfully',
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