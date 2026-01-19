import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UnitMasterData } from 'src/app/Pages/Models/UnitMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-unit-drawer',
  templateUrl: './unit-drawer.component.html',
  styleUrls: ['./unit-drawer.component.css'],
})
export class UnitDrawerComponent {
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  ngOnInit(): void { }
  public commonFunction = new CommonFunctionService();
  @Input() data: any = UnitMasterData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  resetDrawer(Unitmaster: NgForm) {
    this.data = new UnitMasterData();
    Unitmaster.form.markAsPristine();
    Unitmaster.form.markAsUntouched();
  }
  save(addNew: boolean, Unitmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.SHORT_CODE == '' ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields. ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == '' ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Unit Name', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == '' ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Short Code', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateUnit(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == 200) {
                this.message.success('Unit Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('Unit Updation Failed', '');
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
          this.api.createUnit(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code === 200) {
                this.message.success('Unit Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new UnitMasterData();
                  this.resetDrawer(Unitmaster);
                  this.api.getUnitData(1, 1, 'SEQ_NO', 'desc', '').subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.data.SEQ_NO = 1;
                        } else {
                          this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                        this.message.error('Something Went Wrong', '');
                      }
                    },
                    () => { }
                  );
                }
              } else if (successCode.code == '300') {
                this.message.error(successCode.message, '');
                this.isSpinning = false;
              } else {
                this.message.error('Unit Creation Failed', '');
              }
              this.isSpinning = false;
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
}