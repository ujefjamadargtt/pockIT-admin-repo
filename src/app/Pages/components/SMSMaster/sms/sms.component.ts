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
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { smsmaster } from 'src/app/Pages/Models/smsmaster';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css'],
})
export class SmsComponent {
  @Input() drawerClose: any;
  @Input() data: smsmaster;
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
  isFocused: string = '';
  textshow;
  fileDataIMAGE_URL: any = null;
  image;
  visiblemedia: boolean = false;
  VIDEO_URL;
  event;
  fileURLPDF: any = null;
  imgurl = appkeys.retriveimgUrl;
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
  ngOnInit() {
    this.getLanguageData();
  }
  LanguageData: any = [];
  getLanguageData() {
    this.api.getLanguageData(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.LanguageData = data['data'];
        } else {
          this.LanguageData = [];
          this.message.error('Failed To Get Language Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  replaceSpacesWithUnderscores(): void {
    if (this.data.TEMPLATE_NAME) {
      this.data.TEMPLATE_NAME = this.data.TEMPLATE_NAME.replace(/ /g, '_');
    }
  }
  close(): void {
    this.drawerClose();
  }
  isValidMobile(mobile) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  isValidpat(body) {
    const expression = /}}[.,]?[a-zA-Z]+/;
    return expression.test(String('' + body).toLowerCase());
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new smsmaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s_]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    const pattern = /{{\d+}}/g;
    if (
      this.data.TEMPLATE_BODY != undefined ||
      this.data.TEMPLATE_BODY != null
    ) {
      this.matches = this.data.TEMPLATE_BODY.match(pattern);
    }
    if (this.text != undefined || this.text != null) {
      this.matches1 = this.text.match(pattern);
    }
    var isOk = true;
    if (
      (this.data.TEMPLATE_NAME == undefined ||
        this.data.TEMPLATE_NAME == null ||
        this.data.TEMPLATE_NAME.trim() == '') &&
      (this.data.CATEGORY == undefined || this.data.CATEGORY == null) &&
      (this.data.LANGUAGE_CODE == undefined ||
        this.data.LANGUAGE_CODE == null) &&
      (this.data.TEMPLATE_BODY == undefined ||
        this.data.TEMPLATE_BODY == null ||
        this.data.TEMPLATE_BODY.trim() == '')
    ) {
      this.message.error('Please enter all required fields', '');
      isOk = false;
    } else if (
      this.data.TEMPLATE_NAME == undefined ||
      this.data.TEMPLATE_NAME == null ||
      this.data.TEMPLATE_NAME.trim() == ''
    ) {
      this.message.error('Please Enter Template Name', '');
      isOk = false;
    } else if (this.data.CATEGORY == undefined || this.data.CATEGORY == null) {
      this.message.error('Please Select Category', '');
      isOk = false;
    }
    else if (
      this.data.LANGUAGE_CODE == undefined ||
      this.data.LANGUAGE_CODE == null
    ) {
      this.message.error('Please Select Language', '');
      isOk = false;
    } else if (
      this.data.TEMPLATE_BODY == undefined ||
      this.data.TEMPLATE_BODY == null ||
      this.data.TEMPLATE_BODY.trim() == ''
    ) {
      this.message.error('Please Enter Body of Template', '');
      isOk = false;
    } else if (this.data.TEMPLATE_BODY != undefined) {
      const count = this.data.TEMPLATE_BODY.split('&#160;').length - 1;
      if (count > 1) {
        this.message.error(
          'In Body Only single space allowed between two characters',
          ''
        );
        isOk = false;
      }
    }
    else if (this.matches != undefined && this.data.BODY_VALUES != undefined) {
      if (this.matches.length != this.data.BODY_VALUES.length) {
        this.message.error(
          'Count of variables in Body and sample values are mismatching  ',
          ''
        );
        isOk = false;
      }
    } else if (
      this.matches != undefined &&
      this.data.BODY_VALUES == undefined
    ) {
      this.message.error(
        'Count of variables in Body and sample values are mismatching  ',
        ''
      );
      isOk = false;
    }
    if (isOk) {
      for (const char of this.data.TEMPLATE_NAME) {
        if (char === ' ') {
          this.NAME += '_';
        } else if (char === char.toUpperCase()) {
          this.NAME += char.toLowerCase();
        } else {
          this.NAME += char;
        }
      }
      this.NAME1 = this.data.TEMPLATE_BODY.replace(/&#34/g, '"')
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
      var datas = {
        WP_CLIENT_ID: this.userId,
        TEMPLATE_NAME: this.NAME,
        LANGUAGE_CODE: this.data.LANGUAGE_CODE,
        CATEGORY: this.data.CATEGORY,
        TEMPLATE_BODY: this.NAME1.toString(),
        BODY_VALUES: this.data.BODY_VALUES,
        DESCRIPTION: this.data.DESCRIPTION,
        CREATED_DATETIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        SUMITTED_DATETIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        STATUS: 'S',
        IS_ACTIVE: this.data.IS_ACTIVE,
      };
      if (this.data.ID) {
        if (this.data.DESCRIPTION == '') {
          this.data.DESCRIPTION = null;
        }
        this.data.BODY_VALUES = Array.isArray(this.data.BODY_VALUES)
          ? JSON.stringify(this.data.BODY_VALUES)
          : JSON.stringify([this.data.BODY_VALUES]);
        this.api.updateSmsTemplate(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Template Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Template Updation Failed', '');
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
        datas.BODY_VALUES = Array.isArray(this.data.BODY_VALUES)
          ? JSON.stringify(this.data.BODY_VALUES)
          : JSON.stringify([this.data.BODY_VALUES]);
        this.api.createSmsTemplate(datas).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Template Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new smsmaster();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed to Create Template', '');
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
      this.IMAGE = this.baseurl + 'static/templateMedia/' + url;
      this.isSpinning = true;
    } else {
      this.message.error('Please Select Image having size less than 5 MB', '');
      this.fileURL = null;
      this.IMAGE = '';
    }
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
        this.event = url;
        this.VIDEO_URL = this.baseurl + 'static/templateMedia/' + url;
      }
    } else {
      this.message.error('Please Select Video having size less than 16 MB', '');
      this.fileDataIMAGE_URL = null;
      this.VIDEO_URL = '';
    }
  }
  onFileSelected3(event) {
    this.fileURLPDF = <File>event.target.files[0];
    this.upload = event.target.files[0].name;
    this.DOCUMENT = this.imgurl + 'templateMedia/' + this.upload;
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
    } else {
      this.message.error(
        'Please select Document having size less than 100MB',
        ''
      );
    }
  }
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
  check1() {
    const pattern = /{{\d+}/g;
    const matches = this.data.TEMPLATE_BODY.match(pattern);
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
      this.inputBody = this.data.TEMPLATE_BODY;
    }
  }
  checkInput1() {
    if (this.data.TEMPLATE_BODY == '' || this.data.TEMPLATE_BODY == undefined) {
      this.showDynamicInput1 = false;
    }
    if (this.data.TEMPLATE_BODY.includes('}}')) {
      this.showDynamicInput1 = true;
    }
    const regex = /}}(?!)/;
    if (this.data.TEMPLATE_BODY.match(regex)) {
      this.i++;
    } else {
      this.inputBody = this.data.TEMPLATE_BODY;
    }
    this.check1();
    this.Date = new Date();
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
      this.data.TEMPLATE_BODY = newText;
    } else {
      if (this.data.TEMPLATE_BODY === undefined) {
        this.data.TEMPLATE_BODY = '<strong></strong>';
      }
      const bodyTextWithoutTags = this.data.TEMPLATE_BODY.replace(
        /<\/?strong>/g,
        ''
      ); 
      this.data.TEMPLATE_BODY = `<strong>${bodyTextWithoutTags}</strong>`;
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
      this.data.TEMPLATE_BODY = newText;
    } else {
      if (this.data.TEMPLATE_BODY === undefined) {
        this.data.TEMPLATE_BODY = '<em></em>';
      }
      const bodyTextWithoutTags = this.data.TEMPLATE_BODY.replace(
        /<\/?em>/g,
        ''
      ); 
      this.data.TEMPLATE_BODY = `<em>${bodyTextWithoutTags}</em>`;
    }
    this.checkInput1();
  }
  onEmojiSelect(event: any) {
    const emojiCodePattern = /&#(x[\dA-Fa-f]+|\d+);/g;
    const emojiCodes = this.data.TEMPLATE_BODY.match(emojiCodePattern);
    if (emojiCodes) {
      emojiCodes.forEach((emojiCode) => {
        try {
          const emojiChar = String.fromCodePoint(
            parseInt(
              emojiCode.slice(2, -1),
              emojiCode.startsWith('x') ? 16 : 10
            )
          );
          this.data.TEMPLATE_BODY = this.data.TEMPLATE_BODY.replace(
            emojiCode,
            emojiChar
          );
        } catch (error) { }
      });
    }
    var ev = Object.assign({}, event);
    var sub1 = '';
    var sub2 = '';
    sub1 = this.data.TEMPLATE_BODY.substring(0, this.cursorPosition);
    sub2 = this.data.TEMPLATE_BODY.substring(
      this.cursorPosition,
      this.data.TEMPLATE_BODY.length
    );
    this.data.TEMPLATE_BODY = sub1 + `${ev.emoji.native}` + sub2;
    var t = sub1 + `${ev.emoji.native}`;
    this.cursorPosition = t.length;
    this.checkInput1();
  }
}
