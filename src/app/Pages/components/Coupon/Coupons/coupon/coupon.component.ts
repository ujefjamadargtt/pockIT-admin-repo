import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Coupan } from 'src/app/Support/Models/coupan';
import { Coupontype } from 'src/app/Support/Models/coupontype';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css'],
  providers: [DatePipe],
})
export class CouponComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Coupan;
  isSpinning = false;
  logtext: string = '';
  dataList: any = [];
  couponTypes: Coupontype[];
  loadingCouponTypes = false;
  countryList: Coupontype[];
  loadingcountry = false;
  isEdit = false;
  constructor(
    public api: ApiServiceService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    if (!this.data.ID) {
      this.data.START_DATE = new Date();
    }
    if (this.data.ID) {
      this.isEdit = true;
    }
    this.loadCoupons();
    this.loadCouponTypes();
    this.loadCountry();
  }
  isFocused = '';
  limitTextLength() {
    if (this.data.DESCRIPTION && this.data.DESCRIPTION.length > 2048) {
      this.data.DESCRIPTION = this.data.DESCRIPTION.substring(0, 2048);
    }
  }
  onMinValueChange() {
    if (this.data.COUPON_VALUE) {
      this.updateMaxValue(this.data.COUPON_VALUE);
    }
  }
  @ViewChild('coupntypea') Ref: ElementRef;
  @ViewChild('couponmaxvalue') Ref2: ElementRef;
  updateMaxValue(value) {
    if (value && this.data.COUPON_VALUE_TYPE != 'P') {
      if (
        parseInt(value, 10) > parseInt(this.data.MIN_CART_AMOUNT.toString(), 10)
      ) {
        this.message.info(
          'Coupon value should be less than min cart amount',
          ''
        );
        this.Ref.nativeElement.value = null;
        this.data.COUPON_VALUE = null;
        this.data.COUPON_MAX_VALUE = null;
        return;
      }
      if (this.data.COUPON_VALUE_TYPE === 'A') {
        this.data.COUPON_MAX_VALUE = this.data.COUPON_VALUE;
      }
    }
  }
  onCouponMaxValueChange(maxValue) {
    if (maxValue && this.data.COUPON_VALUE_TYPE == 'P') {
      if (
        parseInt(maxValue, 10) >
        parseInt(this.data.MIN_CART_AMOUNT.toString(), 10)
      ) {
        this.message.info(
          'Coupon max value should be less than min cart amount',
          ''
        );
        this.Ref2.nativeElement.value = null;
        this.data.COUPON_MAX_VALUE = null;
      }
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
  disabledStartDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return current && current < today;
  };
  disabledEndDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (this.data.START_DATE) {
      const startDate = new Date(this.data.START_DATE);
      startDate.setHours(0, 0, 0, 0);
      return current && (current < today || current < startDate);
    }
    return current && current < today;
  };
  disabledDateTime: any = (current: Date | null) => {
    const now = new Date();
    if (current && current instanceof Date) {
      if (
        current.getFullYear() === now.getFullYear() &&
        current.getMonth() === now.getMonth() &&
        current.getDate() === now.getDate()
      ) {
        return {
          nzDisabledHours: () =>
            Array.from({ length: now.getHours() }, (_, i) => i), 
          nzDisabledMinutes: (hour: number) =>
            hour === now.getHours()
              ? Array.from({ length: now.getMinutes() }, (_, i) => i)
              : [], 
          nzDisabledSeconds: (hour: number, minute: number) =>
            hour === now.getHours() && minute === now.getMinutes()
              ? Array.from({ length: now.getSeconds() }, (_, i) => i)
              : [], 
        };
      }
    }
    return {
      nzDisabledHours: () => [],
      nzDisabledMinutes: () => [],
      nzDisabledSeconds: () => [],
    };
  };
  disabledDateTime2: any = (current: Date | null) => {
    if (!this.data.START_DATE) return {}; 
    const startDate = new Date(this.data.START_DATE); 
    if (current && current instanceof Date) {
      if (
        current.getFullYear() === startDate.getFullYear() &&
        current.getMonth() === startDate.getMonth() &&
        current.getDate() === startDate.getDate()
      ) {
        return {
          nzDisabledHours: () =>
            Array.from({ length: startDate.getHours() }, (_, i) => i), 
          nzDisabledMinutes: (hour: number) =>
            hour === startDate.getHours()
              ? Array.from({ length: startDate.getMinutes() + 1 }, (_, i) => i)
              : [], 
          nzDisabledSeconds: (hour: number, minute: number) =>
            hour === startDate.getHours() && minute === startDate.getMinutes()
              ? Array.from({ length: startDate.getSeconds() + 1 }, (_, i) => i)
              : [], 
        };
      }
    }
    return {
      nzDisabledHours: () => [],
      nzDisabledMinutes: () => [],
      nzDisabledSeconds: () => [],
    };
  };
  onStartDateChange(): void {
    if (this.data.START_DATE < this.data.EXPIRY_DATE) {
      this.data.EXPIRY_DATE = null;
    }
  }
  onlynum(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value + event.key;
    if (!/^\d*$/.test(event.key)) {
      event.preventDefault(); 
    } else if (parseInt(newValue, 10) > 100) {
      event.preventDefault(); 
    }
  }
  public commonFunction = new CommonFunctionService();
  loadCouponTypes() {
    this.api
      .getAllCoupontypes(0, 0, 'ID', 'desc', ' AND IS_ACTIVE=1')
      .subscribe(
        (data) => {
          this.couponTypes = data['data'];
        },
        (err) => { }
      );
  }
  loadCountry() {
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          this.countryList = data['data'];
        },
        (err) => { }
      );
  }
  loadCoupons() {
    this.api.getAllCoupons(0, 0, 'ID', 'desc', '').subscribe(
      (data) => {
        this.dataList = data['data'];
      },
      (err) => { }
    );
  }
  tempcouponvalue;
  onCouponTypeChange() {
    if (this.data.COUPON_VALUE_TYPE === 'A') {
      this.data.COUPON_VALUE = this.tempcouponvalue;
      this.tempcouponvalue = this.data.COUPON_VALUE;
      this.data.COUPON_MAX_VALUE = this.data.COUPON_VALUE;
    } else if (this.data.COUPON_VALUE_TYPE === 'P' && !this.data.ID) {
      this.tempcouponvalue = this.data.COUPON_VALUE;
      this.data.COUPON_VALUE = null;
      this.data.COUPON_MAX_VALUE = null;
    }
  }
  
  resetDrawer(couponMasterPage: NgForm) {
    this.data = new Coupan();
    couponMasterPage.form.markAsPristine();
    couponMasterPage.form.markAsUntouched();
  }
  close(couponMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(couponMasterPage);
    couponMasterPage.form.reset();
  }
  save(addNew: boolean, couponMasterPage: NgForm): void {
    this.data.MAX_CART_AMOUNT = 0;
    if (
      this.data.NAME != '' &&
      this.data.NAME != undefined &&
      this.data.START_DATE != undefined &&
      this.data.EXPIRY_DATE != undefined &&
      this.data.MAX_USES_COUNT != undefined &&
      this.data.MAX_USES_COUNT.toString() != '' &&
      this.data.COUPON_CODE != undefined &&
      this.data.COUPON_CODE != '' &&
      this.data.COUPON_VALUE != undefined &&
      this.data.COUPON_VALUE.toString() != '' &&
      this.data.PERUSER_MAX_COUNT != undefined &&
      this.data.PERUSER_MAX_COUNT.toString() != '' &&
      this.data.COUPON_MAX_VALUE != undefined &&
      this.data.COUPON_MAX_VALUE.toString() != '' &&
      this.data.MIN_CART_AMOUNT != undefined &&
      this.data.MIN_CART_AMOUNT.toString() != ''
    ) {
      this.data.START_DATE = this.datePipe.transform(
        this.data.START_DATE,
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data.EXPIRY_DATE = this.datePipe.transform(
        this.data.EXPIRY_DATE,
        'yyyy-MM-dd HH:mm:ss'
      );
      this.isSpinning = true;
      if (this.data.ID) {
        var filterData1: any = [];
        var returnData1: any = [];
        if (this.dataList.length > 0) {
          var filterData1 = this.dataList.filter((object) => {
            return (
              object['NAME'] == this.data.NAME && object['ID'] != this.data.ID
            );
          });
        }
        if (this.dataList.length > 0) {
          var returnData1 = this.dataList.filter((object) => {
            return (
              object['COUPON_CODE'] == this.data.COUPON_CODE &&
              object['ID'] != this.data.ID
            );
          });
        }
        if (filterData1.length > 0) {
          this.message.error('Name Is Already  Present in Database', '');
          this.isSpinning = false;
          this.data.NAME = '';
        } else if (returnData1.length > 0) {
          this.message.error('Coupon Code Is Already  Present in Database', '');
          this.isSpinning = false;
          this.data.COUPON_CODE = '';
        } else if (filterData1.length > 0) {
          this.message.error('Same Record Found in Database', '');
          this.isSpinning = false;
        } else {
          this.api.updateCoupon(this.data).subscribe(
            (successCode) => {
              if (successCode['code'] == '200') {
                this.message.success(
                  'Coupon information updated Successfully...',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Failed to update coupon information...',
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
        }
      } else {
        var filterData: any = [];
        var returnData: any = [];
        if (this.dataList.length > 0) {
          filterData = this.dataList.filter((object) => {
            return object['NAME'] == this.data.NAME;
          });
        }
        if (this.dataList.length > 0) {
          returnData = this.dataList.filter((object) => {
            return (
              object['COUPON_CODE'] == this.data.COUPON_CODE &&
              object['ID'] != this.data.ID
            );
          });
        }
        if (filterData.length > 0) {
          this.message.error('Name Is Already  Present in Database', '');
          this.isSpinning = false;
          this.data.NAME = '';
        } else if (returnData.length > 0) {
          this.message.error('Coupon Code Is Already  Present in Database', '');
          this.isSpinning = false;
          this.data.COUPON_CODE = '';
        } else if (filterData.length > 0) {
          this.message.error('Same Record Found in Database', '');
          this.isSpinning = false;
        } else {
          this.api.createCoupon(this.data).subscribe(
            (successCode) => {
              if (successCode['code'] == '200') {
                this.message.success(
                  'Coupon information added successfully...',
                  ''
                );
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new Coupan();
                  this.resetDrawer(couponMasterPage);
                }
                this.isSpinning = false;
              } else {
                this.message.error('Failed to add coupon information...', '');
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
    } else {
      if (
        this.data.COUNTRY_ID === 0 ||
        this.data.COUNTRY_ID === '' ||
        this.data.COUNTRY_ID === undefined ||
        this.data.COUNTRY_ID === null
      ) {
        this.message.error('Please select country', '');
      } else if (
        this.data.COUPON_TYPE_ID === 0 ||
        this.data.COUPON_TYPE_ID === undefined ||
        this.data.COUPON_TYPE_ID === null
      ) {
        this.message.error('Please Select Coupon Type', '');
      } else if (
        this.data.NAME === '' ||
        this.data.NAME === undefined ||
        this.data.NAME === null
      ) {
        this.message.error('Please enter name', '');
      } else if (
        this.data.COUPON_FOR === undefined ||
        this.data.COUPON_FOR === 0 ||
        this.data.COUPON_FOR === null
      ) {
        this.message.error('Please Select Coupon For', '');
      } else if (
        this.data.COUPON_CODE === undefined ||
        this.data.COUPON_CODE === '' ||
        this.data.COUPON_CODE === null
      ) {
        this.message.error('Please Enter Coupon Code', '');
      } else if (
        this.data.START_DATE === undefined ||
        this.data.START_DATE === null ||
        this.data.START_DATE === ''
      ) {
        this.message.error('Please Select Start Date', '');
      } else if (
        this.data.EXPIRY_DATE === undefined ||
        this.data.EXPIRY_DATE === null ||
        this.data.EXPIRY_DATE === ''
      ) {
        this.message.error('Please Select Expiry Date', '');
      } else if (
        this.data.MAX_USES_COUNT === undefined ||
        this.data.MAX_USES_COUNT === null ||
        this.data.MAX_USES_COUNT.toString() === ''
      ) {
        this.message.error('Please Enter Max Usage Count', '');
      } else if (
        this.data.PERUSER_MAX_COUNT === undefined ||
        this.data.PERUSER_MAX_COUNT.toString() === ''
      ) {
        this.message.error('Please Enter Per User Max Count', '');
      } else if (
        this.data.MIN_CART_AMOUNT === undefined ||
        this.data.MIN_CART_AMOUNT === null ||
        this.data.MIN_CART_AMOUNT.toString() === ''
      ) {
        this.message.error('Please Enter Min Cart Amount', '');
      } else if (
        this.data.COUPON_VALUE === undefined ||
        this.data.COUPON_VALUE.toString() === '' ||
        this.data.COUPON_VALUE === null
      ) {
        this.message.error('Please Enter Coupon Value', '');
      } else if (
        this.data.COUPON_VALUE_TYPE === 'P' &&
        (this.data.COUPON_MAX_VALUE === undefined ||
          this.data.COUPON_MAX_VALUE === null ||
          this.data.COUPON_MAX_VALUE.toString() === '')
      ) {
        this.message.error('Please Enter Coupan Max Value', '');
      } else if (this.data.COUPON_VALUE_TYPE === 'A') {
        this.data.COUPON_MAX_VALUE = 0;
      }
    }
  }
  similarData() {
    var filterData = this.dataList.filter((object) => {
      return object['NAME'].toLowerCase() == this.data.NAME.toLowerCase();
    });
    if (filterData.length > 0) {
      this.isSpinning = false;
      if (filterData.length > 0)
        this.message.error('Name Is Already Present in Database', '');
      return false;
    } else {
      return true;
    }
  }
  similarData1() {
    var filterData = this.dataList.filter((object) => {
      return (
        object['COUPON_CODE'] == this.data.COUPON_CODE &&
        object['ID'] != this.data.ID
      );
    });
    if (filterData.length > 0) {
      this.isSpinning = false;
      if (filterData.length > 0)
        this.message.error('Coupon Code Is Already Present in Database', '');
      return false;
    } else {
      return true;
    }
  }
  
allowDecimal(event: KeyboardEvent): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  const inputValue = (event.target as HTMLInputElement).value;
  
  if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
      
      (charCode === 65 && event.ctrlKey === true) || 
      (charCode === 67 && event.ctrlKey === true) || 
      (charCode === 86 && event.ctrlKey === true) || 
      (charCode === 88 && event.ctrlKey === true) || 
      
      (charCode >= 35 && charCode <= 39)) {
    return true;
  }
  
  if (charCode >= 48 && charCode <= 57) {
    return true;
  }
  
  if (charCode === 46 || charCode === 110 || charCode === 190) { 
    if (inputValue.indexOf('.') !== -1) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  
  event.preventDefault();
  return false;
}

onPaste(event: ClipboardEvent): void {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData('text') || '';
  
  const regex = /^\d*\.?\d*$/;
  if (regex.test(pastedText) && pastedText !== '') {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = currentValue.substring(0, start) + pastedText + currentValue.substring(end);
    
    if ((newValue.match(/\./g) || []).length <= 1) {
      input.value = newValue;
      this.data.COUPON_MAX_VALUE = newValue;
      this.onCouponMaxValueChange(this.data.COUPON_MAX_VALUE);
    }
  }
}
}
