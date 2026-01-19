import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { warehouselocation } from 'src/app/Pages/Models/warehouselocations';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-warehouselocationform',
  templateUrl: './warehouselocationform.component.html',
  styleUrls: ['./warehouselocationform.component.css'],
})
export class WarehouselocationformComponent {
  @Input() drawerClose: Function;
  @Input() data: warehouselocation;
  @Input() drawerVisible: boolean;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
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
  inventoryList: any = [];
  Warehouselist: any = [];
  UnitList: any = [];
  warehouseList: any = [];
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) { }
  getWarehouse() {
    this.data.LOCATION_NAME = '';
    this.data.SHORT_CODE = '';
  }
  ngOnInit() {
    this.getWarehouses();
  }
  getWarehouses() {
    this.api
      .getWarehouses(0, 0, 'id', 'desc', " AND STATUS='A'")
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.Warehouselist = data['data'];
        } else {
          this.Warehouselist = [];
        }
      });
  }
  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
    this.add();
  }
  add(): void {
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
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.WAREHOUSE_ID === undefined ||
        this.data.WAREHOUSE_ID === null ||
        this.data.WAREHOUSE_ID === '') &&
      (this.data.LOCATION_NAME === undefined ||
        this.data.LOCATION_NAME === null ||
        this.data.LOCATION_NAME.trim() === '') &&
      (this.data.SHORT_CODE === undefined ||
        this.data.SHORT_CODE === null ||
        this.data.SHORT_CODE.trim() === '') &&
      (this.data.LOCATION_DESCRIPTION === undefined ||
        this.data.LOCATION_DESCRIPTION.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please fill all required fields', '');
    } else if (
      this.data.WAREHOUSE_ID === undefined ||
      this.data.WAREHOUSE_ID === null ||
      this.data.WAREHOUSE_ID === ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Valid Warehouse', '');
    } else if (
      this.data.LOCATION_NAME === undefined ||
      this.data.LOCATION_NAME === null ||
      this.data.LOCATION_NAME.trim() === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Location Name', '');
    } else if (
      this.data.SHORT_CODE === undefined ||
      this.data.SHORT_CODE === null ||
      this.data.SHORT_CODE.trim() === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    }
    else if (this.data.SHORT_CODE.length > 10) {
      this.isOk = false;
      this.message.error(
        'Short Code exceeds maximum length of 10 characters',
        ''
      );
    } else {
      this.isOk = true;
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.LOCATION_DESCRIPTION == '') {
        this.data.LOCATION_DESCRIPTION = null;
      }
      if (this.data.ID) {
        this.api
          .updateWarehousesLocation(this.data)
          .subscribe((successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Warehouse Location Updated Successfully',
                ''
              );
              this.isSpinning = false;
              if (!addNew) this.close(accountMasterPage);
            } else {
              this.message.error('Warehouse Location Updation Failed', '');
              this.isSpinning = false;
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
      } else {
        this.api
          .createWarehousesLocation(this.data)
          .subscribe((successCode) => {
            if (successCode['code'] === 200) {
              this.message.success('Warehouse Location Saved Successfully', '');
              this.isSpinning = false;
              if (!addNew) {
                this.close(accountMasterPage);
              } else {
                this.data = new warehouselocation();
                this.resetDrawer(accountMasterPage);
              }
            } else {
              this.message.error('Failed to Save Warehouse Location', '');
              this.isSpinning = false;
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
      }
    }
  }
}
