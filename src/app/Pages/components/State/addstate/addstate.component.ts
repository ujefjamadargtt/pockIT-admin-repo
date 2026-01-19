import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { StateMaster } from '../../../Models/state';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-addstate',
  templateUrl: './addstate.component.html',
  styleUrls: ['./addstate.component.css'],
})
export class AddstateComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: StateMaster = new StateMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: StateMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  public commonFunction = new CommonFunctionService();
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  onCountryChange(countryId: number | null): void {
    this.data.NAME = '';
    this.data.SHORT_CODE = '';
  }
  ngOnInit(): void {
    this.getCountyData();
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
  isCountrySpinning = false;
  getCountyData() {
    this.isCountrySpinning = true;
    this.api
      .getAllCountryMaster(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countryData = data['data'];
            this.isCountrySpinning = false;
          } else {
            this.countryData = [];
            this.message.error('Failed to get country data', '');
            this.isCountrySpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  save(addNew: boolean, StateMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
      (this.data.NAME == undefined ||
        this.data.NAME == '' ||
        this.data.NAME.trim() == '') &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == '' ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter State Name', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code.', '');
    } else if (
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
          this.api.updateState(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('State Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('State Updation Failed', '');
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
          this.api.createState(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('State Created Successfully', '');
                this.stateSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(StateMasterPage);
                  this.data = new StateMaster();
                }
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('State Creation Failed...', '');
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
  stateSeq(): void {
    this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  resetDrawer(StateMasterPage: NgForm) {
    this.data = new StateMaster();
    StateMasterPage.form.markAsPristine();
    StateMasterPage.form.markAsUntouched();
  }
}