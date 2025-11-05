import { Component, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CancelOrderReasonMaster } from "src/app/Pages/Models/CancelOrderReasonMaster";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";

@Component({
  selector: "app-cancel-order-reason-drawer",
  templateUrl: "./cancel-order-reason-drawer.component.html",
  styleUrls: ["./cancel-order-reason-drawer.component.css"],
})
export class CancelOrderReasonDrawerComponent {
  isSpinning: boolean = false;
  isOk = true;

  ngOnInit(): void { }

  public commonFunction = new CommonFunctionService();
  @Input() data: any = CancelOrderReasonMaster;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  resetDrawer(CancelOrderReasonmaster: NgForm) {
    this.data = new CancelOrderReasonMaster();
    CancelOrderReasonmaster.form.markAsPristine();
    CancelOrderReasonmaster.form.markAsUntouched();
  }

  techData: any = [];

  skillData: any = [];
  isFocused: string = "";

  save(addNew: boolean, CancelOrderReasonmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.isOk) {
      if (
        this.data.REASON == null ||
        this.data.REASON == undefined ||
        this.data.REASON == ""
      ) {
        this.isOk = false;
        this.message.error(" Please Enter Reason", "");
      }
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateCancelOrderReason(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code == 200) {
              this.isSpinning = false;
              this.message.success(
                "Cancel Order Reason Updated Successfully", ""
              );
              if (!addNew) this.drawerClose();

            } else {
              this.message.error("Cancel Order Reason Updation Failed", "");
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
        this.api.createCancelOrderReason(this.data).subscribe(
          (successCode: any) => {
            if (successCode.code === 200) {
              this.isSpinning = false;
              this.message.success(
                "Cancel Order Reason Created Successfully",
                ""
              );
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new CancelOrderReasonMaster();
                this.resetDrawer(CancelOrderReasonmaster);
              }
            } else {
              this.isSpinning = false;
              this.message.error("Cancel Order Reason Creation Failed", "");
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

  close() {
    this.drawerClose();
  }
}
