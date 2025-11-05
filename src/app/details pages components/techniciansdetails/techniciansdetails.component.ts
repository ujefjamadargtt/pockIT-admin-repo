import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-techniciansdetails',
  templateUrl: './techniciansdetails.component.html',
  styleUrls: ['./techniciansdetails.component.css'],
})
export class techniciansdetailsDetailsComponent {
  @Input() drawerClose: Function;
  @Input() techdetailsdata: any;
  @Input() jobId: any;
  @Input() TYPE: any = '';
  constructor(private api: ApiServiceService, private message: NzNotificationService) { }
  show: any = 0;
  onSelectedIndexChange(event) {
    this.show = event;
  }
  actionfilter = " AND ACTION_LOG_TYPE IN('T')";
  MAPlOCATION: any;
  ngOnInit(): void {
    this.getTechniciansJobs();
    this.actionfilter = " AND ACTION_LOG_TYPE IN('T') AND TECHNICIAN_ID=" + this.jobId;
    this.MAPlOCATION = [
      ...[],
      ...[
        {
          latitude: Number(this.jobdatss[0].LATTITUTE),
          longitude: Number(this.jobdatss[0].LONGITUDE),
          address:
            this.jobdatss[0]['JOB_CARD_NO'] +
            '-' +
            this.jobdatss[0]['CUSTOMER_NAME'] +
            ', ' +
            this.jobdatss[0].SERVICE_ADDRESS +
            '-' +
            this.jobdatss[0].PINCODE,
        },
      ],
    ];
  }
  jobdatss: any = [];
  jobcardids: any = [];
  invoicefilter: any;
  getTechniciansJobs() {
    this.api
      .getpendinjobsdataa(0, 0, '', '', ' AND TECHNICIAN_ID=' + this.jobId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdatss = data['data'];
            if (data['count'] > 0) {
              this.jobdatss.forEach((element: any) => {
                this.jobcardids.push(element.ID);
              });
              this.invoicefilter = ' AND JOB_CARD_ID in (' + this.jobcardids.toString() + ')';
            } else {
              this.invoicefilter = '';
            }
          } else {
            this.jobdatss = [];
            // this.message.error('Failed to get Pending job card data', '');
          }
        },
        () => {
          this.jobdatss = [];
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  paymentsData: any = [];
  // getPaymentLog() {
  //   this.api
  //     .getInvoiceLogs(1, 10, 'id', 'desc', '' + this.invoicefilter)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.paymentsData = data['data'];
  //         } else {
  //         }
  //       },
  //       () => { }
  //     );
  // }


}
