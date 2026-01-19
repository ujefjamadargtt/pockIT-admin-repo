import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { appkeys } from 'src/app/app.constant';
import { JobTraining } from 'src/app/Pages/Models/jobTraining';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
@Component({
  selector: 'app-jobtraining-master-drawer',
  templateUrl: './jobtraining-master-drawer.component.html',
  styleUrls: ['./jobtraining-master-drawer.component.css'],
})
export class JobtrainingMasterDrawerComponent {
  @Input() drawerClose: Function;
  @Input() data: JobTraining;
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
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '90px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Details here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript'],
      ['customClasses', 'insertVideo', 'insertImage'],
    ],
  };
  uploadedImage: any = '';
  ngOnInit() {
    if (this.data?.ID) {
      const html = this.data.DESCRIPTION || '';
      this.cleanTextLength = html.length;
      this.showLengthError = html.length > this.maxLength;
    }
    var filter = '';
    filter = this.data.CATEGORY_ID
      ? ' AND CATEGORY_ID=' + this.data.CATEGORY_ID
      : '';
    if (this.data.ID) {
      this.api
        .getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1 ' + filter)
        .subscribe(
          (subcategoryData) => {
            if (subcategoryData['code'] == 200) {
              this.subcategoryList = subcategoryData['data'];
            } else {
              this.subcategoryList = [];
            }
          },
          (err) => { }
        );
      this.getServices();
    }
    this.getCategory();
  }
  serviceList: any = [];
  getServices() {
    var filter = '';
    if (this.data.CATEGORY_ID && this.data.SUBCATEGORY_ID) {
      filter =
        ' AND CATEGORY_ID= ' +
        this.data.CATEGORY_ID +
        ' AND SUB_CATEGORY_ID=' +
        this.data.SUBCATEGORY_ID;
    }
    this.api
      .getServiceItem(0, 0, '', 'desc', ' AND STATUS=1' + filter)
      .subscribe((data) => {
        if (data.code == 200) {
          this.serviceList = data['data'];
        } else {
          this.serviceList = [];
        }
      });
  }
  onCategoryChange(event) {
    if (event) {
      this.api
        .getSubCategoryData(
          0,
          0,
          'SEQ_NO', 'asc',
          " AND CATEGORY_ID= '" + event + "' AND STATUS=1"
        )
        .subscribe(
          (subcategoryData) => {
            if (subcategoryData['code'] == 200) {
              this.subcategoryList = subcategoryData['data'];
              this.data.SUBCATEGORY_ID = null;
              this.data.SERVICE_ID = null;
            } else {
              this.subcategoryList = [];
            }
          },
          (err) => { }
        );
    } else {
      this.subcategoryList = [];
      this.data.SUBCATEGORY_ID = null;
      this.data.SERVICE_ID = null;
    }
  }
  limitTextLength() {
    if (this.data.DESCRIPTION && this.data.DESCRIPTION.length > 2048) {
      this.data.DESCRIPTION = this.data.DESCRIPTION.substring(0, 2048);
    }
  }
  onSubCategoryChange(event) {
    var filter = '';
    if (this.data.CATEGORY_ID && this.data.SUBCATEGORY_ID) {
      filter =
        ' AND CATEGORY_ID= ' +
        this.data.CATEGORY_ID +
        ' AND SUB_CATEGORY_ID=' +
        this.data.SUBCATEGORY_ID;
    }
    if (event) {
      this.getServices();
      this.data.SERVICE_ID = null;
    } else {
      this.serviceList = [];
      this.data.SERVICE_ID = null;
    }
  }
  getCategory() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (categoryData) => {
        if (categoryData['code'] == 200) {
          this.categoryList = categoryData['data'];
        } else {
          this.categoryList = [];
        }
      },
      (err) => { }
    );
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
    this.data = new JobTraining();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
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
  getPlainTextLength(): number {
    const div = document.createElement('div');
    div.innerHTML = this.data.DESCRIPTION || '';
    return div.innerText.length;
  }
  enforceMaxLength() {
    const maxLength = 1024;
    const div = document.createElement('div');
    div.innerHTML = this.data.DESCRIPTION || '';
    const plainText = div.innerText;
    if (plainText.length > maxLength) {
      const trimmedText = plainText.substring(0, maxLength);
      this.data.DESCRIPTION = trimmedText;
    }
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  ViewImage: any;
  sanitizedLink: any = '';
  ImageModalVisible = false;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; 
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
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = d == null ? '' : d + number + '.' + fileExt;
      if (this.data.DOC_URL != undefined && this.data.DOC_URL.trim() != '') {
        var arr = this.data.DOC_URL.split('/');
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
        .onUpload('JobTrainingDocs', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.data.DOC_URL = this.UrlImageOne;
          this.uploadedImage = this.data.DOC_URL;
          if (res.type === HttpEventType.Response) {
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
            this.data.DOC_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] === 200) {
              this.message.success('Document Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.DOC_URL = this.UrlImageOne;
              this.uploadedImage = this.data.DOC_URL;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.DOC_URL = null;
            }
          }
        });
    } else {
      this.message.error(
        'Only images (jpeg, jpg, png) and PDF files are allowed.',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.DOC_URL = null;
    }
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.data.DOC_URL = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOC_URL = null;
  }
  deleteCancel() { }
  removeImage() {
    this.data.DOC_URL = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOC_URL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'JobTrainingDocs/' + link;
    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');
    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isOk = true;
    const isBlobInDescription =
      this.data.DESCRIPTION && this.data.DESCRIPTION.includes('data:image');
    if (isBlobInDescription) {
      this.api.prepareDescriptionWithUploads(
        this.data.DESCRIPTION,
        'JobTrainingDocs',
        (updatedHtml) => {
          this.data.DESCRIPTION = updatedHtml;
          this.continueSave(addNew, websitebannerPage);
        }
      );
    } else {
      this.continueSave(addNew, websitebannerPage);
    }
  }
  cleanTextLength = 0;
  showLengthError = false;
  maxLength = 50000;
  checkDescriptionLength(): void {
    const html = this.data.DESCRIPTION || '';
    const totalLength = html.length;
    this.cleanTextLength = totalLength;
    this.showLengthError = totalLength > this.maxLength;
    if (this.showLengthError) {
      const truncated = html.slice(0, this.maxLength);
      this.data.DESCRIPTION = '';
      setTimeout(() => {
        this.data.DESCRIPTION = truncated;
        this.cleanTextLength = truncated.length;
      });
    }
  }
  continueSave(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (
      this.data.CATEGORY_ID == undefined &&
      this.data.SUBCATEGORY_ID == undefined &&
      this.data.SERVICE_ID == undefined &&
      this.data.TITLE.trim() === '' &&
      this.data.LINK.trim() == '' &&
      this.data.DESCRIPTION.trim() == ''
    ) {
      this.message.error('Please Fill All Required Fields', '');
      this.isOk = false;
    }
    else if (
      this.data.CATEGORY_ID == null ||
      this.data.CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Category', '');
      return;
    } else if (
      this.data.SUBCATEGORY_ID == null ||
      this.data.SUBCATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Sub Category', '');
      return;
    } else if (
      this.data.SERVICE_ID == null ||
      this.data.SERVICE_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Service', '');
      return;
    } else if (
      this.data.TITLE.trim() === '' ||
      this.data.TITLE == null ||
      this.data.TITLE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Job Title', '');
      return;
    } else if (
      (this.data.DOC_URL == undefined ||
        this.data.DOC_URL == null ||
        this.data.DOC_URL == '') &&
      this.data.SOURCE_TYPE == 'D'
    ) {
      this.isOk = false;
      this.message.error('Please Upload Document', '');
      return;
    } else if (
      (this.data.LINK == undefined ||
        this.data.LINK == null ||
        this.data.LINK == '') &&
      this.data.SOURCE_TYPE == 'L'
    ) {
      this.isOk = false;
      this.message.error('Please Enter Link', '');
      return;
    } else if (
      this.data.DESCRIPTION == undefined ||
      this.data.DESCRIPTION == null ||
      this.data.DESCRIPTION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Description', '');
      return;
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.handleSaveOperation(addNew, accountMasterPage);
    }
  }
  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.data.SOURCE_TYPE == 'L') {
      this.data.DOC_URL = null;
    } else {
      this.data.LINK = null;
    }
    if (this.data.ID) {
      this.api.updateJobTraining(this.data).subscribe(
        (successCode) => {
          if (successCode['status'] === 200) {
            this.isSpinning = false;
            this.message.success('Job Training updated successfully', '');
            if (!addNew) this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.isSpinning = false;
            this.message.error('failed to update Job Training', '');
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
      this.api.creatJobTraining(this.data).subscribe(
        (successCode) => {
          if (successCode['status'] === 200) {
            this.isSpinning = false;
            this.message.success('Job Training created successfully.', '');
            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);
            } else {
              this.data = new JobTraining();
              this.resetDrawer(accountMasterPage);
            }
          } else {
            this.isSpinning = false;
            this.message.error('Failed to add Job Training', '');
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something went wrong', '');
        }
      );
    }
  }
}
