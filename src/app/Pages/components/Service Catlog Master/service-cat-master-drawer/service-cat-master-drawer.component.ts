import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiceCatMasterData } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-service-cat-master-drawer',
  templateUrl: './service-cat-master-drawer.component.html',
  styleUrls: ['./service-cat-master-drawer.component.css']
})
export class ServiceCatMasterDrawerComponent {


  isSpinning = false;
  isOk = true;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = "";
  categoryData: any = [];
  subcategoryData: any = [];
  currencyData: any = [];
  // hours: any='00';
  // minutes: any='00';

  ngOnInit(): void {
    this.getCategoryData();
    this.getSubCategoryData();
  }


  public commonFunction = new CommonFunctionService();
  @Input() data: any = ServiceCatMasterData;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }


  getCategoryData() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {


          this.categoryData = data['data'];
        } else {
          this.categoryData = [];
          this.message.error('Failed To Get Category Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  getSubCategoryData() {
    this.api.getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {


          this.subcategoryData = data['data'];
        } else {
          this.subcategoryData = [];
          this.message.error('Failed To Get Category Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }


  resetDrawer(ServiceCatmaster: NgForm) {
    this.data = new ServiceCatMasterData();
    ServiceCatmaster.form.markAsPristine();
    ServiceCatmaster.form.markAsUntouched();
  }


  save(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.CATEGORY_ID == '' ||
        this.data.CATEGORY_ID == null ||
        this.data.CATEGORY_ID == undefined) &&
      (this.data.SUBCATEGORY_ID == '' ||
        this.data.SUBCATEGORY_ID == null ||
        this.data.SUBCATEGORY_ID == undefined) &&
      (this.data.NAME == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.CURRENCY_ID == '' ||
        this.data.CURRENCY_ID == null ||
        this.data.CURRENCY_ID == undefined) &&
      (this.data.DESCRIPTION == '' ||
        this.data.DESCRIPTION == null ||
        this.data.DESCRIPTION == undefined) &&
      (this.data.REGULAR_PRICE_B2B == '' ||
        this.data.REGULAR_PRICE_B2B == null ||
        this.data.REGULAR_PRICE_B2B == undefined) &&
      (this.data.REGULAR_PRICE_B2C == '' ||
        this.data.REGULAR_PRICE_B2C == null ||
        this.data.REGULAR_PRICE_B2C == undefined) &&
      (this.data.EXPRESS_PRICE_B2B == '' ||
        this.data.EXPRESS_PRICE_B2B == null ||
        this.data.EXPRESS_PRICE_B2B == undefined) &&
      (this.data.EXPRESS_PRICE_B2C == '' ||
        this.data.EXPRESS_PRICE_B2C == null ||
        this.data.EXPRESS_PRICE_B2C == undefined) &&
      (this.data.DURATION == '' ||
        this.data.DURATION == null ||
        this.data.DURATION == undefined) &&
      (this.data.SERVICE_IMAGE_URL == '' ||
        this.data.SERVICE_IMAGE_URL == null ||
        this.data.SERVICE_IMAGE_URL == undefined)

    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
    }
    else if (
      this.data.CATEGORY_ID == '' ||
      this.data.CATEGORY_ID == null ||
      this.data.CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Category', '');
    }
    else if (
      this.data.SUBCATEGORY_ID == '' ||
      this.data.SUBCATEGORY_ID == null ||
      this.data.SUBCATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Sub Category', '');
    }

    else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Service Name', '');
    }
    else if (
      this.data.DESCRIPTION == null ||
      this.data.DESCRIPTION == undefined ||
      this.data.DESCRIPTION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Description', '');
    }

    else if (
      this.data.REGULAR_PRICE_B2C == null ||
      this.data.REGULAR_PRICE_B2C == undefined ||
      this.data.REGULAR_PRICE_B2C == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Regular Price B2C (₹)', '');
    }
    else if (
      this.data.REGULAR_PRICE_B2B == null ||
      this.data.REGULAR_PRICE_B2B == undefined ||
      this.data.REGULAR_PRICE_B2B == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Regular Price B2B (₹)', '');
    }
    else if (
      this.data.EXPRESS_PRICE_B2C == null ||
      this.data.EXPRESS_PRICE_B2C == undefined ||
      this.data.EXPRESS_PRICE_B2C == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Express Price B2C (₹)', '');
    }
    else if (
      this.data.EXPRESS_PRICE_B2B == null ||
      this.data.EXPRESS_PRICE_B2B == undefined ||
      this.data.EXPRESS_PRICE_B2B == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Express Price B2B (₹)', '');
    }
    else if (
      this.data.DURATION == null ||
      this.data.DURATION == undefined ||
      this.data.DURATION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Estimation Time (mins)', '');
    }
    else if (
      this.data.SERVICE_IMAGE_URL == null ||
      this.data.SERVICE_IMAGE_URL == undefined ||
      this.data.SERVICE_IMAGE_URL == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Catlogue Image', '');
    }



    // if (this.isOk) {
    //   this.isSpinning = true;
    //   {
    //     if (this.data.ID) {
    //       if (this.fileURL != null && this.fileURL != "") {
    //       this.timer = this.api
    //       .onUpload("Icons", this.fileURL, this.UrlImageOne)
    //       .subscribe((res) => {
    //         this.data.SERVICE_IMAGE_URL = this.UrlImageOne;

    //         if (res.type === HttpEventType.Response) {
    //         }

    //           if (res.type == 4 && res.status == 200) {
    //           if (res.body["code"] == 200) {
    //             this.message.success("Icon Uploaded Successfully...", "");
    //             
    //             this.isSpinning = false;
    //             this.data.SERVICE_IMAGE_URL = this.UrlImageOne;


    //       this.api
    //         .updateServiceCat(this.data)
    //         .subscribe((successCode: any) => {
    //           if (successCode.code == "200") {
    //             this.message.success(
    //               "Service Catalogue Updated Successfully",
    //               ""
    //             );
    //             if (!addNew) this.drawerClose();
    //             this.isSpinning = false;
    //           } else {
    //             this.message.error("Service Catalogue Updation Failed", "");
    //             this.isSpinning = false;
    //           }
    //         });
    //       }

    //     }
    //         else if (res.type == 2 && res.status != 200) {
    //           this.message.error("Failed to upload file", "");
    //           

    //           this.isSpinning = false;
    //           this.progressBarImageOne = false;
    //           this.percentImageOne = 0;
    //           this.data.SERVICE_IMAGE_URL = null;
    //         }
    //         else {
    //           
    //           this.isSpinning = false;
    //           this.progressBarImageOne = false;
    //           this.percentImageOne = 0;
    //           this.data.SERVICE_IMAGE_URL = null;
    //         }
    //       });
    //     }
    //     else{
    //       this.api
    //       .updateServiceCat(this.data)
    //       .subscribe((successCode: any) => {
    //         if (successCode.code == "200") {
    //           this.message.success(
    //             "Service Catalogue Updated Successfully",
    //             ""
    //           );
    //           if (!addNew) this.drawerClose();
    //           this.isSpinning = false;
    //         } else {
    //           this.message.error("Service Catalogue Updation Failed", "");
    //           this.isSpinning = false;
    //         }
    //       });
    //     }
    //     } else {
    //       this.timer = this.api
    //       .onUpload("ServiceCatalog", this.fileURL, this.UrlImageOne)
    //       .subscribe((res) => {
    //         this.data.SERVICE_IMAGE_URL = this.UrlImageOne;

    //         if (res.type === HttpEventType.Response) {
    //         }

    //           if (res.type == 4 && res.status == 200) {
    //           if (res.body["code"] == 200) {
    //             this.message.success("Icon Uploaded Successfully...", "");
    //             
    //             this.isSpinning = false;
    //             this.data.SERVICE_IMAGE_URL = this.UrlImageOne;

    //       this.api
    //         .createServiceCat(this.data)
    //         .subscribe((successCode: any) => {
    //           if (successCode.code == "200") {
    //             this.message.success(
    //               "Service Catalogue Created Successfully",
    //               ""
    //             );
    //             if (!addNew) this.drawerClose();
    //             else {
    //               this.data = new ServiceCatMasterData();
    //               this.resetDrawer(ServiceCatmaster);

    //             }
    //             this.isSpinning = false;
    //           } else {
    //             this.message.error("Service Catalogue Creation Failed", "");
    //             this.isSpinning = false;
    //           }
    //         });
    //       }
    //     }
    //     else if (res.type == 2 && res.status != 200) {
    //       this.message.error("Failed to upload file", "");
    //       

    //       this.isSpinning = false;
    //       this.progressBarImageOne = false;
    //       this.percentImageOne = 0;
    //       this.data.SERVICE_IMAGE_URL = null;
    //     }
    //     else {
    //       
    //       this.isSpinning = false;
    //       this.progressBarImageOne = false;
    //       this.percentImageOne = 0;
    //       this.data.SERVICE_IMAGE_URL = null;
    //     }
    //   });
    //     }
    //   }
    // }

    if (this.isOk) {
      this.isSpinning = true;

      {


        if (this.data.ID) {
          this.api.updateServiceCat(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Service Catalogue Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Service Catalogue Updation Failed', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createServiceCat(this.data).subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Service Catalogue Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new ServiceCatMasterData();
                this.resetDrawer(ServiceCatmaster);


              }
              this.isSpinning = false;
            } else {
              this.message.error(' Service Catalogue Creation Failed', '');
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
        if (this.data.SERVICE_IMAGE_URL != undefined && this.data.SERVICE_IMAGE_URL.trim() != "") {
          var arr = this.data.SERVICE_IMAGE_URL.split("/");
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload("ServiceCatalog", this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.data.SERVICE_IMAGE_URL = this.UrlImageOne;

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
            this.message.error("Failed To Upload Icon...", "");


            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.SERVICE_IMAGE_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body["code"] == 200) {
              this.message.success("Icon Uploaded Successfully...", "");

              this.isSpinning = false;
              this.data.SERVICE_IMAGE_URL = this.UrlImageOne;
            } else {

              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.data.SERVICE_IMAGE_URL = null;
            }


          }
        });
    } else {
      this.message.error("Please Select Only Image File", "");
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.SERVICE_IMAGE_URL = null;
    }
  }
  viewImage(imageURL: string): void {


    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = "";

  GetImage(link: string) {

    let imagePath = this.api.retriveimgUrl + "ServiceCatalog/" + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;


    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }


  image1DeleteConfirm(data: any) {


    this.UrlImageOne = null;
    this.data.SERVICE_IMAGE_URL = " ";

    this.fileURL = null;
  }
  deleteCancel() { }


  removeImage() {
    this.data.URL = " ";
    this.data.SERVICE_IMAGE_URL = " ";
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }


  imageshow;


}
