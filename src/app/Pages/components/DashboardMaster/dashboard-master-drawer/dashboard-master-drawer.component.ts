import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DashboardMaster } from 'src/app/Pages/Models/dashboardmaster';
import { TemplateCategoryMaster } from 'src/app/Pages/Models/templateCategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-dashboard-master-drawer',
  templateUrl: './dashboard-master-drawer.component.html',
  styleUrls: ['./dashboard-master-drawer.component.css']
})
export class DashboardMasterDrawerComponent {
  @Input() data: any = DashboardMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  isStateSpinning = false;
  isFocused: string = '';
  roleId = sessionStorage.getItem('roleId');
  roleIDMain = this.roleId ? this.commonFunction.decryptdata(this.roleId) : '';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  resetDrawer(teritorymaster: NgForm) {
    this.data = new DashboardMaster();
    teritorymaster.form.markAsPristine();
    teritorymaster.form.markAsUntouched();
  }
  ngOnInit() {
    this.getRole();
  }
  isroleSpinning: boolean = false;
  roleData: any = [];
  getRole() {
    this.isroleSpinning = true;
    this.api
      .getAllRoles(0, 0, '', '', '')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.roleData = data['data'];
          this.isroleSpinning = false;
        } else {
          this.roleData = [];
        }
      });
  }
  save(addNew: boolean, teritorymaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.ROLE_ID == 0 ||
        this.data.ROLE_ID == null ||
        this.data.ROLE_ID == undefined) &&
      (this.data.TITLE.trim() == '' ||
        this.data.TITLE == null ||
        this.data.TITLE == undefined) &&
      (this.data.SNAPSHOT_LINK == undefined ||
        this.data.SNAPSHOT_LINK == null ||
        this.data.SNAPSHOT_LINK.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } if (
      this.data.ROLE_ID == null ||
      this.data.ROLE_ID == undefined ||
      this.data.ROLE_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Role.', '');
    }
    else if (
      this.data.TITLE == null ||
      this.data.TITLE == undefined ||
      this.data.TITLE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Title.', '');
    }
    else if (
      this.data.SNAPSHOT_LINK == null ||
      this.data.SNAPSHOT_LINK == undefined ||
      this.data.SNAPSHOT_LINK.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Snapshot Link.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateDashboard(this.data).subscribe(
            (successCode: HttpResponse<any>) => {
              if (successCode.status == 200) {
                this.message.success('Dashboard Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Dashboard Updation Failed', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        } else {
          this.api.createDashboard(this.data).subscribe((successCode: HttpResponse<any>) => {
            if (successCode.status == 200) {
              this.message.success('Dashboard Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new DashboardMaster();
                this.resetDrawer(teritorymaster);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Dashboard Creation Failed', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  ondistChange() { }
}
