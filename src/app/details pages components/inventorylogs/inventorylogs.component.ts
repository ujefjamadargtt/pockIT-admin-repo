import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { Router } from '@angular/router';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'app-inventorylogs',
  templateUrl: './inventorylogs.component.html',
  styleUrls: ['./inventorylogs.component.css'],
})
export class InventorylogsComponent {
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
  @Input() ITEM_NAME: any = '';
  @Input() TYPE: any = 'M';
  @Input() drawerCloset: any = Function;
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
  ngOnInit(): void {
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

    this.getActionLog123();
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
    this.Customers = null;
    this.Technician = null;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';

    this.getActionLog1();
  }

  isSpinning: boolean = false;
  actionlog: any;
  Actiontyoe: any = [];
  customersFilter: any;
  techniciansFilter: any;
  jobCardFilter: any;
  actionLogTypeFilter: any;
  vendornewfilt: any;
  loadactionlogs: boolean = false;

  getActionLog1() {
    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQueryDate = '';
    } else {
      if (this.TYPE == 'M')
        this.customersFilter = {
          INVENTORY_ID: {
            $in: [this.FILTER_ID],
          },
        };
      else
        this.customersFilter = {
          VARIANT_ID: {
            $in: [this.FILTER_ID],
          },
        };

      this.filterQueryDate = {
        $and: [
          {
            $expr: {
              $and: [
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$ACTION_DATE',
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
                        date: '$ACTION_DATE',
                      },
                    },
                    this.value2, // End date, e.g., "2025-01-15"
                  ],
                },
              ],
            },
          },

          this.filterdata1,
        ],
      };
    }

    this.loadactionlogs = true;
    this.api
      .getInventoryLog(1, 0, 'ACTION_DATE', 'desc', this.filterQueryDate)
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

  formatTimelineData(data: any[]): any[] {
    return data.map((day) => ({
      date: day.ACTION_DATE,
      events: {
        // icon: this.getStatusIcon(log.ORDER_STATUS || ''), // Adjust icon logic as needed
        title: day.ACTION_DETAILS || 'Action performed',
        time: day.ACTION_DATE
          ? new Date(day.ACTION_DATE).toLocaleTimeString()
          : 'N/A',
        user: day.USER_NAME,
        description: day.REMARK || '',
        ACTION_TYPE: day.ACTION_TYPE,
        WAREHOUSE_NAME: day.WAREHOUSE_NAME || '',
        QUANTITY: day.QUANTITY || '',
        UNIT_NAME: day.UNIT_NAME || '',
      },
    }));
  }
  mode: NzTimelineMode = 'left';
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

      this.getActionLog1();

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
    return data.sort((a, b) => {
      return b.date.localeCompare(a.date);
    });
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  getActionLog123() {
    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQueryDate = '';
    } else {
      if (this.TYPE == 'M')
        this.customersFilter = {
          INVENTORY_ID: {
            $in: [this.FILTER_ID],
          },
        };
      else
        this.customersFilter = {
          VARIANT_ID: {
            $in: [this.FILTER_ID],
          },
        };
      // this.actionlog = {
      //   LOG_TYPE: {
      //     $in: ['order', 'Cart'],
      //   },
      // };

      this.filterQueryDate = {
        $and: [
          {
            $expr: {
              $and: [
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$ACTION_DATE',
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
                        date: '$ACTION_DATE',
                      },
                    },
                    this.value2, // End date, e.g., "2025-01-15"
                  ],
                },
              ],
            },
          },
          this.customersFilter,
          // this.actionlog,
        ],
      };
    }

    this.loadactionlogs = true;
    this.api
      .getInventoryLog(1, 0, 'ACTION_DATE', 'desc', this.filterQueryDate)
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadactionlogs = false;
            this.timelineData = this.formatTimelineData(data['body']['data']);
            this.timelineData = this.sortEventsByTime(this.timelineData);
          } else {
            this.loadactionlogs = false;
            this.message.error('Failed To get Log Data', '');
          }
        },
        () => {
          this.loadactionlogs = false;
          this.message.error('Something Went Wrong', '');
        }
      );
  }
}
