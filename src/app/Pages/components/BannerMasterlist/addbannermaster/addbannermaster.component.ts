import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { appkeys } from 'src/app/app.constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { bannermodal } from 'src/app/Pages/Models/bannermodal';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-addbannermaster',
  templateUrl: './addbannermaster.component.html',
  styleUrls: ['./addbannermaster.component.css'],
})
export class AddbannermasterComponent implements OnInit {
  txt: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  retriveimgUrl = appkeys.retriveimgUrl;
  fullImageUrl: string;
  uploadedImage: any = '';
  ngOnInit(): void {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.IMAGE_URL != null &&
      this.data.IMAGE_URL != undefined
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'BannerImages/' + this.data.IMAGE_URL;
      this.uploadedImage = this.data.IMAGE_URL;
    } else {
    }
    if (this.data.ID && this.data.ID != null && this.data.ID != undefined) {
      this.titlecolor = this.data.TITLE_COLOR;
      this.subtitlecolor = this.data.SUB_TITLE_COLOR;
      this.subtitlecolor1 = this.data.SUB_TITLE_COLOR_1;
    }
  }
  @Input() list = [];
  @Input() list1 = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  public commonFunction = new CommonFunctionService();
  isFocused: string = '';
  isSpinning = false;
  @Input()
  data: bannermodal = new bannermodal();
  @Input() buttoncolor: any;
  @Input() titlecolor: any;
  @Input() subtitlecolor: any;
  @Input() subtitlecolor1: any;
  @Input() buttontextcolor: any;
  @Input() descolor: any;
  @Input()
  drawerClose!: Function;
  @Input()
  drawerVisible: boolean = false;
  fileURL: any;
  imgurl = appkeys.retriveimgUrl;
  bannertype: any = [];
  location: any = [];
  adowner: any = [];
  @Input() height: any;
  @Input() width: any;
  isokfile1: boolean = true;
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  nonumchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return false;
    if (48 <= charCode && charCode <= 57) return false;
    if (65 <= charCode && charCode <= 90) return false;
    if (97 <= charCode && charCode <= 122) return false;
    return false;
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
  getbannertype(event: any) {
    var i = this.bannertype.findIndex((item: any) => item.ID == event);
    this.height = this.bannertype[i]['IMAGE_HEIGHT'];
    this.width = this.bannertype[i]['IMAGE_WIDTH'];
  }
  resetImage() {
    this.data.IMAGE_URL = '';
    this.fileURL = null;
    this.imagePreview = null;
    this.data.TITLE = '';
    this.data.SUB_TITLE = '';
    this.titlecolor = '';
    this.subtitlecolor = '';
    if (this.data.BANNER_TYPE === 'M') {
      this.data.BANNER_FOR = 'W';
    }
  }
  resetImage1() {
    this.data.IMAGE_URL = '';
    this.fileURL = null;
    this.imagePreview = null;
    this.data.TITLE = '';
    this.data.SUB_TITLE = '';
    this.titlecolor = '';
    this.subtitlecolor = '';
  }
  resetformobile() {
    this.data.BANNER_TYPE = 'M';
  }
  resetDrawer(form: NgForm) {
    this.data = new bannermodal();
    this.titlecolor = '';
    this.subtitlecolor = '';
    this.data.TITLE_COLOR = '';
    this.data.SUB_TITLE_COLOR = '';
    form.form.markAsUntouched();
    form.form.markAsPristine();
  }
  close(): void {
    this.drawerClose();
  }
  isOk = true;
  imgHeight: any;
  imgweight: any;
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
  cropperPosition = { x1: 0, y1: 0, x2: 1290, y2: 300 };
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;
    if (this.data.BANNER_TYPE === 'O') {
      cropWidth = 364;
      cropHeight = 400;
    } else if (this.data.BANNER_TYPE === 'M' && this.data.BANNER_FOR === 'M') {
      cropWidth = 645;
      cropHeight = 299;
    } else if (this.data.BANNER_TYPE === 'M' && this.data.BANNER_FOR === 'W') {
      cropWidth = 1290;
      cropHeight = 300;
    }
    this.enhanceImageQuality(event.base64, cropWidth, cropHeight);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
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
      if (this.data.BANNER_TYPE === 'O') {
        this.cropperPosition = { x1: 0, y1: 0, x2: 364, y2: 400 };
      } else if (
        this.data.BANNER_TYPE === 'M' &&
        this.data.BANNER_FOR === 'M'
      ) {
        this.cropperPosition = { x1: 0, y1: 0, x2: 645, y2: 299 };
      } else if (
        this.data.BANNER_TYPE === 'M' &&
        this.data.BANNER_FOR === 'W'
      ) {
        this.cropperPosition = { x1: 0, y1: 0, x2: 1290, y2: 300 };
      }
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) {
  }
  loadImageFailed() {
  }
  save(addNew: boolean, form: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.TITLE_COLOR = this.titlecolor;
    this.data.SUB_TITLE_COLOR = this.subtitlecolor;
    this.data.SUB_TITLE_COLOR_1 = this.subtitlecolor1;
    if (this.data.BANNER_TYPE === 'M') {
      if (
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == 0
      ) {
        this.isOk = false;
        this.message.error('Please Enter Sequence No.', '');
      } else if (
        this.data.CUSTOMER_TYPE == undefined ||
        this.data.CUSTOMER_TYPE == null ||
        this.data.CUSTOMER_TYPE == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Customer Type', '');
      } else if (
        this.data.IMAGE_URL === null ||
        this.data.IMAGE_URL === undefined ||
        this.data.IMAGE_URL === '' ||
        this.data.IMAGE_URL === ' '
      ) {
        this.isOk = false;
        this.message.error('Please Upload Banner Image', '');
      }
    }
    if (this.data.BANNER_TYPE === 'O') {
      if (
        this.data.TITLE === null ||
        this.data.TITLE === undefined ||
        this.data.TITLE.trim() === ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Title', '');
      } else if (
        this.data.SUB_TITLE === null ||
        this.data.SUB_TITLE === undefined ||
        this.data.SUB_TITLE.trim() === ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Description', '');
      } else if (
        this.data.TITLE_COLOR === null ||
        this.data.TITLE_COLOR === undefined ||
        this.data.TITLE_COLOR === ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Title Color', '');
      } else if (
        this.data.SUB_TITLE_COLOR === null ||
        this.data.SUB_TITLE_COLOR === undefined ||
        this.data.SUB_TITLE_COLOR === ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Description Color', '');
      } else if (
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == 0
      ) {
        this.isOk = false;
        this.message.error('Please Enter Sequence No.', '');
      } else if (
        this.data.CUSTOMER_TYPE == undefined ||
        this.data.CUSTOMER_TYPE == null ||
        this.data.CUSTOMER_TYPE == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Customer Type', '');
      } else if (
        this.data.IMAGE_URL === null ||
        this.data.IMAGE_URL === undefined ||
        this.data.IMAGE_URL === ''
      ) {
        this.isOk = false;
        this.message.error('Please Upload Banner Image', '');
      }
    }
    if (this.isOk) {
      if (this.data.TITLE === '') {
        this.data.TITLE = null;
      }
      if (this.data.SUB_TITLE === '') {
        this.data.SUB_TITLE = null;
      }
      this.isSpinning = true;
      if (this.fileURL) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.UrlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.api
          .onUpload('BannerImages', this.fileURL, this.UrlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response && res.status === 200) {
              this.data.IMAGE_URL = this.UrlImageOne;
              this.handleSaveOperation(addNew, form);
            } else if (res.type === HttpEventType.Response) {
              this.message.error('Failed to Upload Icon.', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.handleSaveOperation(addNew, form);
      }
    }
  }
  handleSaveOperation(addNew: boolean, form: NgForm): void {
    if (this.data.BANNER_TYPE === 'O') {
      this.data.IS_FOR_SHOP = false;
    }
    if (this.data.BANNER_TYPE == 'O') {
      this.data.CUSTOMER_TYPE = 'BO';
    }
    if (this.data.ID) {
      this.api.updateBannerMaster(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Updated Successfully...', '');
          if (!addNew) this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Information Not Updated...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.api.createBannerMaster(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Updated Successfully...', '');
          if (!addNew) this.drawerClose();
          else {
            this.data = new bannermodal();
            this.resetDrawer(form);
            this.isSpinning = false;
            this.data.TITLE_COLOR = '';
            this.data.SUB_TITLE_COLOR = '';
            this.data.STATUS == true;
            this.fileURL = '';
            this.api.getAllBannerMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
              (data) => {
                if (data['count'] == 0) {
                  this.data.SEQ_NO = 1;
                } else {
                  this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                }
                this.isSpinning = false;
              },
              (err) => { }
            );
          }
          this.isSpinning = false;
        } else {
          this.message.error('Information not saved', '');
          this.isSpinning = false;
        }
      });
    }
  }
  event1: any;
  image: any;
  onFileSelected1(event: any) {
    this.event1 = event;
    const reader = new FileReader();
    let isLtsize = false;
    let imgs = new Image();
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    imgs.onload = () => {
      if (this.height == imgs.height && imgs.width == this.width) {
        isLtsize = true;
      }
      if (!isLtsize) {
        this.message.error(
          'The image will not fit between the dimensions of ' +
          this.height +
          ' ' +
          'px Height  ' +
          ' And ' +
          ' ' +
          this.width +
          ' px Width ',
          ''
        );
      } else {
        if (
          event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png'
        ) {
          this.fileURL = <File>event.target.files[0];
          const reader = new FileReader();
          if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.image = reader.result as string;
            };
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = '';
            url = d == null ? '' : d + number + '.' + fileExt;
            this.event1 = url;
          }
        } else {
          this.message.error(
            'Please select only JPEG/ JPG/ PNG file type.',
            ''
          );
          this.fileURL = null;
          this.data.IMAGE_URL = '';
        }
      }
    };
  }
  fileDataTHUMBNAIL_URL: any;
  thumbUrl: any;
  folderName: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fonts', 'uploadUrl'], ['video']],
  };
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  deleteCancel() { }
  removeImage() {
    this.data.IMAGE_URL = ' ';
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  imageDeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.IMAGE_URL = ' ';
    this.fileURL = null;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  allowedWidth; 
  allowedHeight;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; 
    if (this.data.BANNER_TYPE === 'M' && this.data.BANNER_FOR === 'W') {
      this.allowedWidth = 1290;
      this.allowedHeight = 300;
    }
    if (this.data.BANNER_TYPE === 'M' && this.data.BANNER_FOR === 'M') {
      this.allowedWidth = 645;
      this.allowedHeight = 299;
    }
    if (this.data.BANNER_TYPE === 'O') {
      this.allowedWidth = 364;
      this.allowedHeight = 400;
    }
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        this.selectedFile = input.files[0];
        if (this.selectedFile.size > maxFileSize) {
          this.message.error('Banner Image size should not exceed 1MB.', '');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            if (
              image.width !== this.allowedWidth ||
              image.height !== this.allowedHeight
            ) {
              this.message.error(
                `Image dimensions should be exactly ${this.allowedWidth} x ${this.allowedHeight} px.`,
                ''
              );
              this.fileURL = null;
              this.sanitizedFileURL = null;
              this.selectedFile = null;
              return;
            }
            this.imagePreview = e.target.result;
            this.fileURL = this.selectedFile;
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = d == null ? '' : d + number + '.' + fileExt;
            if (
              this.data.IMAGE_URL != undefined &&
              this.data.IMAGE_URL.trim() !== ''
            ) {
              var arr = this.data.IMAGE_URL.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }
            const uploadedfileExt = this.uploadedImage.split('.').pop();
            if (this.data.ID && this.data.IMAGE_URL) {
              this.UrlImageOne = this.uploadedImage.split('?')[0];
            } else {
              this.UrlImageOne = url;
            }
            this.timer = this.api
              .onUpload('BannerImages', this.fileURL, this.UrlImageOne)
              .subscribe((res) => {
                this.data.IMAGE_URL = this.UrlImageOne;
                this.uploadedImage = this.data.IMAGE_URL;
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percentImageOne = percentDone;
                  if (this.percentImageOne === 100) {
                    this.isSpinning = false;
                    setTimeout(() => {
                      this.progressBarImageOne = false;
                    }, 2000);
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed To Upload Banner Image...', '');
                  this.isSpinning = false;
                  this.progressBarImageOne = false;
                  this.percentImageOne = 0;
                  this.data.IMAGE_URL = null;
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] === 200) {
                    this.message.success(
                      'Banner Image Uploaded Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.data.IMAGE_URL = this.UrlImageOne;
                  } else {
                    this.isSpinning = false;
                    this.progressBarImageOne = false;
                    this.percentImageOne = 0;
                    this.data.IMAGE_URL = null;
                  }
                }
              });
          };
        };
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.IMAGE_URL = null;
    }
  }
  imagePreviewURL;
  removeImage1(): void {
    this.data.IMAGE_URL = null;
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Profile Photo removed successfully.', '');
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
}