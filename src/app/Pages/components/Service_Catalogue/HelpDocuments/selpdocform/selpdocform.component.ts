import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { appkeys } from 'src/app/app.constant';
import { helpDocumentMaster } from 'src/app/Pages/Models/helipDocument';

@Component({
  selector: 'app-selpdocform',
  templateUrl: './selpdocform.component.html',
  styleUrls: ['./selpdocform.component.css'],
})
export class SelpdocformComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: helpDocumentMaster;
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
  categoryList: any = [];
  subcategoryList: any = [];
  imgUrl;

  public commonFunction = new CommonFunctionService();
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
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
  ngOnInit() {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.DOCUMENT != null &&
      this.data.DOCUMENT != undefined &&
      this.data.DOCUMENT != ' '
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'HelpDocument/' + this.data.DOCUMENT;
      this.uploadedImage = this.data.DOCUMENT;
      // this.onCategoryChange(this.data.CATEGORY_ID)
      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }
    this.api
      .gethelpDocumentsubCategory(0, 0, '', 'desc', " AND STATUS=1")
      .subscribe((subcategoryData) => {
        if (subcategoryData.status == 200) {
          this.subcategoryList = subcategoryData.body.data

        }
        else {
          this.subcategoryList = []
        }
      }, err => {


      });
    this.getCategory();
  }
  onCategoryChange(event) {

    if (event) {
      // this.api.get
      this.api
        .gethelpDocumentsubCategory(0, 0, '', 'desc', " AND CATEGORY_ID= '" + event + "' AND STATUS=1")
        .subscribe((subcategoryData) => {
          if (subcategoryData.status == 200) {
            this.subcategoryList = subcategoryData.body.data
            this.data.SUBCATEGORY_ID = null

          }
          else {
            this.subcategoryList = []
          }
        }, err => {


        });
    }
    else {
      this.subcategoryList = []
      this.data.SUBCATEGORY_ID = null
    }
  }
  getCategory() {
    this.api
      .gethelpDocumentCategory(0, 0, '', 'desc', ' AND IS_ACTIVE=1')
      .subscribe((categoryData) => {
        if (categoryData.status == 200) {
          this.categoryList = categoryData.body.data
        }
        else {
          this.categoryList = []
        }
      }, err => {


      });
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
    this.data = new helpDocumentMaster();
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
    this.data.DOCUMENT = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOCUMENT = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.data.DOCUMENT = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOCUMENT = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';

  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'HelpDocument/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }
  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'HelpDocument/' + link;

    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');

    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB

    // File validation
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png' ||
      event.target.files[0]?.type === 'application/pdf' ||
      event.target.files[0]?.type === 'application/msword' ||
      event.target.files[0]?.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      this.fileURL = <File>event.target.files[0];

      // File size validation
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }

      // Proceed with file upload
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();

      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = d == null ? '' : d + number + '.' + fileExt;

      if (this.data.DOCUMENT != undefined && this.data.DOCUMENT.trim() != '') {
        var arr = this.data.DOCUMENT.split('/');
        if (arr.length > 1) {
          url = arr[5];
        }
      }

      const uploadedfileExt = this.uploadedImage.split('.').pop();

      if (this.data.ID || this.UrlImageOne) {
        if (uploadedfileExt == fileExt) {
          this.UrlImageOne = this.uploadedImage;
        } else {
          this.UrlImageOne = url;
        }
      } else {
        this.UrlImageOne = url;
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload('HelpDocument', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.data.DOCUMENT = this.UrlImageOne;
          this.uploadedImage = this.data.DOCUMENT;
          if (res.type === HttpEventType.Response) {
            // Handle upload success
          }
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
            this.message.error('Failed To Upload Document.', '');
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.DOCUMENT = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] === 200) {
              this.message.success('Document Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.DOCUMENT = this.UrlImageOne;
              this.uploadedImage = this.data.DOCUMENT;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.DOCUMENT = null;
            }
          }
        });
    } else {
      this.message.error(
        'Only images (jpeg, jpg, png) and PDF, Doc files are allowed.',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.DOCUMENT = null;
    }
  }

  // onFileSelected(event: any): void {
  //   const maxFileSize = 1 * 1024 * 1024; // 1 MB
  //   const allowedWidth = 128;
  //   const allowedHeight = 128;

  //   if (event.target.files[0].type == "image/jpeg" ||
  //     event.target.files[0].type == "image/jpg" ||
  //     event.target.files[0].type == "image/png" ||
  //     event.target.files[0].type == "application/pdf") {
  //     this.fileURL = event.target.files[0];

  //     if (this.fileURL.size > maxFileSize) {
  //       this.message.error('File size should not exceed 1MB.', '');
  //       this.fileURL = null;
  //       return;
  //     }

  //     // Validate image dimensions
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.src = e.target.result;
  //       const input = event.target as HTMLInputElement;

  //       if (input?.files?.length) {
  //         this.selectedFile = input.files[0];

  //         // Generate a preview of the selected image
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           this.imagePreview = reader.result; // Base64 image data
  //         };
  //         reader.readAsDataURL(this.selectedFile);
  //       }
  //       img.onload = () => {
  //         // if (img.width !== allowedWidth || img.height !== allowedHeight) {
  //         //   this.message.error(
  //         //     `Image dimensions should be exactly ${allowedWidth}x${allowedHeight}px.`,
  //         //     ''
  //         //   );
  //         //   this.fileURL = null;
  //         //   this.sanitizedFileURL = null;
  //         // } else {
  //         // Sanitize the file URL for preview
  //         this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
  //           URL.createObjectURL(this.fileURL)
  //         );
  //         this.data.DOCUMENT = this.fileURL.name;
  //         // }
  //       };
  //     };

  //     reader.readAsDataURL(this.fileURL);
  //   } else {
  //     this.message.error(
  //       'Please select a valid file (PNG, JPG, JPEG, PDF, Doc).',
  //       ''
  //     );
  //     this.fileURL = null;
  //     this.sanitizedFileURL = null;
  //   }
  // }
  imagePreviewURL;

  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;

    // Validate required fields
    if (
      this.data.NAME.trim() === '' ||
      this.data.NAME == null ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Document Name', '');
      return;
    }
    else if (
      // this.data.NAME.trim() === '' ||
      this.data.CATEGORY_ID == null ||
      this.data.CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Help Category', '');
      return;
    }
    else if (
      // this.data.NAME.trim() === '' ||
      this.data.SUBCATEGORY_ID == null ||
      this.data.SUBCATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Help Sub Category', '');
      return;
    }
    else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
      return;
    } else if (
      this.data.TYPE == undefined ||
      this.data.TYPE == null ||
      this.data.TYPE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Type', '');
      return;
    } else if (
      (this.data.DOCUMENT == undefined ||
        this.data.DOCUMENT == null ||
        this.data.DOCUMENT == '') &&
      this.data.TYPE == 'D'
    ) {
      this.isOk = false;
      this.message.error('Please Upload Document', '');
      return;
    } else if (
      (this.data.LINK == undefined ||
        this.data.LINK == null ||
        this.data.LINK == '') &&
      this.data.TYPE == 'L'
    ) {
      this.isOk = false;
      this.message.error('Please Enter Link', '');
      return;
    }

    // Handle image upload first
    // if (this.fileURL) {
    //   const number = Math.floor(100000 + Math.random() * 900000);
    //   const fileExt = this.fileURL.name.split('.').pop();
    //   const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    //   this.UrlImageOne = `${d ?? ''}${number}.${fileExt}`;

    //   this.api
    //     .onUpload('HelpDocument', this.fileURL, this.UrlImageOne)
    //     .subscribe((res) => {
    //       if (res.type === HttpEventType.Response && res.status === 200) {
    //         this.data.DOCUMENT = this.UrlImageOne;

    //         // this.message.success('Icon Uploaded Successfully...', '');
    //         this.handleSaveOperation(addNew, accountMasterPage);
    //       } else if (res.type === HttpEventType.Response) {
    //         this.message.error('Failed to Upload Document.', '');
    //         this.isSpinning = false;
    //       }
    //     });
    // } else {
    // If no image file, proceed directly to save
    if (this.isOk) {
      this.isSpinning = true;
      this.handleSaveOperation(addNew, accountMasterPage);
    }
    // }
  }

  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.data.TYPE == 'L') {
      this.data.DOCUMENT = null;
    } else {
      this.data.LINK = null;
    }
    if (this.data.ID) {
      // Update category
      // const uploadedfileExt = this.uploadedImage.name.split('.').pop();
      // const fileExt = this.fileURL.name.split('.').pop();
      //
      //

      // if (uploadedfileExt === fileExt) {
      //
      // }
      this.api.updateHelpDoc(this.data).subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.isSpinning = false;
            this.message.success('Help document updated successfully', '');
            if (!addNew) this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.isSpinning = false;
            this.message.error('failed to update Help document', '');
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
      this.api.createHelpDoc(this.data).subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.isSpinning = false;
            this.message.success('Help document created successfully.', '');
            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);
            } else {
              this.data = new helpDocumentMaster();
              this.resetDrawer(accountMasterPage);
              this.api.getHelpDoc(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
                (err) => {
                  this.message.error(
                    'Something went wrong, please try again later',
                    ''
                  );
                  this.isSpinning = false;
                }
              );
            }
          } else {
            this.isSpinning = false;
            this.message.error('Failed to add help document', '');
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something went wrong', '');
        }
      );
    }
  }

  removeImage1(): void {
    this.data.DOCUMENT = null;
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Document removed successfully.', '');
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No Document selected to view.');
    }
  }
  deleteImage(): void {
    // Remove selected file and its preview
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }
}
