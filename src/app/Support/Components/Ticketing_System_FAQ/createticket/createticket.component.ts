import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Ticket, Ticketdetails } from 'src/app/Support/Models/TicketingSystem';

@Component({
  selector: 'app-createticket',
  templateUrl: './createticket.component.html',
  styleUrls: ['./createticket.component.css'],
  providers: [DatePipe],
})
export class CreateticketComponent implements OnInit {
  filterQuery = '';

  public commonFunction = new CommonFunctionService();

  applicationId = Number(this.cookie.get('applicationId'));
  // email = this.cookie.get('emailId');

  @Input() drawerClose: Function;
  @Input() data: Ticket;
  @Input() ticketGroups: any = [];
  @Input() ticketQuestion = {};
  // isSpinning = false;
  @Input() isSpinning: boolean;
  backPressed = false;
  @Input() index = 0;
  @Input() parentId = 0;
  isAddTicket = false;
  ticketDetailsData: Ticketdetails;
  DESCRIPTION;
  fileDataLOGO_URL: File | null = null;
  ID;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss');
  folderName = 'ticket';
  item = {};
  isLast = false;
  loadingRecordsFaqs = false;
  faqs: any = [];

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiServiceService,
    private cookie: CookieService
  ) { }

  userId = sessionStorage.getItem('userId');

  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  emailId = sessionStorage.getItem('emailId');
  decryptedEmail = this.emailId
    ? this.commonFunction.decryptdata(this.emailId)
    : '';

  MobileNo: any = sessionStorage.getItem('mobile');
  decryptedMobile;

  USER_ID: any;
  // userId = sessionStorage.getItem('userId');
  org: any = [];
  orgId = this.cookie.get('orgId');
  ngOnInit() {
    this.decryptedMobile = this.MobileNo
      ? this.commonFunction.decryptdata(this.MobileNo)
      : '';

    this.orgId = this.cookie.get('orgId');
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }

  userid = this.commonFunction.decryptdata(
    sessionStorage.getItem('userId') || ''
  );
  loadingRecords;
  backToPrevious() {
    this.isAddTicket = false;
    this.isLast = false;
    // this.getQuestions1();
    var filterQuery = " AND PARENT_ID=0 AND TYPE='Q'";

    this.api.getAllTicketGroups(0, 0, 'id', 'ASC', filterQuery).subscribe(
      (response: HttpResponse<any>) => {
        const ticketGroups = response.status;

        if (response.status == 200) {
          if (response.body.data[0]?.length == 0) {
            this.ticketQuestion = {};
            this.ticketGroups = [];
          } else {
            this.ticketQuestion = response.body.data[0];

            // var filterQuery2 = " AND PARENT_ID=" + response.body.data[0]['ID'] + " AND TYPE='O'";
            var filterQuery2 =
              ' AND PARENT_ID=' + response.body.data[0]['ID'] + " AND TYPE='O'";

            this.api
              .getAllTicketGroups(
                0,
                0,
                'SEQ_NO',
                'ASC',
                filterQuery2 + ' AND STATUS=1 '
              )
              .subscribe((ticketGroups) => {
                this.ticketGroups = ticketGroups.body.data;
              });
          }
        }
      },

      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          // this.message.error(
          //   `HTTP Error: ${err.status}. Something Went Wrong.`,
          //   ''
          // );
        }
      }
    );
  }

  openTicketWindow() {
    this.isAddTicket = false;
  }

  cancel() {
    this.drawerClose();
    this.isAddTicket = false;
    this.isLast = false;
    this.index = 0;
  }
  nodata = false;
  nextData(item) {
    this.item = item;

    if (item.IS_LAST == 0) {
      this.index++;
      this.parentId = item.ID;
      this.backPressed = false;
      this.isAddTicket = false;
      this.isLast = false;
      this.filterQuery = ' AND PARENT_ID=' + item.ID + " AND TYPE='Q'";
      this.nodata = true;
      this.getQuestions();
    } else {
      this.isAddTicket = true;
      this.isLast = true;
      this.getMappedFaq();
    }
  }

  myTicketCount: number = 0;
  myTicketLoading: boolean = false;

  getMappedFaq() {
    this.loadingRecordsFaqs = true;

    // Get Ticket Details
    this.myTicketCount = 0;
    this.myTicketLoading = true;
    // this.isSpinning = true;
    this.ticketGroups = [];

    this.api
      .getAllTickets(
        0,
        0,
        'ID',
        'ASC',
        " AND STATUS!='C' AND CREATOR_EMPLOYEE_ID=" +
        this.USER_ID +
        ' AND TICKET_GROUP_ID=' +
        this.item['ID']
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.myTicketLoading = false;

            this.myTicketCount = data['count'];
          } else {
            this.myTicketLoading = false;
          }
        },
        (err) => {
          this.myTicketLoading = false;

          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );

    this.api.getMappingFaqs2(this.item['ID']).subscribe(
      (data) => {
        if (data['status'] == '200') {
          this.faqs = data['body']['data'];
          this.isLast = true;
        } else {
          this.loadingRecordsFaqs = false;
        }
      },
      (err) => {
        this.loadingRecordsFaqs = false;
      }
    );
  }

  prevData() {
    this.isAddTicket = false;
    this.backPressed = true;
    this.index--;
    this.nodata = false;
    this.isLast = false;

    // this.filterQuery = " AND PARENT_ID=(select PARENT_ID from TICKET_GROUP_MASTER where ID=((select PARENT_ID from TICKET_GROUP_MASTER where ID=" + this.parentId + "))) AND TYPE='Q' ";
    this.getQuestions1();
  }

  getGroups(id) {
    this.filterQuery = ' AND PARENT_ID=' + id + "  AND TYPE='O'";

    // this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', this.filterQuery + ' AND  ORG_ID =1 AND STATUS = 1').subscribe(ticketGroups => {
    //   if (ticketGroups['code'] == 200) {
    //     this.ticketGroups = ticketGroups['data'];
    //     this.isSpinning = false;

    //   } else {
    //     this.isSpinning = false;
    //   }

    // }, err => {
    //   this.isSpinning = false
    //   this.message.error('Something went wrong. Please try again later.', "");
    // });

    this.api
      .getAllTicketGroups(
        0,
        0,
        'SEQ_NO',
        'ASC',
        this.filterQuery +
        ' AND ORG_ID=1 AND STATUS = 1'
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;

          if (response.status == 200) {
            this.ticketGroups = response.body.data;

            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },

        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            // this.message.error(
            //   `HTTP Error: ${err.status}. Something Went Wrong.`,
            //   ''
            // );
          }
        }
      );
  }

  getAllParents(id) {
    this.filterQuery = ' AND PARENT_ID=' + id;

    this.api
      .getTicketGroupParent(
        0,
        0,
        'SEQ_NO',
        'ASC',
        this.filterQuery + ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ticketGroups = data['data'];
          } else {
          }
        },
        (err) => {
          this.message.error('Something went wrong. Please try again later.', '');
        }
      );
  }

  getQuestions() {
    this.isSpinning = true;
    this.ticketGroups = [];

    this.api
      .getAllTicketGroups(
        0,
        0,
        'SEQ_NO',
        'ASC',
        this.filterQuery + ' and STATUS=1'
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;

          if (response.status == 200) {
            if (response.body.data.length == 0) {
              this.ticketQuestion = {};
              this.isSpinning = false;
            } else {
              this.ticketQuestion = response.body.data[0];

              if (this.backPressed)
                this.parentId = response.body.data[0].PARENT_ID;

              this.getGroups(response.body.data[0].ID);
            }
          } else {
            this.isSpinning = false;
          }
        },

        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            // this.message.error(
            //   `HTTP Error: ${err.status}. Something Went Wrong.`,
            //   ''
            // );
          }
        }
      );
  }

  getQuestions1() {
    this.isSpinning = true;
    this.ticketGroups = [];

    // this.api.getAllTicketGroupsprevious(this.parentId)
    this.api.getAllTicketGroupsprevious(0, 0, 'SEQ_NO', 'ASC', '', 3).subscribe(
      (response: HttpResponse<any>) => {
        const ticketGroups = response.status;

        if (response.status == 200) {
          if (response.body.data.length == 0) {
            this.ticketQuestion = {};
            this.isSpinning = false;
          } else {
            this.ticketQuestion = response.body.data[0];

            if (this.backPressed)
              this.parentId = response.body.data[0].PARENT_ID;

            this.getGroups(response.body.data[0].ID);
          }
        } else {
          this.isSpinning = false;
        }
      },

      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          // this.message.error(
          //   `HTTP Error: ${err.status}. Something Went Wrong.`,
          //   ''
          // );
        }
      }
    );
  }

  getUrl(url) {
    if (url) return this.api.baseUrl + 'static/ticket/' + url;
    else return '';
  }

  urlClick(url) {
    window.open(this.api.baseUrl + 'static/ticket/' + url);
  }

  clearImg() {
    this.fileDataLOGO_URL = null;
  }

  // onFileSelectedLOGO_URL(event) {
  //   this.fileDataLOGO_URL = event.target.files[0];

  // }
  onFileSelectedLOGO_URL(event) {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.message.error(
          'Please select a valid image file (PNG, JPG, JPEG).',
          ''
        );
        return;
      }

      this.fileDataLOGO_URL = file;
    }
  }

  genarateKeyLOGO_URL() {
    if (this.fileDataLOGO_URL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
      var Date = new Date();
      var formatedDate: any = this.datePipe.transform(Date, 'yyyyMMddHHmmss');
      var url = formatedDate + number + '.' + fileExt;

      this.api.onUpload(this.folderName, this.fileDataLOGO_URL, url);
      var LOGO_URL = this.api.retriveimgUrl + this.folderName + '/' + url;
      return LOGO_URL;
    } else {
      return '';
    }
  }

  getFormatedDate() {
    var date_ob = new Date();
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ('0' + date_ob.getHours()).slice(-2);
    let minutes = ('0' + date_ob.getMinutes()).slice(-2);
    let seconds = ('0' + date_ob.getSeconds()).slice(-2);

    return (
      year.toString().slice(2, 4) + month + date + hours + minutes + seconds
    );
  }

  send() {
    var d = this.getFormatedDate();
    var random = Math.floor(Math.random() * 10000) + 1;
    var LOGO_URL = '';

    if (this.DESCRIPTION != undefined && this.DESCRIPTION.trim() != '') {
      this.isSpinning = true;

      if (this.fileDataLOGO_URL) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
        var Dates = new Date();
        var formatedDate: any = this.datePipe.transform(
          Dates,
          'yyyyMMddHHmmss'
        );
        var url = formatedDate + number + '.' + fileExt;

        this.api
          .onUpload2(this.folderName, this.fileDataLOGO_URL, url)
          .subscribe((successCode) => {
            if (successCode['code'] == '200') {
              LOGO_URL = url;
              this.fileDataLOGO_URL = null;
              this.message.success('Image uploaded successfully.', '');
              let USERTYPE: string = '';

              if (this.decreptedroleId == 9) {
                USERTYPE = 'V';
              } else if (
                this.decreptedroleId != 6 &&
                this.decreptedroleId != 7 &&
                this.decreptedroleId != 8 &&
                this.decreptedroleId != 9
              ) {
                USERTYPE = 'B';
              } else {
                USERTYPE = 'U';
              }

              var data = {
                URL: LOGO_URL,
                TICKET_GROUP_ID: this.item['ID'],
                TICKET_NO: d + '' + random,
                // USER_ID: this.userId,
                USER_ID: this.userid,
                SUBJECT: this.ticketQuestion['VALUE'],
                MOBILE_NO: this.decryptedMobile,
                EMAIL_ID: this.decryptedEmail,
                CLOUD_ID: 1,
                QUESTION: this.DESCRIPTION,
                STATUS: 'P',
                CLIENT_ID: 1,
                DEPARTMENT_ID: this.item['DEPARTMENT_ID'],
                DEPARTMENT_NAME: this.item['DEPARTMENT_NAME'],
                USER_TYPE: USERTYPE,
              };

              // this.api.createTicket(data).subscribe(successCode => {
              //   if (successCode['code'] == "200") {
              //
              //     this.drawerClose();
              //     this.isSpinning = false;
              //     this.isAddTicket = false;
              //     this.isLast = false;
              //     this.index = 0;
              //     this.fileDataLOGO_URL = null;
              //     this.DESCRIPTION = '';
              //     this.message.success("Ticket created successfully", "");

              //   } else {
              //     this.message.error("Failed to create ticket", "");
              //   }
              // });

              this.api
                .createTicket(data)
                .subscribe((response: HttpResponse<any>) => {
                  const statusCode = response.status;
                  const responseBody = response.body;

                  if (statusCode === 200) {
                    // this.message.success('Information Saved Successfully', '');

                    this.drawerClose();
                    this.isSpinning = false;
                    this.isAddTicket = false;
                    this.isLast = false;
                    this.index = 0;
                    this.fileDataLOGO_URL = null;
                    this.DESCRIPTION = '';
                    this.message.success('Ticket created successfully', '');

                    this.isSpinning = false;
                  } else {
                    this.message.error('Information not saved', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload file', '');
            }
          });
      } else {
        let USERTYPE: string = '';

        if (this.decreptedroleId == 9) {
          USERTYPE = 'V';
        } else if (
          this.decreptedroleId != 6 &&
          this.decreptedroleId != 7 &&
          this.decreptedroleId != 8 &&
          this.decreptedroleId != 9
        ) {
          USERTYPE = 'B';
        } else {
          USERTYPE = 'U';
        }

        var data = {
          URL: '',
          TICKET_GROUP_ID: this.item['ID'],
          TICKET_NO: d + '' + random,
          // USER_ID: this.userId,
          USER_ID: this.userid,
          SUBJECT: this.ticketQuestion['VALUE'],
          MOBILE_NO: this.decryptedMobile,
          EMAIL_ID: this.decryptedEmail,
          CLOUD_ID: 1,
          QUESTION: this.DESCRIPTION,
          STATUS: 'P',
          CLIENT_ID: 1,
          DEPARTMENT_ID: this.item['DEPARTMENT_ID'],
          DEPARTMENT_NAME: this.item['DEPARTMENT_NAME'],
          USER_TYPE: USERTYPE,
        };

        this.api.createTicket(data).subscribe((successCode) => {
          if (successCode['status'] == '200') {
            this.drawerClose();
            this.isSpinning = false;
            this.isAddTicket = false;
            this.isLast = false;
            this.index = 0;
            this.fileDataLOGO_URL = null;
            this.DESCRIPTION = '';
            this.message.success('Ticket created successfully', '');
          } else {
            this.isSpinning = false;
            this.message.error('Failed to create ticket', '');
          }
        });
      }
    } else {
      this.message.error('Please mention your problem', '');
    }
  }

  goToMyTicketDetails() { }

  popConfirmCancel() { }
}
