import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;
@Component({
  selector: 'app-technician-masterdrawer',
  templateUrl: './technician-masterdrawer.component.html',
  styleUrls: ['./technician-masterdrawer.component.css'],
})
export class TechnicianMasterdrawerComponent {
  emailpattern: RegExp =
    /^(?!.*\.\..*)(?!.*--)(?!.*[-.]{2})(?!.*[-@][.@-])[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  employmentType: string = 'O';
  @Input() data: any = TechnicianMasterData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  isLoading = false;
  uploadedImage: any = '';
  selectedTab: number = 0;
  isFocused: string = '';
  StartDate: any;
  submittedDateVisible: boolean = false;
  isSubmittedDateFilterApplied: boolean = false;
  StartDate1: any;
  submittedDateVisible1: boolean = false;
  isSubmittedDateFilterApplied1: boolean = false;
  StartDate2: any;
  submittedDateVisible2: boolean = false;
  isSubmittedDateFilterApplied2: boolean = false;
  StartDate3: any;
  submittedDateVisible3: boolean = false;
  isSubmittedDateFilterApplied3: boolean = false;
  public commonFunction = new CommonFunctionService();
  googleAutocomplete: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  EXPERIENCE_LEVEL = [
    { Id: 'F', Name: 'Fresher' },
    { Id: 'J', Name: 'Junior' },
    { Id: 'M', Name: 'Mid-Level' },
    { Id: 'S', Name: 'Senior' },
    { Id: 'L', Name: 'Lead' },
    { Id: 'E', Name: 'Expert' },
  ];
  VehicleData = [
    { ID: 'T', NAME: 'Two-Wheeler' },
    { ID: 'TR', NAME: 'Three-Wheeler' },
    { ID: 'F', NAME: 'Four-Wheeler' },
  ];
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  organizationid: any = sessionStorage.getItem('orgId');
  ngOnInit() {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.PROFILE_PHOTO !== null &&
      this.data.PROFILE_PHOTO !== undefined &&
      this.data.PROFILE_PHOTO !== ''
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'TechnicianProfile/' + this.data.PROFILE_PHOTO;
      this.uploadedImage = this.data.PROFILE_PHOTO;
    } else {
    }
    if (this.data.ID) {
      this.data.OLD_TYPE = this.data.TYPE;
    }
    this.organizationid = sessionStorage.getItem('orgId');
    this.data.ORG_ID = 1
    this.getOrganizationData();
    this.getorgData();
    this.getallCountry();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID);
    }
    if (this.data?.STATE_ID) {
      this.getDistrictByState(this.data.STATE_ID);
    }
    if (this.data?.DISTRICT_ID) {
      this.getPincodesByCity(this.data.DISTRICT_ID);
    }
    this.getallVendors();
    const dayMapping = {
      Mo: 'Monday',
      Tu: 'Tuesday',
      We: 'Wednesday',
      Th: 'Thursday',
      Fr: 'Friday',
      Sa: 'Saturday',
      Su: 'Sunday',
    };
    if (!this.data.ID) {
      this.WEEK_DAY_DATA = this.weekDays.map((day) => ({
        WEEK_DAY: day,
        IS_SERIVCE_AVAILABLE: true,
        DAY_START_TIME: null,
        DAY_END_TIME: null,
        BREAK_START_TIME: null,
        BREAK_END_TIME: null,
      }));
    } else if (this.data.ID && this.data.WEEK_DAY_DATA) {
      this.WEEK_DAY_DATA = this.data.WEEK_DAY_DATA.map((day) => ({
        WEEK_DAY: Object.keys(dayMapping).includes(day.WEEK_DAY)
          ? dayMapping[day.WEEK_DAY] 
          : day.WEEK_DAY,
        IS_SERIVCE_AVAILABLE: day.IS_SERIVCE_AVAILABLE,
        DAY_START_TIME: day.DAY_START_TIME,
        DAY_END_TIME: day.DAY_END_TIME,
        BREAK_START_TIME: day.BREAK_START_TIME,
        BREAK_END_TIME: day.BREAK_END_TIME,
      }));
    }
    this.useridd = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.vendorroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    if (this.vendorroleid == '9') {
      this.data.TYPE = 'V';
      this.api.getAllUsers(0, 0, '', '', ' AND ID=' + this.useridd).subscribe(
        (data) => {
          if (data['code'] === 200) {
            var dataaaaaa = data['data'];
            this.data.VENDOR_ID = dataaaaaa[0].VENDOR_ID;
          } else {
            this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
    }
  }
  cancelFilterss() {
    this.submittedDateVisible = false;
  }
  applyprepFilter(value: any) {
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
    const formattedStartTime = date.toISOString();
    this.WEEK_DAY_DATA.forEach((day) => {
      if (day.IS_SERIVCE_AVAILABLE) {
        day.DAY_START_TIME = formattedStartTime;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.DAY_START_TIME = formattedStartTime;
      const endTime = new Date(item.DAY_END_TIME);
      if (endTime < date) {
        item.DAY_END_TIME = null;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.DAY_START_TIME = formattedStartTime;
      const endTime = new Date(item.BREAK_START_TIME);
      if (endTime < date) {
        item.BREAK_START_TIME = null;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.DAY_START_TIME = formattedStartTime;
      const endTime = new Date(item.BREAK_END_TIME);
      if (endTime < date) {
        item.BREAK_END_TIME = null;
      }
    });
    this.updateEndTimeRestrictions();
    this.submittedDateVisible = false;
  }
  updateEndTimeRestrictions() {
    this.disableEndHours = () => {
      let startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < startHour || h > this.orgEndHour
      );
    };
    this.disableEndMinutes = (hour: number) => {
      let startHour = this.getStartHour();
      let startMinute = this.getStartMinute();
      const endHour = this.orgEndHour;
      const endMinute = this.orgEndMinute;
      const minuteStep = 10;
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      if (hour === startHour) {
        return allMinutes.filter((m) => m <= startMinute);
      } else if (hour === endHour) {
        return allMinutes.filter((m) => m > endMinute);
      }
      return [];
    };
    this.disableBreakStartHours = (): number[] => {
      let startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < startHour || h > this.orgEndHour
      );
    };
    this.disableBreakStartMinutes = (hour: number): number[] => {
      let startHour = this.getStartHour();
      let startMinute = this.getStartMinute();
      const endHour = this.orgEndHour;
      const endMinute = this.orgEndMinute;
      const minuteStep = 10;
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      if (hour === startHour) {
        return allMinutes.filter((m) => m <= startMinute);
      } else if (hour === endHour) {
        return allMinutes.filter((m) => m > endMinute);
      }
      return [];
    };
  }
  cancelFilterss1() {
    this.submittedDateVisible1 = false;
  }
  applyprepFilter1(value: any) {
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
    const formattedStartTime = date.toISOString();
    this.WEEK_DAY_DATA.forEach((day) => {
      if (day.IS_SERIVCE_AVAILABLE) {
        day.DAY_END_TIME = formattedStartTime;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.DAY_END_TIME = formattedStartTime;
      const endTime = new Date(item.BREAK_START_TIME);
      if (endTime > date) {
        item.BREAK_START_TIME = null;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.DAY_END_TIME = formattedStartTime;
      const endTime = new Date(item.BREAK_END_TIME);
      if (endTime > date) {
        item.BREAK_END_TIME = null;
      }
    });
    this.updateEndTimeRestrictions1();
    this.submittedDateVisible1 = false;
  }
  updateEndTimeRestrictions1() {
    this.disableBreakStartHours = (): number[] => {
      let endHour = this.getEndHour();
      let startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < startHour || h > endHour
      );
    };
    this.disableBreakStartMinutes = (hour: number): number[] => {
      let endHour1 = this.getEndHour();
      let endMinute1 = this.getEndMinute();
      let startHour = this.getStartHour();
      let startminute = this.getStartMinute();
      const endHour = this.orgEndHour;
      const endMinute = this.orgEndMinute;
      const minuteStep = 10;
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      if (hour === endHour1) {
        return allMinutes.filter((m) => m >= endMinute1);
      } else if (hour === startHour) {
        return allMinutes.filter((m) => m <= startminute);
      } else if (hour === endHour) {
        return allMinutes.filter((m) => m > endMinute);
      }
      return [];
    };
    this.disableBreakEndHours = (): number[] => {
      let endHour = this.getEndHour();
      return Array.from({ length: 24 }, (_, h) => h).filter((h) => h > endHour);
    };
    this.disableBreakEndMinutes = (hour: number): number[] => {
      let endHour1 = this.getEndHour();
      let endMinute1 = this.getEndMinute();
      const endHour = this.orgEndHour;
      const endMinute = this.orgEndMinute;
      const minuteStep = 10;
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      if (hour === endHour1) {
        return allMinutes.filter((m) => m >= endMinute1);
      } else if (hour === endHour) {
        return allMinutes.filter((m) => m > endMinute);
      }
      return [];
    };
  }
  cancelFilterss2() {
    this.submittedDateVisible2 = false;
  }
  applyprepFilter2(value: any) {
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
    const formattedStartTime = date.toISOString();
    this.WEEK_DAY_DATA.forEach((day) => {
      if (day.IS_SERIVCE_AVAILABLE) {
        day.BREAK_START_TIME = formattedStartTime;
      }
    });
    this.WEEK_DAY_DATA.forEach((item) => {
      item.BREAK_START_TIME = formattedStartTime;
      const endTime = new Date(item.BREAK_END_TIME);
      if (endTime < date) {
        item.BREAK_END_TIME = null;
      }
    });
    this.updateEndTimeRestrictions2();
    this.submittedDateVisible2 = false;
  }
  updateEndTimeRestrictions2() {
    this.disableBreakEndHours = (): number[] => {
      let breakstartHour = this.getBreakStartHour();
      let endHour = this.getEndHour();
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < breakstartHour || h > endHour
      );
    };
    this.disableBreakEndMinutes = (hour: number): number[] => {
      let endHour1 = this.getEndHour();
      let endMinute1 = this.getEndMinute();
      let breakstartHour = this.getBreakStartHour();
      let breakstartMinute = this.getBreakStartMinute();
      const endHour = this.orgEndHour;
      const endMinute = this.orgEndMinute;
      const minuteStep = 10;
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      if (hour === endHour1) {
        return allMinutes.filter((m) => m >= endMinute1);
      } else if (hour === breakstartHour) {
        return allMinutes.filter((m) => m <= breakstartMinute);
      } else if (hour === endHour) {
        return allMinutes.filter((m) => m > endMinute);
      }
      return [];
    };
  }
  cancelFilterss3() {
    this.submittedDateVisible3 = false;
  }
  applyprepFilter3(value: any) {
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
    const formattedStartTime = date.toISOString();
    this.WEEK_DAY_DATA.forEach((day) => {
      if (day.IS_SERIVCE_AVAILABLE) {
        day.BREAK_END_TIME = formattedStartTime;
      }
    });
    this.submittedDateVisible3 = false;
  }
  vendorid: any = '';
  vendorroleid: any;
  useridd: any;
  Disabled = true;
  outertab = 0;
  onSelectedIndexChange(event: any) {
    this.outertab = event;
    if (event == 0) {
    }
  }
  isSpinning = false;
  isOk = true;
  passwordVisible: boolean = false;
  isStateSpinning: boolean = false;
  isDistrictSpinning: boolean = false;
  isCitySpinning: boolean = false;
  isPincodeSpinning: boolean = false;
  resetDrawer(websitebannerPage: NgForm) {
    this.fileURL = null;
    this.data = new TechnicianMasterData();
    this.fileURL = null;
    this.data.ORG_ID = 1
    if (this.vendorroleid == '9') {
      this.data.TYPE = 'V';
      this.api.getAllUsers(0, 0, '', '', ' AND ID=' + this.useridd).subscribe(
        (data) => {
          if (data['code'] === 200) {
            var dataaaaaa = data['data'];
            this.data.VENDOR_ID = dataaaaaa[0].VENDOR_ID;
          } else {
            this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
    }
    const dayMapping = {
      Mo: 'Monday',
      Tu: 'Tuesday',
      We: 'Wednesday',
      Th: 'Thursday',
      Fr: 'Friday',
      Sa: 'Saturday',
      Su: 'Sunday',
    };
    if (!this.data.ID) {
      this.WEEK_DAY_DATA = this.weekDays.map((day) => ({
        WEEK_DAY: day,
        IS_SERIVCE_AVAILABLE: true,
        DAY_START_TIME: null,
        DAY_END_TIME: null,
        BREAK_START_TIME: null,
        BREAK_END_TIME: null,
      }));
    } else if (this.data.ID && this.data.WEEK_DAY_DATA) {
      this.WEEK_DAY_DATA = this.data.WEEK_DAY_DATA.map((day) => ({
        WEEK_DAY: Object.keys(dayMapping).includes(day.WEEK_DAY)
          ? dayMapping[day.WEEK_DAY] 
          : day.WEEK_DAY,
        IS_SERIVCE_AVAILABLE: day.IS_SERIVCE_AVAILABLE,
        DAY_START_TIME: day.DAY_START_TIME,
        DAY_END_TIME: day.DAY_END_TIME,
        BREAK_START_TIME: day.BREAK_START_TIME,
        BREAK_END_TIME: day.BREAK_END_TIME,
      }));
    }
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  disableWeekEndDate = (current: Date): boolean => {
    if (this.data.CONTRACT_START_DATE) {
      const weekStartDate = new Date(this.data.CONTRACT_START_DATE);
      const startDateNormalized = new Date(
        weekStartDate.getFullYear(),
        weekStartDate.getMonth(),
        weekStartDate.getDate()
      );
      const currentDateNormalized = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      return currentDateNormalized < startDateNormalized;
    }
    return false;
  };
  pattern: RegExp = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/;
  countryCodes = [
    { label: '+91 (India)', value: '+91' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+93 (Afghanistan)', value: '+93' },
    { label: '+94 (Sri Lanka)', value: '+94' },
    { label: '+95 (Myanmar)', value: '+95' },
    { label: '+1 (United States)', value: '+1' },
    { label: '+1-242 (Bahamas)', value: '+1-242' },
    { label: '+1-246 (Barbados)', value: '+1-246' },
    { label: '+1-264 (Anguilla)', value: '+1-264' },
    { label: '+1-268 (Antigua and Barbuda)', value: '+1-268' },
    { label: '+1-284 (British Virgin Islands)', value: '+1-284' },
    { label: '+1-340 (U.S. Virgin Islands)', value: '+1-340' },
    { label: '+1-345 (Cayman Islands)', value: '+1-345' },
    { label: '+1-441 (Bermuda)', value: '+1-441' },
    { label: '+1-473 (Grenada)', value: '+1-473' },
    { label: '+1-649 (Turks and Caicos Islands)', value: '+1-649' },
    { label: '+1-664 (Montserrat)', value: '+1-664' },
    { label: '+1-670 (Northern Mariana Islands)', value: '+1-670' },
    { label: '+1-671 (Guam)', value: '+1-671' },
    { label: '+1-684 (American Samoa)', value: '+1-684' },
    { label: '+1-721 (Sint Maarten)', value: '+1-721' },
    { label: '+1-758 (Saint Lucia)', value: '+1-758' },
    { label: '+1-767 (Dominica)', value: '+1-767' },
    { label: '+1-784 (Saint Vincent and the Grenadines)', value: '+1-784' },
    { label: '+1-787 (Puerto Rico)', value: '+1-787' },
    { label: '+1-809 (Dominican Republic)', value: '+1-809' },
    { label: '+1-829 (Dominican Republic)', value: '+1-829' },
    { label: '+1-849 (Dominican Republic)', value: '+1-849' },
    { label: '+1-868 (Trinidad and Tobago)', value: '+1-868' },
    { label: '+1-869 (Saint Kitts and Nevis)', value: '+1-869' },
    { label: '+1-876 (Jamaica)', value: '+1-876' },
    { label: '+1-939 (Puerto Rico)', value: '+1-939' },
    { label: '+20 (Egypt)', value: '+20' },
    { label: '+211 (South Sudan)', value: '+211' },
    { label: '+212 (Morocco)', value: '+212' },
    { label: '+213 (Algeria)', value: '+213' },
    { label: '+216 (Tunisia)', value: '+216' },
    { label: '+218 (Libya)', value: '+218' },
    { label: '+220 (Gambia)', value: '+220' },
    { label: '+221 (Senegal)', value: '+221' },
    { label: '+222 (Mauritania)', value: '+222' },
    { label: '+223 (Mali)', value: '+223' },
    { label: '+224 (Guinea)', value: '+224' },
    { label: '+225 (Ivory Coast)', value: '+225' },
    { label: '+226 (Burkina Faso)', value: '+226' },
    { label: '+227 (Niger)', value: '+227' },
    { label: '+228 (Togo)', value: '+228' },
    { label: '+229 (Benin)', value: '+229' },
    { label: '+230 (Mauritius)', value: '+230' },
    { label: '+231 (Liberia)', value: '+231' },
    { label: '+232 (Sierra Leone)', value: '+232' },
    { label: '+233 (Ghana)', value: '+233' },
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+235 (Chad)', value: '+235' },
    { label: '+236 (Central African Republic)', value: '+236' },
    { label: '+237 (Cameroon)', value: '+237' },
    { label: '+238 (Cape Verde)', value: '+238' },
    { label: '+239 (Sao Tome and Principe)', value: '+239' },
    { label: '+240 (Equatorial Guinea)', value: '+240' },
    { label: '+241 (Gabon)', value: '+241' },
    { label: '+242 (Republic of the Congo)', value: '+242' },
    { label: '+243 (Democratic Republic of the Congo)', value: '+243' },
    { label: '+244 (Angola)', value: '+244' },
    { label: '+245 (Guinea-Bissau)', value: '+245' },
    { label: '+246 (British Indian Ocean Territory)', value: '+246' },
    { label: '+248 (Seychelles)', value: '+248' },
    { label: '+249 (Sudan)', value: '+249' },
    { label: '+250 (Rwanda)', value: '+250' },
    { label: '+251 (Ethiopia)', value: '+251' },
    { label: '+252 (Somalia)', value: '+252' },
    { label: '+253 (Djibouti)', value: '+253' },
    { label: '+254 (Kenya)', value: '+254' },
    { label: '+255 (Tanzania)', value: '+255' },
    { label: '+256 (Uganda)', value: '+256' },
    { label: '+257 (Burundi)', value: '+257' },
    { label: '+258 (Mozambique)', value: '+258' },
    { label: '+260 (Zambia)', value: '+260' },
    { label: '+261 (Madagascar)', value: '+261' },
    { label: '+262 (Reunion)', value: '+262' },
    { label: '+263 (Zimbabwe)', value: '+263' },
    { label: '+264 (Namibia)', value: '+264' },
    { label: '+265 (Malawi)', value: '+265' },
    { label: '+266 (Lesotho)', value: '+266' },
    { label: '+267 (Botswana)', value: '+267' },
    { label: '+268 (Eswatini)', value: '+268' },
    { label: '+269 (Comoros)', value: '+269' },
    { label: '+27 (South Africa)', value: '+27' },
    { label: '+290 (Saint Helena)', value: '+290' },
    { label: '+291 (Eritrea)', value: '+291' },
    { label: '+297 (Aruba)', value: '+297' },
    { label: '+298 (Faroe Islands)', value: '+298' },
    { label: '+299 (Greenland)', value: '+299' },
    { label: '+30 (Greece)', value: '+30' },
    { label: '+31 (Netherlands)', value: '+31' },
    { label: '+32 (Belgium)', value: '+32' },
    { label: '+33 (France)', value: '+33' },
    { label: '+34 (Spain)', value: '+34' },
    { label: '+350 (Gibraltar)', value: '+350' },
    { label: '+351 (Portugal)', value: '+351' },
    { label: '+352 (Luxembourg)', value: '+352' },
    { label: '+353 (Ireland)', value: '+353' },
    { label: '+354 (Iceland)', value: '+354' },
    { label: '+355 (Albania)', value: '+355' },
    { label: '+356 (Malta)', value: '+356' },
    { label: '+357 (Cyprus)', value: '+357' },
    { label: '+358 (Finland)', value: '+358' },
    { label: '+359 (Bulgaria)', value: '+359' },
    { label: '+36 (Hungary)', value: '+36' },
    { label: '+370 (Lithuania)', value: '+370' },
    { label: '+371 (Latvia)', value: '+371' },
    { label: '+372 (Estonia)', value: '+372' },
    { label: '+373 (Moldova)', value: '+373' },
    { label: '+374 (Armenia)', value: '+374' },
    { label: '+375 (Belarus)', value: '+375' },
    { label: '+376 (Andorra)', value: '+376' },
    { label: '+377 (Monaco)', value: '+377' },
    { label: '+378 (San Marino)', value: '+378' },
    { label: '+379 (Vatican City)', value: '+379' },
    { label: '+380 (Ukraine)', value: '+380' },
    { label: '+381 (Serbia)', value: '+381' },
    { label: '+382 (Montenegro)', value: '+382' },
    { label: '+383 (Kosovo)', value: '+383' },
    { label: '+385 (Croatia)', value: '+385' },
    { label: '+386 (Slovenia)', value: '+386' },
    { label: '+387 (Bosnia and Herzegovina)', value: '+387' },
    { label: '+389 (North Macedonia)', value: '+389' },
    { label: '+39 (Italy)', value: '+39' },
    { label: '+40 (Romania)', value: '+40' },
    { label: '+41 (Switzerland)', value: '+41' },
    { label: '+420 (Czech Republic)', value: '+420' },
    { label: '+421 (Slovakia)', value: '+421' },
    { label: '+423 (Liechtenstein)', value: '+423' },
    { label: '+43 (Austria)', value: '+43' },
    { label: '+44 (United Kingdom)', value: '+44' },
    { label: '+44-1481 (Guernsey)', value: '+44-1481' },
    { label: '+44-1534 (Jersey)', value: '+44-1534' },
    { label: '+44-1624 (Isle of Man)', value: '+44-1624' },
    { label: '+45 (Denmark)', value: '+45' },
    { label: '+46 (Sweden)', value: '+46' },
    { label: '+47 (Norway)', value: '+47' },
    { label: '+48 (Poland)', value: '+48' },
    { label: '+49 (Germany)', value: '+49' },
    { label: '+500 (Falkland Islands)', value: '+500' },
    { label: '+501 (Belize)', value: '+501' },
    { label: '+502 (Guatemala)', value: '+502' },
    { label: '+503 (El Salvador)', value: '+503' },
    { label: '+504 (Honduras)', value: '+504' },
    { label: '+505 (Nicaragua)', value: '+505' },
    { label: '+506 (Costa Rica)', value: '+506' },
    { label: '+507 (Panama)', value: '+507' },
    { label: '+508 (Saint Pierre and Miquelon)', value: '+508' },
    { label: '+509 (Haiti)', value: '+509' },
    { label: '+51 (Peru)', value: '+51' },
    { label: '+52 (Mexico)', value: '+52' },
    { label: '+53 (Cuba)', value: '+53' },
    { label: '+54 (Argentina)', value: '+54' },
    { label: '+55 (Brazil)', value: '+55' },
    { label: '+56 (Chile)', value: '+56' },
    { label: '+57 (Colombia)', value: '+57' },
    { label: '+58 (Venezuela)', value: '+58' },
    { label: '+590 (Guadeloupe)', value: '+590' },
    { label: '+591 (Bolivia)', value: '+591' },
    { label: '+592 (Guyana)', value: '+592' },
    { label: '+593 (Ecuador)', value: '+593' },
    { label: '+594 (French Guiana)', value: '+594' },
    { label: '+595 (Paraguay)', value: '+595' },
    { label: '+596 (Martinique)', value: '+596' },
    { label: '+597 (Suriname)', value: '+597' },
    { label: '+598 (Uruguay)', value: '+598' },
    { label: '+599 (Netherlands Antilles)', value: '+599' },
    { label: '+60 (Malaysia)', value: '+60' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+62 (Indonesia)', value: '+62' },
    { label: '+63 (Philippines)', value: '+63' },
    { label: '+64 (New Zealand)', value: '+64' },
    { label: '+65 (Singapore)', value: '+65' },
    { label: 'Thailand (+66)', value: '+66' },
    { label: 'Timor-Leste (+670)', value: '+670' },
    { label: 'Australian External Territories (+672)', value: '+672' },
    { label: 'Brunei (+673)', value: '+673' },
    { label: 'Nauru (+674)', value: '+674' },
    { label: 'Papua New Guinea (+675)', value: '+675' },
    { label: 'Tonga (+676)', value: '+676' },
    { label: 'Solomon Islands (+677)', value: '+677' },
    { label: 'Vanuatu (+678)', value: '+678' },
    { label: 'Fiji (+679)', value: '+679' },
    { label: 'Palau (+680)', value: '+680' },
    { label: 'Wallis and Futuna (+681)', value: '+681' },
    { label: 'Cook Islands (+682)', value: '+682' },
    { label: 'Niue (+683)', value: '+683' },
    { label: 'Samoa (+685)', value: '+685' },
    { label: 'Kiribati (+686)', value: '+686' },
    { label: 'New Caledonia (+687)', value: '+687' },
    { label: 'Tuvalu (+688)', value: '+688' },
    { label: 'French Polynesia (+689)', value: '+689' },
    { label: 'Tokelau (+690)', value: '+690' },
    { label: 'Micronesia (+691)', value: '+691' },
    { label: 'Marshall Islands (+692)', value: '+692' },
    { label: 'Russia (+7)', value: '+7' },
    { label: 'Kazakhstan (+7)', value: '+7' },
    { label: 'Japan (+81)', value: '+81' },
    { label: 'South Korea (+82)', value: '+82' },
    { label: 'Vietnam (+84)', value: '+84' },
    { label: 'North Korea (+850)', value: '+850' },
    { label: 'Hong Kong (+852)', value: '+852' },
    { label: 'Macau (+853)', value: '+853' },
    { label: 'Cambodia (+855)', value: '+855' },
    { label: 'Laos (+856)', value: '+856' },
    { label: 'China (+86)', value: '+86' },
    { label: 'Bangladesh (+880)', value: '+880' },
    { label: 'Taiwan (+886)', value: '+886' },
    { label: 'Turkey (+90)', value: '+90' },
    { label: 'Maldives (+960)', value: '+960' },
    { label: 'Lebanon (+961)', value: '+961' },
    { label: 'Jordan (+962)', value: '+962' },
    { label: 'Syria (+963)', value: '+963' },
    { label: 'Iraq (+964)', value: '+964' },
    { label: 'Kuwait (+965)', value: '+965' },
    { label: 'Saudi Arabia (+966)', value: '+966' },
    { label: 'Yemen (+967)', value: '+967' },
    { label: 'Oman (+968)', value: '+968' },
    { label: 'Palestine (+970)', value: '+970' },
    { label: 'United Arab Emirates (+971)', value: '+971' },
    { label: 'Israel (+972)', value: '+972' },
    { label: 'Bahrain (+973)', value: '+973' },
    { label: 'Qatar (+974)', value: '+974' },
    { label: 'Bhutan (+975)', value: '+975' },
    { label: 'Mongolia (+976)', value: '+976' },
    { label: 'Nepal (+977)', value: '+977' },
    { label: 'Iran (+98)', value: '+98' },
    { label: 'Tajikistan (+992)', value: '+992' },
    { label: 'Turkmenistan (+993)', value: '+993' },
    { label: 'Azerbaijan (+994)', value: '+994' },
    { label: 'Georgia (+995)', value: '+995' },
    { label: 'Kyrgyzstan (+996)', value: '+996' },
    { label: 'Uzbekistan (+998)', value: '+998' },
  ];
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  defaultPickerValue = this.calculateDefaultPickerValue();
  calculateDefaultPickerValue(): Date {
    const today = new Date();
    return new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
  }
  disabledAfterDate = (current: Date): boolean => {
    if (!current) {
      return false;
    }
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return current > maxDate; 
  };
  CropImageModalVisible = false;
  isSpinningCrop = false;
  cropimageshow: any;
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
  imageCropped(event: any) {
    this.enhanceImageQuality(event.base64, 128, 128);
  }
  async enhanceImageQuality(
    base64: any,
    finalWidth: number,
    finalHeight: number
  ): Promise<void> {
    try {
      this.croppedImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = 'Anonymous'; 
        img.onload = async () => {
          await img.decode(); 
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) return reject('Canvas context not available');
          tempCanvas.width = img.width * 2; 
          tempCanvas.height = img.height * 2;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.fillStyle = 'white'; 
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          const downscaleCanvas = (
            sourceCanvas: HTMLCanvasElement,
            width: number,
            height: number
          ): HTMLCanvasElement => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            if (!newCtx) return sourceCanvas;
            newCanvas.width = width;
            newCanvas.height = height;
            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';
            newCtx.fillStyle = 'white'; 
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };
          let currentCanvas = tempCanvas;
          const downscaleSteps = [
            [Math.floor(img.width * 1.5), Math.floor(img.height * 1.5)], 
            [finalWidth * 2, finalHeight * 2], 
            [finalWidth, finalHeight], 
          ];
          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }
          resolve(currentCanvas.toDataURL('image/png', 1.0));
        };
        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
    }
  }
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const sizeInMB = blob.size / (1024 * 1024); 
        if (sizeInMB > 1 && quality > 0.1) {
          this.compressImage(canvas, quality - 0.1);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
          };
        }
      },
      'image/jpeg',
      quality
    ); 
  }
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 128, y2: 128 };
    }, 50);
    this.imagePreview = this.croppedImage;
    this.imageWidth = event.original.size.width;
    this.imageHeight = event.original.size.height;
  }
  cropperReady(event) {
  }
  loadImageFailed() {
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isOk = true;
    if (this.isOk && this.WEEK_DAY_DATA && this.WEEK_DAY_DATA.length > 0) {
      for (const day of this.WEEK_DAY_DATA) {
        if (!day.WEEK_DAY) {
          this.isOk = false;
          this.message.error(`Please Enter Day for ${day.WEEK_DAY}`, '');
          break;
        } else if (!day.DAY_START_TIME && day.IS_SERIVCE_AVAILABLE) {
          this.isOk = false;
          this.message.error(
            `Please Select Day Start Time for ${day.WEEK_DAY}`,
            ''
          );
          break;
        } else if (!day.DAY_END_TIME && day.IS_SERIVCE_AVAILABLE) {
          this.isOk = false;
          this.message.error(
            `Please Select Day End Time for ${day.WEEK_DAY}`,
            ''
          );
          break;
        } else if (!day.BREAK_START_TIME && day.IS_SERIVCE_AVAILABLE) {
          this.isOk = false;
          this.message.error(
            `Please Select Break Start Time for ${day.WEEK_DAY}`,
            ''
          );
          break;
        } else if (!day.BREAK_END_TIME && day.IS_SERIVCE_AVAILABLE) {
          this.isOk = false;
          this.message.error(
            `Please Select Break End Time for ${day.WEEK_DAY}`,
            ''
          );
          break;
        }
      }
    }
    this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');
    this.data.CONTRACT_START_DATE = this.datePipe.transform(
      this.data.CONTRACT_START_DATE,
      'yyyy-MM-dd'
    );
    this.data.CONTRACT_END_DATE = this.datePipe.transform(
      this.data.CONTRACT_END_DATE,
      'yyyy-MM-dd'
    );
    if (this.isOk) {
      if (!this.data.IS_OWN_VEHICLE) {
        this.data.VEHICLE_TYPE = null;
        this.data.VEHICLE_DETAILS = null;
        this.data.VEHICLE_NO = null;
      }
      this.isSpinning = true;
      if (this.data.TYPE === 'F') {
        this.data.CONTRACT_START_DATE = this.data.CONTRACT_START_DATE;
        this.data.CONTRACT_END_DATE = this.data.CONTRACT_END_DATE;
      } else {
        this.data.CONTRACT_START_DATE = null;
        this.data.CONTRACT_END_DATE = null;
      }
      if (this.data.TYPE === 'V') {
        this.data.VENDOR_ID = this.data.VENDOR_ID;
      } else {
        this.data.VENDOR_ID = null;
        this.data.VENDOR_NAME = null;
      }
      const dayMapping = {
        Monday: 'Mo',
        Tuesday: 'Tu',
        Wednesday: 'We',
        Thursday: 'Th',
        Friday: 'Fr',
        Saturday: 'Sa',
        Sunday: 'Su',
      };
      const transformedData = this.WEEK_DAY_DATA.map((item) => {
        if (item.IS_SERIVCE_AVAILABLE) {
          return {
            IS_SERIVCE_AVAILABLE: item.IS_SERIVCE_AVAILABLE,
            WEEK_DAY: dayMapping[item.WEEK_DAY],
            DAY_START_TIME: this.datePipe.transform(
              item.DAY_START_TIME,
              'HH:mm:00'
            ),
            DAY_END_TIME: this.datePipe.transform(
              item.DAY_END_TIME,
              'HH:mm:00'
            ),
            BREAK_START_TIME: this.datePipe.transform(
              item.BREAK_START_TIME,
              'HH:mm:00'
            ),
            BREAK_END_TIME: this.datePipe.transform(
              item.BREAK_END_TIME,
              'HH:mm:00'
            ),
          };
        } else {
          return {
            IS_SERIVCE_AVAILABLE: item.IS_SERIVCE_AVAILABLE,
            WEEK_DAY: dayMapping[item.WEEK_DAY],
            DAY_START_TIME: null,
            DAY_END_TIME: null,
            BREAK_START_TIME: null,
            BREAK_END_TIME: null,
          };
        }
      });
      if (this.fileURL) {
        this.data.WEEK_DAY_DATA = transformedData;
        this.data.ORG_ID = 1
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = `${d ?? ''}${number}.${fileExt}`;
        const uploadedfileExt = this.uploadedImage.split('.').pop();
        if (this.data.ID) {
          if (uploadedfileExt == fileExt) {
            this.UrlImageOne = this.uploadedImage;
          } else {
            this.UrlImageOne = url;
          }
        } else {
          this.UrlImageOne = url;
        }
        this.api
          .onUpload('TechnicianProfile', this.fileURL, this.UrlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response && res.status === 200) {
              this.data.PROFILE_PHOTO = this.UrlImageOne;
              this.handleSaveOperation(addNew, websitebannerPage);
            } else if (res.type === HttpEventType.Response) {
              this.message.error('Failed to Upload Profile Photo.', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.data.WEEK_DAY_DATA = transformedData;
        this.data.ORG_ID = 1
        this.handleSaveOperation(addNew, websitebannerPage);
      }
    }
  }
  createChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      USER_ID: this.data['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.data['NAME'],
      TYPE: 'T',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.api.createChannels(data).subscribe(
      (successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  updateChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      OLD_CHANNEL_NAME: this.pincodeChannelOld,
      USER_ID: this.data['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.data['NAME'],
      TYPE: 'T',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.api.updateChannels(data).subscribe(
      (successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  handleSaveOperation(addNew: boolean, websitebannerPage: NgForm): void {
    if (this.data.ID) {
      if (this.data.TYPE === this.data.OLD_TYPE) {
        this.data.OLD_TYPE = null;
      }
      this.api.updateTechnicianData(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Technician Data Updated Successfully', '');
            this.updateChannelData();
            if (!addNew) this.drawerClose();
            this.Disabled = false;
            this.selectedTab = 1;
            this.isSpinning = false;
          } else if (successCode.code == 300) {
            var msg = successCode.message;
            this.message.error(msg, '');
            this.isSpinning = false;
          } else {
            this.message.error('Technician Data Updation Failed', '');
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
      this.data.CREATED_DATE = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
      this.data.TECHNICIAN_STATUS = Number(1);
      this.data.OLD_TYPE = null;
      this.api.createTechnicianData(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Technician Data Created Successfully', '');
            if (!addNew) {
              this.drawerClose();
              this.Disabled = false;
              this.selectedTab = 1;
            } else {
              this.data = new TechnicianMasterData();
              this.resetDrawer(websitebannerPage);
              this.activeTabIndex = 0;
            }
            this.isSpinning = false;
          } else if (successCode.code == 300) {
            var msg = successCode.message;
            this.message.error(msg, '');
            this.isSpinning = false;
          } else {
            this.message.error('Technician Data Creation Failed...', '');
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
    }
  }
  close() {
    this.drawerClose();
  }
  CityData: any = [];
  PincodeData: any = [];
  StateData: any = [];
  DistrictData: any = [];
  CountryData: any = [];
  getallCountry() {
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.CountryData = data['data'];
          } else {
            this.CountryData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  getStatesByCountry(countryId: any, value: boolean = true) {
    this.isStateSpinning = true;
    if (value == false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.StateData = [];
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.StateData = [];
            this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
  }
  getDistrictByState(stateId: any, value: boolean = true) {
    this.isDistrictSpinning = true;
    if (value == false) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND STATE_ID=' + stateId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DistrictData = data['data'];
            this.isDistrictSpinning = false;
          } else {
            this.DistrictData = [];
            this.message.error('Failed To Get District Data...', '');
            this.isDistrictSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  getStateandPincode(districtId: number, value: boolean = true) {
    if (value == false) {
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.CityData = [];
      this.PincodeData = [];
    }
    this.getPincodesByCity(districtId, value);
  }
  Filterss: any = {};
  logfilt: any;
  filterdata1: any;
  pincodeChannel: any = '';
  pincodeChannelOld: any = '';
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
        this.pincodeChannel = 'pincode_' + pin[0]['ID'] + '_channel';
        if (this.pincodeChannelOld === '' || this.pincodeChannelOld === null) {
          this.pincodeChannelOld = 'pincode_' + pin[0]['ID'] + '_channel';
        } else {
          this.pincodeChannelOld = this.pincodeChannelOld;
        }
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }
  getPincodesByCity(districtId: number, value: boolean = true) {
    if (value === false) {
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(
        0,
        0,
        '',
        'asc',
        ` AND IS_ACTIVE = 1 AND DISTRICT=${districtId} `
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);
            if (this.data.ID) {
              this.getpincodename(this.data.PINCODE_ID);
            }
          } else {
            this.PincodeData = [];
            this.message.error('Failed To Get Pincode Data...', '');
          }
          this.isPincodeSpinning = false; 
        },
        () => {
          this.message.error('Something went wrong.', '');
          this.isPincodeSpinning = false; 
        }
      );
  }
  VenderData: any[] = [];
  getallVendors() {
    this.api.getVendorData(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] === 200) {
          this.VenderData = data['data'];
        } else {
          this.VenderData = [];
          this.message.error('Failed To Vendor Data...', '');
        }
      },
      () => {
        this.message.error('Something went wrong.', '');
      }
    );
  }
  onStartDateChange(startDate: Date | null): void {
    if (this.data.CONTRACT_END_DATE && startDate) {
      const start = new Date(startDate);
      const end = new Date(this.data.CONTRACT_END_DATE);
      if (end < start) {
        this.data.CONTRACT_END_DATE = null;
      }
    }
  }
  activeTabIndex: number = 0;
  tabs = [
    {
      name: 'Technician Details',
      disabled: false,
    },
    {
      name: 'Availability Calender Details',
      disabled: true,
    },
  ];
  next() {
    this.isOk = true;
    if (
      (this.data.TYPE == null || this.data.TYPE == undefined) &&
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.EMAIL_ID.trim() == '' ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined) &&
      (this.data.MOBILE_NUMBER == undefined ||
        this.data.MOBILE_NUMBER == null ||
        this.data.MOBILE_NUMBER == 0) &&
      (this.data.COUNTRY_CODE == null ||
        this.data.COUNTRY_CODE == undefined ||
        this.data.COUNTRY_CODE == 0) &&
      (this.data.DOB == undefined ||
        this.data.DOB == null ||
        this.data.DOB == 0) &&
      (this.data.GENDER == null || this.data.GENDER == undefined) &&
      (this.data.AADHAR_NUMBER == null ||
        this.data.AADHAR_NUMBER == undefined) &&
      (this.data.EXPERIENCE_LEVEL == undefined ||
        this.data.EXPERIENCE_LEVEL == null ||
        this.data.EXPERIENCE_LEVEL == 0) &&
      (this.data.ADDRESS_LINE1.trim() == '' ||
        this.data.ADDRESS_LINE1 == null ||
        this.data.ADDRESS_LINE1 == undefined) &&
      (this.data.COUNTRY_ID == undefined ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == 0) &&
      (this.data.STATE_ID == null ||
        this.data.STATE_ID == undefined ||
        this.data.STATE_ID == 0) &&
      (this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == 0) &&
      (this.data.PINCODE_ID == undefined ||
        this.data.PINCODE_ID == null ||
        this.data.PINCODE_ID == 0) &&
      (this.data.HOME_LATTITUDE == null ||
        this.data.HOME_LATTITUDE == undefined ||
        this.data.HOME_LATTITUDE == 0) &&
      (this.data.HOME_LONGITUDE == null ||
        this.data.HOME_LONGITUDE == undefined ||
        this.data.HOME_LONGITUDE == 0) &&
      (this.data.VEHICLE_TYPE == undefined ||
        this.data.VEHICLE_TYPE == null ||
        this.data.VEHICLE_TYPE == 0) &&
      (this.data.VEHICLE_DETAILS == undefined ||
        this.data.VEHICLE_DETAILS == null ||
        this.data.VEHICLE_DETAILS == 0) &&
      (this.data.VEHICLE_NO == undefined ||
        this.data.VEHICLE_NO == null ||
        this.data.VEHICLE_NO == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Technician Name', '');
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email ID', '');
    } else if (
      this.data.EMAIL_ID != null &&
      this.data.EMAIL_ID != undefined &&
      !this.emailpattern.test(this.data.EMAIL_ID)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email. ', '');
    } else if (
      this.data.COUNTRY_CODE == null ||
      this.data.COUNTRY_CODE == undefined ||
      this.data.COUNTRY_CODE == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Country Code.', '');
    } else if (
      this.data.MOBILE_NUMBER == null ||
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile No.', '');
    } else if (
      this.data.MOBILE_NUMBER != null &&
      this.data.MOBILE_NUMBER != undefined &&
      this.data.MOBILE_NUMBER != 0 &&
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile No. ', '');
    } else if (this.data.GENDER == null || this.data.GENDER == undefined) {
      this.isOk = false;
      this.message.error(' Please Select Gender', '');
    } else if (this.data.DOB == undefined || this.data.DOB == null) {
      this.isOk = false;
      this.message.error('Please Select a Valid Date of Birth', '');
    } else if (
      this.data.AADHAR_NUMBER == null ||
      this.data.AADHAR_NUMBER == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Aadhaar No', '');
    } else if (
      this.data.AADHAR_NUMBER != null &&
      this.data.AADHAR_NUMBER != undefined &&
      this.data.AADHAR_NUMBER != 0 &&
      !this.commonFunction.aadharpattern.test(this.data.AADHAR_NUMBER)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Aadhaar No. ', '');
    } else if (
      this.data.EXPERIENCE_LEVEL == null ||
      this.data.EXPERIENCE_LEVEL == undefined ||
      this.data.EXPERIENCE_LEVEL == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Experience Level', '');
    } else if (
      this.data.TYPE === 'V' &&
      (this.data.VENDOR_ID == null ||
        this.data.VENDOR_ID == undefined ||
        this.data.VENDOR_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Vender Name', '');
    } else if (
      this.data.TYPE === 'F' &&
      (this.data.CONTRACT_START_DATE == null ||
        this.data.CONTRACT_START_DATE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Select Contract Start Date', '');
    } else if (
      this.data.TYPE === 'F' &&
      (this.data.CONTRACT_END_DATE == undefined ||
        this.data.CONTRACT_END_DATE == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Contract End Date', '');
    } else if (
      this.data.HOME_LATTITUDE == null ||
      this.data.HOME_LATTITUDE == undefined ||
      this.data.HOME_LATTITUDE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Latitude', '');
    } else if (
      this.data.HOME_LONGITUDE == null ||
      this.data.HOME_LONGITUDE == undefined ||
      this.data.HOME_LONGITUDE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Longitude', '');
    } else if (
      this.data.ADDRESS_LINE1 == null ||
      this.data.ADDRESS_LINE1 == undefined ||
      this.data.ADDRESS_LINE1.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Address', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.STATE_ID == null ||
      this.data.STATE_ID == undefined ||
      this.data.STATE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select District', '');
    } else if (
      this.data.DISTRICT_ID == null ||
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    }
    else if (
      this.data.PINCODE_ID == null ||
      this.data.PINCODE_ID == undefined ||
      this.data.PINCODE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Pincode', '');
    } else if (
      this.data['IS_OWN_VEHICLE'] &&
      (this.data.VEHICLE_TYPE == null ||
        this.data.VEHICLE_TYPE == undefined ||
        this.data.VEHICLE_TYPE == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Vehicle Type', '');
    } else if (
      this.data['IS_OWN_VEHICLE'] &&
      (this.data.VEHICLE_NO == null ||
        this.data.VEHICLE_NO == undefined ||
        this.data.VEHICLE_NO.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Vehicle No.', '');
    } else if (
      this.data['IS_OWN_VEHICLE'] &&
      (this.data.VEHICLE_DETAILS == null ||
        this.data.VEHICLE_DETAILS.trim() === '' ||
        this.data.VEHICLE_DETAILS == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Vehicle Details', '');
    }
    if (this.isOk) {
      this.loadNext = true;
      this.api
        .checkEmailTech(
          this.data.EMAIL_ID,
          this.data.MOBILE_NUMBER,
          this.data.ID ? this.data.ID : 0,
          this.data.ID ? 'U' : 'C'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadNext = false;
              this.activeTabIndex = 1;
            } else {
              this.loadNext = false;
              this.message.error(data['message'], '');
            }
          },
          (err) => {
            this.loadNext = false;
          }
        );
    }
  }
  loadNext: boolean = false;
  back() {
    this.activeTabIndex = 0;
  }
  mapandclose() { }
  weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  WEEK_DAY_DATA: any[] = [];
  populateWeeklySchedule(): void {
    const dayMap: { [key: string]: string } = {
      M: 'Monday',
      T: 'Tuesday',
      W: 'Wednesday',
      Th: 'Thursday',
      F: 'Friday',
      S: 'Saturday',
      Su: 'Sunday',
    };
  }
  convertToDate(time: any): Date | null {
    if (time instanceof Date) return time; 
    if (typeof time !== 'string' || !time) return null;
    const timeParts = time.split(':');
    if (timeParts.length === 3) {
      const [hours, minutes, seconds] = timeParts.map((part) =>
        parseInt(part, 10)
      );
      const date = new Date();
      date.setHours(hours, minutes, seconds, 0);
      return date;
    }
    return null;
  }
  day_start_time: any;
  day_end_time: any;
  getOrganizationData() {
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              this.day_start_time = data['body']['data'][0].DAY_START_TIME;
            }
            if (data['body']['data'][0].DAY_END_TIME) {
              this.day_end_time = data['body']['data'][0].DAY_END_TIME;
            }
          }
        }
      });
  }
  disableStartTime = (): number[] => {
    let startHour = Number(this.day_start_time?.split(':')[0]);
    let endHour = Number(this.day_end_time?.split(':')[0]);
    return Array.from({ length: 24 }, (_, h) => h).filter(
      (h) => h < startHour || h > endHour
    );
  };
  disableStartMinutes = (hour: number): number[] => {
    if (this.day_start_time && this.day_end_time) {
      let [startHour, startMinute] = this.day_start_time
        ?.split(':')
        .map(Number);
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
  index = -1;
  setIndex(i) {
    this.index = i;
  }
  disableEndHours = (): number[] => {
    let startHour = Number(this.day_start_time?.split(':')[0]);
    let endHour = Number(this.day_end_time?.split(':')[0]);
    const startTime = new Date(this.data.DAY_START_TIME);
    const starttimeHour = startTime.getHours();
    if (starttimeHour) {
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < starttimeHour || h > endHour
      );
    } else {
      return Array.from({ length: 24 }, (_, h) => h).filter(
        (h) => h < startHour || h > endHour
      );
    }
  };
  disableEndMinutes = (hour: number): number[] => {
    var disabledMinutes: number[] = [];
    const endHour = Number(this.day_end_time?.split(':')[0]);
    const endMinute = Number(this.day_end_time?.split(':')[1]);
    const minuteStep = 10; 
    const allMinutes = Array.from(
      { length: 60 / minuteStep },
      (_, i) => i * minuteStep
    );
    var selectedStartHour: any;
    var selectedStartMinute: any;
    selectedStartHour = this.extractHour(
      this.WEEK_DAY_DATA[this.index]?.DAY_START_TIME
    );
    selectedStartMinute = this.extractMinute(
      this.WEEK_DAY_DATA[this.index]?.DAY_START_TIME
    );
    if (hour === selectedStartHour) {
      return allMinutes.filter((m) => m <= selectedStartMinute);
    } else if (hour === endHour) {
      return allMinutes.filter((m) => m > endMinute);
    }
    return disabledMinutes;
  };
  extractHour(time: any): number {
    if (typeof time === 'string') {
      return Number(time.split(':')[0]);
    } else if (time instanceof Date) {
      return time.getHours();
    } else if (typeof time === 'number') {
      const timeStr = time.toString().padStart(4, '0');
      return Number(timeStr.substring(0, 2));
    }
    return 0;
  }
  extractMinute(time: any): number {
    if (typeof time === 'string') {
      return Number(time.split(':')[1]);
    } else if (time instanceof Date) {
      return time.getMinutes();
    } else if (typeof time === 'number') {
      const timeStr = time.toString().padStart(4, '0');
      return Number(timeStr.substring(2, 4));
    }
    return 0;
  }
  updateStartTime(value: any, index: number): void {
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
    this.data.DAY_START_TIME = date.toISOString();
    const selectedTime = new Date(value);
    const roundedDate = this.roundMinutesToNearestInterval(selectedTime);
    this.WEEK_DAY_DATA[index].DAY_START_TIME = new Date(roundedDate);
    if (this.WEEK_DAY_DATA[index].DAY_END_TIME) {
      const breakStartDate = new Date(this.WEEK_DAY_DATA[index].DAY_END_TIME);
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes < startTotalMinutes) {
        this.WEEK_DAY_DATA[index].DAY_END_TIME = null;
      }
    }
    if (this.WEEK_DAY_DATA[index].BREAK_START_TIME) {
      const breakStartDate = new Date(
        this.WEEK_DAY_DATA[index].BREAK_START_TIME
      );
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes < startTotalMinutes) {
        this.WEEK_DAY_DATA[index].BREAK_START_TIME = null;
      }
    }
    if (this.WEEK_DAY_DATA[index].BREAK_END_TIME) {
      const breakStartDate = new Date(this.WEEK_DAY_DATA[index].BREAK_END_TIME);
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes < startTotalMinutes) {
        this.WEEK_DAY_DATA[index].BREAK_END_TIME = null;
      }
    }
  }
  updateEndTime(value: any, index: number): void {
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
    this.data.DAY_END_TIME = date.toISOString();
    const selectedTime = new Date(value);
    const roundedDate = this.roundMinutesToNearestInterval(selectedTime);
    this.WEEK_DAY_DATA[index].DAY_END_TIME = new Date(roundedDate);
    if (this.WEEK_DAY_DATA[index].BREAK_START_TIME) {
      const breakStartDate = new Date(
        this.WEEK_DAY_DATA[index].BREAK_START_TIME
      );
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes > startTotalMinutes) {
        this.WEEK_DAY_DATA[index].BREAK_START_TIME = null;
      }
    }
    if (this.WEEK_DAY_DATA[index].BREAK_END_TIME) {
      const breakStartDate = new Date(this.WEEK_DAY_DATA[index].BREAK_END_TIME);
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes > startTotalMinutes) {
        this.WEEK_DAY_DATA[index].BREAK_END_TIME = null;
      }
    }
  }
  disableBreakEndHours = (): number[] => {
    const disabledHours: number[] = [];
    const breakStartTime = this.data.BREAK_START_TIME
      ? new Date(this.data.BREAK_START_TIME)
      : null;
    const dayEndTime = this.data.DAY_END_TIME
      ? new Date(this.data.DAY_END_TIME)
      : null;
    const breakStartHour = breakStartTime
      ? breakStartTime.getHours()
      : this.orgStartHour;
    const dayEndHour = dayEndTime ? dayEndTime.getHours() : this.orgEndHour;
    for (let hour = 0; hour < 24; hour++) {
      if (hour < breakStartHour || hour > dayEndHour) {
        disabledHours.push(hour);
      }
    }
    return disabledHours;
  };
  disableBreakEndMinutes = (hour: number): number[] => {
    const disabledMinutes: number[] = [];
    const breakStartTime = this.data.BREAK_START_TIME
      ? new Date(this.data.BREAK_START_TIME)
      : null;
    const dayEndTime = this.data.DAY_END_TIME
      ? new Date(this.data.DAY_END_TIME)
      : null;
    const breakStartMinute = breakStartTime
      ? breakStartTime.getMinutes()
      : this.orgStartMinute;
    const dayEndMinute = dayEndTime
      ? dayEndTime.getMinutes()
      : this.orgEndMinute;
    if (breakStartTime && hour === breakStartTime.getHours()) {
      for (let minute = 0; minute < 60; minute++) {
        if (minute <= breakStartMinute) {
          disabledMinutes.push(minute);
        }
      }
    }
    if (dayEndTime && hour === dayEndTime.getHours()) {
      for (let minute = 0; minute < 60; minute++) {
        if (minute > dayEndMinute) {
          disabledMinutes.push(minute);
        }
      }
    }
    return disabledMinutes;
  };
  updateBreakStartTime(value: any, index: number): void {
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
    this.data.BREAK_START_TIME = date.toISOString();
    const selectedTime = new Date(value);
    const roundedDate = this.roundMinutesToNearestInterval(selectedTime);
    this.WEEK_DAY_DATA[index].BREAK_START_TIME = new Date(roundedDate);
    if (this.WEEK_DAY_DATA[index].BREAK_END_TIME) {
      const breakStartDate = new Date(this.WEEK_DAY_DATA[index].BREAK_END_TIME);
      const breakStartHours = breakStartDate.getHours();
      const breakStartMinutes = breakStartDate.getMinutes();
      const breakStartTotalMinutes = breakStartHours * 60 + breakStartMinutes;
      const startTotalMinutes = hours * 60 + minutes; 
      if (breakStartTotalMinutes < startTotalMinutes) {
        this.WEEK_DAY_DATA[index].BREAK_END_TIME = null;
      }
    }
  }
  updateBreakEndTime(value: any, index: number): void {
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
    this.data.BREAK_END_TIME = date.toISOString();
    const selectedTime = new Date(value);
    const roundedDate = this.roundMinutesToNearestInterval(selectedTime);
    this.WEEK_DAY_DATA[index].BREAK_END_TIME = new Date(roundedDate);
  }
  disableBreakStartHours = (): number[] => {
    const disabledHours: number[] = [];
    const dayStartTime = this.data.DAY_START_TIME
      ? new Date(this.data.DAY_START_TIME)
      : null;
    const dayEndTime = this.data.DAY_END_TIME
      ? new Date(this.data.DAY_END_TIME)
      : null;
    const startHour = dayStartTime
      ? dayStartTime.getHours()
      : this.orgStartHour;
    const endHour = dayEndTime ? dayEndTime.getHours() : this.orgEndHour;
    for (let hour = 0; hour < 24; hour++) {
      if (hour < startHour || hour > endHour) {
        disabledHours.push(hour);
      }
    }
    return disabledHours;
  };
  disableBreakStartMinutes = (hour: number): number[] => {
    const disabledMinutes: number[] = [];
    const dayStartTime = this.data.DAY_START_TIME
      ? new Date(this.data.DAY_START_TIME)
      : null;
    const dayEndTime = this.data.DAY_END_TIME
      ? new Date(this.data.DAY_END_TIME)
      : null;
    const startMinute = dayStartTime
      ? dayStartTime.getMinutes()
      : this.orgStartMinute;
    const endMinute = dayEndTime ? dayEndTime.getMinutes() : this.orgEndMinute;
    if (dayStartTime && hour === dayStartTime.getHours()) {
      for (let minute = 0; minute < 60; minute++) {
        if (minute < startMinute) {
          disabledMinutes.push(minute);
        }
      }
    }
    if (dayEndTime && hour === dayEndTime.getHours()) {
      for (let minute = 0; minute < 60; minute++) {
        if (minute > endMinute) {
          disabledMinutes.push(minute);
        }
      }
    }
    return disabledMinutes;
  };
  disableStartHoursbulk: () => number[] = () => [];
  disableStartMinutesbulk: (hour: number) => number[] = () => [];
  disableEndHoursbulk: () => number[] = () => [];
  disableEndMinutesbulk: (hour: number) => number[] = () => [];
  disablebreakStartHoursbulk: () => number[] = () => [];
  disablebreakStartMinutesbulk: (hour: number) => number[] = () => [];
  disablebreakEndHoursbulk: () => number[] = () => [];
  disablebreakEndMinutesbulk: (hour: number) => number[] = () => [];
  orgStartHour: any = 0;
  orgStartMinute: any = 0;
  orgEndHour: any = 23;
  orgEndMinute: any = 59;
  getorgData() {
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              const startParts =
                data['body']['data'][0].DAY_START_TIME.split(':');
              this.orgStartHour = +startParts[0];
              this.orgStartMinute = +startParts[1];
              if (!this.data.ID) {
                this.StartDate = new Date().setHours(
                  this.orgStartHour,
                  this.orgStartMinute,
                  0
                );
              }
            }
            if (data['body']['data'][0].DAY_END_TIME) {
              const endParts = data['body']['data'][0].DAY_END_TIME.split(':');
              this.orgEndHour = +endParts[0];
              this.orgEndMinute = +endParts[1];
              if (!this.data.ID) {
                this.StartDate1 = new Date().setHours(
                  this.orgEndHour,
                  this.orgEndMinute,
                  0
                );
              }
            }
            this.initializeTimeRestrictions();
            if (data['body'].count > 0 && !this.data.ID) {
              if (
                data['body']['data'][0].DAY_START_TIME != undefined &&
                data['body']['data'][0].DAY_START_TIME != null &&
                data['body']['data'][0].DAY_START_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_START_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.StartDate = new Date(today);
                }
              }
              if (
                data['body']['data'][0].DAY_END_TIME != undefined &&
                data['body']['data'][0].DAY_END_TIME != null &&
                data['body']['data'][0].DAY_END_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_END_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.StartDate1 = new Date(today);
                }
              }
            }
          }
        }
      });
  }
  initializeTimeRestrictions() {
    this.disableStartHoursbulk = () =>
      Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < this.orgStartHour || hour > this.orgEndHour
      );
    this.disableStartMinutesbulk = (hour: number) =>
      hour === this.orgStartHour
        ? Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute < this.orgStartMinute
        )
        : hour === this.orgEndHour
          ? Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute > this.orgEndMinute
          )
          : [];
    this.disableEndHoursbulk = () => {
      const startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour || hour > this.orgEndHour
      );
    };
    this.disableEndMinutesbulk = (hour: number) => {
      const startHour = this.getStartHour();
      const startMinute = this.getStartMinute();
      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
    this.disablebreakStartHoursbulk = () => {
      const startHour = this.getStartHour();
      const endHour = this.getEndHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour || hour > endHour
      );
    };
    this.disablebreakStartMinutesbulk = (hour: number) => {
      const breakStartHour = this.getEndHour();
      const breakStartMinute = this.getEndMinute();
      const dayStarthour = this.getStartHour();
      const dayStartminute = this.getStartMinute();
      const dayendhour = this.getEndHour();
      const dayendminute = this.getEndMinute();
      if (hour === breakStartHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= breakStartMinute
        );
      } else if (hour === dayStarthour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= dayStartminute
        );
      } else if (hour === dayendhour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > dayendminute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
    this.disablebreakEndHoursbulk = () => {
      const endHour = this.getEndHour();
      const breakStartHour = this.getBreakStartHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < breakStartHour || hour > endHour
      );
    };
    this.disablebreakEndMinutesbulk = (hour: number) => {
      const breakStartHour = this.getBreakStartHour();
      const breakStartMinute = this.getBreakStartMinute();
      const dayendhour = this.getEndHour();
      const dayendminute = this.getEndMinute();
      if (hour === breakStartHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= breakStartMinute
        );
      } else if (hour === dayendhour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > dayendminute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
  }
  getStartHour() {
    return this.StartDate
      ? new Date(this.StartDate).getHours()
      : this.orgStartHour;
  }
  getStartMinute() {
    return this.StartDate
      ? new Date(this.StartDate).getMinutes()
      : this.orgStartMinute;
  }
  getEndHour() {
    return this.StartDate1
      ? new Date(this.StartDate1).getHours()
      : this.orgEndHour;
  }
  getEndMinute() {
    return this.StartDate1
      ? new Date(this.StartDate1).getMinutes()
      : this.orgEndMinute;
  }
  getBreakStartHour() {
    return this.StartDate2
      ? new Date(this.StartDate2).getHours()
      : this.orgStartHour;
  }
  getBreakStartMinute() {
    return this.StartDate2
      ? new Date(this.StartDate2).getMinutes()
      : this.orgStartMinute;
  }
  onStartTimeChange1() {
    const selectedTime = new Date(this.StartDate);
    this.StartDate = this.roundMinutesToNearestInterval(selectedTime);
    this.initializeTimeRestrictions();
  }
  onendTimeChange1() {
    const selectedTime = new Date(this.StartDate1);
    this.StartDate1 = this.roundMinutesToNearestInterval(selectedTime);
    this.initializeTimeRestrictions();
  }
  onBreakStartTimeChange() {
    const selectedTime = new Date(this.StartDate2);
    this.StartDate2 = this.roundMinutesToNearestInterval(selectedTime);
    this.initializeTimeRestrictions();
  }
  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';
  selectedLocation: any;
  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  map2: any;
  map: any;
  varm: any;
  address1: any;
  noaddress: boolean = false;
  nolandmark: boolean = false;
  address2: any;
  citySearch: any = ''
  stateSearch: any = ''
  countrySearch: any = ''
  locality1Search: any = ''
  locality2Search: any = ''
  buildingSearch: any = ''
  landmarkSearch: any = ''
  building1Search: any = ''
  postcodeSearch: any = ''
  districtSearch: any = '';
  street_number: any = '';
  subpremise: any = '';
  floor: any = '';
  placeName: any = ''
  closemapModal() {
    this.mapDraweVisible = false;
    if (this.countrySearch !== '' && this.countrySearch !== undefined && this.countrySearch !== null) {
      this.StateDataValues(this.countrySearch, this.stateSearch, this.postcodeSearch, this.districtSearch)
    }
  }
  openmapModal() {
    if (
      !this.data.ADDRESS_LINE1 ||
      this.data.ADDRESS_LINE1 == '' ||
      this.data.ADDRESS_LINE1 == null ||
      this.data.ADDRESS_LINE1 == undefined
    ) {
      this.noaddress = true;
    } else if (this.address1) {
      this.noaddress = false;
    }
    let addressParts: any = [];
    if (this.data.COUNTRY_ID) {
      let country = this.CountryData.find(
        (c) => c.ID === this.data.COUNTRY_ID
      )?.NAME;
      if (country) addressParts.push(country);
    }
    if (this.data.STATE_ID) {
      let state = this.StateData.find((s) => s.ID === this.data.STATE_ID)?.NAME;
      if (state) addressParts.push(state);
    }
    if (this.data.DISTRICT_ID) {
      let district = this.DistrictData.find(
        (d) => d.ID === this.data.DISTRICT_ID
      )?.NAME;
      if (district) addressParts.push(district);
    }
    if (this.data.PINCODE) {
      addressParts.push(this.data.PINCODE);
    }
    if (this.data.ADDRESS_LINE1) {
      addressParts.push(this.data.ADDRESS_LINE1);
    }
    if (this.data.ADDRESS_LINE2) {
      addressParts.push(this.data.ADDRESS_LINE2);
    }
    if (Number(this.data.HOME_LATTITUDE) && Number(this.data.HOME_LATTITUDE)) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    if ((Number(this.data.HOME_LATTITUDE) && Number(this.data.HOME_LONGITUDE)) ||
      (this.data.PINCODE !== null && this.data.PINCODE !== undefined && this.data.PINCODE !== '') ||
      (this.data.ADDRESS_LINE1 !== null && this.data.ADDRESS_LINE1 !== undefined && this.data.ADDRESS_LINE1 !== '') ||
      (this.data.ADDRESS_LINE2 !== null && this.data.ADDRESS_LINE2 !== undefined && this.data.ADDRESS_LINE2 !== '') ||
      (this.data.COUNTRY_ID !== null && this.data.COUNTRY_ID !== undefined && this.data.COUNTRY_ID !== '')) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    this.mapDraweVisible = true;
    setTimeout(() => {
      const searchBox = document.getElementById(
        'searchBox'
      ) as HTMLInputElement;
      if (searchBox) {
        if (this.selectedLocation !== '' && this.selectedLocation !== null && this.selectedLocation !== undefined) {
          searchBox.value = this.selectedLocation || '';
        } else {
          searchBox.value = '';
        }
        this.handleSearch({ target: { value: this.selectedLocation } });
      }
    }, 100);
    if (!this.data.COUNTRY_ID) {
      this.data.HOME_LATTITUDE = Number(this.data.HOME_LATTITUDE);
      this.data.HOME_LONGITUDE = Number(this.data.HOME_LONGITUDE);
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
    if (this.data.ID) {
      this.data.HOME_LATTITUDE = this.data.HOME_LATTITUDE;
      this.data.HOME_LONGITUDE = this.data.HOME_LONGITUDE;
      if (this.data.HOME_LATTITUDE && this.data.HOME_LONGITUDE) {
        this.selectedLocation = '';
      }
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
  }
  loadMap() {
    const map2Element = document.getElementById('map');
    if (!map2Element) return;
    const lat = Number(this.data.HOME_LATTITUDE) || 20.5937;
    const lng = Number(this.data.HOME_LONGITUDE) || 78.9629;
    this.map2 = new google.maps.Map(map2Element, {
      center: { lat, lng },
      zoom: this.data.HOME_LATTITUDE && this.data.HOME_LONGITUDE ? 14 : 5,
    });
    if (!isNaN(lat) && !isNaN(lng)) {
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      this.getAddress(lat, lng);
    }
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (!input) return;
    const searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;
      const place = places[0];
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;
      this.placeName = place?.name;
      var formattedaddress: any = ''
      formattedaddress = place?.formatted_address || '';
      this.selectedLocation = formattedaddress;
      this.map2.setCenter({ lat, lng });
      setTimeout(() => {
        this.map2.setZoom(19); 
      }, 100);
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      this.getAddress(lat, lng, place);
    });
    this.map2.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      this.getAddress(lat, lng);
    });
  }
  handleSearch(event: any) {
    const query = event.target.value;
    let lat = this.data.HOME_LATTITUDE
      ? parseFloat(this.data.HOME_LATTITUDE)
      : 18.5204;
    let lng = this.data.HOME_LONGITUDE
      ? parseFloat(this.data.HOME_LONGITUDE)
      : 73.8567;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.data.HOME_LATTITUDE && this.data.HOME_LONGITUDE ? 14 : 5,
    });
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
    });
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        this.placeName = place?.name || '';
        this.getAddress(lat, lng, place); 
        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); 
        }, 100);
        this.marker.setPosition(place.geometry.location);
      });
    }
    if (query !== null && query !== undefined && query !== '') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          lat = location.lat();
          lng = location.lng();
          this.getAddress(lat, lng, null);
          this.map2.setCenter(location);
          setTimeout(() => {
            this.map2.setZoom(19); 
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }
    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails({ placeId: placeId }, (placeResult, placeStatus) => {
            if (placeStatus === 'OK' && placeResult) {
              this.placeName = placeResult.name || ''; 
              this.getAddress(lat, lng, placeResult);  
            } else {
              this.getAddress(lat, lng, null);
            }
          });
        } else {
          console.warn('Geocoder failed:', status);
          this.getAddress(lat, lng, null);
        }
      });
    });
  }
  handleSearch1(event: any) {
    const query = event.target.value;
    let lat = this.data.HOME_LATTITUDE
      ? parseFloat(this.data.HOME_LATTITUDE)
      : 18.5204;
    let lng = this.data.HOME_LONGITUDE
      ? parseFloat(this.data.HOME_LONGITUDE)
      : 73.8567;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.data.HOME_LATTITUDE && this.data.HOME_LONGITUDE ? 14 : 5,
    });
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
    });
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        this.placeName = place?.name || '';
        this.getAddress(lat, lng, place); 
        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); 
        }, 100);
        this.marker.setPosition(place.geometry.location);
      });
    }
    if (query !== null && query !== undefined && query !== '') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          lat = location.lat();
          lng = location.lng();
          this.getAddress(lat, lng, null);
          this.map2.setCenter(location);
          setTimeout(() => {
            this.map2.setZoom(19); 
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }
    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails({ placeId: placeId }, (placeResult, placeStatus) => {
            if (placeStatus === 'OK' && placeResult) {
              this.placeName = placeResult.name || ''; 
              this.getAddress(lat, lng, placeResult);  
            } else {
              this.getAddress(lat, lng, null);
            }
          });
        } else {
          console.warn('Geocoder failed:', status);
          this.getAddress(lat, lng, null);
        }
      });
    });
  }
  StateDataValues(country: any, state: any, postcode: any, distt: any) {
    if (country) {
      var countryDatas: any = this.CountryData.find((c: any) => c.NAME === country)?.ID;
      if (countryDatas !== null && countryDatas !== undefined && countryDatas !== '') {
        this.data.COUNTRY_ID = Number(countryDatas);
        this.getStatesByLocationFetch(this.data.COUNTRY_ID, true, state, postcode, distt)
      }
    }
  }
  getStatesByLocationFetch(countryId: any, value: boolean, state: any, postcode: any, distt: any) {
    this.isStateSpinning = true;
    if (value == true) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.StateData = [];
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
            if (state) {
              var stateDatas: any = this.StateData.find((c: any) => c.NAME === state)?.ID;
              if (stateDatas !== null && stateDatas !== undefined && stateDatas !== '') {
                this.data.STATE_ID = Number(stateDatas);
                this.getDistrictByLocationFetch(this.data.STATE_ID, true, postcode, distt)
              }
            }
            this.isStateSpinning = false;
          } else {
            this.StateData = [];
            this.isStateSpinning = false;
          }
        },
        () => {
        }
      );
  }
  getDistrictByLocationFetch(stateId: any, value: boolean, postcode: any, distt: any) {
    this.isDistrictSpinning = true;
    if (value == true) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND STATE_ID=' + stateId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isDistrictSpinning = false;
            this.DistrictData = data['data'];
            if (distt) {
              var DistrictDatas: any = this.DistrictData.find((c: any) => c.NAME === distt)?.ID;
              if (DistrictDatas !== null && DistrictDatas !== undefined && DistrictDatas !== '') {
                this.data.DISTRICT_ID = Number(DistrictDatas);
                this.getPincodeByLocation(this.data.DISTRICT_ID, true, postcode)
              }
            }
          } else {
            this.DistrictData = [];
            this.isDistrictSpinning = false;
          }
        },
        () => {
        }
      );
  }
  getPincodeByLocation(districtId: number, value: boolean, postcode: any) {
    if (value == true) {
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.CityData = [];
      this.PincodeData = [];
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(
        0,
        0,
        '',
        'asc',
        ` AND IS_ACTIVE = 1 AND DISTRICT=${districtId} `
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            if (postcode) {
              var PincodeDatas: any = this.PincodeData.find((c: any) => c.PINCODE_NUMBER === postcode)?.ID;
              if (PincodeDatas !== null && PincodeDatas !== undefined && PincodeDatas !== '') {
                this.data.PINCODE_ID = Number(PincodeDatas);
                this.getpincodename1(this.data.PINCODE_ID);
              }
            }
          } else {
            this.PincodeData = [];
          }
          this.isPincodeSpinning = false; 
        },
        () => {
          this.isPincodeSpinning = false; 
        }
      );
  }
  getpincodename1(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
        this.pincodeChannel = 'pincode_' + pin[0]['ID'] + '_channel';
        if (this.pincodeChannelOld === '' || this.pincodeChannelOld === null) {
          this.pincodeChannelOld = 'pincode_' + pin[0]['ID'] + '_channel';
        } else {
          this.pincodeChannelOld = this.pincodeChannelOld;
        }
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }
  getAddress(lat: number, lng: number, placeId?: any) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    this.citySearch = '';
    this.stateSearch = '';
    this.countrySearch = '';
    this.locality1Search = '';
    this.locality2Search = '';
    this.buildingSearch = '';
    this.landmarkSearch = '';
    this.building1Search = '';
    this.postcodeSearch = '';
    this.districtSearch = '';
    this.street_number = '';
    this.subpremise = '';
    this.floor = '';
    const geocodeRequest = placeId?.place_id ? { placeId: placeId.place_id } : { location: latlng };
    geocoder.geocode(geocodeRequest, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents: any = results[0].address_components;
        if (addressComponents && addressComponents.length) {
          addressComponents.forEach((component: any) => {
            const types = component?.types;
            if (types.includes('locality')) {
              this.citySearch = component?.long_name || '';
            }
            if (types.includes('administrative_area_level_1')) {
              this.stateSearch = component?.long_name || '';
            }
            if (types.includes('country')) {
              this.countrySearch = component?.long_name || '';
            }
            if (types.some((type: any) => ['sublocality_level_2', 'neighborhood'].includes(type))) {
              this.locality1Search = component.long_name || '';
            }
            if (types.some((type: any) => ['sublocality_level_1', 'neighborhood'].includes(type))) {
              this.locality2Search = component.long_name || '';
            }
            if (types.includes('premise')) {
              this.buildingSearch += (this.buildingSearch ? ', ' : '') + (component?.long_name || '');
            }
            if (types.includes('landmark')) {
              this.landmarkSearch = component?.long_name || '';
            }
            if (types.includes('route')) {
              this.building1Search = component?.long_name || '';
            }
            if (types.some((type: any) => ['plus_code', 'street_number'].includes(type))) {
              this.street_number = component.long_name || '';
            }
            if (types.includes('floor')) {
              this.floor = component?.long_name || '';
            }
            if (types.includes('subpremise')) {
              this.subpremise = component?.long_name || '';
            }
            if (types.includes('postal_code')) {
              this.postcodeSearch = component?.long_name || '';
            }
            if (types.includes('administrative_area_level_3')) {
              this.districtSearch = component?.long_name || '';
            }
          });
          this.data.CITY_NAME = this.citySearch ? this.citySearch : this.districtSearch;
          this.data.ADDRESS_LINE2 = [this.landmarkSearch, this.building1Search, this.locality2Search].filter(parts => !!parts && parts.trim() !== '').join(', ');
          if (this.data.ADDRESS_LINE2 === '' || this.data.ADDRESS_LINE2 === null || this.data.ADDRESS_LINE2 === undefined) {
            this.data.ADDRESS_LINE2 = this.citySearch ? this.citySearch : this.districtSearch;
          }
          this.data.ADDRESS_LINE1 = [this.floor, this.street_number, this.subpremise, this.placeName, this.buildingSearch, this.locality1Search].filter(partad => !!partad && partad.trim() !== '').join(', ');
        }
        this.data.HOME_LATTITUDE = Number(lat) || lat;
        this.data.HOME_LONGITUDE = Number(lng) || lng;
        if (!this.noaddress) {
          this.data.ADDRESS_LINE1 = this.data.ADDRESS_LINE1;
        } else {
          this.address1 = this.data.ADDRESS_LINE1;
        }
        this.data.ADDRESS_LINE1 = this.data.ADDRESS_LINE1 || '';
        if (typeof this.selectedLocation !== 'object') {
          this.selectedLocation = '';
        }
        this.selectedLocation = this.data.ADDRESS_LINE2
      } else {
        this.selectedLocation = '';
      }
    });
  }
  clearSearchBox() {
    this.selectedLocation = '';
    this.closemapModal();
  }
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = null;
  deleteCancel() { }
  removeImage() {
    this.data.PROFILE_PHOTO = null;
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  imageDeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.PROFILE_PHOTO = null;
    this.fileURL = null;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;
  imagePreview: any;
  selectedFile: any;
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; 
    const allowedWidth = 128;
    const allowedHeight = 128;
    if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
      this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        this.fileURL = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = this.croppedImage;
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
          this.selectedFile = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = this.croppedImage; 
          };
          reader.readAsDataURL(this.selectedFile);
        }
        img.onload = () => {
          if (img.width !== allowedWidth || img.height !== allowedHeight) {
            this.message.error(
              `Image dimensions should be exactly ${allowedWidth}x${allowedHeight}px.`,
              ''
            );
            this.fileURL = null;
            this.sanitizedFileURL = null;
          } else {
            this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(this.fileURL)
            );
            this.data.PROFILE_PHOTO = this.fileURL.name;
          }
        };
      };
      reader.readAsDataURL(this.fileURL);
      this.CropImageModalVisible = false;
    } else {
      this.message.error(
        'Please select a valid image file (PNG, JPG, JPEG).',
        ''
      );
      event.target.value = null;
      this.fileURL = null;
      this.sanitizedFileURL = null;
    }
  }
  imagePreviewURL;
  removeImage1(): void {
    this.data.PROFILE_PHOTO = null;
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('Profile Photo removed successfully.', '');
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); 
      window.open(imageURL, '_blank');
    } else {
      alert('No Profile Photo selected to view.');
    }
  }
  deleteImage(): void {
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }
  ondaystartTimeChange1() {
    const selectedTime = new Date(this.StartDate1);
    this.StartDate1 = this.roundMinutesToNearestInterval(selectedTime);
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
  loadEmail: boolean = false;
  loadMobile: boolean = false;
  checkduplicate() {
    if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.message.error(' Please Enter Email ID', '');
    } else if (
      this.data.EMAIL_ID != null &&
      this.data.EMAIL_ID != undefined &&
      !this.emailpattern.test(this.data.EMAIL_ID)
    ) {
      this.message.error('Please Enter Valid Email. ', '');
    } else {
      this.loadEmail = true;
      this.api
        .getTechnicianData11(
          0,
          0,
          '',
          '',
          ' AND EMAIL_ID = "' + this.data.EMAIL_ID + '"',
          '',
          ''
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadEmail = false;
              if (data['count'] > 0) {
                this.message.info('Email already exist', '');
              } else {
                this.message.info('Email verified successfully', '');
              }
            } else {
              this.loadEmail = false;
            }
          },
          (err) => {
            this.loadEmail = false;
          }
        );
    }
  }
  checkduplicateMobile() {
    if (
      this.data.MOBILE_NUMBER == null ||
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER == 0
    ) {
      this.message.error(' Please Enter Mobile No.', '');
    } else if (
      this.data.MOBILE_NUMBER != null &&
      this.data.MOBILE_NUMBER != undefined &&
      this.data.MOBILE_NUMBER != 0 &&
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER)
    ) {
      this.message.error('Please Enter Valid Mobile No. ', '');
    } else {
      this.loadMobile = true;
      this.api
        .getTechnicianData11(
          0,
          0,
          '',
          '',
          ' AND MOBILE_NUMBER = "' + this.data.MOBILE_NUMBER + '"',
          '',
          ''
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadMobile = false;
              if (data['count'] > 0) {
                this.message.info('Mobile number already exist', '');
              } else {
                this.message.success('Mobile number verified successfully', '');
              }
            } else {
              this.loadMobile = false;
            }
          },
          (err) => {
            this.loadMobile = false;
          }
        );
    }
  }
}