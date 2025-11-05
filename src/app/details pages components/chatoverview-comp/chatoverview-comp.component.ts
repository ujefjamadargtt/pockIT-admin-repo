import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-chatoverview-comp',
  templateUrl: './chatoverview-comp.component.html',
  styleUrls: ['./chatoverview-comp.component.css']
})
export class ChatoverviewCompComponent implements OnInit {
  @Input() FILTER_ID: any;
  @Input() TYPE: any = '';

  JOB: any;
  dataListOrder: any = [];
  cusstomerFilterOrder: any = '';
  chatDetailsdata: any = [];
  techData: any = [];
  TECHNICIAN_NAME: any;
  selectedTechnicianName: string = '';
  chatdata: any = [];
  jobcardtechmapdata: any = [];
  filteredJobcardTechData: any[] = [];
  orderData: any;
  orderDetailsData: any = [];
  jobCardIds: any[] = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  loaddata: boolean = false;
  ngOnInit(): void {
    if (this.TYPE == 'VENDOR') {
      var filterquery: any = '';
      var TECH_IDS: any = [];
      this.loaddata = true;
      this.api
        .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loaddata = false;

              data['data'].forEach((element) => {
                if (element.ID) TECH_IDS.push(element.ID);
              });
              filterquery =
                ' AND TECHNICIAN_ID in (' + TECH_IDS.toString() + ')';
              if (TECH_IDS.length > 0) this.getjobss(filterquery);
            } else {
              this.loaddata = false;
            }
          },
          (err) => {
            this.loaddata = false;

          }
        );
    } else {
      this.orderget();
    }
    // this.jobCardChatDetails();
  }

  filterdata: any = '';
  getjobss(filterdatapassed: any) {
    this.loaddata = true;
    this.api
      .getpendinjobsdataa(
        0, 0,
        '',
        '',
        filterdatapassed
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loaddata = false;
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
              this.JOB = data['data'][0]['ID']

              this.onTechnicianChange(data['data'][0]['ID'])
            } else {
              this.loaddata = false;
              this.cusstomerFilterOrder = '';
            }
            this.dataListOrder = data['data'];
          } else {
            this.loaddata = false;
            this.cusstomerFilterOrder = '';
          }
        }, (err => {
          this.loaddata = false;
          this.cusstomerFilterOrder = '';
        })
      );
  }
  orderget() {
    if (this.TYPE == 'CUSTOMER' && this.FILTER_ID != null && this.FILTER_ID != undefined && this.FILTER_ID != '') {
      this.filterdata = ' AND CUSTOMER_ID=' + this.FILTER_ID
    } else if (this.TYPE == 'JOB' && this.FILTER_ID != null && this.FILTER_ID != undefined && this.FILTER_ID != '') {
      this.filterdata = ' AND ID=' + this.FILTER_ID
    } else if (this.TYPE == 'ORDER' && this.FILTER_ID != null && this.FILTER_ID != undefined && this.FILTER_ID != '') {
      this.filterdata = ' AND ORDER_ID=' + this.FILTER_ID
    } else if (this.TYPE == 'TECHNICIAN' && this.FILTER_ID != null && this.FILTER_ID != undefined && this.FILTER_ID != '') {
      this.filterdata = ' AND TECHNICIAN_ID=' + this.FILTER_ID
    } else {
      this.filterdata = '';
    }
    this.api
      .getpendinjobsdataa(
        0, 0,
        '',
        '',
        this.filterdata
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
              this.JOB = data['data'][0]['ID']

              this.onTechnicianChange(data['data'][0]['ID'])
            } else {
              this.cusstomerFilterOrder = '';
            }
            this.dataListOrder = data['data'];
          } else {
            this.cusstomerFilterOrder = '';
          }
        }
      );
  }
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br/>');
  }
  chantcount: any = 0;
  urllll = appkeys.retriveimgUrl;

  jobCardChatDetails() {
    this.api
      .jobCardChatDetailsnew(0, 0, "_id", "", this.JOB)
      .subscribe(
        (data) => {
          if (data["status"] == 200) {
            this.chantcount = data['body']['count'];
            this.chatDetailsdata = data['body']["data"];
          } else {
            this.chantcount = 0;
            this.chatDetailsdata = [];
            this.message.error("Failed To Get Job Card Chat Details", "");
          }
        },
        () => {
          this.chantcount = 0;
          this.chatDetailsdata = [];
        }
      );
  }



  getTechnicianData() {
    this.api.getTechnicianData(0, 0, '', '', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.techData = data['data'];
        } else {
          this.techData = [];
          this.message.error('Failed To Get Technician Data', '');
        }
      },
      () => {
        // this.message.error('Something Went Wrong', '');
      }
    );
  }

  onTechnicianChange(d: any) {
    var selectedTechnician: any;
    if (d != null && d != undefined && d != '') {
      selectedTechnician = this.dataListOrder.find(
        (tech) => tech.ID === d
      );
      this.jobCardChatDetails();
    }

  }

}
