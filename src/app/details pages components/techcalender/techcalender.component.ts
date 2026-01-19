import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  IS_SERIVCE_AVAILABLE: boolean;
  DAY_START_TIME: any;
  DAY_END_TIME: any;
  BREAK_START_TIME: any;
  BREAK_END_TIME: any;
  ID: number;
  DATE_OF_MONTH: any;
  TECHNICIAN_ID: any;
}
@Component({
  selector: 'app-techcalender',
  templateUrl: './techcalender.component.html',
  styleUrls: ['./techcalender.component.css'],
})
export class TechcalenderComponent {
  @Input() FILTER_ID;
  saveData: any = new Data();
  date: Date = new Date();
  mode: 'month' | 'year' = 'month';
  selectedDate: Date | null = null; 
  selectedDayName: string = ''; 
  isVisible = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.getTechnicianWeekData1();
    this.getCalenderData();
    this.dateSelect = this.datePipe.transform(new Date(), 'dd');
  }
  openModal(event: any): void {
  }
  onModeChange(event: any): void {
    this.isVisible = false;
  }
  panelChange(event: { date: Date; mode: string }): void {
    this.isVisible = false;
    const currentMonth = event.date.getMonth() + 1; 
    const currentYear = event.date.getFullYear();
    this.getCalenderData();
  }
  year: any;
  month: any;
  formattedDate;
  dateSelect: any;
  currentDate: any = new Date();
  ModelShowWithTime(event: Date) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    const dayName = event.toLocaleDateString('en-US', options).substring(0, 2); 
    const date = event.getDate().toString().padStart(2, '0');
    this.dateSelect = event.getDate().toString().padStart(2, '0');
    this.month = event.getMonth() + 1; 
    this.year = event.getFullYear(); 
    this.formattedDate = `${this.year}-${this.month}-${date}`; 
    const matchingDay =
      this.techdata.length > 0 && this.techdata[0].WEEK_DAY_DATA
        ? this.techdata[0].WEEK_DAY_DATA.find(
          (day: any) => day.WEEK_DAY.toLowerCase() === dayName.toLowerCase()
        )
        : null;
    if (matchingDay) {
    } else {
    }
    const calendarDay = this.calenderdata.find(
      (day: any) => day.DATE_OF_MONTH === this.formattedDate
    );
    if (calendarDay) {
    } else {
    }
    if (calendarDay && calendarDay.DAY_START_TIME != null) {
      this.saveData.IS_SERIVCE_AVAILABLE = calendarDay.IS_SERIVCE_AVAILABLE;
      this.saveData.DAY_START_TIME = this.convertTimeToDate(
        calendarDay.DAY_START_TIME
      );
      this.saveData.DAY_END_TIME = this.convertTimeToDate(
        calendarDay.DAY_END_TIME
      );
      this.saveData.BREAK_START_TIME = this.convertTimeToDate(
        calendarDay.BREAK_START_TIME
      );
      this.saveData.BREAK_END_TIME = this.convertTimeToDate(
        calendarDay.BREAK_END_TIME
      );
    } else if (matchingDay && matchingDay.DAY_START_TIME != null) {
      this.saveData.IS_SERIVCE_AVAILABLE = matchingDay.IS_SERIVCE_AVAILABLE;
      this.saveData.DAY_START_TIME = this.convertTimeToDate(
        matchingDay.DAY_START_TIME
      );
      this.saveData.DAY_END_TIME = this.convertTimeToDate(
        matchingDay.DAY_END_TIME
      );
      this.saveData.BREAK_START_TIME = this.convertTimeToDate(
        matchingDay.BREAK_START_TIME
      );
      this.saveData.BREAK_END_TIME = this.convertTimeToDate(
        matchingDay.BREAK_END_TIME
      );
    } else {
      this.saveData = {
        DAY_START_TIME: null,
        DAY_END_TIME: null,
        BREAK_START_TIME: null,
        BREAK_END_TIME: null,
        IS_SERIVCE_AVAILABLE: false,
      };
    }
    if (this.mode === 'year') {
      return;
    }
    this.selectedDate = event;
  }
  selectChange(event: Date): void {
    if (this.dateSelect != event.getDate().toString().padStart(2, '0')) {
      this.ModelShowWithTime(event);
    } else if (
      this.year == event.getFullYear() &&
      this.dateSelect == event.getDate().toString().padStart(2, '0') &&
      this.month == event.getMonth() + 1
    ) {
      this.ModelShowWithTime(event);
    } else {
      this.year = event.getFullYear();
      this.month = event.getMonth() + 1;
      this.getCalenderData();
    }
  }
  convertTimeToDate(time: any): Date {
    if (typeof time !== 'string' || !time.includes(':')) {
      return new Date(); 
    }
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, seconds || 0, 0); 
    return now;
  }
  closeModal(): void {
    this.isVisible = false;
  }
  techdata: any = [];
  getTechnicianWeekData1() {
    this.api
      .getTechnicianData1(
        0,
        0,
        '',
        '',
        ' AND IS_ACTIVE = 1 AND ID = ' + this.FILTER_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.techdata = data['data'];
          } else {
            this.techdata = [];
            this.message.error('Failed To Get Technician Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  calenderdata: any = [];
  createDate(Time: any) {
    const currentDate = new Date();
    const timeParts = Time.split(':');
    currentDate.setHours(
      parseInt(timeParts[0], 10),
      parseInt(timeParts[1], 10),
      parseInt(timeParts[2], 10)
    );
    return this.datePipe.transform(currentDate, 'HH:mm');
  }
  timelineData: any[] = [];
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
  formatTimelineData(data: any[]): any[] {
    return data.map((day) => ({
      date: day._id,
      events: day.ACTION_LOGS.map((log) => ({
        icon: this.getStatusIcon(log.STATUS || ''), 
        time: log.TIME ? log.TIME : 'N/A',
        user:
          log.TYPE == "ADMIN" || log.TYPE == "Admin"
            ? log.USER_NAME
            : log.TECHNICIAN_NAME,
        description: log.LOG_TEXT || '',
        ACTION_LOG_TYPE: log.TYPE,
      })),
    }));
  }
  loading = false;
  filterdata1: any
  getCalenderData() {
    this.loading = true;
    var month: any;
    var year: any;
    if (this.month != null && this.month != undefined && this.month != '') {
      month = this.month;
    } else {
      month = this.datePipe.transform(new Date(), 'MM');
    }
    if (this.year != null && this.year != undefined && this.year != '') {
      year = this.year;
    } else {
      year = this.datePipe.transform(new Date(), 'yyyy');
    }
    const datessssss = this.getStartAndEndDates(month, year);
    this.api
      .getCalenderData(0, 0, '', '', '', month, year, this.FILTER_ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            data['data'].forEach((element) => {
              if (element.DAY_START_TIME) {
                element.DAY_START_TIME = this.createDate(
                  element.DAY_START_TIME
                );
              }
              if (element.DAY_END_TIME) {
                element.DAY_END_TIME = this.createDate(element.DAY_END_TIME);
              }
              if (element.BREAK_START_TIME) {
                element.BREAK_START_TIME = this.createDate(
                  element.BREAK_START_TIME
                );
                if (element.BREAK_END_TIME) {
                }
                element.BREAK_END_TIME = this.createDate(
                  element.BREAK_END_TIME
                );
              }
            });
            var value1 = this.datePipe.transform(
              datessssss.startDate,
              'yyyy-MM-dd'
            );
            var value2 = this.datePipe.transform(
              datessssss.endDate,
              'yyyy-MM-dd'
            );
            this.filterdata1 = (this.FILTER_ID != null && this.FILTER_ID != undefined) ? {
              TECHNICIAN_ID: {
                $in: [this.FILTER_ID]
              }
            } : {};
            var filterrr: any = {
              $and: [
                {
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          {
                            $dateToString: {
                              format: '%Y-%m-%d',
                              date: '$LOG_DATE_TIME',
                            },
                          },
                          value1, 
                        ],
                      },
                      {
                        $lte: [
                          {
                            $dateToString: {
                              format: '%Y-%m-%d',
                              date: '$LOG_DATE_TIME',
                            },
                          },
                          value2, 
                        ],
                      },
                    ],
                  },
                },
                this.filterdata1
              ],
            };
            this.api.getActionLogforcalender(0, 0, '', '', filterrr).subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.timelineData = this.formatTimelineData(data['data']);
                  this.timelineData = this.sortEventsByTime(this.timelineData);
                } else {
                  this.message.error('Failed To get Action Log Data', '');
                }
                this.loading = false;
              },
              () => {
                this.message.error('Something Went Wrong', '');
                this.loading = false;
              }
            );
            this.calenderdata = data['data'];
          } else {
            this.calenderdata = [];
            this.loading = false;
            this.message.error('Failed To Get Schedule Data', '');
            this.loading = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  isSameDate(date: Date, itemDate: string): boolean {
    const selectedDate = new Date(date);
    const item = new Date(itemDate);
    return (
      selectedDate.getDate() === item.getDate() &&
      selectedDate.getMonth() === item.getMonth() &&
      selectedDate.getFullYear() === item.getFullYear()
    );
  }
  isSpinning = false;
  isOk = true;
  save() { }
  disableEndHours = (): number[] => {
    if (this.saveData.DAY_START_TIME) {
      const startTime = new Date(this.saveData.DAY_START_TIME);
      const startHour = startTime.getHours();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour
      );
    }
    return [];
  };
  disableEndMinutes = (hour: number): number[] => {
    if (this.saveData.DAY_START_TIME) {
      const startTime = new Date(this.saveData.DAY_START_TIME);
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();
      if (hour > startHour) {
        return [];
      }
      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      }
    }
    return [];
  };
  updateStartTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0); 
    this.saveData.DAY_START_TIME = date.toISOString();
  }
  updateEndTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0); 
    this.saveData.DAY_END_TIME = date.toISOString();
  }
  disableBreakStartHours = (): number[] => {
    const disabledHours: number[] = [];
    if (this.saveData.DAY_START_TIME && this.saveData.DAY_END_TIME) {
      const dayStartTime = new Date(this.saveData.DAY_START_TIME);
      const dayEndTime = new Date(this.saveData.DAY_END_TIME);
      const dayStartHour = dayStartTime.getHours();
      const dayEndHour = dayEndTime.getHours();
      for (let hour = 0; hour < 24; hour++) {
        if (hour < dayStartHour || hour > dayEndHour) {
          disabledHours.push(hour);
        }
      }
    }
    return disabledHours;
  };
  disableBreakStartMinutes = (hour: number): number[] => {
    const disabledMinutes: number[] = [];
    if (this.saveData.DAY_START_TIME && this.saveData.DAY_END_TIME) {
      const dayStartTime = new Date(this.saveData.DAY_START_TIME);
      const dayEndTime = new Date(this.saveData.DAY_END_TIME);
      const dayStartHour = dayStartTime.getHours();
      const dayStartMinute = dayStartTime.getMinutes();
      const dayEndHour = dayEndTime.getHours();
      const dayEndMinute = dayEndTime.getMinutes();
      if (hour === dayStartHour) {
        for (let minute = 0; minute < 60; minute++) {
          if (minute < dayStartMinute) {
            disabledMinutes.push(minute);
          }
        }
      }
      if (hour === dayEndHour) {
        for (let minute = 0; minute < 60; minute++) {
          if (minute > dayEndMinute) {
            disabledMinutes.push(minute);
          }
        }
      }
    }
    return disabledMinutes;
  };
  disableBreakEndHours = (): number[] => {
    if (this.saveData.BREAK_START_TIME) {
      const startTime = new Date(this.saveData.BREAK_START_TIME);
      const startHour = startTime.getHours();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour
      );
    }
    return [];
  };
  disableBreakEndMinutes = (hour: number): number[] => {
    if (this.saveData.BREAK_START_TIME) {
      const startTime = new Date(this.saveData.BREAK_START_TIME);
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();
      if (hour > startHour) {
        return [];
      }
      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      }
    }
    return [];
  };
  updateBreakStartTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0); 
    this.saveData.BREAK_START_TIME = date.toISOString();
  }
  updateBreakEndTime(value: any): void {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {
      return;
    }
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0); 
    this.saveData.BREAK_END_TIME = date.toISOString();
  }
  getStartAndEndDates(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }
  sortEventsByTime(data: any[]): any[] {
    return data
      .sort((a, b) => b.date.localeCompare(a.date)) 
      .map((dateObj) => {
        return {
          ...dateObj,
          events: dateObj.events.sort((a: any, b: any) => {
            const timeA = new Date(`1970-01-01 ${a.time}`);
            const timeB = new Date(`1970-01-01 ${b.time}`);
            return timeB.getTime() - timeA.getTime(); 
          }),
        };
      });
  }
}