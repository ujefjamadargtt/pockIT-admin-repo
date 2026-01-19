import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { CustmoerCategoryData } from 'src/app/Pages/Models/CustomerCategoryMaster';
@Component({
  selector: 'app-customer-category-master-drawer',
  templateUrl: './customer-category-master-drawer.component.html',
  styleUrls: ['./customer-category-master-drawer.component.css'],
})
export class CustomerCategoryMasterDrawerComponent {
  @Input() data: any = CustmoerCategoryData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isFocused: string = '';
  isOk = true;
  resetDrawer(CategoryDrawer: NgForm) {
    this.data = new CustmoerCategoryData();
    CategoryDrawer.form.markAsPristine();
    CategoryDrawer.form.markAsUntouched();
  }
  save(addNew: boolean, CountryDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Customer Category Name.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateCustomerCategeroyData(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Customer Category Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Customer Category Updation Failed', '');
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
          this.api.CreateCustomerCategeroyData(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Customer Category Created Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                else {
                  this.data = new CustmoerCategoryData();
                  this.resetDrawer(CountryDrawer);
                  this.api.getAllCountryMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NO = 1;
                      } else {
                        this.data.SEQUENCE_NO =
                          data['data'][0]['SEQUENCE_NO'] + 1;
                      }
                    },
                    () => { }
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Customer Category Creation Failed...', '');
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
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
}
