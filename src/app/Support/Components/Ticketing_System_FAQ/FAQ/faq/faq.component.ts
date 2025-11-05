import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Faq, Faqhead } from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  providers: [DatePipe],
})
export class FaqComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Faq;
  @Input() URL;

  isSpinning = false;
  isFocused: string = '';
  faqHeads: Faqhead[];
  faqHeadscust: Faqhead[];
  faqHeadstech: Faqhead[];
  faqHeadsMain: Faqhead[];

  date = new Date();
  date1: any = this.datePipe.transform(this.date, 'yyyyMMdd');
  isOk = true;
  fileURL: any;

  fileDataURL: any;
  listOfOption: Array<{ label: string; value: string }> = [];
  f_key = 'VwKkXFiw';
  applicationId = Number(this.cookie.get('applicationId'));

  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) { }

  ngOnInit() {

    this.loadFaqHeads();
  }

  // loadFaqHeads() {
  //   this.isSpinning = true;
  //   this.api
  //     .getAllFaqHeads(0, 0, '', '', ' AND IS_PARENT=0 AND STATUS=1 ')
  //     .subscribe(
  //       (localName) => {
  //         this.faqHeads = localName['data'];
  //         this.isSpinning = false;
  //         

  //         
  //       },
  //       (err) => {
  //         
  //         this.isSpinning = false;
  //       }
  //     );
  // }

  loadFaqHeads() {
    this.isSpinning = true;
    this.api
      .getAllFaqHeads(0, 0, '', '', ' AND STATUS=1 ')
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.faqHeads = data['body']['data'];
            this.faqHeadsMain = data['body']['data'];

            this.faqHeadscust = this.faqHeadsMain.filter((item: any) => item.FAQ_HEAD_TYPE === 'C');
            this.faqHeadstech = this.faqHeadsMain.filter((item: any) => item.FAQ_HEAD_TYPE === 'T');

            this.isSpinning = false;
          } else {
            this.faqHeads = [];
            this.message.error('Failed to get FAQ Heads  data...', '');
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
  radiochange(data: any) {
    this.faqHeads = [];
    this.data.FAQ_TYPE = data;
    this.data.FAQ_HEAD_ID = null;
    if (data === 'C') {
      this.faqHeads = this.faqHeadscust
    } else {
      this.faqHeads = this.faqHeadstech
    }
  }

  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }
  close(accountMasterPage: NgForm): void {
    this.resetDrawer(accountMasterPage);
    this.drawerClose();
  }

  save2(addNew: boolean, accountMasterPage: NgForm) {


    if (this.data.ID) {
      // this.data.TAGS = this.data.TAGS_STRING.toString();

      this.URL = this.data.URL;

      this.api.updateFaq(this.data).subscribe((successCode) => {

        if (successCode['status'] == '200') {
          this.message.success('Information Updated Successfully...', '');
          if (!addNew) this.drawerClose();
          this.resetDrawer(accountMasterPage);
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Update Information...', '');
          this.isSpinning = false;
        }
      }, err => {
        this.message.error('Something went wrong, please try again later', '');
        this.isSpinning = false;
      });
    } else {
      this.data.POSITIVE_HELPFUL_COUNT = 0;
      this.data.NEGATIVE_HELPFUL_COUNT = 0;
      // this.data.TAGS = this.data.TAGS_STRING.toString();

      this.api.createFaq(this.data).subscribe((successCode) => {
        // 

        if (successCode['status'] == '200') {
          this.message.success('Information Save Successfully...', '');
          if (!addNew) {
            this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.data = new Faq();
            this.resetDrawer(accountMasterPage);
            this.api.getAllFaqs(1, 1, 'SEQ_NO', 'desc', '').subscribe(
              (data) => {
                if (data.body['count'] == 0) {
                  this.data.SEQ_NO = 1;
                } else {
                  this.data.SEQ_NO = data.body['data'][0]['SEQ_NO'] + 1;
                }
              },
              (err) => {

              }
            );
          }
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Save Information...', '');
          this.isSpinning = false;
        }
      }, err => {
        this.message.error('Something went wrong, please try again later', '');
        this.isSpinning = false;
      });
    }
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.FAQ_HEAD_ID == null &&
      this.data.QUESTION.trim() == '' &&
      this.data.ANSWER.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    }

    else if (
      this.data.FAQ_HEAD_ID == undefined ||
      this.data.FAQ_HEAD_ID == null || this.data.FAQ_HEAD_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select FAQ Head Name', '');
    }
    else if (
      this.data.SEQ_NO === undefined ||
      this.data.SEQ_NO === null || this.data.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    else if (this.data.QUESTION.trim() === '' || this.data.QUESTION === null || this.data.QUESTION === undefined) {
      this.isOk = false;
      this.message.error('Please Enter Question', '');
    } else if (this.data.ANSWER.trim() === '' || this.data.ANSWER === null || this.data.ANSWER === undefined) {
      this.isOk = false;
      this.message.error('Please Enter Answer', '');
    }
    if (this.isOk) {
      // this.data.ORG_ID = Number(this.cookie.get('orgId'));
      this.isSpinning = true;

      if (this.fileDataURL) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileDataURL.name.split('.').pop();
        var Dates = new Date();
        var formatedDate: any = this.datePipe.transform(
          Dates,
          'yyyyMMddHHmmss'
        );
        var url = formatedDate + number + '.' + fileExt;

        this.api
          .onUpload2('ticket', this.fileDataURL, url)
          .subscribe((successCode) => {
            if (successCode['code'] == '200') {


              this.data.URL = url;
              this.fileDataURL = null;

              this.save2(addNew, accountMasterPage);
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload file', '');
            }
          });
      } else {
        if (this.URL != '') {
          this.data.URL = this.data.URL;
          this.save2(addNew, accountMasterPage);
        } else {
          this.data.URL = '';
          this.save2(addNew, accountMasterPage);
        }
      }
    }
    // else
    // {
    //   this.message.error("Please Fill All Required Fields...","");
    //   this.isSpinning = false;
    // }
  }

  genarateKey() {
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileDataURL.name.split('.').pop();
    var url = this.date1 + number + '.' + fileExt;
    this.api.onUpload('faq', this.fileDataURL, url);
    this.data.URL = this.api.retriveimgUrl + 'faq/' + url;
    return this.data.URL;
  }
  // onFileSelectedURL(event) {
  //   
  //   this.fileDataURL = <File>event.target.files[0];
  //   var fileExt = this.fileDataURL.name.split('.').pop();
  // }
  onFileSelectedURL(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // 
      this.fileDataURL = <File>event.target.files[0];

      // Ensure 'name' property exists before accessing it
      if (this.fileDataURL.name) {
        var fileExt = this.fileDataURL.name.split('.').pop();

      }
    } else {

    }
  }

  response(status, data) {

    this.isSpinning = true;
    data.STATUS = status;

    this.api.updateFaqResponse(data).subscribe((successCode) => {

      if (successCode['code'] == '200') {
        this.message.success('Information Saved Successfully...', '');
        this.isSpinning = false;
        this.drawerClose();
      } else {
        this.message.error('Failed to Reject', '');
      }
    });
  }

  getUrl(url) {
    if (url) return this.api.baseUrl + 'static/ticket/' + url;
    else return '';
  }
}
