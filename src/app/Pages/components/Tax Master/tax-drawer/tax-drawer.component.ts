import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TaxMasterData } from 'src/app/Pages/Models/TaxmasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-tax-drawer',
  templateUrl: './tax-drawer.component.html',
  styleUrls: ['./tax-drawer.component.css'],
})
export class TaxDrawerComponent {
  countryData: any = [];
  isSpinning = false;
  isOk = true;
  isFocused = '';
  ngOnInit(): void {
    this.getCountyData();
  }

  public commonFunction = new CommonFunctionService();

  @Input() data: any = TaxMasterData;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  CountryLoading = false;
  getCountyData() {
    this.CountryLoading = true;
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countryData = data['data'];
            this.CountryLoading = false;
          } else {
            this.countryData = [];
            this.message.error('Failed to get country data', '');
            this.CountryLoading = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  oncityChange() {
    this.data.NAME = '';
    this.data.IGST = '';
    this.data.SGST = '';
    this.data.CGST = '';
    this.data.CESS = '';
    this.data.SHORT_CODE = '';
  }
  resetDrawer(Taxmaster: NgForm) {
    this.data = new TaxMasterData();
    Taxmaster.form.markAsPristine();
    Taxmaster.form.markAsUntouched();
  }

  save(addNew: boolean, Taxmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.COUNTRY_ID == '' ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == undefined) &&
      (this.data.NAME == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.IGST == '' ||
        this.data.IGST == null ||
        this.data.IGST == undefined) &&
      (this.data.SGST == '' ||
        this.data.SGST == null ||
        this.data.SGST == undefined) &&
      (this.data.CGST == '' ||
        this.data.CGST == null ||
        this.data.CGST == undefined) &&
      (this.data.CESS == '' ||
        this.data.CESS == null ||
        this.data.CESS == undefined) &&
      (this.data.SHORT_CODE == '' ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields.', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Country.', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Tax Name.', '');
    } else if (
      this.data.IGST == null ||
      this.data.IGST == undefined ||
      this.data.IGST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter  IGST.', '');
    } else if (
      this.data.SGST == null ||
      this.data.SGST == undefined ||
      this.data.SGST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter SGST.', '');
    } else if (
      this.data.CGST == null ||
      this.data.CGST == undefined ||
      this.data.CGST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter CGST.', '');
    } else if (
      this.data.CESS == null ||
      this.data.CESS == undefined ||
      this.data.CESS == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter CESS.', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Short Code.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateTax(this.data).subscribe((successCode: any) => {
            if (successCode.code == 200) {
              this.message.success('Tax Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Tax Updation Failed', '');
              this.isSpinning = false;
            }

          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
        } else {
          this.api.createTax(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code === 200) {
                this.message.success('Tax Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                  this.isSpinning = false;
                } else {
                  this.data = new TaxMasterData();
                  this.resetDrawer(Taxmaster);
                }
              } else {
                this.message.error('Tax Creation Failed', '');
              }
              this.isSpinning = false;
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
}
