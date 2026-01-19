import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LanguageMasterData } from 'src/app/Pages/Models/LanguageMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-language-master-drawer',
  templateUrl: './language-master-drawer.component.html',
  styleUrls: ['./language-master-drawer.component.css'],
})
export class LanguageMasterDrawerComponent {
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  ngOnInit(): void { }
  public commonFunction = new CommonFunctionService();
  @Input() data: any = LanguageMasterData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  resetDrawer(Languagemaster: NgForm) {
    this.data = new LanguageMasterData();
    Languagemaster.form.markAsPristine();
    Languagemaster.form.markAsUntouched();
  }
  save(addNew: boolean, Languagemaster: NgForm): void {
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
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == '' ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Language', '');
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
      this.message.error(' Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateLanguage(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == 200) {
                this.message.success('Language Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.info('A language with the same short code already exists.', '');
                this.isSpinning = false;
              } else {
                this.message.error('Language Updation Failed', '');
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
          this.api.createLanguage(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code === 200) {
                this.message.success('Language Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new LanguageMasterData();
                  this.resetDrawer(Languagemaster);
                  this.api
                    .getLanguageData(1, 1, 'SEQ_NO', 'desc', '')
                    .subscribe(
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
                      (err) => {
                        this.message.error(
                          'Something went wrong, please try again later',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    );
                }
              } else if (successCode.code == '300') {
                this.message.info('A language with the same short code already exists.', '');
                this.isSpinning = false;
              } else {
                this.message.error('Language Creation Failed', '');
              }
              this.isSpinning = false;
            },
            (error) => {
              this.message.error(
                'An error occurred while creating the Language.',
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
