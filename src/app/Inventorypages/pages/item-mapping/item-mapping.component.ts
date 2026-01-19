import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class DataArray {
  UNIT_ID: any;
  RATIO_RATE: number;
  UNIT_CODE: any;
  UNIT_NAME: string;
  QUANTITY_PER_UNIT: number;
  ALERT_STOCK_LEVEL: number;
  REORDER_STOCK_LEVEL: number;
  AVG_LEVEL: number;
}
export class Data {
  UNIT_ID: any;
  RATIO_RATE: number;
  QUANTITY_PER_UNIT: number;
}
@Component({
  selector: 'app-item-mapping',
  templateUrl: './item-mapping.component.html',
  styleUrls: ['./item-mapping.component.css'],
})
export class ItemMappingComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  isOk: boolean = true;
  public commonFunction = new CommonFunctionService();
  loadingRecords: boolean = false;
  ngOnInit(): void {
    this.loadUnitData();
    this.loadingRecords = true;
    this.api
      .getItemMappingData(0, 0, '', '', ' AND ITEM_ID = ' + this.itemId)
      .subscribe(
        (data) => {
          this.Data = data['data'];
          this.loadingRecords = false;
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any;
  @Input() UnitName: any;
  @Input() itemId: any;
  @Input() itemcategoryis: any;
  @Input() UnitId: any;
  data2: DataArray = new DataArray();
  UnitData: any = [];
  Data: any = [];
  listOfData: any = {
    SUPPLIER_ID: 0,
    data: [this.Data],
  };
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  loadUnitData() {
    this.api
      .getUnitData(
        0,
        0,
        'ID',
        'asc',
        ' AND IS_ACTIVE = 1 AND ID !=' + this.UnitId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.UnitData = data['data'];
          } else {
            this.UnitData = [];
          }
        },
        (err) => { }
      );
  }
  index = -1;
  editdata: boolean = false;
  dupplicate = true;
  tryData;
  addData(addNew: boolean, formData: NgForm) {
    this.loadingRecords = false;
    this.isOk = true;
    if (
      (this.data2.UNIT_ID == undefined || this.data2.UNIT_ID == null) &&
      (this.data2.QUANTITY_PER_UNIT == undefined ||
        this.data2.QUANTITY_PER_UNIT == null)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    }
    else if (this.data2.UNIT_ID == undefined || this.data2.UNIT_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Unit  ', '');
    } else if (
      this.data2.QUANTITY_PER_UNIT == undefined ||
      this.data2.QUANTITY_PER_UNIT == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Quantity Per Unit  ', '');
    } else if (
      this.data2.AVG_LEVEL === null ||
      this.data2.AVG_LEVEL === undefined ||
      this.data2.AVG_LEVEL === 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Average Stock Level', '');
    } else if (
      this.data2.REORDER_STOCK_LEVEL === null ||
      this.data2.REORDER_STOCK_LEVEL === undefined ||
      this.data2.REORDER_STOCK_LEVEL === 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Re-Order Stock Level', '');
    } else if (
      this.data2.ALERT_STOCK_LEVEL === null ||
      this.data2.ALERT_STOCK_LEVEL === undefined ||
      this.data2.ALERT_STOCK_LEVEL === 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Alert Stock Level', '');
    }
    this.dupplicate = true;
    if (this.isOk) {
      if (this.Data?.length > 0) {
        for (let i = 0; i < this.Data.length; i++) {
          if (!this.editdata) {
            if (this.data2.UNIT_ID == this.Data[i].UNIT_ID) {
              this.message.warning('Unit is Already Exists ', '');
              this.dupplicate = false;
            } else {
            }
          }
        }
      }
    }
    if (this.isOk && this.dupplicate) {
      if (!this.Data) {
        this.Data = [];
      }
      const selectedUnit = this.UnitData.find(
        (unit: any) => unit.ID === this.data2.UNIT_ID
      );
      if (selectedUnit) {
        this.data2.UNIT_CODE = selectedUnit.SHORT_CODE;
        this.data2.UNIT_NAME = selectedUnit.NAME;
      } else {
        this.isOk = false;
        return;
      }
      if (this.index > -1) {
        this.Data[this.index] = Object.assign({}, this.data2);
      } else {
        this.Data.push(Object.assign({}, this.data2));
      }
      this.Data = [...[], ...this.Data];
      formData.form.reset();
      this.data2 = new DataArray();
      this.index = -1;
      this.editdata = false;
    }
  }
  getUnitIdFromName(name: string): any {
    const unit = this.UnitData.find((unit: any) => unit.NAME === name);
    return unit ? unit.UNIT_ID : '';
  }
  save() {
    const ITEM_ID = this.itemId;
    const formattedData = this.Data.map((item: any) => ({
      UNIT_ID: item.UNIT_ID,
      RATIO_RATE: item.RATIO_RATE,
      QUANTITY: null,
      QUANTITY_PER_UNIT: item.QUANTITY_PER_UNIT,
      ALERT_STOCK_LEVEL: item.ALERT_STOCK_LEVEL,
      AVG_LEVEL: item.AVG_LEVEL,
      REORDER_STOCK_LEVEL: item.REORDER_STOCK_LEVEL,
    }));
    const dataToSave = {
      ITEM_ID: ITEM_ID,
      CATEGORY_ID: this.itemcategoryis,
      DATA: formattedData,
    };
    if (dataToSave.DATA.length > 0) {
      this.loadingRecords = true;
      this.api.addItemMapping(dataToSave).subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.message.success('Information has been Added successfully', '');
          this.close();
        } else {
          this.loadingRecords = false;
          this.message.error('Information creation Failed', '');
        }
      });
    } else {
      this.loadingRecords = false;
      this.message.error('There is No Data to Save', '');
    }
  }
  edit1(data: DataArray, i: any): void {
    this.index = i;
    this.editdata = true;
    this.data2 = Object.assign({}, data);
  }
  cancel() { }
  deleteCancel() { }
  confirmDeleterelation(data: any, i: number) {
    this.Data = this.Data.filter((item, index) => index != i);
    this.Data = [...[], ...this.Data];
  }
  close() {
    this.drawerClose();
  }
  onQuantityChange() {
    if (
      this.data?.BASE_QUANTITY &&
      this.data.BASE_QUANTITY > 0 &&
      this.data2.QUANTITY_PER_UNIT
    ) {
      let ratio = this.data.BASE_QUANTITY / this.data2.QUANTITY_PER_UNIT;
      this.data2.RATIO_RATE = parseFloat(ratio.toFixed(2));
    } else {
      this.data2.RATIO_RATE = 0;
    }
  }
}