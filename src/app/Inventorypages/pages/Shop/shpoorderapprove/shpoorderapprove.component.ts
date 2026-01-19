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
  }
  reject() {
  }
  showreject: boolean = false;
  reject111() {
    this.showreject = true;
  }
  closereject() {
    this.showreject = false;
  }
}
