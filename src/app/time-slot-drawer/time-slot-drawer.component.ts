import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from '../Service/api-service.service';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeSlotData } from '../Pages/Models/globalslot';
import * as moment from 'moment';
@Component({
  selector: 'app-time-slot-drawer',
  templateUrl: './time-slot-drawer.component.html',
  styleUrls: ['./time-slot-drawer.component.css'],
})
export class TimeSlotDrawerComponent {
  @Input() data: TimeSlotData;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  day_start_time: any;
  day_end_time: any;
  DAY_START_TIME: Date;
  DAY_END_TIME: Date;

  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  loadingRecords = false;
  sort: string;
  likeQuery = '';
  filterQuery = '';

  isSpinning = false;
  isOk = true;
  organizationid: any = sessionStorage.getItem('orgId');
  dataList: any;
  defaultDisabledHours: number[] = []; // Declare this property

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    this.getglobalTimeSlotConfigData();

    this.organizationid = sessionStorage.getItem('orgId');
    this.data.ORG_ID = 1
    this.getOrganizationData();
  }
  // Function to disable hours dynamically
  disableHours = (startLimit: Date, endLimit: Date) => {
    return Array.from({ length: 24 }, (_, i) => i).filter(
      (hour) => hour < startLimit.getHours() || hour > endLimit.getHours()
    );
  };

  // Function to disable minutes dynamically
  disableMinutes = (selectedHour: number, startLimit: Date, endLimit: Date) => {
    if (!selectedHour) return [];

    if (selectedHour === startLimit.getHours()) {
      return Array.from({ length: startLimit.getMinutes() + 1 }, (_, i) => i);
    }

    if (selectedHour === endLimit.getHours()) {
      return Array.from(
        { length: 60 - endLimit.getMinutes() },
        (_, i) => i + endLimit.getMinutes()
      );
    }

    return [];
  };

  disableMinutes1 = (
    selectedHour: number,
    startLimit: Date,
    endLimit: Date
  ) => {
    if (!selectedHour) return [];

    if (selectedHour === startLimit.getHours()) {
      return Array.from({ length: startLimit.getMinutes() }, (_, i) => i);
    }

    if (selectedHour === endLimit.getHours()) {
      return Array.from(
        { length: 60 - endLimit.getMinutes() },
        (_, i) => i + endLimit.getMinutes()
      );
    }

    return [];
  };

  disableMinutes3 = (
    selectedHour: number,
    startLimit: Date,
    endLimit: Date
  ) => {
    if (!selectedHour) return [];

    if (selectedHour === startLimit.getHours()) {
      return Array.from({ length: startLimit.getMinutes() }, (_, i) => i);
    }

    if (selectedHour === endLimit.getHours()) {
      return Array.from(
        { length: 60 - endLimit.getMinutes() },
        (_, i) => i + endLimit.getMinutes()
      );
    }

    return [];
  };

  // Conditions for each slot
  disabledSlot1Hours = () =>
    this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
  disabledSlot1Minutes = (hour: number) =>
    this.disableMinutes3(hour, this.DAY_START_TIME, this.DAY_END_TIME);

  disabledSlot2Hours = () => {
    if (!this.data.SLOT1_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.data.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot2Minutes = (hour: number) => {
    if (!this.data.SLOT1_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.data.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };

  disabledSlot3Hours = () => {
    if (!this.data.SLOT2_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.data.SLOT2_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot3Minutes = (hour: number) => {
    if (!this.data.SLOT2_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.data.SLOT2_END_TIME),
      this.DAY_END_TIME
    );
  };
  // Function to disable hours dynamically for END time
  disableEndHours = (startTime: Date, endLimit: Date) => {
    if (!startTime)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(startTime, endLimit);
  };

  // Function to disable minutes dynamically for END time
  disableEndMinutes = (startHour: number, startTime: Date, endLimit: Date) => {
    if (!startTime)
      return this.disableMinutes(
        startHour,
        this.DAY_START_TIME,
        this.DAY_END_TIME
      );
    return this.disableMinutes(startHour, startTime, endLimit);
  };

  disableEndMinutes1 = (startHour: number, startTime: Date, endLimit: Date) => {
    if (!startTime)
      return this.disableMinutes2(
        startHour,
        this.DAY_START_TIME,
        this.DAY_END_TIME
      );
    return this.disableMinutes2(startHour, startTime, endLimit);
  };

  disableMinutes2 = (
    selectedHour: number,
    startLimit: Date,
    endLimit: Date
  ) => {
    if (!selectedHour) return [];

    if (selectedHour === startLimit.getHours()) {
      return Array.from({ length: startLimit.getMinutes() + 1 }, (_, i) => i);
    }

    if (selectedHour === endLimit.getHours()) {
      return Array.from(
        { length: 60 - endLimit.getMinutes() },
        (_, i) => i + endLimit.getMinutes() + 1
      );
    }

    return [];
  };
  // Conditions for END time slots
  disabledSlot1EndHours = () =>
    this.disableEndHours(this.data.SLOT1_START_TIME, this.DAY_END_TIME);
  disabledSlot1EndMinutes = (hour: number) =>
    this.disableEndMinutes(hour, this.data.SLOT1_START_TIME, this.DAY_END_TIME);

  disabledSlot2EndHours = () =>
    this.disableEndHours(this.data.SLOT2_START_TIME, this.DAY_END_TIME);
  disabledSlot2EndMinutes = (hour: number) =>
    this.disableEndMinutes(hour, this.data.SLOT2_START_TIME, this.DAY_END_TIME);

  disabledSlot3EndHours = () =>
    this.disableEndHours(this.data.SLOT3_START_TIME, this.DAY_END_TIME);
  disabledSlot3EndMinutes = (hour: number) =>
    this.disableEndMinutes1(
      hour,
      this.data.SLOT3_START_TIME,
      this.DAY_END_TIME
    );

  parseExpectedTime(expectedTime: string): Date | null {
    // If you need it as a Date object, here's one way to convert it
    if (!expectedTime) return null;

    const [hours, minutes, seconds] = expectedTime.split(':').map(Number);
    const now = new Date(); // Get current date
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    return now; // Return the Date object with expected time
  }

  getOrganizationData() {
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID= 1')
      .subscribe((data) => {
        if (data['status'] == 200 && data.body.count > 0) {
          if (data.body['data'][0].DAY_START_TIME) {
            this.DAY_START_TIME = moment(
              data['body']['data'][0].DAY_START_TIME,
              'hh:mm A'
            ).toDate();
          }
          if (data['body']['data'][0].DAY_END_TIME) {
            this.DAY_END_TIME = moment(
              data['body']['data'][0].DAY_END_TIME,
              'hh:mm A'
            ).toDate();
          }
        }
      });
  }

  formatTimeToHHmm(time: any): string {
    const date = new Date(time); // Assuming time is a valid timestamp or ISO string
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  save(addNew: boolean, Unitmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.SLOT1_START_TIME === undefined ||
      this.data.SLOT1_START_TIME === null ||
      this.data.SLOT1_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 1 Start Time', '');
      this.isOk = false;
    } else if (
      this.data.SLOT1_END_TIME === undefined ||
      this.data.SLOT1_END_TIME === null ||
      this.data.SLOT1_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 1 End Time', '');
      this.isOk = false;
    } else if (
      this.data.SLOT2_START_TIME === undefined ||
      this.data.SLOT2_START_TIME === null ||
      this.data.SLOT2_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 2 Start Time', '');
      this.isOk = false;
    } else if (
      this.data.SLOT2_END_TIME === undefined ||
      this.data.SLOT2_END_TIME === null ||
      this.data.SLOT2_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    } else if (
      this.data.SLOT3_START_TIME === undefined ||
      this.data.SLOT3_START_TIME === null ||
      this.data.SLOT3_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 Start Time', '');
      this.isOk = false;
    } else if (
      this.data.SLOT3_END_TIME === undefined ||
      this.data.SLOT3_END_TIME === null ||
      this.data.SLOT3_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    }
    if (this.isOk) {
      {
        if (this.data.SLOT1_START_TIME) {
          this.data.SLOT1_START_TIME = this.formatTimeToHHmm(
            this.data.SLOT1_START_TIME
          );
        }
        if (this.data.SLOT1_END_TIME) {
          this.data.SLOT1_END_TIME = this.formatTimeToHHmm(
            this.data.SLOT1_END_TIME
          );
        }
        if (this.data.SLOT2_START_TIME) {
          this.data.SLOT2_START_TIME = this.formatTimeToHHmm(
            this.data.SLOT2_START_TIME
          );
        }
        if (this.data.SLOT2_END_TIME) {
          this.data.SLOT2_END_TIME = this.formatTimeToHHmm(
            this.data.SLOT2_END_TIME
          );
        }
        if (this.data.SLOT3_START_TIME) {
          this.data.SLOT3_START_TIME = this.formatTimeToHHmm(
            this.data.SLOT3_START_TIME
          );
        }
        if (this.data.SLOT3_END_TIME) {
          this.data.SLOT3_END_TIME = this.formatTimeToHHmm(
            this.data.SLOT3_END_TIME
          );
        }

        if (this.data.ID) {
          this.api.updateTimeSlot(this.data).subscribe(
            (successCode: any) => {
              if (successCode.status == 200) {
                this.isSpinning = false;
                this.message.success('Time Slot Updated Successfully', '');
                if (!addNew) this.drawerClose();
              } else {
                this.message.error('Time Slot Updation Failed', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        } else {
          this.api.createTimeSlot(this.data).subscribe(
            (successCode: any) => {
              if (successCode.status === 200) {
                this.isSpinning = false;
                this.message.success('Time Slot Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new TimeSlotData();
                  this.resetDrawer(Unitmaster);
                }
              } else {
                this.isSpinning = false;
                this.message.error('Time Slot Creation Failed', '');
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  close() {
    this.drawerClose();
  }

  resetDrawer(Unitmaster: NgForm) {
    this.data = new TimeSlotData();
    Unitmaster.form.markAsPristine();
    Unitmaster.form.markAsUntouched();
  }

  getglobalTimeSlotConfigData() {
    this.api
      .getAllTimeSlot(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sort,
        this.likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.dataList = data['body']['data'];

            if (this.dataList[0]?.ID) {
              this.data.SLOT1_START_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT1_START_TIME
              );

              this.data.SLOT1_END_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT1_END_TIME
              );

              this.data.SLOT2_START_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT2_START_TIME
              );

              this.data.SLOT2_END_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT2_END_TIME
              );

              this.data.SLOT3_START_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT3_START_TIME
              );

              this.data.SLOT3_END_TIME = this.parseExpectedTime(
                this.dataList[0].SLOT3_END_TIME
              );
            }
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  isDataIdMissing(): boolean {
    return this.dataList?.length > 0 && !this.dataList[0]?.ID;
  }

  onTimeChange(field: string, value: Date) {
    if (value) {
      this.data[field] = this.roundMinutesToNearestInterval(new Date(value));
    }
  }

  roundMinutesToNearestInterval(date: Date): Date {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 10) * 10;

    let finalHour = date.getHours();
    let finalMinutes = roundedMinutes;

    if (roundedMinutes >= 60) {
      finalMinutes = 0;
      finalHour = (finalHour + 1) % 24;
    }

    const roundedDate = new Date(date);
    roundedDate.setHours(finalHour);
    roundedDate.setMinutes(finalMinutes);
    roundedDate.setSeconds(0);

    return roundedDate;
  }
}