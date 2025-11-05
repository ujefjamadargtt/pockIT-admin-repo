import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AppComponent } from 'src/app/app.component';
import { appkeys } from 'src/app/app.constant';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-chatdrawer',
  templateUrl: './chatdrawer.component.html',
  styleUrls: ['./chatdrawer.component.css'],
})
export class ChatdrawerComponent {
  @Input() chatdata: any;
  @Input() drawerClose: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private firebaseService: AppComponent,
  ) { }
  private messageListener: (event: any) => void;
  notifications: any[] = [];

  ngOnInit(): void {
    this.getmsgs();
    // this.firebaseService.requestPermission(); // Request notification permission
    // this.firebaseService.receiveMessages(); // Listen for messages

    // Get stored notifications
    this.notifications = JSON.parse(localStorage.getItem('NOTIFICATIONS') || '[]');

    // Update UI when a new notification arrives
    // this.firebaseService.currentMessage.subscribe((message) => {
    //   if (message) {
    //     this.getmsgs();
    //     this.notifications.push(message);
    //   }
    // });
    navigator.serviceWorker.addEventListener('message', (event: any) => {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {

        this.getmsgs(); // 👈 reload your chat here
      }
    });
    // this.messageListener = (event: any) => {
    //   console.log("11ks1")

    //   var obj = JSON.parse(event.data.data.data4);
    //   delete obj.authData;
    //   this.allchatmsg = [...this.allchatmsg, ...[obj]];
    //   this.groupeddata = this.groupDataBySendDate(this.allchatmsg);
    //   this.msgspin = false;
    //   setTimeout(() => {
    //     const div = this.scrollableDivvvvv.nativeElement;
    //     div.scrollTop = div.scrollHeight;
    //   }, 500);
    //   if (event?.data?.firebaseMessaging) {
    //     // this.messages.push(event.data.firebaseMessaging.notification);
    //   }
    // };

    navigator.serviceWorker.addEventListener('message', this.messageListener);
    //  this.connectToSSE()
  }
  userId = sessionStorage.getItem('userId');
  showEmojiPicker: boolean = false;

  showemoj() {
    if (this.showEmojiPicker) {
      this.showEmojiPicker = false;
    } else {
      this.showEmojiPicker = true;
    }
  }

  // onEmojiSelectaaaa(event: any) {
  //   // Ensure BODY_TEXT is initialized
  //   if (typeof this.BODY_TEXT !== 'string') {
  //     this.BODY_TEXT = '';
  //   }

  //   // Handle emoji insertion
  //   if (event?.emoji?.native) {
  //     const sub1 = this.BODY_TEXT.substring(0, this.cursorPosition || 0);
  //     const sub2 = this.BODY_TEXT.substring(this.cursorPosition || 0);

  //     // Insert emoji at the cursor position
  //     this.BODY_TEXT = sub1 + event.emoji.native + sub2;
  //     this.cursorPosition = (sub1 + event.emoji.native).length;
  //   }

  //   // Trigger additional logic
  //   this.checkInput1();
  // }

  cursorPosition: number = 0;
  showDynamicInput1: boolean = false;
  BODY_TEXT: string = '';
  BODY_VALUES: any[] = [];
  inputBody: string = '';
  Date: Date = new Date();
  i: number = 0;

  // checkInput1() {
  //   // Toggle dynamic input visibility based on BODY_TEXT content
  //   this.showDynamicInput1 = this.BODY_TEXT.includes('}}');

  //   const regex = /}}(?!)/;
  //   if (regex.test(this.BODY_TEXT)) {
  //     this.i++;
  //   } else {
  //     this.inputBody = this.BODY_TEXT;
  //   }

  //   this.check1();
  //   this.Date = new Date();
  // }

  // check1() {
  //   const pattern = /{{\d+}}/g;
  //   const matches = this.BODY_TEXT.match(pattern);

  //   if (matches && this.BODY_VALUES?.length > 0) {
  //     matches.forEach((match, index) => {
  //       const replacement = this.BODY_VALUES[index] || match;
  //       this.inputBody = this.inputBody.replace(match, replacement + ' ');
  //     });
  //   } else {
  //     this.inputBody = this.BODY_TEXT;
  //   }
  // }
  BODY_TEXTTTT: any;
  ICON: any = '';
  isSpinning: boolean = false;
  imageshow;
  onFileSelected(event: any) {
    const maxFileSize = 5 * 1024 * 1024;
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'video/mp4'
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 5MB.', '');
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (this.ICON != undefined && this.ICON.trim() != '') {
          var arr = this.ICON.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload('JobChat', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.ICON = this.UrlImageOne;

          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne = percentDone;
            if (this.percentImageOne == 100) {
              this.isSpinning = false;
              setTimeout(() => {
                this.progressBarImageOne = false;
              }, 2000);
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed to upload file', '');
            this.isimgupload = false;
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.ICON = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isimgupload = true;
              this.isSpinning = false;
              this.ICON = this.UrlImageOne;
              this.showimagebox = true;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.ICON = null;
              this.isimgupload = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only Image File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.ICON = null;
    }
  }
  showimagebox: any = false;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  public commonFunction = new CommonFunctionService();
  username = sessionStorage.getItem('userName');
  changeevent(event: any) {
    this.BODY_TEXTTTT = event;
  }
  isimgupload = false;
  getMediaType(url: string): string {
    if (!url) return ''; // Return empty if no attachment
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];

    const extension = url.split('.').pop()?.toLowerCase(); // Extract file extension

    if (extension && imageExtensions.includes(extension)) {
      return 'I'; // Image
    } else if (extension && videoExtensions.includes(extension)) {
      return 'V'; // Video
    }
    return ''; // Default if not recognized
  }

  // commonFunction = new CommonFunction();
  sendmessage() {
    if (this.isimgupload) {
      this.isSpinning = true;
      if (this.BODY_TEXT === '') {
      } else {
        const boldPattern = /\*(.*?)\*/g; // Matches text wrapped in a single pair of '*'
        this.BODY_TEXT = this.BODY_TEXT.replace(boldPattern, '<b>$1</b>');
      }
      const mediaType = this.getMediaType(this.ICON);
      var dataaa = {
        ORDER_ID: this.chatdata.ORDER_ID,
        ORDER_NUMBER: this.chatdata.ORDER_NO,
        JOB_CARD_ID: this.chatdata.ID,
        CUSTOMER_ID: this.chatdata.CUSTOMER_ID,
        TECHNICIAN_ID: this.chatdata.TECHNICIAN_ID,
        MESSAGE: this.BODY_TEXT,
        SENDER_USER_ID: this.commonFunction.decryptdata(this.userId || ''),
        RECIPIENT_USER_ID: this.chatdata.TECHNICIAN_ID,
        CLIENT_ID: 1,
        JOB_CARD_NUMBER: this.chatdata.JOB_CARD_NO,
        CUSTOMER_NAME: this.chatdata.CUSTOMER_NAME,
        TECHNICIAN_NAME: this.chatdata.TECHNICIAN_NAME,
        CREATED_DATETIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        STATUS: 'D',
        BY_CUSTOMER: '',
        SENDER_USER_ID_USER: this.commonFunction.decryptdata(
          this.username || ''
        ),
        RECIPIENT_USER_NAME: this.chatdata.TECHNICIAN_NAME,
        SEND_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        RECEIVED_DATE: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        ATTACHMENT_URL: this.ICON,
        IS_DELIVERED: true,
        MSG_SEND_BY: 'B',
        MEDIA_TYPE: mediaType,
      };

      this.api.createchat(dataaa).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            // this.message.success('Message Sent Successfully', '');
            this.BODY_TEXT = '';
            this.ICON = null;
            this.isimgupload = true;
            this.showimagebox = false;
            this.showEmojiPicker = false;
            this.getmsgs();
            this.isSpinning = false;
          } else {
            // this.message.error('Message Failed to sent', '');
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
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
    } else {
      if (this.BODY_TEXT === '') {
        this.message.error('Please Enter Message', '');
      } else {
        const boldPattern = /\*(.*?)\*/g; // Matches text wrapped in a single pair of '*'
        this.BODY_TEXT = this.BODY_TEXT.replace(boldPattern, '<b>$1</b>');
        this.isSpinning = true;
        const mediaType = this.getMediaType(this.ICON);
        var dataaa = {
          ORDER_ID: this.chatdata.ORDER_ID,
          ORDER_NUMBER: this.chatdata.ORDER_NO,
          JOB_CARD_ID: this.chatdata.ID,
          CUSTOMER_ID: this.chatdata.CUSTOMER_ID,
          TECHNICIAN_ID: this.chatdata.TECHNICIAN_ID,
          MESSAGE: this.BODY_TEXT,
          SENDER_USER_ID: this.commonFunction.decryptdata(this.userId || ''),
          RECIPIENT_USER_ID: this.chatdata.TECHNICIAN_ID,
          CLIENT_ID: 1,
          JOB_CARD_NUMBER: this.chatdata.JOB_CARD_NO,
          CUSTOMER_NAME: this.chatdata.CUSTOMER_NAME,
          TECHNICIAN_NAME: this.chatdata.TECHNICIAN_NAME,
          CREATED_DATETIME: this.datePipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          ),
          STATUS: 'D',
          BY_CUSTOMER: '',
          SENDER_USER_ID_USER: this.commonFunction.decryptdata(
            this.username || ''
          ),
          RECIPIENT_USER_NAME: this.chatdata.TECHNICIAN_NAME,
          SEND_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          RECEIVED_DATE: this.datePipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          ),
          ATTACHMENT_URL: this.ICON,
          IS_DELIVERED: true,
          MSG_SEND_BY: 'B',
          MEDIA_TYPE: mediaType,
        };

        this.api.createchat(dataaa).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              // this.message.success('Message Sent Successfully', '');
              this.BODY_TEXT = '';
              this.ICON = null;
              this.isimgupload = true;
              this.showimagebox = false;
              this.showEmojiPicker = false;
              this.getmsgs();
              this.isSpinning = false;
            } else {
              // this.message.error('Message Failed to sent', '');
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
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
      }
    }
  }

  allchatmsg: any = [];
  @ViewChild('scrollableDivvvvv')
  scrollableDivvvvv!: ElementRef<HTMLDivElement>;
  groupeddata: any;
  msgspin = false;
  getmsgs() {
    // var filter = `{ $and:[ {TECHNICIAN_ID: ${this.chatdata.TECHNICIAN_ID}},{jobcardid:${this.chatdata.ID}}]}`;
    // var filter = { $and:[ {TECHNICIAN_ID: ${this.chatdata.TECHNICIAN_ID}},{jobcardid:${this.chatdata.ID}}]};
    this.msgspin = true;
    var filter = {
      $and: [
        { TECHNICIAN_ID: this.chatdata.TECHNICIAN_ID },
        { JOB_CARD_ID: this.chatdata.ID },
      ],
    };

    this.api.getchat(0, 0, '_id', 'asc', filter).subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          this.allchatmsg = data['data'];

          this.groupeddata = this.groupDataBySendDate(this.allchatmsg);
          this.msgspin = false;
          setTimeout(() => {
            const div = this.scrollableDivvvvv.nativeElement;
            div.scrollTop = div.scrollHeight;
          }, 500);
        }
        this.msgspin = false;
      }
    });
  }
  private eventSource: EventSource;
  // connectToSSE() {
  //   this.eventSource = new EventSource('https://1786vqrk-9887.inc1.devtunnels.ms/api/jobchat/get');

  //   this.eventSource.onmessage = (event) => {
  //     this.getmsgs(); // Fetch new messages when an update is received
  //   };

  //   this.eventSource.onerror = () => {
  //     this.eventSource.close();
  //     setTimeout(() => this.connectToSSE(), 5000); // Reconnect after 5s
  //   };
  // }

  groupDataBySendDate(data: any[]): { [key: string]: any[] } {
    return data.reduce((groupedData, item) => {
      // Extract only the date part (YYYY-MM-DD) from SEND_DATE
      const sendDate = new Date(item.SEND_DATE).toISOString().split('T')[0];

      if (!groupedData[sendDate]) {
        groupedData[sendDate] = [];
      }
      groupedData[sendDate].push(item);
      return groupedData;
    }, {});
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // onEmojiSelect(event: any): void {
  //   if (event?.native) { // Check if the event contains a valid emoji
  //     const textarea = document.querySelector('textarea[name=BODY_TEXT]') as HTMLTextAreaElement;
  //     if (textarea) {
  //       const cursorPosition = textarea.selectionStart; // Get the current cursor position
  //       this.BODY_TEXTTTT =
  //         this.BODY_TEXTTTT.slice(0, cursorPosition) + // Text before the cursor
  //         event.native + // Selected emoji
  //         this.BODY_TEXTTTT.slice(cursorPosition); // Text after the cursor
  //     }
  //   }
  // }
  urllll = appkeys.retriveimgUrl;
  foldername = 'AppLanguageIcon';
  // Method to handle text changes in the textarea
  // changeevent(event: string): void {
  //   this.BODY_TEXTTTT = event; // Update the text as user types
  // }

  // onEmojiSelect(event: any): void {
  //   if (event?.emoji?.native) {
  //     const sub1 = this.BODY_TEXTTTT.substring(0, this.cursorPosition || 0);
  //     const sub2 = this.BODY_TEXTTTT.substring(this.cursorPosition || 0);
  //     this.BODY_TEXTTTT = sub1 + event.emoji.native + sub2;
  //     this.cursorPosition = sub1.length + event.emoji.native.length;
  //   }
  //   this.checkInput1();
  // }

  // // Method to handle cursor position update
  // updateCursorPosition(event: any): void {
  //   this.cursorPosition = event.target.selectionStart;
  // }

  // checkInput1(): void {
  //   this.showDynamicInput1 = this.BODY_TEXTTTT.includes('}}');
  //   const regex = /}}(?!)/;
  //   if (regex.test(this.BODY_TEXTTTT)) {
  //     this.i++;
  //   } else {
  //     this.inputBody = this.BODY_TEXTTTT;
  //   }
  //   this.check1();
  //   this.Date = new Date();
  // }

  // check1(): void {
  //   const pattern = /{{\d+}}/g;
  //   const matches = this.BODY_TEXTTTT.match(pattern);
  //   if (matches && this.BODY_VALUES?.length > 0) {
  //     matches.forEach((match, index) => {
  //       const replacement = this.BODY_VALUES[index] || match;
  //       this.inputBody = this.inputBody.replace(match, replacement + ' ');
  //     });
  //   } else {
  //     this.inputBody = this.BODY_TEXTTTT;
  //   }
  // }

  onEmojiSelect(event: any) {
    // Ensure BODY_TEXT is initialized
    if (typeof this.BODY_TEXT !== 'string') {
      this.BODY_TEXT = '';
    }

    // Extract emoji codes from BODY_TEXT
    const emojiCodePattern = /&#(x[\dA-Fa-f]+|\d+);/g;
    const emojiCodes = this.BODY_TEXT.match(emojiCodePattern);
    if (emojiCodes) {
      emojiCodes.forEach((emojiCode) => {
        try {
          const emojiChar = String.fromCodePoint(
            parseInt(
              emojiCode.slice(2, -1),
              emojiCode.startsWith('x') ? 16 : 10
            )
          );
          this.BODY_TEXT = this.BODY_TEXT.replace(emojiCode, emojiChar);
        } catch (error) { }
      });
    }

    // Handle emoji insertion
    const ev = Object.assign({}, event);
    const sub1 = this.BODY_TEXT.substring(0, this.cursorPosition || 0);
    const sub2 = this.BODY_TEXT.substring(
      this.cursorPosition || 0,
      this.BODY_TEXT.length
    );

    this.BODY_TEXT = sub1 + `${ev.emoji.native}` + sub2;
    this.cursorPosition = (sub1 + `${ev.emoji.native}`).length;

    // Call additional logic
    this.checkInput1();
  }

  checkInput1() {
    if (this.BODY_TEXT == '' || this.BODY_TEXT == undefined) {
      this.showDynamicInput1 = false;
    }
    if (this.BODY_TEXT.includes('}}')) {
      this.showDynamicInput1 = true;
    }
    const regex = /}}(?!)/;

    if (this.BODY_TEXT.match(regex)) {
      this.i++;
    } else {
      this.inputBody = this.BODY_TEXT;
    }
    this.check1();
    this.Date = new Date();
  }

  check1() {
    const pattern = /{{\d+}/g;
    const matches = this.BODY_TEXT.match(pattern);

    if (matches && this.BODY_VALUES != undefined) {
      for (let i = 0; i < matches.length; i++) {
        this.inputBody = this.inputBody.replace(
          matches[i].toString() ? matches[i].toString() : this.inputBody,
          this.BODY_VALUES[i] ? this.BODY_VALUES[i] : matches[i].toString()
        );
        this.inputBody = this.inputBody.replace(
          this.BODY_VALUES[i] + '}',
          this.BODY_VALUES[i] + ' '
        );
      }
    } else {
      this.inputBody = this.BODY_TEXT;
    }
  }
  hasCurlyBraceContent = false;
  onEditorMouseUp(event: MouseEvent): void {
    const textarea: any = document.getElementById('messages2');
    const cursorPosition = textarea.selectionStart;
    this.cursorPosition = cursorPosition;
  }

  checkCurlyBraces(event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    const regex = /\{\{\d+\}\}/; // Matches patterns like {{1}}, {{123}}, etc.
    this.hasCurlyBraceContent = regex.test(text);
  }

  // handleEnter(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     // Prevent default Enter key behavior if necessary
  //     event.preventDefault();

  //     // Insert a newline character at the cursor position
  //     const textarea = event.target as HTMLTextAreaElement;
  //     const start = textarea.selectionStart;
  //     const end = textarea.selectionEnd;

  //     this.BODY_TEXT =
  //       this.BODY_TEXT.slice(0, start) + '\n' + this.BODY_TEXT.slice(end);

  //     // Move the cursor to the next line
  //     setTimeout(() => {
  //       textarea.selectionStart = textarea.selectionEnd = start + 1;
  //     });
  //   }
  // }

  handleEnter(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'b') {
      this.makeBold();
    }
    if (event.key === 'Enter') {
      event.preventDefault();

      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + '\n' + this.BODY_TEXT.slice(end);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }
  }

  makeBold(): void {
    const textarea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      // Wrap selected text in <b> tags
      const selectedText = this.BODY_TEXT.substring(start, end);
      const boldText = `*${selectedText}*`;
      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + boldText + this.BODY_TEXT.slice(end);

      // Update textarea and cursor position
      textarea.value = this.BODY_TEXT;
      textarea.selectionStart = textarea.selectionEnd = end + 7; // Adjust for <b></b>
      // this.updateFormattedText();
    }
  }
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br/>');
  }
}