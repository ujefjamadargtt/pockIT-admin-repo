import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { HSN_SAC_Master } from "src/app/Pages/Models/HSN_SAC_Master";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
import { ApiServiceService } from "src/app/Service/api-service.service";
@Component({
  selector: "app-add-hsn-sac-master",
  templateUrl: "./add-hsn-sac-master.component.html",
  styleUrls: ["./add-hsn-sac-master.component.css"],
})
export class AddHSNSACMASTERComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: HSN_SAC_Master = new HSN_SAC_Master();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  codepatt = /^[0-9\s,._-]+/;
  isFocused: string = "";
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit() { }
  close(): void {
    this.drawerClose();
  }
  save(addNew: boolean, HSN_SAC: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.CODE == undefined ||
        this.data.CODE == null ||
        this.data.CODE == "") &&
      (this.data.SEQ_NO == null ||
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == "")
    ) {
      this.isOk = false;
      this.message.error("Please Fill All Required Fields", "");
    } else {
      if (
        this.data.CODE == undefined ||
        this.data.CODE == null ||
        this.data.CODE.trim() == ""
      ) {
        this.isOk = false;
        this.message.error("Please Enter Code.", "");
      } else if (
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == ""
      ) {
        this.isOk = false;
        this.message.error(" Please Enter Sequence No.", "");
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateHSNSAC(this.data).subscribe(
          (successCode) => {
            if (successCode.code == "200") {
              this.message.success("HSN Code Updated Successfully...", "");
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error("HSN Code Updation Failed...", "");
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      } else {
        this.api.CreateHSNSAC(this.data).subscribe(
          (successCode) => {
            if (successCode.code == "200") {
              this.message.success("HSN Code Created Successfully...", "");
              if (!addNew) this.drawerClose();
              else {
                this.data = new HSN_SAC_Master();
                this.resetDrawer(HSN_SAC);
                this.api.getAllHSNSAC(1, 1, "SEQ_NO", "desc", "").subscribe(
                  (data) => {
                    if (data["code"] == 200) {
                      if (data["count"] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
                      }
                    } else {
                      this.message.error("Something Went Wrong", "");
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
              this.isSpinning = false;
            } else {
              this.message.error("HSN Code Creation Failed...", "");
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      }
    }
  }
  resetDrawer(Department: NgForm) {
    this.data = new HSN_SAC_Master();
    Department.form.markAsPristine();
    Department.form.markAsUntouched();
  }
}
