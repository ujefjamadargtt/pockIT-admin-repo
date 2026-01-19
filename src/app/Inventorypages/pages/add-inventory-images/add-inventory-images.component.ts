import { DatePipe } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-add-inventory-images',
  templateUrl: './add-inventory-images.component.html',
  styleUrls: ['./add-inventory-images.component.css'],
})
export class AddInventoryImagesComponent implements OnInit {
  @Input() data: any;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  fileURL: any;
  fileURLs: any[] = [];
  retriveimgUrl = appkeys.retriveimgUrl + 'InventoryImages/';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void { }
  close(): void {
    this.drawerClose();
  }
  CropImageModalVisible = false;
  cropimageshow: any;
  imageChangedEvent: any = '';
  fullImageUrl: string;
  imagePreview: any;
  fileChangeEvent(event: any): void {
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  @ViewChild('image1') myElementRef!: ElementRef;
  isSpinningCrop = false;
  croppedImage: any = '';
  cropperPosition = { x1: 0, y1: 0, x2: 325, y2: 243 };
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageCropped2(event: any) {
    this.enhanceImageQuality(event.base64, 325, 243);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;
    cropWidth = 325;
    cropHeight = 243;
    this.enhanceImageQuality(event.base64, cropWidth, cropHeight);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }
  async enhanceImageQuality(
    base64: string,
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas context not available');
          canvas.width = finalWidth * 2;
          canvas.height = finalHeight * 2;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const downscaleCanvas = (
            sourceCanvas: HTMLCanvasElement,
            width: number,
            height: number
          ) => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            if (!newCtx) return sourceCanvas;
            newCanvas.width = width;
            newCanvas.height = height;
            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };
          let currentCanvas = canvas;
          const downscaleSteps = [
            [Math.floor(finalWidth * 1.5), Math.floor(finalHeight * 1.5)], 
            [finalWidth, finalHeight], 
          ];
          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }
          resolve(currentCanvas.toDataURL('image/png', 1)); 
        };
        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
      console.error('Image enhancement failed:', error);
    }
  }
  uploadingImagePreviews: any[] = [];
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 325, y2: 243 };
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) {
  }
  loadImageFailed() {
  }
  event1: any;
  image: any;
  selectedFile: any;
  selectedFiles: any[] = [];
  sanitizedFileURL: SafeUrl | null = null;
  onFileSelected(event: any): void {
    this.isSpinning = true; 
    const maxFileSize = 1 * 1024 * 1024; 
    const canvasWidth = 325;
    const canvasHeight = 243;
    const file = event.target.files?.[0];
    if (!file) {
      this.isSpinning = false;
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.message.error(
        'Please select a valid image file (PNG, JPG, JPEG).',
        ''
      );
      event.target.value = null; 
      this.fileURL = null;
      this.sanitizedFileURL = null;
      this.isSpinning = false;
      return;
    }
    if (file.size > maxFileSize) {
      this.message.error('File size should not exceed 1MB.', '');
      this.fileURL = null;
      this.isSpinning = false;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.message.error('Canvas not supported.', '');
          this.isSpinning = false;
          return;
        }
        const ratio = Math.min(
          canvasWidth / imgWidth,
          canvasHeight / imgHeight
        );
        const drawWidth = imgWidth * ratio;
        const drawHeight = imgHeight * ratio;
        const xOffset = (canvasWidth - drawWidth) / 2;
        const yOffset = (canvasHeight - drawHeight) / 2;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
        const base64 = canvas.toDataURL('image/png');
        this.imagePreview = base64;
        this.uploadingImagePreviews.push(base64);
        this.cdr.detectChanges();
        canvas.toBlob((blob) => {
          if (!blob) {
            this.message.error('Image processing failed.', '');
            this.isSpinning = false;
            this.cdr.detectChanges(); 
            return;
          }
          const resizedFile = new File([blob], file.name, {
            type: 'image/png',
          });
          this.fileURL = resizedFile;
          this.fileURLs.push(resizedFile);
          this.selectedFile = resizedFile;
          this.selectedFiles.push(resizedFile);
          this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resizedFile)
          );
          this.isSpinning = false;
          this.cdr.detectChanges(); 
        }, 'image/png');
      };
    };
    reader.readAsDataURL(file);
    (event.target as HTMLInputElement).value = '';
    this.CropImageModalVisible = false;
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
  save(): void {
    let isOk = true;
    let imageData: any[] = [];
    let count =
      Number(this.fileURLs.length) + Number(this.existingImages.length);
    if (count > 10) {
      isOk = false;
      this.message.warning('', 'Allowed Only 10 Images');
    }
    if (isOk) {
      this.isSpinning = true;
      if (this.fileURLs && this.fileURLs.length > 0) {
        this.fileURLs.forEach((item: any) => {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = item.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let UrlImageOne = `${d ?? ''}${number}.${fileExt}`;
          this.api
            .onUpload('InventoryImages', item, UrlImageOne)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response && res.status === 200) {
              } else if (res.type === HttpEventType.Response) {
                this.message.error('Failed to Upload Icon.', '');
              }
            });
          let imageDataObj = new Object();
          imageDataObj['IMAGE_URL'] = UrlImageOne;
          imageData.push(imageDataObj);
        });
      }
      if (this.existingImages && this.existingImages.length > 0) {
        this.existingImages.forEach((item: any) => {
          let existingImage =
            item['NAME'].split('/')[item['NAME'].split('/').length - 1];
          let imageDataObj = new Object();
          imageDataObj['IMAGE_URL'] = existingImage;
          imageData.push(imageDataObj);
        });
      }
      this.api.onInventorymasterImageUpload(imageData, this.data.ID).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.isSpinning = false;
            this.message.success('', 'Image(s) Uploaded Successfully');
            this.close();
          } else {
            this.isSpinning = false;
            this.message.error('Failed to Upload', '');
          }
        },
        (err) => {
          this.isSpinning = false;
          this.message.error('Server Not Found', '');
        }
      );
    }
  }
  existingImages: any[] = [];
  getPreviousImages(inventoryMasterID: number): void {
    this.isSpinning = true;
    this.api
      .getInventoryImageMapping(
        0,
        0,
        '',
        '',
        ' AND INVENTORY_ID = ' + inventoryMasterID
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.isSpinning = false;
            let data = response.body.data;
            this.existingImages = data.map((item: any) => {
              return {
                ID: item.ID,
                NAME: this.retriveimgUrl + item.IMAGE_URL,
              };
            });
          } else {
            this.isSpinning = false;
            this.message.error('Something Went Wrong.', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }
  imageDeleteConfirm(imageData: any): void {
    this.isSpinning = true;
    let existingImage =
      imageData['NAME'].split('/')[imageData['NAME'].split('/').length - 1];
    this.api
      .onInventorymasterImageDelete(existingImage, this.data.ID, imageData.ID)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.isSpinning = false;
            this.message.success('', 'Image Deleted Successfully');
            this.getPreviousImages(this.data.ID);
          } else {
            this.isSpinning = false;
            this.message.error('Failed to Delete', '');
          }
        },
        (err) => {
          this.isSpinning = false;
          this.message.error('Server Not Found', '');
        }
      );
  }
  deleteCancel(): void { }
  newUploadedImageDeleteConfirm(image: any, index: number): void {
    this.uploadingImagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.fileURLs.splice(index, 1);
  }
}