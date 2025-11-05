import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { taxes } from 'src/app/Pages/Models/taxes';

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.component.html',
  styleUrls: ['./tax-detail.component.css']
})
export class TaxDetailComponent {
  @Input() drawerClose: Function;
  @Input() data: taxes;
  @Input() drawerVisible: boolean;
  TaxList: any = []
  CountryList: any = []
  listdata1 = [];
  listdata2 = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  namepatt = /^[a-zA-Z \-\']+/
  mobpattern = /^[6-9]\d{9}$/
  onlynum = /^[0-9]*$/
  onlychar = /^[a-zA-Z ]*$/
  longitudepattern = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
  latitudepattern = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
  pat1 = /^\d{6}$/;
  namepattern = /[a-zA-Z][a-zA-Z ]+/
  cityRegex = /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/;
  aaddpattern = /^[a-zA-Z0-9\s,'-]*$/
  namepatte = /[ .a-zA-Z]+/
  passpattern = /^([A-Za-z0-9@#\s]){8,}$/
  imgUrl
  time
  time1
  time2
  date

  constructor(private api: ApiServiceService, private cookie: CookieService, private datePipe: DatePipe, private message: NzNotificationService) {
  }

  ngOnInit() {
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
    this.data = new taxes();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();

  }


  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (this.data.TAX_ID == undefined && this.data.TYPE == undefined
      && this.data.RATE == undefined && this.data.COUNTRY_ID == undefined && this.data.EFFECTIVE_DATE == undefined
      && this.data.EXPIRY_DATE == undefined && this.data.DESCRIPTION == undefined) {
      this.isOk = false
      this.message.error('Please fill all required details', '')
    }
    else if (this.data.TAX_ID == undefined || this.data.TAX_ID == '') {
      this.isOk = false
      this.message.error('Please select Tax name', '')
    }
    else if (this.data.TYPE == undefined || this.data.TYPE == '') {
      this.isOk = false
      this.message.error('Please select Tax Type', '')
    }
    else if (this.data.RATE == undefined || this.data.RATE == '') {
      this.isOk = false
      this.message.error('Please Enter Rate', '')
    }
    else if (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == '') {
      this.isOk = false
      this.message.error('Please select Country', '')
    }
    else if (this.data.EFFECTIVE_DATE == undefined || this.data.EFFECTIVE_DATE == '') {
      this.isOk = false
      this.message.error('Please select Effective Date', '')
    }
    else if (this.data.EXPIRY_DATE == undefined || this.data.EXPIRY_DATE == '') {
      this.isOk = false
      this.message.error('Please select Expiry Date', '')
    }
    else if (this.data.DESCRIPTION == undefined || this.data.DESCRIPTION == '') {
      this.isOk = false
      this.message.error('Please Enter Description', '')
    }


    if (this.isOk) {
      this.isSpinning = true;
      this.orgId = this.cookie.get('orgId');

      if (this.data.ID) {

        this.api.updateTaxDetails(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Tax Details Updated Successfully", "");

            if (!addNew)
              this.drawerClose();

            this.isSpinning = false;
            this.resetDrawer(accountMasterPage);

          } else {
            this.message.error("Tax details Updation Failed", "");
            this.isSpinning = false;
          }
        });



      } else {

        this.api.createTaxDetails(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Tax details information saved successfully", "");

            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);

            } else {
              this.data = new taxes();
              this.resetDrawer(accountMasterPage);
            }

          } else {
            this.message.error("Cannot save tax details information", "");
            this.isSpinning = false;
          }
        });

      }
    }
  }
  disabledDatejoin = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInCalendarDays(current, today) < 0;
  };
}
