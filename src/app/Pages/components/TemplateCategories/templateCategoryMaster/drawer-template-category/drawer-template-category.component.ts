import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TemplateCategoryMaster } from 'src/app/Pages/Models/templateCategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-drawer-template-category',
  templateUrl: './drawer-template-category.component.html',
  styleUrls: ['./drawer-template-category.component.css']
})
export class DrawerTemplateCategoryComponent {
  @Input() data: any = TemplateCategoryMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  isOk = true;
  isStateSpinning = false;
  isFocused: string = '';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  resetDrawer(teritorymaster: NgForm) {
    this.data = new TemplateCategoryMaster();
    teritorymaster.form.markAsPristine();
    teritorymaster.form.markAsUntouched();
  }
  ngOnInit() {
    this.getCountryData();
    if (this.data.ID && this.data.COUNTRY_ID) {
      this.getStateData(this.data.COUNTRY_ID);
    }
  }

  onCountryChange(countryId: number | null): void {
    // Reset states when the country is cleared or changed
    this.data.STATE_ID = null;
    this.stateData = [];
    this.data.NAME = '';
    if (countryId) {
      this.getStateData(countryId);
    }
  }
  stateData: any = [];

  getStateData(countryId: number) {
    if (!countryId) {
      this.stateData = [];
      this.countryData = [];
      this.data.NAME = '';
      return;
    }

    this.isStateSpinning = true;
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE =1 AND COUNTRY_ID =' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.stateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.stateData = [];
            this.message.error('Failed To Get State Data', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isStateSpinning = false;
        }
      );
  }

  countryData: any = [];
  isCountrySpinning = true;
  getCountryData() {
    this.isCountrySpinning = true;
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE =1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countryData = data['data'];
            this.isCountrySpinning = false;
          } else {
            this.countryData = [];
            this.message.error('Failed to get country data', '');
            this.isCountrySpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  save(addNew: boolean, teritorymaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&

      (this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Template Category Name.', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateTemplateCategory(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Template Category Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Template Category Updation Failed', '');
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
          this.api.createTemplateCategory(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Template Category Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new TemplateCategoryMaster();
                this.resetDrawer(teritorymaster);

                this.api.getTemplateCategoryData(1, 1, 'SEQ_NO', 'desc', '').subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                      }
                    } else {
                      this.message.error('Server Not Found', '');
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
              this.isSpinning = false;
            } else {
              this.message.error(' Template Category Creation Failed', '');
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
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  ondistChange() { }
}
