import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  TERRITORY_ID: number | string;
  DATE: string;
  IS_HOLIDAY: boolean;
  STATUS: boolean;
  HOLIDAY_REASON: string;
  ID: number;
}
@Component({
  selector: 'app-territory-calendar',
  templateUrl: './territory-calendar.component.html',
  styleUrls: ['./territory-calendar.component.css'],
})
export class TerritoryCalendarComponent {
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
    this.getCalenderData();
    this.dateSelect = this.datePipe.transform(new Date(), 'dd');
    this.year = Number(this.datePipe.transform(new Date(), 'yyyy'));
    this.month = Number(this.datePipe.transform(new Date(), 'MM'));
  }
  openModal(event: any): void {
    this.updateHolidayLabel();
    this.isVisible = true;
  }
  onModeChange(event: any): void {
    this.isVisible = false;
  }
  panelChange(event: { date: Date; mode: string }): void {
    this.isVisible = false;
    const currentMonth = event.date.getMonth() + 1; 
    const currentYear = event.date.getFullYear();
    if (event.mode === 'year') {
      this.isYearVisible = true;
    } else {
      this.isYearVisible = false;
    }
    this.getCalenderData();
    this.updateHolidayLabel();
  }
  year: any;
  month: any;
  formattedDate;
  dateSelect: any;
  currentDate: any = new Date();
  isYearVisible = false;
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
    const calendarDay = Array.isArray(this.calenderdata)
      ? this.calenderdata.find((day: any) => day.DATE === this.formattedDate)
      : this.calenderdata?.DATE === this.formattedDate
        ? this.calenderdata
        : null;
    this.selectedDate = event;
    if (this.isYearVisible == true) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
    this.updateHolidayLabel();
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
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const selectedDate = event.getDate().toString().padStart(2, '0');
    const selectedMonth = event.getMonth() + 1;
    const selectedYear = event.getFullYear();
    const monthDatesArray = this.getDatesOfMonth(selectedYear, selectedMonth);
    const currentYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
    const currentMonth = Number(this.datePipe.transform(new Date(), 'MM'));
    const isDifferentMonthOrYear =
      selectedYear !== this.year || selectedMonth !== Number(this.month);
    if (isDifferentMonthOrYear) {
      const isForwardOrCurrent =
        selectedYear > currentYear ||
        (selectedYear === currentYear && selectedMonth >= currentMonth);
      if (isForwardOrCurrent) {
        this.modelshow = false;
        this.month = selectedMonth;
        this.year = selectedYear;
        this.getCalenderData();
        this.updateHolidayLabel();
        return;
      }
    }
    const isDateAvailable = monthDatesArray.includes(Number(this.dateSelect));
    if (this.isPastOrToday(event)) {
      this.isVisible = false;
      return;
    }
    this.updateHolidayLabel();
    if (this.isWeeklyOff(event)) {
      this.isVisible = false;
      return;
    }
    if (event < todayDate) {
      this.modelshow = false;
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(event);
    clickedDate.setHours(0, 0, 0, 0);
    if (
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
      }
    }
    this.modelshow = true;
    this.ModelShowWithTime(event);
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
    this.saveData.TERRITORY_ID = this.data.ID;
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
      .getTerritoryHolidayMapping(
        0,
        0,
        '',
        '',
        `  AND TERRITORY_ID = ${this.saveData.TERRITORY_ID} AND MONTH(DATE)= ${month} AND YEAR(DATE) = ${year}`
      )
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
            this.updateHolidayLabel();
            this.saveData.ID = this.calenderdata.ID;
            this.loading = false;
          } else {
            this.calenderdata = [];
            this.message.error('Failed To get territory data', '');
            this.loading = false;
          }
        },
        () => {
          this.message.error('Something went wrong', '');
          this.loading = false;
        }
      );
  }
  isSameDate(date: Date, itemDate: string | Date): boolean {
    if (!itemDate) return false;
    const selectedDate = new Date(date);
    const item = new Date(itemDate);
    return (
      selectedDate.getDate() === item.getDate() &&
      selectedDate.getMonth() === item.getMonth() &&
      selectedDate.getFullYear() === item.getFullYear()
    );
  }
  labelText: string = 'Do You want to Mark this Day as Holiday ?';
  showReasonField: boolean = true;
  updateHolidayLabel(): void {
    const selectedDay = this.calenderdata.find(
      (item: any) => item.DATE === this.formattedDate
    );
    if (!selectedDay) {
      this.showReasonField = true;
      this.labelText = `Do you want to mark this day as holiday ?`;
    } else if (selectedDay.STATUS === 0) {
      this.labelText = 'Do you want to mark this day as holiday ?';
      this.showReasonField = true;
    } else if (selectedDay.IS_HOLIDAY == 1 && selectedDay.STATUS == 1) {
      this.labelText = 'Do you want to cancel this day as holiday ?';
      this.showReasonField = false;
    }
  }
  isOk = true;
  save(): void {
    this.loading = false;
    this.isOk = true;
    if (this.isOk) {
      this.loading = true;
      const selectedDay = this.calenderdata.find(
        (item: any) => item.DATE === this.formattedDate
      );
      if (
        !selectedDay
      ) {
        if (
          !this.saveData.HOLIDAY_REASON ||
          this.saveData.HOLIDAY_REASON.trim() === ''
        ) {
          this.isOk = false;
          this.message.error('Please Enter Reason for Holiday', '');
          this.loading = false;
          return;
        }
        this.updateHolidayLabel();
        const holidayData = {
          REASON: this.saveData.HOLIDAY_REASON,
          TERRITORY_ID: this.data.ID,
          DATE: this.formattedDate,
          IS_HOLIDAY: 1,
          STATUS: 1,
        };
        this.api.createTerritoryHolidayMapping(holidayData).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.message.success('Holiday saved successfully', '');
              this.saveData.HOLIDAY_REASON = '';
              this.getCalenderData();
              this.markHolidayOnCalendar(this.formattedDate);
            } else {
              this.message.error('Failed to save holiday', '');
            }
            this.isVisible = false;
            this.loading = false;
          },
          error: () => {
            this.message.error('Error while saving holiday', '');
            this.loading = false;
          },
        });
      } else {
        this.saveData.ID = selectedDay.ID;
        const newHolidayValue = selectedDay.IS_HOLIDAY === 1 ? 0 : 1;
        const newStatusValue = selectedDay.STATUS === 1 ? 0 : 1;
        if (newHolidayValue === 1) {
          if (
            !this.saveData.HOLIDAY_REASON ||
            this.saveData.HOLIDAY_REASON.trim() === ''
          ) {
            this.isOk = false;
            this.message.error('Please enter reason for holiday', '');
            this.loading = false;
            return;
          }
        }
        this.updateHolidayLabel();
        const holidayData = {
          REASON: this.saveData.HOLIDAY_REASON,
          ID: this.saveData.ID,
          TERRITORY_ID: this.data.ID,
          DATE: this.formattedDate,
          IS_HOLIDAY: newHolidayValue,
          STATUS: newStatusValue,
        };
        this.api.updateTerritoryHolidayMapping(holidayData).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.message.success(
                holidayData.IS_HOLIDAY == 0
                  ? 'Holiday canceled successfully'
                  : 'Holiday added successfully',
                ''
              );
              this.saveData.HOLIDAY_REASON = '';
              this.getCalenderData();
              this.markHolidayOnCalendar(this.formattedDate);
            } else {
              this.message.error('Failed to cancel holiday', '');
            }
            this.isVisible = false;
            this.loading = false;
          },
          error: () => {
            this.message.error('Error while saving holiday', '');
            this.loading = false;
          },
        });
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
  isWeeklyOff(date: Date): boolean {
    if (!this.data?.WEEKLY_OFFS) return false;
    const weeklyOffDays = this.data.WEEKLY_OFFS.split(',').map((d: string) =>
      d.trim().toUpperCase()
    );
    const dayAbbr = date
      .toLocaleString('en-US', { weekday: 'short' })
      .toUpperCase()
      .slice(0, 3);
    return weeklyOffDays.includes(dayAbbr);
  }
  openModalIfNotWeeklyOff(date: Date) {
    if (this.isPastOrToday(date)) {
      this.isVisible = false;
      return;
    }
    if (this.isWeeklyOff(date)) {
      this.isVisible = false;
      this.formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.updateHolidayLabel();
    } else {
      this.isVisible = false;
    }
  }
  onDateClick(date: Date, event: MouseEvent): void {
    if (this.isWeeklyOff(date)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  confirmVisible = false;
  holidays: string[] = [];
  confirmHoliday(date?: Date): void {
    const targetDate = date || this.selectedDate;
    if (!targetDate) return;
    const dateStr = this.datePipe.transform(targetDate, 'yyyy-MM-dd');
    if (dateStr) {
      this.holidays.push(dateStr);
      this.message.success('Holiday Marked', `${dateStr} marked as holiday`);
    }
  }
  cancelHoliday(): void {
    this.confirmVisible = false;
  }
  isHoliday(date: Date): boolean {
    if (!this.calenderdata?.length) return false;
    return this.calenderdata.some(
      (item) =>
        item.IS_HOLIDAY === 1 &&
        item.STATUS === 1 &&
        this.isSameDate(date, item.DATE)
    );
  }
  onDateSelect(date: Date): void {
    const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (this.holidays.includes(dateStr!)) {
      this.message.info('Holiday', `${dateStr} is already marked as holiday`);
      return;
    }
    this.selectedDate = date;
    this.confirmVisible = true;
  }
  holidayDates: string[] = [];
  markHolidayOnCalendar(date: string) {
    if (!this.holidayDates.includes(date)) {
      this.holidayDates.push(date);
    } else {
      this.holidayDates.pop();
    }
  }
  getShortReason(reason: string): string {
    if (!reason) return '';
    return reason.length > 30 ? reason.substring(0, 30) + '…' : reason;
  }
  isPastOrToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate <= today;
  }
}
