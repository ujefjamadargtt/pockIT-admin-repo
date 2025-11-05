import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, switchMap, forkJoin } from 'rxjs';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { KnowledgeBaseMaster } from 'src/app/Support/Models/KnowledgeBaseMaster';

@Component({
  selector: 'app-knowledge-base-master-add',
  templateUrl: './knowledge-base-master-add.component.html',
  styleUrls: ['./knowledge-base-master-add.component.css'],
})
export class KnowledgeBaseMasterAddComponent {
  @Input() data: any = KnowledgeBaseMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new KnowledgeBaseMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  ngOnInit() {
    if (this.data?.ID) {
      const html = this.data.DESCRIPTION || '';
      this.cleanTextLength = html.length;
      this.showLengthError = html.length > this.maxLength;
    }

    if (this.data.ID && this.data.KNOWLEDGEBASE_CATEGORY_ID) {
      this.getsubcategoryData(this.data.KNOWLEDGEBASE_CATEGORY_ID);
    } else {
    }

    this.getcategoryData();
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
        // this.showLengthError = false;
      });
    }
  }

  CategoryData: any = [];
  getcategoryData() {
    this.api
      .getKnowledgeBaseCategoryData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data: HttpResponse<any>) => {
          //

          const statusCode = data.status;
          const responseBody = data.body;

          if (statusCode == 200) {
            this.CategoryData = responseBody['data'];
          } else {
            this.CategoryData = [];
            this.message.error(
              'Failed To Get Knowledge Base Category Data',
              ''
            );
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  SubcategoryData: any = [];
  getsubcategoryData(categoryId: any, value: boolean = true) {
    if (value == false) {
      this.data.KNOWLEDGE_SUB_CATEGORY_ID = null;
      // this.data.PINCODE_ID = null;
    }

    this.api
      .getKnowledgeBasesubCategoryData(
        0,
        0,
        '',
        '',
        ' AND KNOWLEDGEBASE_CATEGORY_ID =' + categoryId
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          //

          const statusCode = data.status;
          const responseBody = data.body;

          if (statusCode == 200) {
            this.SubcategoryData = responseBody['data'];
          } else {
            this.SubcategoryData = [];
            this.message.error(
              'Failed To Get Knowledge Base Subcategory Data',
              ''
            );
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  descriptionLength = 0;

  onDescriptionChange(content: string) {
    const plainText = this.stripHtml(content);
    if (plainText.length > 1024) {
      // Trim to 1024 characters
      const trimmed = plainText.slice(0, 1024);
      this.data.DESCRIPTION = trimmed;
      this.descriptionLength = 1024;
    } else {
      this.descriptionLength = plainText.length;
      this.data.DESCRIPTION = content;
    }
  }

  stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  limitTextLength() {
    if (this.data.DESCRIPTION && this.data.DESCRIPTION.length > 1024) {
      this.data.DESCRIPTION = this.data.DESCRIPTION.substring(0, 1024);
    }
  }

  convertSrcToFile(src: string): Observable<File> {
    return new Observable((observer) => {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `image_${Date.now()}.png`, {
            type: blob.type,
          });
          observer.next(file);
          observer.complete();
        });
    });
  }

  prepareDescriptionWithUploads(
    html: string,
    callback: (updatedHtml: string) => void
  ): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const imgElements = Array.from(tempDiv.querySelectorAll('img'));
    const uploadObservables: Observable<any>[] = [];
    const replacements: { element: HTMLImageElement; filename: string }[] = [];

    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && (src.startsWith('data:image/') || src.startsWith('blob:'))) {
        const filename = `image_${Date.now()}_${Math.floor(
          Math.random() * 10000
        )}.png`;

        const obs = this.convertSrcToFile(src).pipe(
          switchMap((file) =>
            this.api.onUpload2('KnowledgeBaseDoc', file, filename)
          )
        );

        uploadObservables.push(obs);
        replacements.push({ element: img, filename });
      }
    });

    if (uploadObservables.length === 0) {
      callback(tempDiv.innerHTML);
      return;
    }

    forkJoin(uploadObservables).subscribe(() => {
      replacements.forEach((rep) => {
        const url = `${this.api.retriveimgUrl}KnowledgeBaseDoc/${rep.filename}`;
        //

        rep.element.setAttribute('src', url);
      });

      callback(tempDiv.innerHTML);
    });
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isOk = true;

    const isBlobInDescription =
      this.data.DESCRIPTION && this.data.DESCRIPTION.includes('data:image');

    if (isBlobInDescription) {
      this.prepareDescriptionWithUploads(
        this.data.DESCRIPTION,
        (updatedHtml) => {
          this.data.DESCRIPTION = updatedHtml;
          this.continueSave(addNew, websitebannerPage);
        }
      );
    } else {
      this.continueSave(addNew, websitebannerPage);
    }
  }

  continueSave(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.data.TITLE == ' ' ||
        this.data.TITLE == null ||
        this.data.TITLE == undefined) &&
      (this.data.KNOWLEDGE_SUB_CATEGORY_ID == undefined ||
        this.data.KNOWLEDGE_SUB_CATEGORY_ID == null ||
        this.data.KNOWLEDGE_SUB_CATEGORY_ID == 0) &&
      (this.data.KNOWLEDGEBASE_CATEGORY_ID == undefined ||
        this.data.KNOWLEDGEBASE_CATEGORY_ID == null ||
        this.data.KNOWLEDGEBASE_CATEGORY_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.KNOWLEDGEBASE_CATEGORY_ID == null ||
      this.data.KNOWLEDGEBASE_CATEGORY_ID == undefined ||
      this.data.KNOWLEDGEBASE_CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Category.', '');
    } else if (
      this.data.KNOWLEDGE_SUB_CATEGORY_ID == null ||
      this.data.KNOWLEDGE_SUB_CATEGORY_ID == undefined ||
      this.data.KNOWLEDGE_SUB_CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Subcategory', '');
    } else if (
      this.data.TITLE == null ||
      this.data.TITLE == undefined ||
      this.data.TITLE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Title.', '');
    } else if (
      this.data.DESCRIPTION === null ||
      this.data.DESCRIPTION === undefined ||
      this.data.DESCRIPTION.trim() === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Description.', '');
    } else if (
      this.data.TYPE == undefined ||
      this.data.TYPE == null ||
      this.data.TYPE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Document Type', '');
    } else if (
      (this.data.DOCUMENT == undefined ||
        this.data.DOCUMENT == null ||
        this.data.DOCUMENT == '') &&
      this.data.TYPE == 'D'
    ) {
      this.isOk = false;
      this.message.error('Please Upload Document', '');
    } else if (
      (this.data.LINK == undefined ||
        this.data.LINK == null ||
        this.data.LINK == '') &&
      this.data.TYPE == 'L'
    ) {
      this.isOk = false;
      this.message.error('Please Enter Link', '');
    }

    if (this.isOk) {
      if (
        this.data.DESCRIPTION != null &&
        this.data.DESCRIPTION != undefined &&
        this.data.DESCRIPTION != ''
      ) {
        this.data.DESCRIPTION = this.data.DESCRIPTION;
      }
      {
        if (this.data.TYPE == 'D') {
          this.data.LINK = null;
        } else {
          this.data.DOCUMENT = null;
          this.fileURL = null;
          this.progressBarImageOne = false;
          this.percentImageOne = 0;
        }
        this.isSpinning = true;

        if (this.data.ID) {
          this.api.updateKnowledgeBaseData(this.data).subscribe(
            (successCode: HttpResponse<any>) => {
              //

              const statusCode = successCode.status;
              // const responseBody = data.body;

              if (statusCode == 200) {
                // if (successCode.code == '200') {
                this.message.success('Knowledge Base Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Knowledge Base Updation Failed', '');
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
          this.api.createKnowledgeBaseData(this.data).subscribe(
            (successCode: HttpResponse<any>) => {
              //

              const statusCode = successCode.status;
              // const responseBody = data.body;

              if (statusCode == 200) {
                this.message.success('Knowledge Base Created Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new KnowledgeBaseMaster();
                  this.resetDrawer(websitebannerPage);
                }
                this.isSpinning = false;
              } else {
                this.message.error(' Knowledge Base Creation Failed', '');
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
    }
  }

  close() {
    this.drawerClose();
  }

  config: AngularEditorConfig = {
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

  //  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  uploadedImage: any = '';
  ViewImage: any;
  ImageModalVisible = false;
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
        .onUpload('KnowledgeBaseDoc', this.fileURL, this.UrlImageOne)
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
        'Only images (jpeg, jpg, png) and PDF,Doc files are allowed.',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.DOCUMENT = null;
    }
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';

  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'KnowledgeBaseDoc/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }

  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'KnowledgeBaseDoc/' + link;

    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');

    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }


  deleteCancel() { }
  removeImage() {
    this.data.DOCUMENT = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOCUMENT = null;
  }
  image1DeleteConfirm(data: any) {
    this.data.DOCUMENT = '';
    this.fileURL = null;
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.DOCUMENT = null;
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
}
