import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  SlotsMappingToTerritory,
  TerritoryMaster,
} from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-territory-time-slots',
  templateUrl: './territory-time-slots.component.html',
  styleUrls: ['./territory-time-slots.component.css'],
})
export class TerritoryTimeSlotsComponent {
  @Input() data: any = TerritoryMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  TimeSlotsData: any = SlotsMappingToTerritory;

  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }

  DAY_START_TIME: Date;
  DAY_END_TIME: Date;
  organizationid: any = sessionStorage.getItem('orgId');
  orgId: any;
  ngOnInit() {
    this.DAY_START_TIME = this.data?.START_TIME;
    this.DAY_END_TIME = this.data?.END_TIME;

    this.organizationid = sessionStorage.getItem('orgId');
    this.orgId = this.organizationid
      ? this.commonFunction.decryptdata(this.organizationid)
      : 0;

    this.getOrganizationData();
  }
  close() {
    this.drawerClose();
  }

  onStartTimeChange(field: string, value: Date): void {
    if (value) {
      this.TimeSlotsData[field] = this.roundMinutesToNearestInterval(
        new Date(value)
      );
    }

    if (field === 'SLOT1_START_TIME') {
      if (
        this.TimeSlotsData.SLOT1_END_TIME &&
        this.TimeSlotsData.SLOT1_END_TIME < value
      ) {
        this.TimeSlotsData.SLOT1_END_TIME = null; // Reset end time
      }
    }

    if (field === 'SLOT1_END_TIME') {
      if (
        this.TimeSlotsData.SLOT2_START_TIME &&
        this.TimeSlotsData.SLOT2_START_TIME < value
      ) {
        this.TimeSlotsData.SLOT2_START_TIME = null; // Reset end time
      }
    }

    if (field === 'SLOT2_START_TIME') {
      if (
        this.TimeSlotsData.SLOT2_END_TIME &&
        this.TimeSlotsData.SLOT2_END_TIME < value
      ) {
        this.TimeSlotsData.SLOT2_END_TIME = null; // Reset end time
      }
    }

    if (field === 'SLOT2_END_TIME') {
      if (
        this.TimeSlotsData.SLOT3_START_TIME &&
        this.TimeSlotsData.SLOT3_START_TIME < value
      ) {
        this.TimeSlotsData.SLOT3_START_TIME = null; // Reset end time
      }
    }
    if (field === 'SLOT3_START_TIME') {
      if (
        this.TimeSlotsData.SLOT3_END_TIME &&
        this.TimeSlotsData.SLOT3_END_TIME < value
      ) {
        this.TimeSlotsData.SLOT3_END_TIME = null; // Reset end time
      }
    }
  }
  getOrganizationData() {
    this.isSpinning = true;

    this.api
      .globalTimeSlotsMappingGet(
        0,
        0,
        '',
        'asc',
        " AND MAPPING_FOR = 'T' AND MAPPING_ID = " + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.TimeSlotsData = data['body']['data'][0];

            if (this.TimeSlotsData?.ID) {
              this.TimeSlotsData.SLOT1_START_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT1_START_TIME
              );

              this.TimeSlotsData.SLOT1_END_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT1_END_TIME
              );

              this.TimeSlotsData.SLOT2_START_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT2_START_TIME
              );

              this.TimeSlotsData.SLOT2_END_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT2_END_TIME
              );

              this.TimeSlotsData.SLOT3_START_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT3_START_TIME
              );

              this.TimeSlotsData.SLOT3_END_TIME = this.parseExpectedTime(
                this.TimeSlotsData?.SLOT3_END_TIME
              );

              this.isSpinning = false;
            } else {
              this.isSpinning = false;
              this.TimeSlotsData = [];
            }
          } else {
            this.isSpinning = false;

            this.TimeSlotsData = [];
            this.message.error('Failed To Get organization Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  isSpinning: boolean = false;
  isOk: boolean = true;
  save(addNew: boolean, teritorymaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.TimeSlotsData.SLOT1_START_TIME == null ||
      this.TimeSlotsData.SLOT1_START_TIME == undefined ||
      this.TimeSlotsData.SLOT1_START_TIME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please select slot 1 start time', '');
    } else if (
      this.TimeSlotsData.SLOT1_END_TIME == null ||
      this.TimeSlotsData.SLOT1_END_TIME == undefined ||
      this.TimeSlotsData.SLOT1_END_TIME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please select slot 1 start time', '');
    } else if (
      this.TimeSlotsData.SLOT2_START_TIME === undefined ||
      this.TimeSlotsData.SLOT2_START_TIME === null ||
      this.TimeSlotsData.SLOT2_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 2 Start Time', '');
      this.isOk = false;
    } else if (
      this.TimeSlotsData.SLOT2_END_TIME === undefined ||
      this.TimeSlotsData.SLOT2_END_TIME === null ||
      this.TimeSlotsData.SLOT2_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    } else if (
      this.TimeSlotsData.SLOT3_START_TIME === undefined ||
      this.TimeSlotsData.SLOT3_START_TIME === null ||
      this.TimeSlotsData.SLOT3_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 Start Time', '');
      this.isOk = false;
    } else if (
      this.TimeSlotsData.SLOT3_END_TIME === undefined ||
      this.TimeSlotsData.SLOT3_END_TIME === null ||
      this.TimeSlotsData.SLOT3_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    }

    if (this.isOk) {
      this.TimeSlotsData.ORG_ID = 1;
      this.TimeSlotsData.MAPPING_ID = this.data.ID;
      if (
        this.TimeSlotsData.SLOT1_START_TIME != undefined &&
        this.TimeSlotsData.SLOT1_START_TIME != null &&
        this.TimeSlotsData.SLOT1_START_TIME != ''
      ) {
        this.TimeSlotsData.SLOT1_START_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT1_START_TIME),
          'HH:mm'
        );
      }
      if (
        this.TimeSlotsData.SLOT1_END_TIME != undefined &&
        this.TimeSlotsData.SLOT1_END_TIME != null &&
        this.TimeSlotsData.SLOT1_END_TIME != ''
      ) {
        this.TimeSlotsData.SLOT1_END_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT1_END_TIME),
          'HH:mm'
        );
      }
      if (
        this.TimeSlotsData.SLOT2_START_TIME != undefined &&
        this.TimeSlotsData.SLOT2_START_TIME != null &&
        this.TimeSlotsData.SLOT2_START_TIME != ''
      ) {
        this.TimeSlotsData.SLOT2_START_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT2_START_TIME),
          'HH:mm'
        );
      }
      if (
        this.TimeSlotsData.SLOT2_END_TIME != undefined &&
        this.TimeSlotsData.SLOT2_END_TIME != null &&
        this.TimeSlotsData.SLOT2_END_TIME != ''
      ) {
        this.TimeSlotsData.SLOT2_END_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT2_END_TIME),
          'HH:mm'
        );
      }
      if (
        this.TimeSlotsData.SLOT3_START_TIME != undefined &&
        this.TimeSlotsData.SLOT3_START_TIME != null &&
        this.TimeSlotsData.SLOT3_START_TIME != ''
      ) {
        this.TimeSlotsData.SLOT3_START_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT3_START_TIME),
          'HH:mm'
        );
      }
      if (
        this.TimeSlotsData.SLOT3_END_TIME != undefined &&
        this.TimeSlotsData.SLOT3_END_TIME != null &&
        this.TimeSlotsData.SLOT3_END_TIME != ''
      ) {
        this.TimeSlotsData.SLOT3_END_TIME = this.datePipe.transform(
          new Date(this.TimeSlotsData.SLOT3_END_TIME),
          'HH:mm'
        );
      }
      this.isSpinning = true;
      {
        if (this.TimeSlotsData.ID) {
          this.api.updateterritoryTimeSlot(this.TimeSlotsData).subscribe(
            (successCode: any) => {
              if (successCode.status == '200') {
                this.message.success(
                  'Time Slot Mapped To Territory Successfully',
                  ''
                );
                this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Failed to map time slots', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error('Failed to map time slots', '');
              this.isSpinning = false;
            }
          );
        } else {
          var data: any = {
            ORG_ID: 1,
            MAPPING_FOR: 'T',
            MAPPING_ID: this.data.ID,
            SLOT1_START_TIME: this.TimeSlotsData.SLOT1_START_TIME,
            SLOT1_END_TIME: this.TimeSlotsData.SLOT1_END_TIME,
            SLOT2_START_TIME: this.TimeSlotsData.SLOT2_START_TIME,
            SLOT2_END_TIME: this.TimeSlotsData.SLOT2_END_TIME,
            SLOT3_START_TIME: this.TimeSlotsData.SLOT3_START_TIME,
            SLOT3_END_TIME: this.TimeSlotsData.SLOT3_END_TIME,
            CLIENT_ID: 1
          }
          this.api.createterritoryTimeSlot(data).subscribe(
            (successCode: any) => {
              if (successCode.status == '200') {
                this.message.success(
                  'Time Slot Mapped To Territory Successfully',
                  ''
                );
                this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Failed to map time slots', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error('Failed to map time slots', '');
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  disableHours = (startLimit: string | Date, endLimit: string | Date) => {
    let startHour: number;
    let endHour: number;

    if (typeof startLimit === 'string') {
      const [hours] = startLimit.split(':').map(Number);
      startHour = hours;
    } else {
      startHour = startLimit.getHours();
    }

    if (typeof endLimit === 'string') {
      const [hours] = endLimit.split(':').map(Number);
      endHour = hours;
    } else {
      endHour = endLimit.getHours();
    }

    return Array.from({ length: 24 }, (_, i) => i).filter(
      (hour) => hour < startHour || hour > endHour
    );
  };

  // Function to disable minutes dynamically
  disableMinutes = (
    selectedHour: number,
    startLimit: string | Date,
    endLimit: string | Date
  ) => {
    if (!selectedHour) return [];

    // Convert string times to Date objects
    const startTime =
      typeof startLimit === 'string'
        ? this.parseTimeString(startLimit)
        : startLimit;

    const endTime =
      typeof endLimit === 'string' ? this.parseTimeString(endLimit) : endLimit;

    if (selectedHour === startTime.getHours()) {
      return Array.from({ length: startTime.getMinutes() + 1 }, (_, i) => i);
    }

    if (selectedHour === endTime.getHours()) {
      return Array.from(
        { length: 60 - endTime.getMinutes() },
        (_, i) => i + endTime.getMinutes()
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
    startLimit: string | Date,
    endLimit: string | Date
  ) => {
    if (!selectedHour) return [];

    // Convert string times to Date objects
    const startTime =
      typeof startLimit === 'string'
        ? this.parseTimeString(startLimit)
        : startLimit;

    const endTime =
      typeof endLimit === 'string' ? this.parseTimeString(endLimit) : endLimit;

    if (selectedHour === startTime.getHours()) {
      return Array.from({ length: startTime.getMinutes() }, (_, i) => i);
    }

    if (selectedHour === endTime.getHours()) {
      return Array.from(
        { length: 60 - endTime.getMinutes() },
        (_, i) => i + endTime.getMinutes()
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
    if (!this.TimeSlotsData.SLOT1_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.TimeSlotsData.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot2Minutes = (hour: number) => {
    if (!this.TimeSlotsData.SLOT1_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.TimeSlotsData.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };

  disabledSlot3Hours = () => {
    if (!this.TimeSlotsData.SLOT2_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.TimeSlotsData.SLOT2_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot3Minutes = (hour: number) => {
    if (!this.TimeSlotsData.SLOT2_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.TimeSlotsData.SLOT2_END_TIME),
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
    startLimit: string | Date,
    endLimit: string | Date
  ) => {
    if (!selectedHour) return [];

    // Ensure startLimit and endLimit are Date objects
    const startTime = this.parseTimeString(startLimit);
    const endTime = this.parseTimeString(endLimit);

    if (selectedHour === startTime.getHours()) {
      return Array.from({ length: startTime.getMinutes() + 1 }, (_, i) => i);
    }

    if (selectedHour === endTime.getHours()) {
      return Array.from(
        { length: 60 - endTime.getMinutes() },
        (_, i) => i + endTime.getMinutes() + 1
      );
    }

    return [];
  };

  // Helper function to convert "HH:mm:ss" or Date to a proper Date object
  parseTimeString(time: string | Date): Date {
    if (time instanceof Date) {
      return time; // Already a Date object, return as is
    }

    if (typeof time === 'string') {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0, 0);
      return date;
    }

    return new Date(); // Fallback to current date/time if invalid input
  }

  // Conditions for END time slots
  disabledSlot1EndHours = () =>
    this.disableEndHours(
      this.TimeSlotsData.SLOT1_START_TIME,
      this.DAY_END_TIME
    );
  disabledSlot1EndMinutes = (hour: number) =>
    this.disableEndMinutes(
      hour,
      this.TimeSlotsData.SLOT1_START_TIME,
      this.DAY_END_TIME
    );

  disabledSlot2EndHours = () =>
    this.disableEndHours(
      this.TimeSlotsData.SLOT2_START_TIME,
      this.DAY_END_TIME
    );
  disabledSlot2EndMinutes = (hour: number) =>
    this.disableEndMinutes(
      hour,
      this.TimeSlotsData.SLOT2_START_TIME,
      this.DAY_END_TIME
    );

  disabledSlot3EndHours = () =>
    this.disableEndHours(
      this.TimeSlotsData.SLOT3_START_TIME,
      this.DAY_END_TIME
    );
  disabledSlot3EndMinutes = (hour: number) =>
    this.disableEndMinutes1(
      hour,
      this.TimeSlotsData.SLOT3_START_TIME,
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