import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Technicianconfigrationdata } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-techconfigration',
  templateUrl: './techconfigration.component.html',
  styleUrls: ['./techconfigration.component.css'],
})
export class TechconfigrationComponent {
  @Input() data: any;
  @Input() drawerClose: any;

  close() {
    this.drawerClose();
  }
  isSpinning: boolean = false;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  save(): void {


    this.isSpinning = true;

    if (this.data.ID) {
      this.api.updateconfigration(this.data).subscribe((successCode: any) => {
        if (successCode.code == 200) {
          this.message.success('Configration Changed Successfully', '');
          this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Failed to change configuration', '');
          this.isSpinning = false;
        }
      }, err => {
        this.message.error('Something went wrong, please try again later', '');
        this.isSpinning = false;
      });
    } else {
      this.api.createconfigration(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code === 200) {
            this.message.success('Configration Changed Successfully', '');

            this.drawerClose();
          } else {
            this.message.error('Configration Changed Failed', '');
          }
          this.isSpinning = false;
        },
        (error) => {
          this.isSpinning = false;
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
        }
      );
    }
  }
}
