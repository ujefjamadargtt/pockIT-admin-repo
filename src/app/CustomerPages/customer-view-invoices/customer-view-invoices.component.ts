import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { techniacianRatings, TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-customer-view-invoices',
  templateUrl: './customer-view-invoices.component.html',
  styleUrls: ['./customer-view-invoices.component.css'],
  providers: [DatePipe]
})
export class CustomerViewInvoicesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: any;
  @Input() drawerVisible: boolean;
  @Input() custid: any;
  datalistCount: number = 0;
  isFocused: string = '';
  datalist: techniacianRatings = new techniacianRatings();
  isOk: boolean = false;
  isSpinning: boolean = false;
  constructor(private api: ApiServiceService, private message: NzNotificationService, public datepipe: DatePipe) { }
  ngOnInit() {
    this.api
      .getCustTechRatings(
        0,
        0,
        '',
        '',
        ' AND JOB_CARD_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.datalistCount = data['count'];
            if (data['data'] && data['data'].length > 0) {
              this.datalist = data['data'][0];
            } else {
              this.datalist = new techniacianRatings();
            }
            this.isSpinning = false;
          } else {
            this.datalistCount = 0;
            this.datalist = new techniacianRatings();
            this.message.error('Something Went Wrong ...', '');
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          this.datalistCount = 0;

          this.datalist = new techniacianRatings();
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong.', '');
            this.isSpinning = false;
          }
        }
      );
  }

  save(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;
    if (this.datalist.RATING === 0 || this.datalist.RATING === null || this.datalist.RATING === undefined || this.datalist.RATING === '') {
      this.isOk = false;
      this.message.error("Please give ratings", "")
    }
    // else if (this.datalist.COMMENTS === null || this.datalist.COMMENTS === undefined || this.datalist.COMMENTS.trim() === '') {
    //   this.isOk = false;
    //   this.message.error("Please enter comment", "")
    // }

    if (this.isOk) {
      this.isSpinning = true;
      {

        var calData: any = {
          TECHNICIAN_ID: this.data.TECHNICIAN_ID,
          ORDER_ID: this.data.ORDER_ID,
          CUSTOMER_ID: this.data.CUSTOMER_ID,
          JOB_CARD_ID: this.data.ID,
          ID: this.datalist.ID ? this.datalist.ID : null,
          RATING: this.datalist.RATING ? this.datalist.RATING : 0,
          COMMENTS: this.datalist.COMMENTS ? this.datalist.COMMENTS : null,
          FEEDBACK_DATE_TIME: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          CLIENT_ID: 1
        }


        if (this.datalistCount > 0) {
          this.api
            .updateCustTechRatings(calData)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Ratings given successfully.', '');
                this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Failed to give ratings', '');
                this.isSpinning = false;
              }
            }, err => {
              this.message.error('Failed to give ratings', '');
              this.isSpinning = false;
            });
        } else {
          this.api
            .createCustTechRatings(calData)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.isSpinning = false;
                this.message.success('Ratings updated successfully', '');
                this.drawerClose();
              } else {
                this.message.error('Failed to give ratings', '');
                this.isSpinning = false;
              }
            }, err => {
              this.message.error('Failed to give ratings', '');
              this.isSpinning = false;
            });
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
}
