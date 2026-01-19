import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { OrganizationMaster } from 'src/app/Pages/Models/organization-master';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  providers: [DatePipe]
})
export class OrganizationComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: OrganizationMaster;
  @Input() drawerVisible: boolean;
  passwordVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  orgId = this.cookie.get('orgId');
  isSpinning = false;
  isOk = true;
  namepattern = /^[a-zA-Z0-9\s\(\)\-_&\./]*$/;
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  emailPattern: RegExp = /^(?!.*\.\..*)(?!.*--.*)(?!.*-\.|-\@|\.-|\@-)[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  constructor(private api: ApiServiceService, private cookie: CookieService, private datePipe: DatePipe, private message: NzNotificationService) {
  }
  ngOnInit() {
    this.getallCountry();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID);
    }
    if (this.data?.STATE_ID) {
      this.getDistByState(this.data.STATE_ID);
    }
    if (this.data?.DISTRICT_ID) {
      this.getCityonDist(this.data.DISTRICT_ID);
    }
    if (this.data?.DISTRICT_ID) {
      this.getPincodesByDist(this.data.DISTRICT_ID);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.populateWeeklySchedule();
    }
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    this.data = new OrganizationMaster();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }
  populateWeeklySchedule(): void {
    this.data.DAY_START_TIME = this.convertToDate(this.data.DAY_START_TIME),
      this.data.DAY_END_TIME = this.convertToDate(this.data.DAY_END_TIME)
  }
  convertToDate(time: any): Date | null {
    if (time instanceof Date) return time; 
    if (typeof time !== 'string' || !time) return null;
    const timeParts = time.split(':');
    if (timeParts.length === 3) {
      const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
      const date = new Date();
      date.setHours(hours, minutes, seconds, 0);
      return date;
    }
    return null;
  }
  disabledHoursForToTimeMorning(): () => number[] {
    return () => {
      const startTime = this.data.DAY_START_TIME;
      if (!startTime) {
        return [];
      } else {
        const fromTimeHour = startTime.getHours();
        return Array.from({ length: fromTimeHour }, (_, index) => index);
      }
    };
  }
  disabledMinutesForToTimeMorning(): (hour: number) => number[] {
    return (hour: number) => {
      const startTime = this.data.DAY_START_TIME;
      if (!startTime || hour !== startTime.getHours()) {
        return [];
      } else {
        const fromTimeMinute = startTime.getMinutes();
        return Array.from({ length: fromTimeMinute }, (_, index) => index);
      }
    };
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.NAME == undefined || this.data.NAME == '' || this.data.NAME.trim() == '')
      && (this.data.ADDRESS == '' || this.data.ADDRESS == undefined || this.data.ADDRESS.trim() == '')
      && (this.data.COUNTRY_ID == null || this.data.COUNTRY_ID == undefined)
      && (this.data.STATE_ID == null || this.data.STATE_ID == undefined)
      && (this.data.DISTRICT_ID == null || this.data.DISTRICT_ID == undefined)
      && (this.data.CITY_ID == null || this.data.CITY_ID == undefined)
      && (this.data.PINCODE_ID == null || this.data.PINCODE_ID == undefined)
      && (this.data.DAY_START_TIME == null || this.data.DAY_START_TIME == undefined)
      && (this.data.DAY_END_TIME == null || this.data.DAY_END_TIME == undefined)
    ) {
      this.isOk = false
      this.message.error('Please fill all required details', '')
    }
    else if (this.data.NAME == undefined || this.data.NAME == '' || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error("Please enter organization name", '');
    }
    else if (!this.namepattern.test(this.data.NAME)) {
      this.isOk = false;
      this.message.error("Please enter valid organization name", '');
    }
    else if (
      (this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID.trim() == '') && (!this.data.ID)
    ) {
      this.isOk = false;
      this.message.error('Please enter email.', '');
    } else if ((!this.emailPattern.test(this.data.EMAIL_ID)) && (!this.data.ID)) {
      this.isOk = false;
      this.message.error('Please enter a valid email address.', '');
    }
    else if (this.data.ADDRESS == '' || this.data.ADDRESS == undefined || this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error("Please enter address ", '');
    }
    else if (this.data.COUNTRY_ID == null || this.data.COUNTRY_ID == undefined) {
      this.isOk = false;
      this.message.error("Please enter country", '');
    }
    else if (this.data.STATE_ID == null || this.data.STATE_ID == undefined) {
      this.isOk = false;
      this.message.error("Please select state", '');
    }
    else if (this.data.DISTRICT_ID == null || this.data.DISTRICT_ID == undefined) {
      this.isOk = false;
      this.message.error("Please select district", '');
    }
    else if (this.data.CITY_ID == null || this.data.CITY_ID == undefined) {
      this.isOk = false;
      this.message.error("Please select city", '');
    }
    else if (this.data.PINCODE_ID == null || this.data.PINCODE_ID == undefined) {
      this.isOk = false;
      this.message.error("Please enter pincode", '');
    }
    else if (this.data.DAY_START_TIME == null || this.data.DAY_START_TIME == undefined) {
      this.isOk = false;
      this.message.error("Please select start time", '');
    }
    else if (this.data.DAY_END_TIME == null || this.data.DAY_END_TIME == undefined) {
      this.isOk = false;
      this.message.error("Please select end time", '');
    }
    if (this.isOk) {
      if (
        this.data.DAY_START_TIME != undefined &&
        this.data.DAY_START_TIME != null &&
        this.data.DAY_START_TIME != ''
      ) {
        this.data.DAY_START_TIME = this.datePipe.transform(new Date(this.data.DAY_START_TIME), 'HH:mm');
      }
      if (
        this.data.DAY_END_TIME != undefined &&
        this.data.DAY_END_TIME != null &&
        this.data.DAY_END_TIME != ''
      ) {
        this.data.DAY_END_TIME = this.datePipe.transform(new Date(this.data.DAY_END_TIME), 'HH:mm');
      }
      this.isSpinning = true;
      this.orgId = this.cookie.get('orgId');
      this.data.CAN_CHANGE_SERVICE_PRICE = true;
      if (this.data.ID) {
        this.api.updateOrganization(this.data).subscribe(successCode => {
          if (successCode['code'] == 200 && successCode['message'] == 'Email already exists...') {
            this.message.error("Email already exists.", '')
            this.isSpinning = false;
          }
          else if (successCode['code'] == 200) {
            this.message.success("Oraganization information updated successfully", "");
            if (!addNew)
              this.drawerClose();
            this.isSpinning = false;
            this.resetDrawer(accountMasterPage);
          } else {
            this.message.error("Oraganization information updation failed", "");
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createOrganization(this.data).subscribe(successCode => {
          if (successCode['code'] == 200 && successCode['message'] == 'Email already exists...') {
            this.message.error("Email already exists.", '')
            this.isSpinning = false;
          }
          else if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Oraganization information saved successfully", "");
            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);
            } else {
              this.data = new OrganizationMaster();
              this.resetDrawer(accountMasterPage);
            }
          } else {
            this.message.error("Oraganization information creation failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }
  isStateSpinning = false;
  isDistSpinning = false;
  isCitySpinning = false;
  isPincodeSpinning = false;
  DistData: any = [];
  PincodeData: any = [];
  StateData: any = [];
  CountryData: any = [];
  CityData: any = [];
  getallCountry() {
    this.api.getAllCountryMaster(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CountryData = data['data'];
          this.isSpinning = false;
        } else {
          this.CountryData = [];
          this.message.error('Failed to get country data', '');
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something went wrong.', '');
        }
      }
    );
  }
  getStatesByCountry(countryId: any, value: boolean = true) {
    if (value === false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.StateData = [];
      this.DistData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.isStateSpinning = true; 
    this.api
      .getState(
        0,
        0,
        '',
        'asc',
        `AND COUNTRY_ID = ${countryId} AND IS_ACTIVE = 1`
      ) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
          } else {
            this.StateData = [];
            this.message.error('Failed to get state data...', '');
          }
          this.isStateSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isStateSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
  }
  getDistByState(stateId: number, value: boolean = true) {
    if (value === false) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.isDistSpinning = true; 
    this.api
      .getDistrictData(
        0,
        0,
        '',
        'asc',
        `AND STATE_ID = ${stateId} AND IS_ACTIVE = 1`
      ) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.DistData = data['data'];
          } else {
            this.DistData = [];
            this.message.error('Failed to tet district data...', '');
          }
          this.isDistSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isDistSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
  }
  onDistrictChange(districtId: number | null) {
    this.data.CITY_ID = null;
    this.CityData = [];
    this.data.PINCODE_ID = null;
    this.data.PINCODE = null;
    this.PincodeData = [];
    if (districtId) {
      this.getCityonDist(districtId);
      this.getPincodesByDist(districtId);
    }
  }
  getCityonDist(distId: number | null, value: boolean = true) {
    if (value === false) {
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.CityData = [];
    }
    this.isCitySpinning = true; 
    this.api
      .getAllCityMaster(
        0,
        0,
        '',
        'asc',
        `AND DISTRICT_ID = ${distId} AND IS_ACTIVE = 1`
      ) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.CityData = data['data'];
          } else {
            this.CityData = [];
            this.message.error('Failed to get city data...', '');
          }
          this.isCitySpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isCitySpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
  }
  Filterss: any = {};
  logfilt: any;
  filterdata1: any
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER']
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }
  getPincodesByDist(distId: number | null, value: boolean = true) {
    this.getCityonDist(distId);
    if (value === false) {
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.PincodeData = [];
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(0, 0, '', 'asc', `AND DISTRICT = ${distId}`) 
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);
          } else {
            this.PincodeData = [];
            this.message.error('Failed to get pincode data...', '');
          }
          this.isPincodeSpinning = false; 
        },
        (err: HttpErrorResponse) => {
          this.isPincodeSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else {
            this.message.error('Something went wrong.', '');
          }
        }
      );
  }
}
