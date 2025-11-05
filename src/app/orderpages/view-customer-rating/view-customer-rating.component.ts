import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ApiServiceService } from "src/app/Service/api-service.service";

@Component({
  selector: "app-view-customer-rating",
  templateUrl: "./view-customer-rating.component.html",
  styleUrls: ["./view-customer-rating.component.css"],
})
export class ViewCustomerRatingComponent {
  @Input() data: any;
  @Input() dataID: any;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  pageIndex = 1;
  pageSize = 10;
  pageIndexforTechnician = 1;
  pageSizeforTechnician = 10;
  isSpinning = false;
  dataList: any = [];
  technicianData: any = [];
  totalRecords = 1;
  orderID;
  progressList: any;
  averageRating;
  globalRating;
  progPer;
  progressTechList: any;
  averageTechnicianRating;
  globalTechnicianRating;



  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.ViewCustomerReviewDetails();
    this.ViewTechnicianReviewDetails();
  }

  ViewCustomerReviewDetails() {

    this.isSpinning = true;


    this.api
      .getCustomerReviewData(
        this.pageIndex,
        this.pageSize,
        "",
        "",
        " AND ORDER_ID =" + this.data.ID,
        this.dataID
      )
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.dataList = data["data"];
            this.totalRecords = Number(data["count"]);



            this.averageRating = Number(data["averageRating"]);


            this.globalRating = data["count"];

            this.progressList = data["progress"].reverse();
            // 
          } else {
            this.dataList = [];
            this.message.error("Failed To Get Customer Review Details.", "");
            this.isSpinning = false;
          }
        },
        () => {
          this.message.error("Something Went Wrong ...", "");
          this.isSpinning = false;
        }
      );
  }

  ViewTechnicianReviewDetails() {
    this.isSpinning = true;
    this.api
      .getTechnicianReviewData(
        this.pageIndexforTechnician,
        this.pageSizeforTechnician,
        "",
        "",
        " AND ORDER_ID=" + this.data.ID,
        this.dataID
      )
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.technicianData = data["data"];
            this.totalRecords = Number(data["count"]);

            this.averageTechnicianRating = Number(data["averageRating"]);
            this.globalTechnicianRating = data["count"];

            this.progressTechList = data["progress"].reverse();
          } else {
            this.technicianData = [];
            this.message.error("Failed To Get Technician Review Details.", "");
            this.isSpinning = false;
          }
        },
        () => {
          this.message.error("Something Went Wrong ...", "");
          this.isSpinning = false;
        }
      );
  }

  loadMore() {

    this.pageSize += 10;
    this.ViewCustomerReviewDetails();
  }

  loadMoreTechnician() {
    this.pageSizeforTechnician += 10;
    this.ViewTechnicianReviewDetails();
  }
}
