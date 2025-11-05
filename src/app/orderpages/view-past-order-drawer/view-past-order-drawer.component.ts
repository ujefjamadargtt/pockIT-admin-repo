import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-view-past-order-drawer',
  templateUrl: './view-past-order-drawer.component.html',
  styleUrls: ['./view-past-order-drawer.component.css']
})
export class ViewPastOrderDrawerComponent {

  @Input() data: any;
  @Input()
  drawerVisiblepastorder: boolean = false;
  @Input() drawerClosepastorder: any = Function;

  date = new Date()

  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  chapters: any = [];
  isLoading = true;
  columns: string[][] = [

  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  filterQuery: any;
  drawerVisible1: boolean = false;
  CUSTOMER_ID;
  ORDER_ID;

  constructor
    (
      private api: ApiServiceService,
      private message: NzNotificationService
    ) { }


  ngOnInit() {

    this.getAllPastOrders();
  }


  getAllPastOrders() {
    this.filterQuery = " AND ID !=" + this.data.ID + " AND CUSTOMER_ID=" + this.data.CUSTOMER_ID
    this.api.getAllPastOrders(this.pageIndex, this.pageSize, "", "", this.filterQuery)
      .subscribe(
        (data: any) => {
          if (data["code"] == 200) {
            this.loadingRecords = false;
            this.dataList = data["data"];
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
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

  search(reset: boolean = false) {
    var likeQuery = "";
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach((column) => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.loadingRecords = true;



    this.api
      .getAllPastOrders(
        this.pageIndex,
        this.pageSize,
        "",
        "",
        likeQuery + ' AND CUSTOMER_ID=' + this.CUSTOMER_ID
      )
      .subscribe(
        (data: any) => {
          if (data["code"] == 200) {
            this.loadingRecords = false;
            this.dataList = data["data"];

          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
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



  loadMore(): void {
    this.pageSize += 10;
    this.getAllPastOrders();

  }




}
