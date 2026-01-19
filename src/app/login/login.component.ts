import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from '../Service/api-service.service';
import { UserMaster } from '../CommonModels/user-master';
import { environment } from 'src/environments/environment.prod';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, takeWhile } from 'rxjs';
export class PasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  OTP: any;
  RID: any;
  VID: any;
}
export class ChangePasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  PASSWORD: any;
  CONFIRM_PASSWORD: any;
  VID: any;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: UserMaster = new UserMaster();
  passwordData = new PasswordData();
  changePasswordData = new ChangePasswordData();
  IsLoginSet: boolean = true;
  EMAIL_ID = '';
  PASSWORD = '';
  supportKey = '';
  ORGANIZATION_ID: number | undefined;
  passwordVisible: boolean = false;
  newpasswordVisible: boolean = false;
  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;
  isOk: boolean = true;
  emailPattern: RegExp =
    /^(?!.*\.\..*)(?!.*--)(?!.*[-.]{2})(?!.*[-@][.@-])[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  passwordPattern: RegExp =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,20}$/;
  constructor(
    private router: Router,
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) {}
  currentApplicationVersion: any;
  public commonFunction = new CommonFunctionService();
  showOTP: boolean = false;
  TYPE_VALUE: any;
  TYPE = 'E';
  OTP: any;
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
    userId = sessionStorage.getItem('userId');
  decrepteduserIdString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserId = parseInt(this.decrepteduserIdString, 10);
  ngOnInit(): void {
    this.currentApplicationVersion = environment.appVersioning.appVersion;
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      this.router.navigate(['/login']);
    } else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }
  vendorsList: any[] = [];
  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.PASSWORD == null || this.PASSWORD.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else {
      this.isloginSpinning = true;
      var cloudid = this.cookie.get('CLOUD_ID');
      this.api.login(this.EMAIL_ID, this.PASSWORD, cloudid, 'U').subscribe(
        (data) => {
          if (data['code'] == '200') {
            const subscribedChannels =
              data?.['data']?.[0]?.['UserData']?.[0]?.['SUBSCRIBED_CHANNELS'];
            if (subscribedChannels && Array.isArray(subscribedChannels)) {
              sessionStorage.setItem(
                'subscribedChannels',
                JSON.stringify(subscribedChannels)
              );
              sessionStorage.setItem(
                'subscribedChannels1',
                JSON.stringify(subscribedChannels)
              );
            }
            this.message.success('Successfully Logged In', '');
            this.cookie.set(
              'token',
              data['data'][0]['token'],
              365,
              '/',
              '',
              false,
              'Strict'
            );
            this.cookie.set(
              'orgId',
              data['data'][0]['UserData'][0]['ORGANISATION_ID'],
              365,
              '/',
              '',
              false,
              'Strict'
            );
            if (
              data['data'][0]['UserData'][0]['BACKOFFICE_TEAM_ID'] != null &&
              data['data'][0]['UserData'][0]['BACKOFFICE_TEAM_ID'] != undefined
            ) {
              sessionStorage.setItem(
                'backofficeId',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0][
                    'BACKOFFICE_TEAM_ID'
                  ].toString()
                )
              );
            }
            if (
              data['data'][0]['UserData'][0]['MOBILE_NUMBER'] != null &&
              data['data'][0]['UserData'][0]['MOBILE_NUMBER'] != undefined
            ) {
              sessionStorage.setItem(
                'mobile',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0]['MOBILE_NUMBER'].toString()
                )
              );
            }
            sessionStorage.setItem(
              'vendorId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['VENDOR_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['USER_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['NAME']
              )
            );
            sessionStorage.setItem(
              'roleId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['ROLE_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'emailId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['EMAIL_ID']
              )
            );
            sessionStorage.setItem(
              'orgId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['ORGANISATION_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'CAN_CHANGE_SERVICE_PRICE',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0][
                  'CAN_CHANGE_SERVICE_PRICE'
                ].toString()
              )
            );
            sessionStorage.setItem(
              'profile_url',
              data['data'][0]['UserData'][0]['PROFILE_PHOTO']
            );
            if (
              data['data'][0]['UserData'][0]['STATE_ID'] != null &&
              data['data'][0]['UserData'][0]['STATE_ID'] != undefined
            ) {
              sessionStorage.setItem(
                'stateId',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0]['STATE_ID'].toString()
                )
              );
            }
            if (
              data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME'] != null &&
              data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME'] != undefined
            ) {
              sessionStorage.setItem(
                'lastlogindate',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME']
                )
              );
            }
            if (
              data['data'][0]['UserData'][0]['STATE_ID'] != null &&
              data['data'][0]['UserData'][0]['STATE_ID'] != undefined
            ) {
              sessionStorage.setItem(
                'stateId',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0]['STATE_ID'].toString()
                )
              );
            }
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          } else {
            this.isloginSpinning = false;
            this.message.error('You have entered wrong credentials', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isloginSpinning = false;
          if (err.error instanceof ErrorEvent) {
            this.message.error(
              'Network error: Please check your connection and try again.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
    }
  }
  ForgetClick: boolean = false;
  sendOTPTrue: boolean = false;
  isSpinning: boolean = false;
  isSendOtpSpinning: boolean = false;
  isverifyOtpSpinning: boolean = false;
  isUpdatePassSpinning: boolean = false;
  emailDisabled: boolean = false;
  isOtpVerified: boolean = false;
  NEW_PASSWORD: any = '';
  CONFPASSWORD: any = '';
  newPasswordVisible: boolean = false;
  reEnterNewPasswordVisible: boolean = false;
  isFocused: string = '';
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  forgentPasswordClick() {
    this.ForgetClick = true;
    this.sendOTPTrue = false;
  }
  USER_ID: any;
  USER_NAME: any;
  backoption() {
    this.ForgetClick = false;
    this.sendOTPTrue = false;
    this.OTP = '';
    this.emailDisabled = false;
    this.CONFPASSWORD = '';
    this.NEW_PASSWORD = '';
  }
  sendOTP() {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else {
      this.isSendOtpSpinning = true;
      this.api.sendotpp(this.EMAIL_ID).subscribe(
        (successCode: any) => {
          if (successCode.body.code == 200) {
            this.USER_ID = successCode.body.USER_ID;
            this.USER_NAME = successCode.body.USER_NAME;
            this.message.success('OTP Send Successfully', '');
            this.emailDisabled = true;
            this.ForgetClick = false;
            this.sendOTPTrue = true;
            this.isSendOtpSpinning = false;
          } else {
            this.message.error('Failed to send otp', '');
            this.isSendOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSendOtpSpinning = false;
        }
      );
    }
  }
  verifyOTP() {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.OTP === null || this.OTP === '' || this.OTP === undefined) {
      this.isOk = false;
      this.message.error('Please Enter OTP', '');
    } else if (
      this.OTP !== null &&
      this.OTP !== '' &&
      this.OTP !== undefined &&
      this.OTP.length < 4
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid OTP', '');
    } else {
      this.emailDisabled = true;
      this.isverifyOtpSpinning = true;
      this.api.verifyotpp(this.EMAIL_ID, this.OTP).subscribe(
        (successCode: any) => {
          if (successCode.body.code == 200) {
            this.message.success('OTP Verified Successfully', '');
            this.isOtpVerified = true;
            this.isverifyOtpSpinning = false;
          } else {
            this.message.error('OTP Verification Failed', '');
            this.isverifyOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isverifyOtpSpinning = false;
        }
      );
    }
  }
  changePassword() {
    if (
      this.NEW_PASSWORD == null ||
      this.NEW_PASSWORD == undefined ||
      this.NEW_PASSWORD.trim() == ''
    ) {
      this.message.error('Please enter new password.', '');
    } else if (this.NEW_PASSWORD.length < 8) {
      this.message.error(
        'New Password must be at least 8 characters long.',
        ''
      );
    } else if (!this.passwordPattern.test(this.NEW_PASSWORD.trim())) {
      this.message.error('Password must meet the required pattern', '');
    } else if (
      this.CONFPASSWORD == null ||
      this.CONFPASSWORD == undefined ||
      this.CONFPASSWORD.trim() == ''
    ) {
      this.message.error('Please enter confirm password.', '');
    } else if (this.NEW_PASSWORD !== this.CONFPASSWORD) {
      this.message.error(
        'The new password and the confirmation password is not matched. Please ensure both are same.',
        ''
      );
    } else {
      this.isUpdatePassSpinning = true;
      this.api
        .changepassword(this.NEW_PASSWORD, this.USER_ID, this.USER_NAME)
        .subscribe(
          (successCode: any) => {
            if (successCode.body.code == 200) {
              this.message.success('Password Updated Successfully', '');
              this.isUpdatePassSpinning = false;
              this.isOtpVerified = false;
              this.ForgetClick = false;
              this.sendOTPTrue = false;
            } else {
              this.message.error('Password Updation Failed', '');
              this.isUpdatePassSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isUpdatePassSpinning = false;
          }
        );
    }
  }
  inputType: 'initial' | 'mobile' | 'email' = 'email';
  selectedCountryCode: string = '+91';
  countryCodeVisible: boolean = false;
  mobileNumberorEmail: any = '';
  getPlaceholder() {
    return this.inputType === 'email'
      ? 'Enter email address'
      : this.inputType === 'mobile'
      ? 'Enter mobile number'
      : 'Enter email ID / mobile number';
  }
  onIdentifierInput(event: any) {
    const value = event.target.value;
    if (!value || value.length < 6) {
      this.inputType = 'initial';
      return;
    }
    if (/[a-zA-Z]/.test(value)) {
      this.inputType = 'email';
    } else {
      this.inputType = 'mobile';
    }
  }
  CustLoginOpen: boolean = false;
  LoginAsCustomer() {
    this.IsCustomerLoginSet = true;
    this.showOtpModal = false;
    this.IsLoginSet = false
  }
  LoginAsAdmin() {
    this.IsCustomerLoginSet= false
    this.CustLoginOpen = false;
    this.IsLoginSet = true;
    this.showOtpModal = false;
  }
  @ViewChild('loginotpverficationModal')
  loginotpverficationModal!: TemplateRef<any>;
  isloginSendOTP: boolean = false;
  showOtpModal: boolean = false;
  type: any;
  loginSubmitted: boolean = false;
  openVerify: boolean = false;
  isLoading: boolean = false;
  issignUpLoading: boolean = false;
  USER_IDcust: any;
  USER_NAMEcust: any;
  otpSent: boolean = false;
  remainingTime: number = 60;
  timerSubscription: any;
  OTPCust: any;
  private isEmail(value: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
  }
  resendforgotOtp(content: any) {
    this.otpSent = false; 
    this.remainingTime = 60; 
    this.startTimer();
  }
  startTimer(): void {
    if (this.timerSubscription) {
      return;
    }
    const maxDuration = 30; 
    this.remainingTime = Math.min(this.remainingTime, maxDuration);
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.remainingTime > 0))
      .subscribe({
        next: () => this.remainingTime--,
        complete: () => (this.timerSubscription = null),
      });
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  loginotpverification() {
    if (
      this.inputType === 'initial' &&
      (this.mobileNumberorEmail === null ||
        this.mobileNumberorEmail === undefined ||
        this.mobileNumberorEmail.trim() === '')
    ) {
      this.message.error('Please enter email ID / mobile number', '');
    } else if (
      this.selectedCountryCode === undefined ||
      this.selectedCountryCode === '' ||
      this.selectedCountryCode === null
    ) {
      this.isOk = false;
      this.message.error('Please select country code.', '');
    } else if (
      this.inputType === 'mobile' &&
      (this.mobileNumberorEmail === null ||
        this.mobileNumberorEmail === undefined ||
        this.mobileNumberorEmail.trim() === '')
    ) {
      this.message.error('Please enter mobile number', '');
    } else if (
      this.inputType === 'mobile' &&
      (this.mobileNumberorEmail === undefined ||
        this.mobileNumberorEmail === null ||
        this.mobileNumberorEmail.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please enter mobile no', '');
    } else if (
      this.inputType === 'mobile' &&
      this.mobileNumberorEmail !== undefined &&
      this.mobileNumberorEmail !== null &&
      this.mobileNumberorEmail.trim() !== '' &&
      !this.commonFunction.mobpattern.test(this.mobileNumberorEmail.toString())
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid mobile number', '');
    } else if (
      this.inputType === 'email' &&
      (this.mobileNumberorEmail === null ||
        this.mobileNumberorEmail === undefined ||
        this.mobileNumberorEmail.trim() === '')
    ) {
      this.message.error('Please enter email ID', '');
    } else if (
      this.inputType === 'email' &&
      (this.mobileNumberorEmail === undefined ||
        this.mobileNumberorEmail === null ||
        this.mobileNumberorEmail.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please enter email ID', '');
    } else if (
      this.inputType === 'email' &&
      this.mobileNumberorEmail !== undefined &&
      this.mobileNumberorEmail !== null &&
      this.mobileNumberorEmail.trim() !== '' &&
      !this.commonFunction.emailpattern.test(
        this.mobileNumberorEmail.toString()
      )
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid email ID', '');
    } else {
      this.loginSubmitted = true;
      this.type = this.isEmail(this.mobileNumberorEmail) ? 'E' : 'M';
      this.isloginSendOTP = true;
      this.api
        .sendOTPCustomer(
          this.selectedCountryCode,
          this.mobileNumberorEmail,
          this.type
        )
        .subscribe({
          next: (successCode: any) => {
            if (successCode.code == '200') {
              if (successCode.CUSTOMER_TYPE) {
                sessionStorage.setItem(
                  'customertype',
                  this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
                );
                localStorage.setItem(
                  'customertype',
                  this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
                );
              } else {
                sessionStorage.setItem(
                  'customertype',
                  this.commonFunction.encryptdata('I')
                );
                localStorage.setItem(
                  'customertype',
                  this.commonFunction.encryptdata('I')
                );
              }
              this.isloginSendOTP = false;
              this.otpSent = true;
              this.showOtpModal = true;
              this.USER_IDcust = successCode.USER_ID;
              this.USER_NAMEcust = successCode.USER_NAME;
              this.remainingTime = 60;
              this.startTimer();
              this.message.success('OTP Sent Successfully...', '');
              this.openVerify = true;
            } else if (successCode.code == '400') {
              this.isloginSendOTP = false;
              this.message.error(
                'The user is not registered or has been deactivated',
                ''
              );
            } else {
              this.isloginSendOTP = false;
              this.message.error('OTP Validation Failed...', '');
            }
          },
          error: (error) => {
            this.isloginSendOTP = false;
            if (error.status === 400) {
              this.message.error(
                'The user is not registered or has been deactivated',
                ''
              );
            } else {
              this.message.error('Error sending OTP', '');
            }
          },
        });
    }
  }
  openLoginModal() {
    this.showOtpModal = false;
    this.CustLoginOpen = true;
    this.OTPCust = null;
  }
  statusCode: any = '';
  showMap: boolean = false;
  isverifyOTP: boolean = false;
  VerifyOTP() {
    if (
      this.OTPCust === null ||
      this.OTPCust === '' ||
      this.OTPCust === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter OTP', '');
    } else if (
      this.OTPCust !== null &&
      this.OTPCust !== '' &&
      this.OTPCust !== undefined &&
      this.OTPCust.length < 4
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid OTP', '');
    } else {
      this.isverifyOTP = true;
      let CLOUD_ID = this.cookie.get('CLOUD_ID');
      this.api
        .verifyOTPCust(
          this.type,
          this.mobileNumberorEmail,
          this.OTPCust,
          this.USER_IDcust,
          this.USER_NAMEcust,
          1,
          CLOUD_ID
        )
        .subscribe({
          next: (successCode: any) => {
            if (successCode.body.message === 'Logged in successfully.') {
              const user = successCode.body.UserData[0];
              const subscribedChannels = [];
              if (subscribedChannels && Array.isArray(subscribedChannels)) {
                sessionStorage.setItem(
                  'subscribedChannels',
                  JSON.stringify(subscribedChannels)
                );
                sessionStorage.setItem(
                  'subscribedChannels1',
                  JSON.stringify(subscribedChannels)
                );
              }
              this.message.success('Successfully Logged In', '');
              this.cookie.set(
                'token',
                successCode.body.token,
                365,
                '/',
                '',
                false,
                'Strict'
              );
              this.cookie.set('orgId', '1', 365, '/', '', false, 'Strict');
              sessionStorage.setItem(
                'backofficeId',
                this.commonFunction.encryptdatacust('0')
              );
              sessionStorage.setItem(
                'mobile',
                this.commonFunction.encryptdatacust(
                  user.MOBILE_NUMBER.toString()
                )
              );
              sessionStorage.setItem(
                'vendorId',
                this.commonFunction.encryptdatacust('0')
              );
              sessionStorage.setItem(
                'userId',
                this.commonFunction.encryptdatacust(user.USER_ID.toString())
              );
              sessionStorage.setItem(
                'userName',
                this.commonFunction.encryptdatacust(user.USER_NAME)
              );
              sessionStorage.setItem(
                'roleId',
                this.commonFunction.encryptdatacust('27')
              );
              sessionStorage.setItem(
                'emailId',
                this.commonFunction.encryptdatacust(user.EMAIL_ID)
              );
              sessionStorage.setItem(
                'orgId',
                this.commonFunction.encryptdatacust('1')
              );
              sessionStorage.setItem(
                'CAN_CHANGE_SERVICE_PRICE',
                this.commonFunction.encryptdatacust('0')
              );
              sessionStorage.setItem('profile_url', '');
              var datee: any = new Date();
              sessionStorage.setItem(
                'lastlogindate',
                this.commonFunction.encryptdatacust(datee)
              );
              sessionStorage.setItem(
                'stateId',
                this.commonFunction.encryptdatacust('1')
              );
              sessionStorage.setItem('LoggedCustoemr', 'customer');
              this.OTPCust = null;
              this.router.navigate(['/customer-dashboard']).then(() => {
                window.location.reload();
              });
              this.statusCode = '';
            } else {
              this.isverifyOTP = false;
              this.message.info(
                'Something went wrong, please try again later',
                ''
              );
            }
          },
          error: (errorResponse) => {
            this.isverifyOTP = false;
            if (errorResponse.error.code === 300) {
              this.message.error('Invalid OTP.', '');
              this.statusCode = 'invalid OTP';
            } else if (errorResponse.error.code === 301) {
              this.message.info(
                "You don't have a default address. Please contact the admin to set up your delivery address",
                ''
              );
            } else {
              this.message.error('Something went wrong. Please try again.', '');
              this.statusCode = '';
            }
          },
        });
    }
  }
  resendOtp() {
    this.OTPCust = null;
    if (this.remainingTime > 0) {
      this.message.info(
        `Please wait ${this.remainingTime} seconds before resending OTP.`,
        ''
      );
      return; 
    }
    this.loginotpverification();
  }
  CEMAIL_ID = '';
  CPASSWORD = '';
  COTP=''
  CUSER_ID:any
  CUSER_NAME:any
  IsCustomerLoginSet:boolean = false
  cpasswordVisible: boolean = false;
  CForgetClick: boolean = false;
  CsendOTPTrue: boolean = false;
  CisSpinning: boolean = false;
  CisSendOtpSpinning: boolean = false;
  CisverifyOtpSpinning: boolean = false;
  CisUpdatePassSpinning: boolean = false;
  CemailDisabled: boolean = false;
  CisOtpVerified: boolean = false;
  CNEW_PASSWORD: any = '';
  CCONFPASSWORD: any = '';
  cnewPasswordVisible: boolean = false;
  creEnterNewPasswordVisible: boolean = false;
  CisloginSpinning: boolean = false;
  cnewpasswordVisible: boolean = false;
  backCustomeroption()
  {
    this.CForgetClick = false;
    this.CsendOTPTrue = false;
    this.COTP = '';
    this.CemailDisabled = false;
    this.CCONFPASSWORD = '';
    this.CNEW_PASSWORD = '';
  }
  CforgentPasswordClick() {
    this.ForgetClick =false
    this.sendOTPTrue=false
    this.CForgetClick = true;
    this.CsendOTPTrue = false;
  }
    Clogin(): void {
    if (this.CEMAIL_ID == '' && this.CPASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.CEMAIL_ID == null || this.CEMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.CEMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.CPASSWORD == null || this.CPASSWORD.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else {
      this.CisloginSpinning = true;
      var cloudid = this.cookie.get('CLOUD_ID');
      this.api.Clogin(this.CEMAIL_ID, this.CPASSWORD, cloudid, 'U').subscribe(
        (data) => {
          if (data['code'] == '200') {
            this.CisloginSpinning = false;
            const subscribedChannels =
              data?.['data']?.[0]?.['UserData']?.[0]?.['SUBSCRIBED_CHANNELS'];
            if (subscribedChannels && Array.isArray(subscribedChannels)) {
              sessionStorage.setItem(
                'subscribedChannels',
                JSON.stringify(subscribedChannels)
              );
              sessionStorage.setItem(
                'subscribedChannels1',
                JSON.stringify(subscribedChannels)
              );
            }
            this.message.success('Successfully Logged In', '');
            this.cookie.set(
              'token',
              data['token'],
              365,
              '/',
              '',
              false,
              'Strict'
            );
            sessionStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(
                data['UserData'][0]['USER_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(
                data['UserData'][0]['USER_NAME']
              )
            );
            sessionStorage.setItem(
              'roleId',
              this.commonFunction.encryptdata(
                data['UserData'][0]['ROLE_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'emailId',
              this.commonFunction.encryptdata(
                data['UserData'][0]['EMAIL_ID']
              )
            );
            sessionStorage.setItem(
              'profile_url',
              data['UserData'][0]['PROFILE_PHOTO']
            );
            this.router.navigate(['/customer-dashboard']).then(() => {
              window.location.reload();
            });
          } 
          else {
            this.CisloginSpinning = false;
            this.message.error('You have entered wrong credentials', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.CisloginSpinning = false;
          if (err.error instanceof ErrorEvent) {
            this.message.error(
              'Network error: Please check your connection and try again.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
    }
  }
    CsendOTP() {
    if (this.CEMAIL_ID == '' && this.CPASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (this.CEMAIL_ID == null || this.CEMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.CEMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else {
      this.CisSendOtpSpinning = true;
      this.api.Csendotpp(this.CEMAIL_ID).subscribe(
        (successCode: any) => {
          if (successCode.body.code == 200) {
            this.CUSER_ID = successCode.body.USER_ID;
            this.CUSER_NAME = successCode.body.EMAIL;
            this.message.success('OTP Sent Successfully', '');
            this.CemailDisabled = true;
            this.CForgetClick = false;
            this.CsendOTPTrue = true;
            this.CisSendOtpSpinning = false;
          } else {
            this.message.error('Failed to send otp', '');
            this.CisSendOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.CisSendOtpSpinning = false;
        }
      );
    }
  }
    CverifyOTP() {
    if (this.CEMAIL_ID == '' && this.CPASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.CEMAIL_ID == null || this.CEMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.CEMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.COTP === null || this.COTP === '' || this.COTP === undefined) {
      this.isOk = false;
      this.message.error('Please Enter OTP', '');
    } else if (
      this.COTP !== null &&
      this.COTP !== '' &&
      this.COTP !== undefined &&
      this.COTP.length < 4
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid OTP', '');
    } else {
      this.CemailDisabled = true;
      this.CisverifyOtpSpinning = true;
      this.api.Cverifyotpp(this.CEMAIL_ID, this.COTP).subscribe(
        (successCode: any) => {
          if (successCode.body.code == 200) {
            this.message.success('OTP Verified Successfully', '');
            this.CisOtpVerified = true;
            this.CisverifyOtpSpinning = false;
          } else {
            this.message.error('OTP Verification Failed', '');
            this.CisverifyOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.CisverifyOtpSpinning = false;
        }
      );
    }
  }
    CchangePassword() {
    if (
      this.CNEW_PASSWORD == null ||
      this.CNEW_PASSWORD == undefined ||
      this.CNEW_PASSWORD.trim() == ''
    ) {
      this.message.error('Please enter new password.', '');
    } else if (this.CNEW_PASSWORD.length < 8) {
      this.message.error(
        'New Password must be at least 8 characters long.',
        ''
      );
    } else if (!this.passwordPattern.test(this.CNEW_PASSWORD.trim())) {
      this.message.error('Password must meet the required pattern', '');
    } else if (
      this.CCONFPASSWORD == null ||
      this.CCONFPASSWORD == undefined ||
      this.CCONFPASSWORD.trim() == ''
    ) {
      this.message.error('Please enter confirm password.', '');
    } else if (this.CNEW_PASSWORD !== this.CCONFPASSWORD) {
      this.message.error(
        'The new password and the confirmation password is not matched. Please ensure both are same.',
        ''
      );
    } else {
      this.CisUpdatePassSpinning = true;
      this.api
        .Cchangepassword(this.CNEW_PASSWORD, this.CUSER_ID, this.CUSER_NAME)
        .subscribe(
          (successCode: any) => {
            if (successCode.body.code == 200) {
              this.message.success('Password Updated Successfully', '');
              this.CisUpdatePassSpinning = false;
              this.CisOtpVerified = false;
              this.CForgetClick = false;
              this.CsendOTPTrue = false;
            } else {
              this.message.error('Password Updation Failed', '');
              this.CisUpdatePassSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.CisUpdatePassSpinning = false;
          }
        );
    }
  }
}
