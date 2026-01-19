import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { paymentgateway } from 'src/app/Pages/Models/paymentgateway';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-payment-gateway-master-drawer',
  templateUrl: './payment-gateway-master-drawer.component.html',
  styleUrls: ['./payment-gateway-master-drawer.component.css']
})
export class PaymentGatewayMasterDrawerComponent {
  @Input() data: any = paymentgateway;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  ModeData = [
    { value: 'Test', label: 'Test' },
    { value: 'Live', label: 'Live' }
  ];
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
  ) { }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new paymentgateway();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  ngOnInit() {
    this.initializeSupportedCurrencies();
    this.getcurrencyData();
  }
  initializeSupportedCurrencies(): void {
    if (typeof this.data.SUPPORTED_CURRENCIES === 'string') {
      this.data.SUPPORTED_CURRENCIES = this.data.SUPPORTED_CURRENCIES.split(',').map(item => item.trim());
    }
    if (!Array.isArray(this.data.SUPPORTED_CURRENCIES)) {
      this.data.SUPPORTED_CURRENCIES = [];
    }
  }
  CurrencyData: any[] = [];
  getcurrencyData() {
    this.api.getCurrency(0, 0, "", "", " AND IS_ACTIVE=1").subscribe(
      (data) => {
        if (data["code"] === 200 && Array.isArray(data["data"])) {
          this.CurrencyData = data["data"];
        } else {
          this.CurrencyData = [];
          this.message.error("Failed to get country data", "");
        }
      }
      ,
      (error) => {
        this.message.error("Something Went Wrong ...", "");
      }
    );
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z0-9\s\_]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  numberOnly(event: KeyboardEvent): void {
    const onlynumber = /^[0-9]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!onlynumber.test(char)) {
      event.preventDefault(); 
    }
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.GATEWAY_NAME == '' ||
        this.data.GATEWAY_NAME == null ||
        this.data.GATEWAY_NAME == undefined) &&
      (this.data.GATEWAY_TYPE == undefined ||
        this.data.GATEWAY_TYPE == null ||
        this.data.GATEWAY_TYPE == '') &&
      (this.data.API_SECRET == undefined ||
        this.data.API_SECRET == null ||
        this.data.API_SECRET == '') &&
      (this.data.MERCHANT_ID == undefined ||
        this.data.MERCHANT_ID == null ||
        this.data.MERCHANT_ID == '') &&
      (this.data.API_KEY == undefined ||
        this.data.API_KEY == null ||
        this.data.API_KEY == '') &&
      (this.data.ENDPOINT_URL == undefined ||
        this.data.ENDPOINT_URL == null ||
        this.data.ENDPOINT_URL == '') &&
      (this.data.WEBHOOK_URL == undefined ||
        this.data.WEBHOOK_URL == null ||
        this.data.WEBHOOK_URL == '') &&
      (this.data.SUPPORTED_CURRENCIES == undefined ||
        this.data.SUPPORTED_CURRENCIES == null ||
        this.data.SUPPORTED_CURRENCIES == '') &&
      (this.data.ENCRYPTION_KEY == undefined ||
        this.data.ENCRYPTION_KEY == null ||
        this.data.ENCRYPTION_KEY == '') &&
      (this.data.MIN_AMOUNT == undefined ||
        this.data.MIN_AMOUNT == null ||
        this.data.MIN_AMOUNT == 0) &&
      (this.data.MAX_AMOUNT == undefined ||
        this.data.MAX_AMOUNT == null ||
        this.data.MAX_AMOUNT == 0)
    ) {
      this.isOk = false
      this.message.error('Please Fill All The Required Fields ', '');
    }
    else if (
      this.data.GATEWAY_NAME == null ||
      this.data.GATEWAY_NAME == undefined ||
      this.data.GATEWAY_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Gateway Name.', '');
    }
    else if (
      this.data.GATEWAY_TYPE == null ||
      this.data.GATEWAY_TYPE == undefined ||
      this.data.GATEWAY_TYPE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Gateway Type.', '');
    }
    else if (
      this.data.API_SECRET == null ||
      this.data.API_SECRET == undefined ||
      this.data.API_SECRET.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Api Secrete.', '');
    }
    else if (
      this.data.MERCHANT_ID == null ||
      this.data.MERCHANT_ID == undefined ||
      this.data.MERCHANT_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Merchant Id', '');
    }
    else if (
      this.data.API_KEY == null ||
      this.data.API_KEY == undefined ||
      this.data.API_KEY.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Api Key.', '');
    }
    else if (
      this.data.ENCRYPTION_KEY == null ||
      this.data.ENCRYPTION_KEY == undefined ||
      this.data.ENCRYPTION_KEY.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Encryption Key', '');
    }
    else if (
      this.data.ENDPOINT_URL == null ||
      this.data.ENDPOINT_URL == undefined ||
      this.data.ENDPOINT_URL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Endpoint Url', '');
    }
    else if (
      this.data.WEBHOOK_URL == null ||
      this.data.WEBHOOK_URL == undefined ||
      this.data.WEBHOOK_URL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Webhook Url', '');
    }
    else if (
      !this.data.SUPPORTED_CURRENCIES || 
      this.data.SUPPORTED_CURRENCIES.length === 0 
    ) {
      this.isOk = false;
      this.message.error('Please Select At Least One Supported Currency.', '');
    }
    else if (
      this.data.MIN_AMOUNT > this.data.MAX_AMOUNT
    ) {
      this.isOk = false;
      this.message.error('Minimum Amount Should Not Exceed Maximum Amount', '')
    }
    else if (
      this.data.MIN_AMOUNT == null ||
      this.data.MIN_AMOUNT == undefined ||
      this.data.MIN_AMOUNT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Minimum Amount', '');
    }
    else if (
      this.data.MAX_AMOUNT == null ||
      this.data.MAX_AMOUNT == undefined ||
      this.data.MAX_AMOUNT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Maximum  Number', '')
    }
    this.data.SUPPORTED_CURRENCIES = this.data.SUPPORTED_CURRENCIES.join(',');
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatePaymentGatewayData(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Payment Gateway Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Payment Gateway Updation Failed', '');
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
          this.api.createPaymentGatewayData(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Payment Gateway Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new paymentgateway();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Payment Gateway Creation Failed', '');
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
  close() {
    this.drawerClose();
  }
}