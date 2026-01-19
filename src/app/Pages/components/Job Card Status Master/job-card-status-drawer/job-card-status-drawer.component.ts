import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { JobCardMasterData } from 'src/app/Pages/Models/JobCardMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-job-card-status-drawer',
  templateUrl: './job-card-status-drawer.component.html',
  styleUrls: ['./job-card-status-drawer.component.css'],
})
export class JobCardStatusDrawerComponent {
  isSpinning = false;
  isOk = true;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any;
  isFocused: string = '';
  ngOnInit(): void { }
  public commonFunction = new CommonFunctionService();
  @Input() data: any = JobCardMasterData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  resetDrawer(JobCardStatusmaster: NgForm) {
    this.data = new JobCardMasterData();
    JobCardStatusmaster.form.markAsPristine();
    JobCardStatusmaster.form.markAsUntouched();
  }
  selectedFile: any;
  imagePreview: any;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; 
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        this.selectedFile = input.files[0];
        if (this.selectedFile.size > maxFileSize) {
          this.message.error('Icon size should not exceed 1MB.', '');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width !== 128 || img.height !== 128) {
              this.message.error('Icon dimensions must be 128x128 pixels.', '');
              this.fileURL = null;
              this.selectedFile = null;
              return;
            }
            this.imagePreview = e.target.result; 
            this.fileURL = this.selectedFile;
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = d == null ? '' : d + number + '.' + fileExt;
            if (this.data.ICON != undefined && this.data.ICON.trim() !== '') {
              var arr = this.data.ICON.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }
            this.UrlImageOne = url;
            this.progressBarImageOne = true;
            this.urlImageOneShow = true;
            this.data.ICON = this.UrlImageOne;
          };
          img.onerror = () => {
            this.message.error('Invalid Icon file.', '');
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.message.error(
        'Please select a valid image file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.ICON = null;
    }
  }
  save(addNew: boolean, JobCardStatusmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.DESCRIPTION == '' ||
        this.data.DESCRIPTION == null ||
        this.data.DESCRIPTION == undefined) &&
      (this.data.ICON == '' ||
        this.data.ICON == null ||
        this.data.ICON == undefined)
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
      this.message.error(' Please Enter Job Status Title', '');
    } else if (
      this.data.ICON == null ||
      this.data.ICON == undefined ||
      this.data.ICON == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Job Icon', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.DESCRIPTION == '') {
        this.data.DESCRIPTION = "-";
      }
      {
        if (
          this.fileURL != undefined &&
          this.fileURL != null &&
          this.data.ICON != undefined &&
          this.data.ICON != null
        ) {
          this.IconUpload();
        }
        if (this.data.ID) {
          this.api.updateJobCardStatus(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Job Status Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Job Status Not Updated', '');
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
          this.api.createJobCardStatus(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Job Status Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new JobCardMasterData();
                  this.resetDrawer(JobCardStatusmaster);
                }
                this.isSpinning = false;
              } else {
                this.message.error('Job Status Not Saved', '');
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
  IconUpload() {
    this.timer = this.api
      .onUpload('JobCardStatusIcon', this.fileURL, this.UrlImageOne)
      .subscribe((res) => {
        this.data.ICON = this.UrlImageOne;
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percentImageOne = percentDone;
          if (this.percentImageOne == 100) {
            this.isSpinning = false;
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload Job Status Icon...', '');
          this.isSpinning = false;
          this.progressBarImageOne = false;
          this.percentImageOne = 0;
          this.data.ICON = null;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
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
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  imageshow: any = null;
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'JobCardStatusIcon/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = imagePath;
    this.ImageModalVisible = true;
  }
  IconDeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.ICON = ' ';
    this.fileURL = null;
  }
  deleteCancel() { }
  removeImage() {
    this.data.ICON = ' ';
    this.fileURL = null;
    this.imageshow = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
}
