import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { CountryData } from 'src/app/Pages/Models/CountryMasterData';
@Component({
  selector: 'app-countrymaster-drawer',
  templateUrl: './countrymaster-drawer.component.html',
  styleUrls: ['./countrymaster-drawer.component.css'],
})
export class CountrymasterDrawerComponent {
  @Input() data: any = CountryData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  resetDrawer(CountryDrawer: NgForm) {
    this.data = new CountryData();
    CountryDrawer.form.markAsPristine();
    CountryDrawer.form.markAsUntouched();
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  save(addNew: boolean, CountryDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == 0) &&
      (this.data.SEQ_NO == null ||
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Country Name.', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code.', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateCountryData(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Country Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('Country Updation Failed', '');
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
          this.api
            .createCountryData(this.data)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Country Created Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new CountryData();
                  this.resetDrawer(CountryDrawer);
                  this.api.getAllCountryMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
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
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('Country Creation Failed...', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
  getErrorMessage(control: any): string {
    if (control.errors?.['required'] && control.touched) {
      return 'Please enter a country name.';
    }
    if (control.errors?.['maxlength'] && control.touched) {
      return 'Country name is too long.';
    }
    return '';
  }
}