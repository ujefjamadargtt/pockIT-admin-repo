import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import { appkeys } from 'src/app/app.constant';
import { DomSanitizer } from '@angular/platform-browser';
import { whatsapptemplate } from 'src/app/Pages/Models/whatsapptemplate';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-whatsapptemplate',
  templateUrl: './whatsapptemplate.component.html',
  styleUrls: ['./whatsapptemplate.component.css'],
})
export class WhatsapptemplateComponent {
  public commonFunction = new CommonFunctionService();
  @Input() drawerClose: any;
  @Input() data: whatsapptemplate;
  isFocused: string = '';
  url;
  URL_SAMPLE;
  isSpinning = false;
  loadingForm = false;
  websitebuttontext;
  WEBSITE_URL: any = [];
  namepatt = /^[a-z]+_*[a-z]+$/;
  mobpattern = /^[6-9]\d{9}$/;
  inputValuess1: any = [];
  OBJ_END_DATE_TIME;
  fileURL: any = null;
  IMG_URL: any = '';
  text;
  IMAGE;
  fileSizeimg;
  mediaIdImg;
  abc = '{{1}}';
  custom;
  URL;
  urlmode = 'S';
  BUTTON12diabled: boolean = true;
  code: any = [];
  BUTTON12;
  BUTTON1;
  Date = new Date();
  mobile: any = [];
  index1: number;
  index2: any;
  isOk: boolean = true;
  PREFIX = '+91';
  buttons;
  demobutton: any = [];
  visiblebutton: boolean = false;
  temp = 1;
  matches2;
  inputValue: string = '';
  inputBody: string = '';
  dynamicInputValue: any = [];
  showDynamicInput: boolean = false;
  showDynamicInput1: boolean = false;
  textshow;
  fileDataIMAGE_URL: any = null;
  image;
  visiblemedia: boolean = false;
  VIDEO_URL;
  event;
  fileURLPDF: any = null;
  imgUrl = appkeys.retriveimgUrl;
  baseurl = appkeys.baseUrl;
  dynamicInputValue1;
  Value;
  Name: any = [];
  Type: any = [];
  array2;
  visiblebuttonn = false;
  buttoname;
  Mobile: any = [];
  Code;
  Website;
  array1: any = [];
  userId = sessionStorage.getItem('userId');
  IMAGE1;
  prefixValue: string = '';
  suffixValue: string = '';
  NAME = '';
  NAME1;
  matches;
  matches1;
  resultArray;
  matchingObject: any = [];
  buttonarray: any = [];
  showalert: boolean = false;
  array: any = [];
  i = 0;
  inputValuess = [];
  urlinputValuess = [];
  headerValuesArray: any = [];
  pattern1;
  matches12;
  showDynamicInputURL: boolean = false;
  temp_WEBSITE_URL;
  tempinput;
  video;
  fileSizevid;
  mediaIdVid;
  websitebuttontext12: any = [];
  FamilyDetails: any = [];
  webtrue: boolean = false;
  mobtrue: boolean = false;
  offertrue: boolean = false;
  customtrue: boolean = false;
  addedButtons: any[] = [];
  tempcustom;
  showtable: boolean = false;
  web = 0;
  copy = 0;
  phone = 0;
  quick = 0;
  disablecustom: boolean = false;
  dsiableurl: boolean = false;
  disablephone: boolean = false;
  disableoffer: boolean = false;
  removedElement;
  removedElements: any = [];
  boldi = 1;
  isBold: boolean = false;
  italici = 1;
  showEmojiPicker;
  cursorPosition: number = 0;
  @ViewChild('textArea') textArea: ElementRef;
  visiblephone: boolean = false;
  visibleURL: boolean = false;
  visibleOffer: boolean = false;
  visiblecustom: boolean = false;
  buttonData: {
    type: string;
    buttonText: string;
    phoneNumber?: string;
    offerCode?: string;
    websiteButtonText?: string;
    custom?: string;
  }[] = [];
  DOCUMENT;
  upload;
  TYPE;
  fileSize;
  fileSizedoc;
  fileSizedocKB;
  mediaIdDoc;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }
  service: any;
  editorConfig2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '80px',
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
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName',
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
  };
  ngOnInit() { }
  close(): void {
    this.drawerClose();
  }
  isValidMobile(mobile) {
    const expression = /^[1-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  isValidpat(body) {
    const expression = /}}[.,]?[a-zA-Z]+/;
    return expression.test(String('' + body).toLowerCase());
  }
  hasCurlyBraceContent = false;
  checkCurlyBraces(event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    const regex = /\{\{\d+\}\}/; 
    this.hasCurlyBraceContent = regex.test(text);
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s_]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  save(addNew: boolean): void {
    const pattern = /{{\d+}}/g;
    if (this.data.BODY_TEXT != undefined || this.data.BODY_TEXT != null) {
      this.matches = this.data.BODY_TEXT.match(pattern);
    }
    if (this.text != undefined || this.text != null) {
      this.matches1 = this.text.match(pattern);
    }
    var isOk = true;
    if (
      (this.data.NAME == undefined ||
        this.data.NAME == null ||
        this.data.NAME == '') &&
      (this.data.TYPE == undefined ||
        this.data.TYPE == null ||
        this.data.TYPE == '') &&
      (this.data.LANGUAGE == undefined ||
        this.data.LANGUAGE == null ||
        this.data.LANGUAGE == '') &&
      (this.data.BODY_TEXT == undefined ||
        this.data.BODY_TEXT == null ||
        this.data.BODY_TEXT == '') &&
      (this.data.FOOTER_TEXT == undefined ||
        this.data.FOOTER_TEXT == null ||
        this.data.FOOTER_TEXT == '')
    ) {
      this.message.error('Please fill all required fields', '');
      isOk = false;
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == null ||
      this.data.NAME == ''
    ) {
      this.message.error('Please enter template name', '');
      isOk = false;
    } else if (
      this.data.TYPE == undefined ||
      this.data.TYPE == null ||
      this.data.TYPE == ''
    ) {
      this.message.error('Please select category', '');
      isOk = false;
    } else if (
      this.data.HEADER_TYPE == 'T' &&
      (this.data.HEADER_TEXT == undefined ||
        this.data.HEADER_TEXT == null ||
        this.data.HEADER_TEXT == '')
    ) {
      this.message.error('Please enter header text', '');
      isOk = false;
    } else if (
      this.data.BODY_TEXT == undefined ||
      this.data.BODY_TEXT == null ||
      this.data.BODY_TEXT == ''
    ) {
      this.message.error('Please enter body text', '');
      isOk = false;
    } else if (
      this.hasCurlyBraceContent &&
      (this.data.BODY_VALUES == undefined ||
        this.data.BODY_VALUES == null ||
        this.data.BODY_VALUES == '')
    ) {
      this.message.error('Please enter sample value(s) for body text', '');
      isOk = false;
    } else if (
      this.data.HEADER_TYPE == 'M' &&
      this.IMAGE == undefined &&
      this.VIDEO_URL == undefined &&
      this.DOCUMENT == undefined
    ) {
      this.message.error('Please select media for header', '');
      isOk = false;
    } else if (
      this.data.LANGUAGE == undefined ||
      this.data.LANGUAGE == null ||
      this.data.LANGUAGE == ''
    ) {
      this.message.error('Please select language', '');
      isOk = false;
    } else if (
      this.data.BODY_TEXT == undefined ||
      this.data.BODY_TEXT == null ||
      this.data.BODY_TEXT == ''
    ) {
      this.message.error('Please enter body of template', '');
      isOk = false;
    } else if (this.data.BODY_TEXT != undefined) {
      const count = this.data.BODY_TEXT.split('&#160;').length - 1;
      if (count > 1) {
        this.message.error(
          'In body only single space allowed between two characters',
          ''
        );
        isOk = false;
      }
    } else if (
      (this.matches1 != undefined && this.data.HEADER_VALUES != undefined) ||
      this.data.HEADER_VALUES != null ||
      this.data.HEADER_VALUES != ''
    ) {
      if (this.matches1.length != this.data.HEADER_VALUES.length) {
        this.message.error(
          ' Count of variables in Header and sample values are mismatching  ',
          ''
        );
        isOk = false;
      }
    } else if (
      this.matches != undefined &&
      this.data.BODY_VALUES != undefined
    ) {
      if (this.matches.length != this.data.BODY_VALUES.length) {
        this.message.error(
          'Count of variables in body and sample values are mismatching  ',
          ''
        );
        isOk = false;
      }
    } else if (
      this.matches != undefined &&
      this.data.BODY_VALUES == undefined
    ) {
      this.message.error(
        'Count of variables in body and sample values are mismatching  ',
        ''
      );
      isOk = false;
    }
    if (isOk) {
      for (const char of this.data.NAME) {
        if (char === ' ') {
          this.NAME += '_';
        } else if (char === char.toUpperCase()) {
          this.NAME += char.toLowerCase();
        } else {
          this.NAME += char;
        }
      }
      this.NAME1 = this.data.BODY_TEXT.replace(/&#34/g, '"')
        .replace(/<span>/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<br>/g, '')
        .replace(/<strong>/g, '*')
        .replace(/<\/strong>/g, '*')
        .replace(/<em>/g, '_')
        .replace(/<\/em>/g, '_')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, ' ')
        .replace(/&#160/g, '\t')
        .replace(/<i>/g, '_')
        .replace(/<\/i>/g, '_');
      for (let i = 0; i < this.FamilyDetails.length; i++) {
        const familyDetail = this.FamilyDetails[i];
        if (familyDetail.Type === 'QUICK_REPLY') {
          this.array1.push({
            type: 'QUICK_REPLY',
            text: familyDetail.custom,
          });
        }
        if (familyDetail.Type === 'URL') {
          this.array1.push({
            type: 'URL',
            url: familyDetail.WEBSITE_URL,
            text: familyDetail.websitebuttontext,
            example: [familyDetail.tempinput],
          });
        }
        if (familyDetail.Type === 'PHONE_NUMBER') {
          this.array1.push({
            type: 'PHONE_NUMBER',
            text: familyDetail.BUTTON1,
            phone_number: '+910' + familyDetail.mobile,
          });
        }
        if (familyDetail.Type === 'COPY_CODE') {
          this.array1.push({
            type: 'COPY_CODE',
            text: familyDetail.BUTTON12,
            example: [familyDetail.code],
          });
        }
      }
      this.array1 = this.array1.filter(
        (item) => item.text !== undefined && item.text !== null
      );
      this.isSpinning = true;
      const filteredArray = this.array1.filter((item) => {
        for (var i = 0; i < this.FamilyDetails.length; i++) {
          if (item.type === this.FamilyDetails[i].Type) {
            return true;
          }
        }
        return false;
      });
      var datas = {
        WP_CLIENT_ID: this.userId,
        NAME: this.NAME,
        LANGUAGES: this.data.LANGUAGE,
        CATEGORY: this.data.TYPE,
        HEADER_TYPE:
          this.fileURL !== null
            ? 'I'
            : this.fileDataIMAGE_URL !== null
              ? 'V'
              : this.fileURLPDF !== null
                ? 'D'
                : 'T',
        HEADER_TEXT:
          this.data.HEADER_TEXT !== null && this.data.HEADER_TEXT !== undefined
            ? this.data.HEADER_TEXT.toString()
            : '',
        HEADER_VALUES: this.data.HEADER_VALUES
          ? this.data.HEADER_VALUES
          : this.IMAGE
            ? [this.IMAGE]
            : this.mediaIdVid
              ? [this.mediaIdVid]
              : this.mediaIdDoc
                ? [this.mediaIdDoc]
                : null,
        BODY_TEXT: this.NAME1.toString(),
        BODY_VALUES: this.data.BODY_VALUES,
        FOOTER_TEXT:
          this.data.FOOTER_TEXT !== null && this.data.FOOTER_TEXT !== undefined
            ? this.data.FOOTER_TEXT.toString()
            : '',
        BUTTON_VALUES: JSON.stringify(this.addedButtons),
        CREATED_DATETIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        SUMITTED_DATETIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        STATUS: 'S',
      };
      datas.BODY_VALUES = Array.isArray(this.data.BODY_VALUES)
        ? JSON.stringify(this.data.BODY_VALUES)
        : JSON.stringify([this.data.BODY_VALUES]);
      this.api.createTemplate(datas).subscribe(
        (successCode) => {
          if (successCode['code'] == 300) {
            this.message.info('Template name already exists.', '');
            this.isSpinning = false;
            this.data.NAME = '';
          } else if (successCode['code'] == 200) {
            this.message.success('Template created successfully', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new whatsapptemplate();
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to create template', '');
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
  onFileSelected(event: any) {
    this.fileSizeimg = Number(
      parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(2)
    );
    if (this.fileSizeimg < 5) {
      this.visiblemedia = true;
      const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
      this.fileURL = <File>event.target.files[0];
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      if (this.IMG_URL != undefined && this.IMG_URL.trim() != '') {
        var arr = this.IMG_URL.split('/');
        if (arr.length > 1) {
          url = arr[5];
        }
      }
      this.IMAGE = url;
      this.isSpinning = true;
      this.api
        .onImageUpload(this.userId, 'WhatsAppTemplateImages', this.fileURL, url)
        .subscribe(
          (successCode) => {
            this.isSpinning = false;
            if (successCode.code == '200') {
              this.mediaIdImg = successCode.mediaId;
              this.message.success('Image uploaded successfully', '');
            }
            (err) => {
              if (err['ok'] == false) this.isSpinning = false;
              this.message.error('Failed to upload the image', '');
            };
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    } else {
      this.message.error('Please select image having size less than 5 MB', '');
      this.fileURL = null;
      this.IMAGE = '';
    }
  }
  checkInput() {
    if (this.data.HEADER_TEXT == '' || this.data.HEADER_TEXT == undefined) {
      this.showDynamicInput = false;
    }
    const regex = /}}(?!)/;
    if (this.data.HEADER_TEXT.includes('}}')) {
      this.showDynamicInput = true;
    }
    if (this.data.HEADER_TEXT.match(regex)) {
      this.i++;
    } else {
      this.inputValue = this.data.HEADER_TEXT;
    }
    this.check();
    this.Date = new Date();
  }
  check() {
    const pattern = /{{\d+}/g;
    const matches = this.data.HEADER_TEXT.match(pattern);
    if (matches && this.data.HEADER_VALUES != undefined) {
      for (let i = 0; i < matches.length; i++) {
        this.inputValue = this.inputValue.replace(
          matches[i].toString() ? matches[i].toString() : this.inputValue,
          this.data.HEADER_VALUES[i]
            ? this.data.HEADER_VALUES[i]
            : matches[i].toString()
        );
        this.inputValue = this.inputValue.replace(
          this.data.HEADER_VALUES[i] + '}',
          this.data.HEADER_VALUES[i]
        );
      }
    } else {
      this.inputValue = this.data.HEADER_TEXT;
    }
  }
  check1() {
    const pattern = /{{\d+}/g;
    const matches = this.data.BODY_TEXT.match(pattern);
    if (matches && this.data.BODY_VALUES != undefined) {
      for (let i = 0; i < matches.length; i++) {
        this.inputBody = this.inputBody.replace(
          matches[i].toString() ? matches[i].toString() : this.inputBody,
          this.data.BODY_VALUES[i]
            ? this.data.BODY_VALUES[i]
            : matches[i].toString()
        );
        this.inputBody = this.inputBody.replace(
          this.data.BODY_VALUES[i] + '}',
          this.data.BODY_VALUES[i] + ' '
        );
      }
    } else {
      this.inputBody = this.data.BODY_TEXT;
    }
  }
  checkInput1() {
    if (this.data.BODY_TEXT == '' || this.data.BODY_TEXT == undefined) {
      this.showDynamicInput1 = false;
    }
    if (this.data.BODY_TEXT.includes('}}')) {
      this.showDynamicInput1 = true;
    }
    const regex = /}}(?!)/;
    if (this.data.BODY_TEXT.match(regex)) {
      this.i++;
    } else {
      this.inputBody = this.data.BODY_TEXT;
    }
    this.check1();
    this.Date = new Date();
  }
  checkInputURL1() {
    if (this.WEBSITE_URL == '' || this.WEBSITE_URL == undefined) {
      this.showDynamicInputURL = false;
    }
    if (this.WEBSITE_URL.includes('}}')) {
      this.showDynamicInputURL = true;
    }
    const regex = /}}(?!)/;
    if (this.WEBSITE_URL.match(regex)) {
      this.i++;
    } else {
      this.tempinput = this.WEBSITE_URL;
    }
    this.checkInputURL();
  }
  checkInputURL() {
    const pattern = /{{\d+}/g;
    const matches = this.WEBSITE_URL.match(pattern);
    if (matches && this.URL_SAMPLE != undefined) {
      for (let i = 0; i < matches.length; i++) {
        this.tempinput = this.WEBSITE_URL.replace(
          matches[i].toString() ? matches[i].toString() : this.tempinput,
          this.URL_SAMPLE[i] ? this.URL_SAMPLE[i] : matches[i].toString()
        );
        this.tempinput = this.tempinput.replace(
          this.URL_SAMPLE[i] + '}',
          this.URL_SAMPLE[i] + ''
        );
      }
    }
  }
  clearbuttons() {
    this.visiblebuttonn = false;
    this.websitebuttontext = null;
    this.data.BUTTON_VALUES = '';
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onFileSelected1(event: any) {
    this.fileSizevid = Number(
      parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(2)
    );
    if (this.fileSizevid < 16) {
      this.visiblemedia = true;
      this.fileDataIMAGE_URL = <File>event.target.files[0];
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.video = reader.result as string;
        };
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileDataIMAGE_URL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = this.fileDataIMAGE_URL.name;
        this.isSpinning = true;
        this.api
          .onUpload1(
            this.userId,
            'WhatsAppTemplateImages',
            this.fileDataIMAGE_URL,
            url
          )
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.mediaIdVid = successCode.mediaId;
              this.mediaIdVid = url;
              this.message.success('Video uploaded successfully', '');
              this.isSpinning = false;
            }
            (err) => {
              if (err['ok'] == false)
                this.message.error('Failed to upload the video', '');
            };
          });
        this.event = url;
        this.VIDEO_URL = this.baseurl + 'upload/WhatsAppTemplateImages' + url;
      }
    } else {
      this.message.error('Please select video having size less than 16 MB', '');
      this.fileDataIMAGE_URL = null;
      this.VIDEO_URL = '';
    }
  }
  onFileSelected3(event) {
    this.fileURLPDF = <File>event.target.files[0];
    this.upload = event.target.files[0].name;
    this.DOCUMENT = this.imgUrl + 'WhatsAppTemplateImages/' + this.upload;
    let typeArry = event.target.files[0].name.split('.');
    this.TYPE = event.target.files[0].name.split('.')[typeArry.length - 1];
    this.fileSizedoc = Number(
      parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(2)
    );
    this.fileSizedocKB = Number(
      parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(0)
    );
    if (this.fileSizedoc < 100) {
      this.visiblemedia = true;
      this.isSpinning = true;
      this.api
        .onUploadFiles(this.userId, this.fileURLPDF)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.mediaIdDoc = successCode.mediaId;
            this.mediaIdDoc = this.fileURLPDF.name;
            this.message.success('File uploaded successfully', '');
            this.isSpinning = false;
          }
          (err) => {
            if (err['ok'] == false)
              this.message.error('Failed to upload file', '');
          };
        });
    } else {
      this.message.error(
        'Please select Document having size less than 100MB',
        ''
      );
    }
  }
  clearbuttons3() {
    this.visiblebuttonn = false;
    this.BUTTON12 = null;
    this.code = '';
  }
  clearbuttons1() {
    this.visiblebuttonn = false;
    this.BUTTON12 = null;
    this.code = '';
    this.array = this.array.filter(
      (item) => item.text !== undefined && item.text !== null
    );
  }
  clearcustom() {
    this.data.BUTTON_VALUES = null;
    this.tempcustom = '';
    this.visiblebuttonn = false;
  }
  clearbuttons2() {
    this.visiblebuttonn = false;
    this.BUTTON1 = null;
    this.mobile = null;
  }
  showfile() {
    const fileUrl = this.imgUrl + 'WhatsAppTemplateImages/' + this.upload;
    window.open(fileUrl);
  }
  offercode() {
    this.Date = new Date();
    if (this.data.BUTTON_VALUES == 'COPY_CODE') {
      this.BUTTON12 = 'Copy offer code';
    }
    if (this.data.BUTTON_VALUES == 'URL') {
      this.prefixValue = 'Http://';
    } else {
      this.prefixValue = '';
    }
    this.mobile = '';
    this.code = '';
    this.WEBSITE_URL = '';
    this.custom = '';
    if (this.phone == 1) {
      this.disablephone = true;
    }
    if (this.web == 2) {
      this.dsiableurl = true;
    }
    if (this.copy == 1) {
      this.disableoffer = true;
    }
    if (this.quick == 10) {
      this.disablecustom = true;
    }
  }
  addFamilyDetails() {
    if (this.FamilyDetails.length == 0) {
      this.FamilyDetails = [
        {
          Type: this.data.BUTTON_VALUES,
          Name: this.custom ? this.custom : '',
          mobile: this.mobile,
          code: this.code,
          WEBSITE_URL: this.prefixValue + this.WEBSITE_URL,
          websitebuttontext: this.websitebuttontext
            ? this.websitebuttontext
            : '',
          BUTTON1: this.BUTTON1 ? this.BUTTON1 : '',
          BUTTON12: this.BUTTON12 ? this.BUTTON12 : '',
          custom: this.custom ? this.custom : '',
          tempinput: this.tempinput ? this.tempinput : '',
        },
      ];
    } else {
      this.FamilyDetails = [
        ...this.FamilyDetails,
        {
          Type: this.data.BUTTON_VALUES,
          Name: this.custom ? this.custom : '',
          mobile: this.mobile,
          code: this.code,
          WEBSITE_URL: this.prefixValue + this.WEBSITE_URL,
          websitebuttontext: this.websitebuttontext
            ? this.websitebuttontext
            : '',
          BUTTON1: this.BUTTON1 ? this.BUTTON1 : '',
          BUTTON12: this.BUTTON12 ? this.BUTTON12 : '',
          custom: this.custom ? this.custom : '',
          tempinput: this.tempinput ? this.tempinput : '',
        },
      ];
      this.i++;
    }
    this.Type = '';
    this.Name = '';
    this.Value = '';
    this.mobile = '';
    this.code = '';
    this.WEBSITE_URL = '';
    this.websitebuttontext = '';
    this.custom = '';
    this.BUTTON1 = '';
    this.BUTTON12 = '';
    this.tempinput = '';
  }
  addData1() {
    if (
      this.data.BUTTON_VALUES == '' ||
      this.data.BUTTON_VALUES == null ||
      this.data.BUTTON_VALUES == undefined
    ) {
      this.message.error('Please Select Button', '');
    }
    const hasCopyCode = this.FamilyDetails.some(
      (detail) => detail.Type === 'COPY_CODE'
    );
    if (this.data.BUTTON_VALUES === 'COPY_CODE' && hasCopyCode) {
      this.message.error(
        'A button with Type "COPY_CODE" already exists,You can Add Only 1 Button Maximum',
        ''
      );
      return;
    }
    const urlCount = this.FamilyDetails.filter(
      (detail) => detail.Type === 'URL'
    ).length;
    if (this.data.BUTTON_VALUES === 'URL' && urlCount >= 2) {
      this.message.error(
        'You can add a maximum of two buttons with Type "URL".',
        ''
      );
      return;
    }
    const hasPhoneNumber = this.FamilyDetails.some(
      (detail) => detail.Type === 'PHONE_NUMBER'
    );
    if (this.data.BUTTON_VALUES === 'PHONE_NUMBER' && hasPhoneNumber) {
      this.message.error(
        'A button with Type "PHONE_NUMBER" already exists, You can Add Only 1 Button Maximum',
        ''
      );
      return;
    }
    this.array = [
      {
        type: 'QUICK_REPLY',
        text: this.tempcustom,
      },
      {
        type: 'URL',
        url: this.WEBSITE_URL,
        text: this.websitebuttontext,
      },
      {
        type: 'PHONE_NUMBER',
        text: this.BUTTON1,
        phone_number: '+910' + this.mobile,
      },
      {
        type: 'COPY_CODE',
        text: this.BUTTON12,
        example: [this.code],
      },
    ];
    const pattern = /{{\d+}}/g;
    if (this.WEBSITE_URL != undefined || this.WEBSITE_URL != null) {
      this.matches2 = this.WEBSITE_URL.match(pattern);
    }
    var isOk = true;
    if (this.data.BUTTON_VALUES == '') {
      this.message.error('Please select button and add details ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'URL' &&
      (this.websitebuttontext == undefined || this.websitebuttontext == '')
    ) {
      this.message.error('Please enter name of button ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'URL' &&
      (this.WEBSITE_URL == undefined || this.WEBSITE_URL.length == 0)
    ) {
      this.message.error('Please enter url ', '');
      isOk = false;
    } else if (this.matches2 != undefined && this.URL_SAMPLE != undefined) {
      if (this.matches2.length != this.URL_SAMPLE.length) {
        this.message.error(
          ' count of variable and sample values is not matching   ',
          ''
        );
        isOk = false;
      }
    } else if (this.matches2 != undefined && this.URL_SAMPLE == undefined) {
      this.message.error(
        'count of variable and sample values is not matching  ',
        ''
      );
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'PHONE_NUMBER' &&
      (this.BUTTON1 == undefined || this.BUTTON1 == '')
    ) {
      this.message.error('Please enter name of Button ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'PHONE_NUMBER' &&
      (this.mobile == undefined || this.mobile.length == 0)
    ) {
      this.message.error('Please enter mobile number ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'PHONE_NUMBER' &&
      !this.isValidMobile(this.mobile)
    ) {
      this.message.error('Please enter valid mobile number ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'COPY_CODE' &&
      (this.BUTTON12 == undefined || this.BUTTON12 == '')
    ) {
      this.message.error('Please enter name of Button ', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'COPY_CODE' &&
      (this.code == undefined || this.code.length == 0)
    ) {
      this.message.error('Please enter Offer Code', '');
      isOk = false;
    } else if (
      this.data.BUTTON_VALUES == 'QUICK_REPLY' &&
      (this.custom == undefined || this.custom == '')
    ) {
      this.message.error('Please enter name for custom button', '');
      isOk = false;
    }
    if (isOk) {
      if (this.WEBSITE_URL != '') {
        this.webtrue = true;
        this.web++;
      }
      if (this.mobile != '') {
        this.mobtrue = true;
        this.phone++;
      }
      if (this.code != '') {
        this.offertrue = true;
        this.copy++;
      }
      if (this.custom != '') {
        this.tempcustom = this.custom;
        this.quick++;
      }
      this.showtable = true;
      const newButton = {
        type: this.data.BUTTON_VALUES,
        buttonText:
          this.data.BUTTON_VALUES === 'PHONE_NUMBER'
            ? this.BUTTON1
            : this.data.BUTTON_VALUES === 'COPY_CODE'
              ? this.BUTTON12
              : this.data.BUTTON_VALUES === 'URL'
                ? this.websitebuttontext
                : this.custom,
      };
      this.addedButtons.push(newButton);
      if (this.temp == 10) {
        this.visiblebutton = true;
        this.message.info('You have reached  limit of adding buttons ', '');
      }
      this.temp++;
      if (this.temp > 0) {
        this.showtable = true;
        this.visiblebuttonn = false;
        this.message.success('Button added successfully ', '');
      }
      if (this.index1 > -1) {
        this.Type[this.index1]['Type'] = this.Type;
        (this.Name[this.index1]['Name'] = this.custom ? this.custom : ''),
          (this.mobile[this.index1]['Mobile'] = this.mobile);
        this.code[this.index1]['Code'] = this.code;
        this.WEBSITE_URL[this.index1]['Website'] =
          this.prefixValue + this.WEBSITE_URL;
        this.websitebuttontext[this.index1]['websitebuttontext'] =
          this.websitebuttontext;
        this.BUTTON1[this.index1]['BUTTON1'] = this.BUTTON1;
        this.BUTTON12[this.index1]['BUTTON12'] = this.BUTTON12;
        this.custom[this.index1]['custom'] = this.custom;
        this.tempinput[this.index1]['tempinput'] = this.tempinput;
        this.index1 = -1;
      } else {
        this.addFamilyDetails();
      }
      this.Type = '';
      this.Value = '';
      this.mobile = '';
      this.code = '';
      this.WEBSITE_URL = '';
      this.custom = '';
      this.BUTTON1 = '';
      this.BUTTON12 = '';
      this.tempinput = '';
      this.URL_SAMPLE = [];
    }
  }
  clearFields() {
    this.Type = '';
    this.Value = '';
    this.mobile = '';
    this.code = '';
    this.WEBSITE_URL = '';
    this.custom = '';
    this.BUTTON1 = '';
    this.BUTTON12 = '';
    this.tempinput = '';
    this.URL_SAMPLE = [];
  }
  clear(i: number): void {
    if (i >= 0 && i < this.FamilyDetails.length) {
      const removedElement = this.FamilyDetails.splice(i, 1)[0];
      this.addedButtons.splice(i, 1);
      if (removedElement.Type === 'QUICK_REPLY') {
        this.tempcustom = null;
        this.quick--;
      } else if (removedElement.Type === 'URL') {
        this.websitebuttontext = null;
        this.web--;
      } else if (removedElement.Type === 'PHONE_NUMBER') {
        this.BUTTON1 = null;
        this.phone--;
      } else if (removedElement.Type === 'COPY_CODE') {
        this.BUTTON12 = null;
        this.copy--;
      }
      this.message.success('Button removed successfully', '');
    }
    this.showtable = this.FamilyDetails.length > 0;
  }
  cancel() { }
  clearimg() {
    this.fileURL = null;
    this.visiblemedia = false;
    this.IMAGE = '';
  }
  clearvid() {
    this.fileDataIMAGE_URL = null;
    this.visiblemedia = false;
    this.VIDEO_URL = '';
  }
  cleardoc() {
    this.fileURLPDF = null;
    this.visiblemedia = false;
    this.DOCUMENT = '';
  }
  focus(inputElement: HTMLInputElement) {
    inputElement.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
    });
  }
  onFocus(event: FocusEvent) {
    this.focus(event.target as HTMLInputElement);
  }
  convertB() {
    const textArea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const selectedText = textArea?.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );
    if (selectedText) {
      const newText =
        textArea.value.slice(0, textArea.selectionStart) +
        `<strong>${selectedText}</strong>` +
        textArea.value.slice(textArea.selectionEnd);
      this.data.BODY_TEXT = newText;
    } else {
      if (this.data.BODY_TEXT === undefined) {
        this.data.BODY_TEXT = '<strong></strong>';
      }
      const bodyTextWithoutTags = this.data.BODY_TEXT.replace(
        /<\/?strong>/g,
        ''
      ); 
      this.data.BODY_TEXT = `<strong>${bodyTextWithoutTags}</strong>`;
    }
    this.checkInput1();
  }
  convertI() {
    const textArea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const selectedText = textArea?.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );
    if (selectedText) {
      const newText =
        textArea.value.slice(0, textArea.selectionStart) +
        `<em>${selectedText}</em>` +
        textArea.value.slice(textArea.selectionEnd);
      this.data.BODY_TEXT = newText;
    } else {
      if (this.data.BODY_TEXT === undefined) {
        this.data.BODY_TEXT = '<em></em>';
      }
      const bodyTextWithoutTags = this.data.BODY_TEXT.replace(/<\/?em>/g, ''); 
      this.data.BODY_TEXT = `<em>${bodyTextWithoutTags}</em>`;
    }
    this.checkInput1();
  }
  onEmojiSelect(event: any) {
    if (!this.data || typeof this.data.BODY_TEXT !== 'string') {
      this.data.BODY_TEXT = '';
    }
    const emojiCodePattern = /&#(x[\dA-Fa-f]+|\d+);/g;
    const emojiCodes = this.data.BODY_TEXT.match(emojiCodePattern);
    if (emojiCodes) {
      emojiCodes.forEach((emojiCode) => {
        try {
          const emojiChar = String.fromCodePoint(
            parseInt(
              emojiCode.slice(2, -1),
              emojiCode.startsWith('x') ? 16 : 10
            )
          );
          this.data.BODY_TEXT = this.data.BODY_TEXT.replace(
            emojiCode,
            emojiChar
          );
        } catch (error) {
        }
      });
    }
    const ev = Object.assign({}, event);
    const sub1 = this.data.BODY_TEXT.substring(0, this.cursorPosition || 0);
    const sub2 = this.data.BODY_TEXT.substring(
      this.cursorPosition || 0,
      this.data.BODY_TEXT.length
    );
    this.data.BODY_TEXT = sub1 + `${ev.emoji.native}` + sub2;
    this.cursorPosition = (sub1 + `${ev.emoji.native}`).length;
    this.checkInput1();
  }
  keyup(event: any): void {
    const textarea: any = document.getElementById('messages2');
    const cursorPosition = textarea.selectionStart;
    this.cursorPosition = cursorPosition;
  }
  onEditorMouseUp(event: MouseEvent): void {
    const textarea: any = document.getElementById('messages2');
    const cursorPosition = textarea.selectionStart;
    this.cursorPosition = cursorPosition;
  }
}