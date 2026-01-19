import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { Ticket, Ticketdetails } from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-viewchatticket',
  templateUrl: './viewchatticket.component.html',
  styleUrls: ['./viewchatticket.component.css'],
  providers: [DatePipe],
})
export class ViewchatticketComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Ticket;
  @Input() data2: any = [];
  @Input() newstr: any = '';
  @Input() isSpinning: boolean;
  folderName = 'ticket';
  userroleid: any;
  userroleid1: any;
  ticketDetailsData: Ticketdetails;
  DESCRIPTION;
  fileDataLOGO_URL: any;
  ID;
  date1: any;
  imageSrc = '';
  todayDate = new Date();
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);
  constructor(
    private cookie: CookieService,
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    this.userroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.userroleid1 = parseInt(this.userroleid, 10);
    this.getAllEmployee();
  }
  empList: any = [];
  getAllEmployee() {
    this.empList = [];
    this.api
      .getAllemployeeMaster(
        0,
        0,
        'ID',
        'desc',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.empList = response.body.data;
          } else {
            this.empList = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.message.error(
              'Network error: please check your internet connection.',
              ''
            );
          } else {
            this.message.error(
              `HTTP Error: ${err.status}. something went wrong.`,
              ''
            );
          }
        }
      );
  }
  getSenderEmpName(senderEmpID): any {
    let empName = '';
    this.empList.filter((obj) => {
      if (obj.ID == senderEmpID) {
        empName = obj['NAME'];
      }
    });
    return empName;
  }
  getFormatedDate() {
    var date_ob = new Date();
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ('0' + date_ob.getHours()).slice(-2);
    let minutes = ('0' + date_ob.getMinutes()).slice(-2);
    let seconds = ('0' + date_ob.getSeconds()).slice(-2);
    return year + month + date + hours + minutes + seconds;
  }
  send(data1: Ticket) {
    this.date1 = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
              var ticketDetailsData1 = {
                ID: 0,
                SENDER: 'U',
                CLIENT_ID: this.api.clientId,
                SENDER_ID: +this.decrepteduserID,
                TICKET_MASTER_ID: data1.ID,
                DESCRIPTION: this.DESCRIPTION,
                URL: LOGO_URL,
              };
              if (this.decrepteduserID == 9) {
                data1.USER_TYPE = 'V';
              } else if (
                this.decrepteduserID != 6 &&
                this.decrepteduserID != 7 &&
                this.decrepteduserID != 8 &&
                this.decrepteduserID != 9
              ) {
                data1.USER_TYPE = 'B';
              } else {
                data1.USER_TYPE = 'U';
              }
              this.api
                .createTicketDetail(ticketDetailsData1)
                .subscribe((response: HttpResponse<any>) => {
                  const statusCode = response.status;
                  const responseBody = response.body;
                  if (statusCode === 200) {
                    this.message.success('Information saved successfully', '');
                    this.drawerClose();
                    this.isSpinning = false;
                    this.DESCRIPTION = '';
                    this.fileDataLOGO_URL = null;
                    this.imageSrc = '';
                    this.refreshChat(data1.ID);
                    data1.LAST_RESPONDED = this.date1;
                    data1['KEY'] = 'USER';
                    if (data1.STATUS != 'P') data1.STATUS = 'O';
                    this.isSpinning = false;
                    this.api
                      .updateTicketGroup(data1)
                      .subscribe((response: HttpResponse<any>) => {
                        const statusCode = response.status;
                        const responseBody = response.body;
                        if (statusCode === 200) {
                          this.fileDataLOGO_URL = null;
                          this.isSpinning = false;
                        } else {
                          this.isSpinning = false;
                        }
                      });
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
        var ticketDetailsData1 = {
          ID: 0,
          SENDER: 'U',
          CLIENT_ID: this.api.clientId,
          SENDER_ID: +this.decrepteduserID,
          TICKET_MASTER_ID: data1.ID,
          DESCRIPTION: this.DESCRIPTION,
          URL: this.genarateKeyLOGO_URL(),
        };
        if (this.decrepteduserID == 9) {
          data1.USER_TYPE = 'V';
        } else if (
          this.decrepteduserID != 6 &&
          this.decrepteduserID != 7 &&
          this.decrepteduserID != 8 &&
          this.decrepteduserID != 9
        ) {
          data1.USER_TYPE = 'B';
        }
        this.api
          .createTicketDetail(ticketDetailsData1)
          .subscribe((successCode) => {
            this.isSpinning = false;
            if (successCode['status'] == '200') {
              this.drawerClose();
              this.isSpinning = false;
              this.DESCRIPTION = '';
              this.fileDataLOGO_URL = null;
              this.imageSrc = '';
              this.message.success('Sent successfully', '');
              this.refreshChat(data1.ID);
              data1.LAST_RESPONDED = this.date1;
              data1['KEY'] = 'USER';
              if (data1.STATUS != 'P') data1.STATUS = 'O';
              this.api.updateTicket(data1).subscribe((successCode) => {
                if (successCode['status'] == '200') {
                  this.fileDataLOGO_URL = null;
                  this.DESCRIPTION = '';
                }
              });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to send', '');
            }
          });
      }
    } else {
      this.message.error('Please mention your problem.', '');
    }
  }
  send2(data1: Ticket) {
    this.isSpinning = true;
    var ticketDetailsData1 = {
      ID: 0,
      SENDER: 'U',
      CLIENT_ID: this.api.clientId,
      SENDER_ID: +this.decrepteduserID,
      TICKET_MASTER_ID: data1.ID,
      DESCRIPTION: this.DESCRIPTION,
      URL: this.genarateKeyLOGO_URL(),
    };
    this.api.createTicketDetail(ticketDetailsData1).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.isSpinning = false;
        this.DESCRIPTION = '';
      } else {
        this.message.error('Failed', '');
      }
    });
    data1.LAST_RESPONDED = this.date1;
    data1['KEY'] = 'USER';
    this.api.updateTicket(data1).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      }
    });
  }
  takeTicket(data: Ticket) {
    data.IS_TAKEN = true;
    data.TAKEN_BY_USER_ID = +this.decrepteduserID;
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      }
    });
  }
  reopenTicket(data: Ticket) {
    data.STATUS = 'O';
    data['KEY'] = 'USER';
    data['ACTION'] = 'MANUALLY_REOPEN';
    this.isSpinning = true;
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.isSpinning = false;
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      }
    });
  }
  genarateKeyLOGO_URL() {
    if (this.fileDataLOGO_URL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
      var url = this.date1 + number + '.' + fileExt;
      this.api.onUpload2(this.folderName, this.fileDataLOGO_URL, url);
      var LOGO_URL = url;
      return LOGO_URL;
    } else {
      return '';
    }
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
      const reader = new FileReader();
      this.fileDataLOGO_URL = file;
      reader.readAsDataURL(this.fileDataLOGO_URL);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }
  closeTicket(data: Ticket) {
    data.STATUS = 'C';
    data['KEY'] = 'USER';
    this.isSpinning = true;
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.isSpinning = false;
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      }
    });
  }
  uniqueDateArry: any = [];
  newData2: any = [];
  refreshChat(ticketNo) {
    this.data2 = [];
    this.newData2 = [];
    this.uniqueDateArry = [];
    let filter = ' AND TICKET_MASTER_ID=' + ticketNo;
    this.isSpinning = true;
    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filter)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.isSpinning = false;
            var data1: any = data.body['data'];
            for (var i = 0; i < data1.length; i++) {
              this.uniqueDateArry.push(
                this.datePipe.transform(
                  data1[i]['CREATED_MODIFIED_DATE'],
                  'yyyy-MM-dd'
                )
              );
            }
            this.uniqueDateArry = [...new Set(this.uniqueDateArry)];
            this.uniqueDateArry.sort();
            this.uniqueDateArry.forEach((d1) => {
              this.newData2.push({
                key: d1,
                data: data1.filter(
                  (data) =>
                    this.datePipe.transform(
                      data.CREATED_MODIFIED_DATE,
                      'yyyy-MM-dd'
                    ) == d1
                ),
              });
            });
            this.data2 = this.newData2;
            this.scrollIntoViewFunction();
          }
        },
        (err) => { }
      );
  }
  scrollIntoViewFunction() {
    setTimeout(() => {
      const scrollDownElement = document.getElementById('scrollDown');
      if (scrollDownElement) {
        scrollDownElement.click();
      }
    }, 500);
  }
  bottom() {
    const bottomElement: any = document.getElementById('bottom');
    if (bottomElement) {
      bottomElement.scrollIntoView();
    }
  }
}
