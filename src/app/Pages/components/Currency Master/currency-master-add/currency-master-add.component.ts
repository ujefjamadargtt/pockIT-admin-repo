import { Component, Input } from '@angular/core';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { CurrencyMaster } from 'src/app/Pages/Models/CurrencyMaster';
@Component({
  selector: 'app-currency-master-add',
  templateUrl: './currency-master-add.component.html',
  styleUrls: ['./currency-master-add.component.css'],
})
export class CurrencyMasterAddComponent {
  @Input() data: any = CurrencyMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isFocused = '';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  resetDrawer(currencymaster: NgForm) {
    this.data = new CurrencyMaster();
    currencymaster.form.markAsPristine();
    currencymaster.form.markAsUntouched();
  }
  DECIMAL_SEPARATOR = [
    { Id: '.', Name: 'Period (.)' },
    { Id: ',', Name: 'Comma (,)' },
    { Id: '_', Name: 'Underscore (_)' },
  ];
  THOUSAND_SEPERATOR = [
    { Id: '.', Name: 'Period (.)' },
    { Id: ',', Name: 'Comma (,)' },
  ];
  SYMBOL = [
    { Id: '$', Name: '$' },
    { Id: '€', Name: '€' },
    { Id: '£', Name: '£' },
    { Id: '¥', Name: '¥' },
    { Id: '₹', Name: '₹' },
    { Id: '₽', Name: '₽' },
    { Id: 'R$', Name: 'R$' },
    { Id: 'R', Name: 'R' },
    { Id: 'HK$', Name: 'HK$' },
    { Id: 'CHF', Name: 'CHF' },
  ];
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  ngOnInit() {
    this.getCountryData();
  }
  countryData: any = [];
  getCountryData() {
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE =1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countryData = data['data'];
          } else {
            this.countryData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  save(addNew: boolean, currencymaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.CURRENCY_NAME.trim() == '' ||
        this.data.CURRENCY_NAME == null ||
        this.data.CURRENCY_NAME == undefined) &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == 0) &&
      (this.data.COUNTRY_ID == undefined ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == 0) &&
      (this.data.DECIMAL_SEPARATOR == undefined ||
        this.data.DECIMAL_SEPARATOR == null ||
        this.data.DECIMAL_SEPARATOR == 0) &&
      (this.data.THOUSAND_SEPERATOR == undefined ||
        this.data.THOUSAND_SEPERATOR == null ||
        this.data.THOUSAND_SEPERATOR == 0) &&
      (this.data.EXCHANGE_RATE == '' ||
        this.data.EXCHANGE_RATE == null ||
        this.data.EXCHANGE_RATE == undefined) &&
      (this.data.SYMBOL == 0 ||
        this.data.SYMBOL == null ||
        this.data.SYMBOL == undefined) &&
      (this.data.DECIMAL_SPACE == 0 ||
        this.data.DECIMAL_SPACE == null ||
        this.data.DECIMAL_SPACE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.CURRENCY_NAME == null ||
      this.data.CURRENCY_NAME == undefined ||
      this.data.CURRENCY_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Currency Name.', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Country.', '');
    }
    else if (
      this.data.EXCHANGE_RATE == null ||
      this.data.EXCHANGE_RATE == undefined ||
      this.data.EXCHANGE_RATE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Exchange Rate.', '');
    }
    else if (
      this.data.SYMBOL == null ||
      this.data.SYMBOL == undefined ||
      this.data.SYMBOL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Symbol.', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    } else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateCurrency(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Currency Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else if (successCode.code == '300') {
              this.message.info('A currency with the same short code already exists.', '');
              this.isSpinning = false;
            } else {
              this.message.error('Currency Updation Failed', '');
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
          this.api.createCurrency(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Currency Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new CurrencyMaster();
                this.resetDrawer(currencymaster);
                this.isSpinning = false;
                this.api.getCurrency(1, 1, 'SEQ_NO', 'desc', '').subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                      }
                    } else {
                      this.message.error('Server Not Found', '');
                    }
                  },
                  () => { }
                );
              }
              this.isSpinning = false;
            } else if (successCode.code == '300') {
              this.message.info('A currency with the same short code already exists.', '');
              this.isSpinning = false;
            } else {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            };
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
  close() {
    this.drawerClose();
  }
}
