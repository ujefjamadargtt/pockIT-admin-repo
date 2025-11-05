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

      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
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
              //
              this.UrlImageOne = this.uploadedImage;
            } else {
              this.UrlImageOne = url;
            }
          } else {
            this.UrlImageOne = url;
          }

          // this.api
          //   .onUpload('InventoryCategoryIcons', this.fileURL, this.UrlImageOne)
          //   .subscribe((res) => {
          //     if (res.type === HttpEventType.Response && res.status === 200) {
          //       this.data.ICON = this.UrlImageOne;
          //       this.uploadedImage = this.data.ICON;

          //       // this.message.success('Icon Uploaded Successfully...', '');
          //     } else if (res.type === HttpEventType.Response) {
          //       this.message.error('Failed to Upload Icon.', '');
          //       this.isSpinning = false;
          //     }
          //   });
          this.handleSaveOperation(addNew, inventorycategorymaster);

        } else {
          // If no image file, proceed directly to save
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
  // icon
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
    // this.data.ICON = "";

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

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;

  imagePreview: any;
  selectedFile: any;
  // onFileSelected(event: any): void {
  //   const maxFileSize = 1 * 1024 * 1024; // 1 MB
  //   const allowedWidth = 128;
  //   const allowedHeight = 128;

  //   if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
  //     this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');

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
  //           this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
  //             URL.createObjectURL(this.fileURL)
  //           );
  //           this.data.ICON = this.fileURL.name;
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
  // onFileSelected(event: any) {
  //   const maxFileSize = 1 * 1024 * 1024; // 5MB
  //   const allowedWidth = 128;
  //   const allowedHeight = 128;
  //   if (
  //     event.target.files[0]?.type === 'image/jpeg' ||
  //     event.target.files[0]?.type === 'image/jpg' ||
  //     event.target.files[0]?.type === 'image/png'
  //   ) {
  //     const input = event.target as HTMLInputElement;

  //     if (input?.files?.length) {
  //       this.selectedFile = input.files[0];

  //       // Validate file size
  //       if (this.selectedFile.size > maxFileSize) {
  //         this.message.error('Category Image size should not exceed 1MB.', '');
  //         return;
  //       }

  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         const image = new Image();
  //         image.src = e.target.result;

  //         image.onload = () => {
  //           if (
  //             image.width !== allowedWidth ||
  //             image.height !== allowedHeight
  //           ) {
  //             this.message.error(
  //               `Image dimensions should be exactly ${allowedWidth} x ${allowedHeight} px.`,
  //               ''
  //             );
  //             this.fileURL = null;
  //             this.sanitizedFileURL = null;
  //             this.selectedFile = null;
  //             return;
  //           }

  //           // If dimensions are valid, continue upload logic
  //           this.imagePreview = e.target.result;
  //           this.fileURL = this.selectedFile;

  //           var number = Math.floor(100000 + Math.random() * 900000);
  //           var fileExt = this.fileURL.name.split('.').pop();
  //           var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
  //           var url = d == null ? '' : d + number + '.' + fileExt;

  //           if (this.data.ICON != undefined && this.data.ICON.trim() !== '') {
  //             var arr = this.data.ICON.split('/');
  //             if (arr.length > 1) {
  //               url = arr[5];
  //             }
  //           }

  //           const uploadedfileExt = this.uploadedImage.split('.').pop();

  //           if (this.data.ID && this.data.ICON) {
  //             this.UrlImageOne = this.uploadedImage.split('?')[0];
  //           } else {
  //             this.UrlImageOne = url;
  //           }

  //           this.timer = this.api
  //             .onUpload(
  //               'InventoryCategoryIcons',
  //               this.fileURL,
  //               this.UrlImageOne
  //             )
  //             .subscribe((res) => {
  //               this.data.ICON = this.UrlImageOne;
  //               this.uploadedImage = this.data.ICON;
  //               if (res.type === HttpEventType.UploadProgress) {
  //                 const percentDone = Math.round(
  //                   (100 * res.loaded) / res.total
  //                 );
  //                 this.percentImageOne = percentDone;
  //                 if (this.percentImageOne === 100) {
  //                   this.isSpinning = false;
  //                   setTimeout(() => {
  //                     this.progressBarImageOne = false;
  //                   }, 2000);
  //                 }
  //               } else if (res.type == 2 && res.status != 200) {
  //                 this.message.error('Failed To Upload Category Image...', '');
  //                 this.isSpinning = false;
  //                 this.progressBarImageOne = false;
  //                 this.percentImageOne = 0;
  //                 this.data.ICON = null;
  //               } else if (res.type == 4 && res.status == 200) {
  //                 if (res.body['code'] === 200) {
  //                   this.message.success(
  //                     'Category Image Uploaded Successfully...',
  //                     ''
  //                   );
  //                   this.isSpinning = false;
  //                   this.data.ICON = this.UrlImageOne;
  //                 } else {
  //                   this.isSpinning = false;
  //                   this.progressBarImageOne = false;
  //                   this.percentImageOne = 0;
  //                   this.data.ICON = null;
  //                 }
  //               }
  //             });
  //         };
  //       };
  //       reader.readAsDataURL(this.selectedFile);
  //     }
  //   } else {
  //     this.message.error(
  //       'Please select a valid Image file (PNG, JPG, JPEG).',
  //       ''
  //     );
  //     this.fileURL = null;
  //     this.isSpinning = false;
  //     this.progressBarImageOne = false;
  //     this.percentImageOne = 0;
  //     this.data.ICON = null;
  //   }
  // }

  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB
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

        // Case 1: If image is very small (< 60x60), scale up softly (max 90x90)
        if (imgWidth < 60 && imgHeight < 60) {
          ratio = Math.min(
            softUpscaleLimit / imgWidth,
            softUpscaleLimit / imgHeight
          );
        }

        // Case 2: If scaled image is still too large for canvas, scale down
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
    //

    this.CropImageModalVisible = true;
    this.cropimageshow = true;

    this.imageChangedEvent = event;
  }

  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  // imageCropped(event: ImageCroppedEvent) {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) return;

  //   canvas.width = 128;
  //   canvas.height = 128;

  //   const img: any = new Image();
  //   img.src = event.base64;
  //   img.onload = () => {
  //     ctx.drawImage(img, 0, 0, 128, 128);

  //     // Convert to JPEG with reduced quality
  //     this.compressImage(canvas, 0.7); // Start with 70% quality
  //   };
  // }
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
  // compressImage(canvas: HTMLCanvasElement, quality: number) {
  //   canvas.toBlob(
  //     (blob) => {
  //       if (!blob) return;

  //       const sizeInMB = blob.size / (1024 * 1024); // Convert to MB

  //       if (sizeInMB > 1 && quality > 0.1) {
  //         // If size is still >1MB, reduce quality and try again
  //         this.compressImage(canvas, quality - 0.1);
  //       } else {
  //         // Final compressed image (size is now below 1MB)
  //         const reader = new FileReader();
  //         reader.readAsDataURL(blob);
  //         reader.onloadend = () => {
  //           this.croppedImage = reader.result as string;
  //           //
  //         };
  //       }
  //     },
  //     'image/jpeg',
  //     quality
  //   ); // Convert to JPEG with given quality
  // }

  // imageWidth: number = 0;
  // imageHeight: number = 0;
  imageLoaded(event) {
    //
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
  }
  cropperReady(event) { }

  loadImageFailed() { }
}