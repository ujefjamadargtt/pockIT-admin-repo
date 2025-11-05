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

  // close(): void {
  //   this.drawerClose();

  //   this.logtext = 'CLOSED - Coupontype form';
  //   this.api.addLog('A', this.logtext, this.api.emailId)
  //     .subscribe(successCode => {
  //       if (successCode['code'] == "200") {
  //         
  //       }
  //       else {
  //         
  //       }
  //     });

  // }

  ////

  resetDrawer(couponTypePage: NgForm) {
    this.data = new Coupontype();
    // couponTypePage.form.reset();

    couponTypePage.form.markAsPristine();
    couponTypePage.form.markAsUntouched();
  }

  close(couponTypePage: NgForm) {
    this.drawerClose();
    this.resetDrawer(couponTypePage);
    couponTypePage.form.reset();

    // this.logtext = 'CLOSED - Coupontype form';
    // this.api
    //   .addLog('A', this.logtext, this.api.emailId)
    //   .subscribe((successCode) => {
    //     if (successCode['code'] == '200') {
    //       
    //     } else {
    //       
    //     }
    //   });
  }
  //save
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

            // this.logtext =
            //   'Update & Close - Coupontype form - SUCCESS ' +
            //   JSON.stringify(this.data) +
            //   ' KEYWORD [U - Coupontype ]';
            // this.api
            //   .addLog('A', this.logtext, this.api.emailId)
            //   .subscribe((successCode) => {
            //     if (successCode['code'] == '200') {
            //       
            //     } else {
            //       
            //     }
            //   });

            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            // this.logtext =
            //   'Update & Close - Coupontype form - ERROR - ' +
            //   JSON.stringify(this.data) +
            //   ' KEYWORD [U - Coupontype ]';
            // this.api
            //   .addLog('A', this.logtext, this.api.emailId)
            //   .subscribe((successCode) => {
            //     if (successCode['code'] == '200') {
            //       
            //     } else {
            //       
            //     }
            //   });

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

              // this.logtext =
              //   'Save & Close - Coupontype form - SUCCESS - ' +
              //   JSON.stringify(this.data) +
              //   ' KEYWORD [C - Coupontype ]';
              // this.api
              //   .addLog('A', this.logtext, this.api.emailId)
              //   .subscribe((successCode) => {
              //     if (successCode['code'] == '200') {
              //       
              //     } else {
              //       
              //     }
              //   });
            } else {
              this.data = new Coupontype();
              this.resetDrawer(couponTypePage);
              // this.logtext =
              //   'Save & New - Coupontype form - SUCCESS - ' +
              //   JSON.stringify(this.data) +
              //   ' KEYWORD [C - Coupontype ]';
              // this.api
              //   .addLog('A', this.logtext, this.api.emailId)
              //   .subscribe((successCode) => {
              //     if (successCode['code'] == '200') {
              //       
              //     } else {
              //       
              //     }
              //   });
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add coupontype information...', '');
            this.isSpinning = false;
            // this.logtext =
            //   'Save & Close - Coupontype form - ERROR - ' +
            //   JSON.stringify(this.data) +
            //   ' KEYWORD [C - Coupontype ]';
            // this.api
            //   .addLog('A', this.logtext, this.api.emailId)
            //   .subscribe((successCode) => {
            //     if (successCode['code'] == '200') {
            //       
            //     } else {
            //       
            //     }
            //   });
          }
        });
      }
    }
  }
}
