import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  customer,
  SlotsMappingToCustomer,
} from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-customer-time-slots',
  templateUrl: './customer-time-slots.component.html',
  styleUrls: ['./customer-time-slots.component.css'],
})
export class CustomerTImeSlotsComponent {
  @Input() data: any = customer;
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
  dataList: any = SlotsMappingToCustomer;
  defaultDisabledHours: number[] = []; 
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  public commonFunction = new CommonFunctionService();
  orgId: any;
  ngOnInit(): void {
    this.getglobalTimeSlotConfigData();
    this.organizationid = sessionStorage.getItem('orgId');
    this.orgId = this.organizationid
      ? this.commonFunction.decryptdata(this.organizationid)
      : 0;
    this.getOrganizationData();
  }
  disableHours = (startLimit: Date, endLimit: Date) => {
    return Array.from({ length: 24 }, (_, i) => i).filter(
      (hour) => hour < startLimit.getHours() || hour > endLimit.getHours()
    );
  };
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
  disabledSlot1Hours = () =>
    this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
  disabledSlot1Minutes = (hour: number) =>
    this.disableMinutes3(hour, this.DAY_START_TIME, this.DAY_END_TIME);
  disabledSlot2Hours = () => {
    if (!this.dataList.SLOT1_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.dataList.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot2Minutes = (hour: number) => {
    if (!this.dataList.SLOT1_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.dataList.SLOT1_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot3Hours = () => {
    if (!this.dataList.SLOT2_END_TIME)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(
      new Date(this.dataList.SLOT2_END_TIME),
      this.DAY_END_TIME
    );
  };
  disabledSlot3Minutes = (hour: number) => {
    if (!this.dataList.SLOT2_END_TIME)
      return this.disableMinutes(hour, this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableMinutes1(
      hour,
      new Date(this.dataList.SLOT2_END_TIME),
      this.DAY_END_TIME
    );
  };
  disableEndHours = (startTime: Date, endLimit: Date) => {
    if (!startTime)
      return this.disableHours(this.DAY_START_TIME, this.DAY_END_TIME);
    return this.disableHours(startTime, endLimit);
  };
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
  disabledSlot1EndHours = () =>
    this.disableEndHours(this.dataList.SLOT1_START_TIME, this.DAY_END_TIME);
  disabledSlot1EndMinutes = (hour: number) =>
    this.disableEndMinutes(
      hour,
      this.dataList.SLOT1_START_TIME,
      this.DAY_END_TIME
    );
  disabledSlot2EndHours = () =>
    this.disableEndHours(this.dataList.SLOT2_START_TIME, this.DAY_END_TIME);
  disabledSlot2EndMinutes = (hour: number) =>
    this.disableEndMinutes(
      hour,
      this.dataList.SLOT2_START_TIME,
      this.DAY_END_TIME
    );
  disabledSlot3EndHours = () =>
    this.disableEndHours(this.dataList.SLOT3_START_TIME, this.DAY_END_TIME);
  disabledSlot3EndMinutes = (hour: number) =>
    this.disableEndMinutes1(
      hour,
      this.dataList.SLOT3_START_TIME,
      this.DAY_END_TIME
    );
  parseExpectedTime(expectedTime: string): Date | null {
    if (!expectedTime) return null;
    const [hours, minutes, seconds] = expectedTime.split(':').map(Number);
    const now = new Date(); 
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    return now; 
  }
  getOrganizationData() {
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=' + this.orgId)
      .subscribe((data) => {
        if (data['status'] == 200 && data.body.count > 0) {
          if (data.body['data'][0].DAY_START_TIME) {
            this.DAY_START_TIME = moment(
              data.body['data'][0].DAY_START_TIME,
              'hh:mm A'
            ).toDate();
          }
          if (data.body['data'][0].DAY_END_TIME) {
            this.DAY_END_TIME = moment(
              data.body['data'][0].DAY_END_TIME,
              'hh:mm A'
            ).toDate();
          }
        }
      });
  }
  formatTimeToHHmm(time: any): string {
    const date = new Date(time); 
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  save(addNew: boolean, Unitmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.dataList.SLOT1_START_TIME === undefined ||
      this.dataList.SLOT1_START_TIME === null ||
      this.dataList.SLOT1_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 1 Start Time', '');
      this.isOk = false;
    } else if (
      this.dataList.SLOT1_END_TIME === undefined ||
      this.dataList.SLOT1_END_TIME === null ||
      this.dataList.SLOT1_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 1 End Time', '');
      this.isOk = false;
    } else if (
      this.dataList.SLOT2_START_TIME === undefined ||
      this.dataList.SLOT2_START_TIME === null ||
      this.dataList.SLOT2_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 2 Start Time', '');
      this.isOk = false;
    } else if (
      this.dataList.SLOT2_END_TIME === undefined ||
      this.dataList.SLOT2_END_TIME === null ||
      this.dataList.SLOT2_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    } else if (
      this.dataList.SLOT3_START_TIME === undefined ||
      this.dataList.SLOT3_START_TIME === null ||
      this.dataList.SLOT3_START_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 Start Time', '');
      this.isOk = false;
    } else if (
      this.dataList.SLOT3_END_TIME === undefined ||
      this.dataList.SLOT3_END_TIME === null ||
      this.dataList.SLOT3_END_TIME === ''
    ) {
      this.message.error('Please Select Slot 3 End Time', '');
      this.isOk = false;
    }
    if (this.isOk) {
      this.dataList.ORG_ID = 1;
      this.dataList.MAPPING_ID = this.data.ID;
      {
        if (this.dataList.SLOT1_START_TIME) {
          this.dataList.SLOT1_START_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT1_START_TIME
          );
        }
        if (this.dataList.SLOT1_END_TIME) {
          this.dataList.SLOT1_END_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT1_END_TIME
          );
        }
        if (this.dataList.SLOT2_START_TIME) {
          this.dataList.SLOT2_START_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT2_START_TIME
          );
        }
        if (this.dataList.SLOT2_END_TIME) {
          this.dataList.SLOT2_END_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT2_END_TIME
          );
        }
        if (this.dataList.SLOT3_START_TIME) {
          this.dataList.SLOT3_START_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT3_START_TIME
          );
        }
        if (this.dataList.SLOT3_END_TIME) {
          this.dataList.SLOT3_END_TIME = this.formatTimeToHHmm(
            this.dataList.SLOT3_END_TIME
          );
        }
        if (this.dataList.ID) {
          this.api.updateterritoryTimeSlot(this.dataList).subscribe(
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
          var data: any = {
            MAPPING_ID: this.data.ID,
            MAPPING_FOR: 'C',
            ORG_ID: 1,
            SLOT1_END_TIME: this.dataList.SLOT1_END_TIME,
            SLOT1_START_TIME: this.dataList.SLOT1_START_TIME,
            SLOT2_END_TIME: this.dataList.SLOT2_END_TIME,
            SLOT2_START_TIME: this.dataList.SLOT2_START_TIME,
            SLOT3_END_TIME: this.dataList.SLOT3_END_TIME,
            SLOT3_START_TIME: this.dataList.SLOT3_START_TIME,
            CLIENT_ID: 1
          }
          this.api.createterritoryTimeSlot(data).subscribe(
            (successCode: any) => {
              if (successCode.status === 200) {
                this.isSpinning = false;
                this.message.success('Time Slot Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.dataList = new SlotsMappingToCustomer();
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
  close(Unitmaster: NgForm) {
    this.drawerClose();
    this.resetDrawer(Unitmaster);
  }
  resetDrawer(Unitmaster: NgForm) {
    this.dataList = new SlotsMappingToCustomer();
    Unitmaster.form.markAsPristine();
    Unitmaster.form.markAsUntouched();
  }
  getglobalTimeSlotConfigData() {
    this.loadingRecords = true;
    this.api
      .globalTimeSlotsMappingGet(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sort,
        " AND MAPPING_FOR = 'C' AND MAPPING_ID = " + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.dataList = data['body']['data'][0];
            if (this.dataList?.ID) {
              this.dataList.SLOT1_START_TIME = this.parseExpectedTime(
                this.dataList.SLOT1_START_TIME
              );
              this.dataList.SLOT1_END_TIME = this.parseExpectedTime(
                this.dataList.SLOT1_END_TIME
              );
              this.dataList.SLOT2_START_TIME = this.parseExpectedTime(
                this.dataList.SLOT2_START_TIME
              );
              this.dataList.SLOT2_END_TIME = this.parseExpectedTime(
                this.dataList.SLOT2_END_TIME
              );
              this.dataList.SLOT3_START_TIME = this.parseExpectedTime(
                this.dataList.SLOT3_START_TIME
              );
              this.dataList.SLOT3_END_TIME = this.parseExpectedTime(
                this.dataList.SLOT3_END_TIME
              );
            } else {
              this.loadingRecords = false;
              this.dataList = [];
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
    return this.dataList?.length > 0 && !this.dataList?.ID;
  }
  onTimeChange(field: string, value: Date) {
    if (value) {
      this.dataList[field] = this.roundMinutesToNearestInterval(
        new Date(value)
      );
    }
    if (field === 'SLOT1_START_TIME') {
      if (
        this.dataList.SLOT1_END_TIME &&
        this.dataList.SLOT1_END_TIME < value
      ) {
        this.dataList.SLOT1_END_TIME = null; 
      }
    }
    if (field === 'SLOT1_END_TIME') {
      if (
        this.dataList.SLOT2_START_TIME &&
        this.dataList.SLOT2_START_TIME < value
      ) {
        this.dataList.SLOT2_START_TIME = null; 
      }
    }
    if (field === 'SLOT2_START_TIME') {
      if (
        this.dataList.SLOT2_END_TIME &&
        this.dataList.SLOT2_END_TIME < value
      ) {
        this.dataList.SLOT2_END_TIME = null; 
      }
    }
    if (field === 'SLOT2_END_TIME') {
      if (
        this.dataList.SLOT3_START_TIME &&
        this.dataList.SLOT3_START_TIME < value
      ) {
        this.dataList.SLOT3_START_TIME = null; 
      }
    }
    if (field === 'SLOT3_START_TIME') {
      if (
        this.dataList.SLOT3_END_TIME &&
        this.dataList.SLOT3_END_TIME < value
      ) {
        this.dataList.SLOT3_END_TIME = null; 
      }
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