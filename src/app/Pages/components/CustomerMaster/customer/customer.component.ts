import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { customer } from 'src/app/Pages/Models/customer';
import { Address } from 'src/app/Pages/Models/Address';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  emailpattern =
    /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
      passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,15}$/;

  customercategories: any = [];
  @Input() drawerClose: Function;
  @Input() data: customer = new customer();
  @Input() drawerVisible: boolean;
  @Input() custid;
  @Input() CUSTOMER_MASTER_ID;
  dataList: any = [];
  ID: any;
  Parentcategories: any = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  searchText: string = '';
  filteredData: any[] = []; // searched list
  originalAddressData: any[] = [];
  isOk = true;
  namepatt = /^[a-zA-Z0-9 _\-\.&()]+$/;
  // mobpattern = /^[6-9]\d{9}$/;
  mobpattern = '[789][0-9]{9}';
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  activeTabIndex: number = 0; // Default to the first tab
  isFocused: string = '';
  uploadedImage: any = '';
  public commonFunction = new CommonFunctionService();
  CustomerManager: any = [];
  imgUrl;

  

    passwordVisible: boolean = false;

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
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getCustomerCategoryData();
    this.data.SALUTATION = 'Mr';

    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.PROFILE_PHOTO != null &&
      this.data.PROFILE_PHOTO != undefined &&
      this.data.PROFILE_PHOTO != ''
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'CustomerProfile/' + this.data.PROFILE_PHOTO;
      this.uploadedImage = this.data.PROFILE_PHOTO;
    } else {
    }

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

  allowAlphanumericAndSymbols(event: KeyboardEvent): void {
    const allowedRegex = /^[a-zA-Z0-9_-]$/;

    if (!allowedRegex.test(event.key)) {
      event.preventDefault(); // Block the character if it doesn't match the pattern
    }
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
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
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
    // this.fileURL = null;
    this.data = new customer();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }

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
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  CropImageModalVisible = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop = false;
  cropimageshow: any;
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
    //

    this.CropImageModalVisible = true;
    this.cropimageshow = true;

    this.imageChangedEvent = event;
  }

  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  imageCropped(event: any) {
    this.enhanceImageQuality(event.base64, 128, 128);
    // this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
  }

  async enhanceImageQuality(
    base64: any,
    finalWidth: number,
    finalHeight: number
  ): Promise<void> {
    try {
      this.croppedImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = 'Anonymous'; // Prevents tainted canvas issues.

        img.onload = async () => {
          await img.decode(); // Ensures the image is fully loaded

          // **Create initial high-resolution canvas**
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');

          if (!tempCtx) return reject('Canvas context not available');

          tempCanvas.width = img.width * 2; // Upscale before downscaling
          tempCanvas.height = img.height * 2;

          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.fillStyle = 'white'; // Change this to any color, e.g., 'black' or '#ff0000' (red)
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

          // **Stepwise Downscaling**
          const downscaleCanvas = (
            sourceCanvas: HTMLCanvasElement,
            width: number,
            height: number
          ): HTMLCanvasElement => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');

            if (!newCtx) return sourceCanvas;

            newCanvas.width = width;
            newCanvas.height = height;

            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';
            newCtx.fillStyle = 'white'; // Change this to any color, e.g., 'black' or '#ff0000' (red)
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);

            return newCanvas;
          };

          let currentCanvas = tempCanvas;
          const downscaleSteps = [
            [Math.floor(img.width * 1.5), Math.floor(img.height * 1.5)], // Step 1
            [finalWidth * 2, finalHeight * 2], // Step 2
            [finalWidth, finalHeight], // Final resolution
          ];

          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }

          // **Convert to PNG at Max Quality**
          resolve(currentCanvas.toDataURL('image/png', 1.0));
        };

        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
      // console.error("Image enhancement failed:", error);
    }
  }

  // Function to compress image and ensure size < 1MB
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const sizeInMB = blob.size / (1024 * 1024); // Convert to MB

        if (sizeInMB > 1 && quality > 0.1) {
          // If size is still >1MB, reduce quality and try again
          this.compressImage(canvas, quality - 0.1);
        } else {
          // Final compressed image (size is now below 1MB)
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
            //
          };
        }
      },
      'image/jpeg',
      quality
    ); // Convert to JPEG with given quality
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
    // Image loaded successfully
  }

  cropperReady(event) {
    //
    // Cropper ready
    // event.height = 128;
    // event.width = 128;
  }

  loadImageFailed() {
    // Image failed to load
  }

  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (this.data.CUSTOMER_TYPE == 'I') {
      this.data.COMPANY_NAME = null;
      this.data.PAN = null;
      // this.data.GST_NO = null;
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
    }
     else if (
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
      this.data.EMAIL == null ||
      this.data.EMAIL == undefined ||
      this.data.EMAIL == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email ID.', '');
    } else if (
      this.data.EMAIL != null &&
      this.data.EMAIL != undefined &&
      !this.emailpattern.test(this.data.EMAIL)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email. ', '');
    } else if (!this.commonFunction.emailpattern.test(this.data.EMAIL)) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Email Address.', '');
    } 

    else if (
       !this.data.ID &&
       this.data.CUSTOMER_TYPE == 'B' &&

      (this.data.PASSWORD == null ||
      this.data.PASSWORD == undefined ||
      this.data.PASSWORD == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Password.', '');
    } else if (
       !this.data.ID &&
      this.data.CUSTOMER_TYPE == 'B' &&
      this.data.PASSWORD != null &&
      this.data.PASSWORD != undefined &&
      !this.passwordPattern.test(this.data.PASSWORD)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Password. ', '');
    } else if (
       !this.data.ID &&
      this.data.CUSTOMER_TYPE == 'B' &&
      !this.commonFunction.passwordPattern.test(this.data.PASSWORD)) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Password.', '');
    } 
    else if (
      this.data.COUNTRY_CODE == undefined ||
      this.data.COUNTRY_CODE == 0 ||
      this.data.COUNTRY_CODE == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Country Code.', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO.trim() == '' ||
      this.data.MOBILE_NO.length != 10
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (
      this.data.MOBILE_NO != null &&
      this.data.MOBILE_NO != undefined &&
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NO.toString())
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number', '');
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
        this.data.SHORT_CODE == '' ||
        this.data.SHORT_CODE.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
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
          .onUpload('CustomerProfile', this.fileURL, this.UrlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response && res.status === 200) {
              this.data.PROFILE_PHOTO = this.UrlImageOne;

              // this.message.success('Icon Uploaded Successfully...', '');
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
    // if (this.isOk) {

    // }
  }
  chagegst(data: any) {
    if (!this.data.IS_HAVE_GST) {
      this.data.GST_NO = null;
      this.data.INDIVIDUAL_COMPANY_NAME = null;
      this.data.COMPANY_ADDRESS = null;
    }
  }
  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    {
      if (this.data.CUSTOMER_TYPE == 'B') {
        this.data.PASSWORD = this.data.PASSWORD
        this.data.COMPANY_NAME = this.data.COMPANY_NAME;
        this.data.PAN = this.data.PAN;
        this.data.GST_NO = this.data.GST_NO;
        this.data.IS_SPECIAL_CATALOGUE = this.data.IS_SPECIAL_CATALOGUE;
        this.data.IS_HAVE_GST = false;
        this.data.INDIVIDUAL_COMPANY_NAME = null;
        this.data.COMPANY_ADDRESS = null;
      } else {
        this.data.PASSWORD = null
        this.data.COMPANY_NAME = null;
        this.data.PAN = null;
        // this.data.GST_NO = null;
        this.data.IS_SPECIAL_CATALOGUE = false;
      }
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateCustomer(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.isSpinning = false;
              this.message.success(
                'Customer Information Updated Successfully',
                ''
              );
              this.resetDrawer(accountMasterPage);
              if (!addNew) this.drawerClose();
            } else if (successCode.code == 300) {
              // this.message.error("Email is already exist", "");
              var msg = successCode.message;
              this.message.error(msg, '');
              this.isSpinning = false;
            } else {
              this.message.error('Cannot update Customer Information', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Failed to update Customer Information', '');
            this.isSpinning = false;
          }
        );
      } else {
        this.api.createCustomer(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.isSpinning = false;

              this.message.success(
                'Customer Information Saved Successfully',
                ''
              );

              this.ID = successCode.ID;
              this.CUSTOMER_MASTER_ID = successCode.CUSTOMER_DETAILS_ID;

              // this.resetDrawer(accountMasterPage);

              this.api
                .getCustomerDetails(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID =' + successCode.CUSTOMER_DETAILS_ID
                )
                .subscribe((data) => {
                  this.loadingRecords = false;
                  this.dataList = data['data'];
                });
              this.tabs = [
                {
                  name: 'Personal Details',
                  disabled: false,
                },
                {
                  name: 'Address Details',
                  disabled: false,
                },
              ];
              this.activeTabIndex = 1;
              // if (!addNew) this.drawerClose();
              // else {
              //   this.data = new customer();
              //   this.resetDrawer(CountryDrawer);

              // }
            } else if (successCode.code == 300) {
              // this.message.error("Email is already exist", "");
              var msg = successCode.message;
              this.message.error(msg, '');
              this.isSpinning = false;
            } else {
              this.message.error('Cannot Save Customer Information', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Failed to update Customer Information', '');
            this.isSpinning = false;
          }
        );
      }
    }
  }

  drawerTitle: string;
  drawerVisibleAddress: boolean;
  drawerDataAddress: any;
  loadingFamilyRecords;
  dataFamilyList;

  addAddress() {
    this.drawerTitle = 'Add Address Details';
    this.drawerVisibleAddress = true;
    this.drawerData = new Address();
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
    if (this.originalAddressData.length > 2) {
      this.showsearch = true;
    } else {
      this.showsearch = false;
    }
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
        this.originalAddressData = [...this.addressdata];
        if (this.originalAddressData.length > 2) {
          this.showsearch = true;
        } else {
          this.showsearch = false;
        }
        if (this.addressdata && this.addressdata.length > 0) {
          // Loop through each address and add FULL_ADDRESS key
          this.addressdata = this.addressdata.map((address) => {
            this.fullAddress = [
              address.ADDRESS_LINE_1 || '', // Ensure no undefined or null
              address.ADDRESS_LINE_2 || '',
              address.CITY_NAME || '',
              address.STATE_NAME || '',
              address.COUNTRY_NAME || '',
              address.PINCODE || '',
            ]
              .filter((part) => part.trim() !== '') // Remove empty parts
              .join(', '); // Combine with commas

            return {
              ...address,
              FULL_ADDRESS: this.fullAddress, // Add the concatenated address
            };
          });
        }
      });
    this.drawerVisibleAddress = false;
    // this.searchFamily(true);
  }

  get closeCallbackAddress() {
    return this.drawerAddressClose.bind(this);
  }
  showsearch: boolean = false;
  next() {
    if (this.originalAddressData.length > 2) {
      this.showsearch = true;
    } else {
      this.showsearch = false;
    }

    this.activeTabIndex = 1;
    if (this.data.ID) {
      this.ID = this.custid;
      this.CUSTOMER_MASTER_ID = this.CUSTOMER_MASTER_ID;
    } else {
      this.ID = this.ID;
      this.CUSTOMER_MASTER_ID = this.CUSTOMER_MASTER_ID;
    }
    this.api
      .getAllCustomerAddress(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND STATUS = 1 AND CUSTOMER_ID= ' + this.ID
      )
      .subscribe((data) => {
        this.addressdata = data['data']; // Get the address data
        this.originalAddressData = [...this.addressdata];
        if (this.originalAddressData.length > 2) {
          this.showsearch = true;
        } else {
          this.showsearch = false;
        }
        if (this.addressdata && this.addressdata.length > 0) {
          // Loop through each address and add FULL_ADDRESS key
          this.addressdata = this.addressdata.map((address) => {
            // Concatenate the full address for each address object
            const fullAddress = [
              address.ADDRESS_LINE_1 || '', // Ensure no undefined or null
              address.ADDRESS_LINE_2 || '',
              address.CITY_NAME || '',
              address.STATE_NAME || '',
              address.COUNTRY_NAME || '',
              address.PINCODE || '',
            ]
              .filter((part) => part.trim() !== '') // Remove empty parts
              .join(', '); // Combine with commas

            // Return the address object with the FULL_ADDRESS
            return {
              ...address,
              FULL_ADDRESS: fullAddress, // Add the concatenated address as FULL_ADDRESS
            };
          });
        }
      });
  }
  back() {
    this.activeTabIndex = 0;
    this.api
      .getCustomerDetails(0, 0, '', '', ' AND ID =' + this.CUSTOMER_MASTER_ID)
      .subscribe((data) => {
        this.loadingRecords = false;
        this.data = data['data'][0];
        this.ID = data['data'][0].CUSTOMER_MASTER_ID;
        this.custid = data['data'][0].CUSTOMER_MASTER_ID;
      });
  }
  confirmSetAsDefault(selectedData: any): void {
    this.modal.confirm({
      nzTitle: 'Set as Default Address',
      nzContent: 'Are you sure you want to set this address as the default?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => this.setasdefault(selectedData),
    });
  }
  setasdefault(selectedData: any) {
    // Step 1: Update the IS_DEFAULT values locally
    this.addressdata.forEach((item) => {
      if (item === selectedData) {
        item.IS_DEFAULT = 1; // Set the selected address as default
      } else {
        item.IS_DEFAULT = 0; // Reset others
      }
    });

    // Step 2: Call the API to save the changes
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

  // Profile Photo

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
    this.data.PROFILE_PHOTO = '';
    this.fileURL = null;
  }

  deleteCancel() { }

  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; // 1 MB
    const allowedWidth = 128;
    const allowedHeight = 128;

    if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
      this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');

      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }

      // Validate image dimensions
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        const input = event.target as HTMLInputElement;

        if (input?.files?.length) {
          this.selectedFile = input.files[0];

          // Generate a preview of the selected image
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = this.croppedImage; // Base64 image data
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
            // Sanitize the file URL for preview
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
      this.fileURL = null;
      event.target.value = null;
      this.sanitizedFileURL = null;
    }
  }

  removeImage1(): void {
    this.data.PROFILE_PHOTO = '';
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Profie Photo removed successfully.', '');
  }

  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No Profile Photo selected to view.');
    }
  }

  deleteImage(): void {
    // Remove selected file and its preview
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  keyup(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');
    if (element) element.focus();

    this.search(this.searchText);
    if (this.searchText.length === 0 && keys.key === 'Backspace') {
      this.addressdata = [...this.originalAddressData];
    }
  }

  search(searchText) {
    const query = this.searchText.trim().toLowerCase();

    if (query.length < 1) {
      this.addressdata = [...this.originalAddressData];
      return;
    }

    // Apply search only if original data has 3 or more items
    if (this.originalAddressData.length >= 3) {
      this.addressdata = this.originalAddressData.filter(
        (item) =>
          item.ADDRESS_LINE_1?.toLowerCase().includes(query) ||
          item.ADDRESS_LINE_2?.toLowerCase().includes(query) ||
          item.COUNTRY_NAME?.toLowerCase().includes(query) ||
          item.STATE_NAME?.toLowerCase().includes(query) ||
          item.DISTRICT_NAME?.toLowerCase().includes(query) ||
          item.LANDMARK?.toLowerCase().includes(query) ||
          item.PINCODE?.toLowerCase().includes(query)
      );
    } else {
      this.addressdata = [...this.originalAddressData];
    }
  }
}