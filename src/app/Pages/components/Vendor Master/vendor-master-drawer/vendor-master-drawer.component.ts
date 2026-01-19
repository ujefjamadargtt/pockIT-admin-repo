import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { VendorMasterData } from 'src/app/Pages/Models/vendorMaterData';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-vendor-master-drawer',
  templateUrl: './vendor-master-drawer.component.html',
  styleUrls: ['./vendor-master-drawer.component.css'],
})
export class VendorMasterDrawerComponent {
  @Input() data: VendorMasterData = new VendorMasterData();
  @Input() drawerClose;
  @Input() drawerVisible: boolean = false;
  emailPattern: RegExp =
    /^(?!.*\.\..*)(?!.*--.*)(?!.*-\.|-\@|\.-|\@-)[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  mobpattern = /^[6-9]\d{9}$/;
  passwordPattern: RegExp =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,}$/;
  uploadedImage: any = '';
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  organizationid: any = sessionStorage.getItem('orgId');
  ngOnInit() {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.PROFILE_PHOTO != null &&
      this.data.PROFILE_PHOTO != undefined &&
      this.data.PROFILE_PHOTO != ' '
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'VendorProfile/' + this.data.PROFILE_PHOTO;
      this.uploadedImage = this.data.PROFILE_PHOTO;
    } else {
    }
    this.organizationid = sessionStorage.getItem('orgId');
    this.data.ORG_ID = 1
    this.getallCountry();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID);
    }
    if (this.data?.STATE_ID) {
      this.getDistByState(this.data.STATE_ID);
    }
    if (this.data?.DISTRICT_ID) {
      this.getPincodesByDist(this.data.DISTRICT_ID);
    }
    if (this.data.COUNTRY_CODE) {
      this.data.COUNTRY_CODE = this.data.COUNTRY_CODE;
    }
    if (
      this.data.COUNTRY_CODE == '' ||
      this.data.COUNTRY_CODE == undefined ||
      this.data.COUNTRY_CODE == null
    ) {
      this.data.COUNTRY_CODE = '+91';
    }
  }
  isFocused: string = '';
  isFocused11: string = '';
  isFocused1: boolean = false;
  isSpinning = false;
  isOk = true;
  passwordVisible: boolean = false;
  resetDrawer(VendorDrawer: NgForm) {
    this.StateData = [];
    this.DistData = [];
    this.PincodeData = [];
    this.fileURL = null;
    const defaultCountryCode = '+91';
    this.data = new VendorMasterData();
    this.data.ORG_ID = 1
    this.data.COUNTRY_CODE = defaultCountryCode;
    VendorDrawer.form.markAsPristine();
    VendorDrawer.form.markAsUntouched();
  }
  CropImageModalVisible = false;
  isSpinningCrop = false;
  cropimageshow: any;
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  imageCropped(event: any) {
    this.enhanceImageQuality(event.base64, 128, 128)
  }
  async enhanceImageQuality(base64: any, finalWidth: number, finalHeight: number): Promise<void> {
    try {
      this.croppedImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = "Anonymous"; 
        img.onload = async () => {
          await img.decode(); 
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return reject("Canvas context not available");
          tempCanvas.width = img.width * 2; 
          tempCanvas.height = img.height * 2;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = "high";
          tempCtx.fillStyle = 'white'; 
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          const downscaleCanvas = (sourceCanvas: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement => {
            const newCanvas = document.createElement("canvas");
            const newCtx = newCanvas.getContext("2d");
            if (!newCtx) return sourceCanvas;
            newCanvas.width = width;
            newCanvas.height = height;
            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = "high";
            newCtx.fillStyle = 'white'; 
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };
          let currentCanvas = tempCanvas;
          const downscaleSteps = [
            [Math.floor(img.width * 1.5), Math.floor(img.height * 1.5)], 
            [finalWidth * 2, finalHeight * 2], 
            [finalWidth, finalHeight] 
          ];
          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }
          resolve(currentCanvas.toDataURL("image/png", 1.0));
        };
        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
    }
  }
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const sizeInMB = blob.size / (1024 * 1024); 
        if (sizeInMB > 1 && quality > 0.1) {
          this.compressImage(canvas, quality - 0.1);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
          };
        }
      },
      'image/jpeg',
      quality
    ); 
  }
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
    this.imageWidth = event.original.size.width;
    this.imageHeight = event.original.size.height;
  }
  cropperReady(event) {
  }
  loadImageFailed() {
  }
  save(addNew: boolean, VendorDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.BUSINESS_NAME == null ||
        this.data.BUSINESS_NAME == undefined ||
        this.data.BUSINESS_NAME.trim() == '') &&
      (this.data.NAME == null ||
        this.data.NAME == undefined ||
        this.data.NAME.trim() == '') &&
      (this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID.trim() == '') &&
      (this.data.MOBILE_NUMBER == undefined ||
        this.data.MOBILE_NUMBER == null ||
        this.data.MOBILE_NUMBER == 0) &&
      (this.data.COUNTRY_CODE == undefined ||
        this.data.COUNTRY_CODE == null ||
        this.data.COUNTRY_CODE.trim() == '') &&
      (this.data.PAN == 0 ||
        this.data.PAN == null ||
        this.data.PAN == undefined) &&
      (this.data.ADDRESS_LINE_1 == null ||
        this.data.ADDRESS_LINE_1 == undefined ||
        this.data.ADDRESS_LINE_1.trim() == '') &&
      (this.data.COUNTRY_ID == undefined ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == 0) &&
      (this.data.STATE_ID == 0 ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID == undefined) &&
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == 0) &&
      (this.data.PINCODE_ID == undefined ||
        this.data.PINCODE_ID == null ||
        this.data.PINCODE_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    } else if (
      this.data.BUSINESS_NAME == null ||
      this.data.BUSINESS_NAME == undefined ||
      this.data.BUSINESS_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter the business name.', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter the contact person name.', '');
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter the email.', '');
    } else if (!this.emailPattern.test(this.data.EMAIL_ID.trim())) {
      this.isOk = false;
      this.message.error('Please enter a valid email.', '');
    } else if (
      this.data.COUNTRY_CODE == null ||
      this.data.COUNTRY_CODE == undefined ||
      this.data.COUNTRY_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please select a country code.', '');
    } else if (
      this.data.MOBILE_NUMBER == null ||
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER == 0
    ) {
      this.isOk = false;
      this.message.error('Please enter the mobile number.', '');
    } else if (
      this.data.MOBILE_NUMBER != null &&
      this.data.MOBILE_NUMBER != undefined &&
      this.data.MOBILE_NUMBER != 0 &&
      !this.mobpattern.test(this.data.MOBILE_NUMBER)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid mobile number.', '');
    } else if (
      (this.data.PASSWORD == null ||
        this.data.PASSWORD == undefined ||
        this.data.PASSWORD?.trim() == '') &&
      !this.data.ID
    ) {
      this.isOk = false;
      this.message.error('Please enter a password.', '');
    } else if (
      !this.passwordPattern.test(this.data.PASSWORD?.trim()) &&
      !this.data.ID
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid password.', '');
    } else if (
      this.data.GST_NO != null &&
      this.data.GST_NO != undefined &&
      this.data.GST_NO != 0 &&
      !this.commonFunction.GSTpattern.test(this.data.GST_NO)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid GST number.', '');
    } else if (
      this.data.PAN == null ||
      this.data.PAN == undefined ||
      this.data.PAN.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter the PAN number.', '');
    } else if (
      this.data.PAN != null &&
      this.data.PAN != undefined &&
      this.data.PAN != 0 &&
      !this.commonFunction.panpattern.test(this.data.PAN)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid PAN number.', '');
    } else if (
      this.data.ADDRESS_LINE_1 == null ||
      this.data.ADDRESS_LINE_1 == undefined ||
      this.data.ADDRESS_LINE_1.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter address line 1.', '');
    } else if (
      this.data.ADDRESS_LINE_1 != null &&
      this.data.ADDRESS_LINE_1 != undefined &&
      this.data.ADDRESS_LINE_1.trim() != '' &&
      !this.commonFunction.address1pattern.test(this.data.ADDRESS_LINE_1)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid address line 1.', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please select a country name.', '');
    } else if (
      this.data.STATE_ID == null ||
      this.data.STATE_ID == undefined ||
      this.data.STATE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please select a state name.', '');
    } else if (
      this.data.DISTRICT_ID == null ||
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please select a district name.', '');
    }
    else if (
      this.data.PINCODE_ID == null ||
      this.data.PINCODE_ID == undefined ||
      this.data.PINCODE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please select a pincode.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        this.data.ORG_ID = 1;
        if (this.fileURL) {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileURL.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = `${d ?? ''}${number}.${fileExt}`;
          const uploadedfileExt = this.uploadedImage.split('.').pop();
          if (this.data.ID) {
            if (uploadedfileExt == fileExt) {
              this.UrlImageOne = this.uploadedImage;
            } else {
              this.UrlImageOne = url;
            }
          } else {
            this.UrlImageOne = url;
          }
          this.api
            .onUpload('VendorProfile', this.fileURL, this.UrlImageOne)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response && res.status === 200) {
                this.data.PROFILE_PHOTO = this.UrlImageOne;
                this.handleSaveOperation(addNew, VendorDrawer);
              } else if (res.type === HttpEventType.Response) {
                this.message.error('Failed to Upload Profile Photo.', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.handleSaveOperation(addNew, VendorDrawer);
        }
      }
    }
  }
  handleSaveOperation(addNew: boolean, VendorDrawer: NgForm): void {
    if (this.data.ID) {
      this.api.updateVendorData(this.data).subscribe(
        (successCode: any) => {
          if (
            successCode.code == '200' &&
            successCode.message == 'Email and mobile number already exist'
          ) {
            this.message.error('Email and mobile number already exists.', '');
            this.isSpinning = false;
          } else if (
            successCode.code == '200' &&
            successCode.message == 'Email already exists'
          ) {
            this.message.error('Email already exists.', '');
            this.isSpinning = false;
          } else if (
            successCode.code == '200' &&
            successCode.message == 'Mobile number already exists'
          ) {
            this.message.error('Mobile number already exists.', '');
            this.isSpinning = false;
          } else if (successCode.code == '200') {
            this.message.success('Vendor data updated successfully.', '');
            this.updateChannelData();
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Vendor data update failed.', '');
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
    } else {
      this.data.CREATED_DATE = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
      this.api.createVendorData(this.data).subscribe(
        (successCode: any) => {
          if (
            successCode.code == '200' &&
            successCode.message == 'Email and mobile number already exist'
          ) {
            this.message.error('Email and mobile number already exists.', '');
            this.isSpinning = false;
          } else if (
            successCode.code == '200' &&
            successCode.message == 'Email already exists'
          ) {
            this.message.error('Email already exists.', '');
            this.isSpinning = false;
          } else if (
            successCode.code == '200' &&
            successCode.message == 'Mobile number already exists'
          ) {
            this.message.error('Mobile number already exists.', '');
            this.isSpinning = false;
          } else if (successCode.code == '200') {
            this.message.success('Vendor data created successfully.', '');
            if (!addNew) this.drawerClose();
            else {
              this.resetDrawer(VendorDrawer);
              this.api.getVendorData(0, 0, '', 'desc', '').subscribe(
                (data) => { },
                () => { }
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error('Vendor data creation failed.', '');
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
  createChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      USER_ID: this.data['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.data['NAME'],
      TYPE: 'V',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    }
    this.api
      .createChannels(data)
      .subscribe((successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      }, err => {
        this.isSpinning = false;
      });
  }
  updateChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      OLD_CHANNEL_NAME: this.pincodeChannelOld,
      USER_ID: this.data['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.data['NAME'],
      TYPE: 'V',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    }
    this.api
      .updateChannels(data)
      .subscribe((successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      }, err => {
        this.isSpinning = false;
      });
  }
  close() {
    this.drawerClose();
  }
  generatePassword(): void {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const allChars = upperChars + lowerChars + numbers + specialChars;
    const passwordLength = 8; 
    let password = '';
    password += upperChars[Math.floor(Math.random() * upperChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
    for (let i = password.length; i < passwordLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    this.data.PASSWORD = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
  allowBusinessNameChars(event: KeyboardEvent): void {
    const allowedChars = /^[A-Za-z0-9\-_. ()&]+$/; 
    const char = String.fromCharCode(event.charCode);
    if (!allowedChars.test(char)) {
      event.preventDefault();
    }
  }
  alphaOnly(event: any) {
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
  isStateSpinning = false;
  isDistSpinning = false;
  isPincodeSpinning = false;
  DistData: any = [];
  PincodeData: any = [];
  StateData: any = [];
  CountryData: any = [];
  getallCountry() {
    this.api.getAllCountryMaster(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CountryData = data['data'];
          this.isSpinning = false;
        } else {
          this.CountryData = [];
          this.message.error('Failed to get country data', '');
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
        }
      }
    );
  }
  getStatesByCountry(countryId: any, value: boolean = true) {
    if (value === false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.StateData = [];
      this.DistData = [];
      this.PincodeData = [];
    }
    this.isStateSpinning = true; 
    this.api
      .getState(
        0,
        0,
        '',
        'asc',
        `AND COUNTRY_ID = ${countryId} AND IS_ACTIVE = 1`
      ) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
          } else {
            this.StateData = [];
            this.message.error('Failed to get state data...', '');
          }
          this.isStateSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isStateSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
          }
        }
      );
  }
  getDistByState(stateId: number, value: boolean = true) {
    if (value === false) {
      this.data.DISTRICT_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistData = [];
      this.PincodeData = [];
    }
    this.isDistSpinning = true; 
    this.api
      .getDistrictData(
        0,
        0,
        '',
        'asc',
        `AND STATE_ID = ${stateId} AND IS_ACTIVE = 1`
      ) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.DistData = data['data'];
          } else {
            this.DistData = [];
            this.message.error('Failed to tet district data...', '');
          }
          this.isDistSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isDistSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
          }
        }
      );
  }
  onDistrictChange(districtId: number | null) {
    this.data.PINCODE_ID = null;
    this.data.PINCODE = null;
    this.PincodeData = [];
    if (districtId) {
      this.getPincodesByDist(districtId);
    }
  }
  Filterss: any = {};
  logfilt: any;
  filterdata1: any;
  pincodeChannel: any = '';
  pincodeChannelOld: any = '';
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
        this.pincodeChannel = "pincode_" + pin[0]['ID'] + "_channel"
        if (this.pincodeChannelOld === '' || this.pincodeChannelOld === null) {
          this.pincodeChannelOld = "pincode_" + pin[0]['ID'] + "_channel"
        } else {
          this.pincodeChannelOld = this.pincodeChannelOld;
        }
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }
  getPincodesByDist(distId: number | null, value: boolean = true) {
    if (value === false) {
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.PincodeData = [];
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(0, 0, '', 'asc', `AND DISTRICT = ${distId}`) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);
            if (this.data.ID) {
              this.getpincodename(this.data.PINCODE_ID)
            }
          } else {
            this.PincodeData = [];
            this.message.error('Failed to get pincode data...', '');
          }
          this.isPincodeSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isPincodeSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
          }
        }
      );
  }
  countryCodes = [
    { label: '+91 (India)', value: '+91' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+93 (Afghanistan)', value: '+93' },
    { label: '+94 (Sri Lanka)', value: '+94' },
    { label: '+95 (Myanmar)', value: '+95' },
    { label: '+1 (United States)', value: '+1' },
    { label: '+1-242 (Bahamas)', value: '+1-242' },
    { label: '+1-246 (Barbados)', value: '+1-246' },
    { label: '+1-264 (Anguilla)', value: '+1-264' },
    { label: '+1-268 (Antigua and Barbuda)', value: '+1-268' },
    { label: '+1-284 (British Virgin Islands)', value: '+1-284' },
    { label: '+1-340 (U.S. Virgin Islands)', value: '+1-340' },
    { label: '+1-345 (Cayman Islands)', value: '+1-345' },
    { label: '+1-441 (Bermuda)', value: '+1-441' },
    { label: '+1-473 (Grenada)', value: '+1-473' },
    { label: '+1-649 (Turks and Caicos Islands)', value: '+1-649' },
    { label: '+1-664 (Montserrat)', value: '+1-664' },
    { label: '+1-670 (Northern Mariana Islands)', value: '+1-670' },
    { label: '+1-671 (Guam)', value: '+1-671' },
    { label: '+1-684 (American Samoa)', value: '+1-684' },
    { label: '+1-721 (Sint Maarten)', value: '+1-721' },
    { label: '+1-758 (Saint Lucia)', value: '+1-758' },
    { label: '+1-767 (Dominica)', value: '+1-767' },
    { label: '+1-784 (Saint Vincent and the Grenadines)', value: '+1-784' },
    { label: '+1-787 (Puerto Rico)', value: '+1-787' },
    { label: '+1-809 (Dominican Republic)', value: '+1-809' },
    { label: '+1-829 (Dominican Republic)', value: '+1-829' },
    { label: '+1-849 (Dominican Republic)', value: '+1-849' },
    { label: '+1-868 (Trinidad and Tobago)', value: '+1-868' },
    { label: '+1-869 (Saint Kitts and Nevis)', value: '+1-869' },
    { label: '+1-876 (Jamaica)', value: '+1-876' },
    { label: '+1-939 (Puerto Rico)', value: '+1-939' },
    { label: '+20 (Egypt)', value: '+20' },
    { label: '+211 (South Sudan)', value: '+211' },
    { label: '+212 (Morocco)', value: '+212' },
    { label: '+213 (Algeria)', value: '+213' },
    { label: '+216 (Tunisia)', value: '+216' },
    { label: '+218 (Libya)', value: '+218' },
    { label: '+220 (Gambia)', value: '+220' },
    { label: '+221 (Senegal)', value: '+221' },
    { label: '+222 (Mauritania)', value: '+222' },
    { label: '+223 (Mali)', value: '+223' },
    { label: '+224 (Guinea)', value: '+224' },
    { label: '+225 (Ivory Coast)', value: '+225' },
    { label: '+226 (Burkina Faso)', value: '+226' },
    { label: '+227 (Niger)', value: '+227' },
    { label: '+228 (Togo)', value: '+228' },
    { label: '+229 (Benin)', value: '+229' },
    { label: '+230 (Mauritius)', value: '+230' },
    { label: '+231 (Liberia)', value: '+231' },
    { label: '+232 (Sierra Leone)', value: '+232' },
    { label: '+233 (Ghana)', value: '+233' },
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+235 (Chad)', value: '+235' },
    { label: '+236 (Central African Republic)', value: '+236' },
    { label: '+237 (Cameroon)', value: '+237' },
    { label: '+238 (Cape Verde)', value: '+238' },
    { label: '+239 (Sao Tome and Principe)', value: '+239' },
    { label: '+240 (Equatorial Guinea)', value: '+240' },
    { label: '+241 (Gabon)', value: '+241' },
    { label: '+242 (Republic of the Congo)', value: '+242' },
    { label: '+243 (Democratic Republic of the Congo)', value: '+243' },
    { label: '+244 (Angola)', value: '+244' },
    { label: '+245 (Guinea-Bissau)', value: '+245' },
    { label: '+246 (British Indian Ocean Territory)', value: '+246' },
    { label: '+248 (Seychelles)', value: '+248' },
    { label: '+249 (Sudan)', value: '+249' },
    { label: '+250 (Rwanda)', value: '+250' },
    { label: '+251 (Ethiopia)', value: '+251' },
    { label: '+252 (Somalia)', value: '+252' },
    { label: '+253 (Djibouti)', value: '+253' },
    { label: '+254 (Kenya)', value: '+254' },
    { label: '+255 (Tanzania)', value: '+255' },
    { label: '+256 (Uganda)', value: '+256' },
    { label: '+257 (Burundi)', value: '+257' },
    { label: '+258 (Mozambique)', value: '+258' },
    { label: '+260 (Zambia)', value: '+260' },
    { label: '+261 (Madagascar)', value: '+261' },
    { label: '+262 (Reunion)', value: '+262' },
    { label: '+263 (Zimbabwe)', value: '+263' },
    { label: '+264 (Namibia)', value: '+264' },
    { label: '+265 (Malawi)', value: '+265' },
    { label: '+266 (Lesotho)', value: '+266' },
    { label: '+267 (Botswana)', value: '+267' },
    { label: '+268 (Eswatini)', value: '+268' },
    { label: '+269 (Comoros)', value: '+269' },
    { label: '+27 (South Africa)', value: '+27' },
    { label: '+290 (Saint Helena)', value: '+290' },
    { label: '+291 (Eritrea)', value: '+291' },
    { label: '+297 (Aruba)', value: '+297' },
    { label: '+298 (Faroe Islands)', value: '+298' },
    { label: '+299 (Greenland)', value: '+299' },
    { label: '+30 (Greece)', value: '+30' },
    { label: '+31 (Netherlands)', value: '+31' },
    { label: '+32 (Belgium)', value: '+32' },
    { label: '+33 (France)', value: '+33' },
    { label: '+34 (Spain)', value: '+34' },
    { label: '+350 (Gibraltar)', value: '+350' },
    { label: '+351 (Portugal)', value: '+351' },
    { label: '+352 (Luxembourg)', value: '+352' },
    { label: '+353 (Ireland)', value: '+353' },
    { label: '+354 (Iceland)', value: '+354' },
    { label: '+355 (Albania)', value: '+355' },
    { label: '+356 (Malta)', value: '+356' },
    { label: '+357 (Cyprus)', value: '+357' },
    { label: '+358 (Finland)', value: '+358' },
    { label: '+359 (Bulgaria)', value: '+359' },
    { label: '+36 (Hungary)', value: '+36' },
    { label: '+370 (Lithuania)', value: '+370' },
    { label: '+371 (Latvia)', value: '+371' },
    { label: '+372 (Estonia)', value: '+372' },
    { label: '+373 (Moldova)', value: '+373' },
    { label: '+374 (Armenia)', value: '+374' },
    { label: '+375 (Belarus)', value: '+375' },
    { label: '+376 (Andorra)', value: '+376' },
    { label: '+377 (Monaco)', value: '+377' },
    { label: '+378 (San Marino)', value: '+378' },
    { label: '+379 (Vatican City)', value: '+379' },
    { label: '+380 (Ukraine)', value: '+380' },
    { label: '+381 (Serbia)', value: '+381' },
    { label: '+382 (Montenegro)', value: '+382' },
    { label: '+383 (Kosovo)', value: '+383' },
    { label: '+385 (Croatia)', value: '+385' },
    { label: '+386 (Slovenia)', value: '+386' },
    { label: '+387 (Bosnia and Herzegovina)', value: '+387' },
    { label: '+389 (North Macedonia)', value: '+389' },
    { label: '+39 (Italy)', value: '+39' },
    { label: '+40 (Romania)', value: '+40' },
    { label: '+41 (Switzerland)', value: '+41' },
    { label: '+420 (Czech Republic)', value: '+420' },
    { label: '+421 (Slovakia)', value: '+421' },
    { label: '+423 (Liechtenstein)', value: '+423' },
    { label: '+43 (Austria)', value: '+43' },
    { label: '+44 (United Kingdom)', value: '+44' },
    { label: '+44-1481 (Guernsey)', value: '+44-1481' },
    { label: '+44-1534 (Jersey)', value: '+44-1534' },
    { label: '+44-1624 (Isle of Man)', value: '+44-1624' },
    { label: '+45 (Denmark)', value: '+45' },
    { label: '+46 (Sweden)', value: '+46' },
    { label: '+47 (Norway)', value: '+47' },
    { label: '+48 (Poland)', value: '+48' },
    { label: '+49 (Germany)', value: '+49' },
    { label: '+500 (Falkland Islands)', value: '+500' },
    { label: '+501 (Belize)', value: '+501' },
    { label: '+502 (Guatemala)', value: '+502' },
    { label: '+503 (El Salvador)', value: '+503' },
    { label: '+504 (Honduras)', value: '+504' },
    { label: '+505 (Nicaragua)', value: '+505' },
    { label: '+506 (Costa Rica)', value: '+506' },
    { label: '+507 (Panama)', value: '+507' },
    { label: '+508 (Saint Pierre and Miquelon)', value: '+508' },
    { label: '+509 (Haiti)', value: '+509' },
    { label: '+51 (Peru)', value: '+51' },
    { label: '+52 (Mexico)', value: '+52' },
    { label: '+53 (Cuba)', value: '+53' },
    { label: '+54 (Argentina)', value: '+54' },
    { label: '+55 (Brazil)', value: '+55' },
    { label: '+56 (Chile)', value: '+56' },
    { label: '+57 (Colombia)', value: '+57' },
    { label: '+58 (Venezuela)', value: '+58' },
    { label: '+590 (Guadeloupe)', value: '+590' },
    { label: '+591 (Bolivia)', value: '+591' },
    { label: '+592 (Guyana)', value: '+592' },
    { label: '+593 (Ecuador)', value: '+593' },
    { label: '+594 (French Guiana)', value: '+594' },
    { label: '+595 (Paraguay)', value: '+595' },
    { label: '+596 (Martinique)', value: '+596' },
    { label: '+597 (Suriname)', value: '+597' },
    { label: '+598 (Uruguay)', value: '+598' },
    { label: '+599 (Netherlands Antilles)', value: '+599' },
    { label: '+60 (Malaysia)', value: '+60' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+62 (Indonesia)', value: '+62' },
    { label: '+63 (Philippines)', value: '+63' },
    { label: '+64 (New Zealand)', value: '+64' },
    { label: '+65 (Singapore)', value: '+65' },
    { label: 'Thailand (+66)', value: '+66' },
    { label: 'Timor-Leste (+670)', value: '+670' },
    { label: 'Australian External Territories (+672)', value: '+672' },
    { label: 'Brunei (+673)', value: '+673' },
    { label: 'Nauru (+674)', value: '+674' },
    { label: 'Papua New Guinea (+675)', value: '+675' },
    { label: 'Tonga (+676)', value: '+676' },
    { label: 'Solomon Islands (+677)', value: '+677' },
    { label: 'Vanuatu (+678)', value: '+678' },
    { label: 'Fiji (+679)', value: '+679' },
    { label: 'Palau (+680)', value: '+680' },
    { label: 'Wallis and Futuna (+681)', value: '+681' },
    { label: 'Cook Islands (+682)', value: '+682' },
    { label: 'Niue (+683)', value: '+683' },
    { label: 'Samoa (+685)', value: '+685' },
    { label: 'Kiribati (+686)', value: '+686' },
    { label: 'New Caledonia (+687)', value: '+687' },
    { label: 'Tuvalu (+688)', value: '+688' },
    { label: 'French Polynesia (+689)', value: '+689' },
    { label: 'Tokelau (+690)', value: '+690' },
    { label: 'Micronesia (+691)', value: '+691' },
    { label: 'Marshall Islands (+692)', value: '+692' },
    { label: 'Russia (+7)', value: '+7' },
    { label: 'Kazakhstan (+7)', value: '+7' },
    { label: 'Japan (+81)', value: '+81' },
    { label: 'South Korea (+82)', value: '+82' },
    { label: 'Vietnam (+84)', value: '+84' },
    { label: 'North Korea (+850)', value: '+850' },
    { label: 'Hong Kong (+852)', value: '+852' },
    { label: 'Macau (+853)', value: '+853' },
    { label: 'Cambodia (+855)', value: '+855' },
    { label: 'Laos (+856)', value: '+856' },
    { label: 'China (+86)', value: '+86' },
    { label: 'Bangladesh (+880)', value: '+880' },
    { label: 'Taiwan (+886)', value: '+886' },
    { label: 'Turkey (+90)', value: '+90' },
    { label: 'Maldives (+960)', value: '+960' },
    { label: 'Lebanon (+961)', value: '+961' },
    { label: 'Jordan (+962)', value: '+962' },
    { label: 'Syria (+963)', value: '+963' },
    { label: 'Iraq (+964)', value: '+964' },
    { label: 'Kuwait (+965)', value: '+965' },
    { label: 'Saudi Arabia (+966)', value: '+966' },
    { label: 'Yemen (+967)', value: '+967' },
    { label: 'Oman (+968)', value: '+968' },
    { label: 'Palestine (+970)', value: '+970' },
    { label: 'United Arab Emirates (+971)', value: '+971' },
    { label: 'Israel (+972)', value: '+972' },
    { label: 'Bahrain (+973)', value: '+973' },
    { label: 'Qatar (+974)', value: '+974' },
    { label: 'Bhutan (+975)', value: '+975' },
    { label: 'Mongolia (+976)', value: '+976' },
    { label: 'Nepal (+977)', value: '+977' },
    { label: 'Iran (+98)', value: '+98' },
    { label: 'Tajikistan (+992)', value: '+992' },
    { label: 'Turkmenistan (+993)', value: '+993' },
    { label: 'Azerbaijan (+994)', value: '+994' },
    { label: 'Georgia (+995)', value: '+995' },
    { label: 'Kyrgyzstan (+996)', value: '+996' },
    { label: 'Uzbekistan (+998)', value: '+998' },
  ];
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
      this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = this.croppedImage;
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
          this.selectedFile = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = this.croppedImage; 
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
      this.CropImageModalVisible = false;
    } else {
      this.message.error(
        'Please select a valid image file (PNG, JPG, JPEG).',
        ''
      );
      event.target.value = null;
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
}