import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Faqhead } from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-faq-head',
  templateUrl: './faq-head.component.html',
  styleUrls: ['./faq-head.component.css'],
})
export class FaqHeadComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Faqhead;
  org: any = [];
  isSpinning = false;
  isFocused: string = '';
  faqHeads: Faqhead[];
  isOk = true;
  applicationId = Number(this.cookie.get('applicationId'));
  namepatt = /[a-zA-Z][a-zA-Z ]+/;

  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    // this.loadFaqHeads();
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

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  loadFaqHeads() {
    this.isSpinning = true;
    let filterQuery = ' AND IS_PARENT=1 ';

    this.api
      .getAllFaqHeads(0, 0, '', '', filterQuery + ' AND STATUS =1 ')
      .subscribe(
        (localName) => {
          this.faqHeads = localName['body']['data'];
          this.isSpinning = false;
        },
        (err) => {

          this.isSpinning = false;
        }
      );

    this.api.getAllFaqHeads(1, 1, 'SEQUENCE_NO', 'DESC', '').subscribe(
      (data) => {
        if (data['status'] == 0) {
          this.data['SEQUENCE_NO'] = 1;
        } else {
          this.data['SEQUENCE_NO'] = data['body']['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {

      }
    );
  }


  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }

  close(accountMasterPage: NgForm): void {
    this.resetDrawer(accountMasterPage);
    this.drawerClose();
  }

  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.ORG_ID = Number(1);

    if (
      this.data.ORG_ID == 0 &&
      this.data.NAME.trim() == '' &&
      this.data.SEQUENCE_NO != undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    }
    //  else if (this.data.ORG_ID == undefined || this.data.ORG_ID <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Organization ', '');
    // } 
    // else if (this.data.PARENT_ID == undefined || this.data.PARENT_ID < 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Parent Name', '');
    // }
    else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please enter name', '');
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        this.data.PARENT_ID = 0;
        if (this.data.ID) {


          this.api.updateFaqHead(this.data).subscribe((successCode) => {


            if (successCode['status'] == '200') {
              this.message.success('Information Updated Successfully', '');
              if (!addNew) this.drawerClose();

              this.resetDrawer(accountMasterPage);
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Update Information', '');
              this.isSpinning = false;
            }
          }, err => {
            this.message.error('Something went wrong, please try again later', '');
            this.isSpinning = false;
          });
        } else {


          this.api.createFaqHead(this.data).subscribe((successCode) => {


            if (successCode['status'] == '200') {
              this.message.success('Information Saved Successfully', '');

              if (!addNew) {
                this.drawerClose();
                this.resetDrawer(accountMasterPage);
              } else {
                this.data = new Faqhead();
                this.resetDrawer(accountMasterPage);
              }

              // this.data.IS_PARENT = true;
              this.data.STATUS = true;
              // this.loadFaqHeads();
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Save Information', '');
              this.isSpinning = false;
            }
          }, err => {
            this.message.error('Something went wrong, please try again later', '');
            this.isSpinning = false;
          });
        }
      }
    }
  }
}