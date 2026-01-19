import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Coupontype } from 'src/app/Support/Models/coupontype';
@Component({
  selector: 'app-coupontype',
  templateUrl: './coupontype.component.html',
  styleUrls: ['./coupontype.component.css'],
})
export class CoupontypeComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Coupontype;
  isSpinning = false;
  logtext: string = '';
  constructor(
    public api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  ngOnInit() { }
  //
  resetDrawer(couponTypePage: NgForm) {
    this.data = new Coupontype();
    couponTypePage.form.markAsPristine();
    couponTypePage.form.markAsUntouched();
  }
  close(couponTypePage: NgForm) {
    this.drawerClose();
    this.resetDrawer(couponTypePage);
    couponTypePage.form.reset();
  }
  save(addNew: boolean, couponTypePage: NgForm): void {
    var isok = true;
    if (this.data.NAME == undefined || this.data.NAME == '') {
      isok = false;
      this.message.error('Please Enter Coupon Type', '');
    }
    if (isok) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateCoupontype(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Coupontype information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to update coupontype information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createCoupontype(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Coupontype information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Coupontype();
              this.resetDrawer(couponTypePage);
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add coupontype information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
