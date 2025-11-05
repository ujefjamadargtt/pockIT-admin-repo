import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { appkeys } from 'src/app/app.constant';
import { brandMaster } from 'src/app/Pages/Models/BrandMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-brand-master-form',
  templateUrl: './brand-master-form.component.html',
  styleUrls: ['./brand-master-form.component.css'],
})
export class BrandMasterFormComponent {
  @Input() drawerClose: Function;
  @Input() data: brandMaster;
  @Input() drawerVisible: boolean;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;

  isCountrySpinning = false;
  isStateSpinning = false;
  isDistrictSpinning = false;
  isCitySpinning = false;
  isPincodeSpinning = false;
  isFocused: string = '';

  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  addpat = /[ .a-zA-Z0-9 ]+/;
  PTECpattern = /^99\d{9}P$/;
  imgUrl;
  time;
  time1;
  time2;
  department: brandMaster[] = [];
  org = [];

  orgId = sessionStorage.getItem('orgId');
  decreptedOrgIdString = this.orgId
    ? this.commonFunction.decryptdata(this.orgId)
    : '';
  decreptedOrgId = parseInt(this.decreptedOrgIdString, 10);

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  date;

  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  uploadedImage: any = '';
  ngOnInit() {
    // if (this.data.ID) {
    //   this.getCountry1();
    // } else {
    //   this.getCountry();
    // }
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.BRAND_IMAGE != null &&
      this.data.BRAND_IMAGE != undefined &&
      this.data.BRAND_IMAGE != ' '
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'BrandImages/' + this.data.BRAND_IMAGE;
      this.uploadedImage = this.data.BRAND_IMAGE;

      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["data"] && this.data) {
  //     const { COUNTRY_ID, STATE_ID } = this.data;

  //     // Call the API to load state, city, and pincode
  //     this.getstate(COUNTRY_ID, false);
  //     if (STATE_ID) {
  //       this.getDistrict(STATE_ID, false);
  //     }
  //   }
  // }

  allClusters = [];
  clusters = [];

  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    // this.data.ORG_ID =1
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
    // this.add();
    this.fileURL = '';
  }

  add(): void {
    this.api.getAllBrands(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.data.SEQUENCE_NO = 1;
        } else {
          this.data.SEQUENCE_NO = Number(data['data'][0]['SEQUENCE_NO']) + 1;
        }
      },
      (err) => { }
    );
  }

  alphanumchar(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
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

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  CropImageModalVisible = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop = false;
  cropimageshow: any;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';

  deleteCancel() { }
  removeImage() {
    this.data.BRAND_IMAGE = ' ';
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
    this.data.BRAND_IMAGE = ' ';
    // this.data.BRAND_IMAGE = "";

    this.fileURL = null;
    this.cd.detectChanges();
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
  //   const allowedWidth = 165;
  //   const allowedHeight = 165;

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
  //
  //           this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
  //             URL.createObjectURL(this.fileURL)
  //           );
  //           this.data.BRAND_IMAGE = this.fileURL.name;
  //
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
    const canvasSize = 165;
    const softUpscaleLimit = 90;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.selectedFile = file;

      if (file.size > maxFileSize) {
        this.message.error('Brand Image size should not exceed 1MB.', '');
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

          // Set preview image immediately
          const base64 = canvas.toDataURL('image/png');
          // this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(base64);

          canvas.toBlob((blob) => {
            if (!blob) {
              this.message.error('Image processing failed.', '');
              return;
            }

            const fileExt = 'png';
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            const dateStr = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let generatedUrl = dateStr
              ? `${dateStr}${randomNumber}.${fileExt}`
              : '';

            if (this.data.BRAND_IMAGE?.trim()) {
              const parts = this.data.BRAND_IMAGE.split('/');
              if (parts.length > 1) generatedUrl = parts[5];
            }

            const finalFile = new File([blob], generatedUrl, {
              type: 'image/png',
            });

            this.fileURL = finalFile;
            this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(base64);

            this.UrlImageOne =
              this.data.ID && this.data.BRAND_IMAGE
                ? this.uploadedImage.split('?')[0]
                : generatedUrl;

            this.data.BRAND_IMAGE = this.UrlImageOne;

            // 🛠️ Trigger Angular to detect changes and update UI
            this.cd.detectChanges();
          }, 'image/png');
        };
      };

      reader.readAsDataURL(file);
    } else {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.BRAND_IMAGE = null;
    }
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

  cropperPosition = { x1: 0, y1: 0, x2: 165, y2: 165 };

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
      this.cropperPosition = { x1: 0, y1: 0, x2: 165, y2: 165 };
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
    this.isSpinning = false;
    this.isOk = true;

    if (
      !this.data.BRAND_NAME?.trim() &&
      !this.data.SHORT_CODE?.trim() &&
      !this.data.BRAND_IMAGE.trim()
    ) {
      this.isOk = false;
      this.message.error('Please fill all required fields', '');
    } else if (!this.data.BRAND_NAME?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter Brand Name', '');
    } else if (!this.data.SHORT_CODE?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    } else if (
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO == null ||
      this.data.SEQUENCE_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    } else if (
      this.data.BRAND_IMAGE == undefined ||
      this.data.BRAND_IMAGE == null ||
      this.data.BRAND_IMAGE == '' ||
      this.data.BRAND_IMAGE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Brand Image', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.fileURL) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        let url = `${d ?? ''}${number}.${fileExt}`;

        const uploadedfileExt = this.uploadedImage?.split('.').pop();

        if (this.data.ID && uploadedfileExt === fileExt) {
          this.UrlImageOne = this.uploadedImage;
        } else {
          this.UrlImageOne = url;
        }

        this.api
          .onUpload('BrandImages', this.fileURL, this.UrlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response && res.status === 200) {
              this.data.BRAND_IMAGE = this.UrlImageOne;

              this.uploadedImage = this.data.BRAND_IMAGE;

              this.handleSaveOperation(addNew, accountMasterPage);
            } else if (res.type === HttpEventType.Response) {
              this.message.error('Failed to Upload Brand Image.', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.handleSaveOperation(addNew, accountMasterPage);
      }
      // this.data.ORG_ID =1
      // if (this.data.ID) {
      //   this.api.updateBrand(this.data).subscribe(
      //     (successCode) => {
      //       if (successCode["status"] == 200) {
      //         this.message.success("Brand Updated Successfully", "");
      //         this.isSpinning = false;
      //         if (!addNew) this.close(accountMasterPage);
      //       } else {
      //         this.message.error("Brand Updation Failed", "");
      //         this.isSpinning = false;
      //       }
      //     },
      //     (err) => {
      //       this.message.error("Something went wrong, please try again later", "");
      //       this.isSpinning = false;
      //     }
      //   );
      // } else {
      //   this.api.createBrand(this.data).subscribe(
      //     (successCode) => {
      //       if (successCode["status"] == 200) {
      //         this.message.success("Brand Saved Successfully", "");
      //         this.isSpinning = false;
      //         if (!addNew) {
      //           this.close(accountMasterPage);
      //         } else {
      //           this.data = new brandMaster();
      //           this.resetDrawer(accountMasterPage);
      //         }
      //       } else {
      //         this.message.error("Cannot save Brand Information", "");
      //         this.isSpinning = false;
      //       }
      //     },
      //     (err) => {
      //       this.message.error("Something went wrong, please try again later", "");
      //       this.isSpinning = false;
      //     }
      //   );
      // }
    }
  }
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    //  if (this.data.DESCRIPTION == '') {
    //    this.data.DESCRIPTION = null;
    //  }
    if (this.data.ID) {
      this.api.updateBrand(this.data).subscribe(
        (successCode) => {
          if (
            successCode['status'] == 200 &&
            successCode.body['code'] === 200
          ) {
            this.message.success('Brand Updated Successfully', '');
            this.isSpinning = false;
            if (!addNew) this.close(accountMasterPage);
          } else if (
            successCode['status'] === 200 &&
            successCode.body['code'] === 300
          ) {
            this.message.error(successCode.message, '');
            this.isSpinning = false;
          } else {
            this.message.error('Brand Updation Failed', '');
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
      this.api.createBrand(this.data).subscribe(
        (successCode) => {
          if (
            successCode['status'] === 200 &&
            successCode.body['code'] === 200
          ) {
            this.message.success('Brand Saved Successfully', '');
            this.isSpinning = false;
            if (!addNew) {
              this.close(accountMasterPage);
            } else {
              this.data.BRAND_IMAGE = '';
              this.data = new brandMaster();

              this.resetDrawer(accountMasterPage);
              this.api.getAllBrands(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
                (data) => {
                  if (data.body['count'] == 0) {
                    this.data.SEQUENCE_NO = 1;
                  } else {
                    this.data.SEQUENCE_NO =
                      data.body['data'][0]['SEQUENCE_NO'] + 1;
                  }
                },
                (err) => { }
              );
            }
          } else if (
            successCode['status'] === 200 &&
            successCode.body['code'] === 300
          ) {
            this.message.error(successCode.message, '');
            this.isSpinning = false;
          } else {
            this.message.error('Cannot save Brand Information', '');
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

  imageCropped2(event: any) {
    this.enhanceImageQuality(event.base64, 165, 165);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }

  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;

    cropWidth = 165;
    cropHeight = 165;

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
}