import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-shpoorderapprove',
  templateUrl: './shpoorderapprove.component.html',
  styleUrls: ['./shpoorderapprove.component.css'],
})
export class ShpoorderapproveComponent {
  @Input() drawerClose: any;
  @Input() drawerdata: any;
  public commonFunction = new CommonFunctionService();
  items: any = [];
  totaldata: any = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  approve() {
    // this.isSpinning = true;
    // for (let i = 0; i < this.items.length; i++) {
    //   if (
    //     this.items[i].APPROVAL_QUANTITY == null ||
    //     this.items[i].APPROVAL_QUANTITY == undefined ||
    //     this.items[i].APPROVAL_QUANTITY == '' ||
    //     this.items[i].APPROVAL_QUANTITY == 0
    //   ) {
    //     this.message.error('please enter the approval quantity', '');
    //     this.isSpinning = false;
    //     return;
    //   }
    //   if (this.items[i].APPROVAL_QUANTITY > this.items[i].INWARD_QUANTITY) {
    //     this.items[i].APPROVAL_QUANTITY = null;
    //     this.items[i].APPROVAL_QUANTITY = null;
    //     this.message.error(' Quantity is more than Available Quantity', '');
    //     this.isSpinning = false;
    //     return;
    //   } else if (
    //     this.items[i].APPROVAL_QUANTITY > this.items[i].QUANTITY
    //   ) {
    //     this.items[i].APPROVAL_QUANTITY = null;
    //     this.items[i].APPROVAL_QUANTITY = null;
    //     this.message.error('Approved Quantity is more than Quantity', '');
    //     this.isSpinning = false;
    //     return;
    //   }
    // }
    // this.data.APPROVE_REJECTED_BY_NAME = this.commonFunction.decryptdata(
    //   sessionStorage.getItem('userName') || ''
    // );
    // this.data.APPROVE_REJECTED_DATE = this.datePipe.transform(
    //   new Date(),
    //   'yyyy-MM-dd HH:mm:ss'
    // );
    // this.data.APPROVE_REJECTED_BY_ID = this.USER_ID;
    // this.data.STATUS = 'A';
    // this.data.DETAILS_DATA = this.items;
    // this.api.approverejectmomentreq(this.data).subscribe(
    //   (successCode) => {
    //     if (successCode['status'] == 200) {
    //       this.message.success(
    //         'Stock Movement Request Approved Successfully',
    //         ''
    //       );
    //       this.drawerClose();
    //       this.isSpinning = false;
    //     } else {
    //       this.message.error('Stock Movement Request Approved Failed', '');
    //       this.isSpinning = false;
    //     }
    //   },
    //   (err) => {
    //     this.isSpinning = false;
    //     this.message.error('Stock Movement Request Approved failed', '');
    //   }
    // );
  }

  reject() {
    // this.isSpinning = true
    // if (this.data.REASON == null || this.data.REASON == undefined || this.data.REASON == '') {
    //   this.message.error('please enter the reason', '');
    //   this.isSpinning = false
    //   return;
    // }
    // this.data.APPROVE_REJECTED_BY_NAME = this.commonFunction.decryptdata(
    //   sessionStorage.getItem('userName') || ''
    // );
    // this.data.APPROVE_REJECTED_DATE = this.datePipe.transform(
    //   new Date(),
    //   'yyyy-MM-dd HH:mm:ss'
    // );
    // this.data.APPROVE_REJECTED_BY_ID = this.USER_ID
    // this.data.STATUS = 'R';
    // this.data.DETAILS_DATA = this.items;
    // this.api.approverejectmomentreq(this.data).subscribe(
    //   (successCode) => {
    //     if (successCode['status'] == 200) {
    //       this.message.success(
    //         'Stock Movement Request Rejected Successfully',
    //         ''
    //       );
    //       this.drawerClose();
    //       this.isSpinning = false;
    //     } else {
    //       this.message.error('Stock Movement Request Rejected Failed', '');
    //       this.isSpinning = false;
    //     }
    //   },
    //   (err) => {
    //     this.isSpinning = false;
    //     this.message.error('Stock Movement Request Rejected failed', '');
    //   }
    // )
  }

  showreject: boolean = false;

  reject111() {
    this.showreject = true;
  }
  closereject() {
    this.showreject = false;
    // this.data.REASON = ''
  }
}
