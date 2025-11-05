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
import { emailtemplate } from 'src/app/Pages/Models/emailtemplate';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
})
export class EmailTemplateComponent {
  @Input() data: any = emailtemplate;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  isFocused: string = '';
  public commonFunction = new CommonFunctionService();
  URL_SAMPLE;
  isSpinning = false;
  loadingForm = false;
  websitebuttontext;
  WEBSITE_URL: any = [];
  namepatt = /^[a-z]+_*[a-z]+$/;
  mobpattern = /^[6-9]\d{9}$/;
  inputValuess1: any[] = [];
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
  ngOnInit() {
    this.setEditorConfig();
    this.getallLanguages();
    this.getTemplateCategories();
    // this.getBodyValues();
    if (this.data.ID && this.data.BODY_VALUES !== '[null]') {
      this.showDynamicInput1 = true;
    }
  }

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }
  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  replaceSpacesWithUnderscores(): void {
    if (this.data.TEMPLATE_NAME) {
      this.data.TEMPLATE_NAME = this.data.TEMPLATE_NAME.replace(/ /g, '_');
    }
  }

  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s_]*$/; // Updated pattern
    const char = String.fromCharCode(event.keyCode || event.which);

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  LangugageData: any[] = [];
  getallLanguages() {
    this.api.getLanguageData(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.LangugageData = data['data'];
          this.isSpinning = false;
        } else {
          this.LangugageData = [];
          this.message.error('Failed to get Langugae data...', '');
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something went wrong.', '');
        }
      }
    );
  }
  onTemplateCategorySelect(id) {
    if (id) {
      this.getBodyValues();
    }
  }
  service: any;
  editorConfig2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '80px',
    //  minHeight: '0',
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
    sanitize: true,
    toolbarPosition: 'top',
  };
  getBodyValues() {
    this.api
      .getEmailBodyValues(
        0,
        0,
        '',
        'desc',
        ' AND TEMPLATE_CATEGORY_ID = ' + this.data.TEMPLATE_CATEGORY_ID
      )
      .subscribe((data) => {
        if (data['count'] > 0 && data['data'].length > 0) {
          this.inputValuess1 = data['data'];
        }
      });
  }
  checkInput1() {
    if (
      this.data.BODY == '' ||
      this.data.BODY == undefined ||
      this.data.BODY == null
    ) {
      this.showDynamicInput1 = false;
    }
    if (this.data.BODY.includes('}}')) {
      this.showDynamicInput1 = true;
    }
    const regex = /}}(?!)/;

    if (this.data.BODY.match(regex)) {
      this.i++;
    } else {
      this.inputBody = this.data.BODY;
    }
    this.check1();
    this.Date = new Date();
  }
  // check1() {
  //   const pattern = /{{\d+}/g;
  //   const matches = this.data.BODY.match(pattern);

  //   if (matches && this.data.BODY_VALUES != undefined) {
  //     for (let i = 0; i < matches.length; i++) {
  //       this.inputBody = this.inputBody.replace(
  //         matches[i].toString() ? matches[i].toString() : this.inputBody,
  //         this.data.BODY_VALUES[i]
  //           ? this.data.BODY_VALUES[i]
  //           : matches[i].toString()
  //       );
  //       this.inputBody = this.inputBody.replace(
  //         this.data.BODY_VALUES[i] + '}',
  //         this.data.BODY_VALUES[i] + ' '
  //       );
  //     }
  //   } else {
  //     this.inputBody = this.data.BODY;
  //   }
  // }
  check1() {
    const pattern = /{{\d+}}/g;
    const matches = this.data.BODY.match(pattern);

    // Check if there are matches and BODY_VALUES are not empty
    if (matches && this.data.BODY_VALUES && this.data.BODY_VALUES.length > 0) {
      let bodyContent = this.data.BODY;

      let matchIndex = 0;
      for (let i = 0; i < matches.length; i++) {
        // Safeguard: Ensure we have a valid value before calling split
        const valueWithIndex = this.data.BODY_VALUES[matchIndex];

        // Only proceed if the value exists
        if (valueWithIndex) {
          // Extract the original value without the index
          const value = valueWithIndex.split('_')[0]; // This will give the same base value (e.g., 'hii')

          bodyContent = bodyContent.replace(matches[i], value);
        }

        matchIndex++;
        // Ensure we don't go out of bounds (repeat the same value if we reach the end)
        if (matchIndex >= this.data.BODY_VALUES.length) {
          matchIndex = this.data.BODY_VALUES.length - 1; // Loop through values, allowing duplicates
        }
      }

      this.inputBody = bodyContent; // Update with final body content
    } else {
      this.inputBody = this.data.BODY; // Fallback if no matches or BODY_VALUES are empty
    }
  }

  generateUniqueValue(option: string): string {
    // You can use a timestamp or a random string for uniqueness
    const uniqueId = Date.now().toString(); // Or use a more complex method if needed

    return `${option}-${uniqueId}`; // Concatenate the entered value with the unique identifier
  }

  // convertB() {
  //   // Wrap the text in <strong> tags if not already present
  //   if (this.data.BODY === undefined) {
  //     this.data.BODY = '<strong></strong>';
  //   }

  //   // Ensure that new input is always inside the <strong> tags
  //   const bodyTextWithoutTags = this.data.BODY.replace(/<\/?strong>/g, ''); // Remove existing tags
  //   this.data.BODY = `<strong>${bodyTextWithoutTags}</strong>`;

  //   this.checkInput1();
  // }

  // convertI() {
  //   // this.data.BODY += '_';
  //   // this.italici++;
  //   // if (this.italici % 2 === 0) {
  //   //   this.data.BODY = this.data.BODY.replace(/\_/g, '<em>');
  //   // } else {
  //   //   this.data.BODY = this.data.BODY.replace(/\_/g, '</em>');
  //   // }
  //   // this.checkInput1();

  //   // Wrap the text in <em> tags if not already present
  //   if (this.data.BODY === undefined) {
  //     this.data.BODY = '<em></em>';
  //   }

  //   // Ensure that new input is always inside the <em> tags
  //   const bodyTextWithoutTags = this.data.BODY.replace(/<\/?em>/g, ''); // Remove existing tags
  //   this.data.BODY = `<em>${bodyTextWithoutTags}</em>`;

  //   this.checkInput1();
  // }
  convertB() {
    const textArea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const selectedText = textArea?.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );

    if (selectedText) {
      // Wrap the selected text in <strong> tags
      const newText =
        textArea.value.slice(0, textArea.selectionStart) +
        `<strong>${selectedText}</strong>` +
        textArea.value.slice(textArea.selectionEnd);

      this.data.BODY = newText;
    } else {
      // If no text is selected, apply <strong> around the whole body content
      if (this.data.BODY === undefined) {
        this.data.BODY = '<strong></strong>';
      }

      const bodyTextWithoutTags = this.data.BODY.replace(/<\/?strong>/g, ''); // Remove existing tags
      this.data.BODY = `<strong>${bodyTextWithoutTags}</strong>`;
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
      // Wrap the selected text in <em> tags
      const newText =
        textArea.value.slice(0, textArea.selectionStart) +
        `<em>${selectedText}</em>` +
        textArea.value.slice(textArea.selectionEnd);

      this.data.BODY = newText;
    } else {
      // If no text is selected, apply <em> around the whole body content
      if (this.data.BODY === undefined) {
        this.data.BODY = '<em></em>';
      }

      const bodyTextWithoutTags = this.data.BODY.replace(/<\/?em>/g, ''); // Remove existing tags
      this.data.BODY = `<em>${bodyTextWithoutTags}</em>`;
    }

    this.checkInput1();
  }

  close() {
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
  // export class emailtemplate {
  //   ID: number;
  //   TEMPLATE_NAME: any;
  //   SUBJECT: any;
  //   BODY: any;
  //   ATTACHMENTS: any;
  //   IS_ACTIVE: boolean;
  //   BODY_VALUES: any;
  //   BODY: any;
  //   DESCRIPTION: any;
  //   LANGUAGE_CODE: any;
  //   TEMPLATE_CATEGORY_ID: null;
  // }

  // save(addNew: boolean): void {
  //   const pattern = /{{\d+}}/g;

  //   // Match patterns in BODY_TEXT and text
  //   this.matches = this.data.BODY_VALUES?.match(pattern) || [];
  //   this.matches1 = this.text?.match(pattern) || [];

  //   let isOk = true;

  //   // Validate required fields
  //   if (!this.data.TEMPLATE_NAME?.trim()) {
  //     this.message.error('Please enter name', '');
  //     isOk = false;
  //   } else if (!this.data.TEMPLATE_CATEGORY_ID) {
  //     this.message.error('Please select Type', '');
  //     isOk = false;
  //   } else if (!this.data.LANGUAGE_CODE) {
  //     this.message.error('Please select Language', '');
  //     isOk = false;
  //   } else if (!this.data.TEMPLATE_BODY?.trim()) {
  //     this.message.error('Please enter Body of Template', '');
  //     isOk = false;
  //   } else if (
  //     this.data.TEMPLATE_BODY &&
  //     this.data.TEMPLATE_BODY.split('&#160;').length - 1 > 1
  //   ) {
  //     this.message.error(
  //       'In Body Only single space allowed between two characters',
  //       ''
  //     );
  //     isOk = false;
  //   } else if (
  //     this.matches?.length &&
  //     this.data.TEMPLATE_BODY?.length !== this.matches.length
  //   ) {
  //     this.message.error(
  //       'Count of variables in Body and sample values are mismatching',
  //       ''
  //     );
  //     isOk = false;
  //   }

  //   if (isOk) {
  //     // Process TEMPLATE_NAME
  //     this.NAME = this.data.TEMPLATE_NAME.replace(/ /g, '_').replace(
  //       /[A-Z]/g,
  //       (char) => char.toLowerCase()
  //     );

  //     // Process BODY_TEXT
  //     this.NAME1 = this.data.BODY_VALUES.replace(/&#34/g, '"')
  //       .replace(/<span>|<\/span>|<br>|<div>|<\/div>/g, '')
  //       .replace(/<strong>|<\/strong>/g, '*')
  //       .replace(/<em>|<\/em>|<i>|<\/i>/g, '_')
  //       .replace(/&#160/g, '	');

  //     // Process FamilyDetails
  //     this.array1 = this.FamilyDetails.map((familyDetail) => {
  //       if (familyDetail.Type === 'QUICK_REPLY') {
  //         return { type: 'QUICK_REPLY', text: familyDetail.custom };
  //       } else if (familyDetail.Type === 'URL') {
  //         return {
  //           type: 'URL',
  //           url: familyDetail.WEBSITE_URL,
  //           text: familyDetail.websitebuttontext,
  //           example: [familyDetail.tempinput],
  //         };
  //       } else if (familyDetail.Type === 'PHONE_NUMBER') {
  //         return {
  //           type: 'PHONE_NUMBER',
  //           text: familyDetail.BUTTON1,
  //           phone_number: `+910${familyDetail.mobile}`,
  //         };
  //       } else if (familyDetail.Type === 'COPY_CODE') {
  //         return {
  //           type: 'COPY_CODE',
  //           text: familyDetail.BUTTON12,
  //           example: [familyDetail.code],
  //         };
  //       }
  //       return null;
  //     }).filter((item) => item?.text);

  //     // Filter array1
  //     const filteredArray = this.array1.filter((item) =>
  //       this.FamilyDetails.some((detail) => item.type === detail.Type)
  //     );

  //     // Prepare data for API
  //     const datas = {
  //       WP_CLIENT_ID: this.userId,
  //       NAME: this.NAME,
  //       LANGUAGES: this.data.LANGUAGE_CODE,
  //       CATEGORY: this.data.TEMPLATE_CATEGORY_ID,
  //       BODY_TEXT: this.NAME1.toString(),
  //       BODY_VALUES: this.data.BODY_VALUES,
  //       BUTTON_VALUES: null,
  //       CREATED_DATETIME: this.datePipe.transform(
  //         new Date(),
  //         'yyyy-MM-dd HH:mm:ss'
  //       ),
  //       SUMITTED_DATETIME: this.datePipe.transform(
  //         new Date(),
  //         'yyyy-MM-dd HH:mm:ss'
  //       ),
  //       STATUS: 'S',
  //     };

  //     // API Call
  //     this.api.createEmailTemplate(datas).subscribe((response) => {
  //       this.isSpinning = false;
  //       if (response.code === '200') {
  //         this.message.success('Template Created Successfully', '');
  //         if (!addNew) this.drawerClose();
  //         else this.data = new emailtemplate();
  //       } else {
  //         this.message.error('Failed to Create Template', '');
  //       }
  //     });
  //     // this.api.createTemplate(datas).subscribe((response) => {
  //     //   this.isSpinning = false;
  //     //   if (response.code === "200") {
  //     //     this.message.success("Template Created Successfully", "");
  //     //     if (!addNew) this.drawerClose();
  //     //     else this.data = new emailtemplate();
  //     //   } else {
  //     //     this.message.error("Failed to Create Template", "");
  //     //   }
  //     // });
  //   }
  // }
  // handleEnter(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     event.preventDefault(); // Prevent default Enter behavior
  //     this.data.BODY += '\n'; // Append newline character
  //   }
  // }
  // handleEnter(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     event.preventDefault(); // Prevent default enter behavior

  //     const textarea = event.target as HTMLTextAreaElement;
  //     const cursorPos = textarea.selectionStart;
  //     const textBefore = this.data.BODY.substring(0, cursorPos);
  //     const textAfter = this.data.BODY.substring(cursorPos);

  //     // Insert \n at cursor position
  //     this.data.BODY = textBefore + '\n' + textAfter;

  //     // Move cursor to the correct position
  //     setTimeout(() => {
  //       textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
  //     });
  //   }
  // }
  handleEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default Enter behavior

      const textarea = event.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const textBefore = this.data.BODY.substring(0, cursorPos);
      const textAfter = this.data.BODY.substring(cursorPos);

      // Insert a newline
      this.data.BODY = textBefore + '\n' + textAfter;

      // Move cursor to the correct position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
      });
    }
  }

  // Convert \n to <br> before saving
  saveFormattedData(): void {
    if (this.data.BODY) {
      this.data.BODY = this.data.BODY.replace(/\n/g, '<br>');
    }
  }

  // Convert <br> back to \n for displaying inside the textarea
  getFormattedText(): string {
    return this.data.BODY ? this.data.BODY.replace(/<br>/g, '\n') : '';
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    const pattern = /{{\d+}}/g;
    if (this.data.BODY != undefined || this.data.BODY != null) {
      this.matches = this.data.BODY.match(pattern);
    }
    if (this.text != undefined || this.text != null) {
      this.matches1 = this.text.match(pattern);
    }
    var isOk = true;
    if (
      (this.data.TEMPLATE_NAME == undefined ||
        this.data.TEMPLATE_NAME == null ||
        this.data.TEMPLATE_NAME.trim() == '') &&
      (this.data.TEMPLATE_CATEGORY_ID == undefined ||
        this.data.TEMPLATE_CATEGORY_ID == null) &&
      (this.data.LANGUAGE_CODE == undefined ||
        this.data.LANGUAGE_CODE == null) &&
      (this.data.BODY == undefined ||
        this.data.BODY == null ||
        this.data.BODY.trim() == '') &&
      (this.data.SUBJECT == undefined ||
        this.data.SUBJECT == null ||
        this.data.SUBJECT.trim() == '')
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
    } else if (
      this.data.TEMPLATE_CATEGORY_ID == undefined ||
      this.data.TEMPLATE_CATEGORY_ID == null
    ) {
      this.message.error('Please Select Template Category', '');
      isOk = false;
    } else if (
      this.data.LANGUAGE_CODE == undefined ||
      this.data.LANGUAGE_CODE == null
    ) {
      this.message.error('Please Select Language', '');
      isOk = false;
    } else if (
      this.data.SUBJECT == undefined ||
      this.data.SUBJECT == null ||
      this.data.SUBJECT.trim() == ''
    ) {
      this.message.error('Please Enter Subject', '');
      isOk = false;
    } else if (
      this.data.BODY == undefined ||
      this.data.BODY == null ||
      this.data.BODY.trim() == ''
    ) {
      this.message.error('Please Enter Body of Template', '');
      isOk = false;
    } else if (this.data.BODY != undefined) {
      const count = this.data.BODY.split('&#160;').length - 1;
      // if (count > 1) {
      //   this.message.error(
      //     'In Body Only single space allowed between two characters',
      //     ''
      //   );
      //   isOk = false;
      // }
    } else if (
      this.matches != undefined &&
      this.data.BODY_VALUES != undefined
    ) {
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
      this.NAME1 = this.data.BODY.replace(/&#34/g, '"')
        .replace(/<span>/g, '')
        .replace(/<\/span>/g, '')
        // .replace(/<br>/g, '\n')
        .replace(/<br>/g, '')
        // .replace(/<strong>/g, '*')
        // .replace(/<\/strong>/g, '*')
        .replace(/<em>/g, '_')
        .replace(/<\/em>/g, '_')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, ' ')
        .replace(/&#160/g, '\t')
        .replace(/<i>/g, '_')
        .replace(/<\/i>/g, '_');
      // .replace(/<p class="center">/g, '<p style="text-align: center;">');

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
        TEMPLATE_CATEGORY_ID: this.data.TEMPLATE_CATEGORY_ID,
        SUBJECT: this.data.SUBJECT,
        BODY: this.NAME1.toString(),
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

        this.api.updateEmailTemplate(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Template Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Template Updation Failed', '');
              this.isSpinning = false;
            }
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            };
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

        this.api.createEmailTemplate(datas).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Template Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new emailtemplate();
                this.resetDrawer(websitebannerPage);
                this.isSpinning = false;
              }
            } else {
              this.message.error('Failed to Create Template', '');
              this.isSpinning = false;
            }
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            };
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
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new emailtemplate();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  onFileSelected1(event: any) {
    //   this.fileSizeimg = Number(
    //     parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(2)
    //   );
    //   if (this.fileSizeimg < 5) {
    //     this.visiblemedia = true;
    //     const reader = new FileReader();
    //     const [file] = event.target.files;
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //       this.image = reader.result as string;
    //     };
    //     this.fileURL = <File>event.target.files[0];
    //     var number = Math.floor(100000 + Math.random() * 900000);
    //     var fileExt = this.fileURL.name.split(".").pop();
    //     var d = this.datePipe.transform(new Date(), "yyyyMMdd");
    //     var url = "";
    //     url = d == null ? "" : d + number + "." + fileExt;
    //     if (this.IMG_URL != undefined && this.IMG_URL.trim() != "") {
    //       var arr = this.IMG_URL.split("/");
    //       if (arr.length > 1) {
    //         url = arr[5];
    //       }
    //     }
    //     this.IMAGE = this.baseurl + "static/templateMedia/" + url;
    //     this.isSpinning = true;
    //     // this.api
    //     //   .onUpload(this.userId, 'templateMedia', this.fileURL, url)
    //     //   .subscribe((successCode) => {
    //     //     if (successCode.code == '200') {
    //     //       this.mediaIdImg = successCode.mediaId;
    //     //       this.message.success('Image Uploaded Successfully', '');
    //     //       this.isSpinning = false;
    //     //     }
    //     //     (err) => {
    //     //       if (err['ok'] == false)
    //     //         this.message.error('Failed to Upload the Image', '');
    //     //     };
    //     //   });
    //   } else {
    //     this.message.error("Please Select Image having size less than 5 MB", "");
    //     this.fileURL = null;
    //     this.IMAGE = "";
    //   }
  }

  // checkInput() {
  //   if (this.data.HEADER_TEXT == '' || this.data.HEADER_TEXT == undefined) {
  //     this.showDynamicInput = false;
  //   }

  //   const regex = /}}(?!)/;
  //   if (this.data.HEADER_TEXT.includes('}}')) {
  //     this.showDynamicInput = true;
  //   }

  //   if (this.data.HEADER_TEXT.match(regex)) {
  //     this.i++;
  //   } else {
  //     this.inputValue = this.data.HEADER_TEXT;
  //   }
  //   this.check();
  //   this.Date = new Date();
  // }
  // check() {
  //   const pattern = /{{\d+}/g;
  //   const matches = this.data.HEADER_TEXT.match(pattern);
  //   if (matches && this.data.HEADER_VALUES != undefined) {
  //     for (let i = 0; i < matches.length; i++) {
  //       this.inputValue = this.inputValue.replace(
  //         matches[i].toString() ? matches[i].toString() : this.inputValue,
  //         this.data.HEADER_VALUES[i]
  //           ? this.data.HEADER_VALUES[i]
  //           : matches[i].toString()
  //       );
  //       this.inputValue = this.inputValue.replace(
  //         this.data.HEADER_VALUES[i] + '}',
  //         this.data.HEADER_VALUES[i]
  //       );
  //     }
  //   } else {
  //     this.inputValue = this.data.HEADER_TEXT;
  //   }
  // }

  // check1() {
  //   const pattern = /{{\d+}/g;
  //   const matches = this.data.BODY_TEXT.match(pattern);

  //   if (matches && this.data.BODY_VALUES != undefined) {
  //     for (let i = 0; i < matches.length; i++) {
  //       this.inputBody = this.inputBody.replace(
  //         matches[i].toString() ? matches[i].toString() : this.inputBody,
  //         this.data.BODY_VALUES[i]
  //           ? this.data.BODY_VALUES[i]
  //           : matches[i].toString()
  //       );
  //       this.inputBody = this.inputBody.replace(
  //         this.data.BODY_VALUES[i] + '}',
  //         this.data.BODY_VALUES[i] + ' '
  //       );
  //     }
  //   } else {
  //     this.inputBody = this.data.BODY_TEXT;
  //   }
  // }

  // checkInput1() {
  //   if (this.data.BODY_TEXT == '' || this.data.BODY_TEXT == undefined) {
  //     this.showDynamicInput1 = false;
  //   }
  //   if (this.data.BODY_TEXT.includes('}}')) {
  //     this.showDynamicInput1 = true;
  //   }
  //   const regex = /}}(?!)/;

  //   if (this.data.BODY_TEXT.match(regex)) {
  //     this.i++;
  //   } else {
  //     this.inputBody = this.data.BODY_TEXT;
  //   }
  //   this.check1();
  //   this.Date = new Date();
  // }

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
  // templateCategories = [
  //   { Id: 'Welcome Email', Name: 'Welcome Email' },
  //   { Id: 'Password Reset', Name: 'Password Reset' },
  //   { Id: 'Appointment Confirmation', Name: 'Appointment Confirmation' },
  //   { Id: 'Order Notification', Name: 'Order Notification' },
  //   { Id: 'Promotional Email', Name: 'Promotional Email' },
  //   { Id: 'Follow-up Email', Name: 'Follow-up Email' },
  //   { Id: 'Feedback Request', Name: 'Feedback Request' },
  //   { Id: 'Other', Name: 'Other' },
  // ];
  templateCategories: any = [];
  getTemplateCategories() {
    this.api.getTemplateCategoryData(0, 0, '', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.templateCategories = data['data'];

          //this.loadFilters();
        } else {
          this.templateCategories = [];
          this.message.error('Something Went Wrong ...', '');
        }
      },
      (err: HttpErrorResponse) => {
        // this.loadingRecords = false;
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
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onFileSelected(event: any) {
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
        // this.api
        //   .onUpload1(this.userId, 'templateMedia', this.fileDataIMAGE_URL, url)
        //   .subscribe((successCode) => {
        //     if (successCode.code == '200') {
        //       this.mediaIdVid = successCode.mediaId;
        //       this.message.success('Video Uploaded Successfully', '');
        //       this.isSpinning = false;
        //     }
        //     (err) => {
        //       if (err['ok'] == false)
        //         this.message.error('Failed to Upload the Video', '');
        //     };
        //   });

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
      // this.api
      //   .onUploadFiles(this.userId, this.fileURLPDF)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      //       this.mediaIdDoc = successCode.mediaId;
      //       this.message.success('File Uploaded Successfully', '');
      //       this.isSpinning = false;
      //     }
      //     (err) => {
      //       if (err['ok'] == false)
      //         this.message.error('Failed to Upload the File', '');
      //     };
      //   });
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

  // using prompt
  insertCustomButton() {
    const buttonText = prompt('Enter Button Name', 'Click Here'); // Get button name
    if (!buttonText) return; // Prevent empty buttons

    const buttonLink = prompt('Enter Button Link', 'https://example.com'); // Get button link
    if (!buttonLink) return; // Prevent empty links

    const buttonHtml = `
      <div style=" margin-top: 10px;">
        <a href="${buttonLink}" target="_blank"
          style="display: inline-block; background-color: #ff6100; color: white !important;
          padding: 10px 20px; border-radius: 5px; text-decoration: none;
          font-weight: bold; border: none; cursor: pointer; font-size: 16px;">
          ${buttonText} <!-- Custom Button Text -->
        </a>
      </div>`;

    // Insert into Angular Editor
    this.data.BODY = this.data.BODY ? this.data.BODY + buttonHtml : buttonHtml;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const toolbar = document.querySelector('.angular-editor-toolbar');

      if (toolbar) {
        // Create a new toolbar button
        const button = document.createElement('button');
        button.innerHTML = '🔗 Insert Button';
        button.style.position = 'absolute';
        button.style.top = '38px'; // Move slightly above the toolbar
        button.style.left = '400px';
        button.style.border = 'solid 1px #cfcaca';
        button.style.background = '#ffffff';
        button.style.color = '#494343';
        button.style.padding = '5px 10px';
        // button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.height = '28px';

        // Check if data.ID exists -> Disable the button
        if (this.data?.ID) {
          button.disabled = true;
          button.style.opacity = '0.5'; // Make it look disabled
          button.style.cursor = 'not-allowed';
        }

        // Add click event to insert the button inside the editor (only if not disabled)
        button.addEventListener('click', () => {
          if (!this.data?.ID) {
            this.insertCustomButton();
          }
        });

        // Append the button above the toolbar
        toolbar.parentElement?.insertBefore(button, toolbar);
      }
    }, 200);
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '9rem',
    minHeight: '5rem',
    placeholder: 'Enter Description',
    enablePlaceholders: true,
    translate: 'no',
    sanitize: false, // ✅ Allows inserting custom HTML (important)
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo', 'subscript', 'superscript'],
    ],
    toolbar: [
      ['bold', 'italic', 'underline', 'strikeThrough'],
      ['fontName', 'fontSize'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['indent', 'outdent'],
      ['orderedList', 'unorderedList'],
      ['link', 'unlink'],
      ['undo', 'redo'],
      ['insertButton'],
    ],
  };

  setEditorConfig() {
    this.config = { ...this.config, editable: this.data.ID ? true : true };
  }
}