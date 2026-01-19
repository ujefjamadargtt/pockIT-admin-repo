import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-technician-job-status-change',
  templateUrl: './technician-job-status-change.component.html',
  styleUrls: ['./technician-job-status-change.component.css']
})
export class TechnicianJobStatusChangeComponent implements OnInit {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  @Input() custid: any;
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords: boolean = false;
  jobdatss: any = [];
  searchText: string = "";
  dataList: any = [];
  totalRecords: number = 0;
  columns: string[][] = [
    ["REMARK", "REMARK"]
  ];
  pageIndex1 = 1;
  pageSize1 = 10;
  sortKey1: string = 'ID';
  sortValue1: string = 'desc';
  loadingRecords1: boolean = false;
  jobdatss1: any = [];
  searchText1: string = "";
  dataList1: any = [];
  totalRecords1: number = 0;
  columns1: string[][] = [
    ["REMARK", "REMARK"]
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe, private sanitizer: DomSanitizer
  ) { }
  urllll = appkeys.retriveimgUrl;
  ngOnInit() {
    this.search1();
  }
  show: any = 0
  onSelectedIndexChange(event: any) {
    this.show = event
    this.search1();
  }
  onKeyup(event: KeyboardEvent): void {
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById("button");
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  imageshow;
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = "";
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + "JobPhotos/" + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  onKeyup1(event: KeyboardEvent): void {
    if (this.searchText1.length >= 3 && event.key === "Enter") {
      this.search1();
    } else if (this.searchText1.length == 0 && event.key === "Backspace") {
      this.search1();
    }
  }
  onKeypressEvent1(keys) {
    const element = window.document.getElementById("button1");
    if (this.searchText1.length >= 3 && keys.key === "Enter") {
      this.search1();
    } else if (this.searchText1.length === 0 && keys.key == "Backspace") {
      this.dataList1 = [];
      this.search1();
    }
  }
  REMARKS: any;
  onEnterKey1(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  search1(reset: boolean = false) {
    if (reset) {
      this.pageIndex1 = 1;
      this.sortKey1 = "id";
      this.sortValue1 = "desc";
    }
    var sort: string;
    try {
      sort = this.sortValue1.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    var likeQuery = "";
    var globalSearchQuery = "";
    if (this.searchText1 !== "") {
      globalSearchQuery =
        " AND (" +
        this.columns1
          .map((column) => {
            return `${column[0]} like '%${this.searchText1}%'`;
          })
          .join(" OR ") +
        ")";
    }
    this.loadingRecords1 = true;
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
    this.api
      .getjobphotos(
        this.pageIndex1,
        this.pageSize1,
        this.sortKey1,
        sort,
        likeQuery + " AND TECHNICIAN_ID=" + this.data.TECHNICIAN_ID + " AND JOB_CARD_ID=" + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.loadingRecords1 = false;
            this.totalRecords1 = data["count"];
            this.dataList1 = data["data"];
            if (data["count"] > 0) {
              this.REMARKS = data["data"][0]['REMARK']
            }
          } else if (data['code'] == 400) {
            this.loadingRecords1 = false;
            this.dataList1 = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords1 = false;
            this.dataList1 = [];
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords1 = false;
          if (err.status === 0) {
            this.message.error(
              "Network error: Please check your internet connection.",
              ""
            );
          } else if (err['status'] == 400) {
            this.loadingRecords1 = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error("Something Went Wrong.", "");
          }
        }
      );
  }
  sort1(params: NzTableQueryParams) {
    this.loadingRecords1 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex1 = pageIndex;
    this.pageSize1 = pageSize;
    if (this.pageSize1 != pageSize) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }
    if (this.sortKey1 != sortField) {
      this.pageIndex1 = 1;
      this.pageSize1 = pageSize;
    }
    this.sortKey1 = sortField;
    this.sortValue1 = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search1();
    }
  }
}
