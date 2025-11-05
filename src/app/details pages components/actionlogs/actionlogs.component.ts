import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-actionlogs',
  templateUrl: './actionlogs.component.html',
  styleUrls: ['./actionlogs.component.css'],
})
export class ActionlogsComponent {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  timelineData: any = [];
  datepicker: any = new Date();
  JOB: any;
  dataListOrder: any = [];
  @Input() FILTER_ID: any;
  @Input() TYPE: any = '';
  @Input() CUSTOMER_ID: any = '';
  filterdata: any = '';
  filterdataVen: any = '';

  filterdata1: any;

  CustomersData: any;
  TechData: any;
  filterQuery: any = '';
  filterQueryDate: any;

  filterQuery1: string = '';
  filterQuery2: string = '';
  filterQuery3: string = '';

  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  Customers: any = [];
  Technician: any = [];
  selectedDate: Date[] = [];
  custidss: any = []

  date1 =
    new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1;
  value1: any = '';
  value2: any = '';
  ranges: any = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'This Year': [startOfYear(new Date()), endOfYear(new Date())],
  };
  loaddata: boolean = false;
  Vendorfilterquery1: any = '';
  public commonFunction = new CommonFunctionService();
  roleID;
  vendorid;
  useridd;
  TECHNICIAN_ID: any = [];
  roleIDs = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  customerMangeer: any = '';
  ngOnInit(): void {
    this.useridd = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.roleID = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.decreptedroleIDString = this.roleIDs
      ? this.commonFunction.decryptdata(this.roleIDs)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    if (
      this.decreptedroleID != 1 &&
      this.decreptedroleID != 6 &&
      this.decreptedroleID != 8 &&
      this.decreptedroleID != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    }
    if (this.decreptedroleID === 7) {
      this.customerMangeer = this.decreptedbackofficeId
    } else {
      this.customerMangeer = '';
    }
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(
      startOfMonth,
      'yyyy-MM-dd'
    );
    const formattedEndDate: any = this.datePipe.transform(
      endOfMonth,
      'yyyy-MM-dd'
    );

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    this.getCustomers();
    setTimeout(() => {
      if (this.TYPE == 'SHOP_ORDER') {
        this.getActionLog123();
      } else {
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
                  filterquery = ' AND ID in (' + TECH_IDS.toString() + ')';
                  this.Vendorfilterquery1 = TECH_IDS;
                  if (TECH_IDS.length > 0) {
                    this.getActionLog1();
                    this.getTECH1(filterquery);
                    this.getjovVendor();
                  }
                } else {
                  this.loaddata = false;
                }
              },
              (err) => {
                this.loaddata = false;
              }
            );
        } else {
          //
          if (this.TYPE != 'TECHNICIAN') {
            this.getTechinitialdata();
          } else {
            this.getActionLog();
          }
          if (this.TYPE != 'CUSTOMER') {
            this.getCustomers();
          }
          if (this.TYPE != 'JOB') {
            this.getjov();
          }
        }
      }
    }, 5000);

  }
  getCustomers() {
    var f = '';
    if (this.TYPE == 'JOB' || this.TYPE == 'ORDER') {
      f = ' AND ID=' + this.CUSTOMER_ID;
    }
    if (this.decreptedroleID == 7) {
      this.loadactionlogs = true;
      this.api
        .getAllCustomer(0, 0, 'NAME', 'desc', " AND CUSTOMER_TYPE='B' AND ACCOUNT_STATUS=1" + f + ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.CustomersData = data['data'];
              if (data['count'] > 0) {
                this.custidss = data['data'].map((element) => element.ID);
              } else {
                this.loadactionlogs = false;
                this.timelineData = [];
              }
            } else {
              this.CustomersData = [];
              this.loadactionlogs = false;
              this.timelineData = [];
            }
          },
          (err) => {
            this.CustomersData = [];
            this.loadactionlogs = false;
            this.timelineData = [];
          }
        );
    } else {
      this.loadactionlogs = true;
      this.api
        .getAllCustomer(0, 0, 'NAME', 'desc', ' AND ACCOUNT_STATUS=1' + f)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              // this.loadactionlogs = false;
              this.CustomersData = data['data'];
            } else {
              this.loadactionlogs = false;
              this.CustomersData = [];
            }
          },
          (err) => {
            this.loadactionlogs = false;
            this.CustomersData = [];
          }
        );
    }

  }

  getTechinitialdata() {
    if (this.roleID == '9') {
      this.vendorid = this.commonFunction.decryptdata(
        sessionStorage.getItem('vendorId') || ''
      );

      this.api
        .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.vendorid)
        .subscribe((successdata2) => {
          if (successdata2['code'] == 200) {
            if (successdata2['count'] > 0) {
              this.TECHNICIAN_ID = [];
              successdata2['data'].forEach((element) => {
                this.TECHNICIAN_ID.push(element.ID);
              });
              this.getTECH();
            }
          }
        });
    } else if (
      this.roleID != 1 &&
      this.roleID != 6 &&
      this.roleID != 8 &&
      this.roleID != 9
    ) {
      var filterrrr = ' AND USER_ID=' + this.useridd;
      this.api.getBackOfficeData(0, 0, '', '', filterrrr).subscribe(
        (dataaa1) => {
          if (dataaa1['code'] == 200) {
            this.api
              .getterritoryPincodeData11(
                0,
                0,
                '',
                '',
                " AND STATUS='M' AND TERRITORY_ID in (" +
                dataaa1['data'][0].TERITORY_IDS +
                ')'
              )
              .subscribe(
                (successdata) => {
                  if (successdata['code'] == 200) {
                    var t: any = [];
                    successdata['data'].forEach((element) => {
                      t.push(element.PINCODE_ID);
                    });
                    this.api
                      .getTechnicianPincodeMappedData(
                        0,
                        0,
                        '',
                        '',
                        " AND STATUS='M' AND PINCODE_ID in (" +
                        t.toString() +
                        ')'
                      )
                      .subscribe((successdata2) => {
                        this.TECHNICIAN_ID = [];
                        successdata2['data'].forEach((element) => {
                          this.TECHNICIAN_ID.push(element.TECHNICIAN_ID);
                        });
                        this.getTECH();
                      });
                  }
                },
                () => {
                  this.message.error('Something Went Wrong', '');
                }
              );
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.getTECH();
      this.getActionLog();
    }
  }
  getTECH() {
    var filter = '';
    if (
      this.roleID != 1 &&
      this.roleID != 6 &&
      this.roleID != 8
    ) {
      var tec = Array.from(new Set(this.TECHNICIAN_ID));
      filter = ' AND ID in(' + tec.toString() + ')';
    }

    this.api
      .getTechnicianData(0, 0, 'NAME', 'desc', ' AND IS_ACTIVE=1' + filter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.TechData = data['data'];
            if (
              this.roleID != 1 &&
              this.roleID != 6 &&
              this.roleID != 8
            ) {
              // this.Technician = tec[0];
              this.getActionLog();
            }
          } else {
            this.TechData = [];
          }
        },
        (err) => {
          this.TechData = [];
        }
      );
  }

  getTECH1(filt: any) {
    this.api
      .getTechnicianData(0, 0, 'NAME', 'desc', ' AND IS_ACTIVE=1' + filt)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.TechData = data['data'];
          } else {
            this.TechData = [];
          }
        },
        (err) => {
          this.TechData = [];
        }
      );
  }

  clearFilter() {
    this.filterQuery = '';
    this.filterQuery1 = '';
    this.filterQueryDate = '';
    this.filterQuery2 = '';
    this.filterQuery3 = '';
    this.Actiontyoe = [];
    this.JOB = null;
    this.selectedDate = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(
      startOfMonth,
      'yyyy-MM-dd'
    );
    const formattedEndDate: any = this.datePipe.transform(
      endOfMonth,
      'yyyy-MM-dd'
    );

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');

    if (this.TYPE != 'JOB' && this.TYPE != 'ORDER') this.Customers = null;

    this.Technician = null;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    if (this.TYPE == 'VENDOR') {
      this.getActionLog1();
    } else {
      if (this.decreptedroleID == 7) {
        if (this.custidss.length > 0) {
          this.getActionLog();
        }
      } else {
        this.getActionLog();
      }
    }
  }
  getjov() {
    if (
      this.TYPE == 'CUSTOMER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND CUSTOMER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'JOB' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'ORDER' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND ORDER_ID=' + this.FILTER_ID;
    } else if (
      this.TYPE == 'TECHNICIAN' &&
      this.FILTER_ID != null &&
      this.FILTER_ID != undefined &&
      this.FILTER_ID != ''
    ) {
      this.filterdata = ' AND TECHNICIAN_ID=' + this.FILTER_ID;
    } else {
      this.filterdata = '';
    }
    if (this.decreptedroleID == 7) {
      this.api
        .getpendinjobsdataa(0, 0, '', '', this.filterdata + ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId)
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
            } else {
              this.dataListOrder = [];
            }
          } else {
            this.dataListOrder = [];
          }
        });
    } else {
      this.api
        .getpendinjobsdataa(0, 0, '', '', this.filterdata)
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
            } else {
              this.dataListOrder = [];
            }
          } else {
            this.dataListOrder = [];
          }
        });
    }

  }

  getjovVendor() {
    if (
      this.Vendorfilterquery1 !== null &&
      this.Vendorfilterquery1 !== undefined &&
      this.Vendorfilterquery1 !== ''
    ) {
      this.filterdataVen =
        ' AND TECHNICIAN_ID IN (' + this.Vendorfilterquery1 + ')';
    }

    if (this.decreptedroleID == 7) {
      this.api
        .getpendinjobsdataa(0, 0, '', '', this.filterdataVen + ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId)
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
            } else {
              this.dataListOrder = [];
            }
          } else {
            this.dataListOrder = [];
          }
        });
    } else {
      this.api
        .getpendinjobsdataa(0, 0, '', '', this.filterdataVen)
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.dataListOrder = data['data'];
            } else {
              this.dataListOrder = [];
            }
          } else {
            this.dataListOrder = [];
          }
        });
    }

  }
  isSpinning: boolean = false;
  actionlog: any;
  customermfilt: any;

  Actiontyoe: any = [];
  customersFilter: any;
  techniciansFilter: any;
  jobCardFilter: any;
  actionLogTypeFilter: any;
  vendornewfilt: any;
  loadactionlogs: boolean = false;

  getActionLog() {
    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQueryDate = '';
    } else {
      if (this.TYPE == 'JOB' || this.TYPE == 'ORDER') {
        this.Customers = this.CUSTOMER_ID;
      }
      this.customersFilter =
        this.Customers != null &&
          this.Customers != undefined &&
          this.Customers != ''
          ? {
            CUSTOMER_ID: {
              $in: [this.Customers],
            },
          }
          : {};
      // Filter for TECHNICIANS
      this.techniciansFilter =
        this.Technician != null &&
          this.Technician != undefined &&
          this.Technician != ''
          ? {
            TECHNICIAN_ID: {
              $in: [this.Technician],
            },
          }
          : this.roleID != 1 &&
            this.roleID != 6 &&
            this.roleID != 8
            ? {
              TECHNICIAN_ID: {
                $in: [...[0], ...Array.from(new Set(this.TECHNICIAN_ID))],
              },
            }
            : {};

      // Filter for JOB_CARD_ID
      this.jobCardFilter =
        this.JOB != null && this.JOB != undefined && this.JOB != ''
          ? {
            JOB_CARD_ID: {
              $in: [this.JOB],
            },
          }
          : {};

      this.customermfilt =
        this.custidss != null && this.custidss != undefined && this.custidss != ''
          ? {
            CUSTOMER_ID: {
              $in: this.custidss,
            },
          }
          : {};
      // Filter for ACTION_LOG_TYPE (multi-select filter)
      this.actionLogTypeFilter =
        this.Actiontyoe != null &&
          this.Actiontyoe != undefined &&
          this.Actiontyoe != ''
          ? {
            ACTION_LOG_TYPE: {
              $in: this.Actiontyoe, // Multi-select filter applied
            },
          }
          : {};
      if (
        this.TYPE == 'CUSTOMER' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {};

        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              CUSTOMER_ID: {
                $in: [this.FILTER_ID], // Multi-select filter applied
              },
            }
            : {};
      } else if (
        this.TYPE == 'JOB' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          LOG_TYPE: {
            $in: [
              'Order',
              'Job',
              'Inventory',
              'Skill Request',
              'Technician',
              'System',
            ], // Multi-select filter applied
          },
        };

        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              JOB_CARD_ID: {
                $in: [this.FILTER_ID], // Multi-select filter applied
              },
            }
            : {};
      } else if (
        this.TYPE == 'ORDER' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          LOG_TYPE: {
            $in: [
              'Order',
              'Job',
              'Inventory',
              'Skill Request',
              'Technician',
              'System',
            ], // Multi-select filter applied
          },
        };

        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              ORDER_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
      } else if (
        this.TYPE == 'TECHNICIAN' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          ACTION_LOG_TYPE: {
            $in: ['Technician', 'User'], // Multi-select filter applied
          },
        };
        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              TECHNICIAN_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};


      } else {
        this.filterdata1 = {};
        this.actionlog = {};
      }

      this.filterQueryDate = JSON.stringify({
        $and: [
          {
            $expr: {
              $and: [
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$DATE_TIME',
                      },
                    },
                    this.value1, // Start date, e.g., "2025-01-14"
                  ],
                },
                {
                  $lte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$DATE_TIME',
                      },
                    },
                    this.value2, // End date, e.g., "2025-01-15"
                  ],
                },
              ],
            },
          },
          this.customersFilter,
          this.techniciansFilter,
          this.jobCardFilter,
          this.actionLogTypeFilter,
          this.filterdata1,
          this.actionlog,
          this.customermfilt
        ],
      });
    }

    // + this.actionlog + this.filterQueryDate +
    this.loadactionlogs = true;
    if (this.decreptedroleID === 7) {
      if (this.custidss.length > 0) {
        this.api
          .getActionLog(1, 0, 'DATE_TIME', 'desc', this.filterQueryDate)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadactionlogs = false;
                this.timelineData = this.formatTimelineData(data['data']);
                this.timelineData = this.sortEventsByTime(this.timelineData);
              } else {
                this.loadactionlogs = false;
                this.message.error('Failed To get Action Log Data', '');
              }
            },
            () => {
              this.loadactionlogs = false;
              this.message.error('Something Went Wrong', '');
            }
          );
      } else {
        this.loadactionlogs = false;
        this.timelineData = [];
      }
    } else {
      this.api
        .getActionLog(1, 0, 'DATE_TIME', 'desc', this.filterQueryDate)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadactionlogs = false;
              this.timelineData = this.formatTimelineData(data['data']);
              this.timelineData = this.sortEventsByTime(this.timelineData);
            } else {
              this.loadactionlogs = false;
              this.message.error('Failed To get Action Log Data', '');
            }
          },
          () => {
            this.loadactionlogs = false;
            this.message.error('Something Went Wrong', '');
          }
        );
    }

  }

  getActionLog1() {
    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQueryDate = '';
    } else {
      if (this.TYPE == 'JOB' || this.TYPE == 'ORDER') {
        this.Customers = this.CUSTOMER_ID;
      }
      this.customersFilter =
        this.Customers != null &&
          this.Customers != undefined &&
          this.Customers != ''
          ? {
            CUSTOMER_ID: {
              $in: [this.Customers],
            },
          }
          : {};
      // Filter for TECHNICIANS
      this.techniciansFilter =
        this.Technician != null &&
          this.Technician != undefined &&
          this.Technician != ''
          ? {
            TECHNICIAN_ID: {
              $in: [this.Technician],
            },
          }
          : this.roleID != 1 &&
            this.roleID != 6 &&
            this.roleID != 8
            ? {
              TECHNICIAN_ID: {
                $in: [...[0], ...Array.from(new Set(this.TECHNICIAN_ID))],
              },
            }
            : {};
      // Filter for JOB_CARD_ID
      this.jobCardFilter =
        this.JOB != null && this.JOB != undefined && this.JOB != ''
          ? {
            JOB_CARD_ID: {
              $in: [this.JOB],
            },
          }
          : {};
      // Filter for ACTION_LOG_TYPE (multi-select filter)
      this.actionLogTypeFilter =
        this.Actiontyoe != null &&
          this.Actiontyoe != undefined &&
          this.Actiontyoe != ''
          ? {
            ACTION_LOG_TYPE: {
              $in: this.Actiontyoe, // Multi-select filter applied
            },
          }
          : {};
      if (
        this.TYPE == 'CUSTOMER' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        // this.filterdata = " AND CUSTOMER_ID=" + this.FILTER_ID;
        this.actionlog = {};

        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              CUSTOMER_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
      } else if (
        this.TYPE == 'JOB' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          LOG_TYPE: {
            $in: [
              'Order',
              'Job',
              'Inventory',
              'Skill Request',
              'Technician',
              'System',
            ], // Multi-select filter applied
          },
        };

        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              JOB_CARD_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
      } else if (
        this.TYPE == 'ORDER' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          LOG_TYPE: {
            $in: [
              'Order',
              'Job',
              'Inventory',
              'Skill Request',
              'Technician',
              'System',
            ], // Multi-select filter applied
          },
        };
        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              ORDER_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
      } else if (
        this.TYPE == 'TECHNICIAN' &&
        this.FILTER_ID != null &&
        this.FILTER_ID != undefined &&
        this.FILTER_ID != ''
      ) {
        this.actionlog = {
          LOG_TYPE: {
            $in: [
              'Order',
              'Job',
              'Inventory',
              'Skill Request',
              'Technician',
              'System',
            ], // Multi-select filter applied
          },
        };
        this.filterdata1 =
          this.FILTER_ID != null &&
            this.FILTER_ID != undefined &&
            this.FILTER_ID != ''
            ? {
              TECHNICIAN_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
      } else {
        this.filterdata1 = {};
        this.actionlog = {};
      }
      this.customermfilt =
        this.custidss != null && this.custidss != undefined && this.custidss != ''
          ? {
            CUSTOMER_ID: {
              $in: this.custidss,
            },
          }
          : {};
      this.vendornewfilt =
        this.Vendorfilterquery1 != null && this.Vendorfilterquery1 != undefined
          ? {
            TECHNICIAN_ID: {
              $in: this.Vendorfilterquery1,
            },
          }
          : {};

      this.filterQueryDate = JSON.stringify({
        $and: [
          {
            $expr: {
              $and: [
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$DATE_TIME',
                      },
                    },
                    this.value1, // Start date, e.g., "2025-01-14"
                  ],
                },
                {
                  $lte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$DATE_TIME',
                      },
                    },
                    this.value2, // End date, e.g., "2025-01-15"
                  ],
                },
              ],
            },
          },
          this.customersFilter,
          this.techniciansFilter,
          this.jobCardFilter,
          this.actionLogTypeFilter,
          this.filterdata1,
          this.actionlog,
          this.vendornewfilt, this.customermfilt
        ],
      });
    }

    this.loadactionlogs = true;
    if (this.decreptedroleID === 7) {
      if (this.custidss.length > 0) {
        this.api
          .getActionLog(1, 0, 'DATE_TIME', 'desc', this.filterQueryDate)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadactionlogs = false;
                this.timelineData = this.formatTimelineData(data['data']);
                this.timelineData = this.sortEventsByTime(this.timelineData);
              } else {
                this.loadactionlogs = false;
                this.message.error('Failed To get Action Log Data', '');
              }
            },
            () => {
              this.loadactionlogs = false;
              this.message.error('Something Went Wrong', '');
            }
          );
      } else {
        this.timelineData = [];
        this.loadactionlogs = false;
      }
    } else {
      this.api
        .getActionLog(1, 0, 'DATE_TIME', 'desc', this.filterQueryDate)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadactionlogs = false;
              this.timelineData = this.formatTimelineData(data['data']);
              this.timelineData = this.sortEventsByTime(this.timelineData);
            } else {
              this.loadactionlogs = false;
              this.message.error('Failed To get Action Log Data', '');
            }
          },
          () => {
            this.loadactionlogs = false;
            this.message.error('Something Went Wrong', '');
          }
        );
    }
  }

  formatTimelineData(data: any[]): any[] {
    return data.map((day) => ({
      date: day._id,
      events: day.ACTION_LOGS.map((log) => ({
        icon: this.getStatusIcon(log.ORDER_STATUS || ''), // Adjust icon logic as needed
        title: log.ACTION_DETAILS || 'Action performed',
        time: log.DATE_TIME
          ? new Date(log.DATE_TIME).toLocaleTimeString()
          : 'N/A',
        user:
          log.ACTION_LOG_TYPE == 'Technician' || log.ACTION_LOG_TYPE == 'T'
            ? log.TECHNICIAN_NAME
            : log.USER_NAME,
        // description: log.TASK_DESCRIPTION || '',
        ACTION_LOG_TYPE: log.ACTION_LOG_TYPE,
      })),
    }));
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'OP':
        return '🛒';
      case 'OA':
        return '✅';
      case 'OR':
        return '❌';
      case 'OS':
        return '📅';
      case 'ON':
        return '🔄';
      case 'CO':
        return '🏁';
      case 'CA':
        return '🚫';
      default:
        return 'ℹ️';
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    // this.loadingRecords = true;
    if (this.selectedDate != null && this.selectedDate.length === 2) {
      this.value1 = this.datePipe.transform(this.selectedDate[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.selectedDate[1], 'yyyy-MM-dd');
      if (this.TYPE == 'VENDOR') {
        this.getActionLog1();
      } else {
        if (this.decreptedroleID == 7) {
          if (this.custidss.length > 0) {
            this.getActionLog();
          }
        } else {
          this.getActionLog();
        }
      }
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
    } else {
      this.message.error('Please Select Filter', '');
      this.filterQuery = '';
      this.isFilterApplied = 'default';
    }
  }
  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }

  sortEventsByTime(data: any[]): any[] {
    return data
      .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date
      .map((dateObj) => {
        return {
          ...dateObj,
          events: dateObj.events.sort((a: any, b: any) => {
            // Convert time strings to Date objects for proper AM/PM sorting
            const timeA = new Date(`1970-01-01 ${a.time}`);
            const timeB = new Date(`1970-01-01 ${b.time}`);
            return timeB.getTime() - timeA.getTime(); // Sort descending
          }),
        };
      });
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  getActionLog123() {
    // if (this.selectedDate == undefined || this.selectedDate.length == 0) {
    //   this.filterQueryDate = '';
    // } else {
    this.customersFilter = {
      ORDER_ID: {
        $in: [this.FILTER_ID],
      },
    };
    this.actionlog = {
      LOG_TYPE: {
        $in: ['order', 'Order', 'Cart'],
      },
    };

    this.filterQueryDate = JSON.stringify({
      $and: [
        // {
        //   $expr: {
        //     $and: [
        //       {
        //         $gte: [
        //           {
        //             $dateToString: {
        //               format: '%Y-%m-%d',
        //               date: '$DATE_TIME',
        //             },
        //           },
        //           this.value1, // Start date, e.g., "2025-01-14"
        //         ],
        //       },
        //       {
        //         $lte: [
        //           {
        //             $dateToString: {
        //               format: '%Y-%m-%d',
        //               date: '$DATE_TIME',
        //             },
        //           },
        //           this.value2, // End date, e.g., "2025-01-15"
        //         ],
        //       },
        //     ],
        //   },
        // },
        this.customersFilter,
        this.actionlog,
      ],
    });
    // }

    this.loadactionlogs = true;
    this.api
      .getActionLogforshoppp(1, 0, 'DATE_TIME', 'desc', this.filterQueryDate)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadactionlogs = false;
            this.timelineData = this.formatTimelineData(data['body']['data']);
            this.timelineData = this.sortEventsByTime(this.timelineData);
          } else {
            this.loadactionlogs = false;
            this.message.error('Failed To get Action Log Data', '');
          }
        },
        () => {
          this.loadactionlogs = false;
          this.message.error('Something Went Wrong', '');
        }
      );
  }
}