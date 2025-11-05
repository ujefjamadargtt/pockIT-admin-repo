import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";

@Component({
  selector: "app-technician-view-jobs",
  templateUrl: "./technician-view-jobs.component.html",
  styleUrls: ["./technician-view-jobs.component.css"],
})
export class TechnicianViewJobsComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  @Input() viewjobsdata: any;
  @Input() technicianId: any;

  sortValue: string = "desc";
  sortKey: string = "";
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = "";
  isSpinning = false;
  loadingRecords;
  columns: string[][] = [
    ["JOB_CREATED_DATE", "JOB_CREATED_DATE"],
    ["JOB_CARD_NO", "JOB_CARD_NO"],
    ["ORDER_NO", "ORDER_NO"],
    ["ASSIGNED_DATE", "ASSIGNED_DATE"],
    ["SCHEDULED_DATE_TIME", "SCHEDULED_DATE_TIME"],
    ["SERVICE_NAME", "SERVICE_NAME"],
    ["SERVICE_ADDRESS", "SERVICE_ADDRESS"],
    ["CUSTOMER_NAME", "CUSTOMER_NAME"],
    ["CUSTOMER_MOBILE_NUMBER", "CUSTOMER_MOBILE_NUMBER"],
  ];
  allSelected = false;
  tableIndeterminate: boolean = false;
  tableIndeterminate11: boolean = false;
  selectedPincode: any[] = [];
  city: any[] = [];
  state: any[] = [];
  filterQuery: string = "";
  totalRecords = 1;
  dataList: any = [];
  filterClass: string = "filter-invisible";

  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
      this.loadFilters();
    }
  }

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : "0";
    this.USER_ID = Number(decryptedUserId);


  }

  // filters
  JobCreatedDateVisible;
  isJobCreatedDateFilterApplied: boolean = false;
  JobCreatedDatetext: string = "";
  selectedJobCreatedDate: any;

  JobCardNoVisible;
  isJobCardNoFilterApplied: boolean = false;
  JobCardNotext: string = "";

  OrderNoVisible;
  isOrderNoFilterApplied: boolean = false;
  OrderNotext: string = "";

  AssignedDateVisible;
  isAssignedDateFilterApplied: boolean = false;
  AssignedDatetext: string = "";
  selectedAssignedDate: any;

  ScheduledDateVisible;
  isSchedulaedDateFilterApplied: boolean = false;
  ScheduledDatetext: string = "";
  selectedScheduledDate: any;

  ServiceNameVisible;
  isServiceNameFilterApplied: boolean = false;
  ServiceNametext: string = "";

  ServiceAddVisible;
  isServiceAddFilterApplied: boolean = false;
  ServiceAddtext: string = "";

  CustNameVisible;
  isCustNameFilterApplied: boolean = false;
  custNametext: string = "";

  CustMobVisible;
  isCustMobFilterApplied: boolean = false;
  custMobtext: string = "";

  CustTypeFilter: string | undefined = undefined;

  listofCustType: any[] = [
    { text: "Individiual", value: "I" },
    { text: "Business", value: "B" },
  ];

  onCustTypeFilterChange(selectedStatus: string) {
    this.CustTypeFilter = selectedStatus;
    this.search(true);
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || "id";
    const sortOrder = (currentSort && currentSort.value) || "desc";
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

  onDateRangeChange(): void {
    if (
      this.selectedJobCreatedDate &&
      this.selectedJobCreatedDate.length === 2
    ) {
      const [start, end] = this.selectedJobCreatedDate;
      if (start && end) {
        this.search();
        this.isJobCreatedDateFilterApplied = true;
      }
    } else {
      this.selectedJobCreatedDate = null; // or [] if you prefer
      this.search();
      this.isJobCreatedDateFilterApplied = false;
    }
  }

  onAssignedDateRangeChange(): void {
    if (this.selectedAssignedDate && this.selectedAssignedDate.length === 2) {
      const [start, end] = this.selectedAssignedDate;
      if (start && end) {
        this.search();
        this.isAssignedDateFilterApplied = true;
      }
    } else {
      this.selectedAssignedDate = null; // or [] if you prefer
      this.search();
      this.isAssignedDateFilterApplied = false;
    }
  }

  onScheduledDateRangeChange(): void {
    if (this.selectedScheduledDate && this.selectedScheduledDate.length === 2) {
      const [start, end] = this.selectedScheduledDate;
      if (start && end) {
        this.search();
        this.isSchedulaedDateFilterApplied = true;
      }
    } else {
      this.selectedScheduledDate = null; // or [] if you prefer
      this.search();
      this.isSchedulaedDateFilterApplied = false;
    }
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc";
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }

    var likeQuery = "";
    var globalSearchQuery = "";
    // Global Search (using searchText)
    if (this.searchText !== "") {
      globalSearchQuery =
        " AND (" +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(" OR ") +
        ")";
    }

    this.loadingRecords = true;

    //   if (this.selectedJobCreatedDate) {
    //   const selectedJobCreatedDate = this.datePipe.transform(this.selectedJobCreatedDate, 'yyyy-MM-dd HH:mm:00'); // Ensure the format is dd.MM.yyyy
    //   this.isJobCreatedDateFilterApplied = true;
    //   likeQuery += `${likeQuery ? ' AND ' : ''} JOB_CREATED_DATE = '${selectedJobCreatedDate}'`;
    // } else {
    //   this.isJobCreatedDateFilterApplied = false;
    // }

    if (this.selectedJobCreatedDate?.length === 2) {
      const [start, end] = this.selectedJobCreatedDate;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:00`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? " AND " : "") +
          `(JOB_CREATED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }

    if (this.JobCardNotext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `JOB_CARD_NO LIKE '%${this.JobCardNotext?.trim()}%'`;
      this.isJobCardNoFilterApplied = true;
    } else {
      this.isJobCardNoFilterApplied = false;
    }

    if (this.OrderNotext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `ORDER_NO LIKE '%${this.OrderNotext?.trim()}%'`;
      this.isOrderNoFilterApplied = true;
    } else {
      this.isOrderNoFilterApplied = false;
    }

    if (this.selectedAssignedDate?.length === 2) {
      const [start, end] = this.selectedAssignedDate;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:00`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? " AND " : "") +
          `(ASSIGNED_DATE BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }

    if (this.selectedScheduledDate?.length === 2) {
      const [start, end] = this.selectedScheduledDate;

      if (start && end) {
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:00`;

        const formattedStart = formatDate(new Date(start));
        const formattedEnd = formatDate(new Date(end));

        likeQuery +=
          (likeQuery ? " AND " : "") +
          `(SCHEDULED_DATE_TIME BETWEEN '${formattedStart}' AND '${formattedEnd}')`;
      }
    }

    if (this.ServiceNametext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `SERVICE_NAME LIKE '%${this.ServiceNametext?.trim()}%'`;
      this.isServiceNameFilterApplied = true;
    } else {
      this.isServiceNameFilterApplied = false;
    }

    if (this.ServiceAddtext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `SERVICE_ADDRESS LIKE '%${this.ServiceAddtext?.trim()}%'`;
      this.isServiceAddFilterApplied = true;
    } else {
      this.isServiceAddFilterApplied = false;
    }

    if (this.custNametext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `CUSTOMER_NAME LIKE '%${this.custNametext?.trim()}%'`;
      this.isCustNameFilterApplied = true;
    } else {
      this.isCustNameFilterApplied = false;
    }

    if (this.custMobtext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `CUSTOMER_MOBILE_NUMBER LIKE '%${this.custMobtext?.trim()}%'`;
      this.isCustMobFilterApplied = true;
    } else {
      this.isCustMobFilterApplied = false;
    }

    if (this.CustTypeFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `CUSTOMER_TYPE = '${this.CustTypeFilter}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");

    this.api
      .getpendinjobsdataa(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
        this.filterQuery +
        " AND TECHNICIAN_ID = " +
        this.technicianId
      )
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.loadingRecords = false;
            this.TabId = data["TAB_ID"];
            this.totalRecords = data["count"];
            this.dataList = data["data"];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
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
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error("Something Went Wrong.", "");
          }
        }
      );
  }

  userId = sessionStorage.getItem("userId"); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: number; // Ensure TabId is defined and initialized
  public commonFunction = new CommonFunctionService();
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  drawerTitle: string;
  isFilterApplied: boolean = false;

  filterloading: boolean = false;

  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        "",
        "",
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            this.filterQuery = "";

          } else {
            this.filterloading = false;
            this.message.error("Failed to load filters.", "");
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error("An error occurred while loading filters.", "");
        }
      );
    this.filterQuery = "";
  }

  deleteItem(item: any): void {

    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success("Filter deleted successfully.", "");
          this.filterloading = false;
          this.isfilterapply = false;
          this.filterClass = "filter-invisible";

          this.loadFilters();
          this.filterQuery = "";
          this.search(true);
        } else {
          this.message.error("Failed to delete filter.", "");
          this.filterloading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            "Unable to connect. Please check your internet or server connection and try again shortly.",
            ""
          );
        } else {
          this.message.error("Something Went Wrong.", "");
        }
      }
    );
  }
  Clearfilter() {
    this.filterClass = "filter-invisible";
    this.selectedFilter = "";
    this.isfilterapply = false;
    this.filterQuery = "";
    this.search();
  }
  selectedFilter: string | null = null;

  // filterQuery = '';
  applyfilter(item) {
    this.filterClass = "filter-invisible";
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = " AND (" + item.FILTER_QUERY + ")";
    this.search(true);
  }

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  applyCondition: any;
  openfilter() {
    this.drawerTitle = "View Jobs Filter";
    this.applyCondition = "";
    // this.filterFields[5]['options'] = this.VendorData;

    this.drawerFilterVisible = true;
  }

  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }

  drawerflterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: "JOB_CREATED_DATE",
      label: "Job Created Date",
      type: "date",
      comparators: ["=", "!=", ">", "<", ">=", "<="],
      placeholder: "Select Job Created Date",
    },
    {
      key: "JOB_CARD_NO",
      label: "Job Number",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Job Number",
    },

    {
      key: "ORDER_NO",
      label: "Order Number",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Order Number",
    },
    {
      key: "SCHEDULED_DATE_TIME",
      label: "Scheduled Date Time",
      type: "date",
      comparators: ["=", "!=", ">", "<", ">=", "<="],
      placeholder: "Select Scheduled Date",
    },

    {
      key: "ASSIGNED_DATE",
      label: "Assigned Date Time",
      type: "date",
      comparators: ["=", "!=", ">", "<", ">=", "<="],
      placeholder: "Select Assigned Date",
    },
    {
      key: "SERVICE_NAME",
      label: "Service Name",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Service Name",
    },
    {
      key: "SERVICE_ADDRESS",
      label: "Service Address",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Service Address",
    },
    {
      key: "CUSTOMER_NAME",
      label: "Customer Name",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Customer Name",
    },
    {
      key: "CUSTOMER_MOBILE_NUMBER",
      label: "Customer Mobile Number",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Customer Mobile Number",
    },
    {
      key: "CUSTOMER_TYPE",
      label: "Customer Type",
      type: "select",
      comparators: ["=", "!="],
      options: [
        { value: "I", display: "Individual" },
        { value: "B", display: "Business" },
      ],
      placeholder: "Select Customer Type",
    },
  ];

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === "Backspace") {
      this.search(true);
    }

    if (this.JobCreatedDatetext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (
      this.JobCreatedDatetext.length == 0 &&
      event.key === "Backspace"
    ) {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.JobCardNotext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.JobCardNotext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.OrderNotext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.OrderNotext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.OrderNotext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.OrderNotext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.ServiceNametext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ServiceNametext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.ServiceAddtext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.ServiceAddtext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.custNametext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.custNametext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }

    if (this.custMobtext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isFilterApplied = true;
    } else if (this.custMobtext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isFilterApplied = false;
    }
  }

  reset(): void {
    this.searchText = "";
    this.JobCreatedDatetext = "";
    this.JobCardNotext = "";
    this.OrderNotext = "";
    this.ServiceNametext = "";
    this.ServiceAddtext = "";
    this.custNametext = "";
    this.custMobtext = "";
    this.search();
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info("Please enter atleast 3 characters to search", "");
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = "";
  }
}