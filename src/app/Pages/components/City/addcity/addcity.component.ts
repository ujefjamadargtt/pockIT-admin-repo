import { Component, Input, SimpleChanges } from '@angular/core';
import { CityMaster } from '../../../Models/City';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-addcity',
  templateUrl: './addcity.component.html',
  styleUrls: ['./addcity.component.css'],
})
export class AddcityComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: CityMaster = new CityMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: CityMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  ngOnInit(): void {
    this.getCountyData();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID, false);
    }
    if (this.data?.STATE_ID) {
      this.getDistrictByState(this.data.STATE_ID, false);
    }
  }
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  close(): void {
    this.drawerClose();
  }
  countryData: any = [];
  IsCountrySpinng = false;
  getCountyData() {
    this.IsCountrySpinng = true;
    this.api.getAllCountryMaster(0, 0, '', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countryData = data['data'];
          this.IsCountrySpinng = false;
        } else {
          this.countryData = [];
          this.message.error('Failed to get country data', '');
          this.IsCountrySpinng = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.IsCountrySpinng = false;
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
  stateData: any = [];
  isStateSpinning: boolean = false;
  getStatesByCountry(countryId: any, value: boolean) {
    if (value == true) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.NAME = '';
      this.stateData = [];
      this.DistrictData = [];
    }
    this.isStateSpinning = true;
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
            this.stateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.stateData = [];
            this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
  }
  getDistrictByState(stateId: any, value: boolean) {
    if (value == true) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.NAME = '';
      this.DistrictData = [];
    }
    this.isDistSpinning = true;
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
            this.isDistSpinning = false;
          } else {
            this.DistrictData = [];
            this.message.error('Failed To Get District Data...', '');
            this.isDistSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  DistrictData: any = [];
  isDistSpinning: boolean = false;
  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
      (this.data.STATE_ID == undefined || this.data.STATE_ID == null) &&
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == 0) &&
      (this.data.NAME == undefined ||
        this.data.NAME == '' ||
        this.data.NAME.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (this.data.STATE_ID == undefined || this.data.STATE_ID == null) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (
      this.data.DISTRICT_ID == null ||
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select District Name', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == '' ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter City Name', '');
    }
    if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateCity(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
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
          this.api.createCity(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Saved Successfully', '');
                this.citySeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(CityMasterPage);
                  this.data = new CityMaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('Information not saved', '');
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
    }
  }
  citySeq(): void {
    this.api.getAllCityMaster(1, 10, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.data.SEQ_NO = 1;
        } else {
          this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
          this.data.IS_ACTIVE = true;
        }
      },
      (err) => { }
    );
  }
  resetDrawer(CityMasterPage: NgForm) {
    this.data = new CityMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
  }
  onDistChange() {
    this.data.NAME = '';
  }
}