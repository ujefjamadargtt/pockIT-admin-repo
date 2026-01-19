import { Component, Input } from '@angular/core'; 
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ServiceItemMaster } from 'src/app/Pages/Models/ServiceItemMaster';
@Component({
  selector: 'app-service-item-master-add',
  templateUrl: './service-item-master-add.component.html',
  styleUrls: ['./service-item-master-add.component.css']
})
export class ServiceItemMasterAddComponent {
  @Input() data: any = ServiceItemMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  isOk = true;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = "";
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(){
    this.getServiceData();
  }
  resetDrawer(Servicemaster: NgForm) {
    this.data = new ServiceItemMaster();
    Servicemaster.form.markAsPristine();
    Servicemaster.form.markAsUntouched();
  }
  serviceData: any = [];
  getServiceData() {
    this.api.getServiceCatData(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.serviceData = data['data'];
        } else {
          this.serviceData = [];
          this.message.error('Failed To Get Service Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  save(addNew: boolean, Servicemaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.SERVICE_CATLOG_ID == undefined ||
        this.data.SERVICE_CATLOG_ID == null ||
        this.data.SERVICE_CATLOG_ID == 0) &&
        (this.data.DESCRIPTION == ' ' ||
        this.data.DESCRIPTION == null ||
        this.data.DESCRIPTION == undefined) &&
        (this.data.PRICE_B2B== ' ' ||
        this.data.PRICE_B2B == null ||
        this.data.PRICE_B2B == undefined) &&
        (this.data.PRICE_B2C== ' ' ||
        this.data.PRICE_B2C == null ||
        this.data.PRICE_B2C == undefined) &&
        (this.data.EXPRESS_PRICE_FOR_B2B == ' ' ||
        this.data.EXPRESS_PRICE_FOR_B2B == null ||
        this.data.EXPRESS_PRICE_FOR_B2B == undefined) &&
        (this.data.EXPRESS_PRICE_FOR_B2C == ' ' ||
        this.data.EXPRESS_PRICE_FOR_B2C == null ||
        this.data.EXPRESS_PRICE_FOR_B2C == undefined) &&
        (this.data.AVERAGE_TECHNICIAN_COST == ' ' ||
        this.data.AVERAGE_TECHNICIAN_COST == null ||
        this.data.AVERAGE_TECHNICIAN_COST == undefined) &&
        (this.data.AVERAGE_VENDOR_COST == ' ' ||
        this.data.AVERAGE_VENDOR_COST == null ||
        this.data.AVERAGE_VENDOR_COST == undefined) &&
        (this.data.TIME_ESTIMATE == undefined ||
          this.data.TIME_ESTIMATE == null ||
          this.data.TIME_ESTIMATE == 0)&&
        (this.data.MAX_STOCK_QUANTITY == undefined ||
          this.data.MAX_STOCK_QUANTITY == null ||
          this.data.MAX_STOCK_QUANTITY == 0)&&
          (
            this.data.SHORT_CODE == null ||
            this.data.SHORT_CODE == undefined ||
            this.data.SHORT_CODE == 0
          )&&
      (this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } 
    else if (this.data.SERVICE_CATLOG_ID == undefined ||
      this.data.SERVICE_CATLOG_ID == null ||
      this.data.SERVICE_CATLOG_ID == 0)
       {
      this.isOk = false;
      this.message.error('Please Select Service.', '');
    }  
    else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Service Item Name.', '');
    }
    else if(this.data.DESCRIPTION == ' '||
    this.data.DESCRIPTION == null ||
    this.data.DESCRIPTION == undefined) {
      this.isOk = false;
      this.message.error(' Please Enter Description.', '');
    }
    else if(this.data.PRICE_B2B == ' '||
    this.data.PRICE_B2B == null ||
    this.data.PRICE_B2B == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Price B2B.', '');
    }
    else if(this.data.PRICE_B2C == ' ' ||
    this.data.PRICE_B2C == null ||
    this.data.PRICE_B2C == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Price B2C.', '');
    }
    else if(this.data.EXPRESS_PRICE_FOR_B2B == ' '||
    this.data.EXPRESS_PRICE_FOR_B2B == null ||
    this.data.EXPRESS_PRICE_FOR_B2B == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Express Price For B2B.', '');
    }
    else if(this.data.EXPRESS_PRICE_FOR_B2C == ' '||
    this.data.EXPRESS_PRICE_FOR_B2C == null ||
    this.data.EXPRESS_PRICE_FOR_B2C == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Express Price For B2C.', '');
    }
    else if (this.data.AVERAGE_TECHNICIAN_COST == ' '||
    this.data.AVERAGE_TECHNICIAN_COST == null ||
    this.data.AVERAGE_TECHNICIAN_COST == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Average Technician Cost.', '');
    }
    else if(this.data.AVERAGE_VENDOR_COST == ' '||
    this.data.AVERAGE_VENDOR_COST == null ||
    this.data.AVERAGE_VENDOR_COST == undefined){
      this.isOk = false;
      this.message.error(' Please Enter Average Vendor Cost.', '');
    }
    else if(this.data.MAX_STOCK_QUANTITY == undefined ||
      this.data.MAX_STOCK_QUANTITY == null ||
      this.data.MAX_STOCK_QUANTITY == 0){
      this.isOk = false;
      this.message.error(' Please Enter Max Order Quantity.', '');
    }
    else if(this.data.TIME_ESTIMATE == undefined ||
      this.data.TIME_ESTIMATE == null ||
      this.data.TIME_ESTIMATE == 0){
      this.isOk = false;
      this.message.error(' Please Enter Estimated Service Time.', '');
    }
    else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    }
    else if (
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
          this.api.updateServiceItem(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Service Item Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Service Item Updation Failed', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createServiceItem(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Service Item Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new ServiceItemMaster();
                this.resetDrawer(Servicemaster);
                this.api.getServiceItem(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
                  () => {}
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Service Item Creation Failed', '');
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
  deleteCancel() {}
  removeImage() {
    this.data.ITEM_IMAGE_URL = " ";
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.ITEM_IMAGE_URL = " ";
    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = "";
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + "Item/" + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  imageshow;
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (
      event.target.files[0].type == "image/jpeg" ||
      event.target.files[0].type == "image/jpg" ||
      event.target.files[0].type == "image/png"
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error("File size should not exceed 1MB.", "");
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split(".").pop();
        var d = this.datePipe.transform(new Date(), "yyyyMMdd");
        var url = "";
        url = d == null ? "" : d + number + "." + fileExt;
        this.UrlImageOne = url;
        if (this.data.ITEM_IMAGE_URL != undefined && this.data.ITEM_IMAGE_URL.trim() != "") {
          var arr = this.data.ITEM_IMAGE_URL.split("/");
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload("Item", this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.data.ITEM_IMAGE_URL = this.UrlImageOne;
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
            this.message.error("Failed To Upload Image...", "");
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.ITEM_IMAGE_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body["code"] == 200) {
              this.message.success("Image Uploaded Successfully...", "");
              this.isSpinning = false;
              this.data.ITEM_IMAGE_URL = this.UrlImageOne;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.ITEM_IMAGE_URL = null;
            }
          }
        });
    } else {
      this.message.error("Please Select Only Image File", "");
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.ITEM_IMAGE_URL = null;
    }
  }
}
