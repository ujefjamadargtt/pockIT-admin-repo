import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { orderStatusData } from 'src/app/Pages/Models/orderStatusData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-order-status-drawer',
  templateUrl: './order-status-drawer.component.html',
  styleUrls: ['./order-status-drawer.component.css'],
})
export class OrderStatusDrawerComponent {
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
  @Input() data: any = orderStatusData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  resetDrawer(OrderStatusmaster: NgForm) {
    this.data = new orderStatusData();
    OrderStatusmaster.form.markAsPristine();
    OrderStatusmaster.form.markAsUntouched();
    this.data.ICON = '';
    this.data.ICON = null;
    this.fileURL = '';
  }

  save(addNew: boolean, OrderStatusmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == '' ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Status Title', '');
    } else if (
      this.data.ICON == null ||
      this.data.ICON == undefined ||
      this.data.ICON == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Order Status Icon', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
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
          this.api.updateOrderStatus(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Order Status Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Order Status Not Updated', '');
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
          this.api.createOrderStatus(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Order Status Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new orderStatusData();
                  this.resetDrawer(OrderStatusmaster);
                  this.data.ICON = '';
                  this.data.ICON = null;
                  this.fileURL = '';
                }
                this.isSpinning = false;
              } else {
                this.message.error('Order Status Not Saved', '');
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

    // if (this.isOk) {
    //   this.isSpinning = true;
    //   {
    //     if (this.data.ID) {
    //       if (this.fileURL != null && this.fileURL != "") {
    //       this.timer = this.api
    //       .onUpload("Icons", this.fileURL, this.UrlImageOne)
    //       .subscribe((res) => {
    //         this.data.ICON = this.UrlImageOne;

    //         if (res.type === HttpEventType.Response) {
    //         }

    //           if (res.type == 4 && res.status == 200) {
    //           if (res.body["code"] == 200) {
    //             this.message.success("File Uploaded Successfully...", "");
    //
    //             this.isSpinning = false;
    //             this.data.ICON = this.UrlImageOne;

    //       this.api
    //         .updateOrderStatus(this.data)
    //         .subscribe((successCode: any) => {
    //           if (successCode.code == "200") {
    //             this.message.success(
    //               "Order Status Updated Successfully",
    //               ""
    //             );
    //             if (!addNew) this.drawerClose();
    //             this.isSpinning = false;
    //           } else {
    //             this.message.error("Order Status Updation Failed", "");
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
    //           this.data.ICON = null;
    //         }
    //         else {
    //
    //           this.isSpinning = false;
    //           this.progressBarImageOne = false;
    //           this.percentImageOne = 0;
    //           this.data.ICON = null;
    //         }
    //       });
    //     }
    //     else{
    //       this.api
    //       .updateOrderStatus(this.data)
    //       .subscribe((successCode: any) => {
    //         if (successCode.code == "200") {
    //           this.message.success(
    //             "Order Status Updated Successfully",
    //             ""
    //           );
    //           if (!addNew) this.drawerClose();
    //           this.isSpinning = false;
    //         } else {
    //           this.message.error("Order Status Updation Failed", "");
    //           this.isSpinning = false;
    //         }
    //       });
    //     }
    //     } else {
    //       this.timer = this.api
    //       .onUpload("Icons", this.fileURL, this.UrlImageOne)
    //       .subscribe((res) => {
    //         this.data.ICON = this.UrlImageOne;

    //         if (res.type === HttpEventType.Response) {
    //         }

    //           if (res.type == 4 && res.status == 200) {
    //           if (res.body["code"] == 200) {
    //             this.message.success("File Uploaded Successfully...", "");
    //
    //             this.isSpinning = false;
    //             this.data.ICON = this.UrlImageOne;

    //       this.api
    //         .createOrderStatus(this.data)
    //         .subscribe((successCode: any) => {
    //           if (successCode.code == "200") {
    //             this.message.success(
    //               "Order Status Created Successfully",
    //               ""
    //             );
    //             if (!addNew) this.drawerClose();
    //             else {
    //               this.data = new orderMasterData();
    //               this.resetDrawer(OrderStatusmaster);
    //             }
    //             this.isSpinning = false;
    //           } else {
    //             this.message.error(" Order Status Creation Failed", "");
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
    //       this.data.ICON = null;
    //     }
    //     else {
    //
    //       this.isSpinning = false;
    //       this.progressBarImageOne = false;
    //       this.percentImageOne = 0;
    //       this.data.ICON = null;
    //     }
    //   });
    //     }
    //   }
    // }
  }

  close() {
    this.drawerClose();
  }

  imageshow: any = null;
  selectedFile: any;
  imagePreview: any;

  // onFileSelected(event: any) {
  //   const maxFileSize = 1 * 1024 * 1024;

  //   if (
  //     event.target.files[0].type == "image/jpeg" ||
  //     event.target.files[0].type == "image/jpg" ||
  //     event.target.files[0].type == "image/png"
  //   ) {
  //     this.fileURL = <File>event.target.files[0];
  //     const input = event.target as HTMLInputElement;

  //     if (input?.files?.length) {
  //       this.selectedFile = input.files[0];

  //       // Generate a preview of the selected image
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.imagePreview = reader.result; // Base64 image data
  //       };
  //       reader.readAsDataURL(this.selectedFile);
  //     }

  //     if (this.fileURL.size > maxFileSize) {
  //       this.message.error("Icon size should not exceed 1MB.", "");
  //       return;
  //     }
  //     if (this.fileURL != null) {
  //       var number = Math.floor(100000 + Math.random() * 900000);
  //       var fileExt = this.fileURL.name.split(".").pop();
  //       var d = this.datePipe.transform(new Date(), "yyyyMMdd");
  //       var url = "";
  //       url = d == null ? "" : d + number + "." + fileExt;
  //       this.UrlImageOne = url;
  //       if (this.data.ICON != undefined && this.data.ICON.trim() != "") {
  //         var arr = this.data.ICON.split("/");
  //         if (arr.length > 1) {
  //           url = arr[5];
  //         }
  //       }
  //     }
  //     this.progressBarImageOne = true;
  //     this.urlImageOneShow = true;
  //     // this.isSpinning = true;
  //     // this.timer = this.api
  //     //   .onUpload("OrderStatusIcon", this.fileURL, this.UrlImageOne)
  //     //   .subscribe((res) => {
  //     this.data.ICON = this.UrlImageOne;

  //     //     if (res.type === HttpEventType.Response) {
  //     //     }
  //     //     if (res.type === HttpEventType.UploadProgress) {
  //     //       const percentDone = Math.round((100 * res.loaded) / res.total);
  //     //       this.percentImageOne = percentDone;
  //     //       if (this.percentImageOne == 100) {
  //     //         this.isSpinning = false;
  //     //       }
  //     //     } else if (res.type == 2 && res.status != 200) {
  //     //       this.message.error("Failed To Upload Order Status Icon...", "");
  //     //       this.isSpinning = false;
  //     //       this.progressBarImageOne = false;
  //     //       this.percentImageOne = 0;
  //     //       this.data.ICON = null;
  //     //     } else if (res.type == 4 && res.status == 200) {
  //     //       if (res.body["code"] == 200) {
  //     //         this.message.success("Order Status Icon Uploaded Successfully...", "");
  //     //         this.isSpinning = false;
  //     //         this.data.ICON = this.UrlImageOne;
  //     //       } else {
  //     //         this.isSpinning = false;
  //     //         this.progressBarImageOne = false;
  //     //         this.percentImageOne = 0;
  //     //         this.data.ICON = null;
  //     //       }
  //     //     }
  //     //   });
  //   } else {
  //     this.message.error("Please Select Only Image Order Status Icon", "");
  //     this.fileURL = null;
  //     this.isSpinning = false;
  //     this.progressBarImageOne = false;
  //     this.percentImageOne = 0;
  //     this.data.ICON = null;
  //   }
  // }

  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB

    // Check file type
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;

      if (input?.files?.length) {
        this.selectedFile = input.files[0];

        // Validate file size
        if (this.selectedFile.size > maxFileSize) {
          this.message.error('Icon size should not exceed 1MB.', '');
          return;
        }

        // Read the file to validate dimensions
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            // Validate dimensions
            if (img.width !== 128 || img.height !== 128) {
              this.message.error('Icon dimensions must be 128x128 pixels.', '');
              this.fileURL = null;
              this.selectedFile = null;
              return;
            }

            // If valid, set preview and proceed
            this.imagePreview = e.target.result; // Base64 image data
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

          // Set the image source to trigger dimension validation
          img.src = e.target.result;
        };

        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.message.error(
        'Please select a valid Icon file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.ICON = null;
    }
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';

  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'OrderStatusIcon/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = imagePath;

    // Display the modal only after setting the image URL
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

  IconUpload() {
    this.timer = this.api
      .onUpload('OrderStatusIcon', this.fileURL, this.UrlImageOne)
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
          this.message.error('Failed To Upload Order Status Icon...', '');
          this.isSpinning = false;
          this.progressBarImageOne = false;
          this.percentImageOne = 0;
          this.data.ICON = null;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            // this.message.success(
            //   "Order Status Icon Uploaded Successfully...",
            //   ""
            // );
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
}
