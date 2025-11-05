import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InnerStockMovementRequest, StockMovementRequest } from 'src/app/Inventorypages/inventorymodal/stockMovementRequestData';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-check-item',
  templateUrl: './check-item.component.html',
  styleUrls: ['./check-item.component.css']
})

export class CheckItemComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input()
  drawerClose!: Function;
  @Input()
  editdata: boolean = false;
  @Input()
  update: boolean = false;
  @Input()
  data: any = new StockMovementRequest();
  data2 = new InnerStockMovementRequest();
  isSpinning: boolean = false;
  screenwidth: any;
  Itemdata: any[] = [];
  @Input() items: any[] = [];
  date: string | number | Date;
  INNERTABLEDATA1: any[] = [];
  index = -1;
  totaldata = 1;
  pageSize = 1;
  pageIndex = 1;
  REJECT_REMARK: string;
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadItems();
    this.getItemsData();
    this.getUnitsData();
  }

  save(status: any, form1: NgForm, saveAllItems: any): void {
    let isOK = true;

    if (this.data.VEHICLE_NO.trim() != "") {
      if (!this.commonFunction.vehicleNumberPattern.test(this.data.VEHICLE_NO.toString())) {
        isOK = false;
        this.message.info(
          'Please Enter Valid Vehicle Number', ''
        );
      }
    }

    if (isOK) {
      this.isSpinning = true;

      if (saveAllItems.length > 0) {
        saveAllItems.forEach((element: any) => {
          const innerTableData: any = {
            ID: this.data.ID,
            ITEM_ID: element['ITEM_ID'],
            ITEM_NAME: element['ITEM_NAME'],
            REQUESTED_QTY: (element['ID'] == 0) ? 0 : element['REQUESTED_QTY'],
            REQUESTED_QTY_UNIT_ID: (element['ID'] == 0) ? 0 : element['REQUESTED_QTY_UNIT_ID'],
            CONFIRMED_QTY: element['CONFIRMED_QTY'],
            CONFIRMED_UNIT_ID: element['CONFIRMED_UNIT_ID'],
            UNIT_NAME: element['UNIT_NAME'],
            ITEM_CATEGORY_ID: element['ITEM_CATEGORY_ID'],
            REMARK: " ",
          };

          this.INNERTABLEDATA1.push(innerTableData);
          this.items = [...this.INNERTABLEDATA1];
        });
      }
      var currentDatess = new Date();
      var currentTimeFormatted = this.datePipe.transform(currentDatess, 'HH:mm:ss');
      var ddd =
        this.datePipe.transform(
          localStorage.getItem('DayInDateforreports'),
          'yyyy-MM-dd'
        ) +
        ' ' +
        currentTimeFormatted;
      this.api.addStockMoveDetails(this.data.ID, this.items, status, this.data.VEHICLE_NO.trim(), this.items.length, ddd, ddd, this.data.REQUESTED_BY, Number(localStorage.getItem('userId'))).subscribe((successCode) => {
        if (successCode.code == 200) {
          this.isSpinning = false;
          this.message.success(
            'Stock Movement Request Dispatched Successully', ''
          );

          this.drawerClose();

        } else {
          this.isSpinning = false;
          this.message.error(
            'Failed to Dispatch Stock Movement Request',
            ''
          );
        }
      }, err => {
        this.isSpinning = false;
      });
    }
  }

  save1(addNew: any, form1: NgForm, saveAllItems: any): void {
    let isOK = true;

    if ((this.REJECT_REMARK != undefined) && (this.REJECT_REMARK != null)) {
      if (this.REJECT_REMARK.trim() == "") {
        isOK = false;
        this.message.info("Please Enter Valid Reject Remark", "");
      }

    } else {
      isOK = false;
      this.message.info("Please Enter Reject Remark", "");
    }

    if (isOK) {
      this.isSpinning = true;
      this.data.STATUS = addNew;
      this.data.REJECT_REMARK = this.REJECT_REMARK;
      this.data.AUTHORISED_BY = localStorage.getItem('userId');
      var currentDatess = new Date();
      var currentTimeFormatted = this.datePipe.transform(currentDatess, 'HH:mm:ss');
      this.data.AUTHORISED_DATETIME =
        this.datePipe.transform(
          localStorage.getItem('DayInDateforreports'),
          'yyyy-MM-dd'
        ) +
        ' ' +
        currentTimeFormatted;
      this.api.UpdateStockReqest11(this.data).subscribe((successCode) => {
        if (successCode.code == 200) {
          this.isSpinning = false;
          this.message.success(
            'Stock Movement Request Rejected successfully', ''
          );

          this.drawerClose();

        } else {
          this.isSpinning = false;
          this.message.error(
            'Failed to Reject Stock Movement Request', ''
          );
        }
      }, err => {
        this.isSpinning = false;
      });
    }
  }

  close(): void {
    this.drawerClose();
  }

  ITEMLIST: any[] = [];

  getItemsData(): void {
    this.api.getInventory(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.ITEMLIST = data['data'];
      }
    });
  }

  tempSelectedItemData: any;

  onItemSelection(key: number): void {
    if (key) {
      this.itemWiseUnit(key);
      this.tempSelectedItemData = this.ITEMLIST.filter((val: any) => val.ID == key);

      if (this.index == -1) {
        this.newItem.REQUESTED_QTY = 1;
      }

      this.newItem.REQUESTED_QTY_UNIT_ID = this.tempSelectedItemData[0].UNIT_ID;
      this.onUnitSelection(Number(this.newItem.REQUESTED_QTY_UNIT_ID));
    }
  }

  itemWiseUnitList: any;

  itemWiseUnit(itemID: number): void {
    this.itemWiseUnitList = [];

    this.api.getItemMappingData(0, 0, '', '', ' AND ITEM_ID=' + itemID).subscribe((data) => {
      if (data['code'] == 200) {
        this.itemWiseUnitList = data['data'];

      } else {
        this.message.error('Something Went Wrong', '');
      }

    }, (err) => {
      this.message.error('Server Not Found', '');
    });
  }

  tempSelectedUnitData: any;

  onUnitSelection(key: number): void {
    this.tempSelectedUnitData = this.UNITLIST.filter((val: any) => val.ID == key);
  }

  UNITLIST: any[] = [];

  getUnitsData(): void {
    this.api.getUnitData(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.UNITLIST = data['data'];
      }

    }, (err) => {
      this.message.error('Server Not Found', '');
    });
  }

  loadItems(): void {
    this.Itemdata = [];

    this.api.getInventoryHirarchyInward().subscribe((data) => {
      if (data['status'] == 200) {
        this.Itemdata = data['body']['data'][0]['hierarchy'];

      } else {
        this.Itemdata = [];
      }

    }, (err) => {
      this.message.error('Server Not Found', '');
    });
  }

  dupplicate = true;
  INNERTABLEDATA: any = new InnerStockMovementRequest();

  addData(addNewItem: NgForm): void {
    let isOK = true;

    if (this.newItem.ITEM_ID == undefined || this.newItem.ITEM_ID == null) {
      this.message.info('Please Select Item', '');
      isOK = false;
    }

    if ((this.newItem.REQUESTED_QTY != undefined) && (this.newItem.REQUESTED_QTY != null)) {
      if (this.newItem.REQUESTED_QTY.toString().trim() == "") {
        this.message.info('Please Enter Valid Quantity', '');
        isOK = false;
      }

    } else {
      this.message.info('Please Enter Quantity', '');
      isOK = false;
    }

    if (this.newItem.REQUESTED_QTY_UNIT_ID == undefined || this.newItem.REQUESTED_QTY_UNIT_ID == null) {
      this.message.info('Please Select Unit', '');
      isOK = false;
    }

    this.dupplicate = true;

    if (isOK) {
      if (this.items.length > 0) {
        for (let i = 0; i < this.items.length; i++) {
          if (!this.editdata) {
            if (this.newItem.ITEM_ID == this.items[i].ITEM_ID) {
              this.message.warning('Item Name Already Exists', '');
              this.dupplicate = false;

            } else {

            }
          }
        }
      }
    }

    if (this.dupplicate && isOK) {
      this.INNERTABLEDATA = {
        ID: this.newItem.ID,
        ITEM_ID: this.newItem.ITEM_ID,
        CONFIRMED_QTY: this.newItem.REQUESTED_QTY,
        CONFIRMED_UNIT_ID: this.newItem.REQUESTED_QTY_UNIT_ID,
        REQUESTED_QTY: this.newItem.REQUESTED_QTY,
        REQUESTED_QTY_UNIT_ID: this.newItem.REQUESTED_QTY_UNIT_ID,
        ITEM_NAME: this.tempSelectedItemData[0]["NAME"],
        UNIT_NAME: this.tempSelectedUnitData[0]["CODE"],
        ITEM_CATEGORY_ID: this.tempSelectedItemData[0]['CATEGORY_ID']
      };

      if (this.index > -1) {
        this.items[this.index] = this.INNERTABLEDATA;

      } else {
        this.items.push(this.INNERTABLEDATA);
      }

      this.items = [...[], ...this.items];
      this.index = -1;
      this.totaldata = this.items.length;
      this.editdata = false;
      addNewItem.form.reset();
    }
  }

  getItemName(itemID: number): string {
    let itemData = this.ITEMLIST.filter((val: any) => val.ID == itemID);
    return itemData[0]["NAME"];
  }

  getItemUnitName(unitID: number): string {
    let unitData = this.UNITLIST.filter((val: any) => val.ID == unitID);
    return unitData[0]["NAME"];
  }

  newItem: newItem = { ID: undefined, ITEM_ID: undefined, ITEM_NAME: undefined, REQUESTED_QTY: undefined, REQUESTED_QTY_UNIT_ID: undefined, UNIT_NAME: undefined };

  cancel(): void { }

  edit(data2: newItem, i: number): void {
    this.editdata = true;
    this.index = i;
    this.newItem = Object.assign({}, data2);
    this.onItemSelection(Number(this.newItem.ITEM_ID));
    this.onUnitSelection(Number(this.newItem.REQUESTED_QTY_UNIT_ID));
  }

  delete(data: any, i: number): void {
    this.items = this.items.filter((i) => i.ITEM_ID != data.ITEM_ID);
  }
}

interface newItem {
  ID: number | undefined;
  ITEM_ID: number | undefined;
  ITEM_NAME: string | undefined;
  REQUESTED_QTY: number | undefined;
  REQUESTED_QTY_UNIT_ID: number | undefined;
  UNIT_NAME: string | undefined;
}
