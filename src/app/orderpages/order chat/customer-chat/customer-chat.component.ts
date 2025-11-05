import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.css']
})
export class CustomerChatComponent {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  ngOnInit() {
    this.getTechnicianData();
  }
  techData: any = [];
  TECHNICIAN_NAME: any;
  selectedTechnicianName: string = '';

  getTechnicianData() {
    this.api.getTechnicianData(0, 0, '', '', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.techData = data['data'];
        } else {
          this.techData = [];
          this.message.error('Failed To Get Technician Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  onTechnicianChange() {
    const selectedTechnician = this.techData.find(tech => tech.ID === this.TECHNICIAN_NAME);
    if (selectedTechnician) {
      this.selectedTechnicianName = selectedTechnician.NAME;
    }
  }
}
