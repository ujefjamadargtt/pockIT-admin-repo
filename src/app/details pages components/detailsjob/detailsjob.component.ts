import { Component, Input, } from '@angular/core';
@Component({
  selector: 'app-detailsjob',
  templateUrl: './detailsjob.component.html',
  styleUrls: ['./detailsjob.component.css']
})
export class DetailsjobComponent {
  @Input() drawerClose: Function;
  @Input() jobdetailsdata: any
  @Input() invoicefilter: any
  show: any = 0
  onSelectedIndexChange(event) {
    this.show = event
  }
  ngOnInit(): void {
  }
  formatTime(time: string): string {
    if (time && /^[0-9]{2}:[0-9]{2}(:[0-9]{2})?$/.test(time)) {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; 
      return `${hour12}.${this.padZero(minutes)} ${period}`;
    }
    return '';
  }
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  TYPE = 'JOB';
  FILTER_ID: any = null;
  setFilter() {
    this.TYPE = 'JOB';
    this.FILTER_ID = this.jobdetailsdata.ID;
  }
}
