import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupon-detailed-report',
  templateUrl: './coupon-detailed-report.component.html',
  styleUrls: ['./coupon-detailed-report.component.css'],
})
export class CouponDetailedReportComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  // drawerData: MapAssesment = new MapAssesment();
  formTitle = ' Coupon Used Detailed Report';
  dataList: any = [];
  loadingRecords = true;
  ismapSpinning = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  groupname: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  collegeId = sessionStorage.getItem('collegeId');
  startValue: any;
  endValue: any;
  endOpen = false;
  startOpen = false;
  current = new Date();
  visible = false;
  visible1 = false;
  visible2 = false;
  selectedDate: Date[] = [];
  value1: any;
  value2: any;
  applieddate: any;
  couponname: any = [];
  coursename: any = [];
  selectedCoupon: any;
  selectedCategory: any;
  selectedCourse: any;
  excelData: any = [];
  exportLoading: boolean = false;

  filterGroups: any[] = [
    {
      operator: "AND",
      conditions: [
        {
          condition: {
            field: "",
            comparator: "",
            value: "",
          },
          operator: "AND",
        },
      ],
      groups: [],
    },
  ];

  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ]

  // TYPE_ID:any = '0';
  // table1:any;
  // assessment:any;

  columns: string[][] = [
    // ['STUDENT_NAME', ' Student Name '],
    ['NAME', ' CUSTOMERS Name '],
    ['MOBILE_NO', ' Mobile Number '],
    ['EMAIL', ' Email '],
    ['ORDER_NUMBER', ' Order Number '],
    // ['ITEM_NAME', '  Course Name  '],
    ['COUPON_CODE', ' Coupon Code '],
    // ['COUPON_NAME', ' Coupon Name '],
    ['APPLIED_DATE_TIME', ' Used Date Time '],
    // ['APPLIED_TIME', ' Used Date Time '],
    // ["PLATEFORM"," Plateform  "],
    ['COUPON_VALUE', ' Coupon Value '],
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadcoupon();
    this.changeDate(this.selectedDate);
  }

  //Coupon Name
  loadcoupon() {
    this.api.getAllCoupons(0, 0, '', ' desc', '').subscribe(
      (data) => {
        // this.api.getAllcouponuseddetailedreport(0,0,'','',' AND STATUS=1').subscribe(data =>{
        this.couponname = data['data'];
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  //Course Name
  //  loadcourse() {
  //   this.api.getAllCourse(0, 0, '', ' desc', '').subscribe(
  //     (data) => {
  //       // this.api.getAllcouponuseddetailedreport(0,0,'','',' AND STATUS=1').subscribe(data =>{
  //       this.coursename = data['data'];
  //     },
  //     (err) => {
  //
  //       this.isSpinning = false;
  //     }
  //   );
  // }
  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }

  back() {
    this.router.navigate(["/masters/menu"]);
  }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  openCourse(event: any) {
    this.api
      .Ordermaster(0, 0, '', ' desc', ' AND COURSE_SUB_CATEGORY_ID=' + event)
      .subscribe(
        (data) => {
          // this.api.getAllcouponuseddetailedreport(0,0,'','',' AND STATUS=1').subscribe(data =>{
          this.coursename = data['data'];
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  //   loadassessment(){
  //   this.api.getAllgamifiedregisteredreport(0,0,'','',' ').subscribe(data =>{
  //     this.assessment=data['data'];
  //   },err => {
  //
  //     this.isSpinning=false;
  //   });
  // }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  onKeyupS(keys) {
    const element = window.document.getElementById("button");
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
  }


  onKeyup(event: KeyboardEvent): void {
    // if (this.searchText.length >= 3 && event.key === 'Enter') {
    //   this.search();
    // } else if (this.searchText.length == 0 && event.key === 'Backspace') {
    //   this.search();
    // }


    if (this.nametext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isCustNameFilterApplied = true;
    } else if (this.nametext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isCustNameFilterApplied = false;
    }

    if (this.mobiletext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isMobileVisibleFilterApplied = true;
    } else if (this.mobiletext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isMobileVisibleFilterApplied = false;
    }


    if (this.emailtext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isEmailVisibleFilterApplied = true;
    } else if (this.emailtext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isEmailVisibleFilterApplied = false;
    }

    if (this.OrderNotext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isOrderNoVisibleFilterApplied = true;
    } else if (this.OrderNotext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isOrderNoVisibleFilterApplied = false;
    }

    if (this.CouponCodetext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isCouponCodeVisibleFilterApplied = true;
    } else if (this.CouponCodetext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isCouponCodeVisibleFilterApplied = false;
    }


    if (this.CouponValuetext.length > 0 && event.key === "Enter") {
      this.search();
      this.isCouponValueVisibleFilterApplied = true;
    } else if (this.CouponValuetext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isCouponValueVisibleFilterApplied = false;
    }


  }

  // keyup(event: any) {
  //   this.search();
  // }

  keyup(keys: any) {
    // this.search();
    const element = window.document.getElementById("button");
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search();
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search();
    }
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    // if (this.searchText != '') {
    //   likeQuery = ' AND (';
    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    // likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';

    var likeQuery = '';
    var globalSearchQuery = '';
    // Global Search (using searchText)
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }

    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
      this.isCustNameFilterApplied = true;
    } else {
      this.isCustNameFilterApplied = false;
    }

    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NO LIKE '%${this.mobiletext.trim()}%'`;
      this.isMobileVisibleFilterApplied = true;
    } else {
      this.isMobileVisibleFilterApplied = false;
    }

    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
      this.isEmailVisibleFilterApplied = true;
    } else {
      this.isEmailVisibleFilterApplied = false;
    }
    if (this.OrderNotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `ORDER_NUMBER LIKE '%${this.OrderNotext.trim()}%'`;
      this.isOrderNoVisibleFilterApplied = true;
    } else {
      this.isOrderNoVisibleFilterApplied = false;
    }

    if (this.CouponCodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_CODE LIKE '%${this.CouponCodetext.trim()}%'`;
      this.isCouponCodeVisibleFilterApplied = true;
    } else {
      this.isCouponCodeVisibleFilterApplied = false;
    }

    if (this.CouponValuetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `COUPON_VALUE LIKE '%${this.CouponValuetext.trim()}%'`;
      this.isCouponValueVisibleFilterApplied = true;
    } else {
      this.isCouponValueVisibleFilterApplied = false;
    }

    if (this.appliedDateText?.length === 2) {
      const [start, end] = this.appliedDateText;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `APPLIED_DATE_TIME BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
        this.isAppliedDateVisibleFilterApplied = true;
      }
      else {
        this.isAppliedDateVisibleFilterApplied = false;
      }

    }

    // if (this.emailtext !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
    //   this.isEmailVisibleFilterApplied = true;
    // } else {
    //   this.isEmailVisibleFilterApplied = false;
    // }

    // if (this.emailtext !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") + `EMAIL LIKE '%${this.emailtext.trim()}%'`;
    //   this.isEmailVisibleFilterApplied = true;
    // } else {
    //   this.isEmailVisibleFilterApplied = false;
    // }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');





    // **********************************************





    if (exportInExcel == false) {
      this.api
        .getAllcouponuseddetailedreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.searchText,
          likeQuery + this.filterQuery,
          '',
          '',
          ''
        )
        .subscribe(
          (data) => {

            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.TabId = data['TAB_ID'];
            this.dataList = data['data'];


            // for (var i = 0; i < this.dataList.length; i++) {
            for (var i = 0; i < this.dataList; i++) {
              this.applieddate = data['data'][0]['APPLIED_TIME'];
            }
          },
          (err) => { }
        );
    }

    else {

      this.exportLoading = true;
      this.loadingRecords = true;

      this.api
        .getAllcouponuseddetailedreport(
          0,
          0,
          this.sortKey,
          sort,
          '',
          likeQuery + this.filterQuery,
          '',
          '',
          ''
        )
        .subscribe(

          (data) => {

            this.loadingRecords = false;
            this.exportLoading = false;
            this.totalRecords = data['count'];
            this.TabId = data['TAB_ID'];
            this.dataList = data['data'];
            this.excelData = data['data'];
            this.convertInExcel();

            for (var i = 0; i < this.dataList.length; i++) {
              this.applieddate = data['data'][0]['APPLIED_TIME'];
            }
          },
          (err) => { }
        );
    }
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  // add(): void {
  //   this.drawerTitle = "Add Assessment";
  //   this.drawerData = new GuravMaster();
  //   this.api.getAllgamifiedregisteredreport(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
  //     if (data['count']==0){
  //       this.drawerData.SEQUENCE_NO=1;
  //     }else
  //     {
  //       this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
  //     }
  //   },err=>{
  //
  //   })
  //   this.drawerVisible = true;
  // }
  // edit(data: MapAssesment): void {
  //   this.drawerTitle = "Map Assessment";
  //   this.drawerData = Object.assign({}, data);
  //
  //   // this.drawerData.TIME= new Date('01-01-1970 '+this.drawerData.TIME)
  //   this.drawerVisible = true;
  // }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  loadingLevels = false;

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  onKeyDownEvent(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
    }
    this.search(true);
  }

  // applyFilter() {
  //   // this.isSpinning=true
  //   this.loadingRecords = true;
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
  //   // this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
  //   // this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
  //   // if(this.startValue==undefined || this.endValue==undefined)
  //   // if(this.startValue==null && this.endValue==null){
  //   //   this.message.error("Please Select From Date and To Date", "");

  //   // }else {

  //   // if(this.startValue==null && this.endValue!=null){
  //   //       this.message.error("Please Select From Date", "");
  //   //     }else{

  //   //     if(this.startValue!=null && this.endValue==null){
  //   //              this.message.error("Please Select To Date", "");
  //   //         }else{
  //   // if (
  //   //   this.value1 != undefined &&
  //   //   this.value2 != undefined &&
  //   //   this.selectedCoupon != undefined
  //   // ) {
  //   //   this.filterQuery =
  //   //     " AND APPLIED_DATE_TIME between '" +
  //   //     this.value1 +
  //   //     "' AND '" +
  //   //     this.value2 +
  //   //     "' " +
  //   //     " AND ID = '" +
  //   //     this.selectedCoupon +
  //   //     "' ";
  //   // } else if (
  //   //   this.value1 != undefined &&
  //   //   this.value2 != undefined
  //   //   //&& this.mode != undefined
  //   // ) {
  //   //   this.filterQuery =
  //   //     " AND APPLIED_DATE_TIME between '" +
  //   //     this.value1 +
  //   //     "' AND '" +
  //   //     this.value2 +
  //   //     "' ";
  //   // } else if (this.selectedCoupon != undefined) {
  //   //   this.filterQuery = ' AND ID=' + "'" + this.selectedCoupon + "'";
  //   // }
  //   // var filter = '';
  //   // filter = this.filterQuery;
  //   // var likeQuery = '';
  //   //

  //   // if (this.searchText != '') {
  //   //   likeQuery = ' AND';
  //   //   this.columns.forEach((column) => {
  //   //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
  //   //   });
  //   //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);

  //   //   //
  //   // }
  //   var likeQuery = '';
  //   var globalSearchQuery = '';
  //   // Global Search (using searchText)
  //   if (this.searchText !== '') {
  //     globalSearchQuery =
  //       ' AND (' +
  //       this.columns
  //         .map((column) => {
  //           return `${column[0]} like '%${this.searchText}%'`;
  //         })
  //         .join(' OR ') +
  //       ')';
  //   }

  //   if (this.selectedDate?.length === 2) {
  //     const [start, end] = this.selectedDate;

  //     if (start && end) {
  //       const formatDate = (date: Date) =>
  //         `${date.getFullYear()}-${(date.getMonth() + 1)
  //           .toString()
  //           .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  //       const formattedStart = formatDate(new Date(start));
  //       const formattedEnd = formatDate(new Date(end));

  //       likeQuery +=
  //         (likeQuery ? ' AND ' : '') +
  //         `APPLIED_DATE_TIME BETWEEN '${formattedStart} 00:00:00' AND '${formattedEnd} 23:59:00'`;
  //     }
  //   }

  //   if (this.selectedCoupon != undefined) {
  //     this.filterQuery = ' AND ID=' + "'" + this.selectedCoupon + "'";
  //   }

  //   // Combine global search query and column-specific search query
  //   likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

  //   this.api
  //     .getAllcouponuseddetailedreport(
  //       0,
  //       0,
  //       this.sortKey,
  //       sort,
  //       '',
  //       likeQuery + this.filterQuery,
  //       '',
  //       '',
  //       // this.value1 == null || this.value1 == ''
  //       //   ? ''
  //       //   : this.value1 + ' 00:00:00',
  //       // this.value2 == null || this.value2 == ''
  //       //   ? ''
  //       //   : this.value2 + ' 23:59:59',
  //       this.selectedCoupon
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.loadingRecords = false;
  //         this.isFilterApplied = 'primary';
  //         this.totalRecords = data['count'];
  //         this.TabId = data['TAB_ID'];
  //         this.dataList = data['data'];
  //         this.isSpinning = false;
  //         this.filterClass = 'filter-invisible';
  //         //  this.search();
  //       },
  //       (err) => { }
  //     );
  //   // }
  //   // }
  //   // this.dataList=[];
  // }
  // clearFilter() {
  //   this.value1 = '';
  //   this.value2 = '';
  //   this.selectedCoupon = [];
  //   this.selectedDate = [];

  //   this.filterClass = 'filter-invisible';
  //   this.isFilterApplied = 'default';
  //   this.filterQuery = '';
  //   this.dataList = [];
  //   this.selectedCategory = '';
  //   this.selectedCourse = '';

  //   this.search();
  //   // this.startValue = new Date(
  //   //   this.current.getFullYear() + "-" + (this.current.getMonth() + 1) + "-01"
  //   // );
  //   // this.endValue = this.current;
  // }

  dates: any = [];

  disabledEndDate2 = (current: Date): any => {
    // if (!endValue || !this.startValue) {
    //   return false;
    // }
    // // return endValue.getTime() <= this.startValue.getTime();
    // return (
    //   endValue.getTime() < this.startValue.getTime() ||
    //   endValue.getTime() >= this.current.getTime()
    // );
    // let index = this.dates.findIndex(
    //   (date: any) => date === moment(current).format('YYYY-MM-DD')
    // );
    // return index === -1 && true;
  };

  startDateChange() {
    var startDate = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr: any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  timeDefaultValue = setHours(new Date(), 0);

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.current) > 0;
  /////////
  //Date picker move to next date picker
  onStartChange(date: Date): void {
    this.startValue = new Date(date);
  }

  onEndChange(date: Date): void {
    this.endValue = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
    this.startOpen = open;
  }

  moduleStartDateHandle(open: boolean) {
    //

    if (!open) {
      this.endOpen = true;

      // this.endValue = this.startValue;
    }
  }

  //disable date
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      // return false;
      return startValue.getTime() >= this.current.getTime();
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    // return endValue.getTime() <= this.startValue.getTime();
    return (
      endValue.getTime() < this.startValue.getTime() ||
      endValue.getTime() >= this.current.getTime()
    );
  };

  disabledDate = (selected: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(selected, this.current) > 0;

  // checkData(event: any) {
  //   //
  //   if (event == 0) {
  //     this.table1 = 0;
  //   // alert(this.table1)
  //   }
  //   //   this.table2 = false;
  //   //   this.table3 = false;
  //   // }
  //    else  {
  //     this.table1 = 1;
  //     // alert(this.table1)
  //   }
  // }

  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.mobiletext = '';
    this.emailtext = '';
    this.CouponCodetext = '';
    this.CouponValuetext = '';
    this.appliedDateText = '';
    this.search();
  }

  onappliedDateChange(selectedDate: any): void {
    if (this.appliedDateText && this.appliedDateText.length === 2) {
      this.search();
      this.isAppliedDateVisibleFilterApplied = true
    } else {
      this.appliedDateText = null;
      this.search();
      this.isAppliedDateVisibleFilterApplied = false;
    }
  }

  nametext: string = '';
  CustNameVisible: boolean = false;
  isCustNameFilterApplied = false;

  mobiletext: string = '';
  mobileVisible: boolean = false;
  isMobileVisibleFilterApplied = false;

  emailtext: string = '';
  emailVisible: boolean = false;
  isEmailVisibleFilterApplied = false;

  OrderNotext: string = '';
  OrderNoVisible: boolean = false;
  isOrderNoVisibleFilterApplied = false;

  CouponCodetext: string = '';
  CouponCodeVisible: boolean = false;
  isCouponCodeVisibleFilterApplied = false;

  CouponValuetext: string = '';
  CouponValueVisible: boolean = false;
  isCouponValueVisibleFilterApplied = false;

  appliedDateText;
  AppliedDateVisible: boolean = false;
  isAppliedDateVisibleFilterApplied = false;

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = "";
  // filterClass: string = "filter-invisible";
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  // loadFilters() {
  //   this.api
  //     .getFilterData1(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
  //     ) // Use USER_ID as a number
  //     .subscribe(
  //       (response) => {
  //         if (response.code === 200) {
  //           this.savedFilters = response.data;
  //           this.filterQuery = '';
  //         } else {
  //           this.message.error('Failed to load filters.', '');
  //         }
  //       },
  //       (error) => {
  //         this.message.error('An error occurred while loading filters.', '');
  //       }
  //     );
  //   this.filterQuery = '';
  // }

  // Clearfilter() {
  //   this.filterClass = 'filter-invisible';
  //   this.selectedFilter = '';
  //   this.isfilterapply = false;
  //   this.filterQuery = '';
  //   this.search();
  // }


  isDeleting: boolean = false;
  filterloading: boolean = false;

  loadFilters() {
    this.filterloading = true;

    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;


            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') {
                sessionStorage.removeItem('ID');
              }
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (element: any) =>
                    Number(element.ID) === Number(sessionStorage.getItem('ID'))
                );

                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA') {
                  this.applyfilter(this.savedFilters[0]);
                }
              }

              this.whichbutton = '';
              this.updateBtn = '';
            }
            // else if (this.whichbutton == 'SA') {
            //   this.applyfilter(this.savedFilters[0]);
            // }

            this.filterQuery = '';
          } else {
            this.filterloading = false;
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }


  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }



  deleteItem(item: any): void {

    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';

          this.loadFilters();


          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);
          }
          else {
            this.isfilterapply = true;
          }

        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }


  filterData: any;
  currentClientId = 1
  openfilter() {
    this.drawerTitle = 'Coupon Detailed Report Filter';

    this.drawerFilterVisible = true;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

    // Edit code 2

    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];

    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];




    this.filterGroups2 = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }


  whichbutton: any;
  updateButton: any;
  updateBtn: any;


  drawerfilterClose(buttontype, updateButton): void {

    this.drawerFilterVisible = false;
    this.loadFilters();

    this.whichbutton = buttontype;
    this.updateBtn = updateButton;

    if (buttontype == 'SA') {

      this.loadFilters();
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }


  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Customer Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Customer Name',
    },

    {
      key: 'MOBILE_NO',
      label: 'Mobile No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Mobile No.',
    },
    {
      key: 'EMAIL',
      label: 'Email',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Email',
    },
    {
      key: 'ORDER_NO',
      label: 'Order No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order No.',
    },
    {
      key: 'COUPON_CODE',
      label: 'Coupon Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Coupon Name',
    },
    {
      key: 'APPLIED_DATE_TIME',
      label: 'Used Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Used Date',
    },

    {
      key: 'COUPON_VALUE',
      label: 'Coupon Value',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Coupon Value',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  // isDeleting: boolean = false;

  // deleteItem(item: any): void {
  //   this.isDeleting = true;
  //   this.api.deleteFilterById(item.ID).subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         this.savedFilters = this.savedFilters.filter(
  //           (filter) => filter.ID !== item.ID
  //         );
  //         this.message.success('Filter deleted successfully.', '');
  //         this.isDeleting = false;
  //         this.isfilterapply = false;
  //         this.filterClass = 'filter-invisible';

  //         this.loadFilters();
  //         this.filterQuery = '';
  //         this.search(true);
  //       } else {
  //         this.message.error('Failed to delete filter.', '');
  //         this.isDeleting = false;
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.loadingRecords = false;
  //       if (err.status === 0) {
  //         this.message.error(
  //           'Unable to connect. Please check your internet or server connection and try again shortly.',
  //           ''
  //         );
  //       } else {
  //         this.message.error('Something Went Wrong.', '');
  //       }
  //     }
  //   );
  // }

  selectedFilter: string | null = null;
  // filterQuery = '';
  // filterQuery = '';
  applyfilter(item) {
    this.isfilterapply = true;
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  isModalVisible = false;
  selectedQuery: string = '';

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {

    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Customer Name'] = this.excelData[i]['NAME'];
        obj1['Mobile No.'] = this.excelData[i]['MOBILE_NO'];
        obj1['Email'] = this.excelData[i]['EMAIL'];
        obj1['Order No'] = this.excelData[i]['ORDER_NO'];
        obj1['Coupon Name'] = this.excelData[i]['COUPON_CODE'];
        // obj1['Used Date Time'] = this.excelData[i]['APPLIED_DATE_TIME'];
        obj1['Used Date Time'] = this.excelData[i]['APPLIED_DATE_TIME']
          ? this.datePipe.transform(
            this.excelData[i]['APPLIED_DATE_TIME'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Coupon Value'] = this.excelData[i]['COUPON_VALUE'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Coupon Detailed Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }


}