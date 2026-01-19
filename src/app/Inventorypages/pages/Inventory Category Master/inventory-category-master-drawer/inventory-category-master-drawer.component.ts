import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { InventoryCategoryData } from 'src/app/Inventorypages/inventorymodal/InventoryCategoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-inventory-category-master-drawer',
  templateUrl: './inventory-category-master-drawer.component.html',
  styleUrls: ['./inventory-category-master-drawer.component.css'],
})
export class InventoryCategoryMasterDrawerComponent {
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  uploadedImage: any = '';
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  ngOnInit(): void {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.ICON != null &&
      this.data.ICON != undefined &&
      this.data.ICON != ' '
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'InventoryCategoryIcons/' + this.data.ICON;
      this.uploadedImage = this.data.ICON;
    } else {
    }
  }
  public commonFunction = new CommonFunctionService();
  @Input() data: any = InventoryCategoryData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }
  resetDrawer(inventorycategorymaster: NgForm) {
    this.data = new InventoryCategoryData();
    inventorycategorymaster.form.markAsPristine();
    inventorycategorymaster.form.markAsUntouched();
    this.fileURL = '';
  }
  save(addNew: boolean, inventorycategorymaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.CATEGORY_NAME == '' ||
        this.data.CATEGORY_NAME == null ||
        this.data.CATEGORY_NAME == undefined) &&
      (this.data.ICON == '' ||
        this.data.ICON == null ||
        this.data.ICON == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.CATEGORY_NAME == null ||
      this.data.CATEGORY_NAME == undefined ||
      this.data.CATEGORY_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Category Name.', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number.', '');
    } else if (
      this.data.ICON == undefined ||
      this.data.ICON == null ||
      this.data.ICON == '' ||
      this.data.ICON == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Upload Category Icon', '');
      return;
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.DESCRIPTION == '') {
        this.data.DESCRIPTION = null;
      }
      {
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
          this.handleSaveOperation(addNew, inventorycategorymaster);
        } else {
          this.handleSaveOperation(addNew, inventorycategorymaster);
        }
      }
    }
  }
  handleSaveOperation(addNew: boolean, inventorycategorymaster: NgForm): void {
    if (this.data.ID) {
      this.api.updateInventoryCategoryData(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code == 200) {
            this.message.success('Inventory category Updated Successfully', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Inventory Category Updation Failed', '');
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
      this.api.createInventoryCategoryData(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code === 200) {
            this.message.success('Inventory Category Created Successfully', '');
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new InventoryCategoryData();
              this.resetDrawer(inventorycategorymaster);
              this.api.getInventoryCategory(0, 0, '', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.data.SEQ_NO = 1;
                    } else {
                      this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  } else {
                    this.message.error('Server Not Found.', '');
                  }
                },
                () => { }
              );
            }
          } else {
            this.message.error('Inventory Category Creation Failed', '');
          }
          this.isSpinning = false;
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
  close() {
    this.drawerClose();
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
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  deleteCancel() { }
  removeImage() {
    this.data.ICON = ' ';
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.ICON = ' ';
    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'InventoryCategoryIcons/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; 
    const canvasSize = 128;
    const softUpscaleLimit = 90;
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.resetImageUpload();
      return;
    }
    if (file.size > maxFileSize) {
      this.message.error('Category Image size should not exceed 1MB.', '');
      this.resetImageUpload();
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const imgWidth = image.width;
        const imgHeight = image.height;
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.message.error('Canvas not supported.', '');
          return;
        }
        let ratio = 1;
        if (imgWidth < 60 && imgHeight < 60) {
          ratio = Math.min(
            softUpscaleLimit / imgWidth,
            softUpscaleLimit / imgHeight
          );
        }
        if (imgWidth * ratio > canvasSize || imgHeight * ratio > canvasSize) {
          ratio = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
        }
        const drawWidth = imgWidth * ratio;
        const drawHeight = imgHeight * ratio;
        const xOffset = (canvasSize - drawWidth) / 2;
        const yOffset = (canvasSize - drawHeight) / 2;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(image, xOffset, yOffset, drawWidth, drawHeight);
        canvas.toBlob((blob) => {
          if (!blob) {
            this.message.error('Image processing failed.', '');
            return;
          }
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = 'png';
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url = (d ? d : '') + number + '.' + fileExt;
          if (this.data.ICON?.trim()) {
            const arr = this.data.ICON.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          const resizedFile = new File([blob], url, { type: 'image/png' });
          this.selectedFile = resizedFile;
          this.fileURL = resizedFile;
          this.imagePreview = canvas.toDataURL('image/png');
          const uploadedExt = this.uploadedImage?.split('.').pop();
          this.UrlImageOne =
            this.data.ID && this.data.ICON && uploadedExt === fileExt
              ? this.uploadedImage.split('?')[0]
              : url;
          this.timer = this.api
            .onUpload('InventoryCategoryIcons', this.fileURL, this.UrlImageOne)
            .subscribe((res) => {
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImageOne = percentDone;
                if (this.percentImageOne === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarImageOne = false;
                  }, 2000);
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Category Image...', '');
                this.resetImageUpload();
              } else if (res.type == 4 && res.status == 200) {
                if (res.body?.code === 200) {
                  this.message.success(
                    'Category Image Uploaded Successfully...',
                    ''
                  );
                  this.data.ICON = this.UrlImageOne;
                  this.uploadedImage = this.data.ICON;
                } else {
                  this.resetImageUpload();
                }
              }
            });
        }, 'image/png');
      };
    };
    reader.readAsDataURL(file);
  }
  resetImageUpload() {
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.ICON = null;
    this.fileURL = null;
    this.imagePreview = null;
    this.selectedFile = null;
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
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageCropped(event: any) {
    this.enhanceImageQuality(event.base64, 128, 128);
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
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) { }
  loadImageFailed() { }
}