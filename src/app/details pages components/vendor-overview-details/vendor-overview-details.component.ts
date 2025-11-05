import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-vendor-overview-details',
  templateUrl: './vendor-overview-details.component.html',
  styleUrls: ['./vendor-overview-details.component.css'],
  providers: [DatePipe]
})
export class VendorOverviewDetailsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: any;
  @Input() drawerVisible: boolean;
  @Input() custid: any;
  @Input() TYPE: any = '';

  constructor() { }
  ngOnInit() {
  }

  close() {
    this.drawerClose();
  }
  show: any = 0
  onSelectedIndexChange(event) {
    this.show = event;
  }
}
