import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
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
  selector: 'app-technician-calender',
  templateUrl: './technician-calender.component.html',
  styleUrls: ['./technician-calender.component.css'],
})
export class TechnicianCalenderComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
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
    this.year = this.datePipe.transform(new Date(), 'yyyy');
    this.month = this.datePipe.transform(new Date(), 'MM');
  }
  openModal(event: any): void {
    this.isVisible = true;
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
    this.month = (event.getMonth() + 1).toString().padStart(2, '0'); 
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
    if (calendarDay && calendarDay.ID != null) {
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
    this.isVisible = true;
  }
  getDatesOfMonth(year: number, month: number): number[] {
    const date = new Date(year, month - 1, 1); 
    const lastDate = new Date(year, month, 0).getDate(); 
    const datesArray: number[] = [];
    for (let i = 1; i <= lastDate; i++) {
      datesArray.push(i);
    }
    return datesArray;
  }
  modelshow = true;
  selectChange(event: Date): void {
    this.modelshow = true;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const selectedDate = event.getDate().toString().padStart(2, '0');
    const selectedMonth = event.getMonth() + 1;
    const selectedYear = event.getFullYear();
    const monthDatesArray = this.getDatesOfMonth(selectedYear, selectedMonth);
    const isDateAvailable = monthDatesArray.includes(Number(this.dateSelect));
    if (
      (event < todayDate && this.month != event.getMonth() + 1) ||
      (event >= todayDate && this.month != event.getMonth() + 1) ||
      (event < todayDate && this.year != event.getFullYear())
    ) {
      this.modelshow = false;
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      this.getCalenderData();
      return;
    }
    if (event < todayDate) {
      this.modelshow = false;
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      return;
    } else if (
      !isDateAvailable &&
      Number(this.month) !== Number(event.getMonth() + 1)
    ) {
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      this.modelshow = false;
      return;
    } else if (
      this.dateSelect != event.getDate().toString().padStart(2, '0') &&
      Number(this.month) !== Number(event.getMonth() + 1)
    ) {
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      this.modelshow = false;
      return;
    } else if (
      this.dateSelect != event.getDate().toString().padStart(2, '0') &&
      this.year != event.getFullYear()
    ) {
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      this.modelshow = false;
      return;
    } else {
      if (
        this.modelshow &&
        this.dateSelect != event.getDate().toString().padStart(2, '0')
      ) {
        this.ModelShowWithTime(event);
      } else if (
        this.modelshow &&
        this.year == event.getFullYear() &&
        this.dateSelect == event.getDate().toString().padStart(2, '0') &&
        Number(this.month) === Number(event.getMonth() + 1)
      ) {
        this.ModelShowWithTime(event);
      } else {
        this.modelshow = true;
        this.year = event.getFullYear();
        this.month = event.getMonth() + 1;
        this.getCalenderData();
      }
    }
    this.modelshow = true;
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
    this.getCalenderData();
  }
  techdata: any = [];
  getTechnicianWeekData1() {
    this.api
      .getTechnicianData1(
        0,
        0,
        '',
        '',
        ' AND IS_ACTIVE = 1 AND ID = ' + this.data.ID
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
  loading = false;
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
    this.api
      .getCalenderData(0, 0, '', '', '', month, year, this.data.ID)
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
            this.calenderdata = data['data'];
            this.loading = false;
          } else {
            this.calenderdata = [];
            this.message.error('Failed To Get Schedule Data', '');
            this.loading = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.loading = false;
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
  isOk = true;
  save(): void {
    this.loading = false;
    this.isOk = true;
    if (this.saveData.IS_SERIVCE_AVAILABLE) {
      if (
        (this.saveData.DAY_START_TIME == 0 ||
          this.saveData.DAY_START_TIME == null ||
          this.saveData.DAY_START_TIME == undefined) &&
        (this.saveData.DAY_END_TIME == undefined ||
          this.saveData.DAY_END_TIME == null ||
          this.saveData.DAY_END_TIME == 0) &&
        (this.saveData.BREAK_START_TIME == undefined ||
          this.saveData.BREAK_START_TIME == null ||
          this.saveData.BREAK_START_TIME == 0) &&
        (this.saveData.BREAK_END_TIME == undefined ||
          this.saveData.BREAK_END_TIME == null ||
          this.saveData.BREAK_END_TIME == 0)
      ) {
        this.isOk = false;
        this.message.error('Please Fill All The Required Fields ', '');
      } else if (
        this.saveData.DAY_START_TIME == null ||
        this.saveData.DAY_START_TIME == undefined ||
        this.saveData.DAY_START_TIME == 0
      ) {
        this.isOk = false;
        this.message.error(' Please Select Day Start Time.', '');
      } else if (
        this.saveData.DAY_END_TIME == null ||
        this.saveData.DAY_END_TIME == undefined ||
        this.saveData.DAY_END_TIME == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Day End Time.', '');
      } else if (
        this.saveData.BREAK_START_TIME == null ||
        this.saveData.BREAK_START_TIME == undefined ||
        this.saveData.BREAK_START_TIME == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Break Start Time.', '');
      } else if (
        this.saveData.BREAK_END_TIME == null ||
        this.saveData.BREAK_END_TIME == undefined ||
        this.saveData.BREAK_END_TIME == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Break End Time.', '');
      }
    }
    if (this.isOk) {
      this.loading = true;
      this.saveData.TECHNICIAN_ID = this.data.ID;
      if (
        this.saveData.IS_SERIVCE_AVAILABLE === 1 ||
        this.saveData.IS_SERIVCE_AVAILABLE === true
      ) {
        this.saveData.DAY_START_TIME = this.datePipe.transform(
          this.saveData.DAY_START_TIME,
          'HH:mm:00'
        );
        this.saveData.DAY_END_TIME = this.datePipe.transform(
          this.saveData.DAY_END_TIME,
          'HH:mm:00'
        );
        this.saveData.BREAK_START_TIME = this.datePipe.transform(
          this.saveData.BREAK_START_TIME,
          'HH:mm:00'
        );
        this.saveData.BREAK_END_TIME = this.datePipe.transform(
          this.saveData.BREAK_END_TIME,
          'HH:mm:00'
        );
        this.saveData.DATE_OF_MONTH = this.formattedDate;
      } else {
        this.saveData.DAY_START_TIME = null;
        this.saveData.DAY_END_TIME = null;
        this.saveData.BREAK_START_TIME = null;
        this.saveData.BREAK_END_TIME = null;
        this.saveData.DATE_OF_MONTH = this.formattedDate;
      }
      if (Array.isArray(this.calenderdata)) {
        const calendarEntry = this.calenderdata.find(
          (entry: any) => entry.DATE_OF_MONTH === this.formattedDate
        );
        if (calendarEntry && calendarEntry.ID != null) {
          this.saveData.ID = calendarEntry.ID; 
          this.api
            .updateCalenderData(this.saveData)
            .subscribe((successCode: any) => {
              if (successCode.code === 200) {
                this.message.success('Schedule Data Updated Successfully', '');
                this.isVisible = false;
                this.getCalenderData();
                this.loading = false;
              } else {
                this.message.error('Schedule Updation Failed', '');
                this.loading = false;
              }
            });
        } else {
          this.api
            .createCalenderData(this.saveData)
            .subscribe((successCode: any) => {
              if (successCode.code === 200) {
                this.message.success('Schedule Created Successfully', '');
                this.isVisible = false;
                this.getCalenderData();
                this.loading = false;
              } else {
                this.message.error('Schedule Creation Failed...', '');
                this.loading = false;
              }
            });
        }
      }
    }
  }
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
    const disabledHours: number[] = [];
    if (this.saveData.BREAK_START_TIME && this.saveData.DAY_END_TIME) {
      const breakStartTime = new Date(this.saveData.BREAK_START_TIME);
      const dayEndTime = new Date(this.saveData.DAY_END_TIME);
      const breakStartHour = breakStartTime.getHours();
      const dayEndHour = dayEndTime.getHours();
      for (let hour = 0; hour < 24; hour++) {
        if (hour < breakStartHour || hour > dayEndHour) {
          disabledHours.push(hour);
        }
      }
    }
    return disabledHours;
  };
  disableBreakEndMinutes = (hour: number): number[] => {
    const disabledMinutes: number[] = [];
    if (this.saveData.BREAK_START_TIME && this.saveData.DAY_END_TIME) {
      const breakStartTime = new Date(this.saveData.BREAK_START_TIME);
      const dayEndTime = new Date(this.saveData.DAY_END_TIME);
      const breakStartHour = breakStartTime.getHours();
      const breakStartMinute = breakStartTime.getMinutes();
      const dayEndHour = dayEndTime.getHours();
      const dayEndMinute = dayEndTime.getMinutes();
      if (hour === breakStartHour) {
        for (let minute = 0; minute < 60; minute++) {
          if (minute < breakStartMinute) {
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
}