import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { category } from 'src/app/Pages/Models/category';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { appkeys } from 'src/app/app.constant';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  @Input() drawerClose: Function;
  @Input() data: category;
  @Input() drawerVisible: boolean;
  Parentcategories: any = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isFocused: string = '';
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;

  imgUrl;

  public commonFunction = new CommonFunctionService();
  CropImageModalVisible = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop = false;
  cropimageshow: any;
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }

  @Input()
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; // Updated pattern
    const char = String.fromCharCode(event.keyCode || event.which);

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  uploadedImage: any = '';

  ngOnchanges(changes: SimpleChanges) {
    // console.log(changes, this.fullImageUrl);
  }
  ngOnInit() {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.ICON != null &&
      this.data.ICON != undefined &&
      this.data.ICON != ' '
    ) {
      this.fullImageUrl = this.retriveimgUrl + 'Category/' + this.data.ICON;
      this.uploadedImage = this.data.ICON;

      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
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
    this.data = new category();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
    this.fileURL = '';
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
    // this.data.ICON = "";

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'Category/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;

  imagePreview: any;
  selectedFile: any;
  // onFileSelected(event: any): void {
  //   const maxFileSize = 1 * 1024 * 1024; // 1 MB
  //   const allowedWidth = 200;
  //   const allowedHeight = 200;

  //   if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
  //     // this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');
  //     this.fileURL = <File>event.target.files[0];

  //     if (this.fileURL.size > maxFileSize) {
  //       this.message.error('File size should not exceed 1MB.', '');
  //       this.fileURL = null;
  //       // event.target.value = null;
  //       return;
  //     }

  //     // Validate image dimensions
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.src = this.croppedImage;
  //       const input = event.target as HTMLInputElement;

  //       if (input?.files?.length) {
  //         this.selectedFile = input.files[0];

  //         // Generate a preview of the selected image
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           this.imagePreview = this.croppedImage; // Base64 image data
  //           //
  //         };
  //         reader.readAsDataURL(this.selectedFile);
  //       }
  //       img.onload = () => {
  //         if (img.width !== allowedWidth || img.height !== allowedHeight) {
  //           this.message.error(
  //             `Image dimensions should be exactly ${allowedWidth} x ${allowedHeight} px.`,
  //             ''
  //           );
  //           this.fileURL = null;
  //           this.sanitizedFileURL = null;
  //         } else {
  //           // Sanitize the file URL for preview
  //           //
  //           // this.fileURL = this.base64ToFile(
  //           //   this.croppedImage,
  //           //   'cropped-image.png'
  //           // );
  //           this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
  //             URL.createObjectURL(this.fileURL)
  //           );
  //           this.data.ICON = this.fileURL.name;
  //           // if (
  //           //   this.data.ICON != null &&
  //           //   this.data.ICON != undefined &&
  //           //   this.data.ICON != ' ' &&
  //           //   this.data.ICON != ''
  //           // ) {
  //           //   this.fullImageUrl =
  //           //     this.retriveimgUrl + 'Category/' + this.data.ICON;
  //           //   // window.open(fullImageUrl, '_blank');
  //           //
  //           // } else {
  //           //   // this.message.info('Document Not Uploaded.', '');
  //           // }
  //         }
  //       };
  //     };

  //     reader.readAsDataURL(this.fileURL);
  //     this.CropImageModalVisible = false;
  //     // event.target.value = null;
  //   } else {
  //     this.message.error(
  //       'Please select a valid image file (PNG, JPG, JPEG).',
  //       ''
  //     );
  //     this.fileURL = null;
  //     this.sanitizedFileURL = null;
  //     event.target.value = null;
  //   }
  // }
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024;
    const canvasSize = 200;
    const minScaleTarget = 100;

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
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;

        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.message.error('Canvas not supported.', '');
          return;
        }

        // Optional: white background
        // ctx.fillStyle = '#FFFFFF';
        // ctx.fillRect(0, 0, canvasSize, canvasSize);

        let drawWidth = imgWidth;
        let drawHeight = imgHeight;

        let ratio = 1;

        // Case 1: Small image (<100x100), scale up only to 100px max (soft upscale)
        if (imgWidth < 100 && imgHeight < 100) {
          ratio = Math.min(100 / imgWidth, 100 / imgHeight);
        }

        // Case 2: Image too large — scale it down to fit
        if (imgWidth * ratio > canvasSize || imgHeight * ratio > canvasSize) {
          ratio = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
        }

        drawWidth = imgWidth * ratio;
        drawHeight = imgHeight * ratio;

        const xOffset = (canvasSize - drawWidth) / 2;
        const yOffset = (canvasSize - drawHeight) / 2;

        ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

        // Create blob and upload
        canvas.toBlob((blob) => {
          if (!blob) return;

          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = 'png';
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url = (d ? d : '') + number + '.' + fileExt;

          if (this.data.ICON?.trim()) {
            const arr = this.data.ICON.split('/');
            if (arr.length > 1) url = arr[5];
          }

          const resizedFile = new File([blob], url, { type: 'image/png' });

          this.selectedFile = resizedFile;
          this.fileURL = resizedFile;
          this.imagePreview = canvas.toDataURL('image/png');

          // this.UrlImageOne =
          //   this.data.ID && this.data.ICON
          //     ? this.uploadedImage.split('?')[0]
          //     : url;

          this.UrlImageOne =
            this.data.ID && this.data.ICON
              ? url
              : url;

          this.timer = this.api
            .onUpload('Category', this.fileURL, this.UrlImageOne)
            .subscribe((res) => {
              if (res.type === HttpEventType.UploadProgress) {
                this.percentImageOne = Math.round(
                  (100 * res.loaded) / res.total
                );
                if (this.percentImageOne === 100) {
                  this.isSpinning = false;
                  setTimeout(() => (this.progressBarImageOne = false), 2000);
                }
              } else if (res.type === 2 && res.status !== 200) {
                this.message.error('Failed To Upload Category Image...', '');
                this.resetImageUpload();
              } else if (res.type === 4 && res.status === 200) {
                if (res.body?.code === 200) {
                  this.message.success(
                    'Category Image Uploaded Successfully...',
                    ''
                  );
                  this.data.ICON = this.UrlImageOne;
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
    //

    this.CropImageModalVisible = true;
    this.cropimageshow = true;

    this.imageChangedEvent = event;
  }

  cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
  imageCropped2(event: ImageCroppedEvent) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const img: any = new Image();
    img.src = event.base64;
    img.onload = () => {
      ctx.fillStyle = '#ffffff'; // Change this color if needed
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 200, 200);

      // Convert to JPEG with reduced quality
      this.compressImage(canvas, 1); // Start with 70% quality
    };
  }
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;

    cropWidth = 200;
    cropHeight = 200;

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
          await img.decode(); // Ensures image is fully loaded before processing.

          // Create a high-resolution canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return reject('Canvas context not available');

          // Set canvas to final size initially
          canvas.width = finalWidth * 2;
          canvas.height = finalHeight * 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image at high resolution first
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Stepwise Downscaling to Avoid Blur
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

          // Reduce stepwise to avoid quality loss
          let currentCanvas = canvas;
          const downscaleSteps = [
            [Math.floor(finalWidth * 1.5), Math.floor(finalHeight * 1.5)], // Reduce gradually
            [finalWidth, finalHeight], // Final resolution
          ];

          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }

          // Convert to WebP or PNG at High Quality
          resolve(currentCanvas.toDataURL('image/png', 2)); // WebP preserves more details
        };

        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
      console.error('Image enhancement failed:', error);
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
    //
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
    }, 50);
    this.imagePreview = this.croppedImage;
    // this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
    // Image loaded successfully
  }

  cropperReady(event) { }

  loadImageFailed() {
    // Image failed to load
  }
  imagePreviewURL;
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;

    this.data.NAME = this.data.NAME?.trim() || '';
    this.data.DESCRIPTION = this.data.DESCRIPTION?.trim() || '';

    // Validate required fields
    if (
      (this.data.NAME.trim() === '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.ICON == undefined ||
        this.data.ICON == null ||
        this.data.ICON == '' ||
        this.data.ICON == ' ')
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details.', '');
      return;
    } else if (
      this.data.NAME.trim() === '' ||
      this.data.NAME == null ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Category Name', '');
      return;
    } else if (
      this.data.ICON == undefined ||
      this.data.ICON == null ||
      this.data.ICON == '' ||
      this.data.ICON == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Upload Category Icon', '');
      return;
    } else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
      return;
    }
    this.isSpinning = true;

    // Handle image upload first
    // if (this.fileURL) {
    //   const number = Math.floor(100000 + Math.random() * 900000);
    //   const fileExt = this.fileURL.name.split('.').pop();
    //   const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    //   var url = `${d ?? ''}${number}.${fileExt}`;

    //   const uploadedfileExt = this.uploadedImage.split('.').pop();

    //   if (this.data.ID) {
    //     if (uploadedfileExt == fileExt) {
    //       //
    //       this.UrlImageOne = this.uploadedImage;
    //     } else {
    //       this.UrlImageOne = url;
    //     }
    //   } else {
    //     this.UrlImageOne = url;
    //   }

    //   this.api
    //     .onUpload('Category', this.fileURL, this.UrlImageOne)
    //     .subscribe((res) => {
    //       if (res.type === HttpEventType.Response && res.status === 200) {
    //         this.data.ICON = this.UrlImageOne;
    //         this.uploadedImage = this.data.ICON;

    //         // this.message.success('Icon Uploaded Successfully...', '');
    //         this.handleSaveOperation(addNew, accountMasterPage);
    //       } else if (res.type === HttpEventType.Response) {
    //         this.message.error('Failed to Upload Icon.', '');
    //         this.isSpinning = false;
    //       }
    //     });
    // } else {
    //   // If no image file, proceed directly to save
    this.handleSaveOperation(addNew, accountMasterPage);
    // }
  }

  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.data.DESCRIPTION == '') {
      this.data.DESCRIPTION = null;
    }
    if (this.data.ID) {
      // Update category
      this.api.updateCategory(this.data).subscribe(
        (successCode) => {
          this.isSpinning = false;
          if (successCode['code'] === 200) {
            this.message.success('Category updated successfully.', '');
            if (!addNew) this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.message.error('Category update failed.', '');
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
      // Create category
      this.api.createCategory(this.data).subscribe(
        (successCode) => {
          this.isSpinning = false;
          if (successCode['code'] === 200) {
            this.message.success('Category created successfully.', '');
            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);
            } else {
              this.data = new category();
              this.resetDrawer(accountMasterPage);
              this.api.getCategoryData(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
          } else {
            this.message.error('Failed to create category.', '');
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

  removeImage1(): void {
    this.data.ICON = null;
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Icon removed successfully.', '');
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No Icon selected to view.');
    }
  }
  deleteImage(): void {
    // Remove selected file and its preview
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }
}
