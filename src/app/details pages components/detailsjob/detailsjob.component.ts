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
    // Ensure the time is valid and in the format HH:mm:ss or HH:mm
    if (time && /^[0-9]{2}:[0-9]{2}(:[0-9]{2})?$/.test(time)) {
      // Split the time into hours and minutes
      const [hours, minutes] = time.split(':').map(Number);

      // Convert 24-hour format to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 (midnight)

      // Return formatted time with a dot (.) separator
      return `${hour12}.${this.padZero(minutes)} ${period}`;
    }
    return '';
  }

  // Helper method to pad single-digit numbers with a leading zero
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
