import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

// sanjana
export class saveOrderData {
  ORDER_STATUS: any = '';
  EXPECTED_DATE_TIME: null;
  ID: number;
  REMARK: any = '';
  ACCEPTANCE_REMARK: any = '';
  ASSING_TO: number=0
}

@Component({
  selector: 'app-orderdetailsdrawer',
  templateUrl: './orderdetailsdrawer.component.html',
  styleUrls: ['./orderdetailsdrawer.component.css'],
})
export class OrderdetailsdrawerComponent {
  @Input() TYPE_FOR_LOCAL = '';
  @Input() FILTER_ID_FOR_LOCAL: any = null;
  roleId = sessionStorage.getItem('roleId');
  @Input() TERRITORY_IDS: any = [];
  decreptedroleId = 0;
  ngOnInit() {
    var decreptedroleIdString = this.roleId
      ? this.commonFunction.decryptdata(this.roleId)
      : '';
    this.decreptedroleId = parseInt(decreptedroleIdString, 10);

    this.getorderDetails();
    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.decrepteduserID = parseInt(this.decrepteduserIDString, 10);

    this.chatfilter = ' AND ORDER_ID = ' + this.orderDetails.ID;
    this.invoicefilter = ' AND ORDER_ID = ' + this.orderDetails.ID;
    this.actionfilter = " AND ACTION_LOG_TYPE IN('O')" + this.invoicefilter;

    this.getAllMappedVendors();
  }
  formatTimess(time: string): string {
    if (!time) return '';
    let [hours, minutes] = time.split(':');
    let period = +hours >= 12 ? 'PM' : 'AM';
    let formattedHours = +hours % 12 || 12; // Convert 0 or 12 to 12
    return `${formattedHours}:${minutes} ${period}`;
  }
  showjobcard: boolean = true;
  showverification: boolean = false;
  showchat: boolean = false;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = '';
  decrepteduserID = 0;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}
  @Input()
  drawerClose!: Function;
  @Input() vieworderdata: any;
  @Input() teritoryData: any;
  @Input() orderid: any;
  @Input() orderDetails: any;

  date = new Date();
  close(): void {
    this.drawerClose();
  }
  gettotal(value1: any, value2: any) {
    return Number(value1) * Number(value2);
  }
  openModal = false;
  public commonFunction = new CommonFunctionService();

  skills: any[] = [];
  jobdetails: any = '';
  estimatetime: any = 0;
  selectService: any;
  openmodelll(data, i) {
    this.openModal = true;
    this.selectService = data;
    this.estimatetime =
      Number(data.DURARTION_MIN) + Number(data.DURARTION_HOUR) * 60;
    this.getSkillsOfSerivice(data.SERVICE_ITEM_ID, i);
  }
  getSkillsOfSerivice(serviceId, i) {
    this.api
      .getTechnicianmapdataservice(
        0,
        0,
        '',
        '',
        ' AND SERVICE_ID = ' + serviceId
      )
      .subscribe((data) => {
        if (data['code'] == '200' && data['count'] > 0) {
          var skillName = '';
          data['data'].forEach((element) => {
            skillName = skillName + element.SKILL_NAME + ',';
          });
          this.selectService['SERVICE_SKILLS'] = skillName.substring(
            0,
            skillName.length - 1
          );
        } else {
          this.selectService['SERVICE_SKILLS'] = '';
        }
      });
  }
  closemodelll() {
    this.openModal = false;
    this.jobdetails = '';
    this.estimatetime = '';
  }
  remoteJob = false;
  createJob() {
    // if (
    //   this.jobdetails == undefined ||
    //   this.jobdetails == null ||
    //   this.jobdetails.trim() == ''
    // ) {
    //   this.message.error('Enter additional remark', '');
    // } else
    if (
      this.estimatetime == undefined ||
      this.estimatetime == null ||
      this.estimatetime == 0
    ) {
      this.message.error(
        'Enter estimated time in mins & it should be in multiple of 10.',
        ''
      );
    } else if (
      parseInt(this.estimatetime) < 10 ||
      parseInt(this.estimatetime) % 10 !== 0
    ) {
      this.message.error('Estimated time should be in multiple of 10.', '');
    } else if (
      (this.selectService['SERVICE_SKILLS'] == undefined ||
        this.selectService['SERVICE_SKILLS'] == null ||
        this.selectService['SERVICE_SKILLS'] == '') &&
      (this.skills == undefined ||
        this.skills == null ||
        this.skills.length == 0)
    ) {
      this.message.error('Please select skills.', '');
    } else {
      var SERVICE_FULL_NAME = '';
      if (
        this.selectService.SERVICE_PARENT_NAME != undefined &&
        this.selectService.SERVICE_PARENT_NAME != null &&
        this.selectService.SERVICE_PARENT_NAME != ''
      ) {
        SERVICE_FULL_NAME =
          this.selectService.CATEGORY_NAME +
          '>' +
          this.selectService.SUB_CATEGORY_NAME +
          '>' +
          this.selectService.SERVICE_PARENT_NAME +
          '>' +
          this.selectService.SERVICE_NAME;
      } else {
        SERVICE_FULL_NAME =
          this.selectService.CATEGORY_NAME +
          '>' +
          this.selectService.SUB_CATEGORY_NAME +
          '>' +
          this.selectService.SERVICE_NAME;
      }

      var data = {
        USER_ID: this.decrepteduserID,
        TASK_DESCRIPTION: this.jobdetails,
        ORDER_ID: this.selectService.ORDER_ID,
        TECHNICIAN_COST: this.selectService.TECHNICIAN_COST,
        VENDOR_COST: this.selectService.VENDOR_COST,
        ORDER_DETAILS_ID: this.selectService.ID,
        ORDER_NO: this.vieworderdata.orderData[0].ORDER_NUMBER,
        CUSTOMER_ID: this.vieworderdata.orderData[0].CUSTOMER_ID,
        CUSTOMER_TYPE: this.vieworderdata.orderData[0].CUSTOMER_TYPE,
        CUSTOMER_NAME: this.vieworderdata.orderData[0].CUSTOMER_NAME,
        SERVICE_ID: this.selectService.SERVICE_ITEM_ID,
        SERVICE_ADDRESS: this.vieworderdata.orderData[0].SERVICE_ADDRESS,
        LATTITUTE: this.vieworderdata.orderData[0].SERVICE_LATITUDE,
        LONGITUDE: this.vieworderdata.orderData[0].SERVICE_LONGITUDE,
        SERVICE_SKILLS: this.selectService['SERVICE_SKILLS'],
        SERVICE_FULL_NAME: SERVICE_FULL_NAME,
        SERVICE_NAME: this.selectService.SERVICE_NAME,
        PINCODE: this.vieworderdata.orderData[0].PINCODE,
        TERRITORY_ID: this.vieworderdata.orderData[0].TERRITORY_ID,
        TERRITORY_NAME: this.vieworderdata.orderData[0].TERRITORY_NAME,
        SERVICE_AMOUNT: this.selectService.TOTAL_AMOUNT,
        ESTIMATED_TIME_IN_MIN: this.estimatetime,
        EXPECTED_DATE_TIME: this.vieworderdata.orderData[0].EXPECTED_DATE_TIME,
        IS_REMOTE_JOB: this.remoteJob,
      };

      if (
        this.selectService['SERVICE_SKILLS'] == undefined ||
        this.selectService['SERVICE_SKILLS'] == null ||
        this.selectService['SERVICE_SKILLS'] == ''
      ) {
        data['SERVICE_SKILLS'] = this.skills.toString();
      }
      this.isSpinning = true;
      this.api.createJobCard(data).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Job generated successfully', '');
            this.getorderDetails();
            this.isSpinning = false;
            this.openModal = false;
            this.jobdetails = '';
            this.estimatetime = '';
          } else {
            this.message.error('Failed to generated job.', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Failed to generated job.', '');
        }
      );
    }
  }

  // sanjana

  DATETIME: Date;
  orderData: any = new saveOrderData();

  drawerVisiblepastorder: boolean = false;
  drawerDatapastorder: any;
  drawerTitlepastorder!: string;

  drawerCustomerRatingTitle!: string;
  drawerCustomerRatingVisible: boolean = false;
  drawerRatingVisible: boolean = false;
  drawerDataRating: any;

  STATUS: string = ''; // This will store the selected value of the radio button
  data = {
    REMARK: '',
  };

  viewPastOrders(data: any) {
    this.drawerTitlepastorder =
      `Past Order Of ` + this.orderDetails.CUSTOMER_NAME;
    this.drawerDatapastorder = this.orderDetails;
    this.drawerVisiblepastorder = true;
  }

  viewCustomerRating() {
    this.drawerCustomerRatingTitle = 'Rating';
    this.drawerDataRating = this.orderDetails;
    this.drawerCustomerRatingVisible = true;
  }

  viewCustomerchat() {
    this.showjobcard = false;
    this.showverification = false;
    this.showchat = true;
    this.showmap = false;
  }

  drawerClosepastorder(): void {
    this.drawerVisiblepastorder = false;
  }

  get closeCallbackpastorder() {
    return this.drawerClosepastorder.bind(this);
  }

  acceptorder() {
    if (this.STATUS != null && this.STATUS != undefined && this.STATUS != '') {
      if (this.STATUS == 'R') {
        if (
          this.orderData.REMARK == null ||
          this.orderData.REMARK == undefined ||
          this.orderData.REMARK == ''
        ) {
          this.message.error('Please Enter Reject Remark', '');
          return;
        } else {
          this.orderData.ORDER_STATUS = 'OR';
        }
      } else if (this.STATUS == 'Res') {
        if (this.expectedDate == null || this.expectedDate == undefined) {
          this.message.error('Please select date', '');
          return;
        } else if (this.time == null || this.time == undefined) {
          this.message.error('Please select time', '');
          return;
        }
      }
      var serviceIds: any = [];
      if (this.STATUS == 'A' || this.STATUS == 'Res') {
        if (this.STATUS == 'Res') {
          this.orderData.ORDER_STATUS = 'OS';
        } else {
          this.orderData.ORDER_STATUS = 'OA';
        }
        var expecteddateee = this.datePipe.transform(
          this.expectedDate,
          'yyyy-MM-dd'
        );
        var expecteddateeetime = this.datePipe.transform(this.time, 'HH:mm:ss');
        var totaldatee = `${expecteddateee} ${expecteddateeetime}`;
        if (this.STATUS == 'Res')
          this.orderData.EXPECTED_DATE_TIME = totaldatee;
        else
          this.orderData.EXPECTED_DATE_TIME =
            this.vieworderdata.orderData[0].EXPECTED_DATE_TIME;

        this.vieworderdata['detailsData'].forEach((element) => {
          if (element.IS_JOB_CREATED_DIRECTLY == 1)
            serviceIds.push(element.SERVICE_ITEM_ID);
        });
      }
      if (this.STATUS == 'Res') {
        this.orderData.RESCHEDULE_APPROVE_DATE = this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm'
        );
      }

    // this.orderData.ASSIGNED_TO = this.vendors
 


//   if (this.decreptedroleId === 8) {
//   this.orderData.ASSING_TO = 
//     (this.STATUS === 'R' || this.STATUS === 'Res') ? 0 : this.vendors;
// }

if (this.decreptedroleId === 8) {
  if (this.STATUS === 'R' || this.STATUS === 'Res') {
    this.orderData.ASSING_TO = 0;
  } else {
    // जर vendors array असेल आणि length == 0 असेल तर 0 पाठवा
    if (Array.isArray(this.vendors) && this.vendors.length === 0) {
      this.orderData.ASSING_TO = 0;
    } else {
      this.orderData.ASSING_TO = this.vendors || 0;
    }
  }
}





      this.orderData.ID = this.orderDetails.ID;
      this.orderData.TERRITORY_ID = this.orderData['SERVICE_ITEM_IDS'] =
        serviceIds;
      this.isSpinning = true;
      this.api.acceptorder(this.orderData).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            if (this.STATUS == 'A') {
              this.message.success('Order Accepted Successfully', '');
            }
            if (this.STATUS == 'R') {
              this.message.success('Order has been Rejected', '');
            }
            if (this.STATUS == 'Res') {
              this.message.success(
                'Your order has been successfully rescheduled',
                ''
              );
            }
            this.getorderDetails2();
            this.isSpinning = false;
          } else {
            if (this.STATUS == 'A') {
              this.message.error('Failed To Accept Order.', '');
            }
            if (this.STATUS == 'R') {
              this.message.error('Failed To Rejected Order.', '');
            }
            if (this.STATUS == 'Res') {
              this.message.error('Failed To Rescheduled Order.', '');
            }

            this.isSpinning = false;
          }
        },
        () => {
          this.isSpinning = false;
        }
      );
    } else {
      this.message.error('Please Select Order Status', '');
    }
  }
  deleteCancel() {}

  drawerCloseRating(): void {
    this.drawerCustomerRatingVisible = false;
  }

  get closeCallbackRating() {
    return this.drawerClose.bind(this);
  }

  techData: any = [];
  TECHNICIAN_NAME: any;
  selectedTechnicianName: string = '';

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
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  checked = true;
  showactionlog: boolean = false;
  showinvoicetable: boolean = false;
  showmap: boolean = false;

  showaction() {
    this.showactionlog = true;
    this.showinvoicetable = false;
    this.showjobcard = false;
    this.showverification = false;
    this.showchat = false;
    this.showmap = false;
    this.getActionLog();
  }

  showverificationn() {
    this.showactionlog = false;
    this.showinvoicetable = false;
    this.showjobcard = false;
    this.showverification = true;
    this.showchat = false;
    this.showmap = false;
  }
  backall() {
    this.showactionlog = false;
    this.showinvoicetable = false;
    this.showjobcard = true;
    this.showverification = false;
    this.showchat = false;
    this.showmap = false;
  }

  modalStyle = {
    top: '20px',
  };

  checked1 = false;

  // purvamam
  timelineData: any = [];
  invoiceData: any = [];
  getActionLog() {
    var filter = '';
    if (this.checked == true && this.checked1 == false) {
      filter = " AND ACTION_LOG_TYPE IN('O')";
    } else if (this.checked == false && this.checked1 == true) {
      filter = " AND ACTION_LOG_TYPE IN('J')";
    } else {
      filter = " AND ACTION_LOG_TYPE IN('O','J')";
    }
    this.api
      .getActionLog(0, 0, '', '', filter + ' AND ORDER_ID= ' + this.orderid)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.timelineData = this.formatTimelineData(data['data']);
          } else {
            this.message.error('Failed To get Action Log Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  formatTimelineData(data: any[]): any[] {
    return data.map((day) => ({
      date: day.DATE,
      events: day.ACTION_LOGS.map((log) => ({
        icon: this.getStatusIcon(log.ORDER_STATUS || ''), // Adjust icon logic as needed
        title: log.ACTION_DETAILS || 'Action performed',
        time: log.ORDER_DATE_TIME
          ? new Date(log.ORDER_DATE_TIME).toLocaleTimeString()
          : 'N/A',
        user: log.TECHNICIAN_NAME || 'Unknown',
        description: log.TASK_DESCRIPTION || 'No description provided',
      })),
    }));
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'order placed':
        return '🛒';
      case 'order accepted':
        return '✅';
      case 'order rejected':
        return '❌';
      case 'order scheduled':
        return '📅';
      case 'order ongoing':
        return '🔄';
      case 'order completed':
        return '🏁';
      case 'order cancelled':
        return '🚫';
      default:
        return 'ℹ️';
    }
  }

  TYPE = 'ORDER';
  FILTER_ID: any = null;
  setFilter() {
    this.TYPE = 'ORDER';
    this.FILTER_ID = this.orderDetails.ID;
  }

  dataList: any = [{ id: 1 }];

  TIME: any;
  DATE: any;

  isSpinning = false;
  expectedDate: Date | null = null;
  time: any;
  orderDetailsData: any = [];
  jobCardIds: any[] = [];

  getorderDetails2() {
    this.api
      .getorderdetails(0, 0, '', '', '', this.orderDetails.ID)
      .subscribe((data) => {
        this.vieworderdata = data;
      });
  }
  skillsList: any = [];
  getorderDetails() {
    this.api
      .getorderDetails(0, 0, '', '', ' AND ORDER_ID = ' + this.orderDetails.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.orderDetailsData = data['data'];

            this.jobCardIds = this.orderDetailsData.map(
              (order) => order.JOB_CARD_ID
            );
            var d = this.orderDetailsData;
            var d2: any = [];
            var d3 = this.orderDetailsData;
            var d4 = this.orderDetailsData;

            d2 = d.reduce(
              (max, current) =>
                current.TOTAL_DURARTION_MIN > max.TOTAL_DURARTION_MIN
                  ? current
                  : max,
              d[0]
            );

            if (d2)
              this.teritoryData.MAX_DURARTION_MIN = d2.TOTAL_DURARTION_MIN;

            var maxTime = d3.reduce(
              (max, current) =>
                current.START_TIME > max.START_TIME ? current : max,
              d3[0]
            );

            var maxTime2 = d4.reduce(
              (max, current) =>
                current.END_TIME > max.END_TIME ? max : current,
              d4[0]
            );

            if (maxTime) this.teritoryData.START_TIME = maxTime.START_TIME;
            if (maxTime2) this.teritoryData.END_TIME = maxTime2.END_TIME;
            this.setDateDisableDateTime();
          } else {
            this.orderDetailsData = [];
            // this.message.error('Failed To Get Order Details Data', '');
          }
        },
        () => {
          // this.message.error('Something Went Wrong', '');
        }
      );

    this.api
      .getSkillData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200' && data['count'] > 0) {
          this.skillsList = data['data'];
        } else {
          this.skillsList = [];
        }
      });
  }
  getJobs() {
    this.getorderDetails();
  }
  TECHNICIAN_ID: any;
  jobcardtechmapdata: any = [];
  filteredJobcardTechData: any[] = [];
  show: any = 0;
  onSelectedIndexChange(event) {
    this.show = event;
  }
  actionfilter = " AND ACTION_LOG_TYPE IN('O')";
  chatfilter: any = '';
  invoicefilter: any = '';

  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;

  openjobcarddetails(data: any) {
    this.invoicefilter = ' AND JOB_CARD_ID=' + data.JOB_CARD_ID;

    this.jobdetaildrawerTitle = 'Job details of ' + data.JOB_CARD_NO;
    this.api
      .getpendinjobsdataa(1, 1, '', '', ' AND ID=' + data.JOB_CARD_ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdetailsdata = data['data'][0];
            this.jobdetailsshow = true;
          } else {
            this.jobdetailsdata = {};
          }
        },
        () => {}
      );
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  //Drawer Methods
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }

  // shreya
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: customer = new customer();
  widths: any = '100%';
  custid = 0;
  view(data: any): void {
    this.custid = data.CUSTOMER_ID;

    this.drawerTitleCustomers = `View details of ${data.CUSTOMER_NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }

  MIN_T_END_TIME: any;
  MAX_T_START_TIME: any;
  setDateDisableDateTime() {
    this.MIN_T_END_TIME =
      this.teritoryData.MAX_T_END_TIME < this.teritoryData.END_TIME
        ? this.teritoryData.MAX_T_END_TIME
        : this.teritoryData.END_TIME;

    this.MAX_T_START_TIME =
      this.teritoryData.MAX_T_START_TIME > this.teritoryData.START_TIME
        ? this.teritoryData.MAX_T_START_TIME
        : this.teritoryData.START_TIME;

    var date: any = new Date();
    const [hours1, minutes1, second] =
      this.MIN_T_END_TIME.split(':').map(Number);

    const today = new Date();

    this.currentDate = new Date(today); // Create a copy of the current date
    this.currentDate.setMinutes(
      this.currentDate.getMinutes() + this.teritoryData.MAX_DURARTION_MIN
    );
    date.setHours(
      this.currentDate.getHours(),
      this.currentDate.getMinutes(),
      0,
      0
    );
    var date1: any = new Date(this.currentDate);
    date1.setHours(hours1, minutes1, 0, 0);
    const differenceInMs: any = date1 - date; // Difference in milliseconds
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60)); //

    if (differenceInMinutes > 0) {
    } else if (differenceInMinutes < 0) {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
  }

  currentDate = new Date();
  currentDate2 = new Date();
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  currentSecond = new Date().getSeconds();
  disabledHours: any[] = [];
  disabledminutes: any[] = [];
  disabledPastDates = (current: Date): boolean =>
    differenceInCalendarDays(current, this.currentDate) < 0;
  calculateMaxStartTime(
    endHour: number,
    endMinute: number
  ): { hour: number; minute: number } {
    const totalMinutes = endHour * 60 + endMinute; // Convert end time to total minutes
    const maxStartMinutes = totalMinutes - this.teritoryData.MAX_DURARTION_MIN; // Subtract service duration
    return {
      hour: Math.floor(maxStartMinutes / 60),
      minute: maxStartMinutes % 60,
    };
  }

  calculateMaxStartTime2(records: any) {
    if (!Array.isArray(records) || records.length === 0) {
      return [];
    }

    // Sort records in descending order and slice top 3
    return records.sort((a, b) => b - a).slice(0, 3);
  }

  getDisabledHours = (): number[] => {
    const disabledHours: number[] = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const { hour: startHour, minute: startMinute } = this.parseTimeString(
      this.MAX_T_START_TIME
    );

    const { hour: endHour, minute: endMinute } = this.parseTimeString(
      this.MIN_T_END_TIME
    );

    var maxStartHour: any = this.calculateMaxStartTime2([
      currentHour,
      startHour,
      this.currentDate.getHours(),
    ]);

    if (this.expectedDate) {
      if (this.expectedDate.toDateString() == currentDate.toDateString()) {
        for (let i = 0; i < 24; i++) {
          if (i < Number(maxStartHour[0]) || i > endHour) {
            disabledHours.push(i);
          }
        }
      } else {
        for (let i = 0; i < 24; i++) {
          if (i < startHour || i > endHour) {
            disabledHours.push(i);
          }
        }
      }
    }

    this.disabledHours = disabledHours;
    return disabledHours;
  };

  getDisabledMinutes = (hour: number): number[] => {
    var disabledMinutes: number[] = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const { hour: startHour, minute: startMinute } = this.parseTimeString(
      this.MAX_T_START_TIME
    );
    const { hour: endHour, minute: endMinute } = this.parseTimeString(
      this.MIN_T_END_TIME
    );

    if (this.expectedDate) {
      if (this.expectedDate.toDateString() == currentDate.toDateString()) {
        if (hour == startHour) {
          for (let i = 0; i < 60; i++) {
            if (i < startMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour == this.currentDate.getHours()) {
          for (let i = 0; i < 60; i++) {
            if (i < this.currentDate.getMinutes()) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour == currentHour) {
          for (let i = 0; i < 60; i++) {
            if (i < this.currentMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (
          hour > startHour &&
          hour > this.currentDate.getHours() &&
          hour > currentHour
        ) {
          disabledMinutes = [];
        }
        if (hour == endHour) {
          for (let i = 0; i < 60; i++) {
            if (i > endMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        disabledMinutes = [...new Set(disabledMinutes)];
      } else {
        if (hour == startHour) {
          for (let i = 0; i < 60; i++) {
            if (i < startMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour > startHour) {
          disabledMinutes = [];
        }
        if (hour == endHour) {
          for (let i = 0; i < 60; i++) {
            if (i > endMinute) {
              disabledMinutes.push(i);
            }
          }
        }
      }
    }

    this.disabledminutes = disabledMinutes;
    return disabledMinutes;
  };

  parseTimeString(timeString: string): { hour: number; minute: number } {
    const [hour, minute, seconds] = timeString.split(':').map(Number);
    return { hour, minute };
  }

  setDate(event) {
    this.expectedDate = event;
    this.time = null;
    this.setDateDisableDateTime();
  }

  setTime(value) {
    if (value != undefined && value != null) {
      let minutes = value.getMinutes();
      minutes = Math.round(minutes / 10) * 10;
      value.setMinutes(minutes);
      value.setSeconds(0);
      value.setMilliseconds(0);

      if (this.disabledHours.includes(value.getHours())) {
        this.time = undefined;
        this.message.error(
          'You can not schedule order at ' + value.getHours() + ':' + minutes,
          ''
        );
      } else if (this.disabledminutes.includes(value.getMinutes())) {
        this.time = undefined;
        this.message.error(
          'You can not schedule order at ' + value.getHours() + ':' + minutes,
          ''
        );
      } else this.time = value;
    } else {
      this.time = undefined;
    }
  }

  showerror = false;
  checkLength() {
    this.showerror = !this.showerror;
  }

  formatTime(totalMinutes): string {
    var hoursMatch = Math.floor(totalMinutes / 60);
    var minutesMatch = totalMinutes % 60;
    const hours = hoursMatch ? this.padZero(hoursMatch) : '00';
    const minutes = minutesMatch ? this.padZero(minutesMatch) : '00';

    return `${hours}:${minutes}`;
  }

  padZero(value: string | number): string {
    return value.toString().padStart(2, '0');
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
  convertDateTiem(date: any) {
    const currentDate = new Date(this.currentDate2);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateWithTime1 = new Date(
      year,
      month,
      day,
      ...date.split(':').map(Number)
    );
    return new Date(dateWithTime1);
  }

  type = 'a';
  addresses = [];
  terriotrystarttime1: any = null;
  terriotryendtime1: any = null;

  isTerritoryExpress = false;
  storeserviceaddress;
  storeBillingaddress;

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerCloseorder(): void {
    this.ordercreateVisible = false;
  }

  //Drawer Methods
  get closeCallbackorder() {
    return this.drawerCloseorder.bind(this);
  }
  showExpress = false;
  specialInstruction = '';

  editOrder(data: any): void {
    this.type = 'e';

    this.api.getorderdetails(0, 0, '', '', '', data.ID).subscribe((data2) => {
      this.vieworderdata = data2;
      this.vieworderdata.orderData[0]['ADDRESS_ID'] =
        this.vieworderdata.detailsData[0]['CUSTOMER_SERVICE_ADDRESS_ID'];
      this.vieworderdata.orderData[0]['ADDRESS_ID1'] =
        this.vieworderdata.detailsData[0]['CUSTOMER_BILLING_ADDRESS_ID'];
      this.api
        .OrderAddressMap(
          0,
          0,
          '',
          '',
          ' AND ORDER_ID= ' + this.vieworderdata.orderData[0]['ID']
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.addresses = data['data'];
            this.addresses.forEach((item: any) => {
              if (
                item.ID == this.vieworderdata.orderData[0]['SERVICE_ADDRESS_ID']
              ) {
                this.storeserviceaddress = item;
              }
              if (
                item.ID == this.vieworderdata.orderData[0]['BILLING_ADDRESS_ID']
              ) {
                this.storeBillingaddress = item;
              }
            });
          } else this.addresses = [];
        });

      this.expectedDate = new Date(
        this.vieworderdata.orderData[0]['EXPECTED_DATE_TIME']
      );
      this.time = new Date(
        this.vieworderdata.orderData[0]['EXPECTED_DATE_TIME']
      );
      this.vieworderdata.orderData[0]['IS_EXPRESS'] =
        this.vieworderdata.orderData[0].IS_EXPRESS == 0 ? false : true;
      var d3 = this.vieworderdata.detailsData;
      var d4 = this.vieworderdata.detailsData;
      this.specialInstruction =
        this.vieworderdata.orderData[0]['SPECIAL_INSTRUCTIONS'];
      var maxTime = d3.reduce(
        (max, current) => (current.START_TIME > max.START_TIME ? current : max),
        d3[0]
      );

      var maxTime2 = d4.reduce(
        (max, current) => (current.END_TIME > max.END_TIME ? max : current),
        d4[0]
      );
      var d2: any = [];
      var d = this.vieworderdata.detailsData;
      d2 = d.reduce(
        (max, current) =>
          current.TOTAL_DURARTION_MIN > max.TOTAL_DURARTION_MIN ? current : max,
        d[0]
      );
      if (d2)
        this.vieworderdata.orderData[0].MAX_DURARTION_MIN =
          d2.TOTAL_DURARTION_MIN;
      if (maxTime)
        this.vieworderdata.orderData[0].START_TIME = maxTime.START_TIME;
      if (maxTime2)
        this.vieworderdata.orderData[0].END_TIME = maxTime2.END_TIME;
      this.vieworderdata.detailsData.forEach((element, index) => {
        if (element.IS_EXPRESS) this.showExpress = true;
      });

      this.MIN_T_END_TIME2 =
        this.vieworderdata.orderData[0].MAX_T_END_TIME <
        this.vieworderdata.orderData[0].END_TIME
          ? this.vieworderdata.orderData[0].MAX_T_END_TIME
          : this.vieworderdata.orderData[0].END_TIME;

      this.MAX_T_START_TIME2 =
        this.vieworderdata.orderData[0].MAX_T_START_TIME >
        this.vieworderdata.orderData[0].START_TIME
          ? this.vieworderdata.orderData[0].MAX_T_START_TIME
          : this.vieworderdata.orderData[0].START_TIME;

      this.setDateDisableDateTime2(this.vieworderdata.orderData[0]);
      this.api
        .getTeritory(
          1,
          1,
          '',
          '',
          ' AND IS_ACTIVE =1 AND ID=' +
            this.vieworderdata.orderData[0].TERRITORY_ID
        )
        .subscribe((data3) => {
          this.teritoryData = data3['data'][0];

          this.vieworderdata.orderData[0].TERRITORY_NAME =
            this.teritoryData['NAME'];
          this.vieworderdata.orderData[0].MAX_T_START_TIME =
            this.teritoryData['START_TIME'];
          this.vieworderdata.orderData[0].MAX_T_END_TIME =
            this.teritoryData['END_TIME'];
          this.isTerritoryExpress =
            this.teritoryData['IS_EXPRESS_SERVICE_AVAILABLE'] == 0
              ? false
              : true;
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const day = currentDate.getDate();
          const dateWithTime = new Date(
            year,
            month,
            day,
            ...this.teritoryData.START_TIME.split(':').map(Number)
          );
          const dateWithTime1 = new Date(
            year,
            month,
            day,
            ...this.teritoryData.END_TIME.split(':').map(Number)
          );

          this.terriotrystarttime1 = new Date(dateWithTime);
          this.terriotryendtime1 = new Date(dateWithTime1);
          this.getCategoriesNodes(this.vieworderdata.orderData[0]);
        });
      this.ordercreateVisible = true;
    });
  }

  ordercreateVisible = false;
  expandedKeys: any = [];
  selectedKeys: any;
  nodes: any = [];
  servicescatalogue: any = [];
  serviceSubCatName = '';
  serviceCatName = '';
  getCategoriesNodes(datas) {
    this.expandedKeys = [];
    this.api
      .getCategoriesForOrder(datas.TERRITORY_ID, datas.CUSTOMER_ID)
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'] != null) {
          this.nodes = data['data'];
          this.expandedKeys = this.getAllKeys(this.nodes);

          this.selectedKeys = this.nodes[0]['children'][0]['key'];
          this.getServices(this.selectedKeys, datas);
          this.nodes[0]['children'][0]['selected'] = true;
        } else this.nodes = [];
      });
  }

  getAllKeys(data: any): string[] {
    let keys: any = [];
    data.forEach((item) => {
      keys.push(item.key);
      if (item.children) {
        keys = keys.concat(this.getAllKeys(item.children));
      }
    });
    return keys;
  }

  getServices(SUB_CATEGORY_ID, data) {
    if (data.CUSTOMER_TYPE == 'B' && data['IS_SPECIAL_CATALOGUE'] == 1) {
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          '',
          0,
          data.TERRITORY_ID,
          data.CUSTOMER_TYPE,
          data.CUSTOMER_ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.servicescatalogue = data['data'];

            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            // this.category= this.servicescatalogue[0].CATEGORY_NAME
            this.serviceSubCatName =
              this.servicescatalogue[0]['SUB_CATEGORY_NAME'];

            // this.serviceCatName = this.servicescatalogue[0].SERVICE_NAME;
            // this.serviceItem= this.servicescatalogue[0].NAME
            this.servicescatalogue.forEach((element, i) => {
              this.servicescatalogue[i].QUANTITY = 1;
              this.servicescatalogue[i].TOTAL_AMOUNT = Number(
                this.servicescatalogue[i].KEY_PRICE
              );

              this.servicescatalogue[i]['options'] = this.servicescatalogue[i][
                'options'
              ] = Array.from(
                { length: this.servicescatalogue[i].MAX_QTY },
                (_, ii) => ii + 1
              );
            });
          } else {
            this.servicescatalogue = [];
          }
        });
    } else if (
      data.TERRITORY_ID != undefined &&
      data.TERRITORY_ID != null &&
      data.TERRITORY_ID > 0
    ) {
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          '',
          0,
          data.TERRITORY_ID,
          data.CUSTOMER_TYPE,
          data.CUSTOMER_ID
        )
        .subscribe((datas) => {
          if (datas['code'] == 200) {
            this.servicescatalogue = datas['data'];
            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            // this.category= this.servicescatalogue[0].CATEGORY_NAME
            this.serviceSubCatName =
              this.servicescatalogue[0].SUB_CATEGORY_NAME;

            this.servicescatalogue.forEach((element, i) => {
              this.servicescatalogue[i].QUANTITY = 1;
              this.servicescatalogue[i].TOTAL_AMOUNT = Number(
                this.servicescatalogue[i].KEY_PRICE
              );
              this.servicescatalogue[i]['options'] = Array.from(
                { length: this.servicescatalogue[i].MAX_QTY },
                (_, ii) => ii + 1
              );
            });
          } else {
            this.servicescatalogue = [];
          }
        });
    }
  }

  @Input() MIN_T_END_TIME2: any;
  @Input() MAX_T_START_TIME2: any;
  @Input() currentDate5 = new Date();
  setDateDisableDateTime2(data) {
    var date: any = new Date();
    const [hours1, minutes1, second] =
      this.MIN_T_END_TIME2.split(':').map(Number);

    const today = new Date();

    this.currentDate5 = new Date(today); // Create a copy of the current date
    this.currentDate5.setMinutes(
      this.currentDate5.getMinutes() + data.MAX_DURARTION_MIN
    );
    date.setHours(
      this.currentDate5.getHours(),
      this.currentDate5.getMinutes(),
      0,
      0
    );
    var date1: any = new Date(this.currentDate5);
    date1.setHours(hours1, minutes1, 0, 0);
    const differenceInMs: any = date1 - date; // Difference in milliseconds
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60)); //

    if (differenceInMinutes > 0) {
    } else if (differenceInMinutes < 0) {
      this.currentDate5.setDate(this.currentDate5.getDate() + 1);
    }
  }
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  ScheduleJob(data: any) {
    sessionStorage.setItem('Territory_Schedular', data.TERRITORY_ID);
    this.router.navigateByUrl('/order/dispatcher');
  }
  imageshow;
  ViewImage;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';
  ImageModalVisible = false;
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'CartItemPhoto/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  zoomLevel = 1;
  rotation = 0;

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
    }
  }

  rotateLeft() {
    this.rotation -= 90;
  }

  rotateRight() {
    this.rotation += 90;
  }

  reset() {
    this.zoomLevel = 1;
    this.rotation = 0;
  }

  parts: any = [];
  getParts() {
    this.parts = [];

    this.api
      .getjobCardInventories(
        0,
        0,
        '',
        '',
        ' AND ORDER_ID = ' + this.orderDetails.ID
      )
      .subscribe(
        (data) => {
          if (data['body']['code'] == 200) {
            this.parts = data['body']['data'];
          } else {
            this.parts = [];
          }
        },
        () => {}
      );
  }

  // sanjana

  vendors: any[] = [];
  vendorsList: any[] = [];

  getAllMappedVendors() {
    this.api
      .getAllMappedVendors(
        0,
        0,
        '',
        '',
        'AND IS_ACTIVE = 1 AND TERITORY_ID = ' + this.orderDetails.TERRITORY_ID
      )
      .subscribe((data) => {
        if (data['code'] == '200' && data['count'] > 0) {
          this.vendorsList = data['data'];
        } else {
          this.vendorsList = [];
        }
      });
  }
}
