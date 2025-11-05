import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { subcategory } from 'src/app/Pages/Models/subcategory';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css'],
})
export class SubcategoryComponent {
  @Input() drawerClose: Function;
  @Input() data: subcategory;
  @Input() drawerVisible: boolean;
  Parentcategories: any = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;

  imgUrl;
  categories: any = [];

  public commonFunction = new CommonFunctionService();
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  fullImageUrl: string;
  fullImageUrl1: string;
  uploadedImage: any = '';
  uploadedImage1: any = '';
  retriveimgUrl = appkeys.retriveimgUrl;
  ngOnInit() {
    this.getcategory();

    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.IMAGE != null &&
      this.data.IMAGE != undefined &&
      this.data.IMAGE != ' '
    ) {
      this.fullImageUrl = this.retriveimgUrl + 'SubCategory/' + this.data.IMAGE;
      this.uploadedImage = this.data.IMAGE;

      // window.open(fullImageUrl, '_blank');
    } else if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.BANNER_IMAGE != null &&
      this.data.BANNER_IMAGE != undefined &&
      this.data.BANNER_IMAGE != ' '
    ) {
      this.fullImageUrl1 =
        this.retriveimgUrl + 'SubCategory/' + this.data.BANNER_IMAGE;
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }

    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.BANNER_IMAGE != null &&
      this.data.BANNER_IMAGE != undefined &&
      this.data.BANNER_IMAGE != ' '
    ) {
      this.fullImageUrl1 =
        this.retriveimgUrl + 'SubCategory/' + this.data.BANNER_IMAGE;
      // window.open(fullImageUrl, '_blank');

      this.uploadedImage1 = this.data.BANNER_IMAGE;
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
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
    this.data = new subcategory();

    this.fileURL = '';
    this.fileURL1 = '';

    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  CropImageModalVisible = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop = false;
  cropimageshow: any;
  imageChangedEvent2: any = '';
  croppedImage2: any = '';
  CropImageModalVisible2 = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop2 = false;
  cropimageshow2: any;
  @ViewChild('image1') myElementRef!: ElementRef;
  @ViewChild('image2') myElementRef2!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  fileChangeEvent(event: any): void {
    //

    this.CropImageModalVisible = true;
    this.cropimageshow = true;

    this.imageChangedEvent = event;
  }

  cropperPosition = { x1: 0, y1: 0, x2: 60, y2: 60 };
  imageCropped3(event: any) {
    this.enhanceImageQuality(event.base64, 60, 60);
    // this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
  }
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;

    cropWidth = 60;
    cropHeight = 60;

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
      this.cropperPosition = { x1: 0, y1: 0, x2: 60, y2: 60 };
    }, 50);
    this.imagePreview = this.croppedImage;
    this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
    // Image loaded successfully
  }

  cropperReady(event) { }

  loadImageFailed() {
    // Image failed to load
  }
  CropImageModalCancel2() {
    this.CropImageModalVisible2 = false;
    this.cropimageshow2 = false;
    this.myElementRef2.nativeElement.value = null;
  }
  fileChangeEvent2(event: any): void {
    //

    this.CropImageModalVisible2 = true;
    this.cropimageshow2 = true;

    this.imageChangedEvent2 = event;
  }

  cropperPosition2 = { x1: 0, y1: 0, x2: 345, y2: 75 };
  imageCropped2(event: any) {
    this.enhanceImageQuality2(event.base64, 345, 75);
    // this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
  }

  async enhanceImageQuality2(
    base64: any,
    finalWidth: number,
    finalHeight: number
  ): Promise<void> {
    try {
      this.croppedImage2 = await new Promise((resolve, reject) => {
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
  compressImage2(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const sizeInMB = blob.size / (1024 * 1024); // Convert to MB

        if (sizeInMB > 1 && quality > 0.1) {
          // If size is still >1MB, reduce quality and try again
          this.compressImage2(canvas, quality - 0.1);
        } else {
          // Final compressed image (size is now below 1MB)
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage2 = reader.result as string;
            //
          };
        }
      },
      'image/jpeg',
      quality
    ); // Convert to JPEG with given quality
  }

  imageWidth2: number = 0;
  imageHeight2: number = 0;
  imageLoaded2(event) {
    //
    setTimeout(() => {
      this.cropperPosition2 = { x1: 0, y1: 0, x2: 345, y2: 75 };
    }, 50);
    this.imagePreview1 = this.croppedImage2;
    this.imageWidth2 = event.original.size.width;
    // this.imageHeight = event.original.size.height;
    // Image loaded successfully
  }

  cropperReady2(event) { }

  loadImageFailed2() {
    // Image failed to load
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;

    if (
      (this.data.NAME.trim() === '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.CATEGORY_ID == undefined ||
        this.data.CATEGORY_ID == null ||
        this.data.CATEGORY_ID == 0) &&
      (this.data.IMAGE == undefined || this.data.IMAGE == null)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
      return;
    } else if (
      this.data.CATEGORY_ID == undefined ||
      this.data.CATEGORY_ID == null ||
      this.data.CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select category', '');
      return;
    } else if (
      this.data.NAME.trim() === '' ||
      this.data.NAME == null ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Subcategory Name', '');
      return;
    } else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
      return;
    } else if (
      this.data.IMAGE == undefined ||
      this.data.IMAGE == null ||
      this.data.IMAGE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload Subcategory Icon', '');
      return;
    }

    this.isSpinning = true;

    // Upload Image First (if any file is selected)
    if (this.fileURL) {
      // this.UrlImageOne = this.fileURL?.name;
      // this.UrlImageOne = this.data.IMAGE;
      //

      // this.api
      //   .onUpload('SubCategory', this.fileURL, this.UrlImageOne)
      //   .subscribe(
      //     (res) => {
      //       if (
      //         res.type === HttpEventType.Response &&
      //         res.status === 200 &&
      //         res.body['code'] === 200
      //       ) {
      //         this.data.IMAGE = this.UrlImageOne; // Save uploaded image URL
      //

      //         this.message.success('Image Uploaded Successfully...', '');
      //         this.createOrUpdate(addNew, accountMasterPage);
      //       } else {
      //         this.isSpinning = false;
      //         this.message.error('Failed to upload image', '');
      //       }
      //     },
      //     () => {
      //       this.isSpinning = false;
      //       this.message.error('Image upload failed', '');
      //     }
      //   );

      // this.api
      //   .onUpload('SubCategory', this.fileURL, this.UrlImageOne)
      //   .subscribe(
      //     (res) => {
      //       if (res.type === HttpEventType.Response) {
      //         if (res.status === 200 && res.body['code'] === 200) {
      //           this.data.IMAGE = this.UrlImageOne; // Save uploaded image URL
      //           this.uploadedImage = this.data.IMAGE;

      //           // this.message.success('Image Uploaded Successfully...', '');
      //           this.createOrUpdate(addNew, accountMasterPage);
      //         } else {
      //           this.isSpinning = false;
      //           this.message.error('Failed to upload image', '');
      //         }
      //       }
      //     },
      //     () => {
      //       this.isSpinning = false;
      //       this.message.error('Image upload failed', '');
      //     }
      //   );
      this.createOrUpdate(addNew, accountMasterPage);
    } else {
      // No file selected; proceed with create or update
      this.createOrUpdate(addNew, accountMasterPage);
    }
  }

  createOrUpdate(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.fileURL1) {
      // this.UrlImageTwo = this.data.BANNER_IMAGE;
      // this.UrlImageTwo = this.fileURL1?.name;
      //

      this.api
        .onUpload('SubCategory', this.fileURL1, this.UrlImageTwo)
        .subscribe(
          (res) => {
            if (res.type === HttpEventType.Response) {
              if (res.status === 200 && res.body['code'] === 200) {
                this.data.BANNER_IMAGE = this.UrlImageTwo;

                // this.message.success('Banner Image Uploaded Successfully...', '');
              } else {
                this.isSpinning = false;
                this.message.error('Failed to upload Banner Image', '');
              }
            }
          },
          () => {
            this.isSpinning = false;
            this.message.error('Banner Image upload failed', '');
          }
        );
    }
    // this.data.NAME.trim();
    if (this.data.ID) {
      if (this.data.DESCRIPTION == '') {
        this.data.DESCRIPTION = null;
      }

      // let demo = this.data.BANNER_IMAGE;

      this.api.updatesubCategory(this.data).subscribe(
        (successCode) => {
          this.handleResponse(successCode, addNew, accountMasterPage);
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
      // Create Logic

      this.api.createsubCategory(this.data).subscribe(
        (successCode) => {
          this.handleResponse(successCode, addNew, accountMasterPage);
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

  handleResponse(
    successCode: any,
    addNew: boolean,
    accountMasterPage: NgForm
  ): void {
    if (successCode['code'] === 200) {
      this.message.success('Subcategory Saved Successfully', '');
      if (!addNew) {
        this.drawerClose();
      } else {
        this.data = new subcategory();
      }
      this.resetDrawer(accountMasterPage);
      this.api.getSubCategoryData(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
    } else {
      this.message.error('Failed to Save Subcategory Information', '');
    }
    this.isSpinning = false;
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

  deleteCancel() { }
  removeImage() {
    this.data.IMAGE = '';
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.IMAGE = '';

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'SubCategory/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  imageshow;
  sanitizedFileURL: SafeUrl | null = null;
  selectedFile;
  imagePreview;

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
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; // 1 MB
    const allowedWidth = 60;
    const allowedHeight = 60;

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
        img.src = this.croppedImage;
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
              `Image dimensions should be exactly ${allowedWidth}x ${allowedHeight}px`,
              ''
            );
            this.fileURL = null;
            this.sanitizedFileURL = null;
          } else {
            // Sanitize the file URL for preview
            this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(this.fileURL)
            );
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = '';
            url = d == null ? '' : d + number + '.' + fileExt;
            if (this.data.IMAGE != undefined && this.data.IMAGE.trim() != '') {
              var arr = this.data.IMAGE.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            const uploadedfileExt = this.uploadedImage.split('.').pop();

            if (this.data.ID) {
              if (uploadedfileExt == fileExt) {
                // this.UrlImageOne = this.uploadedImage;
                this.UrlImageOne = url;
              } else {
                this.UrlImageOne = url;
              }
            } else {
              this.UrlImageOne = url;
            }
            this.data.IMAGE = url;
          }
        };
      };

      reader.readAsDataURL(this.fileURL);
      this.CropImageModalVisible = false;

      // if (this.fileURL) {
      // }
    } else {
      alert('Please select a valid image file (PNG, JPG, JPEG).');
      this.fileURL = null;
      this.sanitizedFileURL = null;
      event.target.value = null;
    }
  }

  imagePreviewVisible: boolean = false;
  getcategory() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        this.loadingRecords = false;
        this.categories = data['data'];
      },
      (err) => { }
    );
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No image selected to view.');
    }
  }

  deleteImage(): void {
    // Remove selected file and its preview
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }

  // banner image

  fileURL1: any = '';
  sanitizedFileURL1: SafeUrl | null = null;
  sanitizedLink1: any = '';
  ViewImage1: any;
  ImageModalVisible1 = false;
  imageshow1;
  UrlImageTwo;
  selectedFile1: any;
  imagePreview1: any;
  onFileSelected1(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; // 1 MB
    const allowedWidth = 345;
    const allowedHeight = 75;

    if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
      this.fileURL1 = this.base64ToFile(
        this.croppedImage2,
        'cropped-image.png'
      );

      if (this.fileURL1.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL1 = null;
        return;
      }

      // Validate image dimensions
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = this.croppedImage2;
        const input = event.target as HTMLInputElement;

        if (input?.files?.length) {
          this.selectedFile1 = input.files[0];

          // Generate a preview of the selected image
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview1 = this.croppedImage2; // Base64 image data
          };
          reader.readAsDataURL(this.selectedFile1);
        }
        img.onload = () => {
          if (img.width !== allowedWidth || img.height !== allowedHeight) {
            this.message.error(
              `Image dimensions should be exactly ${allowedWidth}x ${allowedHeight}px`,
              ''
            );
            this.fileURL1 = null;
            this.sanitizedFileURL1 = null;
          } else {
            // Sanitize the file URL for preview
            this.sanitizedFileURL1 = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(this.fileURL1)
            );
            // this.data.BANNER_IMAGE = this.fileURL1.name;
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL1.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var burl = '';
            burl = d == null ? '' : d + number + '.' + fileExt;
            if (
              this.data.BANNER_IMAGE != undefined &&
              this.data.BANNER_IMAGE.trim() != ''
            ) {
              var arr = this.data.BANNER_IMAGE.split('/');
              if (arr.length > 1) {
                burl = arr[5];
              }
            }

            const uploadedfileExt = this.uploadedImage1.split('.').pop();

            if (this.data.ID) {
              if (uploadedfileExt == fileExt) {
                //
                this.UrlImageTwo = this.uploadedImage1;
              } else {
                this.UrlImageTwo = burl;
              }
            } else {
              this.UrlImageTwo = burl;
            }
            this.data.BANNER_IMAGE = this.UrlImageTwo;
            // this.data.BANNER_IMAGE = burl;
            // this.UrlImageTwo = burl;
            // this.UrlImageOne = burl

            // this.data.BANNER_IMAGE = this.fileURL.name;
            //
            //
            //
          }
        };
      };

      reader.readAsDataURL(this.fileURL1);
      this.CropImageModalVisible2 = false;

      // if (this.fileURL1) {
      // }
    } else {
      alert('Please select a valid image file (PNG, JPG, JPEG).');
      event.target.value = null;
      this.fileURL1 = null;
      this.sanitizedFileURL1 = null;
    }
  }

  deleteImage1(): void {
    // Remove selected file and its preview
    this.fileURL1 = null;
    this.sanitizedFileURL1 = null;
  }

  viewImage1(imageURL: string): void {
    this.ViewImage1 = 1;
    this.GetImage1(imageURL);
  }

  GetImage1(link: string) {
    let imagePath = this.api.retriveimgUrl + 'SubCategory/' + link;
    this.sanitizedLink1 =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow1 = this.sanitizedLink1;

    // Display the modal only after setting the image URL
    this.ImageModalVisible1 = true;
  }

  ImageModalCancel1() {
    this.ImageModalVisible1 = false;
  }
  image1DeleteConfirm1(data: any) {
    this.UrlImageTwo = null;
    this.data.BANNER_IMAGE = ' ';
    // this.data.BANNER_IMAGE = null;
    this.fileURL1 = null;
  }
  deleteCancel1() { }

  openImageInNewWindow1(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL1); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No image selected to view.');
    }
  }

  //Sanjana Code
  image: any;
  onDetailsFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB
    const canvasSize = 60;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const file = event.target.files?.[0];
    if (!file || !allowedTypes.includes(file.type)) {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.resetDetailsImageUpload();
      return;
    }

    if (file.size > maxFileSize) {
      this.message.error('Icon size should not exceed 1MB.', '');
      this.resetDetailsImageUpload();
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

        let drawWidth = imgWidth;
        let drawHeight = imgHeight;
        let ratio = 1;

        // Case 1: Small image (<100x100), scale up softly to improve appearance
        if (imgWidth < 100 && imgHeight < 100) {
          ratio = Math.min(100 / imgWidth, 100 / imgHeight);
        }

        // Case 2: Large image, scale down to fit canvas
        if (imgWidth * ratio > canvasSize || imgHeight * ratio > canvasSize) {
          ratio = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
        }

        // Case 3: Medium-size image — just center if it fits well (ratio = 1)
        drawWidth = imgWidth * ratio;
        drawHeight = imgHeight * ratio;

        const xOffset = (canvasSize - drawWidth) / 2;
        const yOffset = (canvasSize - drawHeight) / 2;

        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(image, xOffset, yOffset, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (!blob) {
            this.message.error('Image processing failed.', '');
            return;
          }

          if (blob.size > maxFileSize) {
            this.message.error('Icon size should not exceed 1MB.', '');
            this.resetDetailsImageUpload();
            return;
          }

          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = 'png';
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let fileName = (d ? d : '') + number + '.' + fileExt;

          if (this.data.IMAGE?.trim()) {
            const arr = this.data.IMAGE.split('/');
            if (arr.length > 1) fileName = arr[5];
          }

          const resizedFile = new File([blob], fileName, { type: 'image/png' });

          this.selectedFile2 = resizedFile;
          this.fileURL2 = resizedFile;
          this.imagePreview = canvas.toDataURL('image/png');

          const uploadedExt = this.uploadedImage2?.split('.').pop();
          if (this.data.ID && this.data.IMAGE && uploadedExt === fileExt) {
            this.UrlImageThree = this.uploadedImage2.split('?')[0];
          } else {
            this.UrlImageThree = fileName;
          }

          this.timer = this.api
            .onUpload('SubCategory', this.fileURL2, this.UrlImageThree)
            .subscribe((res) => {
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImageTwo = percentDone;
                if (this.percentImageTwo === 100) {
                  this.isSpinning = false;
                  setTimeout(() => (this.progressBarImageTwo = false), 2000);
                }
              } else if (res.type === 2 && res.status !== 200) {
                this.message.error('Failed To Upload Icon...', '');
                this.resetDetailsImageUpload();
              } else if (res.type === 4 && res.status === 200) {
                if (res.body?.code === 200) {
                  this.message.success('Icon Uploaded Successfully...', '');
                  this.data.IMAGE = this.UrlImageThree;
                  this.uploadedImage2 = this.data.IMAGE;
                } else {
                  this.resetDetailsImageUpload();
                }
              }
            });
        }, 'image/png');
      };
    };

    reader.readAsDataURL(file);
  }

  resetDetailsImageUpload() {
    this.isSpinning = false;
    this.progressBarImageTwo = false;
    this.percentImageTwo = 0;
    this.data.IMAGE = null;
    this.fileURL2 = null;
    this.imagePreview = null;
    this.selectedFile2 = null;
  }

  imageshow2: any = null;
  selectedFile2: any;
  imagePreview3: any;
  UrlImageThree;
  ViewImage2: any;
  fileURL2: any = '';
  ImageModal2Visible: boolean = false;

  progressBarImageTwo: boolean = false;
  percentImageTwo = 0;

  sanitizedLink2: any = '';
  uploadedImage2: any = '';

  viewDetailsImage(imageURL: string): void {
    this.ViewImage1 = 1;
    this.GetDetailsImage(imageURL);
  }

  GetDetailsImage(link: string) {
    //sanjana
    let imagePath2 = this.api.retriveimgUrl + 'SubCategory/' + link;
    this.sanitizedLink2 =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath2);
    this.imageshow2 = this.sanitizedLink2;

    // Display the modal only after setting the image URL
    this.ImageModal2Visible = true;
  }

  IconDeleteConfirm(data: any) {
    this.UrlImageThree = null;
    this.data.IMAGE = ' ';
    this.data.IMAGE = null;
    this.fileURL2 = null;
  }

  deleteDetailsCancel() { }

  removeDetailsImage() {
    // this.data.UrlImageThree = ' ';
    this.fileURL2 = null;
    this.imageshow2 = null;
    this.data.IMAGE = null;
  }

  ImageDeatilsModalCancel() {
    this.ImageModal2Visible = false;
  }

  ImageModal2Cancel() {
    this.ImageModal2Visible = false;
  }
}