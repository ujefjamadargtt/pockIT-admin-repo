import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DatePipe } from "@angular/common";
import { NgForm } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { Branchmaster } from "src/app/Pages/Models/branchmaster";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";

@Component({
  selector: "app-branch",
  templateUrl: "./branch.component.html",
  styleUrls: ["./branch.component.css"],
  providers: [DatePipe],
})
export class BranchComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Branchmaster;
  @Input() drawerVisible: boolean;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;

  isCountrySpinning = false;
  isStateSpinning = false;
  isDistrictSpinning = false;
  isCitySpinning = false;
  isPincodeSpinning = false;
  isFocused: string = "";

  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  addpat = /[ .a-zA-Z0-9 ]+/;
  PTECpattern = /^99\d{9}P$/;
  imgUrl;
  time;
  time1;
  time2;
  department: Branchmaster[] = [];
  org = [];

  orgId = sessionStorage.getItem("orgId");
  decreptedOrgIdString = this.orgId
    ? this.commonFunction.decryptdata(this.orgId)
    : "";
  decreptedOrgId = parseInt(this.decreptedOrgIdString, 10);

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  date;

  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    if (this.data.ID) {
      this.getCountry1();
    } else {
      this.getCountry();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && this.data) {
      const { COUNTRY_ID, STATE_ID } = this.data;

      // Call the API to load state, city, and pincode
      this.getstate(COUNTRY_ID, false);
      if (STATE_ID) {
        this.getDistrict(STATE_ID, false);
      }
    }
  }

  allClusters = [];
  clusters = [];

  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    this.data.ORG_ID = 1
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
    this.add();
  }

  add(): void {
    this.api.getAllBranch(1, 1, "SEQ_NO", "desc", "").subscribe(
      (data) => {
        if (data["count"] == 0) {
          this.data.SEQ_NO = 1;
        } else {
          this.data.SEQ_NO = Number(data["data"][0]["SEQ_NO"]) + 1;
          this.data.IS_ACTIVE = true;
        }
      },
      (err) => { }
    );
  }

  alphanumchar(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
  }

  alphaOnly(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.data.NAME == undefined ||
        this.data.NAME == null ||
        this.data.NAME == " ") &&
      (this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == " ") &&
      (this.data.COUNTRY_ID == undefined ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == 0 ||
        this.data.COUNTRY_ID == " ") &&
      (this.data.STATE_ID == undefined ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID == 0 ||
        this.data.STATE_ID == " ") &&
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == 0 ||
        this.data.DISTRICT_ID == 0) &&
      (this.data.PINCODE_ID == undefined ||
        this.data.PINCODE_ID == null ||
        this.data.PINCODE_ID == 0 ||
        this.data.PINCODE_ID == " ")
    ) {
      this.isOk = false;
      this.message.error("Please fill all required fields", "");
    } else if (this.data.NAME == undefined || this.data.NAME == "") {
      this.isOk = false;
      this.message.error("Please Enter Branch Name", "");
    } else if (
      this.data.CODE == undefined ||
      this.data.CODE == null ||
      this.data.CODE == ""
    ) {
      this.isOk = false;
      this.message.error("Please Enter Short Code.", "");
    } else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == 0
    ) {
      this.isOk = false;
      this.message.error("Please Enter Sequence No.", "");
    } else if (this.data.ADDRESS == undefined || this.data.ADDRESS == "") {
      this.isOk = false;
      this.message.error("Please Enter Address ", "");
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == " "
    ) {
      this.isOk = false;
      this.message.error("Please Select Country", "");
    } else if (
      this.data.STATE_ID == null ||
      this.data.STATE_ID == undefined ||
      this.data.STATE_ID == " "
    ) {
      this.isOk = false;
      this.message.error("Please Select State", "");
    } else if (
      this.data.DISTRICT_ID == null ||
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == " "
    ) {
      this.isOk = false;
      this.message.error("Please Select District", "");
    } else if (
      this.data.PINCODE_ID == null ||
      this.data.PINCODE_ID == undefined ||
      this.data.PINCODE_ID == " "
    ) {
      this.isOk = false;
      this.message.error("Please Select Pincode", "");
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.data.ORG_ID = 1
      if (this.data.ID) {
        this.api.updateBranch(this.data).subscribe(
          (successCode) => {
            if (successCode["code"] == 200) {
              this.message.success("Branch Updated Successfully", "");
              this.isSpinning = false;
              if (!addNew) this.close(accountMasterPage);
            } else {
              this.message.error("Branch  Updation Failed", "");
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              "Something went wrong, please try again later",
              ""
            );
            this.isSpinning = false;
          }
        );
      } else {
        this.api.createBranch(this.data).subscribe(
          (successCode) => {
            if (successCode["code"] == 200) {
              this.message.success("Branch Saved Successfully", "");
              this.isSpinning = false;
              if (!addNew) {
                this.close(accountMasterPage);
              } else {
                this.data = new Branchmaster();
                this.resetDrawer(accountMasterPage);
              }
            } else {
              this.message.error("cannot save Branch Information", "");
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              "Something went wrong, please try again later",
              ""
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }

  onStateChange(event: any) {
    if (event != null && event != undefined) {
      this.api
        .getState(0, 0, "", "", " AND ID = " + event)
        .subscribe((data) => {
          this.data.STATE_NAME = data["data"][0]["NAME"];
        });
    }
  }

  state: any = [];
  country: any = [];
  pincode: any = [];
  City1: any = [];
  district: any[];

  getCountry() {
    this.isCountrySpinning = true;
    this.api
      .getAllCountryMaster(0, 0, "SEQ_NO", "asc", " AND IS_ACTIVE = 1")
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.country = data["data"];

            this.isCountrySpinning = false;
          } else {
            this.country = [];
            this.isCountrySpinning = false;
            this.message.error("Failed to get country data.", "");
          }
        },
        () => {
          this.isCountrySpinning = false;
          this.message.error("Something Went Wrong ...", "");
        }
      );
  }

  getCountry1() {
    this.api
      .getAllCountryMaster(0, 0, "SEQ_NO", "asc", " AND IS_ACTIVE = 1")
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.country = data["data"];
            this.getstate(this.data.COUNTRY_ID, false);
            this.isCountrySpinning = false;
          } else {
            this.country = [];
            this.isCountrySpinning = false;
            this.message.error("Failed to get country data.", "");
          }
        },
        () => {
          this.isCountrySpinning = false;
          this.message.error("Something Went Wrong ...", "");
        }
      );
  }

  getstate(event: any, isTrue) {
    var filter = " AND IS_ACTIVE = 1 AND COUNTRY_ID = " + event;
    if (isTrue) {
      this.data.STATE_ID = null;
      // this.data.CITY_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.state = [];
      this.City1 = [];
      this.pincode = [];
      this.district = [];
    }
    if (event) {
      this.isStateSpinning = true;
      this.api.getState(0, 0, "SEQ_NO", "asc", filter).subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.state = data["data"];
            this.getDistrict(this.data.STATE_ID, false);
            this.data.STATE_ID = this.data.STATE_ID;
            this.isStateSpinning = false;

          } else {

            this.data.STATE_ID = null;
            this.state = [];
            this.isStateSpinning = false;
            this.message.error("Failed To Get State Data.", "");
          }
        },
        () => {
          this.isStateSpinning = false;
          this.message.error("Something Went Wrong ...", "");
        }
      );
    }
  }

  districtid: any;

  getDistrict(event: any, istrue) {
    if (istrue) {
      this.data.DISTRICT_ID = null;

      // this.data.CITY_ID = undefined;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;

      this.district = [];
      this.pincode = [];
    }

    this.districtid = event;


    var filter = " AND IS_ACTIVE = 1 AND STATE_ID = " + event;

    if (event) {
      this.isDistrictSpinning = true;
      this.api.getDistrictData(0, 0, "SEQ_NO", "asc", filter).subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.district = data["data"];
            // this.getCityyy1(this.data.DISTRICT_ID,false);
            this.getpincode(this.data.DISTRICT_ID, false);
            this.isDistrictSpinning = false;
          } else {
            this.state = [];
            this.isDistrictSpinning = false;
            this.message.error("Failed To Get District Data.", "");
          }
        },
        () => {
          this.isDistrictSpinning = false;
          this.message.error("Something Went Wrong ...", "");
        }
      );
    } else {
    }
  }
  Filterss: any = {};
  logfilt: any;
  filterdata1: any
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.pincode.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER']

      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }

  }
  getpincode(DISTRICT_ID: any, istrue) {
    if (istrue) {
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.pincode = [];
    }

    this.data.DISTRICT_ID = DISTRICT_ID;
    var filter = " AND IS_ACTIVE = 1 AND DISTRICT = " + this.data.DISTRICT_ID;

    if (this.data.DISTRICT_ID) {
      this.isPincodeSpinning = true;
      this.api.getAllPincode(0, 0, "SEQ_NO", "asc", filter).subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.pincode = data["data"];
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);

            this.isPincodeSpinning = false;
          } else {
            this.state = [];
            this.isPincodeSpinning = false;
            this.message.error("Failed To Get Pincode Data.", "");
          }
        },
        () => {
          this.isPincodeSpinning = false;
          this.message.error("Something Went Wrong ...", "");
        }
      );
    } else {
      this.data.PINCODE_ID = undefined;
      this.data.PINCODE = null;
      this.pincode = [];
    }
  }
}