import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css'],
})
export class RoledetailsComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: RoleMaster = new RoleMaster();
  @Input() roleDetailsData: any[] = [];
  @Input() MapData;
  @Input() loadForm;

  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  formTitle = 'Role Details';

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  save() {
    this.isSpinning = true;

    this.api
      .addRoleDetails(this.data.ID, this.modifiedRoleDetailsData)
      .subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Role Details added Successfully', '');
            this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Role Details assigning Failed', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }

  event1(newValue: boolean, index: number) {
    this.roleDetailsData[index]['IS_ALLOWED'] = newValue;
    this.updateModifiedData(index);
  }

  event2(newValue: boolean, index: number) {
    this.roleDetailsData[index]['SHOW_IN_MENU'] = newValue;
    this.updateModifiedData(index);
  }

  event3(newValue: any, index: number) {
    this.roleDetailsData[index]['SEQ_NO'] = newValue;
    this.updateModifiedData(index);
  }

  modifiedRoleDetailsData: any[] = [];

  updateModifiedData(index: number) {
    const existingIndex = this.modifiedRoleDetailsData.findIndex(
      (item: any) => item.ID === this.roleDetailsData[index].ID
    );

    if (existingIndex !== -1) {
      this.modifiedRoleDetailsData[existingIndex] = this.roleDetailsData[index];
    } else {
      this.modifiedRoleDetailsData.push(this.roleDetailsData[index]);
    }
  }

  searchText: any = '';

  datalist1: any[] = [];
  searchGoods(data: any) {
    this.loadForm = true;
    if (data !== null && data.trim() !== '') {
      this.datalist1 = this.roleDetailsData.filter((user) => {
        return (
          user.NAME.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.LINK.toLowerCase().includes(this.searchText.toLowerCase())
        );
      });

      this.loadForm = false;

      this.roleDetailsData = this.datalist1.slice();
    } else {
      this.loadForm = false;
      this.api.getRoleDetails(this.MapData).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.roleDetailsData = data['data'];
            this.loadForm = false;
          } else {
            this.message.error('Smoething Went Wrong', '');
            this.loadForm = false;
          }
        },
        () => {
          this.loadForm = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
    }
  }
}
