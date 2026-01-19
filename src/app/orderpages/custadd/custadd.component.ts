import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { customer } from 'src/app/Pages/Models/customer';
import { Address } from 'src/app/Pages/Models/Address';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-custadd',
  templateUrl: './custadd.component.html',
  styleUrls: ['./custadd.component.css'],
})
export class CustaddComponent {
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  customercategories: any = [];
  @Input() drawerClose: Function;
  @Input() data: customer = new customer();
  @Input() drawerVisible: boolean;
  Parentcategories: any = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  activeTabIndex: number = 0; 
  isFocused: any = '';
  public commonFunction = new CommonFunctionService();
  imgUrl;
  tabs = [
    {
      name: 'Personal Details',
      disabled: false,
    },
    {
      name: 'Address Details',
      disabled: true,
    },
  ];
  CustomerManager: any = [];
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.getCustomerCategoryData();
    this.data.SALUTATION = 'Mr';
    this.api.getBackOfficeData(0, 0, '', '', ' AND ROLE_ID=7').subscribe(
      (dataaa1) => {
        if (dataaa1['code'] == 200) {
          this.CustomerManager = dataaa1['data'];
        } else {
          this.CustomerManager = [];
        }
      },
      () => {
        this.CustomerManager = [];
      }
    );
  }
  getCustomerCategoryData() {
    this.api
      .getCustomerCategeroyData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.customercategories = data['data'];
          } else {
            this.customercategories = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    this.fileURL = null;
    this.data = new customer();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }
  dataList: any = [];
  ID: any;
  changetype(event: any) {
    if (event == 'B') {
      this.data.IS_SPECIAL_CATALOGUE = this.data.IS_SPECIAL_CATALOGUE;
      this.data.IS_HAVE_GST = false;
      this.data.INDIVIDUAL_COMPANY_NAME = null;
      this.data.COMPANY_ADDRESS = null;
      this.data.GST_NO = null;
    } else {
      this.data.IS_SPECIAL_CATALOGUE = false;
    }
    if (event == 'I') {
      this.data.SHORT_CODE = null;
    }
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (this.data.CUSTOMER_TYPE == 'I') {
      this.data.COMPANY_NAME = null;
      this.data.PAN = null;
      this.data.IS_SPECIAL_CATALOGUE = false;
      this.data.SHORT_CODE = null;
    }
    if (
      this.data.CUSTOMER_TYPE == undefined &&
      this.data.CUSTOMER_CATEGORY_ID == undefined &&
      this.data.NAME == undefined &&
      this.data.EMAIL == undefined &&
      this.data.MOBILE_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.CUSTOMER_TYPE == undefined ||
      this.data.CUSTOMER_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Customer Type', '');
    } else if (
      this.data.CUSTOMER_CATEGORY_ID == undefined ||
      this.data.CUSTOMER_CATEGORY_ID == null ||
      this.data.CUSTOMER_CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Customer Category', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      (this.data.COMPANY_NAME == undefined ||
        this.data.COMPANY_NAME == null ||
        this.data.COMPANY_NAME.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Company Name', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      (this.data.NAME == undefined ||
        this.data.NAME == null ||
        this.data.NAME == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Contact Customer Name', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'I' &&
      (this.data.NAME == undefined ||
        this.data.NAME.trim() == '' ||
        this.data.NAME == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Customer Name', '');
    } else if (
      this.data.EMAIL == undefined ||
      this.data.EMAIL == null ||
      this.data.EMAIL == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email.', '');
    } else if (this.data.EMAIL != null &&
      this.data.EMAIL != undefined && !this.commonFunction.emailpattern.test(this.data.EMAIL)) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Email Address.', '');
    } else if (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO == '') {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (
      this.data.COUNTRY_CODE === undefined ||
      this.data.COUNTRY_CODE === null ||
      this.data.COUNTRY_CODE === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Country Code.', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      (this.data.PAN == undefined ||
        this.data.PAN.trim() == '' ||
        this.data.PAN == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter PAN No.', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      this.data.PAN != null &&
      this.data.PAN != undefined &&
      this.data.PAN != 0 &&
      !this.commonFunction.panpattern.test(this.data.PAN)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid PAN number.', '');
    } else if (
      (this.data.IS_HAVE_GST && this.data.CUSTOMER_TYPE == 'I') &&
      (this.data.INDIVIDUAL_COMPANY_NAME == undefined ||
        this.data.INDIVIDUAL_COMPANY_NAME == null ||
        this.data.INDIVIDUAL_COMPANY_NAME.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Company Name', '');
    } else if (
      (this.data.IS_HAVE_GST && this.data.CUSTOMER_TYPE == 'I') &&
      (this.data.COMPANY_ADDRESS == undefined ||
        this.data.COMPANY_ADDRESS == null ||
        this.data.COMPANY_ADDRESS.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Company Address', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Short Code.', '');
    } else if (
      (this.data.IS_HAVE_GST && this.data.CUSTOMER_TYPE == 'I') &&
      (this.data.GST_NO == undefined ||
        this.data.GST_NO.trim() == '' ||
        this.data.GST_NO == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter GST No.', '');
    } else if (
      this.data.GST_NO !== null &&
      this.data.GST_NO !== undefined &&
      this.data.GST_NO !== 0 &&
      this.data.GST_NO !== '' &&
      !this.commonFunction.GSTpattern.test(this.data.GST_NO)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid GST number.', '');
    }
    if (this.isOk) {
      if (this.fileURL) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.UrlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.api
          .onUpload('CustomerProfile', this.fileURL, this.UrlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response && res.status === 200) {
              this.data.PROFILE_PHOTO = this.UrlImageOne;
              this.handleSaveOperation(addNew, accountMasterPage);
            } else if (res.type === HttpEventType.Response) {
              this.message.error('Failed to Upload Profile Photo.', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.handleSaveOperation(addNew, accountMasterPage);
      }
    }
  }
  chagegst(data: any) {
    if (!this.data.IS_HAVE_GST) {
      this.data.GST_NO = null;
      this.data.INDIVIDUAL_COMPANY_NAME = null;
      this.data.COMPANY_ADDRESS = null;
    }
  }
  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.data.CUSTOMER_TYPE == 'B') {
      this.data.COMPANY_NAME = this.data.COMPANY_NAME;
      this.data.PAN = this.data.PAN;
      this.data.GST_NO = this.data.GST_NO;
      this.data.IS_SPECIAL_CATALOGUE = this.data.IS_SPECIAL_CATALOGUE;
      this.data.IS_HAVE_GST = false;
      this.data.INDIVIDUAL_COMPANY_NAME = null;
      this.data.COMPANY_ADDRESS = null;
    } else {
      this.data.COMPANY_NAME = null;
      this.data.PAN = null;
      this.data.IS_SPECIAL_CATALOGUE = false;
    }
    this.isSpinning = true;
    this.api.createCustomer(this.data).subscribe((successCode: any) => {
      if (successCode.code == '200') {
        this.message.success('Customer Information Saved Successfully', '');
        this.close(accountMasterPage);
        this.isSpinning = false;
      } else if (successCode.code == '300') {
        this.message.error(successCode.message, '');
        this.isSpinning = false;
      } else {
        this.message.error('Cannot Save Customer Information', '');
        this.isSpinning = false;
      }
    });
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
  @Input() custid;
  drawerTitle: string;
  drawerVisibleAddress: boolean;
  drawerDataAddress: any;
  loadingFamilyRecords;
  dataFamilyList;
  addAddress() {
    this.drawerTitle = 'Add Address Details';
    this.drawerVisibleAddress = true;
    this.drawerDataAddress = new Address();
  }
  drawerData: Address = new Address();
  editAddress(data: Address) {
    this.drawerTitle = 'Update Address Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisibleAddress = true;
  }
  fullAddress: any;
  addressdata: any = [];
  drawerAddressClose(): void {
    this.api
      .getAllCustomerAddress(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND STATUS = 1 AND CUSTOMER_ID= ' + this.ID
      )
      .subscribe((data) => {
        this.addressdata = data['data'];
        if (this.addressdata && this.addressdata.length > 0) {
          this.addressdata = this.addressdata.map((address) => {
            this.fullAddress = [
              address.ADDRESS_LINE_1 || '', 
              address.ADDRESS_LINE_2 || '',
              address.CITY_NAME || '',
              address.STATE_NAME || '',
              address.COUNTRY_NAME || '',
              address.PINCODE || '',
            ]
              .filter((part) => part.trim() !== '') 
              .join(', '); 
            return {
              ...address,
              FULL_ADDRESS: this.fullAddress, 
            };
          });
        }
      });
    this.drawerVisibleAddress = false;
  }
  get closeCallbackAddress() {
    return this.drawerAddressClose.bind(this);
  }
  next() {
    this.activeTabIndex = 1;
    this.ID = this.custid;
    this.api
      .getAllCustomerAddress(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND STATUS = 1 AND CUSTOMER_ID= ' + this.ID
      )
      .subscribe((data) => {
        this.addressdata = data['data']; 
        if (this.addressdata && this.addressdata.length > 0) {
          this.addressdata = this.addressdata.map((address) => {
            const fullAddress = [
              address.ADDRESS_LINE_1 || '', 
              address.ADDRESS_LINE_2 || '',
              address.CITY_NAME || '',
              address.STATE_NAME || '',
              address.COUNTRY_NAME || '',
              address.PINCODE || '',
            ]
              .filter((part) => part.trim() !== '') 
              .join(', '); 
            return {
              ...address,
              FULL_ADDRESS: fullAddress, 
            };
          });
        }
      });
  }
  back() {
    this.activeTabIndex = 0;
    this.api
      .getAllCustomer(0, 0, '', '', ' AND ID =' + this.ID)
      .subscribe((data) => {
        this.loadingRecords = false;
        this.data = data['data'][0];
      });
  }
  setasdefault(selectedData: any) {
    this.addressdata.forEach((item) => {
      if (item === selectedData) {
        item.IS_DEFAULT = 1; 
      } else {
        item.IS_DEFAULT = 0; 
      }
    });
    this.api.updateCustomerAddressNew(selectedData).subscribe(
      (successCode: any) => {
        if (successCode.code == '200') {
          this.message.success(
            'Customer Address Information Updated Successfully',
            ''
          );
        } else {
          this.message.error(
            'Failed to update customer address. Please try again.',
            ''
          );
        }
      },
      (error: any) => {
        this.message.error('An error occurred while updating the address.', '');
      }
    );
  }
  countryCodes = this.commonFunction.countryCodes;
  imageshow: any = null;
  selectedFile: any;
  imagePreview: any;
  fileURL: any;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  ViewImage: any;
  ImageModalVisible = false;
  sanitizedLink: any = '';
  sanitizedFileURL: SafeUrl | null = null;
  imagePreviewURL;
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  imageDeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.PROFILE_PHOTO = ' ';
    this.fileURL = null;
  }
  deleteCancel() { }
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; 
    const allowedWidth = 128;
    const allowedHeight = 128;
    if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
      this.fileURL = event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
          this.selectedFile = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result; 
          };
          reader.readAsDataURL(this.selectedFile);
        }
        img.onload = () => {
          if (img.width !== allowedWidth || img.height !== allowedHeight) {
            this.message.error(
              `Profile Photo dimensions should be exactly ${allowedWidth}x${allowedHeight}px.`,
              ''
            );
            this.fileURL = null;
            this.sanitizedFileURL = null;
          } else {
            this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(this.fileURL)
            );
            this.data.PROFILE_PHOTO = this.fileURL.name;
          }
        };
      };
      reader.readAsDataURL(this.fileURL);
    } else {
      this.message.error(
        'Please select a valid image file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.sanitizedFileURL = null;
    }
  }
  removeImage1(): void {
    this.data.PROFILE_PHOTO = null;
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Profie Photo removed successfully.', '');
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); 
      window.open(imageURL, '_blank');
    } else {
      alert('No Profile Photo selected to view.');
    }
  }
  deleteImage(): void {
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  allowAlphanumericAndSymbols(event: KeyboardEvent): void {
    const allowedRegex = /^[a-zA-Z0-9_-]$/;
    if (!allowedRegex.test(event.key)) {
      event.preventDefault(); 
    }
  }
}