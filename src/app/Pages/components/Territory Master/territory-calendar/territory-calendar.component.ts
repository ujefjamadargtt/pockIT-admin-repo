import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

export class Data {
  // IS_SERIVCE_AVAILABLE: boolean;
  // DAY_START_TIME: any;
  // DAY_END_TIME: any;
  // BREAK_START_TIME: any;
  // BREAK_END_TIME: any;
  // ID: number;
  // DATE_OF_MONTH: any;
  // TECHNICIAN_ID: any;
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
  selectedDate: Date | null = null; // For storing the full date
  selectedDayName: string = ''; // For storing the day name
  isVisible = false;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // this.getTechnicianWeekData1();
    this.getCalenderData();
    this.dateSelect = this.datePipe.transform(new Date(), 'dd');
    // this.year = this.datePipe.transform(new Date(), 'yyyy');
    // this.month = this.datePipe.transform(new Date(), 'MM');
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
    // console.log('panelChange');

    this.isVisible = false;

    const currentMonth = event.date.getMonth() + 1; // Months are 0-based
    const currentYear = event.date.getFullYear();
    // console.log(event.mode);
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
    const dayName = event.toLocaleDateString('en-US', options).substring(0, 2); // Get 'Mo', 'Tu', etc.

    const date = event.getDate().toString().padStart(2, '0');
    this.dateSelect = event.getDate().toString().padStart(2, '0');
    this.month = (event.getMonth() + 1).toString().padStart(2, '0'); // Pad month to 2 digits
    this.year = event.getFullYear(); // e.g., 2024
    // console.log('year', this.year, 'month', this.month, 'date', date);
    this.formattedDate = `${this.year}-${this.month}-${date}`; // Format in yyyy-mm-dd

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

    // console.log('calendarDay:', calendarDay);

    // if (calendarDay) {
    // } else {
    // }

    // Set time picker values based on calendarDay or matchingDay
    // if (calendarDay && calendarDay.ID != null) {
    //   // Use calendarDay if DAY_START_TIME is not null
    //   this.saveData.IS_SERIVCE_AVAILABLE = calendarDay.IS_SERIVCE_AVAILABLE;

    //   this.saveData.DAY_START_TIME = this.convertTimeToDate(
    //     calendarDay.DAY_START_TIME
    //   );
    //   this.saveData.DAY_END_TIME = this.convertTimeToDate(
    //     calendarDay.DAY_END_TIME
    //   );
    //   this.saveData.BREAK_START_TIME = this.convertTimeToDate(
    //     calendarDay.BREAK_START_TIME
    //   );
    //   this.saveData.BREAK_END_TIME = this.convertTimeToDate(
    //     calendarDay.BREAK_END_TIME
    //   );
    // } else if (matchingDay && matchingDay.DAY_START_TIME != null) {
    //   // Use matchingDay if DAY_START_TIME is not null
    //   this.saveData.IS_SERIVCE_AVAILABLE = matchingDay.IS_SERIVCE_AVAILABLE;
    //   this.saveData.DAY_START_TIME = this.convertTimeToDate(
    //     matchingDay.DAY_START_TIME
    //   );
    //   this.saveData.DAY_END_TIME = this.convertTimeToDate(
    //     matchingDay.DAY_END_TIME
    //   );
    //   this.saveData.BREAK_START_TIME = this.convertTimeToDate(
    //     matchingDay.BREAK_START_TIME
    //   );
    //   this.saveData.BREAK_END_TIME = this.convertTimeToDate(
    //     matchingDay.BREAK_END_TIME
    //   );
    // } else {
    //   // Default values if no data is found
    //   this.saveData = {
    //     DAY_START_TIME: null,
    //     DAY_END_TIME: null,
    //     BREAK_START_TIME: null,
    //     BREAK_END_TIME: null,
    //     IS_SERIVCE_AVAILABLE: false,
    //   };
    // }

    // if (this.mode === 'year') {
    //   return;
    // }

    // Otherwise, show the modal
    this.selectedDate = event;
    if (this.isYearVisible == true) {
      this.isVisible = false;
      // console.log('yes yes dfvsf');
    } else {
      this.isVisible = true;
      // console.log('dfdsfsdfsfsds');
    }

    this.updateHolidayLabel();
  }

  getDatesOfMonth(year: number, month: number): number[] {
    const date = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate(); // Last date of the month
    const datesArray: number[] = [];

    for (let i = 1; i <= lastDate; i++) {
      datesArray.push(i);
    }

    return datesArray;
  }

  modelshow = true;
  selectChange(event: Date): void {
    // this.modelshow = true;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const selectedDate = event.getDate().toString().padStart(2, '0');
    const selectedMonth = event.getMonth() + 1;
    const selectedYear = event.getFullYear();

    const monthDatesArray = this.getDatesOfMonth(selectedYear, selectedMonth);

    // if (
    //   (event < todayDate && this.month != event.getMonth() + 1) ||

    //   (event >= todayDate && this.month != event.getMonth() + 1) ||

    //   (event < todayDate && this.year != event.getFullYear())
    // ) {

    //   this.modelshow = false;
    //   this.month = event.getMonth() + 1;
    //   this.year = event.getFullYear();
    //   this.getCalenderData();
    //   this.updateHolidayLabel();
    //   return;
    // }

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
      // console.log('Selection disabled for past or today’s date');
      return;
    }

    // if (
    //   selectedMonth !== this.month &&
    //   Number(selectedDate) < Number(this.dateSelect)
    // ) {
    //   this.isVisible = false;
    //   this.modelshow = true;
    //

    //   return;
    // }
    this.updateHolidayLabel();
    if (this.isWeeklyOff(event)) {
      // console.log('Selection disabled for weekly off day');
      this.isVisible = false;
      return;
    }

    if (event < todayDate) {
      this.modelshow = false;
      this.month = event.getMonth() + 1;
      this.year = event.getFullYear();
      // this.getCalenderData();

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
      return new Date(); // Return current time as fallback
    }

    const [hours, minutes, seconds] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, seconds || 0, 0); // Set hours, minutes, seconds, and milliseconds
    return now;
  }

  closeModal(): void {
    this.isVisible = false;
    // this.getCalenderData();
  }

  techdata: any = [];
  // getTechnicianWeekData1() {
  //   this.api
  //     .getTechnicianData1(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND IS_ACTIVE = 1 AND ID = ' + this.data.ID
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.techdata = data['data'];
  //         } else {
  //           this.techdata = [];
  //           this.message.error('Failed To Get Technician Data', '');
  //         }
  //       },
  //       () => {
  //         this.message.error('Something Went Wrong', '');
  //       }
  //     );
  // }

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
    // console.log(
    //   this.saveData.TERRITORY_ID,
    //   '   console.log(this.saveData.TERRITORY_ID)'
    // );
    // console.log(this.data.ID, '   console.log( this.data.TERRITORY_ID)');
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

  // isSameDate(date: Date, itemDate: string): boolean {
  //   const selectedDate = new Date(date);
  //   const item = new Date(itemDate);

  //   return (
  //     selectedDate.getDate() === item.getDate() &&
  //     selectedDate.getMonth() === item.getMonth() &&
  //     selectedDate.getFullYear() === item.getFullYear()
  //   );
  // }
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
    // if (this.saveData.IS_SERIVCE_AVAILABLE) {
    //   if (
    //     (this.saveData.DAY_START_TIME == 0 ||
    //       this.saveData.DAY_START_TIME == null ||
    //       this.saveData.DAY_START_TIME == undefined) &&
    //     (this.saveData.DAY_END_TIME == undefined ||
    //       this.saveData.DAY_END_TIME == null ||
    //       this.saveData.DAY_END_TIME == 0) &&
    //     (this.saveData.BREAK_START_TIME == undefined ||
    //       this.saveData.BREAK_START_TIME == null ||
    //       this.saveData.BREAK_START_TIME == 0) &&
    //     (this.saveData.BREAK_END_TIME == undefined ||
    //       this.saveData.BREAK_END_TIME == null ||
    //       this.saveData.BREAK_END_TIME == 0)
    //   ) {
    //     this.isOk = false;
    //     this.message.error('Please Fill All The Required Fields ', '');
    //   } else if (
    //     this.saveData.DAY_START_TIME == null ||
    //     this.saveData.DAY_START_TIME == undefined ||
    //     this.saveData.DAY_START_TIME == 0
    //   ) {
    //     this.isOk = false;
    //     this.message.error(' Please Select Day Start Time.', '');
    //   } else if (
    //     this.saveData.DAY_END_TIME == null ||
    //     this.saveData.DAY_END_TIME == undefined ||
    //     this.saveData.DAY_END_TIME == 0
    //   ) {
    //     this.isOk = false;
    //     this.message.error('Please Select Day End Time.', '');
    //   } else if (
    //     this.saveData.BREAK_START_TIME == null ||
    //     this.saveData.BREAK_START_TIME == undefined ||
    //     this.saveData.BREAK_START_TIME == 0
    //   ) {
    //     this.isOk = false;
    //     this.message.error('Please Select Break Start Time.', '');
    //   } else if (
    //     this.saveData.BREAK_END_TIME == null ||
    //     this.saveData.BREAK_END_TIME == undefined ||
    //     this.saveData.BREAK_END_TIME == 0
    //   ) {
    //     this.isOk = false;
    //     this.message.error('Please Select Break End Time.', '');
    //   }
    // }
    if (this.isOk) {
      this.loading = true;

      // this.saveData.TECHNICIAN_ID = this.data.ID;

      // if (
      //   this.saveData.IS_SERIVCE_AVAILABLE === 1 ||
      //   this.saveData.IS_SERIVCE_AVAILABLE === true
      // ) {
      //   this.saveData.DAY_START_TIME = this.datePipe.transform(
      //     this.saveData.DAY_START_TIME,
      //     'HH:mm:00'
      //   );
      //   this.saveData.DAY_END_TIME = this.datePipe.transform(
      //     this.saveData.DAY_END_TIME,
      //     'HH:mm:00'
      //   );
      //   this.saveData.BREAK_START_TIME = this.datePipe.transform(
      //     this.saveData.BREAK_START_TIME,
      //     'HH:mm:00'
      //   );
      //   this.saveData.BREAK_END_TIME = this.datePipe.transform(
      //     this.saveData.BREAK_END_TIME,
      //     'HH:mm:00'
      //   );
      //   this.saveData.DATE_OF_MONTH = this.formattedDate;
      // } else {
      //   this.saveData.DAY_START_TIME = null;
      //   this.saveData.DAY_END_TIME = null;
      //   this.saveData.BREAK_START_TIME = null;
      //   this.saveData.BREAK_END_TIME = null;
      //   this.saveData.DATE_OF_MONTH = this.formattedDate;
      // }
      const selectedDay = this.calenderdata.find(
        (item: any) => item.DATE === this.formattedDate
      );
      if (
        !selectedDay
        // ||
        // selectedDay.IS_HOLIDAY === 0 ||
        // selectedDay.IS_HOLIDAY === false
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

        // console.log('calenderdata', this.calenderdata);
        // console.log('Creating holiday for', this.formattedDate);
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
              // console.log('IS_HOLIDAY1:', this.calenderdata.IS_HOLIDAY);
              this.message.success('Holiday saved successfully', '');
              this.saveData.HOLIDAY_REASON = '';

              // console.log('holiday', this.calenderdata.IS_HOLIDAY);
              this.getCalenderData();
              this.markHolidayOnCalendar(this.formattedDate);
            } else {
              this.message.error('Failed to save holiday', '');
            }
            this.isVisible = false;
            this.loading = false;
            // this.getCalenderData();
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
              // console.log('IS_HOLIDAY:', this.calenderdata.IS_HOLIDAY);
              this.saveData.HOLIDAY_REASON = '';
              this.getCalenderData();
              this.markHolidayOnCalendar(this.formattedDate);
            } else {
              this.message.error('Failed to cancel holiday', '');
            }
            this.isVisible = false;
            this.loading = false;
            // this.getCalenderData();
          },
          error: () => {
            this.message.error('Error while saving holiday', '');
            this.loading = false;
          },
        });
      }

      // if (Array.isArray(this.calenderdata)) {
      //   const calendarEntry = this.calenderdata.find(
      //     (entry: any) => entry.DATE_OF_MONTH === this.formattedDate
      //   );

      //   if (calendarEntry && calendarEntry.ID != null) {
      //     this.saveData.ID = calendarEntry.ID; // Update existing entry

      //     this.api
      //       .updateCalenderData(this.saveData)
      //       .subscribe((successCode: any) => {
      //         if (successCode.code === 200) {
      //           this.message.success('Schedule Data Updated Successfully', '');
      //           this.isVisible = false;
      //           this.getCalenderData();
      //           this.loading = false;
      //         } else {
      //           this.message.error('Schedule Updation Failed', '');
      //           this.loading = false;
      //         }
      //       });
      //   }
      //   // } else {
      //   //   this.api
      //   //     .createTerritoryHolidayMapping(this.saveData)
      //   //     .subscribe((successCode: any) => {
      //   //       if (successCode.code === 200) {
      //   //         this.message.success('Schedule Created Successfully', '');
      //   //         this.isVisible = false;
      //   //         this.getCalenderData();
      //   //         this.loading = false;
      //   //       } else {
      //   //         this.message.error('Schedule Creation Failed...', '');
      //   //         this.loading = false;
      //   //       }
      //   //     });
      //   // }
      // }
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
    date.setHours(hours, minutes, 0); // Set seconds to 0
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
    date.setHours(hours, minutes, 0); // Set seconds to 0
    this.saveData.DAY_END_TIME = date.toISOString();
  }

  disableBreakStartHours = (): number[] => {
    const disabledHours: number[] = [];
    if (this.saveData.DAY_START_TIME && this.saveData.DAY_END_TIME) {
      const dayStartTime = new Date(this.saveData.DAY_START_TIME);
      const dayEndTime = new Date(this.saveData.DAY_END_TIME);

      const dayStartHour = dayStartTime.getHours();
      const dayEndHour = dayEndTime.getHours();

      // Disable hours outside the range of DAY_START_TIME and DAY_END_TIME
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
        // Disable minutes before the DAY_START_TIME
        for (let minute = 0; minute < 60; minute++) {
          if (minute < dayStartMinute) {
            disabledMinutes.push(minute);
          }
        }
      }

      if (hour === dayEndHour) {
        // Disable minutes after the DAY_END_TIME
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

      // Disable hours before the BREAK_START_TIME and after the DAY_END_TIME
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
        // Disable minutes before the BREAK_START_TIME
        for (let minute = 0; minute < 60; minute++) {
          if (minute < breakStartMinute) {
            disabledMinutes.push(minute);
          }
        }
      }

      if (hour === dayEndHour) {
        // Disable minutes after the DAY_END_TIME
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
    date.setHours(hours, minutes, 0); // Set seconds to 0
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
    date.setHours(hours, minutes, 0); // Set seconds to 0
    this.saveData.BREAK_END_TIME = date.toISOString();
  }
  isWeeklyOff(date: Date): boolean {
    // if (!this.data?.WEEKLY_OFFS) return false;

    // const dayAbbr = date
    //   .toLocaleString('en-US', { weekday: 'short' })
    //   .toUpperCase();
    // return this.data.WEEKLY_OFFS.split(',').includes(dayAbbr);
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
  // openModalIfNotWeeklyOff(date: Date) {
  //   if (!this.isWeeklyOff(date)) {
  //     this.isVisible = true; // Show modal if it's not a weekly off day
  //   } else {
  //     this.isVisible = false;
  //   }
  // }
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

  // isHoliday(date: Date): boolean {
  //   if (!this.calenderdata || this.calenderdata.length === 0) {
  //     return false;
  //   }

  //   const dateString = this.datePipe.transform(date, 'yyyy-MM-dd');
  //   return this.calenderdata.some(
  //     (item) => item.IS_HOLIDAY === 1 && item.DATE === dateString
  //   );
  // }

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
