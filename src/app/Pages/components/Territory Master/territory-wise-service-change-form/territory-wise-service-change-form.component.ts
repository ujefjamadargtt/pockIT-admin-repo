import { DatePipe } from "@angular/common";
import { HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ServiceCatMasterDataNewNon } from "src/app/Pages/Models/ServiceCatMasterData";
import { TerritoryMaster } from "src/app/Pages/Models/TerritoryMaster";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
@Component({
  selector: "app-territory-wise-service-change-form",
  templateUrl: "./territory-wise-service-change-form.component.html",
  styleUrls: ["./territory-wise-service-change-form.component.css"],
  providers: [DatePipe],
})
export class TerritoryWiseServiceChangeFormComponent implements OnInit {
  uniteDta: any = [];
  taxData: any = [];
  isFocused: string = "";
  isSpinning = false;
  isOk = true;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = "";
  subcategoryData: any = [];
  currencyData: any = [];
  @Input() data: any = ServiceCatMasterDataNewNon;
  @Input() terittorydata: any = TerritoryMaster;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() servicename: any;
  @Input() editclick: any;
  organizationid: any = sessionStorage.getItem("orgId");
  IS_AVAILABLE: boolean = true;
  CAN_CHANGE_SERVICE_PRICE1: any = sessionStorage.getItem(
    "CAN_CHANGE_SERVICE_PRICE"
  );
  CAN_CHANGE_SERVICE_PRICE_STATUS: any = 0;
  servicemaindata: any;
  ngOnInit(): void {
    this.organizationid = sessionStorage.getItem("orgId");
    this.data.ORG_ID = 1
    this.CAN_CHANGE_SERVICE_PRICE1 = sessionStorage.getItem(
      "CAN_CHANGE_SERVICE_PRICE"
    );
    this.CAN_CHANGE_SERVICE_PRICE_STATUS = this.CAN_CHANGE_SERVICE_PRICE1
      ? this.commonFunction.decryptdata(this.CAN_CHANGE_SERVICE_PRICE1)
      : 0;
    if (this.editclick == "Y") {
      this.data.IS_AVAILABLE = this.data.IS_AVAILABLE;
      this.api
        .getServiceItem(0, 0, "", "", " AND ID=" + this.data.SERVICE_ID)
        .subscribe(
          (data) => {
            if (data["code"] == 200) {
              this.servicemaindata = data["data"][0];
            } else {
            }
          },
          (err: HttpErrorResponse) => { }
        );
    } else {
      this.data.IS_AVAILABLE = true;
      this.api
        .getServiceItem(0, 0, "", "", " AND ID=" + this.data.ID)
        .subscribe(
          (data) => {
            if (data["code"] == 200) {
              this.servicemaindata = data["data"][0];
            } else {
            }
          },
          (err: HttpErrorResponse) => { }
        );
    }
  }
  public commonFunction = new CommonFunctionService();
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  disableBeforeCurrentHour = (): number[] => {
    const hours: number[] = [];
    for (let i = 0; i < this.currentHour; i++) {
      hours.push(i);
    }
    return hours;
  };
  disableBeforeCurrentMinutes = (selectedHour: number): number[] => {
    const minutes: number[] = [];
    if (selectedHour === this.currentHour) {
      for (let i = 0; i < this.currentMinute; i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };
  disableBeforeStartHour = (): number[] => {
    if (!this.data.START_TIME) {
      return [];
    }
    const startHour = this.data.START_TIME.getHours();
    const hours: number[] = [];
    for (let i = 0; i <= startHour; i++) {
      hours.push(i);
    }
    return hours;
  };
  disableBeforeStartMinutes = (selectedHour: number): number[] => {
    if (!this.data.START_TIME) {
      return [];
    }
    const startHour = this.data.START_TIME.getHours();
    const startMinute = this.data.START_TIME.getMinutes();
    const minutes: number[] = [];
    if (selectedHour === startHour) {
      for (let i = 0; i <= startMinute; i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };
  disableStartHours: () => number[] = () => [];
  disableStartMinutes: (hour: number) => number[] = () => [];
  disableEndHours: () => number[] = () => [];
  disableEndMinutes: (hour: number) => number[] = () => [];
  orgStartHour: number = 0;
  orgStartMinute: number = 0;
  orgEndHour: number = 23;
  orgEndMinute: number = 59;
  getSubCategoryData() {
    this.api.getcategoryhierarchy().subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.subcategoryData = data["data"];
        } else {
          this.subcategoryData = [];
          this.message.error("Failed To Get Category Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
    this.api
      .getAllOrganizations(1, 1, "", "desc", " AND ID=1")
      .subscribe((data) => {
        if (data["status"] == 200) {
          if (data['body'].count > 0) {
            if (data['body']["data"][0].DAY_START_TIME) {
              const startParts = data['body']["data"][0].DAY_START_TIME.split(":");
              this.orgStartHour = +startParts[0];
              this.orgStartMinute = +startParts[1];
              if (!this.data.ID) {
                this.data.START_TIME = new Date().setHours(
                  this.orgStartHour,
                  this.orgStartMinute,
                  0
                );
              }
            }
            if (data['body']["data"][0].DAY_END_TIME) {
              const endParts = data['body']["data"][0].DAY_END_TIME.split(":");
              this.orgEndHour = +endParts[0];
              this.orgEndMinute = +endParts[1];
              if (!this.data.ID) {
                this.data.END_TIME = new Date().setHours(
                  this.orgEndHour,
                  this.orgEndMinute,
                  0
                );
              }
            }
            this.initializeTimeRestrictions();
            if (data['body'].count > 0 && !this.data.ID) {
              if (
                data['body']["data"][0].DAY_START_TIME != undefined &&
                data['body']["data"][0].DAY_START_TIME != null &&
                data['body']["data"][0].DAY_START_TIME != ""
              ) {
                const today = new Date();
                const timeParts = data['body']["data"][0].DAY_START_TIME.split(":"); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.START_TIME = new Date(today);
                }
              }
              if (
                data['body']["data"][0].DAY_END_TIME != undefined &&
                data['body']["data"][0].DAY_END_TIME != null &&
                data['body']["data"][0].DAY_END_TIME != ""
              ) {
                const today = new Date();
                const timeParts = data['body']["data"][0].DAY_END_TIME.split(":"); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.END_TIME = new Date(today);
                }
              }
            }
          }
        }
      });
  }
  initializeTimeRestrictions() {
    this.disableStartHours = () =>
      Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < this.orgStartHour || hour > this.orgEndHour
      );
    this.disableStartMinutes = (hour: number) =>
      hour === this.orgStartHour
        ? Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute < this.orgStartMinute
        )
        : hour === this.orgEndHour
          ? Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute > this.orgEndMinute
          )
          : [];
    this.disableEndHours = () => {
      const startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour || hour > this.orgEndHour
      );
    };
    this.disableEndMinutes = (hour: number) => {
      const startHour = this.getStartHour();
      const startMinute = this.getStartMinute();
      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
  }
  getStartHour() {
    return this.data.START_TIME
      ? new Date(this.data.START_TIME).getHours()
      : this.orgStartHour;
  }
  getStartMinute() {
    return this.data.START_TIME
      ? new Date(this.data.START_TIME).getMinutes()
      : this.orgStartMinute;
  }
  onStartTimeChange() {
    this.data.END_TIME = null;
    const selectedTime = new Date(this.data.START_TIME);
    this.data.START_TIME = this.roundMinutesToNearestInterval(selectedTime);
    this.initializeTimeRestrictions();
  }
  roundMinutesToNearestInterval(date: Date): Date {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 10) * 10;
    let finalHour = date.getHours();
    let finalMinutes = roundedMinutes;
    if (roundedMinutes >= 60) {
      finalMinutes = 0;
      finalHour = (finalHour + 1) % 24; 
    }
    const roundedDate = new Date(date);
    roundedDate.setHours(finalHour);
    roundedDate.setMinutes(finalMinutes);
    roundedDate.setSeconds(0);
    return roundedDate;
  }
  resetDrawer(ServiceCatmaster: NgForm) {
    this.data = new ServiceCatMasterDataNewNon();
    this.data.ORG_ID = 1
    ServiceCatmaster.form.markAsPristine();
    ServiceCatmaster.form.markAsUntouched();
  }
  getUnits() {
    this.api
      .getUnitData(0, 0, "ID", "desc", " AND IS_ACTIVE =1")
      .subscribe((data) => {
        if (data.code == 200) {
          this.uniteDta = data["data"];
        } else {
          this.uniteDta = [];
        }
      });
    this.api
      .getTaxData(0, 0, "ID", "desc", " AND IS_ACTIVE =1")
      .subscribe((data) => {
        if (data.code == 200) {
          this.taxData = data["data"];
        } else {
          this.taxData = [];
        }
      });
  }
  changeAmount(event: any) {
    if (event == "B") {
      this.data.B2C_PRICE = null;
    } else if (event == "C") {
      this.data.B2B_PRICE = null;
    } else {
    }
  }
  restrictMinutes(event: any): void {
    const input = event.target.value;
    if (input > 59) {
      event.target.value = 59; 
      this.data.PREPARATION_MINUTES = 59; 
    } else if (input < 0) {
      event.target.value = ""; 
      this.data.PREPARATION_MINUTES = null;
    } else {
      this.data.PREPARATION_MINUTES = input; 
    }
  }
  restrictMinutes1(event: any): void {
    const input = event.target.value;
    if (input > 59) {
      event.target.value = 59; 
      this.data.DURARTION_MIN = 59; 
    } else if (input < 0) {
      event.target.value = ""; 
      this.data.DURARTION_MIN = null;
    } else {
      this.data.DURARTION_MIN = input; 
    }
  }
  restrictHours(event: any): void {
    const input = event.target.value;
    if (input > 24) {
      event.target.value = 24; 
      this.data.DURARTION_HOUR = 24; 
    } else if (input < 0) {
      event.target.value = ""; 
      this.data.DURARTION_HOUR = null;
    } else {
      this.data.DURARTION_HOUR = input; 
    }
  }
  restrictHours1(event: any): void {
    const input = event.target.value;
    if (input > 24) {
      event.target.value = 24; 
      this.data.PREPARATION_HOURS = 24; 
    } else if (input < 0) {
      event.target.value = ""; 
      this.data.PREPARATION_HOURS = null;
    } else {
      this.data.PREPARATION_HOURS = input; 
    }
  }
  save(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.SERVICE_TYPE == "C" || this.data.SERVICE_TYPE == "O") &&
      (this.data.B2C_PRICE == null ||
        this.data.B2C_PRICE == undefined ||
        this.data.B2C_PRICE == "" ||
        this.data.B2C_PRICE <= 0)
    ) {
      this.isOk = false;
      this.message.error(" Please enter service price for B2C (₹)", "");
    } else if (
      (this.data.SERVICE_TYPE == "B" || this.data.SERVICE_TYPE == "O") &&
      (this.data.B2B_PRICE === null ||
        this.data.B2B_PRICE === undefined ||
        this.data.B2B_PRICE === "")
    ) {
      this.isOk = false;
      this.message.error(" Please enter service price for B2B (₹)", "");
    } else if (
      this.data.TECHNICIAN_COST === null ||
      this.data.TECHNICIAN_COST === undefined ||
      this.data.TECHNICIAN_COST === ""
    ) {
      this.isOk = false;
      this.message.error(" Please enter technician cost", "");
    } else if (
      this.data.VENDOR_COST === null ||
      this.data.VENDOR_COST === undefined ||
      this.data.VENDOR_COST === ""
    ) {
      this.isOk = false;
      this.message.error(" Please enter vendor cost", "");
    } else if (
      this.servicemaindata.IS_EXPRESS &&
      this.terittorydata.IS_EXPRESS_SERVICE_AVAILABLE &&
      (this.data.EXPRESS_COST == null ||
        this.data.EXPRESS_COST == undefined ||
        this.data.EXPRESS_COST == "" ||
        this.data.EXPRESS_COST <= 0)
    ) {
      this.isOk = false;
      this.message.error(" Please enter express service price for B2C (₹)", "");
    } else if (
      this.data.START_TIME == undefined ||
      this.data.START_TIME == null ||
      this.data.START_TIME == 0
    ) {
      this.isOk = false;
      this.message.error(" Please select start time.", "");
    } else if (
      this.data.END_TIME == undefined ||
      this.data.END_TIME == null ||
      this.data.END_TIME == 0
    ) {
      this.isOk = false;
      this.message.error(" Please select end time.", "");
    } else if (
      this.data.PREPARATION_HOURS === null ||
      this.data.PREPARATION_HOURS === undefined ||
      this.data.PREPARATION_HOURS === ""
    ) {
      this.isOk = false;
      this.message.error(" Please enter service preparation hours", "");
    } else if (
      this.data.PREPARATION_MINUTES === null ||
      this.data.PREPARATION_MINUTES === undefined ||
      this.data.PREPARATION_MINUTES === ""
    ) {
      this.isOk = false;
      this.message.error(" Please enter service preparation minutes", "");
    } else if (
      this.data.PREPARATION_HOURS !== null &&
      this.data.PREPARATION_HOURS !== undefined &&
      this.data.PREPARATION_HOURS !== "" &&
      this.data.PREPARATION_HOURS <= 0 &&
      this.data.PREPARATION_MINUTES !== null &&
      this.data.PREPARATION_MINUTES !== undefined &&
      this.data.PREPARATION_MINUTES !== "" &&
      this.data.PREPARATION_MINUTES <= 0
    ) {
      this.isOk = false;
      this.message.error("Service preparation time must be greater than 0", "");
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        var datalist: any = {
          ID: this.editclick == "Y" ? this.data.ID : null,
          B2B_PRICE: this.data.B2B_PRICE ? this.data.B2B_PRICE : 0,
          B2C_PRICE: this.data.B2C_PRICE ? this.data.B2C_PRICE : 0,
          EXPRESS_COST:
            this.servicemaindata.IS_EXPRESS &&
              this.terittorydata.IS_EXPRESS_SERVICE_AVAILABLE
              ? this.data.EXPRESS_COST
              : 0,
          TECHNICIAN_COST: this.data.TECHNICIAN_COST
            ? this.data.TECHNICIAN_COST
            : 0,
          VENDOR_COST: this.data.VENDOR_COST ? this.data.VENDOR_COST : 0,
          SERVICE_ID:
            this.editclick == "Y" ? this.data.SERVICE_ID : this.servicename,
          TERRITORY_ID: this.terittorydata.ID,
          START_TIME: this.datePipe.transform(
            new Date(this.data.START_TIME),
            "HH:mm"
          ),
          END_TIME: this.datePipe.transform(
            new Date(this.data.END_TIME),
            "HH:mm"
          ),
          IS_AVAILABLE: this.data.IS_AVAILABLE,
          CLIENT_ID: 1,
          CATEGORY_NAME: this.data.CATEGORY_NAME,
          SUB_CATEGORY_NAME: this.data.SUB_CATEGORY_NAME,
          IS_EXPRESS:
            (this.servicemaindata.IS_EXPRESS &&
              this.terittorydata.IS_EXPRESS_SERVICE_AVAILABLE)
              ? true
              : false,
          NAME: this.data.NAME,
          DESCRIPTION: this.data.DESCRIPTION,
          SERVICE_TYPE: this.data.SERVICE_TYPE,
          PREPARATION_MINUTES: this.data.PREPARATION_MINUTES.toString(),
          PREPARATION_HOURS: this.data.PREPARATION_HOURS,
          SERVICE_IMAGE: this.data.SERVICE_IMAGE,
          SUB_CATEGORY_ID: this.servicemaindata.SUB_CATEGORY_ID,
          DURARTION_HOUR: this.servicemaindata.DURARTION_HOUR,
          DURARTION_MIN: this.servicemaindata.DURARTION_MIN,
          CUSTOMER_ID: 0,
          UNIT_ID: this.servicemaindata.UNIT_ID
            ? this.servicemaindata.UNIT_ID
            : 0,
          SHORT_CODE: this.servicemaindata.SHORT_CODE
            ? this.servicemaindata.SHORT_CODE
            : "",
          MAX_QTY: this.servicemaindata.MAX_QTY
            ? this.servicemaindata.MAX_QTY
            : 1,
          TAX_NAME: this.servicemaindata.TAX_NAME
            ? this.servicemaindata.TAX_NAME
            : null,
          UNIT_NAME: this.servicemaindata.UNIT_NAME
            ? this.servicemaindata.UNIT_NAME
            : null,
          TAX_ID: this.servicemaindata.TAX_ID ? this.servicemaindata.TAX_ID : 0,
          IS_NEW: this.servicemaindata.IS_NEW
            ? this.servicemaindata.IS_NEW
            : false,
          PARENT_ID: this.servicemaindata.PARENT_ID
            ? this.servicemaindata.PARENT_ID
            : 0,
          HSN_CODE: this.servicemaindata.HSN_CODE
            ? this.servicemaindata.HSN_CODE
            : null,
          HSN_CODE_ID: this.servicemaindata.HSN_CODE_ID
            ? this.servicemaindata.HSN_CODE_ID
            : null,
          IS_PARENT: this.servicemaindata.IS_PARENT
            ? this.servicemaindata.IS_PARENT
            : false,
          IS_FOR_B2B: false,
          IS_JOB_CREATED_DIRECTLY: this.servicemaindata.IS_JOB_CREATED_DIRECTLY
            ? this.servicemaindata.IS_JOB_CREATED_DIRECTLY
            : false,
          ORG_ID: 1,
          QTY: this.servicemaindata.QTY ? this.servicemaindata.QTY : 0,
          STATUS: this.servicemaindata.STATUS
            ? this.servicemaindata.STATUS
            : false,
        };
        if (this.editclick == "Y") {
          this.api.getServiceTerritoryDetailsupdate(datalist).subscribe(
            (successCode: any) => {
              if (successCode.code == "200") {
                this.message.success("Service Updated Successfully", "");
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error("Service Updation Failed", "");
                this.isSpinning = false;
              }
            },
            (err: HttpErrorResponse) => {
              this.isSpinning = false;
              if (err.status === 0) {
                this.message.error(
                  "Network error: Please check your internet connection.",
                  ""
                );
              } else {
                this.message.error("Something Went Wrong.", "");
              }
            }
          );
        } else {
          this.api.getServiceTerritoryDetailscreate(datalist).subscribe(
            (successCode: any) => {
              if (successCode.code == "200") {
                this.message.success("New service added successfully", "");
                if (!addNew) this.drawerClose();
                else {
                  this.data = new ServiceCatMasterDataNewNon();
                  this.resetDrawer(ServiceCatmaster);
                }
                this.isSpinning = false;
              } else {
                this.message.error("Failed to add new service", "");
                this.isSpinning = false;
              }
            },
            (err: HttpErrorResponse) => {
              this.isSpinning = false;
              if (err.status === 0) {
                this.message.error(
                  "Network error: Please check your internet connection.",
                  ""
                );
              } else {
                this.message.error("Something Went Wrong.", "");
              }
            }
          );
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
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/jpg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error("File size should not exceed 1MB.", "");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.height === 128 && img.width === 128) {
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split(".").pop();
            var d = this.datePipe.transform(new Date(), "yyyyMMdd");
            var url = "";
            url = d == null ? "" : d + number + "." + fileExt;
            this.UrlImageOne = url;
            if (
              this.data.SERVICE_IMAGE != undefined &&
              this.data.SERVICE_IMAGE.trim() != ""
            ) {
              var arr = this.data.SERVICE_IMAGE.split("/");
              if (arr.length > 1) {
                url = arr[5];
              }
            }
            this.progressBarImageOne = true;
            this.urlImageOneShow = true;
            this.isSpinning = true;
            this.timer = this.api
              .onUpload("Item", this.fileURL, this.UrlImageOne)
              .subscribe((res) => {
                this.data.SERVICE_IMAGE = this.UrlImageOne;
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percentImageOne = percentDone;
                  if (this.percentImageOne === 100) {
                    this.isSpinning = false;
                    setTimeout(() => {
                      this.progressBarImageOne = false;
                    }, 2000);
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error("Failed To Upload Catalogue Image...", "");
                  this.isSpinning = false;
                  this.progressBarImageOne = false;
                  this.percentImageOne = 0;
                  this.data.SERVICE_IMAGE = null;
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body["code"] === 200) {
                    this.message.success(
                      "Catalogue Image Uploaded Successfully...",
                      ""
                    );
                    this.isSpinning = false;
                    this.data.SERVICE_IMAGE = this.UrlImageOne;
                  } else {
                    this.isSpinning = false;
                    this.progressBarImageOne = false;
                    this.percentImageOne = 0;
                    this.data.SERVICE_IMAGE = null;
                  }
                }
              });
          } else {
            this.message.error(
              "Image dimensions must be 128px height and 128px width.",
              ""
            );
            this.fileURL = null;
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.data.SERVICE_IMAGE = null;
          }
        };
        img.onerror = () => {
          this.message.error(
            "Failed to load image for dimension validation.",
            ""
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(this.fileURL);
    } else {
      this.message.error("Please Select Only Image File", "");
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.SERVICE_IMAGE = null;
    }
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
  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.SERVICE_IMAGE = " ";
    this.fileURL = null;
  }
  deleteCancel() { }
  removeImage() {
    this.data.URL = " ";
    this.data.SERVICE_IMAGE = " ";
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  imageshow;
  expressAvailable(event: any) {
    if (event == true) {
      this.data.EXPRESS_COST = null;
    }
  }
  subServiceAvailable(event: any) {
    if (event == true) {
      this.data.B2B_PRICE = null;
      this.data.B2C_PRICE = null;
      this.data.EXPRESS_COST = null;
      this.data.UNIT_ID = null;
      this.data.TECHNICIAN_COST = null;
      this.data.VENDOR_COST = null;
      this.data.MAX_QTY = 1;
      this.data.TAX_ID = null;
      this.data.IS_EXPRESS = false;
      this.data.IS_NEW = true;
      this.data.DURARTION_HOUR = null;
      this.data.DURARTION_MIN = null;
      this.data.PREPARATION_MINUTES == null;
      this.data.PREPARATION_HOURS == null;
      this.data.SERVICE_TYPE = "O";
      this.data.START_TIME = null;
      this.data.END_TIME = null;
      this.data.QTY = 1;
    }
  }
}
