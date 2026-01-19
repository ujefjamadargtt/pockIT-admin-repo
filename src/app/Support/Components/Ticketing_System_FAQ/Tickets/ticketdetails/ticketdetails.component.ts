import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { TransferTicketDrawerComponent } from '../transfer-ticket-drawer/transfer-ticket-drawer.component';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Ticket, Ticketdetails } from 'src/app/Support/Models/TicketingSystem';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrls: ['./ticketdetails.component.css'],
  providers: [DatePipe],
})
export class TicketdetailsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Ticket;
  @Input() data2: any = [];
  @Input() newstr: any = '';
  @Input() loading: any;
  userroleid: any;
  userroleid1: any;
  folderName = 'ticket';
  ticketDetailsData: Ticketdetails;
  DESCRIPTION;
  fileDataLOGO_URL: any;
  ID;
  date1: any;
  isSpinning = false;
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
        (data) => {
          if (data['status'] == 200) {
            this.empList = data.body['data'];
          }
        },
        (err) => { }
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
                SENDER: 'S',
                CLIENT_ID: this.api.clientId,
                SENDER_ID: this.decrepteduserID,
                TICKET_MASTER_ID: data1.ID,
                DESCRIPTION: this.DESCRIPTION,
                URL: LOGO_URL,
              };
              this.api
                .createTicketDetail(ticketDetailsData1)
                .subscribe((successCode) => {
                  this.isSpinning = false;
                  if (successCode['status'] == '200') {
                    this.isSpinning = false;
                    this.DESCRIPTION = '';
                    this.fileDataLOGO_URL = null;
                    this.imageSrc = '';
                    this.message.success('Sent successfully', '');
                    this.refreshChat(data1.ID);
                    data1.LAST_RESPONDED = this.date1;
                    if (data1['FIRST_RESOLVED_TIME'] == null)
                      data1['FIRST_RESOLVED_TIME'] = this.date1;
                    data1.STATUS = 'R';
                    this.api.updateTicket(data1).subscribe((successCode) => {
                      if (successCode['status'] == '200') {
                        this.fileDataLOGO_URL = null;
                        this.DESCRIPTION = '';
                        this.ok11 = true;
                      } else {
                      }
                    });
                  } else {
                    this.isSpinning = false;
                    this.message.error('Failed to Send', '');
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
          SENDER: 'S',
          CLIENT_ID: this.api.clientId,
          SENDER_ID: this.decrepteduserID,
          TICKET_MASTER_ID: data1.ID,
          DESCRIPTION: this.DESCRIPTION,
          URL: this.genarateKeyLOGO_URL(),
        };
        this.api
          .createTicketDetail(ticketDetailsData1)
          .subscribe((successCode) => {
            this.isSpinning = false;
            if (successCode['status'] == '200') {
              this.isSpinning = false;
              this.DESCRIPTION = '';
              this.fileDataLOGO_URL = null;
              this.imageSrc = '';
              this.message.success('Sent successfully', '');
              this.refreshChat(data1.ID);
              data1.LAST_RESPONDED = this.date1;
              data1.STATUS = 'R';
              this.api.updateTicket(data1).subscribe((successCode) => {
                if (successCode['status'] == '200') {
                  this.fileDataLOGO_URL = null;
                  this.DESCRIPTION = '';
                  this.ok11 = true;
                } else {
                }
              });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to Send', '');
            }
          });
      }
    } else {
      this.message.error('Please mention your solution.', '');
    }
  }
  send2(data1: Ticket) {
    this.isSpinning = true;
    var SENDER, SENDER_ID, TICKET_MASTER_ID, DESCRIPTION, URL;
    var ticketDetailsData1 = {
      ID: 0,
      SENDER: 'S',
      CLIENT_ID: this.api.clientId,
      SENDER_ID: this.decrepteduserID,
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
    data1.STATUS = 'R';
    data1.LAST_RESPONDED = this.date1;
    this.api.updateTicket(data1).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      } else {
      }
    });
  }
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  TAKEN_BY_USER_ID;
  takeTicket(data: Ticket) {
    data.IS_TAKEN = true;
    data.STATUS = 'S';
    data.TAKEN_BY_USER_ID = this.decrepteduserID;
    data.TICKET_TAKEN_DEPARTMENT_ID = this.data.DEPARTMENT_ID;
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
        this.TAKEN_BY_USER_ID = data.TAKEN_BY_USER_ID;
        sessionStorage.setItem('TAKEN_BY_USER_ID', this.TAKEN_BY_USER_ID);
      } else {
      }
    });
  }
  closeTicket(data: Ticket) {
    data.STATUS = 'C';
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      } else {
      }
    });
  }
  keepOnHold(data: Ticket) {
    data.STATUS = 'H';
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      } else {
      }
    });
  }
  bannTicket(data: Ticket) {
    data.STATUS = 'B';
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      } else {
      }
    });
  }
  unbannTicket(data: Ticket) {
    data.STATUS = 'O';
    data.ACTION = 'UNBANNED'
    this.api.updateTicket(data).subscribe((successCode) => {
      if (successCode['status'] == '200') {
        this.drawerClose();
        this.fileDataLOGO_URL = null;
        this.DESCRIPTION = '';
      } else {
      }
    });
  }
  genarateKeyLOGO_URL() {
    if (this.fileDataLOGO_URL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
      var url = this.date1 + number + '.' + fileExt;
      this.api.onUpload(this.folderName, this.fileDataLOGO_URL, url);
      var LOGO_URL = this.api.retriveimgUrl + this.folderName + '/' + url;
      return LOGO_URL;
    } else {
      return '';
    }
  }
  ok11: boolean = false;
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
  drawerVisible: boolean;
  drawerTitle: string;
  transferTicketDrawerData: any = [];
  @ViewChild(TransferTicketDrawerComponent, { static: false })
  TransferTicketDrawerComponentVar: TransferTicketDrawerComponent;
  empid: any;
  transferTicket(data) {
    this.empid = undefined;
    this.drawerTitle = 'Transfer > ' + 'Ticket No. ' + data.TICKET_NO;
    this.transferTicketDrawerData = [];
    this.api
      .getBackOfficeData(
        0,
        0,
        '',
        '',
        ' AND ROLE_ID = 25'
      )
      .subscribe(
        (data) => {
          this.transferTicketDrawerData = data['data'];
        },
        (err) => { }
      );
    this.drawerVisible = true;
  }
  transferTicketDrawerClose(): void {
    this.refreshChat(this.data.ID);
    this.drawerVisible = false;
    this.drawerClose();
  }
  get transferTicketCloseCallback() {
    return this.transferTicketDrawerClose.bind(this);
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
}