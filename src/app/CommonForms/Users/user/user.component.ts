import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { UserMaster } from 'src/app/CommonModels/user-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: UserMaster = new UserMaster();
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  isFocused: string = '';
  isFocused1: boolean = false;
  roles: RoleMaster[] = [];
  selectedRole: RoleMaster = new RoleMaster();
  passwordVisible: boolean = false;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  organizationid: any = sessionStorage.getItem('orgId');
  public commonFunction = new CommonFunctionService();
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }
  orgid: any = 0;
  ngOnInit() {
    this.organizationid = sessionStorage.getItem('orgId');
    this.orgid = this.organizationid
      ? this.commonFunction.decryptdata(this.organizationid)
      : 0;
    this.selectedRole = new RoleMaster();
    this.loadRoles();
  }
  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0, 0, '', '', " AND TYPE='Super Admin' AND ID!='27'").subscribe(
      (roles) => {
        this.roles = roles['data'];
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.fileURL = null;
    this.data = new UserMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  close(): void {
    this.drawerClose();
  }
  @ViewChild('icon') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  CropImageModalVisible = false;
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
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  imageCropped(event: ImageCroppedEvent) {
    this.enhanceImageQuality(event.base64, 128, 128);
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
        img.crossOrigin = 'Anonymous';
        img.onload = async () => {
          await img.decode();
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) return reject('Canvas context not available');
          tempCanvas.width = img.width * 2;
          tempCanvas.height = img.height * 2;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
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
            newCtx.fillStyle = 'white';
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };
          let currentCanvas = tempCanvas;
          const downscaleSteps = [
            [Math.floor(img.width * 1.5), Math.floor(img.height * 1.5)],
            [finalWidth * 2, finalHeight * 2],
            [finalWidth, finalHeight],
          ];
          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }
          resolve(currentCanvas.toDataURL('image/png', 1.0));
        };
        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
    }
  }
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }
  cropperReady(event) {
  }
  loadImageFailed() {
  }
  isOk = true;
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.ROLE_ID == undefined ||
        this.data.ROLE_ID == null ||
        this.data.ROLE_ID == '') &&
      (this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '') &&
      (this.data.PASSWORD == undefined ||
        this.data.PASSWORD == null ||
        this.data.PASSWORD == '') &&
      (this.data.PROFILE_PHOTO == undefined ||
        this.data.PROFILE_PHOTO == null ||
        this.data.PROFILE_PHOTO == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.ROLE_ID == null ||
      this.data.ROLE_ID == undefined ||
      this.data.ROLE_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select User Role', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter User Name', '');
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email.', '');
    } else if (!this.commonFunction.email.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Email.', '');
    }
    else if (
      (this.data.PASSWORD == null ||
        this.data.PASSWORD == undefined ||
        this.data.PASSWORD == '') &&
      !this.data.ID
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Password.', '');
    } else if (
      this.data.PROFILE_PHOTO == null ||
      this.data.PROFILE_PHOTO == undefined ||
      this.data.PROFILE_PHOTO == '' ||
      this.data.PROFILE_PHOTO == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Upload Profile Photo', '');
    } else if (
      !this.commonFunction.passPattern.test(this.data.PASSWORD) &&
      !this.data.ID
    ) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Password.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          var udata = {
            ARCHIVE_FLAG: 'F',
            BACKOFFICE_TEAM_ID: null,
            CITY_ID: null,
            CLIENT_ID: this.data.CLIENT_ID,
            COUNTRY_ID: null,
            CREATED_MODIFIED_DATE: null,
            EMAIL_ID: this.data.EMAIL_ID,
            FIREBASE_REG_TOKEN: null,
            ID: this.data.ID,
            IS_ACTIVE: this.data.IS_ACTIVE,
            LAST_LOGIN_DATETIME: null,
            LOGOUT_DATE_TIME: null,
            NAME: this.data.NAME,
            ORGANISATION_ID: this.orgid,
            ORG_ID: 1,
            PINCODE_ID: null,
            PROFILE_PHOTO: this.data.PROFILE_PHOTO,
            READ_ONLY: null,
            ROLE_ID: this.data.ROLE_ID,
            ROLE_IDS: null,
            ROLE_NAME: null,
            STATE_ID: null,
            TECHNICIAN_ID: null,
            USER_TYPE: null,
            VENDOR_ID: null,
          };
          this.api.updateUser(udata).subscribe((successCode) => {
            if (successCode.code == '200') {
              if (
                this.fileURL != undefined &&
                this.fileURL != null &&
                this.fileURL != '' &&
                this.data.PROFILE_PHOTO != null &&
                this.data.PROFILE_PHOTO != undefined &&
                this.data.PROFILE_PHOTO != ''
              ) {
                this.IconUpload();
              }
              this.message.success('User Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else if (successCode['code'] == '300') {
              this.message.error('Mobile No. or Email Already Registered', '');
              this.isSpinning = false;
            } else if (successCode['code'] == '401') {
              this.message.error('Email Already Registered', '');
              this.isSpinning = false;
            } else {
              this.message.error('User Updation Failed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.data.ORG_ID = 1;
          this.data.ORGANISATION_ID = 1;
          this.api.createUser(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              if (
                this.fileURL != undefined &&
                this.fileURL != null &&
                this.fileURL != '' &&
                this.data.PROFILE_PHOTO != null &&
                this.data.PROFILE_PHOTO != undefined &&
                this.data.PROFILE_PHOTO != ''
              ) {
                this.IconUpload();
              }
              this.message.success('User Created Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new UserMaster();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else if (successCode['code'] == '300') {
              this.message.error('Mobile No. or Email Already Registered', '');
              this.isSpinning = false;
            } else if (successCode['code'] == '401') {
              this.message.error('Email Already Registered', '');
              this.isSpinning = false;
            } else {
              this.message.error('User Creation Failed...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
  imageshow: any = null;
  selectedFile: any;
  imagePreview: any;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        this.selectedFile = this.base64ToFile(
          this.croppedImage,
          'cropped-image.png'
        );
        if (this.selectedFile.size > maxFileSize) {
          this.message.error('Photo size should not exceed 1MB.', '');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width !== 128 || img.height !== 128) {
              this.message.error(
                'Photo dimensions must be 128x128 pixels.',
                ''
              );
              this.fileURL = null;
              this.selectedFile = null;
              return;
            }
            this.imagePreview = this.croppedImage;
            this.fileURL = this.base64ToFile(
              this.croppedImage,
              'cropped-image.png'
            );
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = d == null ? '' : d + number + '.' + fileExt;
            if (
              this.data.PROFILE_PHOTO != undefined &&
              this.data.PROFILE_PHOTO.trim() !== ''
            ) {
              var arr = this.data.PROFILE_PHOTO.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }
            this.UrlImageOne = url;
            this.progressBarImageOne = true;
            this.urlImageOneShow = true;
            this.data.PROFILE_PHOTO = this.UrlImageOne;
          };
          img.onerror = () => {
            this.message.error('Invalid Photo file.', '');
          };
          img.src = this.croppedImage;
        };
        reader.readAsDataURL(this.selectedFile);
        this.CropImageModalVisible = false;
      }
    } else {
      this.message.error(
        'Please select a valid Photo file (PNG, JPG, JPEG).',
        ''
      );
      event.target.value = null;
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.PROFILE_PHOTO = null;
    }
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'userProfile/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = imagePath;
    this.ImageModalVisible = true;
  }
  IconDeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.PROFILE_PHOTO = ' ';
    this.fileURL = null;
  }
  deleteCancel() { }
  removeImage() {
    this.data.PROFILE_PHOTO = ' ';
    this.fileURL = null;
    this.imageshow = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  IconUpload() {
    this.timer = this.api
      .onUpload('userProfile', this.fileURL, this.UrlImageOne)
      .subscribe((res) => {
        this.data.PROFILE_PHOTO = this.UrlImageOne;
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percentImageOne = percentDone;
          if (this.percentImageOne == 100) {
            this.isSpinning = false;
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload Profile Photo...', '');
          this.isSpinning = false;
          this.progressBarImageOne = false;
          this.percentImageOne = 0;
          this.data.PROFILE_PHOTO = null;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.isSpinning = false;
            this.data.PROFILE_PHOTO = this.UrlImageOne;
          } else {
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.PROFILE_PHOTO = null;
          }
        }
      });
  }
}