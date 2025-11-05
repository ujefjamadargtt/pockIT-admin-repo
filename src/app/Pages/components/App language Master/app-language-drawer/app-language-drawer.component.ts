import { Component, Input } from '@angular/core';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NgForm } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AppLanguageData } from 'src/app/Pages/Models/ApplanguageMaster';

@Component({
  selector: 'app-app-language-drawer',
  templateUrl: './app-language-drawer.component.html',
  styleUrls: ['./app-language-drawer.component.css'],
})
export class AppLanguageDrawerComponent {
  @Input() data: any = AppLanguageData;
  @Input() drawerClose!: () => void;
  ApplicationType: string = '';
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  isSpinning = false;
  isOk = true;
  isFocused = '';

  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  resetDrawer(LanguageDrawer: NgForm) {
    this.data = new AppLanguageData();
    LanguageDrawer.form.markAsPristine();
    LanguageDrawer.form.markAsUntouched();
  }
  save(addNew: boolean, LanguageDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == 0) &&
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
      this.message.error(' Please Enter App Language Name.', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code.', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Seq No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updateAppLanguageData(this.data)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.message.success(
                  'App Language Data Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('App Language Updation Failed', '');
                this.isSpinning = false;
              }

            }, (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            });
        } else {
          this.api
            .createAppLanguageData(this.data)
            .subscribe((successCode: any) => {

              if (successCode.status == '200') {
                this.message.success('App Language Created Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  // this.data = new AppLanguageData();
                  this.resetDrawer(LanguageDrawer);
                  this.api.getAppLanguageData(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      if (data['code'] == 200) {


                        if (data['count'] == 0) {
                          this.data.SEQ_NO = 1;
                        } else {
                          this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                        this.message.error('Server Not Found.', '');
                      }
                    },
                    () => { }
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('App Language Creation Failed...', '');
                this.isSpinning = false;
              }

            }, (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            });
        }
      }
    }
  }

  close() {
    this.drawerClose();
  }
  deleteCancel() { }
  removeImage() {
    this.data.ICON = ' ';
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.ICON = ' ';

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'AppLanguageIcon/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  imageshow;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (this.data.ICON != undefined && this.data.ICON.trim() != '') {
          var arr = this.data.ICON.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload('AppLanguageIcon', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.data.ICON = this.UrlImageOne;

          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne = percentDone;
            if (this.percentImageOne == 100) {
              this.isSpinning = false;
              setTimeout(() => {
                this.progressBarImageOne = false;
              }, 2000);
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed to upload file', '');

            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.ICON = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');

              this.isSpinning = false;
              this.data.ICON = this.UrlImageOne;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.ICON = null;
            }
          }
        });
    } else {
      this.message.error('Please Select Only Image File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.ICON = null;
    }
  }
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
}
